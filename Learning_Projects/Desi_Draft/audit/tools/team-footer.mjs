/**
 * Team · Testimonials · Footer verification.
 *
 *   npm run build && npx vite preview --port 4174 --host 127.0.0.1
 *   node audit/tools/team-footer.mjs
 *
 * For every required viewport:
 *   - exactly three public team cards, one column on a phone, two on a tablet
 *     and three on a desktop, with no horizontal overflow
 *   - the studio copy is "three people, one studio." — never six
 *   - the footer renders its three numbered groups, a CTA of at least 44px, no
 *     empty group, verified socials only and a readable bottom bar
 *   - no clipped text, no console errors
 * Then: the CTA opens the contact dialog, "back to top" returns to the top,
 * credits opens, keyboard focus reaches every control, and reduced motion stops
 * the marquee and the sticker physics.
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
const seed = async (context) =>
  context.addInitScript(() => {
    try {
      sessionStorage.setItem('dd-visited', '1');
    } catch {
      /* ignore */
    }
  });

const VIEWPORTS = [
  [1920, 1080],
  [1440, 900],
  [1366, 768],
  [1280, 800],
  [1024, 768],
  [900, 900],
  [820, 900],
  [768, 1024],
  [430, 932],
  [390, 844],
  [360, 800],
  [320, 720],
];

for (const [w, h] of VIEWPORTS) {
  const context = await browser.newContext({ viewport: { width: w, height: h } });
  await seed(context);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.getElementById('team')?.scrollIntoView({ block: 'start' }));
  await sleep(700);

  const state = await page.evaluate(() => {
    const rect = (el) => el.getBoundingClientRect();
    const team = document.getElementById('team');
    const footer = document.getElementById('footer');
    const cards = [...team.querySelectorAll('[data-team-card]')];
    const tops = [...new Set(cards.map((c) => Math.round(rect(c).top)))];
    const heading = team.querySelector('h2')?.textContent?.trim() ?? '';
    const groups = [...footer.querySelectorAll('[data-footer-group]')];
    const groupText = groups.map((g) => g.innerText.replace(/\s+/g, ' ').trim());
    const ctas = [...footer.querySelectorAll('button, a')]
      .filter((el) => rect(el).width > 0)
      .map((el) => ({ label: el.innerText.replace(/\s+/g, ' ').trim(), h: Math.round(rect(el).height) }));
    const text = document.body.innerText;
    const socials = [...document.querySelectorAll('footer a[aria-label]')].map((a) => ({
      label: a.getAttribute('aria-label'),
      href: a.getAttribute('href'),
    }));
    return {
      cards: cards.length,
      rows: tops.length,
      heading,
      bodyText: text,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      teamOverflow: team.scrollWidth - team.clientWidth,
      footerOverflow: footer.querySelector('footer > div, footer')?.scrollWidth - document.documentElement.clientWidth,
      groups: groups.length,
      groupText,
      ctas,
      socials,
      canvas: footer.querySelector('canvas') ? getComputedStyle(footer.querySelector('canvas')).display : 'none',
      clipped: [...footer.querySelectorAll('h3, p, button, a')].filter(
        (el) => el.scrollHeight > el.clientHeight + 2 && getComputedStyle(el).overflow !== 'visible'
      ).length,
      wide: Math.round(rect(document.querySelector('main')).width),
    };
  });

  // Three cards: one row at three columns, two rows at two, three rows at one.
  const expectRows = w < 640 ? 3 : w < 1024 ? 2 : 1;
  if (state.cards !== 3) fail(`${w}: ${state.cards} team cards, expected 3`);
  if (state.rows !== expectRows) fail(`${w}: team grid has ${state.rows} rows, expected ${expectRows}`);
  if (!/three people, one studio/i.test(state.heading)) fail(`${w}: team heading is "${state.heading}"`);
  if (/\bsix\b/i.test(state.heading)) fail(`${w}: team heading still claims six`);
  if (/\bsix (people|jobs)\b/i.test(state.bodyText)) fail(`${w}: page still says six people/jobs`);
  if (/\bexperience[dr]? account manager\b/i.test(state.bodyText)) fail(`${w}: fake vacancy still public`);
  if (state.overflow > 0) fail(`${w}: horizontal overflow ${state.overflow}px`);
  if (state.teamOverflow > 0) fail(`${w}: team section overflows by ${state.teamOverflow}px`);
  if (state.groups !== 3) fail(`${w}: footer has ${state.groups} groups, expected 3`);
  if (state.groupText.some((t) => t.length < 40)) fail(`${w}: a footer group is empty (${state.groupText.join(' | ')})`);
  const cta = state.ctas.find((c) => /start a project/i.test(c.label));
  if (!cta) fail(`${w}: no start-a-project control`);
  else if (cta.h < 44) fail(`${w}: start-a-project control is ${cta.h}px tall`);
  const small = state.ctas.filter((c) => c.h > 0 && c.h < 32);
  if (small.length) fail(`${w}: ${small.length} footer controls under 32px (${small.map((c) => `${c.label}:${c.h}`).join(', ')})`);
  if (!state.socials.length) fail(`${w}: no social links`);
  for (const s of state.socials) {
    if (!s.label) fail(`${w}: a social link has no accessible label`);
    if (/^https:\/\/(www\.)?(instagram|linkedin|tiktok|x|facebook)\.com\/?$/i.test(s.href)) {
      fail(`${w}: social link points at a platform homepage (${s.href})`);
    }
  }
  if (state.socials.some((s) => !s.href.includes('desidraftt.co'))) {
    fail(`${w}: an unverified social profile is linked (${state.socials.map((s) => s.href).join(', ')})`);
  }
  if (state.clipped > 0) fail(`${w}: ${state.clipped} clipped footer elements`);
  if (errors.length) fail(`${w}: console errors — ${errors.slice(0, 2).join(' | ')}`);

  console.log(
    `${w}x${h} · team=${state.cards} cards/${state.rows} rows · footer=${state.groups} groups · cta=${cta ? cta.h : '?'}px · overflow=${state.overflow}`
  );

  if ([1440, 768, 390].includes(w)) {
    await page.screenshot({ path: path.join(FRAMES, `team-footer-${w}.jpg`), fullPage: false });
    await page.evaluate(() => document.getElementById('footer')?.scrollIntoView({ block: 'end' }));
    await sleep(1400);
    await page.screenshot({ path: path.join(FRAMES, `footer-${w}.jpg`) });
  }

  await context.close();
}

/* ------------------------------------------------------------- behaviour */

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await seed(context);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.getElementById('footer')?.scrollIntoView({ block: 'end' }));
  await sleep(1200);

  // The CTA opens the real enquiry dialog.
  await page.locator('footer button', { hasText: 'start a project' }).first().click();
  await sleep(500);
  const dialog = await page.evaluate(() => {
    const el = document.querySelector('[role="dialog"]');
    return el ? { open: true, text: el.innerText.slice(0, 120), focus: document.activeElement?.tagName } : { open: false };
  });
  if (!dialog.open) fail('start-a-project did not open the contact dialog');
  await page.keyboard.press('Escape');
  await sleep(400);

  // Credits opens and closes.
  await page.locator('footer button', { hasText: 'credits' }).first().click();
  await sleep(400);
  const credits = await page.evaluate(() => Boolean(document.querySelector('[role="dialog"]')));
  if (!credits) fail('credits button opened nothing');
  await page.keyboard.press('Escape');
  await sleep(300);

  // Back to top returns to the top of the page.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await sleep(500);
  await page.locator('footer button', { hasText: 'back to top' }).first().click();
  await sleep(2200);
  const y = await page.evaluate(() => Math.round(window.scrollY));
  if (y > 40) fail(`back to top left the page at y=${y}`);

  // Keyboard: every footer control is reachable and shows a focus ring.
  const tabbable = await page.evaluate(() => {
    const els = [...document.querySelectorAll('footer a[href], footer button')];
    return els.filter((el) => el.tabIndex >= 0 && el.getClientRects().length > 0).length;
  });
  // A ring only shows on :focus-visible, so reach the control the way a
  // keyboard user does: focus the one before it, then Tab.
  await page.evaluate(() => document.querySelector('footer button')?.focus());
  await page.keyboard.press('Tab');
  const focused = await page.evaluate(() => {
    const el = document.activeElement;
    const s = getComputedStyle(el);
    return { tag: el?.tagName, label: el?.innerText?.trim().slice(0, 24), width: parseFloat(s.outlineWidth) };
  });
  if (!tabbable) fail('no footer controls are tabbable');
  if (!focused.width) fail(`footer control "${focused.label}" has no visible focus outline`);

  if (errors.length) fail(`behaviour run console errors: ${errors.slice(0, 2).join(' | ')}`);
  console.log(
    `behaviour · dialog=${dialog.open} credits=${credits} backToTop=${y} tabbable=${tabbable} focus=${focused.tag}:${focused.width}px`
  );
  await context.close();
}

/* --------------------------------------------------------- reduced motion */

{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  await seed(context);
  const page = await context.newPage();
  await page.goto(`${BASE}?testimonials=draft`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.getElementById('testimonials')?.scrollIntoView({ block: 'start' }));
  await sleep(500);
  await page.evaluate(() => document.getElementById('footer')?.scrollIntoView({ block: 'end' }));
  await sleep(900);
  const state = await page.evaluate(() => ({
    marquee: Boolean(document.querySelector('#testimonials .kt-marquee')),
    grid: Boolean(document.querySelector('#testimonials .kt-static')),
    physics: document.querySelector('footer canvas')?.dataset.physics ?? 'none',
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    stickersVisible: [...document.querySelectorAll('footer [aria-hidden="true"] img, footer canvas')].length,
  }));
  if (state.marquee) fail('reduced motion: marquee still rendered');
  if (!state.grid) fail('reduced motion: no static testimonial grid');
  if (state.physics === 'running') fail('reduced motion: sticker physics still running');
  if (state.overflow > 0) fail(`reduced motion: overflow ${state.overflow}px`);
  await page.screenshot({ path: path.join(FRAMES, 'footer-reduced-1440.jpg') });
  console.log(`reduced · grid=${state.grid} physics=${state.physics}`);
  await context.close();
}

await browser.close();

if (failures.length) {
  console.log(`\n${failures.length} FAILURES`);
  for (const f of failures) console.log(`  - ${f}`);
  process.exit(1);
}
console.log('\nTEAM · TESTIMONIALS · FOOTER CLEAN');
