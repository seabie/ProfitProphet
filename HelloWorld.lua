-- Create a frame to listen for events
local frame = CreateFrame("Frame")

-- Register the ADDON_LOADED event
frame:RegisterEvent("ADDON_LOADED")

-- Event handler function
frame:SetScript("OnEvent", function(self, event, arg1)
    if event == "ADDON_LOADED" and arg1 == "HelloWorld" then
        -- Print "Hello, World!" to the default chat frame
        DEFAULT_CHAT_FRAME:AddMessage("Hello, World!")
    end
end)