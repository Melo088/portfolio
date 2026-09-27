// Internal link check for the static build. Every root-relative href, src
// and object data in every HTML page must resolve to a built file, and
// every #fragment must match an id on the target page. External links are
// out of scope: they are flaky in CI and not ours to fix.
//
// Usage: node scripts/check-links.mjs dist
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = process.argv[2] ?? 'dist';

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else if (entry.name.endsWith('.html')) out.push(p);
  }
  return out;
}

async function isFile(p) {
  try {
    return (await stat(p)).isFile();
  } catch {
    return false;
  }
}

/** Resolves a root-relative path the way a static host would. */
async function resolve(pathname) {
  const clean = decodeURIComponent(pathname);
  const base = join(root, clean);
  const candidates = clean.endsWith('/')
    ? [join(base, 'index.html')]
    : [base, join(base, 'index.html'), `${base}.html`];
  for (const c of candidates) if (await isFile(c)) return c;
  return null;
}

const idCache = new Map();
async function idsOf(file) {
  if (!idCache.has(file)) {
    const html = await readFile(file, 'utf8');
    idCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return idCache.get(file);
}

const pages = await walk(root);
const failures = [];
let checked = 0;

for (const page of pages) {
  const html = await readFile(page, 'utf8');
  const refs = [...html.matchAll(/\s(?:href|src|data)="([^"]+)"/g)].map((m) => m[1]);
  for (const ref of refs) {
    if (!ref.startsWith('/') || ref.startsWith('//')) continue;
    checked++;
    const url = new URL(ref, 'https://site.invalid');
    const target = await resolve(url.pathname);
    if (!target) {
      failures.push(`${relative(root, page)}: ${ref} -> no such file`);
      continue;
    }
    const frag = url.hash.slice(1);
    if (frag && target.endsWith('.html') && !(await idsOf(target)).has(frag)) {
      failures.push(`${relative(root, page)}: ${ref} -> no id "${frag}"`);
    }
  }
}

if (failures.length) {
  console.error(`Broken internal links (${failures.length}):\n  ${failures.join('\n  ')}`);
  process.exit(1);
}
console.log(`OK: ${checked} internal links across ${pages.length} pages.`);
