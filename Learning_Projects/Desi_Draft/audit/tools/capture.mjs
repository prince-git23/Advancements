/**
 * Desi Draft — frame-by-frame audit capture.
 *
 * Walks the running dev server section by section at fixed scroll progress,
 * screenshots each state, and records the DOM values that state is supposed to
 * have. Output feeds ../manifest.json, ../index.html (contact sheet) and the
 * README verification table.
 *
 *   node audit/tools/capture.mjs          (dev server on 127.0.0.1:5173)
 *   DD_URL=http://127.0.0.1:4173/ node audit/tools/capture.mjs   (built preview)
 *
 * Read-only: it screenshots and measures, it never edits project source.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '..');
const FRAME_ROOT = path.join(ROOT, 'frames');
const BASE = process.env.DD_URL || 'http://127.0.0.1:5173/';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** ms-playwright ships versioned folders; playwright-core may expect another. */
async function resolveChromium() {
  const base = path.join(process.env.LOCALAPPDATA || process.env.HOME || '', 'ms-playwright');
  const entries = await fs.readdir(base).catch(() => []);
  const dirs = entries.filter((d) => d.startsWith('chromium')).sort().reverse();
  const out = [];
  // Layout changed across versions: chrome-win64 is current, chrome-win older.
  const subs = ['chrome-win64', 'chrome-win', 'chrome-headless-shell-win64', 'chrome-linux64', 'chrome-linux'];
  const bins = ['chrome.exe', 'chrome-headless-shell.exe', 'headless_shell.exe', 'chrome'];
  for (const d of dirs) {
    for (const sub of subs) for (const bin of bins) out.push(path.join(base, d, sub, bin));
  }
  for (const p of out) if (await fs.access(p).then(() => true, () => false)) return p;
  return null;
}

/** DOM state read from every frame. */
function probe() {
  const css = (el, prop) => (el ? getComputedStyle(el).getPropertyValue(prop) : null);
  const num = (v) => (v == null ? null : Number.parseFloat(v));
  const team = document.getElementById('team');
  const cards = team ? Array.from(team.querySelectorAll('[data-team-card]')) : [];
  const opacities = (list) => list.map((c) => Number(num(css(c, 'opacity')).toFixed(2)));

  const words = Array.from(document.querySelectorAll('.hero-word-inner')).slice(0, 2);

  return {
    scrollY: Math.round(window.scrollY),
    canvases: document.querySelectorAll('canvas').length,
    nodes: document.getElementsByTagName('*').length,
    heapMB: performance.memory ? Number((performance.memory.usedJSHeapSize / 1048576).toFixed(1)) : null,
    reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
    hero: {
      firstWords: words.map((w) => css(w, 'transform')),
      fade: num(css(document.querySelector('.hero-fade'), 'opacity')),
      shellHeight: num(css(document.querySelector('#hero > div'), 'height')),
    },
    team: team
      ? {
          cards: cards.length,
          cardOpacities: opacities(cards),
          names: cards.map((c) => c.querySelector('.pc-name')?.textContent?.trim() ?? null),
          roles: cards.map((c) => c.querySelector('.pc-role')?.textContent?.trim() ?? null),
          images: cards.map((c) => {
            const img = c.querySelector('img');
            return img
              ? { src: img.getAttribute('src'), complete: img.complete, naturalWidth: img.naturalWidth }
              : null;
          }),
          fallbacks: cards.filter((c) => c.querySelector('.pc-fallback')).length,
          contacts: cards.filter((c) => c.querySelector('.pc-contact')).length,
          canvases: team.querySelectorAll('canvas').length,
          pinned: Boolean(team.parentElement?.classList.contains('pin-spacer')),
          height: Math.round(team.offsetHeight),
          headingWidth: Math.round(team.querySelector('h2')?.getBoundingClientRect().width ?? 0),
          viewportWidth: window.innerWidth,
        }
      : null,
    work: {
      cards: document.querySelectorAll('#work article[data-card]').length,
      featured: Boolean(document.querySelector('#work a[href="/work/floral-meets-graffiti"]')),
      canvases: document.querySelectorAll('#work canvas').length,
    },
    services: {
      rows: document.querySelectorAll('.svc-row').length,
      groups: Array.from(document.querySelectorAll('.svc-row h3')).map((h) => h.textContent?.trim() ?? ''),
    },
    footerStickers: document.querySelectorAll('footer canvas').length,
    footerPhysics: (() => {
      const c = document.querySelector('footer canvas');
      if (!c) return null;
      const stickers = Array.from(document.querySelectorAll('footer .will-change-transform'));
      return {
        state: c.dataset.physics ?? null,
        canvas: [c.width, c.height],
        opacities: stickers.map((s) => Number(num(css(s, 'opacity')).toFixed(2))),
        offsets: stickers.map((s) => css(s, 'transform')),
      };
    })(),
    media: {
      videos: document.querySelectorAll('video').length,
      playing: Array.from(document.querySelectorAll('video')).filter((v) => !v.paused).length,
    },
  };
}

const SECTION_NOTES = {
  hero: 'Hero. Words rise from their masks, the ellipse and underline draw, sticker pops.',
  intro: 'Intro. Giant sentence travels right-to-left, letters scatter in 3D, stickers drift.',
  manifesto: 'Manifesto. Heading lines rise, the portrait fan lands and parallaxes on scroll.',
  work: 'Work. Floral Alchemy feature, then three disciplines in their own layouts; no carousel, no pin.',
  team: 'Team. Six ProfileCards on a normal-height 3/2/1 grid; no pin, no WebGL.',
  services: 'Services. Five-row ledger; heading rises, rows stagger, hover slides the colour wash in.',
  footer: 'Footer. Matter.js stickers drop into their slots and settle.',
};

/**
 * Frame-rate samples. Run in a page of its own: a session that has already
 * walked the whole site (and started footer physics, video, all triggers) hands
 * the sampler Chromium's occluded-window throttle instead of real numbers.
 */
async function measurePerf(browser) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await ctx.addInitScript(() => {
    try {
      sessionStorage.setItem('dd-visited', '1');
    } catch {}
  });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForFunction(() => document.fonts?.status === 'loaded', null, { timeout: 20000 }).catch(() => {});
  await sleep(2500);

  const geo = await page.evaluate(() => {
    const out = {};
    for (const el of document.querySelectorAll('main section[id], footer#footer')) {
      const host = el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el;
      const r = host.getBoundingClientRect();
      out[el.id || 'footer'] = {
        top: Math.round(r.top + scrollY),
        range: Math.max(0, Math.round(host.offsetHeight - innerHeight)),
      };
    }
    return out;
  });

  const at = async (id, frac) => {
    const g = geo[id];
    if (!g) return false;
    await page.evaluate((y) => (window.__ddScrollTo ? window.__ddScrollTo(y) : window.scrollTo(0, y)), g.top + g.range * frac);
    await sleep(900);
    return true;
  };

  const sample = (ms) =>
    page.evaluate(async (budget) => {
      const deltas = [];
      let last = performance.now();
      const t0 = last;
      await new Promise((resolve) => {
        const step = (now) => {
          deltas.push(now - last);
          last = now;
          if (now - t0 < budget) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      });
      deltas.shift();
      const sorted = [...deltas].sort((a, b) => a - b);
      const avg = deltas.reduce((a, b) => a + b, 0) / deltas.length;
      const canvases = Array.from(document.querySelectorAll('canvas'));
      return {
        fps: Number((1000 / avg).toFixed(1)),
        p50: Number(sorted[Math.floor(sorted.length * 0.5)].toFixed(1)),
        p95: Number(sorted[Math.floor(sorted.length * 0.95)].toFixed(1)),
        max: Number(sorted[sorted.length - 1].toFixed(1)),
        frames: deltas.length,
        over20ms: deltas.filter((d) => d > 20).length,
        over33ms: deltas.filter((d) => d > 33).length,
        canvases: canvases.length,
        canvasArea: canvases.reduce(
          (a, c) => a + Math.round(c.clientWidth) * Math.round(c.clientHeight),
          0
        ),
        gl: (() => {
          const g = document.querySelector('#team canvas')?.getContext('webgl2');
          if (!g) return 'none';
          const e = g.getExtension('WEBGL_debug_renderer_info');
          return String(g.getParameter(e ? e.UNMASKED_RENDERER_WEBGL : g.RENDERER));
        })(),
      };
    }, ms);

  const sweep = (startY, endY, ms) =>
    page.evaluate(
      async ({ startY, endY, ms }) => {
        const deltas = [];
        let last = performance.now();
        const t0 = last;
        await new Promise((resolve) => {
          const step = (now) => {
            const t = (now - t0) / ms;
            deltas.push(now - last);
            last = now;
            const y = startY + (endY - startY) * Math.min(1, t);
            if (window.__ddScrollTo) window.__ddScrollTo(y);
            if (t < 1) requestAnimationFrame(step);
            else resolve();
          };
          requestAnimationFrame(step);
        });
        deltas.shift();
        const sorted = [...deltas].sort((a, b) => a - b);
        const avg = deltas.reduce((a, b) => a + b, 0) / deltas.length;
        return {
          fps: Number((1000 / avg).toFixed(1)),
          p50: Number(sorted[Math.floor(sorted.length * 0.5)].toFixed(1)),
          p95: Number(sorted[Math.floor(sorted.length * 0.95)].toFixed(1)),
          max: Number(sorted[sorted.length - 1].toFixed(1)),
          frames: deltas.length,
          over20ms: deltas.filter((d) => d > 20).length,
          over33ms: deltas.filter((d) => d > 33).length,
        };
      },
      { startY, endY, ms }
    );

  const out = {
    note: 'Headless Chromium on the capture machine, 1440x900, DPR 1, hardware GPU via ANGLE/D3D11. Trace-measured in a fresh page; not a phone.',
    hardware: await page.evaluate(() => ({
      cores: navigator.hardwareConcurrency,
      memory: navigator.deviceMemory ?? null,
      dpr: devicePixelRatio,
    })),
  };

  await at('hero', 0);
  out.hero = await sample(1500);

  await at('team', 0.5);
  out.teamCards = await sample(1600);

  await at('team', 0.9);
  out.teamIdle = await sample(1600);

  const t = geo.team;
  if (t) out.teamScroll = await sweep(t.top + t.range * 0.1, t.top + t.range * 0.95, 2200);

  await at('services', 0.5);
  out.services = await sample(1400);

  await at('footer', 0.6);
  await sleep(2200); // let the stickers land
  out.footerRest = await sample(1500);

  out.resources = await page.evaluate(() => {
    const by = {};
    for (const e of performance.getEntriesByType('resource')) {
      const k = e.initiatorType || 'other';
      by[k] = by[k] || { n: 0, kb: 0 };
      by[k].n += 1;
      by[k].kb += (e.transferSize || 0) / 1024;
    }
    for (const k of Object.keys(by)) by[k].kb = Math.round(by[k].kb);
    return by;
  });
  out.memory = await page.evaluate(() => ({
    heapMB: performance.memory ? Number((performance.memory.usedJSHeapSize / 1048576).toFixed(1)) : null,
    domNodes: document.getElementsByTagName('*').length,
  }));

  await ctx.close();
  return out;
}

async function main() {
  const exe = await resolveChromium();
  const browser = await chromium.launch({
    headless: true,
    executablePath: exe || undefined,
    args: [
      '--force-color-profile=srgb',
      '--font-render-hinting=none',
      // headless windows can count as occluded; without these the sampler reads
      // Chromium's throttle instead of the page.
      '--disable-background-timer-throttling',
      '--disable-renderer-backgrounding',
      '--disable-backgrounding-occluded-windows',
    ],
  });

  const manifest = {
    project: 'Desi Draft',
    url: BASE,
    capturedAt: new Date().toISOString(),
    engine: browser.version(),
    note: 'Scroll positions are fraction-of-section progress, written through the dev helper __ddScrollTo so ScrollTrigger settles before each shot.',
    viewports: {},
    frames: [],
    perf: {},
  };

  let index = 0;
  async function shoot(page, folder, viewportKey, sectionId, progress, note, extra = {}) {
    index += 1;
    const slug = `${String(index).padStart(3, '0')}-${sectionId}-${String(Math.round(progress * 100)).padStart(3, '0')}`;
    const rel = path.join('frames', folder, `${slug}.png`);
    await page.screenshot({ path: path.join(ROOT, rel) });
    let metrics = null;
    try {
      metrics = await page.evaluate(probe);
    } catch {
      metrics = null;
    }
    manifest.frames.push({
      file: rel.replace(/\\/g, '/'),
      viewport: viewportKey,
      section: sectionId,
      progress: Number(progress.toFixed(3)),
      note,
      ...extra,
      metrics,
    });
    console.log(`  ${slug}  p=${progress.toFixed(2)}  canvases=${metrics?.canvases ?? '?'}`);
  }

  /* ------------------------------------------------------------------ *
   * 0. Preloader (fresh context = first visit of the session)
   * ------------------------------------------------------------------ */
  {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
      reducedMotion: 'no-preference',
    });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'load' });
    await page.waitForFunction(() => document.fonts?.status === 'loaded', null, { timeout: 15000 }).catch(() => {});
    await sleep(250);
    await shoot(page, 'desktop', 'desktop-1440x900', 'preloader', 0.3, 'Preloader. Counter and wordmark while the site warms up.');
    await sleep(700);
    await shoot(page, 'desktop', 'desktop-1440x900', 'preloader', 0.8, 'Preloader leaving. Wipe reveals the hero underneath.');
    await ctx.close();
  }

  const layoutOf = (page) =>
    page.evaluate(() => {
      const vh = innerHeight;
      // ScrollTrigger pins wrap the section in .pin-spacer, so it is no longer
      // a direct child of <main>. Match by id instead, in DOM order.
      const nodes = [...document.querySelectorAll('main section[id], footer#footer')].filter(Boolean);
      return nodes.map((el) => {
        const spacer = el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : null;
        const host = spacer || el;
        const rect = host.getBoundingClientRect();
        return {
          id: el.id || 'footer',
          top: Math.round(rect.top + scrollY),
          height: Math.round(host.offsetHeight),
          sectionHeight: Math.round(el.offsetHeight),
          range: Math.max(0, Math.round(host.offsetHeight - vh)),
          pinned: Boolean(spacer),
        };
      });
    });

  const scrollTo = (page, y) =>
    page.evaluate((v) => {
      if (window.__ddScrollTo) window.__ddScrollTo(v);
      else window.scrollTo(0, v);
    }, y);

  const settle = async (page, ms = 760) => {
    await sleep(ms);
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  };

  /* ------------------------------------------------------------------ *
   * 1. Desktop walkthrough
   * ------------------------------------------------------------------ */
  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
  });
  await desktop.addInitScript(() => {
    try {
      sessionStorage.setItem('dd-visited', '1');
    } catch {}
  });
  const page = await desktop.newPage();
  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForFunction(() => document.fonts?.status === 'loaded', null, { timeout: 20000 }).catch(() => {});

  // Hero entrance is time-based, not scroll-based: sample it as it plays.
  for (const [ms, note] of [
    [140, 'Hero entrance t≈0.14s — words still inside their masks.'],
    [520, 'Hero entrance t≈0.52s — first words rising, stagger visible.'],
    [980, 'Hero entrance t≈0.98s — ellipse/underline drawing, sticker popping.'],
    [1700, 'Hero settled. Full headline, sound toggle, reel controls visible.'],
  ]) {
    await sleep(ms === 140 ? 140 : 300);
    await shoot(page, 'desktop', 'desktop-1440x900', 'hero-entrance', ms / 2000, note, { atMs: ms });
  }
  await sleep(900);

  const layout = await layoutOf(page);
  manifest.viewports['desktop-1440x900'] = { width: 1440, height: 900, sections: layout };
  const byId = (id) => layout.find((s) => s.id === id);

  const plan = [
    {
      id: 'hero',
      frames: [0, 0.35, 0.7, 1],
      notes: ['shutter closed, headline at rest', 'shutter opening', 'headline lifting away', 'hero fully collapsed into the next section'],
    },
    {
      id: 'intro',
      frames: [0, 0.2, 0.4, 0.6, 0.8, 1],
      notes: ['sentence entering from the right', 'middle of the travel', 'sentence centre-screen', 'letters scattering', 'copy fading out', 'hand-off to manifesto'],
    },
    {
      id: 'manifesto',
      frames: [0, 0.33, 0.66, 1],
      notes: ['heading lines rising in', 'fan landed, parallax engaged', 'fan at mid-parallax', 'copy revealed'],
    },
    {
      id: 'work',
      frames: [0, 0.5, 1],
      notes: ['dark panel wiping up', 'cards fanned, meta in', 'section leaving, panel full height'],
    },
    {
      id: 'team',
      frames: [0, 0.5, 1],
      notes: [
        'heading and first cards entering (staggered, once)',
        'all six profile cards on the grid, no pin',
        'section leaving; cards stay mounted and visible',
      ],
    },
    {
      id: 'services',
      frames: [0, 0.5, 1],
      notes: ['heading masked, cards below', 'cards fanned in', 'section leaving'],
    },
    {
      id: 'footer',
      frames: [0, 0.5, 1],
      notes: ['footer entering, stickers not dropped', 'stickers mid-drop', 'footer at rest'],
    },
  ];

  for (const entry of plan) {
    const sec = byId(entry.id);
    if (!sec) {
      console.warn(`missing section ${entry.id}`);
      continue;
    }
    for (let i = 0; i < entry.frames.length; i += 1) {
      const p = entry.frames[i];
      await scrollTo(page, sec.top + sec.range * p);
      await settle(page, entry.id === 'team' ? 820 : 700);
      await shoot(page, 'desktop', 'desktop-1440x900', entry.id, p, `${SECTION_NOTES[entry.id]} — ${entry.notes[i]}`);
    }
  }

  // Footer physics needs wall-clock time, not scroll progress.
  const footer = byId('footer');
  if (footer) {
    await scrollTo(page, footer.top - 40);
    for (const [ms, note] of [
      [450, 'Footer stickers falling (t≈0.45s)'],
      [1200, 'Footer stickers landing (t≈1.2s)'],
      [2600, 'Footer stickers settled in their slots (t≈2.6s)'],
    ]) {
      await sleep(ms === 450 ? 450 : 700);
      await shoot(page, 'desktop', 'desktop-1440x900', 'footer-physics', ms / 4000, note);
    }
  }

  // Services hover: the row's colour wash slides in.
  const services = byId('services');
  if (services) {
    await scrollTo(page, services.top + services.range * 0.45);
    await settle(page, 700);
    const box = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('.svc-row'));
      const target = rows[Math.min(1, rows.length - 1)];
      const r = target.getBoundingClientRect();
      return { x: r.left + r.width * 0.5, y: r.top + Math.min(120, r.height / 2) };
    });
    await page.mouse.move(box.x, box.y);
    await sleep(750);
    await shoot(page, 'desktop', 'desktop-1440x900', 'services-hover', 0.45, 'Services — hovered row fills with its discipline colour, sticker tilts.');
    await page.mouse.move(10, 10);
  }

  // Work section: featured plate + selected cards (no carousel to advance).
  const work = byId('work');
  if (work) {
    await scrollTo(page, work.top + work.range * 0.55);
    await settle(page, 700);
    await shoot(page, 'desktop', 'desktop-1440x900', 'work-grid', 0.55, 'Work — featured café plate and the selected grid.');
  }

  // Work index, filtered: filtering is a view, so the URL keeps the choice.
  await page.goto(new URL('/work?c=video', BASE).href, { waitUntil: 'networkidle' });
  await sleep(1200);
  await shoot(
    page,
    'desktop',
    'desktop-1440x900',
    'work-filter',
    0.3,
    'Work index — filtered to Video & Motion; one full-width case study, ?c=video in the URL.'
  );
  await desktop.close();

  /* ------------------------------------------------------------------ *
   * 2. Perf samples, in their own page
   * ------------------------------------------------------------------ */
  console.log('  measuring frame rate…');
  manifest.perf = await measurePerf(browser);
  for (const [k, v] of Object.entries(manifest.perf)) {
    if (v && typeof v === 'object' && 'fps' in v) console.log(`  ${k}: ${v.fps}fps  p95 ${v.p95}ms`);
  }

  /* ------------------------------------------------------------------ *
   * 3. Reduced motion
   * ------------------------------------------------------------------ */
  {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
    });
    await ctx.addInitScript(() => {
      try {
        sessionStorage.setItem('dd-visited', '1');
      } catch {}
    });
    const rm = await ctx.newPage();
    await rm.goto(BASE, { waitUntil: 'load' });
    await rm.waitForFunction(() => document.fonts?.status === 'loaded', null, { timeout: 15000 }).catch(() => {});
    await sleep(700);
    await shoot(rm, 'desktop', 'reduced-1440x900', 'hero-reduced', 0, 'Reduced motion — headline shown immediately, no mask travel.');
    const rmLayout = await layoutOf(rm);
    const rmTeam = rmLayout.find((s) => s.id === 'team');
    if (rmTeam) {
      await scrollTo(rm, rmTeam.top + 10);
      await sleep(500);
      await shoot(rm, 'desktop', 'reduced-1440x900', 'team-reduced', 0, 'Reduced motion team — all six cards rendered immediately, no stagger or pin.');
    }
    await ctx.close();
  }

  /* ------------------------------------------------------------------ *
   * 4. Mobile
   * ------------------------------------------------------------------ */
  {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 1,
      isMobile: true,
      hasTouch: true,
      reducedMotion: 'no-preference',
    });
    await ctx.addInitScript(() => {
      try {
        sessionStorage.setItem('dd-visited', '1');
      } catch {}
    });
    const m = await ctx.newPage();
    await m.goto(BASE, { waitUntil: 'load' });
    await m.waitForFunction(() => document.fonts?.status === 'loaded', null, { timeout: 15000 }).catch(() => {});
    await sleep(1800);
    const mLayout = await layoutOf(m);
    manifest.viewports['mobile-390x844'] = { width: 390, height: 844, sections: mLayout };
    const mById = (id) => mLayout.find((s) => s.id === id);

    for (const [id, p, note] of [
      ['hero', 0, 'Mobile hero — full-bleed reel, headline stacked.'],
      ['intro', 0.4, 'Mobile intro — sentence mid-travel.'],
      ['manifesto', 0.4, 'Mobile manifesto — fan compressed.'],
      ['work', 0.3, 'Mobile work — featured plate stacked over its title, selected cards below.'],
      ['team', 0.2, 'Mobile team — single-column profile cards, no lanyard or role pills.'],
      ['services', 0.3, 'Mobile services — five stacked ledger rows.'],
      ['footer', 0.4, 'Mobile footer — four stickers, copy above them.'],
    ]) {
      const sec = mById(id);
      if (!sec) {
        console.warn(`missing mobile section ${id}`);
        continue;
      }
      await scrollTo(m, sec.top + sec.range * p);
      await sleep(700);
      await shoot(m, 'mobile', 'mobile-390x844', id, p, note);
    }
    await ctx.close();
  }

  await browser.close();

  manifest.counts = {
    total: manifest.frames.length,
    desktop: manifest.frames.filter((f) => f.viewport === 'desktop-1440x900').length,
    reduced: manifest.frames.filter((f) => f.viewport === 'reduced-1440x900').length,
    mobile: manifest.frames.filter((f) => f.viewport === 'mobile-390x844').length,
  };

  await fs.writeFile(path.join(ROOT, 'manifest.json'), JSON.stringify(manifest, null, 2));

  /* ------------------------------------------------------------------ *
   * 5. Contact sheet
   * ------------------------------------------------------------------ */
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const groups = {};
  for (const f of manifest.frames) (groups[f.viewport] = groups[f.viewport] || []).push(f);

  const card = (f) => {
    const t = f.metrics?.team;
    const facts = [];
    if (t) {
      facts.push(`${t.cards} cards`);
      facts.push(`opacity ${t.cardOpacities.join(' / ')}`);
      facts.push(`${t.contacts} contact links`);
      facts.push(`${t.canvases} team canvases`);
      facts.push(t.pinned ? 'pinned' : 'not pinned');
    }
    if (f.metrics) facts.push(`${f.metrics.canvases} canvases total`, `${f.metrics.nodes} nodes`);
    return `<figure class="frame">
      <img loading="lazy" src="${esc(f.file)}" alt="${esc(f.section)} at ${Math.round(f.progress * 100)}%">
      <figcaption>
        <strong>${esc(f.section)} · ${Math.round(f.progress * 100)}%</strong>
        <span class="file">${esc(f.file.split('/').pop())}</span>
        <p>${esc(f.note)}</p>
        <p class="facts">${facts.map(esc).join(' · ')}</p>
      </figcaption>
    </figure>`;
  };

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Desi Draft — frame archive</title>
<style>
  :root{color-scheme:light}
  *{box-sizing:border-box}
  body{margin:0;background:#EEEAE3;color:#0A0A0A;font:15px/1.45 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
  header{padding:40px 28px 8px;max-width:1400px;margin:0 auto}
  h1{font-size:clamp(28px,4vw,46px);letter-spacing:-.03em;margin:0 0 6px}
  header p{margin:0;max-width:820px;color:#3c3a37}
  h2{margin:46px 0 14px;font-size:20px;letter-spacing:-.01em}
  main{max-width:1400px;margin:0 auto;padding:0 28px 80px}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:18px}
  .frame{margin:0;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,.08),0 8px 24px rgba(0,0,0,.06)}
  .frame img{display:block;width:100%;height:auto;background:#111}
  figcaption{padding:12px 14px 14px;display:flex;flex-direction:column;gap:4px}
  figcaption strong{font-size:13px;text-transform:lowercase;letter-spacing:.02em}
  .file{font:11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;color:#6b6862}
  figcaption p{margin:2px 0 0;font-size:12.5px;color:#3c3a37}
  .facts{font:11px/1.35 ui-monospace,SFMono-Regular,Menlo,monospace;color:#2E7D5B}
</style></head>
<body>
<header>
  <h1>desi draft — frame archive</h1>
  <p>Every state of the site at fixed scroll progress, captured ${esc(manifest.capturedAt)} against ${esc(BASE)} in ${esc(manifest.engine)}. ${manifest.counts.total} frames. The values under each frame are read from the DOM at that instant — diff them against the expected table in README.md.</p>
</header>
<main>
${Object.entries(groups)
  .map(([vp, frames]) => `<h2>${esc(vp)} — ${frames.length} frames</h2><div class="grid">${frames.map(card).join('\n')}</div>`)
  .join('\n')}
</main>
</body></html>`;
  await fs.writeFile(path.join(ROOT, 'index.html'), html);

  console.log(`\nCaptured ${manifest.counts.total} frames -> audit/frames`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
