function refreshSavedSets() {
    const list = document.getElementById("sets-list");
    list.innerHTML = "";

    chrome.runtime.sendMessage({ action: "getSavedSets" }, (response) => {
        const sets = response.sets || {};

        if (Object.keys(sets).length === 0) {
            list.innerHTML = "<p style='text-align:center; color:#888;'>Nessun set salvato</p>";
            return;
        }

        for (const name in sets) {
            const item = document.createElement("div");
            item.className = "set-item";

            const title = document.createElement("div");
            title.className = "set-name";
            title.textContent = name;

            const actions = document.createElement("div");
            actions.className = "set-actions";

            const loadBtn = document.createElement("button");
            loadBtn.textContent = "Load";
            loadBtn.addEventListener("click", () => {
                chrome.runtime.sendMessage({ action: "loadNamedSet", name });
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.className = "delete";
            deleteBtn.addEventListener("click", () => {
                if (confirm(`Delete the set "${name}"?`)) {
                    chrome.runtime.sendMessage({ action: "deleteNamedSet", name }, () => {
                        refreshSavedSets();
                    });
                }
            });

            actions.appendChild(loadBtn);
            actions.appendChild(deleteBtn);

            item.appendChild(title);
            item.appendChild(actions);
            list.appendChild(item);
        }
    });
}

document.getElementById("copy-btn").addEventListener("click", () => {
    const text = document.getElementById("tabs-urls").value;
    if (text) {
        navigator.clipboard.writeText(text).catch(err => console.error("Copy error:", err));
    }
});

document.getElementById("save-named-btn").addEventListener("click", () => {
    const name = prompt("Enter a name for the new tab set:");
    if (name) {
        chrome.runtime.sendMessage({ action: "saveNamedSet", name }, () => {
            refreshSavedSets();
        });
    }
});

chrome.runtime.sendMessage({ action: "getUrls" });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "setUrls") {
        document.getElementById("tabs-urls").value = request.urls.join("\n");
    }
});

refreshSavedSets();