import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/smooth';
import { usePrefersReducedMotion } from '../lib/hooks';
import { Sticker } from './art/Stickers';
import { LoopArrow } from './art/Doodles';
import { SZ } from './art/sizes';

const SENTENCE = 'we wanna be where the people are';
const P_INDEX = SENTENCE.indexOf('people');

const rand = (n: number) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};

export function Intro() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const line = lineRef.current;
    if (!section || !line || reduced) return;

    const ctx = gsap.context(() => {
      const letters = Array.from(line.querySelectorAll<HTMLElement>('.intro-char'));
      const stickers = Array.from(line.querySelectorAll<HTMLElement>('.intro-sticker'));
      let metrics = letters.map((l) => ({ left: l.offsetLeft, w: l.offsetWidth }));

      const render = (p: number) => {
        const vw = window.innerWidth;
        const lineW = line.scrollWidth || 1;
        const x = vw * 0.92 - p * (lineW + vw * 1.05);
        line.style.transform = `translate3d(${x}px,0,0)`;

        letters.forEach((el, i) => {
          const m = metrics[i];
          if (!m) return;
          const screenCenter = x + m.left + m.w / 2;
          const d = (screenCenter - vw / 2) / (vw * 0.52);
          const enter = Math.min(Math.max(d, 0), 1.5);
          const exit = Math.max(0, Math.min((-d - 0.18) / 0.9, 1.25));
          const seedA = rand(i + 1);
          const seedB = rand(i + 21);
          const seedC = rand(i + 41);

          let y = seedA * 120 * enter - 12;
          let rot = seedB * 34 * enter;
          let scale = 1 + 0.16 * enter;
          y += exit * exit * 175 * (0.55 + seedC * 0.8);
          rot -= seedC * 30 * exit;
          scale -= 0.05 * exit;

          // the P of "people" is extra bouncy
          if (i >= P_INDEX && i < P_INDEX + 6 && SENTENCE[i] === 'p') {
            y *= 1.35;
            scale += 0.1;
          }
          el.style.transform = `translate3d(0,${y.toFixed(2)}px,0) rotate(${rot.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        });

        stickers.forEach((el, i) => {
          const py = Math.sin(p * Math.PI * 2.2 + i * 1.7) * 12;
          const px = Math.cos(p * Math.PI * 1.6 + i) * 8;
          el.style.transform = `translate3d(${px.toFixed(2)}px,${py.toFixed(2)}px,0)`;
        });

        if (paragraphRef.current) {
          const fade = p < 0.84 ? 1 : Math.max(0, 1 - (p - 0.84) / 0.14);
          paragraphRef.current.style.opacity = `${fade}`;
          paragraphRef.current.style.transform = `translate3d(0,${(1 - fade) * -60}px,0)`;
        }
      };

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=300%',
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => render(self.progress),
        onRefresh: (self) => {
          metrics = letters.map((l) => ({ left: l.offsetLeft, w: l.offsetWidth }));
          render(self.progress);
        },
      });

      gsap.set('.intro-ui', { autoAlpha: 0, y: 20 });
      gsap.to('.intro-ui', {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top top', end: '+=12%', scrub: true },
      });

      render(0);
    }, sectionRef.current);

    return () => ctx.revert();
  }, [reduced]);

  const chars = SENTENCE.split('').map((ch, i) => {
    const isP = i >= P_INDEX && i < P_INDEX + 6 && ch === 'p';
    return (
      <span
        key={i}
        className={`intro-char inline-block will-change-transform ${isP ? 'text-[1.1em]' : ''}`}
        aria-hidden="true"
      >
        {ch === ' ' ? '\u00A0' : ch}
      </span>
    );
  });

  return (
    <section id="intro" ref={sectionRef} className="relative -mt-[75svh] bg-cream">
      <div className="relative h-[100svh] overflow-hidden">
        {reduced ? (
          <div className="flex h-full flex-col items-center justify-center gap-10 px-6">
            <p className="display max-w-[1100px] text-center text-[clamp(2.4rem,8vw,6rem)] text-ink">
              we wanna be where the people are
            </p>
            <p className="max-w-[420px] text-center text-[16px] leading-[1.4] text-ink/75">
              Audiences are more scattered <em className="serif-i">and</em> more reachable than ever. We
              help brands become leaders on the channels of the new mainstream.
            </p>
          </div>
        ) : (
          <>
            <div
              ref={lineRef}
              className="pointer-events-none absolute left-0 top-[36%] whitespace-nowrap will-change-transform"
              style={{ fontSize: 'clamp(3rem,12vw,13rem)' }}
              aria-label={SENTENCE}
            >
              <span className="display relative block text-ink">{chars}</span>

              <div className="intro-sticker absolute left-[9%] top-[-0.95em]">
                <Sticker kind="thumbsUp" size={SZ.intro} rotate={-10} />
              </div>

              <div className="intro-sticker absolute left-[25%] top-[-1.8em] w-[clamp(120px,16vw,240px)]">
                <LoopArrow className="w-full text-ink" strokeWidth={3.6} />
              </div>

              <div className="intro-sticker absolute left-[35%] top-[1.05em]">
                <Sticker kind="cursor" size={SZ.intro} rotate={8} />
              </div>

              <div className="intro-sticker absolute left-[64%] top-[0.6em]">
                <Sticker kind="phone" size={SZ.intro} rotate={-10} />
              </div>
            </div>

            <div className="intro-ui absolute inset-x-0 top-[64%] flex justify-center px-6">
              <p
                ref={paragraphRef}
                className="w-[min(420px,84vw)] text-center text-[16px] leading-[1.4] text-ink/80"
              >
                Audiences are more scattered <em className="serif-i">and</em> more reachable than ever. We
                help brands become leaders on the channels of the new mainstream.
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
