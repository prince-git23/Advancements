/**
 * Case-study image rails.
 *
 *   node audit/tools/study-shot.mjs
 *
 * On a phone the month grid, the reel covers and the three-frame storyboard are
 * one-up snap rails; on a laptop they are 3–4 across grids. This measures both
 * and captures the sections.
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

for (const [route, label] of [
  ['work/always-on', 'always-on'],
  ['work/hook-turn-payoff', 'htp'],
]) {
  for (const [w, h] of [
    [390, 844],
    [1440, 900],
  ]) {
    const page = await browser.newPage({
      viewport: { width: w, height: h },
      deviceScaleFactor: 1,
      isMobile: w < 700,
      hasTouch: w < 700,
    });
    await page.goto(`${BASE}/${route}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1600);

    const rails = await page.evaluate(() => {
      const out = [];
      document.querySelectorAll('.study-rail').forEach((rail, i) => {
        const kids = [...rail.children];
        const first = kids[0]?.getBoundingClientRect();
        out.push({
          i,
          display: getComputedStyle(rail).display,
          count: kids.length,
          first: first ? Math.round(first.width) : 0,
          railW: Math.round(rail.getBoundingClientRect().width),
          scrolls: rail.scrollWidth > rail.clientWidth + 1,
          columns: getComputedStyle(rail).gridTemplateColumns.split(' ').length,
        });
      });
      return {
        rails: out,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });
    console.log(`${label} @${w}`, JSON.stringify(rails));

    // Capture each rail's enclosing section. A viewport shot (not an element
    // shot) so horizontal offsets are exactly what a visitor sees.
    const targets = await page.$$('.study-rail');
    for (let i = 0; i < targets.length; i += 1) {
      const top = await targets[i].evaluate((n) => {
        const sec = n.closest('section');
        return sec.getBoundingClientRect().top + window.scrollY - 24;
      });
      await page.evaluate((t) => window.scrollTo(0, t), top);
      await page.waitForTimeout(500);
      const geom = await page.evaluate(() => {
        const rail = document.querySelector('.study-rail');
        const first = rail?.firstElementChild;
        return {
          scrollX: window.scrollX,
          rail: rail ? Math.round(rail.getBoundingClientRect().left) : null,
          first: first ? Math.round(first.getBoundingClientRect().left) : null,
          firstW: first ? Math.round(first.getBoundingClientRect().width) : null,
        };
      });
      console.log(`  rail${i} geometry`, JSON.stringify(geom));
      await page.screenshot({ path: `audit/frames/rail-${label}-${i}-${w}.png` });
    }

    await page.close();
  }
}

await browser.close();
