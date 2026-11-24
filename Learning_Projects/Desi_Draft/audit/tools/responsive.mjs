/**
 * Full-site responsive sweep.
 *
 *   node audit/tools/responsive.mjs
 *
 * For every route × width: horizontal overflow, elements escaping the viewport,
 * clipped headings, broken images, and footer geometry. Read-only; screenshots
 * of failures land in audit/frames/resp-*.jpg.
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
  { route: '/', name: 'home' },
  { route: '/work', name: 'work' },
  { route: '/work/floral-alchemy', name: 'flora' },
  { route: '/work/desi-draft-dot-com', name: 'site' },
  { route: '/work/cut-to-the-beat', name: 'cut' },
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

await fs.mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: exe });
let failures = 0;

const fail = (msg, detail) => {
  failures += 1;
  console.log(`FAIL  ${msg}${detail ? ` — ${detail}` : ''}`);
};

async function settle(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0;
      const step = Math.round(window.innerHeight * 0.9);
      const tick = () => {
        y += step;
        window.scrollTo(0, y);
        if (y < document.body.scrollHeight) setTimeout(tick, 90);
        else {
          window.scrollTo(0, 0);
          // Lazy images inside a horizontal rail are never reached by a
          // vertical pass (the snap returns the rail before they load). Force
          // the fetch and decode here, so "broken" still means broken.
          document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
            img.loading = 'eager';
          });
          Promise.all(
            [...document.images].map((img) => (img.decode ? img.decode().catch(() => {}) : null))
          ).then(() => setTimeout(resolve, 300));
        }
      };
      tick();
    });
  });
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(300);
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

    const result = await page.evaluate(() => {
      const doc = document.documentElement;
      const cw = doc.clientWidth;
      const CHROME = ['img', 'button', 'a', 'p', 'h1', 'h2', 'h3', 'h4', 'li', 'table', 'figure', 'input', 'textarea'];
      // Content inside a deliberate scroll rail or a clipped stage is not a
      // responsive failure: the container is the scroller, not the page.
      const inScroller = (el) => {
        let p = el.parentElement;
        for (let i = 0; i < 5 && p; i += 1) {
          const ox = getComputedStyle(p).overflowX;
          if (ox === 'auto' || ox === 'scroll' || ox === 'hidden' || ox === 'clip') return true;
          p = p.parentElement;
        }
        return false;
      };
      const escapes = [];
      for (const el of document.querySelectorAll(CHROME.join(','))) {
        const rect = el.getBoundingClientRect();
        if (rect.width < 4 || rect.height < 4) continue;
        if (getComputedStyle(el).visibility === 'hidden') continue;
        if (el.closest('[aria-hidden="true"]') || String(el.className || '').includes('sr-only')) continue;
        if (inScroller(el)) continue;
        const overflowRight = rect.right - cw;
        const overflowLeft = -rect.left;
        if (overflowRight > 2 || overflowLeft > 2) {
          escapes.push({
            tag: el.tagName.toLowerCase(),
            cls: String(el.className || '').slice(0, 46),
            text: (el.textContent || '').trim().slice(0, 34),
            d: Math.round(overflowRight > overflowLeft ? overflowRight : overflowLeft),
          });
        }
      }
      const headings = [...document.querySelectorAll('h1, h2, h3')]
        .filter((el) => !String(el.className || '').includes('sr-only'))
        .filter((el) => getComputedStyle(el).clip !== 'rect(0px, 0px, 0px, 0px)')
        .filter((el) => el.scrollWidth > el.clientWidth + 1)
        .map((el) => (el.textContent || '').trim().slice(0, 42));
      const broken = [...document.images]
        .filter((img) => img.currentSrc && !(img.complete && img.naturalWidth > 0))
        .map((img) => img.currentSrc.replace(location.origin, ''));
      const footer = document.querySelector('footer #footer, footer');
      const fr = footer?.getBoundingClientRect();
      return {
        overflow: Math.max(0, doc.scrollWidth - cw),
        escapes: escapes.slice(0, 4),
        headingCount: headings.length,
        headings: headings.slice(0, 3),
        broken: broken.slice(0, 4),
        footer: fr ? { h: Math.round(fr.height), w: Math.round(fr.width) } : null,
      };
    });

    const label = `${name} @${width}`;
    const problems = [];
    if (result.overflow > 1) problems.push(`overflow ${result.overflow}px`);
    if (result.escapes.length)
      problems.push(
        `elements outside: ${result.escapes.map((e) => `${e.tag}.${e.cls}(${e.d}px)`).join(' | ')}`
      );
    if (result.headingCount) problems.push(`clipped headings: ${result.headings.join(' / ')}`);
    if (result.broken.length) problems.push(`broken images: ${result.broken.join(', ')}`);
    if (errors.length) problems.push(`console: ${errors[0]}`);
    if (result.footer && result.footer.h > height * 1.5)
      problems.push(`footer is ${result.footer.h}px at ${height}px viewport`);

    if (problems.length) {
      fail(label, problems.join('; '));
      await page.screenshot({ path: path.join(OUT, `resp-${name}-${width}.jpg`), type: 'jpeg', quality: 70 });
    } else {
      console.log(`ok    ${label}`);
    }
    await page.close();
  }
}

await browser.close();
console.log(failures === 0 ? '\nRESPONSIVE SWEEP CLEAN' : `\n${failures} RESPONSIVE ISSUE(S)`);
process.exit(failures === 0 ? 0 : 1);
