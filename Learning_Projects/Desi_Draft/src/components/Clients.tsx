import { useEffect, useRef } from 'react';
import { gsap } from '../lib/smooth';
import { usePrefersReducedMotion } from '../lib/hooks';
import { clients } from '../data/clients';
import { Sticker } from './art/Stickers';
import { PeriBlob } from './art/Blobs';
import { CurlyArrow } from './art/Doodles';
import { SZ } from './art/sizes';

function Tile({ name, color, text }: { name: string; color: string; text: 'cream' | 'ink' }) {
  return (
    <div
      className="group grid aspect-square w-full place-items-center rounded-[14px] px-2 transition-transform duration-300 hover:rotate-2 hover:scale-105"
      style={{ background: color, color: text === 'cream' ? '#EEEAE3' : '#0A0A0A' }}
    >
      <span className="display text-center text-[clamp(.55rem,1.05vw,.95rem)] leading-[.95]" style={{ letterSpacing: '-0.02em' }}>
        {name}
      </span>
      <span className="sr-only">{name}</span>
    </div>
  );
}

export function Clients() {
  const sectionRef = useRef<HTMLElement>(null);
  const colA = useRef<HTMLDivElement>(null);
  const colB = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        colA.current,
        { yPercent: -18 },
        {
          yPercent: 18,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
        }
      );
      gsap.fromTo(
        colB.current,
        { yPercent: 18 },
        {
          yPercent: -18,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
        }
      );
      gsap.from('.cl-tile', {
        y: 30,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.05,
        ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 70%' },
      });
    }, sectionRef.current);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="clients" ref={sectionRef} className="relative overflow-hidden bg-cream py-[10vh]">
      <div className="mx-auto grid w-full max-w-[1400px] items-center gap-12 px-6 md:grid-cols-2 md:gap-6">
        <div className="relative">
          <PeriBlob className="pointer-events-none absolute -left-[30%] top-[-10%] w-[85%] max-w-[520px] opacity-90" />
          <div className="relative z-10">
            <h2 className="display max-w-[520px] text-[clamp(2rem,4.4vw,4rem)] text-ink">
              <span className="mask-line inline-block">
                <span className="inline-block">proud to have</span>
              </span>
              <br />
              <span className="inline-block">
                <span className="serif-i">worked</span> with:
              </span>
            </h2>
            <div className="relative mt-10 flex items-start gap-2">
              <Sticker kind="fingerHeart" size={SZ.clients} rotate={-8} />
              <CurlyArrow className="mt-2 w-[190px] text-ink" color="#0A0A0A" />
            </div>
          </div>
        </div>

        <div className="mask-fade-y relative h-[62vh] overflow-hidden md:h-[70vh]">
          <div className="grid h-full grid-cols-2 gap-3">
            <div ref={colA} className="will-change-transform">
              <div className="grid gap-3" style={{ animation: 'clDrift 22s ease-in-out infinite alternate' }}>
                {clients.slice(0, 5).map((c, i) => (
                  <div key={c.name} className="cl-tile">
                    <Tile {...c} />
                  </div>
                ))}
              </div>
            </div>
            <div ref={colB} className="mt-[60px] will-change-transform">
              <div className="grid gap-3" style={{ animation: 'clDrift 26s ease-in-out infinite alternate-reverse' }}>
                {clients.slice(5).map((c, i) => (
                  <div key={c.name + i} className="cl-tile">
                    <Tile {...c} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
