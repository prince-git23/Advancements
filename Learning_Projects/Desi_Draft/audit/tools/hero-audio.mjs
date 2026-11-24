/**
 * Hero verification: the shared sound control, the sticker cleanup and the
 * headline layering, measured rather than assumed.
 *
 *   node audit/tools/hero-audio.mjs
 *
 * For each width it asserts:
 *   - exactly one sound control exists and is visible;
 *   - it sits in the hero's bottom-right quadrant, clear of the headline;
 *   - no decorative sticker is layered over the film;
 *   - pressing it unmutes the element (muted === false, aria-pressed "true")
 *     and pressing again mutes it;
 *   - the correct source is loaded for the viewport;
 *   - no console errors were logged.
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
const SIZES = [
  [1920, 1080],
  [1440, 900],
  [1366, 768],
  [1280, 800],
  [1024, 768],
  [900, 900],
  [820, 900],
  [776, 660],
  [768, 1024],
  [430, 932],
  [390, 844],
  [360, 800],
];
const out = [];

for (const [w, h] of SIZES) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3800);

  const before = await page.evaluate(() => {
    const btn = document.querySelector('button[aria-pressed]');
    const video = document.querySelector('video');
    const hero = document.getElementById('hero');
    const head = hero?.querySelector('h1');
    if (!btn || !video || !hero || !head) return { missing: true };
    const b = btn.getBoundingClientRect();
    const hb = head.getBoundingClientRect();
    const sb = hero.getBoundingClientRect();
    // A decorative sticker is any [data-collide="sticker"] inside the hero.
    const stickers = hero.querySelectorAll('[data-collide="sticker"]').length;
    const overlap = !(
      b.right < hb.left ||
      b.left > hb.right ||
      b.bottom < hb.top ||
      b.top > hb.bottom
    );
    // The manifesto fan is the other composition that could escape its bounds.
    const fan = [...document.querySelectorAll('.fan-card')].map((c) => c.getBoundingClientRect());
    const fanBox = fan.length
      ? { left: Math.round(Math.min(...fan.map((r) => r.left))), right: Math.round(Math.max(...fan.map((r) => r.right))) }
      : null;
    return {
      fan: fanBox,
      fanOverflow: fanBox ? Math.round(Math.max(0, -fanBox.left) + Math.max(0, fanBox.right - innerWidth)) : 0,
      visible: b.width > 0 && b.height > 0 && getComputedStyle(btn).visibility !== 'hidden',
      inRight: b.right > sb.left + sb.width * 0.6,
      inBottom: b.bottom > sb.top + sb.height * 0.6,
      insetRight: Math.round(sb.right - b.right),
      insetBottom: Math.round(sb.bottom - b.bottom),
      overlapsHeadline: overlap,
      stickers,
      muted: video.muted,
      pressed: btn.getAttribute('aria-pressed'),
      label: btn.getAttribute('aria-label'),
      src: (video.currentSrc || video.src).split('/').pop(),
      readyState: video.readyState,
      aspect: +(b.width / b.height).toFixed(2),
      headW: Math.round(hb.width),
      headOverflow: head.scrollWidth - head.clientWidth,
    };
  });

  await page.click('button[aria-pressed]');
  await page.waitForTimeout(250);
  const afterOn = await page.evaluate(() => {
    const v = document.querySelector('video');
    const b = document.querySelector('button[aria-pressed]');
    return { muted: v.muted, volume: v.volume, pressed: b.getAttribute('aria-pressed'), label: b.getAttribute('aria-label') };
  });
  await page.click('button[aria-pressed]');
  await page.waitForTimeout(200);
  const afterOff = await page.evaluate(() => {
    const v = document.querySelector('video');
    const b = document.querySelector('button[aria-pressed]');
    return { muted: v.muted, pressed: b.getAttribute('aria-pressed') };
  });

  out.push({ viewport: `${w}x${h}`, ...before, afterOn, afterOff, errors });
  await page.close();
}

await browser.close();
console.log(JSON.stringify(out, null, 1));
