import { useEffect, useRef, useState, type ReactNode } from 'react';
import { usePrefersReducedMotion } from '../lib/hooks';
import { scrollToTarget } from '../lib/scroll';
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  PHONE_DISPLAY,
  STUDIO_LOCATION,
  WHATSAPP_URL,
  site,
} from '../data/site';
import { team } from '../data/team';
import { Logo } from './art/Logo';
import { Sticker } from './art/Stickers';
import { footerStickerSize } from './art/sizes';
import { Modal } from './Modal';
import { Chapter } from './ui/Chapter';
import type { StickerKey } from '../types';

/** Drop order and landing spots, in % of the footer (§S8). */
const DROPS: StickerKey[] = [
  'heart',
  'smiley',
  'hundred',
  'heartHands',
  'camera',
  'bam',
  'goodVibes',
  'thumbsUp',
];

// Spread far enough apart that two die-cut stickers cannot land on each other.
const LANDING = [
  { x: 9, y: 80 },
  { x: 21, y: 72 },
  { x: 34, y: 86 },
  { x: 47, y: 74 },
  { x: 60, y: 87 },
  { x: 72, y: 76 },
  { x: 84, y: 85 },
  { x: 94, y: 73 },
];

/**
 * No-physics layout: reduced motion, or a phone. Everything sits in the lower
 * wordmark band so a sticker can never cover the contact copy.
 */
const STATIC_POS = [
  { left: '3%', bottom: 'max(80px, 8%)' },
  { left: '27%', bottom: 'max(116px, 14%)' },
  { left: '51%', bottom: 'max(86px, 9%)' },
  { left: '75%', bottom: 'max(122px, 13%)' },
  { left: '86%', bottom: 'max(74px, 7%)' },
  { left: '16%', bottom: 'max(150px, 17%)' },
  { left: '39%', bottom: 'max(104px, 11%)' },
  { left: '70%', bottom: 'max(156px, 18%)' },
];

/** The wordmark finishes its reveal before the first sticker falls. */
const STICKER_DELAY_MS = 900;

type MatterApi = typeof import('matter-js');
type MatterEngine = InstanceType<MatterApi['Engine']>;
type MatterBody = InstanceType<MatterApi['Body']>;

const COUNT_WORD = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];

/** Spelled-out studio size, so the footer copy follows the team data. */
const teamCount = () => COUNT_WORD[team.length] ?? String(team.length);

/** Numbered group label — the footer's own chapter system. */
function GroupLabel({ no, label }: { no: string; label: string }) {
  return (
    <span className="mb-3.5 inline-flex items-center gap-2 rounded-full bg-cream px-3 py-[7px] text-[11.5px] font-medium lowercase text-ink">
      <span className="tabular-nums opacity-60">{no}</span>
      <span aria-hidden="true" className="h-3 w-px bg-ink/25" />
      {label}
    </span>
  );
}

/* ------------------------------------------------------------- icons */

const iconProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.9,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

const MailIcon = () => (
  <svg {...iconProps}>
    <rect x="2.5" y="5" width="19" height="14" rx="3" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </svg>
);

const ChatIcon = () => (
  <svg {...iconProps}>
    <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.6 9.6 0 0 1-3.2-.9L3 21l1.4-4.4A8.2 8.2 0 0 1 3 11.5 8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z" />
  </svg>
);

const PinIcon = () => (
  <svg {...iconProps}>
    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);

const InstagramIcon = () => (
  <svg {...iconProps}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
  </svg>
);

/** One line of the contact strip: icon + label + value. */
function ContactLine({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <li>
      <p className="text-[10.5px] uppercase tracking-[0.16em] text-[#faf8f4]/75">{label}</p>
      <div className="footer-text mt-1.5 flex items-start gap-2 text-[clamp(0.875rem,0.95vw,1rem)] leading-[1.35]">
        <span className="mt-[1px] shrink-0 text-[#faf8f4]/80">{icon}</span>
        <span className="min-w-0 break-words">{children}</span>
      </div>
    </li>
  );
}

export function Footer() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stickerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [credits, setCredits] = useState(false);
  const reduced = usePrefersReducedMotion();
  // A phone never runs the physics: the footer is short and the stickers would
  // land on the contact column while the page is still being scrolled.
  const [narrow, setNarrow] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const onChange = () => setNarrow(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  /* The wordmark arrives first, then the stickers land. One observer drives the
     entrance; reduced motion gets the final frames without either. */
  useEffect(() => {
    if (reduced) return;
    const wm = wordmarkRef.current;
    if (!wm) return;

    wm.style.opacity = '0';
    wm.style.transform = 'translateY(26px)';

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        io.disconnect();
        wm.style.transition = `opacity 720ms cubic-bezier(.22,1,.36,1), transform 720ms cubic-bezier(.22,1,.36,1)`;
        wm.style.opacity = '1';
        wm.style.transform = 'translateY(0)';
        window.setTimeout(() => {
          wm.style.transition = '';
        }, 800);
      },
      { threshold: 0.1 }
    );
    io.observe(wm);

    return () => {
      io.disconnect();
      wm.style.opacity = '';
      wm.style.transform = '';
      wm.style.transition = '';
    };
  }, [reduced]);

  /* Phones and reduced motion show fixed sticker positions. On a phone they get
     a short stagger after the wordmark; under reduced motion they are still. */
  useEffect(() => {
    if (reduced || !narrow) return;
    const els = stickerRefs.current.filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    els.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'scale(.82)';
    });

    let timer = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        io.disconnect();
        timer = window.setTimeout(() => {
          els.forEach((el, i) => {
            el.style.transition = `opacity 380ms ease ${i * 55}ms, transform 420ms cubic-bezier(.22,1,.36,1) ${
              i * 55
            }ms`;
            el.style.opacity = '1';
            el.style.transform = 'scale(1)';
          });
        }, STICKER_DELAY_MS);
      },
      { threshold: 0.05 }
    );
    const wrap = wrapRef.current;
    if (wrap) io.observe(wrap);

    return () => {
      io.disconnect();
      window.clearTimeout(timer);
      els.forEach((el) => {
        el.style.opacity = '';
        el.style.transform = '';
        el.style.transition = '';
      });
    };
  }, [reduced, narrow]);

  useEffect(() => {
    if (reduced || narrow) return;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    type Item = { body: MatterBody; el: HTMLDivElement; size: number };

    // Matter is fetched the first time the footer comes into view, so it is not
    // part of the first-screen JavaScript at all.
    let Matter: MatterApi | null = null;
    let engine: MatterEngine | null = null;
    let raf = 0;
    let running = false;
    let started = false;
    let settled = false;
    let visible = false;
    let disposed = false;
    let loading = false;
    let pendingDrops = 0;
    let rails = false;
    let lastWake = 0;
    const timers: number[] = [];
    const items: Item[] = [];
    let geom: { width: number } | null = null;

    // Observable loop state for the audit harness: idle → running → settled.
    const physicsState = (state: string) => {
      canvas.dataset.physics = state;
    };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      running = false;
      if (!settled) physicsState('paused');
    };

    const tick = () => {
      raf = 0;
      if (!Matter || !engine || disposed) {
        running = false;
        return;
      }
      if (!visible || document.visibilityState === 'hidden' || settled) {
        running = false;
        return;
      }

      running = true;
      Matter.Engine.update(engine, 1000 / 60);

      for (const item of items) {
        const { x, y } = item.body.position;
        item.el.style.transform = `translate3d(${(x - item.size / 2).toFixed(1)}px, ${(
          y -
          item.size / 2
        ).toFixed(1)}px, 0) rotate(${item.body.angle.toFixed(3)}rad)`;
      }

      const asleep = items.length > 0 && items.every((item) => item.body.isSleeping);
      if (pendingDrops === 0 && (asleep || performance.now() - lastWake > 12000)) {
        settled = true;
        running = false;
        physicsState('settled');
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    const run = () => {
      if (disposed || settled || !started || !engine || !Matter) return;
      if (!visible || document.visibilityState === 'hidden') return;
      if (running || raf) return;
      lastWake = performance.now();
      physicsState('running');
      raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (disposed || !Matter) return;
      if (settled) {
        settled = false;
        lastWake = performance.now();
        for (const item of items) Matter.Sleeping.set(item.body, false);
      }
      run();
    };

    /** The live band between the contact strip and the bottom bar. Measured at
     *  drop time, not at setup: the wordmark and the strip settle a beat later,
     *  and a stale band is exactly how a sticker ends up on the email address. */
    const band = () => {
      const height = wrap.getBoundingClientRect().height;
      const bottomOf = (el: HTMLElement | null, fallback: number) => {
        if (!el) return fallback;
        const r = el.getBoundingClientRect();
        return r.bottom - wrap.getBoundingClientRect().top;
      };
      const grid = gridRef.current;
      const strip = stripRef.current;
      const bar = barRef.current;
      const copyBottom = Math.max(bottomOf(grid, height * 0.5), bottomOf(strip, 0));
      const barTop = bar ? bar.getBoundingClientRect().top - wrap.getBoundingClientRect().top : height - 70;
      const top = Math.min(copyBottom + 22, barTop - 60);
      const bottom = Math.max(top + 40, barTop - 16);
      return { top, bottom };
    };

    const drop = (index: number) => {
      if (!Matter || !engine || !geom) return;
      const el = stickerRefs.current[index];
      if (!el) return;

      const size = el.offsetWidth || 78;
      const half = size / 2 + 4;
      const { top, bottom } = band();
      const lo = top + half;
      const hi = Math.max(lo, bottom - half);
      const x = geom.width * ((LANDING[index]?.x ?? 50) / 100);
      const y = lo + (((index * 37) % 100) / 100) * (hi - lo);

      // Two static rails keep a dragged sticker inside the band: above the
      // bottom bar, below the contact strip.
      if (!rails) {
        rails = true;
        const ceiling = Matter.Bodies.rectangle(
          geom!.width / 2,
          top - 8,
          geom!.width + 80,
          16,
          { isStatic: true, friction: 0.6 }
        );
        const sill = Matter.Bodies.rectangle(
          geom!.width / 2,
          bottom + 8,
          geom!.width + 80,
          16,
          { isStatic: true, friction: 0.6, restitution: 0.1 }
        );
        Matter.Composite.add(engine.world, [ceiling, sill]);
      }

      const body = Matter.Bodies.rectangle(x, y, size * 0.98, size * 0.98, {
        chamfer: { radius: size * 0.3 },
        restitution: 0.1,
        friction: 0.9,
        frictionStatic: 1,
        density: 0.002,
        // no rolling: a sticker lands on its edge and stays there
        inertia: Infinity,
        angle: (Math.random() - 0.5) * 0.5,
      });
      Matter.Composite.add(engine.world, body);
      items.push({ body, el, size });
      el.style.opacity = '1';
      lastWake = performance.now();
    };

    const setup = () => {
      if (!Matter || engine || disposed) return;
      const matter = Matter;
      const rect = wrap.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;
      canvas.width = Math.round(W);
      canvas.height = Math.round(H);

      engine = matter.Engine.create();
      engine.gravity.y = 1.2;
      // Bodies that have come to rest stop costing simulation time.
      engine.enableSleeping = true;

      const floor = matter.Bodies.rectangle(W / 2, H - 4, W + 40, 24, {
        isStatic: true,
        friction: 0.6,
        restitution: 0.2,
      });
      matter.Composite.add(engine.world, floor);

      const mouse = matter.Mouse.create(canvas);
      mouse.pixelRatio = 1;
      const mc = matter.MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.2, render: { visible: false } },
      });
      matter.Composite.add(engine.world, mc);

      geom = { width: W };
      started = true;
      pendingDrops = LANDING.length;
      run();

      LANDING.forEach((_, index) => {
        timers.push(
          window.setTimeout(() => {
            drop(index);
            pendingDrops = Math.max(0, pendingDrops - 1);
            run();
          }, STICKER_DELAY_MS + 260 * index)
        );
      });
    };

    const load = () => {
      if (loading || Matter || disposed) return;
      loading = true;
      import('matter-js')
        .then((mod) => {
          loading = false;
          if (disposed) return;
          Matter = (mod as unknown as { default?: MatterApi }).default ?? (mod as unknown as MatterApi);
          if (visible) setup();
        })
        .catch(() => {
          loading = false;
        });
    };

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
        if (visible) {
          if (!Matter) load();
          else if (started) run();
          else setup();
        } else {
          stop();
        }
      },
      { rootMargin: '0px 0px -25% 0px', threshold: 0 }
    );
    io.observe(wrap);

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') stop();
      else if (visible && started && !settled) run();
    };
    document.addEventListener('visibilitychange', onVisibility);

    const onPointerActivate = () => wake();
    canvas.addEventListener('pointerdown', onPointerActivate);

    return () => {
      disposed = true;
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('pointerdown', onPointerActivate);
      timers.forEach((timer) => window.clearTimeout(timer));
      stop();
      delete canvas.dataset.physics;
      if (Matter && engine) {
        Matter.Composite.clear(engine.world, false, true);
        Matter.Engine.clear(engine);
      }
      engine = null;
    };
  }, [reduced, narrow]);

  return (
    <>
      <footer id="footer" className="relative px-2 pb-2 sm:px-3 sm:pb-3">
        <div
          ref={wrapRef}
          data-theme="studio"
          className="relative overflow-hidden rounded-[24px] bg-royal text-cream"
        >
          <div className="relative z-20 mx-auto w-[92vw] max-w-[1740px] pt-8 sm:pt-10 lg:pt-12">
            {/* On cream type the label measured 4.12:1 against royal — under AA for
                10px. It sits on the same cream pill as the three groups below. */}
            <span className="inline-flex rounded-full bg-cream px-3 py-[7px] text-ink">
              <Chapter no="07" name="the connection" />
            </span>

            <div
              ref={gridRef}
              data-footer-grid
              className="mt-7 grid grid-cols-1 gap-y-9 sm:grid-cols-2 sm:gap-x-[clamp(1.75rem,3vw,3rem)] lg:grid-cols-3 lg:gap-x-[clamp(2rem,4vw,4.5rem)]"
            >
              {/* 01 — collaboration is an invitation, never a vacancy. */}
              <div data-footer-group="01" className="flex flex-col items-start">
                <GroupLabel no="01" label="collaboration" />
                <h3 className="display text-[clamp(1.6rem,2.6vw,2.5rem)] leading-[1.03]">
                  make something <span className="serif-i">with us.</span>
                </h3>
                <p className="footer-text mt-3 max-w-[38ch] text-[clamp(0.94rem,1.05vw,1.03rem)] leading-[1.55]">
                  We work with photographers, editors, stylists, writers and developers on a
                  project basis. Have something to bring? Send us your work.
                </p>
                <a
                  href={`mailto:${site.email}?subject=${encodeURIComponent('Collaboration with Desi Draft')}`}
                  className="btn mt-5 min-h-[48px] w-full border border-cream/50 px-6 text-[15px] text-cream hover:border-cream hover:bg-cream hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream sm:w-auto"
                >
                  work with us
                  <span className="btn-arrow" aria-hidden="true">
                    →
                  </span>
                </a>
              </div>

              {/* 02 — the studio, in the studio's own count. */}
              <div data-footer-group="02" className="flex flex-col items-start">
                <GroupLabel no="02" label="the studio" />
                <h3 className="display text-[clamp(1.6rem,2.6vw,2.5rem)] leading-[1.03]">
                  {teamCount()} people, <span className="serif-i">one studio.</span>
                </h3>
                <p className="footer-text mt-3 max-w-[38ch] text-[clamp(0.94rem,1.05vw,1.03rem)] leading-[1.55]">
                  Creative strategy, social content, video and digital experiences — from the first
                  idea to the final delivery.
                </p>
              </div>

              {/* 03 — the enquiry. One primary target, one secondary channel. */}
              <div
                data-footer-group="03"
                className="flex flex-col items-start sm:col-span-2 lg:col-span-1"
              >
                <GroupLabel no="03" label="start a project" />
                <h3 className="display text-[clamp(1.6rem,2.6vw,2.5rem)] leading-[1.03]">
                  tell us what you&apos;re <span className="serif-i">making.</span>
                </h3>
                <p className="footer-text mt-3 max-w-[38ch] text-[clamp(0.94rem,1.05vw,1.03rem)] leading-[1.55]">
                  Have a brand, campaign or digital idea in mind? Let&apos;s talk about it.
                </p>
                <div className="mt-5 flex w-full flex-col gap-2.5 sm:flex-row sm:items-center">
                  <a
                    href={`mailto:${site.email}?subject=${encodeURIComponent('Project enquiry — Desi Draft')}`}
                    className="btn btn-cream min-h-[52px] w-full px-7 text-[clamp(0.94rem,1.05vw,1rem)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream sm:w-auto"
                  >
                    start a project
                    <span className="btn-arrow" aria-hidden="true">
                      →
                    </span>
                  </a>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn min-h-[52px] w-full border border-cream/50 px-6 text-[clamp(0.94rem,1.05vw,1rem)] text-cream hover:border-cream hover:bg-cream hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream sm:w-auto"
                  >
                    chat on whatsapp
                  </a>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------- contact strip */}
            <div
              ref={stripRef}
              data-footer-strip
              className="mt-9 border-t border-cream/25 pt-5 lg:mt-10"
              aria-label="Studio contact details"
            >
              <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
                <ContactLine icon={<MailIcon />} label="email">
                  <a
                    href={`mailto:${site.email}`}
                    className="underline-offset-4 transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
                  >
                    {site.email}
                  </a>
                </ContactLine>
                <ContactLine icon={<ChatIcon />} label="whatsapp">
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-4 transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
                  >
                    {PHONE_DISPLAY}
                  </a>
                </ContactLine>
                <ContactLine icon={<PinIcon />} label="location">
                  {STUDIO_LOCATION}
                </ContactLine>
                <ContactLine icon={<InstagramIcon />} label="instagram">
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-4 transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
                  >
                    {INSTAGRAM_HANDLE}
                  </a>
                </ContactLine>
              </ul>
            </div>
          </div>

          {/* The wordmark is part of the flow, not parked at the bottom of a
              forced 100svh panel: that was the empty band above the script in
              the reference. It is cropped by the footer's own overflow. */}
          <div className="relative z-20 mt-6 md:mt-5">
            <div ref={wordmarkRef} className="pointer-events-none select-none">
              <Logo
                className="w-full text-cream sm:w-[104%] sm:-translate-x-[2%]"
                color="currentColor"
                strokeWidth={1.2}
              />
            </div>
          </div>

          <canvas
            ref={canvasRef}
            className="absolute inset-0 z-10 h-full w-full"
            style={{ touchAction: 'pan-y', cursor: 'grab' }}
            aria-hidden="true"
          />

          <div className="pointer-events-none absolute inset-0 z-30">
            {DROPS.map((kind, i) => (
              <div
                key={kind}
                data-footer-sticker={kind}
                ref={(el) => {
                  stickerRefs.current[i] = el;
                }}
                className={`absolute left-0 top-0 will-change-transform ${i > 3 ? 'hidden md:block' : ''}`}
                style={
                  reduced || narrow ? { ...STATIC_POS[i], top: 'auto', opacity: 1 } : { opacity: 0 }
                }
              >
                <Sticker
                  kind={kind}
                  size={narrow ? Math.round(footerStickerSize(i) * 0.66) : footerStickerSize(i)}
                  rotate={0}
                />
              </div>
            ))}
          </div>

          {/* Bottom bar: readable, above the stickers, and clear of the
              safe-area inset on a notched phone. */}
          <div
            ref={barRef}
            data-footer-bar
            className="relative z-50 mx-auto flex w-[92vw] max-w-[1740px] flex-wrap items-center justify-between gap-x-4 gap-y-2 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3"
          >
            <p className="footer-text text-[11.5px] uppercase tracking-[0.14em]">
              © {new Date().getFullYear()} desi draft · nagpur, india
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-text inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[#faf8f4]/45 px-3.5 text-[12px] lowercase transition-colors hover:bg-cream hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
              >
                <InstagramIcon />
                instagram
              </a>
              <button
                type="button"
                onClick={() => scrollToTarget(0)}
                className="footer-text inline-flex min-h-[40px] items-center rounded-full border border-[#faf8f4]/45 px-4 text-[12px] lowercase transition-colors hover:bg-cream hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
              >
                back to top ↑
              </button>
              <button
                type="button"
                onClick={() => setCredits(true)}
                className="inline-flex min-h-[40px] items-center rounded-full bg-ink px-4 text-[12px] lowercase text-cream transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
              >
                credits
              </button>
            </div>
          </div>
        </div>
      </footer>

      <Modal open={credits} onClose={() => setCredits(false)} title="credits">
        <p className="text-[15px] leading-[1.5] text-ink/75">Design &amp; code by the Desi Draft studio.</p>
        <p className="mt-3 text-[13px] leading-[1.5] text-ink/62">
          Stickers, blobs and lettering drawn in-house. Built with React, GSAP, Lenis and Matter.js.
        </p>
      </Modal>
    </>
  );
}
