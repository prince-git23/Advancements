import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './smooth';
import { scrollEase } from './motion';

export { gsap, ScrollTrigger };

type LenisWindow = Window & { __lenis?: Lenis };

function getLenis() {
  return (window as LenisWindow).__lenis;
}

type Target = string | HTMLElement | number;

/**
 * The only way the site scrolls programmatically: 1.6s Lenis ease, pointer
 * interaction paused while it runs, and a hard fallback when Lenis is off
 * (reduced motion) or the page is still mounting.
 */
export function scrollToTarget(
  target: Target,
  { duration = 1.6, offset = 0, immediate = false }: { duration?: number; offset?: number; immediate?: boolean } = {}
) {
  const lenis = getLenis();
  const body = document.body;
  const prevPointer = body.style.pointerEvents;

  const release = () => {
    body.style.pointerEvents = prevPointer;
  };

  if (immediate) {
    if (lenis) lenis.scrollTo(target, { immediate: true, offset });
    else if (typeof target === 'number') window.scrollTo(0, target);
    else {
      const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
      el?.scrollIntoView({ block: 'start' });
    }
    return;
  }

  body.style.pointerEvents = 'none';

  if (lenis) {
    lenis.scrollTo(target, {
      duration,
      offset,
      easing: scrollEase,
      onComplete: release,
      lock: true,
    });
    // Safety net for interrupted scrolls (pointer wheel, route change).
    window.setTimeout(release, duration * 1000 + 120);
    return;
  }

  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : null;
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  else if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' });
  window.setTimeout(release, duration * 1000 + 120);
}

/** Logo click target. */
export function scrollToTop() {
  scrollToTarget(0, { duration: 1.6 });
}
