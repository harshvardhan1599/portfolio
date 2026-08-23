// Frame 0, baked at build time.
//
// The band used to appear only after React hydrated, created a portal host, and
// waited a frame — several hundred ms of static gradient on a slow device. So
// instead the server runs the real kernel once at t = 0, encodes the resulting
// palette indices as a digit string, and ships a ~330-byte decoder that paints
// them into the slot's canvas while the HTML is still parsing.
//
// The engine's first draw uses dt = 0 and therefore reproduces this exact frame,
// so the handoff from baked pixels to live animation is a no-op.
//
// SERVER ONLY — importing this from a client component would pull the kernel
// into the browser bundle for no reason.

import { activeEmbers, DITHER_DEFAULTS, toRgb, WHITE } from "./config";
import { computeCells, createNoiseCache, NO_RIPPLES } from "./kernel";
import { COLS_MAX, POSTER_ROWS, SLOT_CANVAS_HTML } from "./slot";

const embers = activeEmbers(DITHER_DEFAULTS);

const cells = new Uint8Array(COLS_MAX * POSTER_ROWS);
computeCells(
  {
    cfg: DITHER_DEFAULTS,
    cols: COLS_MAX,
    rows: POSTER_ROWS,
    flameScroll: 0,
    emberPhase: 0,
    pointer: null,
    flare: 0,
    warm: null,
    ripples: NO_RIPPLES,
    emberCount: embers.length,
  },
  cells,
  createNoiseCache(),
);

// Palette indices are 0..5, so one ASCII digit each — no escaping concerns and
// it gzips well (~250 bytes for the whole band).
let data = "";
for (let i = 0; i < cells.length; i++) data += String.fromCharCode(48 + cells[i]);

const palette = JSON.stringify(
  [WHITE, DITHER_DEFAULTS.baseColor, ...embers].map(toRgb),
);

// Byte writes through the Uint8ClampedArray, so no endianness handling needed.
// The context is created with alpha:false to match what the engine asks for —
// context attributes are honoured only on the FIRST getContext call for an
// element, so whichever of the two runs first decides for both.
const BOOT_SCRIPT =
  `(function(){try{` +
  `var s=document.currentScript,c=s&&s.previousElementSibling;` +
  `if(!c||c.tagName!=='CANVAS')c=document.querySelector('[data-dither-slot] canvas[data-dither-canvas]');` +
  `if(!c)return;` +
  `var d="${data}",P=${palette},W=${COLS_MAX},R=${POSTER_ROWS},` +
  `g=c.getContext('2d',{alpha:false}),m=g.createImageData(W,R),a=m.data,i,p;` +
  `for(i=0;i<W*R;i++){p=P[d.charCodeAt(i)-48];a[i*4]=p[0];a[i*4+1]=p[1];a[i*4+2]=p[2];a[i*4+3]=255;}` +
  `g.putImageData(m,0,0);` +
  `}catch(e){}})();`;

// Canvas + decoder as one inert string. The script sits immediately after the
// canvas so it runs as soon as the slot is parsed, rather than waiting for the
// rest of the document. On a client-side navigation React assigns this via
// innerHTML, where scripts don't execute — correct, because by then the engine
// is already live and DitherStage docks the real canvas in.
export const DITHER_SLOT_HTML =
  SLOT_CANVAS_HTML + `<script>${BOOT_SCRIPT}</script>`;
