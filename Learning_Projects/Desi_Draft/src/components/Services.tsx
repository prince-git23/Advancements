import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/smooth';
import { useIsTouch, usePrefersReducedMotion } from '../lib/hooks';
import { services } from '../data/site';
import { Sticker } from './art/Stickers';
import { WobblyRule } from './art/Doodles';
import { SZ } from './art/sizes';

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const pileRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const touch = useIsTouch();
  const reduced = usePrefersReducedMotion();

  const rest = (i: number) => ({
    x: 0,
    y: services[i].offsetY,
    rotation: services[i].rotate,
  });

  const apply = (next: number | null) => {
    if (touch) {
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          y: next === i ? services[i].offsetY - 6 : services[i].offsetY,
          rotation: next === i ? 0 : services[i].rotate,
          scale: next === i ? 1.04 : 1,
          duration: 0.4,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      });
      return;
    }
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      if (next === null) {
        gsap.to(el, {
          ...rest(i),
          scale: 1,
          zIndex: i + 1,
          duration: 0.6,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      } else if (i === next) {
        gsap.to(el, {
          x: 0,
          y: services[i].offsetY - 40,
          rotation: 0,
          scale: 1.25,
          zIndex: 60,
          duration: 0.5,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      } else {
        const dist = i - next;
        const push = 118 + Math.max(0, Math.abs(dist) - 1) * 14;
        gsap.to(el, {
          x: dist < 0 ? -push : push,
          y: services[i].offsetY + 6,
          rotation: 0,
          scale: 1,
          zIndex: 20 - Math.abs(dist),
          duration: 0.5,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      }
    });
  };

  useEffect(() => {
    const section = sectionRef.current;
    const pile = pileRef.current;
    if (!section || !pile) return;

    cardRefs.current.forEach((el, i) => {
      if (el) gsap.set(el, { ...rest(i), transformOrigin: '50% 60%' });
    });

    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.from('.svc-card', {
        y: touch ? 40 : 150,
        autoAlpha: 0,
        duration: touch ? 0.55 : 0.85,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: pile, start: 'top 88%' },
      });
      gsap.from('.svc-head-inner', {
        yPercent: 110,
        duration: 1.05,
        ease: 'power4.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '.svc-heading', start: 'top 85%' },
      });
    }, sectionRef.current);
    return () => ctx.revert();
  }, [reduced, touch]);

  useEffect(() => {
    apply(active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative overflow-hidden bg-cream pb-[10vh] pt-[14vh]"
    >
      <div className="svc-heading mx-auto mb-[8vh] max-w-[1200px] px-5 text-center">
        <h2 className="display text-ink text-[clamp(2rem,4.6vw,4rem)]">
          <span className="mask-line inline-block">
            <span className="svc-head-inner inline-block">call us if you&nbsp;</span>
          </span>
          <span className="mask-line inline-block">
            <span className="svc-head-inner serif-i inline-block">need:</span>
          </span>
        </h2>
      </div>

      <div className="relative">
        <div
          ref={pileRef}
          className="no-scrollbar mx-auto flex w-full max-w-[1500px] items-start justify-center overflow-x-auto px-6 pb-24 pt-16 md:overflow-visible md:pb-32"
          onPointerLeave={() => {
            if (!touch) setActive(null);
          }}
        >
          {services.map((s, i) => (
            <div
              key={s.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              onPointerEnter={() => {
                if (!touch) setActive(i);
              }}
              onClick={() => {
                if (touch) setActive((cur) => (cur === i ? null : i));
              }}
              className="svc-card relative w-[74vw] shrink-0 cursor-pointer rounded-[16px] p-7 md:w-[230px] md:min-h-[340px]"
              style={{
                background: s.bg,
                color: s.text,
                marginLeft: i === 0 ? 0 : undefined,
                zIndex: i + 1,
                boxShadow: '0 16px 34px rgba(0,0,0,.14)',
                // overlap on desktop
                ['--overlap' as string]: '-118px',
                transitionProperty: 'box-shadow',
              }}
              data-active={active === i}
            >
              <div className="pointer-events-none absolute -right-4 -top-8 z-20" style={{ animation: active === i ? 'stickerWiggle .5s ease' : undefined }}>
                <Sticker kind={s.sticker} size={SZ.services} rotate={i % 2 ? 10 : -8} />
              </div>

              <h3 className="display mb-4 text-[26px] leading-[.95]">{s.title}</h3>
              <WobblyRule className="mb-4 h-[14px] w-full" color="currentColor" strokeWidth={2.2} />
              <ul className="space-y-[7px]">
                {s.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[15px] leading-[1.3] md:text-[16px]">
                    <span className="mt-[3px] text-[10px] leading-none">✦</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .svc-card + .svc-card { margin-left: -118px; }
        }
      `}</style>
    </section>
  );
}
