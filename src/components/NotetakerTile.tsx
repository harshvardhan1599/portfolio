// Sensei "meeting notetaker" tile. Responsive aspect-ratio (height tracks
// width); AR tuned via a temporary dev slider and baked in.

import Image from "next/image";
import { tint } from "@/components/tint";

const AR = 1.24;

export function NotetakerTile() {
  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{ aspectRatio: AR, backgroundColor: tint("/work/sensei-notetaker.png") }}
    >
      <Image
        src="/work/sensei-notetaker.png"
        alt="Sensei Agent — meeting notetaker with live video call"
        width={2412}
        height={1941}
        sizes="(min-width: 768px) 50vw, 100vw"
        className="h-full w-full object-cover object-center"
      />
    </div>
  );
}
