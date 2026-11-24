import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../lib/smooth';
import { usePrefersReducedMotion } from '../lib/hooks';
import { HeroMontage } from './HeroMontage';
import { Chapter } from './ui/Chapter';
import { media } from '../data/media';

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<SVGPathElement>(null);

  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  // Both masters were checked with ffprobe and carry a stereo AAC track, so the
  // control starts available; metadata still has the final say (a swapped-in
  // silent file hides it instead of showing a button that does nothing).
  const [hasAudio, setHasAudio] = useState(() => Boolean(media.heroVideo));
  const [failed, setFailed] = useState(false);
  // True only when the visitor pressed pause: automatic pauses (tab hidden, film
  // scrolled out of view) must undo themselves when the film is visible again.
  const userPaused = useRef(false);
  // A portrait viewport gets the portrait film (720 × 1280, cut from the same
  // studio footage); a landscape one gets the widescreen master. Both are
  // full-bleed backgrounds — the portrait cut is never framed as a video card.
  // Only one file is ever fetched: the source swaps with the breakpoint.
  const PORTRAIT_MQ = '(orientation: portrait), (max-width: 767px)';
  const [portrait, setPortrait] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(PORTRAIT_MQ).matches
  );
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const mq = window.matchMedia(PORTRAIT_MQ);
    const onChange = () => setPortrait(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const videoSrc = portrait ? media.heroVideoPortrait || media.heroVideo : media.heroVideo;
  const posterSrc = portrait ? media.heroPosterPortrait || media.heroPoster : media.heroPoster;
  const hasVideo = Boolean(videoSrc);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  // A poster-first start (reduced motion) leaves the film paused, so the control
  // reads the element instead of assuming it is playing.
  useEffect(() => {
    const video = videoRef.current;
    if (video) setPaused(video.paused);
  }, [videoSrc, reduced]);

  // Keep the reel control, the tab state and the element in step: pause when the
  // page is hidden or the hero is off screen, resume when it is back — unless the
  // visitor paused it themselves.
  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    const syncPaused = () => setPaused(video.paused);
    const resume = () => {
      if (userPaused.current || reduced || document.visibilityState === 'hidden') return;
      const p = video.play();
      if (p) p.catch(() => setPaused(true));
    };
    const suspend = () => {
      if (!video.paused) video.pause();
    };
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') suspend();
      else resume();
    };

    // The hero is a pinned, full-screen section: once it is scrolled away there
    // is no reason to keep decoding 24 frames a second.
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? resume() : suspend()),
      { threshold: 0 }
    );
    io.observe(section);

    video.addEventListener('play', syncPaused);
    video.addEventListener('pause', syncPaused);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      io.disconnect();
      video.removeEventListener('play', syncPaused);
      video.removeEventListener('pause', syncPaused);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [hasVideo, videoSrc, reduced]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let done = false;

    let removePointer: (() => void) | null = null;
    let fallback = 0;
    let strokeGuard = 0;
    let playRef: (() => void) | null = null;

    const ctx = gsap.context(() => {
      // ---- intro reveal ----
      const words = gsap.utils.toArray<HTMLElement>('.hero-word-inner');
      const lineOne = words.slice(0, 4); // we make content for
      const lineTwo = words.slice(4); // the new desi mainstream
      const contentWord = words[2]; // the italic word, which slides in
      const reveal = revealRef.current;
      // Words land from below *and* tilt up out of the baseline, so the first
      // line reads as type standing up rather than sliding in flat.
      gsap.set(words, {
        yPercent: 112,
        rotateX: -60,
        transformPerspective: 700,
        transformOrigin: '50% 100%',
      });
      // Slides in from the left: a right-hand slide would cross the next word
      // while it is still half-clipped by its own mask.
      gsap.set(contentWord, { x: -14 });
      gsap.set('.hero-fade', { autoAlpha: 0 });
      // The film opens inside its own frame and then fills it.
      if (!reduced) gsap.set(reveal, { clipPath: 'inset(10% 7% 10% 7%)' });

      const strokes = [underlineRef.current].filter(Boolean) as SVGPathElement[];
      gsap.set(strokes, { strokeDasharray: 1, strokeDashoffset: 1 });

      // The hand-drawn stroke is part of the headline, not an effect on top of
      // it: if the reveal never runs (throttled tab, late ready event) it must
      // still end up drawn rather than missing.
      const revealStrokes = () => gsap.set(strokes, { strokeDasharray: 1, strokeDashoffset: 0 });

      const play = () => {
        if (done) return;
        done = true;
        if (reduced) {
          gsap.set(words, { yPercent: 0, x: 0, rotateX: 0 });
          gsap.set('.hero-fade', { autoAlpha: 1 });
          gsap.set(reveal, { clipPath: 'none' });
          revealStrokes();
          return;
        }
        // Staged like the storyboard: film opens, first line, the italic word
        // slides in, second line, then the drawn ellipse. 2.9 s end to end —
        // the headline has to be readable before anyone scrolls, so the 6.5 s
        // sketch in the brief is compressed rather than literally timed.
        const tl = gsap.timeline({ delay: 0.1 });
        tl.to(reveal, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power3.inOut' }, 0)
          .to(
            lineOne,
            { yPercent: 0, rotateX: 0, duration: 0.9, ease: 'power4.out', stagger: 0.08 },
            0.35
          )
          .to(contentWord, { x: 0, duration: 1.1, ease: 'power3.out' }, 0.55)
          .to(
            lineTwo,
            { yPercent: 0, rotateX: 0, duration: 0.9, ease: 'power4.out', stagger: 0.08 },
            1.0
          )
          .to(strokes, { strokeDashoffset: 0, duration: 0.85, ease: 'power2.inOut' }, 1.95)
          .to('.hero-fade', { autoAlpha: 1, duration: 0.6, ease: 'power2.out' }, 2.25);
      };

      playRef = play;
      // Reduced motion has no entrance to wait for: settle the type and the
      // stroke on mount instead of sitting on the 4 s fallback.
      if (reduced) play();
      window.addEventListener('dd:ready', play, { once: true });
      fallback = window.setTimeout(play, 4000);
      // Watchdog: whatever happened above, the annotation is visible by 4.2s.
      if (strokes.length) strokeGuard = window.setTimeout(revealStrokes, 4200);

      // ---- pointer depth: film and headline at two rates, so the frame ----
      // ---- reads as a space rather than a flat image ----
      if (!reduced) {
        const layer = (el: HTMLElement | null) =>
          el
            ? {
                x: gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3.out' }),
                y: gsap.quickTo(el, 'y', { duration: 0.8, ease: 'power3.out' }),
              }
            : null;
        const media = layer(mediaRef.current);
        const head = layer(headlineRef.current);

        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          // Two depths on one pointer: film 12px against the type, headline 18px.
          media?.x(nx * -12);
          media?.y(ny * -9);
          head?.x(nx * 18);
          head?.y(ny * 12);
        };
        const reset = () => {
          media?.x(0);
          media?.y(0);
          head?.x(0);
          head?.y(0);
        };
        section.addEventListener('pointermove', onMove);
        section.addEventListener('pointerleave', reset);
        removePointer = () => {
          section.removeEventListener('pointermove', onMove);
          section.removeEventListener('pointerleave', reset);
        };
      }
    }, sectionRef.current);

    return () => {
      ctx.revert();
      removePointer?.();
      window.clearTimeout(fallback);
      window.clearTimeout(strokeGuard);
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
      // The card closes and tips away from the viewer like a page turning
      // forward: height collapse + a −12° rotateX hinged on its top edge.
      tl.to(shell, { height: 0, minHeight: 0, ease: 'none' }, 0)
        .to(
          shell,
          { rotateX: -12, transformPerspective: 1500, transformOrigin: '50% 0%', ease: 'none' },
          0
        )
        .to(mediaRef.current, { yPercent: 7, scale: 1.04, ease: 'none' }, 0)
        .to(headlineRef.current, { yPercent: -18, autoAlpha: 0, ease: 'none' }, 0)
        // The film closes behind a darkening veil as the card shuts, so the cut
        // into the next section is a dip to black rather than a bright edge
        // sliding up the screen. Scrubbed, so scrolling back lifts it again.
        .to(veilRef.current, { opacity: 0.82, ease: 'none' }, 0.15);
      gsap.to('.hero-controls', {
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top top', end: '+=22%', scrub: true },
      });
    }, sectionRef.current);

    return () => ctx.revert();
  }, [reduced]);

  // Idle life on the film itself: a 14-second 1.00 → 1.06 push that never
  // settles flat. Skipped entirely for reduced motion.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduced || !hasVideo) return;
    const tween = gsap.to(video, {
      scale: 1.06,
      duration: 14,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
    return () => {
      tween.kill();
      gsap.set(video, { scale: 1 });
    };
  }, [reduced, hasVideo, videoSrc]);

  const toggleFullscreen = () => {
    const el = shellRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.().catch(() => {});
  };

  return (
    <section id="hero" ref={sectionRef} data-theme="motion" className="relative min-h-[100svh] w-full">
      <div
        ref={shellRef}
        className="relative mx-3 mt-3 h-[calc(100svh-24px)] origin-top overflow-hidden rounded-[24px] bg-ink xl:absolute xl:inset-x-3 xl:top-3 xl:mx-0 xl:mt-0"
      >
        {/* Media. From 1280 px it is the full-bleed film behind the headline.
            Below that it is a framed panel above the headline, so neither the
            vertical cut nor the widescreen film is cropped to fill a box: the
            panel keeps its own ratio and shrinks to the viewport height.
            The 8 px bleed at xl is the deepest pointer-parallax layer's room. */}
        <div
          ref={mediaRef}
          className="absolute -inset-2 overflow-hidden bg-ink"
        >
          <div ref={revealRef} className="relative h-full w-full overflow-hidden">
            {hasVideo && !failed ? (
              <video
                key={videoSrc}
                ref={videoRef}
                className="h-full w-full object-cover"
                src={videoSrc}
                poster={posterSrc || undefined}
                autoPlay={!reduced}
                muted={muted}
                loop
                playsInline
                preload={reduced ? 'none' : 'auto'}
                aria-hidden="true"
                tabIndex={-1}
                onError={() => setFailed(true)}
                onLoadedMetadata={(event) => {
                  // Only offer sound when the reel actually ships an audio track.
                  const video = event.currentTarget as HTMLVideoElement & {
                    mozHasAudio?: boolean;
                    webkitAudioDecodedByteCount?: number;
                    audioTracks?: { length: number };
                  };
                  if (
                    video.mozHasAudio ||
                    (video.webkitAudioDecodedByteCount ?? 0) > 0 ||
                    (video.audioTracks?.length ?? 0) > 0
                  ) {
                    setHasAudio(true);
                  }
                }}
              />
            ) : posterSrc ? (
              /* A failed or blocked film keeps a real frame from it — the hero
                 never collapses to a black rectangle. */
              <img src={posterSrc} alt="" className="h-full w-full object-cover" />
            ) : (
              <HeroMontage paused={paused} />
            )}
          </div>
        </div>

        {/* Cinematic grade, not a filter on the footage: one restrained ink
            wash over the whole frame, a light scrim for the mark, and a
            directional gradient under the headline. The wash is deliberately
            shy of 25% so the violet studio light and the burnt-orange
            highlights keep their colour and their shadow detail. */}
        <div className="pointer-events-none absolute inset-0 z-[1] bg-black/20" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[26%] bg-gradient-to-b from-black/45 via-black/12 to-transparent xl:h-[26%] xl:from-black/25" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[54%] bg-gradient-to-t from-black/62 via-black/24 to-transparent xl:h-[46%] xl:from-black/48 xl:via-black/16" />
        {/* Exit veil: animated only by the scroll-out timeline. */}
        <div ref={veilRef} className="pointer-events-none absolute inset-0 z-[2] bg-ink opacity-0" />

        <div
          ref={headlineRef}
          className="absolute inset-x-0 bottom-[max(5.4rem,13%)] z-10 px-4 xl:bottom-[12%]"
        >
          <Chapter no="01" name="the idea" tone="cream" align="center" className="mb-3" />
          <h1 className="display mx-auto max-w-[1400px] text-center text-cream text-[clamp(1.9rem,min(6.8vw,8.6svh),4.1rem)] leading-[0.92] xl:text-[clamp(2.4rem,6.4vw,6rem)]">
            <span className="block">
              <span className="relative inline-block">
                <span className="mask-line inline-block pb-[.08em] align-bottom">
                  <span className="hero-word-inner inline-block">we</span>
                </span>
                <span className="mask-line ml-[.28em] inline-block pb-[.08em] align-bottom">
                  <span className="hero-word-inner inline-block">make</span>
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
                {/* The stroke is drawn by the entrance timeline, under the last
                    word. An oval around "mainstream" collided with the word
                    before it at every size where the headline is two lines. */}
                <svg
                  viewBox="0 0 400 40"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute -bottom-[.16em] left-[-2%] h-[.22em] w-[104%]"
                  aria-hidden="true"
                >
                  <path
                    ref={underlineRef}
                    d="M6 27c56-12 110-15 170-11 54 4 108 11 158 3"
                    fill="none"
                    stroke="#EEEAE3"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    pathLength={1}
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                <span className="mask-line inline-block pb-[.08em] align-bottom">
                  <span className="hero-word-inner inline-block">mainstream</span>
                </span>
              </span>
            </span>
          </h1>

          {/* The film is decorative motion and is hidden from the accessibility
              tree; this is what a screen reader is given instead. */}
          <p className="sr-only">
            A 20-second film of the studio at work: an edit suite and timeline, a lens being focused,
            a storyboard being drawn, printed layouts on a desk, and a camera in hand.
          </p>
        </div>

        {/* One control bar at every breakpoint: transport on the left, the one
            shared sound control bottom-right — inset from the edges, clear of
            the headline, the safe area and the fullscreen affordance. */}
        <div className="hero-controls absolute inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-20 flex items-center justify-between gap-3 opacity-80 transition-opacity hover:opacity-100">
          <div className="flex items-center gap-2">
          {hasVideo && (
          <button
            aria-label={paused ? 'Play reel' : 'Pause reel'}
            onClick={() => {
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
            }}
            className="grid h-11 w-11 place-items-center rounded-full border border-cream/30 text-cream/90 xl:h-10 xl:w-10"
          >
            {paused ? (
              <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><path d="M3 1l8 5-8 5z" /></svg>
            ) : (
              <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><rect x="2" y="1" width="3" height="10" /><rect x="7" y="1" width="3" height="10" /></svg>
            )}
          </button>
          )}
          <button
            aria-label="Fullscreen"
            onClick={toggleFullscreen}
            className="grid h-11 w-11 place-items-center rounded-full border border-cream/30 text-cream/90 xl:h-10 xl:w-10"
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M1 4V1h3M8 1h3v3M11 8v3H8M4 11H1V8" />
            </svg>
          </button>
          </div>

          {/* The one sound control — same component, same position, desktop to
              phone. Starts muted, toggles the element's own audio track, and is
              only rendered when the reel actually ships sound. */}
          {hasVideo && hasAudio && (
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? 'Turn sound on' : 'Mute film'}
              aria-pressed={!muted}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-cream/35 bg-ink/40 text-cream backdrop-blur-[2px] transition-colors hover:border-cream/70 hover:bg-ink/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream active:scale-95"
            >
              {muted ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" stroke="none" />
                  <path d="M17 9l4 6M21 9l-4 6" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" stroke="none" />
                  <path d="M16 8a6 6 0 0 1 0 8M19 5a10 10 0 0 1 0 14" />
                </svg>
              )}
            </button>
          )}
        </div>

      </div>
    </section>
  );
}
