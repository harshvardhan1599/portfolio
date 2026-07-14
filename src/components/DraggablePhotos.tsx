"use client";

// Draggable "finder card" photos that float over the About editorial layout.
// Each card is a cover (18px radius, 10px padding, #212124 fill, #27272A hairline
// OUTLINE, soft dark shadow) with a filename + type pill header and the media
// itself at an 8px radius. Cards are absolutely anchored, scattered with slight
// rotations, and can be picked up and dragged anywhere; grabbing one raises it
// to the top and straightens/lifts it slightly. Desktop only (md+).

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
  top: number; // vertical anchor, px
  edge: "left" | "right"; // which side gutter the card lives in
  off: number; // distance from that edge at the reference width, px
  rot: number; // resting rotation, deg
};

// Responsiveness: cards are pinned to their side gutter and pushed further
// toward (and off) that edge as the viewport narrows from REF_W → HIDE_W, then
// the whole layer is hidden below HIDE_W (mobile) — text-only, never covered.
const REF_W = 1440; // width the positions were tuned at
const HIDE_W = 768; // below this (mobile / md breakpoint), cards are hidden
const PUSH_MAX = 520; // px a card slides toward its edge across the range

// Cover styling from the spec.
const COVER: React.CSSProperties = {
  borderRadius: 18,
  padding: 10,
  backgroundColor: "#212124",
  outline: "1px solid #27272A",
  outlineOffset: -1,
  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.45)",
};

// off = distance from the card's edge to its near side at REF_W (negative =
// already bleeding off that edge). Derived from the tuned 1440px placements.
const CARDS: CardDef[] = [
  { id: "disco", name: "disco.jpg", kind: "image", src: "/carousel/carousel2.png", width: 362, aspect: "3 / 2", top: 1060, edge: "right", off: -169, rot: -2 },
  { id: "sunday", name: "sunday.jpg", kind: "image", src: "/about/sunday.jpg", width: 336, aspect: "3 / 4", top: 403, edge: "left", off: 100, rot: 0 },
  { id: "columns", name: "columns.jpg", kind: "image", src: "/carousel/carousel1.png", width: 280, aspect: "3 / 4", top: 557, edge: "right", off: -91, rot: -4 },
  { id: "lake", name: "lake.mp4", kind: "video", src: "/carousel/carousel4.mp4", width: 342, aspect: "3 / 4", top: 976, edge: "left", off: 120, rot: 5 },
  { id: "strips", name: "strips.mp4", kind: "gradient", src: "/about/strips-loop.mp4", width: 404, aspect: "16 / 9", top: 155, edge: "right", off: 304, rot: -3 },
];

type Pos = { x: number; y: number; z: number };

export function DraggablePhotos() {
  const [pos, setPos] = useState<Record<string, Pos>>(() =>
    Object.fromEntries(CARDS.map((c, i) => [c.id, { x: 0, y: 0, z: 10 + i }])),
  );
  const [dragId, setDragId] = useState<string | null>(null);
  const [stripsPreset, setStripsPreset] = useState("Opal");
  // Staggered entrance: the whole layer already mounts after the text cascade
  // (deferred in AboutBody until `dither:settled`), so each card just fades +
  // scales in one after another once mounted. Reduced-motion shows instantly.
  const [enter, setEnter] = useState(false);
  // once the staggered entrance is done, transform transitions switch to a
  // short, delay-free ease so the responsive edge-push tracks resize smoothly
  // (the entrance's per-card delay would otherwise make the push feel laggy).
  const [entered, setEntered] = useState(false);
  const [reduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  // live viewport width → drives the outward push + hide breakpoint
  const [vw, setVw] = useState(REF_W);
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      setVw(window.innerWidth);
    };
    const onResize = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);
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

  useEffect(() => {
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setEnter(true));
    });
    // entrance ends after base + last card's stagger + duration
    const total = reduced ? 0 : 150 + (CARDS.length - 1) * 120 + 640 + 100;
    const t = window.setTimeout(() => setEntered(true), total);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(t);
    };
  }, [reduced]);

  // below the breakpoint: no cards at all, text only (never covered)
  if (vw < HIDE_W) return null;

  // 0 at/above the design width → 1 at the hide breakpoint; eased (quadratic) so
  // cards stay near their tuned spots when there's room and slide hard toward the
  // edges only as the viewport gets tight — clearing the text before they vanish.
  const t = Math.max(0, Math.min(1, (REF_W - vw) / (REF_W - HIDE_W)));
  const pushFactor = t * t;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 hidden overflow-visible md:block">
      {CARDS.map((c, i) => {
        const p = pos[c.id];
        const dragging = dragId === c.id;
        const rot = dragging ? c.rot * 0.3 : c.rot;
        const shown = reduced || enter;
        // entrance folds into the existing drag transform: a slight scale-up +
        // rise, staggered 120ms per card after a short base delay.
        const entScale = shown ? 1 : 0.9;
        const entRise = shown ? 0 : 14;
        const stagger = 150 + i * 120;
        // push toward this card's edge as the viewport narrows (left → −x)
        const pushX =
          pushFactor * PUSH_MAX * (c.edge === "left" ? -1 : 1);
        return (
          <div
            key={c.id}
            onPointerDown={(e) => onDown(e, c.id)}
            onPointerMove={onMove}
            onPointerUp={onUp}
            className="pointer-events-auto absolute select-none"
            style={{
              ...COVER,
              top: c.top,
              left: c.edge === "left" ? c.off : undefined,
              right: c.edge === "right" ? c.off : undefined,
              width: c.width,
              zIndex: p.z,
              touchAction: "none",
              opacity: shown ? 1 : 0,
              transform: `translate(${p.x + pushX}px, ${p.y + entRise}px) rotate(${rot}deg) scale(${(dragging ? 1.03 : 1) * entScale})`,
              transition: dragging
                ? "box-shadow 200ms ease"
                : reduced
                  ? "transform 220ms cubic-bezier(0.22, 1, 0.36, 1)"
                  : entered
                    ? "transform 480ms cubic-bezier(0.22, 1, 0.36, 1)"
                    : `transform 640ms cubic-bezier(0.22, 1, 0.36, 1) ${enter ? stagger : 0}ms, opacity 560ms ease-out ${enter ? stagger : 0}ms`,
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
