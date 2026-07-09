"use client";

// Animated pixel-dither band bridging the dark hero into the white section.
// A canvas draws a grid of square cells that dissolve black (top, hero color)
// → white (bottom, section) with a fire-like flicker: a value-noise field
// scrolls upward so the boundary licks and shimmers, and colored embers spark
// near the transition. Exposes setConfig() so a dev panel tunes it live.

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export interface DitherConfig {
  cell: number; // square size, px
  height: number; // band height, px
  speed: number; // overall animation speed
  intensity: number; // fire/flicker turbulence
  emberAmount: number; // how many ember (colored) cells, 0..1
  riseSpeed: number; // how fast the flame field scrolls up
  noiseScale: number; // flame feature frequency (bigger = busier)
  fade: number; // black→white transition softness (bigger = softer)
  stokeStrength: number; // cursor hover: added heat at the pointer
  stokeRadius: number; // cursor hover: influence radius, in cells
  // ember palette toggles
  yellow: boolean;
  purple: boolean;
  blue: boolean;
  orange: boolean;
}

export interface DitherBandHandle {
  setConfig: (c: Partial<DitherConfig>) => void;
}

export const DITHER_DEFAULTS: DitherConfig = {
  cell: 23,
  height: 232,
  speed: 0.75,
  intensity: 0.95,
  emberAmount: 0.5,
  riseSpeed: 1,
  noiseScale: 1,
  fade: 1,
  stokeStrength: 0.4,
  stokeRadius: 2,
  yellow: true,
  purple: true,
  blue: true,
  orange: true,
};

export const BLACK = "#171718"; // matches dark --background (hero) for a seamless seam
export const WHITE = "#FFFFFF"; // matches .surface-light --background

// ember palette (order matters for the toggle list in DitherSettings)
export const EMBER_COLORS: Record<string, string> = {
  yellow: "#EBCB5A",
  purple: "#8B5CF6",
  blue: "#4C7EF3",
  orange: "#F5893B",
};

// cheap hash-based value noise (smoothstep-interpolated), 0..1.
// Exported so the custom cursor can sample the SAME field for its dither chip.
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

export const DitherBand = forwardRef<DitherBandHandle, Partial<DitherConfig>>(
  function DitherBand(props, ref) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cfgRef = useRef<DitherConfig>({ ...DITHER_DEFAULTS, ...props });
    // pointer position in CSS-px local to the wrapper (null when off the band);
    // read each frame to stoke the fire near the cursor.
    const pointerRef = useRef<{ x: number; y: number } | null>(null);

    useImperativeHandle(ref, () => ({
      setConfig(c) {
        cfgRef.current = { ...cfgRef.current, ...c };
        if (wrapRef.current) {
          wrapRef.current.style.height = `${cfgRef.current.height}px`;
        }
      },
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      const wrap = wrapRef.current;
      if (!canvas || !wrap) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      let width = wrap.clientWidth;

      // Cursor warmth field (a decaying per-cell heat grid the pointer deposits
      // into), smoothed velocity, and dt tracking — all closure-scoped, no
      // re-renders, no per-frame allocations.
      let warm: Float32Array | null = null;
      let warmCols = 0;
      let warmRows = 0;
      let warmMax = 0; // guard: skip the decay pass when the field is cold
      let lastT = 0;
      let lastP: { x: number; y: number; t: number } | null = null;
      let vx = 0;
      let vy = 0;

      const resize = () => {
        width = wrap.clientWidth;
        const h = cfgRef.current.height;
        wrap.style.height = `${h}px`;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(h * dpr);
        canvas.style.width = "100%";
        canvas.style.height = `${h}px`;
      };

      const activeEmbers = () => {
        const c = cfgRef.current;
        const out: string[] = [];
        if (c.yellow) out.push(EMBER_COLORS.yellow);
        if (c.purple) out.push(EMBER_COLORS.purple);
        if (c.blue) out.push(EMBER_COLORS.blue);
        if (c.orange) out.push(EMBER_COLORS.orange);
        return out;
      };

      const draw = (timeSec: number) => {
        const {
          cell,
          height,
          speed,
          intensity,
          emberAmount,
          riseSpeed,
          noiseScale,
          fade,
          stokeStrength,
          stokeRadius,
        } = cfgRef.current;
        const t = timeSec * speed;
        const cols = Math.ceil(width / cell);
        const rows = Math.max(1, Math.ceil(height / cell));
        const px = cell * dpr;
        const embers = activeEmbers();
        const emberThreshold = 1 - emberAmount; // higher amount → more embers
        const k = 1 / Math.max(0.15, fade); // transition steepness

        // cursor "stoke": boost heat for cells near the pointer
        const p = pointerRef.current;
        const pcol = p ? p.x / cell : 0;
        const prow = p ? p.y / cell : 0;
        const stokeR2x2 = 2 * stokeRadius * stokeRadius;

        // Lingering warmth (B) + velocity flare (C) — motion only. The pointer
        // deposits into a decaying heat field so the fire remembers where it's
        // been (an ember trail) and cools gracefully when the cursor leaves.
        const dt = Math.min(0.05, Math.max(0, timeSec - lastT));
        lastT = timeSec;
        let flare = 0;
        if (!reduced) {
          if (!warm || warmCols !== cols || warmRows !== rows) {
            warm = new Float32Array(cols * rows);
            warmCols = cols;
            warmRows = rows;
            warmMax = 0;
          }
          const field = warm;
          if (warmMax > 0.004 || p) {
            const decay = Math.exp(-dt / 0.7); // ~0.7s cool-down time constant
            warmMax = 0;
            for (let i = 0; i < field.length; i++) {
              const v = field[i] * decay;
              field[i] = v;
              if (v > warmMax) warmMax = v;
            }
          }
          if (p) {
            const speed = Math.hypot(vx, vy) / cell; // cells/sec
            flare = Math.min(0.4, speed * 0.015);
            if (lastP && timeSec - lastP.t > 0.1) {
              vx *= 0.8; // decay velocity if the pointer stopped emitting events
              vy *= 0.8;
            }
            const R = Math.ceil(stokeRadius * 2);
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
        const warmField = reduced ? null : warm;

        ctx.fillStyle = WHITE;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let cy = 0; cy < rows; cy++) {
          const vNorm = (cy + 0.5) / rows; // 0 top .. 1 bottom
          let blackness = 0.5 + (0.5 - vNorm) * k;
          if (blackness < 0) blackness = 0;
          if (blackness > 1) blackness = 1;

          for (let cx = 0; cx < cols; cx++) {
            const n1 = noise2(
              cx * 0.35 * noiseScale,
              cy * 0.5 * noiseScale - t * 1.2 * riseSpeed,
            );
            const n2 = noise2(
              cx * 0.9 * noiseScale + 5.2,
              cy * 1.1 * noiseScale - t * 2.0 * riseSpeed,
            );
            let heat = n1 * 0.7 + n2 * 0.3;
            if (p) {
              const dx = cx - pcol;
              let dy = cy - prow;
              dy *= dy < 0 ? 0.62 : 1.55; // convective: reach up, hug down (A)
              heat +=
                Math.exp(-(dx * dx + dy * dy) / stokeR2x2) *
                stokeStrength *
                (1 + flare); // velocity flare (C)
            }
            if (warmField) heat += warmField[cy * cols + cx] * 0.85; // warmth (B)
            if (heat > 1) heat = 1;
            const threshold = 0.5 + (heat - 0.5) * intensity;

            let isBlack = blackness > threshold;
            if (cy === 0) isBlack = true; // top row flush with the hero
            if (cy === rows - 1) isBlack = blackness > threshold + 0.15;

            if (!isBlack) continue; // white cells: leave the white backdrop

            const nearEdge =
              Math.abs(blackness - threshold) <
              0.13 + (warmField ? warmField[cy * cols + cx] * 0.08 : 0);
            let color = BLACK;
            if (nearEdge && heat > emberThreshold && embers.length) {
              const idx = Math.floor(
                hash(cx * 3.1, cy * 1.7 + Math.floor(t * 0.6)) * embers.length,
              );
              color = embers[Math.min(idx, embers.length - 1)];
            }

            ctx.fillStyle = color;
            ctx.fillRect(
              Math.round(cx * px),
              Math.round(cy * px),
              Math.ceil(px) + 1,
              Math.ceil(px) + 1,
            );
          }
        }
      };

      let raf = 0;
      const loop = () => {
        draw(performance.now() / 1000);
        raf = requestAnimationFrame(loop);
      };

      resize();
      if (reduced) {
        draw(0); // static frame, respects reduced-motion
      } else {
        raf = requestAnimationFrame(loop);
      }

      const ro = new ResizeObserver(() => {
        resize();
        if (reduced) draw(0);
      });
      ro.observe(wrap);

      const onPointerMove = (e: PointerEvent) => {
        const r = wrap.getBoundingClientRect();
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
        pointerRef.current = { x, y };
        if (reduced) draw(0); // reduced-motion: still react to the cursor
      };
      const onPointerLeave = () => {
        pointerRef.current = null;
        vx = 0;
        vy = 0;
        lastP = null; // keep `warm` decaying — that's the graceful cool-down
        if (reduced) draw(0);
      };
      wrap.addEventListener("pointermove", onPointerMove);
      wrap.addEventListener("pointerleave", onPointerLeave);

      return () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        wrap.removeEventListener("pointermove", onPointerMove);
        wrap.removeEventListener("pointerleave", onPointerLeave);
      };
    }, []);

    return (
      <div
        ref={wrapRef}
        aria-hidden
        className="w-full overflow-hidden leading-[0]"
        style={{ height: DITHER_DEFAULTS.height, backgroundColor: WHITE }}
      >
        <canvas ref={canvasRef} className="block" />
      </div>
    );
  },
);
