"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { navItems } from "@/components/Sidebar";
import { useDitherNav } from "@/components/DitherStage";

// One shared, offset underline that sits under the ACTIVE tab and slides
// horizontally to the next tab on navigation. NavMenu lives in the persistent
// SiteMenu (never remounts), so the indicator animates across every route
// change — including the home↔about dither transition.

function isActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/" || pathname.startsWith("/work");
  return pathname === href || pathname.startsWith(`${href}/`);
}

// stable references so the measure effect doesn't re-run every render
const LINKS = navItems.filter((item) => !item.external);
const CONTACT = navItems.find((item) => item.external);

export function NavMenu() {
  const navigate = useDitherNav();
  const pathname = usePathname();

  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);
  // first placement is instant; subsequent moves animate (so it doesn't slide in
  // from the corner on load).
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const measure = () => {
      const idx = LINKS.findIndex((l) => isActive(l.href, pathname));
      const el = idx >= 0 ? linkRefs.current[idx] : null;
      setIndicator(el ? { left: el.offsetLeft, width: el.offsetWidth } : null);
    };
    measure();
    // re-measure once the web fonts settle (link widths change) and on resize
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  // enable the sliding transition after the first measured placement
  useEffect(() => {
    const raf = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <nav className="flex items-center gap-6 text-base md:text-lg">
      {/* links group — relative box that hosts the sliding underline; the extra
          bottom padding is the underline's offset, negated in the flex row so it
          doesn't change the row's height/alignment. */}
      <div className="relative -mb-3 flex items-center gap-6 pb-3">
        {LINKS.map((item, i) => {
          const active = isActive(item.href, pathname);
          return (
            <Link
              key={item.href}
              ref={(el) => {
                linkRefs.current[i] = el;
              }}
              href={item.href}
              aria-current={active ? "page" : undefined}
              // home↔about links are taken over by the shared-dither transition;
              // navigate() returns false for anything else → normal navigation.
              onClick={(e) => {
                if (navigate(item.href)) e.preventDefault();
              }}
              className={`transition-colors ${
                active ? "text-foreground" : "text-muted hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          );
        })}

        {indicator && (
          <span
            aria-hidden
            className="bg-foreground pointer-events-none absolute bottom-0 left-0 h-px"
            style={{
              width: indicator.width,
              transform: `translateX(${indicator.left}px)`,
              transition: animate
                ? "transform 450ms cubic-bezier(0.4, 0, 0.1, 1), width 450ms cubic-bezier(0.4, 0, 0.1, 1)"
                : "none",
            }}
          />
        )}
      </div>

      {CONTACT && (
        <a
          href={CONTACT.href}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-xl border border-[#505053] bg-[#212124] px-4 py-2 text-muted transition-colors hover:border-[#6a6a6e]"
        >
          {CONTACT.label}
          <span className="font-mono">C</span>
        </a>
      )}
    </nav>
  );
}
