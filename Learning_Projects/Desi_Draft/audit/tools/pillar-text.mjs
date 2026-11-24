/**
 * Pillar text clearance.
 *
 *   node audit/tools/pillar-text.mjs
 *
 * In fan mode each card's text is inset by --text-pad; the next card is drawn
 * on top of it. This reports, per card, the text box's right edge against the
 * next card's painted box, so a covered line is a number rather than a guess.
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
for (const [w, h] of [[1920, 1080], [1440, 900], [1280, 800], [1024, 768]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.evaluate(() => {
    const el = document.getElementById('manifesto');
    window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 90);
  });
  await page.waitForTimeout(900);
  const rows = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('.pillar')];
    const ul = document.querySelector('.pillars');
    const pad = getComputedStyle(ul).getPropertyValue('--text-pad').trim();
    return cards.map((card, i) => {
      const text = card.querySelector('.pillar-text');
      const title = card.querySelector('.pillar-title');
      const copy = card.querySelector('.pillar-copy');
      const box = (el) => {
        const r = el.getBoundingClientRect();
        return { l: Math.round(r.left), r: Math.round(r.right), t: Math.round(r.top), b: Math.round(r.bottom) };
      };
      const next = cards[i + 1];
      const nb = next ? next.getBoundingClientRect() : null;
      const covers = nb
        ? cards[i].querySelectorAll('.pillar-title, .pillar-copy')
        : [];
      const covered = [...covers].map((el) => {
        const r = el.getBoundingClientRect();
        return Math.max(0, Math.round(r.right - nb.left));
      });
      return {
        i,
        w: Math.round(card.getBoundingClientRect().width),
        text: box(text),
        title: Math.round(title.getBoundingClientRect().width),
        copy: { w: Math.round(copy.getBoundingClientRect().width), scrollW: copy.scrollWidth, h: Math.round(copy.getBoundingClientRect().height) },
        coveredPx: covered,
      };
    }).concat([{ pad }]);
  });
  console.log(`\n=== ${w}x${h}`);
  for (const r of rows.slice(0, -1)) {
    console.log(
      `  card${r.i + 1} w=${r.w} text=${r.text.l}..${r.text.r} title=${r.title} copy=${r.copy.w}x${r.copy.h} (scroll ${r.copy.scrollW}) covered=${JSON.stringify(r.coveredPx)}`
    );
  }
  console.log(`  --text-pad=${rows.at(-1).pad}`);
  await page.close();
}
await browser.close();
