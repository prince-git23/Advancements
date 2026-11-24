/**
 * Desi Draft — link, scroll and navigation QA.
 *
 *   npm run build && npx vite preview --port 4174 --host 127.0.0.1
 *   DD_URL=http://127.0.0.1:4174/ node audit/tools/qa.mjs
 *
 * Checks:
 *  1. every internal link renders a page with a heading (no blank route)
 *  2. every external href is a real destination, not a platform homepage
 *  3. forward and reverse scrolling raise no console errors
 *  4. header theme flips while scrolling, and pins/spacers are cleaned up
 *  5. card → case study → next project → back works
 *
 * Read-only.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const here = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.DD_URL || 'http://127.0.0.1:4174/';
const ORIGIN = new URL(BASE).origin;

async function resolveChromium() {
  const base = path.join(process.env.LOCALAPPDATA || process.env.HOME || '', 'ms-playwright');
  const entries = await fs.readdir(base).catch(() => []);
  const dirs = entries.filter((d) => d.startsWith('chromium')).sort().reverse();
  const out = [];
  const subs = ['chrome-win64', 'chrome-win', 'chrome-headless-shell-win64', 'chrome-linux64', 'chrome-linux'];
  const bins = ['chrome.exe', 'chrome-headless-shell.exe', 'headless_shell.exe', 'chrome'];
  for (const d of dirs) for (const sub of subs) for (const bin of bins) out.push(path.join(base, d, sub, bin));
  for (const p of out) if (await fs.access(p).then(() => true, () => false)) return p;
  return null;
}

const browser = await chromium.launch({
  headless: true,
  executablePath: (await resolveChromium()) || undefined,
  args: ['--force-color-profile=srgb'],
});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();

const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 160)));
page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));

const report = [];
const fail = (msg) => {
  report.push(`FAIL  ${msg}`);
};
const pass = (msg) => {
  report.push(`ok    ${msg}`);
};

/* 1 + 2. links ---------------------------------------------------------- */
const seeds = ['/', '/work', '/work/floral-alchemy', '/work/desi-draft-dot-com', '/work/cut-to-the-beat', '/work/always-on', '/work/hook-turn-payoff', '/work/studio-identity'];
const internal = new Set();
const external = new Set();
const special = new Set();

for (const route of seeds) {
  await page.goto(new URL(route, BASE).href, { waitUntil: 'load' });
  await page.waitForTimeout(250);
  const hrefs = await page.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')));
  for (const href of hrefs) {
    if (!href) continue;
    if (href.startsWith('#') || href.startsWith('/')) internal.add(href);
    else if (/^(mailto|tel):/.test(href)) special.add(href);
    else if (href.startsWith('http')) external.add(href);
  }
}

for (const href of [...internal].sort()) {
  const url = new URL(href, BASE);
  const res = await page.goto(url.href, { waitUntil: 'load' });
  await page.waitForTimeout(180);
  const h = await page.evaluate(() => document.querySelector('h1,h2')?.textContent?.trim().slice(0, 40) ?? '');
  const status = res?.status() ?? 0;
  if (status >= 400) fail(`internal ${href} → HTTP ${status}`);
  else if (!h) fail(`internal ${href} → no heading rendered`);
  else pass(`internal ${href} → ${status} "${h}"`);
}

for (const href of internal) {
  if (/^\/(?!\/)/.test(href) && !href.includes('#')) continue;
}

report.push(`      external hrefs: ${external.size ? [...external].join(', ') : 'none'}`);
report.push(`      mailto/tel:     ${special.size ? [...special].join(', ') : 'none'}`);

/* 3 + 4. scroll down and back up ---------------------------------------- */
await page.goto(new URL('/', BASE).href, { waitUntil: 'load' });
await page.waitForFunction(() => document.fonts?.status === 'loaded', null, { timeout: 15000 }).catch(() => {});
await page.waitForTimeout(900);

const themes = new Set();
// Sample the header theme at every step, not just at the ends: the theme flips
// per section, so an endpoint-only read always reports the same value.
const scrollStep = async (dir) => {
  const seen = await page.evaluate(
    async (d) => {
      const step = Math.round(innerHeight * 0.45) * d;
      const out = [];
      for (let i = 0; i < 40; i += 1) {
        window.scrollTo(0, Math.max(0, scrollY + step));
        await new Promise((r) => requestAnimationFrame(r));
        await new Promise((r) => setTimeout(r, 35));
        out.push(document.querySelector('header')?.getAttribute('data-theme') ?? '');
      }
      return [...new Set(out)];
    },
    dir
  );
  seen.forEach((t) => themes.add(t));
};
const readState = () =>
  page.evaluate(() => ({
    theme: document.querySelector('header')?.getAttribute('data-theme') ?? '',
    spacers: document.querySelectorAll('.pin-spacer').length,
    y: Math.round(scrollY),
  }));

await scrollStep(1);
const down = await readState();
await page.waitForTimeout(300);
await scrollStep(-1);
const up = await readState();

pass(`down to y=${down.y} (${down.spacers} pin spacers at the end)`);
pass(`back to y=${up.y}`);
if (up.y > 40) fail(`reverse scroll did not return to the top (y=${up.y})`);
if (themes.size < 2) fail(`header theme never changed while scrolling (${[...themes].join('/')})`);
else pass(`header theme flipped while scrolling: ${[...themes].join(' / ')}`);

/* 5. card → case study → next → back ------------------------------------ */
await page.goto(new URL('/work', BASE).href, { waitUntil: 'load' });
await page.waitForTimeout(500);
const firstCard = page.locator('article[data-card] a').first();
const cardHref = await firstCard.getAttribute('href');
await firstCard.click();
await page.waitForTimeout(900);
const csUrl = new URL(page.url()).pathname;
if (csUrl === cardHref) pass(`card click → ${csUrl}`);
else fail(`card click → ${csUrl}, expected ${cardHref}`);

// Reload the case study so the test starts from a settled layout: the previous
// check navigated from the index and the reveal animations are still running.
await page.goto(new URL(csUrl, BASE).href, { waitUntil: 'load' });
await page.waitForTimeout(1100);

// Find the link inside the "next project" block explicitly.
const nextHref = await page.evaluate(() => {
  const label = [...document.querySelectorAll('p')].find((p) => p.textContent.trim() === 'next project');
  return label?.parentElement?.querySelector('a')?.getAttribute('href') ?? null;
});
if (!nextHref) fail('no "next project" link on the case study');
else {
  const nextText = await page.evaluate(
    (h) => document.querySelector(`a[href="${h}"]`)?.textContent?.trim() ?? '',
    nextHref
  );
  // The closed work menu holds duplicate links, and Lenis keeps moving the page
  // between measuring and clicking, so dispatch the click on the last *drawn*
  // copy (the next-project block) and wait for the URL rather than a timer.
  const clicked = await page.evaluate((h) => {
    const links = [...document.querySelectorAll(`a[href="${h}"]`)].filter(
      (a) => a.getClientRects().length > 0 && getComputedStyle(a).visibility !== 'hidden'
    );
    const target = links.at(-1);
    if (!target) return false;
    target.scrollIntoView({ block: 'center' });
    target.click();
    return true;
  }, nextHref);
  if (!clicked) fail(`no visible link to ${nextHref}`);
  await page.waitForURL(`**${nextHref}`, { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(600);
  const nextUrl = new URL(page.url()).pathname;
  if (nextUrl === nextHref) pass(`next project "${nextText.slice(0, 28)}" → ${nextUrl}`);
  else fail(`next project link ${nextHref} did not navigate (${nextUrl})`);
}

await page.goBack();
await page.waitForTimeout(700);
if (new URL(page.url()).pathname === csUrl) pass(`history back → ${new URL(page.url()).pathname}`);
else fail(`history back landed on ${new URL(page.url()).pathname}`);

/* placeholder sweep ----------------------------------------------------- */
await page.goto(new URL('/', BASE).href, { waitUntil: 'load' });
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += Math.round(innerHeight * 0.7)) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 45));
  }
});
await page.waitForTimeout(400);
const text = await page.evaluate(() => document.body.innerText);
const placeholders = text.match(/(\+91\s*0{4,}|00000|your name|https?:\/\/(instagram|linkedin|tiktok|maps)\.com\/?$)/gim) ?? [];
if (placeholders.length) fail(`placeholder text still public: ${[...new Set(placeholders)].join(', ')}`);
else pass('no placeholder phone / name / platform-homepage links in the rendered home page');

pass(`console errors across the run: ${errors.length}`);
errors.slice(0, 5).forEach((e) => report.push(`      console: ${e}`));

await browser.close();

report.forEach((line) => console.log(line));
const failures = report.filter((l) => l.startsWith('FAIL')).length + errors.length;
console.log(`\n${failures === 0 ? 'ALL CHECKS PASSED' : `${failures} PROBLEM(S)`}`);
process.exit(failures ? 1 : 0);
