import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from '../../lib/smooth';
import { categoryOf, portfolio } from '../../data/portfolio';

/**
 * Work dropdown under the header burst: the three newest case studies plus the
 * index. Hover-open on pointer devices, tap-toggle on touch, Esc closes and
 * returns focus to the burst (handled in Header).
 */
export function WorkMenu({
  open,
  onClose,
  onEnter,
  onLeave,
}: {
  open: boolean;
  onClose: () => void;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const items = portfolio.slice(0, 3);
  const firstRun = useRef(true);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const rows = rowsRef.current.filter(Boolean) as HTMLElement[];

    gsap.killTweensOf([panel, ...rows]);

    if (open) {
      firstRun.current = false;
      gsap.set(panel, { transformOrigin: 'top left' });
      gsap.fromTo(
        panel,
        { autoAlpha: 0, scale: 0.6, y: -10 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.35, ease: 'back.out(1.4)' }
      );
      gsap.fromTo(
        rows,
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.05, delay: 0.1, ease: 'power2.out' }
      );
    } else if (firstRun.current) {
      // Stay hidden until the first open; never flash a close tween on mount.
      gsap.set(panel, { autoAlpha: 0, scale: 0.85, y: -8 });
    } else {
      gsap.to(panel, { autoAlpha: 0, scale: 0.85, y: -8, duration: 0.2, ease: 'power2.in' });
    }
  }, [open]);

  return (
    <div
      id="work-menu"
      ref={panelRef}
      aria-hidden={!open}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      className={`fixed left-3 top-3 z-0 w-[clamp(250px,21vw,330px)] rounded-[16px] bg-cream p-3 pt-14 text-ink shadow-[0_12px_32px_rgba(0,0,0,.28)] ${
        open ? '' : 'pointer-events-none'
      }`}
    >
      <div className="flex flex-col gap-[10px]">
        {items.map((p, i) => {
          const cat = categoryOf(p.category);
          return (
            <Link
              key={p.id}
              ref={(el) => {
                rowsRef.current[i] = el;
              }}
              to={`/work/${p.slug}`}
              onClick={onClose}
              tabIndex={open ? 0 : -1}
              className="group/row flex items-center gap-3 rounded-[10px] p-1 transition-transform duration-200 hover:translate-x-1"
            >
              <span
                aria-hidden="true"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-[8px] text-[8px] uppercase leading-[1.2] tracking-[0.1em]"
                style={{
                  background: p.cover.color ?? cat.color,
                  color: p.cover.color && ['#E8B4F5', '#E4FBA8', '#8499F8'].includes(p.cover.color) ? '#0A0A0A' : '#EEEAE3',
                }}
              >
                {cat.short}
              </span>
              <span className="min-w-0 flex-1">
                <span className="mb-1 block text-[9px] uppercase tracking-[0.14em] text-ink/60">{p.status}</span>
                <span className="display block text-[14px] leading-[1.1] text-ink">{p.title}</span>
              </span>
            </Link>
          );
        })}
      </div>

      <Link
        to="/work"
        onClick={onClose}
        tabIndex={open ? 0 : -1}
        className="group/all mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-full bg-ink px-4 text-[13px] font-semibold lowercase text-cream transition-colors duration-200 hover:bg-[#222]"
      >
        all our work
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          className="transition-transform duration-200 group-hover/all:translate-x-1"
          aria-hidden="true"
        >
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}
