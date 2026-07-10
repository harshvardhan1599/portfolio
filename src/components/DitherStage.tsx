"use client";

// DitherStage — the persistent transition stage (Fable's architecture).
//
// It owns the ONE dither canvas for the whole site and portals it into a stable
// host <div> that we move imperatively between per-page [data-dither-slot]
// placeholders. Because the canvas node is never remounted (only re-parented),
// its rAF clock, warmth field and ripples survive navigation — the band reads as
// a single living element, not two crossfading copies.
//
// On a home↔about navigation the host is welded into a fixed strip
// [black 100vh · band · white 100vh] and the whole strip is slid with a
// transform (never height/top, so the canvas never resizes). The fire is flared
// hotter during travel and settled on arrival. Any non-dither navigation, a
// missing slot, or reduced-motion falls straight through to a normal push.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import {
  DitherBand,
  DITHER_DEFAULTS,
  BLACK,
  type DitherBandHandle,
} from "./DitherBand";

const DITHER_PATHS = new Set(["/", "/about"]);
const BAND_H = DITHER_DEFAULTS.height;

// navigate() returns true if it took over the navigation (caller should
// preventDefault); false means "not my job, navigate normally".
type NavFn = (href: string) => boolean;
const DitherNavContext = createContext<NavFn>(() => false);
export const useDitherNav = () => useContext(DitherNavContext);

export function DitherStage({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const bandRef = useRef<DitherBandHandle>(null);
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const transitioning = useRef(false);
  const lerpRaf = useRef(0);

  // stable host node (created once, client-only)
  useEffect(() => {
    const h = document.createElement("div");
    h.style.width = "100%";
    setHost(h);
    return () => {
      cancelAnimationFrame(lerpRaf.current);
      h.remove();
    };
  }, []);

  // dock the host into the current page's slot on mount + route change, unless a
  // transition is mid-flight (that settles itself into the destination slot).
  useEffect(() => {
    if (!host || transitioning.current) return;
    const slot = document.querySelector<HTMLElement>("[data-dither-slot]");
    if (slot && host.parentElement !== slot) slot.appendChild(host);
  }, [host, pathname]);

  // ramp the fire hot during travel, then lerp back to defaults on landing
  const flare = useCallback((on: boolean) => {
    cancelAnimationFrame(lerpRaf.current);
    if (on) {
      // travel mode: 30fps + single noise octave, and a hotter look
      bandRef.current?.setConfig({
        travel: true,
        speed: 1.5,
        intensity: 1.1,
        riseSpeed: 1.7,
      });
      return;
    }
    bandRef.current?.setConfig({ travel: false }); // full quality resumes
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
      bandRef.current?.setConfig({
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
      if (
        !host ||
        transitioning.current ||
        href === pathname ||
        !DITHER_PATHS.has(href) ||
        !DITHER_PATHS.has(pathname)
      ) {
        return false;
      }
      const slot = host.parentElement;
      if (!slot) return false;

      // reduced-motion: skip the travel, just navigate (re-docks via the effect)
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        router.push(href);
        return true;
      }

      transitioning.current = true;
      const vh = window.innerHeight;
      const startTop = Math.max(-BAND_H, Math.min(vh, slot.getBoundingClientRect().top));
      const expand = href === "/about"; // → about: band travels DOWN and off
      // contract target ≈ the home hero's band position (snapped exactly on land)
      const endTop = expand ? vh : Math.round(vh * 0.42);

      // build the fixed strip: [black 100vh][band host][white 100vh]
      const strip = document.createElement("div");
      strip.style.cssText = `position:fixed;left:0;right:0;top:${startTop - vh}px;z-index:40;pointer-events:none;will-change:transform;`;
      const black = document.createElement("div");
      black.style.cssText = `height:${vh}px;background:${BLACK};`;
      const white = document.createElement("div");
      white.style.cssText = `height:${vh}px;background:#fff;`;
      strip.append(black, host, white); // move the SAME canvas node into the strip
      document.body.appendChild(strip);

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
      // destination commit (React + WebGL compile) runs behind an already-moving,
      // fully covered animation instead of blocking its opening frames.
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
          // down with it when the old page unmounts.
          const dest = document.querySelector<HTMLElement>("[data-dither-slot]");
          if (dest && dest !== slot) {
            dest.appendChild(host);
          } else if (tries++ < 600) {
            requestAnimationFrame(dock);
            return;
          }
          strip.remove();
          transitioning.current = false;
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
    [host, pathname, router, flare],
  );

  return (
    <DitherNavContext.Provider value={navigate}>
      {host && createPortal(<DitherBand ref={bandRef} />, host)}
      {children}
    </DitherNavContext.Provider>
  );
}
