// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    // If vk.com page then ...
    if (tab.url.indexOf('vk.com') > -1 || tab.url.indexOf('vkontakte.ru') > -1) {
        // ... show app icon.
        chrome.pageAction.show(tabId);
    }
});

// On extension's icon click run parser and generate links
chrome.pageAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript(null, {file: "impl.js"});
});
