"use client";

// DitherSettings — a dev-only frosted control panel for tuning the animated
// dither band live: geometry + animation sliders and an ember-color palette
// (yellow / purple / blue / orange toggles). Drives the band through its
// imperative handle (setConfig). Rendered only outside production.

import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import {
  DITHER_DEFAULTS,
  EMBER_COLORS,
  type DitherBandHandle,
  type DitherConfig,
} from "./DitherBand";

interface Slider {
  key: keyof DitherConfig;
  label: string;
  min: number;
  max: number;
  step: number;
  fmt: (v: number) => string;
}

const SLIDERS: Slider[] = [
  { key: "cell", label: "Square size", min: 8, max: 72, step: 1, fmt: (v) => `${v}px` },
  { key: "height", label: "Dither height", min: 72, max: 400, step: 4, fmt: (v) => `${v}px` },
  { key: "speed", label: "Animation speed", min: 0, max: 3, step: 0.05, fmt: (v) => v.toFixed(2) },
  { key: "intensity", label: "Fire intensity", min: 0, max: 1.5, step: 0.05, fmt: (v) => v.toFixed(2) },
  { key: "riseSpeed", label: "Rise speed", min: 0, max: 3, step: 0.05, fmt: (v) => v.toFixed(2) },
  { key: "emberAmount", label: "Ember amount", min: 0, max: 1, step: 0.02, fmt: (v) => v.toFixed(2) },
  { key: "noiseScale", label: "Flame detail", min: 0.3, max: 2.5, step: 0.05, fmt: (v) => v.toFixed(2) },
  { key: "fade", label: "Fade softness", min: 0.2, max: 1.5, step: 0.05, fmt: (v) => v.toFixed(2) },
  { key: "stokeStrength", label: "Hover intensity", min: 0, max: 1.5, step: 0.05, fmt: (v) => v.toFixed(2) },
  { key: "stokeRadius", label: "Hover radius", min: 1, max: 10, step: 0.5, fmt: (v) => `${v} cells` },
];

const COLOR_KEYS: (keyof DitherConfig)[] = ["yellow", "purple", "blue", "orange"];

export interface DitherSettingsProps {
  target: RefObject<DitherBandHandle | null>;
}

export default function DitherSettings({ target }: DitherSettingsProps) {
  const [open, setOpen] = useState(false);
  const [cfg, setCfg] = useState<DitherConfig>({ ...DITHER_DEFAULTS });

  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    target.current?.setConfig(cfg);
  }, [target, cfg]);

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

  const setNum = (key: keyof DitherConfig, value: number) =>
    setCfg((c) => ({ ...c, [key]: value }));
  const toggle = (key: keyof DitherConfig) =>
    setCfg((c) => ({ ...c, [key]: !c[key] }));

  const fill = (value: number, min: number, max: number) => {
    const pct = ((value - min) / (max - min)) * 100;
    return {
      background: `linear-gradient(to right, #fff 0%, #fff ${pct}%, rgba(150,150,155,.3) ${pct}%, rgba(150,150,155,.3) 100%)`,
    };
  };

  return (
    <>
      <style>{CSS}</style>

      <button
        ref={btnRef}
        type="button"
        className={`ds-btn${open ? " active" : ""}`}
        aria-label="Dither settings"
        aria-expanded={open}
        title="Dither settings (dev)"
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
        className={`ds-root${open ? " open" : ""}`}
        role="dialog"
        aria-label="Dither settings"
        aria-hidden={!open}
      >
        <div className="ds-field">
          <div className="ds-label">
            <span>Ember colors</span>
          </div>
          <div className="ds-swatches">
            {COLOR_KEYS.map((key) => {
              const on = cfg[key] as boolean;
              return (
                <button
                  key={key}
                  type="button"
                  className={`ds-swatch${on ? " on" : ""}`}
                  title={key}
                  aria-label={key}
                  aria-pressed={on}
                  style={{ background: EMBER_COLORS[key as string] }}
                  onClick={() => toggle(key)}
                />
              );
            })}
          </div>
        </div>

        {SLIDERS.map((s) => (
          <div className="ds-field" key={s.key}>
            <div className="ds-label">
              <span>{s.label}</span>
              <span className="ds-val">{s.fmt(cfg[s.key] as number)}</span>
            </div>
            <input
              type="range"
              min={s.min}
              max={s.max}
              step={s.step}
              value={cfg[s.key] as number}
              style={fill(cfg[s.key] as number, s.min, s.max)}
              onChange={(e) => setNum(s.key, parseFloat(e.target.value))}
            />
          </div>
        ))}

        <button
          type="button"
          className="ds-reset"
          onClick={() => setCfg({ ...DITHER_DEFAULTS })}
        >
          Reset
        </button>
      </div>
    </>
  );
}

const CSS = `
.ds-btn {
  position: absolute;
  right: 24px;
  top: 16px;
  z-index: 30;
  width: 40px;
  height: 40px;
  padding: 0;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: rgba(40, 40, 44, 0.55);
  box-shadow: 0 4px 9px rgba(0, 0, 0, 0.3);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
  cursor: pointer;
  transition: transform 0.16s ease, background 0.16s ease;
}
.ds-btn:hover { background: rgba(40, 40, 44, 0.75); }
.ds-btn:active { transform: scale(0.96); }
.ds-btn.active { background: rgba(40, 40, 44, 0.85); }
.ds-btn svg { width: 22px; height: 22px; display: block; }

.ds-root {
  position: absolute;
  right: 24px;
  top: 64px;
  width: 256px;
  max-width: calc(100% - 48px);
  max-height: 78vh;
  overflow-y: auto;
  z-index: 29;
  box-sizing: border-box;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 13px;
  font-family: ui-sans-serif, system-ui, sans-serif;
  color: rgba(240, 240, 245, 0.9);
  border-radius: 16px;
  background: rgba(28, 28, 32, 0.78);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  backdrop-filter: blur(20px) saturate(150%);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.45),
    inset 0 0 0 1px rgba(255, 255, 255, 0.08);
  transform-origin: top right;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translateY(-10px) scale(0.96);
  transition: opacity 0.24s ease,
    transform 0.26s cubic-bezier(0.2, 0.85, 0.25, 1), visibility 0.24s;
}
.ds-root.open {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: translateY(0) scale(1);
}

.ds-field { display: flex; flex-direction: column; }
.ds-label {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  line-height: 1.4;
  padding-bottom: 7px;
  opacity: 0.9;
}
.ds-val { opacity: 0.7; font-variant-numeric: tabular-nums; }

.ds-swatches { display: flex; gap: 10px; }
.ds-swatch {
  width: 26px;
  height: 26px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
  opacity: 0.35;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.25);
  transition: opacity 0.16s ease, box-shadow 0.16s ease, transform 0.12s ease;
}
.ds-swatch:hover { transform: scale(1.1); }
.ds-swatch.on {
  opacity: 1;
  box-shadow: 0 0 0 2px rgba(28,28,32,1), 0 0 0 4px rgba(255,255,255,0.9);
}

.ds-root input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 22px;
  margin: 0;
  border-radius: 999px;
  background: rgba(150, 150, 155, 0.3);
  cursor: pointer;
  outline: none;
}
.ds-root input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 26px;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
}
.ds-root input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 26px;
  border: 0;
  border-radius: 999px;
  background: #fff;
}
.ds-root input[type="range"]::-moz-range-track { background: transparent; }

.ds-reset {
  align-self: stretch;
  height: 30px;
  border: 0;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.14);
  color: rgba(240, 240, 245, 0.92);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.16s ease;
}
.ds-reset:hover { background: rgba(255, 255, 255, 0.22); }
`;
