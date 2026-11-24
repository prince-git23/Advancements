import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { gsap, initSmoothScroll, ScrollTrigger } from './lib/smooth';
import { scrollToTarget } from './lib/scroll';
import { setCanonical } from './lib/meta';
import { reducedMotion } from './lib/motion';
import { Logo } from './components/art/Logo';
import { Header } from './components/Header';
import { Preloader } from './components/Preloader';
import { Hero } from './components/Hero';
import { Intro } from './components/Intro';
import { Manifesto } from './components/Manifesto';
import { WorkFeature } from './components/WorkFeature';
import { Team } from './components/Team';
import { Testimonials } from './components/Testimonials';
import { Services } from './components/Services';
import { Footer } from './components/Footer';
import { ContactDialog } from './components/ContactDialog';
const WorkIndex = lazy(() => import('./pages/WorkIndex').then((m) => ({ default: m.WorkIndex })));
const WorkDetail = lazy(() => import('./pages/WorkDetail').then((m) => ({ default: m.WorkDetail })));

function Home() {
  return (
    <main>
      {/* Storyboard order: idea → thinking → making → work → people → connection.
          Services sits before the work because the ledger points straight at it
          ("see the work behind these"). */}
      <Hero />
      <Intro />
      <Manifesto />
      <Services />
      <WorkFeature />
      <Team />
      <Testimonials />
      <Footer />
    </main>
  );
}

/**
 * Diagonal page transition (§5.3): a rotated colour band sweeps in from the
 * bottom-left, the logo fades in on top while the route changes under it, then
 * the band leaves to the top-right. Colours cycle per navigation.
 */
function Transition() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const palette = ['#2E7D5B', '#E8B4F5', '#8499F8', '#E8603C'];
  const index = useRef(0);
  const busy = useRef(false);

  useEffect(() => {
    const play = (href: string) => {
      const wrap = wrapRef.current;
      const band = bandRef.current;
      const logo = logoRef.current;
      if (!wrap || !band || !logo || busy.current) return;

      if (reducedMotion()) {
        navigate(href);
        return;
      }

      busy.current = true;
      index.current = (index.current + 1) % palette.length;
      band.style.background = palette[index.current];
      gsap.killTweensOf([band, logo]);

      const tl = gsap.timeline({
        onComplete: () => {
          busy.current = false;
          gsap.set(wrap, { autoAlpha: 0 });
        },
      });

      tl.set(wrap, { autoAlpha: 1 })
        .set(band, { rotate: -35, x: '-120vmax', y: '120vmax' })
        .set(logo, { autoAlpha: 0, scale: 0.96 })
        .to(band, { x: '0vmax', y: '0vmax', duration: 0.7, ease: 'power4.inOut' })
        .to(logo, { autoAlpha: 1, scale: 1, duration: 0.25 }, '-=0.2')
        .to(band, { x: '120vmax', y: '-120vmax', duration: 0.7, ease: 'power4.inOut' }, '+=0.35')
        .to(logo, { autoAlpha: 0, duration: 0.3 }, '<');

      // Navigation never waits on the tweens: if frames are throttled (background
      // tab, reduced-power mode) the route still changes and the band unwinds.
      window.setTimeout(() => {
        navigate(href);
        scrollToTarget(0, { immediate: true });
      }, 700);
      window.setTimeout(() => {
        busy.current = false;
        gsap.set(wrap, { autoAlpha: 0 });
      }, 2100);
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement | null)?.closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || !href.startsWith('/') || href.startsWith('//') || anchor.target === '_blank') return;
      if (anchor.hasAttribute('download') || anchor.getAttribute('rel') === 'external') return;
      e.preventDefault();
      play(href);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [navigate]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[var(--z-transition)] overflow-hidden"
      style={{ visibility: 'hidden', opacity: 0 }}
    >
      <div
        ref={bandRef}
        className="absolute"
        style={{
          left: '50%',
          top: '50%',
          width: '300vmax',
          height: '300vmax',
          marginLeft: '-150vmax',
          marginTop: '-150vmax',
          background: '#2E7D5B',
          transform: 'rotate(-35deg) translate3d(-120vmax, 120vmax, 0)',
        }}
      />
      <div ref={logoRef} className="absolute inset-0 grid place-items-center">
        <Logo className="w-[160px] text-cream" color="currentColor" strokeWidth={2} />
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [preloader] = useState<boolean>(() => {
    try {
      return !sessionStorage.getItem('dd-visited') && window.location.pathname === '/';
    } catch {
      return false;
    }
  });

  useEffect(() => initSmoothScroll(), []);

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) document.fonts.ready.then(refresh).catch(() => {});
    const t = window.setTimeout(refresh, 900);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const lenis = (window as unknown as { __lenis?: { scrollTo: (n: number, o?: object) => void } }).__lenis;
    lenis?.scrollTo(0, { immediate: true });
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 320);
    return () => window.clearTimeout(t);
  }, [location.pathname]);

  useEffect(() => {
    // Canonical follows the route; it is omitted entirely when no origin is set.
    setCanonical(location.pathname);
    if (location.pathname === '/') {
      document.title = 'desi draft — a content studio for the new desi mainstream';
    } else if (location.pathname === '/work') {
      document.title = 'work — desi draft';
    }
  }, [location.pathname]);

  useEffect(() => {
    if (preloader) return;
    const t = window.setTimeout(() => window.dispatchEvent(new Event('dd:ready')), 200);
    return () => window.clearTimeout(t);
  }, [preloader, location.pathname]);

  const onPreloadDone = useCallback(() => {
    try {
      sessionStorage.setItem('dd-visited', '1');
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event('dd:ready'));
    window.setTimeout(() => ScrollTrigger.refresh(), 300);
  }, []);

  return (
    <>
      {preloader && <Preloader onDone={onPreloadDone} />}
      <Header fixedTheme={isHome ? undefined : 'dark'} />
      <ContactDialog />
      <Suspense fallback={<div className="min-h-[100svh] bg-cream" aria-busy="true" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<WorkIndex />} />
          <Route path="/work/:slug" element={<WorkDetail />} />
          <Route
            path="*"
            element={
              <main className="grid min-h-[100svh] place-items-center bg-cream px-6 text-center">
                <h1 className="display text-[clamp(2rem,5vw,4rem)]">page not found</h1>
              </main>
            }
          />
        </Routes>
      </Suspense>
      <Transition />
    </>
  );
}
