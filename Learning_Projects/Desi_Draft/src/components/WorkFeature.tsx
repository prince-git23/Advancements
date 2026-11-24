import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { usePrefersReducedMotion } from '../lib/hooks';
import { categoryOf, portfolio, type PortfolioProject } from '../data/portfolio';
import { StatusChip } from './portfolio/ProjectCard';
import ScrollStack, { ScrollStackItem } from './ui/ScrollStack';
import { Chapter } from './ui/Chapter';
import { Logo } from './art/Logo';
import './WorkStack.css';

/**
 * Selected work — five featured projects as a window-level scroll stack.
 *
 * The stack is the ReactBits ScrollStack (see ui/ScrollStack.tsx) driven by
 * window scroll so Lenis stays the only scroll controller. Phones run the same
 * stack with a shorter card (`calc(100svh - 150px)`) so a pinned card always
 * fits the screen; tablet (640–1023px) and reduced motion fall back to a plain
 * vertical list with identical content and native scrolling.
 *
 * Media is the work itself: the live Flora Alchemy storefront (recording +
 * capture), the real 9:16 film, the twelve-post system, the three storyboard
 * frames, and the studio's own identity assets. No filler imagery.
 */

const PALETTE = ['#2E7D5B', '#E8603C', '#8499F8', '#E8B4F5', '#E4FBA8'];

const FEATURED = ['flora', 'cut', 'feed', 'scripts', 'identity'];

/** One sentence per card, 8–16 words, drawn from the project's real content. */
const LINES: Record<string, string> = {
  flora: 'The live storefront: three keepsakes, a custom-gift studio and a gift finder.',
  cut: 'An 18.5-second vertical film that still reads with the sound off.',
  feed: 'A monthly system of twelve posts, four reels and one grid.',
  scripts: 'Three-beat scripts — hook, turn, payoff — timed to the frame.',
  identity: 'The studio’s wordmark, five colours, four typefaces and sixteen stickers.',
};

const PROOF: Record<string, string> = {
  flora: 'live site · 1440 & 390',
  cut: '9:16 · 18.5 s',
  feed: '12 posts · 4 reels',
  scripts: '3 beats · 3 frames',
  identity: 'wordmark · 16 stickers',
};

const Arrow = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Badge = ({ children }: { children: ReactNode }) => (
  <span className="sw-badge">{children}</span>
);

/**
 * Muted looping preview. Plays only while its card is the front of the stack;
 * a visible button keeps playback available without hover and under reduced
 * motion. The poster is always painted first.
 */
function LoopVideo({
  src,
  poster,
  active,
  label,
  autoPlay = true,
  className = '',
}: {
  src: string;
  poster: string;
  active: boolean;
  label: string;
  autoPlay?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [manual, setManual] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (active && autoPlay && !manual) {
      void el.play().then(() => setPlaying(true)).catch(() => {});
    } else if (!active) {
      el.pause();
      setPlaying(false);
      setManual(false);
    }
  }, [active, autoPlay, manual]);

  useEffect(() => {
    const el = ref.current;
    return () => el?.pause();
  }, []);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      setManual(true);
      void el.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  return (
    <div className={`sw-film ${className}`.trim()}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        className="sw-film__video"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button type="button" className="sw-film__btn" onClick={toggle} aria-label={playing ? `Pause ${label}` : `Play ${label}`}>
        {playing ? (
          <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
            <rect x="2" y="1" width="3" height="10" />
            <rect x="7" y="1" width="3" height="10" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
            <path d="M3 1l8 5-8 5z" />
          </svg>
        )}
      </button>
    </div>
  );
}

function FloraMedia({ project, active }: { project: PortfolioProject; active: boolean }) {
  return (
    <>
      <div className="sw-flora">
        <div className="sw-flora__screen">
          <LoopVideo
            src="/videos/flora-alchemy-scroll.mp4"
            poster="/images/portfolio/flora-alchemy/site-home-1440.webp"
            active={active}
            autoPlay={false}
            label="the Flora Alchemy storefront recording"
          />
        </div>
        <Badge>live storefront · screen recording</Badge>
      </div>
      {/* One phone capture: a corner inset on desktop, the whole frame on a
          phone. A 1440 capture cropped to 390px is unreadable. */}
      <img
        className="sw-flora-shot"
        src="/images/portfolio/flora-alchemy/site-home-mobile-390.webp"
        alt="The Flora Alchemy home page on a phone: wordmark, headline and the sunflower posy."
        loading="lazy"
        decoding="async"
        width={390}
        height={844}
      />
    </>
  );
}

function CutMedia({ project, active }: { project: PortfolioProject; active: boolean }) {
  if (!project.film) return null;
  return (
    <div className="sw-cut">
      <div className="sw-cut__film">
        <img className="sw-film__bg" src={project.film.poster} alt="" aria-hidden="true" />
        <LoopVideo
          src={project.film.src}
          poster={project.film.poster}
          active={active}
          label="the Cut to the Beat film"
          className="sw-film--contain"
        />
        <span className="sw-film-meta">9:16 · {project.film.duration}</span>
      </div>
      <ol className="sw-cut__beats" aria-label="Three frames and beats from the film">
        {project.film.chapters.slice(1, 4).map((chapter) => (
          <li key={chapter.time}>
            <img src={chapter.still.src} alt={chapter.still.alt} loading="lazy" decoding="async" />
            <span className="sw-cut__beat">
              <span className="sw-cut__time">{chapter.time}</span>
              <span className="sw-cut__title">{chapter.title}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function FeedMedia({ project }: { project: PortfolioProject }) {
  const grid = project.social?.grid ?? [];
  return (
    <>
      <ul className="sw-feed" aria-label="The twelve-post monthly grid: nine photographs and three typographic posts">
        {grid.slice(0, 12).map((tile, i) => (
          <li key={`${tile.format}-${i}`} style={{ background: tile.color }} data-kind={tile.src ? 'photo' : 'type'}>
            {tile.src ? <img src={tile.src} alt="" loading="lazy" decoding="async" /> : null}
            <span className="sw-post" aria-hidden="true">
              <span className="sw-post__kicker">
                {tile.format} · {tile.pillar}
              </span>
              <span className="sw-post__line">{tile.line ?? tile.pillar}</span>
              <span className="sw-post__mark">desi draft</span>
            </span>
          </li>
        ))}
      </ul>
      <Badge>concept system · twelve posts</Badge>
    </>
  );
}

function ScriptMedia({ project }: { project: PortfolioProject }) {
  const frames = project.scriptStudy?.frames.slice(0, 3) ?? [];
  return (
    <>
      <div className="sw-frames">
        {frames.map((frame) => (
          <figure key={frame.beat}>
            <img src={frame.slot.src} alt={frame.slot.alt} loading="lazy" decoding="async" width={752} height={1392} />
            <figcaption>
              <span className="sw-frame__beat">{frame.beat}</span>
              <span className="sw-frame__time">{frame.time}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <Badge>storyboard · hook / turn / payoff</Badge>
    </>
  );
}

function IdentityMedia({ project }: { project: PortfolioProject }) {
  const stickers = project.gallery[1];
  return (
    <>
      <div className="sw-board">
        <div className="sw-board__mark">
          <Logo className="w-full" color="currentColor" strokeWidth={2} />
          <ul className="sw-board__palette" aria-label="The five identity colours">
            {PALETTE.map((hex) => (
              <li key={hex} style={{ background: hex }} aria-hidden="true" />
            ))}
          </ul>
          <p className="sw-board__type">Archivo · Instrument Serif · DM Sans · Yellowtail</p>
        </div>
        <div className="sw-board__body">
          {stickers?.src && (
            <img
              className="sw-board__stickers"
              src={stickers.src}
              alt={stickers.alt}
              loading="lazy"
              decoding="async"
            />
          )}
          <img
            className="sw-board__site"
            src="/work/desi-draft-work.jpg"
            alt="The Desi Draft work index, using the identity in production."
            loading="lazy"
            decoding="async"
            width={1440}
            height={900}
          />
        </div>
      </div>
      <Badge>identity board · real assets</Badge>
    </>
  );
}

function Media({ project, active }: { project: PortfolioProject; active: boolean }) {
  switch (project.id) {
    case 'flora':
      return <FloraMedia project={project} active={active} />;
    case 'cut':
      return <CutMedia project={project} active={active} />;
    case 'feed':
      return <FeedMedia project={project} />;
    case 'scripts':
      return <ScriptMedia project={project} />;
    case 'identity':
      return <IdentityMedia project={project} />;
    default:
      return null;
  }
}

function ProjectCard({
  project,
  index,
  active,
  staticMode,
}: {
  project: PortfolioProject;
  index: number;
  active: boolean;
  staticMode: boolean;
}) {
  const category = categoryOf(project.category);
  return (
    <article className={`sw-card ${staticMode ? 'sw-card--static' : ''}`.trim()} data-active={active ? 'true' : 'false'}>
      <div className="sw-media">
        <Media project={project} active={active} />
      </div>
      <div className="sw-body">
        <div className="sw-meta">
          <p className="sw-eyebrow">
            <span className="tabular-nums">{String(index).padStart(2, '0')}</span>
            <span aria-hidden="true" className="sw-rule" />
            <span>{category.label}</span>
          </p>
          <StatusChip status={project.status} size="md" />
        </div>
        <h3 className="display sw-title">{project.title}</h3>
        <p className="sw-line">{LINES[project.id]}</p>
        <ul className="sw-details" aria-label="Deliverables">
          {project.deliverables.slice(0, 3).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="sw-foot">
          <Link
            to={`/work/${project.slug}`}
            aria-label={`${project.title} — ${category.label} case study`}
            className="btn btn-secondary sw-cta"
          >
            explore project
            <span className="btn-arrow" aria-hidden="true">
              →
            </span>
          </Link>
          <span className="sw-proof">{PROOF[project.id]}</span>
        </div>
      </div>
    </article>
  );
}

const FEATURED_PROJECTS = FEATURED.map((id) => portfolio.find((p) => p.id === id)).filter(
  (p): p is PortfolioProject => Boolean(p)
);

type StackMode = 'desktop' | 'phone' | 'list';

/** Desktop and phone stack; tablet keeps the plain list. */
function useStackMode(): StackMode {
  const read = (): StackMode => {
    if (typeof window === 'undefined') return 'desktop';
    if (window.innerWidth >= 1024) return 'desktop';
    if (window.innerWidth <= 639) return 'phone';
    return 'list';
  };
  const [mode, setMode] = useState(read);
  useEffect(() => {
    const onChange = () => setMode(read());
    window.addEventListener('resize', onChange);
    return () => window.removeEventListener('resize', onChange);
  }, []);
  return mode;
}

/** Front-of-stack detection, measured once per scroll frame. */
function useActiveCard(enabled: boolean, count: number) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (!enabled) return undefined;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const cards = Array.from(document.querySelectorAll<HTMLElement>('#work .sw-card'));
      const line = window.innerHeight * 0.14 + 72;
      let current = 0;
      cards.forEach((card, i) => {
        if (card.getBoundingClientRect().top <= line) current = i;
      });
      setActive(Math.min(current, count - 1));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    measure();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [enabled, count]);
  return active;
}

export function WorkFeature() {
  const mode = useStackMode();
  const reduced = usePrefersReducedMotion();
  const phone = mode === 'phone';
  const stack = mode !== 'list' && !reduced;
  const active = useActiveCard(stack, FEATURED_PROJECTS.length);

  const cards = (
    <div className={stack ? undefined : 'sw-list'}>
      {FEATURED_PROJECTS.map((project, i) => (
        <ProjectCard
          key={project.id}
          project={project}
          index={i + 1}
          active={stack ? i === active : false}
          staticMode={!stack}
        />
      ))}
    </div>
  );

  return (
    <section
      id="work"
      data-theme="botanical"
      className="sw-section scroll-mt-[110px] bg-cream"
    >
      <div className="sw-shell">
        <Chapter no="04" name="the work" className="mb-4" />
        <div className="sw-head">
          <h2 className="display type-section">
            selected <span className="serif-i">work,</span> still being made
          </h2>
          <div className="sw-head__aside">
            <p>Five projects, shown at the size the work deserves.</p>
            <Link to="/work" className="btn btn-primary">
              all work
              <span className="btn-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="sw-shell sw-stack-wrap">
        {stack ? (
          <ScrollStack
            useWindowScroll
            smoothScroll={false}
            /* On a phone the cards are one screen tall, so they sit closer
               together, pin lower and barely scale: five tips of stacked
               paper rather than a deep deck. */
            itemDistance={phone ? 24 : 90}
            itemStackDistance={phone ? 8 : 24}
            stackPosition={phone ? '10%' : '14%'}
            itemScale={phone ? 0.015 : 0.025}
            baseScale={phone ? 0.97 : 0.93}
            dimAmount={phone ? 0.3 : 0.38}
            blurAmount={0}
            tiltAmount={phone ? 0 : 1}
            rotationAmount={0}
            holdDistance={phone ? 60 : 120}
            snap={false}
          >
            {FEATURED_PROJECTS.map((project, i) => (
              <ScrollStackItem key={project.id} itemClassName="sw-stack-card">
                <ProjectCard project={project} index={i + 1} active={i === active} staticMode={false} />
              </ScrollStackItem>
            ))}
          </ScrollStack>
        ) : (
          cards
        )}
      </div>

      <div className="sw-shell sw-tail">
        <p>Every project here is either live or being built in the studio right now.</p>
        <Link to="/work" className="btn btn-secondary">
          see all work
          <span className="btn-arrow" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
