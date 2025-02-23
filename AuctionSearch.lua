-- AuctionSearch module
AuctionSearch = {}

RETRY_TIMEOUT_SECS = 1

-- Constructor
function AuctionSearch:Create()
    local searcher = {}
    setmetatable(searcher, { __index = AuctionSearch })

    -- Instance variables
    searcher.searchQueue = {}        -- Queue of {itemID, itemName, quantity}
    searcher.totalItemCount = 0       -- Total items in the original search request
    searcher.searchResults = {}      -- Results as list of {itemID, itemName, avgPrice}
    searcher.isSearching = false     -- Flag to track if a search is in progress
    searcher.currentSearch = nil     -- Track the current search item
    searcher.searchTimer = nil       -- Timer for stuck queries
    searcher.retryCount = 0          -- Total retries across all searches
    searcher.maxRetries = 0          -- Max retries allowed
    searcher.callback = nil          -- Callback function to invoke when done
    searcher.progressCallback = nil  -- Callback function for progress updates

    -- Event handler frame
    searcher.eventFrame = CreateFrame("Frame")
    searcher.eventFrame:SetScript("OnEvent", function(self, event, ...)
        searcher:OnEvent(event, ...)
    end)
    searcher.eventFrame:RegisterEvent("COMMODITY_SEARCH_RESULTS_UPDATED")
    searcher.eventFrame:RegisterEvent("ITEM_SEARCH_RESULTS_UPDATED")

    return searcher
end

-- Start a series of searches
function AuctionSearch:StartSearches(queue, maxRetries, callback, progressCallback)
    self.searchQueue = queue or {}
    self.totalItemCount = #self.searchQueue
    self.searchResults = {}          -- Reset results to ensure no old data
    self.retryCount = 0
    self.maxRetries = maxRetries or 3 -- Default to 3 if not provided
    self.callback = callback
    self.progressCallback = progressCallback
    self:StartNextSearch()
end

-- Start the next search in the queue
function AuctionSearch:StartNextSearch()
    if self.isSearching then
        print("Search already in progress, skipping")
        return
    end

    if self.searchTimer then
        self.searchTimer:Cancel()
        self.searchTimer = nil
    end

    if #self.searchQueue > 0 then
        self.currentSearch = table.remove(self.searchQueue, 1)
        local itemKey = C_AuctionHouse.MakeItemKey(self.currentSearch.itemID)
        self.isSearching = true
        C_AuctionHouse.SendSearchQuery(itemKey, {}, false)

        -- Start a 5-second timer to detect stuck queries
        self.searchTimer = C_Timer.NewTimer(RETRY_TIMEOUT_SECS, function()
            self:HandleSearchTimeout(self.currentSearch)
        end)
    else
        print("All searches complete!")
        self:FinishSearches()
    end
end

-- Handle a timed-out search
function AuctionSearch:HandleSearchTimeout(item)
    self.isSearching = false
    if self.searchTimer then
        self.searchTimer:Cancel()
        self.searchTimer = nil
    end

    print("Search for", item.itemName, "(itemID:", item.itemID, ") timed out.")
    self.retryCount = self.retryCount + 1
    if self.retryCount < self.maxRetries then
        print("Retrying search for", item.itemName, "(itemID:", item.itemID, ") Retry count:", self.retryCount)
        table.insert(self.searchQueue, 1, item) -- Re-queue at the front
        self:StartNextSearch()
    else
        print("Max retries (" .. self.maxRetries .. ") reached. Aborting searches.")
        self:FinishSearches()
    end
end

-- Finish searches and invoke callback
function AuctionSearch:FinishSearches()
    -- Sort results by itemID
    table.sort(self.searchResults, function(a, b)
        return a.itemID < b.itemID
    end)

    -- Invoke callback with sorted results
    if self.callback then
        self.callback(self.searchResults)
    end
end

-- Event handler
function AuctionSearch:OnEvent(event, ...)
    if event == "COMMODITY_SEARCH_RESULTS_UPDATED" then
        self:CommoditySearchResultsUpdated(...)
    elseif event == "ITEM_SEARCH_RESULTS_UPDATED" then
        self:ItemSearchResultsUpdated(...)
    end
end

-- Handle commodity search results
function AuctionSearch:CommoditySearchResultsUpdated(itemID)
    -- Verify that the given itemID matches the current search.  I don't understand why, but sometimes the event is triggered
    -- for an item ID that we have previously used in a search.  When this happens, we want the search to timeout, so that
    -- we will try it again
    -- Note: nil check needed because these callbacks can keep coming after we finish searching (i.e. after the last item)
    if self.currentSearch == nil or itemID ~= self.currentSearch.itemID then
        print("ItemID does not match current search itemID, ignoring")
        return
    end

    --- We got a result, so cancel the timer to retry the search
    if self.searchTimer then
        self.searchTimer:Cancel()
        self.searchTimer = nil
    end

    local avgPriceInGold = self:CalculateAveragePriceByQuantity(itemID, self.currentSearch.quantity)
    -- Check for existing entry and update or add
    local found = false
    for i, result in ipairs(self.searchResults) do
        if result.itemID == itemID then
            -- Update existing entry (this handles retries or duplicates)
            self.searchResults[i] = {
                itemID = itemID,
                itemName = self.currentSearch.itemName,
                avgPrice = avgPriceInGold
            }
            found = true
            break
        end
    end
    if not found then
        -- Add new entry if not found
        table.insert(self.searchResults, {
            itemID = itemID,
            itemName = self.currentSearch.itemName,
            avgPrice = avgPriceInGold
        })
    end

    -- Update progress (total completed / total items)
    local totalItems = #self.searchQueue + (#self.searchResults - (found and 0 or 1)) -- Adjust for the current item
    local completed = #self.searchResults
    local progress = (completed / totalItems) * 100
    print(string.format("Search for %s (Item %d) complete. Progress: %.2f%%, totalItems: %d, completed: %d", self.currentSearch.itemName, itemID, progress, totalItems, completed))
    if self.progressCallback then
        self.progressCallback(progress)
    end

    self.isSearching = false
    self.currentSearch = nil
    self:StartNextSearch()
end

-- Handle item search results (non-commodity, if applicable)
function AuctionSearch:ItemSearchResultsUpdated(itemKey)
    if self.searchTimer then
        self.searchTimer:Cancel()
        self.searchTimer = nil
    end
    self.isSearching = false
    self.currentSearch = nil
    self:StartNextSearch()
end

-- Calculate average price in gold
function AuctionSearch:CalculateAveragePriceByQuantity(itemID, quantityLimit)
    local numResults = C_AuctionHouse.GetNumCommoditySearchResults(itemID)
    if not numResults or numResults == 0 then
        print("No auction results provided for itemID:", itemID)
        return nil
    end

    -- Fetch and sort results by unitPrice
    local results = {}
    for i = 1, numResults do
        local result = C_AuctionHouse.GetCommoditySearchResultInfo(itemID, i)
        table.insert(results, {
            quantity = result.quantity,
            unitPrice = result.unitPrice
        })
    end
    table.sort(results, function(a, b)
        return a.unitPrice < b.unitPrice
    end)

    local totalCost = 0
    local totalQuantity = 0

    for _, result in ipairs(results) do
        if totalQuantity >= quantityLimit then
            break
        end
        local quantityToUse = math.min(result.quantity, quantityLimit - totalQuantity)
        totalCost = totalCost + (quantityToUse * result.unitPrice)
        totalQuantity = totalQuantity + quantityToUse
    end

    if totalQuantity < quantityLimit then
        print(string.format("Warning: Only %d units available, less than requested %d.", totalQuantity, quantityLimit))
    end

    if totalQuantity > 0 then
        -- Convert copper to gold (1 gold = 10000 copper)
        return totalCost / totalQuantity / 10000
    else
        print("No units available to calculate average price for itemID:", itemID)
        return nil
    end
end