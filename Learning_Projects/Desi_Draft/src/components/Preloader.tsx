import { useEffect, useRef, useState } from 'react';
import { gsap, lockScroll } from '../lib/smooth';
import { Logo } from './art/Logo';

export function Preloader({ onDone }: { onDone: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setGone(true);
      onDone();
      return;
    }
    lockScroll(true);
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          lockScroll(false);
          setGone(true);
          onDone();
        },
      });
      tl.fromTo(
        '.pre-word',
        { clipPath: 'inset(-10% 100% -10% 0%)' },
        { clipPath: 'inset(-10% 0% -10% 0%)', duration: 1.05, ease: 'power2.inOut' }
      )
        .to('.pre-word', { color: '#0A0A0A', duration: 0.35 }, '-=0.25')
        .to(innerRef.current, { yPercent: -12, autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, '+=0.15')
        .to(panelRef.current, { yPercent: -100, duration: 0.85, ease: 'power4.inOut' }, '-=0.25');
    });

    return () => {
      ctx.revert();
      lockScroll(false);
    };
  }, [onDone]);

  if (gone) return null;

  return (
    <div
      ref={panelRef}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-cream"
      aria-hidden="true"
    >
      <div ref={innerRef} className="w-[62vw] max-w-[460px]">
        <span className="pre-word block">
          <Logo className="w-full" color="#0A0A0A" strokeWidth={1.4} />
        </span>
        <div className="mt-4 overflow-hidden">
          <span className="pre-word block h-[2px] w-full bg-ink/15" />
        </div>
      </div>
    </div>
  );
}
