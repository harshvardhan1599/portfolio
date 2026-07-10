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
    setTime(getTime());
    const interval = setInterval(() => setTime(getTime()), 60_000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  return (
    <span className="font-mono uppercase tracking-[0.02em] tabular-nums text-muted text-base md:text-lg">
      DEL, IND &bull; {time}
    </span>
  );
}
