"use client";

// The single top-right menu for the whole site. Lives in the root layout so it
// never remounts (survives the home↔about dither transition) and is the SAME
// navbar on every route — home, about, tinkerings, and case studies alike.
// Positioned ABSOLUTE (not fixed) so it scrolls away with the page.
//
// Light-top routes (e.g. Tinkerings, whose header is a light .surface-light
// band) get the light token set applied to the menu wrapper: NavMenu's text
// flips to the dark theme, AND the custom cursor — which decides light/dark by
// walking up to the nearest .surface-light — inverts to its dark form over the
// menu. Background is kept transparent so there's no white box, just the tokens.

import { usePathname } from "next/navigation";
import { NavMenu } from "./NavMenu";

// routes whose top area (where the menu sits) is light
const LIGHT_TOP = new Set<string>([]);

export function SiteMenu() {
  const pathname = usePathname();
  // Case-study pages (/work/*) are light-themed at the top. (Tinkerings now has
  // a dark blue hero, so it stays on the default light-on-dark menu.)
  const lightTop = LIGHT_TOP.has(pathname) || pathname.startsWith("/work/");

  return (
    <div
      className={`absolute right-6 top-12 z-50 md:right-14 md:top-14 ${
        lightTop ? "surface-light" : ""
      }`}
      style={lightTop ? { background: "transparent" } : undefined}
    >
      <NavMenu />
    </div>
  );
}
