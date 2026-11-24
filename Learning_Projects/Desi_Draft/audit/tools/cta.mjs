/**
 * Desi Draft — contact CTA audit.
 *
 *   npm run build && npx vite preview --port 4174 --host 127.0.0.1
 *   DD_URL=http://127.0.0.1:4174/ node audit/tools/cta.mjs
 *
 * Every enquiry CTA must reach a real destination: a verified mailto when one
 * exists, otherwise the on-site contact panel. This checks both the anchor
 * inventory (no dead or fabricated href) and that each button actually opens
 * the panel, on desktop and on a phone.
 *
 * Read-only.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const here = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.DD_URL || 'http://127.0.0.1:4174/';

async function resolveChromium() {
  const base = path.join(process.env.LOCALAPPDATA || process.env.HOME || '', 'ms-playwright');
  const entries = await fs.readdir(base).catch(() => []);
  const dirs = entries.filter((d) => d.startsWith('chromium')).sort().reverse();
  for (const d of dirs) {
    for (const sub of ['chrome-win64', 'chrome-win', 'chrome-headless-shell-win64', 'chrome-linux64', 'chrome-linux']) {
      for (const bin of ['chrome.exe', 'chrome-headless-shell.exe', 'headless_shell.exe', 'chrome']) {
        const p = path.join(base, d, sub, bin);
        if (await fs.access(p).then(() => true, () => false)) return p;
      }
    }
  }
  return null;
}

const browser = await chromium.launch({
  headless: true,
  executablePath: (await resolveChromium()) || undefined,
});
const errors = [];
const report = [];
const fail = (m) => report.push(`FAIL  ${m}`);
const pass = (m) => report.push(`ok    ${m}`);

async function openDialog(page, label, route) {
  await page.goto(new URL(route, BASE).href, { waitUntil: 'load' });
  // Sections below the fold reveal on scroll, so a hidden-until-scrolled CTA is
  // not in the accessibility tree at page top: walk the page like a visitor.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  const button = page.getByRole('button', { name: label }).first();
  const count = await button.count();
  if (!count) {
    fail(`${route} → no button "${label}"`);
    return;
  }
  await button.scrollIntoViewIfNeeded();
  await button.click();
  const dialog = page.getByRole('dialog');
  const visible = await dialog.waitFor({ state: 'visible', timeout: 2500 }).then(() => true, () => false);
  if (!visible) {
    fail(`${route} → "${label}" did not open the contact panel`);
    return;
  }
  const title = (await dialog.getAttribute('aria-label')) ?? '';
  const text = (await dialog.innerText()).replace(/\s+/g, ' ').slice(0, 90);
  pass(`${route} → "${label}" opens panel "${title}" (${text}…)`);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);
}

/* ---- desktop ---------------------------------------------------------- */
const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await desktop.newPage();
page.on('pageerror', (e) => errors.push(String(e).slice(0, 140)));

const routes = ['/', '/work', '/work/floral-alchemy', '/work/cut-to-the-beat', '/work/studio-identity'];
const anchors = new Set();
for (const route of routes) {
  await page.goto(new URL(route, BASE).href, { waitUntil: 'load' });
  await page.waitForTimeout(250);
  const found = await page.evaluate(() =>
    [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href'))
  );
  found.forEach((h) => anchors.add(h));
}

const dead = [...anchors].filter((h) => !h || h === '#' || h === '/#' || /^javascript:/i.test(h));
if (dead.length) fail(`dead or placeholder hrefs: ${dead.join(', ')}`);
else pass('no empty, "#" or javascript: hrefs in any rendered page');

const mailto = [...anchors].filter((h) => /^mailto:/i.test(h));
if (mailto.length) fail(`mailto links published without a verified inbox: ${mailto.join(', ')}`);
else pass('no mailto links while no verified address is set');

const fake = [...anchors].filter((h) => /instagram\.com\/?$|linkedin\.com\/?$|tiktok\.com\/?$|wa\.me\/$/i.test(h ?? ''));
if (fake.length) fail(`platform-homepage links: ${fake.join(', ')}`);
else pass('no platform-homepage social links');

await openDialog(page, 'start a conversation', '/');
await openDialog(page, 'start a project', '/');
// The unconfirmed "experienced account manager" vacancy was removed; group 01
// is an open invitation whose CTA is "work with us".
await openDialog(page, 'work with us', '/');
await openDialog(page, 'contact desi draft about', '/');
// Flora Alchemy is live, so its case-study CTA leaves for the real site
// instead of the contact panel. That link must be external and opener-free.
await page.goto(new URL('/work/floral-alchemy', BASE).href, { waitUntil: 'load' });
await page.waitForTimeout(250);
const live = page.getByRole('link', { name: /visit live website/i }).first();
if (!(await live.count())) fail('/work/floral-alchemy → no "Visit Live Website" link');
else {
  const href = await live.getAttribute('href');
  const target = await live.getAttribute('target');
  const rel = (await live.getAttribute('rel')) ?? '';
  if (href !== 'https://flora-alchemyy.vercel.app/') fail(`/work/floral-alchemy → live link points at ${href}`);
  else if (target !== '_blank' || !/noopener/.test(rel)) fail('/work/floral-alchemy → live link missing target/_blank + noopener');
  else pass('/work/floral-alchemy → "Visit Live Website" → flora-alchemyy.vercel.app (new tab, noopener)');
}
await openDialog(page, 'start a conversation', '/work/cut-to-the-beat');

/* ---- mobile ----------------------------------------------------------- */
const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const mp = await phone.newPage();
mp.on('pageerror', (e) => errors.push(String(e).slice(0, 140)));
await mp.goto(new URL('/', BASE).href, { waitUntil: 'load' });
await mp.waitForTimeout(700);
const mobileBtn = mp.getByRole('button', { name: 'start a project' }).first();
if (!(await mobileBtn.count())) fail('390px → footer "start a project" missing');
else {
  await mobileBtn.scrollIntoViewIfNeeded();
  await mobileBtn.click();
  const ok = await mp
    .getByRole('dialog')
    .waitFor({ state: 'visible', timeout: 2500 })
    .then(() => true, () => false);
  if (!ok) fail('390px → contact panel did not open');
  else {
    const box = await mp.getByRole('dialog').boundingBox();
    const inside = box && box.x >= 0 && box.x + box.width <= 390.5;
    if (!inside) fail(`390px → panel overflows the viewport (${box ? `${box.x}+${box.width}` : 'no box'})`);
    else pass(`390px → panel opens and fits (${Math.round(box.width)}px wide)`);
  }
}

await browser.close();
report.forEach((l) => console.log(l));
const failures = report.filter((l) => l.startsWith('FAIL')).length + errors.length;
errors.slice(0, 4).forEach((e) => console.log(`      console: ${e}`));
console.log(`\n${failures === 0 ? 'ALL CTA CHECKS PASSED' : `${failures} PROBLEM(S)`}`);
process.exit(failures ? 1 : 0);
