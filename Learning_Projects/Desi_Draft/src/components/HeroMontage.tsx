import { useEffect, useState } from 'react';

/**
 * Animated gradient "montage" used while the real hero reel is a placeholder.
 * Six looks cut every 2.6s, mimicking the fast cut montage in the reference.
 */
const SCENES = [
  { a: '#4B63E8', b: '#E8B4F5', c: '#E8603C' },
  { a: '#9B2155', b: '#4B63E8', c: '#E4FBA8' },
  { a: '#E8603C', b: '#8499F8', c: '#E8B4F5' },
  { a: '#2E7D5B', b: '#e4fba8', c: '#4B63E8' },
  { a: '#8499F8', b: '#9B2155', c: '#E4FBA8' },
  { a: '#0A0A0A', b: '#4B63E8', c: '#E8603C' },
];

export function HeroMontage({ paused = false, muted = true }: { paused?: boolean; muted?: boolean }) {
  const [i, setI] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (paused || reduced) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % SCENES.length), 2600);
    return () => window.clearInterval(id);
  }, [paused, reduced]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-ink" aria-hidden="true">
      {SCENES.map((s, idx) => (
        <div
          key={idx}
          className="absolute inset-0 transition-opacity duration-[900ms] ease-out"
          style={{
            opacity: idx === i ? 1 : 0,
            background: `radial-gradient(120% 90% at 20% 10%, ${s.a} 0%, transparent 55%), radial-gradient(90% 80% at 85% 30%, ${s.b} 0%, transparent 60%), linear-gradient(160deg, ${s.a}, ${s.c})`,
          }}
        >
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background: `conic-gradient(from ${idx * 60}deg at 52% 62%, ${s.c}33, transparent 30%, ${s.b}44, transparent 62%)`,
              animation: reduced || paused ? 'none' : `montageDrift ${16 + idx * 2}s ease-in-out infinite alternate`,
            }}
          />
          <div
            className="absolute left-[8%] top-[26%] h-[46%] w-[34%] rounded-[46%] opacity-40 blur-[2px]"
            style={{ background: `linear-gradient(140deg, ${s.b}, transparent 80%)` }}
          />
          <div
            className="absolute right-[10%] bottom-[14%] h-[38%] w-[26%] rounded-[42%] opacity-35"
            style={{ background: `linear-gradient(160deg, ${s.c}, transparent)` }}
          />
        </div>
      ))}

      {/* scanline + grain so gradient scenes read as footage */}
      <div
        className="absolute inset-0 opacity-[.14]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(255,255,255,.5) 0 1px, transparent 1px 4px)',
          mixBlendMode: 'overlay',
        }}
      />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,.35) 0.5px, transparent 0.6px)',
          backgroundSize: '3px 3px',
          mixBlendMode: 'overlay',
        }}
      />
      <div className="absolute inset-x-0 top-0 h-[38%] bg-gradient-to-b from-black/35 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/35 to-transparent" />
      {/* soft camera vignette */}
      <div
        className="absolute inset-0"
        style={{ boxShadow: 'inset 0 0 140px 40px rgba(0,0,0,.45)' }}
      />
      <span className="sr-only">{muted ? 'muted' : 'sound on'} placeholder montage</span>
    </div>
  );
}

