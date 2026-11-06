import type { CSSProperties } from 'react';

const PALETTES: [string, string][] = [
  ['#4B63E8', '#8499F8'],
  ['#E8603C', '#9B2155'],
  ['#8499F8', '#E8B4F5'],
  ['#2E7D5B', '#E4FBA8'],
  ['#9B2155', '#E8603C'],
  ['#E8B4F5', '#4B63E8'],
  ['#E4FBA8', '#2E7D5B'],
  ['#0A0A0A', '#2E7D5B'],
];

/**
 * Neutral media placeholder (gradient + abstract shapes + label).
 * Swap for <video> / <img> when real footage lands in /public.
 */
export function PlaceholderMedia({
  seed = 0,
  label,
  sub,
  className = '',
  style,
  active = true,
  compact = false,
}: {
  seed?: number;
  label?: string;
  sub?: string;
  className?: string;
  style?: CSSProperties;
  active?: boolean;
  compact?: boolean;
}) {
  const [a, b] = PALETTES[Math.abs(seed) % PALETTES.length];
  return (
    <div
      className={`relative isolate overflow-hidden ${className}`}
      style={{ background: `linear-gradient(150deg, ${a} 0%, ${a} 46%, ${b} 100%)`, ...style }}
    >
      <div
        className="absolute -left-[18%] top-[10%] h-[70%] w-[70%] rounded-full"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,.32), transparent 65%)',
          animation: active ? 'phFloat 9s ease-in-out infinite' : 'none',
        }}
      />
      <div
        className="absolute -right-[30%] -bottom-[18%] h-[75%] w-[100%] rotate-[18deg] rounded-[46%] opacity-70"
        style={{ background: `linear-gradient(120deg, ${b}, ${a})` }}
      />
      <div
        className="absolute inset-0 opacity-[.18]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(115deg, rgba(255,255,255,.8) 0 1px, transparent 1px 9px)',
          mixBlendMode: 'soft-light',
        }}
      />
      {!compact && (
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
          {label && (
            <span className="display text-[clamp(1rem,1.6vw,1.5rem)] text-cream drop-shadow-[0_2px_6px_rgba(0,0,0,.25)]">
              {label}
            </span>
          )}
          {sub && (
            <span className="mb-1 rounded-full bg-cream/85 px-2 py-1 text-[10px] font-medium lowercase tracking-wide text-ink">
              {sub}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export function PlaceholderPortrait({
  seed = 0,
  initials,
  className = '',
  style,
  rounded = 12,
}: {
  seed?: number;
  initials: string;
  className?: string;
  style?: CSSProperties;
  rounded?: number;
}) {
  const [a, b] = PALETTES[Math.abs(seed) % PALETTES.length];
  return (
    <div
      className={`relative isolate flex items-end justify-start overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(160deg, ${a}, ${b})`,
        borderRadius: rounded,
        ...style,
      }}
    >
      <div
        className="absolute left-1/2 top-[18%] h-[54%] w-[62%] -translate-x-1/2 rounded-[50%] opacity-25"
        style={{ background: 'radial-gradient(circle at 50% 40%, #fff, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-[10%] left-1/2 h-[62%] w-[86%] -translate-x-1/2 rounded-t-[50%] opacity-30"
        style={{ background: 'rgba(255,255,255,.55)' }}
      />
      <span className="relative m-3 display text-[clamp(.9rem,1.4vw,1.4rem)] leading-none text-cream/95 mix-blend-normal">
        {initials}
      </span>
    </div>
  );
}
