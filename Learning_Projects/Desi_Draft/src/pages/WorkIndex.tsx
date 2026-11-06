import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { workFilters, projects } from '../data/work';
import type { WorkType } from '../types';
import { PlaceholderMedia } from '../components/Placeholder';
import { Sticker } from '../components/art/Stickers';
import { SZ } from '../components/art/sizes';
import { Footer } from '../components/Footer';

export function WorkIndex() {
  const [filter, setFilter] = useState<'all' | WorkType>('all');
  const [hovered, setHovered] = useState<string | null>(null);
  const list = projects.filter((p) => filter === 'all' || p.type === filter);

  useEffect(() => {
    document.title = 'work — desi draft';
  }, []);

  return (
    <>
      <main className="min-h-[100svh] bg-cream px-5 pb-16 pt-[120px]">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h1 className="display text-[clamp(2.4rem,6vw,5rem)] text-ink">
              all our <span className="serif-i">work</span>
            </h1>
            <div className="flex flex-wrap gap-2">
              {workFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`rounded-full border px-4 py-2 text-[12px] lowercase transition-colors ${
                    filter === f.value
                      ? 'border-ink bg-ink text-cream'
                      : 'border-ink/20 text-ink/70 hover:border-ink/50 hover:text-ink'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p, i) => (
              <Link
                key={p.slug}
                to={`/work/${p.slug}`}
                onMouseEnter={() => setHovered(p.slug)}
                onMouseLeave={() => setHovered(null)}
                className="group relative block overflow-hidden rounded-[24px] border-[5px] border-cream shadow-[0_18px_40px_rgba(0,0,0,.12)]"
              >
                <PlaceholderMedia
                  seed={i}
                  label={p.client}
                  sub={p.type}
                  active={hovered === p.slug}
                  className="aspect-[4/5] w-full transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />
                <span className="pointer-events-none absolute bottom-4 left-4 display text-[clamp(1.2rem,1.8vw,1.6rem)] text-cream">
                  {p.title}
                </span>
                <span className="absolute right-3 top-3 rotate-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Sticker kind="cursor" size={SZ.workTile} rotate={10} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
