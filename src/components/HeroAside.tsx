// Hero right column: the secondary tagline, bottom-aligned so it lands level
// with the title in the left column. The nav menu that used to pin to the top of
// this column now lives in the root layout (SiteMenu) as a persistent, fixed
// top-right element, so it stays consistent across the home↔about transition.

export function HeroAside() {
  return (
    <div className="flex flex-col items-start md:items-end md:justify-end">
      <p className="max-w-sm font-sans text-xl font-normal leading-[135%] text-foreground md:max-w-[42rem] md:text-right md:text-2xl">
        I love building interfaces and softwares, obsessing over every detail
        until the experience feels right.
      </p>
    </div>
  );
}
