// Local-only public asset snapshot. Keeps Wrangler's own runtime writes outside
// the watched asset directory when production assets.directory is the repo root.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT, loadSite, buildSite } from './build-site.mjs';

export function preparePreview(root = ROOT, directoryName = 'preview-assets') {
  if (!/^preview-[a-z0-9-]+$/.test(directoryName)) throw new Error('Invalid preview directory name');
  buildSite({ root, check: true });
  const { locales } = loadSite(root);
  const destination = path.join(root, '.wrangler', directoryName);
  // Windows may hold a watch handle on the root of an active preview. Keep
  // that directory itself intact when refreshing its public contents.
  fs.mkdirSync(destination, { recursive: true });
  for (const name of fs.readdirSync(destination)) fs.rmSync(path.join(destination, name), { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  const copyPublicFile = filename => {
    const name = path.basename(filename);
    return name !== '.DS_Store' && !name.endsWith('.md') && !name.endsWith('.mov') && name !== 'tailwind.input.css';
  };
  for (const directory of ['assets', ...locales.map(locale => locale.code)]) {
    fs.cpSync(path.join(root, directory), path.join(destination, directory), { recursive: true, filter: copyPublicFile });
  }
  const rootFiles = new Set(['index.html', 'sitemap.xml', 'robots.txt', 'llms.txt', 'update.json', '_redirects']);
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    if (rootFiles.has(entry.name) || /\.(?:ico|png|webp|jpg|jpeg|gif|svg)$/i.test(entry.name) || /^WinSend_v[\w.-]+\.exe$/.test(entry.name)) {
      fs.copyFileSync(path.join(root, entry.name), path.join(destination, entry.name));
    }
  }
  return destination;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log(`Prepared local public assets: ${preparePreview()}`); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
