/*!
 * PostHog 分析接入（全站共享）
 * - 上报页面浏览（$pageview，SDK 默认）
 * - 上报下载按钮点击：web_download_click
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
        // 只保留页面浏览，关闭自动点击捕获，保持事件流干净
        autocapture: false
    });

    function pageLang() {
        var m = window.location.pathname.match(/^\/(zh|en)(\/|$)/);
        return m ? m[1] : "root";
    }

    function baseProps(href) {
        return {
            page: window.location.pathname,
            lang: pageLang(),
            href: href || ""
        };
    }

    // 事件委托：.download-link / .app-store-link 的 href 会被内联脚本异步改写，委托不受影响
    document.addEventListener("click", function (event) {
        var node = event.target && event.target.closest ? event.target.closest("a") : null;
        if (!node) {
            return;
        }
        if (node.classList.contains("download-link")) {
            posthog.capture("web_download_click", baseProps(node.getAttribute("href")));
        } else if (node.classList.contains("app-store-link")) {
            posthog.capture("web_appstore_click", baseProps(node.getAttribute("href")));
        }
    }, true);
})();
