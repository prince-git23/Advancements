import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from '../../lib/smooth';
import { usePrefersReducedMotion } from '../../lib/hooks';
import type { ServiceGroup } from '../../data/site';
import './AccordionGallery.css';

type Props = {
  items: ServiceGroup[];
  defaultIndex?: number;
  className?: string;
  /**
   * `hover` (default) opens a panel when a mouse enters it on desktop, while
   * click, tap and keyboard still work everywhere. `click` never reacts to a
   * pointer entering.
   */
  trigger?: 'hover' | 'click';
};

/**
 * AccordionGallery — the ReactBits gallery pattern (one wide panel, the rest
 * held as slim spines) rebuilt on the studio's own data.
 *
 * Interaction is a real disclosure widget: every panel is a heading with a
 * button (`aria-expanded` / `aria-controls`), the open panel is a labelled
 * region, arrow keys walk the headings and Enter/Space open one. Nothing is
 * revealed by hover alone, and the horizontal gallery only exists from 1024px;
 * below that the same markup becomes a vertical list.
 *
 * Desktop is hover-first (`trigger="hover"`): moving the mouse onto a spine
 * opens it, so the gallery reads as one continuous strip rather than five
 * separate click targets. The check is a fine pointer with real hover, so a
 * touch screen never gets a panel it cannot close, and a click or tap is still
 * a full, independent way to open any panel.
 *
 * GSAP is used only for the open panel's content reveal and a small pointer
 * parallax on the open photograph. No loop runs while the gallery is idle.
 */
export function AccordionGallery({
  items,
  defaultIndex = 0,
  className = '',
  trigger = 'hover',
}: Props) {
  const [active, setActive] = useState(defaultIndex);
  const listRef = useRef<HTMLUListElement>(null);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const reduced = usePrefersReducedMotion();

  // Open panel content: a short staged reveal, never a timed gate on reading.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const panel = list.querySelectorAll<HTMLElement>('.svc-acc__panel')[active];
    const inner = panel?.querySelector<HTMLElement>('.svc-acc__bodyInner');
    if (!inner) return;
    const kids = Array.from(inner.children) as HTMLElement[];
    if (!kids.length) return;

    if (reduced) {
      gsap.set(kids, { clearProps: 'all' });
      return;
    }

    const tween = gsap.fromTo(
      kids,
      { y: 18, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.05, ease: 'power3.out', overwrite: true }
    );

    return () => {
      tween.kill();
      gsap.set(kids, { clearProps: 'all' });
    };
  }, [active, reduced]);

  // Pointer parallax on the open photograph, fine pointers on desktop only.
  useEffect(() => {
    const list = listRef.current;
    const img = imgRefs.current[active];
    if (!list || !img || reduced) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (!window.matchMedia('(min-width: 1024px)').matches) return;

    gsap.set(img, { scale: 1.06, transformOrigin: '50% 50%' });
    const xTo = gsap.quickTo(img, 'x', { duration: 0.7, ease: 'power2.out' });
    const yTo = gsap.quickTo(img, 'y', { duration: 0.7, ease: 'power2.out' });

    const onMove = (event: PointerEvent) => {
      const rect = list.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      xTo(nx * -22);
      yTo(ny * -16);
    };
    const reset = () => {
      xTo(0);
      yTo(0);
    };

    list.addEventListener('pointermove', onMove);
    list.addEventListener('pointerleave', reset);

    return () => {
      list.removeEventListener('pointermove', onMove);
      list.removeEventListener('pointerleave', reset);
      gsap.killTweensOf(img);
      gsap.set(img, { clearProps: 'transform' });
    };
  }, [active, reduced]);

  /** True only for a mouse on a desktop-width, hover-capable display. */
  const canHover = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    window.matchMedia('(min-width: 1024px)').matches;

  // Arrow keys follow the axis the layout is actually using.
  const onKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const list = listRef.current;
    if (!list) return;
    const buttons = Array.from(list.querySelectorAll<HTMLButtonElement>('.svc-acc__button'));
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (index < 0) return;

    const horizontal = window.matchMedia('(min-width: 1024px)').matches;
    const prev = horizontal ? 'ArrowLeft' : 'ArrowUp';
    const next = horizontal ? 'ArrowRight' : 'ArrowDown';
    let target = -1;

    if (event.key === prev) target = (index - 1 + buttons.length) % buttons.length;
    else if (event.key === next) target = (index + 1) % buttons.length;
    else if (event.key === 'Home') target = 0;
    else if (event.key === 'End') target = buttons.length - 1;
    if (target < 0) return;

    event.preventDefault();
    buttons[target]?.focus();
  };

  return (
    <ul ref={listRef} className={`svc-acc ${className}`} onKeyDown={onKeyDown} aria-label="services">
      {items.map((item, i) => {
        const open = i === active;
        const panelId = `svc-panel-${item.id}`;
        const buttonId = `svc-tab-${item.id}`;
        const href = item.evidence ? `/work/${item.evidence.slug}` : '/work';

        return (
          <li
            key={item.id}
            className="svc-acc__panel"
            data-open={open}
            style={{ '--svc-accent': item.color } as CSSProperties}
            onPointerMove={(event) => {
              // Pointer *move*, not enter: a panel widening under a still mouse
              // must not steal the open state, which is what makes a hover
              // gallery flicker. Only real movement switches panels.
              if (trigger !== 'hover' || open) return;
              if (event.pointerType !== 'mouse' || !canHover()) return;
              setActive(i);
            }}
          >
            <div className="svc-acc__media">
              <img
                ref={(el) => {
                  imgRefs.current[i] = el;
                }}
                src={item.image}
                alt={item.imageAlt}
                width={880}
                height={1100}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </div>
            <div className="svc-acc__wash" aria-hidden="true" />

            <h3 className="svc-acc__heading">
              <button
                type="button"
                id={buttonId}
                className="svc-acc__button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => {
                  // Phones may close the open row; the desktop gallery always
                  // keeps one panel open so the strip never becomes five spines.
                  if (open && window.matchMedia('(min-width: 1024px)').matches) return;
                  setActive(open ? -1 : i);
                }}
                onFocus={() => {
                  // Tabbing into a spine opens it on desktop, so the focus ring
                  // and the visible panel never disagree.
                  if (trigger === 'hover' && canHover() && !open) setActive(i);
                }}
              >
                <span className="svc-acc__no">{item.no}</span>
                <span className="display svc-acc__title">{item.title}</span>
                <span className="svc-acc__mark" aria-hidden="true">
                  {open ? '−' : '+'}
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className="svc-acc__body"
              hidden={!open}
            >
              <div className="svc-acc__bodyInner">
                <p className="svc-acc__bodyNo">{item.no}</p>
                <p className="display svc-acc__bodyTitle">{item.title}</p>
                <p className="svc-acc__desc">{item.lede}</p>
                <ul className="svc-acc__features">
                  {item.items.map((feature) => (
                    <li key={feature}>
                      <span className="svc-acc__dot" aria-hidden="true">
                        ✦
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to={href} className="svc-acc__evidence">
                  {item.evidence ? `see ${item.evidence.label}` : 'see the work'}
                  <span className="btn-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
