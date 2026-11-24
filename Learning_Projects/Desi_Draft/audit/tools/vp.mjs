/**
 * Viewport sampler: screenshots a route at a given viewport, stepping down the
 * page. Writes to audit/frames/vp-<tag>-<y>.png.
 *
 *   ROUTE=/ W=1440 H=900 STEP=950 TAG=d node audit/tools/vp.mjs
 */
import { chromium } from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE = 'http://127.0.0.1:4174';
const raw = process.env.ROUTE ?? '';
const route = '/' + raw.split('/').filter(Boolean).join('/');
const W = Number(process.env.W ?? 1440);
const H = Number(process.env.H ?? 900);
const STEP = Number(process.env.STEP ?? 950);
const TAG = process.env.TAG ?? `${W}`;
const MAX = Number(process.env.MAX ?? 12);

const base = path.join(process.env.LOCALAPPDATA, 'ms-playwright');
const dirs = (await fs.readdir(base)).filter((d) => d.startsWith('chromium')).sort().reverse();
let exe = null;
for (const d of dirs) {
  const p = path.join(base, d, 'chrome-win64', 'chrome.exe');
  if (await fs.access(p).then(() => 1, () => 0)) { exe = p; break; }
}

const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({
  viewport: { width: W, height: H },
  deviceScaleFactor: W < 600 ? 2 : 1,
  isMobile: W < 700,
  hasTouch: W < 700,
});

await page.goto(BASE + route, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);

// settle the preloader / first pin
const height = await page.evaluate(() => document.body.scrollHeight);
const shots = [];
for (let y = 0; y < height && shots.length < MAX; y += STEP) shots.push(y);

for (const y of shots) {
  await page.evaluate(async (t) => {
    window.scrollTo(0, t);
    window.dispatchEvent(new Event('scroll'));
    await new Promise((r) => setTimeout(r, 320));
    window.scrollTo(0, t);
    window.dispatchEvent(new Event('scroll'));
  }, y);
  await page.waitForTimeout(650);
  await page.screenshot({ path: `../frames/vp-${TAG}-${y}.png` });
}

const overflow = await page.evaluate(() => {
  const docW = document.documentElement.clientWidth;
  const wide = [...document.querySelectorAll('body *')]
    .filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && (r.right > docW + 1.5 || r.left < -1.5);
    })
    .slice(0, 6)
    .map((el) => `${el.tagName.toLowerCase()}.${(el.className || '').toString().slice(0, 40)}`);
  return { docW, scrollW: document.documentElement.scrollWidth, wide };
});

console.log(JSON.stringify({ route, W, H, height, shots, overflow }));
await browser.close();
