// Hero right column: nav menu pinned to the top, secondary text to the bottom.
// The parent stretches both hero columns to equal height (items-stretch), and
// justify-between here spreads menu ↔ text to fill it so the bottoms align with
// the left column's title.

import { NavMenu } from "./NavMenu";

export function HeroAside() {
  return (
    <div className="flex flex-col items-start gap-10 md:items-end md:justify-between md:gap-0">
      <NavMenu />
      <p className="max-w-sm font-sans text-[24px] font-normal leading-[135%] text-foreground md:max-w-[42rem] md:text-right">
        I love building interfaces and softwares, obsessing over every detail
        until the experience feels right.
      </p>
    </div>
  );
}
