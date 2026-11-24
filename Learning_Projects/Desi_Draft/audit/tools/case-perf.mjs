/**
 * Desi Draft — single-route cost probe, used for before/after on a case study.
 *
 *   DD_URL=http://127.0.0.1:4174/ node audit/tools/case-perf.mjs /work/floral-alchemy
 *
 * Reports: image bytes transferred, DOM size, LCP, long tasks and frame rate
 * while the page is scrolled once from top to bottom. Read-only.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const here = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.DD_URL || 'http://127.0.0.1:4174/';
const route = process.env.ROUTE || process.argv[2] || '/work/floral-alchemy';

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

const browser = await chromium.launch({ executablePath: await resolveChromium(), headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });

const bytes = { image: 0, script: 0, total: 0 };
const images = [];
page.on('response', async (res) => {
  try {
    const type = res.request().resourceType();
    const len = Number(res.headers()['content-length'] || 0);
    bytes.total += len;
    if (type === 'image') {
      bytes.image += len;
      images.push({ url: new URL(res.url()).pathname, kb: Math.round(len / 1024) });
    }
    if (type === 'script') bytes.script += len;
  } catch {
    /* ignore */
  }
});

await page.goto(BASE + route.replace(/^\//, ''), { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(800);

// LCP + long tasks from the document itself.
const metrics = await page.evaluate(async () => {
  const lcp = await new Promise((resolve) => {
    let value = 0;
    const po = new PerformanceObserver((list) => {
      for (const e of list.getEntries()) value = Math.round(e.startTime);
    });
    try {
      po.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch {
      resolve(0);
    }
    setTimeout(() => {
      po.disconnect();
      resolve(value);
    }, 300);
  });
  const nav = performance.getEntriesByType('navigation')[0];
  return {
    lcp,
    domNodes: document.getElementsByTagName('*').length,
    dcl: nav ? Math.round(nav.domContentLoadedEventEnd) : null,
    load: nav ? Math.round(nav.loadEventEnd) : null,
    imgs: [...document.querySelectorAll('img')].map((i) => ({
      src: i.currentSrc.split('/').pop(),
      w: i.getAttribute('width'),
      h: i.getAttribute('height'),
      complete: i.complete,
    })),
  };
});

// Scripted scroll: long tasks + frame timing.
const scroll = await page.evaluate(async () => {
  const longTasks = [];
  const po = new PerformanceObserver((list) => {
    for (const e of list.getEntries()) longTasks.push(Math.round(e.duration));
  });
  try {
    po.observe({ type: 'longtask', buffered: false });
  } catch {
    /* unsupported */
  }
  const frames = [];
  let last = performance.now();
  let run = true;
  const tick = (t) => {
    frames.push(t - last);
    last = t;
    if (run) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  const height = document.body.scrollHeight - window.innerHeight;
  const start = performance.now();
  await new Promise((resolve) => {
    const step = () => {
      const p = Math.min(1, (performance.now() - start) / 6000);
      window.scrollTo(0, height * p);
      if (p < 1) requestAnimationFrame(step);
      else resolve();
    };
    step();
  });
  run = false;
  po.disconnect();
  const sorted = frames.slice(3).sort((a, b) => a - b);
  const p95 = sorted[Math.floor(sorted.length * 0.95)] || 0;
  return {
    longTasks,
    blockingMs: longTasks.reduce((a, b) => a + b, 0),
    fps: Math.round(1000 / (sorted.reduce((a, b) => a + b, 0) / sorted.length || 16)),
    p95FrameMs: Math.round(p95),
    scrollHeight: document.body.scrollHeight,
  };
});

console.log(
  JSON.stringify(
    {
      route,
      bytes: { imageKB: Math.round(bytes.image / 1024), scriptKB: Math.round(bytes.script / 1024) },
      images: images.sort((a, b) => b.kb - a.kb).slice(0, 8),
      ...metrics,
      scroll,
    },
    null,
    2
  )
);

await browser.close();
