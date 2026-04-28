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
      className={`relative inline-flex h-20 w-10 shrink-0 flex-col items-center overflow-hidden rounded-full border-2 border-foreground/10 bg-[#E4E4E7] ${className}`}
    >
      <span
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to bottom, #F6D890 0%, #FFCBA1 40%, #84A1F0 100%)",
        }}
        className={`pointer-events-none absolute -inset-0.5 rounded-full bg-no-repeat transition-opacity duration-500 ease-out ${
          on ? "opacity-100" : "opacity-0"
        }`}
      />
      <span
        className={`relative h-8 w-8 rounded-full bg-white border-[0.5px] border-[#D6D6D9] shadow-sm transition-transform duration-500 ease-out ${
          on ? "translate-y-1" : "translate-y-[44px]"
        }`}
      />
    </button>
  );
}
