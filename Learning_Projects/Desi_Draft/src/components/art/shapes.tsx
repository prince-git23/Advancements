import type { ReactNode } from 'react';

/** Shape helpers shared by every hand-built sticker. */

export const CREAM = '#FFFDF7';

/** Jagged burst — alternating outer / inner points. */
export function burstPath(spikes = 10, outer = 58, inner = 40, cx = 60, cy = 60) {
  const pts: string[] = [];
  for (let i = 0; i < spikes * 2; i++) {
    const a = (Math.PI * 2 * i) / (spikes * 2) - Math.PI / 2;
    const r = i % 2 === 0 ? outer : inner;
    pts.push(`${(cx + Math.cos(a) * r).toFixed(2)} ${(cy + Math.sin(a) * r).toFixed(2)}`);
  }
  return `M${pts.join('L')}Z`;
}

/** Concave 4-point sparkle. */
export const sparklePath =
  'M60 4c4 36 18 52 54 56-36 4-50 20-54 56-4-36-18-52-54-56 36-4 50-20 54-56Z';

/** Soft spiky star with curved concave edges (lime blob). */
export function spikyStarPath(spikes = 8, outer = 58, inner = 30, cx = 60, cy = 60) {
  let d = '';
  for (let i = 0; i < spikes * 2; i++) {
    const a = (Math.PI * 2 * i) / (spikes * 2) - Math.PI / 2;
    const nextA = (Math.PI * 2 * (i + 1)) / (spikes * 2) - Math.PI / 2;
    const r = i % 2 === 0 ? outer : inner;
    const nr = i % 2 === 0 ? inner : outer;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    const nx = cx + Math.cos(nextA) * nr;
    const ny = cy + Math.sin(nextA) * nr;
    const ctrlR = i % 2 === 0 ? inner * 0.55 : outer * 0.86;
    const cx1 = cx + Math.cos((a + nextA) / 2) * ctrlR;
    const cy1 = cy + Math.sin((a + nextA) / 2) * ctrlR;
    if (i === 0) d += `M${x.toFixed(1)} ${y.toFixed(1)}`;
    d += `Q${cx1.toFixed(1)} ${cy1.toFixed(1)} ${nx.toFixed(1)} ${ny.toFixed(1)}`;
  }
  return d + 'Z';
}

export const heartPath =
  'M60 101C33 82 17 66 17 47c0-15 11-26 26-26 8 0 14 4 17 10 3-6 9-10 17-10 15 0 26 11 26 26 0 19-16 35-43 54Z';

export const blobA =
  'M60 12c21 0 39 11 46 28 7 17-2 34-15 45-14 12-34 18-49 10C27 87 16 71 15 54 14 36 26 22 42 16c6-3 12-4 18-4Z';

export const blobB =
  'M62 10c23 0 42 14 46 33 4 18-9 30-17 41-9 12-13 24-31 24-19 0-41-9-48-27C4 61 14 41 29 27 39 17 49 10 62 10Z';

export const bubblePath =
  'M36 14h48c12 0 22 10 22 22v24c0 12-10 22-22 22H64l-15 17 1-17H36c-12 0-22-10-22-22V36c0-12 10-22 22-22Z';

/** Cream die-cut outline + inset fill for an arbitrary silhouette. */
export function DieCut({ d, fill, inset = 0.88 }: { d: string; fill: string; inset?: number }) {
  return (
    <g>
      <path d={d} fill={CREAM} stroke={CREAM} strokeWidth="9" strokeLinejoin="round" />
      <path
        d={d}
        fill={fill}
        transform={`translate(60 60) scale(${inset}) translate(-60 -60)`}
      />
    </g>
  );
}

/** Bubbly display lettering inside a sticker. */
export function StickerWord({
  children,
  y = 70,
  size = 25,
  fill = '#fff',
  stroke = CREAM,
  strokeWidth = 5,
  rotate = 0,
  family = 'Archivo, system-ui, sans-serif',
  weight = 900,
  letterSpacing = '-1.5',
}: {
  children: ReactNode;
  y?: number;
  size?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  rotate?: number;
  family?: string;
  weight?: number;
  letterSpacing?: string;
}) {
  return (
    <text
      x="60"
      y={y}
      textAnchor="middle"
      fontFamily={family}
      fontWeight={weight}
      fontSize={size}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      paintOrder="stroke"
      strokeLinejoin="round"
      letterSpacing={letterSpacing}
      transform={rotate ? `rotate(${rotate} 60 60)` : undefined}
    >
      {children}
    </text>
  );
}
