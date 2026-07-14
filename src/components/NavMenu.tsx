"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  const router = useRouter();
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

  // keyboard shortcuts — the [W]/[A]/[T]/[C] badges are live: press the letter to
  // jump to that tab (ignored while typing or when a modifier is held).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(input|textarea|select)$/i.test(t.tagName)))
        return;
      const item = navItems.find(
        (n) => n.key.toLowerCase() === e.key.toLowerCase(),
      );
      if (!item) return;
      e.preventDefault();
      if (item.external) window.location.href = item.href;
      else if (!navigate(item.href)) router.push(item.href);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, router]);

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
              className={`inline-flex items-center gap-1.5 transition-colors ${
                active
                  ? "text-foreground"
                  : "text-foreground/55 hover:text-foreground"
              }`}
            >
              {item.label}
              <kbd className="font-mono text-[0.82em] text-foreground/35">
                [{item.key}]
              </kbd>
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
                ? "transform 100ms ease-out, width 100ms ease-out"
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
          className="flex items-center gap-2 rounded-xl border border-foreground/40 px-4 py-2 text-foreground/80 transition-[color,border-color,transform] duration-[120ms] ease-out hover:border-foreground/70 hover:text-foreground active:scale-[0.97] motion-reduce:active:scale-100"
        >
          {CONTACT.label}
          <kbd className="font-mono text-[0.95em] text-foreground/50">
            [{CONTACT.key}]
          </kbd>
        </a>
      )}
    </nav>
  );
}
