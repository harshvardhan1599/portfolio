// Hero right column: the secondary tagline, top-aligned so its first line sits
// level with the first line of the title in the left column. The nav menu that
// used to pin to the top of this column now lives in the root layout (SiteMenu)
// as a persistent, fixed top-right element, so it stays consistent across the
// home↔about transition.

import { Reveal } from "@/components/Reveal";

export function HeroAside() {
  return (
    <div className="flex flex-col items-start md:items-end">
      {/* Two paragraphs rather than one with a <br>: the blank line is a real
          gap, so it holds when the text rewraps. gap-6/7 ≈ one line box at each
          breakpoint (18px and 20px type at 135% leading). */}
      <Reveal
        delay={160}
        className="flex max-w-sm flex-col gap-6 text-left font-sans text-lg font-normal leading-[135%] text-foreground md:max-w-[42rem] md:gap-7 md:text-xl"
      >
        <p>
          I&apos;m a 2x founding designer with experience building products,
          websites, and tools.
        </p>
        <p>Currently, founding designer at Sensei Agent.</p>
      </Reveal>
    </div>
  );
}
