import type { StickerKey } from '../types';

export type TeamMember = {
  name: string;
  role: string;
  initials: string;
  size: number; // px at desktop
  x: number; // % of container width
  y: number; // % of tall container height
  speed: number; // parallax multiplier
  colors: [string, string];
  sticker?: StickerKey;
};

const NAMES: [string, string][] = [
  ['aarav mehta', 'creative director'],
  ['isha kapoor', 'social strategy'],
  ['rhea nair', 'art director'],
  ['kabir shah', 'reel editor'],
  ['zoya ansari', 'community lead'],
  ['dev malhotra', 'motion designer'],
  ['ananya rao', 'copywriter'],
  ['arjun bose', 'producer'],
  ['meera iyer', 'influencer manager'],
  ['rohan gupta', 'paid social'],
  ['naina sethi', 'brand strategist'],
  ['vikram jain', 'director / dop'],
  ['tara khanna', 'designer'],
  ['aditya menon', 'editor'],
  ['simran kaur', 'account manager'],
  ['karan patel', 'sound designer'],
  ['priya desai', 'social creative'],
  ['nihal verma', 'activation producer'],
  ['sana qureshi', 'community manager'],
  ['yash thakur', 'production asst.'],
  ['diya sharma', 'junior copywriter'],
  ['omar farooq', 'data & insight'],
  ['nikita roy', 'photographer'],
  ['raj singh', 'studio manager'],
];

const PALETTES: [string, string][] = [
  ['#4B63E8', '#8499F8'],
  ['#E8603C', '#E8B4F5'],
  ['#2E7D5B', '#E4FBA8'],
  ['#9B2155', '#E8B4F5'],
  ['#8499F8', '#E4FBA8'],
  ['#E8B4F5', '#4B63E8'],
  ['#0A0A0A', '#2E7D5B'],
];

// Hand-placed so the collage feels scattered but never collides badly.
const LAYOUT: { x: number; y: number; size: number; speed: number; sticker?: StickerKey }[] = [
  { x: 6, y: 6, size: 220, speed: 1.35, sticker: 'goodVibes' },
  { x: 33, y: 2, size: 150, speed: 0.75 },
  { x: 62, y: 8, size: 260, speed: 1.1, sticker: 'hi' },
  { x: 84, y: 3, size: 170, speed: 1.55 },
  { x: 18, y: 19, size: 300, speed: 0.65, sticker: 'joinClub' },
  { x: 55, y: 22, size: 160, speed: 1.4 },
  { x: 74, y: 29, size: 230, speed: 0.85 },
  { x: 3, y: 33, size: 180, speed: 1.2 },
  { x: 30, y: 36, size: 210, speed: 1.65 },
  { x: 61, y: 43, size: 280, speed: 0.7 },
  { x: 87, y: 40, size: 150, speed: 1.05 },
  { x: 12, y: 50, size: 250, speed: 1.5, sticker: 'cool' },
  { x: 42, y: 56, size: 170, speed: 0.8 },
  { x: 70, y: 57, size: 200, speed: 1.25 },
  { x: 2, y: 63, size: 200, speed: 0.75 },
  { x: 26, y: 69, size: 260, speed: 1.45 },
  { x: 57, y: 72, size: 150, speed: 0.9 },
  { x: 82, y: 67, size: 220, speed: 1.6, sticker: 'letsGo' },
  { x: 14, y: 81, size: 170, speed: 1.0 },
  { x: 38, y: 84, size: 230, speed: 0.6 },
  { x: 66, y: 87, size: 280, speed: 1.3 },
  { x: 90, y: 82, size: 160, speed: 0.95 },
  { x: 8, y: 92, size: 190, speed: 1.15 },
  { x: 47, y: 94, size: 180, speed: 0.85 },
];

export const team: TeamMember[] = NAMES.map(([name, role], i) => {
  const l = LAYOUT[i % LAYOUT.length];
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase();
  return {
    name,
    role,
    initials,
    size: l.size,
    x: l.x,
    y: l.y,
    speed: l.speed,
    colors: PALETTES[i % PALETTES.length],
    sticker: l.sticker,
  };
});
