chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "foundKeys") {
        chrome.storage.session.set({ foundKeys: message.data });

        // 🔴 Eğer güvenlik açığı bulunduysa kırmızı ikonu göster
        if (message.data.length > 0) {
            chrome.action.setIcon({ path: "icon_alert.png" });
        }
    }
});

// Popup açıldığında tekrar eski ikona döndür
chrome.runtime.onStartup.addListener(() => {
    chrome.action.setIcon({ path: "icon.png" });
});

// Popup açıldığında ikon resetlenmeli
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "popupOpened") {
        chrome.action.setIcon({ path: "icon.png" });
    }
});
