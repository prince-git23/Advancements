import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../lib/smooth';
import { usePrefersReducedMotion } from '../lib/hooks';
import { Sticker, Sparkle, LimeSpiky } from './art/Stickers';
import { HeroMontage } from './HeroMontage';
import { SZ } from './art/sizes';
import { media } from '../data/media';

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const smileyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const ellipseRef = useRef<SVGPathElement>(null);
  const underlineRef = useRef<SVGPathElement>(null);

  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let done = false;

    let removePointer: (() => void) | null = null;
    let fallback = 0;
    let playRef: (() => void) | null = null;

    const ctx = gsap.context(() => {
      // ---- intro reveal ----
      const words = gsap.utils.toArray<HTMLElement>('.hero-word-inner');
      gsap.set(words, { yPercent: 112 });
      gsap.set('.hero-fade', { autoAlpha: 0 });

      if (ellipseRef.current) gsap.set(ellipseRef.current, { strokeDasharray: 1, strokeDashoffset: 1 });
      if (underlineRef.current) gsap.set(underlineRef.current, { strokeDasharray: 1, strokeDashoffset: 1 });

      const play = () => {
        if (done) return;
        done = true;
        if (reduced) {
          gsap.set(words, { yPercent: 0 });
          gsap.set('.hero-fade', { autoAlpha: 1 });
          return;
        }
        const tl = gsap.timeline({ delay: 0.1 });
        tl.to(words, { yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.06 })
          .to(
            [ellipseRef.current, underlineRef.current].filter(Boolean),
            { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' },
            '-=0.35'
          )
          .fromTo(
            '.hero-sparkle',
            { scale: 0, rotate: -60 },
            { scale: 1, rotate: 0, duration: 0.8, ease: 'back.out(2)' },
            '-=0.5'
          )
          .to('.hero-fade', { autoAlpha: 1, duration: 0.7, ease: 'power2.out' }, '-=0.6');
      };

      playRef = play;
      window.addEventListener('dd:ready', play, { once: true });
      fallback = window.setTimeout(play, 4000);

      // ---- pointer reaction on the smiley ----
      if (!reduced && smileyRef.current) {
        const xTo = gsap.quickTo(smileyRef.current, 'x', { duration: 0.6, ease: 'power3.out' });
        const yTo = gsap.quickTo(smileyRef.current, 'y', { duration: 0.6, ease: 'power3.out' });
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          xTo(nx * 22);
          yTo(ny * 16);
        };
        section.addEventListener('pointermove', onMove);
        removePointer = () => section.removeEventListener('pointermove', onMove);
      }
    }, sectionRef.current);

    return () => {
      ctx.revert();
      removePointer?.();
      window.clearTimeout(fallback);
      if (playRef) window.removeEventListener('dd:ready', playRef);
    };
  }, [reduced]);

  // ---- shutter scroll-out ----
  useEffect(() => {
    const section = sectionRef.current;
    const shell = shellRef.current;
    if (!section || !shell || reduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=75%',
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });
      tl.to(shell, { height: 0, ease: 'none' }, 0).to(
        headlineRef.current,
        { yPercent: -18, autoAlpha: 0, ease: 'none' },
        0
      );
      gsap.to('.hero-controls', {
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top top', end: '+=22%', scrub: true },
      });
    }, sectionRef.current);

    return () => ctx.revert();
  }, [reduced]);

  const toggleFullscreen = () => {
    const el = shellRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.().catch(() => {});
  };

  return (
    <section id="hero" ref={sectionRef} className="relative h-[100svh] w-full">
      <div
        ref={shellRef}
        className="absolute inset-x-3 top-3 h-[calc(100svh-24px)] origin-top overflow-hidden rounded-[24px] bg-ink"
      >
        {media.heroVideo ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src={media.heroVideo}
            poster={media.heroPoster || undefined}
            autoPlay
            muted={muted}
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          <HeroMontage paused={paused} muted={muted} />
        )}

        <div className="pointer-events-none absolute inset-x-0 top-0 h-[26%] bg-gradient-to-b from-black/30 to-transparent" />

        <div ref={headlineRef} className="absolute inset-x-0 bottom-[12%] z-10 px-4">
          <h1 className="display mx-auto max-w-[1400px] text-center text-cream text-[clamp(2.4rem,7vw,7rem)] leading-[0.95]">
            <span className="block">
              <span className="relative inline-block">
                <span className="mask-line inline-block pb-[.08em] align-bottom">
                  <span className="hero-word-inner inline-block">we</span>
                </span>
                <span className="mask-line ml-[.28em] inline-block pb-[.08em] align-bottom">
                  <span className="hero-word-inner inline-block">make</span>
                </span>
                <span
                  ref={smileyRef}
                  className="hero-fade pointer-events-none absolute -top-[1.05em] left-[.15em] z-20 float-slow"
                >
                  <Sticker kind="smiley" size={SZ.heroSmiley} rotate={-8} className="max-md:scale-[0.82]" />
                </span>
              </span>{' '}
              <span className="mask-line inline-block pb-[.08em] align-bottom">
                <span className="hero-word-inner serif-i inline-block pr-[.06em]">content</span>
              </span>{' '}
              <span className="mask-line inline-block pb-[.08em] align-bottom">
                <span className="hero-word-inner inline-block">for</span>
              </span>
            </span>
            <span className="mt-[.12em] block">
              <span className="mask-line inline-block pb-[.08em] align-bottom">
                <span className="hero-word-inner inline-block">the</span>
              </span>{' '}
              <span className="mask-line inline-block pb-[.08em] align-bottom">
                <span className="hero-word-inner inline-block">new</span>
              </span>{' '}
              <span className="mask-line inline-block pb-[.08em] align-bottom">
                <span className="hero-word-inner inline-block">desi</span>
              </span>{' '}
              <span className="relative inline-block">
                <svg
                  viewBox="0 0 400 160"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute -left-[5%] -top-[18%] h-[140%] w-[110%]"
                  aria-hidden="true"
                >
                  <path
                    ref={ellipseRef}
                    d="M198 12c96 2 190 26 190 66 0 42-104 70-196 68C96 144 10 118 12 76 14 36 96 10 198 12Z"
                    fill="none"
                    stroke="#EEEAE3"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    pathLength={1}
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                <span className="mask-line inline-block pb-[.08em] align-bottom">
                  <span className="hero-word-inner inline-block">mainstream</span>
                </span>
                <svg
                  viewBox="0 0 300 26"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute -bottom-[.18em] left-0 h-[.22em] w-full"
                  aria-hidden="true"
                >
                  <path
                    ref={underlineRef}
                    d="M4 16c40-8 78-10 116-8 40 2 80 8 118 4 22-2 42-4 58-6"
                    fill="none"
                    stroke="#EEEAE3"
                    strokeWidth="2"
                    strokeLinecap="round"
                    pathLength={1}
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </span>
            </span>
          </h1>

          <Sparkle className="hero-sparkle absolute right-[6%] top-[54%] rotate-[12deg]" size={SZ.heroSparkle} />
        </div>

        {/* sound toggle */}
        <button
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? 'Turn sound on' : 'Mute'}
          aria-pressed={!muted}
          className="hero-fade absolute left-[4%] top-[42%] z-20 grid place-items-center transition-transform duration-300 hover:scale-110 max-md:left-[3%] max-md:top-[34%]"
        >
          <LimeSpiky size={SZ.heroSound} />
          <span className="absolute text-ink">
            {muted ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" stroke="none" />
                <path d="M17 9l4 6M21 9l-4 6" />
              </svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" stroke="none" />
                <path d="M16 8a6 6 0 0 1 0 8M19 5a10 10 0 0 1 0 14" />
              </svg>
            )}
          </span>
        </button>

        {/* mini controls */}
        <div className="hero-controls absolute bottom-4 left-4 z-20 flex items-center gap-1 opacity-60 transition-opacity hover:opacity-100">
          <button
            aria-label={paused ? 'Play reel' : 'Pause reel'}
            onClick={() => {
              setPaused((p) => !p);
              const v = videoRef.current;
              if (v) (paused ? v.play() : v.pause());
            }}
            className="grid h-8 w-8 place-items-center rounded-full border border-cream/30 text-cream/90"
          >
            {paused ? (
              <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><path d="M3 1l8 5-8 5z" /></svg>
            ) : (
              <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><rect x="2" y="1" width="3" height="10" /><rect x="7" y="1" width="3" height="10" /></svg>
            )}
          </button>
          <button
            aria-label="Fullscreen"
            onClick={toggleFullscreen}
            className="grid h-8 w-8 place-items-center rounded-full border border-cream/30 text-cream/90"
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M1 4V1h3M8 1h3v3M11 8v3H8M4 11H1V8" />
            </svg>
          </button>
        </div>

        <span className="hero-fade absolute bottom-5 right-5 z-20 text-[11px] uppercase tracking-[0.18em] text-cream/60">
          {media.heroVideo ? 'reel' : 'placeholder reel'}
        </span>
      </div>
    </section>
  );
}
