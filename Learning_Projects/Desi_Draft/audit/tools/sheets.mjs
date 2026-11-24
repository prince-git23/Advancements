/**
 * Capture the portfolio sheets to `public/images/portfolio/`.
 *
 * Renders each composition in `audit/sheets/` through the dev server at its
 * exact source ratio, then writes a compressed JPEG. The sheets are built from
 * the site's real tokens, typefaces and sticker art — they are studio artefacts,
 * not simulated photography.
 *
 *   npx vite --port 5173 --host 127.0.0.1        (in one shell)
 *   node audit/tools/sheets.mjs
 *
 * Read-only against source: it only writes image files.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '..', '..');
const BASE = process.env.DD_SHEETS_URL || 'http://127.0.0.1:5173/audit/sheets/index.html';

const SHOTS = [
  // The Flora Alchemy café sheets were retired with the café narrative; that
  // case study now uses client photography and live captures (see flora.mjs).
  ['cut-vertical', 900, 1600, 'cut-to-the-beat/reel-cover-9x16.jpg'],
  // The film's own three sheets: captured at their publication size.
  ['cut-hook', 1080, 1920, 'cut-to-the-beat/hook-frame-9x16.jpg', 1],
  ['cut-square', 1200, 1200, 'cut-to-the-beat/timeline-1x1.jpg', 1],
  ['cut-endcard', 1920, 1080, 'cut-to-the-beat/end-card-16x9.jpg', 1],
  ['always-grid', 1200, 1500, 'always-on/grid-plan-4x5.jpg'],
  ['always-set', 1200, 1200, 'always-on/post-set-1x1.jpg'],
  ['always-reel', 900, 1600, 'always-on/reel-cover-9x16.jpg'],
  ['beat-sheet', 1600, 900, 'hook-turn-payoff/beat-sheet-16x9.jpg'],
  ['storyboard', 1200, 900, 'hook-turn-payoff/storyboard-4x3.jpg'],
  ['identity-sheet', 1600, 900, 'studio-identity/identity-sheet-16x9.jpg'],
  ['type-specimen', 1600, 900, 'studio-identity/type-specimen-16x9.jpg'],
  ['sticker-sheet', 1600, 900, 'studio-identity/sticker-sheet-16x9.jpg'],
];

async function resolveChromium() {
  const base = path.join(process.env.LOCALAPPDATA || process.env.HOME || '', 'ms-playwright');
  const entries = await fs.readdir(base).catch(() => []);
  const dirs = entries.filter((d) => d.startsWith('chromium')).sort().reverse();
  const out = [];
  const subs = ['chrome-win64', 'chrome-win', 'chrome-headless-shell-win64', 'chrome-linux64', 'chrome-linux'];
  const bins = ['chrome.exe', 'chrome-headless-shell.exe', 'headless_shell.exe', 'chrome'];
  for (const d of dirs) for (const sub of subs) for (const bin of bins) out.push(path.join(base, d, sub, bin));
  for (const p of out) if (await fs.access(p).then(() => true, () => false)) return p;
  return null;
}

const browser = await chromium.launch({
  headless: true,
  executablePath: (await resolveChromium()) || undefined,
  args: ['--force-color-profile=srgb', '--font-render-hinting=none'],
});

const ONLY = process.env.ONLY;

for (const [id, w, h, rel, dsf] of SHOTS) {
  if (ONLY && id !== ONLY) continue;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dsf ?? 1.5 });
  const page = await ctx.newPage();
  const url = `${BASE}?s=${id}`;
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForFunction(() => document.fonts?.status === 'loaded', null, { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(450);
  const out = path.join(ROOT, 'public', 'images', 'portfolio', rel);
  await fs.mkdir(path.dirname(out), { recursive: true });
  await page.screenshot({ path: out, type: 'jpeg', quality: 84 });
  const { size } = await fs.stat(out);
  console.log(`  ${rel}  ${w}x${h}  ${Math.round(size / 1024)} kB`);
  await ctx.close();
}

await browser.close();
console.log(`\nWrote ${SHOTS.length} sheets to public/images/portfolio`);
