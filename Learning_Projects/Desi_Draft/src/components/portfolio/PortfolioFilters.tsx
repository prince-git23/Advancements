import type { FilterId } from '../../data/portfolio';

/**
 * Category filter. Real buttons, a live count, and the current choice reflected
 * in the URL (`?c=web`) so a filtered view can be linked or reloaded.
 */
export function PortfolioFilters({
  value,
  onChange,
  counts,
  tone = 'light',
}: {
  value: FilterId;
  onChange: (next: FilterId) => void;
  counts: Record<string, number>;
  tone?: 'light' | 'dark';
}) {
  const options: { id: FilterId; label: string }[] = [
    { id: 'all', label: 'All Work' },
    { id: 'video', label: 'Video & Motion' },
    { id: 'social', label: 'Social Media' },
    { id: 'scripts', label: 'Scripts & Storytelling' },
    { id: 'web', label: 'Websites & Digital' },
    { id: 'brand', label: 'Branding & Graphic Design' },
  ];

  const idle =
    tone === 'dark'
      ? 'border-cream/25 bg-cream/[0.06] text-cream/75 hover:border-cream/60 hover:text-cream'
      : 'border-ink/15 bg-ink/[0.04] text-ink/70 hover:border-ink/40 hover:bg-ink/[0.07] hover:text-ink';
  const active = tone === 'dark' ? 'border-cream bg-cream text-ink' : 'border-ink bg-ink text-cream';

  return (
    <div
      role="group"
      aria-label="Filter work by discipline"
      className="no-scrollbar -mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1 md:mx-0 md:px-0"
    >
      {options.map((o) => {
        const on = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            aria-pressed={on}
            className={`snap-start shrink-0 rounded-full border px-4 py-2.5 text-[13px] lowercase transition-[background-color,border-color,color,transform] duration-200 hover:-translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${on ? active : idle}`}
          >
            {o.label}
            <span className={`ml-1.5 tabular-nums ${on ? 'opacity-70' : 'opacity-55'}`}>
              {counts[o.id] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}
