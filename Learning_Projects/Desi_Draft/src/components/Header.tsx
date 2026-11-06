import { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { gsap, ScrollTrigger, scrollToId } from '../lib/smooth';
import { site } from '../data/site';
import { Logo } from './art/Logo';
import { burstPath } from './art/shapes';
import { Modal } from './Modal';
import { WorkMenu } from './layout/WorkMenu';

const WhatsAppGlyph = ({ size = 26 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.6 14.2c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.1-.2.3-.8 1-1 1.2-.2.2-.4.3-.7.1-.3-.2-1.2-.5-2.3-1.4-.8-.7-1.4-1.7-1.5-2-.2-.3 0-.5.1-.6.1-.1.3-.4.5-.6.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.2-.7-1.7-.9-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3.1 4.9 4.3 2.4 1 2.9.8 3.4.8.5-.1 1.6-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.2-.3-.3-.6-.4Z" />
    <path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.4A10 10 0 1 0 12 2Zm0 18.1a8.1 8.1 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.1 8.1 0 1 1 12 20.1Z" />
  </svg>
);

const NAV_SECTIONS: { id: string; theme: 'light' | 'dark' }[] = [
  { id: 'hero', theme: 'light' },
  { id: 'intro', theme: 'dark' },
  { id: 'manifesto', theme: 'dark' },
  { id: 'work', theme: 'light' },
  { id: 'team', theme: 'light' },
  { id: 'services', theme: 'dark' },
  { id: 'clients', theme: 'dark' },
  { id: 'footer', theme: 'light' },
];

export function Header({ fixedTheme }: { fixedTheme?: 'light' | 'dark' }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [modal, setModal] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const active = fixedTheme ?? theme;
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (fixedTheme) return;
    const triggers: ScrollTrigger[] = [];
    const t = window.setTimeout(() => {
      NAV_SECTIONS.forEach((s) => {
        const el = document.getElementById(s.id);
        if (!el) return;
        triggers.push(
          ScrollTrigger.create({
            trigger: el,
            start: 'top 56px',
            end: 'bottom 56px',
            onToggle: (self) => {
              if (self.isActive) setTheme(s.theme);
            },
          })
        );
      });
      ScrollTrigger.refresh();
    }, 160);

    return () => {
      window.clearTimeout(t);
      triggers.forEach((tr) => tr.kill());
    };
  }, [fixedTheme, pathname]);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const onReady = () => {
      gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: 'power2.out' });
    };
    window.addEventListener('dd:ready', onReady, { once: true });
    return () => window.removeEventListener('dd:ready', onReady);
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const pointerKind = useRef<'mouse' | 'touch'>('mouse');
  const burstRef = useRef<HTMLButtonElement>(null);

  const openMenu = () => {
    window.clearTimeout(closeTimer.current);
    setMenuOpen(true);
  };

  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMenuOpen(false), 250);
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (burstRef.current?.contains(t)) return;
      if (document.getElementById('work-menu')?.contains(t)) return;
      setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMenuOpen(false);
      burstRef.current?.focus();
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <header
        ref={headerRef}
        data-theme={active}
        className={`fixed inset-x-0 top-0 z-[9999] flex h-[72px] items-center justify-between px-4 transition-colors duration-300 sm:px-6 ${
          active === 'light' ? 'text-cream' : 'text-ink'
        }`}
      >
        <WorkMenu open={menuOpen} onClose={() => setMenuOpen(false)} onEnter={openMenu} onLeave={scheduleClose} />

        <button
          ref={burstRef}
          aria-label="Open work menu"
          aria-haspopup="true"
          aria-expanded={menuOpen}
          aria-controls="work-menu"
          onPointerEnter={() => {
            if (pointerKind.current === 'mouse') openMenu();
          }}
          onPointerLeave={scheduleClose}
          onPointerDown={(e) => {
            pointerKind.current = e.pointerType === 'touch' ? 'touch' : 'mouse';
          }}
          onClick={() => {
            if (pointerKind.current === 'touch') setMenuOpen((o) => !o);
            else openMenu();
          }}
          className="work-burst group relative z-10 grid h-14 w-14 place-items-center"
        >
          <svg width="56" height="56" viewBox="0 0 120 120" aria-hidden="true" className="transition-transform duration-300 group-hover:scale-[1.08]">
            <path d={burstPath(10, 58, 43)} fill="#E8603C" />
          </svg>
          <span className="display pointer-events-none absolute inset-0 flex -rotate-[6deg] items-center justify-center pt-[2px] text-[15px] font-black tracking-[-.02em] text-white">
            work
          </span>
        </button>

        <button
          aria-label="Desi Draft home"
          onClick={() => {
            if (pathname === '/') scrollToId('hero');
            else navigate('/');
          }}
          className="absolute left-1/2 top-1/2 w-[136px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 hover:scale-[1.04] sm:w-[148px]"
        >
          <Logo className="w-full" color="currentColor" strokeWidth={2.2} />
        </button>

        <button
          aria-label="Chat on WhatsApp"
          onClick={() => setModal(true)}
          className="relative z-10 grid h-11 w-11 place-items-center rounded-full transition-transform duration-300 hover:scale-110"
        >
          <WhatsAppGlyph />
        </button>
      </header>

      <Modal open={modal} onClose={() => setModal(false)} title="WhatsApp Us">
        <p className="mb-5 text-[15px] leading-[1.45] text-ink/70">
          Scan the QR code to chat with us via your smartphone.
        </p>
        <div className="mx-auto mb-6 grid w-fit place-items-center rounded-[16px] bg-white p-4">
          <QRCodeSVG value={site.whatsapp} size={170} bgColor="#ffffff" fgColor="#0A0A0A" level="M" />
        </div>
        <motion.a
          href={site.whatsapp}
          target="_blank"
          rel="noreferrer"
          whileHover={{ y: -2 }}
          className="display flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-[15px] text-cream"
        >
          <WhatsAppGlyph size={18} /> chat via desktop
        </motion.a>
      </Modal>
    </>
  );
}
