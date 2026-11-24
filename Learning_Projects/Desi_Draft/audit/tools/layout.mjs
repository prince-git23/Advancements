/**
 * Layout audit: measures content boxes and heading clipping across the site.
 *
 *   W=776 H=660 node audit/tools/layout.mjs
 *   ROUTES=/,/work node audit/tools/layout.mjs
 *
 * Reports, per section: the outer box, the leftmost/rightmost text-bearing
 * element inside it (so an oversized gutter or an empty column is a number, not
 * a hunch), the section's own vertical padding, and any heading that is clipped
 * or wider than its column.
 */
import { chromium } from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE = 'http://127.0.0.1:4174';
const ROUTES = (process.env.ROUTES ?? '/').split(',').map((r) => r.trim());

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

const probe = () => {
  const round = (n) => Math.round(n);
  const ignore = (el) => {
    const cs = getComputedStyle(el);
    return cs.position === 'absolute' || cs.position === 'fixed' || cs.visibility === 'hidden' || cs.opacity === '0';
  };
  // Text the reader actually sees: direct child text nodes, not descendants.
  const hasOwnText = (el) => {
    for (const n of el.childNodes) if (n.nodeType === 3 && n.textContent.trim().length > 1) return true;
    return false;
  };

  const out = { vw: innerWidth, overflow: document.documentElement.scrollWidth - innerWidth, sections: [], clipped: [] };

  const sections = [...document.querySelectorAll('main section[id], footer#footer')];
  for (const sec of sections) {
    const host = sec.parentElement?.classList.contains('pin-spacer') ? sec.parentElement : sec;
    const r = host.getBoundingClientRect();
    const cs = getComputedStyle(sec);
    let minL = Infinity;
    let maxR = -Infinity;
    for (const el of sec.querySelectorAll('*')) {
      if (ignore(el) || !hasOwnText(el)) continue;
      const b = el.getBoundingClientRect();
      if (b.width < 2 || b.height < 2) continue;
      minL = Math.min(minL, b.left);
      maxR = Math.max(maxR, b.right);
    }
    out.sections.push({
      id: sec.id || 'footer',
      top: round(r.top + scrollY),
      h: round(host.offsetHeight),
      padTop: round(parseFloat(cs.paddingTop)),
      padBottom: round(parseFloat(cs.paddingBottom)),
      contentL: Number.isFinite(minL) ? round(minL) : null,
      contentR: Number.isFinite(maxR) ? round(maxR - (innerWidth - r.right)) : null,
      // gutter between the section edge and its first/last text
      gutterL: Number.isFinite(minL) ? round(minL - r.left) : null,
      gutterR: Number.isFinite(maxR) ? round(r.right - maxR) : null,
    });
  }

  for (const h of document.querySelectorAll('h1, h2, h3, h4, p, li, a, span.display')) {
    const el = h;
    if (ignore(el) || !hasOwnText(el)) continue;
    const b = el.getBoundingClientRect();
    if (b.width < 2) continue;
    const clippedX = el.scrollWidth - el.clientWidth > 1;
    const outOfView = b.right > innerWidth + 1 || b.left < -1;
    // A box whose own text is wider than it is, inside an overflow-hidden ancestor.
    let clipper = null;
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      if (getComputedStyle(p).overflowX === 'hidden' || getComputedStyle(p).overflow === 'hidden') {
        const pb = p.getBoundingClientRect();
        if (b.right > pb.right + 1) clipper = `${p.tagName.toLowerCase()}.${(p.className || '').toString().split(' ')[0]}`;
        break;
      }
    }
    if (clippedX || outOfView || clipper) {
      out.clipped.push({
        tag: el.tagName.toLowerCase(),
        text: (el.textContent || '').trim().slice(0, 42),
        w: round(b.width),
        right: round(b.right),
        clippedX,
        outOfView,
        clipper,
      });
    }
  }

  // Services rows: the index/heading/list geometry the brief calls out.
  out.services = [...document.querySelectorAll('.svc-row')].map((row) => {
    const q = (s) => row.querySelector(s);
    const b = (el) => (el ? el.getBoundingClientRect() : null);
    const no = b(q('span.tabular-nums'));
    const h3 = b(q('h3'));
    const ul = b(q('ul'));
    const st = b(q('div.md\\:col-span-2'));
    const r = row.getBoundingClientRect();
    return {
      title: (q('h3')?.textContent || '').trim(),
      rowH: round(r.height),
      indexL: no ? round(no.left) : null,
      indexR: no ? round(no.right) : null,
      h3L: h3 ? round(h3.left) : null,
      h3W: h3 ? round(h3.width) : null,
      h3Lines: h3 ? Math.round(h3.height / parseFloat(getComputedStyle(q('h3')).lineHeight)) : null,
      ulL: ul ? round(ul.left) : null,
      ulR: ul ? round(ul.right) : null,
      stickerL: st ? round(st.left) : null,
      emptyGap: no && h3 ? round(h3.left - no.right) : null,
    };
  });

  return out;
};

for (const route of ROUTES) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + route, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  console.log(`\n=== ${route}`);

  for (const [w, h] of [
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
  ]) {
    await page.setViewportSize({ width: w, height: h });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(700);
    // Walk the page once so ScrollTrigger has all sections in a real state.
    await page.evaluate(async () => {
      const step = innerHeight * 0.9;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 40));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(500);
    const m = await page.evaluate(probe);
    const secs = m.sections
      .map((s) => `${s.id} h${s.h} pt${s.padTop} pb${s.padBottom} gutL${s.gutterL} gutR${s.gutterR}`)
      .join(' | ');
    console.log(`\n-- ${w}x${h}  overflow=${m.overflow}  ${secs}`);
    if (m.clipped.length) console.log('   CLIPPED ' + JSON.stringify(m.clipped));
    console.log('   SVC ' + JSON.stringify(m.services));
  }
  await page.close();
}

await browser.close();
