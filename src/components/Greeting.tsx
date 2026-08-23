"use client";

import { useEffect, useState } from "react";

function getTime(): string {
  return new Date().toLocaleTimeString("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function Greeting() {
  const [time, setTime] = useState("");

  useEffect(() => {
    // client-only clock: set after mount to avoid an SSR hydration mismatch
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTime(getTime());
    const interval = setInterval(() => setTime(getTime()), 60_000);
    return () => clearInterval(interval);
  }, []);

  // The label always renders, even before the clock resolves: returning null
  // until then shipped a zero-height node, and the line appearing at hydration
  // grew the hero column and pushed everything below it — the dither band
  // included — down the page. Only the digits are deferred, and they change
  // width, not height, so there's nothing left to shift.
  return (
    // Sans at text-base/lg to match NavMenu across the hero. tabular-nums stays
    // so the clock's digits don't shuffle the line's width each minute.
    <span className="font-sans tabular-nums text-muted text-base md:text-lg">
      Delhi, India &bull; {time}
    </span>
  );
}
