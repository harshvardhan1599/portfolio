"use client";

// Per-navigation blur-in for page content. Skipped on the two "dither" routes
// (home + about), whose home↔about transition is choreographed by DitherStage —
// a blur-in there would remount and muddy the shared-dither reveal.

import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const animate = pathname !== "/" && pathname !== "/about";
  return (
    <div style={animate ? { animation: "blur-in 300ms ease-out" } : undefined}>
      {children}
    </div>
  );
}
