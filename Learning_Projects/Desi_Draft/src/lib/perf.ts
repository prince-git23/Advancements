/**
 * Dev-only frame sampler. In the console:
 *
 *   await window.__ddFps(180)   // { avg, min, dropped }
 *
 * Scroll the section you are testing while it runs.
 */
export type FpsReport = { frames: number; avg: number; min: number; dropped: number };

export function measureFps(frames = 120): Promise<FpsReport> {
  return new Promise((resolve) => {
    const deltas: number[] = [];
    let last = performance.now();

    const tick = (now: number) => {
      deltas.push(now - last);
      last = now;
      if (deltas.length < frames) {
        requestAnimationFrame(tick);
        return;
      }
      const avg = deltas.reduce((a, b) => a + b, 0) / deltas.length;
      const worst = Math.max(...deltas);
      const report: FpsReport = {
        frames: deltas.length,
        avg: Math.round(1000 / avg),
        min: Math.round(1000 / worst),
        dropped: deltas.filter((d) => d > 1000 / 45).length,
      };
      console.info('[fps]', report);
      resolve(report);
    };

    requestAnimationFrame(tick);
  });
}

export function installFpsMeter() {
  (window as unknown as { __ddFps?: typeof measureFps }).__ddFps = measureFps;
}
