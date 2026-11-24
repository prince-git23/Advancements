import type { ReactNode } from 'react';
import type { PortfolioProject } from '../../data/portfolio';
import { Logo } from '../art/Logo';
import { Sticker } from '../art/Stickers';
import { AssetFrame } from './AssetFrame';

/**
 * The three studio-format case studies, told with the artefacts they actually
 * have: a social grid and its posts, a three-beat storyboard, and the identity
 * applied to real screens and to concept mockups.
 *
 * Generated photography is always labelled: `concept post`, `concept cover`,
 * `concept frame`, `concept mockup`. Nothing here claims a published campaign,
 * a client or a filmed commercial.
 */

const Part = ({
  no,
  title,
  body,
  children,
}: {
  no: string;
  title: string;
  body?: string;
  children: ReactNode;
}) => (
  <section>
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-ink/20 pt-4">
      <div className="flex items-baseline gap-3">
        <span className="text-[10px] tabular-nums tracking-[0.18em] text-ink/55">{no}</span>
        <h3 className="display text-[clamp(1.35rem,2.5vw,1.9rem)] leading-[1]">{title}</h3>
      </div>
    </div>
    {body && <p className="mt-3 max-w-[64ch] text-[14px] leading-[1.6] text-ink/70">{body}</p>}
    <div className="mt-5">{children}</div>
  </section>
);

const Skills = ({ items }: { items: string[] }) => (
  <div className="flex flex-wrap gap-2">
    {items.map((skill) => (
      <span key={skill} className="rounded-full border border-ink/20 px-3 py-[6px] text-[11px] text-ink/65">
        {skill}
      </span>
    ))}
  </div>
);

/* ------------------------------------------------------------------ *
 * Always On — the monthly system, shown as a system.
 * ------------------------------------------------------------------ */

export function SocialStudy({ project }: { project: PortfolioProject }) {
  const system = project.social;
  if (!system) return null;

  return (
    <div className="space-y-12 sm:space-y-16">
      <Part
        no="01"
        title="the month, as a grid"
        body="Eleven planned posts, four reels and one slot left open. Colour and format are sequenced before a caption is written, so a month reads as one composition rather than twelve unrelated uploads."
      >
        <div className="study-rail sm:grid sm:grid-cols-3 sm:gap-2 lg:grid-cols-4">
          {system.grid.map((tile, i) => (
            <div
              key={`${tile.format}-${i}`}
              className={`relative aspect-[4/5] overflow-hidden rounded-[6px] ${
                tile.open ? 'border border-dashed border-ink/35' : ''
              }`}
              style={{ background: tile.color }}
            >
              {tile.src && (
                <>
                  <img
                    src={tile.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-ink/5"
                  />
                </>
              )}
              <span
                className={`absolute left-1.5 top-1.5 z-10 text-[8px] uppercase tabular-nums tracking-[0.14em] ${
                  tile.src ? 'text-cream/75' : 'text-ink/55'
                }`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="absolute inset-x-0 bottom-0 z-10 p-1.5 sm:p-2">
                {tile.open ? (
                  <>
                    <p className="text-[9px] uppercase leading-[1.2] tracking-[0.1em] text-ink/70">open slot</p>
                    <p className="mt-0.5 text-[9px] leading-[1.3] text-ink/55">{tile.line}</p>
                  </>
                ) : (
                  <p
                    className={`line-clamp-2 text-[10.5px] uppercase leading-[1.25] tracking-[0.06em] ${
                      tile.src ? 'text-cream' : 'text-ink/80'
                    }`}
                  >
                    {tile.line ?? tile.format}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 max-w-[76ch] text-[12px] leading-[1.55] text-ink/55">
          Concept grid, not a published feed. Each tile carries its format and pillar: the desk (founder), proof of
          work (hands and paper), counter shot (a second opinion) and the open comment-reply slot. The typographic
          tiles are designed in code, not screenshots.
        </p>
      </Part>

      <Part
        no="02"
        title="the post set"
        body="Four posts from the month, composed at 4:5 with one voice line and one supporting sentence. The copy is written, not baked into the photograph."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {system.posts.map((post) => (
            <figure key={post.headline} className="overflow-hidden rounded-[10px] border border-ink/10 bg-[#F3EEE5]">
              <div className="relative aspect-[4/5] overflow-hidden">
                <AssetFrame slot={post.slot} ratio="4 / 5" bare className="h-full w-full" />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-ink via-ink/75 to-transparent"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-[22%] bg-gradient-to-b from-ink/55 to-transparent"
                />
                <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-3">
                  <span className="text-[9px] uppercase tracking-[0.16em] text-cream/80">@desidraftt.co</span>
                  <span className="rounded-full border border-cream/35 px-2 py-[3px] text-[8px] uppercase tracking-[0.14em] text-cream/80">
                    concept
                  </span>
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4">
                  <p className="display text-[clamp(1.1rem,2vw,1.55rem)] leading-[1.02] text-cream">{post.headline}</p>
                  <p className="mt-2 max-w-[40ch] text-[12px] leading-[1.5] text-cream/80">{post.copy}</p>
                </div>
              </div>
              <figcaption className="flex items-center justify-between gap-3 px-3 py-2 text-[9px] uppercase tracking-[0.13em] text-ink/55">
                <span>{post.pillar}</span>
                <span>concept post · not published</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Part>

      <Part
        no="03"
        title="four reel covers"
        body="Covers are designed at 9:16 with the hook in the top third and the caption band kept clear of the interface, so a muted scroll still reads the point."
      >
        <div className="study-rail sm:grid sm:grid-cols-4 sm:gap-4">
          {system.reels.map((reel) => (
            <figure key={reel.line}>
              <div className="relative aspect-[9/16] overflow-hidden rounded-[8px]" style={{ background: reel.color }}>
                {reel.slot ? (
                  <AssetFrame slot={reel.slot} ratio="9 / 16" bare className="h-full w-full" />
                ) : (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(155deg, ${reel.color} 0%, #2E7D5B 100%)` }}
                  />
                )}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-ink/25"
                />
                <span className="absolute left-2.5 top-2.5 text-[8px] uppercase tabular-nums tracking-[0.14em] text-cream/80">
                  {reel.time} · 9:16
                </span>
                <span className="absolute right-2.5 top-2.5 rounded-full border border-cream/45 px-1.5 py-[2px] text-[7.5px] uppercase tracking-[0.12em] text-cream/85">
                  sound off
                </span>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3">
                  <p className="display text-[clamp(0.95rem,1.7vw,1.3rem)] leading-[1.02] text-cream">{reel.hook}</p>
                  <p className="mt-1.5 text-[10px] leading-[1.45] text-cream/75">{reel.sub}</p>
                </div>
              </div>
              <figcaption className="mt-2 flex items-baseline justify-between gap-2 border-t border-ink/15 pt-1.5 text-[9px] uppercase tracking-[0.12em] text-ink/55">
                <span>{reel.line}</span>
                <span className="tabular-nums">{reel.time}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-3 max-w-[76ch] text-[12px] leading-[1.55] text-ink/55">
          Concept covers. The fourth is typographic on purpose: not every reel needs a face, and a type-only cover
          survives the smallest thumbnail.
        </p>
      </Part>

      <div className="grid gap-10 md:grid-cols-2 md:gap-12">
        <Part no="04" title="the pillars" body="Four formats carry the month. Three repeat; the fourth is left empty for the audience.">
          <ul className="divide-y divide-ink/10 border-y border-ink/10">
            {system.pillars.map((pillar) => (
              <li key={pillar.name} className="grid grid-cols-[6px_1fr_auto] items-baseline gap-3 py-3">
                <span className="h-7 w-[6px] rounded-full" style={{ background: pillar.color }} />
                <div>
                  <p className="display text-[15px]">{pillar.name}</p>
                  <p className="mt-0.5 text-[12px] leading-[1.4] text-ink/60">{pillar.job}</p>
                </div>
                <span className="text-right text-[9.5px] uppercase leading-[1.4] tracking-[0.1em] text-ink/55">
                  {pillar.share}
                </span>
              </li>
            ))}
          </ul>
        </Part>

        <Part no="05" title="the schedule" body="Three feed posts and one reel a week, in one colour order. Nothing is posted twice in a row from the same pillar.">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[300px] border-collapse text-left">
              <thead>
                <tr className="border-y border-ink/15 text-[8.5px] uppercase tracking-[0.16em] text-ink/55">
                  <th className="py-2 pr-3 font-normal">week</th>
                  <th className="py-2 pr-3 font-normal">feed</th>
                  <th className="py-2 font-normal">reel</th>
                </tr>
              </thead>
              <tbody>
                {system.schedule.map((row) => (
                  <tr key={row.week} className="border-b border-ink/10 text-[11.5px] leading-[1.4]">
                    <td className="py-2.5 pr-3 uppercase tracking-[0.08em] text-ink/55">{row.week}</td>
                    <td className="py-2.5 pr-3 text-ink/80">{row.feed}</td>
                    <td className="py-2.5 text-ink/80">{row.reel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Part>
      </div>

      <Part no="06" title="the voice" body="One set of rules for captions and replies: short sentences, concrete nouns, no exclamation marks. Each line below is a real example from the voice guide.">
        <div className="grid gap-4 sm:grid-cols-3">
          {system.voice.map((line) => (
            <figure key={line.line} className="border-t border-ink/15 pt-4">
              <blockquote className="serif-i text-[clamp(1.15rem,2vw,1.45rem)] leading-[1.15]">“{line.line}”</blockquote>
              <figcaption className="mt-3 text-[11px] leading-[1.5] text-ink/55">{line.why}</figcaption>
            </figure>
          ))}
        </div>
      </Part>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Hook, Turn, Payoff — three frames, one scene.
 * ------------------------------------------------------------------ */

export function ScriptStudy({ project }: { project: PortfolioProject }) {
  const study = project.scriptStudy;
  if (!study) return null;

  return (
    <div className="space-y-12 sm:space-y-16">
      <Part
        no="01"
        title="three frames, one scene"
        body="The same desk, the same night, the same camera. Nothing moves location between the hook and the payoff; only the information changes."
      >
        <div className="study-rail sm:grid sm:grid-cols-3 sm:gap-5">
          {study.frames.map((frame) => (
            <figure key={frame.beat}>
              <div className="relative aspect-[9/16] overflow-hidden rounded-[8px] bg-ink">
                <AssetFrame slot={frame.slot} ratio="9 / 16" bare className="h-full w-full" />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-ink/35"
                />
                <span className="absolute left-3 top-3 rounded-full bg-ink/55 px-2 py-[3px] text-[8.5px] uppercase tabular-nums tracking-[0.14em] text-cream/85 backdrop-blur-sm">
                  {frame.time}
                </span>
                <span className="absolute right-3 top-3 rounded-full border border-cream/40 px-2 py-[3px] text-[7.5px] uppercase tracking-[0.12em] text-cream/80">
                  concept frame
                </span>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-cream/65">{frame.beat}</p>
                  <p className="display mt-1 text-[clamp(1.25rem,2.3vw,1.8rem)] leading-[1] text-cream">
                    {frame.title}
                  </p>
                  <p className="mt-2 text-[12px] leading-[1.5] text-cream/80">{frame.direction}</p>
                </div>
              </div>
              <figcaption className="mt-3 border-t border-ink/15 pt-2">
                <p className="text-[9px] uppercase tracking-[0.16em] text-ink/55">script</p>
                <p className="mt-1 text-[12px] leading-[1.5] text-ink/75">{frame.script}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-3 max-w-[76ch] text-[12px] leading-[1.55] text-ink/55">
          Concept storyboard, not a filmed commercial: three frames generated as one continuous scene, with the
          script and timings from the studio’s own beat sheet.
        </p>
      </Part>

      <Part
        no="02"
        title="the timing"
        body="The hook owns the first three seconds, the turn lands at the halfway mark and the brand has the last four. The bar is the same one used in the edit."
      >
        <div className="relative mt-4 h-9">
          <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-ink/15" />
          <span
            aria-hidden="true"
            className="absolute left-0 top-1/2 h-[4px] -translate-y-1/2 rounded-full bg-[#E8603C]"
            style={{ width: '10%' }}
          />
          <span
            aria-hidden="true"
            className="absolute top-1/2 h-[4px] -translate-y-1/2 rounded-full bg-[#8499F8]"
            style={{ left: '10%', width: '77%' }}
          />
          <span
            aria-hidden="true"
            className="absolute top-1/2 h-[4px] -translate-y-1/2 rounded-full bg-[#2E7D5B]"
            style={{ left: '87%', right: 0 }}
          />
          {study.markers.map((marker) => (
            <span
              key={marker.time}
              aria-hidden="true"
              className="absolute top-1/2 h-5 w-[2px] -translate-y-1/2 bg-ink/80"
              style={{ left: `${marker.at}%` }}
            />
          ))}
        </div>
        <div className="relative mt-1 h-10">
          {study.markers.map((marker, i) => (
            <div
              key={marker.time}
              className={`absolute top-0 ${i === 0 ? 'text-left' : i === study.markers.length - 1 ? '-translate-x-full text-right' : '-translate-x-1/2 text-center'}`}
              style={{ left: `${marker.at}%` }}
            >
              <span className="block text-[10px] tabular-nums text-ink/70">{marker.time}</span>
              <span className="mt-0.5 block text-[8.5px] uppercase tracking-[0.14em] text-ink/55">{marker.label}</span>
            </div>
          ))}
        </div>
      </Part>

      <Part
        no="03"
        title="the script, as written"
        body="The same page the director and the editor work from: time, picture, sound. It is short enough to read in the time it takes to watch."
      >
        <div className="overflow-hidden rounded-[8px] border border-ink/15">
          <div className="grid grid-cols-[52px_1fr] gap-x-3 bg-[#E4FBA8] px-3 py-2 text-[8.5px] uppercase tracking-[0.16em] text-ink/60 sm:grid-cols-[58px_1fr_1fr] sm:px-4">
            <span>time</span>
            <span>picture</span>
            <span className="hidden sm:block">sound / line</span>
          </div>
          {study.excerpt.map((row, i) => (
            <div
              key={`${row.time}-${i}`}
              className={`grid grid-cols-[52px_1fr] gap-x-3 px-3 py-3 text-[12px] leading-[1.45] sm:grid-cols-[58px_1fr_1fr] sm:px-4 ${
                i % 2 ? 'bg-ink/[0.03]' : ''
              }`}
            >
              <span className="tabular-nums text-ink/55">{row.time}</span>
              <span className="text-ink/80">{row.picture}</span>
              <span className="col-span-2 mt-1 text-ink/60 sm:col-span-1 sm:mt-0">{row.sound}</span>
            </div>
          ))}
        </div>
      </Part>

      <Part no="04" title="what this shows" body="The skills the library is built to exercise, on every script, not only this one.">
        <Skills items={study.skills} />
      </Part>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * The Studio Identity — five chapters, real assets, labelled mockups.
 * ------------------------------------------------------------------ */

const PALETTE_ROWS = [
  { hex: '#2E7D5B', name: 'forest', job: 'structure, section fields' },
  { hex: '#E8603C', name: 'tangerine', job: 'action, in-progress marks' },
  { hex: '#8499F8', name: 'periwinkle', job: 'content surfaces' },
  { hex: '#E8B4F5', name: 'lilac', job: 'content surfaces' },
  { hex: '#E4FBA8', name: 'lime', job: 'emphasis, one per screen' },
];

const STICKER_SET = ['smiley', 'heart', 'bam', 'cursor', 'thumbsUp', 'goodVibes', 'hi', 'joinClub'] as const;

function BrowserChrome({ children, url }: { children: ReactNode; url: string }) {
  return (
    <div className="overflow-hidden rounded-[10px] border border-ink/15 bg-[#F7F4EE] p-[5px] shadow-[0_16px_36px_rgba(0,0,0,.10)]">
      <div className="flex items-center gap-1.5 px-2 pb-[6px] pt-[3px]">
        <span className="h-[5px] w-[5px] rounded-full bg-ink/20" />
        <span className="h-[5px] w-[5px] rounded-full bg-ink/20" />
        <span className="h-[5px] w-[5px] rounded-full bg-ink/20" />
        <span className="mx-auto max-w-[70%] truncate rounded-full bg-ink/[0.06] px-2.5 py-[2px] text-[9px] lowercase tracking-wide text-ink/60">
          {url}
        </span>
      </div>
      {children}
    </div>
  );
}

export function IdentityStudy({ project }: { project: PortfolioProject }) {
  const study = project.identityStudy;
  if (!study) return null;

  const [wordmark, language, digital, graphic, application] = study.chapters;
  const desktop = study.screens.filter((slot) => slot.ratio !== '9 / 19.5');
  const phone = study.screens.find((slot) => slot.ratio === '9 / 19.5');

  return (
    <div className="space-y-14 sm:space-y-16">
      <Part no={wordmark.no} title={wordmark.title} body={wordmark.body}>
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          {study.lockups.map((lockup) => (
            <div
              key={lockup.label}
              className="flex aspect-[4/3] flex-col justify-between rounded-[8px] border border-ink/10 p-4"
              style={{ background: lockup.bg, color: lockup.fg }}
            >
              <span className="text-[8.5px] uppercase tracking-[0.18em] opacity-60">{lockup.label}</span>
              <Logo className="w-full" color={lockup.fg} />
              <span className="text-[8.5px] uppercase tracking-[0.14em] opacity-55">{lockup.note}</span>
            </div>
          ))}
        </div>
      </Part>

      <Part no={language.no} title={language.title} body={language.body}>
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <ul className="divide-y divide-ink/10 border-y border-ink/10">
              {PALETTE_ROWS.map((row) => (
                <li key={row.hex} className="grid grid-cols-[36px_1fr] items-center gap-3 py-2.5 sm:grid-cols-[36px_74px_76px_1fr]">
                  <span className="h-9 w-9 rounded-[5px] border border-ink/10" style={{ background: row.hex }} />
                  <span className="display text-[14px]">{row.name}</span>
                  <span className="hidden text-[11px] tabular-nums text-ink/55 sm:block">{row.hex}</span>
                  <span className="col-span-2 text-[11.5px] leading-[1.4] text-ink/60 sm:col-span-1 sm:text-right">
                    {row.job}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-5 space-y-2 border-t border-ink/10 pt-4">
              <p className="display text-[clamp(1.2rem,2vw,1.5rem)] leading-[1.05]">statements are Archivo.</p>
              <p className="serif-i text-[clamp(1.1rem,1.8vw,1.35rem)] leading-[1.1]">asides are Instrument Serif italic.</p>
              <p className="text-[13px] leading-[1.5] text-ink/70">reading copy is DM Sans, set at 15–17px.</p>
              <p className="text-[17px]" style={{ fontFamily: 'Yellowtail, cursive' }}>
                and the signature is Yellowtail.
              </p>
            </div>
          </div>
          <div className="lg:col-span-7">
            <AssetFrame
              slot={{
                src: '/images/portfolio/studio-identity/type-specimen-16x9.jpg',
                ratio: '16 / 9',
                slot: 'type specimen — four typefaces, four jobs',
                alt: 'Type specimen sheet: Archivo, Instrument Serif, DM Sans and Yellowtail with their roles',
                caption: 'type system',
              }}
              className="rounded-[8px]"
            />
          </div>
        </div>
      </Part>

      <Part no={digital.no} title={digital.title} body={digital.body}>
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            {desktop.map((slot) => (
              <figure key={slot.caption}>
                <BrowserChrome url={slot.url ?? 'desidraft.com'}>
                  <AssetFrame slot={slot} ratio="16 / 10" bare className="rounded-[5px]" />
                </BrowserChrome>
                {slot.caption && (
                  <figcaption className="mt-2 text-[9px] uppercase tracking-[0.14em] text-ink/55">
                    {slot.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
          {phone && (
            <div className="flex flex-wrap items-end gap-6">
              <div className="w-[168px] overflow-hidden rounded-[22px] border-[5px] border-ink bg-ink shadow-[0_18px_36px_rgba(0,0,0,.22)]">
                <AssetFrame slot={phone} ratio="9 / 19.5" />
              </div>
              <p className="max-w-[40ch] pb-2 text-[13px] leading-[1.55] text-ink/65">
                The same identity at 390px: one column, the wordmark at the top, filters that scroll, and case-study
                plates that keep their ratio. Captured from the running build, not a mockup.
              </p>
            </div>
          )}
        </div>
      </Part>

      <Part no={graphic.no} title={graphic.title} body={graphic.body}>
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <AssetFrame
              slot={{
                src: '/images/portfolio/studio-identity/sticker-sheet-16x9.jpg',
                ratio: '16 / 9',
                slot: 'sticker sheet — sixteen die-cuts',
                alt: 'Sheet of all sixteen illustrated stickers drawn for the studio',
                caption: 'sticker sheet',
              }}
              className="rounded-[8px]"
            />
          </div>
          <div className="lg:col-span-5">
            <div className="grid grid-cols-4 gap-2 rounded-[8px] border border-ink/10 bg-[#F3EEE5] p-4">
              {STICKER_SET.map((kind) => (
                <div key={kind} className="grid place-items-center">
                  <Sticker kind={kind} size="sm" shadow={false} />
                </div>
              ))}
            </div>
            <p className="mt-3 text-[12px] leading-[1.55] text-ink/55">
              Drawn in the repository as vectors, so the same artwork is used at 56px on a card and 136px in the
              footer. Eight of the sixteen are shown here.
            </p>
          </div>
        </div>
      </Part>

      <Part no={application.no} title={application.title} body={application.body}>
        <div className="grid gap-5 sm:grid-cols-2">
          {study.applications.map((item) => (
            <figure key={item.label}>
              <div className="relative overflow-hidden rounded-[10px] border border-ink/10">
                <AssetFrame slot={item.slot} ratio={item.slot.ratio} bare />
                <span className="absolute right-2.5 top-2.5 z-20 rounded-full bg-ink/70 px-2 py-[3px] text-[8px] uppercase tracking-[0.14em] text-cream/85 backdrop-blur-sm">
                  concept mockup
                </span>
                <div
                  className="pointer-events-none absolute z-10"
                  style={{
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                    width: `${item.w}%`,
                    transform: `rotate(${item.rotate}deg)`,
                  }}
                >
                  {item.mark === 'wordmark' ? (
                    <>
                      <Logo className="w-full" color="#2E7D5B" />
                      {item.tagline && (
                        <p
                          className="mt-1 text-center uppercase tracking-[0.24em] text-[#2E7D5B]"
                          style={{ fontSize: 'clamp(5px, 0.62vw, 9px)' }}
                        >
                          {item.tagline}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="aspect-square w-full">
                      <Sticker kind="heart" size={120} shadow={false} style={{ width: '100%', height: '100%' }} />
                    </div>
                  )}
                </div>
              </div>
              <figcaption className="mt-2.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <span className="display text-[15px]">{item.label}</span>
                <span className="text-[11px] leading-[1.4] text-ink/55">{item.note}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-4 max-w-[78ch] text-[12px] leading-[1.55] text-ink/55">
          Concept mockups: the photographed environments are generated, while the wordmark, sticker artwork, palette
          and typography composited onto them are the studio’s actual assets. Nothing here claims a printed run.
        </p>
      </Part>

      <Part no="06" title="what this shows" body="The identity work, as a list of disciplines rather than a claim about results.">
        <Skills items={study.skills} />
      </Part>
    </div>
  );
}
