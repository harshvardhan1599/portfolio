// Dither kernel — the pure math behind the band. No DOM, no React, no state of
// its own: given a frame's worth of already-advanced inputs it fills a
// Uint8Array of palette indices (see config.ts for the index layout).
//
// This is the single source of truth for the pattern. The animation engine
// renders it to a canvas; the server poster runs the very same function at
// t = 0 to bake the pre-hydration first frame into the HTML. Keep it that way —
// two copies of this arithmetic would drift and the handoff would visibly pop.

import type { DitherConfig } from "./config";
import { IDX_BASE, IDX_EMBER0, IDX_WHITE } from "./config";

// cheap hash-based value noise (smoothstep-interpolated), 0..1.
export function hash(x: number, y: number) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}
export function noise2(x: number, y: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const tl = hash(xi, yi);
  const tr = hash(xi + 1, yi);
  const bl = hash(xi, yi + 1);
  const br = hash(xi + 1, yi + 1);
  return (tl * (1 - u) + tr * u) * (1 - v) + (bl * (1 - u) + br * u) * v;
}

// Click ripples: concentric waves expanding from the click point.
export const RIPPLE_LIFE = 1.6; // s
export const RIPPLE_SPEED = 900; // px/s expanding front
export const RIPPLE_K = (2 * Math.PI) / 100; // ring spacing ~100px
export const RIPPLE_OMEGA = RIPPLE_K * RIPPLE_SPEED; // phase speed = wave speed
export const RIPPLE_AMP = 0.3; // heat perturbation
export const RIPPLE_FALLOFF = 900; // px spatial decay

// Per-frame ripple snapshot, owned and advanced by the engine. Pre-allocated
// so the per-cell loop stays allocation-free.
export interface RippleSnapshot {
  count: number;
  x: Float32Array;
  y: Float32Array;
  front: Float32Array; // px the front has reached
  tEnv: Float32Array; // temporal fade 1→0
  phase: Float32Array; // age * omega
}

export const NO_RIPPLES: RippleSnapshot = {
  count: 0,
  x: new Float32Array(0),
  y: new Float32Array(0),
  front: new Float32Array(0),
  tEnv: new Float32Array(0),
  phase: new Float32Array(0),
};

// --- lattice cache ---------------------------------------------------------
//
// The two noise octaves are only ever sampled at INTEGER lattice points, and
// there are far fewer of those than there are cells: at 1440px wide the band
// makes 5,544 hash() calls per frame to visit 915 distinct lattice points, and
// only ~7 (octave 1) / ~13 (octave 2) lattice ROWS are live at any instant.
//
// So cache whole lattice rows, keyed by their integer y. As flameScroll drifts,
// one new row enters and one falls out; everything else is a hit. That takes
// Math.sin from ~337,000/sec to roughly 100/sec. Because the cache stores the
// exact same fract(sin(...)) values the direct path would compute, the output is
// bit-identical — not merely similar.

interface Octave {
  xi: Int32Array; // per column: floor of the x sample
  u: Float64Array; // per column: smoothstep of the x fraction
  xBase: number; // xi[0] — the ring rows are indexed from here
  xLen: number; // columns per ring row (covers xi[cols-1] + 1)
  mask: number; // K - 1, K a power of two > the live row span
  rows: Float64Array[]; // K lattice rows
  key: Int32Array; // the integer y each slot currently holds
}

const NO_KEY = 0x7fffffff; // sentinel — 0 is a legitimate key on the first frame

export interface NoiseCache {
  o1: Octave;
  o2: Octave;
  cols: number;
  rows: number;
  noiseScale: number;
  // resolved ember index per cell; only changes when the ember phase ticks over
  emberIdx: Uint8Array;
  emberKey: number;
  emberCount: number;
}

function emptyOctave(): Octave {
  return {
    xi: new Int32Array(0),
    u: new Float64Array(0),
    xBase: 0,
    xLen: 0,
    mask: 0,
    rows: [],
    key: new Int32Array(0),
  };
}

export function createNoiseCache(): NoiseCache {
  return {
    o1: emptyOctave(),
    o2: emptyOctave(),
    cols: -1,
    rows: -1,
    noiseScale: NaN,
    emberIdx: new Uint8Array(0),
    emberKey: NO_KEY,
    emberCount: -1,
  };
}

function buildOctave(
  o: Octave,
  cols: number,
  rows: number,
  ax: number,
  ox: number,
  ay: number,
  noiseScale: number,
): Octave {
  o.xi = new Int32Array(cols);
  o.u = new Float64Array(cols);
  for (let cx = 0; cx < cols; cx++) {
    // Operand order must match the direct expression exactly. Floating-point
    // multiplication is not associative: cx * 0.35 * ns and cx * (0.35 * ns)
    // can differ in the last bit, which is enough to flip a threshold and put
    // a stray cell in a different color.
    const x = cx * ax * noiseScale + ox;
    const xi = Math.floor(x);
    const xf = x - xi;
    o.xi[cx] = xi;
    o.u[cx] = xf * xf * (3 - 2 * xf);
  }
  o.xBase = o.xi[0];
  o.xLen = o.xi[cols - 1] + 1 - o.xBase + 1;

  // Live rows within one frame span at most ceil((rows-1)*ay*ns); +2 covers the
  // yi+1 neighbour and the boundary. Round up to a power of two so `& mask`
  // works for negative y (flameScroll drives yi negative).
  const span = Math.ceil(Math.abs(rows - 1) * Math.abs(ay * noiseScale)) + 2;
  let k = 2;
  while (k < span) k <<= 1;
  o.mask = k - 1;
  o.rows = Array.from({ length: k }, () => new Float64Array(o.xLen));
  o.key = new Int32Array(k).fill(NO_KEY);
  return o;
}

function latticeRow(o: Octave, yi: number): Float64Array {
  const s = yi & o.mask; // works for negative yi, unlike %
  const r = o.rows[s];
  if (o.key[s] !== yi) {
    const base = o.xBase;
    for (let i = 0; i < o.xLen; i++) {
      const n = Math.sin((base + i) * 127.1 + yi * 311.7) * 43758.5453;
      r[i] = n - Math.floor(n);
    }
    o.key[s] = yi;
  }
  return r;
}

/** Rebuild the x-side tables and drop every cached row. Self-healing: called
 *  from computeCells whenever the geometry or noise scale changes. */
export function resizeNoiseCache(
  cache: NoiseCache,
  cols: number,
  rows: number,
  noiseScale: number,
) {
  buildOctave(cache.o1, cols, rows, 0.35, 0, 0.5, noiseScale);
  buildOctave(cache.o2, cols, rows, 0.9, 5.2, 1.1, noiseScale);
  cache.cols = cols;
  cache.rows = rows;
  cache.noiseScale = noiseScale;
  cache.emberIdx = new Uint8Array(cols * rows);
  cache.emberKey = NO_KEY;
  cache.emberCount = -1;
}

// Everything a frame needs, with all time-advancement already applied by the
// caller. Pure in / pure out.
export interface FrameInput {
  cfg: DitherConfig;
  cols: number;
  rows: number;
  flameScroll: number;
  emberPhase: number;
  /** pointer in CSS px local to the band, or null when it's off the band */
  pointer: { x: number; y: number } | null;
  /** pointer-velocity flare, 0 when still */
  flare: number;
  /** decaying per-cell warmth the pointer deposits; null under reduced motion */
  warm: Float32Array | null;
  ripples: RippleSnapshot;
  /** length of the live ember palette (0 disables embers) */
  emberCount: number;
}


/**
 * Evaluate one frame into `out` (length cols*rows) as palette indices.
 * Every cell is written, so `out` never needs clearing. `cache` is rebuilt
 * automatically when the geometry or noise scale changes.
 */
export function computeCells(
  f: FrameInput,
  out: Uint8Array,
  cache: NoiseCache,
) {
  const {
    cell,
    intensity,
    emberAmount,
    noiseScale,
    fade,
    stokeStrength,
    stokeRadius,
    travel,
  } = f.cfg;
  const { cols, rows, flameScroll, emberPhase, pointer: p, flare, warm } = f;
  const emberCount = f.emberCount;
  const rip = f.ripples;

  if (
    cache.cols !== cols ||
    cache.rows !== rows ||
    cache.noiseScale !== noiseScale
  ) {
    resizeNoiseCache(cache, cols, rows, noiseScale);
  }
  const o1 = cache.o1;
  const o2 = cache.o2;

  const emberThreshold = 1 - emberAmount; // higher amount → more embers
  const k = 1 / Math.max(0.15, fade); // transition steepness
  const emberRow = Math.floor(emberPhase * 0.6);

  // Which ember each cell would show, resolved only when the phase ticks over
  // (~every 2.2s at default speed) instead of hashing 74 cells every frame.
  const emberIdx = cache.emberIdx;
  if (
    emberCount > 0 &&
    (cache.emberKey !== emberRow || cache.emberCount !== emberCount)
  ) {
    for (let cy = 0; cy < rows; cy++) {
      const row = cy * cols;
      const ey = cy * 1.7 + emberRow;
      for (let cx = 0; cx < cols; cx++) {
        const e = Math.floor(hash(cx * 3.1, ey) * emberCount);
        emberIdx[row + cx] = e > emberCount - 1 ? emberCount - 1 : e;
      }
    }
    cache.emberKey = emberRow;
    cache.emberCount = emberCount;
  }

  // cursor "stoke": boost heat for cells near the pointer
  const pcol = p ? p.x / cell : 0;
  const prow = p ? p.y / cell : 0;
  const stokeR2x2 = 2 * stokeRadius * stokeRadius;

  for (let cy = 0; cy < rows; cy++) {
    const vNorm = (cy + 0.5) / rows; // 0 top .. 1 bottom
    let blackness = 0.5 + (0.5 - vNorm) * k;
    if (blackness < 0) blackness = 0;
    if (blackness > 1) blackness = 1;
    const row = cy * cols;

    // Lattice rows for this cell row. Same expressions as the direct noise2
    // sample — only the four corner lookups are hoisted out of the cell loop.
    const y1 = cy * 0.5 * noiseScale - flameScroll * 1.2;
    const y1i = Math.floor(y1);
    const y1f = y1 - y1i;
    const v1 = y1f * y1f * (3 - 2 * y1f);
    const r1a = latticeRow(o1, y1i);
    const r1b = latticeRow(o1, y1i + 1);

    let v2 = 0;
    let r2a: Float64Array = r1a;
    let r2b: Float64Array = r1b;
    if (!travel) {
      const y2 = cy * 1.1 * noiseScale - flameScroll * 2.0;
      const y2i = Math.floor(y2);
      const y2f = y2 - y2i;
      v2 = y2f * y2f * (3 - 2 * y2f);
      r2a = latticeRow(o2, y2i);
      r2b = latticeRow(o2, y2i + 1);
    }

    for (let cx = 0; cx < cols; cx++) {
      const j1 = o1.xi[cx] - o1.xBase;
      const u1 = o1.u[cx];
      const n1 =
        (r1a[j1] * (1 - u1) + r1a[j1 + 1] * u1) * (1 - v1) +
        (r1b[j1] * (1 - u1) + r1b[j1 + 1] * u1) * v1;
      // travel mode drops the 2nd octave (half the trig) — imperceptible
      // while the strip's motion dominates, frees the main thread.
      let heat: number;
      if (travel) {
        heat = n1;
      } else {
        const j2 = o2.xi[cx] - o2.xBase;
        const u2 = o2.u[cx];
        const n2 =
          (r2a[j2] * (1 - u2) + r2a[j2 + 1] * u2) * (1 - v2) +
          (r2b[j2] * (1 - u2) + r2b[j2 + 1] * u2) * v2;
        heat = n1 * 0.7 + n2 * 0.3;
      }
      if (p) {
        const dx = cx - pcol;
        let dy = cy - prow;
        dy *= dy < 0 ? 0.62 : 1.55; // convective: reach up, hug down (A)
        heat +=
          Math.exp(-(dx * dx + dy * dy) / stokeR2x2) *
          stokeStrength *
          (1 + flare); // velocity flare (C)
      }
      if (warm) heat += warm[row + cx] * 0.85; // lingering warmth (B)
      // click ripples: concentric expanding rings across the whole band
      if (rip.count > 0) {
        const cxp = (cx + 0.5) * cell;
        const cyp = (cy + 0.5) * cell;
        for (let ri = 0; ri < rip.count; ri++) {
          const dxp = cxp - rip.x[ri];
          const dyp = cyp - rip.y[ri];
          const dd = Math.sqrt(dxp * dxp + dyp * dyp);
          if (dd > rip.front[ri]) continue; // wave hasn't arrived yet
          heat +=
            RIPPLE_AMP *
            Math.sin(dd * RIPPLE_K - rip.phase[ri]) *
            rip.tEnv[ri] *
            Math.exp(-dd / RIPPLE_FALLOFF);
        }
      }
      if (heat > 1) heat = 1;
      const threshold = 0.5 + (heat - 0.5) * intensity;

      let isBlack = blackness > threshold;
      if (cy === 0) isBlack = true; // top row flush with the hero
      if (cy === rows - 1) isBlack = blackness > threshold + 0.15;

      if (!isBlack) {
        out[row + cx] = IDX_WHITE;
        continue;
      }

      const nearEdge =
        Math.abs(blackness - threshold) <
        0.13 + (warm ? warm[row + cx] * 0.08 : 0);
      let idx = IDX_BASE;
      if (nearEdge && heat > emberThreshold && emberCount) {
        idx = IDX_EMBER0 + emberIdx[row + cx];
      }
      out[row + cx] = idx;
    }
  }
}
