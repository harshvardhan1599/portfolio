"use client";

import { useEffect, useRef, useState } from "react";
import { DITHER_DEFAULTS, EMBER_COLORS } from "@/components/DitherBand";

type CursorMode = "default" | "hover" | "case-study";

// Over the dither the round dot becomes a dark square the size of a dither
// cell, and leaves a fading trail of grid-aligned ember cells behind it.
const DITHER_SQUARE = "#171718";
const CELL = DITHER_DEFAULTS.cell; // 23 — dither cell size
const EMBERS = [
  EMBER_COLORS.yellow,
  EMBER_COLORS.orange,
  EMBER_COLORS.purple,
  EMBER_COLORS.blue,
];

export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<CursorMode>("default");
  const [pillLabel, setPillLabel] = useState("Case Study");
  // true when the pointer is over a light section (.surface-light), so the
  // cursor flips to the dark token set (dark dot/pill over the white area).
  const [onLight, setOnLight] = useState(false);
  // true when over the dither band ([data-cursor-fire]) → dark square + trail.
  const [fire, setFire] = useState(false);
  // last pointer sample, for the velocity squash & stretch.
  const lastRef = useRef<{ x: number; y: number; t: number } | null>(null);

  // ember trail
  const trailCanvasRef = useRef<HTMLCanvasElement>(null);
  const bandRectRef = useRef<DOMRect | null>(null);
  const trailRef = useRef<
    { col: number; row: number; birth: number; life: number; color: string }[]
  >([]);
  const lastCellRef = useRef("");
  const rafRef = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let idle = 0;

    // reveal next frame (avoids a synchronous setState inside the effect body)
    const showRaf = requestAnimationFrame(() => setVisible(true));

    const drawTrail = () => {
      const cv = trailCanvasRef.current;
      const ctx = cv?.getContext("2d");
      if (!cv || !ctx) {
        rafRef.current = 0;
        return;
      }
      const w = Math.round(window.innerWidth * dpr);
      const h = Math.round(window.innerHeight * dpr);
      if (cv.width !== w || cv.height !== h) {
        cv.width = w;
        cv.height = h;
        cv.style.width = `${window.innerWidth}px`;
        cv.style.height = `${window.innerHeight}px`;
      }
      const now = performance.now() / 1000;
      trailRef.current = trailRef.current.filter((em) => now - em.birth < em.life);
      ctx.clearRect(0, 0, cv.width, cv.height);
      const r = bandRectRef.current;
      const cellDev = CELL * dpr;
      if (r) {
        for (const em of trailRef.current) {
          // no drift, no fade — appear then blink out in place like the dither
          ctx.fillStyle = em.color;
          ctx.fillRect(
            Math.round((r.left + em.col * CELL) * dpr),
            Math.round((r.top + em.row * CELL) * dpr),
            Math.ceil(cellDev),
            Math.ceil(cellDev),
          );
        }
      }
      rafRef.current = trailRef.current.length
        ? requestAnimationFrame(drawTrail)
        : 0;
    };

    function onMove(e: MouseEvent) {
      if (ref.current) {
        ref.current.style.left = `${e.clientX}px`;
        ref.current.style.top = `${e.clientY}px`;
      }
      const target = e.target as HTMLElement;
      setOnLight(!!target.closest(".surface-light"));
      const fireEl = target.closest("[data-cursor-fire]");
      setFire(!!fireEl);
      const pillEl = target.closest("[data-cursor='case-study']");
      if (pillEl) {
        setMode("case-study");
        setPillLabel(pillEl.getAttribute("data-cursor-label") ?? "Case Study");
      } else if (target.closest("a, button")) {
        setMode("hover");
      } else {
        setMode("default");
      }

      // Ember trail — scattered sparks that rise and fade, like a torch. Emit
      // occasionally (not every cell) and scatter each spark off the path.
      if (fireEl && !reduced) {
        const r = fireEl.getBoundingClientRect();
        bandRectRef.current = r;
        // palette matches the band under the cursor (cool on Tinkerings, warm
        // elsewhere) — read from data-cursor-embers, fall back to the default.
        const attr = fireEl.getAttribute("data-cursor-embers");
        const palette = attr ? attr.split(",") : EMBERS;
        const col0 = Math.floor((e.clientX - r.left) / CELL);
        const row0 = Math.floor((e.clientY - r.top) / CELL);
        const key = `${col0},${row0}`;
        if (key !== lastCellRef.current) {
          lastCellRef.current = key;
          if (Math.random() < 0.7) {
            const count = Math.random() < 0.5 ? 2 : 1;
            for (let k = 0; k < count; k++) {
              trailRef.current.push({
                col: col0 + Math.round((Math.random() - 0.5) * 3), // ±1–2 scatter
                row: row0 + Math.round((Math.random() - 0.5) * 2), // ±1 scatter
                birth: performance.now() / 1000,
                life: 0.2 + Math.random() * 0.35, // short, like a flickering cell
                color: palette[Math.floor(Math.random() * palette.length)],
              });
            }
            if (trailRef.current.length > 30) {
              trailRef.current.splice(0, trailRef.current.length - 30);
            }
            if (!rafRef.current) rafRef.current = requestAnimationFrame(drawTrail);
          }
        }
      } else {
        lastCellRef.current = "";
      }

      // Velocity squash & stretch — dot only; off over the band / pill.
      if (!reduced && !pillEl && !fireEl && ref.current) {
        const l = lastRef.current;
        let sq = "";
        if (l) {
          const dt = Math.max(1, e.timeStamp - l.t);
          const dx = e.clientX - l.x;
          const dy = e.clientY - l.y;
          const v = Math.hypot(dx, dy) / dt; // px/ms
          const s = Math.min(0.35, v * 0.16); // clamp so it never smears
          const a = Math.atan2(dy, dx);
          sq = `rotate(${a}rad) scale(${1 + s}, ${1 - s * 0.7}) rotate(${-a}rad)`;
        }
        ref.current.style.transform = `translate(-50%, -50%) ${sq}`;
        clearTimeout(idle);
        idle = window.setTimeout(() => {
          if (ref.current) ref.current.style.transform = "translate(-50%, -50%)";
        }, 90);
      } else if (fireEl && ref.current) {
        ref.current.style.transform = "translate(-50%, -50%)"; // crisp square
      }
      lastRef.current = { x: e.clientX, y: e.clientY, t: e.timeStamp };
    }

    function onLeave() {
      if (ref.current) {
        ref.current.style.left = "-100px";
        ref.current.style.top = "-100px";
      }
    }

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(showRaf);
      clearTimeout(idle);
    };
  }, []);

  if (!visible) return null;

  const isPill = mode === "case-study";
  const isHover = mode === "hover";
  const square = fire && !isPill; // dark dither-cell square over the band

  return (
    <>
      <canvas
        ref={trailCanvasRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[99]"
        style={{ imageRendering: "pixelated" }}
      />
      <div
        ref={ref}
        className={`pointer-events-none fixed z-[100] flex items-center justify-center ${
          onLight ? "surface-light" : ""
        }`}
        style={{
          left: -100,
          top: -100,
          transform: "translate(-50%, -50%)",
          width: isPill ? "auto" : isHover ? 25 : square ? CELL : 15,
          height: isPill ? "auto" : isHover ? 25 : square ? CELL : 15,
          padding: isPill ? "8px 16px" : 0,
          opacity: isHover ? 0.2 : 1,
          borderRadius: square ? 0 : 9999,
          backgroundColor: isPill
            ? "var(--cursor-pill)"
            : square
              ? DITHER_SQUARE
              : "var(--foreground)",
          transition:
            "width 200ms ease-out, height 200ms ease-out, opacity 200ms ease-out, padding 200ms ease-out, background-color 200ms ease-out, border-radius 200ms ease-out, transform 140ms ease-out",
        }}
      >
        <span
          className="text-body-sm text-foreground-inverse whitespace-nowrap"
          style={{
            opacity: isPill ? 1 : 0,
            transform: isPill ? "scale(1)" : "scale(0)",
            transition: "opacity 200ms ease-out, transform 200ms ease-out",
          }}
        >
          {pillLabel}
        </span>
      </div>
    </>
  );
}
