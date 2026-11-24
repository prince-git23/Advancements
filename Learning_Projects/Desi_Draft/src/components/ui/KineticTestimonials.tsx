import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePrefersReducedMotion } from '../../lib/hooks';
import './KineticTestimonials.css';

/**
 * Kinetic Testimonials — adapted from the ScrollX UI component
 * (scrollxui.dev/docs/components/kinetic-testimonials).
 *
 * Kept: the public API (testimonials, className, cardClassName,
 * avatarClassName, desktopColumns, tabletColumns, mobileColumns, speed, title,
 * subtitle), vertical columns in alternating directions, duplicated tracks for
 * a seamless loop, and the `kt-up` / `kt-down` keyframes.
 *
 * Changed for this site:
 *  - No shadcn Card/Avatar or purple gradients; the card is the studio's own.
 *  - One breakpoint set computed in JS instead of five duplicated DOM trees.
 *  - `speed` is a multiplier on a fixed pixels-per-second rate, and each
 *    column's duration is measured from its real height, so a long quotation
 *    or a different column count never changes how fast a card travels.
 *    Laptop/desktop run at full speed, tablet slower, phone slowest.
 *  - Hover and keyboard focus pause the tracks; reduced motion renders a static
 *    grid of the same cards.
 *  - Repeated cards in the loop are aria-hidden so screen readers hear each
 *    testimonial once.
 */

export type KineticTestimonial = {
  name: string;
  review: string;
  avatar: string;
  /** Role and company, printed under the name. */
  handle?: string;
  project?: { label: string; href: string } | null;
  draft?: boolean;
};

type Props = {
  testimonials?: KineticTestimonial[];
  className?: string;
  cardClassName?: string;
  avatarClassName?: string;
  desktopColumns?: number;
  tabletColumns?: number;
  mobileColumns?: number;
  /** Desktop/laptop speed multiplier. 1 = 38px/s of travel. */
  speed?: number;
  tabletSpeed?: number;
  mobileSpeed?: number;
  title?: string;
  subtitle?: string;
  description?: string;
  /** Shown under the description, e.g. a draft-preview disclaimer. */
  notice?: string;
};

const CARD_GAP = 18;
/** Conservative average card height, used only to size the loop. */
const CARD_ESTIMATE = 264;
/** Pixels per second of travel at speed 1. At the 1.35 desktop multiplier
 *  this is ~51px/s — roughly 1.8× the old 21px/s base, which read as stalled. */
const BASE_PPS = 38;

type Tier = 'desktop' | 'tablet' | 'mobile';

function useLayout(desktop: number, tablet: number, mobile: number) {
  const read = (): { columns: number; height: number; tier: Tier } => {
    if (typeof window === 'undefined') return { columns: desktop, height: 760, tier: 'desktop' };
    const w = window.innerWidth;
    // 1024 is a laptop, not a tablet: it keeps the desktop pace and three
    // columns. 768–1023 gets two wider cards and the moderate pace.
    if (w >= 1024) return { columns: desktop, height: 760, tier: 'desktop' };
    if (w >= 768) return { columns: Math.min(tablet, 2), height: 700, tier: 'tablet' };
    if (w >= 640) return { columns: Math.min(tablet, 2), height: 620, tier: 'tablet' };
    return { columns: mobile, height: 540, tier: 'mobile' };
  };
  const [layout, setLayout] = useState(read);
  useEffect(() => {
    const onChange = () => setLayout(read());
    window.addEventListener('resize', onChange);
    return () => window.removeEventListener('resize', onChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desktop, tablet, mobile]);
  return layout;
}

function Avatar({ src, name, className }: { src: string; name: string; className: string }) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2);

  return (
    <span className={`kt-avatar ${className}`.trim()} aria-hidden="true">
      {failed ? (
        <span className="kt-avatar__fallback">{initials}</span>
      ) : (
        <img
          src={src}
          alt=""
          width={96}
          height={96}
          // Nine small portraits are reused across the loop; loading them with
          // the section avoids blank avatars as cards scroll in.
          loading="eager"
          fetchPriority="low"
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}

function Card({
  testimonial,
  index,
  cardClassName,
  avatarClassName,
  clone = false,
}: {
  testimonial: KineticTestimonial;
  index: number;
  cardClassName: string;
  avatarClassName: string;
  clone?: boolean;
}) {
  return (
    <figure
      className={`kt-card ${cardClassName}`.trim()}
      data-accent={index % 5}
      aria-hidden={clone || undefined}
    >
      <span className="kt-mark" aria-hidden="true">
        “
      </span>
      <blockquote className="kt-review">{testimonial.review}</blockquote>
      <figcaption className="kt-person">
        <Avatar src={testimonial.avatar} name={testimonial.name} className={avatarClassName} />
        <span className="kt-who">
          <span className="kt-name">{testimonial.name}</span>
          {testimonial.handle ? <span className="kt-handle">{testimonial.handle}</span> : null}
        </span>
      </figcaption>
      {testimonial.project && !clone ? (
        <Link className="kt-project" to={testimonial.project.href}>
          {testimonial.project.label}
          <span aria-hidden="true">→</span>
        </Link>
      ) : null}
      {testimonial.draft ? <span className="kt-draft">draft</span> : null}
    </figure>
  );
}

export default function KineticTestimonials({
  testimonials = [],
  className = '',
  cardClassName = '',
  avatarClassName = '',
  desktopColumns = 3,
  tabletColumns = 3,
  mobileColumns = 2,
  speed = 1.35,
  tabletSpeed,
  mobileSpeed,
  title = 'good work speaks.',
  subtitle = 'so do the people behind it.',
  description = '',
  notice = '',
}: Props) {
  const reduced = usePrefersReducedMotion();
  const { columns, height, tier } = useLayout(desktopColumns, tabletColumns, mobileColumns);

  /** Round-robin the records, repeat them until the loop is taller than the
   *  window, then duplicate the whole run so translateY(-50%) is seamless. */
  const columnData = useMemo(() => {
    if (!testimonials.length) return [];
    const count = Math.max(1, Math.min(columns, testimonials.length));
    const sets: KineticTestimonial[][] = Array.from({ length: count }, () => []);
    testimonials.forEach((t, i) => sets[i % count].push(t));

    return sets.map((set) => {
      // Half the track must be taller than the window, or the loop would show
      // a gap at its seam. The extra 160px is headroom for taller quotations.
      const repeats = Math.max(
        1,
        Math.ceil((height + 160) / Math.max(1, set.length * (CARD_ESTIMATE + CARD_GAP)))
      );
      const run = Array.from({ length: repeats }, () => set).flat();
      return run;
    });
  }, [testimonials, columns, height]);

  const effectiveSpeed = Math.max(
    0.2,
    tier === 'desktop'
      ? speed
      : tier === 'tablet'
        ? (tabletSpeed ?? speed * 0.75)
        : (mobileSpeed ?? speed * 0.6)
  );
  const pps = BASE_PPS * effectiveSpeed;

  // Measured half-track heights → duration, so travel speed stays constant even
  // when a quotation wraps to an extra line or a column gets an extra card.
  const groupRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [durations, setDurations] = useState<number[]>([]);

  useEffect(() => {
    if (reduced) return;
    const measure = () => {
      const next = groupRefs.current.map((el) => {
        const h = el?.getBoundingClientRect().height ?? 0;
        return h > 0 ? Math.max(9, Math.round(h / pps)) : 0;
      });
      if (!next.length) return;
      setDurations((prev) =>
        prev.length === next.length && prev.every((v, i) => v === next[i]) ? prev : next
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    groupRefs.current.forEach((el) => el && ro.observe(el));
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [pps, columnData, reduced]);

  if (!testimonials.length) return null;

  const heading = (
    <header className="kt-head">
      <h2 className="display type-section kt-title">{title}</h2>
      <p className="kt-sub serif-i">{subtitle}</p>
      {description ? <p className="kt-desc">{description}</p> : null}
      {notice ? <p className="kt-notice">{notice}</p> : null}
    </header>
  );

  if (reduced) {
    return (
      <div className={`kt ${className}`.trim()}>
        {heading}
        <div className="kt-static">
          {testimonials.map((t, i) => (
            <Card
              key={`static-${i}`}
              testimonial={t}
              index={i}
              cardClassName={cardClassName}
              avatarClassName={avatarClassName}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`kt ${className}`.trim()}>
      {heading}
      <div className="kt-marquee" style={{ height }}>
        {columnData.map((run, col) => {
          // Before the first measurement, fall back to the estimated length so
          // the first frame never animates at a zero duration.
          const fallback = Math.max(
            9,
            Math.round((run.length * (CARD_ESTIMATE + CARD_GAP)) / pps)
          );
          return (
            <div className="kt-col" key={`col-${col}`}>
              <div
                className={`kt-track ${col % 2 === 0 ? 'kt-track--up' : 'kt-track--down'}`}
                style={{ animationDuration: `${durations[col] || fallback}s` }}
              >
                <div
                  className="kt-group"
                  ref={(el) => {
                    groupRefs.current[col] = el;
                  }}
                >
                  {run.map((t, i) => (
                    <Card
                      key={`${col}-a-${i}-${t.name}`}
                      testimonial={t}
                      index={col * 3 + i}
                      cardClassName={cardClassName}
                      avatarClassName={avatarClassName}
                    />
                  ))}
                </div>
                <div className="kt-group" aria-hidden="true">
                  {run.map((t, i) => (
                    <Card
                      key={`${col}-b-${i}-${t.name}`}
                      testimonial={t}
                      index={col * 3 + i}
                      cardClassName={cardClassName}
                      avatarClassName={avatarClassName}
                      clone
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
