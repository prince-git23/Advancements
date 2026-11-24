/**
 * Final measurements for the Team / Testimonials / Footer pass.
 *
 *   node audit/tools/final-metrics.mjs
 *
 * Prints one JSON row per viewport: testimonial measure and card type sizes,
 * measured marquee travel (px/s), team card widths and rows, and footer group
 * geometry. Read-only; screenshots reuse the team-footer frames.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const here = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.DD_URL || 'http://127.0.0.1:4174/';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function resolveChromium() {
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

const browser = await chromium.launch({ executablePath: await resolveChromium() });
const rows = [];

for (const [w, h] of [
  [1920, 1080],
  [1440, 900],
  [1366, 768],
  [1280, 800],
  [1024, 768],
  [768, 1024],
  [390, 844],
  [320, 720],
]) {
  const context = await browser.newContext({ viewport: { width: w, height: h } });
  await context.addInitScript(() => {
    try {
      sessionStorage.setItem('dd-visited', '1');
    } catch {
      /* ignore */
    }
  });
  const page = await context.newPage();
  await page.goto(`${BASE}?testimonials=draft`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.getElementById('testimonials')?.scrollIntoView({ block: 'start' }));
  await sleep(800);

  const m = await page.evaluate(() => {
    const r = (el) => el.getBoundingClientRect();
    const section = document.getElementById('testimonials');
    const shell = section.querySelector('.kt-shell');
    const card = section.querySelector('.kt-card');
    const track = section.querySelector('.kt-track');
    const team = document.getElementById('team');
    const cards = [...team.querySelectorAll('[data-team-card]')];
    const footer = document.getElementById('footer');
    const groups = [...footer.querySelectorAll('[data-footer-group]')];
    const quote = card.querySelector('.kt-review');
    return {
      share: +(r(shell).width / window.innerWidth).toFixed(3),
      shell: Math.round(r(shell).width),
      columns: section.querySelectorAll('.kt-col').length,
      cardW: Math.round(r(card).width),
      cardH: Math.round(r(card).height),
      quote: parseFloat(getComputedStyle(quote).fontSize),
      name: parseFloat(getComputedStyle(card.querySelector('.kt-name')).fontSize),
      handle: parseFloat(getComputedStyle(card.querySelector('.kt-handle')).fontSize),
      avatar: Math.round(r(card.querySelector('.kt-avatar')).width),
      duration: getComputedStyle(track).animationDuration,
      teamCardW: Math.round(r(cards[0]).width),
      teamRows: new Set(cards.map((c) => Math.round(r(c).top))).size,
      footerGroups: groups.map((g) => Math.round(r(g).width)),
      footerH: Math.round(r(footer.querySelector('div')).height),
      ctaH: Math.round(r([...footer.querySelectorAll('button')].find((b) => /start a project/i.test(b.innerText))).height),
    };
  });

  // Measured travel: two samples 1.5s apart on the first track.
  const a = await page.evaluate(
    () => new DOMMatrixReadOnly(getComputedStyle(document.querySelector('#testimonials .kt-track')).transform).m42
  );
  await sleep(1500);
  const b = await page.evaluate(
    () => new DOMMatrixReadOnly(getComputedStyle(document.querySelector('#testimonials .kt-track')).transform).m42
  );
  m.pxPerSecond = +(Math.abs(b - a) / 1.5).toFixed(1);
  rows.push({ viewport: `${w}x${h}`, ...m });
  await context.close();
}

await browser.close();
console.log(JSON.stringify(rows, null, 2));
