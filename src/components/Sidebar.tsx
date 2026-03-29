"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem =
  | { href: string; label: string; external?: false }
  | { href: string; label: string; external: true };

const navItems: NavItem[] = [
  { href: "/", label: "Work" },
  { href: "/fun", label: "Fun" },
  { href: "/about", label: "About Me" },
  { href: "/contact", label: "Contact" },
  { href: "mailto:hello@example.com", label: "Email", external: true },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-16 left-16 hidden md:flex flex-col gap-3 pt-12">
      <nav className="flex flex-col gap-3">
        {navItems.map((item) => {
          const isActive =
            !item.external && pathname.startsWith(item.href);

          if (item.external) {
            return (
              <a
                key={item.label}
                href={item.href}
                className="text-body text-muted hover:text-foreground link-hover w-fit"
              >
                {item.label}
              </a>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`text-body link-hover w-fit ${
                isActive
                  ? "text-accent font-medium link-hover-accent"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
