/**
 * Media wiring. Drop real files into /public and set the paths here.
 * Everything falls back to neutral generated placeholders while empty.
 */
export const media = {
  /** e.g. '/video/hero.mp4' */
  heroVideo: '',
  heroPoster: '',
  workVideos: {} as Record<string, string>,
  workPosters: {} as Record<string, string>,
  teamPhotos: {} as Record<string, string>,
};
