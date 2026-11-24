import { useEffect, useRef } from 'react';
import { gsap } from '../lib/smooth';
import { usePrefersReducedMotion } from '../lib/hooks';
import { Chapter } from './ui/Chapter';
import { PillarsFan } from './PillarsFan';

/**
 * "the thinking" — the studio's five creative pillars, in the order the work
 * happens. The heading and the closing paragraph are unchanged; the four
 * monogram cards were replaced by five image cards that carry the disciplines.
 */
export function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced) return;

    const ctx = gsap.context(() => {
      // The mask box carries 0.2em of bottom padding so descenders survive;
      // the line therefore travels a little further to stay hidden at rest.
      gsap.from('.mf-line-inner', {
        yPercent: 132,
        duration: 1.1,
        ease: 'power4.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '.mf-heading', start: 'top 82%' },
      });


    }, sectionRef.current);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      data-theme="digital"
      className="relative overflow-hidden bg-cream pb-[5vh] pt-[7vh] motion-safe:-mt-[100svh] md:pb-[6vh] md:pt-[9vh]"
    >
      <div className="mf-heading dd-pad relative z-10 mx-auto max-w-[1200px] text-center">
        <Chapter no="02" name="the thinking" align="center" className="mb-5" />
        {/* The laptop scale is 5.2vw → 72px. On a phone that floor of 35.2px
            left the italic third line all but touching both gutters at 320, so
            below 768 the heading is 8.6vw with a 37.6px cap — the same optical
            size on a 390 screen, with room to breathe at 320. */}
        <h2 className="display text-ink text-[clamp(1.75rem,8.6vw,2.35rem)] md:text-[clamp(2.4rem,5.2vw,4.5rem)]">
          <span className="mask-line -mb-[0.2em] block pb-[0.2em]">
            <span className="mf-line-inner block">a studio built</span>
          </span>
          <span className="mask-line -mb-[0.2em] block pb-[0.2em]">
            <span className="mf-line-inner block">for the feed.</span>
          </span>
          <span className="mask-line -mb-[0.2em] block pb-[0.2em]">
            <span className="mf-line-inner relative inline-block">
              <span className="serif-i">from first frame to cut.</span>
            </span>
          </span>
        </h2>
      </div>

      <div className="dd-pad relative mx-auto mt-[1.5vh] w-full max-w-[1400px] md:mt-[2.5vh]">
        <PillarsFan />
      </div>
    </section>
  );
}
