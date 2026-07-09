"use client";

import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const lastUpdated = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <footer
      className={`mt-auto border-t border-dashed border-foreground/10 bg-background ${
        isHome ? "surface-light" : ""
      }`}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-sm text-muted">
          Designed + Built by Harsh and Claude.
        </p>
        <p className="font-mono text-sm text-muted">
          Last updated on {lastUpdated}
        </p>
      </div>
    </footer>
  );
}
