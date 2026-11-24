import { useEffect, useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from '../../lib/smooth';
import { usePrefersReducedMotion } from '../../lib/hooks';
import { EnquiryButton } from '../ContactDialog';
import {
  categoryOf,
  nextProject,
  relatedProjects,
  type PortfolioProject,
} from '../../data/portfolio';
import type { MediaSlot } from '../../data/portfolio';
import { AssetFrame } from './AssetFrame';
import { EditBreakdown, FilmStage, FormatStrip, Storyboard } from './FilmStudy';
import { IdentityStudy, ScriptStudy, SocialStudy } from './StudioStudies';
import { StatusChip } from './ProjectCard';
import { Chapter } from '../ui/Chapter';

/** A shipped project's own address: external, new tab, no opener. */
function LiveLink({
  live,
  className = '',
}: {
  live: NonNullable<PortfolioProject['live']>;
  className?: string;
}) {
  return (
    <a
      href={live.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center gap-2 ${className}`}
    >
      {live.label}
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
      >
        <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

const Label = ({ children }: { children: ReactNode }) => (
  <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-ink/60">{children}</p>
);

const Section = ({
  id,
  label,
  children,
  className = '',
}: {
  id?: string;
  label: string;
  children: ReactNode;
  className?: string;
}) => (
  <section id={id} data-cs-section className={`border-t border-ink/15 py-10 sm:py-14 ${className}`}>
    <Label>{label}</Label>
    {children}
  </section>
);

function BrowserChrome({ children, url }: { children: ReactNode; url?: string }) {
  return (
    <div className="overflow-hidden rounded-[12px] border border-ink/15 bg-[#F7F4EE] p-[6px] shadow-[0_20px_46px_rgba(0,0,0,.12)]">
      <div className="flex items-center gap-1.5 px-2 pb-[7px] pt-[3px]">
        <span className="h-[6px] w-[6px] rounded-full bg-ink/20" />
        <span className="h-[6px] w-[6px] rounded-full bg-ink/20" />
        <span className="h-[6px] w-[6px] rounded-full bg-ink/20" />
        <span className="mx-auto max-w-[70%] truncate rounded-full bg-ink/[0.06] px-3 py-[3px] text-[9px] lowercase tracking-wide text-ink/60">
          {url ?? 'desidraft.com'}
        </span>
      </div>
      {children}
    </div>
  );
}

/**
 * The client's own mark and positioning, shown as they ship it. The tagline and
 * the paragraph are the brand's words, not a studio rewrite.
 */
function BrandBlock({ brand }: { brand: NonNullable<PortfolioProject['brand']> }) {
  return (
    <div className="grid gap-6 md:grid-cols-12 md:items-center md:gap-8">
      <div className="md:col-span-4 lg:col-span-3">
        <AssetFrame slot={brand.slot} ratio="1 / 1" className="rounded-[8px]" />
      </div>
      <div className="md:col-span-8 lg:col-span-9">
        <p className="serif-i max-w-[26ch] text-[clamp(1.4rem,2.8vw,2.2rem)] leading-[1.08]">{brand.tagline}</p>
        <p className="mt-4 max-w-[64ch] text-[15px] leading-[1.65] text-ink/75">{brand.body}</p>
      </div>
    </div>
  );
}

/**
 * Real captures of the deployed interface, in browser chrome. Each frame is an
 * actual screenshot of the live site, so it is never presented as a mock-up.
 */
function InterfaceShots({ shots }: { shots: MediaSlot[] }) {
  return (
    <div className="grid gap-6 sm:gap-7 md:grid-cols-2">
      {shots.map((slot) => (
        <figure key={slot.slot}>
          <BrowserChrome url={slot.url}>
            <AssetFrame slot={slot} ratio="16 / 10" bare className="rounded-[6px]" />
          </BrowserChrome>
          {slot.caption && (
            <figcaption className="mt-2 text-[10px] uppercase tracking-[0.14em] text-ink/60">{slot.caption}</figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}

function MediaStory({ project }: { project: PortfolioProject }) {
  const g = project.gallery;

  if (project.kind === 'feature') {
    const [lead, ...rest] = g;
    const trio = rest.slice(0, 3);
    const after = rest.slice(3);
    return (
      <div className="space-y-4 sm:space-y-6">
        {lead && (
          <div data-cs-parallax className="overflow-hidden rounded-[8px]">
            <AssetFrame slot={lead} ratio="auto" className="aspect-[16/9]" />
          </div>
        )}
        {trio.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
            {trio.map((slot) => (
              <AssetFrame key={slot.slot} slot={slot} className="rounded-[8px]" />
            ))}
          </div>
        )}
        {after[0] && (
          <div data-cs-parallax className="overflow-hidden rounded-[8px]">
            <AssetFrame slot={after[0]} className="rounded-[8px]" />
          </div>
        )}
        {after.length > 1 && (
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            {after.slice(1).map((slot) => (
              <AssetFrame key={slot.slot} slot={slot} className="rounded-[8px]" />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (project.kind === 'website') {
    const desktop = g[0] ?? project.cover;
    const mobile = g[1];
    return (
      <div className="space-y-6">
        <BrowserChrome>
          <AssetFrame slot={desktop} ratio="16 / 10" className="rounded-[6px]" />
        </BrowserChrome>
        {mobile && (
          <div className="flex flex-wrap items-end gap-6">
            <div className="w-[172px] overflow-hidden rounded-[22px] border-[6px] border-ink bg-ink shadow-[0_18px_36px_rgba(0,0,0,.25)]">
              <AssetFrame slot={mobile} ratio="9 / 18" />
            </div>
            <p className="max-w-[34ch] pb-2 text-[13px] leading-[1.5] text-ink/60">
              The same project, recomposed at 390px: one column, filters that scroll, plates that keep their
              ratio.
            </p>
          </div>
        )}
        <div className="flex flex-wrap gap-2 pt-2">
          {['one index, six disciplines', 'each case study on its own route', 'real screenshots', 'phone-first layout'].map((t) => (
            <span key={t} className="rounded-full border border-ink/20 px-3 py-[6px] text-[11px] text-ink/65">
              {t}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (project.kind === 'video') {
    return (
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-3 sm:items-end sm:gap-5">
          {g.map((slot) => (
            <figure key={slot.slot}>
              <AssetFrame slot={slot} className="rounded-[6px]" />
              <figcaption className="mt-2 flex items-baseline justify-between gap-2 border-t border-ink/15 pt-2 text-[10px] uppercase tracking-[0.14em] text-ink/62">
                <span>{slot.caption}</span>
                <span className="tabular-nums">{slot.ratio.replace(/\s/g, '')}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="max-w-[60ch] text-[13px] leading-[1.55] text-ink/60">
          Each ratio is composed on its own sequence — subject placement and type size are recalculated, not
          cropped from a 16:9 master.
        </p>
      </div>
    );
  }

  // Social, script and identity have their own studies: grid/posts/reels, a
  // three-beat storyboard, and five identity chapters. All three are data-led.
  if (project.kind === 'social') return <SocialStudy project={project} />;
  if (project.kind === 'script') return <ScriptStudy project={project} />;
  return <IdentityStudy project={project} />;
}

export function CaseStudy({ project }: { project: PortfolioProject }) {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const category = categoryOf(project.category);
  const related = relatedProjects(project, 3);
  const next = nextProject(project.slug);
  const film = project.film;

  // Editorial entrance: the cover and each block arrive once, on scroll.
  // Opacity and 22–28px of travel only, and nothing at all under reduced motion.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    // Only what is still below the fold is hidden for its entrance. Anything
    // already on screen — a deep link, a restored scroll position, an anchor
    // jump — is left visible, so a missed ScrollTrigger can never strand a
    // section at opacity 0.
    const fold = window.innerHeight * 0.94;
    const below = (el: Element) => el.getBoundingClientRect().top > fold;

    const ctx = gsap.context(() => {
      const cover = root.querySelector('[data-cs-cover]');
      if (cover && below(cover)) {
        gsap.from(cover, {
          y: 28,
          autoAlpha: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: cover, start: 'top 94%', once: true },
        });
      }
      gsap.utils.toArray<HTMLElement>('[data-cs-section]').forEach((el) => {
        if (!below(el)) return;
        gsap.from(el, {
          y: 22,
          autoAlpha: 0,
          duration: 0.65,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  // Depth on the full-bleed frames only: desktop, motion allowed, three frames
  // at most. The image is scaled up 6% so no edge is ever exposed, and the tween
  // is scrub-driven by ScrollTrigger, so nothing runs while the page is still.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      gsap.utils
        .toArray<HTMLElement>('[data-cs-parallax]', root)
        .slice(0, 3)
        .forEach((frame) => {
          const img = frame.querySelector('img');
          if (!img) return;
          gsap.set(img, { scale: 1.06, transformOrigin: '50% 50%' });
          gsap.fromTo(
            img,
            { yPercent: -2.6 },
            {
              yPercent: 2.6,
              ease: 'none',
              scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
            }
          );
        });
    });
    return () => mm.revert();
  }, [reduced]);

  return (
    <article ref={rootRef} data-theme="botanical" className="bg-cream text-ink">
      <header className="dd-page pt-[104px]">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] lowercase text-ink/62">
          <Link to="/work" className="transition-colors hover:text-ink">
            ← all work
          </Link>
          <span aria-hidden="true">/</span>
          <Link to={`/work?c=${project.category}`} className="transition-colors hover:text-ink">
            {category.label}
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span
            className="rounded-full px-3 py-[6px] text-[10px] uppercase tracking-[0.12em]"
            style={{ background: category.color, color: category.text === 'cream' ? '#EEEAE3' : '#0A0A0A' }}
          >
            {category.label}
          </span>
          <StatusChip status={project.status} />
          <span className="rounded-full border border-ink/20 px-3 py-[6px] text-[10px] uppercase tracking-[0.12em] text-ink/62">
            {project.client}
          </span>
          {project.live && (
            <LiveLink
              live={project.live}
              className="rounded-full bg-ink px-3 py-[6px] text-[10px] uppercase tracking-[0.12em] text-cream transition-transform duration-300 hover:-translate-y-[1px]"
            />
          )}
        </div>

        <h1 className="display mt-5 max-w-[18ch] text-[clamp(2.4rem,7.2vw,6.4rem)] leading-[0.9]">
          {project.title}
        </h1>
        {project.titleAside && (
          <p className="serif-i mt-2 max-w-[26ch] text-[clamp(1.45rem,3.2vw,2.5rem)] leading-[1.04] text-ink/75">
            {project.titleAside}
          </p>
        )}
        <p className="mt-6 max-w-[62ch] text-[clamp(1.02rem,1.6vw,1.3rem)] leading-[1.45] text-ink/75">
          {project.intro}
        </p>
      </header>

      {film ? (
        <div data-cs-cover data-film-stage className="mx-auto mt-10 w-full max-w-[1400px] px-3 sm:px-[var(--dd-gutter)]">
          <FilmStage film={film} />
        </div>
      ) : (
      <div data-cs-cover className="mx-auto mt-10 w-full max-w-[1500px] px-3">
        <AssetFrame
          slot={project.cover}
          eager
          ratio="auto"
          className={`rounded-[10px] ${
            project.kind === 'feature'
              ? project.coverFit === 'interface'
                ? 'aspect-[4/5] sm:aspect-[16/10]'
                : 'aspect-[4/5] sm:aspect-[3/1]'
              : project.kind === 'website'
                ? 'aspect-[16/10]'
                : project.kind === 'video'
                  ? 'mx-auto aspect-[9/16] w-full max-w-[420px]'
                  : project.kind === 'social'
                    ? 'aspect-[4/5]'
                    : 'aspect-[16/9]'
          }`}
        />
      </div>
      )}

      <div className="dd-page">
        <dl className="mt-8 grid gap-x-8 gap-y-5 border-t border-ink/15 pt-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-[10px] uppercase tracking-[0.18em] text-ink/60">client</dt>
            <dd className="mt-1 text-[14.5px] leading-[1.4]">{project.client}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-[0.18em] text-ink/60">our role</dt>
            <dd className="mt-1 text-[14.5px] leading-[1.4]">{project.role.join(', ')}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-[0.18em] text-ink/60">services</dt>
            <dd className="mt-1 text-[14.5px] leading-[1.4]">{project.services.join(', ')}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-[0.18em] text-ink/60">stage</dt>
            <dd className="mt-1 text-[14.5px] leading-[1.4]">{project.phase ?? project.status}</dd>
          </div>
        </dl>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Section label="the challenge">
              <p className="max-w-[58ch] text-[clamp(1.15rem,2.2vw,1.7rem)] leading-[1.35]">{project.challenge}</p>
            </Section>
            <Section label="our approach">
              <p className="max-w-[62ch] text-[15.5px] leading-[1.65] text-ink/80">{project.approach}</p>
            </Section>
          </div>

          <aside className="lg:col-span-5 lg:pl-8">
            <Section label="deliverables">
              <ul className="space-y-2.5">
                {project.deliverables.map((d) => (
                  <li key={d} className="flex gap-2.5 text-[14px] leading-[1.45] text-ink/80">
                    <span aria-hidden="true" className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full bg-ink/35" />
                    {d}
                  </li>
                ))}
              </ul>
            </Section>
            <Section label="facts">
              <dl className="space-y-3">
                {project.facts.map((f) => (
                  <div key={f.label} className="grid grid-cols-[84px_1fr] gap-3 border-b border-ink/10 pb-3">
                    <dt className="text-[10px] uppercase leading-[1.4] tracking-[0.14em] text-ink/60">{f.label}</dt>
                    <dd className="text-[13px] leading-[1.45]">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </Section>
          </aside>
        </div>

        {film && (
          <>
            <Section label="the formats">
              <FormatStrip formats={film.formats} />
            </Section>
            <Section label="the storyboard">
              <Storyboard chapters={film.chapters} />
            </Section>
            <Section label="the edit, broken down">
              <EditBreakdown film={film} />
            </Section>
          </>
        )}

        {project.brand && (
          <Section label="the brand" className="mt-2">
            <BrandBlock brand={project.brand} />
          </Section>
        )}

        {!film && (
          <Section label="the work">
            <MediaStory project={project} />
          </Section>
        )}

        {project.materials && project.materials.length > 0 && (
          <Section label="the making">
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
              {project.materials.map((slot) => (
                <AssetFrame key={slot.slot} slot={slot} className="rounded-[8px]" />
              ))}
            </div>
          </Section>
        )}

        {project.interfaceShots && project.interfaceShots.length > 0 && (
          <Section label="the interface">
            <InterfaceShots shots={project.interfaceShots} />
          </Section>
        )}

        {project.packaging && project.packaging.length > 0 && (
          <Section label="the packaging">
            <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
              {project.packaging.map((slot) => (
                <AssetFrame key={slot.slot} slot={slot} className="rounded-[8px]" />
              ))}
            </div>
          </Section>
        )}

        {project.phoneShot && (
          <Section label="on a phone">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-9">
              <div className="w-[184px] shrink-0 overflow-hidden rounded-[24px] border-[6px] border-ink bg-ink shadow-[0_18px_36px_rgba(0,0,0,.22)]">
                <AssetFrame slot={project.phoneShot} ratio="390 / 844" />
              </div>
              <div className="max-w-[46ch] pb-1">
                <p className="display text-[clamp(1.3rem,2.4vw,1.9rem)] leading-[1.02]">
                  one column, thumb-sized controls, nothing cropped.
                </p>
                <p className="mt-3 text-[14px] leading-[1.6] text-ink/70">
                  The home page, shop and product page are composed at 390px first: the product photograph keeps
                  its 3:4 frame, the buying panel stacks under it, and the custom-gift steps become a single
                  column with the live preview pinned beneath.
                </p>
                {project.live && (
                  <LiveLink
                    live={project.live}
                    className="btn btn-secondary mt-5 text-[14px] uppercase tracking-[0.08em]"
                  />
                )}
              </div>
            </div>
          </Section>
        )}

        {!film && (
        <Section label="how it was made">
          <ol className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
            {project.process.map((step, i) => (
              <li key={step.title} className="border-t border-ink/15 pt-4">
                <span className="text-[10px] tabular-nums tracking-[0.16em] text-ink/60">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className="display mt-2 text-[clamp(1.25rem,2vw,1.7rem)]">{step.title}</h2>
                <p className="mt-2 max-w-[46ch] text-[16px] leading-[1.55] text-ink/70">{step.body}</p>
              </li>
            ))}
          </ol>
        </Section>
        )}

        {/* Chapter 06 only exists where a result can be shown honestly: the live
            address, or the deck we can walk a client through. */}
        <Chapter no="06" name="the result" className="mt-12 mb-3" />
        <div className="mb-12 flex flex-col items-start justify-between gap-6 rounded-[12px] bg-ink p-7 text-cream sm:flex-row sm:items-end sm:p-9">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-cream/50">
              {project.live ? 'live now' : project.status === 'in progress' ? 'on site now' : 'currently in the studio'}
            </p>
            <p className="display mt-3 max-w-[22ch] text-[clamp(1.5rem,3vw,2.4rem)] leading-[1.02]">
              {project.live ? 'the shop is open.' : 'want the full deck for this one?'}
            </p>
            <p className="mt-2 max-w-[46ch] text-[15px] leading-[1.5] text-cream/65">
              {project.live
                ? 'Everything in this case study is running at the address below — the catalogue, the product pages and the custom-gift studio.'
                : 'We can walk you through the drawings, the frames and what is still open.'}
            </p>
          </div>
          {project.live ? (
            <LiveLink
              live={project.live}
              className="btn btn-cream text-[15px] uppercase tracking-[0.08em]"
            />
          ) : (
            <EnquiryButton
              subject={`Project enquiry — ${project.title}`}
              className="btn btn-cream text-[15px] uppercase tracking-[0.08em]"
            >
              start a conversation
            </EnquiryButton>
          )}
        </div>

        {related.length > 0 && (
          <Section label="more from the studio">
            <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Link key={p.id} to={`/work/${p.slug}`} className="group block">
                  <div className="overflow-hidden rounded-[8px]">
                    <AssetFrame slot={{ ...p.cover, ratio: '4 / 3' }} ratio="4 / 3" />
                  </div>
                  <div className="mt-3 flex items-baseline justify-between gap-3">
                    <h3 className="display text-[clamp(1.1rem,1.8vw,1.4rem)]">{p.title}</h3>
                    <span className="text-[10px] uppercase tracking-[0.14em] text-ink/60">
                      {categoryOf(p.category).short}
                    </span>
                  </div>
                  <p className="mt-1 text-[12.5px] leading-[1.45] text-ink/60">{p.standfirst}</p>
                </Link>
              ))}
            </div>
          </Section>
        )}

        <div className="flex flex-col items-start justify-between gap-5 border-t border-ink/15 py-10 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-ink/60">next project</p>
            <Link to={`/work/${next.slug}`} className="display mt-1 inline-block text-[clamp(1.4rem,2.8vw,2.2rem)]">
              {next.title} →
            </Link>
          </div>
          <Link to="/work" className="text-[12px] lowercase text-ink/60 transition-colors hover:text-ink">
            all our work →
          </Link>
        </div>
      </div>
    </article>
  );
}
