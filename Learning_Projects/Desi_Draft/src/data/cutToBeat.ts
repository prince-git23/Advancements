/**
 * "Cut to the Beat" — the film, its measured chapters and the three format
 * sheets that document it.
 *
 * Chapter boundaries were read off the footage (frames at 24 fps, 444 in total)
 * and the waveform bars are computed from the master's own audio, 96 RMS
 * windows across 18.54 s. Nothing here is a claimed beat timestamp: the marks
 * on the sheets are picture chapters, and the waveform is the real track.
 */

export type FilmSlot = {
  src: string;
  ratio: string;
  slot: string;
  alt: string;
  caption?: string;
  color?: string;
  width?: number;
  height?: number;
};

export type FilmChapter = {
  /** timecode as it reads on screen */
  time: string;
  /** seconds into the master */
  start: number;
  title: string;
  body: string;
  technique: string;
  still: FilmSlot;
};

export type FilmStudy = {
  src: string;
  poster: string;
  width: number;
  height: number;
  ratio: string;
  duration: string;
  titleAside: string;
  /** what a screen reader hears about the film */
  description: string;
  meta: { label: string; value: string }[];
  chapters: FilmChapter[];
  formats: FilmSlot[];
  /** RMS window peaks, 0–1, from the master audio */
  peaks: number[];
  notes: { title: string; body: string }[];
};

const still = (n: number, time: string, caption: string, alt: string): FilmSlot => ({
  src: `/images/portfolio/cut-to-the-beat/chapter-0${n}.jpg`,
  ratio: '9 / 16',
  slot: `frame at ${time}`,
  alt,
  caption,
  color: '#0A0A0A',
  width: 720,
  height: 1280,
});

export const cutFilm: FilmStudy = {
  src: '/videos/cut-to-the-beat-master.mp4',
  poster: '/images/portfolio/cut-to-the-beat/poster-9x16.jpg',
  width: 720,
  height: 1280,
  ratio: '9 / 16',
  duration: '18.5 s',
  titleAside: 'make every post count.',
  description:
    'Eighteen-second vertical film. A phone sits on a desk and posts float up around it, leading to the question “your content isn’t growing?”, then “3 mistakes”. Mistake one, inconsistent branding: a wall of posts that each look like a different brand. Mistake two, too much selling: a hand-held phone of discount stickers and buy-now tags. Mistake three, ignoring insights: the edit suite and its timeline. The fix follows on a wall of consistent layouts — consistency, value, insights. The film closes on the Desi Draft ring and the line “make every post count”.',

  meta: [
    { label: 'project', value: 'cut to the beat' },
    { label: 'category', value: 'video & motion' },
    { label: 'format', value: '9:16 · 720 × 1280' },
    { label: 'duration', value: '18.5 s · 24 fps' },
    {
      label: 'approach',
      value: 'short-form content, kinetic typography, visual storytelling, motion-led presentation',
    },
  ],

  chapters: [
    {
      time: '00:00 — 00:03',
      start: 0,
      title: 'the hook',
      body: 'A phone on a desk, then posts floating up around it. The question lands before the first cut: your content isn’t growing?',
      technique: 'camera push through floating post cards; type lands on the bed',
      still: still(1, '00:01', 'the hook', '“3 MISTAKES.” in chrome letters over floating social posts on a dark studio set'),
    },
    {
      time: '00:03 — 00:06',
      start: 3,
      title: '#1 inconsistent branding',
      body: 'The camera tracks along a wall of posts that are all on brand for nobody. Every post looks like a different brand.',
      technique: 'lateral track with parallax cards; the numeral stamps in',
      still: still(2, '00:04', '#1 inconsistent branding', 'A wall of mismatched social posts with “#1 INCONSISTENT BRANDING” set over them'),
    },
    {
      time: '00:06 — 00:09',
      start: 6.3,
      title: '#2 too much selling',
      body: 'A hand-held phone, discount stickers and buy-now tags. Give value before you pitch.',
      technique: 'match move from the wall into the phone screen',
      still: still(3, '00:07', '#2 too much selling', 'A hand holding a phone of discount products under “#2 TOO MUCH SELLING”'),
    },
    {
      time: '00:09 — 00:12',
      start: 8.8,
      title: '#3 ignoring insights',
      body: 'The edit suite and its timeline become the evidence: stop guessing, learn what works.',
      technique: 'desk-to-editor match cut, light ribbons carrying the camera',
      still: still(4, '00:11', '#3 ignoring insights', '“#3 IGNORING INSIGHTS” over purple light ribbons and an editing timeline'),
    },
    {
      time: '00:12 — 00:15',
      start: 12.4,
      title: 'the fix',
      body: 'One wall, one layout system. The fix is consistency, value, insights — held long enough to read.',
      technique: 'camera settles; three words held on the beat',
      still: still(5, '00:13', 'the fix', 'A wall of consistent layouts with “THE FIX: CONSISTENCY. VALUE. INSIGHTS.” set beside them'),
    },
    {
      time: '00:15 — 00:18.5',
      start: 15.4,
      title: 'make every post count',
      body: 'The studio ring closes the film, with the save prompt under it: branding, content, social media.',
      technique: 'ring wipe into the end card, type settled centre',
      still: still(6, '00:17', 'the closing card', 'The Desi Draft ring mark with “MAKE EVERY POST COUNT.” and a save prompt beneath'),
    },
  ],

  formats: [
    {
      src: '/images/portfolio/cut-to-the-beat/hook-frame-9x16.jpg',
      ratio: '9 / 16',
      slot: 'format sheet 01 — opening hook',
      alt: 'Orange 9:16 title sheet: “your content isn’t growing?” in heavy black type with an italic serif “growing?”, a three-second waveform and production labels',
      caption: '01 · opening hook',
      color: '#E8603C',
      width: 1080,
      height: 1920,
    },
    {
      src: '/images/portfolio/cut-to-the-beat/timeline-1x1.jpg',
      ratio: '1 / 1',
      slot: 'format sheet 02 — rhythm and composition',
      alt: 'Black 1:1 sheet with the film’s real waveform in lime, six chapter marks and the six sections of the edit',
      caption: '02 · rhythm and composition',
      color: '#0A0A0A',
      width: 1200,
      height: 1200,
    },
    {
      src: '/images/portfolio/cut-to-the-beat/end-card-16x9.jpg',
      ratio: '16 / 9',
      slot: 'format sheet 03 — end card',
      alt: 'Cream 16:9 end card with the Desi Draft wordmark, “cut to the beat”, a coral rule and the closing line',
      caption: '03 · end card',
      color: '#EEEAE3',
      width: 1920,
      height: 1080,
    },
  ],

  peaks: [
    0.03, 0.25, 0.49, 1, 0.86, 0.67, 0.42, 0.93, 0.83, 0.92, 0.73, 0.43, 0.3, 0.84, 0.82, 0.87,
    0.54, 0.9, 0.73, 0.86, 0.78, 0.66, 0.63, 0.79, 0.76, 0.63, 0.48, 0.81, 0.69, 0.7, 0.81, 0.52,
    0.64, 0.76, 0.88, 0.78, 0.66, 0.57, 0.55, 0.47, 0.44, 0.63, 0.68, 0.66, 0.94, 0.72, 0.63, 0.66,
    0.86, 0.69, 0.89, 0.6, 0.36, 0.22, 0.95, 0.75, 0.68, 0.56, 0.9, 0.67, 0.85, 0.7, 0.64, 0.61,
    0.92, 0.78, 0.85, 0.59, 0.95, 0.69, 0.82, 0.79, 0.64, 0.6, 0.82, 0.78, 0.75, 0.79, 0.93, 0.72,
    0.73, 0.78, 0.41, 0.19, 0.69, 0.89, 0.71, 0.6, 0.72, 0.76, 0.67, 0.9, 0.54, 0.34, 0.19, 0.93,
  ],

  notes: [
    {
      title: 'the hook is a question, not a logo',
      body: 'The film opens on a phone on a desk, then on the question the audience is already asking. The studio name is held back until the last three seconds.',
    },
    {
      title: 'type carries the argument',
      body: 'Every claim is typed on screen, so the film reads with the sound off. Words enter on the bed and leave before the next one — nothing sits long enough to become wallpaper.',
    },
    {
      title: 'the posts are the set',
      body: 'Social content is built into the 3D scene rather than layered on top of it: the camera moves past the posts, and the posts are the evidence for each mistake.',
    },
    {
      title: 'problem, then the same frame fixed',
      body: 'The three mistakes share one composition and one camera move. The fix reuses the wall from mistake one — same frame, consistent layout — so the answer is shown, not described.',
    },
    {
      title: 'rhythm over cuts',
      body: 'The film is a single continuous motion-design scene driven by camera moves, not a series of cuts: the picture changes when the bed moves, so the edit never feels like a slideshow.',
    },
    {
      title: 'one composition per ratio',
      body: 'The 9:16 master is the composition. The 1:1 and 16:9 sheets are rebuilt for their frames rather than cropped from it, and the end card carries the wordmark at the size its own frame allows.',
    },
  ],
};
