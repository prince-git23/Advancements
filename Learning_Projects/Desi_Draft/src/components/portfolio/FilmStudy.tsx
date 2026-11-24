import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { gsap } from '../../lib/smooth';
import { usePrefersReducedMotion } from '../../lib/hooks';
import type { FilmChapter, FilmSlot, FilmStudy } from '../../data/cutToBeat';
import { AssetFrame } from './AssetFrame';

/**
 * The film study: the video itself, the three format sheets that document it,
 * and the storyboard read off the footage.
 *
 * Only one film element exists on the page. The storyboard's "watch this beat"
 * seeks that element instead of mounting a second player.
 */
export const filmVideo = { current: null as HTMLVideoElement | null };

const pad = (s: number) => `0:${String(Math.floor(s)).padStart(2, '0')}`;

const Icon = {
  play: (
    <svg width="13" height="13" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
      <path d="M3 1l8 5-8 5z" />
    </svg>
  ),
  pause: (
    <svg width="13" height="13" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
      <rect x="2" y="1" width="3" height="10" />
      <rect x="7" y="1" width="3" height="10" />
    </svg>
  ),
  soundOff: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" stroke="none" />
      <path d="M17 9l4 6M21 9l-4 6" />
    </svg>
  ),
  soundOn: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" stroke="none" />
      <path d="M16 8a6 6 0 0 1 0 8M19 5a10 10 0 0 1 0 14" />
    </svg>
  ),
};

/** The master's own audio, 96 RMS windows, drawn mirrored around a centre line. */
export function Wave({
  peaks,
  color = '#E4FBA8',
  stroke = 1,
  className = '',
  animate = true,
}: {
  peaks: number[];
  color?: string;
  stroke?: number;
  className?: string;
  animate?: boolean;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const svg = ref.current;
    if (!svg || !animate || reduced) return;
    const bars = svg.querySelectorAll('[data-bar]');
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bars,
        { scaleY: 0.06 },
        {
          scaleY: 1,
          duration: 0.9,
          ease: 'power2.out',
          stagger: 0.006,
          transformOrigin: '50% 50%',
          scrollTrigger: { trigger: svg, start: 'top 92%', once: true },
        }
      );
    }, svg);
    return () => ctx.revert();
  }, [animate, reduced]);

  return (
    <svg ref={ref} viewBox="0 0 960 120" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path d="M0 60h960" stroke={color} strokeWidth={stroke} opacity={0.28} />
      {peaks.map((p, i) => {
        const h = Math.max(2.5, p * 108);
        return (
          <rect
            key={i}
            data-bar
            x={i * 10 + 1.6}
            y={60 - h / 2}
            width={6}
            height={h}
            rx={1.4}
            fill={color}
            opacity={0.86}
          />
        );
      })}
    </svg>
  );
}

function FilmPlayer({ film }: { film: FilmStudy }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const reduced = usePrefersReducedMotion();
  const [paused, setPaused] = useState(true);
  const [muted, setMuted] = useState(true);
  const [t, setT] = useState(0);

  // Autoplay muted; reduced motion keeps the poster and never fetches the file.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    filmVideo.current = v;
    if (reduced) return;
    const p = v.play();
    if (p) p.catch(() => setPaused(true));
  }, [reduced]);

  // One state source: the element's own events drive every control.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const sync = () => setPaused(v.paused);
    const tick = () => setT(v.currentTime);
    const resume = () => {
      if (userPaused.current || reduced || document.visibilityState === 'hidden') return;
      const p = v.play();
      if (p) p.catch(() => setPaused(true));
    };
    const suspend = () => {
      if (!v.paused) v.pause();
    };
    const onVis = () => (document.visibilityState === 'hidden' ? suspend() : resume());

    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? resume() : suspend()), { threshold: 0 });
    io.observe(v);

    v.addEventListener('play', sync);
    v.addEventListener('pause', sync);
    v.addEventListener('timeupdate', tick);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      io.disconnect();
      v.removeEventListener('play', sync);
      v.removeEventListener('pause', sync);
      v.removeEventListener('timeupdate', tick);
      document.removeEventListener('visibilitychange', onVis);
      if (filmVideo.current === v) filmVideo.current = null;
    };
  }, [reduced]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      const p = v.play();
      if (p) p.catch(() => setPaused(true));
    } else {
      userPaused.current = true;
      v.pause();
    }
  };

  return (
    <div className="mx-auto w-full max-w-[364px]">
      <div className="relative overflow-hidden rounded-[6px] bg-ink ring-1 ring-cream/15">
        <video
          ref={videoRef}
          src={film.src}
          poster={film.poster}
          width={film.width}
          height={film.height}
          muted={muted}
          loop
          playsInline
          preload={reduced ? 'none' : 'metadata'}
          aria-label="Cut to the Beat — 18.5 second vertical film"
          className="block h-auto w-full object-contain"
          style={{ aspectRatio: '9 / 16' }}
          onClick={toggle}
        />
        {paused && (
          <button
            type="button"
            onClick={toggle}
            aria-label="Play Cut to the Beat"
            className="absolute inset-0 grid place-items-center bg-ink/25 text-cream transition-colors hover:bg-ink/35"
          >
            <span className="grid h-14 w-14 place-items-center rounded-full bg-cream/95 text-ink shadow-[0_10px_30px_rgba(0,0,0,.35)]">
              <svg width="16" height="16" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                <path d="M3 1l8 5-8 5z" />
              </svg>
            </span>
          </button>
        )}
      </div>

      <div className="mt-3 flex items-center gap-3 text-cream">
        <button
          type="button"
          onClick={toggle}
          aria-label={paused ? 'Play film' : 'Pause film'}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-cream/35 transition-colors hover:border-cream"
        >
          {paused ? Icon.play : Icon.pause}
        </button>
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          aria-pressed={!muted}
          aria-label={muted ? 'Turn sound on' : 'Mute film'}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-cream/35 transition-colors hover:border-cream"
        >
          {muted ? Icon.soundOff : Icon.soundOn}
        </button>
        <span className="ml-1 text-[11px] tabular-nums tracking-[0.08em] text-cream/60">
          {pad(t)} / {film.duration}
        </span>
        <span className="ml-auto rounded-full border border-cream/25 px-2 py-[3px] text-[9px] uppercase tracking-[0.16em] text-cream/55">
          9:16
        </span>
      </div>
    </div>
  );
}

/**
 * The stage: a dark editorial panel, the tall film on the left, the project's
 * own information on the right. It replaces the still cover for this project.
 */
export function FilmStage({ film }: { film: FilmStudy }) {
  return (
    <div className="overflow-hidden rounded-[10px] bg-ink text-cream">
      <div className="grid gap-8 p-5 sm:p-7 md:grid-cols-12 md:gap-8 lg:gap-10 lg:p-9">
        <div className="md:col-span-5">
          <FilmPlayer film={film} />
        </div>

        <div className="flex flex-col justify-center md:col-span-7">
          <div className="flex items-baseline justify-between gap-4 border-b border-cream/15 pb-3">
            <span className="text-[10px] uppercase tracking-[0.2em] text-cream/65">the film</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-cream/60">9:16 master</span>
          </div>

          <p className="display mt-6 text-[clamp(2.2rem,4.4vw,3.6rem)] leading-[0.92]">
            cut to the <span className="serif-i text-cream/85">beat</span>
          </p>
          <p className="serif-i mt-2 text-[clamp(1.05rem,1.9vw,1.5rem)] text-cream/65">{film.titleAside}</p>

          <dl className="mt-7 grid gap-x-6 gap-y-4 sm:grid-cols-2">
            {film.meta.map((m) => (
              <div key={m.label} className="border-t border-cream/15 pt-2">
                <dt className="text-[9px] uppercase tracking-[0.18em] text-cream/60">{m.label}</dt>
                <dd className="mt-1 text-[13px] leading-[1.45] text-cream/85">{m.value}</dd>
              </div>
            ))}
            <div className="border-t border-cream/15 pt-2 sm:col-span-2">
              <dt className="text-[9px] uppercase tracking-[0.18em] text-cream/60">sound</dt>
              <dd className="mt-1 text-[13px] leading-[1.45] text-cream/85">
                mixed bed, no spoken word — the film reads with the sound off
              </dd>
            </div>
          </dl>

          <div className="mt-7">
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-[9px] uppercase tracking-[0.18em] text-cream/60">the track, as measured</span>
              <span className="text-[9px] uppercase tracking-[0.18em] text-cream/55">0 → 18.5 s</span>
            </div>
            <Wave peaks={film.peaks} className="h-[46px] w-full opacity-90" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** The three sheets, arranged as an editorial strip rather than three cards. */
export function FormatStrip({ formats }: { formats: FilmSlot[] }) {
  return (
    <div>
      {/* A filmstrip on one baseline: tall, square, wide — each at its own ratio. */}
      <div className="grid gap-5 lg:grid-cols-3 lg:items-end lg:gap-6">
        {formats.map((slot) => (
          <figure key={slot.src}>
            <div className="overflow-hidden rounded-[6px]">
              <AssetFrame slot={slot} bare className="rounded-[6px]" />
            </div>
            <figcaption className="mt-2 flex items-baseline justify-between gap-2 border-t border-ink/15 pt-2 text-[10px] uppercase tracking-[0.14em] text-ink/60">
              <span>{slot.caption}</span>
              <span className="tabular-nums text-ink/45">
                {slot.width} × {slot.height}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-5 max-w-[62ch] text-[12.5px] leading-[1.6] text-ink/55">
        Three frames for one film: the hook at 9:16, the edit's rhythm at 1:1, the closing card at 16:9. Each is
        composed for its own ratio — none is a crop of another.
      </p>
    </div>
  );
}

function watch(start: number, reduced: boolean) {
  const v = filmVideo.current;
  if (!v) return;
  v.currentTime = start;
  const p = v.play();
  if (p) p.catch(() => {});
  const stage = v.closest('[data-film-stage]') as HTMLElement | null;
  stage?.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
}

/** Six chapters read off the footage; each still is the real frame at that time. */
export function Storyboard({ chapters }: { chapters: FilmChapter[] }) {
  const [active, setActive] = useState(0);
  const reduced = usePrefersReducedMotion();
  const chapter = chapters[active];
  const tabs = useRef<HTMLDivElement>(null);

  const onKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = e.key === 'ArrowRight' ? (active + 1) % chapters.length : (active - 1 + chapters.length) % chapters.length;
    setActive(next);
    (tabs.current?.querySelectorAll('[role="tab"]')[next] as HTMLButtonElement | undefined)?.focus();
  };

  return (
    <div>
      <div
        ref={tabs}
        role="tablist"
        aria-label="Cut to the Beat — storyboard chapters"
        onKeyDown={onKey}
        className="grid grid-cols-2 gap-x-3 border-b border-ink/15 sm:grid-cols-3 md:flex md:gap-1 md:overflow-x-auto"
      >
        {chapters.map((c, i) => (
          <button
            key={c.title}
            role="tab"
            id={`cut-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`cut-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={`shrink-0 border-b-2 px-3 py-3 text-left transition-colors ${
              i === active ? 'border-ink text-ink' : 'border-transparent text-ink/60 hover:text-ink/85'
            }`}
          >
            <span className="block text-[10px] tabular-nums tracking-[0.12em]">{c.time}</span>
            <span className="mt-1 block text-[12px] lowercase">{c.title}</span>
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`cut-panel-${active}`}
        aria-labelledby={`cut-tab-${active}`}
        className="mt-6 grid gap-6 md:grid-cols-12 md:items-start md:gap-8"
      >
        <div className="md:col-span-5 lg:col-span-4">
          <AssetFrame slot={chapter.still} bare className="rounded-[6px]" />
        </div>
        <div className="md:col-span-7 lg:col-span-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-ink/60">
            {chapter.time} · {chapter.title}
          </p>
          <p className="display mt-3 max-w-[24ch] text-[clamp(1.5rem,3vw,2.3rem)] leading-[1.02]">
            {chapter.body}
          </p>
          <p className="mt-4 max-w-[52ch] text-[13px] leading-[1.6] text-ink/60">
            <span className="uppercase tracking-[0.14em] text-[10px] text-ink/60">move · </span>
            {chapter.technique}
          </p>
          <button
            type="button"
            onClick={() => watch(chapter.start, reduced)}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-ink/25 px-4 py-2 text-[11px] lowercase transition-colors hover:border-ink/60"
          >
            {Icon.play}
            watch this beat
          </button>
        </div>
      </div>
    </div>
  );
}

/** What the film is doing, with the three sheets as the visual anchors. */
export function EditBreakdown({ film }: { film: FilmStudy }) {
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      <ol className="space-y-6 lg:col-span-7">
        {film.notes.map((n, i) => (
          <li key={n.title} className="border-t border-ink/15 pt-3">
            <span className="text-[10px] tabular-nums tracking-[0.16em] text-ink/60">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h2 className="display mt-1 text-[clamp(1.15rem,1.8vw,1.5rem)]">{n.title}</h2>
            <p className="mt-1.5 max-w-[54ch] text-[15px] leading-[1.55] text-ink/70">{n.body}</p>
          </li>
        ))}
      </ol>
      <div className="lg:col-span-5">
        <div className="flex items-end gap-3">
          {film.formats.map((f) => (
            <figure key={f.src} className="flex-1">
              <div className="overflow-hidden rounded-[4px] border border-ink/15">
                <AssetFrame slot={{ ...f, caption: undefined }} className="rounded-none" bare />
              </div>
              <figcaption className="mt-1.5 text-[9px] uppercase tracking-[0.12em] text-ink/60">
                {f.ratio.replace(/\s/g, '')}
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-4 text-[12px] leading-[1.6] text-ink/60">
          One film, three frames: the hook sheet at 9:16, the edit's rhythm at 1:1, the closing card at 16:9.
          Each is composed for its ratio — none is a crop of another.
        </p>
        <p className="mt-3 text-[11px] leading-[1.6] text-ink/55">
          The waveform on these sheets is the master's own audio. The marks are picture chapters read off the
          footage, not claimed beat timestamps.
        </p>
      </div>
    </div>
  );
}
