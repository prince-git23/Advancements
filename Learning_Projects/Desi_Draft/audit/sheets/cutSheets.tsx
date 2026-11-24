/**
 * Cut to the Beat — the three format sheets, rendered from the film's own data.
 *
 * The waveform on sheet 02 is the master's real audio (96 RMS windows, from
 * `src/data/cutToBeat.ts`); the marks are picture chapters read off the
 * footage. Sheet 01 is a title frame, sheet 03 carries the real wordmark and a
 * real end frame. Captured by `audit/tools/sheets.mjs`.
 */
import { Logo } from '../../src/components/art/Logo';
import { cutFilm } from '../../src/data/cutToBeat';

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

const TOTAL = 18.54;

function Frame({
  kicker,
  meta,
  bg = C.cream,
  ink = C.ink,
  rule,
  footer,
  children,
}: {
  kicker: string;
  meta: string;
  bg?: string;
  ink?: string;
  rule?: string;
  footer?: string;
  children: React.ReactNode;
}) {
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

/** Bars from real peaks, mirrored around the centre. */
function Bars({
  peaks,
  color,
  height,
  opacity = 0.85,
}: {
  peaks: number[];
  color: string;
  height: number;
  opacity?: number;
}) {
  const gap = 1000 / peaks.length;
  const bar = gap * 0.62;
  return (
    <g>
      {peaks.map((p, i) => {
        const h = Math.max(3, p * 220);
        return (
          <rect
            key={i}
            x={i * gap + (gap - bar) / 2}
            y={height / 2 - h / 2}
            width={bar}
            height={h}
            rx={bar * 0.22}
            fill={color}
            opacity={opacity}
          />
        );
      })}
    </g>
  );
}

/* 01 — the opening hook, 9:16 ---------------------------------------- */

export function CutHookSheet() {
  const hook = cutFilm.peaks.slice(0, 16);
  return (
    <Frame
      kicker="cut to the beat"
      meta="frame 01 · hook · 9:16"
      bg={C.tang}
      ink={C.ink}
      rule={`${C.ink}33`}
      footer="sound-off legible · master 18.5 s"
    >
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div className="mono" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, opacity: 0.55 }}>
            <span>00:00:00:00</span>
            <span>3.0 s hook</span>
          </div>
          <div className="display" style={{ fontSize: '11.4vh', marginTop: '2.4vh' }}>
            your
            <br />
            content
            <br />
            <span style={{ color: C.ink }}>isn’t</span>
          </div>
          <div className="serif-i" style={{ fontSize: '12.2vh', marginTop: '0.6vh', lineHeight: 0.95 }}>
            growing?
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            className="lbl"
            style={{
              background: C.lime,
              color: C.ink,
              padding: '0.8vh 14px',
              letterSpacing: '0.16em',
            }}
          >
            3 mistakes
          </span>
          <span className="lbl" style={{ opacity: 0.55 }}>the first three seconds decide the rest</span>
        </div>

        <svg viewBox="0 0 1000 220" style={{ width: '100%', height: '13vh' }} preserveAspectRatio="none">
          <path d="M0 110h1000" stroke={C.ink} strokeWidth={1.4} opacity={0.22} />
          <Bars peaks={hook} color={C.ink} height={220} opacity={0.9} />
        </svg>

        <div className="mono" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, opacity: 0.55 }}>
          <span>9:16 · 720 × 1280 · 24 fps</span>
          <span>type lands on the bed</span>
        </div>
      </div>
    </Frame>
  );
}

/* 02 — rhythm and composition, 1:1 ---------------------------------- */

export function CutRhythmSheet() {
  return (
    <Frame
      kicker="cut to the beat"
      meta="1:1 · rhythm & composition"
      bg={C.ink}
      ink={C.cream}
      rule={`${C.cream}2e`}
      footer="waveform: the master's own audio · marks: picture chapters"
    >
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div className="display" style={{ fontSize: '7.6vh' }}>
            the edit, <span className="serif-i" style={{ fontSize: '6.4vh', color: C.lime }}>at 1:1</span>
          </div>
          <div className="mono" style={{ fontSize: 12, opacity: 0.45, marginTop: '1.2vh' }}>
            18.54 s · 444 frames · one continuous scene
          </div>
        </div>

        <div>
          {/* chapter marks sit where the picture changes, read off the footage */}
          <div style={{ position: 'relative', height: '4vh' }}>
            {cutFilm.chapters.map((c) => (
              <span
                key={c.title}
                className="mono"
                style={{
                  position: 'absolute',
                  left: `${(c.start / TOTAL) * 100}%`,
                  transform: 'translateX(-2px)',
                  fontSize: 10,
                  opacity: 0.5,
                  whiteSpace: 'nowrap',
                }}
              >
                {c.time.split(' — ')[0]}
              </span>
            ))}
          </div>
          <div style={{ position: 'relative' }}>
            <svg viewBox="0 0 1000 240" style={{ width: '100%', height: '24vh' }} preserveAspectRatio="none">
              <Bars peaks={cutFilm.peaks} color={C.lime} height={240} opacity={0.9} />
            </svg>
            <svg viewBox="0 0 1000 240" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} preserveAspectRatio="none">
              {cutFilm.chapters.map((c) => (
                <path
                  key={c.title}
                  d={`M${(c.start / TOTAL) * 1000} 0v240`}
                  stroke={C.cream}
                  strokeWidth={1.2}
                  strokeDasharray="5 7"
                  opacity={0.45}
                />
              ))}
            </svg>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, marginTop: '1.6vh' }}>
            {cutFilm.chapters.map((c, i) => (
              <div key={c.title} style={{ borderTop: `1px solid ${C.cream}33`, paddingTop: 10 }}>
                <div className="mono" style={{ fontSize: 10, opacity: 0.4 }}>{String(i + 1).padStart(2, '0')}</div>
                <div className="lbl" style={{ fontSize: 9, marginTop: 6, opacity: 0.8, letterSpacing: '0.12em' }}>
                  {c.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mono" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, opacity: 0.4 }}>
          <span>hook · #1 · #2 · #3 · the fix · close</span>
          <span>no claimed beat grid</span>
        </div>
      </div>
    </Frame>
  );
}

/* 03 — the end card, 16:9 ------------------------------------------- */

export function CutEndCardSheet() {
  return (
    <Frame
      kicker="cut to the beat"
      meta="16:9 · end card"
      footer="branding · content · social media — make every post count"
    >
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '6vw',
        }}
      >
        <div style={{ width: '56%', minWidth: 0 }}>
          <div style={{ width: '23vw' }}>
              <Logo color={C.ink} />
          </div>
          <div className="display" style={{ fontSize: '9.6vh', marginTop: '2.4vh' }}>
            make every
            <br />
            post count.
          </div>
          <div style={{ height: 5, width: '58%', background: C.tang, marginTop: '2.8vh' }} />
          <div className="serif-i" style={{ fontSize: '5vh', marginTop: '2.2vh', opacity: 0.72 }}>
            cut to the beat
          </div>
          <div className="mono" style={{ fontSize: 12, marginTop: '2vh', opacity: 0.5 }}>
            18.5 s · 9:16 master · 24 fps
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
          <span className="mono" style={{ fontSize: 10, opacity: 0.42 }}>end frame · 00:00:17</span>
          <img
            src="/images/portfolio/cut-to-the-beat/chapter-06.jpg"
            alt=""
            style={{ height: '42vh', width: 'auto', display: 'block', border: `1px solid ${C.ink}22` }}
          />
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginTop: '0.6vh' }}>
            {[
              ['9:16', '5.2vh', '9.3vh'],
              ['1:1', '9.3vh', '9.3vh'],
              ['16:9', '16.5vh', '9.3vh'],
            ].map(([ratio, w, h]) => (
              <div key={ratio} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div
                  style={{
                    width: w,
                    height: h,
                    border: `1px solid ${C.ink}44`,
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <span style={{ width: '40%', height: 2, background: `${C.ink}44` }} />
                </div>
                <span className="mono" style={{ fontSize: 9, opacity: 0.42 }}>{ratio}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}
