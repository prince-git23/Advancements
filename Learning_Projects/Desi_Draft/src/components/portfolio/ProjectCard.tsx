import { useEffect, useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { PortfolioProject } from '../../data/portfolio';
import { categoryOf } from '../../data/portfolio';
import { usePrefersReducedMotion } from '../../lib/hooks';
import { AssetFrame } from './AssetFrame';

/**
 * Gentle card tilt. Pointer-fine only, ±4°, written straight to style on a
 * single rAF — no React re-render per pointer move, no transform left behind on
 * leave, and nothing at all for touch or reduced motion.
 *
 * `will-change` is applied on pointerenter and dropped once the return
 * transition has finished, so a card is only promoted to its own compositor
 * layer while a mouse is actually over it — never at rest, never on touch.
 */
function Tilt({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const next = useRef({ x: 0, y: 0 });
  const release = useRef(0);
  const reduced = usePrefersReducedMotion();

  useEffect(
    () => () => {
      cancelAnimationFrame(frame.current);
      window.clearTimeout(release.current);
    },
    []
  );

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    el.style.transform = '';
    // Keep the layer for the length of the return transition, then give it back.
    window.clearTimeout(release.current);
    release.current = window.setTimeout(() => {
      el.style.willChange = '';
    }, 500);
  };

  const onEnter = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || reduced || event.pointerType !== 'mouse') return;
    window.clearTimeout(release.current);
    el.style.willChange = 'transform';
  };

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || reduced || event.pointerType !== 'mouse') return;
    const rect = el.getBoundingClientRect();
    next.current = {
      x: (event.clientX - rect.left) / rect.width - 0.5,
      y: (event.clientY - rect.top) / rect.height - 0.5,
    };
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const { x, y } = next.current;
      el.style.transform = `perspective(1100px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 4).toFixed(
        2
      )}deg) translateY(-3px)`;
    });
  };

  return (
    <div
      ref={ref}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={`transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${className}`}
    >
      {children}
    </div>
  );
}

export type CardLayout = 'full' | 'seven' | 'five' | 'six' | 'row';

export const LAYOUT_SPAN: Record<CardLayout, string> = {
  full: 'lg:col-span-12',
  seven: 'lg:col-span-7',
  five: 'lg:col-span-5',
  six: 'lg:col-span-6',
  row: 'lg:col-span-12',
};

/** The grid is composed by position, so filtering can never leave a hole. */
const SEQUENCE: CardLayout[] = ['full', 'seven', 'five', 'six', 'six', 'full'];
export const layoutFor = (index: number): CardLayout => SEQUENCE[index % SEQUENCE.length];

/**
 * Filtered views still have to look composed: a lone project sits in a
 * horizontal split rather than a full-width cell with a small card in it.
 */
export const planLayouts = (total: number): CardLayout[] => {
  if (total === 1) return ['row'];
  if (total === 2) return ['six', 'six'];
  if (total === 4) return ['seven', 'five', 'six', 'six'];
  return Array.from({ length: total }, (_, i) => layoutFor(i));
};

const STATUS_CLASS: Record<string, string> = {
  'in progress': 'bg-tangerine text-cream',
  'in development': 'bg-lilac text-ink',
  ongoing: 'bg-lime text-ink',
  live: 'bg-forest text-white',
  studio: 'bg-ink text-cream',
};

export function StatusChip({
  status,
  className = '',
  size = 'sm',
}: {
  status: string;
  className?: string;
  /** 'md' is for the home showcase, where labels read at 12–14px. */
  size?: 'sm' | 'md';
}) {
  const live = status === 'in progress';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full uppercase leading-none tracking-[0.12em] ${
        size === 'md' ? 'px-3 py-[6px] text-[12px]' : 'px-2.5 py-[5px] text-[10px]'
      } ${STATUS_CLASS[status] ?? 'bg-ink/10 text-ink'} ${className}`}
    >
      {live && <span aria-hidden="true" className="h-[5px] w-[5px] rounded-full bg-current opacity-80" />}
      {status}
    </span>
  );
}

const Arrow = ({ className = '' }: { className?: string }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    className={`transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 ${className}`}
  >
    <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function BrowserMockup({ project }: { project: PortfolioProject }) {
  const mobile = project.gallery[0];
  return (
    <div className="relative transition-transform duration-[700ms] ease-out group-hover:-translate-y-1">
      <div className="overflow-hidden rounded-[12px] border border-ink/15 bg-[#F7F4EE] p-[6px] shadow-[0_20px_46px_rgba(0,0,0,.13)]">
        <div className="flex items-center gap-1.5 px-2 pb-[7px] pt-[3px]">
          <span className="h-[6px] w-[6px] rounded-full bg-ink/20" />
          <span className="h-[6px] w-[6px] rounded-full bg-ink/20" />
          <span className="h-[6px] w-[6px] rounded-full bg-ink/20" />
          <span className="mx-auto rounded-full bg-ink/[0.06] px-3 py-[3px] text-[9px] lowercase tracking-wide text-ink/60">
            desidraft.com
          </span>
        </div>
        <AssetFrame slot={project.cover} ratio="16 / 10" className="rounded-[6px]" />
      </div>
      {mobile && (
        <div className="absolute -bottom-8 right-4 hidden w-[24%] max-w-[120px] overflow-hidden rounded-[14px] border-[4px] border-ink bg-ink shadow-[0_16px_30px_rgba(0,0,0,.3)] sm:block">
          <AssetFrame slot={mobile} ratio="9 / 18" />
        </div>
      )}
    </div>
  );
}

function ScriptBlock({ project }: { project: PortfolioProject }) {
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden border-y border-ink/15 bg-[#E4FBA8] p-6 sm:p-7">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-ink/62">
        <span>beat sheet</span>
        <span>{project.facts[0]?.value ?? ''}</span>
      </div>
      <div className="my-6 grid grid-cols-3 gap-3">
        {[
          { k: 'hook', v: '0–3s' },
          { k: 'turn', v: '~15s' },
          { k: 'payoff', v: 'last 4s' },
        ].map((b) => (
          <div key={b.k}>
            <p className="display text-[clamp(1.1rem,2vw,1.6rem)] leading-none">{b.k}</p>
            <p className="mt-1 text-[11px] tabular-nums text-ink/60">{b.v}</p>
          </div>
        ))}
      </div>
      <div>
        <p className="serif-i text-[clamp(1.35rem,2.3vw,1.9rem)] leading-[1.08]">write the frame, not the line.</p>
        <p className="mt-3 max-w-[34ch] text-[13.5px] leading-[1.5] text-ink/65">{project.standfirst}</p>
      </div>
    </div>
  );
}

export function ProjectCard({
  project,
  index,
  layout = 'full',
  eager = false,
}: {
  project: PortfolioProject;
  index: number;
  layout?: CardLayout;
  eager?: boolean;
}) {
  const category = categoryOf(project.category);
  const large = layout === 'full';
  // The one full-width feature gets a split: plate beside the reading column,
  // instead of a giant empty field with the title pushed below the fold.
  const split = project.kind === 'feature' && large;
  const row = layout === 'row';
  const horizontal = split || row;
  const titleSize = row
    ? 'text-[clamp(1.7rem,3.4vw,2.8rem)]'
    : large
      ? 'text-[clamp(1.9rem,4.4vw,3.6rem)]'
      : 'text-[clamp(1.5rem,2.6vw,2.2rem)]';

  return (
    <article data-card className={LAYOUT_SPAN[layout]}>
      <Link
        to={`/work/${project.slug}`}
        aria-label={`${project.title} — ${category.label} case study`}
        className={`group h-full rounded-[14px] outline-offset-[6px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink ${
          horizontal ? 'grid gap-6 lg:grid-cols-12 lg:items-center' : 'flex flex-col'
        }`}
      >
        <Tilt className={split ? 'relative lg:col-span-8' : row ? 'relative lg:col-span-6' : 'relative'}>
          {project.kind === 'website' && <BrowserMockup project={project} />}

          {project.kind === 'video' && (
            <div className="relative mx-auto w-full max-w-[330px]">
              <AssetFrame slot={project.cover} eager={eager} />
              {/* Only a real film gets a play control. An empty frame does not. */}
              {/\.(mp4|webm|mov)$/i.test(project.cover.src ?? '') && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-cream/90 text-ink shadow-[0_8px_24px_rgba(0,0,0,.25)] transition-transform duration-300 group-hover:scale-105"
                >
                  <svg width="14" height="14" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M3 1l8 5-8 5z" />
                  </svg>
                </span>
              )}
            </div>
          )}

          {/* the month plan itself, not a live wireframe of empty tiles */}
          {project.kind === 'social' && (
            <div className="overflow-hidden rounded-[10px]">
              <AssetFrame slot={project.cover} ratio="4 / 5" eager={eager} />
            </div>
          )}

          {project.kind === 'brand' && (
            <AssetFrame slot={project.cover} ratio={large ? '16 / 7' : '16 / 9'} eager={eager} />
          )}

          {project.kind === 'script' && (
            <div className="min-h-[260px]">
              <ScriptBlock project={project} />
            </div>
          )}

          {project.kind === 'feature' && (
            <div className="relative overflow-hidden rounded-[10px]">
              <AssetFrame
                slot={project.cover}
                ratio="auto"
                className={
                  split
                    ? 'aspect-[4/3] sm:aspect-[16/9]'
                    : large
                      ? 'aspect-[4/3] sm:aspect-[21/9]'
                      : 'aspect-[4/3] sm:aspect-[16/10]'
                }
                eager={eager}
              />
            </div>
          )}
        </Tilt>

        <div
          className={`flex flex-1 flex-col ${project.kind === 'website' ? 'mt-12 sm:mt-10' : 'mt-5'} ${
            split ? 'lg:col-span-4 lg:mt-0 lg:pb-1' : row ? 'lg:col-span-5 lg:col-start-8 lg:mt-0' : ''
          }`}
        >
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-ink/60">
            <span className="tabular-nums">{String(index + 1).padStart(2, '0')}</span>
            <span aria-hidden="true" className="h-px w-5 bg-ink/20" />
            <span>{category.label}</span>
            <StatusChip status={project.status} className="ml-auto" />
          </div>

          <div className="mt-3 flex items-start justify-between gap-6">
            <div className="min-w-0">
              <h3 className={`display ${titleSize} leading-[0.98]`}>{project.title}</h3>
              <p
                className={`mt-2 text-ink/70 ${
                  large ? 'max-w-[54ch] text-[17px] leading-[1.5]' : 'max-w-[42ch] text-[15.5px] leading-[1.45]'
                }`}
              >
                {project.standfirst}
              </p>
            </div>
            <span className="mt-1 shrink-0 text-ink/62 transition-colors group-hover:text-ink">
              <Arrow />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
