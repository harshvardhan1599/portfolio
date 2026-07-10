"use client";

// Persistent top-right menu for the two "dither" routes (home + about). Lives in
// the root layout so it never remounts across the home↔about transition, but is
// positioned ABSOLUTE (not fixed) so it scrolls away with the page — not sticky.
// No fill, no blur: just the menu.

import { usePathname } from "next/navigation";
import { NavMenu } from "./NavMenu";

export function SiteMenu() {
  const pathname = usePathname();
  if (pathname !== "/" && pathname !== "/about") return null;
  return (
    <div className="absolute right-6 top-12 z-50 md:right-14 md:top-14">
      <NavMenu />
    </div>
  );
}
