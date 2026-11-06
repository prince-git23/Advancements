import { useCallback, useEffect, useRef, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { gsap, initSmoothScroll, ScrollTrigger } from './lib/smooth';
import { Header } from './components/Header';
import { Preloader } from './components/Preloader';
import { Hero } from './components/Hero';
import { Intro } from './components/Intro';
import { Manifesto } from './components/Manifesto';
import { WorkCarousel } from './components/WorkCarousel';
import { Team } from './components/Team';
import { Services } from './components/Services';
import { Clients } from './components/Clients';
import { Footer } from './components/Footer';
import { WorkIndex } from './pages/WorkIndex';
import { WorkDetail } from './pages/WorkDetail';

function Home() {
  return (
    <main>
      <Hero />
      <Intro />
      <Manifesto />
      <WorkCarousel />
      <Team />
      <Services />
      <Clients />
      <Footer />
    </main>
  );
}

function PageWipe() {
  const panelRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const panel = panelRef.current;
    if (!panel) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tl = gsap.timeline();
    tl.set(panel, { yPercent: 0, opacity: 1 })
      .to(panel, { yPercent: -100, duration: 0.7, ease: 'power4.inOut' })
      .set(panel, { opacity: 0 });
    return () => {
      tl.kill();
    };
  }, [pathname]);

  return (
    <div
      ref={panelRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[110] bg-cream opacity-0"
    />
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
    if (location.pathname === '/') {
      document.title = 'desi draft — content for the new desi mainstream';
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
      <PageWipe />
    </>
  );
}
