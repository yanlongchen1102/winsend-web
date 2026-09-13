(function () {
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var videos = Array.prototype.slice.call(document.querySelectorAll("video[data-smart-play]"));

    function loadVideo(video) {
        if (video.dataset.loaded === "true") return;
        Array.prototype.forEach.call(video.querySelectorAll("source[data-src]"), function (source) {
            source.src = source.dataset.src;
            source.removeAttribute("data-src");
        });
        video.load();
        video.dataset.loaded = "true";
    }

    if ("IntersectionObserver" in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                var video = entry.target;
                if (entry.isIntersecting) {
                    loadVideo(video);
                    if (!reduceMotion && video.dataset.autoplay === "true") {
                        video.play().catch(function () {});
                    }
                } else {
                    video.pause();
                }
            });
        }, { rootMargin: "240px 0px", threshold: 0.35 });

        videos.forEach(function (video) { observer.observe(video); });
    } else {
        videos.forEach(loadVideo);
    }

    var menus = Array.prototype.slice.call(document.querySelectorAll(".mobile-menu"));
    document.addEventListener("click", function (event) {
        menus.forEach(function (menu) {
            if (!menu.contains(event.target) || event.target.closest("a")) menu.open = false;
        });
    });
    document.addEventListener("keydown", function (event) {
        if (event.key !== "Escape") return;
        menus.forEach(function (menu) {
            if (menu.open) {
                menu.open = false;
                menu.querySelector("summary").focus();
            }
        });
    });

    var featureLinks = Array.prototype.slice.call(document.querySelectorAll(".feature-nav-link"));
    var sections = featureLinks.map(function (link) {
        return document.getElementById(link.hash.slice(1));
    });
    var navBar = document.querySelector(".feature-nav-bar");
    var scrollPending = false;
    function updateFeatureNav() {
        scrollPending = false;
        if (!sections.length) return;
        var threshold = navBar.getBoundingClientRect().bottom + 48;
        var active = 0;
        sections.forEach(function (section, index) {
            if (section && section.getBoundingClientRect().top <= threshold) active = index;
        });
        featureLinks.forEach(function (link, index) {
            if (index === active) {
                var changed = link.getAttribute("aria-current") !== "location";
                link.setAttribute("aria-current", "location");
                if (changed) {
                    var container = link.parentElement;
                    var bounds = container.getBoundingClientRect();
                    var item = link.getBoundingClientRect();
                    if (item.right > bounds.right) container.scrollLeft += item.right - bounds.right + 8;
                    else if (item.left < bounds.left) container.scrollLeft -= bounds.left - item.left + 8;
                }
            }
            else link.removeAttribute("aria-current");
        });
    }
    function scheduleFeatureNav() {
        if (scrollPending) return;
        scrollPending = true;
        window.requestAnimationFrame(updateFeatureNav);
    }
    if (featureLinks.length) {
        window.addEventListener("scroll", scheduleFeatureNav, { passive: true });
        window.addEventListener("resize", scheduleFeatureNav);
        window.addEventListener("hashchange", scheduleFeatureNav);
        window.addEventListener("pageshow", scheduleFeatureNav);
        updateFeatureNav();
    }

    var appStoreLinks = document.querySelectorAll(".app-store-link");
    var genericUrl = "https://apps.apple.com/app/id6760611719";
    var chinaUrl = "https://apps.apple.com/cn/app/id6760611719";
    var isChina = (navigator.language || "") === "zh-CN";

    try {
        isChina = isChina || /^Asia\/(Shanghai|Urumqi|Chongqing|Harbin|Kashgar)$/.test(
            Intl.DateTimeFormat().resolvedOptions().timeZone || ""
        );
    } catch (error) {}

    appStoreLinks.forEach(function (link) {
        link.href = isChina ? chinaUrl : genericUrl;
    });
    var motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    document.querySelectorAll(".rotating-word").forEach(function (button) {
        var words = button.dataset.words.split(",");
        var value = button.querySelector(".word-value");
        var measure = button.querySelector(".word-measure");
        var index = 0;
        var timer;
        var transitionTimer;
        function stop() {
            clearInterval(timer);
            clearTimeout(transitionTimer);
            button.classList.remove("is-changing");
            button.classList.remove("is-entering");
        }
        function setWidth(word) {
            measure.textContent = word;
            button.style.width = Math.ceil(measure.getBoundingClientRect().width) + "px";
        }
        function start() {
            stop();
            if (motionPreference.matches || document.hidden || button.getAttribute("aria-pressed") === "true") return;
            timer = setInterval(function () {
                button.classList.add("is-changing");
                transitionTimer = setTimeout(function () {
                    index = (index + 1) % words.length;
                    value.textContent = words[index];
                    button.dataset.index = index;
                    setWidth(words[index]);
                    button.classList.replace("is-changing", "is-entering");
                    requestAnimationFrame(function () {
                        requestAnimationFrame(function () {
                            button.classList.remove("is-entering");
                        });
                    });
                }, 180);
            }, 2600);
        }
        button.addEventListener("click", function () {
            button.setAttribute("aria-pressed", button.getAttribute("aria-pressed") === "true" ? "false" : "true");
            start();
        });
        document.addEventListener("visibilitychange", start);
        motionPreference.addEventListener("change", start);
        setWidth(words[index]);
        start();
    });
})();
