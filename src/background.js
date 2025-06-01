chrome.contextMenus.create({
    id: 'keep-tabs-load',
    title: 'Load tabs',
    contexts: ['action']
});

chrome.contextMenus.create({
    id: 'keep-tabs-save',
    title: 'Save tabs',
    contexts: ['action']
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getUrls") {
        chrome.tabs.query({ currentWindow: true, highlighted: true }, (tabs) => {
            const tabUrls = tabs.map(t => t.url);
            chrome.runtime.sendMessage({
                action: "setUrls",
                urls: tabUrls
            });
        });
    }

    else if (request.action === "saveNamedSet") {
        const { name } = request;
        chrome.tabs.query({ currentWindow: true, highlighted: true }, (tabs) => {
            const tabUrls = tabs.map(t => t.url);
            chrome.storage.local.get("savedTabSets", (data) => {
                const sets = data.savedTabSets || {};
                sets[name] = tabUrls;
                chrome.storage.local.set({ savedTabSets: sets }, () => {
                    sendResponse({ success: true });
                });
            });
        });
        return true;
    }

    else if (request.action === "getSavedSets") {
        chrome.storage.local.get("savedTabSets", (data) => {
            sendResponse({ sets: data.savedTabSets || {} });
        });
        return true;
    }

    else if (request.action === "loadNamedSet") {
        const { name } = request;
        chrome.storage.local.get("savedTabSets", (data) => {
            const urlList = data.savedTabSets?.[name];
            if (urlList) {
                urlList.forEach(url => chrome.tabs.create({ url }));
                sendResponse({ success: true });
            } else {
                sendResponse({ success: false, error: "Set not found" });
            }
        });
        return true;
    }

    else if (request.action === "deleteNamedSet") {
        const { name } = request;
        chrome.storage.local.get("savedTabSets", (data) => {
            const sets = data.savedTabSets || {};
            delete sets[name];
            chrome.storage.local.set({ savedTabSets: sets }, () => {
                sendResponse({ success: true });
            });
        });
        return true;
    }
});
