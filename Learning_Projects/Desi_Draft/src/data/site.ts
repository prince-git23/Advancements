import type { StickerKey } from '../types';

export type ServiceGroup = {
  id: string;
  /** ledger number, printed at the start of the row */
  no: string;
  title: string;
  lede: string;
  items: string[];
  color: string;
  text: string;
  sticker: StickerKey;
  /** A real project asset shown as the service preview. */
  image: string;
  imageAlt: string;
  /** The real project that proves the claim. Omitted where none exists yet. */
  evidence?: { slug: string; label: string };
};

/**
 * Five groups, not five identical cards. Each one maps to a discipline in the
 * portfolio, so a service claim always has a case study behind it.
 */
export const serviceGroups: ServiceGroup[] = [
  {
    id: 'production',
    no: '01',
    title: 'content production',
    lede: 'Shooting and cutting the things people actually watch on a phone.',
    items: [
      'Video editing',
      'Short-form: Reels & Shorts',
      'Promotional films',
      'Motion graphics',
      'Kinetic typography',
      'Beat-synced cuts',
      'Colour and sound',
    ],
    color: '#E8603C',
    text: '#0A0A0A',
    sticker: 'camera',
    image: '/images/services/content-production.webp',
    imageAlt:
      'A cinema camera on a tripod between two softboxes, with a production monitor on set.',
    evidence: { slug: 'cut-to-the-beat', label: 'cut to the beat' },
  },
  {
    id: 'strategy',
    no: '02',
    title: 'creative strategy',
    lede: 'The idea, the hook and the structure — settled before anyone books a camera.',
    items: [
      'Scriptwriting',
      'Story structure & hooks',
      'Content planning',
      'Campaign concepts',
      'Storyboards',
      'Copywriting',
    ],
    color: '#E4FBA8',
    text: '#0A0A0A',
    sticker: 'smiley',
    image: '/images/services/creative-strategy.webp',
    imageAlt:
      'A cork moodboard of torn colour swatches above an open notebook of blank storyboard frames.',
    evidence: { slug: 'hook-turn-payoff', label: 'hook, turn, payoff' },
  },
  {
    id: 'digital',
    no: '03',
    title: 'digital experiences',
    lede: 'Sites and interactive pieces designed, written and built in the same room.',
    items: [
      'Website design',
      'Responsive frontend',
      'React / Vite builds',
      'Motion systems',
      'Accessibility passes',
      'Performance budgets',
    ],
    color: '#8499F8',
    text: '#0A0A0A',
    sticker: 'cursor',
    image: '/images/services/digital-experiences.webp',
    imageAlt: 'A monitor, laptop and phone showing the same website layout at three widths.',
    evidence: { slug: 'desi-draft-dot-com', label: 'desi draft dot com' },
  },
  {
    id: 'visual',
    no: '04',
    title: 'visual communication',
    lede: 'Identity, campaigns and the daily surface of a brand — social, print, packaging.',
    items: [
      'Visual identity',
      'Social creative',
      'Campaign design',
      'Packaging',
      'Editorial & DTP',
      'Menus and print',
    ],
    color: '#E8B4F5',
    text: '#0A0A0A',
    sticker: 'heart',
    image: '/images/services/visual-communication.webp',
    imageAlt:
      'Typography posters, kraft packaging and a colour swatch fan on a print desk.',
    evidence: { slug: 'studio-identity', label: 'the studio identity' },
  },
  {
    id: 'spaces',
    no: '05',
    title: 'creative spaces',
    lede: 'Rooms, walls and the art direction that holds them together.',
    items: [
      'Environmental art direction',
      'Floral direction',
      'Graffiti & lettering',
      'Wall compositions',
      'Signage and menus',
      'Install documentation',
    ],
    color: '#9B2155',
    text: '#EEEAE3',
    sticker: 'hundred',
    image: '/images/services/creative-spaces.webp',
    imageAlt:
      'A coral and violet mural behind dried florals, a brass plaque and a lime chair.',
  },
];

/**
 * Contact details.
 *
 * Every field is empty until a value is verified. A placeholder phone number,
 * an inbox nobody has tested, or a link to instagram.com's homepage is worse
 * than no link at all, so nothing unverified is published: the components skip
 * what is missing, and every enquiry CTA falls back to the on-site contact
 * dialog instead of a dead href.
 *
 * Fill a field in when it is real and the UI picks it up with no other change:
 *  - `email`           an inbox somebody has sent to and received from
 *  - `whatsapp`        full link, e.g. 'https://wa.me/91XXXXXXXXXX'
 *  - `address`         street lines as they should be printed; [] hides it
 *  - `maps`            the exact place link for that address
 *  - `social.*`        profile URLs, never platform homepages
 *
 * Instagram is verified: @desidraftt.co is the studio's own public profile and
 * was inspected directly (two published reels, bio "Ideas Into Impact.").
 */
/** Verified public details — supplied by the studio, printed as given. */
export const INSTAGRAM_URL = 'https://www.instagram.com/desidraftt.co/';
export const INSTAGRAM_HANDLE = '@desidraftt.co';
export const WHATSAPP_URL = 'https://wa.me/919021513161';
export const PHONE_DISPLAY = '+91 90215 13161';
export const STUDIO_LOCATION = 'NKY Tower, Nagpur, Maharashtra, India';

export const site = {
  email: 'desidraftt@gmail.com',
  whatsapp: WHATSAPP_URL,
  address: [STUDIO_LOCATION],
  // No map pin has been supplied, so the location stays readable text.
  maps: '',
  social: {
    instagram: INSTAGRAM_URL,
    linkedin: '',
    tiktok: '',
  },
};

export const hasEmail = Boolean(site.email);
export const hasWhatsApp = Boolean(site.whatsapp);
export const hasAddress = site.address.length > 0;

export const socialLinks = Object.entries(site.social).filter(([, url]) => Boolean(url)) as [
  keyof typeof site.social,
  string,
][];

/** True once at least one verified public channel exists. */
export const hasContactChannel = hasEmail || hasWhatsApp || socialLinks.length > 0;

/**
 * A mailto for an enquiry subject, or '' when no verified inbox exists.
 * Callers must treat '' as "no destination" and open the contact dialog.
 */
export const enquiryHref = (subject: string) =>
  hasEmail ? `mailto:${site.email}?subject=${encodeURIComponent(subject)}` : '';
