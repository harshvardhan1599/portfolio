// Sensei "meeting notetaker" tile. Responsive aspect-ratio (height tracks
// width); AR tuned via a temporary dev slider and baked in.

import Image from "next/image";

const AR = 1.24;

export function NotetakerTile() {
  return (
    <div
      className="overflow-hidden rounded-2xl bg-fill-secondary"
      style={{ aspectRatio: AR }}
    >
      <Image
        src="/work/sensei-notetaker.png"
        alt="Sensei Agent — meeting notetaker with live video call"
        width={2412}
        height={1941}
        className="h-full w-full object-cover object-center"
      />
    </div>
  );
}
