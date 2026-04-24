import type { Metadata } from "next";
import Image from "next/image";
import { SelectionFrame } from "@/components/SelectionFrame";

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

function ImageTile({ className = "", label }: { className?: string; label: string }) {
  return (
    <div
      className={`border-overlay rounded-2xl bg-fill aspect-square ${className}`}
      aria-label={label}
    >
      {/* image placeholder: {label} */}
    </div>
  );
}

export default function AboutPage() {
  return (
    <article className="flex-1">
      <section className="w-full max-w-4xl">
        <div className="px-6 pb-8 pt-10 md:px-10 md:pt-12">
          <h1 className="text-heading-md text-foreground">
            I&apos;m{" "}
            <SelectionFrame>Harsh Vardhan Singh</SelectionFrame>
            , a product designer &amp; builder, driven by curiosity and diet
            coke.
          </h1>
        </div>

        <div className="px-4 pb-8 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 flex flex-col gap-3">
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
                Design should disappear. Not use, so that the people who touch
                it never know there was a problem it solved. Its softness gets
                cheaper to make, that kind of judgment is where the value goes
                — and where I want to be.
              </p>
            </Tile>
          </div>

          <div className="flex flex-col gap-3">
            <div className="border-overlay rounded-2xl bg-fill aspect-square overflow-hidden relative">
              <Image
                src="/about/Me.png"
                alt="Portrait of Harsh Vardhan Singh"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 33vw, 100vw"
              />
            </div>
            <div className="border-overlay rounded-2xl bg-fill aspect-square overflow-hidden relative">
              <Image
                src="/about/map.png"
                alt="Map of Delhi, India"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 33vw, 100vw"
              />
            </div>
          </div>

          <ImageTile label="outside-work" />

          <Tile eyebrow="LORE" className="md:col-span-2">
            <p className="text-body text-foreground">
              My non-Diet-Coke-fueled hours often look like:
            </p>
            <ul className="text-body text-foreground mt-2 list-disc pl-5 space-y-1">
              <li>horror movies, and driving opinions about them on Letterboxd</li>
              <li>Nikes and runs, usually in that order</li>
              <li>watching Liverpool lose</li>
              <li>a shelf of dystopian novels</li>
            </ul>
          </Tile>

          <Tile eyebrow="WE SHOULD TALK" className="md:col-span-3">
            <p className="text-body text-foreground">
              Have something you want to pick my brain about? Interested in a
              collab? We should talk.
            </p>
          </Tile>
        </div>

        <div className="px-4 pb-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="#" aria-label="X" className="text-muted hover:text-foreground">
              <div className="border-overlay w-5 h-5 rounded-2xl bg-fill" />
            </a>
            <a href="#" aria-label="GitHub" className="text-muted hover:text-foreground">
              <div className="border-overlay w-5 h-5 rounded-2xl bg-fill" />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-muted hover:text-foreground">
              <div className="border-overlay w-5 h-5 rounded-2xl bg-fill" />
            </a>
          </div>
          <button
            type="button"
            className="border-overlay rounded-2xl text-alt-sm text-foreground bg-fill-secondary hover:bg-fill-hover transition-colors px-3 py-2"
          >
            Copy Email
          </button>
        </div>
      </section>
    </article>
  );
}
