import type { PillColor, StickerKey, WorkType } from '../types';

export type Project = {
  slug: string;
  title: string;
  client: string;
  type: WorkType;
  sticker: StickerKey;
  pill: PillColor;
  colors: [string, string];
  subtitle: string;
  blurb: string;
  stats: { value: string; label: string }[];
};

/**
 * Placeholder catalogue — swap `title`, `client`, `colors` and later the media
 * paths in `Project.media` for real client work.
 */
export const projects: Project[] = [
  {
    slug: 'chai-co',
    title: 'chai co.',
    client: 'chai co.',
    type: 'social',
    sticker: 'smiley',
    pill: 'lime',
    colors: ['#E8B4F5', '#4B63E8'],
    subtitle: 'a whole personality in a paper cup',
    blurb:
      'A six-month always-on system for a chai chain that wanted to feel like a friend instead of a franchise. Reels, memes and a running cast of characters.',
    stats: [
      { value: '9.4M', label: 'organic views' },
      { value: '+212%', label: 'saves' },
      { value: '38', label: 'reels shipped' },
    ],
  },
  {
    slug: 'mehendi-mart',
    title: 'mehendi mart',
    client: 'mehendi mart',
    type: 'activation',
    sticker: 'heartHands',
    pill: 'tangerine',
    colors: ['#E8603C', '#9B2155'],
    subtitle: 'shaadi season, but make it a queue',
    blurb:
      'A travelling mehendi counter that turned three metro stations into the most photographed corner of the city for eight weeks.',
    stats: [
      { value: '14k', label: 'hands done' },
      { value: '2.1M', label: 'UGC views' },
      { value: '8', label: 'city stops' },
    ],
  },
  {
    slug: 'biryani-bros',
    title: 'biryani bros',
    client: 'biryani bros',
    type: 'social',
    sticker: 'bam',
    pill: 'lime',
    colors: ['#9B2155', '#E8603C'],
    subtitle: 'the loudest kitchen on the internet',
    blurb:
      'We built a weekly reality show inside a cloud kitchen: one dish, one argument, one verdict. Format, shoot, edit, distribution — all in-house.',
    stats: [
      { value: '4.2M', label: 'views in week 1' },
      { value: '+310%', label: 'engagement' },
      { value: '12', label: 'days to launch' },
    ],
  },
  {
    slug: 'desi-denim',
    title: 'desi denim',
    client: 'desi denim',
    type: '360',
    sticker: 'hundred',
    pill: 'periwinkle',
    colors: ['#4B63E8', '#8499F8'],
    subtitle: 'made to fit, not to flatter',
    blurb:
      'A full 360 for a homegrown denim label: brand strategy, casting, a 40-person street shoot, and a paid-social funnel that actually converted.',
    stats: [
      { value: '3.6x', label: 'ROAS' },
      { value: '1.8M', label: 'reach' },
      { value: '4', label: 'campaign films' },
    ],
  },
  {
    slug: 'shaadi-squad',
    title: 'shaadi squad',
    client: 'shaadi squad',
    type: '360',
    sticker: 'letsGo',
    pill: 'lilac',
    colors: ['#E8B4F5', '#E8603C'],
    subtitle: 'seven weddings, one group chat',
    blurb:
      'A docu-format series following the aunties, cousins and caterers of the great Indian wedding. Filmed across four states in six weeks.',
    stats: [
      { value: '11.2M', label: 'total views' },
      { value: '62k', label: 'new followers' },
      { value: '7', label: 'episodes' },
    ],
  },
  {
    slug: 'cricket-cafe',
    title: 'cricket cafe',
    client: 'cricket cafe',
    type: 'social',
    sticker: 'thumbsUp',
    pill: 'lime',
    colors: ['#2E7D5B', '#E4FBA8'],
    subtitle: 'every match gets a menu item',
    blurb:
      'Real-time social for a sports cafe: menu drops tied to fixtures, group-chat commentary and a mascot that got its own fan edits.',
    stats: [
      { value: '18', label: 'hours of live' },
      { value: '+184%', label: 'footfall' },
      { value: '41', label: 'memes' },
    ],
  },
  {
    slug: 'masala-snacks',
    title: 'masala snacks',
    client: 'masala snacks',
    type: 'social',
    sticker: 'goodVibes',
    pill: 'tangerine',
    colors: ['#E8603C', '#E4FBA8'],
    subtitle: 'the packet you steal from the kitchen',
    blurb:
      'A snack brand with terrible recall and great taste. We gave it a mascot, a catchphrase and a creator programme of 60 micro-influencers.',
    stats: [
      { value: '6.8M', label: 'views' },
      { value: '60', label: 'creators' },
      { value: '+96%', label: 'brand search' },
    ],
  },
  {
    slug: 'lassi-lab',
    title: 'lassi lab',
    client: 'lassi lab',
    type: 'design',
    sticker: 'cool',
    pill: 'periwinkle',
    colors: ['#8499F8', '#E8B4F5'],
    subtitle: 'a brand that tastes like summer',
    blurb:
      'Identity, packaging and social design for a lassi brand that wanted to look like a record label, not a dairy.',
    stats: [
      { value: '3', label: 'SKUs designed' },
      { value: '22', label: 'packaging labels' },
      { value: '5', label: 'weeks' },
    ],
  },
  {
    slug: 'rangoli-wear',
    title: 'rangoli wear',
    client: 'rangoli wear',
    type: 'design',
    sticker: 'fingerHeart',
    pill: 'lilac',
    colors: ['#9B2155', '#E8B4F5'],
    subtitle: 'festive, without the costume',
    blurb:
      'A festive capsule campaign built around real homes: hand-drawn type, family photographs and a lookbook shot on one street.',
    stats: [
      { value: '48h', label: 'sell-through' },
      { value: '9', label: 'pieces' },
      { value: '1', label: 'street' },
    ],
  },
  {
    slug: 'diwali-drop',
    title: 'diwali drop',
    client: 'diwali drop',
    type: 'activation',
    sticker: 'heart',
    pill: 'lime',
    colors: ['#4B63E8', '#9B2155'],
    subtitle: 'a pop-up you had to queue for',
    blurb:
      'A three-day Diwali pop-up with a live mehendi bar, a chai cart and a queue we filmed like a runway.',
    stats: [
      { value: '4.3k', label: 'guests' },
      { value: '820k', label: 'reel reach' },
      { value: '3', label: 'days' },
    ],
  },
  {
    slug: 'bhangra-beats',
    title: 'bhangra beats',
    client: 'bhangra beats',
    type: 'social',
    sticker: 'phone',
    pill: 'periwinkle',
    colors: ['#2E7D5B', '#4B63E8'],
    subtitle: 'a label that posts like a person',
    blurb:
      'Content strategy for a music label: artist-led formats, comment-section lore and a weekly chart that fans now screenshot.',
    stats: [
      { value: '2.6M', label: 'monthly views' },
      { value: '+7.4k', label: 'followers / wk' },
      { value: '16', label: 'artists' },
    ],
  },
  {
    slug: 'kulfi-kings',
    title: 'kulfi kings',
    client: 'kulfi kings',
    type: 'social',
    sticker: 'camera',
    pill: 'tangerine',
    colors: ['#E4FBA8', '#2E7D5B'],
    subtitle: 'the slowest brand on the fastest app',
    blurb:
      'We put a 70-year-old kulfi counter on TikTok with zero dance trends — just the sound of the knife and one very opinionated owner.',
    stats: [
      { value: '5.1M', label: 'views' },
      { value: '94%', label: 'sentiment' },
      { value: '0', label: 'dance trends' },
    ],
  },
];

export const workFilters: { label: string; value: 'all' | WorkType }[] = [
  { label: 'all', value: 'all' },
  { label: '360', value: '360' },
  { label: 'social', value: 'social' },
  { label: 'activation', value: 'activation' },
  { label: 'design', value: 'design' },
];

export const getProject = (slug?: string) => projects.find((p) => p.slug === slug);
