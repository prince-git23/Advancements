/**
 * The five creative disciplines, in the order the work happens.
 *
 * Every image is an existing project asset, not a mock-up: the storyboard and
 * beat sheet from "Hook, Turn, Payoff", a frame from the "Cut to the Beat"
 * shoot, the studio's own edit-suite still from the hero film, and the set and
 * packaging build from Flora Alchemy. No client work is invented here.
 */
export type Pillar = {
  id: string;
  no: string;
  title: string;
  copy: string;
  image: string;
  /** Focal point for the crop, so tall cards keep the subject in frame. */
  position: string;
  alt: string;
  /** Brand accent for the rule above each title. */
  accent: string;
};

export const pillars: Pillar[] = [
  {
    id: 'think',
    no: '01',
    title: 'think it',
    copy: 'Creative strategy and campaign concepts.',
    image: '/images/portfolio/always-on/grid-plan-4x5.jpg',
    position: '50% 42%',
    alt: 'The Always On monthly grid: twelve planned posts and one open slot, arranged as a colour rhythm.',
    accent: '#4B63E8',
  },
  {
    id: 'write',
    no: '02',
    title: 'write it',
    copy: 'Scripts, storytelling and copywriting.',
    image: '/images/portfolio/hook-turn-payoff/beat-sheet-16x9.jpg',
    position: '46% 40%',
    alt: 'The 30-second script and beat sheet, with hook, turn and payoff rows.',
    accent: '#9B2155',
  },
  {
    id: 'shoot',
    no: '03',
    title: 'shoot it',
    copy: 'Content production and filmmaking.',
    image: '/video/hero-mobile-portrait-poster.jpg',
    position: '50% 46%',
    alt: 'A hand racking focus on the barrel of a cinema lens, from the studio’s own film.',
    accent: '#E8603C',
  },
  {
    id: 'cut',
    no: '04',
    title: 'cut it',
    copy: 'Video editing, motion and graphics.',
    image: '/video/desi-draft-hero-poster.jpg',
    position: '58% 48%',
    alt: 'An editor at a colour-grading suite, timeline open on the monitor under a desk lamp.',
    accent: '#8499F8',
  },
  {
    id: 'design',
    no: '05',
    title: 'design it',
    copy: 'Visual identity and digital experiences.',
    image: '/images/portfolio/flora-alchemy/atelier-table.webp',
    position: '50% 50%',
    alt: 'The Flora Alchemy atelier table: pressed botanical cards, wrapped boxes and dried flowers.',
    accent: '#2E7D5B',
  },
];
