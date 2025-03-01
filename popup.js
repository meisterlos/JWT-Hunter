document.addEventListener("DOMContentLoaded", () => {
    // Popup açıldığında ikonu sıfırla
    chrome.runtime.sendMessage({ type: "popupOpened" });

    chrome.storage.session.get("foundKeys", data => {
        let resultsDiv = document.getElementById("results");

        if (data?.foundKeys?.length) {
            let tableHTML = `
                <table>
                    <tr>
                        <th>Site</th>
                        <th>Tür</th>
                        <th>Anahtar</th>
                        <th>İşlem</th>
                    </tr>
            `;

            data.foundKeys.forEach(entry => {
                tableHTML += `
                    <tr>
                        <td>${entry.site}</td>
                        <td>${entry.type}</td>
                        <td style="word-break: break-all;">${entry.key}</td>
                        <td>
                            <button onclick="copyToClipboard('${entry.key}')">📋</button>
                        </td>
                    </tr>
                `;
            });

            tableHTML += `</table>`;
            resultsDiv.innerHTML = tableHTML;
        } else {
            resultsDiv.innerHTML = "Henüz bir şey bulunamadı.";
        }
    });

    // JSON olarak indirme
    document.getElementById("download").addEventListener("click", () => {
        chrome.storage.session.get("foundKeys", data => {
            if (data?.foundKeys?.length) {
                let blob = new Blob([JSON.stringify(data.foundKeys, null, 2)], { type: "application/json" });
                let url = URL.createObjectURL(blob);
                let a = document.createElement("a");
                a.href = url;
                a.download = "found_keys.json";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                alert("Henüz kayıtlı veri yok.");
            }
        });
    });
});

// Geliştirilmiş Kopyalama Fonksiyonu
function copyToClipboard(text) {
    if (!navigator.clipboard) {
        alert("Tarayıcınız kopyalama özelliğini desteklemiyor!");
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        alert("🔑 Anahtar başarıyla kopyalandı!");
    }).catch(err => {
        console.error("❌ Kopyalama hatası:", err);
        alert("Kopyalama sırasında bir hata oluştu!");
    });
}
