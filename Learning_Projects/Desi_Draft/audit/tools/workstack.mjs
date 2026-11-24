/**
 * Selected Work — stack verification.
 *
 *   node audit/tools/workstack.mjs        (built preview on 127.0.0.1:4174)
 *
 * Checks, at every required viewport:
 *  - five project cards, each with a real media surface and one working link
 *  - no horizontal overflow and no card escaping the viewport
 *  - desktop/laptop: window-level sticky stacking, media ≈55–65% of the card
 *  - tablet/phone: no pinning, natural document flow, media above the text
 *  - only the front card plays its video; every other preview is paused
 *  - reduced motion swaps the stack for the static list
 *
 * Screenshots: ../frames/stack-<state>-<width>.jpg
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const here = path.dirname(fileURLToPath(import.meta.url));
const FRAMES = path.join(here, '..', 'frames');
const BASE = process.env.DD_URL || 'http://127.0.0.1:4174/';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const VIEWPORTS = [
  [1920, 1080],
  [1440, 900],
  [1366, 768],
  [1280, 800],
  [1024, 768],
  [768, 1024],
  [430, 932],
  [390, 844],
  [360, 800],
];

async function resolveChromium() {
  const base = path.join(process.env.LOCALAPPDATA || process.env.HOME || '', 'ms-playwright');
  const entries = await (await import('node:fs/promises')).readdir(base).catch(() => []);
  const dirs = entries.filter((d) => d.startsWith('chromium-')).sort().reverse();
  for (const d of dirs) {
    for (const sub of ['chrome-win64', 'chrome-win', 'chrome-linux64', 'chrome-linux']) {
      for (const bin of ['chrome.exe', 'chrome']) {
        const p = path.join(base, d, sub, bin);
        if (await (await import('node:fs/promises')).access(p).then(() => true, () => false)) return p;
      }
    }
  }
  return null;
}

const executablePath = await resolveChromium();
const browser = await chromium.launch({ executablePath });
const failures = [];
const fail = (msg) => failures.push(msg);

const snapshot = (page) =>
  page.evaluate(() => {
    const section = document.getElementById('work');
    const cards = [...section.querySelectorAll('.sw-card')];
    const stack = section.querySelector('.scroll-stack');
    const rect = (el) => {
      const r = el.getBoundingClientRect();
      return { top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width), height: Math.round(r.height) };
    };
    return {
      vw: innerWidth,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      sectionTop: Math.round(section.getBoundingClientRect().top + scrollY),
      sectionHeight: section.offsetHeight,
      stack: Boolean(stack),
      cards: cards.map((card, i) => {
        const media = card.querySelector('.sw-media');
        const body = card.querySelector('.sw-body');
        const title = card.querySelector('.sw-title');
        const link = card.querySelector('a[href^="/work/"]');
        const video = card.querySelector('video');
        return {
          i,
          ...rect(card),
          media: media ? rect(media) : null,
          body: body ? rect(body) : null,
          active: card.dataset.active,
          titleSize: title ? Math.round(parseFloat(getComputedStyle(title).fontSize)) : 0,
          titleFits: title && body ? title.getBoundingClientRect().bottom <= body.getBoundingClientRect().bottom + 1 : true,
          line: card.querySelector('.sw-line')?.textContent?.trim() ?? '',
          href: link?.getAttribute('href') ?? null,
          images: card.querySelectorAll('img, video').length,
          broken: [...card.querySelectorAll('img')].filter((i) => i.complete && i.naturalWidth === 0).length,
          video: video ? { paused: video.paused, ready: video.readyState } : null,
        };
      }),
    };
  });

/** Scroll so card i is pinned at stackPosition and the next one is still below. */
async function pinCard(page, i) {
  const target = await page.evaluate((index) => {
    const top = document.getElementById('work').getBoundingClientRect().top + scrollY;
    const cards = [...document.querySelectorAll('#work .sw-card')];
    let y = top + index * 680;
    for (let step = 0; step < 400; step += 1) {
      window.scrollTo({ top: y, behavior: 'instant' });
      const t = cards[index].getBoundingClientRect().top;
      const nextTop = cards[index + 1]?.getBoundingClientRect().top ?? 9999;
      const phone = window.innerWidth <= 639;
      const pinnedTop =
        window.innerHeight * (phone ? 0.1 : 0.14) + index * (phone ? 8 : 24);
      if (t <= pinnedTop + 2 && nextTop >= window.innerHeight * 0.7) return y;
      y += 12;
    }
    return window.scrollY;
  }, i);
  await sleep(700);
  return target;
}

for (const [w, h] of VIEWPORTS) {
  const context = await browser.newContext({ viewport: { width: w, height: h } });
  await context.addInitScript(() => {
    try {
      sessionStorage.setItem('dd-visited', '1');
    } catch {
      /* ignore */
    }
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const y = document.getElementById('work').getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: y, behavior: 'instant' });
  });
  await sleep(900);

  const shot = await snapshot(page);
  if (shot.cards.length !== 5) fail(`${w}: ${shot.cards.length} cards, expected 5`);
  if (shot.overflow > 0) fail(`${w}: horizontal overflow ${shot.overflow}px`);
  // Desktop and phone pin the deck; 640–1023 keeps the plain list.
  const desktopStack = w >= 1024;
  const phoneStack = w <= 639;
  const stacked = desktopStack || phoneStack;
  if (shot.stack !== stacked) fail(`${w}: stack present=${shot.stack}, expected ${stacked}`);

  for (const card of shot.cards) {
    if (card.left < -1 || card.right > w + 1) fail(`${w}: card ${card.i} outside viewport (${card.left}–${card.right})`);
    if (!card.titleFits) fail(`${w}: card ${card.i} title escapes the copy column`);
    if (!card.href) fail(`${w}: card ${card.i} has no project link`);
    if (card.images === 0) fail(`${w}: card ${card.i} has no media`);
    if (card.broken > 0) fail(`${w}: card ${card.i} has ${card.broken} broken image(s)`);
    const words = card.line.split(/\s+/).filter(Boolean).length;
    if (words < 7 || words > 20) fail(`${w}: card ${card.i} line is ${words} words`);
    if (desktopStack) {
      const ratio = card.media.width / card.width;
      if (ratio < 0.54 || ratio > 0.66) fail(`${w}: card ${card.i} media ratio ${ratio.toFixed(2)}`);
      if (card.height > h + 1) fail(`${w}: card ${card.i} is ${card.height}px tall, viewport ${h}`);
    } else if (phoneStack) {
      // One bounded card: media on top, copy below, nothing taller than the screen.
      if (card.body.top < card.media.bottom - 2) fail(`${w}: card ${card.i} copy overlaps its media`);
      if (card.media.width < card.width - 4) fail(`${w}: card ${card.i} media does not span the card`);
      if (card.height > h + 1) fail(`${w}: card ${card.i} is ${card.height}px tall, viewport ${h}`);
    } else {
      if (card.body.top < card.media.bottom - 2) fail(`${w}: card ${card.i} copy overlaps its media`);
      if (card.media.width < card.width - 4) fail(`${w}: card ${card.i} media does not span the card`);
    }
  }

  if (stacked) {
    // Sticky: the pinned card keeps its top while the page moves under it.
    for (const [index, name] of [[0, 'first'], [2, 'middle'], [4, 'last']]) {
      await pinCard(page, index);
      const before = await page.evaluate(() => {
        const cards = [...document.querySelectorAll('#work .sw-card')];
        return { y: window.scrollY, top: Math.round(cards[0].getBoundingClientRect().top) };
      });
      await page.evaluate(() => window.scrollBy({ top: 60, behavior: 'instant' }));
      await sleep(250);
      const state = await page.evaluate(() => ({
        active: [...document.querySelectorAll('#work .sw-card')].map((c) => c.dataset.active),
        videos: [...document.querySelectorAll('#work video')].map((v) => v.paused),
      }));
      const topAfter = await page.evaluate(() => {
        const cards = [...document.querySelectorAll('#work .sw-card')];
        return Math.round(cards[0].getBoundingClientRect().top);
      });
      if (index === 0 && topAfter !== before.top) fail(`${w}: first card is not sticky (${before.top} → ${topAfter})`);
      const playing = state.videos.filter((p) => p === false).length;
      if (playing > 1) fail(`${w}: ${playing} videos playing at once`);
      await page.evaluate(() => window.scrollBy({ top: -60, behavior: 'instant' }));
      await page.screenshot({ path: path.join(FRAMES, `stack-${name}-${w}.jpg`) });
    }

    // The cut film must play when its card is front and pause once it is not.
    await pinCard(page, 1);
    const cutPlaying = await page
      .waitForFunction(
        () => {
          const v = document.querySelectorAll('#work video')[1];
          return v ? !v.paused : false;
        },
        null,
        { timeout: 4000 }
      )
      .then(() => true)
      .catch(() => false);
    if (!cutPlaying) fail(`${w}: Cut to the Beat preview is not playing while front`);
    await page.screenshot({ path: path.join(FRAMES, `stack-cut-${w}.jpg`) });
    await pinCard(page, 2);
    const cutPaused = await page
      .waitForFunction(
        () => {
          const v = document.querySelectorAll('#work video')[1];
          return v ? v.paused : false;
        },
        null,
        { timeout: 3000 }
      )
      .then(() => true)
      .catch(() => false);
    if (!cutPaused) fail(`${w}: Cut to the Beat preview kept playing once covered`);
  } else {
    await page.screenshot({ path: path.join(FRAMES, `stack-mobile-${w}.jpg`), fullPage: false });
    await page.evaluate(() => window.scrollBy({ top: 320, behavior: 'instant' }));
    await sleep(300);
    const moved = await page.evaluate(() => {
      const c = document.querySelector('#work .sw-card');
      return c ? Math.round(c.getBoundingClientRect().top) : 0;
    });
    if (moved === 0) fail(`${w}: static card did not move with native scroll`);
  }

  if (errors.length) fail(`${w}: console/page errors — ${errors.slice(0, 2).join(' | ')}`);
  const videosNow = await page.evaluate(() => [...document.querySelectorAll('#work video')].map((v) => v.paused));
  if (videosNow.some((paused) => paused === false) && !stacked) {
    // Static layout only plays after an explicit tap, never on its own.
    fail(`${w}: a preview autoplayed in the static layout`);
  }

  console.log(
    `${w}x${h} · cards=${shot.cards.length} stack=${shot.stack} overflow=${shot.overflow} section=${shot.sectionHeight}px titles=${shot.cards[0].titleSize}px`
  );
  await context.close();
}

// Lenis is the only scroll controller: it exists, and one wheel gesture moves
// the window without the section creating its own scroller.
const lenisCheck = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await lenisCheck.addInitScript(() => {
  try {
    sessionStorage.setItem('dd-visited', '1');
  } catch {
    /* ignore */
  }
});
const lenisPage = await lenisCheck.newPage();
await lenisPage.goto(BASE, { waitUntil: 'networkidle' });
await lenisPage.evaluate(() => {
  const y = document.getElementById('work').getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: y, behavior: 'instant' });
});
await sleep(500);
const lenisState = await lenisPage.evaluate(() => ({
  lenis: Boolean(window.__lenis),
  contained: Boolean(document.querySelector('.scroll-stack--contained')),
  nested: [...document.querySelectorAll('#work *')].filter((el) => {
    const s = getComputedStyle(el);
    return (
      (s.overflowY === 'auto' || s.overflowY === 'scroll') &&
      el.scrollHeight > el.clientHeight + 2 &&
      el.clientHeight > 40
    );
  }).length,
}));
if (!lenisState.lenis) fail('Lenis is not running on the preview');
if (lenisState.contained) fail('ScrollStack is running a contained scroller');
if (lenisState.nested > 0) fail(`${lenisState.nested} nested scroll containers inside Selected Work`);
const yBefore = await lenisPage.evaluate(() => window.scrollY);
await lenisPage.mouse.move(720, 620);
await lenisPage.mouse.wheel(0, 420);
await sleep(220);
const yMid = await lenisPage.evaluate(() => window.scrollY);
await sleep(700);
const yAfter = await lenisPage.evaluate(() => window.scrollY);
if (yMid <= yBefore) fail(`Lenis: wheel did not move the page (${yBefore} → ${yMid})`);
if (yAfter < yMid) fail('Lenis: page scrolled backwards after the wheel settled');
await lenisCheck.close();

// Reduced motion: the same five cards, no pinning.
const rm = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
await rm.addInitScript(() => {
  try {
    sessionStorage.setItem('dd-visited', '1');
  } catch {
    /* ignore */
  }
});
const rmPage = await rm.newPage();
await rmPage.goto(BASE, { waitUntil: 'networkidle' });
await rmPage.evaluate(() => {
  const y = document.getElementById('work').getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: y, behavior: 'instant' });
});
await sleep(500);
const rmState = await rmPage.evaluate(() => ({
  stack: Boolean(document.querySelector('#work .scroll-stack')),
  cards: document.querySelectorAll('#work .sw-card').length,
  staticCards: document.querySelectorAll('#work .sw-card--static').length,
  overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
}));
if (rmState.stack) fail('reduced motion: scroll stack still active');
if (rmState.cards !== 5 || rmState.staticCards !== 5) fail(`reduced motion: ${rmState.cards} cards (${rmState.staticCards} static)`);
if (rmState.overflow > 0) fail(`reduced motion: horizontal overflow ${rmState.overflow}px`);
await rmPage.screenshot({ path: path.join(FRAMES, 'stack-reduced-1440.jpg') });
await rm.close();

// One real navigation through a card link.
const nav = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await nav.addInitScript(() => {
  try {
    sessionStorage.setItem('dd-visited', '1');
  } catch {
    /* ignore */
  }
});
const navPage = await nav.newPage();
await navPage.goto(BASE, { waitUntil: 'networkidle' });
await navPage.evaluate(() => {
  const y = document.getElementById('work').getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: y, behavior: 'instant' });
});
await sleep(400);
const href = await navPage.evaluate(() => document.querySelector('#work .sw-card a[href^="/work/"]')?.getAttribute('href') ?? null);
if (!href) fail('navigation: no card link found');
else {
  await navPage.evaluate((h) => window.location.assign(h), href);
  await navPage.waitForURL(`**${href}`, { timeout: 8000 }).catch(() => {});
  if (!navPage.url().endsWith(href)) fail(`navigation: ${href} did not open (${navPage.url()})`);
  const h1 = await navPage.locator('h1').first().textContent().catch(() => null);
  if (!h1) fail(`navigation: ${href} rendered no heading`);
}
await nav.close();

await browser.close();

if (failures.length) {
  console.log(`\n${failures.length} FAILURES`);
  for (const f of failures) console.log(`  - ${f}`);
  process.exit(1);
}
console.log('\nSELECTED WORK STACK CLEAN');
