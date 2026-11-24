/** The one sticker scale from the spec: sm / md / lg / xl. */
export const STICKER_SCALE = {
  sm: 56,
  md: 84,
  lg: 112,
  xl: 136,
} as const;

export type StickerSize = keyof typeof STICKER_SCALE;

/** Accepts a scale key or raw px. */
export function stickerPx(size: StickerSize | number = 'md') {
  return typeof size === 'number' ? size : STICKER_SCALE[size];
}

/**
 * Sticker sizes, in px, in one place.
 *
 * The reference uses chunky die-cut stickers: 56–72 on cards and tiles, ~100 in
 * the team collage and 100–140 falling through the footer. Change a value here
 * and every use of that sticker follows.
 */
export const SZ = {
  /** work carousel card corner sticker */
  workCard: 72,
  /** work index grid tile */
  workTile: 56,
  /** work detail hero corner */
  workDetail: 96,

  heroSmiley: 56,
  heroSparkle: 48,
  heroSound: 44,

  intro: 84,
  manifesto: 64,

  team: 104,
  teamSmall: 84,

  services: 84,
  clients: 80,

  footerMin: 100,
  footerMax: 140,
} as const;

/** Deterministic pick between the footer's min/max so drops vary in size. */
export function footerStickerSize(seed: number) {
  const span = SZ.footerMax - SZ.footerMin;
  return SZ.footerMin + Math.round((((seed * 37) % 100) / 100) * span);
}
