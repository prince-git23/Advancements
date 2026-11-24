import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { gsap } from '../lib/smooth';
import { usePrefersReducedMotion } from '../lib/hooks';
import { pillars } from '../data/pillars';

/**
 * Five discipline cards as one editorial fan.
 *
 * Geometry is measured from the container, never hard-coded: a ResizeObserver
 * reads the row's width and derives the card width, step, rotation, lift and
 * separation from it, so the fan fills the content column at any viewport,
 * with no card ever leaving the section. The entrance is the only GSAP work
 * (staggered, back-eased); separation and hover are CSS transitions on
 * transform, so the two never fight.
 *
 *  ≥1024: five overlapping cards, ±6° fan, hover separates the row.
 *  <1024: a horizontal snap strip — two cards and a peek on a tablet, one and
 *  a peek on a phone; tap a card to bring it forward. The strip scrolls itself,
 *  so vertical page scrolling is untouched. Five cards cannot hold their copy
 *  side by side under 1024 (each fell to ~139 px at 768 and the next card
 *  covered the text), so the fan stops where it stops being readable.
 */

type Geometry = {
  mode: 'fan' | 'strip';
  cardW: number;
  step: number;
  /** Maximum rotation, carried by the two outer cards. */
  rot: number;
  drop: number;
  sep: number;
  lift: number;
  /** Text inset, wide enough to clear the neighbour and the rotated corner. */
  pad: number;
  padTop: number;
  padBottom: number;
};

const FALLBACK: Geometry = {
  mode: 'fan',
  cardW: 268,
  step: 230,
  rot: 6,
  drop: 22,
  sep: 32,
  lift: 16,
  pad: 58,
  padTop: 32,
  padBottom: 52,
};

const ASPECT = 1.25; // 4:5 portrait

function measure(cw: number): Geometry {
  const fan = window.matchMedia('(min-width: 1024px)').matches;
  if (!fan) {
    const phone = window.matchMedia('(max-width: 767px)').matches;
    const cardW = Math.round(phone ? Math.min(cw * 0.8, 300) : Math.min(cw * 0.62, 420));
    return {
      mode: 'strip',
      cardW,
      step: cardW + 12,
      rot: 0,
      drop: 0,
      sep: 0,
      lift: 8,
      pad: phone ? 20 : 24,
      padTop: 12,
      padBottom: 16,
    };
  }

  // The fan only runs at ≥1024, where five cards keep a readable text column;
  // the 14% overlap is what makes it read as one stack rather than five.
  const overlap = 0.14;
  // Maximum rotation for the outer cards; each step uses half of it, so the
  // fan reads as a fan without any card tipping far enough to expose its back.
  const rot = 6;
  const drop = 22;
  const lift = 16;

  // Reserve the room the row needs when it separates on hover.
  const sepGuess = Math.min(38, cw * 0.025);
  const cardW = Math.round((cw * 0.97 - 2 * sepGuess) / (5 - 4 * overlap));
  const step = Math.round(cardW * (1 - overlap));
  const sep = Math.min(38, cardW * 0.12);
  const h = cardW * ASPECT;
  const corner = (h * Math.sin((rot * Math.PI) / 180)) / 2;
  const pad = Math.round(cardW - step + corner + 10);

  return {
    mode: 'fan',
    cardW,
    step,
    rot,
    drop,
    sep,
    lift,
    pad,
    padTop: Math.round(drop + corner),
    padBottom: Math.round(drop + corner + 8),
  };
}

export function PillarsFan() {
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [geo, setGeo] = useState<Geometry>(FALLBACK);
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const active = hovered ?? selected;

  // One measured source of truth for the layout. Reads are rAF-coalesced so a
  // drag-resize cannot queue a state update per observer callback.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let frame = 0;

    const read = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const cw = stage.clientWidth;
        if (cw > 0) setGeo(measure(cw));
      });
    };

    const ro = new ResizeObserver(read);
    ro.observe(stage);
    window.addEventListener('orientationchange', read);
    read();

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener('orientationchange', read);
    };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(stage.querySelectorAll('.pillar-inner'), {
        y: 54,
        autoAlpha: 0,
        scale: 0.94,
        rotate: (i: number) => (i - 2) * 2.5,
        duration: 0.85,
        ease: 'back.out(1.4)',
        stagger: 0.08,
        scrollTrigger: { trigger: stage, start: 'top 84%', once: true },
      });
    }, stage);

    return () => ctx.revert();
  }, [reduced]);

  const fan = geo.mode === 'fan';

  return (
    <div ref={stageRef} className="pillars-stage">
      <ul
        className="pillars no-scrollbar"
        data-mode={geo.mode}
        role="list"
        style={
          {
            '--card-w': `${geo.cardW}px`,
            '--text-pad': `${geo.pad}px`,
            paddingTop: fan ? `${geo.padTop}px` : undefined,
            paddingBottom: fan ? `${geo.padBottom}px` : undefined,
          } as CSSProperties
        }
      >
        {pillars.map((p, i) => {
          const off = i - 2;
          const isActive = active === i;
          // Neighbours step away from the active card; the extremes keep their
          // reserved gutter, so nothing crosses the section edge.
          const dx =
            !fan || active === null || isActive
              ? 0
              : (i < active ? -geo.sep : geo.sep);
          const dy = isActive ? -geo.lift : Math.abs(off) * geo.drop;
          const rot = isActive ? 0 : off * (geo.rot / 2);
          const scale = isActive ? 1.035 : 1;

          return (
            <li
              key={p.id}
              className="pillar-slot"
              style={{ marginLeft: i === 0 || !fan ? 0 : -(geo.cardW - geo.step) }}
            >
              <button
                type="button"
                className="pillar"
                style={
                  {
                    '--dx': `${dx}px`,
                    '--dy': `${dy}px`,
                    '--rot': `${rot}deg`,
                    '--sc': scale,
                    '--z': 5 - Math.abs(off),
                    '--accent': p.accent,
                  } as CSSProperties
                }
                data-active={isActive ? 'true' : undefined}
                aria-pressed={selected === i}
                aria-label={`${p.no} ${p.title} — ${p.copy}`}
                onClick={() => setSelected((s) => (s === i ? null : i))}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
              >
                <span className="pillar-inner">
                  <img
                    src={p.image}
                    alt={p.alt}
                    width={880}
                    height={1100}
                    loading={i < 2 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="pillar-img"
                    style={{ objectPosition: p.position }}
                  />
                  <span className="pillar-veil" aria-hidden="true" />
                  <span className="pillar-text">
                    <span className="flex items-center gap-2 text-cream/70">
                      <span className="pillar-no">{p.no}</span>
                      <span className="pillar-rule" aria-hidden="true" />
                    </span>
                    <span className="pillar-title display mt-1.5 block text-cream">{p.title}</span>
                    <span className="pillar-copy serif-i mt-1 block text-cream/90">{p.copy}</span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
