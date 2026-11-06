import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from '../../lib/smooth';
import { projects } from '../../data/work';
import type { PillColor } from '../../types';

const PILL_CLASS: Record<PillColor, string> = {
  lilac: 'bg-lilac text-ink',
  lime: 'bg-lime text-ink',
  tangerine: 'bg-tangerine text-cream',
  periwinkle: 'bg-periwinkle text-ink',
  berry: 'bg-berry text-cream',
};

/**
 * Work dropdown that hangs under the header burst. Three latest projects plus
 * "all our work". Hover-open on pointer devices, tap-toggle on touch, Esc closes
 * and returns focus to the burst (handled in Header).
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
  const items = projects.slice(0, 3);
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
      className={`fixed left-3 top-3 z-0 w-[clamp(240px,20vw,320px)] rounded-[16px] bg-cream p-3 pt-14 text-ink shadow-[0_12px_32px_rgba(0,0,0,.28)] ${
        open ? '' : 'pointer-events-none'
      }`}
    >
      <div className="flex flex-col gap-[10px]">
        {items.map((p, i) => (
          <Link
            key={p.slug}
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
              className="h-11 w-11 shrink-0 overflow-hidden rounded-[8px]"
              style={{
                background: `linear-gradient(145deg, ${p.colors[0]} 0%, ${p.colors[1]} 100%)`,
                boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.06)',
              }}
            />
            <span className="min-w-0 flex-1">
              <span
                className={`mb-1 inline-block rounded-full px-2 py-[2px] text-[10px] font-bold lowercase leading-[1.2] ${PILL_CLASS[p.pill]}`}
              >
                {p.client}
              </span>
              <span className="display relative block text-[14px] font-extrabold leading-[1.1] text-ink">
                {p.title}
                <svg
                  viewBox="0 0 120 10"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute -bottom-[3px] left-0 h-[6px] w-full opacity-0 transition-opacity duration-150 group-hover/row:opacity-100 group-hover/row:[&_path]:[stroke-dashoffset:0]"
                  aria-hidden="true"
                >
                  <path
                    className="doodle-path"
                    pathLength={1}
                    d="M2 6c16-4 34-4 58-3s30 2 58-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{ transitionDuration: '0.3s' }}
                  />
                </svg>
              </span>
            </span>
          </Link>
        ))}
      </div>

      <Link
        to="/work"
        onClick={onClose}
        tabIndex={open ? 0 : -1}
        className="group/all mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-full bg-ink px-4 text-[14px] font-semibold lowercase text-cream transition-colors duration-200 hover:bg-[#222]"
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
