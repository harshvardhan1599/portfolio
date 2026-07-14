import { IMAGE_TINTS } from "@/data/imageTints";

// Pastel loading-state background for a card, matched to the image's dominant
// colour (see src/data/imageTints.ts). Shows while the image/video loads, then
// gets covered by the media. Falls back to a neutral pastel for unknown srcs.
export function tint(src: string): string {
  return IMAGE_TINTS[src] ?? "#eaeaed";
}
