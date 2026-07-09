"use client";

// Renders the animated DitherBand plus, in dev only, a live tuning panel that
// drives it via a shared imperative handle. The panel is stripped from
// production builds (NODE_ENV check), which keeps page.tsx a server component.

import { useRef } from "react";
import { DitherBand, type DitherBandHandle } from "./DitherBand";
import DitherSettings from "./DitherSettings";

export function DitherSection() {
  const ref = useRef<DitherBandHandle>(null);
  return (
    <div className="relative w-full">
      <DitherBand ref={ref} />
      {process.env.NODE_ENV !== "production" && <DitherSettings target={ref} />}
    </div>
  );
}
