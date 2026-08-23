// The markup for the band's canvas, as an inert HTML string.
//
// Deliberately free of any kernel import: DitherSlot is rendered from AboutBody,
// which is a client component, so anything reachable from here ships to the
// browser. The frame-0 pixel payload — which does need the kernel — lives in
// poster.ts and is imported only by the (server-only) root layout.

import { DITHER_DEFAULTS } from "./config";

// Widest bitmap we bake. 160 cells × 23px = 3680px, so the poster covers any
// realistic viewport; the surplus is clipped by the slot's overflow-hidden and
// creates no document overflow. The engine narrows this to the measured column
// count as soon as it attaches.
export const COLS_MAX = 160;
export const POSTER_ROWS = Math.ceil(
  DITHER_DEFAULTS.height / DITHER_DEFAULTS.cell,
);

// A canvas React never owns. It sits inside dangerouslySetInnerHTML so React
// creates no child fibers for it: it is not hydrated, diffed, or deleted, which
// is what lets the same node survive from HTML parse through to the animation
// engine attaching to it. Explicit width/height attributes matter — an unsized
// canvas defaults to 300×150 and would paint a stray box during parse.
export const SLOT_CANVAS_HTML =
  `<canvas data-dither-canvas width="${COLS_MAX}" height="${POSTER_ROWS}" ` +
  `style="display:block;` +
  `width:${COLS_MAX * DITHER_DEFAULTS.cell}px;` +
  `height:${POSTER_ROWS * DITHER_DEFAULTS.cell}px;` +
  `image-rendering:pixelated"></canvas>`;
