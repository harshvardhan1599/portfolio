"use client";

// A case-study image tile with adjustable padding. When `tune` is set, a
// dev-only slider (portaled to <body>, stacked by `sliderIndex` so several
// don't overlap) drives the padding; otherwise it renders the baked `padding`.
// Once locked, set `padding` and drop `tune`.

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { tint } from "@/components/tint";

interface Props {
  src: string;
  alt: string;
  width: number;
  height: number;
  aspect: string; // e.g. "660 / 440"
  padding?: number; // px
  bg?: string; // tailwind bg class
  cover?: boolean; // fill the tile (object-cover) vs fit inside (object-contain)
  tune?: boolean; // show the dev padding slider
  sliderIndex?: number; // vertical stacking offset for the slider
  label?: string;
}

export function PaddedTile({
  src,
  alt,
  width,
  height,
  aspect,
  padding = 0,
  bg = "bg-fill-secondary",
  cover = false,
  tune = false,
  sliderIndex = 0,
  label = "Padding",
}: Props) {
  const [pad, setPad] = useState(padding);
  const [mounted, setMounted] = useState(false);
  const dev = process.env.NODE_ENV !== "production";

  useEffect(() => setMounted(true), []);

  const showSlider = tune && dev && mounted;

  return (
    <div
      className={`overflow-hidden rounded-2xl transition-colors hover:bg-fill-hover ${bg}`}
      style={{
        aspectRatio: aspect,
        padding: tune ? pad : padding,
        backgroundColor: tint(src),
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(min-width: 768px) 50vw, 100vw"
        className={`h-full w-full ${cover ? "object-cover" : "object-contain"}`}
      />

      {showSlider &&
        createPortal(
          <div
            style={{
              position: "fixed",
              left: 24,
              bottom: 24 + sliderIndex * 78,
              zIndex: 50,
              width: 240,
              padding: 14,
              borderRadius: 14,
              background: "rgba(28,28,32,0.72)",
              backdropFilter: "blur(20px) saturate(150%)",
              WebkitBackdropFilter: "blur(20px) saturate(150%)",
              boxShadow:
                "0 12px 36px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.08)",
              color: "rgba(240,240,245,0.9)",
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
              fontSize: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingBottom: 8,
              }}
            >
              <span>{label}</span>
              <span style={{ opacity: 0.7, fontVariantNumeric: "tabular-nums" }}>
                {pad}px
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={120}
              step={2}
              value={pad}
              onChange={(e) => setPad(parseInt(e.target.value, 10))}
              style={{ width: "100%" }}
            />
          </div>,
          document.body,
        )}
    </div>
  );
}
