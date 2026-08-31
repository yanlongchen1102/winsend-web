(function () {
    document.addEventListener("click", function (event) {
        document.querySelectorAll("details.download-help[open]").forEach(function (details) {
            if (!details.contains(event.target)) details.removeAttribute("open");
        });
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            document.querySelectorAll("details.download-help[open]").forEach(function (details) {
                details.removeAttribute("open");
                details.querySelector("summary").focus();
            });
        }
    });
})();
