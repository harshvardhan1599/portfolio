"use client";

export function Toggle({
  on,
  onChange,
  ariaLabel = "Toggle",
  className = "",
}: {
  on: boolean;
  onChange: (next: boolean) => void;
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={ariaLabel}
      onClick={() => onChange(!on)}
      className={`relative inline-flex h-20 w-10 shrink-0 flex-col items-center overflow-hidden rounded-full border-2 border-foreground/10 bg-[#E4E4E7] dark:bg-[#303032] ${className}`}
    >
      <span
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to bottom, #F6D890 0%, #FFCBA1 40%, #84A1F0 100%)",
        }}
        className={`pointer-events-none absolute -inset-0.5 rounded-full bg-no-repeat transition-opacity duration-200 ease-out ${
          on ? "opacity-100" : "opacity-0"
        }`}
      />
      <span
        className={`relative h-8 w-8 rounded-full bg-white dark:bg-[#1F1F22] border-[0.5px] border-[#D6D6D9] dark:border-white/10 shadow-sm transition-transform duration-200 [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)] ${
          on ? "translate-y-1" : "translate-y-[44px]"
        }`}
      />
    </button>
  );
}
