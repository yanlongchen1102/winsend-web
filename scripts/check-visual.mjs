// Real Chromium layout checks and screenshots; no additional npm dependency.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { ROOT } from './build-site.mjs';

export async function checkVisual(origin) {
  const executable = [process.env.WINSEND_BROWSER, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/usr/bin/chromium', '/usr/bin/google-chrome'].find(file => file && fs.existsSync(file));
  if (!executable) throw new Error('Chromium not found; set WINSEND_BROWSER to its executable');
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'winsend-browser-'));
  const screenshots = path.join(ROOT, '.wrangler/visual-check');
  fs.mkdirSync(screenshots, { recursive: true });
  const browser = spawn(executable, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
  let socket;
  try {
    const portFile = path.join(profile, 'DevToolsActivePort');
    for (let i = 0; !fs.existsSync(portFile) && i < 100; i++) await new Promise(resolve => setTimeout(resolve, 100));
    if (!fs.existsSync(portFile)) throw new Error('Chromium did not start');
    const port = fs.readFileSync(portFile, 'utf8').split('\n')[0];
    const pages = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    socket = new WebSocket(pages.find(page => page.type === 'page').webSocketDebuggerUrl);
    await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
    let id = 0;
    const pending = new Map();
    socket.onmessage = event => {
      const message = JSON.parse(event.data);
      if (!message.id) return;
      const promise = pending.get(message.id);
      if (!promise) return;
      pending.delete(message.id);
      if (message.error) promise.reject(new Error(message.error.message)); else promise.resolve(message.result);
    };
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const key = ++id;
      const timer = setTimeout(() => { pending.delete(key); reject(new Error(`CDP timeout: ${method}`)); }, 15000);
      pending.set(key, { resolve: value => { clearTimeout(timer); resolve(value); }, reject: error => { clearTimeout(timer); reject(error); } });
      socket.send(JSON.stringify({ id: key, method, params }));
    });
    await send('Page.enable');
    await send('Network.enable');
    await send('Network.setBlockedURLs', { urls: ['*://*.posthog.com/*', '*://*.posthog-static.com/*'] });
    const routes = ['/', '/en/features/', '/en/guides/', '/en/download/', '/zh/', '/zh/features/', '/zh/guides/', '/zh/download/', '/fr/', '/fr/fonctionnalites/', '/fr/guides/', '/fr/telecharger/', '/fr/installation/', '/fr/securite/', '/fr/confidentialite/', '/fr/guides/transfert-iphone-pc/', '/fr/guides/presse-papiers-iphone-windows/'];
    const report = [];
    for (const [mode, width, height] of [['desktop', 1366, 900], ['mobile', 390, 844]]) {
      await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: mode === 'mobile' });
      for (const route of routes) {
        await send('Page.navigate', { url: origin + route });
        await new Promise(resolve => setTimeout(resolve, 1000));
        const evaluated = await send('Runtime.evaluate', { expression: `(() => { const headings = [...document.querySelectorAll('h1')]; const nav = document.querySelector('.site-nav'); return { path: location.pathname, h1: headings.length, heading: headings[0]?.textContent.trim(), overflow: document.documentElement.scrollWidth > innerWidth + 1, nav: !!nav, main: document.querySelectorAll('main').length, images: [...document.querySelectorAll('img')].filter(i => i.complete && !i.naturalWidth).map(i => i.src), sections: [...document.querySelectorAll('main > section')].map(s => s.className) }; })()`, returnByValue: true });
        const result = evaluated.result.value;
        if (!result || result.path !== route || result.h1 !== 1 || result.main !== 1 || result.overflow || !result.nav || result.images.length) throw new Error(`${mode} ${route}: ${JSON.stringify(result)}`);
        const metrics = await send('Page.getLayoutMetrics');
        const image = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width, height: Math.ceil(metrics.cssContentSize.height), scale: 1 } });
        const filename = `${mode}-${route.replaceAll('/', '-').replace(/^-|-$/g, '')}.png`;
        fs.writeFileSync(path.join(screenshots, filename), Buffer.from(image.data, 'base64'));
        report.push({ mode, route, ...result });
      }
    }
    fs.writeFileSync(path.join(screenshots, 'report.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(`PASS: ${report.length} real-browser desktop/mobile pages; screenshots: ${screenshots}`);
  } finally {
    socket?.close();
    if (process.platform === 'win32') spawnSync('taskkill', ['/PID', String(browser.pid), '/T', '/F'], { stdio: 'ignore' });
    else browser.kill('SIGTERM');
    try { fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }); } catch { /* OS cleanup may lag. */ }
  }
}
