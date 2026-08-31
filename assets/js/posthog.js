/*!
 * PostHog 分析接入（全站共享）
 * - 上报页面浏览（$pageview，SDK 默认）
 * - 上报站内 Windows 安装包点击：web_download_click（含版本与入口）
 * - 上报 App Store 按钮点击：web_appstore_click
 * 本地开发（localhost/127.0.0.1）不初始化，避免污染数据。
 */
!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

(function () {
    var host = window.location.host;
    if (host.indexOf("localhost") !== -1 || host.indexOf("127.0.0.1") !== -1) {
        return;
    }

    posthog.init("phc_tVf9dpejTEwX2W8MZ5JkBzKBKDCFqt9MJjuNyigDJhbG", {
        api_host: "https://us.i.posthog.com",
        defaults: "2026-05-30",
        // 页面浏览在注册来源参数后手动发送；关闭自动点击捕获，保持事件流干净。
        autocapture: false,
        capture_pageview: false
    });

    function pageLang() {
        var m = window.location.pathname.match(/^\/(zh|en)(\/|$)/);
        return m ? m[1] : "root";
    }

    function baseProps(href) {
        var query = new URLSearchParams(window.location.search);
        return {
            page: window.location.pathname,
            lang: pageLang(),
            href: href || "",
            acquisition_source: query.get("source") || "direct",
            distribution_channel: query.get("distribution_channel") || "unknown",
            acquisition_surface: query.get("surface") || "unknown",
            source_app_version: query.get("app_version") || "unknown"
        };
    }

    var landingProps = baseProps(window.location.href);
    posthog.register_for_session({
        acquisition_source: landingProps.acquisition_source,
        distribution_channel: landingProps.distribution_channel,
        acquisition_surface: landingProps.acquisition_surface,
        source_app_version: landingProps.source_app_version
    });
    posthog.capture("$pageview", landingProps);

    function installerVersion(node, href) {
        if (node.dataset.installerVersion) {
            return node.dataset.installerVersion;
        }
        var match = (href || "").match(/WinSend_v([0-9]+(?:\.[0-9]+)*)\.exe(?:$|[?#])/i);
        return match ? match[1] : "unknown";
    }

    // 不只依赖 CSS class：所有站内 .exe 链接均视为下载入口，避免教程页等新增入口漏报。
    function isWindowsInstallerLink(node, href) {
        if (node.classList.contains("download-link")) {
            return true;
        }
        try {
            var url = new URL(href, window.location.origin);
            return url.origin === window.location.origin && /\.exe$/i.test(url.pathname);
        } catch (error) {
            return false;
        }
    }

    document.addEventListener("click", function (event) {
        var node = event.target && event.target.closest ? event.target.closest("a") : null;
        if (!node) {
            return;
        }
        var href = node.getAttribute("href") || "";
        if (isWindowsInstallerLink(node, href)) {
            var props = baseProps(href);
            props.installer_version = installerVersion(node, href);
            props.download_surface = node.dataset.downloadSurface || "unknown";
            props.channel = "direct_exe";
            posthog.capture("web_download_click", props);
        } else if (node.classList.contains("store-installer-link")) {
            var storeProps = baseProps(href);
            storeProps.channel = "store_web_installer";
            storeProps.download_surface = node.dataset.downloadSurface || "unknown";
            posthog.capture("web_download_click", storeProps);
        } else if (node.classList.contains("app-store-link")) {
            var appStoreProps = baseProps(href);
            appStoreProps.download_surface = node.dataset.downloadSurface || "unknown";
            posthog.capture("web_appstore_click", appStoreProps);
        }
    }, true);
})();
