/**
 * Final pass harness: page height / overflow at every audited width, the header
 * theme through the intro→manifesto hand-off, and one capture of that hand-off.
 *
 *   node audit/tools/final-check.mjs
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
const sizes = [
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

const browser = await chromium.launch({ executablePath: exe });
const rows = [];

for (const [w, h] of sizes) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2600);
  const m = await page.evaluate(() => ({
    height: document.documentElement.scrollHeight,
    overflow: document.documentElement.scrollWidth - innerWidth,
  }));

  // Header theme where the intro hands over to the manifesto.
  const theme = await page.evaluate(async () => {
    const intro = document.getElementById('intro');
    if (!intro) return null;
    const host = intro.parentElement?.classList.contains('pin-spacer') ? intro.parentElement : intro;
    const target = Math.round(host.getBoundingClientRect().bottom + scrollY - innerHeight * 0.5);
    window.scrollTo(0, target);
    await new Promise((r) => setTimeout(r, 700));
    return {
      at: target,
      header: document.querySelector('header')?.dataset.theme ?? null,
      nextVisible: !!document.getElementById('manifesto') &&
        document.getElementById('manifesto').getBoundingClientRect().top < innerHeight,
    };
  });

  if (w === 390) {
    await page.screenshot({ path: 'audit/frames/final-390-handoff.png' });
  }
  rows.push({ w, h, ...m, theme, errors: errors.length });
  await page.close();
}

await browser.close();
for (const r of rows) {
  console.log(
    `${r.w}x${r.h} height=${r.height} overflow=${r.overflow} header@handoff=${r.theme?.header} manifestoVisible=${r.theme?.nextVisible} errors=${r.errors}`
  );
}
