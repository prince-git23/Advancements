/**
 * Footer verification — content, links, layout, typography, stickers.
 *
 *   npm run build && npx vite preview --port 4174 --host 127.0.0.1
 *   npm run api                       # optional; the footer links out, it does not post
 *   node audit/tools/footer-check.mjs
 *
 * For every required viewport it asserts:
 *   - no horizontal overflow, three groups in the right column count
 *   - the verified email, WhatsApp, location and Instagram are present and link
 *     to the real destinations (mailto with subject, wa.me, instagram profile)
 *   - headline / description / label / button / contact type sizes stay inside
 *     the footer's own scale
 *   - the content wrapper uses the wide measure, not a narrow central strip
 *   - every CTA is at least 44px tall and the wordmark spans the panel
 *   - settled stickers never cover the copy, the contact strip or the bottom bar
 * Then a reduced-motion pass (static stickers, no physics) and a back-to-top pass.
 *
 * Screenshots: audit/frames/footer-<width>.jpg, footer-reduced-<width>.jpg,
 * footer-mobile-<width>.jpg (the phone sequence scrolled in two frames).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const here = path.dirname(fileURLToPath(import.meta.url));
const FRAMES = path.join(here, '..', 'frames');
const BASE = process.env.DD_URL || 'http://127.0.0.1:4174/';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const failures = [];
const fail = (m) => failures.push(m);

const EMAIL = 'desidraftt@gmail.com';
const WHATSAPP = 'https://wa.me/919021513161';
const INSTAGRAM = 'https://www.instagram.com/desidraftt.co/';
const LOCATION = 'NKY Tower, Nagpur, Maharashtra, India';

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

const VIEWPORTS = [
  [1920, 1080],
  [1440, 900],
  [1366, 768],
  [1280, 800],
  [1024, 768],
  [820, 900],
  [768, 1024],
  [430, 932],
  [390, 844],
  [360, 800],
  [320, 720],
];

const browser = await chromium.launch({ executablePath: await resolveChromium() });

const seed = (context) =>
  context.addInitScript(() => {
    try {
      sessionStorage.setItem('dd-visited', '1');
    } catch {
      /* ignore */
    }
  });

const measure = () =>
  document.querySelector('#footer') &&
  (() => {
    const footer = document.getElementById('footer');
    const panel = footer.querySelector('[data-theme="studio"]');
    const grid = footer.querySelector('[data-footer-grid]');
    const groups = [...footer.querySelectorAll('[data-footer-group]')];
    const strip = footer.querySelector('[data-footer-strip]');
    const bar = footer.querySelector('[data-footer-bar]');
    const wordmark = footer.querySelector('[data-theme="studio"] .pointer-events-none.select-none');
    const stickers = [...footer.querySelectorAll('[data-footer-sticker]')];
    const rect = (el) => {
      const r = el.getBoundingClientRect();
      return {
        top: Math.round(r.top),
        bottom: Math.round(r.bottom),
        left: Math.round(r.left),
        right: Math.round(r.right),
        width: Math.round(r.width),
        height: Math.round(r.height),
      };
    };
    const size = (el) => (el ? Math.round(parseFloat(getComputedStyle(el).fontSize) * 10) / 10 : 0);
    const links = [...footer.querySelectorAll('a')].map((a) => ({
      text: (a.textContent ?? '').trim().replace(/\s+/g, ' '),
      href: a.getAttribute('href') ?? '',
      target: a.getAttribute('target') ?? '',
      rel: a.getAttribute('rel') ?? '',
    }));
    const buttons = [...footer.querySelectorAll('a.btn, button.btn, [data-footer-group] a')].map((el) => ({
      text: (el.textContent ?? '').trim().replace(/\s+/g, ' '),
      height: rect(el).height,
      href: el.getAttribute('href') ?? '',
    }));

    const text = (footer.innerText ?? '').replace(/\s+/g, ' ');
    const copyBlocks = [
      ...groups.map((g) => ({ name: 'group', ...rect(g) })),
      ...(strip ? [{ name: 'strip', ...rect(strip) }] : []),
      ...(bar ? [{ name: 'bar', ...rect(bar) }] : []),
    ];

    const overlaps = [];
    for (const sticker of stickers) {
      const cs = getComputedStyle(sticker);
      if (Number(cs.opacity) < 0.05) continue;
      const r = sticker.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      for (const block of copyBlocks) {
        const hit =
          r.left < block.right - 2 &&
          r.right > block.left + 2 &&
          r.top < block.bottom - 2 &&
          r.bottom > block.top + 2;
        if (hit) overlaps.push(`${sticker.dataset.footerSticker}→${block.name}`);
      }
    }

    const clipped = [...footer.querySelectorAll('h3, p, a, span')]
      .filter((el) => el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0)
      .slice(0, 4)
      .map((el) => `${el.tagName.toLowerCase()}: ${(el.textContent ?? '').trim().slice(0, 24)}`);

    const lefts = new Set(groups.map((g) => Math.round(g.getBoundingClientRect().left)));

    return {
      vw: innerWidth,
      vh: innerHeight,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      panel: rect(panel),
      grid: grid ? rect(grid) : null,
      columns: lefts.size,
      groupCount: groups.length,
      groupTops: groups.map((g) => Math.round(g.getBoundingClientRect().top)),
      headline: size(footer.querySelector('[data-footer-group] h3')),
      description: size(footer.querySelector('[data-footer-group="01"] p')),
      label: size(footer.querySelector('[data-footer-group] span')),
      buttonText: size(footer.querySelector('[data-footer-group="03"] a.btn')),
      contact: size(strip?.querySelector('a') ?? null),
      buttons,
      links,
      text,
      stickers: stickers.length,
      panelH: Math.round(panel.getBoundingClientRect().height),
      stripBox: strip ? rect(strip) : null,
      barBox: bar ? rect(bar) : null,
      stickerBoxes: stickers
        .filter((s) => s.getBoundingClientRect().width > 0)
        .map((s) => ({ kind: s.dataset.footerSticker, ...rect(s), op: Number(getComputedStyle(s).opacity) })),
      stickerOverlaps: overlaps,
      wordmark: wordmark ? rect(wordmark) : null,
      clipped,
      physics: footer.querySelector('canvas')?.dataset.physics ?? null,
      scrollY: Math.round(window.scrollY),
      footerTop: Math.round(footer.getBoundingClientRect().top + window.scrollY),
      docHeight: document.documentElement.scrollHeight,
    };
  })();

const inRange = (value, min, max) => value >= min - 0.6 && value <= max + 0.6;

for (const [w, h] of VIEWPORTS) {
  const context = await browser.newContext({ viewport: { width: w, height: h } });
  await seed(context);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  await page.goto(BASE, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts?.ready);
  await page.evaluate(() => {
    const footer = document.getElementById('footer');
    if (footer) window.scrollTo({ top: footer.getBoundingClientRect().top + window.scrollY - 40, behavior: 'instant' });
  });
  // Physics: wait until every sticker has landed before measuring, or a sticker
  // still in the air above the contact strip reads as an overlap.
  await page
    .waitForFunction(
      () => {
        const canvas = document.querySelector('#footer canvas');
        return !canvas || canvas.dataset.physics === 'settled';
      },
      null,
      { timeout: 10000 }
    )
    .catch(() => {});
  await sleep(w >= 768 ? 600 : 1400);

  const s = await page.evaluate(measure);

  if (!s) {
    fail(`${w}: no footer rendered`);
    await context.close();
    continue;
  }

  if (s.overflow > 0) fail(`${w}: horizontal overflow ${s.overflow}px`);
  if (s.groupCount !== 3) fail(`${w}: ${s.groupCount} footer groups, expected 3`);
  if (s.columns !== (w < 768 ? 1 : w < 1024 ? 2 : 3)) {
    fail(`${w}: ${s.columns} column(s), expected ${w < 768 ? 1 : w < 1024 ? 2 : 3}`);
  }

  // Wide measure, not a narrow strip: 92% of the viewport, capped at 1740px.
  const expectedInner = Math.min(1740, Math.round(w * 0.92));
  if (Math.abs(s.grid.width - expectedInner) > 8) {
    fail(`${w}: content is ${s.grid.width}px wide, expected ~${expectedInner}px`);
  }
  if (s.panel.width < w - 30) fail(`${w}: cobalt panel is ${s.panel.width}px of ${w}px`);

  // Typography scale.
  if (w >= 1200 && !inRange(s.headline, 30, 40)) fail(`${w}: headline ${s.headline}px (desktop 30–40)`);
  if (w < 768 && !inRange(s.headline, 25, 32)) fail(`${w}: headline ${s.headline}px (mobile 25–32)`);
  if (w < 768 && !inRange(s.description, 14, 16.5)) fail(`${w}: description ${s.description}px`);
  if (w >= 768 && !inRange(s.description, 15, 17.5)) fail(`${w}: description ${s.description}px`);
  if (!inRange(s.label, 10.5, 12.5)) fail(`${w}: group label ${s.label}px`);
  if (!inRange(s.buttonText, 14.5, 16.5)) fail(`${w}: button type ${s.buttonText}px`);
  if (!inRange(s.contact, 13.5, 16.5)) fail(`${w}: contact detail ${s.contact}px`);

  // Content and destinations.
  if (!s.text.includes(EMAIL)) fail(`${w}: email missing from footer`);
  if (!s.text.includes('+91 90215 13161')) fail(`${w}: phone number missing`);
  if (!s.text.includes(LOCATION)) fail(`${w}: location missing`);
  if (!s.text.includes('@desidraftt.co')) fail(`${w}: instagram handle missing`);
  if (!s.text.includes('three people, one studio.')) fail(`${w}: studio count copy wrong`);

  // collaboration CTA, project CTA and the email in the contact strip.
  const mailto = s.links.filter((l) => l.href.startsWith('mailto:'));
  if (mailto.length !== 3) fail(`${w}: ${mailto.length} mailto links, expected 3`);
  if (!mailto.some((l) => l.href === `mailto:${EMAIL}?subject=Collaboration%20with%20Desi%20Draft`)) {
    fail(`${w}: collaboration mailto is ${mailto.map((l) => l.href).join(' | ')}`);
  }
  if (!mailto.some((l) => l.href === `mailto:${EMAIL}?subject=Project%20enquiry%20%E2%80%94%20Desi%20Draft`)) {
    fail(`${w}: project mailto is wrong`);
  }
  const wa = s.links.filter((l) => l.href === WHATSAPP);
  if (wa.length < 2) fail(`${w}: ${wa.length} WhatsApp links, expected 2`);
  if (wa.some((l) => l.target !== '_blank' || !/noopener/.test(l.rel))) {
    fail(`${w}: WhatsApp link missing target=_blank + noopener`);
  }
  const ig = s.links.filter((l) => l.href === INSTAGRAM);
  if (ig.length < 2) fail(`${w}: ${ig.length} Instagram links, expected 2`);
  if (ig.some((l) => l.target !== '_blank' || !/noopener/.test(l.rel))) {
    fail(`${w}: Instagram link missing target=_blank + noopener`);
  }
  if (s.links.some((l) => !l.href || l.href === '#')) fail(`${w}: empty or placeholder href`);

  // Touch targets.
  for (const button of s.buttons) {
    if (button.height < 44) fail(`${w}: "${button.text}" is ${button.height}px tall`);
  }
  if (s.buttons.length < 3) fail(`${w}: only ${s.buttons.length} footer CTAs found`);

  // Wordmark and stickers.
  if (!s.wordmark || s.wordmark.width < s.panel.width * 0.9) {
    fail(`${w}: wordmark is ${s.wordmark?.width ?? 0}px of a ${s.panel.width}px panel`);
  }
  if (s.stickerOverlaps.length) {
    fail(`${w}: stickers cover ${[...new Set(s.stickerOverlaps)].join(', ')}`);
  }
  if (w >= 768 && s.stickers < 6) fail(`${w}: only ${s.stickers} stickers`);
  if (s.clipped.length) fail(`${w}: clipped text — ${s.clipped.join(' · ')}`);
  if (errors.length) fail(`${w}: console errors — ${errors.slice(0, 2).join(' | ')}`);

  await page.locator('#footer [data-theme="studio"]').screenshot({
    path: path.join(FRAMES, `footer-${w}.jpg`),
  });

  if (w < 768) {
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await sleep(500);
    await page.screenshot({ path: path.join(FRAMES, `footer-mobile-${w}.jpg`) });
  }

  console.log(
    `${w}x${h} · cols=${s.columns} inner=${s.grid.width}px panel=${s.panel.width}px headline=${s.headline}px desc=${s.description}px contact=${s.contact}px stickers=${s.stickers} overflow=${s.overflow}`
  );
  if (w < 768) {
    const top = s.panel.top;
    const rel = (box) => (box ? `${box.top - top}–${box.bottom - top}` : 'n/a');
    console.log(
      `   panel=${s.panelH}px strip=${rel(s.stripBox)} bar=${rel(s.barBox)} stickers=${s.stickerBoxes
        .map((b) => `${b.kind}@${b.top - top}–${b.bottom - top}`)
        .join(' ')}`
    );
  }
  await context.close();
}

/* Reduced motion: the same footer, static stickers, no physics loop. */
for (const [w, h] of [
  [1440, 900],
  [390, 844],
]) {
  const context = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
  await seed(context);
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: 'load' });
  await page.evaluate(() => {
    const footer = document.getElementById('footer');
    window.scrollTo({ top: footer.getBoundingClientRect().top + window.scrollY - 40, behavior: 'instant' });
  });
  await sleep(1200);

  const state = await page.evaluate(() => {
    const footer = document.getElementById('footer');
    const stickers = [...footer.querySelectorAll('[data-footer-sticker]')];
    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      physics: footer.querySelector('canvas')?.dataset.physics ?? null,
      visible: stickers.filter((s) => Number(getComputedStyle(s).opacity) > 0.9).length,
      opacity: Number(getComputedStyle(footer.querySelector('.pointer-events-none.select-none')).opacity),
    };
  });

  if (state.overflow > 0) fail(`reduced ${w}: horizontal overflow ${state.overflow}px`);
  if (state.physics) fail(`reduced ${w}: physics still running (${state.physics})`);
  if (state.visible < 4) fail(`reduced ${w}: only ${state.visible} static stickers visible`);
  if (state.opacity < 0.99) fail(`reduced ${w}: wordmark hidden (opacity ${state.opacity})`);

  await page.screenshot({
    path: path.join(FRAMES, `footer-reduced-${w}.jpg`),
    fullPage: false,
  });
  console.log(`reduced ${w} · stickers=${state.visible} physics=${state.physics ?? 'none'} opacity=${state.opacity}`);
  await context.close();
}

/* Back to top really returns to the top. */
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await seed(context);
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: 'load' });
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await sleep(400);
  await page.getByRole('button', { name: /back to top/i }).click();
  await sleep(1400);
  const top = await page.evaluate(() => Math.round(window.scrollY));
  if (top > 8) fail(`back to top left the page at ${top}px`);
  console.log(`back to top · scrollY=${top}`);
  await context.close();
}

await browser.close();

console.log('');
if (failures.length) {
  for (const message of failures) console.log(`FAIL  ${message}`);
  console.log(`\n${failures.length} PROBLEM(S)`);
  process.exit(1);
}
console.log('FOOTER CLEAN');
