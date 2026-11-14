// Bakes the small ink textures used by the pills and the section eyebrows
// into public/textures/. They were tuned live in a design lab; baking them
// keeps the noise identical (seeded) and ships a few KB instead of code.
//
//   ink-mottle-light.webp  white alpha: uneven density on dark ink pills
//   ink-mottle-dark.webp   black alpha: the same on pale pills (carbon stock)
//   tape-mask.webp         alpha mask: worn patches and pinholes on the tape
//
// Run after changing a texture:  npm run bake:textures
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = 'public/textures';

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Wrapping 2D value noise: seamless on a tile of `size`. */
function valueNoise(size, cell, rnd) {
  const g = Math.max(1, Math.round(size / cell));
  const lat = new Float32Array(g * g).map(() => rnd());
  return (x, y) => {
    const fx = (x / size) * g;
    const fy = (y / size) * g;
    const xi = Math.floor(fx);
    const yi = Math.floor(fy);
    const xf = fx - xi;
    const yf = fy - yi;
    const x0 = ((xi % g) + g) % g;
    const y0 = ((yi % g) + g) % g;
    const x1 = (x0 + 1) % g;
    const y1 = (y0 + 1) % g;
    const u = xf * xf * (3 - 2 * xf);
    const v = yf * yf * (3 - 2 * yf);
    const a = lat[y0 * g + x0];
    const b = lat[y0 * g + x1];
    const c = lat[y1 * g + x0];
    const d = lat[y1 * g + x1];
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
}

/** Smoothed 1D noise along a wrapping axis (scan striations). */
function streaks(n, radius, rnd) {
  const raw = Array.from({ length: n }, () => rnd() - 0.5);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let acc = 0;
    for (let k = -radius; k <= radius; k++) acc += raw[(i + k + n) % n];
    out[i] = acc / (2 * radius + 1);
  }
  return out;
}

/** Tonal ink: uneven density and faint vertical striations, no holes. */
function mottle(seed, S, color, strength) {
  const rnd = rng(seed);
  const d = new Uint8ClampedArray(S * S * 4);
  const big = valueNoise(S, 45, rnd);
  const mid = valueNoise(S, 14, rnd);
  const fine = valueNoise(S, 4, rnd);
  const grain = valueNoise(S, 1.6, rnd);
  const streak = streaks(S, 1, rnd);
  const w = color === 'white' ? 255 : 0;
  for (let i = 0; i < S * S; i++) {
    const px = i % S;
    const py = (i / S) | 0;
    const v =
      (big(px, py) - 0.5) * 1.2 +
      (mid(px, py) - 0.5) * 0.8 +
      (fine(px, py) - 0.5) * 0.45 +
      (grain(px, py) - 0.5) * 0.5 +
      streak[px] * 0.45;
    const a = Math.max(0, Math.min(1, v * 0.9 + 0.32));
    d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = w;
    d[i * 4 + 3] = a * strength * 255;
  }
  return { d, S };
}

/** Alpha mask: solid, with worn patches and clumped pinholes. */
function inkMask(seed, S, patch, pin) {
  const rnd = rng(seed);
  const d = new Uint8ClampedArray(S * S * 4);
  const big = valueNoise(S, 26, rnd);
  const mid = valueNoise(S, 7, rnd);
  const clump = valueNoise(S, 12, rnd);
  for (let i = 0; i < S * S; i++) {
    const px = i % S;
    const py = (i / S) | 0;
    const v = big(px, py) * 0.65 + mid(px, py) * 0.35;
    let a = v < patch ? 0 : v < patch + 0.06 ? (v - patch) / 0.06 : 1;
    if (rnd() < pin * (0.3 + clump(px, py) * 1.4)) a *= rnd() * 0.25;
    d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = 0;
    d[i * 4 + 3] = a * 255;
  }
  return { d, S };
}

async function save(name, { d, S }) {
  const file = join(OUT, name);
  await sharp(Buffer.from(d.buffer), { raw: { width: S, height: S, channels: 4 } })
    .webp({ lossless: true })
    .toFile(file);
  console.log('baked', file);
}

mkdirSync(OUT, { recursive: true });
await save('ink-mottle-light.webp', mottle(31, 180, 'white', 0.25));
await save('ink-mottle-dark.webp', mottle(37, 180, 'black', 0.22));
await save('tape-mask.webp', inkMask(17, 160, 0.15, 0.07));
