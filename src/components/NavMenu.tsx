"use client";

import Link from "next/link";
import { navItems } from "@/components/Sidebar";
import { useDitherNav } from "@/components/DitherStage";

export function NavMenu() {
  const links = navItems.filter((item) => !item.external);
  const contact = navItems.find((item) => item.external);
  const navigate = useDitherNav();

  return (
    <nav className="flex items-center gap-6 text-base text-muted md:text-lg">
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          // home↔about links are taken over by the shared-dither transition;
          // navigate() returns false for anything else → normal navigation.
          onClick={(e) => {
            if (navigate(item.href)) e.preventDefault();
          }}
          className="underline decoration-1 decoration-muted/50 underline-offset-[12px] transition-colors hover:decoration-foreground"
        >
          {item.label}
        </Link>
      ))}
      {contact && (
        <a
          href={contact.href}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-xl border border-[#505053] bg-[#212124] px-4 py-2 text-muted transition-colors hover:border-[#6a6a6e]"
        >
          {contact.label}
          <span className="font-mono">C</span>
        </a>
      )}
    </nav>
  );
}
