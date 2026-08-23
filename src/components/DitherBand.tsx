"use client";

// Animated pixel-dither band bridging a dark section into a light one. A canvas
// draws a grid of square cells that dissolve the dark color (top) → white
// (bottom) with a fire-like flicker: a value-noise field scrolls upward so the
// boundary licks and shimmers, and colored embers spark near the transition.
//
// This is the STANDALONE wrapper, used where a band is local to one page (see
// PlaygroundDither). The homepage/about band is not mounted this way — it's a
// server-rendered canvas driven directly by DitherStage, so it can paint before
// hydration. Both paths share the same engine and kernel.

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { createDither, type DitherDriver } from "./dither/engine";
import {
  DITHER_DEFAULTS,
  WHITE,
  type DitherBandHandle,
  type DitherConfig,
} from "./dither/config";

// Re-exported for the existing importers (CustomCursor, DitherSettings).
export {
  DITHER_DEFAULTS,
  BLACK,
  WHITE,
  EMBER_COLORS,
  type DitherConfig,
  type DitherBandHandle,
} from "./dither/config";
export { hash, noise2 } from "./dither/kernel";

export const DitherBand = forwardRef<DitherBandHandle, Partial<DitherConfig>>(
  function DitherBand(props, ref) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const driverRef = useRef<DitherDriver | null>(null);
    // Config is read once at mount; live changes go through setConfig().
    const initRef = useRef(props);

    useImperativeHandle(ref, () => ({
      setConfig(c) {
        driverRef.current?.setConfig(c);
        if (c.height !== undefined && wrapRef.current) {
          wrapRef.current.style.height = `${c.height}px`;
        }
      },
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const driver = createDither(canvas, initRef.current);
      driverRef.current = driver;
      return () => {
        driver?.destroy();
        driverRef.current = null;
      };
    }, []);

    const height = props.height ?? DITHER_DEFAULTS.height;
    const baseColor = props.baseColor ?? DITHER_DEFAULTS.baseColor;

    return (
      <div
        ref={wrapRef}
        aria-hidden
        className="w-full overflow-hidden leading-[0]"
        // dark→white gradient (matching the dither) instead of solid white, so
        // the canvas's anti-aliased top edge blends into black (no white hairline
        // over the transition strip's black panel) and its bottom into white.
        style={{
          height,
          background: `linear-gradient(to bottom, ${baseColor}, ${WHITE})`,
        }}
      >
        <canvas ref={canvasRef} className="block" />
      </div>
    );
  },
);
