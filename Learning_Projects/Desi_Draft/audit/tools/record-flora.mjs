/**
 * Records a short, authentic scroll pass of the live Flora Alchemy storefront
 * for the Selected Work card. Public page, real website, no invented content.
 *
 *   node audit/tools/record-flora.mjs
 *
 * Output: audit/video/flora-alchemy-scroll/*.webm, then transcoded to
 * public/videos/flora-alchemy-scroll.mp4 with the system ffmpeg.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { execFileSync } from 'node:child_process';

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '..', '..');
const OUT = path.join(here, '..', 'video', 'flora-alchemy-scroll');
const TARGET = path.join(ROOT, 'public', 'videos', 'flora-alchemy-scroll.mp4');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function resolveChromium() {
  const base = path.join(process.env.LOCALAPPDATA || process.env.HOME || '', 'ms-playwright');
  const entries = await fs.readdir(base).catch(() => []);
  const dirs = entries.filter((d) => d.startsWith('chromium-')).sort().reverse();
  const subs = ['chrome-win64', 'chrome-win', 'chrome-linux64', 'chrome-linux'];
  const bins = ['chrome.exe', 'chrome'];
  for (const d of dirs) {
    for (const sub of subs) {
      for (const bin of bins) {
        const p = path.join(base, d, sub, bin);
        if (await fs.access(p).then(() => true, () => false)) return p;
      }
    }
  }
  return null;
}

const executablePath = await resolveChromium();
await fs.rm(OUT, { recursive: true, force: true });
await fs.mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath, args: ['--hide-scrollbars'] });
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 1,
  recordVideo: { dir: OUT, size: { width: 1280, height: 800 } },
});
const page = await context.newPage();
await page.goto('https://flora-alchemyy.vercel.app/', { waitUntil: 'load', timeout: 60000 });
// The storefront hydrates its hero late and lazy-loads product imagery.
await sleep(9000);
for (const dy of [300, 320, 300, 260, 300, 240]) {
  await page.mouse.move(640, 420);
  await page.mouse.wheel(0, dy);
  await sleep(1700);
}
await sleep(2200);
await context.close();
await browser.close();

const files = (await fs.readdir(OUT)).filter((f) => f.endsWith('.webm'));
if (!files.length) throw new Error('no recording produced');
const src = path.join(OUT, files[0]);
execFileSync(
  'ffmpeg',
  [
    '-y',
    '-loglevel',
    'error',
    '-ss',
    '8.8',
    '-i',
    src,
    '-vf',
    'scale=1280:-2,fps=24',
    '-c:v',
    'libx264',
    '-preset',
    'slow',
    '-crf',
    '27',
    '-pix_fmt',
    'yuv420p',
    '-an',
    '-movflags',
    '+faststart',
    TARGET,
  ],
  { stdio: 'inherit' }
);
await fs.rm(OUT, { recursive: true, force: true });
const { size } = await fs.stat(TARGET);
console.log(`wrote ${path.relative(ROOT, TARGET)} — ${(size / 1024 / 1024).toFixed(2)} MB`);
