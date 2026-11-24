/**
 * Motion tokens. Never write raw ease/duration strings in components.
 */
export const ease = {
  out: 'power4.out',
  soft: 'power3.out',
  pop: 'back.out(2.4)',
  pill: 'back.out(1.7)',
  wipe: 'power4.inOut',
  bounce: 'bounce.out',
} as const;

export const dur = {
  xs: 0.25,
  sm: 0.4,
  md: 0.7,
  lg: 1,
} as const;

export const stagger = {
  tight: 0.06,
  base: 0.1,
} as const;

/** Lenis-style easing used by every programmatic scroll. */
export const scrollEase = (t: number) => 1 - Math.pow(1 - t, 4);

export function reducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}
