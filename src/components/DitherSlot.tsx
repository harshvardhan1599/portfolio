// DitherSlot — an inert, full-width placeholder that reserves the dither band's
// space in a page's flow. The persistent DitherStage portals the single shared
// dither canvas into whichever slot is mounted; during a page transition the
// canvas travels out of the slot into a fixed strip (the slot keeps its height
// so the layout doesn't jump) and docks back in on arrival.
//
// height must match DITHER_DEFAULTS.height (232) in DitherBand.tsx.
export function DitherSlot() {
  return (
    <div
      data-dither-slot
      data-cursor-fire
      aria-hidden
      className="w-full overflow-hidden leading-[0]"
      // dark→white gradient (matching the dither) so an empty slot never flashes
      // a solid-white block against the dark content above it.
      style={{
        height: 232,
        background: "linear-gradient(to bottom, #171718, #FFFFFF)",
      }}
    />
  );
}
