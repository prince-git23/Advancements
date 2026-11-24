/**
 * Studio-studies audit: the three enriched case studies plus the services
 * accordion's hover, tap and keyboard behaviour.
 *
 *   node audit/tools/studies.mjs
 *
 * For every route × width: horizontal overflow, heading clipping, image load
 * state after a full scroll. Screenshots at 1440 / 768 / 390 go to
 * audit/frames/. Read-only against the running preview.
 */
import { chromium } from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE = process.env.DD_URL || 'http://127.0.0.1:4174';
const OUT = path.join(process.cwd(), '..', 'frames');

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

const ROUTES = [
  { route: '/work/always-on', name: 'always-on' },
  { route: '/work/hook-turn-payoff', name: 'hook-turn-payoff' },
  { route: '/work/studio-identity', name: 'studio-identity' },
];
const WIDTHS = [
  [1440, 900],
  [1280, 800],
  [1024, 768],
  [768, 1024],
  [430, 932],
  [390, 844],
  [360, 780],
];
const SHOT_AT = new Set([1440, 768, 390]);

await fs.mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: exe });
let failures = 0;
const fail = (msg) => {
  failures += 1;
  console.log(`FAIL  ${msg}`);
};
const ok = (msg) => console.log(`ok    ${msg}`);

/** Scrolls the whole page so lazy images below the fold actually load. */
async function settle(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0;
      const step = Math.round(window.innerHeight * 0.8);
      const tick = () => {
        y += step;
        window.scrollTo(0, y);
        if (y < document.body.scrollHeight) setTimeout(tick, 120);
        else {
          window.scrollTo(0, 0);
          setTimeout(resolve, 500);
        }
      };
      tick();
    });
  });
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(350);
}

for (const { route, name } of ROUTES) {
  for (const [width, height] of WIDTHS) {
    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: width < 700 ? 2 : 1,
      isMobile: width < 700,
      hasTouch: width < 700,
    });
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(e.message));

    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
    await settle(page);

    const metrics = await page.evaluate(() => {
      const doc = document.documentElement;
      const headings = [...document.querySelectorAll('h1, h2, h3')]
        .filter((el) => el.scrollWidth > el.clientWidth + 1)
        .map((el) => el.textContent?.trim().slice(0, 48));
      const images = [...document.images];
      const broken = images
        .filter((img) => img.currentSrc && !(img.complete && img.naturalWidth > 0))
        .map((img) => img.currentSrc.replace(location.origin, ''));
      return {
        overflow: Math.max(0, doc.scrollWidth - doc.clientWidth),
        headings,
        images: images.length,
        broken,
      };
    });

    const label = `${name} @${width}`;
    if (metrics.overflow > 1) fail(`${label} horizontal overflow ${metrics.overflow}px`);
    if (metrics.headings.length) fail(`${label} clipped headings: ${metrics.headings.join(' | ')}`);
    if (metrics.broken.length) fail(`${label} broken images: ${metrics.broken.join(', ')}`);
    if (errors.length) fail(`${label} console: ${errors[0]}`);
    if (!metrics.overflow && !metrics.headings.length && !metrics.broken.length && !errors.length) {
      ok(`${label} overflow 0 · ${metrics.images} images loaded · no console errors`);
    }

    if (SHOT_AT.has(width)) {
      await page.screenshot({ path: path.join(OUT, `case-${name}-${width}.png`), fullPage: true });
    }
    await page.close();
  }
}

/* ---- accordion: hover on desktop, tap on a phone, keyboard everywhere ---- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.locator('#services').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const panels = page.locator('.svc-acc__panel');
  const expands = async (i) => panels.nth(i).locator('.svc-acc__button').getAttribute('aria-expanded');

  await panels.nth(2).hover();
  await page.waitForTimeout(900);
  if ((await expands(2)) !== 'true') fail('accordion: hovering panel 3 did not open it');
  else ok('accordion: hover opens a panel at 1440');

  await panels.nth(4).hover();
  await page.waitForTimeout(900);
  if ((await expands(4)) !== 'true' || (await expands(2)) !== 'false') {
    fail('accordion: moving the pointer did not transfer the open panel');
  } else ok('accordion: hover transfers the open panel without a click');

  await panels.nth(1).locator('.svc-acc__button').focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(800);
  if ((await expands(1)) !== 'true') fail('accordion: Enter on a focused spine did not open it');
  else ok('accordion: keyboard Enter opens a panel');

  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(700);
  const focused = await page.evaluate(() => document.activeElement?.textContent?.trim().slice(0, 24));
  if ((await expands(2)) !== 'true') fail(`accordion: ArrowRight did not move focus (${focused})`);
  else ok(`accordion: ArrowRight moves focus to the next spine (${focused})`);

  const styles = await page.evaluate(() => {
    const panel = document.querySelectorAll('.svc-acc__panel')[2];
    const title = panel?.querySelector('.svc-acc__title');
    return {
      grow: panel ? getComputedStyle(panel).flexGrow : '',
      titleWritten: title ? getComputedStyle(title).writingMode : '',
      titleWidth: title ? title.getBoundingClientRect().width : 0,
    };
  });
  if (Number(styles.grow) < 2) fail(`accordion: open panel flex-grow is ${styles.grow}`);
  else ok(`accordion: open panel grows to ${styles.grow}`);
  await page.screenshot({ path: path.join(OUT, 'case-services-hover-1440.png'), fullPage: false });
  await page.close();
}

{
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.locator('#services').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const button = page.locator('.svc-acc__panel').nth(3).locator('.svc-acc__button');
  await button.tap();
  await page.waitForTimeout(800);
  const expanded = await button.getAttribute('aria-expanded');
  const orientation = await page.evaluate(() => getComputedStyle(document.querySelector('.svc-acc')).flexDirection);
  if (expanded !== 'true') fail('accordion: tap did not open a panel at 390');
  else ok('accordion: tap opens a panel at 390');
  if (orientation !== 'column') fail(`accordion: mobile orientation is ${orientation}`);
  else ok('accordion: mobile stays a vertical list');
  await page.locator('#services').screenshot({ path: path.join(OUT, 'case-services-tap-390.png') });
  await page.close();
}

await browser.close();
console.log(failures === 0 ? '\nALL STUDY CHECKS PASSED' : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
