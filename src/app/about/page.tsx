import type { Metadata } from "next";
import Image from "next/image";
import { CameraReel } from "@/components/CameraReel";
import { CopyEmailButton } from "@/components/CopyEmailButton";
import { SelectionFrame } from "@/components/SelectionFrame";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/SocialIcons";
import { Toggle } from "@/components/Toggle";

export const metadata: Metadata = {
  title: "About",
  description: "About Harsh Vardhan Singh — product designer and builder.",
};

type TileProps = {
  eyebrow?: string;
  className?: string;
  bg?: string;
  invertText?: boolean;
  children: React.ReactNode;
};

function Tile({ eyebrow, className = "", bg, invertText, children }: TileProps) {
  const textColor = invertText ? "text-foreground-inverse" : "text-foreground";
  return (
    <div
      className={`border-overlay rounded-2xl p-6 ${bg ? "" : "bg-fill-secondary"} ${className}`}
      style={bg ? { backgroundColor: bg } : undefined}
    >
      {eyebrow ? (
        <p className={`text-alt ${textColor}`}>{eyebrow}</p>
      ) : null}
      <div className={eyebrow ? "mt-6" : ""}>{children}</div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <article className="flex-1">
      <section className="w-full max-w-4xl">
        <div className="px-6 pb-8 pt-10 md:px-10 md:pt-12 flex flex-col md:flex-row md:items-center gap-6">
          <h1 className="text-heading-md text-foreground flex-1">
            I&apos;m{" "}
            <SelectionFrame>Harsh Vardhan Singh</SelectionFrame>
            , a product designer &amp; builder, driven by curiosity and diet
            coke.
          </h1>
          <Toggle ariaLabel="Toggle" />
        </div>

        <div className="px-4 pb-8 flex flex-col gap-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-3 flex flex-col gap-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Tile eyebrow="ABOUT ME" bg="#FFCBA1">
                <p className="text-body text-foreground">
                  ✼ Greetings. I&apos;m Harsh, 26, born and live in Delhi,
                  India.
                </p>
                <p className="text-body text-foreground mt-4">
                  I&apos;ve spent the last six years at the messy overlap ⌾ of
                  design, product, and culture, working with ambitious teams
                  that create a lasting impact.
                </p>
              </Tile>

              <Tile eyebrow="TOOLS" bg="#F6D890">
                <p className="text-body text-foreground">
                  My practice lives in what comes before production and what
                  gets delivered.
                </p>
                <p className="text-body text-foreground mt-4">
                  Today, that&apos;s an infinite canvas on one end and a
                  chatbox on the other — tomorrow, something else.
                </p>
              </Tile>
            </div>

            <Tile eyebrow="PHILOSOPHY" bg="#84A1F0" invertText>
              <p className="text-body text-foreground-inverse">
                Design should disappear into use, so that the people who touch
                it never know there was a problem it solved. As software gets
                cheaper to make, that kind of judgment is where the value goes
                — and where I want to be.
              </p>
            </Tile>
          </div>

          <div className="flex flex-col gap-3 h-full">
            <div className="border-overlay rounded-2xl bg-fill flex-1 min-h-0 overflow-hidden relative">
              <Image
                src="/about/Me.png"
                alt="Portrait of Harsh Vardhan Singh"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 25vw, 100vw"
              />
              <div className="pointer-events-none absolute inset-0 rounded-2xl border border-black/10 dark:border-white/10" />
            </div>
            <div className="border-overlay rounded-2xl bg-fill flex-1 min-h-0 overflow-hidden relative">
              <Image
                src="/about/map.png"
                alt="Map of Delhi, India"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 25vw, 100vw"
              />
              <div className="pointer-events-none absolute inset-0 rounded-2xl border border-black/10 dark:border-white/10" />
            </div>
          </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[35fr_65fr] gap-3">
          <CameraReel
            images={[
              {
                src: "/carousel/carousel1.png",
                alt: "Architectural columns at sunset",
              },
              {
                src: "/carousel/carousel2.png",
                alt: "Camera reel photo 2",
              },
              {
                src: "/carousel/carousel3.mp4",
                alt: "Camera reel video",
              },
              {
                src: "/carousel/carousel4.mp4",
                alt: "Camera reel video 2",
              },
              {
                src: "/carousel/carousel5.jpg",
                alt: "Camera reel photo 3",
              },
            ]}
          />

          <div className="flex flex-col gap-3">
            <Tile eyebrow="LORE" bg="#C6E6C1">
              <p className="text-body text-foreground">
                My non-Diet-Coke-fueled hours often look like:
              </p>
              <ul className="text-body text-foreground mt-4 space-y-1">
                <li>★ horror movies, and strong opinions about them on Letterboxd</li>
                <li>◎ hikes and runs, usually in that order</li>
                <li>⚽ watching Liverpool lose</li>
                <li>⍥ a shelf of dystopian novels</li>
              </ul>
            </Tile>

            <Tile eyebrow="WE SHOULD TALK" bg="#F6ECD9">
              <p className="text-body text-foreground">
                Have something you want to pick my brain about? Interested in a
                collab? We should talk.
              </p>
              <div className="mt-10 flex items-center gap-4">
                <a
                  href="https://twitter.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter"
                  className="text-foreground hover:opacity-70 transition-opacity"
                >
                  <TwitterIcon className="h-4 w-auto" />
                </a>
                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="text-foreground hover:opacity-70 transition-opacity"
                >
                  <GithubIcon className="h-4 w-4" />
                </a>
                <a
                  href="https://linkedin.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="text-foreground hover:opacity-70 transition-opacity"
                >
                  <LinkedinIcon className="h-4 w-4" />
                </a>
                <CopyEmailButton
                  email="harshvardhan1599@gmail.com"
                  className="ml-auto"
                />
              </div>
            </Tile>
          </div>
          </div>
        </div>
      </section>
    </article>
  );
}
