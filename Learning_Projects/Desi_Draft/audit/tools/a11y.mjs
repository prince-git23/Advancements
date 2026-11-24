/**
 * Small accessibility probe: alt text, heading order, focus visibility,
 * accessible names, and text contrast measured from the rendered pixels'
 * declared colours. Writes nothing; prints a report.
 *
 *   ROUTE= WORK=/work node audit/tools/a11y.mjs
 */
import { chromium } from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE = 'http://127.0.0.1:4174';
const routes = (process.env.ROUTES ?? 'work,work/floral-alchemy,work/studio-identity')
  .split(',')
  .map((r) => '/' + r.split('/').filter(Boolean).join('/'));

const base = path.join(process.env.LOCALAPPDATA, 'ms-playwright');
const dirs = (await fs.readdir(base)).filter((d) => d.startsWith('chromium')).sort().reverse();
let exe = null;
for (const d of dirs) {
  const p = path.join(base, d, 'chrome-win64', 'chrome.exe');
  if (await fs.access(p).then(() => 1, () => 0)) { exe = p; break; }
}

const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

for (const route of routes) {
  await page.goto(BASE + route, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const report = await page.evaluate(() => {
    const parse = (c) => {
      const m = c.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const [r, g, b, a = 1] = m[1].split(',').map((n) => parseFloat(n));
      return { r, g, b, a };
    };
    const lum = ({ r, g, b }) => {
      const f = (v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const ratio = (a, b) => {
      const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
      return (hi + 0.05) / (lo + 0.05);
    };
    const bgOf = (el) => {
      let node = el;
      while (node && node !== document.documentElement) {
        const c = parse(getComputedStyle(node).backgroundColor);
        if (c && c.a > 0.85) return c;
        node = node.parentElement;
      }
      return { r: 238, g: 234, b: 227, a: 1 };
    };

    const imgs = [...document.images];
    const noAlt = imgs.filter((i) => !i.getAttribute('alt')).length;
    const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(
      (h) => Number(h.tagName[1])
    );
    let skips = 0;
    headings.forEach((lvl, i) => {
      if (i && lvl - headings[i - 1] > 1) skips += 1;
    });

    const unnamed = [...document.querySelectorAll('a,button')].filter((el) => {
      const name = (el.getAttribute('aria-label') || el.textContent || '').trim();
      return name.length === 0;
    }).length;

    const low = [];
    for (const el of document.querySelectorAll('p,span,li,a,button,h1,h2,h3,h4,figcaption')) {
      const text = el.textContent?.trim();
      if (!text || el.children.length) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) < 0.5) continue;
      const raw = parse(cs.color);
      if (!raw) continue;
      const bg = bgOf(el);
      // Tailwind opacity utilities put the alpha in the colour, so composite
      // before measuring or every /40 label looks like solid ink.
      const fg = {
        r: raw.r * raw.a + bg.r * (1 - raw.a),
        g: raw.g * raw.a + bg.g * (1 - raw.a),
        b: raw.b * raw.a + bg.b * (1 - raw.a),
        a: 1,
      };
      const size = parseFloat(cs.fontSize);
      const bold = Number(cs.fontWeight) >= 700;
      const large = size >= 24 || (size >= 18.66 && bold);
      const r = ratio(fg, bg);
      if (r < (large ? 3 : 4.5)) {
        const cls = [...el.classList].filter((c) => c.startsWith('text-')).join(' ');
        low.push({ text: text.slice(0, 42), size: Math.round(size), r: Number(r.toFixed(2)), cls });
      }
    }

    return { imgs: imgs.length, noAlt, h1: headings.filter((h) => h === 1).length, skips, unnamed, low: low.slice(0, 8), lowCount: low.length };
  });

  // keyboard: first 14 focus stops on the document body
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.keyboard.press('Tab');
  const stops = [];
  for (let i = 0; i < 14; i += 1) {
    stops.push(
      await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const cs = getComputedStyle(el);
        const ring =
          (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) ||
          cs.boxShadow !== 'none';
        return {
          tag: el.tagName.toLowerCase(),
          name: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 28),
          ring,
        };
      })
    );
    await page.keyboard.press('Tab');
  }

  console.log(JSON.stringify({ route, ...report, focus: stops.filter(Boolean) }, null, 1));
}
await browser.close();
