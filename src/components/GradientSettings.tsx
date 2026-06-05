"use client";

/**
 * GradientSettings — the frosted-glass control panel from the strips lab,
 * rebuilt as a dependency-free React component (no lil-gui).
 *
 * A gear button toggles a frosted card with:
 *   - Color  : circular swatch presets (palette only)
 *   - Alignment : 0 = max skyline wave, 1 = strips aligned (smooth)
 *   - Speed  : time frequency of the loop
 *   - Reset  : back to the Periwinkle defaults
 *
 * It drives the gradient purely through the imperative handle, so dragging a
 * slider updates the shader uniforms in place (no WebGL rebuild):
 *
 *   const gradient = useRef<GradientBackgroundHandle>(null);
 *   <GradientBackground ref={gradient} />
 *   <GradientSettings target={gradient} />
 *
 * NOTE: in this portfolio the gradient is a contained hero banner, not a
 * full-viewport background, so the gear/panel are positioned ABSOLUTE and
 * anchored to the nearest positioned ancestor (the banner's padding wrapper),
 * tucked into its top-right corner — not pinned to the viewport.
 */

import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import type { GradientBackgroundHandle } from "./GradientBackground";

// align (0..1) -> skyline wave amplitudes. align 1 = smooth, 0 = max wave.
const ALIGN_MAX = { amp: 0.37, amp2: 0.08 };

// palette-only presets (mirrors src/strips-config.js)
const PRESETS: Record<string, string[]> = {
  Opal: ["#f4f4f4", "#f4f4f4", "#decddc", "#f6b793", "#faaaab", "#bcbdfe"],
  Nocturne: ["#ff9c79", "#e93855", "#ee85e2", "#5662f2", "#014677", "#02020a"],
  Periwinkle: ["#aecbf5", "#c2cbf1", "#d2c9ec", "#e2d4e8", "#ead9e6", "#6f86dd"],
  Sunrise: ["#fff4e6", "#ffd29a", "#ff9d6c", "#f0635e", "#b6477f", "#8a5fd0"],
  Mint: ["#f0fff7", "#9ef0cf", "#34c2b6", "#3a86c8", "#6f7be0", "#c9a0e8"],
};

// Default preset is theme-aware: Opal in light mode, Nocturne in dark.
const LIGHT_PRESET = "Opal";
const DARK_PRESET = "Nocturne";
const DEFAULT_ALIGN = 0.5;
const DEFAULT_WAVE = 0.35;

const isDarkTheme = () =>
  typeof document !== "undefined" &&
  document.documentElement.classList.contains("dark");

const defaultPreset = () => (isDarkTheme() ? DARK_PRESET : LIGHT_PRESET);

// amp pair for a given alignment value
const ampFor = (align: number) => ({
  amp: (1 - align) * ALIGN_MAX.amp,
  amp2: (1 - align) * ALIGN_MAX.amp2,
});

// a swatch's circular preview, built from its 6 stops
const swatchBg = (p: string[]) =>
  `radial-gradient(circle at 50% 34%, ${p[0]} 0%, ${p[1]} 20%, ${p[2]} 40%, ${p[3]} 58%, ${p[4]} 76%, ${p[5]} 100%)`;

export interface GradientSettingsProps {
  target: RefObject<GradientBackgroundHandle | null>;
}

export default function GradientSettings({ target }: GradientSettingsProps) {
  const [open, setOpen] = useState(false);
  // Lazy init from the theme so the very first setConfig already pushes the
  // right palette (no light->dark flash on a dark-mode load). On the server
  // `document` is undefined, so this falls back to the light default.
  const [preset, setPreset] = useState(defaultPreset);
  const [align, setAlign] = useState(DEFAULT_ALIGN);
  const [wave, setWave] = useState(DEFAULT_WAVE);

  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  // true once the visitor manually picks a swatch — after that we stop
  // following the theme so we don't clobber their choice.
  const touchedRef = useRef(false);

  // push the current state to the gradient on mount and whenever it changes
  useEffect(() => {
    target.current?.setConfig({ palette: PRESETS[preset], wave, ...ampFor(align) });
  }, [target, preset, align, wave]);

  // follow light/dark toggles (the site sets a `.dark` class on <html>) until
  // the visitor has manually chosen a preset.
  useEffect(() => {
    const root = document.documentElement;
    const obs = new MutationObserver(() => {
      if (!touchedRef.current) setPreset(defaultPreset());
    });
    obs.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  // click-outside + Escape close the panel
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (rootRef.current?.contains(t) || btnRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const reset = () => {
    touchedRef.current = false;
    setPreset(defaultPreset());
    setAlign(DEFAULT_ALIGN);
    setWave(DEFAULT_WAVE);
  };

  // grey-track / white-fill pill, with the knob sitting at the value
  const fill = (value: number, min: number, max: number) => {
    const pct = ((value - min) / (max - min)) * 100;
    return {
      background: `linear-gradient(to right, #fff 0%, #fff ${pct}%, rgba(110,120,165,.3) ${pct}%, rgba(110,120,165,.3) 100%)`,
    };
  };

  return (
    <>
      <style>{CSS}</style>

      <button
        ref={btnRef}
        type="button"
        className={`gs-btn${open ? " active" : ""}`}
        aria-label="Gradient settings"
        aria-expanded={open}
        title="Settings"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4 10C4 9.73 4.11 9.48 4.29 9.29C4.48 9.11 4.73 9 5 9H9.65C9.86 8.28 10.3 7.64 10.91 7.19C11.51 6.74 12.25 6.5 13 6.5C13.75 6.5 14.49 6.74 15.09 7.19C15.7 7.64 16.14 8.28 16.35 9H27C27.27 9 27.52 9.11 27.71 9.29C27.89 9.48 28 9.73 28 10C28 10.27 27.89 10.52 27.71 10.71C27.52 10.89 27.27 11 27 11H16.35C16.14 11.72 15.7 12.36 15.09 12.81C14.49 13.26 13.75 13.5 13 13.5C12.25 13.5 11.51 13.26 10.91 12.81C10.3 12.36 9.86 11.72 9.65 11H5C4.73 11 4.48 10.89 4.29 10.71C4.11 10.52 4 10.27 4 10ZM27 21H24.35C24.14 20.28 23.7 19.64 23.09 19.19C22.49 18.74 21.75 18.5 21 18.5C20.25 18.5 19.51 18.74 18.91 19.19C18.3 19.64 17.86 20.28 17.65 21H5C4.73 21 4.48 21.11 4.29 21.29C4.11 21.48 4 21.73 4 22C4 22.27 4.11 22.52 4.29 22.71C4.48 22.89 4.73 23 5 23H17.65C17.86 23.72 18.3 24.36 18.91 24.81C19.51 25.26 20.25 25.5 21 25.5C21.75 25.5 22.49 25.26 23.09 24.81C23.7 24.36 24.14 23.72 24.35 23H27C27.27 23 27.52 22.89 27.71 22.71C27.89 22.52 28 22.27 28 22C28 21.73 27.89 21.48 27.71 21.29C27.52 21.11 27.27 21 27 21Z"
            fill="white"
          />
        </svg>
      </button>

      <div
        ref={rootRef}
        className={`gs-root${open ? " open" : ""}`}
        role="dialog"
        aria-label="Gradient settings"
        aria-hidden={!open}
      >
        <div className="gs-field">
          <div className="gs-label">Color</div>
          <div className="gs-swatches">
            {Object.entries(PRESETS).map(([name, p]) => (
              <button
                key={name}
                type="button"
                // The default selection is theme-derived, which the server
                // (no theme) can't match — suppress that one-time hydration diff.
                suppressHydrationWarning
                className={`gs-swatch${preset === name ? " selected" : ""}`}
                title={name}
                aria-label={name}
                aria-pressed={preset === name}
                style={{ background: swatchBg(p) }}
                onClick={() => {
                  touchedRef.current = true;
                  setPreset(name);
                }}
              />
            ))}
          </div>
        </div>

        <div className="gs-field">
          <div className="gs-label">Alignment</div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={align}
            style={fill(align, 0, 1)}
            onChange={(e) => setAlign(parseFloat(e.target.value))}
          />
        </div>

        <div className="gs-field">
          <div className="gs-label">Speed</div>
          <input
            type="range"
            min={0}
            max={1.5}
            step={0.01}
            value={wave}
            style={fill(wave, 0, 1.5)}
            onChange={(e) => setWave(parseFloat(e.target.value))}
          />
        </div>

        <button type="button" className="gs-reset" onClick={reset}>
          Reset
        </button>
      </div>
    </>
  );
}

// Scoped styles, ported from the strips lab's frosted-panel CSS. Injected once
// per render of the component; no global stylesheet or build step needed.
// The gear/panel are positioned ABSOLUTE (not fixed): they anchor to the
// nearest positioned ancestor — the banner's padding wrapper — and tuck into
// its top-right corner, so they travel with the banner instead of the viewport.
const CSS = `
.gs-btn {
  position: absolute;
  right: 32px;
  top: 32px;
  z-index: 20;
  width: 44px;
  height: 44px;
  padding: 0;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 9px rgba(0, 0, 0, 0.12);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
  cursor: pointer;
  transition: transform 0.16s ease, background 0.16s ease;
}
.gs-btn::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  padding: 1px;
  background: linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
.gs-btn:hover { background: rgba(255, 255, 255, 0.5); }
.gs-btn:active { transform: scale(0.96); }
.gs-btn.active { background: rgba(255, 255, 255, 0.6); }
.gs-btn svg {
  width: 24px;
  height: 24px;
  display: block;
  filter: drop-shadow(0 1px 1px rgba(40, 50, 110, 0.25));
}

.gs-root {
  position: absolute;
  right: 32px;
  top: 88px;
  width: 240px;
  max-width: calc(100% - 64px);
  z-index: 19;
  box-sizing: border-box;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  font-family: "Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", ui-sans-serif, system-ui, sans-serif;
  color: rgba(26, 28, 58, 0.78);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.18);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  backdrop-filter: blur(20px) saturate(160%);
  box-shadow: 0 12px 36px rgba(40, 50, 110, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.55),
    inset 0 0 0 1px rgba(255, 255, 255, 0.25);
  transform-origin: top right;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translateY(-10px) scale(0.96);
  transition: opacity 0.24s ease,
    transform 0.26s cubic-bezier(0.2, 0.85, 0.25, 1), visibility 0.24s;
}
.gs-root.open {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: translateY(0) scale(1);
}
@media (prefers-reduced-motion: reduce) {
  .gs-root, .gs-root.open {
    transition: opacity 0.12s ease, visibility 0.12s;
    transform: none;
  }
}

.gs-field { display: flex; flex-direction: column; }
.gs-label {
  font-size: 12px;
  line-height: 1.4;
  padding-bottom: 7px;
  opacity: 0.85;
}

.gs-swatches { display: flex; flex-wrap: wrap; align-items: center; gap: 9px; }
.gs-swatch {
  flex: 0 0 auto;
  width: 22px;
  height: 22px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.55), 0 1px 3px rgba(40,50,110,0.28);
  transition: transform 0.14s ease, box-shadow 0.18s ease;
}
.gs-swatch:hover { transform: scale(1.12); }
.gs-swatch.selected {
  box-shadow: 0 0 0 2px rgba(255,255,255,0.95), 0 0 0 4px rgba(74,81,230,0.6),
    0 1px 4px rgba(40,50,110,0.3);
}

/* pill slider: white fill (left), grey track (right), raised white knob */
.gs-root input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 26px;
  margin: 0;
  border-radius: 999px;
  background: rgba(110, 120, 165, 0.3);
  box-shadow: inset 0 1px 2px rgba(40, 50, 110, 0.18);
  cursor: pointer;
  outline: none;
}
.gs-root input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 32px;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(40,50,110,0.3), inset 0 0 0 1px rgba(255,255,255,0.7);
}
.gs-root input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 32px;
  border: 0;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(40,50,110,0.3), inset 0 0 0 1px rgba(255,255,255,0.7);
}
.gs-root input[type="range"]::-moz-range-track { background: transparent; }

.gs-reset {
  align-self: stretch;
  height: 30px;
  border: 0;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.42);
  color: rgba(18, 20, 46, 0.92);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.16s ease;
}
.gs-reset:hover { background: rgba(255, 255, 255, 0.64); }
.gs-reset:active { background: rgba(255, 255, 255, 0.82); }
`;
