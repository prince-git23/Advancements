/**
 * Media wiring. Real files live in /public/video and /public/images.
 * Anything empty falls back to a designed placeholder — never to a broken frame.
 */
export const media = {
  /** 1280×720, 24 fps, 20 s — encoded from the studio's 22 MB master at 2.5 MB. */
  heroVideo: '/video/desi-draft-hero-16x9.mp4',
  /** 720×1280, 15 s — the portrait film, full-bleed behind the headline on
   *  portrait viewports. Re-encoded at CRF 24 with faststart: 15.0 MB → 1.8 MB. */
  heroVideoPortrait: '/video/hero-mobile-portrait.mp4',
  heroPoster: '/video/desi-draft-hero-poster.jpg',
  heroPosterPortrait: '/video/hero-mobile-portrait-poster.jpg',
  teamPhotos: {} as Record<string, string>,
};
