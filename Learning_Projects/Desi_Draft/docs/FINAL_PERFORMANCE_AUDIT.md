# FINAL PERFORMANCE AUDIT — Desi Draft

Measured on the production build (`npm run build` → `vite preview`, `127.0.0.1:4174`) in this
workspace's Chromium, with the harnesses already in `audit/tools`. No headless screenshot
session was used for frame-rate numbers.

## 1. Build output

| Chunk | Raw | Gzip | Loaded |
| --- | --- | --- | --- |
| `index` (app) | 162 kB | 54 kB | first route |
| `vendor-react` | 158 kB | 51 kB | first route |
| `vendor-motion` (Framer Motion, modals) | 112 kB | 37 kB | first route |
| `vendor-gsap` | 88 kB | 32 kB | first route |
| `matter` | 83 kB | 26 kB | only when the footer enters view |
| `index.css` | 51 kB | 10 kB | first route |
| `WorkDetail` | 18 kB | 5 kB | `/work/:slug` only |
| `QrPanel` | 16 kB | 6 kB | on demand |
| `WorkIndex` | 4 kB | 1 kB | `/work` only |

First load on `/` is ≈ 174 kB of gzipped JavaScript and 10 kB of CSS. The 26 kB physics engine
never reaches a visitor who does not scroll to the footer, and route chunks stay off the home
page.

## 2. What this pass added, and what it removed

Added: one component (`Chapter`, a `<p>` with three spans), the five CSS preset rules
(≈ 0.4 kB uncompressed), seven markers, four `evidence:` links, one hero gradient layer, and
0.2 em of padding on four masked headline lines. App JS moved from 165.73 kB to 165.93 kB
(+0.2 kB, both 55.4 kB gzipped); CSS from 53.1 kB to 51 kB after unused utility classes were
dropped by the build.

Removed: the per-row service stickers no longer render on phones. That is five stickers and
their wrappers out of the mobile DOM, and 351 px less page to scroll at 390 × 844 (11 352 →
11 001).

No dependency, font, image, route or network request was added. No WebGL context was created.

## 3. Frame rate and main-thread cost

`audit/tools/perf.mjs`, hardware rendering:

| Section | Main thread busy | FPS (avg/min/max) |
| --- | --- | --- |
| hero | 4.4 % | 60 / 60 / 60 |
| intro | 5.9 % | 60 / 60 / 60 |
| manifesto | 8.1 % | 60 / 60 / 60 |
| work | 7.7 % | 60 / 60 / 60 |
| team (cards) | 11.0 % | 60 / 60 / 60 |
| team (idle) | 9.4 % | 60 / 60 / 60 |
| services | 8.6 % | 60 / 60 / 60 |
| footer | 10.1 % | 60 / 60 / 60 |
| team (scrolling) | 13.4 % | 60 / 60 / 60 |

Software rendering (WebGL/SwiftShader path), the honest worst case:

| Section | Busy | FPS |
| --- | --- | --- |
| hero | 8.7 % | 50.3 avg (min 15.7, max 60) |
| team (cards) | 17.5 % | 60 |
| team (idle) | 14.2 % | 60 |
| team (scrolling) | 18.7 % | 60 |
| footer | 9.8 % | 60 |

The software hero is the only place that misses 60, and it does so on the frame where the
montage's gradient layers are first promoted. On hardware, the section the visitor sees first
costs 4.4 % of a frame budget.

## 4. Images and media

- 44 image files: `public/work` 360 kB (the Flora Alchemy captures), `public/images` 2.8 MB.
- `AssetFrame` emits `srcSet` + `sizes` when a slot supplies them, `loading="lazy"` and
  `decoding="async"` by default, and `loading="eager"` + `fetchPriority="high"` only for the
  covers that are above the fold.
- Every frame reserves its aspect ratio (`ratio` prop or an `aspect-*` class), so a late image
  cannot shift the layout under the reader.
- **Superseded:** the hero now ships a film — 2.53 MB landscape / 2.03 MB portrait, one file per
  breakpoint, posters 46 kB / 42 kB, `preload="none"` under reduced motion so the file is never
  requested there. See `docs/HERO_VIDEO_INTEGRATION.md` for the encode, audio and playback
  numbers.

## 5. Animation cost controls

- `will-change` is applied only while a card is hovered, and released 500 ms after the pointer
  leaves — never at rest, never on touch.
- Scroll-linked work is scrubbed and reads the scroll position; nothing animates continuously
  without a trigger.
- Case-study parallax is capped at three frames and only from 1024 px up.
- Footer physics sleeps: bodies settle, the loop stops, and the canvas is paused when it leaves
  the viewport or the tab is hidden.
- Every effect lives in a scoped `gsap.context`/`matchMedia` and reverts on unmount, so route
  changes do not accumulate triggers.
- Lenis is synchronised with ScrollTrigger once at app level; sections do not each start their
  own smoother.

## 6. Limits of these numbers

- They are lab measurements from one machine, not field data (no CrUX/RUM).
- No Lighthouse or WebPageTest run was performed; the harness measures frame cadence and
  main-thread busy time directly.
- The software-rendering pass is a stress test for GPU-less machines and remote desktops, not
  the expected experience.
- Fonts are loaded from the existing setup; no font-loading change was made in this pass.
- `node scripts/seo.mjs` reports "no SITE_URL set", so canonical and sitemap are skipped. That
  is a deployment configuration gap, not a performance one, and it is recorded here because the
  build prints it on every run.
