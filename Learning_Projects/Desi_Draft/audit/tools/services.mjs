/**
 * Services accordion sampler.
 *
 *   node audit/tools/services.mjs
 *
 * For each width: measures overflow, panel count, the open panel's content,
 * mobile image height, then clicks through all five panels, checks the
 * evidence links against the real routes, exercises keyboard focus and
 * captures a screenshot next to the section.
 */
import { chromium } from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE = 'http://127.0.0.1:4174';
const WIDTHS = [
  [1920, 1080],
  [1440, 900],
  [1024, 768],
  [768, 1024],
  [430, 932],
  [390, 844],
  [320, 720],
];

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
let failures = 0;
const fail = (msg) => {
  failures += 1;
  console.log(`FAIL  ${msg}`);
};

for (const [W, H] of WIDTHS) {
  const page = await browser.newPage({
    viewport: { width: W, height: H },
    deviceScaleFactor: W < 600 ? 2 : 1,
    isMobile: W < 700,
    hasTouch: W < 700,
  });
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  await page.evaluate(() => document.getElementById('services')?.scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(900);

  const info = await page.evaluate(() => {
    const list = document.querySelector('.svc-acc');
    const panels = [...document.querySelectorAll('.svc-acc__panel')];
    const open = document.querySelector('.svc-acc__panel[data-open="true"]');
    const media = open?.querySelector('.svc-acc__media');
    const body = open?.querySelector('.svc-acc__body');
    const img = open?.querySelector('.svc-acc__media img');
    const listRect = list.getBoundingClientRect();
    const bodyRect = body?.getBoundingClientRect();
    const panelRect = open?.getBoundingClientRect();
    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      panels: panels.length,
      openCount: document.querySelectorAll('.svc-acc__panel[data-open="true"]').length,
      openTitle: open?.querySelector('.svc-acc__bodyTitle, .svc-acc__title')?.textContent?.trim(),
      openDesc: open?.querySelector('.svc-acc__desc')?.textContent?.trim()?.slice(0, 48),
      features: open ? open.querySelectorAll('.svc-acc__features li').length : 0,
      evidenceHref: open?.querySelector('.svc-acc__evidence')?.getAttribute('href'),
      mediaH: media ? Math.round(media.getBoundingClientRect().height) : 0,
      bodyBottom: bodyRect ? Math.round(bodyRect.bottom) : 0,
      panelBottom: panelRect ? Math.round(panelRect.bottom) : 0,
      bodyFits: bodyRect && panelRect ? bodyRect.bottom <= panelRect.bottom + 1 : null,
      // Only collapsed panels are measured: the open one prints its name in
      // the content block, so its spine label is deliberately clipped.
      labelVisible: panels.map((p) => {
        if (p.getAttribute('data-open') === 'true') return true;
        const r = p.querySelector('.svc-acc__title').getBoundingClientRect();
        return r.width > 2 && r.height > 2;
      }),
      imgLoaded: img ? img.complete && img.naturalWidth > 0 : false,
      aria: panels.map((p) => {
        const b = p.querySelector('.svc-acc__button');
        return [b.getAttribute('aria-expanded'), b.getAttribute('aria-controls') === p.querySelector('.svc-acc__body')?.id];
      }),
      listW: Math.round(listRect.width),
    };
  });

  const touches = info.bodyBottom > 0 && info.bodyBottom > info.panelBottom + 1;

  console.log(
    `\n=== ${W}x${H} overflow=${info.overflow} panels=${info.panels} open=${info.openCount} bodyH=${info.mediaH} ` +
      `features=${info.features} evidence=${info.evidenceHref} errors=${errors.length}`
  );
  console.log(`    title="${info.openTitle}" desc="${info.openDesc}…"`);
  console.log(`    labels=${JSON.stringify(info.labelVisible)} aria=${JSON.stringify(info.aria)}`);

  if (info.overflow !== 0) fail(`${W}: horizontal overflow ${info.overflow}`);
  if (info.panels !== 5) fail(`${W}: expected 5 panels, got ${info.panels}`);
  if (info.openCount !== 1) fail(`${W}: expected exactly one open panel`);
  if (!info.imgLoaded) fail(`${W}: open panel image not loaded`);
  if (info.features < 6) fail(`${W}: feature list short (${info.features})`);
  if (touches) fail(`${W}: open panel body spills past the panel`);
  if (W >= 1024 && info.labelVisible.some((v) => !v)) fail(`${W}: a collapsed panel lost its name`);
  if (W < 1024 && (info.mediaH < 190 || info.mediaH > 275))
    fail(`${W}: mobile image height ${info.mediaH} outside 200–260 band`);

  // Every panel opens, and every evidence link is a real route.
  const results = [];
  for (let i = 0; i < 5; i++) {
    // One click per step, with a paint between: two clicks in one tick would
    // both read the pre-render state and cancel each other out.
    const already = await page.evaluate(
      (idx) => document.querySelectorAll('.svc-acc__panel')[idx].dataset.open === 'true',
      i
    );
    if (!already) {
      await page.evaluate((idx) => {
        document.querySelectorAll('.svc-acc__panel')[idx].querySelector('.svc-acc__button').click();
      }, i);
      await page.waitForTimeout(380);
    }
    const res = await page.evaluate((idx) => {
      const panels = [...document.querySelectorAll('.svc-acc__panel')];
      const p = panels[idx];
      const region = p.querySelector('.svc-acc__body');
      return {
        expanded: p.querySelector('.svc-acc__button').getAttribute('aria-expanded'),
        hidden: region.hasAttribute('hidden'),
        href: p.querySelector('.svc-acc__evidence')?.getAttribute('href'),
        title: p.querySelector('.svc-acc__bodyTitle, .svc-acc__title')?.textContent?.trim(),
        openCount: document.querySelectorAll('.svc-acc__panel[data-open="true"]').length,
      };
    }, i);
    results.push(res);
    if (res.href === null) fail(`${W}: panel ${i} has no evidence link`);
  }
  console.log(
    '    panels: ' +
      results.map((r) => `${r.title}:${r.expanded}${r.hidden ? '(hidden!)' : ''}`).join(' | ')
  );
  if (results.some((r) => r.expanded !== 'true' || r.hidden)) fail(`${W}: a panel did not open correctly`);

  // Every generated service image decoded, not just the first one.
  const images = await page.evaluate(() =>
    [...document.querySelectorAll('.svc-acc__media img')].map((img) => ({
      src: img.getAttribute('src'),
      ok: img.complete && img.naturalWidth > 0,
      w: img.naturalWidth,
      h: img.naturalHeight,
    }))
  );
  console.log(`    images: ${images.map((i) => `${i.ok ? 'ok' : 'MISSING'} ${i.w}x${i.h}`).join(', ')}`);
  if (images.some((i) => !i.ok)) fail(`${W}: a service image failed to decode`);

  // Collapse path: only the phone layout may close the last panel.
  await page.evaluate(() => {
    document.querySelector('.svc-acc__panel[data-open="true"] .svc-acc__button').click();
  });
  await page.waitForTimeout(380);
  const collapsed = await page.evaluate(() => ({
    openCount: document.querySelectorAll('.svc-acc__panel[data-open="true"]').length,
    anyExpanded: [...document.querySelectorAll('.svc-acc__button')].some(
      (b) => b.getAttribute('aria-expanded') === 'true'
    ),
  }));
  if (W < 1024 && (collapsed.openCount !== 0 || collapsed.anyExpanded))
    fail(`${W}: tapping the open row did not collapse it`);
  if (W >= 1024 && (collapsed.openCount !== 1 || !collapsed.anyExpanded))
    fail(`${W}: desktop allowed the last panel to close`);
  if (W < 1024) {
    await page.evaluate(() => {
      document.querySelectorAll('.svc-acc__panel')[4].querySelector('.svc-acc__button').click();
    });
    await page.waitForTimeout(380);
    const reopened = await page.evaluate(
      () => document.querySelectorAll('.svc-acc__panel[data-open="true"]').length
    );
    if (reopened !== 1) fail(`${W}: a collapsed row did not reopen on tap`);
  }

  // Evidence routes must answer 200.
  const hrefs = [...new Set(results.map((r) => r.href))];
  for (const href of hrefs) {
    const res = await page.request.get(BASE + href);
    if (res.status() !== 200) fail(`${W}: evidence ${href} → ${res.status()}`);
  }
  console.log(`    evidence routes: ${hrefs.join(', ')}`);

  // The evidence link is a real, clickable destination on top of the panel.
  const evidenceHref = await page.evaluate(
    () => document.querySelector('.svc-acc__panel[data-open="true"] .svc-acc__evidence')?.getAttribute('href')
  );
  const evidence = page.locator('.svc-acc__panel[data-open="true"] .svc-acc__evidence');
  await evidence.scrollIntoViewIfNeeded();
  // Lenis is still easing after the jump; let the page settle so the pointer
  // lands on the link rather than on the fixed header above it.
  await page.waitForTimeout(900);
  await evidence.click();
  await page.waitForTimeout(900);
  const landed = new URL(page.url()).pathname;
  if (landed !== evidenceHref) fail(`${W}: evidence click went to ${landed}, expected ${evidenceHref}`);
  console.log(`    evidence click → ${landed}`);
  await page.goBack({ waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.evaluate(() => document.getElementById('services')?.scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(500);

  // Keyboard: arrows move focus along the layout's axis, Enter opens.
  await page.evaluate(() => {
    const first = document.querySelector('.svc-acc__button');
    first.focus();
  });
  const arrowKey = W >= 1024 ? 'ArrowRight' : 'ArrowDown';
  await page.keyboard.press(arrowKey);
  const focused = await page.evaluate(() => {
    const all = [...document.querySelectorAll('.svc-acc__button')];
    return all.indexOf(document.activeElement);
  });
  if (focused !== 1) fail(`${W}: ${arrowKey} moved focus to ${focused}, expected 1`);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(450);
  const afterEnter = await page.evaluate(() => ({
    active: document.activeElement?.getAttribute('aria-expanded'),
    open: document.querySelectorAll('.svc-acc__panel[data-open="true"]').length,
    title: document.querySelector('.svc-acc__panel[data-open="true"] .svc-acc__bodyTitle')?.textContent,
  }));
  if (afterEnter.active !== 'true') fail(`${W}: Enter did not expand the focused panel`);
  console.log(`    keyboard ${arrowKey} → index ${focused}, Enter → ${afterEnter.title}`);

  // Focus ring is visible on the keyboard-focused button.
  const ring = await page.evaluate(() => {
    const el = document.querySelector('.svc-acc__button:focus-visible');
    return el ? getComputedStyle(el).outlineStyle : 'none';
  });
  if (ring === 'none') fail(`${W}: no visible focus outline on the accordion button`);

  // Screenshot the section.
  const box = await page.evaluate(() => {
    const el = document.querySelector('#services');
    const r = el.getBoundingClientRect();
    return { y: Math.round(r.top + window.scrollY), h: Math.round(r.height) };
  });
  await page.screenshot({
    path: `../frames/svc-${W}.png`,
    clip: { x: 0, y: 0, width: W, height: Math.min(H, 900) },
  });
  void box;

  if (errors.length) fail(`${W}: console errors — ${errors.slice(0, 2).join(' / ')}`);
  await page.close();
}

// Reduced motion: no transitions, content still present.
const rm = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await rm.emulateMedia({ reducedMotion: 'reduce' });
await rm.goto(BASE, { waitUntil: 'networkidle' });
await rm.evaluate(() => document.getElementById('services')?.scrollIntoView({ block: 'start' }));
await rm.waitForTimeout(500);
const reducedInfo = await rm.evaluate(() => {
  const panel = document.querySelector('.svc-acc__panel');
  const body = document.querySelector('.svc-acc__body');
  const kids = [...body.querySelectorAll('*')].map((el) => getComputedStyle(el).opacity);
  return {
    transition: getComputedStyle(panel).transitionDuration,
    hidden: body.hasAttribute('hidden'),
    transparentKids: kids.filter((o) => Number(o) === 0).length,
    titleVisible: getComputedStyle(document.querySelector('.svc-acc__bodyTitle')).display,
  };
});
console.log(`\n=== reduced motion ${JSON.stringify(reducedInfo)}`);
// Chrome reports a zero transition as 1e-06s rather than 0s.
if (parseFloat(reducedInfo.transition) > 0.05) fail('reduced motion still transitions the panels');
if (reducedInfo.hidden) fail('reduced motion hides the open panel');
if (reducedInfo.transparentKids > 0) fail('reduced motion left content at opacity 0');
await rm.screenshot({ path: '../frames/svc-reduced.png' });
await rm.close();

await browser.close();
console.log(failures ? `\n${failures} FAILURE(S)` : '\nALL SERVICES CHECKS PASSED');
process.exit(failures ? 1 : 0);
