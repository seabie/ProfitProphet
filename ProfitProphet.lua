-- Global namespace
ProfitProphet = ProfitProphet or {}

-- Slash command to initialize and toggle the window
SLASH_PROFITPROPHET1 = "/prophet"
SlashCmdList["PROFITPROPHET"] = function(msg)
    if not ProfitProphetWindow then
        -- Create the window frame
        local frame = CreateFrame("Frame", "ProfitProphetWindow", UIParent, "BasicFrameTemplateWithInset")
        frame:SetSize(200, 150) -- Increased height for progress bar
        frame:SetPoint("CENTER")
        frame:SetMovable(true)
        frame:EnableMouse(true)
        frame:RegisterForDrag("LeftButton")
        frame:SetScript("OnDragStart", frame.StartMoving)
        frame:SetScript("OnDragStop", frame.StopMovingOrSizing)

        -- Add title
        frame.title = frame:CreateFontString(nil, "OVERLAY", "GameFontHighlight")
        frame.title:SetPoint("TOP", frame, "TOP", 0, -5)
        frame.title:SetText("Profit Prophet")

        -- Create Search button
        local button = CreateFrame("Button", nil, frame, "UIPanelButtonTemplate")
        button:SetSize(80, 22)
        button:SetPoint("CENTER", frame, "CENTER", 0, 30)
        button:SetText("Search")
        button:SetScript("OnClick", function()
            -- Initialize AuctionSearch if not already done
            if not ProfitProphet.AuctionSearcher then
                ProfitProphet.AuctionSearcher = AuctionSearch:Create()
            end

            -- Example search queue
            local darkmoonAscension = {
                { itemID = 222681, itemName = "Ace of Ascension", quantity = 100 },
                { itemID = 222682, itemName = "Two of Ascension", quantity = 100 },
                { itemID = 222683, itemName = "Three of Ascension", quantity = 100 },
                { itemID = 222684, itemName = "Four of Ascension", quantity = 100 },
                { itemID = 222685, itemName = "Five of Ascension", quantity = 100 },
                { itemID = 222686, itemName = "Six of Ascension", quantity = 100 },
                { itemID = 222687, itemName = "Seven of Ascension", quantity = 100 },
                { itemID = 222688, itemName = "Eight of Ascension", quantity = 100 }
            }

            -- Show progress bar
            if not frame.progressBar then
                frame.progressBar = CreateFrame("StatusBar", nil, frame)
                frame.progressBar:SetSize(180, 20)
                frame.progressBar:SetPoint("CENTER", frame, "CENTER", 0, -10)
                frame.progressBar:SetStatusBarTexture("Interface\\TargetingFrame\\UI-StatusBar")
                frame.progressBar:SetMinMaxValues(0, 100)
                frame.progressBar:SetValue(0)
                frame.progressBar.text = frame.progressBar:CreateFontString(nil, "OVERLAY", "GameFontHighlight")
                frame.progressBar.text:SetPoint("CENTER", frame.progressBar)
                frame.progressBar.text:SetText("0%")
            end
            frame.progressBar:Show()

            -- Start searches with max retries, completion callback, and progress callback
            ProfitProphet.AuctionSearcher:StartSearches(darkmoonAscension, 20, function(results)
                print("Search complete! Average prices in gold (sorted by itemID):")
                for _, result in ipairs(results) do
                    if result.avgPrice then
                        print(string.format("%s (Item %d): %.2f gold/unit", result.itemName, result.itemID, result.avgPrice))
                    else
                        print(string.format("%s (Item %d): No price available", result.itemName, result.itemID))
                    end
                end
                frame.progressBar:Hide() -- Hide progress bar when done
            end, function(progress)
                -- Update progress bar
                frame.progressBar:SetValue(progress)
                frame.progressBar.text:SetText(string.format("%.0f%%", progress))
            end)
        end)

        ProfitProphetWindow = frame
        ProfitProphetWindow:Hide()
    end

    -- Toggle window visibility
    if ProfitProphetWindow:IsShown() then
        ProfitProphetWindow:Hide()
    else
        ProfitProphetWindow:Show()
    end
end