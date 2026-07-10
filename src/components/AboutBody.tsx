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
  // Parallax lag: as the curtain drops, the content settles up from a small
  // offset — a deeper layer moving the same way at a fraction of the speed.
  // Two layers (title, then body a beat later); static under reduced-motion.
  const [enter, setEnter] = useState(false);
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
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    // reduced-motion: settle immediately (next frame, so it isn't a synchronous
    // setState in the effect body); otherwise wait two frames so the offset
    // paints before the transition runs.
    if (reduced) {
      const raf = requestAnimationFrame(() => setEnter(true));
      return () => cancelAnimationFrame(raf);
    }
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setEnter(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  const lag = (delayMs: number) => ({
    transform: enter ? "translateY(0)" : "translateY(-32px)",
    transition: `transform 1100ms cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms`,
  });

  return (
    <article className="bg-background relative flex-1">
      {showPhotos && (
        <div style={{ animation: "fade-in 300ms ease-out" }}>
          <DraggablePhotos />
        </div>
      )}

      <div className="w-full px-6 pb-24 pt-28 md:px-14 md:pt-36">
        {/* Title — left of centre */}
        <header style={lag(250)}>
          <p className="font-mono text-xl tracking-[0.02em] text-foreground">
            /about
          </p>
          <h1 className="font-display mt-6 text-5xl leading-[1.05] tracking-[-0.02em] text-foreground sm:text-6xl lg:text-[5.25rem]">
            Hi! I&apos;m Harsh.
            <br />
            Nice to meet you
          </h1>
        </header>

        {/* Running content — right of centre, dropped down */}
        <div
          className="mt-16 flex flex-col gap-14 md:ml-[34%] md:mt-24 md:max-w-3xl md:pr-[8%]"
          style={lag(320)}
        >
          <p className="text-xl leading-[145%] text-foreground">
            I&apos;m an experienced designer and product leader partnering with
            ambitious companies to shape meaningful digital products.
          </p>

          {/* Résumé */}
          <div className="flex flex-col gap-4">
            {RESUME.map((r) => (
              <div
                key={r.year}
                className="grid grid-cols-[3.25rem_1fr] items-baseline gap-x-4 sm:grid-cols-[3.5rem_1fr_auto] sm:gap-x-8"
              >
                <span className="font-mono text-xl tabular-nums text-muted">
                  {r.year}
                </span>
                <span className="text-xl text-foreground">{r.company}</span>
                <span className="col-start-2 text-xl text-muted sm:col-start-3 sm:text-right">
                  {r.role}
                </span>
              </div>
            ))}
          </div>

          {/* What do I do */}
          <section className="flex flex-col gap-5">
            <h2 className="text-alt text-muted">What do I do?</h2>
            <p className="text-xl leading-[150%] text-foreground">
              I like to design products.
              <br />
              I&apos;ve built products across the company lifecycle — from idea
              to acquisition.
            </p>
            <p className="text-xl leading-[150%] text-foreground">
              I like to help startups figure out what they should be building and
              transform their ideas into real, tangible products.
            </p>
          </section>

          {/* How do I do it */}
          <section className="flex flex-col gap-5">
            <h2 className="text-alt text-muted">How do I do it?</h2>
            <p className="text-xl leading-[150%] text-foreground">
              I find the most powerful work I&apos;ve done to be when I&apos;ve
              been able to push code.
            </p>
          </section>

          {/* Design is a team sport */}
          <section className="flex flex-col gap-5">
            <h2 className="text-alt text-muted">Design is a team sport</h2>
            <p className="text-xl leading-[150%] text-foreground">
              Although I currently work as an IC, I&apos;ve also led design teams
              before. I find empowering other designers to do their best work
              incredibly rewarding — whether that&apos;s as a teammate or as a
              leader.
            </p>
          </section>

          {/* Keep learning */}
          <section className="flex flex-col gap-5">
            <h2 className="text-alt text-muted">Keep learning</h2>
            <p className="text-xl leading-[150%] text-foreground">
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
