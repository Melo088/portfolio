// Bakes the big display words ("now", "work", ...) into ink masks.
//
// Why baked: WebKit (Safari, and every browser on iOS) paints stray
// opaque blocks when HTML text uses SVG url() filters, so the heavy
// ink-lg filter can't run live. Each word is rendered once through that
// filter in Chromium and saved as an alpha mask (public/ink/<slug>.webp);
// InkWord.astro paints the mask in the surface ink color over the real,
// transparent text, which keeps layout, selection and screen readers.
//
// Run after changing a word or the filter:
//   CHROMIUM_PATH=/path/to/chrome npm run bake:ink
// (any Chromium works; `npx playwright install chromium` provides one.)
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import { mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const WORDS = ['now', 'work', 'record', 'stack', 'hello.', 'about', 'cv', '404'];
/** Render size: between the mobile (72px) and desktop (176px+) sizes. */
const FONT_PX = 150;
/** 288px tall masks: indistinguishable from 2x at desktop retina sizes, half the bytes. */
const SCALE = 1.6;
const OUT = 'public/ink';

// The ink-lg filter, tuned in CSS px for display sizes. Region matches
// InkWord.astro's mask box: 4% of the width and 20% of the height around
// the text on each side.
const FILTER = `
<filter id="ink-lg" x="-4%" y="-20%" width="108%" height="140%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="7" result="warp"/>
  <feDisplacementMap in="SourceGraphic" in2="warp" scale="9" xChannelSelector="R" yChannelSelector="G" result="warped"/>
  <feGaussianBlur in="warped" stdDeviation="1.8" result="soft"/>
  <feComponentTransfer in="soft" result="body"><feFuncA type="linear" slope="1.8" intercept="-0.3"/></feComponentTransfer>
  <feGaussianBlur in="warped" stdDeviation="11" result="haloBlur"/>
  <feComponentTransfer in="haloBlur" result="halo"><feFuncA type="linear" slope="0.32"/></feComponentTransfer>
  <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="1" seed="11" result="grit"/>
  <feColorMatrix in="grit" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  14 0 0 0 -8.5" result="gritA"/>
  <feComponentTransfer in="haloBlur" result="zone"><feFuncA type="linear" slope="4"/></feComponentTransfer>
  <feComposite in="zone" in2="gritA" operator="in" result="spray"/>
  <feMerge><feMergeNode in="halo"/><feMergeNode in="spray"/><feMergeNode in="body"/></feMerge>
</filter>`;

// Same rule as InkWord.astro: lowercase letters and digits only.
const slugOf = (word) => word.toLowerCase().replace(/[^a-z0-9]/g, '');

const font = readFileSync(
  'node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-italic.woff2',
).toString('base64');

const html = `<!doctype html><html><head><style>
@font-face { font-family: 'Archivo Ink'; font-style: italic; font-weight: 100 900; font-stretch: 62% 125%;
  src: url(data:font/woff2;base64,${font}) format('woff2'); }
html, body { margin: 0; background: transparent; }
body { padding: ${FONT_PX}px; }
.w { display: inline-block; font-family: 'Archivo Ink'; font-style: italic; font-weight: 900;
  font-stretch: 125%; letter-spacing: -0.035em; line-height: 0.86; font-size: ${FONT_PX}px;
  color: #000; filter: url(#ink-lg); white-space: nowrap; }
</style></head><body>
<svg width="0" height="0" style="position:absolute"><defs>${FILTER}</defs></svg>
<span class="w" id="w"></span></body></html>`;

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 2400, height: 800 }, deviceScaleFactor: SCALE });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
mkdirSync(OUT, { recursive: true });

for (const word of WORDS) {
  await page.evaluate((w) => (document.getElementById('w').textContent = w), word);
  await page.waitForTimeout(50);
  const box = await page.locator('#w').boundingBox();
  const clip = {
    x: box.x - box.width * 0.04,
    y: box.y - box.height * 0.2,
    width: box.width * 1.08,
    height: box.height * 1.4,
  };
  const png = await page.screenshot({ clip, omitBackground: true });
  const file = join(OUT, `${slugOf(word)}.webp`);
  const info = await sharp(png).webp({ quality: 50, alphaQuality: 70, effort: 6 }).toFile(file);
  console.log(`${file}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(1)} KB`);
}

await browser.close();
