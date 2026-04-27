"use client";

import { useState } from "react";

export function Toggle({
  defaultOn = false,
  ariaLabel = "Toggle",
  className = "",
}: {
  defaultOn?: boolean;
  ariaLabel?: string;
  className?: string;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={ariaLabel}
      onClick={() => setOn((v) => !v)}
      className={`relative inline-flex h-20 w-10 shrink-0 flex-col items-center rounded-full border transition-colors ${
        on
          ? "bg-foreground border-foreground/10"
          : "bg-[#E4E4E7] border-[#D6D6D9]"
      } ${className}`}
    >
      <span
        className={`h-8 w-8 rounded-full bg-white border-[0.5px] border-[#D6D6D9] shadow-sm transition-transform ${
          on ? "translate-y-1" : "translate-y-[44px]"
        }`}
      />
    </button>
  );
}
