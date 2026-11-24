import type { CSSProperties, ReactNode } from 'react';

export type PillTone =
  | 'lilac'
  | 'lime'
  | 'tangerine'
  | 'periwinkle'
  | 'berry'
  | 'royal'
  | 'forest'
  | 'cream'
  | 'ink'
  | 'outline';

const TONE: Record<PillTone, string> = {
  lilac: 'bg-lilac text-ink',
  lime: 'bg-lime text-ink',
  tangerine: 'bg-tangerine text-cream',
  periwinkle: 'bg-periwinkle text-ink',
  berry: 'bg-berry text-cream',
  royal: 'bg-royal text-cream',
  forest: 'bg-forest text-cream',
  cream: 'bg-cream text-ink',
  ink: 'bg-ink text-cream',
  outline: 'bg-transparent text-current ring-[1.5px] ring-current',
};

/**
 * One pill/tag everywhere: same padding, radius, type size, tilt and hover.
 */
export function Pill({
  children,
  tone = 'ink',
  tilt = 0,
  size = 'md',
  className = '',
  style,
  interactive = true,
}: {
  children: ReactNode;
  tone?: PillTone;
  tilt?: number;
  size?: 'sm' | 'md';
  className?: string;
  style?: CSSProperties;
  interactive?: boolean;
}) {
  const sizing = size === 'sm' ? 'px-2 py-[2px] text-[10px]' : 'px-[10px] py-[5px] text-[13px]';

  return (
    <span
      data-collide="pill"
      className={`inline-flex items-center gap-1 rounded-full font-semibold lowercase leading-[1.1] ${sizing} ${TONE[tone]} ${className}`}
      style={{
        transform: `rotate(${tilt}deg)`,
        transition: interactive ? 'transform .25s cubic-bezier(.34,1.56,.64,1)' : undefined,
        ...style,
      }}
      onPointerEnter={
        interactive
          ? (e) => {
              e.currentTarget.style.transform = 'rotate(0deg) scale(1.08)';
            }
          : undefined
      }
      onPointerLeave={
        interactive
          ? (e) => {
              e.currentTarget.style.transform = `rotate(${tilt}deg)`;
            }
          : undefined
      }
    >
      {children}
    </span>
  );
}
