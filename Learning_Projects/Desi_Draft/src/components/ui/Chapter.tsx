/**
 * Chapter marker for the studio narrative:
 *
 *   01 the idea → 02 the thinking → 03 the making → 04 the work
 *   → 05 the people → 06 the result → 07 the connection
 *
 * The rule between the number and the name takes the section's preset accent
 * (`--chapter-accent`, set from `data-theme` in index.css). Nothing else about
 * the section changes: surfaces, type, spacing and stickers stay as they were.
 *
 * Chapter 01 is the hero frame itself, 06 lives in each case study at the point
 * where the delivered result is shown, and 07 is the footer.
 */
type ChapterProps = {
  /** Storyboard position, printed as-is: '01' … '07'. */
  no: string;
  name: string;
  tone?: 'ink' | 'cream';
  align?: 'left' | 'center';
  className?: string;
};

export function Chapter({ no, name, tone = 'ink', align = 'left', className = '' }: ChapterProps) {
  return (
    <p
      className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.2em] ${
        tone === 'cream' ? 'text-cream' : 'text-ink/62'
      } ${align === 'center' ? 'justify-center' : ''} ${className}`}
    >
      <span className="tabular-nums">{no}</span>
      <span
        aria-hidden="true"
        className="h-px w-6 shrink-0"
        style={{ background: 'var(--chapter-accent, currentColor)' }}
      />
      <span>{name}</span>
    </p>
  );
}
