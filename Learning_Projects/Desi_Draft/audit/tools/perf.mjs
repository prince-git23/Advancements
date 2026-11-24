/**
 * Desi Draft — cost per section, hardware vs software rendering.
 *
 * The lanyard stage is gone: the team section is now a DOM/CSS ProfileCard
 * grid with zero canvases. Both GPU and SwiftShader passes are kept so the
 * remaining Matter.js footer cost is still attributable to a renderer.
 *
 *   node audit/tools/perf.mjs     -> audit/perf.json
 *
 * busyPct = CDP TaskDuration / wall time: share of the main thread the page
 * consumes while sitting in that state. It survives vsync changes; fps does not.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '..');
const BASE = process.env.DD_URL || 'http://127.0.0.1:5173/';
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

const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];
const exe = await resolveChromium();

async function runPass(label, flags, wanted, budget = 1500) {
  const browser = await chromium.launch({ headless: true, executablePath: exe || undefined, args: flags });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await ctx.addInitScript(() => {
    try {
      sessionStorage.setItem('dd-visited', '1');
    } catch {}
  });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Performance.enable');

  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForFunction(() => document.fonts?.status === 'loaded', null, { timeout: 20000 }).catch(() => {});
  await sleep(2600);

  const gl = await page.evaluate(() => {
    const g = Array.from(document.querySelectorAll('canvas'))
      .map((c) => c.getContext('webgl2'))
      .find(Boolean);
    if (!g) return 'none (no WebGL contexts; team is DOM/CSS)';
    const e = g.getExtension('WEBGL_debug_renderer_info');
    return String(g.getParameter(e ? e.UNMASKED_RENDERER_WEBGL : g.RENDERER));
  });

  const geo = await page.evaluate(() => {
    const o = {};
    for (const el of document.querySelectorAll('main section[id], footer#footer')) {
      const h = el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el;
      const r = h.getBoundingClientRect();
      o[el.id || 'footer'] = {
        top: Math.round(r.top + scrollY),
        range: Math.max(0, Math.round(h.offsetHeight - innerHeight)),
      };
    }
    return o;
  });

  const metrics = async () => {
    const { metrics: list } = await cdp.send('Performance.getMetrics');
    const m = {};
    for (const x of list) m[x.name] = x.value;
    return m;
  };

  const rAF = (budget) =>
    page.evaluate(async (ms) => {
      const d = [];
      let last = performance.now();
      const t0 = last;
      await new Promise((resolve) => {
        const step = (n) => {
          d.push(n - last);
          last = n;
          if (n - t0 < ms) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      });
      d.shift();
      const s = [...d].sort((a, b) => a - b);
      const avg = d.length ? d.reduce((a, b) => a + b, 0) / d.length : 0;
      const pick = (q) => (s.length ? Number(s[Math.min(s.length - 1, Math.floor(s.length * q))].toFixed(1)) : 0);
      const canvases = Array.from(document.querySelectorAll('canvas'));
      return {
        fps: avg ? Number((1000 / avg).toFixed(1)) : 0,
        p50: pick(0.5),
        p95: pick(0.95),
        frames: d.length,
        canvases: canvases.length,
        canvasKpx: Math.round(canvases.reduce((a, c) => a + c.clientWidth * c.clientHeight, 0) / 1000),
      };
    }, budget);

  const at = async (id, frac) => {
    // The dev build exposes window.__ddScrollTo; the production preview does not,
    // so fall back to a plain scroll and let Lenis settle.
    await page.evaluate((y) => {
      if (typeof window.__ddScrollTo === 'function') window.__ddScrollTo(y);
      else window.scrollTo(0, y);
    }, geo[id].top + geo[id].range * frac);
    await sleep(900);
  };

  const out = { renderer: gl, states: {} };

  for (const [name, id, frac] of wanted) {
    const runs = [];
    for (let i = 0; i < 3; i += 1) {
      if (name === 'team-scroll') {
        const m0 = await metrics();
        const t0 = Date.now();
        const raf = await page.evaluate(
          async ({ startY, endY, ms }) => {
            const d = [];
            let last = performance.now();
            const t = last;
            await new Promise((resolve) => {
              const step = (now) => {
                const p = (now - t) / ms;
                d.push(now - last);
                last = now;
                window.__ddScrollTo(startY + (endY - startY) * Math.min(1, p));
                if (p < 1) requestAnimationFrame(step);
                else resolve();
              };
              requestAnimationFrame(step);
            });
            d.shift();
            const s = [...d].sort((a, b) => a - b);
            const avg = d.length ? d.reduce((a, b) => a + b, 0) / d.length : 0;
            return {
              fps: avg ? Number((1000 / avg).toFixed(1)) : 0,
              p95: s.length ? Number(s[Math.min(s.length - 1, Math.floor(s.length * 0.95))].toFixed(1)) : 0,
              frames: d.length,
              canvases: document.querySelectorAll('canvas').length,
            };
          },
          { startY: geo.team.top, endY: geo.team.top + geo.team.range, ms: 2400 }
        );
        const wall = (Date.now() - t0) / 1000;
        const m1 = await metrics();
        runs.push({ ...raf, busyPct: Number((((m1.TaskDuration - m0.TaskDuration) / wall) * 100).toFixed(1)) });
      } else {
        await at(id, frac);
        if (id === 'footer' && i === 0) await sleep(2200);
        const m0 = await metrics();
        const t0 = Date.now();
        const raf = await rAF(budget);
        const wall = (Date.now() - t0) / 1000;
        const m1 = await metrics();
        runs.push({
          ...raf,
          busyPct: Number((((m1.TaskDuration - m0.TaskDuration) / wall) * 100).toFixed(1)),
          scriptPct: Number((((m1.ScriptDuration - m0.ScriptDuration) / wall) * 100).toFixed(1)),
        });
      }
    }
    const last = runs[runs.length - 1];
    out.states[name] = {
      fps: median(runs.map((r) => r.fps)),
      fpsRuns: runs.map((r) => r.fps),
      busyPct: median(runs.map((r) => r.busyPct)),
      scriptPct: last.scriptPct ?? null,
      p95: last.p95,
      canvases: last.canvases,
      canvasKpx: last.canvasKpx ?? null,
    };
    console.log(
      `${label} ${name.padEnd(11)} busy ${String(out.states[name].busyPct).padStart(5)}%  fps ${String(out.states[name].fps).padStart(6)} (${out.states[name].fpsRuns.join('/')})`
    );
  }

  out.resources = await page.evaluate(() => {
    const by = {};
    for (const e of performance.getEntriesByType('resource')) {
      const k = e.initiatorType || 'other';
      by[k] = by[k] || { n: 0, kb: 0 };
      by[k].n += 1;
      by[k].kb += (e.transferSize || 0) / 1024;
    }
    for (const k of Object.keys(by)) by[k].kb = Math.round(by[k].kb);
    return by;
  });
  out.memory = await page.evaluate(() => ({
    heapMB: performance.memory ? Number((performance.memory.usedJSHeapSize / 1048576).toFixed(1)) : null,
    domNodes: document.getElementsByTagName('*').length,
  }));

  await browser.close();
  return out;
}

const common = [
  '--disable-background-timer-throttling',
  '--disable-renderer-backgrounding',
  '--disable-backgrounding-occluded-windows',
];

const result = {
  measuredAt: new Date().toISOString(),
  url: BASE,
  viewport: '1440x900 @ DPR 1, headless Chromium',
  note: 'Median of 3 samples per state, 1.5s each. busyPct = CDP TaskDuration / wall time. fps moves with the display/vsync target and is shown for scale only.',
};

console.log('hardware pass');
result.hardware = await runPass('GPU ', [...common, '--use-angle=d3d11', '--ignore-gpu-blocklist'], [
  ['hero', 'hero', 0],
  ['intro', 'intro', 0.5],
  ['manifesto', 'manifesto', 0.5],
  ['work', 'work', 0.6],
  ['team-cards', 'team', 0.5],
  ['team-idle', 'team', 0.9],
  ['services', 'services', 0.5],
  ['footer', 'footer', 0.6],
  ['team-scroll', 'team', 0],
]);

console.log('\nsoftware pass');
result.software = await runPass(
  'SW  ',
  [...common, '--use-angle=swiftshader'],
  [
    ['hero', 'hero', 0],
    ['team-cards', 'team', 0.5],
    ['team-idle', 'team', 0.9],
    ['team-scroll', 'team', 0],
    ['footer', 'footer', 0.6],
  ],
  3000
);

await fs.writeFile(path.join(ROOT, 'perf.json'), JSON.stringify(result, null, 2));
console.log('\nwrote audit/perf.json');
