"use client";

import Link from "next/link";
import { navItems } from "@/components/Sidebar";

export function NavMenu() {
  const links = navItems.filter((item) => !item.external);
  const contact = navItems.find((item) => item.external);

  return (
    <nav className="flex items-center gap-6 text-[17px] text-muted">
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
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
