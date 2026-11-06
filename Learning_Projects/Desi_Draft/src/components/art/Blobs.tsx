import type { CSSProperties } from 'react';
import { CREAM } from './shapes';

type Props = { className?: string; style?: CSSProperties; color?: string };

/** Big royal-blue paint splat used behind photo fans and portraits. */
export function SplatBlob({ className = '', style, color = '#4B63E8' }: Props) {
  return (
    <svg viewBox="0 0 400 400" className={className} style={style} aria-hidden="true">
      <path
        d="M203 18c47 0 62 40 99 56 40 17 79 40 80 92 1 48-34 67-49 107-16 43-44 85-99 89-51 4-75-30-113-54-38-24-78-47-79-98-1-52 41-72 59-112 19-42 55-80 102-80Z"
        fill={color}
      />
      <path
        d="M203 18c47 0 62 40 99 56 40 17 79 40 80 92 1 48-34 67-49 107-16 43-44 85-99 89-51 4-75-30-113-54-38-24-78-47-79-98-1-52 41-72 59-112 19-42 55-80 102-80Z"
        fill="none"
        stroke={CREAM}
        strokeWidth="0"
      />
    </svg>
  );
}

/** Four-lobed clover — forest green by default. */
export function CloverBlob({ className = '', style, color = '#2E7D5B' }: Props) {
  const lobes = [
    { cx: 108, cy: 94, r: 74 },
    { cx: 226, cy: 84, r: 66 },
    { cx: 120, cy: 216, r: 70 },
    { cx: 236, cy: 208, r: 80 },
  ];
  return (
    <svg viewBox="0 0 340 340" className={className} style={style} aria-hidden="true">
      <g>
        {lobes.map((l, i) => (
          <circle key={`c${i}`} cx={l.cx} cy={l.cy} r={l.r} fill={color} />
        ))}
        <path
          d="M232 258c6 30 18 48 34 62 6 5 14-1 11-8-10-22-16-36-17-56z"
          fill={color}
        />
      </g>
    </svg>
  );
}

/** Soft periwinkle blob for the clients section. */
export function PeriBlob({ className = '', style, color = '#8499F8' }: Props) {
  return (
    <svg viewBox="0 0 420 420" className={className} style={style} aria-hidden="true">
      <path
        d="M210 24c62 0 96 30 126 72 31 43 62 96 38 150-24 54-88 62-132 92-42 29-72 56-116 42-45-15-76-62-80-114-4-52 18-98 54-136 35-37 66-106 110-106Z"
        fill={color}
      />
    </svg>
  );
}

/** Wide organic blob used as a section backdrop. */
export function SoftBlob({ className = '', style, color = '#8499F8' }: Props) {
  return (
    <svg viewBox="0 0 600 460" className={className} style={style} aria-hidden="true">
      <path
        d="M300 16c96 0 168 32 220 86 52 55 66 132 24 186-41 54-124 60-186 96-57 33-100 66-155 42-58-25-92-88-95-154-3-67 27-115 74-157 46-41 68-99 118-99Z"
        fill={color}
      />
    </svg>
  );
}

export function LimeBlob({ className = '', style, color = '#E4FBA8' }: Props) {
  return (
    <svg viewBox="0 0 360 360" className={className} style={style} aria-hidden="true">
      <path
        d="M180 18c48 0 78 26 108 62 30 37 56 84 38 128-18 45-71 52-104 78-34 26-55 46-94 34-40-13-62-56-64-98-1-42 16-81 44-114 29-34 40-90 72-90Z"
        fill={color}
      />
    </svg>
  );
}
