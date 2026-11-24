/**
 * Dev-only collision audit (spec §2.6). Tag anything that carries text, a
 * sticker, a pill or a card with `data-collide="text|sticker|pill|card"`, then:
 *
 *   window.__ddCollide?.()        // in the browser console, or from a test
 *
 * It steps through the page, compares bounding boxes and console.errors every
 * overlapping pair that is not an ancestor/descendant. Zero output = clean.
 */
export type CollideReport = {
  positions: number;
  overlaps: {
    at: number;
    a: string;
    b: string;
    area: number;
  }[];
};

function describe(el: Element) {
  const tag = (el as HTMLElement).dataset.collide ?? 'unknown';
  const text = (el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 40);
  const cls = el.className && typeof el.className === 'string' ? `.${el.className.split(' ')[0]}` : '';
  return `${tag}${cls}${text ? ` "${text}"` : ''}`;
}

function intersects(a: DOMRect, b: DOMRect) {
  const w = Math.min(a.right, b.right) - Math.max(a.left, b.left);
  const h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
  if (w <= 4 || h <= 4) return 0;
  return Math.round(w * h);
}

export function runCollisionAudit(steps = 20): CollideReport {
  const report: CollideReport = { positions: 0, overlaps: [] };
  if (typeof window === 'undefined') return report;

  const originalY = window.scrollY;
  const lenis = (window as unknown as { __lenis?: { scrollTo: (v: number, o?: Record<string, unknown>) => void } })
    .__lenis;
  const jump = (y: number) => {
    if (lenis) lenis.scrollTo(y, { immediate: true });
    else window.scrollTo(0, y);
  };
  const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const selectors = '[data-collide]';

  for (let i = 0; i < steps; i++) {
    const y = Math.round((max * i) / Math.max(1, steps - 1));
    jump(y);
    report.positions++;

    const nodes = Array.from(document.querySelectorAll<HTMLElement>(selectors)).filter((el) => {
      // stickers parked at 0,0 waiting to drop must not read as a pile-up
      const style = window.getComputedStyle(el);
      if (style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight;
    });

    for (let a = 0; a < nodes.length; a++) {
      for (let b = a + 1; b < nodes.length; b++) {
        const elA = nodes[a];
        const elB = nodes[b];
        if (elA.contains(elB) || elB.contains(elA)) continue;

        const boxA = elA.getBoundingClientRect();
        const boxB = elB.getBoundingClientRect();
        const area = intersects(boxA, boxB);
        if (!area) continue;

        report.overlaps.push({ at: y, a: describe(elA), b: describe(elB), area });
      }
    }
  }

  jump(originalY);

  if (report.overlaps.length) {
    console.error(
      `[collide] ${report.overlaps.length} overlap(s) across ${report.positions} positions`,
      report.overlaps
    );
  } else {
    console.info(`[collide] clean across ${report.positions} positions`);
  }

  return report;
}

export function installCollisionAudit() {
  (window as unknown as { __ddCollide?: typeof runCollisionAudit }).__ddCollide = runCollisionAudit;
}
