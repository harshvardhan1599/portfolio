// Dither engine — everything stateful and DOM-facing about the band: the rAF
// clock, the canvas, the pointer's heat and ripples. The pattern itself lives in
// kernel.ts; this file advances time and paints the result.
//
// It attaches to a canvas it does NOT own. The canvas is server-rendered into
// [data-dither-slot] and already carries a baked first frame (see poster.ts), so
// the band is on screen long before this code loads. Attaching must therefore be
// seamless: `createDither` sizes and draws synchronously with dt = 0, which
// reproduces the baked frame exactly, then starts the loop from there.
//
// The canvas node is also persistent across navigation — DitherStage re-parents
// it into a travel strip and back — so nothing here may close over the parent.
// Width, resize observation and pointer geometry are all re-read on retarget().

import {
  activeEmbers,
  DITHER_DEFAULTS,
  IDX_WHITE,
  packColor,
  WHITE,
  type DitherConfig,
} from "./config";
import {
  computeCells,
  createNoiseCache,
  RIPPLE_LIFE,
  RIPPLE_OMEGA,
  RIPPLE_SPEED,
  type FrameInput,
  type RippleSnapshot,
} from "./kernel";

// How the cols×rows bitmap reaches the screen.
//   "bitmap"  — the canvas IS cols×rows, CSS-upscaled with image-rendering:
//               pixelated. Cheapest: a ~3KB texture instead of ~5MB.
//   "upscale" — draw the bitmap into a DPR-sized canvas with smoothing off.
//               Fallback for engines that blur a pixelated upscale inside a
//               composited layer; keeps every win except the small texture.
const PRESENT: "bitmap" | "upscale" = "bitmap";

const MAX_RIPPLES = 8;

export interface DitherDriver {
  setConfig: (c: Partial<DitherConfig>) => void;
  /** re-measure and re-observe after the canvas has been moved to a new parent */
  retarget: () => void;
  destroy: () => void;
}

export function createDither(
  canvas: HTMLCanvasElement,
  init?: Partial<DitherConfig>,
): DitherDriver | null {
  // alpha:false — every pixel is written every frame, so there is nothing to
  // blend. On the server-rendered canvas the boot script has already created
  // the context (with the same attributes); these options are then ignored and
  // the existing context is returned, which is exactly what we want.
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return null;

  const cfg: DitherConfig = { ...DITHER_DEFAULTS, ...init };
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --- geometry + buffers ---------------------------------------------------
  let width = 0;
  let cols = 0;
  let rows = 0;
  let img: ImageData | null = null;
  let u32: Uint32Array | null = null;
  let cellIdx: Uint8Array | null = null;
  // "upscale" mode only: the cols×rows source we blit from.
  let tiny: HTMLCanvasElement | null = null;
  let tinyCtx: CanvasRenderingContext2D | null = null;

  let palette = new Uint32Array(2);
  let emberCount = 0;
  let paletteDirty = true;
  // Lattice hash cache — rebuilt by computeCells when geometry/noiseScale change.
  const noise = createNoiseCache();

  const rebuildPalette = () => {
    const embers = activeEmbers(cfg);
    emberCount = embers.length;
    palette = new Uint32Array(2 + emberCount);
    palette[IDX_WHITE] = packColor(WHITE);
    palette[1] = packColor(cfg.baseColor);
    for (let i = 0; i < emberCount; i++) palette[2 + i] = packColor(embers[i]);
  };

  // --- animation state ------------------------------------------------------
  // Flame phase accumulators advance by dt*rate (never absoluteTime*rate), so
  // changing speed/riseSpeed only changes the RATE — the pattern never jumps.
  let flameScroll = 0;
  let emberPhase = 0;
  let lastT = 0;

  // Cursor warmth field: a decaying per-cell heat grid the pointer deposits
  // into, so the fire remembers where it's been and cools gracefully.
  let warm: Float32Array | null = null;
  let warmMax = 0; // guard: skip the decay pass when the field is cold
  let pointer: { x: number; y: number } | null = null;
  let lastP: { x: number; y: number; t: number } | null = null;
  let vx = 0;
  let vy = 0;

  const ripples = Array.from({ length: MAX_RIPPLES }, () => ({
    x: 0,
    y: 0,
    birth: -999,
  }));
  let liveRipples = 0;
  const snap: RippleSnapshot = {
    count: 0,
    x: new Float32Array(MAX_RIPPLES),
    y: new Float32Array(MAX_RIPPLES),
    front: new Float32Array(MAX_RIPPLES),
    tEnv: new Float32Array(MAX_RIPPLES),
    phase: new Float32Array(MAX_RIPPLES),
  };

  const frame: FrameInput = {
    cfg,
    cols: 0,
    rows: 0,
    flameScroll: 0,
    emberPhase: 0,
    pointer: null,
    flare: 0,
    warm: null,
    ripples: snap,
    emberCount: 0,
  };

  // --- sizing ---------------------------------------------------------------
  const parentWidth = () => {
    const p = canvas.parentElement;
    const w = p ? p.clientWidth : 0;
    return w > 0 ? w : width;
  };

  const resize = () => {
    width = parentWidth();
    const { cell, height } = cfg;
    const nc = Math.max(1, Math.ceil(width / cell));
    const nr = Math.max(1, Math.ceil(height / cell));

    if (nc !== cols || nr !== rows || !img) {
      cols = nc;
      rows = nr;
      img = new ImageData(cols, rows);
      u32 = new Uint32Array(img.data.buffer);
      cellIdx = new Uint8Array(cols * rows);
      warm = null; // the warmth field is per-geometry
      warmMax = 0;
      if (PRESENT === "upscale") {
        if (!tiny) {
          tiny = document.createElement("canvas");
          tinyCtx = tiny.getContext("2d");
        }
        tiny.width = cols;
        tiny.height = rows;
      }
    }

    if (PRESENT === "bitmap") {
      // Assigning canvas.width ALWAYS clears the bitmap, even to the same
      // value — that would wipe the server-baked frame on attach.
      if (canvas.width !== cols) canvas.width = cols;
      if (canvas.height !== rows) canvas.height = rows;
      canvas.style.width = `${cols * cell}px`;
      canvas.style.height = `${rows * cell}px`;
      canvas.style.imageRendering = "pixelated";
    } else {
      const dw = Math.round(width * dpr);
      const dh = Math.round(height * dpr);
      if (canvas.width !== dw) canvas.width = dw;
      if (canvas.height !== dh) canvas.height = dh;
      canvas.style.width = "100%";
      canvas.style.height = `${height}px`;
    }
    canvas.style.display = "block";

    const p = canvas.parentElement;
    if (p && p.style.height !== `${height}px`) p.style.height = `${height}px`;
  };

  // --- one frame ------------------------------------------------------------
  const draw = (timeSec: number) => {
    if (!img || !u32 || !cellIdx) return;
    if (paletteDirty) {
      rebuildPalette();
      paletteDirty = false;
    }

    const dt = Math.min(0.05, Math.max(0, timeSec - lastT));
    lastT = timeSec;
    flameScroll += dt * cfg.speed * cfg.riseSpeed;
    emberPhase += dt * cfg.speed;

    // Lingering warmth (B) + velocity flare (C) — motion only.
    let flare = 0;
    if (!reduced) {
      if (!warm || warm.length !== cols * rows) {
        warm = new Float32Array(cols * rows);
        warmMax = 0;
      }
      const field = warm;
      if (warmMax > 0.004 || pointer) {
        const decay = Math.exp(-dt / 0.7); // ~0.7s cool-down time constant
        warmMax = 0;
        for (let i = 0; i < field.length; i++) {
          const v = field[i] * decay;
          field[i] = v;
          if (v > warmMax) warmMax = v;
        }
      }
      if (pointer) {
        const pcol = pointer.x / cfg.cell;
        const prow = pointer.y / cfg.cell;
        const stokeR2x2 = 2 * cfg.stokeRadius * cfg.stokeRadius;
        const pspeed = Math.hypot(vx, vy) / cfg.cell; // cells/sec
        flare = Math.min(0.4, pspeed * 0.015);
        if (lastP && timeSec - lastP.t > 0.1) {
          vx *= 0.8; // decay velocity if the pointer stopped emitting events
          vy *= 0.8;
        }
        const R = Math.ceil(cfg.stokeRadius * 2);
        const gy0 = Math.max(0, Math.floor(prow) - R);
        const gy1 = Math.min(rows - 1, Math.floor(prow) + R);
        const gx0 = Math.max(0, Math.floor(pcol) - R);
        const gx1 = Math.min(cols - 1, Math.floor(pcol) + R);
        for (let gy = gy0; gy <= gy1; gy++) {
          for (let gx = gx0; gx <= gx1; gx++) {
            const ddx = gx - pcol;
            const ddy = gy - prow;
            const g = Math.exp(-(ddx * ddx + ddy * ddy) / stokeR2x2);
            const i = gy * cols + gx;
            // saturating deposit: hover-camping plateaus instead of blowing out
            const w = Math.min(0.55, field[i] + g * dt * (2.2 + flare * 3));
            field[i] = w;
            if (w > warmMax) warmMax = w;
          }
        }
      }
    }

    // Prune expired ripples (swap-remove), then snapshot per-frame invariants.
    for (let ri = 0; ri < liveRipples; ri++) {
      if (timeSec - ripples[ri].birth > RIPPLE_LIFE) {
        liveRipples--;
        const tmp = ripples[ri];
        ripples[ri] = ripples[liveRipples];
        ripples[liveRipples] = tmp;
        ri--;
      }
    }
    for (let ri = 0; ri < liveRipples; ri++) {
      const age = timeSec - ripples[ri].birth;
      snap.x[ri] = ripples[ri].x;
      snap.y[ri] = ripples[ri].y;
      snap.front[ri] = RIPPLE_SPEED * age;
      snap.tEnv[ri] = 1 - age / RIPPLE_LIFE;
      snap.phase[ri] = age * RIPPLE_OMEGA;
    }
    snap.count = liveRipples;

    frame.cols = cols;
    frame.rows = rows;
    frame.flameScroll = flameScroll;
    frame.emberPhase = emberPhase;
    frame.pointer = pointer;
    frame.flare = flare;
    frame.warm = reduced ? null : warm;
    frame.emberCount = emberCount;

    computeCells(frame, cellIdx, noise);

    const n = cols * rows;
    for (let i = 0; i < n; i++) u32[i] = palette[cellIdx[i]];

    if (PRESENT === "bitmap") {
      ctx.putImageData(img, 0, 0);
    } else if (tiny && tinyCtx) {
      tinyCtx.putImageData(img, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(tiny, 0, 0, cols * cfg.cell * dpr, rows * cfg.cell * dpr);
    }
  };

  // --- rAF lifecycle --------------------------------------------------------
  // Stop the loop outright when the band can't be seen, rather than ticking an
  // empty callback. dt is capped at 0.05 so resuming never jumps the phase.
  let raf = 0;
  let running = false;
  let tick = 0;
  let onScreen = true;
  let docVisible = !document.hidden;

  const shouldRun = () =>
    !reduced && (cfg.travel || (onScreen && docVisible && canvas.isConnected));

  const loop = () => {
    raf = requestAnimationFrame(loop);
    tick++;
    // travel mode draws at ~30fps (every other frame): a discrete-cell flame
    // reads identically, and each skipped frame is budget for the page mount.
    if (cfg.travel && tick % 2 !== 0) return;
    draw(performance.now() / 1000);
  };

  const start = () => {
    if (running || !shouldRun()) return;
    running = true;
    raf = requestAnimationFrame(loop);
  };
  const stop = () => {
    if (!running) return;
    running = false;
    cancelAnimationFrame(raf);
  };
  const sync = () => (shouldRun() ? start() : stop());

  // Reduced motion still reacts to the cursor, but coalesced into one frame
  // rather than a synchronous repaint per pointer event.
  let staticRaf = 0;
  const requestStatic = () => {
    if (staticRaf) return;
    staticRaf = requestAnimationFrame(() => {
      staticRaf = 0;
      draw(lastT);
    });
  };

  // --- observers + input ----------------------------------------------------
  const ro = new ResizeObserver(() => {
    resize();
    if (reduced) requestStatic();
  });
  let observed: Element | null = null;
  const observeParent = () => {
    const p = canvas.parentElement;
    if (p === observed) return;
    if (observed) ro.unobserve(observed);
    if (p) ro.observe(p);
    observed = p;
  };

  const io = new IntersectionObserver(
    ([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    },
    { rootMargin: "100px" },
  );
  io.observe(canvas); // the canvas survives re-parenting; its wrapper doesn't

  const onVisibility = () => {
    docVisible = !document.hidden;
    sync();
  };
  document.addEventListener("visibilitychange", onVisibility);

  const onPointerMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const now = performance.now() / 1000;
    if (lastP) {
      const dtp = Math.max(1e-3, now - lastP.t);
      const a = 0.25; // low-pass so jittery input doesn't strobe the flare
      vx += ((x - lastP.x) / dtp - vx) * a;
      vy += ((y - lastP.y) / dtp - vy) * a;
    }
    lastP = { x, y, t: now };
    pointer = { x, y };
    if (reduced) requestStatic();
  };
  const onPointerLeave = () => {
    pointer = null;
    vx = 0;
    vy = 0;
    lastP = null; // keep `warm` decaying — that's the graceful cool-down
    if (reduced) requestStatic();
  };
  const onPointerDown = (e: PointerEvent) => {
    if (reduced || liveRipples >= MAX_RIPPLES) return;
    const r = canvas.getBoundingClientRect();
    const rp = ripples[liveRipples++];
    rp.x = e.clientX - r.left;
    rp.y = e.clientY - r.top;
    rp.birth = performance.now() / 1000;
  };

  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerleave", onPointerLeave);
  canvas.addEventListener("pointerdown", onPointerDown);

  // --- boot -----------------------------------------------------------------
  // Seed the clock BEFORE the first draw so dt === 0 and flameScroll stays at 0:
  // that first frame is then bit-identical to the server-baked one, and the
  // handoff from baked pixels to live animation is invisible.
  observeParent();
  resize();
  lastT = performance.now() / 1000;
  draw(lastT);
  if (!reduced) start();

  return {
    setConfig(c) {
      const geometry = c.cell !== undefined || c.height !== undefined;
      if (
        c.baseColor !== undefined ||
        c.embers !== undefined ||
        c.yellow !== undefined ||
        c.purple !== undefined ||
        c.blue !== undefined ||
        c.orange !== undefined
      ) {
        paletteDirty = true;
      }
      Object.assign(cfg, c);
      if (geometry) resize();
      sync(); // e.g. travel toggled on while the band is scrolled away
      if (reduced) requestStatic();
    },
    retarget() {
      observeParent();
      resize();
      sync();
      if (reduced) requestStatic();
    },
    destroy() {
      stop();
      cancelAnimationFrame(staticRaf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("pointerdown", onPointerDown);
    },
  };
}
