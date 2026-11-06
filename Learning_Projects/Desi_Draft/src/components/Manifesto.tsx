import { useEffect, useRef } from 'react';
import { gsap } from '../lib/smooth';
import { useIsTouch, usePrefersReducedMotion } from '../lib/hooks';
import { PlaceholderPortrait } from './Placeholder';
import { Sticker } from './art/Stickers';
import { SplatBlob } from './art/Blobs';
import { TickMarks, WobblyUnderline } from './art/Doodles';
import { SZ } from './art/sizes';

const CARDS = [
  {
    seed: 5,
    initials: 'RR',
    name: 'rhea',
    rotate: -8,
    y: 0,
    speed: 0.9,
    depth: 14,
    size: 100,
    pill: { text: 'chai > coffee', bg: '#E8B4F5', ink: true, pos: 'top-4 -left-6' },
  },
  {
    seed: 2,
    initials: 'AB',
    name: 'arjun',
    rotate: -3,
    y: 18,
    speed: 1,
    depth: 22,
    size: 100,
    pill: { text: 'desi is not a niche', bg: '#E8603C', ink: false, pos: 'bottom-6 -right-8' },
  },
  {
    seed: 1,
    initials: 'MK',
    name: 'meera',
    rotate: 5,
    y: -10,
    speed: 1.1,
    depth: 30,
    size: 108,
    pill: null,
  },
  {
    seed: 3,
    initials: 'ZT',
    name: 'zoya',
    rotate: 9,
    y: 22,
    speed: 1.2,
    depth: 18,
    size: 96,
    pill: { text: 'shaadi season = content season', bg: '#E4FBA8', ink: true, pos: 'top-5 -right-6' },
  },
];

export function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const touch = useIsTouch();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced) return;

    const ctx = gsap.context(() => {
      gsap.from('.mf-line-inner', {
        yPercent: 108,
        duration: 1.1,
        ease: 'power4.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '.mf-heading', start: 'top 82%' },
      });

      gsap.from('.fan-tilt', {
        y: 140,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: '.fan-stage', start: 'top 85%' },
      });

      gsap.utils.toArray<HTMLElement>('.fan-parallax').forEach((el) => {
        const speed = Number(el.dataset.speed ?? 1);
        gsap.fromTo(
          el,
          { y: (speed - 1) * 150 },
          {
            y: -(speed - 1) * 320,
            ease: 'none',
            scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        );
      });

      gsap.from('.mf-copy', {
        y: 30,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.mf-copy', start: 'top 90%' },
      });
    }, sectionRef.current);

    return () => ctx.revert();
  }, [reduced]);

  // pointer tilt toward the cursor
  useEffect(() => {
    if (reduced || touch) return;
    const stage = stageRef.current;
    if (!stage) return;

    const tilts = Array.from(stage.querySelectorAll<HTMLElement>('.fan-tilt'));
    const setters = tilts.map((el) => {
      const pill = el.querySelector<HTMLElement>('.fan-pill');
      return {
        ry: gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3.out' }),
        rx: gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3.out' }),
        x: gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' }),
        y: gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' }),
        depth: Number(el.dataset.depth ?? 20),
        pillX: pill ? gsap.quickTo(pill, 'x', { duration: 0.5, ease: 'power3.out' }) : null,
        pillY: pill ? gsap.quickTo(pill, 'y', { duration: 0.5, ease: 'power3.out' }) : null,
      };
    });

    const move = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      setters.forEach((s) => {
        s.ry(nx * 8);
        s.rx(-ny * 8);
        s.x(nx * s.depth);
        s.y(ny * s.depth);
        s.pillX?.(nx * -6);
        s.pillY?.(ny * -6);
      });
    };
    const leave = () => {
      setters.forEach((s) => {
        s.ry(0);
        s.rx(0);
        s.x(0);
        s.y(0);
        s.pillX?.(0);
        s.pillY?.(0);
      });
    };

    stage.addEventListener('pointermove', move);
    stage.addEventListener('pointerleave', leave);
    return () => {
      stage.removeEventListener('pointermove', move);
      stage.removeEventListener('pointerleave', leave);
    };
  }, [reduced, touch]);

  return (
    <section id="manifesto" ref={sectionRef} className="relative -mt-[100svh] overflow-hidden bg-cream pb-[8vh] pt-[14vh]">
      <div className="mf-heading relative z-10 mx-auto max-w-[1200px] px-5 text-center">
        <h2 className="display text-ink text-[clamp(2.2rem,5.6vw,5.4rem)]">
          <span className="mask-line block">
            <span className="mf-line-inner block">an agency built</span>
          </span>
          <span className="mask-line block">
            <span className="mf-line-inner relative inline-block">
              for the future.
              <span className="pointer-events-none absolute -right-[1.1em] top-[.1em] hidden md:block">
                <Sticker kind="heartHands" size={SZ.manifesto} rotate={10} />
              </span>
            </span>
          </span>
          <span className="mask-line block">
            <span className="mf-line-inner relative inline-block">
              <span className="serif-i">from reels to TikTok.</span>
              <WobblyUnderline
                className="absolute -bottom-[.12em] left-0 h-[.16em] w-full text-ink"
                strokeWidth={2.6}
              />
            </span>
          </span>
        </h2>
      </div>

      <div className="relative mx-auto mt-[9vh] w-full max-w-[1400px] px-4">
        <SplatBlob
          className="pointer-events-none absolute -left-[6vw] top-[6%] w-[34vw] max-w-[440px] opacity-95"
          color="#4B63E8"
        />
        <TickMarks className="pointer-events-none absolute left-[2vw] top-[62%] w-[70px] text-ink" color="#0A0A0A" />

        <div
          ref={stageRef}
          className="fan-stage relative z-10 flex items-start justify-center"
          style={{ perspective: '1200px' }}
        >
          {CARDS.map((c, i) => (
            <div
              key={i}
              className="fan-pos relative hover:z-50"
              style={{
                width: `${c.size / 5.6}vw`,
                minWidth: 132,
                maxWidth: 300,
                transform: `rotate(${c.rotate}deg) translateY(${c.y}px)`,
                marginLeft: i === 0 ? 0 : '-3.2vw',
                zIndex: i + 1,
                transformOrigin: '50% 80%',
              }}
            >
              <div className="fan-parallax" data-speed={c.speed}>
                <div
                  className="fan-tilt group relative"
                  data-depth={c.depth}
                  style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
                >
                  <div className="fan-lift relative transition-transform duration-300 group-hover:-translate-y-[14px] group-hover:scale-[1.02]">
                    <PlaceholderPortrait
                      seed={c.seed}
                      initials={c.initials}
                      rounded={12}
                      className="aspect-[3/4] w-full border-[6px] border-cream shadow-[0_20px_40px_rgba(0,0,0,.18)]"
                    />
                    {c.pill && (
                      <span
                        className={`fan-pill absolute ${c.pill.pos} z-20 inline-block whitespace-nowrap rounded-full px-[11px] py-[6px] text-[12px] font-medium lowercase leading-none ${
                          c.pill.ink ? 'text-ink' : 'text-cream'
                        }`}
                        style={{ background: c.pill.bg, transform: `rotate(${i % 2 ? 3 : -3}deg)` }}
                      >
                        {c.pill.text}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="mf-copy mx-auto mt-[8vh] max-w-[560px] px-6 text-center text-[16px] leading-[1.45] text-ink/80">
        To reach the new generation you need to know where they are. We are a true 360° agency, working the
        whole spectrum from Instagram Reels and TikTok to TVC, and from influencer collabs to out-of-home
        spectaculars.
      </p>
    </section>
  );
}
