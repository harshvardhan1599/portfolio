"use client";

// Editorial About page: a mono "/about" eyebrow + large serif headline set on a
// left-of-centre column, with all the running content (intro, résumé, and the
// "what / how" notes) on a right-of-centre column that starts lower down — the
// asymmetric editorial split is the whole point of the layout. A dither pixel
// band closes the page, and an AboutCurtain plays the enter transition.

import { useEffect, useState } from "react";
import { DitherSlot } from "@/components/DitherSlot";
import { DraggablePhotos } from "@/components/DraggablePhotos";

const RESUME: { year: string; company: string; role: string }[] = [
  { year: "2025", company: "Sensei Agent", role: "Founding Designer" },
  { year: "2024", company: "Airbase (Acquired by Paylocity)", role: "Product Designer" },
  { year: "2021", company: "Swadesh YC S19 (Acquired by Conduit)", role: "Founding Designer" },
  { year: "2019", company: "ADG", role: "Creative Head" },
];

export function AboutBody() {
  // Staggered reveal: every element fades + rises into place in document order,
  // each a beat after the last. `enter` flips on after mount (two frames, so the
  // hidden state paints first); reduced-motion shows everything instantly.
  const [enter, setEnter] = useState(false);
  const [reduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  // DraggablePhotos (a WebGL gradient + autoplay video + photos) is decorative
  // and heavy to mount; defer it until the enter transition has settled so it
  // can't jank the travel. Fires on the stage's `dither:settled` event, with a
  // timeout fallback for direct loads / back-forward.
  const [showPhotos, setShowPhotos] = useState(false);
  useEffect(() => {
    const reveal = () => setShowPhotos(true);
    window.addEventListener("dither:settled", reveal);
    const t = window.setTimeout(reveal, 800);
    return () => {
      window.removeEventListener("dither:settled", reveal);
      clearTimeout(t);
    };
  }, []);
  useEffect(() => {
    // two frames so the hidden initial state paints before the reveal runs
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setEnter(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  // per-item entrance: fade + rise, staggered by index (120ms base, 80ms step)
  const reveal = (i: number): React.CSSProperties =>
    reduced
      ? {}
      : {
          opacity: enter ? 1 : 0,
          transform: enter ? "translateY(0)" : "translateY(18px)",
          transition: `opacity 700ms ease-out ${120 + i * 80}ms, transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${120 + i * 80}ms`,
          willChange: "opacity, transform",
        };

  return (
    <article className="bg-background relative flex-1 [overflow-x:clip]">
      {/* mounts after the text cascade (dither:settled); each card then
          staggers in on its own — see DraggablePhotos */}
      {showPhotos && <DraggablePhotos />}

      <div className="w-full px-6 pb-24 pt-28 md:px-14 md:pt-36">
        {/* Title — left of centre */}
        <header>
          <p
            className="font-mono text-base tracking-[0.02em] text-foreground sm:text-lg lg:text-xl"
            style={reveal(0)}
          >
            /about
          </p>
          <h1
            className="font-display mt-6 text-5xl leading-[1.05] tracking-[-0.02em] text-foreground sm:text-6xl lg:text-[5.25rem]"
            style={reveal(1)}
          >
            Hi! I&apos;m Harsh.
            <br />
            Nice to meet you
          </h1>
        </header>

        {/* Running content — right of centre, dropped down. Less indent on mid
            widths (wider column) so text doesn't get cramped before mobile. */}
        <div className="mt-16 flex flex-col gap-14 md:ml-[22%] md:mt-24 md:max-w-3xl md:pr-[8%] lg:ml-[34%]">
          <p
            className="text-base leading-[145%] text-foreground sm:text-lg lg:text-xl"
            style={reveal(2)}
          >
            I&apos;m an experienced designer and product leader partnering with
            ambitious companies to shape meaningful digital products.
          </p>

          {/* Résumé — each row staggers. Stays in its stacked (year | company /
              role) layout until xl, then goes 3-column; this avoids the company
              name wrapping to two lines in the mid/laptop range. */}
          <div className="flex flex-col gap-4">
            {RESUME.map((r, i) => (
              <div
                key={r.year}
                className="grid grid-cols-[3rem_1fr] items-baseline gap-x-4 xl:grid-cols-[3.5rem_1fr_auto] xl:gap-x-8"
                style={reveal(3 + i)}
              >
                <span className="font-mono text-base tabular-nums text-muted sm:text-lg lg:text-xl">
                  {r.year}
                </span>
                <span className="text-base text-foreground sm:text-lg lg:text-xl">
                  {r.company}
                </span>
                <span className="col-start-2 text-base text-muted sm:text-lg lg:text-xl xl:col-start-3 xl:text-right">
                  {r.role}
                </span>
              </div>
            ))}
          </div>

          {/* What do I do */}
          <section className="flex flex-col gap-5" style={reveal(7)}>
            <h2 className="text-alt text-muted">What do I do?</h2>
            <p className="text-base leading-[150%] text-foreground sm:text-lg lg:text-xl">
              I like to design products.
              <br />
              I&apos;ve built products across the company lifecycle — from idea
              to acquisition.
            </p>
            <p className="text-base leading-[150%] text-foreground sm:text-lg lg:text-xl">
              I like to help startups figure out what they should be building and
              transform their ideas into real, tangible products.
            </p>
          </section>

          {/* How do I do it */}
          <section className="flex flex-col gap-5" style={reveal(8)}>
            <h2 className="text-alt text-muted">How do I do it?</h2>
            <p className="text-base leading-[150%] text-foreground sm:text-lg lg:text-xl">
              I find the most powerful work I&apos;ve done to be when I&apos;ve
              been able to push code.
            </p>
          </section>

          {/* Design is a team sport */}
          <section className="flex flex-col gap-5" style={reveal(9)}>
            <h2 className="text-alt text-muted">Design is a team sport</h2>
            <p className="text-base leading-[150%] text-foreground sm:text-lg lg:text-xl">
              Although I currently work as an IC, I&apos;ve also led design teams
              before. I find empowering other designers to do their best work
              incredibly rewarding — whether that&apos;s as a teammate or as a
              leader.
            </p>
          </section>

          {/* Keep learning */}
          <section className="flex flex-col gap-5" style={reveal(10)}>
            <h2 className="text-alt text-muted">Keep learning</h2>
            <p className="text-base leading-[150%] text-foreground sm:text-lg lg:text-xl">
              In my spare time I&apos;m often trying to learn new things by
              building my own software. It lets me dive head first into topics
              like shaders, SwiftUI, 3D modeling, and more.
            </p>
          </section>
        </div>
      </div>

      {/* Dither closes the page — the shared canvas docks into this slot */}
      <DitherSlot />
    </article>
  );
}
