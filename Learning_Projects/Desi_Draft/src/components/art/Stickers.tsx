import type { CSSProperties } from 'react';
import type { StickerKey } from '../../types';
import {
  CREAM,
  DieCut,
  StickerWord,
  blobA,
  blobB,
  bubblePath,
  burstPath,
  heartPath,
  sparklePath,
  spikyStarPath,
} from './shapes';

const INK = '#0A0A0A';
const ROYAL = '#4B63E8';
const PERI = '#8499F8';
const FOREST = '#2E7D5B';
const TANG = '#E8603C';
const BERRY = '#9B2155';
const LILAC = '#E8B4F5';
const LIME = '#E4FBA8';

const face = (color = INK) => (
  <g stroke={color} strokeWidth="5" strokeLinecap="round" fill="none">
    <path d="M40 52h9M71 52h9" />
    <path d="M42 68c4 9 12 13 18 13s14-4 18-13" />
  </g>
);

function Art({ kind }: { kind: StickerKey }) {
  switch (kind) {
    case 'smiley':
      return (
        <>
          <circle cx="60" cy="60" r="46" fill={CREAM} />
          <circle cx="60" cy="60" r="38" fill={ROYAL} />
          {face(LIME)}
        </>
      );

    case 'camera':
      return (
        <>
          <DieCut d={blobA} fill={INK} />
          <g stroke={CREAM} strokeWidth="3.4" fill="none" strokeLinecap="round">
            <rect x="34" y="46" width="52" height="34" rx="7" />
            <path d="M48 46l5-8h14l5 8" />
            <circle cx="60" cy="63" r="10" />
            <path d="M80 52h2" />
          </g>
        </>
      );

    case 'phone':
      return (
        <>
          <DieCut d={blobB} fill={LIME} />
          <g stroke={BERRY} strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="48" y="34" width="24" height="38" rx="5" />
            <path d="M56 38h8" />
            <path d="M42 66c0 10 8 16 18 16h10c8 0 12-4 12-10" />
            <path d="M78 44l6-6M82 52l8-2M76 36l2-8" />
          </g>
          <circle cx="80" cy="44" r="3" fill={BERRY} />
        </>
      );

    case 'heart':
      return (
        <>
          <DieCut d={heartPath} fill={BERRY} inset={0.9} />
          <path d="M44 44l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill={CREAM} />
          <path d="M74 58l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill={CREAM} />
        </>
      );

    case 'hundred':
      return (
        <>
          <g transform="rotate(-8 60 60)">
            <text
              x="60"
              y="66"
              textAnchor="middle"
              fontFamily="Archivo, system-ui, sans-serif"
              fontWeight={900}
              fontSize="46"
              fill={BERRY}
              stroke={LILAC}
              strokeWidth="7"
              paintOrder="stroke"
              strokeLinejoin="round"
              letterSpacing="-3"
            >
              100
            </text>
            <path
              d="M30 80c10 3 20 4 30 4s20-1 30-4"
              stroke={LILAC}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M36 90c8 2 16 3 24 3s16-1 24-3"
              stroke={LILAC}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        </>
      );

    case 'bam':
      return (
        <>
          <path d={burstPath(11, 58, 40)} fill={CREAM} stroke={CREAM} strokeWidth="9" strokeLinejoin="round" />
          <path d={burstPath(11, 54, 37)} fill={TANG} />
          <StickerWord size={30} y={71} rotate={-6}>
            BAM
          </StickerWord>
        </>
      );

    case 'heartHands':
      return (
        <>
          <DieCut d={blobB} fill={FOREST} />
          <g stroke={CREAM} strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M40 76c-6-6-8-18-4-26 3-6 9-7 12-2 2 4 1 10 1 10" />
            <path d="M80 76c6-6 8-18 4-26-3-6-9-7-12-2-2 4-1 10-1 10" />
            <path d="M43 54c2-12 8-20 17-20s15 8 17 20" />
            <path d="M52 68c4 5 12 5 16 0" />
          </g>
        </>
      );

    case 'fingerHeart':
      return (
        <>
          <DieCut d={blobA} fill={LILAC} />
          <g stroke={BERRY} strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M46 84V58c0-6 3-9 7-9s7 4 7 10v13" />
            <path d="M60 72V50c0-6 3-9 7-9s7 4 7 10v22" />
            <path d="M74 60c6-2 10 0 11 5 1 6-4 19-12 24-9 6-20 2-24-6" />
            <path d="M52 50c-2-6 0-10 4-12M70 40c3-3 7-3 10 0" />
          </g>
          <path d="M59 34c-4-5-11-3-11 3 0 5 7 9 11 12 4-3 11-7 11-12 0-6-7-8-11-3z" fill={BERRY} />
        </>
      );

    case 'thumbsUp':
      return (
        <>
          <DieCut d={blobA} fill={LIME} />
          <g stroke={BERRY} strokeWidth="3.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M50 58c6-6 10-14 10-22 0-4 3-6 6-6 4 0 6 3 6 8 0 8-2 14-4 18h14c5 0 8 4 7 9l-3 16c-1 6-6 9-12 9H50z" />
            <path d="M50 58v30" />
          </g>
          <path d="M28 56l-6-8M34 46l-3-10M24 66h-10" stroke={BERRY} strokeWidth="3" strokeLinecap="round" />
        </>
      );

    case 'cursor':
      return (
        <>
          <g transform="rotate(-12 60 60)">
            <path
              d="M48 24l40 30-18 4 10 20-10 5-10-20-12 12z"
              fill={LILAC}
              stroke={ROYAL}
              strokeWidth="5"
              strokeLinejoin="round"
            />
            <path d="M40 34l-8-6M44 22l-2-10M32 46l-12-2" stroke={ROYAL} strokeWidth="3.4" strokeLinecap="round" />
          </g>
        </>
      );

    case 'wrist':
      return (
        <>
          <DieCut d={blobB} fill={LIME} />
          <g stroke={TANG} strokeWidth="3.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M52 84V62c0-4 2-7 6-7s6 3 6 7v8" />
            <path d="M64 70c0-4 2-7 6-7s6 3 6 7v6" />
            <path d="M76 76c0-3 2-6 5-6s5 3 5 7v9c0 8-6 14-15 14H58c-9 0-15-6-15-14v-8" />
            <path d="M40 46l-8-4M44 36l-4-9M34 56l-10 1" />
          </g>
        </>
      );

    case 'letsGo':
      return (
        <>
          <path d={bubblePath} fill={CREAM} stroke={CREAM} strokeWidth="10" strokeLinejoin="round" />
          <path d={bubblePath} fill={ROYAL} transform="translate(60 58) scale(0.94) translate(-60 -58)" />
          <StickerWord size={19} y={50} stroke={ROYAL} strokeWidth={4}>
            let&apos;s
          </StickerWord>
          <StickerWord size={21} y={72} fill={LIME} stroke={ROYAL} strokeWidth={4}>
            goooo!
          </StickerWord>
        </>
      );

    case 'goodVibes':
      return (
        <>
          <path d={burstPath(12, 58, 42)} fill={CREAM} stroke={CREAM} strokeWidth="9" strokeLinejoin="round" />
          <path d={burstPath(12, 54, 39)} fill={TANG} />
          <StickerWord size={21} y={55} rotate={-4}>
            good
          </StickerWord>
          <StickerWord size={21} y={77} rotate={-4} fill={LIME}>
            vibes
          </StickerWord>
        </>
      );

    case 'hi':
      return (
        <>
          <path d={bubblePath} fill={CREAM} stroke={CREAM} strokeWidth="10" strokeLinejoin="round" />
          <path d={bubblePath} fill={ROYAL} transform="translate(60 58) scale(0.94) translate(-60 -58)" />
          <StickerWord size={40} y={70} rotate={-5}>
            hi!
          </StickerWord>
        </>
      );

    case 'joinClub':
      return (
        <>
          <DieCut d={blobB} fill={FOREST} />
          <StickerWord size={18} y={55} fill={LIME} stroke={FOREST} strokeWidth={4}>
            join the
          </StickerWord>
          <StickerWord size={24} y={78} stroke={FOREST} strokeWidth={4}>
            club
          </StickerWord>
        </>
      );

    case 'cool':
      return (
        <>
          <path d={burstPath(9, 56, 40)} fill={CREAM} stroke={CREAM} strokeWidth="9" strokeLinejoin="round" />
          <path d={burstPath(9, 52, 37)} fill={LILAC} />
          <StickerWord size={30} y={72} fill={ROYAL} stroke={CREAM} strokeWidth={4} rotate={-5}>
            cool
          </StickerWord>
        </>
      );

    default:
      return null;
  }
}

export function Sticker({
  kind,
  size = 84,
  rotate = 0,
  className = '',
  style,
  shadow = true,
}: {
  kind: StickerKey;
  size?: number;
  rotate?: number;
  className?: string;
  style?: CSSProperties;
  shadow?: boolean;
}) {
  return (
    <div
      className={`pointer-events-none select-none ${className}`}
      style={{ width: size, height: size, ...style }}
      aria-hidden="true"
    >
      <div style={{ width: '100%', height: '100%', transform: `rotate(${rotate}deg)` }}>
        <svg
          viewBox="0 0 120 120"
          width="100%"
          height="100%"
          style={{
            overflow: 'visible',
            filter: shadow ? 'drop-shadow(0 5px 10px rgba(0,0,0,.18))' : undefined,
          }}
        >
          <Art kind={kind} />
        </svg>
      </div>
    </div>
  );
}

export function Sparkle({ size = 44, color = LILAC, className = '', style }: { size?: number; color?: string; className?: string; style?: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d={sparklePath} fill={color} />
    </svg>
  );
}

export function LimeSpiky({
  size = 120,
  color = LIME,
  className = '',
  style,
}: {
  size?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} className={className} style={style} aria-hidden="true">
      <path d={spikyStarPath(9, 57, 31)} fill={color} />
    </svg>
  );
}

export { ROYAL, PERI, FOREST, TANG, BERRY, LILAC, LIME, INK };
