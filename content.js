// API Anahtarları için gelişmiş regex listesi
const apiKeyPatterns = {
    "Google API": /AIza[0-9A-Za-z-_]{35}/g,
    "AWS Access Key": /AKIA[0-9A-Z]{16}/g,
    "GitHub Token": /ghp_[0-9a-zA-Z]{36}/g,
    "Slack Token": /xox[baprs]-([0-9a-zA-Z]{10,48})/g,
    "Stripe API Key": /sk_live_[0-9a-zA-Z]{24}/g,
    "Twilio API Key": /SK[0-9a-fA-F]{32}/g
};

// JWT Token regex
const jwtPattern = /eyJ[a-zA-Z0-9_-]+?\.[a-zA-Z0-9_-]+?\.[a-zA-Z0-9_-]+/g;

// 🔹 **Tüm Sayfa İçeriğini Al (fetch ile)**
fetch(document.URL)
    .then(response => response.text())
    .then(htmlContent => {
        let foundKeys = [];

        // **Yanlış Pozitifleri Azaltmak İçin Ön Filtre**
        if (!/API_KEY|token|secret|ghp_|sk_live_|AKIA|AIza|xox[baprs]-|eyJ/i.test(htmlContent)) {
            console.log("✅ Sayfa güvenli görünüyor, tarama yapılmadı.");
            return;
        }

        // **API Anahtarlarını ve JWT Tokenlerini Tespit Et**
        for (let keyType in apiKeyPatterns) {
            let matches = [...htmlContent.matchAll(apiKeyPatterns[keyType])];
            matches.forEach(match => {
                foundKeys.push({
                    type: keyType,
                    key: match[0],
                    site: window.location.hostname
                });
            });
        }

        // **JWT Tokenleri Tespit Et**
        let jwtMatches = [...htmlContent.matchAll(jwtPattern)];
        jwtMatches.forEach(match => {
            foundKeys.push({
                type: "JWT Token",
                key: match[0],
                site: window.location.hostname
            });
        });

        // **Sonuçları Göster ve Storage'a Kaydet**
        if (foundKeys.length > 0) {
            console.log("🛑 Güvenlik Açığı Tespit Edildi!", foundKeys);

            // Arka plana mesaj gönder
            chrome.runtime.sendMessage({ type: "foundKeys", data: foundKeys });
        }
    })
    .catch(error => console.error("⚠️ Sayfa içeriği alınamadı:", error));
