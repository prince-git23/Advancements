/**
 * Desi Draft — responsive and media verification.
 *
 * Walks every route at six viewports, scrolls each page to the end so lazy
 * images decode, then reports: horizontal overflow, broken images, asset plates
 * still visible, and console errors.
 *
 *   npx vite preview --port 4174 --host 127.0.0.1    (built site)
 *   DD_URL=http://127.0.0.1:4174/ node audit/tools/verify.mjs
 *
 * Read-only.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '..', '..');
const BASE = process.env.DD_URL || 'http://127.0.0.1:4174/';

const VIEWPORTS = [
  [1440, 900],
  [1280, 800],
  [1024, 768],
  [768, 1024],
  [390, 844],
  [360, 800],
];

const ROUTES = [
  '/',
  '/work',
  '/work?c=spaces',
  '/work/floral-alchemy',
  '/work/desi-draft-dot-com',
  '/work/cut-to-the-beat',
  '/work/always-on',
  '/work/hook-turn-payoff',
  '/work/studio-identity',
];

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
  args: ['--force-color-profile=srgb', '--font-render-hinting=none'],
});

const rows = [];
let failures = 0;

for (const [w, h] of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: w < 768, hasTouch: w < 768 });
  for (const route of ROUTES) {
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text().slice(0, 120));
    });
    page.on('pageerror', (e) => errors.push(String(e).slice(0, 120)));

    await page.goto(new URL(route, BASE).href, { waitUntil: 'load' });
    await page.waitForFunction(() => document.fonts?.status === 'loaded', null, { timeout: 15000 }).catch(() => {});

    // Walk the page so lazy images enter the viewport and decode.
    await page.evaluate(async () => {
      const step = Math.round(innerHeight * 0.8);
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 120));
    });
    await page.waitForTimeout(350);

    const data = await page.evaluate(() => {
      const imgs = [...document.images];
      return {
        overflow: Math.round(document.documentElement.scrollWidth - document.documentElement.clientWidth),
        imgs: imgs.length,
        broken: imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
        plates: (document.body.innerText.match(/frame pending/gi) || []).length,
        height: Math.round(document.body.scrollHeight),
      };
    });

    const bad = data.overflow > 1 || data.broken.length > 0 || errors.length > 0;
    if (bad) failures += 1;
    rows.push({ vp: `${w}x${h}`, route, ...data, errors, bad });
    console.log(
      `${bad ? 'FAIL' : ' ok '} ${w}x${h} ${route.padEnd(30)} overflow=${String(data.overflow).padStart(3)} imgs=${String(
        data.imgs
      ).padStart(2)} broken=${data.broken.length} plates=${data.plates} err=${errors.length}`
    );
    if (data.broken.length) data.broken.forEach((s) => console.log(`        broken: ${s}`));
    if (errors.length) errors.forEach((e) => console.log(`        console: ${e}`));
    await page.close();
  }
  await ctx.close();
}

await browser.close();

await fs.writeFile(
  path.join(ROOT, 'audit', 'verify.json'),
  JSON.stringify({ base: BASE, at: new Date().toISOString(), failures, rows }, null, 2)
);

const totalImgs = new Set(rows.flatMap((r) => r.imgs)).size;
console.log(`\n${rows.length} page loads · ${failures} with a problem${failures ? '' : ' (none)'}`);
process.exit(failures ? 1 : 0);
