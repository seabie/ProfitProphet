-- Global namespace
ProfitProphet = ProfitProphet or {}

-- Slash command to initialize and toggle the window
SLASH_PROFITPROPHET1 = "/prophet"
SlashCmdList["PROFITPROPHET"] = function(msg)
    if not ProfitProphetWindow then
        CreateProfitProphetWindow()
    end
    if ProfitProphetWindow:IsShown() then
        ProfitProphetWindow:Hide()
    else
        ProfitProphetWindow:Show()
    end
end

local function ParseJSON(jsonString)
    return json.decode(jsonString)
end

-- Convert Lua table to JSON (basic implementation for this format)
local function ToJSON(data)
    return json.encode(data)
end

-- Create the Profit Prophet window with input and output text areas
function CreateProfitProphetWindow()
    local frame = CreateFrame("Frame", "ProfitProphetWindow", UIParent, "BasicFrameTemplateWithInset")
    frame:SetSize(400, 320) -- Slightly larger to accommodate labels
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

    -- Input Label
    local inputLabel = frame:CreateFontString(nil, "OVERLAY", "GameFontHighlight")
    inputLabel:SetPoint("TOPLEFT", frame, "TOPLEFT", 15, -20)
    inputLabel:SetText("Input JSON")

    -- Input Text Area (for JSON input)
    local inputScroll = CreateFrame("ScrollFrame", "ProfitProphetInputScroll", frame, "UIPanelScrollFrameTemplate")
    inputScroll:SetSize(380, 100)
    inputScroll:SetPoint("TOPLEFT", inputLabel, "BOTTOMLEFT", 0, -5)

    local inputEditBox = CreateFrame("EditBox", nil, inputScroll)
    inputEditBox:SetSize(380, 100)
    inputEditBox:SetFontObject("ChatFontNormal")
    inputEditBox:SetMultiLine(true)
    inputEditBox:SetAutoFocus(false)
    inputEditBox:Enable() -- Ensure the input is enabled and writable
    inputEditBox:SetMaxLetters(0) -- Allow unlimited text length
    inputEditBox:SetTextInsets(5, 5, 5, 5) -- Add padding for better visibility
    inputEditBox:SetScript("OnTextChanged", function(self, userInput)
        if userInput then
            local input = self:GetText()
            local parsedData = ParseJSON(input)
            if parsedData and #parsedData > 0 then
                frame.searchData = parsedData -- Store parsed data for searching
                if frame.searchButton then
                    frame.searchButton:Enable()
                end
            else
                frame.searchData = nil
                if frame.searchButton then
                    frame.searchButton:Disable()
                end
            end
        end
    end)
    inputEditBox:SetScript("OnEscapePressed", function(self) self:ClearFocus() end)

    inputScroll:SetScrollChild(inputEditBox)

    -- Output Label
    local outputLabel = frame:CreateFontString(nil, "OVERLAY", "GameFontHighlight")
    outputLabel:SetPoint("TOPLEFT", inputScroll, "BOTTOMLEFT", 0, -10)
    outputLabel:SetText("Output JSON")

    -- Output Text Area (for JSON output)
    local outputScroll = CreateFrame("ScrollFrame", "ProfitProphetOutputScroll", frame, "UIPanelScrollFrameTemplate")
    outputScroll:SetSize(380, 100)
    outputScroll:SetPoint("TOPLEFT", outputLabel, "BOTTOMLEFT", 0, -5)

    local outputEditBox = CreateFrame("EditBox", nil, outputScroll)
    outputEditBox:SetSize(380, 100)
    outputEditBox:SetFontObject("ChatFontNormal")
    outputEditBox:SetMultiLine(true)
    outputEditBox:SetAutoFocus(false)
    outputEditBox:EnableMouse(true)
    outputEditBox:SetMaxLetters(0) -- Allow unlimited text length
    outputEditBox:SetTextInsets(5, 5, 5, 5) -- Add padding for better visibility
    outputEditBox:SetScript("OnEscapePressed", function(self) self:ClearFocus() end)
    outputEditBox:SetScript("OnMouseUp", function(self, button)
        if button == "LeftButton" and IsShiftKeyDown() then
            self:HighlightText()
        end
    end)

    outputScroll:SetScrollChild(outputEditBox)

    -- Search Button
    local searchButton = CreateFrame("Button", nil, frame, "UIPanelButtonTemplate")
    searchButton:SetSize(80, 22)
    searchButton:SetPoint("BOTTOM", frame, "BOTTOM", 0, 10)
    searchButton:SetText("Search")
    searchButton:Disable() -- Disabled until valid input is provided
    searchButton:SetScript("OnClick", function()
        if frame.searchData then
            if not ProfitProphet.AuctionSearcher then
                ProfitProphet.AuctionSearcher = AuctionSearch:Create()
            end

            if not frame.progressBar then
                frame.progressBar = CreateFrame("StatusBar", nil, frame)
                frame.progressBar:SetSize(180, 20)
                frame.progressBar:SetPoint("BOTTOM", searchButton, "TOP", 0, 10)
                frame.progressBar:SetStatusBarTexture("Interface\\TargetingFrame\\UI-StatusBar")
                frame.progressBar:SetMinMaxValues(0, 100)
                frame.progressBar:SetValue(0)
                frame.progressBar.text = frame.progressBar:CreateFontString(nil, "OVERLAY", "GameFontHighlight")
                frame.progressBar.text:SetPoint("CENTER", frame.progressBar)
                frame.progressBar.text:SetText("0%")
            end
            frame.progressBar:Show()

            ProfitProphet.AuctionSearcher:StartSearches(frame.searchData, 20, function(results)
                -- Generate JSON output
                local jsonOutput = ToJSON(results)
                outputEditBox:SetText(jsonOutput)
                frame.progressBar:Hide()
            end, function(progress)
                frame.progressBar:SetValue(progress)
                frame.progressBar.text:SetText(string.format("%.0f%%", progress))
            end)
        end
    end)
    frame.searchButton = searchButton

    ProfitProphetWindow = frame
    ProfitProphetWindow:Hide()
end