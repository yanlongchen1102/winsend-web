(function () {
    var APP_STORE_WEB_URL_GENERIC = "https://apps.apple.com/app/id6760611719";
    var APP_STORE_WEB_URL_CN = "https://apps.apple.com/cn/app/winsend-%E8%B7%A8%E5%B9%B3%E5%8F%B0%E6%96%87%E4%BB%B6%E7%9B%B8%E5%86%8C%E8%A7%86%E9%A2%91%E5%9B%BE%E7%89%87%E5%89%AA%E8%B4%B4%E6%9D%BF%E4%BC%A0%E8%BE%93%E5%8A%A9%E6%89%8B/id6760611719";
    var APP_STORE_APP_URL = "itms-apps://itunes.apple.com/app/id6760611719";

    function isMainlandChina() {
        try {
            var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
            if (/^Asia\/(Shanghai|Urumqi|Chongqing|Harbin|Kashgar)$/.test(timeZone)) {
                return true;
            }
        } catch (error) {}
        return (navigator.language || "") === "zh-CN";
    }

    function isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    var appStoreUrl = isMainlandChina() ? APP_STORE_WEB_URL_CN : APP_STORE_WEB_URL_GENERIC;
    document.querySelectorAll(".app-store-link").forEach(function (node) {
        node.href = appStoreUrl;
        node.addEventListener("click", function (event) {
            if (isIOS()) {
                event.preventDefault();
                window.location.href = APP_STORE_APP_URL;
            }
        });
    });

    fetch("/update.json")
        .then(function (response) {
            if (!response.ok) throw new Error("Failed to load update.json");
            return response.json();
        })
        .then(function (data) {
            var version = data.version || "1.0.0";
            var downloadUrl = data.url || ("/WinSend_v" + version + ".exe");
            document.querySelectorAll(".current-version-text").forEach(function (node) {
                node.textContent = version;
            });
            document.querySelectorAll(".download-link").forEach(function (node) {
                node.href = downloadUrl;
                node.dataset.installerVersion = version;
            });
        })
        .catch(function () {});
})();
