// Recupera gli URL delle tab e li mostra nel popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "setUrls") {
      const urls = request.urls;
      document.getElementById("tabs-urls").textContent = urls.join("\n");
    }
});
  
// Gestisci il click del pulsante "Copia"
document.getElementById("copy-btn").addEventListener("click", () => {
    const urlsText = document.getElementById("tabs-urls").textContent;
    if (urlsText) {
      navigator.clipboard.writeText(urlsText)
        .then(() => {
          alert('Gli URL sono stati copiati nella clipboard!');
        })
        .catch(err => {
          console.error('Errore nella copia:', err);
        });
    } else {
      alert("Non ci sono URL da copiare.");
    }
});

chrome.runtime.sendMessage({
    action: "getUrls",
});