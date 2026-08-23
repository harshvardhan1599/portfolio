// Dither band configuration — pure data, no DOM and no React, so the server
// poster, the animation engine and the custom cursor can all share one source
// of truth for the band's palette and geometry.

export interface DitherConfig {
  cell: number; // square size, px
  height: number; // band height, px
  speed: number; // overall animation speed
  intensity: number; // fire/flicker turbulence
  emberAmount: number; // how many ember (colored) cells, 0..1
  riseSpeed: number; // how fast the flame field scrolls up
  noiseScale: number; // flame feature frequency (bigger = busier)
  fade: number; // black→white transition softness (bigger = softer)
  stokeStrength: number; // cursor hover: added heat at the pointer
  stokeRadius: number; // cursor hover: influence radius, in cells
  travel: boolean; // page-transition mode: 30fps + single noise octave (cheaper)
  // dark end of the dither (seams with the hero); default matches the site hero
  baseColor: string;
  // explicit ember palette; when null, built from the toggles below
  embers: string[] | null;
  // ember palette toggles
  yellow: boolean;
  purple: boolean;
  blue: boolean;
  orange: boolean;
}

export interface DitherBandHandle {
  setConfig: (c: Partial<DitherConfig>) => void;
}

export const DITHER_DEFAULTS: DitherConfig = {
  cell: 23,
  height: 232,
  speed: 0.75,
  intensity: 0.95,
  emberAmount: 0.5,
  riseSpeed: 1,
  noiseScale: 1,
  fade: 1,
  stokeStrength: 0.4,
  stokeRadius: 2,
  travel: false,
  baseColor: "#171718", // = BLACK (defined below; literal to avoid TDZ)
  embers: null,
  yellow: true,
  purple: true,
  blue: true,
  orange: true,
};

export const BLACK = "#171718"; // matches dark --background (hero) for a seamless seam
export const WHITE = "#FFFFFF"; // matches .surface-light --background

// ember palette (order matters for the toggle list in DitherSettings)
export const EMBER_COLORS: Record<string, string> = {
  yellow: "#EBCB5A",
  purple: "#8B5CF6",
  blue: "#4C7EF3",
  orange: "#F5893B",
};

// The band's live ember palette: an explicit `embers` list wins, otherwise it's
// built from the four toggles. Called on config change (never per frame).
export function activeEmbers(c: DitherConfig): string[] {
  if (c.embers && c.embers.length) return c.embers;
  const out: string[] = [];
  if (c.yellow) out.push(EMBER_COLORS.yellow);
  if (c.purple) out.push(EMBER_COLORS.purple);
  if (c.blue) out.push(EMBER_COLORS.blue);
  if (c.orange) out.push(EMBER_COLORS.orange);
  return out;
}

// Palette index layout written by computeCells(): 0 = white (the section below),
// 1 = baseColor (the hero-dark body of the band), 2 + e = embers[e].
export const IDX_WHITE = 0;
export const IDX_BASE = 1;
export const IDX_EMBER0 = 2;

// --- color helpers ----------------------------------------------------------
// Shared so the engine, the cursor trail and the server poster all agree on how
// a hex string becomes pixels.

export function toRgb(hex: string): [number, number, number] {
  const h = hex.charCodeAt(0) === 35 ? hex.slice(1) : hex;
  const full =
    h.length === 3 ? h[0] + h[0] + h[1] + h[1] + h[2] + h[2] : h.slice(0, 6);
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// Packed-pixel byte order differs by platform; detect rather than assume.
const LITTLE_ENDIAN = (() => {
  const b = new ArrayBuffer(4);
  new Uint32Array(b)[0] = 1;
  return new Uint8Array(b)[0] === 1;
})();

/** hex → one Uint32 ready to store into an ImageData's Uint32Array view. */
export function packColor(hex: string, alpha = 255): number {
  const [r, g, b] = toRgb(hex);
  return (
    (LITTLE_ENDIAN
      ? (alpha << 24) | (b << 16) | (g << 8) | r
      : (r << 24) | (g << 16) | (b << 8) | alpha) >>> 0
  );
}
