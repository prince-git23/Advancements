import { useEffect, useRef, useState, type ReactNode } from 'react';
import Matter from 'matter-js';
import { ScrollTrigger } from '../lib/smooth';
import { usePrefersReducedMotion } from '../lib/hooks';
import { site } from '../data/site';
import { Logo } from './art/Logo';
import { Sticker } from './art/Stickers';
import { WobblyUnderline } from './art/Doodles';
import { footerStickerSize } from './art/sizes';
import { Modal } from './Modal';
import type { StickerKey } from '../types';

const DROPS: StickerKey[] = [
  'smiley',
  'heart',
  'hundred',
  'heartHands',
  'camera',
  'bam',
  'goodVibes',
  'cool',
];

const STATIC_POS = [
  { left: '5%', top: '66%' },
  { left: '17%', top: '72%' },
  { left: '30%', top: '62%' },
  { left: '42%', top: '74%' },
  { left: '55%', top: '66%' },
  { left: '68%', top: '73%' },
  { left: '80%', top: '64%' },
  { left: '90%', top: '70%' },
];

const Social = ({ href, label, children }: { href: string; label: string; children: ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    aria-label={label}
    className="grid h-9 w-9 place-items-center rounded-full border border-cream/50 text-cream transition-transform duration-300 hover:-translate-y-1 hover:border-cream"
  >
    {children}
  </a>
);

export function Footer() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stickerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [credits, setCredits] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    type Item = { body: Matter.Body; el: HTMLDivElement; size: number };
    let engine: Matter.Engine | null = null;
    let raf = 0;
    let started = false;
    const timers: number[] = [];
    const items: Item[] = [];

    const drop = (i: number) => {
      if (!engine) return;
      const el = stickerRefs.current[i];
      if (!el) return;
      const rect = wrap.getBoundingClientRect();
      const size = el.offsetWidth || 78;
      const body = Matter.Bodies.rectangle(
        rect.width * (0.07 + Math.random() * 0.86),
        -90 - Math.random() * 120,
        size * 0.72,
        size * 0.72,
        {
          chamfer: { radius: size * 0.3 },
          restitution: 0.35,
          friction: 0.4,
          density: 0.002,
          angle: (Math.random() - 0.5) * 1.5,
        }
      );
      Matter.Composite.add(engine.world, body);
      items.push({ body, el, size });
      el.style.opacity = '1';
    };

    const start = () => {
      if (started) return;
      started = true;
      const rect = wrap.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;
      canvas.width = Math.round(W);
      canvas.height = Math.round(H);

      engine = Matter.Engine.create();
      engine.gravity.y = 1.2;

      const wmRect = wordmarkRef.current?.getBoundingClientRect();
      const wmTop = wmRect ? wmRect.top - rect.top : H - 280;
      const wmH = wmRect ? wmRect.height : 280;
      const shelfY = wmTop + wmH * 0.42;
      const jitter = [0, 22, -16, 12, -26, 6, 28, -8, 16];

      const floor = Matter.Bodies.rectangle(W / 2, H - 4, W + 40, 24, {
        isStatic: true,
        friction: 0.6,
        restitution: 0.2,
      });
      Matter.Composite.add(engine.world, floor);

      // approximate the top profile of the script wordmark so stickers land on the letters
      for (let i = 0; i < 9; i++) {
        const x = W * (0.06 + i * 0.11);
        const shelf = Matter.Bodies.rectangle(x, shelfY + (jitter[i] ?? 0), W * 0.12, 16, {
          isStatic: true,
          chamfer: { radius: 5 },
          friction: 0.45,
        });
        Matter.Composite.add(engine.world, shelf);
      }

      const mouse = Matter.Mouse.create(canvas);
      mouse.pixelRatio = 1;
      const mc = Matter.MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.2, render: { visible: false } },
      });
      Matter.Composite.add(engine.world, mc);

      const loop = () => {
        if (!engine) return;
        Matter.Engine.update(engine, 1000 / 60);
        for (const it of items) {
          const { x, y } = it.body.position;
          it.el.style.transform = `translate3d(${(x - it.size / 2).toFixed(1)}px, ${(
            y -
            it.size / 2
          ).toFixed(1)}px, 0) rotate(${it.body.angle.toFixed(3)}rad)`;
        }
        raf = requestAnimationFrame(loop);
      };
      loop();

      DROPS.forEach((_, i) => {
        timers.push(window.setTimeout(() => drop(i), 250 * i + 120));
      });
    };

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: 'top 75%',
      once: true,
      onEnter: start,
    });

    return () => {
      st.kill();
      timers.forEach((t) => window.clearTimeout(t));
      cancelAnimationFrame(raf);
      if (engine) {
        Matter.Composite.clear(engine.world, false, true);
        Matter.Engine.clear(engine);
      }
    };
  }, [reduced]);

  return (
    <>
      <footer id="footer" className="relative px-3 pb-3">
        <div
          ref={wrapRef}
          className="relative overflow-hidden rounded-[24px] bg-royal text-cream"
          style={{ minHeight: '78svh' }}
        >
          <div className="relative z-20 grid gap-12 px-7 pb-[6vh] pt-14 md:grid-cols-3 md:gap-8 md:px-12 md:pt-20">
            <div>
              <span className="mb-5 inline-block rounded-full bg-cream px-3 py-[7px] text-[12px] font-medium lowercase text-ink">
                looking for a job?
              </span>
              <a
                href={`mailto:${site.email}`}
                className="display block max-w-[280px] text-[clamp(1.6rem,2.3vw,2rem)] leading-[.98] text-cream underline-offset-4 hover:underline"
              >
                experienced account manager
              </a>
            </div>

            <div>
              <span className="mb-5 inline-block rounded-full bg-cream px-3 py-[7px] text-[12px] font-medium lowercase text-ink">
                office
              </span>
              <p className="display max-w-[280px] text-[clamp(1.5rem,2.1vw,1.9rem)] leading-[1.02]">
                {site.address[0]}
                <br />
                {site.address[1]}
              </p>
              <a
                href={site.maps}
                target="_blank"
                rel="noreferrer"
                className="relative mt-3 inline-block text-[13px] text-cream/85 transition-colors hover:text-cream"
              >
                google maps
                <WobblyUnderline className="absolute -bottom-1 left-0 h-[8px] w-full text-cream/60" strokeWidth={2} />
              </a>
            </div>

            <div>
              <span className="mb-5 inline-block rounded-full bg-cream px-3 py-[7px] text-[12px] font-medium lowercase text-ink">
                contact
              </span>
              <p className="display max-w-[300px] text-[clamp(1.5rem,2.1vw,1.9rem)] leading-[1.02]">
                <a href={`mailto:${site.email}`} className="underline-offset-4 hover:underline">
                  {site.email}
                </a>
                <br />
                <a href={site.whatsapp} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
                  send us a whatsapp*
                </a>
              </p>
              <p className="mt-3 max-w-[250px] text-[14px] leading-[1.35] text-cream/70">
                *we&apos;re millennials and gen-z: please do not call us.
              </p>
              <div className="mt-6 flex items-center gap-2">
                <Social href={site.linkedin} label="LinkedIn">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.06c.53-1 1.83-2.06 3.77-2.06C21.6 8.64 23 10.9 23 14.1V21h-4v-6.1c0-1.5-.54-2.5-1.9-2.5-1.05 0-1.68.7-1.96 1.38-.1.24-.13.58-.13.92V21h-4V9Z" />
                  </svg>
                </Social>
                <Social href={site.instagram} label="Instagram">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </Social>
                <Social href={site.tiktok} label="TikTok">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M16.5 3h-2.8v11.2a2.6 2.6 0 1 1-2.2-2.57V8.7a5.6 5.6 0 1 0 5 5.56V8.9a6.1 6.1 0 0 0 3.5 1.1V7.2a3.5 3.5 0 0 1-3.5-3.5V3Z" />
                  </svg>
                </Social>
              </div>
            </div>
          </div>

          <div ref={wordmarkRef} className="pointer-events-none relative z-20 mt-[4vh] select-none">
            <Logo className="w-[107%] -translate-x-[3.5%] text-cream" color="currentColor" strokeWidth={1.2} />
          </div>

          <canvas
            ref={canvasRef}
            className="absolute inset-0 z-10 h-full w-full"
            style={{ touchAction: 'none', cursor: 'grab' }}
            aria-hidden="true"
          />

          <div className="pointer-events-none absolute inset-0 z-30">
            {DROPS.map((kind, i) => (
              <div
                key={kind}
                ref={(el) => {
                  stickerRefs.current[i] = el;
                }}
                className="absolute left-0 top-0 will-change-transform"
                style={
                  reduced
                    ? { left: STATIC_POS[i].left, top: STATIC_POS[i].top, opacity: 1 }
                    : { opacity: 0 }
                }
              >
                <Sticker kind={kind} size={footerStickerSize(i)} rotate={0} />
              </div>
            ))}
          </div>

          <button
            onClick={() => setCredits(true)}
            className="absolute bottom-4 right-4 z-40 rounded-full bg-ink px-4 py-2 text-[11px] lowercase text-cream transition-transform hover:-translate-y-0.5"
          >
            credits
          </button>
        </div>
      </footer>

      <Modal open={credits} onClose={() => setCredits(false)} title="credits">
        <p className="text-[15px] leading-[1.5] text-ink/75">
          Design &amp; code by <span className="text-ink">[your name]</span>.
        </p>
        <p className="mt-3 text-[13px] leading-[1.5] text-ink/55">
          Stickers, blobs and lettering drawn in-house. Built with React, GSAP, Lenis and Matter.js.
        </p>
      </Modal>
    </>
  );
}
