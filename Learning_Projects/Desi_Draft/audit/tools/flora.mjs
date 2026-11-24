/**
 * Flora Alchemy — live-site screenshot capture.
 *
 * Visits the real deployed storefront and captures the actual interface at
 * desktop and phone sizes. The output is used as case-study evidence (browser
 * framed screenshots), never as a mock-up.
 *
 *   node audit/tools/flora.mjs
 *
 * Writes PNGs to .tmp/fa/shots/ inside the project. Read-only on the target.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '..', '..');
const OUT = path.join(ROOT, '.tmp', 'fa', 'shots');
const SITE = 'https://flora-alchemyy.vercel.app';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function resolveChromium() {
  const base = path.join(process.env.LOCALAPPDATA || process.env.HOME || '', 'ms-playwright');
  const entries = await fs.readdir(base).catch(() => []);
  const dirs = entries.filter((d) => d.startsWith('chromium')).sort().reverse();
  const subs = ['chrome-win64', 'chrome-win', 'chrome-headless-shell-win64', 'chrome-linux64', 'chrome-linux'];
  const bins = ['chrome.exe', 'chrome-headless-shell.exe', 'headless_shell.exe', 'chrome'];
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

/** Scroll the page so lazy images decode, then return to the top. */
async function warm(page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(400);
}

const shots = [
  { name: 'site-home', path: '/', w: 1440, h: 900 },
  { name: 'site-shop', path: '/shop', w: 1440, h: 900 },
  { name: 'site-product', path: '/product/blush-pink-lily-rose-bouquet', w: 1440, h: 940 },
  { name: 'site-custom-gifts', path: '/custom-gifts', w: 1440, h: 900 },
  { name: 'site-gift-finder', path: '/gift-finder', w: 1440, h: 900 },
  { name: 'site-collections', path: '/collections', w: 1440, h: 900 },
  { name: 'site-home-mobile', path: '/', w: 390, h: 844 },
  { name: 'site-product-mobile', path: '/product/sunshine-daisy-sunflower-bouquet', w: 390, h: 844 },
];

const browser = await chromium.launch({ executablePath: await resolveChromium(), headless: true });
await fs.mkdir(OUT, { recursive: true });

for (const shot of shots) {
  const page = await browser.newPage({
    viewport: { width: shot.w, height: shot.h },
    deviceScaleFactor: 1,
    isMobile: shot.w < 600,
    hasTouch: shot.w < 600,
  });
  try {
    await page.goto(SITE + shot.path, { waitUntil: 'networkidle', timeout: 60000 });
    await warm(page);
    await page.screenshot({ path: path.join(OUT, `${shot.name}.png`) });
    console.log('captured', shot.name);
  } catch (err) {
    console.error('failed', shot.name, err.message);
  } finally {
    await page.close();
  }
}

// A tall, full-page home capture for the "inside the atelier" sequence.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(SITE + '/', { waitUntil: 'networkidle', timeout: 60000 });
  await warm(page);
  await page.screenshot({ path: path.join(OUT, 'site-home-full.png'), fullPage: true });
  console.log('captured site-home-full');
  await page.close();
}

await browser.close();
await sleep(50);
