/**
 * Portfolio sheet renderer — dev-only.
 *
 * The portfolio is missing documentary photography, but several of its frames
 * are not photographs at all: they are *artefacts* the studio already owns —
 * an elevation plan, an edit timeline, a grid plan, a beat sheet, the identity
 * system. Those can be composed here from the real tokens, real typefaces and
 * the real sticker components, then captured to `public/images/portfolio/`.
 *
 * That keeps the portfolio honest: nothing here invents a client, a completed
 * build, a metric or a person. Every frame states what it is.
 *
 *   /audit/sheets/index.html?s=floral-elevation
 */
import { createRoot } from 'react-dom/client';
import { Sticker } from '../../src/components/art/Stickers';
import type { StickerKey } from '../../src/types';
import { CutEndCardSheet, CutHookSheet, CutRhythmSheet } from './cutSheets';

const C = {
  cream: '#EEEAE3',
  paper: '#E9E4DA',
  ink: '#0A0A0A',
  royal: '#4B63E8',
  peri: '#8499F8',
  forest: '#2E7D5B',
  tang: '#E8603C',
  berry: '#9B2155',
  lilac: '#E8B4F5',
  lime: '#E4FBA8',
};

type SheetProps = {
  kicker: string;
  meta: string;
  bg?: string;
  ink?: string;
  rule?: string;
  children: React.ReactNode;
  footer?: string;
};

function Sheet({ kicker, meta, bg = C.cream, ink = C.ink, rule, children, footer }: SheetProps) {
  const line = rule ?? `${ink}26`;
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: bg,
        color: ink,
        padding: '4vh 3.2vw 3.4vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: 24,
          borderBottom: `1px solid ${line}`,
          paddingBottom: '1.5vh',
          flexShrink: 0,
        }}
      >
        <span className="lbl" style={{ opacity: 0.6 }}>{kicker}</span>
        <span className="lbl" style={{ opacity: 0.42 }}>{meta}</span>
      </div>
      <div style={{ flex: 1, minHeight: 0, paddingTop: '2.3vh', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
      {footer && (
        <div
          className="lbl"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 20,
            borderTop: `1px solid ${line}`,
            paddingTop: '1.4vh',
            opacity: 0.42,
            flexShrink: 0,
          }}
        >
          <span>{footer}</span>
          <span>desi draft</span>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Drawings
 * ------------------------------------------------------------------ */

/** Branches leave the main stem in pairs; each carries one leaf at its tip. */
const BRANCHES = [
  { x: 300, y: 452, dx: -108, dy: -66, r: -148 },
  { x: 302, y: 424, dx: 112, dy: -58, r: -32 },
  { x: 304, y: 372, dx: -96, dy: -84, r: -139 },
  { x: 306, y: 344, dx: 100, dy: -80, r: -36 },
  { x: 310, y: 292, dx: -82, dy: -92, r: -131 },
  { x: 312, y: 264, dx: 86, dy: -88, r: -42 },
  { x: 316, y: 214, dx: -62, dy: -82, r: -127 },
];

function Botanical({ stroke = C.forest, accent = C.berry }: { stroke?: string; accent?: string }) {
  return (
    <g fill="none" strokeWidth={2.2} strokeLinecap="round">
      <g stroke={stroke}>
        <path d="M300 500c0-110 4-206 18-300 6-42 8-70 6-96" />
        {BRANCHES.map((b, i) => (
          <g key={i}>
            <path d={`M${b.x} ${b.y}q${b.dx * 0.55} ${b.dy * 0.45} ${b.dx} ${b.dy}`} />
            <ellipse
              cx={b.x + b.dx}
              cy={b.y + b.dy}
              rx={30}
              ry={11.5}
              transform={`rotate(${b.r} ${b.x + b.dx} ${b.y + b.dy})`}
            />
            <path d={`M${b.x} ${b.y}q${b.dx * 0.3} ${b.dy * 0.7} ${b.dx * 0.44} ${b.dy * 0.92}`} strokeWidth={1.4} opacity={0.7} />
          </g>
        ))}
        <path d="M324 176c14-26 40-40 66-38" strokeDasharray="5 7" />
      </g>
      <g stroke={accent} strokeWidth={2.6}>
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <ellipse key={deg} cx={324} cy={104} rx={9} ry={26} transform={`rotate(${deg} 324 130)`} />
        ))}
        <circle cx="324" cy="130" r="8" />
        <path d="M250 460c34 10 60 28 74 54" strokeDasharray="4 8" />
      </g>
    </g>
  );
}

/**
 * Spray-paint mark: sweeping passes, one splash, overspray and drips.
 * No glyphs at all — a wall composition, not a word pretending to be one.
 */
function Letterforms({ color = C.royal }: { color?: string }) {
  return (
    <g stroke={color} strokeLinecap="round" strokeLinejoin="round">
      <path
        d="M40 300c40-124 122-176 202-156s112 92 62 132"
        strokeWidth={30}
        fill="none"
        opacity={0.92}
      />
      <path d="M86 330c62-62 144-72 206-20" strokeWidth={15} fill="none" opacity={0.62} />
      <path
        d="M312 108c52 22 92 74 92 136 0 30-14 52-38 52"
        strokeWidth={21}
        fill="none"
        opacity={0.82}
      />
      <circle cx="392" cy="238" r="54" fill={color} stroke="none" opacity={0.9} />
      <circle cx="444" cy="176" r="13" fill={color} stroke="none" opacity={0.8} />
      <circle cx="466" cy="206" r="7" fill={color} stroke="none" opacity={0.7} />
      <circle cx="420" cy="146" r="9" fill={color} stroke="none" opacity={0.6} />
      <circle cx="476" cy="250" r="5" fill={color} stroke="none" opacity={0.55} />
      <path d="M118 306v52M214 322v38M338 262v46" strokeWidth={6} opacity={0.55} />
      <path d="M60 366h428" strokeWidth={2.4} strokeDasharray="2 16" opacity={0.75} />
    </g>
  );
}

function Waveform({ color = C.lime, cuts = [42, 118, 176, 240, 302, 368, 430, 500] }: { color?: string; cuts?: number[] }) {
  const bars = Array.from({ length: 64 }, (_, i) => 14 + Math.abs(Math.sin(i * 0.45) * 40) + (i % 3) * 8);
  return (
    <g>
      {bars.map((h, i) => (
        <rect key={i} x={i * 8} y={60 - h / 2} width={3.4} height={h} rx={1.7} fill={color} opacity={0.75} />
      ))}
      {cuts.map((x) => (
        <g key={x}>
          <path d={`M${x} 8v104`} stroke={C.cream} strokeWidth={1.4} strokeDasharray="4 5" opacity={0.6} />
          <circle cx={x} cy={8} r={3.2} fill={C.cream} />
        </g>
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------ *
 * Sheets
 * ------------------------------------------------------------------ */

function FloralElevation() {
  return (
    <Sheet
      kicker="floral alchemy — seating wall"
      meta="elevation a · 1:20 · 4.20 m"
      footer="palette before paint · paint chips tested on site"
    >
      <div style={{ display: 'flex', gap: '2.4vw', flex: 1, minHeight: 0 }}>
        <svg viewBox="0 0 1000 520" style={{ flex: 1, minWidth: 0, height: '100%' }} preserveAspectRatio="xMidYMid meet">
          <rect x="40" y="40" width="920" height="440" fill={C.paper} stroke={`${C.ink}22`} />
          <g stroke={`${C.ink}14`} strokeWidth={1}>
            {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${40 + (i + 1) * 84} 40v440`} />)}
            {Array.from({ length: 4 }, (_, i) => <path key={`h${i}`} d={`M40 ${40 + (i + 1) * 88}h920`} />)}
          </g>
          <g transform="translate(112 36) scale(0.62)">
            <Botanical />
          </g>
          <g opacity={0.9}>
            <path d="M612 40v440" stroke={`${C.ink}55`} strokeWidth={1.6} strokeDasharray="8 8" />
          </g>
          <g transform="translate(628 146) scale(0.7)">
            <Letterforms />
          </g>
          <g stroke={`${C.ink}66`} strokeWidth={1.2}>
            <path d="M40 500v-14M960 500v-14M40 493h920" />
            <path d="M600 486v14M40 486v14" />
          </g>
          <text x="500" y="518" textAnchor="middle" className="mono" fontSize="11" fill={`${C.ink}88`}>4.20 m</text>
          <text x="320" y="30" textAnchor="middle" className="mono" fontSize="10" fill={`${C.ink}66`}>botanical field</text>
          <text x="786" y="30" textAnchor="middle" className="mono" fontSize="10" fill={`${C.ink}66`}>lettering field</text>
        </svg>
        <div style={{ width: '19%', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 11, lineHeight: 1.5 }}>
          {[
            ['plaster cream', '#EEEAE3'],
            ['oxblood', C.berry],
            ['leaf green', C.forest],
            ['cobalt', C.royal],
          ].map(([name, hex]) => (
            <div key={name} style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
              <span style={{ width: 26, height: 26, background: hex, border: `1px solid ${C.ink}22`, flexShrink: 0 }} />
              <span className="lbl" style={{ letterSpacing: '0.08em', opacity: 0.6 }}>{name}</span>
            </div>
          ))}
          <p style={{ marginTop: 8, opacity: 0.5, fontSize: 10.5, lineHeight: 1.45 }}>
            Both languages drawn on one 300 mm grid so a petal can finish where a letter begins.
          </p>
        </div>
      </div>
    </Sheet>
  );
}

function FloralBotanical() {
  return (
    <Sheet kicker="floral alchemy — motif study" meta="sheet 01 / 04" bg={C.paper} footer="motif 01 · botanical line work · wall paint">
      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateRows: '1fr auto', gap: '1.6vh' }}>
        <svg viewBox="0 0 600 760" style={{ height: '100%', width: '100%' }} preserveAspectRatio="xMidYMid meet">
          <path d="M24 24h40M24 24v40M576 24h-40M576 24v40M24 736h40M24 736v-40M576 736h-40M576 736v-40" stroke={`${C.ink}44`} strokeWidth={1.4} fill="none" />
          <g transform="translate(-15 30) scale(1.05)">
            <Botanical stroke={C.forest} accent={C.berry} />
          </g>
          <g stroke={`${C.ink}33`} strokeWidth={1}>
            <path d="M300 96v-22M300 606v22M96 300h-22M604 300h22" />
          </g>
          <text x="300" y="60" textAnchor="middle" className="mono" fontSize="10" fill={`${C.ink}77`}>1 800 mm</text>
        </svg>
        <div style={{ display: 'flex', gap: 8 }}>
          {[C.berry, C.forest, C.royal, C.cream].map((c) => (
            <span key={c} style={{ height: 14, flex: 1, background: c, border: `1px solid ${C.ink}1a` }} />
          ))}
        </div>
      </div>
    </Sheet>
  );
}

function FloralLettering() {
  const passes: { n: string; label: string; color: string; opacity: number }[] = [
    { n: '01', label: 'pencil under-drawing', color: C.ink, opacity: 0.22 },
    { n: '02', label: 'cobalt block-in', color: C.royal, opacity: 1 },
    { n: '03', label: 'oxblood outline', color: C.berry, opacity: 1 },
  ];
  return (
    <Sheet kicker="floral alchemy — lettering" meta="counter wall · 3 passes" bg={C.paper} footer="lettering drawn on the wall grid, not traced from a font">
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '1.6vh' }}>
        {passes.map((p) => (
          <div key={p.n} style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', gap: 14, borderTop: `1px solid ${C.ink}12`, paddingTop: 8 }}>
            <span className="mono" style={{ fontSize: 10, opacity: 0.45, width: 18 }}>{p.n}</span>
            <svg viewBox="0 0 530 320" style={{ flex: 1, height: '100%' }} preserveAspectRatio="xMinYMid meet">
              <g opacity={p.opacity} transform="translate(0 10)">
                <Letterforms color={p.color} />
              </g>
            </svg>
            <span className="lbl" style={{ fontSize: 9, opacity: 0.4, width: 92, lineHeight: 1.4 }}>{p.label}</span>
          </div>
        ))}
      </div>
    </Sheet>
  );
}

function FloralCounter() {
  return (
    <Sheet kicker="floral alchemy — counter + menu" meta="service wall · surfaces" footer="paint, print and tile sampled against the room's own light">
      <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: '2vw' }}>
        <svg viewBox="0 0 620 400" style={{ flex: 1.35, height: '100%' }} preserveAspectRatio="xMidYMid meet">
          <rect x="20" y="70" width="580" height="300" fill={C.paper} stroke={`${C.ink}22`} />
          <rect x="20" y="70" width="580" height="46" fill={C.cream} stroke={`${C.ink}18`} />
          <g transform="translate(48 250) scale(0.46)">
            <Letterforms color={C.royal} />
          </g>
          <g stroke={`${C.ink}22`} strokeWidth={1}>
            <path d="M20 300h580M20 336h580" />
          </g>
          <rect x="330" y="34" width="270" height="44" rx="4" fill={C.ink} />
          <text x="465" y="62" textAnchor="middle" className="lbl" fontSize="11" fill={C.cream}>menu surface</text>
          <text x="30" y="52" className="mono" fontSize="10" fill={`${C.ink}66`}>counter face, elevation</text>
        </svg>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            background: C.cream,
            border: `1px solid ${C.ink}1f`,
            padding: '2.4vh 1.6vw',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div className="display" style={{ fontSize: '3.1vh' }}>the house</div>
            <div className="serif-i" style={{ fontSize: '2.2vh', opacity: 0.6, marginTop: 2 }}>all day</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5vh' }}>
            {[86, 74, 92, 66].map((w, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{ height: 7, width: `${w * 0.44}%`, background: `${C.ink}2e` }} />
                <span style={{ height: 1, flex: 1, background: `${C.ink}1a` }} />
                <span className="mono" style={{ fontSize: 10, opacity: 0.4 }}>—</span>
              </div>
            ))}
          </div>
          <div style={{ height: 6, background: C.berry, width: '42%' }} />
        </div>
      </div>
    </Sheet>
  );
}

function CutVertical() {
  return (
    <Sheet kicker="cut to the beat" meta="9:16 master" bg={C.tang} ink={C.ink} footer="type lands on the mark · sound-off legible" rule={`${C.ink}33`}>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div className="display" style={{ fontSize: '11vh' }}>
          cut
          <br />
          to the
          <br />
          <span className="serif-i" style={{ fontSize: '9vh' }}>beat</span>
        </div>
        <svg viewBox="0 0 400 120" style={{ width: '100%', height: '14vh' }} preserveAspectRatio="none">
          <Waveform color={C.ink} cuts={[46, 140, 232, 318]} />
        </svg>
        <div className="mono" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, opacity: 0.6 }}>
          <span>00:00:14:08</span>
          <span>15s cut</span>
        </div>
      </div>
    </Sheet>
  );
}

function CutHook() {
  return (
    <Sheet
      kicker="cut to the beat"
      meta="frame 01 · hook"
      bg={C.berry}
      ink={C.cream}
      footer="the first three seconds decide the rest"
      rule={`${C.cream}33`}
    >
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '2vh' }}>
        <div className="display" style={{ fontSize: '9vh', color: C.cream }}>
          the first
          <br />
          three
          <br />
          <span className="serif-i" style={{ fontSize: '7.6vh', color: C.lime }}>seconds</span>
        </div>

        {/* the three frames that make the hook — drawn, not described */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
          {[
            ['S1', 'counter, wide', '0.0 – 1.2s'],
            ['S2', 'hands, close', '1.2 – 2.0s'],
            ['S3', 'product, insert', '2.0 – 3.0s'],
          ].map(([id, shot, time], i) => (
            <div
              key={id}
              style={{
                flex: 1,
                border: `1px solid ${C.cream}44`,
                background: i === 0 ? `${C.cream}14` : 'transparent',
                padding: '1vh 10px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.4vh',
                minHeight: '17vh',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="mono" style={{ fontSize: 9, opacity: 0.6 }}>{id}</span>
                <span className="mono" style={{ fontSize: 9, opacity: 0.45 }}>{time}</span>
              </div>
              <svg viewBox="0 0 80 46" style={{ width: '100%', height: '6.5vh' }} preserveAspectRatio="none">
                <g stroke={`${C.cream}88`} strokeWidth={1.4} fill="none">
                  {i === 0 && (
                    <>
                      <rect x="6" y="16" width="68" height="24" />
                      <circle cx="40" cy="12" r="5" />
                    </>
                  )}
                  {i === 1 && (
                    <>
                      <path d="M10 40h60" />
                      <path d="M26 40V22c0-4 6-4 6 0v18M38 40V16c0-4 6-4 6 0v24M50 40V24c0-4 6-4 6 0v16" />
                    </>
                  )}
                  {i === 2 && (
                    <>
                      <rect x="20" y="10" width="40" height="28" rx="3" />
                      <path d="M30 24h20" />
                    </>
                  )}
                </g>
              </svg>
              <span className="lbl" style={{ fontSize: 8, opacity: 0.55 }}>{shot}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              style={{ width: i === 0 ? 34 : 14, height: 3, background: i === 0 ? C.lime : `${C.cream}66` }}
            />
          ))}
          <span className="mono" style={{ marginLeft: 'auto', fontSize: 10, opacity: 0.5 }}>0.0 → 3.0s</span>
        </div>
      </div>
    </Sheet>
  );
}

function CutSquare() {
  return (
    <Sheet kicker="cut to the beat" meta="1:1 composite" bg={C.ink} ink={C.cream} footer="beat-marked timeline — picture cut to the marks" rule={`${C.cream}2e`}>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '3vh' }}>
        <svg viewBox="0 0 520 120" style={{ width: '100%', height: '26%' }} preserveAspectRatio="none">
          <Waveform color={C.lime} cuts={[42, 118, 176, 240, 302, 368, 430, 500]} />
        </svg>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 6 }}>
          {['01', '02', '03', '04', '05', '06', '07', '08'].map((n, i) => (
            <div
              key={n}
              style={{
                aspectRatio: '1 / 1',
                border: `1px solid ${C.cream}33`,
                background: i % 3 === 0 ? `${C.cream}12` : 'transparent',
                display: 'grid',
                placeItems: 'center',
                fontSize: '1.5vh',
                opacity: i === 7 ? 0.35 : 1,
              }}
              className="mono"
            >
              {n}
            </div>
          ))}
        </div>
        <div className="lbl" style={{ opacity: 0.5, letterSpacing: '0.14em' }}>downbeat · transient · hold · cut</div>
      </div>
    </Sheet>
  );
}

function CutEndcard() {
  return (
    <Sheet kicker="cut to the beat" meta="16:9 end card" footer="three ratios, three compositions — never one crop">
      <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', gap: '4vw' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1vh' }}>
          <div className="display" style={{ fontSize: '11vh' }}>desi draft</div>
          <div style={{ height: 4, width: '62%', background: C.royal }} />
          <div className="serif-i" style={{ fontSize: '4.6vh', opacity: 0.78 }}>cut to the beat</div>
          <div className="mono" style={{ fontSize: 11, opacity: 0.5, marginTop: '1.6vh' }}>
            edit · motion · type · sound direction
          </div>
        </div>

        {/* the three masters, at their own proportions */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.2vw' }}>
          {[
            ['9:16', 'w 62px', '110px'],
            ['1:1', 'w 110px', '110px'],
            ['16:9', 'w 196px', '110px'],
          ].map(([ratio, w, h]) => (
            <div key={ratio} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div
                style={{
                  width: w,
                  height: h,
                  border: `1px solid ${C.ink}55`,
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <div style={{ width: '60%', height: 2, background: `${C.ink}55` }} />
              </div>
              <span className="mono" style={{ fontSize: 9, opacity: 0.45 }}>{ratio}</span>
            </div>
          ))}
        </div>
      </div>
    </Sheet>
  );
}

const GRID = [
  ['talking head', C.lilac],
  ['counter shot', C.cream],
  ['comment reply', C.lime],
  ['counter shot', C.paper],
  ['open slot', 'transparent'],
  ['talking head', C.peri],
  ['comment reply', C.cream],
  ['counter shot', C.lilac],
  ['talking head', C.lime],
  ['comment reply', C.cream],
  ['counter shot', C.paper],
  ['reel', C.forest],
] as const;

/** A tile's format, drawn: the shape each recurring post actually takes. */
function GridMini({ label, fg }: { label: string; fg: string }) {
  const bar = (w: string, key: number) => (
    <span key={key} style={{ display: 'block', height: 5, width: w, background: fg, opacity: 0.42, marginBottom: 8 }} />
  );
  if (label === 'reel') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="26" height="26" viewBox="0 0 12 12"><path d="M3 1l8 5-8 5z" fill={fg} opacity={0.75} /></svg>
        <span className="mono" style={{ fontSize: 11, color: fg, opacity: 0.6 }}>12s</span>
      </div>
    );
  }
  if (label === 'open slot') {
    return <span className="serif-i" style={{ fontSize: '4.2vh', color: fg, opacity: 0.35 }}>?</span>;
  }
  if (label === 'talking head') {
    return (
      <div>
        <span
          style={{ display: 'block', width: 32, height: 32, borderRadius: '50%', background: fg, opacity: 0.35, marginBottom: 12 }}
        />
        {bar('82%', 0)}
        {bar('56%', 1)}
      </div>
    );
  }
  if (label === 'comment reply') {
    return (
      <div>
        <span className="serif-i" style={{ display: 'block', fontSize: '3.8vh', lineHeight: 0.7, color: fg, opacity: 0.4 }}>
          &ldquo;
        </span>
        {bar('90%', 0)}
        {bar('64%', 1)}
      </div>
    );
  }
  // counter shot: three stacked lines of a caption
  return (
    <div>
      {bar('70%', 0)}
      {bar('86%', 1)}
      {bar('48%', 2)}
    </div>
  );
}

function AlwaysGrid() {
  return (
    <Sheet kicker="always on — monthly grid" meta="12 posts · 1 open slot" bg={C.paper} footer="colour rhythm planned across rows, not post by post">
      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.4vh', alignContent: 'stretch' }}>
        {GRID.map(([label, color], i) => {
          const fg = color === C.forest ? C.cream : C.ink;
          return (
            <div
              key={i}
              style={{
                border: `1px solid ${color === 'transparent' ? `${C.ink}44` : `${C.ink}18`}`,
                borderStyle: color === 'transparent' ? 'dashed' : 'solid',
                background: color === 'transparent' ? 'transparent' : color,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.1vh 0.7vw',
                overflow: 'hidden',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span className="lbl" style={{ fontSize: 8, opacity: 0.55, letterSpacing: '0.1em' }}>{label}</span>
                <span className="mono" style={{ fontSize: 8, opacity: 0.35 }}>{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div style={{ color: fg, marginTop: 'auto', marginBottom: 'auto', paddingTop: '1vh' }}>
                <GridMini label={label} fg={fg} />
              </div>
              <span className="mono" style={{ fontSize: 7.5, opacity: 0.4 }}>
                {label === 'reel' ? '9:16' : '4:5'}
              </span>
            </div>
          );
        })}
      </div>
    </Sheet>
  );
}

function AlwaysSet() {
  const cards = [
    { bg: C.lilac, ink: C.ink, title: 'the voice', line: C.berry, quote: 'we say the quiet part on camera.' },
    { bg: C.ink, ink: C.cream, title: 'the format', line: C.lime, quote: 'three shapes, one month, no filler.' },
    { bg: C.peri, ink: C.ink, title: 'the reply', line: C.ink, quote: 'the comments decide next week.' },
  ];
  return (
    <Sheet kicker="always on — post set" meta="3 creatives · feed 4:5" footer="concept set for the studio's own account system">
      <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: '1.6vw' }}>
        {cards.map((c, i) => (
          <div
            key={c.title}
            style={{
              flex: 1,
              background: c.bg,
              color: c.ink,
              padding: '2vh 1.2vw',
              display: 'flex',
              flexDirection: 'column',
              border: `1px solid ${C.ink}12`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="lbl" style={{ fontSize: 8.5, opacity: 0.6 }}>desi draft</span>
              <span className="mono" style={{ fontSize: 8.5, opacity: 0.45 }}>0{i + 1} / 03</span>
            </div>

            <div style={{ marginTop: '3vh', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{ width: 18, height: 18, borderRadius: '50%', background: c.ink, opacity: 0.55, flex: 'none' }}
              />
              <span className="lbl" style={{ fontSize: 8, opacity: 0.5 }}>@desidraftt.co</span>
            </div>

            <div style={{ margin: 'auto 0', paddingTop: '2vh' }}>
              <div className="serif-i" style={{ fontSize: '2.9vh', lineHeight: 1.14, opacity: 0.9 }}>
                &ldquo;{c.quote}&rdquo;
              </div>
              <div style={{ display: 'flex', gap: 5, marginTop: '2.2vh' }}>
                {[0, 1, 2, 3, 4].map((d) => (
                  <span
                    key={d}
                    style={{
                      width: 22,
                      height: 2,
                      background: c.ink,
                      opacity: d === 0 ? 0.55 : 0.18,
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ marginTop: 'auto' }}>
              <div style={{ height: 4, width: '40%', background: c.line, marginBottom: '1.2vh' }} />
              <div className="display" style={{ fontSize: '3.4vh' }}>{c.title}</div>
              <div className="serif-i" style={{ fontSize: '1.8vh', opacity: 0.6 }}>one system, one voice</div>
              <div
                style={{
                  marginTop: '1.8vh',
                  borderTop: `1px solid ${c.ink}26`,
                  paddingTop: '1vh',
                  fontSize: '1.25vh',
                  lineHeight: 1.5,
                  opacity: 0.65,
                }}
              >
                {c.title === 'the voice'
                  ? 'Talking head, 12 s. One sentence to camera, captions burned in.'
                  : c.title === 'the format'
                    ? 'Carousel, 5 frames. Same grid every month, new lines.'
                    : 'Reply reel, 8 s. Screenshot of the comment, then the answer.'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Sheet>
  );
}

function AlwaysReel() {
  return (
    <Sheet
      kicker="always on — reel cover"
      meta="9:16 · sound off"
      bg={C.lime}
      ink={C.ink}
      footer="if it does not read muted, it does not run"
      rule={`${C.ink}33`}
    >
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className="lbl" style={{ opacity: 0.5 }}>reel · 12s</span>
          <span className="mono" style={{ fontSize: 10, opacity: 0.4 }}>0:00 / 0:12</span>
        </div>

        <div className="display" style={{ fontSize: '9.5vh' }}>
          sound
          <br />
          <span className="serif-i" style={{ fontSize: '8vh', color: C.berry }}>off</span>
        </div>

        {/* the caption band the feed actually reads */}
        <div style={{ background: C.ink, color: C.lime, padding: '1.5vh 1vw' }}>
          <div style={{ fontSize: '1.55vh', lineHeight: 1.4 }}>
            Three seconds in, the caption has already done the work.
          </div>
          <div className="mono" style={{ fontSize: 8.5, opacity: 0.55, marginTop: 8 }}>captions burned in · 78% safe area</div>
        </div>

        <svg viewBox="0 0 400 90" style={{ width: '100%', height: '10vh' }} preserveAspectRatio="none">
          <Waveform color={C.ink} cuts={[40, 132, 224, 316]} />
        </svg>

        <div style={{ borderTop: `1px solid ${C.ink}33`, paddingTop: '1.4vh' }}>
          <div className="mono" style={{ fontSize: 11, opacity: 0.55 }}>captions on · type in the top third</div>
        </div>
      </div>
    </Sheet>
  );
}

const BEATS = [
  ['hook', '0 – 3s', 'a frame that reads without sound', 'S1 · counter, wide'],
  ['turn', '~50%', 'one change of information, not of scene', 'S4 · hands, close'],
  ['payoff', 'last 4s', 'the brand lands after the story pays for itself', 'S7 · product, static'],
];

function BeatSheet() {
  return (
    <Sheet kicker="hook, turn, payoff" meta="30s script · three beats" footer="20s of throat-clearing removed before the first shoot">
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '0.6fr 0.7fr 2fr 1.1fr', gap: 12, borderBottom: `1px solid ${C.ink}33`, paddingBottom: 8 }}>
          {['beat', 'time', 'what happens', 'shot'].map((h) => (
            <span key={h} className="lbl" style={{ opacity: 0.45, fontSize: 9 }}>{h}</span>
          ))}
        </div>
        {BEATS.map((row) => (
          <div
            key={row[0]}
            style={{ display: 'grid', gridTemplateColumns: '0.6fr 0.7fr 2fr 1.1fr', gap: 12, alignItems: 'center', padding: '2.1vh 0', borderBottom: `1px solid ${C.ink}14` }}
          >
            <span className="display" style={{ fontSize: '3vh' }}>{row[0]}</span>
            <span className="mono" style={{ fontSize: 12, opacity: 0.6 }}>{row[1]}</span>
            <span style={{ fontSize: '1.75vh', lineHeight: 1.4, opacity: 0.8 }}>{row[2]}</span>
            <span className="mono" style={{ fontSize: 11, opacity: 0.45 }}>{row[3]}</span>
          </div>
        ))}
        {/* the shot column that comes out of the beats — seven set-ups, not one */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', columnGap: '3vw', rowGap: '0.4vh', paddingTop: '2.6vh' }}>
          <span className="lbl" style={{ fontSize: 9, opacity: 0.4 }}>shot</span>
          <span className="lbl" style={{ fontSize: 9, opacity: 0.4 }}>shot</span>
          {[
            ['S1', 'counter, wide', '9:16', '1.2s'],
            ['S2', 'hands, close', '1:1', '0.8s'],
            ['S3', 'product, insert', '4:5', '1.0s'],
            ['S4', 'hands, close', '9:16', '1.4s'],
            ['S5', 'counter, mid', '16:9', '1.2s'],
            ['S6', 'reaction, cutaway', '1:1', '1.0s'],
            ['S7', 'product, static', '16:9', '2.0s'],
          ].map(([id, shot, ratio, len]) => (
            <div
              key={id}
              style={{
                display: 'grid',
                gridTemplateColumns: '34px 1fr auto auto',
                gap: 10,
                alignItems: 'baseline',
                borderTop: `1px solid ${C.ink}12`,
                padding: '0.75vh 0',
              }}
            >
              <span className="mono" style={{ fontSize: 9, opacity: 0.5 }}>{id}</span>
              <span style={{ fontSize: '1.4vh', opacity: 0.8 }}>{shot}</span>
              <span className="mono" style={{ fontSize: 8.5, opacity: 0.4 }}>{ratio}</span>
              <span className="mono" style={{ fontSize: 8.5, opacity: 0.4 }}>{len}</span>
            </div>
          ))}
        </div>

        {/* the four lines the edit actually has to carry */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', columnGap: '3vw', rowGap: '0.9vh', paddingTop: '2.4vh' }}>
          {[
            ['0.0', 'Nobody reads the caption first.'],
            ['3.2', 'So we cut to the hands.'],
            ['14.6', 'Same shot. New information.'],
            ['26.0', 'desi draft. Ideas into impact.'],
          ].map(([t, line]) => (
            <div
              key={t}
              style={{
                display: 'grid',
                gridTemplateColumns: '52px 1fr',
                gap: 12,
                alignItems: 'baseline',
                borderTop: `1px solid ${C.ink}14`,
                paddingTop: '0.9vh',
              }}
            >
              <span className="mono" style={{ fontSize: 9, opacity: 0.45 }}>{t}</span>
              <span className="serif-i" style={{ fontSize: '2.1vh', opacity: 0.85 }}>{line}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '3.4vh' }}>
          <div style={{ display: 'flex', height: '2.6vh', border: `1px solid ${C.ink}22` }}>
            <div style={{ width: '10%', background: C.forest }} />
            <div style={{ flex: 1, background: `${C.ink}0d`, borderLeft: `1px dashed ${C.ink}44`, borderRight: `1px dashed ${C.ink}44` }} />
            <div style={{ width: '13.3%', background: C.berry }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }} className="lbl">
            <span style={{ fontSize: 9, opacity: 0.5 }}>0s · hook</span>
            <span style={{ fontSize: 9, opacity: 0.5 }}>15s · turn</span>
            <span style={{ fontSize: 9, opacity: 0.5 }}>30s · payoff</span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '2vh' }}>
          <span className="serif-i" style={{ fontSize: '3.2vh', opacity: 0.7 }}>read it out loud first</span>
          <span className="lbl" style={{ opacity: 0.35, fontSize: 9 }}>15s · 30s · 45s · 60s</span>
        </div>
      </div>
    </Sheet>
  );
}

function Storyboard() {
  const frames = [
    { n: '01', note: 'cold open, no VO', shot: 'S1 · counter, wide', time: '0.0–1.2s', lens: '24 mm' },
    { n: '02', note: 'turn at the halfway mark', shot: 'S4 · hands, close', time: '14.6–16.0s', lens: '50 mm' },
    { n: '03', note: 'payoff, brand last', shot: 'S7 · product, static', time: '26.0–30.0s', lens: '35 mm' },
  ];
  return (
    <Sheet kicker="hook, turn, payoff — storyboard" meta="first three seconds" bg={C.paper} footer="drawn as frames, then written — not the other way round">
      <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: '1.4vw' }}>
        {frames.map((f, i) => (
          <div key={f.n} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ flex: 1, minHeight: 0, border: `1px solid ${C.ink}2e`, background: C.cream, position: 'relative', overflow: 'hidden' }}>
              <svg viewBox="0 0 300 220" style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid slice">
                <g stroke={`${C.ink}55`} strokeWidth={1.6} fill="none" strokeLinecap="round">
                  <path d="M0 170h300" />
                  {i === 0 && (
                    <>
                      <rect x="96" y="86" width="108" height="84" />
                      <path d="M120 86v-26h60v26" />
                      <path d="M150 60v26" />
                    </>
                  )}
                  {i === 1 && (
                    <>
                      <circle cx="150" cy="120" r="34" />
                      <path d="M150 78v-20M150 182v-20M108 120H88M212 120h20" />
                    </>
                  )}
                  {i === 2 && (
                    <>
                      <rect x="70" y="100" width="160" height="52" rx="6" />
                      <path d="M96 126h108" />
                      <path d="M118 60l10 18M188 60l-10 18" strokeDasharray="4 5" />
                    </>
                  )}
                </g>
              </svg>
              <div
                style={{
                  position: 'absolute',
                  inset: 'auto 0 0 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  gap: 8,
                  borderTop: `1px solid ${C.ink}22`,
                  padding: '0.8vh 10px',
                  background: `${C.cream}e6`,
                }}
              >
                <span className="mono" style={{ fontSize: 9, opacity: 0.6 }}>{f.shot}</span>
                <span className="mono" style={{ fontSize: 8.5, opacity: 0.4 }}>{f.time}</span>
              </div>
              <span
                className="mono"
                style={{
                  position: 'absolute',
                  top: 8,
                  left: 10,
                  fontSize: 10,
                  opacity: 0.5,
                  background: `${C.cream}d9`,
                  padding: '1px 5px',
                }}
              >
                {f.n}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
              <span className="lbl" style={{ fontSize: 9, opacity: 0.45 }}>{f.note}</span>
              <span className="mono" style={{ fontSize: 8, opacity: 0.35 }}>{f.lens}</span>
            </div>
          </div>
        ))}
      </div>
    </Sheet>
  );
}

/**
 * The identity, applied. The left half is the real homepage — the mark, the
 * palette and the stickers doing their actual job — and the right half is the
 * system that produced it: lockups, signature, stickers, colour by role.
 * No hex-value colour bar: colour is shown on the surfaces it governs.
 */
function IdentitySheet() {
  const jobs = [
    ['structure', 'section fields', C.forest, C.cream],
    ['action', 'in-progress, CTAs', C.tang, C.ink],
    ['content', 'social + editorial', C.peri, C.ink],
    ['content', 'campaign surfaces', C.lilac, C.ink],
    ['emphasis', 'one per screen', C.lime, C.ink],
  ] as const;

  return (
    <Sheet
      kicker="studio identity"
      meta="the system, applied · desidraft.com"
      footer="one loud mark · colour by job · four faces, four jobs"
    >
      <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: '1.6vw' }}>
        {/* real application: the homepage this identity is running on */}
        <div style={{ flex: '1.45', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', border: `1px solid ${C.ink}1f`, background: C.ink }}>
            <img
              src="/work/desi-draft-home.jpg"
              alt="Desi Draft homepage: wordmark, headline and stickers in place"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '1vh' }}>
            <span className="lbl" style={{ fontSize: 9, opacity: 0.45 }}>the identity in use — home, 1440 × 900</span>
            <span className="mono" style={{ fontSize: 9, opacity: 0.35 }}>01 / 03</span>
          </div>
        </div>

        {/* the system: mark, lockups, signature, punctuation */}
        <div style={{ flex: '1', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.4vh' }}>
          <div
            className="display"
            style={{ fontSize: '6.2vh', lineHeight: 0.84, letterSpacing: '-0.05em' }}
          >
            desi<br />draft
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div
              style={{
                flex: 1,
                background: C.ink,
                color: C.cream,
                padding: '1.5vh 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span className="display" style={{ fontSize: '2.1vh', letterSpacing: '-0.03em' }}>desi draft</span>
            </div>
            <div
              style={{
                flex: 1,
                border: `1px solid ${C.ink}33`,
                padding: '1.5vh 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span className="script" style={{ fontSize: '2.5vh' }}>desi draft</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: '0.6vh' }}>
            <Sticker kind="smiley" size={92} rotate={-6} shadow={false} />
            <Sticker kind="bam" size={92} rotate={4} shadow={false} />
            <Sticker kind="joinClub" size={92} rotate={-3} shadow={false} />
            <span className="lbl" style={{ fontSize: 8.5, opacity: 0.42, lineHeight: 1.6, maxWidth: '22ch' }}>
              sixteen die-cuts, used one per surface
            </span>
          </div>
          <p
            style={{
              fontSize: '1.78vh',
              lineHeight: 1.45,
              opacity: 0.72,
              margin: '0.8vh 0 0',
              maxWidth: '38ch',
            }}
          >
            The mark is set as tight as the letters allow, so it still reads as a shape at 40 px. Every
            surface takes one colour, and that colour always means the same thing.
          </p>

          {/* the mark at the sizes it actually has to survive */}
          <div style={{ marginTop: 'auto', display: 'flex', gap: 10, alignItems: 'stretch' }}>
            {[
              ['40 px', 44],
              ['24 px', 27],
              ['16 px', 18],
            ].map(([label, size]) => (
              <div
                key={label as string}
                style={{
                  flex: 1,
                  border: `1px solid ${C.ink}22`,
                  padding: '1vh 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 6,
                  minHeight: '9.5vh',
                }}
              >
                <span className="mono" style={{ fontSize: 8.5, opacity: 0.4 }}>{label}</span>
                <span className="display" style={{ fontSize: size as number, letterSpacing: '-0.05em', lineHeight: 0.9 }}>
                  desi draft
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* colour, on the surfaces it governs */}
      <div style={{ display: 'flex', gap: '0.65vw', height: '15.5vh', marginTop: '1.8vh' }}>
        {jobs.map(([job, use, bg, fg]) => (
          <div
            key={use}
            style={{
              flex: 1,
              background: bg,
              color: fg,
              padding: '1.4vh 14px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <span className="display" style={{ fontSize: '2.1vh', letterSpacing: '-0.02em' }}>{job}</span>
            <span className="lbl" style={{ fontSize: 8.5, opacity: 0.75 }}>{use}</span>
          </div>
        ))}
      </div>
    </Sheet>
  );
}

/**
 * The type system, both ways: the four faces with their exact settings on the
 * left, and one page composed out of all four on the right. The specimen is
 * about hierarchy in use, not four isolated lines on an empty field.
 */
function TypeSpecimen() {
  const rows = [
    {
      face: 'Archivo',
      role: 'statement',
      sample: 'we make content',
      cls: 'display',
      size: '5.2vh',
      note: 'Hero lines, case-study titles, the wordmark. Set tight, tracked −0.03em.',
      meta: '800 · 0.9 leading',
    },
    {
      face: 'Instrument Serif',
      role: 'aside',
      sample: 'for the new mainstream',
      cls: 'serif-i',
      size: '4.4vh',
      note: 'The human interruption inside a statement. Four words at most.',
      meta: '400 italic · −0.01em',
    },
    {
      face: 'DM Sans',
      role: 'reading',
      sample: 'A studio built around what it can actually show.',
      cls: '',
      size: '2.2vh',
      note: 'Body copy, captions, tables. 15–16 px at 1.65 leading; labels at 11 px.',
      meta: '400 / 500 · 15–16 px',
    },
    {
      face: 'Yellowtail',
      role: 'signature',
      sample: 'desi draft',
      cls: 'script',
      size: '4.2vh',
      note: 'The sign-off only: footer, end card, packaging. Never body copy.',
      meta: '400 · signature',
    },
  ];

  return (
    <Sheet
      kicker="studio identity — type"
      meta="four faces, four jobs"
      bg={C.paper}
      footer="no typeface is used outside its job"
    >
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {rows.map((r) => (
          <div
            key={r.face}
            style={{
              display: 'grid',
              gridTemplateColumns: '14% 1fr 18%',
              alignItems: 'center',
              gap: '1.6vw',
              borderBottom: `1px solid ${C.ink}20`,
              padding: '1.5vh 0',
            }}
          >
            <div>
              <div className="mono" style={{ fontSize: 10, opacity: 0.7 }}>{r.face}</div>
              <div className="lbl" style={{ fontSize: 8.5, opacity: 0.4 }}>{r.role}</div>
            </div>
            <div style={{ minWidth: 0 }}>
              <div className={r.cls} style={{ fontSize: r.size, lineHeight: 1, whiteSpace: 'nowrap' }}>
                {r.sample}
              </div>
              <div style={{ fontSize: '1.5vh', lineHeight: 1.4, opacity: 0.55, marginTop: '0.9vh' }}>
                {r.note}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="mono" style={{ fontSize: 9, opacity: 0.55 }}>{r.meta}</div>
            </div>
          </div>
        ))}

        {/* character sets, one column per face — the reference part of a specimen */}
        <div
          style={{
            flex: 'none',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.4vw',
            paddingTop: '2vh',
          }}
        >
          {[
            { cls: 'display', face: 'Archivo', size: '1.9vh', spacing: '-0.02em' },
            { cls: 'serif-i', face: 'Instrument Serif', size: '1.9vh', spacing: '0' },
            { cls: '', face: 'DM Sans', size: '1.62vh', spacing: '0' },
            { cls: 'script', face: 'Yellowtail', size: '2.1vh', spacing: '0' },
          ].map((f) => (
            <div key={f.face} style={{ display: 'flex', flexDirection: 'column', gap: '0.8vh' }}>
              <span className="lbl" style={{ fontSize: 8, opacity: 0.4 }}>{f.face}</span>
              <div className={f.cls} style={{ fontSize: f.size, lineHeight: 1.35, letterSpacing: f.spacing, opacity: 0.85 }}>
                ABCDEFGHIJKLM<br />NOPQRSTUVWXYZ<br />abcdefghijklm<br />0123456789 &amp; ₹ %<br />,.!?—·‘’“” ()
              </div>
            </div>
          ))}
        </div>

        {/* how they pair, which is the part a specimen is actually for */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: 'grid',
            gridTemplateRows: 'repeat(3, 1fr)',
            columnGap: '1.4vw',
            paddingTop: '2.2vh',
          }}
        >
          {[
            ['statement + aside', 'display', 'ideas into impact', 'serif-i', 'before the scroll decides'],
            ['label + reading', 'lbl', 'SECTION 04 — WHAT WE DO', '', '16 px over 68 characters, 1.65 leading.'],
            ['sign-off', 'script', 'desi draft', '', 'footer, end card, packaging. Never body copy.'],
          ].map(([label, c1, s1, c2, s2], i) => (
            <div
              key={label}
              style={{
                display: 'grid',
                gridTemplateColumns: '190px 1fr',
                alignItems: 'center',
                gap: '1.4vw',
                borderTop: i === 0 ? `1px solid ${C.ink}20` : `1px solid ${C.ink}12`,
              }}
            >
              <span className="lbl" style={{ fontSize: 8.5, opacity: 0.4 }}>{label}</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.1vw', flexWrap: 'nowrap' }}>
                <span
                  className={c1}
                  style={{
                    fontSize: i === 0 ? '4.2vh' : i === 1 ? 10 : '3.4vh',
                    letterSpacing: i === 1 ? '0.16em' : '-0.02em',
                    opacity: i === 1 ? 0.55 : 1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {s1}
                </span>
                <span
                  className={c2}
                  style={{ fontSize: i === 0 ? '3.6vh' : '1.5vh', opacity: 0.72, whiteSpace: 'nowrap' }}
                >
                  {s2}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* the four faces on one line, in the order a page uses them */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: '1.2vw',
            paddingTop: '1.4vh',
            borderTop: `1px solid ${C.ink}20`,
          }}
        >
          <span className="lbl" style={{ fontSize: 8.5, opacity: 0.4 }}>one line, all four</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.1vw', flexWrap: 'nowrap' }}>
            <span className="display" style={{ fontSize: '2.5vh' }}>we make content</span>
            <span className="serif-i" style={{ fontSize: '2.3vh' }}>for the new desi mainstream,</span>
            <span style={{ fontSize: '1.55vh', opacity: 0.8 }}>every week, without inventing a claim.</span>
            <span className="script" style={{ fontSize: '2.2vh' }}>desi draft</span>
          </div>
        </div>
      </div>
    </Sheet>
  );
}

const STICKERS: StickerKey[] = [
  'smiley', 'camera', 'phone', 'heart', 'hundred', 'bam', 'heartHands', 'fingerHeart',
  'thumbsUp', 'cursor', 'wrist', 'letsGo', 'goodVibes', 'hi', 'joinClub', 'cool',
];

const STICKER_NAME: Record<string, string> = {
  smiley: 'smiley',
  camera: 'camera',
  phone: 'phone',
  heart: 'heart',
  hundred: '100',
  bam: 'bam',
  heartHands: 'heart hands',
  fingerHeart: 'finger heart',
  thumbsUp: 'thumbs up',
  cursor: 'cursor',
  wrist: 'wrist',
  letsGo: "let's go",
  goodVibes: 'good vibes',
  hi: 'hi',
  joinClub: 'join the club',
  cool: 'cool',
};

function StickerSheet() {
  return (
    <Sheet
      kicker="studio identity — stickers"
      meta="sixteen die-cuts · one weight, one white keyline"
      footer="used one per surface, as punctuation · drawn in code, exported as vectors"
    >
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(4, 1fr)',
          gap: '0.6vh 1vw',
        }}
      >
        {STICKERS.map((kind, i) => (
          <div
            key={kind}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.7vw',
              borderTop: `1px solid ${C.ink}14`,
              paddingTop: '0.4vh',
            }}
          >
            <span className="mono" style={{ fontSize: 8.5, opacity: 0.35, width: 16 }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <Sticker kind={kind} size={104} rotate={i % 3 === 0 ? -4 : i % 3 === 1 ? 3 : 0} shadow={false} />
            <span className="lbl" style={{ fontSize: 8.5, opacity: 0.45, lineHeight: 1.5 }}>{STICKER_NAME[kind] ?? kind}</span>
          </div>
        ))}
      </div>
    </Sheet>
  );
}

const SHEETS: Record<string, () => JSX.Element> = {
  'floral-elevation': FloralElevation,
  'floral-botanical': FloralBotanical,
  'floral-lettering': FloralLettering,
  'floral-counter': FloralCounter,
  'cut-vertical': CutVertical,
  'cut-hook': CutHookSheet,
  'cut-square': CutRhythmSheet,
  'cut-endcard': CutEndCardSheet,
  'always-grid': AlwaysGrid,
  'always-set': AlwaysSet,
  'always-reel': AlwaysReel,
  'beat-sheet': BeatSheet,
  storyboard: Storyboard,
  'identity-sheet': IdentitySheet,
  'type-specimen': TypeSpecimen,
  'sticker-sheet': StickerSheet,
};

function App() {
  const id = new URLSearchParams(location.search).get('s') ?? '';
  const Comp = SHEETS[id];
  if (!Comp) {
    return (
      <div style={{ padding: 40, fontSize: 13 }}>
        {Object.keys(SHEETS).map((k) => (
          <div key={k}>
            <a href={`?s=${k}`} style={{ color: C.royal }}>{k}</a>
          </div>
        ))}
      </div>
    );
  }
  return <Comp />;
}

createRoot(document.getElementById('root')!).render(<App />);
