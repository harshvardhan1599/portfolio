"use client";

// About-page enter transition: a curtain drop.
//
// A dark panel taller than the viewport covers the screen on mount. It carries
// TWO dither bands: a normal one pinned to its bottom edge, and a vertically
// FLIPPED one (bright pixels facing up) pinned to its top edge, which hangs
// ~40vh above the fold. So at rest it reads exactly like the homepage hero —
// dark field, dither strip near the bottom, top band hidden above the viewport.
//
// On mount the whole panel sweeps downward off the bottom. Because the reveal
// edge is the panel's TOP, that hidden flipped band descends into frame as a
// bright fire-pixel scanline leading the reveal (per Fable) — the drama a
// bottom-only dither would hide against the dark page. Expo ease with a 150ms
// hold; scroll is locked for the drop; removed from the DOM when done; a plain
// no-op under prefers-reduced-motion.

import { useEffect, useState } from "react";
import { DitherBand, BLACK } from "@/components/DitherBand";

export function AboutCurtain() {
  const [gone, setGone] = useState(false);
  const [drop, setDrop] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      // reduced motion: skip the curtain entirely (client-only media query)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGone(true);
      return;
    }
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden"; // scroll-lock during the drop
    // two rAFs so the covered frame paints before the drop is triggered
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setDrop(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      html.style.overflow = prevOverflow;
    };
  }, []);

  if (gone) return null;

  return (
    <div
      aria-hidden
      onTransitionEnd={(e) => {
        if (e.propertyName !== "transform") return;
        document.documentElement.style.overflow = "";
        setGone(true);
      }}
      className="pointer-events-none fixed inset-x-0 z-40"
      style={{
        top: "-40vh",
        height: "140vh",
        backgroundColor: BLACK,
        transform: drop ? "translate3d(0, 140vh, 0)" : "translate3d(0, 0, 0)",
        transition: "transform 1100ms cubic-bezier(0.87, 0, 0.13, 1) 150ms",
        willChange: "transform",
      }}
    >
      {/* leading edge: flipped dither (bright pixels at the very top) + hairline */}
      <div className="absolute inset-x-0 top-0" style={{ transform: "scaleY(-1)" }}>
        <DitherBand />
      </div>
      <div className="absolute inset-x-0 top-0 h-px bg-white/35" />

      {/* trailing edge: normal dither at the bottom — the at-rest hero look */}
      <div className="absolute inset-x-0 bottom-0">
        <DitherBand />
      </div>
    </div>
  );
}
