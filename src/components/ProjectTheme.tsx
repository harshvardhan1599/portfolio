"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export const projectThemes: Record<string, string> = {
  "/work/swadesh": "theme-swadesh",
  "/work/sensei-agent": "theme-sensei-agent",
};

export function ProjectTheme() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const next = projectThemes[pathname];

    Array.from(root.classList)
      .filter((c) => c.startsWith("theme-"))
      .forEach((c) => root.classList.remove(c));

    if (next) root.classList.add(next);
  }, [pathname]);

  return null;
}
