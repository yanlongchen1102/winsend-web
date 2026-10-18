// Optional HTTP smoke test against Wrangler's actual local assets runtime.
import assert from 'node:assert/strict';
import net from 'node:net';
import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { ROOT } from './build-site.mjs';
import { preparePreview } from './prepare-preview.mjs';

// Do not replace the snapshot watched by the user's existing preview.
const assets = preparePreview(ROOT, `preview-smoke-${process.pid}`);
const port = await new Promise((resolve, reject) => {
  const server = net.createServer();
  server.on('error', reject);
  server.listen(0, '127.0.0.1', () => {
    const value = server.address().port;
    server.close(() => resolve(value));
  });
});
const child = spawn(process.execPath, [path.join(ROOT, 'node_modules/wrangler/bin/wrangler.js'), 'dev', '--local', '--assets', assets, '--ip', '127.0.0.1', '--port', String(port)], {
  cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, WRANGLER_SEND_METRICS: 'false' },
});
let log = '';
child.stdout.on('data', data => { log += data; });
child.stderr.on('data', data => { log += data; });
let exited = false;
child.on('exit', () => { exited = true; });
child.on('error', error => { log += error.message; exited = true; });
const origin = `http://127.0.0.1:${port}`;
try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (exited) throw new Error(`Local preview exited before startup:\n${log}`);
    try {
      const response = await fetch(origin + '/', { signal: AbortSignal.timeout(500) });
      await response.body?.cancel();
      if (response.status === 200) { ready = true; break; }
    } catch { /* Retry while the local runtime starts. */ }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  assert.ok(ready, `Local preview did not become ready:\n${log}`);
  for (const pathname of ['/', '/zh/', '/en/guides/setup/', '/zh/download/', '/fr/', '/fr/fonctionnalites/', '/fr/guides/', '/fr/guides/presse-papiers-iphone-windows/', '/fr/telecharger/', '/fr/installation/', '/fr/securite/', '/fr/confidentialite/', '/fr/guides/transfert-iphone-pc/', '/de/', '/de/herunterladen/', '/de/anleitungen/iphone-fotos-auf-pc/', '/es/', '/es/descargar/', '/es/guias/pasar-fotos-iphone-a-pc/', '/assets/css/site.css', '/assets/css/marketing.css']) {
    const response = await fetch(origin + pathname, { redirect: 'manual', signal: AbortSignal.timeout(5000) });
    assert.equal(response.status, 200, pathname);
    const text = await response.text();
    if (pathname === '/') {
      assert.ok(text.includes('<html lang="en"'));
      assert.ok(text.includes('rel="canonical" href="https://winsend.app/"'));
      assert.ok(!text.includes('Choose your language'));
    }
  }
  for (const [pathname, location] of [['/en/', '/'], ['/en?utm_source=legacy', '/?utm_source=legacy']]) {
    const response = await fetch(origin + pathname, { redirect: 'manual', signal: AbortSignal.timeout(5000) });
    await response.body?.cancel();
    assert.equal(response.status, 301, pathname);
    assert.equal(response.headers.get('location'), location, pathname);
  }
  for (const pathname of ['/ja/', '/de/unknown-page/', '/fr/unknown-page/', '/en/missing-page/', '/site/config.json', '/site/content/en/home.body.html', '/scripts/build-site.mjs', '/tests/site.test.mjs', '/PRODUCT_FACTS.md', '/index_original_backup.html']) {
    const response = await fetch(origin + pathname, { redirect: 'manual', signal: AbortSignal.timeout(5000) });
    await response.body?.cancel();
    assert.equal(response.status, 404, pathname);
  }
  if (process.argv.includes('--visual')) {
    const { checkVisual } = await import('./check-visual.mjs');
    await checkVisual(origin);
  }
  console.log('PASS: local HTML/CSS 200; legacy English home 301; draft languages, unknown pages, source files and backup HTML 404; French pilot live locally');
} catch (error) {
  console.error(error.message);
  if (log) console.error(log.slice(-6000));
  process.exitCode = 1;
} finally {
  if (!exited) {
    if (process.platform === 'win32') spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
    else {
      child.kill('SIGTERM');
      await Promise.race([new Promise(resolve => child.once('exit', resolve)), new Promise(resolve => setTimeout(resolve, 3000))]);
    }
  }
  try { fs.rmSync(assets, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); }
  catch (error) { console.warn(`Temporary smoke snapshot cleanup: ${error.message}`); }
}
