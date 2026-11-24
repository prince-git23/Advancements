/**
 * Testimonials verification.
 *
 *   node audit/tools/testimonials.mjs      (built preview on 127.0.0.1:4174)
 *
 * Public page:
 *   - the section exists between Team and Footer with all nine approved cards,
 *     portraits load, no draft/pending copy, no horizontal overflow.
 * At seven widths:
 *   - the section holds its share of the viewport, columns match the tier,
 *     quote/name/avatar sizes clear the published scale, long quotes do not clip
 *   - columns scroll smoothly, pause on hover, and stay within a sane speed
 *   - reduced motion renders a static grid without a marquee
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const here = path.dirname(fileURLToPath(import.meta.url));
const FRAMES = path.join(here, '..', 'frames');
const BASE = process.env.DD_URL || 'http://127.0.0.1:4174/';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const failures = [];
const fail = (m) => failures.push(m);

async function resolveChromium() {
  const fs = await import('node:fs/promises');
  const base = path.join(process.env.LOCALAPPDATA || process.env.HOME || '', 'ms-playwright');
  const entries = await fs.readdir(base).catch(() => []);
  const dirs = entries.filter((d) => d.startsWith('chromium-')).sort().reverse();
  for (const d of dirs) {
    for (const sub of ['chrome-win64', 'chrome-win', 'chrome-linux64', 'chrome-linux']) {
      for (const bin of ['chrome.exe', 'chrome']) {
        const p = path.join(base, d, sub, bin);
        if (await fs.access(p).then(() => true, () => false)) return p;
      }
    }
  }
  return null;
}

const executablePath = await resolveChromium();
const browser = await chromium.launch({ executablePath });
const seed = async (context) =>
  context.addInitScript(() => {
    try {
      sessionStorage.setItem('dd-visited', '1');
    } catch {
      /* ignore */
    }
  });

/* ---------------------------------------------------------------- public */

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await seed(context);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const state = await page.evaluate(() => {
    const text = document.body.innerText;
    const section = document.getElementById('testimonials');
    const cards = section ? [...section.querySelectorAll('.kt-card')] : [];
    const imgs = section ? [...section.querySelectorAll('.kt-avatar img')] : [];
    return {
      section: Boolean(section),
      draftWord: /pending approval|layout preview|not a published testimonial/i.test(text),
      // The marquee repeats records to fill each column, so the public check
      // counts distinct people, not DOM nodes.
      cardCount: new Set(cards.map((c) => c.querySelector('.kt-name')?.textContent?.trim())).size,
      names: ['Siddhant Parshivnikar', 'Shifa Joe', 'Vidhi Saratkar', 'Abhishek Rahangdale'].filter((n) =>
        text.includes(n)
      ),
      testimonialImages: new Set(imgs.map((img) => img.getAttribute('src'))).size,
      loaded: imgs.filter((img) => img.complete && img.naturalWidth > 0).length,
      imageCount: imgs.length,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  if (!state.section) fail('public page has no testimonials section');
  if (state.draftWord) fail('public page exposes draft/pending copy');
  if (state.cardCount !== 9) fail(`public page renders ${state.cardCount} cards, expected 9`);
  if (state.names.length !== 4) fail(`public page is missing names: ${state.names.join(', ')}`);
  if (state.testimonialImages !== 9) fail(`public page loads ${state.testimonialImages} portraits, expected 9`);
  if (state.loaded !== state.imageCount) fail('a public portrait failed to load');
  if (state.overflow > 0) fail(`public page horizontal overflow ${state.overflow}px`);
  if (errors.length) fail(`public page errors: ${errors.slice(0, 2).join(' | ')}`);
  console.log(
    `public · section=${state.section} cards=${state.cardCount} names=${state.names.length} images=${state.loaded}/${state.testimonialImages}`
  );
  await context.close();
}

/* ------------------------------------------------------- published section */

for (const [w, h] of [
  [1920, 1080],
  [1440, 900],
  [1024, 768],
  [768, 1024],
  [430, 932],
  [390, 844],
  [360, 800],
]) {
  const context = await browser.newContext({ viewport: { width: w, height: h } });
  await seed(context);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const el = document.getElementById('testimonials');
    el?.scrollIntoView({ block: 'start' });
  });
  await sleep(900);

  const state = await page.evaluate(() => {
    const section = document.getElementById('testimonials');
    const cards = [...section.querySelectorAll('.kt-card')];
    const tracks = [...section.querySelectorAll('.kt-track')];
    const footer = document.querySelector('footer');
    const rect = (el) => el.getBoundingClientRect();
    const marquee = section.querySelector('.kt-marquee');
    const mRect = marquee ? rect(marquee) : null;
    const visibleCards = mRect
      ? cards.filter((c) => {
          const r = rect(c);
          return r.bottom > mRect.top && r.top < mRect.bottom;
        })
      : cards;
    const avatars = visibleCards.map((c) => c.querySelector('.kt-avatar img')).filter(Boolean);
    return {
      section: Boolean(section),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      columns: section.querySelectorAll('.kt-col').length,
      uniqueCards: cards.filter((c) => c.getAttribute('aria-hidden') !== 'true').length,
      cards: cards.length,
      trackHeights: tracks.map((t) => Math.round(rect(t).height)),
      colHeights: [...section.querySelectorAll('.kt-col')].map((c) => Math.round(rect(c).height)),
      images: avatars.map((img) => (img ? img.complete && img.naturalWidth > 0 : false)),
      footer: footer ? { top: Math.round(rect(footer).top), bg: getComputedStyle(footer.firstElementChild ?? footer).backgroundColor } : null,
      sectionBottom: section ? Math.round(rect(section).bottom) : null,
      details: cards.slice(0, 3).map((c) => ({
        h: Math.round(rect(c).height),
        review: Math.round(rect(c.querySelector('.kt-review')).height),
        name: c.querySelector('.kt-name')?.textContent,
      })),
      metrics: (() => {
        const card = cards[0];
        const quote = card?.querySelector('.kt-review');
        const name = card?.querySelector('.kt-name');
        const avatar = card?.querySelector('.kt-avatar');
        const shell = section.querySelector('.kt-shell');
        return {
          quote: parseFloat(getComputedStyle(quote).fontSize),
          name: parseFloat(getComputedStyle(name).fontSize),
          avatar: Math.round(rect(avatar).width),
          share: shell ? rect(shell).width / window.innerWidth : 0,
        };
      })(),
      scrollable: [...section.querySelectorAll('*')].filter((el) => {
        const s = getComputedStyle(el);
        return (s.overflowY === 'auto' || s.overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 2;
      }).length,
    };
  });

  if (!state.section) fail(`${w}: published section is missing`);
  if (state.overflow > 0) fail(`${w}: horizontal overflow ${state.overflow}px`);
  if (state.uniqueCards < 9) fail(`${w}: ${state.uniqueCards} accessible cards, expected 9`);
  if (state.columns < 1) fail(`${w}: no marquee columns`);
  if (state.scrollable > 0) fail(`${w}: section contains ${state.scrollable} nested scrollers`);
  if (state.images.some((ok) => !ok)) fail(`${w}: portrait failed to load (${state.images.filter((x) => !x).length})`);
  if (w >= 1024 && state.columns !== 3) fail(`${w}: ${state.columns} columns, expected 3`);
  if (w >= 640 && w < 1024 && state.columns !== 2) fail(`${w}: ${state.columns} columns, expected 2`);
  if (w < 640 && state.columns !== 1) fail(`${w}: ${state.columns} columns, expected 1`);
  // Larger cards are the point of this pass: real padding, real type.
  if (state.details.some((d) => d.h < 176)) fail(`${w}: a card is only ${Math.min(...state.details.map((d) => d.h))}px tall`);
  if (state.metrics.quote < (w < 640 ? 17 : 18.5)) fail(`${w}: quote type is ${state.metrics.quote}px`);
  if (state.metrics.name < (w < 640 ? 17 : 18)) fail(`${w}: reviewer name is ${state.metrics.name}px`);
  if (state.metrics.avatar < (w < 640 ? 44 : 50)) fail(`${w}: avatar is ${state.metrics.avatar}px`);
  // 92% of the viewport, capped at the 1600px measure.
  // Phone: 20px gutters. Tablet/laptop: 92–94% of the viewport, capped at 1600px.
  const expectedShare = w < 640 ? 1 - 48 / w : Math.min(0.92, 1600 / w);
  if (state.metrics.share < expectedShare - 0.02) {
    fail(
      `${w}: content uses ${(state.metrics.share * 100).toFixed(0)}% of the viewport, expected ~${(expectedShare * 100).toFixed(0)}%`
    );
  }
  if (state.colHeights.some((hh) => hh < 400)) fail(`${w}: a column is only ${Math.min(...state.colHeights)}px tall`);
  if (state.trackHeights.some((t) => t < state.colHeights[0] * 2)) fail(`${w}: a track is too short for a seamless loop`);
  if (state.footer && state.sectionBottom !== null) {
    const gap = state.footer.top - state.sectionBottom;
    if (gap > 4 || gap < -4) fail(`${w}: footer starts ${gap}px from the section`);
  }

  await page.screenshot({ path: path.join(FRAMES, `testimonials-${w}.jpg`) });

  if (w >= 768) {
    // Motion: the first track moves at a restrained, steady pace.
    const sample = () =>
      page.evaluate(() => {
        const t = document.querySelector('#testimonials .kt-track');
        return new DOMMatrixReadOnly(getComputedStyle(t).transform).m42;
      });
    const a = await sample();
    await sleep(1000);
    const b = await sample();
    const pxPerSecond = Math.abs(b - a);
    if (pxPerSecond < 8) fail(`${w}: marquee barely moves (${pxPerSecond.toFixed(1)}px/s)`);
    if (pxPerSecond > 60) fail(`${w}: marquee is too fast (${pxPerSecond.toFixed(1)}px/s)`);

    // Hover pauses; moving off resumes.
    const box = await page.locator('#testimonials .kt-marquee').boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await sleep(450);
    const pausedA = await sample();
    await sleep(700);
    const pausedB = await sample();
    if (Math.abs(pausedB - pausedA) > 0.6) fail(`${w}: hover did not pause the marquee`);
    await page.mouse.move(10, 10);
    await sleep(700);
    const resumed = await sample();
    if (Math.abs(resumed - pausedB) < 0.6) fail(`${w}: marquee did not resume after hover`);
  }

  // Long quotation: the card must grow, not clip or widen the page.
  const longResult = await page.evaluate(() => {
    const card = document.querySelector('#testimonials .kt-card');
    const quote = card.querySelector('.kt-review');
    const before = card.getBoundingClientRect().height;
    quote.textContent =
      'Working with the studio meant a full content system, not a one-off edit: twelve posts, four reels, a grid plan, and a voice we could keep using after the project closed. The handover was documented, the files were organised, and every claim in the film was checked before it went out. '.repeat(3);
    const after = card.getBoundingClientRect().height;
    const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    const clipped = quote.scrollHeight > quote.clientHeight + 2;
    return { before, after, overflow, clipped };
  });
  if (longResult.after <= longResult.before) fail(`${w}: long quote did not grow the card`);
  if (longResult.overflow > 0) fail(`${w}: long quote caused ${longResult.overflow}px overflow`);
  if (longResult.clipped) fail(`${w}: long quote is clipped`);
  await page.screenshot({ path: path.join(FRAMES, `testimonials-long-${w}.jpg`) });

  if (errors.length) fail(`${w}: console errors — ${errors.slice(0, 2).join(' | ')}`);
  console.log(
    `${w}x${h} · cols=${state.columns} cards=${state.cards} (${state.uniqueCards} unique) overflow=${state.overflow} images=${state.images.filter(Boolean).length}/${state.images.length} footerGap=${state.footer ? state.footer.top - state.sectionBottom : '?'}`
  );
  await context.close();
}

/* --------------------------------------------------------- reduced motion */

{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  await seed(context);
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.getElementById('testimonials')?.scrollIntoView({ block: 'start' }));
  await sleep(400);
  const state = await page.evaluate(() => ({
    marquee: Boolean(document.querySelector('#testimonials .kt-marquee')),
    grid: Boolean(document.querySelector('#testimonials .kt-static')),
    cards: document.querySelectorAll('#testimonials .kt-card').length,
    animated: [...document.querySelectorAll('#testimonials .kt-track')].length,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }));
  if (state.marquee || state.animated) fail('reduced motion: marquee still rendered');
  if (!state.grid) fail('reduced motion: no static grid');
  if (state.cards !== 9) fail(`reduced motion: ${state.cards} cards, expected 9`);
  if (state.overflow > 0) fail(`reduced motion: overflow ${state.overflow}px`);
  await page.screenshot({ path: path.join(FRAMES, 'testimonials-reduced-1440.jpg') });
  await context.close();
}

await browser.close();

if (failures.length) {
  console.log(`\n${failures.length} FAILURES`);
  for (const f of failures) console.log(`  - ${f}`);
  process.exit(1);
}
console.log('\nTESTIMONIALS CLEAN');
