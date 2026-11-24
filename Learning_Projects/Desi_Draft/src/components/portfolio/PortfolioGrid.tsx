import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/smooth';
import { usePrefersReducedMotion } from '../../lib/hooks';
import type { PortfolioProject } from '../../data/portfolio';
import { ProjectCard, planLayouts } from './ProjectCard';

/**
 * The portfolio grid. Cards are revealed once on scroll and re-staggered when
 * the filter changes — transform/opacity only, so nothing reflows mid-animation.
 */
export function PortfolioGrid({ projects, filterKey }: { projects: PortfolioProject[]; filterKey: string }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const first = useRef(true);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll<HTMLElement>('[data-card]'));
    if (!cards.length) return;

    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { y: first.current ? 30 : 14, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: first.current ? 0.7 : 0.45,
          ease: 'power3.out',
          stagger: 0.06,
          overwrite: true,
          scrollTrigger: first.current ? { trigger: grid, start: 'top 88%', once: true } : undefined,
        }
      );
    }, grid);
    first.current = false;
    return () => ctx.revert();
    // filterKey is what makes a filter change replay the reveal
  }, [filterKey, reduced]);

  const layouts = planLayouts(projects.length);

  return (
    <div ref={gridRef} className="grid gap-x-6 gap-y-14 lg:grid-cols-12 lg:gap-y-20">
      {projects.map((project, i) => (
        <ProjectCard key={project.id} project={project} index={i} layout={layouts[i] ?? 'full'} eager={i < 2} />
      ))}
    </div>
  );
}
