"use client";

// DitherStage — the persistent transition stage.
//
// It drives the ONE dither canvas for the whole site. That canvas is NOT created
// here: it ships in the server HTML inside [data-dither-slot] with frame 0
// already painted (see dither/poster.ts), and this component simply attaches the
// animation engine to it once the JS arrives. Because React never owns the node,
// there is no portal, no host div, and no render pass between hydration and the
// band being live — the band is on screen from first paint.
//
// The same canvas node is moved imperatively between per-page slots, so its rAF
// clock, warmth field and ripples survive navigation: the band reads as a single
// living element, not two crossfading copies.
//
// On a home↔about navigation the canvas is welded into a fixed strip
// [black 100vh · band · white 100vh] and the whole strip is slid with a
// transform (never height/top, so the canvas never resizes). The fire is flared
// hotter during travel and settled on arrival. Any non-dither navigation, a
// missing slot, or reduced-motion falls straight through to a normal push.

import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DITHER_DEFAULTS, BLACK } from "./dither/config";
import type { DitherDriver } from "./dither/engine";
import { SLOT_CANVAS_HTML } from "./dither/slot";

const DITHER_PATHS = new Set(["/", "/about"]);
const BAND_H = DITHER_DEFAULTS.height;

// navigate() returns true if it took over the navigation (caller should
// preventDefault); false means "not my job, navigate normally".
type NavFn = (href: string) => boolean;
const DitherNavContext = createContext<NavFn>(() => false);
export const useDitherNav = () => useContext(DitherNavContext);

// A slot always ships its own canvas; this is only a guard for the impossible.
function slotCanvas(slot: HTMLElement): HTMLCanvasElement {
  const existing = slot.querySelector<HTMLCanvasElement>(
    "canvas[data-dither-canvas]",
  );
  if (existing) return existing;
  slot.innerHTML = SLOT_CANVAS_HTML;
  return slot.querySelector<HTMLCanvasElement>("canvas[data-dither-canvas]")!;
}

export function DitherStage({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const driverRef = useRef<DitherDriver | null>(null);
  const transitioning = useRef(false);
  const lerpRaf = useRef(0);

  // Attach to (or re-dock into) the current page's slot. A transition mid-flight
  // settles itself into the destination slot, so leave it alone.
  useEffect(() => {
    if (transitioning.current) return;
    const slot = document.querySelector<HTMLElement>("[data-dither-slot]");

    // No slot on this route (e.g. /work/*). The canvas goes out of the document
    // with the unmounting page but we keep holding it, so the engine idles
    // (shouldRun() checks isConnected) instead of burning a rAF loop on a
    // detached, zero-width canvas — and it comes back still painted, with its
    // flame phase and warmth intact, the moment a slot reappears.
    if (!slot) {
      driverRef.current?.retarget();
      return;
    }

    // Already live — the canvas just needs to move to the new page's slot.
    const live = canvasRef.current;
    if (live && driverRef.current) {
      if (live.parentElement !== slot) slot.replaceChildren(live);
      driverRef.current.retarget();
      return;
    }

    const canvas = slotCanvas(slot);
    canvasRef.current = canvas;
    let cancelled = false;
    // Loaded on demand so the engine stays out of the layout chunk on routes
    // that have no band at all. The baked frame covers the extra round trip.
    import("./dither/engine").then(({ createDither }) => {
      if (cancelled || canvasRef.current !== canvas) return;
      driverRef.current = createDither(canvas);
      if (process.env.NODE_ENV !== "production") {
        (window as unknown as { __dither?: DitherDriver | null }).__dither =
          driverRef.current;
      }
    });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  useEffect(
    () => () => {
      cancelAnimationFrame(lerpRaf.current);
      driverRef.current?.destroy();
      driverRef.current = null;
    },
    [],
  );

  // ramp the fire hot during travel, then lerp back to defaults on landing
  const flare = useCallback((on: boolean) => {
    cancelAnimationFrame(lerpRaf.current);
    if (on) {
      // travel mode: 30fps + single noise octave, and a hotter look
      driverRef.current?.setConfig({
        travel: true,
        speed: 1.5,
        intensity: 1.1,
        riseSpeed: 1.7,
      });
      return;
    }
    driverRef.current?.setConfig({ travel: false }); // full quality resumes
    const from = { speed: 1.5, intensity: 1.1, riseSpeed: 1.7 };
    const to = {
      speed: DITHER_DEFAULTS.speed,
      intensity: DITHER_DEFAULTS.intensity,
      riseSpeed: DITHER_DEFAULTS.riseSpeed,
    };
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / 350);
      const e = 1 - (1 - k) * (1 - k);
      driverRef.current?.setConfig({
        speed: from.speed + (to.speed - from.speed) * e,
        intensity: from.intensity + (to.intensity - from.intensity) * e,
        riseSpeed: from.riseSpeed + (to.riseSpeed - from.riseSpeed) * e,
      });
      if (k < 1) lerpRaf.current = requestAnimationFrame(step);
    };
    lerpRaf.current = requestAnimationFrame(step);
  }, []);

  const navigate = useCallback<NavFn>(
    (href) => {
      const canvas = canvasRef.current;
      if (
        !canvas ||
        !driverRef.current ||
        transitioning.current ||
        href === pathname ||
        !DITHER_PATHS.has(href) ||
        !DITHER_PATHS.has(pathname)
      ) {
        return false;
      }
      const slot = canvas.parentElement;
      if (!slot) return false;

      // reduced-motion: skip the travel, just navigate (re-docks via the effect)
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        router.push(href);
        return true;
      }

      transitioning.current = true;
      const vh = window.innerHeight;
      const startTop = Math.max(
        -BAND_H,
        Math.min(vh, slot.getBoundingClientRect().top),
      );
      const expand = href === "/about"; // → about: band travels DOWN and off
      // contract target ≈ the home hero's band position (snapped exactly on land)
      const endTop = expand ? vh : Math.round(vh * 0.42);

      // build the fixed strip: [black 100vh][band box][white 100vh]
      const strip = document.createElement("div");
      strip.style.cssText = `position:fixed;left:0;right:0;top:${startTop - vh}px;z-index:40;pointer-events:none;will-change:transform;`;
      const black = document.createElement("div");
      black.style.cssText = `height:${vh}px;background:${BLACK};`;
      const white = document.createElement("div");
      white.style.cssText = `height:${vh}px;background:#fff;`;
      // The band box replaces the slot for the duration of the flight. It needs
      // the slot's clipping: the canvas is a whole cell taller than the band and
      // up to a cell wider than the viewport.
      const box = document.createElement("div");
      box.style.cssText = `width:100%;height:${BAND_H}px;overflow:hidden;line-height:0;background:linear-gradient(to bottom, ${BLACK}, #fff);`;
      box.appendChild(canvas); // move the SAME canvas node into the strip
      strip.append(black, box, white);
      document.body.appendChild(strip);
      driverRef.current.retarget();

      flare(true);

      const anim = strip.animate(
        [
          { transform: "translateY(0)" },
          { transform: `translateY(${endTop - startTop}px)` },
        ],
        {
          duration: expand ? 650 : 520,
          easing: expand
            ? "cubic-bezier(0.7,0,0.15,1)"
            : "cubic-bezier(0.55,0.06,0.1,1)",
          fill: "forwards",
        },
      );

      // Contract lands on the home slot, whose exact position we can't know until
      // it mounts. Once it does (mid-flight, after the push), retarget the running
      // animation to the measured slot so the band lands pixel-exact — no snap.
      const retargetToSlot = () => {
        let tries = 0;
        const tick = () => {
          // only the DESTINATION slot — never the stale source slot that's still
          // in the DOM until the route swap commits.
          const dest = document.querySelector<HTMLElement>("[data-dither-slot]");
          if (dest && dest !== slot) {
            const measuredEnd = dest.getBoundingClientRect().top;
            (anim.effect as KeyframeEffect | null)?.setKeyframes([
              { transform: "translateY(0)" },
              { transform: `translateY(${measuredEnd - startTop}px)` },
            ]);
          } else if (tries++ < 90) {
            requestAnimationFrame(tick);
          }
        };
        tick();
      };

      // Start compositing the strip FIRST, then push (~2 frames later) — so the
      // destination commit runs behind an already-moving, fully covered
      // animation instead of blocking its opening frames.
      anim.ready.then(() => {
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            router.push(href);
            if (!expand) retargetToSlot();
          }),
        );
      });

      const settle = () => {
        let tries = 0;
        const dock = () => {
          // dock into the DESTINATION slot only — never the stale source slot
          // (still in the DOM until the route swap), which would take the band
          // down with it when the old page unmounts. replaceChildren discards
          // the destination's own unpainted bootstrap canvas.
          const dest = document.querySelector<HTMLElement>("[data-dither-slot]");
          if (dest && dest !== slot) {
            dest.replaceChildren(canvas);
          } else if (tries++ < 600) {
            requestAnimationFrame(dock);
            return;
          }
          strip.remove();
          transitioning.current = false;
          driverRef.current?.retarget();
          flare(false);
          // let deferred, decorative destination content mount now (see AboutBody)
          window.dispatchEvent(new CustomEvent("dither:settled"));
        };
        dock();
      };
      anim.onfinish = settle;
      anim.oncancel = settle;
      return true;
    },
    [pathname, router, flare],
  );

  return (
    <DitherNavContext.Provider value={navigate}>
      {children}
    </DitherNavContext.Provider>
  );
}
