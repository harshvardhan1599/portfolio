"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { navItems } from "@/components/Sidebar";

const projectNames: Record<string, string> = {
  "/work/sensei-agent": "Sensei Agent",
  "/work/airbase": "Airbase",
  "/work/swadesh": "Swadesh",
};

function CaretRight() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M12 6L22 16L12 26"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Logo() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <g clipPath="url(#clip0_73_30618)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.00275 5.0832C3.27351 4.81244 3.7125 4.81244 3.98326 5.0832L6.4099 7.50983C6.68066 7.78059 6.68066 8.21958 6.4099 8.49034L3.98326 10.917C3.7125 11.1877 3.27351 11.1877 3.00275 10.917L0.576117 8.49034C0.305357 8.21958 0.305357 7.78059 0.576117 7.50983L3.00275 5.0832Z"
          fill="var(--accent)"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.50959 0.576605C7.78035 0.305845 8.21934 0.305845 8.4901 0.576605L10.9167 3.00324C11.1875 3.274 11.1875 3.71299 10.9167 3.98375L8.4901 6.41039C8.21934 6.68115 7.78035 6.68115 7.50959 6.41039L5.08295 3.98375C4.81219 3.71299 4.81219 3.274 5.08295 3.00324L7.50959 0.576605Z"
          fill="var(--accent)"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.0164 5.0832C12.2872 4.81244 12.7262 4.81244 12.9969 5.0832L15.4236 7.50983C15.6943 7.78059 15.6943 8.21958 15.4236 8.49034L12.9969 10.917C12.7262 11.1877 12.2872 11.1877 12.0164 10.917L9.58979 8.49034C9.31903 8.21958 9.31903 7.78059 9.58979 7.50983L12.0164 5.0832Z"
          fill="var(--accent)"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.50959 9.58979C7.78035 9.31903 8.21934 9.31903 8.4901 9.58979L10.9167 12.0164C11.1875 12.2872 11.1875 12.7262 10.9167 12.9969L8.4901 15.4236C8.21934 15.6943 7.78035 15.6943 7.50959 15.4236L5.08295 12.9969C4.81219 12.7262 4.81219 12.2872 5.08295 12.0164L7.50959 9.58979Z"
          fill="var(--accent)"
        />
      </g>
      <defs>
        <clipPath id="clip0_73_30618">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M3 6h14M3 10h14M3 14h14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M5 5l10 10M15 5L5 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Header() {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const barRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const projectName = projectNames[pathname];

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setHidden(y > lastY.current && y > 48);
      lastY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Publish the header bar's real height so the content offset (pt) always
  // matches it exactly. We measure the top bar only (not the mobile dropdown)
  // and add 1px for the header's bottom border.
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const root = document.documentElement;
    const apply = () => {
      const h = Math.ceil(bar.getBoundingClientRect().height) + 1;
      root.style.setProperty("--header-h", `${h}px`);
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(bar);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navItemClass = (isActive: boolean) =>
    `text-[15px] leading-[140%] link-hover ${
      isActive
        ? "text-accent font-medium link-hover-accent"
        : "text-muted hover:text-foreground"
    }`;

  function isActive(item: (typeof navItems)[number]) {
    if (item.external) return false;
    if (item.href === "/") return pathname === "/";
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-10 border-b border-dashed border-border mx-5 sm:mx-12 bg-background transition-transform duration-300 ease-out ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div ref={barRef} className="px-5 py-4 flex items-center justify-between">
        <nav className="text-alt text-muted flex items-center gap-2 min-w-0">
          <Logo />
          {projectName ? (
            <>
              <Link
                href="/"
                className="hover:text-foreground transition-colors whitespace-nowrap"
              >
                <span className="sm:hidden">HARSH</span>
                <span className="hidden sm:inline">HARSH VARDHAN SINGH</span>
              </Link>
              <CaretRight />
              <span className="text-foreground truncate">
                {projectName.toUpperCase()}
              </span>
            </>
          ) : (
            <span className="whitespace-nowrap">HARSH VARDHAN SINGH</span>
          )}
        </nav>
        <nav className="hidden sm:flex xl:hidden items-center gap-1 font-mono uppercase">
          {navItems.map((item) => {
            const cls = navItemClass(isActive(item));
            if (item.external) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className={cls}
                >
                  {item.label}
                </a>
              );
            }
            return (
              <Link key={item.href} href={item.href} className={cls}>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="t-icon-swap text-foreground h-8 w-8 rounded-full"
            data-state={menuOpen ? "b" : "a"}
          >
            <span className="t-icon" data-icon="a">
              <HamburgerIcon />
            </span>
            <span className="t-icon" data-icon="b">
              <CloseIcon />
            </span>
          </button>
        </div>
      </div>
      <div
        className={`hidden max-sm:grid transition-[grid-template-rows] duration-300 ease-out ${
          menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <nav className="flex flex-col items-start gap-2 px-5 pb-5 font-mono uppercase">
            {navItems.map((item) => {
              const cls = navItemClass(isActive(item));
              if (item.external) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className={cls}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cls}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
