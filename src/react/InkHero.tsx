import { useEffect, useRef } from 'react';

/**
 * Hero wordmark printed in bleeding ink over a butterfly reproduced as a
 * halftone screen. One WebGL fragment shader, rendered on demand (resize
 * and scroll only), never on an idle loop.
 *
 * Field texture: the word is rasterized once per layout on a 2D canvas
 * at fieldScale and blurred at three radii packed into R/G/B:
 *   R  near-sharp letterforms
 *   G  bleed radius (edges, haze, spray)
 *   B  wide radius (the scroll dissolve spreads into it)
 * Thresholding a blend of those fields against layered noise gives the
 * ragged, soaked edges; the halo region feeds haze, spray and blots, and
 * the body gets mottled density, dry patches and toner grain.
 *
 * Scroll is the only motion, one continuous ramp: the ink spreads, loses
 * legibility and erodes in patches until the paper is empty, while the
 * butterfly folds its wings and fades. The letters never react to the
 * pointer (tried it: too much movement).
 */

/** Tunables. Distances are CSS px unless noted. */
const P = {
  /** Field raster scale relative to CSS px (half res is plenty). */
  fieldScale: 0.5,
  /** Blur sigmas as a fraction of the font size. */
  blurSharp: 0.01,
  blurBleed: 0.045,
  blurWide: 0.12,
  /** Wordmark width as a fraction of the hero width (desktop / narrow). */
  widthFrac: 0.74,
  widthFracNarrow: 0.9,
  /** Max font size as a fraction of the hero height. */
  heightFrac: 0.4,
  /** Vertical center of the word as a fraction of the hero height. */
  centerY: 0.45,
  /** Extra shear on top of the italic, for a harder forward lean. */
  shear: -0.1,
  tracking: -0.045,
  /** Resting bleed: how far into the blurred fields the ink reaches. */
  bleed: 0.24,
  /** Halftone screen for the backdrop. */
  cell: 5,
  backdropAlpha: 0.3,
  /** Backdrop width as a fraction of the hero width (desktop / narrow). */
  backdropWidth: 1.05,
  backdropWidthNarrow: 1.7,
  /** How far the wings close over the scroll ramp (0 = never). */
  wingFold: 0.5,
  /** Scroll distance (hero heights) over which the dissolve completes. */
  dissolveDistance: 0.8,
  maxDpr: 1.5,
  /** Font size (CSS px) the edge noise was tuned at (1440px wide hero). */
  refFont: 330,
};

const VERT = /* glsl */ `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = /* glsl */ `
precision highp float;

uniform vec2 uSize;
uniform float uDpr;
uniform sampler2D uField;
uniform sampler2D uBackdrop;
uniform vec4 uBackdropBox;
uniform float uHasBackdrop;
uniform float uScroll;
uniform float uBleed;
uniform float uCell;
uniform float uBackdropAlpha;
uniform float uWingFold;
uniform vec3 uInk;
uniform vec3 uInkBackdrop;
/** Font size / reference size: edge noise scales with the letters. */
uniform float uFontScale;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.03 + 17.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  // CSS px, top-left origin.
  vec2 p = vec2(gl_FragCoord.x, uSize.y * uDpr - gl_FragCoord.y) / uDpr;
  float s = uScroll;

  vec3 f = texture2D(uField, p / uSize).rgb;

  // Bleed level picks how far into the blurred fields the ink reaches.
  float bleed = uBleed + 0.9 * s;
  float field = mix(f.r, f.g, clamp(bleed * 1.4, 0.0, 1.0));
  field = mix(field, f.b, clamp((bleed - 0.55) * 2.2, 0.0, 1.0));

  vec2 fq = p / uFontScale;
  float nLo = fbm(fq * 0.024);
  float nMid = noise(fq * 0.12 + 3.7);
  float nHi = noise(p * 0.7 + 9.1);
  float th = 0.5 - 0.12 * bleed + (nLo - 0.5) * 0.32 + (nMid - 0.5) * 0.07 + (nHi - 0.5) * 0.05;
  // Wide, asymmetric ramp: a soaked, fuzzy edge rather than a cut one.
  float ink = smoothstep(th - 0.16, th + 0.05, field);
  ink *= ink * (3.0 - 2.0 * ink);

  // Body: mottled density, dry patches and fine toner grain (no lines).
  float grain = hash(floor(p * 1.1) + 0.5);
  float clump = noise(p * 0.45 + 41.0);
  float dry = smoothstep(0.6, 0.7, fbm(fq * 0.02 + 23.0)) * step(0.45, hash(floor(p * 0.9) + 7.0));
  float dens = (0.8 + 0.2 * fbm(fq * 0.015 + 11.0))
             * (0.9 + 0.1 * grain) * (0.93 + 0.07 * clump)
             * (1.0 - 0.45 * dry);

  // Around the letters: haze, fine spray and a few blots.
  float halo = smoothstep(0.015, 0.5, f.g) * (1.0 - ink);
  float haze = halo * (0.2 + 0.24 * nLo);
  float spray = step(1.0 - halo * halo * 0.07, hash(floor(p * 0.8) + 0.37)) * halo;
  float blot = smoothstep(0.8, 0.86, noise(fq * 0.2 + 5.0)) * halo * halo;

  // Scroll erosion: ink breaks up in patches, then the page empties.
  float erode = smoothstep(s * 1.2 - 0.14, s * 1.2 + 0.02, fbm(fq * 0.011 + 5.0));
  float word = clamp(ink * dens + haze + max(spray * 0.7, blot * 0.55), 0.0, 1.0) * erode;

  // Backdrop through a 45deg halftone screen.
  float back = 0.0;
  if (uHasBackdrop > 0.5) {
    mat2 R = mat2(0.70710678, -0.70710678, 0.70710678, 0.70710678);
    vec2 q = R * p;
    vec2 cc = (floor(q / uCell) + 0.5) * uCell;
    vec2 cp = cc * R;
    vec2 buv = (cp - uBackdropBox.xy) / uBackdropBox.zw;
    // Wings close toward the body as the page scrolls.
    buv.x = 0.5 + (buv.x - 0.5) / (1.0 - uWingFold * s);
    if (buv.x > 0.0 && buv.x < 1.0 && buv.y > 0.0 && buv.y < 1.0) {
      float lum = texture2D(uBackdrop, buv).r;
      // Fade before the hero's bottom edge so the screen never ends in a cut.
      float fadeY = smoothstep(uSize.y, uSize.y * 0.78, p.y);
      // Soft, low-contrast tone: the insect should read as a presence
      // behind the word, not as an illustration. Edges melt into the paper.
      float edge = smoothstep(0.0, 0.12, buv.x) * smoothstep(1.0, 0.88, buv.x)
                 * smoothstep(0.0, 0.12, buv.y) * smoothstep(1.0, 0.88, buv.y);
      float dark = pow(1.0 - lum, 1.2) * 0.62 * edge * fadeY * (1.0 - smoothstep(0.1, 0.85, s));
      float r = sqrt(dark) * uCell * 0.72;
      float d = length(q - cc) + (nHi - 0.5) * 0.9;
      back = smoothstep(r + 0.7, r - 0.7, d) * uBackdropAlpha;
    }
  }

  float aB = back * (1.0 - word);
  vec3 col = uInk * word + uInkBackdrop * aB;
  gl_FragColor = vec4(col, word + aB);
}
`;

interface Props {
  word: string;
  /** Grayscale image on white for the halftone backdrop, centered. */
  backdrop?: string;
  className?: string;
}

const FONT_FAMILY = '"Archivo Variable", "Archivo", "Arial Black", sans-serif';
const INK = [0.137, 0.149, 0.153];
const INK_BACKDROP = [0.17, 0.2, 0.21];

function fontString(size: number) {
  return `italic 900 expanded ${size}px ${FONT_FAMILY}`;
}

/** Separable box blur, 3 passes ~ gaussian. Single channel. */
function blurChannel(src: Float32Array, w: number, h: number, sigma: number): Float32Array {
  if (sigma < 0.5) return src.slice();
  // Box width for 3 passes approximating the given sigma.
  const r = Math.max(1, Math.round(Math.sqrt((12 * sigma * sigma) / 3 + 1) / 2));
  const a = src.slice();
  const b = new Float32Array(src.length);
  const norm = 1 / (2 * r + 1);
  for (let pass = 0; pass < 3; pass++) {
    // horizontal
    for (let y = 0; y < h; y++) {
      const row = y * w;
      let acc = 0;
      for (let x = -r; x <= r; x++) acc += a[row + Math.min(w - 1, Math.max(0, x))];
      for (let x = 0; x < w; x++) {
        b[row + x] = acc * norm;
        const add = a[row + Math.min(w - 1, x + r + 1)];
        const sub = a[row + Math.max(0, x - r)];
        acc += add - sub;
      }
    }
    // vertical
    for (let x = 0; x < w; x++) {
      let acc = 0;
      for (let y = -r; y <= r; y++) acc += b[Math.min(h - 1, Math.max(0, y)) * w + x];
      for (let y = 0; y < h; y++) {
        a[y * w + x] = acc * norm;
        const add = b[Math.min(h - 1, y + r + 1) * w + x];
        const sub = b[Math.max(0, y - r) * w + x];
        acc += add - sub;
      }
    }
  }
  return a;
}

export default function InkHero({ word, backdrop, className }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    // The hero section hosts the overlay copy: the layout variables live
    // on it, not on the canvas wrapper underneath.
    const host = (wrap.closest('[data-ink-host]') as HTMLElement | null) ?? wrap;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      preserveDrawingBuffer: false,
    });

    const fieldCanvas = document.createElement('canvas');
    const fctx = fieldCanvas.getContext('2d', { willReadFrequently: true });
    if (!fctx) return;

    let width = 0;
    let height = 0;
    let fontSize = P.refFont;
    let dpr = 1;
    let disposed = false;
    let raf = 0;
    let visible = true;
    let scroll = 0;

    /** Lays out the word into the field canvas and exposes its box. */
    function buildField() {
      const s = P.fieldScale;
      const fw = Math.max(2, Math.round(width * s));
      const fh = Math.max(2, Math.round(height * s));
      fieldCanvas.width = fw;
      fieldCanvas.height = fh;

      // Fit the font in CSS px, then draw at field scale.
      fctx!.font = fontString(100);
      try {
        (fctx as any).fontStretch = 'expanded';
        fctx!.letterSpacing = `${100 * P.tracking}px`;
      } catch {
        /* older engines */
      }
      const m100 = fctx!.measureText(word);
      const frac = width < 640 ? P.widthFracNarrow : P.widthFrac;
      let size = (width * frac) / (m100.width / 100);
      size = Math.min(size, height * P.heightFrac);

      fontSize = size;
      const fs = size * s;
      fctx!.setTransform(1, 0, 0, 1, 0, 0);
      fctx!.fillStyle = '#000';
      fctx!.fillRect(0, 0, fw, fh);
      fctx!.font = fontString(fs);
      try {
        (fctx as any).fontStretch = 'expanded';
        fctx!.letterSpacing = `${fs * P.tracking}px`;
      } catch {
        /* older engines */
      }
      fctx!.textAlign = 'center';
      fctx!.textBaseline = 'alphabetic';
      const m = fctx!.measureText(word);
      const ascent = m.actualBoundingBoxAscent;
      const descent = m.actualBoundingBoxDescent;
      const cy = fh * P.centerY;
      const baseline = cy + (ascent - descent) / 2;
      // Shear around the baseline so the word stays centered.
      fctx!.setTransform(1, 0, P.shear, 1, -P.shear * baseline, 0);
      fctx!.fillStyle = '#fff';
      fctx!.fillText(word, fw / 2, baseline);
      fctx!.setTransform(1, 0, 0, 1, 0, 0);

      const img = fctx!.getImageData(0, 0, fw, fh);
      const n = fw * fh;
      const base = new Float32Array(n);
      for (let i = 0; i < n; i++) base[i] = img.data[i * 4] / 255;
      const r = blurChannel(base, fw, fh, size * P.blurSharp * s);
      const gch = blurChannel(base, fw, fh, size * P.blurBleed * s);
      const b = blurChannel(base, fw, fh, size * P.blurWide * s);
      for (let i = 0; i < n; i++) {
        img.data[i * 4] = Math.min(255, r[i] * 255);
        img.data[i * 4 + 1] = Math.min(255, gch[i] * 255);
        // The wide field is dim by nature; lift it so the dissolve can reach it.
        img.data[i * 4 + 2] = Math.min(255, b[i] * 255 * 1.35);
        img.data[i * 4 + 3] = 255;
      }
      fctx!.putImageData(img, 0, 0);

      const wordBottom = (baseline + descent + fs * 0.1) / s;
      host.style.setProperty('--ink-word-bottom', `${Math.round(wordBottom)}px`);
      host.style.setProperty('--ink-word-size', `${Math.round(size)}px`);
      host.dataset.inkReady = '';
    }

    // ---------- 2D fallback (no WebGL) ----------
    if (!gl) {
      const ctx = canvas.getContext('2d');
      const layout2d = () => {
        const rect = wrap.getBoundingClientRect();
        width = Math.max(1, Math.floor(rect.width));
        height = Math.max(1, Math.floor(rect.height));
        dpr = Math.min(window.devicePixelRatio || 1, P.maxDpr);
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        buildField();
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(fieldCanvas, 0, 0, canvas.width, canvas.height);
        // Field is white-on-black: turn it into ink with alpha = luminance.
        const im = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < im.data.length; i += 4) {
          const a = Math.min(1, Math.max(0, (im.data[i] / 255 - 0.35) * 3));
          im.data[i] = 35;
          im.data[i + 1] = 38;
          im.data[i + 2] = 39;
          im.data[i + 3] = a * 255;
        }
        ctx.putImageData(im, 0, 0);
      };
      document.fonts?.ready.then(() => !disposed && layout2d());
      layout2d();
      const ro2 = new ResizeObserver(() => layout2d());
      ro2.observe(wrap);
      return () => {
        disposed = true;
        ro2.disconnect();
      };
    }

    // ---------- WebGL ----------
    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh));
      }
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const U = (name: string) => gl.getUniformLocation(prog, name);
    const u = {
      size: U('uSize'),
      dpr: U('uDpr'),
      field: U('uField'),
      backdrop: U('uBackdrop'),
      backdropBox: U('uBackdropBox'),
      hasBackdrop: U('uHasBackdrop'),
      scroll: U('uScroll'),
      bleed: U('uBleed'),
      cell: U('uCell'),
      backdropAlpha: U('uBackdropAlpha'),
      wingFold: U('uWingFold'),
      ink: U('uInk'),
      inkBackdrop: U('uInkBackdrop'),
      fontScale: U('uFontScale'),
    };

    const makeTex = (unit: number) => {
      const t = gl.createTexture()!;
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
      return t;
    };
    const fieldTex = makeTex(0);
    const backdropTex = makeTex(1);
    gl.uniform1i(u.field, 0);
    gl.uniform1i(u.backdrop, 1);
    gl.uniform3fv(u.ink, INK);
    gl.uniform3fv(u.inkBackdrop, INK_BACKDROP);
    gl.uniform1f(u.bleed, P.bleed);
    gl.uniform1f(u.cell, P.cell);
    gl.uniform1f(u.backdropAlpha, P.backdropAlpha);
    gl.uniform1f(u.wingFold, reduced ? 0 : P.wingFold);

    let backdropAspect = 1.5;
    let hasBackdrop = 0;
    if (backdrop) {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        if (disposed) return;
        backdropAspect = img.naturalWidth / img.naturalHeight;
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, backdropTex);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        hasBackdrop = 1;
        request();
      };
      img.src = backdrop;
    }

    function layout() {
      const rect = wrap!.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, P.maxDpr);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      gl!.viewport(0, 0, canvas!.width, canvas!.height);

      buildField();
      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, fieldTex);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, fieldCanvas);
      request();
    }

    function draw() {
      // Backdrop box: centered on the word, drifting down as the page
      // scrolls (reads as slower parallax). Wider than the screen on
      // narrow viewports, so the wingtips crop off the edges.
      const frac = width < 640 ? P.backdropWidthNarrow : P.backdropWidth;
      let bw = width * frac;
      let bh = bw / backdropAspect;
      if (bh > height * 1.15) {
        bh = height * 1.15;
        bw = bh * backdropAspect;
      }
      const bx = (width - bw) / 2;
      const by = height * P.centerY - bh / 2 + scroll * height * 0.25;

      gl!.uniform2f(u.size, width, height);
      gl!.uniform1f(u.dpr, dpr);
      gl!.uniform4f(u.backdropBox, bx, by, bw, bh);
      gl!.uniform1f(u.hasBackdrop, hasBackdrop);
      gl!.uniform1f(u.scroll, scroll);
      gl!.uniform1f(u.fontScale, Math.max(0.25, fontSize / P.refFont));
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }

    function request() {
      if (raf || disposed) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (visible) draw();
      });
    }

    function onScroll() {
      const p = Math.min(1, Math.max(0, window.scrollY / (height * P.dissolveDistance)));
      const q = Math.round(p * 200) / 200;
      if (q === scroll) return;
      scroll = q;
      request();
    }

    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(layout, width ? 90 : 0);
    });
    ro.observe(wrap);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) request();
    });
    io.observe(wrap);

    layout();
    document.fonts
      ?.load(fontString(100))
      .then(() => !disposed && layout())
      .catch(() => {});

    if (!reduced) {
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [word, backdrop]);

  return (
    <div ref={wrapRef} className={className} aria-hidden="true">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
