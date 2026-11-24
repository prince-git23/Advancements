import { publishedTestimonials } from '../data/testimonials';
import { Chapter } from './ui/Chapter';
import KineticTestimonials, { type KineticTestimonial } from './ui/KineticTestimonials';

/**
 * Testimonials — between Team and Footer.
 *
 * Every record that reaches this component is approved, quoted and
 * portrait-cleared (`publishedTestimonials`), so there is no draft path and no
 * placeholder copy: a card with nothing to say simply is not rendered.
 */

export function Testimonials() {
  if (!publishedTestimonials.length) return null;

  const cards: KineticTestimonial[] = publishedTestimonials.map((record) => ({
    name: record.name,
    review: record.review,
    avatar: record.avatar,
    handle: [record.role, record.company].filter(Boolean).join(', '),
    project: record.project,
  }));

  return (
    <section id="testimonials" aria-label="Testimonials" className="kt-section">
      <div className="kt-shell">
        <Chapter no="06" name="the reviews" />
        <KineticTestimonials
          testimonials={cards}
          desktopColumns={3}
          tabletColumns={3}
          mobileColumns={1}
          /* Desktop/laptop travel 1.35× the base rate; the component steps the
             rate down for tablet (0.72×) and phone (0.5×) on its own. */
          speed={1.35}
          title="good work speaks."
          subtitle="so do the people behind it."
          description="Real experiences from the people we’ve worked with."
        />
      </div>
    </section>
  );
}
