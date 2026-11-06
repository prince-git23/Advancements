import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap, ScrollTrigger } from '../lib/smooth';
import { useIsTouch, usePrefersReducedMotion } from '../lib/hooks';
import { projects } from '../data/work';
import { media } from '../data/media';
import type { PillColor } from '../types';
import { PlaceholderMedia } from './Placeholder';
import { Sticker } from './art/Stickers';
import { LimeBlob } from './art/Blobs';
import { Swoosh, WobblyUnderline } from './art/Doodles';
import { SZ } from './art/sizes';

const PILL_BG: Record<PillColor, string> = {
  lilac: '#E8B4F5',
  lime: '#E4FBA8',
  tangerine: '#E8603C',
  periwinkle: '#8499F8',
  berry: '#9B2155',
};

const TYPE_ICON: Record<string, string> = {
  '360': '✦',
  social: '◉',
  activation: '✳',
  design: '◆',
};

export function WorkCarousel() {
  const [active, setActive] = useState(0);
  const [hint, setHint] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, startX: 0, lastX: 0, lastT: 0, dx: 0, moved: false, v: 0 });
  const [inView, setInView] = useState(false);
  const navigate = useNavigate();
  const reduced = usePrefersReducedMotion();
  const touch = useIsTouch();
  const total = projects.length;

  const go = useCallback(
    (next: number) => {
      setActive(Math.max(0, Math.min(total - 1, next)));
      setHint(false);
    },
    [total]
  );

  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    if (!section || !bg || reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bg,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top 75%', end: 'top 25%', scrub: true },
        }
      );
      gsap.from('.work-deal', {
        y: 120,
        scale: 0.88,
        filter: 'blur(12px)',
        autoAlpha: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: section, start: 'top 45%' },
      });
      gsap.from('.work-meta', {
        y: 40,
        autoAlpha: 0,
        duration: 0.8,
        scrollTrigger: { trigger: section, start: 'top 20%' },
      });
    }, sectionRef.current);

    return () => ctx.revert();
  }, [reduced]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      end: 'bottom 30%',
      onToggle: (self) => setInView(self.isActive),
    });
    return () => st.kill();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(active + 1);
      if (e.key === 'ArrowLeft') go(active - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [inView, active, go]);

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 14) {
      const now = Date.now();
      if (now - drag.current.lastT < 420) return;
      drag.current.lastT = now;
      go(active + (e.deltaX > 0 ? 1 : -1));
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { down: true, startX: e.clientX, lastX: e.clientX, lastT: performance.now(), dx: 0, moved: false, v: 0 };
    stageRef.current?.setPointerCapture(e.pointerId);
    stageRef.current?.classList.add('is-dragging');
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.down) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 6) drag.current.moved = true;
    const now = performance.now();
    const dt = Math.max(1, now - drag.current.lastT);
    drag.current.v = (e.clientX - drag.current.lastX) / dt;
    drag.current.lastX = e.clientX;
    drag.current.lastT = now;
    drag.current.dx = dx;
    if (dragRef.current) dragRef.current.style.transform = `translate3d(${dx * 0.82}px,0,0)`;
    setHint(false);
  };

  const endDrag = () => {
    if (!drag.current.down) return;
    const { dx, v } = drag.current;
    drag.current.down = false;
    stageRef.current?.classList.remove('is-dragging');
    if (dragRef.current) gsap.to(dragRef.current, { x: 0, duration: 0.35, ease: 'power3.out' });
    if (dx < -55 || v < -0.45) go(active + 1);
    else if (dx > 55 || v > 0.45) go(active - 1);
  };

  const fan = (offset: number): React.CSSProperties => {
    const a = Math.abs(offset);
    const sign = Math.sign(offset);
    const cfg = [
      { rot: 0, scale: 1, x: 0, y: 0, z: 20, op: 1, bright: 1 },
      { rot: 6, scale: 0.9, x: 62, y: 16, z: 14, op: 1, bright: 0.6 },
      { rot: 11, scale: 0.8, x: 110, y: 46, z: 10, op: 1, bright: 0.6 },
      { rot: 15, scale: 0.7, x: 152, y: 82, z: 6, op: 0.35, bright: 0.6 },
    ][Math.min(a, 3)];
    return {
      transform: `translate(-50%,-50%) translateX(${sign * cfg.x}%) translateY(${cfg.y}px) rotate(${
        sign * cfg.rot
      }deg) scale(${cfg.scale})`,
      opacity: a > 3 ? 0 : cfg.op,
      zIndex: cfg.z,
      filter: `brightness(${cfg.bright})`,
      pointerEvents: a > 3 ? 'none' : 'auto',
      transition: 'transform .72s cubic-bezier(.22,.61,.36,1), opacity .5s ease, filter .5s ease',
    };
  };

  const project = projects[active];

  return (
    <section id="work" ref={sectionRef} className="relative overflow-hidden bg-cream">
      <div ref={bgRef} className="absolute inset-0 origin-bottom bg-ink" aria-hidden="true" />

      <div className="relative z-10 flex min-h-[100svh] flex-col justify-center py-[7vh]">
        <div className="relative mx-auto w-full max-w-[1500px] px-2">
          <Swoosh className="pointer-events-none absolute left-0 top-[2%] z-30 w-[110px] text-white/90 md:w-[150px]" color="#FFFFFF" />
          <LimeBlob
            className="pointer-events-none absolute -right-[4vw] bottom-[-2%] z-0 w-[30vw] max-w-[420px] rotate-[8deg] opacity-95"
            color="#E4FBA8"
          />

          <div
            ref={stageRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onPointerLeave={endDrag}
            onWheel={onWheel}
            role="group"
            aria-roledescription="carousel"
            aria-label="Work carousel. Use arrow keys to browse."
            className="work-stage relative z-10 h-[min(76svh,740px)] w-full touch-pan-y select-none"
            style={{ cursor: touch ? 'auto' : 'grab' }}
          >
            <div ref={dragRef} className="absolute inset-0 will-change-transform">
              {projects.map((p, i) => {
                const offset = i - active;
                const visible = Math.abs(offset) <= 3;
                const isActive = offset === 0;
                const video = media.workVideos[p.slug];
                return (
                  <article
                    key={p.slug}
                    className="absolute left-1/2 top-1/2 aspect-[9/16] w-[min(24vw,380px)] max-md:w-[72vw]"
                    style={fan(offset)}
                    aria-hidden={!visible}
                  >
                    <button
                      className="work-deal relative block h-full w-full text-left"
                      onClick={() => {
                        if (drag.current.moved) return;
                        if (isActive) navigate(`/work/${p.slug}`);
                        else go(i);
                      }}
                      tabIndex={isActive ? 0 : -1}
                      aria-label={isActive ? `Open ${p.title}` : `Show ${p.title}`}
                    >
                      <div
                        className="absolute inset-0 overflow-hidden rounded-[26px] border-[5px] border-cream bg-ink shadow-[0_30px_60px_rgba(0,0,0,.35)]"
                        style={{ transform: 'translateZ(0)' }}
                      >
                        {video ? (
                          <video
                            className="h-full w-full object-cover"
                            src={video}
                            poster={media.workPosters[p.slug]}
                            muted
                            loop
                            playsInline
                            autoPlay={isActive}
                          />
                        ) : (
                          <PlaceholderMedia
                            seed={i}
                            label={p.client}
                            sub={p.type}
                            active={isActive}
                            className="h-full w-full"
                          />
                        )}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-black/45 to-transparent" />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5">
                          <p className="display text-cream text-[clamp(1.3rem,2vw,1.9rem)]">{p.subtitle}</p>
                        </div>

                        {isActive && (
                          <>
                            <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-[6px] text-[11px] font-medium lowercase text-ink shadow-sm">
                              <span className="text-[11px] text-tangerine">{TYPE_ICON[p.type]}</span>
                              {p.type}
                            </span>
                            <div className="absolute -bottom-6 left-2 z-20" key={`s-${active}`} style={{ animation: 'stickerPop .55s cubic-bezier(.2,1.3,.4,1)' }}>
                              <Sticker kind={p.sticker} size={SZ.workCard} rotate={-10} />
                            </div>
                            <span
                              className={`absolute -bottom-4 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-2 text-[12px] font-medium lowercase ${
                                p.pill === 'tangerine' || p.pill === 'berry' ? 'text-cream' : 'text-ink'
                              }`}
                              style={{ background: PILL_BG[p.pill] }}
                            >
                              {p.client}
                            </span>
                          </>
                        )}
                      </div>
                    </button>
                  </article>
                );
              })}
            </div>
          </div>

          {hint && (
            <span className="pointer-events-none absolute bottom-2 left-1/2 z-30 -translate-x-1/2 text-[11px] uppercase tracking-[0.2em] text-cream/50">
              drag / click
            </span>
          )}
        </div>

        <div className="work-meta relative z-20 mx-auto mt-7 flex w-full max-w-[1200px] flex-col items-center gap-3 px-6 text-center">
          <div key={active} style={{ animation: 'metaIn .5s ease both' }}>
            <h3 className="display text-cream text-[clamp(1.5rem,2.6vw,2.2rem)]">{project.title}</h3>
            <Link
              to={`/work/${project.slug}`}
              className="group relative mt-2 inline-block text-[13px] text-cream/70 transition-colors hover:text-cream"
            >
              view project
              <WobblyUnderline className="absolute -bottom-1 left-0 h-[7px] w-full text-cream/50" strokeWidth={2} />
            </Link>
          </div>
          <Link
            to="/work"
            className="mt-3 inline-block rounded-full border border-cream/25 px-5 py-2 text-[12px] text-cream/80 transition hover:border-cream/60 hover:text-cream"
          >
            all our work →
          </Link>
        </div>
      </div>
    </section>
  );
}
