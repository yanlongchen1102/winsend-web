import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { ROOT, buildSite, generateSite, loadSite, render } from '../scripts/build-site.mjs';
import { preparePreview } from '../scripts/prepare-preview.mjs';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'winsend-site-'));
  fs.cpSync(path.join(ROOT, 'site'), path.join(root, 'site'), { recursive: true });
  // Infrastructure tests start with en/zh; French is added explicitly where needed.
  const config = json(root, 'site/config.json');
  config.locales.find(locale => locale.code === 'fr').status = 'draft';
  putJSON(root, 'site/config.json', config);
  fs.rmSync(path.join(root, 'site/content/fr'), { recursive: true, force: true });
  // No prior generated outputs in an isolated fixture.
  fs.rmSync(path.join(root, 'site/generated.json'), { force: true });
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}
function json(root, file) { return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8')); }
function putJSON(root, file, data) { fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true }); fs.writeFileSync(path.join(root, file), JSON.stringify(data, null, 2) + '\n'); }
function edit(root, file, old, replacement) {
  const full = path.join(root, file);
  const text = fs.readFileSync(full, 'utf8');
  assert.ok(text.includes(old), `Fixture text not found: ${old}`);
  fs.writeFileSync(full, text.replace(old, replacement));
}
function addFrench(root) {
  const config = json(root, 'site/config.json');
  config.locales.find(locale => locale.code === 'fr').status = 'published';
  putJSON(root, 'site/config.json', config);
  const ui = json(root, 'site/content/en/shared.json');
  // Fixture strings only; not real French content or a published translation.
  putJSON(root, 'site/content/fr/shared.json', ui);
  const paths = { home: '/fr/', features: '/fr/features/', guides: '/fr/guides/', download: '/fr/telecharger/', setup: '/fr/installation/', privacy: '/fr/confidentialite/', safety: '/fr/securite/' };
  const pages = {};
  for (const [id, route] of Object.entries(paths)) {
    pages[id] = { status: 'published', path: route, title: `Fixture ${id}`, description: 'Fixture description', lastmod: '2026-10-08' };
    fs.writeFileSync(path.join(root, `site/content/fr/${id}.head.html`), '');
    fs.writeFileSync(path.join(root, `site/content/fr/${id}.body.html`), '<main><h1>{{title}}</h1><a href="{{links.download}}">Download fixture</a>{{{productScope}}}</main>');
  }
  putJSON(root, 'site/content/fr/pages.json', pages);
}

test('real content renders 37 pages with published locales only, no placeholders or redirects', () => {
  const { site, outputs } = generateSite();
  assert.equal(site.pages.length, 37);
  assert.equal(outputs.size, 38); // 37 pages (including the root English home) + sitemap
  const root = outputs.get('index.html');
  assert.ok(root.includes('<html lang="en"'));
  assert.ok(root.includes('rel="canonical" href="https://winsend.app/"'));
  assert.ok(root.includes('href="/zh/"') && root.includes('href="/fr/"'));
  for (const code of ['ja', 'de', 'es']) {
    assert.ok(!root.includes(`href="/${code}/"`));
    assert.ok(!outputs.get('sitemap.xml').includes(`https://winsend.app/${code}/`));
    assert.ok(![...outputs.keys()].some(file => file.startsWith(`${code}/`)));
  }
  assert.ok(!root.includes('location.href') && !root.includes('http-equiv="refresh"'));
  assert.ok(root.includes('hreflang="x-default" href="https://winsend.app/"'));
  for (const [name, output] of outputs) {
    assert.ok(!output.includes('{{'), name);
    if (name.endsWith('.html') && name !== 'index.html') {
      assert.ok(output.includes('class="site-nav'), name);
      assert.ok(output.includes('class="site-footer"'), name);
    }
  }
});

test('French edition shares core layouts and navigation, localized navigation and equivalent hreflang', () => {
  const { site, outputs } = generateSite();
  assert.equal(site.pages.filter(page => page.locale.code === 'fr').length, 9);
  for (const locale of ['en', 'zh', 'fr']) for (const id of ['home', 'features', 'guides', 'download']) {
    assert.equal(site.pages.find(page => page.locale.code === locale && page.id === id).layout, id);
  }
  assert.equal(site.faqs.fr.home.length, 8);
  assert.equal(site.faqs.fr['airdrop-for-windows'].length, 7);
  for (const topic of ['Internet', 'gratuit', 'réseaux', 'cloud', 'sûr', 'détecte']) assert.ok(site.faqs.fr.home.some(item => item.question.includes(topic)), topic);
  for (const topic of ['USB', 'Wi-Fi', 'formats', 'qualité', 'volumineuse', 'iCloud']) assert.ok(site.faqs.fr['airdrop-for-windows'].some(item => item.question.includes(topic)), topic);
  const guide = outputs.get('fr/guides/transfert-iphone-pc/index.html');
  assert.ok(guide.includes('lang="fr"'));
  assert.ok(guide.includes('href="/fr/installation/"'));
  assert.ok(guide.includes('hreflang="en" href="https://winsend.app/en/guides/airdrop-for-windows/"'));
  assert.ok(outputs.get('en/guides/copy-iphone-to-windows/index.html').includes('hreflang="fr"'));
  assert.ok(outputs.get('fr/securite/index.html').includes('HTTP/WebSocket'));
  assert.ok(outputs.get('fr/confidentialite/index.html').includes('PostHog'));
  const download = outputs.get('fr/telecharger/index.html');
  assert.match(download, /class="[^"]*\bstore-installer-link\b/);
  assert.match(download, /class="[^"]*\bapp-store-link\b/);
  const home = outputs.get('fr/index.html');
  assert.ok(home.includes('hero-bg home-hero'));
  assert.ok(home.includes('gradient-text hero-title-line'));
  assert.ok(home.includes('video-stage'));
  assert.ok(home.includes('home_hero'));
  const enHome = outputs.get('index.html');
  assert.deepEqual([...home.matchAll(/<section\b[^>]*>/g)].map(match => match[0]), [...enHome.matchAll(/<section\b[^>]*>/g)].map(match => match[0]));
  assert.equal((home.match(/class="feature-preview /g) || []).length, 3);
  assert.ok(home.includes('class="cloud-section"'));
  const features = outputs.get('fr/fonctionnalites/index.html');
  for (const id of ['file-transfer', 'windows-to-iphone', 'iphone-to-windows', 'cloud-clipboard']) assert.ok(features.includes(`id="${id}"`));
  assert.equal((features.match(/<video /g) || []).length, 4);
  assert.ok(home.includes('href="/fr/fonctionnalites/"'));
  assert.ok(home.includes('<meta property="og:locale" content="fr_FR">'));
  assert.ok(home.includes('href="/fr/guides/"'));
  assert.ok(outputs.get('fr/guides/index.html').includes('href="/fr/guides/transfert-iphone-pc/"'));
  assert.ok(home.includes('site-nav--fixed'));
  for (const [file, output] of outputs) if (file.startsWith('fr/')) {
    assert.ok(output.includes('/assets/css/marketing.css') || (file === 'fr/telecharger/index.html' && output.includes('.download-card')), file);
    assert.ok(!output.includes('localized.css') && !output.includes('localized-content'), file);
  }
  assert.ok(outputs.get('fr/installation/index.html').includes('hero-bg px-6 pt-32 pb-14'));
  assert.ok(download.includes('data-download-surface="download_page"'));
});

test('French source copy uses non-breaking spaces before double punctuation', () => {
  const dir = path.join(ROOT, 'site/content/fr');
  for (const name of fs.readdirSync(dir)) {
    if (name.endsWith('.head.html')) continue;
    const text = fs.readFileSync(path.join(dir, name), 'utf8');
    const bad = text.match(/.{0,30} [:;?!»](?![\w/]).{0,10}|«(?![\u00a0\u202f])/u);
    assert.equal(bad, null, `${name}: ${bad && bad[0]}`);
  }
});

test('custom locale navigation rejects links to unpublished pages', t => {
  const root = fixture(t);
  addFrench(root);
  const ui = json(root, 'site/content/fr/shared.json');
  ui.navigationPages = ['features', 'download'];
  putJSON(root, 'site/content/fr/shared.json', ui);
  assert.throws(() => generateSite(root), /invalid navigationPages/);
});

test('existing URLs and relative screenshot paths remain unchanged', () => {
  const { outputs } = generateSite();
  for (const locale of ['en', 'zh']) {
    assert.ok(outputs.has(`${locale}/guides/copy-iphone-to-windows/index.html`));
    assert.ok(outputs.has(`${locale}/comparison/winsend-vs-localsend/index.html`));
    assert.ok(outputs.get(`${locale}/guides/cross-platform-transfer-tools/index.html`).includes('src="images/winsend-screenshot-1.png"'));
    assert.ok(outputs.get(`${locale}/download/index.html`).includes('site-nav--flow'));
    assert.ok(outputs.get(locale === 'en' ? 'index.html' : `${locale}/index.html`).includes('site-nav--fixed'));
  }
});

test('build is deterministic and check mode detects stale outputs without writing', t => {
  const root = fixture(t);
  buildSite({ root });
  assert.deepEqual(buildSite({ root }).changes, []);
  assert.deepEqual(buildSite({ root, check: true }).changes, []);
  const before = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const pages = json(root, 'site/content/en/pages.json');
  pages.home.title = 'Updated source title';
  putJSON(root, 'site/content/en/pages.json', pages);
  assert.throws(() => buildSite({ root, check: true }), /stale/);
  assert.equal(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), before);
  buildSite({ root });
  assert.ok(fs.readFileSync(path.join(root, 'index.html'), 'utf8').includes('<title>Updated source title</title>'));
});

test('published locale requires reviewed foundation pages and complete shared copy', t => {
  const root = fixture(t);
  const config = json(root, 'site/config.json');
  config.locales.find(locale => locale.code === 'fr').status = 'published';
  putJSON(root, 'site/config.json', config);
  assert.throws(() => loadSite(root), /ENOENT/);
  addFrench(root);
  const pages = json(root, 'site/content/fr/pages.json');
  pages.features.status = 'draft';
  putJSON(root, 'site/content/fr/pages.json', pages);
  assert.throws(() => loadSite(root), /needs its reviewed features/);
  pages.features.status = 'published';
  pages.privacy.status = 'draft';
  putJSON(root, 'site/content/fr/pages.json', pages);
  assert.throws(() => loadSite(root), /needs its reviewed privacy/);
});

test('locale-specific slugs work; hreflang connects only equivalents and is reciprocal', t => {
  const root = fixture(t);
  addFrench(root);
  const { outputs } = generateSite(root);
  assert.ok(outputs.has('fr/installation/index.html'));
  const enSetup = outputs.get('en/guides/setup/index.html');
  assert.ok(enSetup.includes('hreflang="fr" href="https://winsend.app/fr/installation/"'));
  const frSetup = outputs.get('fr/installation/index.html');
  assert.ok(frSetup.includes('rel="canonical" href="https://winsend.app/fr/installation/"'));
  assert.ok(frSetup.includes('hreflang="en" href="https://winsend.app/en/guides/setup/"'));
  assert.ok(frSetup.includes('href="/fr/telecharger/"'));
  // There is no French clipboard guide. Never use its home as an equivalent.
  assert.ok(!outputs.get('en/guides/copy-iphone-to-windows/index.html').includes('hreflang="fr"'));
  assert.ok(frSetup.includes('href="/fr/features/"'));
  assert.ok(outputs.get('index.html').includes('href="/fr/"'));
});

test('draft pages do not require files, produce URLs, or enter sitemap', t => {
  const root = fixture(t);
  const pages = json(root, 'site/content/en/pages.json');
  pages['unreviewed-topic'] = { status: 'draft' };
  putJSON(root, 'site/content/en/pages.json', pages);
  const { outputs } = generateSite(root);
  assert.ok(!outputs.get('sitemap.xml').includes('unreviewed-topic'));
  assert.ok(![...outputs.keys()].some(key => key.includes('unreviewed-topic')));
});

test('unpublishing a locale removes managed HTML, not unrelated files', t => {
  const root = fixture(t);
  addFrench(root);
  buildSite({ root });
  fs.writeFileSync(path.join(root, 'fr/keep.txt'), 'not a generated file');
  const config = json(root, 'site/config.json');
  config.locales.find(locale => locale.code === 'fr').status = 'draft';
  putJSON(root, 'site/config.json', config);
  assert.throws(() => buildSite({ root, check: true }), /remove fr/);
  buildSite({ root });
  assert.ok(!fs.existsSync(path.join(root, 'fr/index.html')));
  assert.equal(fs.readFileSync(path.join(root, 'fr/keep.txt'), 'utf8'), 'not a generated file');
});

test('build refuses to overwrite or delete manually modified generated files', t => {
  const root = fixture(t);
  buildSite({ root });
  fs.appendFileSync(path.join(root, 'index.html'), '\nmanual edit');
  assert.throws(() => buildSite({ root }), /edited by hand/);
});

test('bad paths, duplicate routes, and undeclared statuses fail before output writes', t => {
  const root = fixture(t);
  const pages = json(root, 'site/content/en/pages.json');
  pages.download.path = '/en/../../outside/';
  putJSON(root, 'site/content/en/pages.json', pages);
  assert.throws(() => buildSite({ root }), /Invalid\/duplicate page path/);
  assert.ok(!fs.existsSync(path.join(root, 'index.html')));
  pages.download.path = pages.setup.path;
  putJSON(root, 'site/content/en/pages.json', pages);
  assert.throws(() => generateSite(root), /Invalid\/duplicate page path/);
  pages.download.path = '/en/download/';
  delete pages.download.status;
  putJSON(root, 'site/content/en/pages.json', pages);
  assert.throws(() => generateSite(root), /Explicit page status/);
});

test('missing equivalent-language internal links fail rather than silently fall back', t => {
  const root = fixture(t);
  addFrench(root);
  edit(root, 'site/content/fr/home.body.html', '<main>', '<main><a href="{{links.missing-feature}}">Missing</a>');
  assert.throws(() => generateSite(root), /Unknown template variable: links.missing-feature/);
});

test('HTML metadata is escaped; unknown variables and prototype access fail closed', () => {
  assert.equal(render('<title>{{title}}</title>', { title: '<Hello> & "world"' }), '<title>&lt;Hello&gt; &amp; &quot;world&quot;</title>');
  assert.throws(() => render('{{missing}}', {}), /Unknown/);
  assert.throws(() => render('{{constructor}}', {}), /Unknown/);
});

test('json.* variables are encoded for JSON-LD, not HTML entities', t => {
  const root = fixture(t);
  const pages = json(root, 'site/content/en/pages.json');
  pages.home.title = 'A "quote" & </script><script>bad</script>';
  putJSON(root, 'site/content/en/pages.json', pages);
  fs.appendFileSync(path.join(root, 'site/content/en/home.head.html'), '\n<script type="application/ld+json">{"@type":"WebPage","name":"{{json.title}}"}</script>\n');
  const output = generateSite(root).outputs.get('index.html');
  const raw = [...output.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => match[1]).find(value => JSON.parse(value)['@type'] === 'WebPage');
  assert.equal(JSON.parse(raw).name, pages.home.title);
  assert.ok(!raw.includes('</script>'));
});

test('invalid JSON-LD, invisible FAQ, redirects and duplicate IDs are rejected', t => {
  const root = fixture(t);
  const file = path.join(root, 'site/content/en/home.body.html');
  const original = fs.readFileSync(file, 'utf8');
  fs.appendFileSync(file, '<script type="application/ld+json">broken</script>');
  assert.throws(() => generateSite(root), /invalid JSON-LD/);
  fs.writeFileSync(file, original + '<script type="application/ld+json">{"@type":"FAQPage","mainEntity":[{"name":"Unseen question","acceptedAnswer":{"text":"Unseen answer"}}]}</script>');
  assert.throws(() => generateSite(root), /FAQ not visible/);
  fs.writeFileSync(file, original + '<script>window.location.href = "/en/";</script>');
  assert.throws(() => generateSite(root), /automatic redirects/);
  fs.writeFileSync(file, original + '<div id="features"></div>');
  assert.throws(() => generateSite(root), /duplicate HTML IDs/);
});

test('FAQ has one source for visible text and schema, with missing copy rejected', t => {
  const root = fixture(t);
  const faqs = json(root, 'site/content/en/faq.json');
  faqs.home[0].answer = 'A reviewed fixture answer with "quotes" & symbols.';
  putJSON(root, 'site/content/en/faq.json', faqs);
  const output = generateSite(root).outputs.get('index.html');
  assert.ok(output.includes('A reviewed fixture answer with &quot;quotes&quot; &amp; symbols.'));
  const schema = [...output.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1])).find(data => data['@type'] === 'FAQPage');
  assert.equal(schema.mainEntity[0].acceptedAnswer.text, faqs.home[0].answer);
  delete faqs.home;
  putJSON(root, 'site/content/en/faq.json', faqs);
  assert.throws(() => generateSite(root), /Missing reviewed FAQ copy/);
});

test('internal page links and anchors fail closed instead of linking to placeholders', t => {
  const root = fixture(t);
  const file = path.join(root, 'site/content/en/home.body.html');
  const original = fs.readFileSync(file, 'utf8');
  fs.appendFileSync(file, '<a href="/fr/unpublished/">Invalid</a>');
  assert.throws(() => generateSite(root), /broken internal page link/);
  fs.writeFileSync(file, original + '<a href="/#missing-anchor">Invalid anchor</a>');
  assert.throws(() => generateSite(root), /missing link anchor/);
});

test('build sources and backup HTML are excluded from deployment assets', () => {
  const ignore = fs.readFileSync(path.join(ROOT, '.assetsignore'), 'utf8').split(/\r?\n/);
  for (const entry of ['site', 'scripts', 'tests', 'index_original_backup.html']) assert.ok(ignore.includes(entry), entry);
  const wrangler = fs.readFileSync(path.join(ROOT, 'wrangler.jsonc'), 'utf8');
  assert.ok(wrangler.includes('"not_found_handling": "none"')); // no SPA fallback for absent locales
});

test('local preview snapshot contains only public resources, not source or draft locales', t => {
  const root = fixture(t);
  buildSite({ root });
  fs.mkdirSync(path.join(root, 'assets'), { recursive: true });
  fs.writeFileSync(path.join(root, 'assets/public.js'), 'public');
  fs.writeFileSync(path.join(root, 'assets/private.md'), 'not public');
  fs.writeFileSync(path.join(root, 'assets/source.mov'), 'not public');
  fs.writeFileSync(path.join(root, 'index_original_backup.html'), 'not public');
  const directory = preparePreview(root);
  assert.ok(fs.existsSync(path.join(directory, 'index.html')));
  assert.ok(fs.existsSync(path.join(directory, 'assets/public.js')));
  for (const name of ['site', 'scripts', 'tests', 'fr', 'assets/private.md', 'assets/source.mov', 'index_original_backup.html']) assert.ok(!fs.existsSync(path.join(directory, name)), name);
});

