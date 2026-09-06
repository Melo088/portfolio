import { useEffect, useRef } from 'react';

/**
 * Hero wordmark rendered as a true halftone dot field on canvas.
 *
 * Pipeline: the text is drawn on an offscreen canvas as a stroked outline
 * only (no fill, round joins, stroke width proportional to font size),
 * then gaussian-blurred in three passes: a faint copy offset toward the
 * bottom-right diagonal (directional shadow), a wide faint halo, and the
 * main ring. Brightness is sampled on a 45deg-rotated screen grid and
 * mapped to dot radius through a gamma curve. Max radius exceeds half the
 * grid pitch, so dots on the ring crest overlap and fuse into near-solid
 * white, fading through mid-tone checkerboards into scattered specks.
 *
 * Parameters were calibrated by hand with a temporary tuner panel
 * (2026-07-06) and are baked into PARAMS. On viewports smaller than the
 * calibration baseline, step/blur shrink proportionally with the font
 * size so the letterforms keep enough dots to resolve.
 *
 * Scroll dissolve, one continuous ramp: blur rises across the whole
 * scroll range (the letterforms smear and become progressively less
 * legible) while a brightness sink grows underneath, eroding dots from
 * the faint fringe inward until the word scatters into specks and the
 * field empties. Contrast stays at its calibrated value throughout.
 *
 * Performance: rasterizing + sampling is the expensive part, so sampled
 * brightness fields are cached per blur level. Phase 1 never changes the
 * blur, so the whole contrast ramp re-maps one cached field (sub-ms per
 * step). Phase 2 quantizes blur to 0.5px levels, rasterizes each level
 * once at HALF resolution (the 6px dot grid can't tell the difference),
 * and prewarms missing levels during browser idle time.
 *
 * Mouse interaction is a contrast effect, not a size effect: dot radius
 * stays fixed from the sampling. A virtual light follows the cursor; dots
 * near it render crisp and dots far from it flatten toward a muted gray.
 */

/** Final calibrated parameters (tuner session, Arial Black). */
const PARAMS = {
  step: 6,
  maxRadius: 0.69,
  blur: 5.5,
  contrast: 1.3,
  threshold: 0,
  shadowOffset: 0.12,
  shadowAlpha: 0.5,
  /** 0 disables the stochastic-density fringe. */
  dither: 0,
} as const;

/**
 * Font size (px) at which PARAMS were calibrated. Below it, step and blur
 * scale down proportionally; above it they stay at the calibrated values.
 */
const REF_SIZE = 150;
const MIN_STEP = 3;

/** Scroll dissolve targets: blur ramps over the whole scroll range. */
const BLUR_PEAK = 16;
/**
 * Brightness gain added as blur rises. Blurring dims the field, which
 * would erode dots ahead of schedule; the gain keeps the smearing cloud
 * luminous so the disappearance timeline is governed by the sink alone.
 */
const BLUR_GAIN = 0.6;
/**
 * Brightness subtracted at the end of the dissolve. Must exceed
 * 0.5 + 0.5 * PARAMS.contrast so even the brightest (gain-saturated)
 * cores sink below black and the field is guaranteed empty at the end.
 */
const DISSOLVE_DROP = 1.6;
/**
 * Ease exponent for the sink. Low early values mean the start of the
 * scroll is mostly smearing (legibility loss); erosion accelerates as
 * the scroll advances.
 */
const DROP_EASE = 2.6;
/** Fraction of the viewport height over which the dissolve completes. */
const DISSOLVE_DISTANCE = 0.75;
/** Dissolve progress quantization (steps over the full scroll range). */
const DISSOLVE_STEPS = 50;
/** Offscreen rasterization scale (half res: 4x cheaper, same sampling). */
const RASTER_SCALE = 0.5;
/** Blur cache key quantization in px. */
const BLUR_QUANT = 0.5;

/** Gamma for the brightness -> radius mapping. */
const GAMMA = 0.8;
/** Outline stroke width as a fraction of the font size. */
const STROKE_RATIO = 0.048;
/** Extra letter tracking as a fraction of the font size. */
const TRACKING_RATIO = 0.045;
/** Wide halo pass: blur multiplier and opacity relative to the main pass. */
const HALO_BLUR_MULT = 3;
const HALO_ALPHA = 0.5;
/** Directional shadow pass blur multiplier. */
const SHADOW_BLUR_MULT = 2;
/** Classic halftone screen angle. */
const SCREEN_ANGLE = Math.PI / 4;

const FONT_FAMILY = "'Arial Black', Arial, sans-serif";
const FONT_WEIGHT = 900;

/** Radius of the cursor light in px. */
const LIGHT_SIGMA = 90;
/** Contrast multiplier for dots under the light (crisp). */
const NEAR_CONTRAST = 1.6;
/** Brightness lift under the light. */
const NEAR_LIFT = 0.2;
/** Flattened contrast far from the light. */
const FAR_CONTRAST = 0.35;
/** Gray midpoint that far dots collapse toward. */
const FAR_BASE = 0.62;
/** Grayscale quantization buckets per frame (keeps fillStyle changes cheap). */
const BUCKETS = 24;

interface Dot {
  x: number;
  y: number;
  r: number;
  /** Sampled brightness 0..1 after the tone mapping. */
  lum: number;
}

interface Props {
  lines: readonly string[];
  className?: string;
}

export default function HalftoneHero({ lines, className }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const interactive = finePointer && !reduced;

    // Reused offscreen surface for every rasterization.
    const off = document.createElement('canvas');
    const octx = off.getContext('2d', { willReadFrequently: true });
    if (!octx) return;

    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Layout-derived state (recomputed on resize / font load).
    let fontSize = 0;
    let stepPx = PARAMS.step;
    let maxR = PARAMS.step * PARAMS.maxRadius;
    let blurBase = PARAMS.blur;
    let blurPeak = BLUR_PEAK;
    let gridX: number[] = [];
    let gridY: number[] = [];
    /** Raw sampled brightness per grid cell, keyed by quantized blur px. */
    const fieldCache = new Map<number, Float32Array>();

    // Scroll dissolve progress 0..1, quantized.
    let dissolve = 0;
    let composeQueued = 0;
    let idleHandle = 0;
    let disposed = false;

    // Cursor light state. `presence` blends the whole field between the
    // neutral render (0) and the lit render (1); both it and the light
    // position are lerped in the rAF loop.
    const target = { x: 0, y: 0, presence: 0 };
    const light = { x: 0, y: 0, presence: 0 };
    let raf = 0;
    let running = false;

    const fillCache: string[] = [];
    for (let b = 0; b <= BUCKETS; b++) {
      const v = Math.round((b / BUCKETS) * 255);
      fillCache.push(`rgb(${v},${v},${v})`);
    }

    const applyFont = (size: number) => {
      octx.font = `${FONT_WEIGHT} ${size}px ${FONT_FAMILY}`;
      // letterSpacing needs a value per font size; unsupported browsers
      // just render slightly tighter.
      try {
        octx.letterSpacing = `${size * TRACKING_RATIO}px`;
      } catch {
        /* older engines: property missing */
      }
    };

    /** Measures the wrap, fits the font, and lays out the sampling grid. */
    function layout() {
      const rect = wrap!.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;

      // Fit the font at full resolution, leaving margin for the halo.
      const lineGap = 0.04;
      let size = (height / (lines.length * (1 + lineGap))) * 0.84;
      applyFont(size);
      const widest = Math.max(...lines.map((l) => octx.measureText(l).width));
      if (widest > width * 0.96) size *= (width * 0.96) / widest;
      fontSize = size;

      // Below the calibration baseline, shrink step/blur with the font
      // size; at or above it, use the calibrated values as-is.
      const scale = Math.min(1, fontSize / REF_SIZE);
      stepPx = Math.max(MIN_STEP, PARAMS.step * scale);
      maxR = stepPx * PARAMS.maxRadius;
      blurBase = PARAMS.blur * scale;
      blurPeak = BLUR_PEAK * scale;

      // Sampling grid rotated 45deg around the canvas center.
      const cx = width / 2;
      const cy = height / 2;
      const cosA = Math.cos(SCREEN_ANGLE);
      const sinA = Math.sin(SCREEN_ANGLE);
      const half = Math.hypot(width, height) / 2;
      gridX = [];
      gridY = [];
      for (let v = -half; v <= half; v += stepPx) {
        for (let u = -half; u <= half; u += stepPx) {
          const x = cx + u * cosA - v * sinA;
          const y = cy + u * sinA + v * cosA;
          if (x < 0 || x >= width || y < 0 || y >= height) continue;
          gridX.push(x);
          gridY.push(y);
        }
      }
      fieldCache.clear();
    }

    /**
     * Rasterizes the stroked wordmark at RASTER_SCALE with the given blur
     * and samples raw brightness at every grid cell.
     */
    function renderField(blurPx: number): Float32Array {
      const s = RASTER_SCALE;
      const w = Math.max(1, Math.round(width * s));
      const h = Math.max(1, Math.round(height * s));
      off.width = w;
      off.height = h;

      octx.fillStyle = '#000';
      octx.fillRect(0, 0, w, h);

      const size = fontSize * s;
      applyFont(size);
      octx.strokeStyle = '#fff';
      octx.lineWidth = Math.max(1, size * STROKE_RATIO);
      octx.lineJoin = 'round';
      octx.lineCap = 'round';
      octx.textAlign = 'center';
      octx.textBaseline = 'middle';

      const lineGap = 0.04;
      const totalH = lines.length * size * (1 + lineGap) - size * lineGap;
      const startY = h / 2 - totalH / 2 + size / 2;
      const strokeLines = () => {
        lines.forEach((line, i) => {
          octx.strokeText(line, w / 2, startY + i * size * (1 + lineGap));
        });
      };

      const blur = blurPx * s;
      if (blur > 0) {
        // Faint shadow displaced toward the bottom-right diagonal.
        const shadowOffset = size * PARAMS.shadowOffset;
        octx.globalAlpha = PARAMS.shadowAlpha;
        octx.filter = `blur(${blur * SHADOW_BLUR_MULT}px)`;
        octx.translate(shadowOffset, shadowOffset);
        strokeLines();
        octx.translate(-shadowOffset, -shadowOffset);
        // Wide faint halo, then the main ring on top.
        octx.globalAlpha = HALO_ALPHA;
        octx.filter = `blur(${blur * HALO_BLUR_MULT}px)`;
        strokeLines();
        octx.globalAlpha = 1;
        octx.filter = `blur(${blur}px)`;
      }
      strokeLines();
      octx.filter = 'none';

      const data = octx.getImageData(0, 0, w, h).data;
      const lums = new Float32Array(gridX.length);
      for (let i = 0; i < gridX.length; i++) {
        const sx = Math.min(w - 1, (gridX[i] * s) | 0);
        const sy = Math.min(h - 1, (gridY[i] * s) | 0);
        lums[i] = data[(sy * w + sx) * 4] / 255; // grayscale: red suffices
      }
      return lums;
    }

    function fieldFor(blurPx: number): Float32Array {
      const key = Math.round(blurPx / BLUR_QUANT) * BLUR_QUANT;
      let field = fieldCache.get(key);
      if (!field) {
        field = renderField(key);
        fieldCache.set(key, field);
      }
      return field;
    }

    /** Tone parameters for a given dissolve progress. */
    function toneAt(progress: number) {
      return {
        contrast: PARAMS.contrast,
        blur: blurBase + (blurPeak - blurBase) * progress,
        gain: 1 + BLUR_GAIN * progress,
        drop: DISSOLVE_DROP * Math.pow(progress, DROP_EASE),
      };
    }

    // Deterministic per-cell noise (stable across rebuilds, no shimmer).
    const hash = (a: number, b: number) => {
      const s = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
      return s - Math.floor(s);
    };

    /** Re-maps the cached brightness field into dots. Cheap (~grid size). */
    function compose() {
      const { contrast, blur, gain, drop } = toneAt(dissolve);
      const lums = fieldFor(blur);

      dots = [];
      for (let i = 0; i < lums.length; i++) {
        const raw = Math.min(1, lums[i] * gain);
        let lum = Math.min(1, Math.max(0, 0.5 + (raw - 0.5) * contrast - drop));
        if (lum <= PARAMS.threshold) continue;

        if (lum < PARAMS.dither) {
          // Faint zone: brightness becomes density. Keep the dot with
          // probability ~ lum, and bump survivors so they stay visible.
          const keep = Math.pow(lum / PARAMS.dither, 1.3);
          if (hash(i, i * 7 + 1) > keep) continue;
          lum = PARAMS.dither * (0.55 + 0.45 * (lum / PARAMS.dither));
        }

        const r = Math.pow(lum, GAMMA) * maxR;
        if (r < 0.12) continue;
        dots.push({ x: gridX[i], y: gridY[i], r, lum });
      }
      draw();
    }

    /** Prewarms phase-2 blur levels during idle time so scrolling never
     *  pays for a rasterization. */
    function prewarm() {
      if (disposed) return;
      for (let q = 0; q <= DISSOLVE_STEPS; q++) {
        const { blur } = toneAt(q / DISSOLVE_STEPS);
        const key = Math.round(blur / BLUR_QUANT) * BLUR_QUANT;
        if (!fieldCache.has(key)) {
          fieldCache.set(key, renderField(key));
          scheduleIdle(prewarm); // one level per idle slice
          return;
        }
      }
    }

    function scheduleIdle(fn: () => void) {
      const ric = (window as any).requestIdleCallback as
        | ((cb: () => void) => number)
        | undefined;
      idleHandle = ric ? ric(fn) : (setTimeout(fn, 120) as unknown as number);
    }

    function cancelIdle() {
      const cic = (window as any).cancelIdleCallback as
        | ((h: number) => void)
        | undefined;
      if (cic) cic(idleHandle);
      else clearTimeout(idleHandle);
    }

    function draw() {
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, width, height);

      // Neutral state: no light, every dot plain white.
      if (light.presence < 0.005) {
        ctx!.fillStyle = '#fff';
        ctx!.beginPath();
        for (const d of dots) {
          ctx!.moveTo(d.x + d.r, d.y);
          ctx!.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        }
        ctx!.fill();
        return;
      }

      // Lit state: per-dot grayscale from cursor distance, quantized into
      // buckets so each frame only switches fillStyle a handful of times.
      const sigma2 = 2 * LIGHT_SIGMA * LIGHT_SIGMA;
      const paths: (Path2D | null)[] = new Array(BUCKETS + 1).fill(null);

      for (const d of dots) {
        const dx = d.x - light.x;
        const dy = d.y - light.y;
        const glow = Math.exp(-(dx * dx + dy * dy) / sigma2);

        const near = 0.5 + (d.lum - 0.5) * NEAR_CONTRAST + NEAR_LIFT;
        const far = FAR_BASE + (d.lum - 0.5) * FAR_CONTRAST;
        const lit = far + (near - far) * glow;
        const v = Math.min(1, Math.max(0, 1 + (lit - 1) * light.presence));

        const bucket = Math.round(v * BUCKETS);
        let path = paths[bucket];
        if (!path) {
          path = new Path2D();
          paths[bucket] = path;
        }
        path.moveTo(d.x + d.r, d.y);
        path.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      }

      for (let b = 0; b <= BUCKETS; b++) {
        const path = paths[b];
        if (!path) continue;
        ctx!.fillStyle = fillCache[b];
        ctx!.fill(path);
      }
    }

    function tick() {
      light.x += (target.x - light.x) * 0.18;
      light.y += (target.y - light.y) * 0.18;
      light.presence += (target.presence - light.presence) * 0.12;
      draw();
      const settled =
        Math.abs(target.x - light.x) < 0.3 &&
        Math.abs(target.y - light.y) < 0.3 &&
        Math.abs(target.presence - light.presence) < 0.005;
      if (settled) {
        light.presence = target.presence;
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    }

    function wake() {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    }

    function onMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      // First entry: snap the light to the cursor so it fades in in place
      // instead of sweeping across the canvas.
      if (target.presence === 0) {
        light.x = e.clientX - rect.left;
        light.y = e.clientY - rect.top;
      }
      target.x = e.clientX - rect.left;
      target.y = e.clientY - rect.top;
      target.presence = 1;
      wake();
    }

    function onLeave() {
      target.presence = 0;
      wake();
    }

    function onScroll() {
      const p = Math.min(
        1,
        Math.max(0, window.scrollY / (window.innerHeight * DISSOLVE_DISTANCE)),
      );
      const q = Math.round(p * DISSOLVE_STEPS) / DISSOLVE_STEPS;
      if (q === dissolve) return;
      dissolve = q;
      if (!composeQueued) {
        composeQueued = requestAnimationFrame(() => {
          composeQueued = 0;
          compose();
        });
      }
    }

    function rebuildAll() {
      layout();
      compose();
      if (!reduced) scheduleIdle(prewarm);
    }

    rebuildAll();
    document.fonts?.ready.then(() => !disposed && rebuildAll()).catch(() => {});

    const ro = new ResizeObserver(() => rebuildAll());
    ro.observe(wrap);

    if (interactive) {
      wrap.addEventListener('pointermove', onMove);
      wrap.addEventListener('pointerleave', onLeave);
    }
    if (!reduced) {
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(composeQueued);
      cancelIdle();
      ro.disconnect();
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('scroll', onScroll);
    };
  }, [lines]);

  return (
    <div ref={wrapRef} className={className} aria-hidden="true">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
