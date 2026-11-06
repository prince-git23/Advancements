import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/smooth';
import { usePrefersReducedMotion } from '../lib/hooks';
import { team } from '../data/team';
import { PlaceholderPortrait } from './Placeholder';
import { Sticker } from './art/Stickers';
import { CloverBlob, SplatBlob } from './art/Blobs';
import { LoopArrow, Squiggle, TickMarks } from './art/Doodles';
import { SZ } from './art/sizes';

function useDesktop() {
  const [desktop, setDesktop] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const on = () => setDesktop(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return desktop;
}

export function Team() {
  const sectionRef = useRef<HTMLElement>(null);
  const collageRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const desktop = useDesktop();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced) return;

    const ctx = gsap.context(() => {
      gsap.from('.tm-line-inner', {
        yPercent: 110,
        duration: 1.1,
        ease: 'power4.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '.tm-heading', start: 'top 85%' },
      });
      gsap.from('.tm-blob', {
        scale: 0.6,
        autoAlpha: 0,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: { trigger: collageRef.current, start: 'top 80%' },
      });

      const photos = gsap.utils.toArray<HTMLElement>('.tm-photo');
      photos.forEach((el) => {
        const speed = Number(el.dataset.speed ?? 1);
        const dist = (speed - 1) * (desktop ? 380 : 160);
        gsap.fromTo(
          el,
          { y: dist * 0.6 },
          {
            y: -dist,
            ease: 'none',
            scrollTrigger: { trigger: collageRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        );
      });
    }, sectionRef.current);

    return () => ctx.revert();
  }, [reduced, desktop]);

  const portrait = (m: (typeof team)[number], i: number) => (
    <div
      key={i}
      className="tm-photo group absolute"
      data-speed={m.speed}
      style={{ left: `${m.x}%`, top: `${m.y}%`, width: m.size, zIndex: 10 + (i % 7) }}
    >
      <div className="relative">
        <PlaceholderPortrait
          seed={i}
          initials={m.initials}
          rounded={12}
          className="aspect-[4/5] w-full shadow-[0_16px_40px_rgba(0,0,0,.35)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-2 group-hover:scale-[1.06]"
        />
        <span className="pointer-events-none absolute bottom-2 left-2 origin-bottom-left scale-90 rounded-full bg-lilac px-3 py-1.5 text-[11px] font-medium lowercase leading-none text-ink opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
          {m.name} · {m.role}
        </span>
        {m.sticker && (
          <span className="pointer-events-none absolute -right-4 -top-4 transition-transform duration-300 group-hover:rotate-6">
            <Sticker kind={m.sticker} size={SZ.team} rotate={i % 2 ? 8 : -10} />
          </span>
        )}
      </div>
    </div>
  );

  return (
    <section id="team" ref={sectionRef} className="relative overflow-hidden bg-ink pt-[12vh]">
      <div className="tm-heading relative z-20 mx-auto max-w-[900px] px-5 text-center">
        <h2 className="display text-cream text-[clamp(1.9rem,4.4vw,4.2rem)]">
          <span className="mask-line block">
            <span className="tm-line-inner block">
              we are a <span className="serif-i">young,</span> future-proof
            </span>
          </span>
          <span className="mask-line block">
            <span className="tm-line-inner block">team of 42 digitally native</span>
          </span>
          <span className="mask-line block">
            <span className="tm-line-inner block">
              <span className="serif-i">creators.</span> not to brag!
            </span>
          </span>
        </h2>
      </div>

      {desktop ? (
        <div
          ref={collageRef}
          className="relative mx-auto mt-[10vh] w-full max-w-[1600px]"
          style={{ height: '450vh' }}
        >
          <CloverBlob className="tm-blob pointer-events-none absolute right-[1%] top-[8%] w-[40vw] max-w-[560px]" />
          <SplatBlob className="tm-blob pointer-events-none absolute -left-[12vw] top-[42%] w-[36vw] max-w-[480px]" />
          <Squiggle className="pointer-events-none absolute left-[42%] top-[24%] w-[150px] text-cream/80" color="#EEEAE3" />
          <LoopArrow className="pointer-events-none absolute right-[8%] top-[58%] w-[190px] text-cream/70" color="#EEEAE3" />
          <TickMarks className="pointer-events-none absolute left-[8%] top-[70%] w-[80px]" color="#EEEAE3" />

          {team.map(portrait)}
        </div>
      ) : (
        <div ref={collageRef} className="relative mt-12 grid grid-cols-2 gap-3 px-4 pb-16">
          <CloverBlob className="tm-blob pointer-events-none absolute -right-[20%] top-[10%] w-[70vw] opacity-80" />
          <SplatBlob className="tm-blob pointer-events-none absolute -left-[22%] top-[46%] w-[60vw] opacity-90" />
          {team.slice(0, 12).map((m, i) => (
            <div key={i} className={`tm-photo relative ${i % 2 ? 'mt-8' : ''}`} data-speed={1 + (m.speed - 1) * 0.5}>
              <div className="relative">
                <PlaceholderPortrait
                  seed={i}
                  initials={m.initials}
                  rounded={12}
                  className="aspect-[4/5] w-full"
                />
                {m.sticker && (
                  <span className="absolute -right-2 -top-3">
                    <Sticker kind={m.sticker} size={SZ.teamSmall} rotate={i % 2 ? 8 : -10} />
                  </span>
                )}
              </div>
              <p className="mt-2 text-[11px] lowercase leading-tight text-cream/70">
                {m.name} · {m.role}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
