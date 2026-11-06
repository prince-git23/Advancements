import { useEffect, useRef, useState, type CSSProperties } from 'react';

/**
 * Wraps a doodle and draws its strokes on when it enters the viewport.
 * Paths inside must use pathLength={1} and className="doodle-path".
 */
export function Drawable({
  children,
  viewBox = '0 0 200 120',
  className = '',
  strokeWidth = 3,
  color = 'currentColor',
  duration = 1,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  viewBox?: string;
  className?: string;
  strokeWidth?: number;
  color?: string;
  duration?: number;
  delay?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDrawn(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      viewBox={viewBox}
      className={`${drawn ? 'is-drawn' : ''} ${className}`}
      style={{ overflow: 'visible', ...style }}
      aria-hidden="true"
    >
      <g
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ ['--draw-duration' as string]: `${duration}s`, ['--draw-delay' as string]: `${delay}s` }}
      >
        {children}
      </g>
    </svg>
  );
}

export const doodleProps = (delay = 0) => ({
  className: 'doodle-path',
  pathLength: 1,
  style: { transitionDuration: '1s', transitionDelay: `${delay}s` } as CSSProperties,
});

/** Long looping arrow used above the intro line. */
export function LoopArrow({ className = '', color = '#0A0A0A', strokeWidth = 3.4 }: { className?: string; color?: string; strokeWidth?: number }) {
  return (
    <Drawable viewBox="0 0 260 130" className={className} color={color} strokeWidth={strokeWidth}>
      <path {...doodleProps(0.05)} d="M8 108C28 54 74 26 118 38c30 8 34 38 10 46-18 6-30-12-16-24 20-17 62-16 92 4" />
      <path {...doodleProps(0.7)} d="M204 64l26-12-2 28" />
    </Drawable>
  );
}

/** Curly arrow pointing right (clients section). */
export function CurlyArrow({ className = '', color = '#0A0A0A', strokeWidth = 3.4 }: { className?: string; color?: string; strokeWidth?: number }) {
  return (
    <Drawable viewBox="0 0 220 120" className={className} color={color} strokeWidth={strokeWidth}>
      <path {...doodleProps(0)} d="M6 30c22-22 52-14 48 10-4 22-34 18-30-2 5-27 46-32 70-18 18 11 26 34 22 62" />
      <path {...doodleProps(0.6)} d="M204 84l12 26-26-2" />
    </Drawable>
  );
}

/** Little swirl / squiggle. */
export function Squiggle({ className = '', color = '#0A0A0A', strokeWidth = 3 }: { className?: string; color?: string; strokeWidth?: number }) {
  return (
    <Drawable viewBox="0 0 180 90" className={className} color={color} strokeWidth={strokeWidth}>
      <path {...doodleProps(0)} d="M6 62c18-46 54-58 70-34 14 21-20 40-18 18 2-20 40-38 62-18 12 11 14 26 10 40" />
      <path {...doodleProps(0.5)} d="M112 60l18 14 6-22" />
    </Drawable>
  );
}

/** White swoosh used top-left of the carousel. */
export function Swoosh({ className = '', color = '#FFFFFF', strokeWidth = 3 }: { className?: string; color?: string; strokeWidth?: number }) {
  return (
    <Drawable viewBox="0 0 200 110" className={className} color={color} strokeWidth={strokeWidth}>
      <path {...doodleProps(0)} d="M10 92c26-52 74-74 108-54 20 12 8 34-8 26-20-10 6-42 40-46" />
      <path {...doodleProps(0.55)} d="M22 84c-6 8-10 12-12 18" />
    </Drawable>
  );
}

/** Wobbly hand-drawn ellipse for the hero word. */
export function WobblyEllipse({ className = '', color = '#EEEAE3', strokeWidth = 2.6 }: { className?: string; color?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 400 160" className={className} style={{ overflow: 'visible' }} aria-hidden="true" fill="none">
      <path
        className="hero-ellipse"
        d="M198 12c96 2 190 26 190 66 0 42-104 70-196 68C96 144 10 118 12 76 14 36 96 10 198 12Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        pathLength={1}
      />
    </svg>
  );
}

/** Wobbly underline used under italic words. */
export function WobblyUnderline({
  className = '',
  color = 'currentColor',
  strokeWidth = 3,
  animate = true,
}: {
  className?: string;
  color?: string;
  strokeWidth?: number;
  animate?: boolean;
}) {
  return (
    <Drawable viewBox="0 0 300 26" className={className} color={color} strokeWidth={strokeWidth}>
      <path
        {...doodleProps(0)}
        d="M4 16c40-8 78-10 116-8 40 2 80 8 118 4 22-2 42-4 58-6"
        style={animate ? undefined : { strokeDashoffset: 0 }}
      />
    </Drawable>
  );
}

/** Short rule with an arrow flick at the right end (service cards). */
export function WobblyRule({ className = '', color = 'currentColor', strokeWidth = 2.4 }: { className?: string; color?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 200 18" className={className} aria-hidden="true" fill="none" style={{ overflow: 'visible' }}>
      <path
        d="M3 9c34-5 66 4 100 0 26-3 52-3 78 1"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path d="M170 4l11 6-11 4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Two short black strokes used at the base of the splat blob. */
export function TickMarks({ className = '', color = '#0A0A0A', strokeWidth = 3 }: { className?: string; color?: string; strokeWidth?: number }) {
  return (
    <Drawable viewBox="0 0 90 70" className={className} color={color} strokeWidth={strokeWidth}>
      <path {...doodleProps(0)} d="M12 8c2 22 8 38 20 50" />
      <path {...doodleProps(0.35)} d="M36 24c8 10 18 18 30 22" />
    </Drawable>
  );
}
