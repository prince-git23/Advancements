import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from '../lib/smooth';
import { usePrefersReducedMotion } from '../lib/hooks';
import { serviceGroups } from '../data/site';
import { EnquiryButton } from './ContactDialog';
import { Chapter } from './ui/Chapter';
import { AccordionGallery } from './ui/AccordionGallery';

/**
 * Services as an accordion gallery: one wide panel of work, four slim spines
 * that still name their discipline. The data is untouched — every title,
 * description, feature and evidence link is read from `serviceGroups`.
 */
export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced) return;

    const ctx = gsap.context(() => {
      // 135%, not 110%: the mask box is 0.2em taller than the line so
      // descenders are not cut off, and the line has to clear that too.
      gsap.from('.svc-head-inner', {
        yPercent: 135,
        duration: 1,
        ease: 'power4.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '.svc-heading', start: 'top 86%', once: true },
      });
      gsap.from('.svc-gallery', {
        y: 30,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.svc-gallery', start: 'top 88%', once: true },
      });
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="services"
      ref={sectionRef}
      data-theme="studio"
      className="relative scroll-mt-[72px] bg-cream pb-[7vh] pt-[6vh] text-ink md:pb-[8vh] md:pt-[7vh]"
    >
      <div className="dd-page">
        <Chapter no="03" name="the making" className="mb-4" />
        <div className="svc-heading grid gap-6 border-t border-ink/20 pt-5 md:grid-cols-12 md:items-end">
          <h2 className="display type-section md:col-span-7">
            <span className="mask-line -mb-[0.2em] block pb-[0.2em]">
              <span className="svc-head-inner block">five things,</span>
            </span>
            <span className="mask-line -mb-[0.2em] block pb-[0.2em]">
              <span className="svc-head-inner block">
                done <span className="serif-i">properly.</span>
              </span>
            </span>
          </h2>
          <p className="lede max-w-[42ch] text-ink/70 md:col-span-5 md:justify-self-end">
            A service is a promise; the portfolio is the evidence. Every group below has a project or a
            format behind it — and we tell you which.
          </p>
        </div>

        <div className="svc-gallery mt-9">
          <AccordionGallery items={serviceGroups} />
        </div>

        <div className="mt-9 flex flex-col items-start justify-between gap-5 border-t border-ink/20 pt-6 sm:flex-row sm:items-center">
          <p className="max-w-[38ch] text-[15px] leading-[1.5] text-ink/65">
            Not sure which you need? Bring the brief — we will tell you what we would actually do, including
            what to cut.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <EnquiryButton subject="Project enquiry — services" className="btn btn-primary">
              start a conversation
              <span className="btn-arrow" aria-hidden="true">
                →
              </span>
            </EnquiryButton>
            <Link to="/work" className="btn btn-secondary">
              see all work
              <span className="btn-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
