// Sensei "Studio Display" tile: blurred wallpaper (cover) with the monitor
// mockup scaled 1.2× on top. PADDING keeps the monitor off the tile edges;
// both values were tuned via temporary dev sliders and baked in.

import Image from "next/image";
import { tint } from "@/components/tint";

const SCALE = 1.2;
const PADDING = 48; // px

export function DisplayTile() {
  return (
    <div
      className="relative aspect-[660/560] overflow-hidden rounded-2xl"
      style={{ backgroundColor: tint("/work/sensei-display-bg.png") }}
    >
      <Image
        src="/work/sensei-display-bg.png"
        alt=""
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover"
      />
      <Image
        src="/work/sensei-display.png"
        alt="Sensei Agent — deal overview on Studio Display"
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-contain"
        style={{
          padding: PADDING,
          transform: `scale(${SCALE})`,
          transformOrigin: "center",
        }}
        priority
      />
    </div>
  );
}
