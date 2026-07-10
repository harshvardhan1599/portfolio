"use client";

// Draggable "finder card" photos that float over the About editorial layout.
// Each card is a cover (18px radius, 10px padding, #212124 fill, #27272A hairline
// OUTLINE, soft dark shadow) with a filename + type pill header and the media
// itself at an 8px radius. Cards are absolutely anchored, scattered with slight
// rotations, and can be picked up and dragged anywhere; grabbing one raises it
// to the top and straightens/lifts it slightly. Desktop only (md+).

import Image from "next/image";
import { useRef, useState } from "react";
import GradientBackground, {
  type GradientBackgroundHandle,
} from "@/components/GradientBackground";

type Media = { kind: "image" | "video" | "gradient"; src: string };

// Palette presets carried over from the strips gradient lab (GradientSettings).
const GRADIENT_PRESETS: Record<string, string[]> = {
  Opal: ["#f4f4f4", "#f4f4f4", "#decddc", "#f6b793", "#faaaab", "#bcbdfe"],
  Nocturne: ["#ff9c79", "#e93855", "#ee85e2", "#5662f2", "#014677", "#02020a"],
  Periwinkle: ["#aecbf5", "#c2cbf1", "#d2c9ec", "#e2d4e8", "#ead9e6", "#6f86dd"],
  Sunrise: ["#fff4e6", "#ffd29a", "#ff9d6c", "#f0635e", "#b6477f", "#8a5fd0"],
  Mint: ["#f0fff7", "#9ef0cf", "#34c2b6", "#3a86c8", "#6f7be0", "#c9a0e8"],
};
const swatchBg = (p: string[]) =>
  `radial-gradient(circle at 50% 34%, ${p[0]} 0%, ${p[1]} 20%, ${p[2]} 40%, ${p[3]} 58%, ${p[4]} 76%, ${p[5]} 100%)`;

type CardDef = Media & {
  id: string;
  name: string;
  width: number; // card width, px
  aspect: string; // media box aspect-ratio, "w / h"
  anchor: { top: number; left?: number; right?: number };
  rot: number; // resting rotation, deg
};

// Cover styling from the spec.
const COVER: React.CSSProperties = {
  borderRadius: 18,
  padding: 10,
  backgroundColor: "#212124",
  outline: "1px solid #27272A",
  outlineOffset: -1,
  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.45)",
};

const CARDS: CardDef[] = [
  { id: "disco", name: "disco.jpg", kind: "image", src: "/carousel/carousel2.png", width: 362, aspect: "3 / 2", anchor: { top: 1060, right: -169 }, rot: -2 },
  { id: "sunday", name: "sunday.jpg", kind: "image", src: "/about/sunday.jpg", width: 336, aspect: "3 / 4", anchor: { top: 403, left: 100 }, rot: 0 },
  { id: "columns", name: "columns.jpg", kind: "image", src: "/carousel/carousel1.png", width: 280, aspect: "3 / 4", anchor: { top: 557, left: 1251 }, rot: -4 },
  { id: "lake", name: "lake.mp4", kind: "video", src: "/carousel/carousel4.mp4", width: 342, aspect: "3 / 4", anchor: { top: 976, right: 978 }, rot: 5 },
  { id: "strips", name: "strips.mp4", kind: "gradient", src: "/about/strips-loop.mp4", width: 404, aspect: "16 / 9", anchor: { top: 155, left: 732 }, rot: -3 },
];

type Pos = { x: number; y: number; z: number };

export function DraggablePhotos() {
  const [pos, setPos] = useState<Record<string, Pos>>(() =>
    Object.fromEntries(CARDS.map((c, i) => [c.id, { x: 0, y: 0, z: 10 + i }])),
  );
  const [dragId, setDragId] = useState<string | null>(null);
  const [stripsPreset, setStripsPreset] = useState("Opal");
  const gradientRef = useRef<GradientBackgroundHandle>(null);
  const topZ = useRef(10 + CARDS.length);
  const drag = useRef<{
    id: string;
    px: number;
    py: number;
    ox: number;
    oy: number;
  } | null>(null);

  const onDown = (e: React.PointerEvent, id: string) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    topZ.current += 1;
    drag.current = { id, px: e.clientX, py: e.clientY, ox: pos[id].x, oy: pos[id].y };
    setDragId(id);
    setPos((p) => ({ ...p, [id]: { ...p[id], z: topZ.current } }));
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const x = d.ox + (e.clientX - d.px);
    const y = d.oy + (e.clientY - d.py);
    setPos((p) => ({ ...p, [d.id]: { ...p[d.id], x, y } }));
  };
  const onUp = () => {
    drag.current = null;
    setDragId(null);
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-10 hidden overflow-visible md:block">
      {CARDS.map((c) => {
        const p = pos[c.id];
        const dragging = dragId === c.id;
        const rot = dragging ? c.rot * 0.3 : c.rot;
        return (
          <div
            key={c.id}
            onPointerDown={(e) => onDown(e, c.id)}
            onPointerMove={onMove}
            onPointerUp={onUp}
            className="pointer-events-auto absolute select-none"
            style={{
              ...COVER,
              top: c.anchor.top,
              left: c.anchor.left,
              right: c.anchor.right,
              width: c.width,
              zIndex: p.z,
              touchAction: "none",
              transform: `translate(${p.x}px, ${p.y}px) rotate(${rot}deg) scale(${dragging ? 1.03 : 1})`,
              transition: dragging
                ? "box-shadow 200ms ease"
                : "transform 220ms cubic-bezier(0.22, 1, 0.36, 1)",
              boxShadow: dragging
                ? "0 18px 40px rgba(0, 0, 0, 0.55)"
                : COVER.boxShadow,
              cursor: dragging ? "grabbing" : "grab",
            }}
          >
            {/* header: filename + type pill (or palette swatches for the gradient) */}
            <div className="flex items-center justify-between px-1 pb-2.5">
              <span className="font-sans text-[15px] leading-none text-white/90">
                {c.name}
              </span>
              {c.kind === "gradient" ? (
                <div
                  className="flex gap-1.5"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  {Object.entries(GRADIENT_PRESETS).map(([name, p]) => (
                    <button
                      key={name}
                      type="button"
                      title={name}
                      aria-label={name}
                      onClick={() => {
                        gradientRef.current?.setConfig({ palette: p });
                        setStripsPreset(name);
                      }}
                      className="h-4 w-4 rounded-full transition-transform hover:scale-110"
                      style={{
                        background: swatchBg(p),
                        boxShadow:
                          stripsPreset === name
                            ? "0 0 0 2px rgba(255,255,255,0.95), 0 1px 3px rgba(0,0,0,0.45)"
                            : "inset 0 0 0 1px rgba(255,255,255,0.5), 0 1px 3px rgba(0,0,0,0.4)",
                      }}
                    />
                  ))}
                </div>
              ) : (
                <span className="rounded-full border border-white/15 px-2.5 py-1 font-sans text-[12px] leading-none text-white/50">
                  {c.kind}
                </span>
              )}
            </div>

            {/* media */}
            <div
              className="relative overflow-hidden"
              style={{ borderRadius: 8, aspectRatio: c.aspect }}
            >
              {c.kind === "image" ? (
                <Image
                  src={c.src}
                  alt={c.name}
                  fill
                  draggable={false}
                  className="object-cover"
                  sizes="500px"
                />
              ) : c.kind === "video" ? (
                <video
                  src={c.src}
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <GradientBackground
                  ref={gradientRef}
                  palette={GRADIENT_PRESETS[stripsPreset]}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 0,
                  }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
