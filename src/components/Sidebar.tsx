"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem =
  | { href: string; label: string; external?: false }
  | { href: string; label: string; external: true };

export const navItems: NavItem[] = [
  { href: "/", label: "Work" },
  { href: "/playground", label: "Tinkerings" },
  { href: "/about", label: "About" },
  { href: "mailto:harshvardhan1599@gmail.com", label: "Contact", external: true },
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
  "/work/swadesh": {
    backHref: "/",
    meta: [
      { eyebrow: "Role", value: "Founding Designer" },
      { eyebrow: "Timeline", value: "2021-2024" },
      {
        eyebrow: "Website",
        value: "swadesh.co",
        href: "https://swadesh.co",
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

function Wordmark() {
  return (
    <svg
      width="64"
      height="27"
      viewBox="0 0 162 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Harsh Vardhan Singh"
    >
      <path
        d="M128 3C145.12 3 159 16.8795 159 34C159 51.1205 145.12 65 128 65C119.955 65 112.631 61.9385 107.119 56.9121L106.592 56.4199L106.4 56.2461C104.39 54.5076 101.35 54.5655 99.4082 56.4199C93.8402 61.7379 86.3043 65 78 65C71.125 65 64.7805 62.7658 59.6416 58.9824L59.1475 58.6113L58.9717 58.4814C57.1916 57.2311 54.8083 57.2311 53.0283 58.4814L52.8525 58.6113C47.6288 62.6194 41.097 65 34 65C16.8795 65 3 51.1205 3 34C3 16.8795 16.8795 3 34 3C41.097 3 47.6288 5.3806 52.8525 9.38867C54.707 10.8115 57.293 10.8115 59.1475 9.38867C64.3712 5.3806 70.903 3 78 3C86.3043 3 93.8402 6.26205 99.4082 11.5801C101.412 13.4943 104.588 13.4943 106.592 11.5801C112.16 6.26205 119.696 3 128 3Z"
        stroke="currentColor"
        strokeWidth="6"
      />
      <path
        d="M24.68 47V22.15H29.65V33.945L27.795 32.265H39.205L37.35 33.945V22.15H42.32V47H37.35V35.065L39.205 36.745H27.795L29.65 35.065V47H24.68ZM77.8313 47L70.5863 22.15H75.8713L81.1913 42.03H79.5813L84.9013 22.15H90.1863L82.9413 47H77.8313ZM127.483 47.56C125.593 47.56 123.983 47.1983 122.653 46.475C121.323 45.7517 120.284 44.725 119.538 43.395C118.814 42.065 118.383 40.4667 118.243 38.6L123.248 38.355C123.388 39.405 123.656 40.2917 124.053 41.015C124.449 41.7383 124.951 42.275 125.558 42.625C126.164 42.975 126.888 43.15 127.728 43.15C128.474 43.15 129.104 43.045 129.618 42.835C130.154 42.625 130.563 42.3217 130.843 41.925C131.123 41.505 131.263 41.0033 131.263 40.42C131.263 39.79 131.111 39.23 130.808 38.74C130.504 38.25 129.968 37.8067 129.198 37.41C128.451 37.0133 127.389 36.64 126.013 36.29C124.356 35.87 122.979 35.3683 121.883 34.785C120.809 34.2017 120.016 33.455 119.503 32.545C118.989 31.635 118.733 30.4917 118.733 29.115C118.733 27.5983 119.059 26.28 119.713 25.16C120.389 24.0167 121.358 23.1417 122.618 22.535C123.901 21.905 125.453 21.59 127.273 21.59C129.046 21.59 130.563 21.9167 131.823 22.57C133.083 23.2233 134.063 24.1683 134.763 25.405C135.486 26.6417 135.906 28.1467 136.023 29.92L130.983 30.165C130.866 29.3017 130.644 28.555 130.318 27.925C129.991 27.295 129.548 26.8167 128.988 26.49C128.451 26.1633 127.809 26 127.063 26C126.059 26 125.254 26.2567 124.648 26.77C124.064 27.2833 123.773 27.9833 123.773 28.87C123.773 29.4533 123.913 29.955 124.193 30.375C124.496 30.795 125.009 31.1683 125.733 31.495C126.479 31.8217 127.494 32.16 128.778 32.51C130.668 32.9533 132.161 33.5367 133.258 34.26C134.354 34.9833 135.136 35.835 135.603 36.815C136.069 37.795 136.303 38.9383 136.303 40.245C136.303 41.7383 135.953 43.0333 135.253 44.13C134.553 45.2033 133.538 46.0433 132.208 46.65C130.901 47.2567 129.326 47.56 127.483 47.56Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const caseStudy = caseStudyNavs[pathname];

  if (caseStudy) {
    return (
      <aside className="fixed top-16 left-16 hidden xl:flex flex-col gap-8 pt-12 font-mono uppercase">
        <Link
          href="/"
          aria-label="Home"
          className="text-accent link-hover w-fit mb-6"
        >
          <Wordmark />
        </Link>
        <Link
          href={caseStudy.backHref}
          className="text-[15px] leading-[140%] text-muted hover:text-foreground link-hover w-fit inline-flex items-center gap-1.5 -mx-2 -my-1"
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
                    className="text-[15px] leading-[140%] text-foreground hover:text-accent link-hover w-fit -mx-2 -my-1"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-[15px] leading-[140%] text-foreground">{item.value}</p>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </aside>
    );
  }

  return (
    <aside className="fixed top-16 left-16 hidden xl:flex flex-col gap-3 pt-12 font-mono uppercase">
      <Link
        href="/"
        aria-label="Home"
        className="text-accent link-hover w-fit mb-6"
      >
        <Wordmark />
      </Link>
      <nav className="flex flex-col gap-3">
        {navItems.map((item) => {
          const isActive =
            !item.external &&
            (item.href === "/"
              ? pathname === "/"
              : pathname === item.href ||
                pathname.startsWith(`${item.href}/`));

          if (item.external) {
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="text-[15px] leading-[140%] text-muted hover:text-foreground link-hover w-fit"
              >
                {item.label}
              </a>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[15px] leading-[140%] link-hover w-fit ${
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
