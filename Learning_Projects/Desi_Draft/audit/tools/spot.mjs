/**
 * Spot sampler: scrolls to a named element and screenshots it at the top of the
 * viewport, for checking header collisions and heading crops.
 *
 *   W=1440 H=900 TAG=spot node audit/tools/spot.mjs
 *   W=390 H=844 TAG=m390 REDUCED=1 node audit/tools/spot.mjs   // reduced motion
 *   ROUTE=work/floral-alchemy W=1440 H=900 TAG=cs Y=8400 node audit/tools/spot.mjs
 */
import { chromium } from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE = 'http://127.0.0.1:4174';
const W = Number(process.env.W ?? 1440);
const H = Number(process.env.H ?? 900);
const TAG = process.env.TAG ?? 'spot';
const ROUTE = process.env.ROUTE ? `/${process.env.ROUTE.split('/').filter(Boolean).join('/')}` : '/';
const REDUCED = Boolean(process.env.REDUCED);

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
const page = await browser.newPage({
  viewport: { width: W, height: H },
  deviceScaleFactor: W < 600 ? 2 : 1,
  isMobile: W < 700,
  hasTouch: W < 700,
});
if (REDUCED) await page.emulateMedia({ reducedMotion: 'reduce' });
await page.goto(BASE + ROUTE, { waitUntil: 'networkidle' });
// WAIT is time for the hero entrance to settle before anything is captured.
await page.waitForTimeout(Number(process.env.WAIT ?? 1400));

// Hero playback has to be proven at the hero, not after scrolling away.
const initial = await page.evaluate(() => {
  const v = document.querySelector('video');
  return v ? { src: v.currentSrc.split('/').pop(), paused: v.paused, t: Number(v.currentTime.toFixed(2)) } : null;
});

const spots = [
  ['top', 0],
  ['manifesto', '#manifesto', -20],
  ['services', '#services', -20],
  ['services-body', '#services', 420],
  ['work', '#work', -20],
  ['team', '#team', -20],
];

for (const [name, target, offset] of spots) {
  const y = await page.evaluate(
    ([sel]) => {
      if (!sel) return 0;
      const el = document.querySelector(sel);
      return el ? el.getBoundingClientRect().top + window.scrollY : 0;
    },
    [target]
  );
  const at = Math.max(0, y + (offset ?? 0));
  await page.evaluate(async (t) => {
    window.scrollTo(0, t);
    await new Promise((r) => setTimeout(r, 500));
    window.scrollTo(0, t);
  }, at);
  await page.waitForTimeout(700);
  await page.screenshot({ path: `../frames/spot-${TAG}-${name}.png` });
}

const Y = Number(process.env.Y ?? -1);
if (Y >= 0) {
  await page.evaluate(async (t) => {
    window.scrollTo(0, t);
    await new Promise((r) => setTimeout(r, 600));
    window.scrollTo(0, t);
  }, Y);
  await page.waitForTimeout(800);
  await page.screenshot({ path: `../frames/spot-${TAG}-y${Y}.png` });
}

// Playback lifecycle: playing at the top, paused when scrolled away, playing
// again once the hero is back — the behaviour the brief asks for.
if (process.env.PLAYTEST) {
  const probe = (label) =>
    page
      .evaluate(() => {
        const v = document.querySelector('video');
        return v
          ? { t: Number(v.currentTime.toFixed(2)), paused: v.paused, hidden: document.hidden }
          : null;
      })
      .then((s) => ({ label, ...s }));

  const out = [];
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1600);
  out.push(await probe('top'));
  await page.evaluate(() => window.scrollTo(0, 6000));
  await page.waitForTimeout(1600);
  out.push(await probe('away'));
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1600);
  out.push(await probe('back'));
  console.log(JSON.stringify({ playtest: out }));
}

const state = await page.evaluate(() => {
  const v = document.querySelector('video');
  const panel = document.querySelector('.hero-panel');
  const rect = panel?.getBoundingClientRect();
  return {
    video: v
      ? {
          src: v.currentSrc.split('/').pop(),
          readyState: v.readyState,
          paused: v.paused,
          time: Number(v.currentTime.toFixed(2)),
          error: v.error?.code ?? null,
        }
      : null,
    panel: rect ? { w: Math.round(rect.width), h: Math.round(rect.height) } : null,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    height: document.body.scrollHeight,
  };
});

console.log(JSON.stringify({ route: ROUTE, W, H, reduced: REDUCED, initial, ...state }));
await browser.close();
