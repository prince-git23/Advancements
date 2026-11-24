/**
 * The portfolio model.
 *
 * Every project below is either something Desi Draft has actually built or is
 * actively building. There are deliberately no client logos, testimonials,
 * reach numbers, awards or dates here: none of that exists in the studio's
 * records yet, and inventing it is what makes a portfolio read as sample work.
 *
 * Media: put a real file in `public/` and set the slot's `src`. Until then the
 * site renders the plate as a designed asset slot that names the frame we still
 * need to shoot.
 *
 * Not every frame is a photograph. The beat sheet, the grid plan and the
 * identity sheets are artefacts the studio already owns, so they are drawn from
 * the real tokens and captured in `audit/sheets/`. Flora Alchemy is a live
 * project, so its frames are real: the brand's own product photography plus
 * screen captures of the deployed storefront.
 */

import { floraAlchemy } from './floraAlchemy';
import { cutFilm, type FilmStudy } from './cutToBeat';

export type CategoryId = 'video' | 'social' | 'scripts' | 'web' | 'brand';
export type FilterId = 'all' | CategoryId;

export type ProjectStatus = 'in progress' | 'in development' | 'ongoing' | 'live' | 'studio';

/** How the project is drawn in the grid, before index-based spanning is applied. */
export type ProjectKind = 'feature' | 'website' | 'video' | 'social' | 'script' | 'brand';

export type MediaSlot = {
  /** real asset path once one exists, e.g. '/work/cafe-wall-wide.jpg' */
  src?: string;
  /** responsive candidates — 'path 960w, path 1440w' */
  srcSet?: string;
  poster?: string;
  /** intrinsic size, so the browser reserves the box before the image lands */
  width?: number;
  height?: number;
  /** CSS aspect-ratio, e.g. '16 / 9' — source ratio is never cropped by us */
  ratio: string;
  /** what this frame is; shown on the plate while `src` is empty */
  slot: string;
  /** accessible description of the finished asset */
  alt: string;
  caption?: string;
  /** brand colour used for the empty plate */
  color?: string;
  /** printed on the image: what kind of asset it is (concept, plan, sheet) */
  tag?: string;
  /** who made the photograph or artwork, printed under the frame */
  credit?: string;
  /** address bar label for interface captures */
  url?: string;
};

/** One tile of the monthly grid. `open` is the reactive slot, kept empty. */
export type SocialTile = {
  src?: string;
  /** the format the tile carries, e.g. 'talking head' */
  format: string;
  /** the content pillar it belongs to */
  pillar: string;
  /** the line printed on the tile */
  line?: string;
  color: string;
  open?: boolean;
};

export type SocialPillar = { name: string; share: string; job: string; color: string };

export type SocialPost = { slot: MediaSlot; headline: string; copy: string; pillar: string };

export type SocialReel = {
  /** omitted for the typographic cover */
  slot?: MediaSlot;
  hook: string;
  sub: string;
  line: string;
  time: string;
  color: string;
};

/** The monthly social system: grid, post set, reels, voice and schedule. */
export type SocialSystem = {
  grid: SocialTile[];
  posts: SocialPost[];
  reels: SocialReel[];
  pillars: SocialPillar[];
  voice: { line: string; why: string }[];
  schedule: { week: string; feed: string; reel: string }[];
};

/** One of the three storyboard beats, drawn as a real frame. */
export type ScriptFrame = {
  beat: 'hook' | 'turn' | 'payoff';
  time: string;
  title: string;
  direction: string;
  script: string;
  slot: MediaSlot;
};

export type ScriptStudy = {
  frames: ScriptFrame[];
  markers: { at: number; time: string; label: string }[];
  excerpt: { time: string; picture: string; sound: string }[];
  skills: string[];
};

/** A physical application of the identity, composited in the browser. */
export type IdentityApplication = {
  slot: MediaSlot;
  label: string;
  note: string;
  mark: 'wordmark' | 'sticker';
  /** percentage box for the overlay, measured against the frame */
  x: number;
  y: number;
  w: number;
  rotate: number;
  /** printed under the mark on a poster application */
  tagline?: string;
};

export type IdentityStudy = {
  chapters: { no: string; title: string; body: string }[];
  lockups: { label: string; note: string; bg: string; fg: string }[];
  screens: MediaSlot[];
  applications: IdentityApplication[];
  skills: string[];
};

export type PortfolioProject = {
  id: string;
  slug: string;
  title: string;
  category: CategoryId;
  kind: ProjectKind;
  status: ProjectStatus;
  /** 'studio' when Desi Draft is its own client; café client stays unnamed */
  client: string;
  /** one line, used on cards */
  standfirst: string;
  /** opening paragraph of the case study */
  intro: string;
  challenge: string;
  approach: string;
  role: string[];
  services: string[];
  deliverables: string[];
  /** what the studio is doing right now on an unfinished project */
  phase?: string;
  cover: MediaSlot;
  /** second line of the case-study headline, set in serif italic */
  titleAside?: string;
  /** 'interface' keeps a screen capture at 16:10 instead of the 3:1 photo band */
  coverFit?: 'photo' | 'interface';
  /** a shipped project's own address; renders as an external, labelled link */
  live?: { url: string; label: string };
  /** identity block: the mark plus the brand's own positioning */
  brand?: { slot: MediaSlot; tagline: string; body: string };
  /** real interface captures, framed in browser chrome */
  interfaceShots?: MediaSlot[];
  /** the same product on a phone */
  phoneShot?: MediaSlot;
  /** materials and making: the craft behind the catalogue */
  materials?: MediaSlot[];
  /** packaging and finishing */
  packaging?: MediaSlot[];
  /** a real film: the playable master, its format sheets and its storyboard */
  film?: FilmStudy;
  /** social system: monthly grid, post set, reel covers and voice */
  social?: SocialSystem;
  /** the three-beat script study: frames, timing and a script excerpt */
  scriptStudy?: ScriptStudy;
  /** identity chapters: lockups, screens and concept applications */
  identityStudy?: IdentityStudy;
  gallery: MediaSlot[];
  process: { title: string; body: string }[];
  /** documentary facts (tools, formats, materials) — never performance claims */
  facts: { label: string; value: string }[];
  /** search/social metadata; falls back to title + standfirst */
  seo?: { title: string; description: string };
  /** previous URLs that must redirect to the canonical slug */
  legacySlugs?: string[];
  featured?: boolean;
};

export const categories: { id: FilterId; label: string; short: string; color: string; text: 'ink' | 'cream' }[] = [
  { id: 'all', label: 'All Work', short: 'everything', color: '#0A0A0A', text: 'cream' },
  { id: 'video', label: 'Video & Motion', short: 'video', color: '#E8603C', text: 'ink' },
  { id: 'social', label: 'Social Media', short: 'social', color: '#E8B4F5', text: 'ink' },
  { id: 'scripts', label: 'Scripts & Storytelling', short: 'scripts', color: '#E4FBA8', text: 'ink' },
  { id: 'web', label: 'Websites & Digital', short: 'web', color: '#8499F8', text: 'ink' },
  { id: 'brand', label: 'Branding & Graphic Design', short: 'brand', color: '#2E7D5B', text: 'cream' },
];

export const categoryOf = (id: CategoryId) => categories.find((c) => c.id === id) ?? categories[0];

export const portfolio: PortfolioProject[] = [
  floraAlchemy,
  {
    id: 'site',
    slug: 'desi-draft-dot-com',
    title: 'desi draft dot com',
    category: 'web',
    kind: 'website',
    status: 'live',
    client: 'our own studio',
    standfirst:
      'The studio site: an editorial one-pager with a real portfolio, built on React and Vite with no WebGL.',
    intro:
      'This is the site you are reading. We rebuilt it around the actual work instead of a services landing page: an editorial portfolio, case studies with their own route, and a Team, Services and footer that hold up on a phone.',
    challenge:
      'The first version looked good and said nothing. It was also heavy — one bundle, six WebGL renderers in the team section, a footer simulation that kept running after it had finished, and no reduced-motion path through the scroll sequences.',
    approach:
      'Content came first: a typed project model, then the layouts that fit each discipline. Performance came second: routes split at the router, Matter and the QR panel fetched on demand, the footer sim sleeping when it settles. Motion is CSS transforms and GSAP, with reduced-motion fallbacks at every step.',
    role: ['Design', 'Frontend development', 'Art direction', 'Copy'],
    services: ['Digital Experiences', 'Branding', 'Content Production'],
    deliverables: [
      'Responsive one-page studio site',
      'Typed portfolio model and case-study template',
      'Accessible motion with reduced-motion alternatives',
      'Production build and audit harness',
    ],
    cover: {
      src: '/work/desi-draft-home.jpg',
      ratio: '16 / 10',
      slot: 'desktop screenshot — home, hero and portfolio',
      alt: 'Desktop view of the Desi Draft homepage: the reel montage behind the headline “we make content for the new desi mainstream”',
      color: '#8499F8',
      caption: 'home, 1440 × 900',
    },
    gallery: [
      {
        src: '/work/desi-draft-work.jpg',
        ratio: '16 / 10',
        slot: 'desktop screenshot — work index, filters open',
        alt: 'The work index with its category filters and the featured café case study',
        color: '#4B63E8',
        caption: 'work index',
      },
      {
        src: '/work/desi-draft-mobile.jpg',
        ratio: '9 / 19.5',
        slot: 'mobile screenshot — portfolio on a phone',
        alt: 'The work index on a 390px phone screen, filters scrolling horizontally',
        color: '#E8B4F5',
        caption: '390 × 844',
      },
    ],
    process: [
      {
        title: 'inventory, then design',
        body: 'We listed what the studio could actually show and designed the layouts around that — including the frames that are still missing.',
      },
      {
        title: 'one project model',
        body: 'A single typed shape describes every project, so a new case study is a data entry, not a new page component.',
      },
      {
        title: 'motion with an exit',
        body: 'Every scroll animation is scoped in gsap.context() and reverted on unmount, and every one has a static alternative under prefers-reduced-motion.',
      },
      {
        title: 'measure the build',
        body: 'Production build size and a scripted browser pass are checked after each change; the audit frames live in the repo.',
      },
    ],
    facts: [
      { label: 'stack', value: 'React 18, Vite, TypeScript' },
      { label: 'motion', value: 'GSAP + ScrollTrigger, Lenis, CSS 3D' },
      { label: 'screens', value: '1440 × 900 and 390 × 844, captured from production' },
      { label: 'type', value: 'Archivo · Instrument Serif · DM Sans' },
    ],
  },
  {
    id: 'cut',
    slug: 'cut-to-the-beat',
    title: 'cut to the beat',
    category: 'video',
    kind: 'video',
    status: 'studio',
    client: 'studio film',
    standfirst:
      'An 18.5-second vertical film: one continuous scene, kinetic type, and a message that reads with the sound off.',
    intro:
      'A short film about why content stops growing: the question, three mistakes, and the fix — composed as one continuous motion-design scene at 9:16, with every claim typed on screen.',
    challenge:
      'Most brand reels are a landscape ad cropped to vertical. The crop throws away the composition, and the sound drives nothing at all.',
    approach:
      'We mark the waveform before placing a single clip, then cut picture to those marks and animate type on the same beat grid. Each master is composed at 9:16, 1:1 and 16:9 natively — three compositions, not one crop.',
    role: ['Edit', 'Motion design', 'Type design', 'Sound direction'],
    services: ['Content Production', 'Creative Strategy'],
    deliverables: [
      '9:16 master, 18.5 s at 24 fps',
      'Opening, rhythm and end-card sheets',
      'Kinetic type kit',
      'Poster frame and chapter stills',
    ],
    phase: 'film finished — published on this site',
    film: cutFilm,
    cover: {
      src: '/images/portfolio/cut-to-the-beat/poster-9x16.jpg',
      ratio: '9 / 16',
      slot: 'poster frame — 9:16 master',
      alt: '“3 MISTAKES.” in chrome letters over floating social posts, with a second post reading “your content isn’t growing?”',
      color: '#E8603C',
      caption: '9:16 master',
      tag: 'poster frame',
      width: 720,
      height: 1280,
    },
    gallery: [],
    process: [
      {
        title: 'mark the track',
        body: 'Downbeats and the two strongest transients become the edit’s skeleton. Everything else is negotiable.',
      },
      {
        title: 'cut picture',
        body: 'Shots are chosen for the mark they land on, not the other way round. A cut that arrives early is worse than a shot that is too short.',
      },
      {
        title: 'set the type',
        body: 'Words enter on the mark and leave before the next one. Type is set on a fixed baseline so it reads even at 400ms.',
      },
      {
        title: 'export natively',
        body: 'Each ratio is recomposed — subject placement, type size, safe areas — then rendered from its own sequence.',
      },
    ],
    facts: [
      { label: 'formats', value: '9:16 master · 1:1 and 16:9 sheets' },
      { label: 'length', value: '18.5 s · 444 frames at 24 fps' },
      { label: 'sound', value: 'mixed bed, no spoken word — reads with sound off' },
      { label: 'stage', value: 'film finished; published on this site' },
    ],
  },
  {
    id: 'feed',
    slug: 'always-on',
    title: 'always on',
    category: 'social',
    kind: 'social',
    status: 'in development',
    client: 'studio format',
    standfirst:
      'A monthly social system: twelve posts, four reels, one voice, planned as a grid before a single caption is written.',
    intro:
      'A content system for brands that want to sound like a person rather than a franchise: a fixed monthly shape, a small cast of recurring formats, and a grid that reads as one thing.',
    challenge:
      'Always-on accounts fail in two ways — every post looks the same, or every post looks like a different brand. Both come from posting without a system.',
    approach:
      'We plan the grid as a composition: colour rhythm across rows, three recurring formats that carry the voice, and one slot per month left open for whatever the comments are actually talking about.',
    role: ['Content strategy', 'Art direction', 'Copy', 'Community'],
    services: ['Social Media', 'Creative Strategy', 'Visual Communication'],
    deliverables: [
      'Monthly grid plan and colour rhythm',
      'Recurring formats with shot lists',
      'Caption and reply voice guide',
      'Reel concepts built for sound-off viewing',
    ],
    phase: 'grid system and format library',
    cover: {
      src: '/images/portfolio/always-on/grid-plan-4x5.jpg',
      ratio: '4 / 5',
      slot: 'month grid plan — colour rhythm and recurring formats',
      alt: 'A twelve-tile month plan: colour blocks labelled talking head, counter shot, comment reply, with one slot left open and one reel',
      color: '#E8B4F5',
      caption: 'one month, planned',
      tag: 'grid plan',
    },
    gallery: [
      {
        src: '/images/portfolio/always-on/post-01-founder.jpg',
        ratio: '4 / 5',
        slot: 'feed post — the founder, straight to camera',
        alt: 'A young woman in a cream shirt talking to camera at a studio desk',
        caption: 'concept post',
      },
      {
        src: '/images/portfolio/always-on/reel-01-lamp.jpg',
        ratio: '9 / 16',
        slot: 'reel cover — the lamp test',
        alt: 'A hand switching on a brass desk lamp beside a face-down phone at night',
        caption: 'reel cover',
      },
      {
        src: '/images/portfolio/always-on/post-set-1x1.jpg',
        ratio: '1 / 1',
        slot: 'campaign post set — three creatives',
        alt: 'Three feed posts side by side: lilac, ink and periwinkle fields each carrying one line of the voice',
        color: '#E8B4F5',
        caption: 'post set',
        tag: 'concept set',
      },
      {
        src: '/images/portfolio/always-on/reel-cover-9x16.jpg',
        ratio: '9 / 16',
        slot: 'reel cover — sound-off legible',
        alt: 'Lime reel cover reading “sound off” with captions noted on the top third',
        color: '#2E7D5B',
        caption: 'reel cover',
        tag: 'format cover',
      },
    ],
    social: {
      grid: [
        {
          src: '/images/portfolio/always-on/post-01-founder.jpg',
          format: 'talking head',
          pillar: 'the desk',
          line: 'we answer every dm ourselves.',
          color: '#E4FBA8',
        },
        {
          format: 'type card',
          pillar: 'the desk',
          line: 'made slowly. posted on time.',
          color: '#E8603C',
        },
        {
          src: '/images/portfolio/always-on/post-02-package.jpg',
          format: 'macro',
          pillar: 'proof of work',
          line: 'the box is the first review.',
          color: '#E8B4F5',
        },
        {
          src: '/images/portfolio/always-on/reel-02-notebook.jpg',
          format: 'overhead',
          pillar: 'proof of work',
          line: 'one page, one idea.',
          color: '#8499F8',
        },
        {
          format: 'carousel',
          pillar: 'counter shot',
          line: 'three things we would never say.',
          color: '#E4FBA8',
        },
        {
          src: '/images/portfolio/always-on/post-03-counter.jpg',
          format: 'detail',
          pillar: 'counter shot',
          line: 'the second cup is the real one.',
          color: '#E8603C',
        },
        {
          src: '/images/portfolio/always-on/reel-03-parcels.jpg',
          format: 'reel cover',
          pillar: 'proof of work',
          line: 'packing, 4pm.',
          color: '#2E7D5B',
        },
        {
          src: '/images/portfolio/always-on/post-04-designer.jpg',
          format: 'portrait',
          pillar: 'the desk',
          line: 'pinned by friday.',
          color: '#E8B4F5',
        },
        {
          format: 'open slot',
          pillar: 'comment reply',
          line: 'whatever the comments ask.',
          color: '#E9E4DA',
          open: true,
        },
        {
          format: 'type card',
          pillar: 'counter shot',
          line: 'a second opinion, not a second brand.',
          color: '#8499F8',
        },
        {
          src: '/images/portfolio/always-on/reel-01-lamp.jpg',
          format: 'reel cover',
          pillar: 'the desk',
          line: 'the lamp test.',
          color: '#E4FBA8',
        },
        {
          format: 'end card',
          pillar: 'studio',
          line: 'desi draft · ideas into impact',
          color: '#2E7D5B',
        },
      ],
      posts: [
        {
          slot: {
            src: '/images/portfolio/always-on/post-01-founder.jpg',
            ratio: '4 / 5',
            slot: 'feed post — founder talking head',
            alt: 'A young woman in a cream shirt talking to camera at a studio desk',
            width: 880,
            height: 1184,
          },
          headline: 'we answer every dm ourselves.',
          copy: 'no team account, no autoresponder. one person, one inbox, one hour a day.',
          pillar: 'the desk',
        },
        {
          slot: {
            src: '/images/portfolio/always-on/post-02-package.jpg',
            ratio: '4 / 5',
            slot: 'feed post — the box, before it leaves',
            alt: 'Two hands tying cotton twine around a small kraft-paper box beside dried marigolds',
            width: 880,
            height: 1184,
          },
          headline: 'the box is the first review.',
          copy: 'before anyone opens anything, they hold it. that is why it is tied by hand.',
          pillar: 'proof of work',
        },
        {
          slot: {
            src: '/images/portfolio/always-on/post-03-counter.jpg',
            ratio: '4 / 5',
            slot: 'feed post — counter detail',
            alt: 'Two cream ceramic cups on a terracotta café counter in late-morning light',
            width: 880,
            height: 1184,
          },
          headline: 'the second cup is the real one.',
          copy: 'the first cup is for the photograph. the second tells you if it is any good.',
          pillar: 'counter shot',
        },
        {
          slot: {
            src: '/images/portfolio/always-on/post-04-designer.jpg',
            ratio: '4 / 5',
            slot: 'feed post — portrait at the wall',
            alt: 'A designer in a coral shirt standing at a wall of pinned blank colour swatches',
            width: 880,
            height: 1184,
          },
          headline: 'designed on monday, pinned by friday.',
          copy: 'the swatches go up on the wall before a single screen is opened.',
          pillar: 'the desk',
        },
      ],
      reels: [
        {
          slot: {
            src: '/images/portfolio/always-on/reel-01-lamp.jpg',
            ratio: '9 / 16',
            slot: 'reel cover — the lamp test',
            alt: 'A hand switching on a brass desk lamp beside a face-down phone at night',
            width: 752,
            height: 1392,
          },
          hook: 'sound off. what is happening?',
          sub: 'one action, one light source, no explanation.',
          line: 'the lamp test.',
          time: '0:12',
          color: '#2E7D5B',
        },
        {
          slot: {
            src: '/images/portfolio/always-on/reel-02-notebook.jpg',
            ratio: '9 / 16',
            slot: 'reel cover — one page, one idea',
            alt: 'Hands writing in a notebook beside a lime sticky note and a coffee cup',
            width: 752,
            height: 1392,
          },
          hook: 'this is the whole plan.',
          sub: 'a page, a pen, and the thing we are not going to say.',
          line: 'one page, one idea.',
          time: '0:15',
          color: '#8499F8',
        },
        {
          slot: {
            src: '/images/portfolio/always-on/reel-03-parcels.jpg',
            ratio: '9 / 16',
            slot: 'reel cover — packing, 4pm',
            alt: 'A woman carrying a stack of plain kraft-paper parcels through a studio doorway',
            width: 752,
            height: 1392,
          },
          hook: 'no music. just paper.',
          sub: 'the unglamorous half of a brand, filmed at the same hour every week.',
          line: 'packing, 4pm.',
          time: '0:18',
          color: '#E8603C',
        },
        {
          hook: 'save this one for the next brief.',
          sub: 'four templates, one page, no face.',
          line: 'the last slide.',
          time: '0:09',
          color: '#E4FBA8',
        },
      ],
      pillars: [
        {
          name: 'the desk',
          share: '4 posts · 2 reels',
          job: 'the founder, talking plainly to one person',
          color: '#E4FBA8',
        },
        {
          name: 'proof of work',
          share: '4 posts · 1 reel',
          job: 'hands, paper and the thing being made',
          color: '#E8B4F5',
        },
        {
          name: 'counter shot',
          share: '3 posts · 1 reel',
          job: 'a second opinion, in the brand’s own voice',
          color: '#8499F8',
        },
        {
          name: 'comment reply',
          share: '1 open slot',
          job: 'the post that answers what the audience asked',
          color: '#E8603C',
        },
      ],
      voice: [
        {
          line: 'we left the mistake in. it explains the fix better than the fix does.',
          why: 'admits friction; never performs perfection.',
        },
        {
          line: 'one post a month is unplanned. that one is yours.',
          why: 'says the reactive slot out loud, so people know where to ask.',
        },
        {
          line: 'made slowly, posted on time.',
          why: 'short sentences, concrete nouns, no exclamation marks.',
        },
      ],
      schedule: [
        { week: 'week 01', feed: 'desk · proof · counter', reel: 'the lamp test' },
        { week: 'week 02', feed: 'proof · type card · desk', reel: 'one page, one idea' },
        { week: 'week 03', feed: 'counter · proof · portrait', reel: 'packing, 4pm' },
        { week: 'week 04', feed: 'desk · counter · open slot', reel: 'the last slide' },
      ],
    },
    process: [
      {
        title: 'find the voice',
        body: 'One page: who is talking, who they are talking to, and the three things they would never say.',
      },
      {
        title: 'design the grid',
        body: 'Colour and format are sequenced across the month so the profile reads as a composition, not a feed.',
      },
      {
        title: 'build the formats',
        body: 'Three repeatable shapes — a talking head, a counter shot, a comment reply — each with its own shot list.',
      },
      {
        title: 'leave a slot open',
        body: 'One post a month is unplanned, so the account can answer what the audience is actually asking.',
      },
    ],
    facts: [
      { label: 'cadence', value: '12 posts + 4 reels per month' },
      { label: 'formats', value: '3 recurring, 1 reactive slot' },
      { label: 'ratios', value: '4:5 feed, 9:16 stories and reels' },
      { label: 'stage', value: 'system built; first retainer in discussion' },
    ],
  },
  {
    id: 'scripts',
    slug: 'hook-turn-payoff',
    title: 'hook, turn, payoff',
    category: 'scripts',
    kind: 'script',
    status: 'ongoing',
    client: 'studio format',
    standfirst:
      'A script library for short film: three beats, fixed timings, and a hook that has to work with the sound off.',
    intro:
      'Every short we write is built on the same three beats — hook, turn, payoff — with the timings fixed before the first line is written. The library keeps the structure honest when the idea is exciting.',
    challenge:
      'A 30-second script usually has one good idea and twenty seconds of throat-clearing. The first three seconds decide whether the rest exists at all.',
    approach:
      'We write the hook as a visual first: a frame that reads without sound. The turn is a change of information, not a change of scene. The payoff lands the brand in the last four seconds, after the story has already paid for itself.',
    role: ['Scriptwriting', 'Story structure', 'Hook development', 'Storyboards'],
    services: ['Creative Strategy', 'Content Production'],
    deliverables: [
      '15s / 30s / 45s script templates',
      'Hook library with visual-first openings',
      'Beat sheets and shot columns',
      'Storyboard frames for the first three seconds',
    ],
    phase: 'library in use on studio formats',
    cover: {
      src: '/images/portfolio/hook-turn-payoff/beat-sheet-16x9.jpg',
      ratio: '16 / 9',
      slot: 'annotated beat sheet — hook / turn / payoff',
      alt: 'Beat sheet for a 30-second script: hook 0–3s, turn at roughly half, payoff in the last four seconds, with a shot column and a timing bar',
      color: '#E4FBA8',
      caption: 'one page, three beats',
      tag: 'beat sheet',
    },
    gallery: [
      {
        src: '/images/portfolio/hook-turn-payoff/storyboard-4x3.jpg',
        ratio: '4 / 3',
        slot: 'storyboard — first three seconds',
        alt: 'Three storyboard frames with line drawings and shot notes: cold open, the turn, the payoff',
        color: '#E4FBA8',
        caption: 'first three seconds',
        tag: 'storyboard',
      },
    ],
    scriptStudy: {
      frames: [
        {
          beat: 'hook',
          time: '0:00 — 0:03',
          title: 'the button',
          direction:
            'Extreme close-up, night. A hand hovers over record; the red tally is the only colour in the frame.',
          script: 'PICTURE: fingers over REC. SOUND: room tone, no music.',
          slot: {
            src: '/images/portfolio/hook-turn-payoff/frame-01-hook-9x16.jpg',
            ratio: '9 / 16',
            slot: 'storyboard frame 01 — hook',
            alt: 'A hand hovering over the record button of a cinema camera in a dark studio, red tally light on',
            width: 752,
            height: 1392,
          },
        },
        {
          beat: 'turn',
          time: '0:14 — 0:17',
          title: 'the second cup',
          direction:
            'Same desk, pulled back. The camera has been pointed at an empty chair the whole time. One new fact, same room.',
          script: 'PICTURE: an empty chair, a second cup still full. SOUND: the room gets louder.',
          slot: {
            src: '/images/portfolio/hook-turn-payoff/frame-02-turn-9x16.jpg',
            ratio: '9 / 16',
            slot: 'storyboard frame 02 — turn',
            alt: 'The same dark studio desk from further back: a notebook, two cups and an empty chair',
            width: 752,
            height: 1392,
          },
        },
        {
          beat: 'payoff',
          time: '0:26 — 0:30',
          title: 'she was there',
          direction:
            'The chair is occupied. The take was never for us. The card lands after the story has already paid for itself.',
          script: 'PICTURE: she looks up. CARD: desi draft — ideas into impact.',
          slot: {
            src: '/images/portfolio/hook-turn-payoff/frame-03-payoff-9x16.jpg',
            ratio: '9 / 16',
            slot: 'storyboard frame 03 — payoff',
            alt: 'A young person seated at the desk with a cup, the cinema camera in the foreground',
            width: 752,
            height: 1392,
          },
        },
      ],
      markers: [
        { at: 0, time: '0:00', label: 'hook' },
        { at: 47, time: '0:14', label: 'turn' },
        { at: 87, time: '0:26', label: 'payoff' },
      ],
      excerpt: [
        { time: '0:00', picture: 'black, room tone', sound: 'the room hums.' },
        { time: '0:02', picture: 'fingers over REC', sound: 'one more take.' },
        { time: '0:14', picture: 'the desk, wider', sound: 'you set the second cup out anyway.' },
        { time: '0:23', picture: 'chair scraped back', sound: 'the door.' },
        { time: '0:27', picture: 'she sits, looks up', sound: '— you were waiting for me?' },
        { time: '0:30', picture: 'card over black', sound: 'lockup, one beat of room tone.' },
      ],
      skills: [
        'Scriptwriting',
        'Story development',
        'Hook development',
        'Storyboards',
        'Shot planning',
        'Editing rhythm',
        'Sound-off readability',
        'Visual storytelling',
        'Motion direction',
      ],
    },
    process: [
      {
        title: 'write the frame, not the line',
        body: 'The opening is described as something you can see. If it needs a voiceover to make sense, it is not a hook yet.',
      },
      {
        title: 'one turn only',
        body: 'A second twist costs more time than it buys. One change of information, placed at the halfway mark.',
      },
      {
        title: 'pay it off',
        body: 'The payoff answers the hook literally. No new idea enters in the last five seconds.',
      },
      {
        title: 'read it out loud',
        body: 'Every script is timed at speaking pace before it is timed on a timeline. The two numbers rarely agree.',
      },
    ],
    facts: [
      { label: 'structure', value: 'hook 0–3s · turn ~50% · payoff last 4s' },
      { label: 'formats', value: '15s, 30s, 45s, 60s' },
      { label: 'output', value: 'script, beat sheet, shot column' },
      { label: 'stage', value: 'in use across studio formats' },
    ],
  },
  {
    id: 'identity',
    slug: 'studio-identity',
    title: 'the studio identity',
    category: 'brand',
    kind: 'brand',
    status: 'studio',
    client: 'our own studio',
    standfirst:
      'Wordmark, palette, type system and sixteen die-cut stickers — the visual language this site is built from.',
    intro:
      'Desi Draft’s own identity: a heavy lowercase wordmark, a five-colour palette with one accent per surface, four typefaces with clearly divided jobs, and a sticker set used as punctuation rather than decoration.',
    challenge:
      'An independent studio needs to look like it can handle a TVC and a meme in the same week without looking like neither. The identity had to be loud enough to be remembered at thumbnail size and disciplined enough to carry a case study.',
    approach:
      'One wordmark, set tight and lowercase. Colour is assigned by job — forest for structure, tangerine for action, lilac and periwinkle for content, lime for emphasis — so a page can be bright without becoming a rainbow. Type does the rest: Archivo for statements, Instrument Serif italic for the human aside, DM Sans for reading, Yellowtail for the signature.',
    role: ['Identity design', 'Type system', 'Art direction', 'Design system'],
    services: ['Branding', 'Visual Communication', 'Digital Experiences'],
    deliverables: [
      'Wordmark and lockups',
      'Five-colour palette with usage rules',
      'Four-typeface system with roles',
      'Sixteen die-cut stickers',
      'Website design system',
    ],
    cover: {
      src: '/images/portfolio/studio-identity/identity-sheet-16x9.jpg',
      ratio: '16 / 9',
      slot: 'identity sheet — wordmark, palette, type',
      alt: 'The Desi Draft wordmark with its five-colour palette, hex values and role for each colour',
      color: '#2E7D5B',
      caption: 'identity, one sheet',
      tag: 'identity sheet',
    },
    gallery: [
      {
        src: '/images/portfolio/studio-identity/type-specimen-16x9.jpg',
        ratio: '16 / 9',
        slot: 'type specimen — four typefaces, four jobs',
        alt: 'Type specimen: Archivo for statements, Instrument Serif for asides, DM Sans for reading, Yellowtail for the signature',
        color: '#8499F8',
        caption: 'type system',
        tag: 'type specimen',
      },
      {
        src: '/images/portfolio/studio-identity/sticker-sheet-16x9.jpg',
        ratio: '16 / 9',
        slot: 'sticker sheet — sixteen die-cuts',
        alt: 'Sheet of all sixteen illustrated stickers, drawn as part of the studio identity',
        color: '#E8B4F5',
        caption: 'sticker sheet',
        tag: 'sticker sheet',
      },
    ],
    identityStudy: {
      chapters: [
        {
          no: '01',
          title: 'the wordmark',
          body: 'One mark, set tight and lowercase, drawn to survive a 40px favicon and an A2 poster. It never gets an outline, a gradient or a second colour.',
        },
        {
          no: '02',
          title: 'the visual language',
          body: 'Five colours with jobs, four typefaces with jobs. A surface picks one accent and lives with it; the other four wait their turn.',
        },
        {
          no: '03',
          title: 'the digital experience',
          body: 'The identity was drawn at the same time as this site, so the site is its first real application: the same mark, palette and type at 1440 and at 390.',
        },
        {
          no: '04',
          title: 'the graphic system',
          body: 'Sixteen die-cuts drawn in the same hand as the mark. They are punctuation: one per surface, never a pattern.',
        },
        {
          no: '05',
          title: 'the application',
          body: 'Where the identity would live if it were printed: cards, letterhead, sticker sheets and a poster. The environments are concept mockups; the mark, palette and type are the real system, composited in the browser.',
        },
      ],
      lockups: [
        { label: 'primary', note: 'forest on cream', bg: '#EEEAE3', fg: '#2E7D5B' },
        { label: 'reversed', note: 'cream on forest', bg: '#2E7D5B', fg: '#EEEAE3' },
        { label: 'signature', note: 'ink on lime', bg: '#E4FBA8', fg: '#0A0A0A' },
      ],
      screens: [
        {
          src: '/work/desi-draft-home.jpg',
          ratio: '16 / 10',
          slot: 'desktop — home, hero and portfolio',
          alt: 'The Desi Draft home page at 1440: the reel montage behind the headline',
          caption: 'home · 1440 × 900',
          url: 'desidraft.com',
        },
        {
          src: '/work/desi-draft-work.jpg',
          ratio: '16 / 10',
          slot: 'desktop — work index and filters',
          alt: 'The work index with category filters and the featured café case study',
          caption: 'work index · 1440 × 900',
          url: 'desidraft.com/work',
        },
        {
          src: '/work/desi-draft-mobile.jpg',
          ratio: '9 / 19.5',
          slot: 'phone — the same identity at 390',
          alt: 'The work index on a 390px phone screen',
          caption: '390 × 844',
        },
      ],
      applications: [
        {
          slot: {
            src: '/images/portfolio/studio-identity/mockup-print-3x4.jpg',
            ratio: '3 / 4',
            slot: 'concept mockup — cotton cards on a studio desk',
            alt: 'A blank stack of cream cotton-paper cards beside marigolds and a brass pen in warm light',
            width: 880,
            height: 1184,
          },
          label: 'the leave-behind',
          note: 'Cotton cards and a folded note, set in cream.',
          mark: 'wordmark',
          x: 31,
          y: 63,
          w: 46,
          rotate: -4,
        },
        {
          slot: {
            src: '/images/portfolio/studio-identity/mockup-letterhead-3x4.jpg',
            ratio: '3 / 4',
            slot: 'concept mockup — stationery flat-lay',
            alt: 'A blank cream letterhead, envelope and business card on kraft paper with a eucalyptus sprig',
            width: 880,
            height: 1184,
          },
          label: 'the first page',
          note: 'One wordmark, generous margins, nothing else.',
          mark: 'wordmark',
          x: 17,
          y: 54,
          w: 46,
          rotate: -1,
        },
        {
          slot: {
            src: '/images/portfolio/studio-identity/mockup-stickers-3x4.jpg',
            ratio: '3 / 4',
            slot: 'concept mockup — die-cut sheets on the desk',
            alt: 'Blank die-cut sticker sheets on a sunlit desk beside a lime pencil cup and a coral notebook',
            width: 880,
            height: 1184,
          },
          label: 'the sticker drawer',
          note: 'Die-cuts in production order, waiting for laptops and parcels.',
          mark: 'sticker',
          x: 19,
          y: 58,
          w: 22,
          rotate: -7,
        },
        {
          slot: {
            src: '/images/portfolio/studio-identity/mockup-wall-4x3.jpg',
            ratio: '4 / 3',
            slot: 'concept mockup — poster in a studio',
            alt: 'A blank framed poster on a cream studio wall with leaf shadows and a terracotta stool',
            width: 1184,
            height: 880,
          },
          label: 'the wall',
          note: 'One poster per project, printed at A2.',
          mark: 'wordmark',
          x: 39,
          y: 40,
          w: 34,
          rotate: 0,
          tagline: 'ideas into impact',
        },
      ],
      skills: [
        'Brand identity development',
        'Wordmark applications',
        'Typography',
        'Colour-system design',
        'Sticker and icon systems',
        'Graphic design',
        'Digital art direction',
        'Visual consistency',
        'Website identity implementation',
      ],
    },
    process: [
      {
        title: 'one loud mark',
        body: 'The wordmark is set as tight as the letters allow so it still reads as a shape at 40px.',
      },
      {
        title: 'colour by job',
        body: 'Each colour has a role, not a mood. That is what keeps five colours from competing on one page.',
      },
      {
        title: 'four typefaces, four jobs',
        body: 'Statement, aside, reading, signature. No typeface is used outside its job, which is why the pages stay consistent.',
      },
      {
        title: 'stickers as punctuation',
        body: 'Sixteen die-cuts, used one per surface. They mark a moment; they do not fill space.',
      },
    ],
    facts: [
      { label: 'wordmark', value: 'custom lowercase, Archivo-derived' },
      { label: 'palette', value: '#2E7D5B · #E8603C · #8499F8 · #E8B4F5 · #E4FBA8' },
      { label: 'type', value: 'Archivo · Instrument Serif · DM Sans · Yellowtail' },
      { label: 'stickers', value: '16 original die-cut illustrations' },
    ],
  },
];

export const getProject = (slug?: string) => portfolio.find((p) => p.slug === slug);

export const projectsIn = (filter: FilterId) =>
  filter === 'all' ? portfolio : portfolio.filter((p) => p.category === filter);

export const featuredProject = portfolio.find((p) => p.featured) ?? portfolio[0];

/** Next project in the full catalogue order, used at the end of a case study. */
export const nextProject = (slug: string) => {
  const i = portfolio.findIndex((p) => p.slug === slug);
  return portfolio[(i + 1) % portfolio.length];
};

/** Related = same discipline first, then the rest. Never includes the current one. */
export const relatedProjects = (project: PortfolioProject, count = 3) => {
  const same = portfolio.filter((p) => p.id !== project.id && p.category === project.category);
  const rest = portfolio.filter((p) => p.id !== project.id && p.category !== project.category);
  return [...same, ...rest].slice(0, count);
};
