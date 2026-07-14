"use client";

// The Tinkerings dither: a normal (blue → light) band that bridges the blue
// #044AB3 hero into the light body below. Its dark end is recolored to the hero
// blue so the seam is invisible, and the embers are a cool light-blue / teal /
// sea-green palette instead of the site's warm fire. data-cursor-fire opts the
// custom cursor into its pixel-square. Own DitherBand instance (unrelated to the
// shared home↔about DitherStage).

import { DitherBand } from "./DitherBand";

const HERO_BLUE = "#044AB3";
const COOL_EMBERS = ["#7EC8F0", "#2DD4BF", "#3CB371"]; // light blue, teal, sea green

export function PlaygroundDither() {
  return (
    <div
      data-cursor-fire
      // the custom cursor reads this to colour its ember trail to match the band
      data-cursor-embers={COOL_EMBERS.join(",")}
      aria-hidden
      className="w-full"
    >
      <DitherBand baseColor={HERO_BLUE} embers={COOL_EMBERS} />
    </div>
  );
}
