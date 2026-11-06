import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.1 });
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/** Smooth scrolling wired into the GSAP ticker; returns a cleanup fn. */
export function initSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  const lenis = new Lenis({ duration: 1.05, smoothWheel: true, touchMultiplier: 1.4 });
  (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

  const update = () => ScrollTrigger.update();
  lenis.on('scroll', update);

  const raf = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(raf);
    lenis.destroy();
    delete (window as unknown as { __lenis?: Lenis }).__lenis;
  };
}

export function lockScroll(locked: boolean) {
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.classList.toggle('lenis-stopped', locked);
}
