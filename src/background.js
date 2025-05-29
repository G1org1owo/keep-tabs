var selected_tabs = []
var selected_window = 0

chrome.tabs.onHighlighted.addListener(highlightInfo => {
    selected_tabs = highlightInfo.tabIds
    selected_window = highlightInfo.windowId
})

chrome.contextMenus.create({
    id: 'keep-tabs-load',
    title: 'Load tabs',
    contexts: ['action']
})

chrome.contextMenus.create({
    id: 'keep-tabs-save',
    title: 'Save tabs',
    contexts: ['action']
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getUrls") {
        chrome.tabs.query({ currentWindow: true, highlighted: true }, (tabs) => {
            const tabUrls = tabs.map(t => t.url);
            chrome.runtime.sendMessage({
                action: "setUrls",
                urls: tabUrls
            });
        })
    }
});
