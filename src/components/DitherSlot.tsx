// DitherSlot — a full-width placeholder that reserves the dither band's space in
// a page's flow and carries the band's canvas. The persistent DitherStage drives
// whichever slot is mounted; during a page transition the canvas travels out of
// the slot into a fixed strip (the slot keeps its height so the layout doesn't
// jump) and docks back in on arrival.
//
// The canvas ships in the server HTML with frame 0 already baked into it and a
// tiny inline decoder right behind it (see dither/poster.ts), so the band paints
// as the slot is parsed rather than after hydration. That makes this a SERVER
// component — importing it from a client component would drag the dither kernel
// into the browser bundle (see how about/page.tsx passes it down to AboutBody).
//
// The markup goes in via dangerouslySetInnerHTML because React skips child
// reconciliation entirely for such elements: a plain server-rendered <canvas>
// child would be deleted at hydration as unexpected markup, and any later diff
// would destroy the very node the animation engine is holding.
//
// height must match DITHER_DEFAULTS.height (232) in dither/config.ts.
import { DITHER_SLOT_HTML } from "./dither/poster";

export function DitherSlot() {
  return (
    <div
      data-dither-slot
      data-cursor-fire
      aria-hidden
      // the boot script mutates the canvas before hydration; don't diff it
      suppressHydrationWarning
      className="w-full overflow-hidden leading-[0]"
      // dark→white gradient (matching the dither) so the slot never flashes a
      // solid-white block against the dark content above it.
      style={{
        height: 232,
        background: "linear-gradient(to bottom, #171718, #FFFFFF)",
      }}
      dangerouslySetInnerHTML={{ __html: DITHER_SLOT_HTML }}
    />
  );
}
