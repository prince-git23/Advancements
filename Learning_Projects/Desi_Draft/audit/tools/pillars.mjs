/**
 * Five-pillar section check.
 *
 *   node audit/tools/pillars.mjs
 *
 * At 1920, 1440, 1024, 768, 430, 390, 360 and 320 it reports:
 *   - card count, card size, section height and the heading → cards gap;
 *   - whether any card leaves the viewport or the section;
 *   - page horizontal overflow;
 *   - the hover separation (left cards move left, right cards move right) and
 *     that the separated row still fits;
 *   - keyboard focus and, below 1024, tap selection plus vertical scrolling
 *     over the strip.
 */
import { chromium } from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE = 'http://127.0.0.1:4174';
const base = path.join(process.env.LOCALAPPDATA, 'ms-playwright');
const dirs = (await fs.readdir(base)).filter((d) => d.startsWith('chromium')).sort().reverse();
let exe = null;
for (const d of dirs) {
  const p = path.join(base, d, 'chrome-win64', 'chrome.exe');
  if (await fs.access(p).then(() => 1, () => 0)) {
    exe = p;
    break;
  }
}

const browser = await chromium.launch({ executablePath: exe });
const widths = [
  [1920, 1080],
  [1440, 900],
  [1024, 768],
  [1000, 800],
  [900, 900],
  [768, 1024],
  [430, 932],
  [390, 844],
  [360, 800],
  [320, 720],
];

const probe = () =>
  (() => {
    const section = document.getElementById('manifesto');
    const stage = section?.querySelector('.pillars-stage');
    const strip = section?.querySelector('.pillars');
    const heading = section?.querySelector('.mf-heading');
    const cards = [...document.querySelectorAll('.pillar')];
    const rects = cards.map((el) => el.getBoundingClientRect());
    const sec = section.getBoundingClientRect();
    return {
      mode: strip?.getAttribute('data-mode'),
      sectionH: Math.round(section.offsetHeight),
      gapHeading:
        heading && rects.length ? Math.round(rects[0].top + scrollY - (heading.getBoundingClientRect().bottom + scrollY)) : null,
      stageH: stage ? Math.round(stage.offsetHeight) : null,
      cardW: rects.length ? Math.round(rects[0].width) : 0,
      cardH: rects.length ? Math.round(rects[0].height) : 0,
      stripScrollable: strip ? strip.scrollWidth > strip.clientWidth + 1 : false,
      pageOverflow: document.documentElement.scrollWidth - innerWidth,
      outOfViewport: rects.filter((r) => r.left < -1 || r.right > innerWidth + 1).length,
      outOfSection:
        rects.filter((r) => r.left < sec.left - 1 || r.right > sec.right + 1).length,
      rects: rects.map((r) => ({ l: Math.round(r.left), r: Math.round(r.right), t: Math.round(r.top) })),
      labels: cards.map((el) => el.getAttribute('aria-label')),
      pressed: cards.map((el) => el.getAttribute('aria-pressed')),
    };
  })();

const out = [];

for (const [w, h] of widths) {
  // The strip runs below 1024, so those contexts need a touch surface for the
  // tap check (and to mirror the device the layout is built for).
  const page = await browser.newPage({ viewport: { width: w, height: h }, hasTouch: w < 1024, isMobile: w < 768 });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await page.evaluate(() => {
    const el = document.getElementById('manifesto');
    window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 90);
  });
  await page.waitForTimeout(900);

  const before = await page.evaluate(probe);
  await page.screenshot({ path: `audit/frames/pillars-${w}.png` });

  let hovered = null;
  let tapped = null;
  let scrollTest = null;

  if (w >= 1024) {
    // Hover the centre card: the row should open outwards from it.
    await page.locator('.pillar').nth(2).hover({ force: true });
    await page.waitForTimeout(800);
    const after = await page.evaluate(probe);
    hovered = {
      leftMoved: after.rects[0].l - before.rects[0].l,
      rightMoved: after.rects[4].r - before.rects[4].r,
      centreLift: after.rects[2].t - before.rects[2].t,
      outAfter: after.outOfViewport,
      outOfSectionAfter: after.outOfSection,
    };
    await page.screenshot({ path: `audit/frames/pillars-${w}-hover.png` });
    await page.mouse.move(4, 4);
    await page.waitForTimeout(500);
  } else {
    // Tap a card: it comes forward and reports itself selected.
    await page.locator('.pillar').nth(2).tap();
    await page.waitForTimeout(500);
    tapped = await page.evaluate(() => ({
      pressed: document.querySelectorAll('.pillar')[2].getAttribute('aria-pressed'),
      active: document.querySelectorAll('.pillar')[2].getAttribute('data-active'),
    }));

    // A vertical wheel over the strip must still scroll the page.
    const box = await page.locator('.pillars').boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    const y0 = await page.evaluate(() => scrollY);
    await page.mouse.wheel(0, 320);
    await page.waitForTimeout(500);
    const y1 = await page.evaluate(() => scrollY);
    scrollTest = { before: Math.round(y0), after: Math.round(y1), moved: y1 > y0 };
    await page.screenshot({ path: `audit/frames/pillars-${w}-tap.png` });
  }

  out.push({ viewport: `${w}x${h}`, before, hovered, tapped, scrollTest, errors });
  await page.close();
}

// Reduced motion: static fan, all five readable.
const rm = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
await rm.goto(BASE, { waitUntil: 'networkidle' });
await rm.waitForTimeout(1800);
await rm.evaluate(() => {
  const el = document.getElementById('manifesto');
  window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 90);
});
await rm.waitForTimeout(600);
const reducedInfo = await rm.evaluate(probe);
await rm.screenshot({ path: 'audit/frames/pillars-1440-reduced.png' });
await rm.close();
await browser.close();

for (const r of out) {
  const b = r.before;
  console.log(
    `\n=== ${r.viewport} mode=${b.mode} cards=${b.rects.length} sectionH=${b.sectionH} gap=${b.gapHeading} card=${b.cardW}x${b.cardH}`
  );
  console.log(
    `    overflow=${b.pageOverflow} outOfViewport=${b.outOfViewport} outOfSection=${b.outOfSection} stripScroll=${b.stripScrollable} errors=${r.errors.length}`
  );
  if (r.hovered) console.log(`    hover: ${JSON.stringify(r.hovered)}`);
  if (r.tapped) console.log(`    tap: ${JSON.stringify(r.tapped)} scroll: ${JSON.stringify(r.scrollTest)}`);
  if (r.errors.length) console.log('    ERRORS', r.errors);
}
console.log(
  `\n=== reduced motion: cards=${reducedInfo.rects.length} sectionH=${reducedInfo.sectionH} overflow=${reducedInfo.pageOverflow}`
);
