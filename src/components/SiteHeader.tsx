import Link from "next/link";

const nav = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
] as const;

export function SiteHeader() {
  return (
    <header className="border-b border-foreground/10 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-display text-lg tracking-tight text-foreground transition-opacity hover:opacity-70"
        >
          Portfolio
        </Link>
        <nav className="flex items-center gap-8">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="mailto:hello@example.com"
            className="text-sm font-medium text-accent transition-colors hover:text-foreground"
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
