import { useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  categories,
  portfolio,
  projectsIn,
  type FilterId,
} from '../data/portfolio';
import { PortfolioFilters } from '../components/portfolio/PortfolioFilters';
import { PortfolioGrid } from '../components/portfolio/PortfolioGrid';
import { Footer } from '../components/Footer';

const VALID = new Set<string>(categories.map((c) => c.id));

export function WorkIndex() {
  const [params, setParams] = useSearchParams();
  const raw = params.get('c') ?? 'all';
  const filter: FilterId = (VALID.has(raw) ? raw : 'all') as FilterId;

  const counts = useMemo(() => {
    const out: Record<string, number> = { all: portfolio.length };
    for (const c of categories) if (c.id !== 'all') out[c.id] = projectsIn(c.id).length;
    return out;
  }, []);

  const list = projectsIn(filter);

  useEffect(() => {
    const label = categories.find((c) => c.id === filter)?.label ?? 'Work';
    document.title = filter === 'all' ? 'work — desi draft' : `${label.toLowerCase()} — desi draft`;
  }, [filter]);

  const onFilter = (next: FilterId) => {
    // replace, not push: filtering is a view of this page, not a new page
    setParams(next === 'all' ? {} : { c: next }, { replace: true });
  };

  return (
    <>
      <main className="min-h-[100svh] bg-cream pb-20 pt-[104px] text-ink">
        <div className="dd-page">
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-b border-ink/15 pb-4">
            <h1 className="display type-section">
              all our <span className="serif-i">work</span>
            </h1>
            <p className="max-w-[38ch] text-[15px] leading-[1.5] text-ink/65">
              Case studies from the studio and the room we are building right now.
            </p>
          </div>

          <div className="sticky top-[72px] z-20 -mx-[var(--dd-gutter)] mt-5 bg-cream px-[var(--dd-gutter)] py-3">
            <PortfolioFilters value={filter} onChange={onFilter} counts={counts} />
          </div>

          <p className="mb-8 mt-2 text-[11px] uppercase tracking-[0.18em] text-ink/60">
            {list.length} {list.length === 1 ? 'project' : 'projects'}
            {filter !== 'all' && ` · ${categories.find((c) => c.id === filter)?.label.toLowerCase()}`}
          </p>

          {/* The grid's cards are h3 (they sit under the section heading on the
              home page too). This keeps the heading order legal on /work. */}
          <h2 className="sr-only">projects</h2>

          {list.length > 0 ? (
            <PortfolioGrid projects={list} filterKey={filter} />
          ) : (
            <div className="py-24 text-center">
              <p className="display text-[clamp(1.6rem,3vw,2.4rem)]">nothing published here yet.</p>
              <button
                type="button"
                onClick={() => onFilter('all')}
                className="mt-4 rounded-full border border-ink/25 px-5 py-3 text-[14px] lowercase"
              >
                show all work
              </button>
            </div>
          )}

          <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-ink/15 pt-6 sm:flex-row sm:items-end">
            <p className="max-w-[46ch] text-[14px] leading-[1.5] text-ink/65">
              Working in one of these disciplines? Send the brief — we will tell you what we would actually
              do, including what to cut.
            </p>
            <Link to="/" className="btn btn-secondary">
              back to the studio
              <span className="btn-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
