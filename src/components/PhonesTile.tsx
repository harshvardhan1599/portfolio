// Sensei "Elevate Your Game" phones tile. Padding tuned via a temporary dev
// slider and baked in.

import Image from "next/image";

const PADDING = 32; // px

export function PhonesTile() {
  return (
    <div
      className="aspect-[660/460] overflow-hidden rounded-2xl bg-fill-secondary"
      style={{ padding: PADDING }}
    >
      <Image
        src="/work/Brand2.webp"
        alt="Sensei Agent — Elevate Your Game brand stories"
        width={1400}
        height={934}
        className="h-full w-full object-contain object-center"
      />
    </div>
  );
}
