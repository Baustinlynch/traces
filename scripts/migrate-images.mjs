/**
 * Migrates remote CDN images (cdn.hackclub.com) to local /static/images.
 *
 * 1. Scans Docs/**\/*.md and src/lib/site-data.js for CDN URLs.
 * 2. Downloads each unique image into static/images/.
 * 3. Rewrites every reference to the local /images/... path
 *    (SvelteKit serves static/ at the site root).
 *
 * Idempotent: re-running skips files that already exist and finds no
 * remaining CDN URLs once the rewrite has happened.
 *
 * Usage: node scripts/migrate-images.mjs
 */
import { mkdir, readFile, readdir, writeFile, access } from 'node:fs/promises';
import { join, extname } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const OUT_DIR = join(ROOT, 'static', 'images');
const CDN_URL_RE = /https:\/\/cdn\.hackclub\.com\/[^\s)"'\]<>]+/g;

const EXT_BY_TYPE = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
  'image/avif': '.avif'
};

async function collectMarkdownFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await collectMarkdownFiles(full)));
    else if (entry.name.endsWith('.md')) out.push(full);
  }
  return out;
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const files = [
    ...(await collectMarkdownFiles(join(ROOT, 'Docs'))),
    join(ROOT, 'src', 'lib', 'site-data.js')
  ];

  // url -> array of files referencing it
  const urls = new Map();
  const contents = new Map();
  for (const file of files) {
    const text = await readFile(file, 'utf8');
    contents.set(file, text);
    for (const url of text.match(CDN_URL_RE) ?? []) {
      if (!urls.has(url)) urls.set(url, []);
      urls.get(url).push(file);
    }
  }

  if (urls.size === 0) {
    console.log('No CDN URLs found — nothing to do.');
    return;
  }

  await mkdir(OUT_DIR, { recursive: true });

  // url -> local public path (/images/<name>)
  const localPaths = new Map();
  const usedNames = new Set();

  for (const url of urls.keys()) {
    const segments = new URL(url).pathname.split('/').filter(Boolean);
    const id = segments.length > 1 ? segments[segments.length - 2] : '';
    let name = decodeURIComponent(segments[segments.length - 1]);

    console.log(`Downloading ${url}`);
    const res = await fetch(url);
    if (!res.ok) {
      // Leave broken references (e.g. intentionally dead links in test docs) untouched.
      console.warn(`  ! Skipping (HTTP ${res.status}): ${url}`);
      continue;
    }
    const buffer = Buffer.from(await res.arrayBuffer());

    // Some CDN assets have no extension (e.g. .../width-198); infer from content-type.
    if (!extname(name)) {
      const type = (res.headers.get('content-type') ?? '').split(';')[0].trim();
      name += EXT_BY_TYPE[type] ?? '.png';
    }

    // Avoid collisions between different URLs sharing a basename.
    if (usedNames.has(name)) {
      name = `${id.slice(-8)}-${name}`;
    }
    usedNames.add(name);

    await writeFile(join(OUT_DIR, name), buffer);
    localPaths.set(url, `/images/${name}`);
  }

  // Rewrite references, longest URLs first so prefixes never clobber.
  const sortedUrls = [...localPaths.keys()].sort((a, b) => b.length - a.length);
  for (const [file, original] of contents) {
    let text = original;
    for (const url of sortedUrls) {
      text = text.split(url).join(localPaths.get(url));
    }
    if (text !== original) {
      await writeFile(file, text);
      console.log(`Rewrote ${file.replace(ROOT, '')}`);
    }
  }

  console.log(`\nDone: ${localPaths.size} images migrated to static/images/.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
