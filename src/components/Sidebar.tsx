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

type MetaItem = {
  eyebrow: string;
  value: string;
  href?: string;
  external?: boolean;
};

type CaseStudyNav = {
  backHref: string;
  meta: MetaItem[];
};

const caseStudyNavs: Record<string, CaseStudyNav> = {
  "/work/sensei-agent": {
    backHref: "/",
    meta: [
      { eyebrow: "Role", value: "Founding Designer" },
      { eyebrow: "Timeline", value: "2025-26" },
      {
        eyebrow: "Website",
        value: "senseiagent.com",
        href: "https://senseiagent.com",
        external: true,
      },
      {
        eyebrow: "Case study",
        value: "Get in touch ↗",
        href: "mailto:harshvardhan1599@gmail.com",
      },
    ],
  },
  "/work/airbase": {
    backHref: "/",
    meta: [
      { eyebrow: "Role", value: "Product Designer" },
      { eyebrow: "Timeline", value: "2024" },
      {
        eyebrow: "Website",
        value: "airbase.com",
        href: "https://airbase.com",
        external: true,
      },
      {
        eyebrow: "Case study",
        value: "Get in touch ↗",
        href: "mailto:harshvardhan1599@gmail.com",
      },
    ],
  },
};

export function Sidebar() {
  const pathname = usePathname();
  const caseStudy = caseStudyNavs[pathname];

  if (caseStudy) {
    return (
      <aside className="fixed top-16 left-16 hidden md:flex flex-col gap-8 pt-12">
        <Link
          href={caseStudy.backHref}
          className="text-body text-muted hover:text-foreground link-hover w-fit inline-flex items-center gap-1.5 -mx-2 -my-1"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M16.875 10H3.125"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.75 4.375L3.125 10L8.75 15.625"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </Link>
        <dl className="flex flex-col gap-6">
          {caseStudy.meta.map((item) => (
            <div key={item.eyebrow} className="flex flex-col gap-1">
              <dt className="text-alt-sm text-muted">{item.eyebrow}</dt>
              <dd>
                {item.href ? (
                  <a
                    href={item.href}
                    {...(item.external
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                    className="text-body text-foreground hover:text-accent link-hover w-fit -mx-2 -my-1"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-body text-foreground">{item.value}</p>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </aside>
    );
  }

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
