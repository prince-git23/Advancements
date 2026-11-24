import type { StickerKey } from '../types';

export type TeamMember = {
  id: string;
  /** The studio credit printed on the old badges; no surnames were invented. */
  name: string;
  role: string;
  /** Real portrait, e.g. '/images/team/aarav.jpg'. Falls back to the designed
   *  plate until the studio supplies the photograph. */
  photo?: string;
  /** One line, only when the member has written one. Never generated. */
  intro?: string;
  /** Team designation, not a presence indicator. */
  status: string;
  /** accent / die-cut colour */
  band: string;
  bandInk: string;
  /** card surface */
  card: string;
  sticker: StickerKey;
  stickerSide: 'left' | 'right';
};

/**
 * Everyone who has ever been on the studio record.
 *
 * `active` is the public flag. Three members currently work in the studio; the
 * other three are kept here as historical credits so their record is not lost,
 * but they are never rendered in the public Team section.
 *
 * ⚠ CONFIRM BEFORE LAUNCH: this repository contains no signed team record — the
 * names are studio credits and no member carries a supplied portrait. The three
 * flagged active (strategy, social creative, video + edit) were chosen because
 * those are the disciplines the studio's own service list and case studies
 * substantiate. If the actual active trio differs, flip `active` on the records
 * below; the section, its heading and the footer copy all follow the flag.
 */
const records: (TeamMember & { active: boolean })[] = [
  {
    id: 'aarav',
    name: 'aarav',
    role: 'strategy',
    status: 'core team',
    active: true,
    band: '#4B63E8',
    // Cream on royal is 4.12:1; this warm near-white clears 4.5:1 on the badge.
    bandInk: '#FAF8F4',
    card: '#F3EEE6',
    sticker: 'smiley',
    stickerSide: 'right',
  },
  {
    id: 'isha',
    name: 'isha',
    role: 'social creative',
    status: 'core team',
    active: true,
    band: '#E8603C',
    // Ink on the coral badge (5.82:1) reads better than cream (2.84:1).
    bandInk: '#0A0A0A',
    card: '#F3EEE6',
    sticker: 'heart',
    stickerSide: 'left',
  },
  {
    id: 'kabir',
    name: 'kabir',
    role: 'video + edit',
    status: 'core team',
    active: true,
    band: '#2E7D5B',
    bandInk: '#FAF8F4',
    card: '#E3E6EC',
    sticker: 'hundred',
    stickerSide: 'left',
  },
  {
    id: 'zoya',
    name: 'zoya',
    role: 'copy',
    status: 'former team',
    active: false,
    band: '#9B2155',
    bandInk: '#EEEAE3',
    card: '#E8B4F5',
    sticker: 'camera',
    stickerSide: 'right',
  },
  {
    id: 'dev',
    name: 'dev',
    role: 'community',
    status: 'former team',
    active: false,
    band: '#8499F8',
    bandInk: '#0A0A0A',
    card: '#F3EEE6',
    sticker: 'bam',
    stickerSide: 'right',
  },
  {
    id: 'meera',
    name: 'meera',
    role: 'design',
    status: 'former team',
    active: false,
    band: '#E8B4F5',
    bandInk: '#0A0A0A',
    card: '#E4FBA8',
    sticker: 'hi',
    stickerSide: 'left',
  },
];

/**
 * The public team: exactly the active members, in record order. Add or remove a
 * `active` flag and the section, its heading and the footer copy follow — no
 * count is hard-coded anywhere.
 */
export const team: TeamMember[] = records
  .filter((member) => member.active)
  .map(({ active: _active, ...member }) => member);

/** Historical credits, retained internally and never rendered publicly. */
export const formerTeam: TeamMember[] = records
  .filter((member) => !member.active)
  .map(({ active: _active, ...member }) => member);
