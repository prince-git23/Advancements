# Desi Draft — what changed, what is verified, what is still slow

Companion to `README.md` (how to read the pack) and `perf.json` (raw numbers). Everything below is either measured in this pack or read from the code; nothing is estimated.

> **Status (2026-11-18):** §1–§5 describe the lanyard round that this pack was originally captured for. The lanyard stage has since been removed; §6 records the ProfileCard rebuild, its before/after measurements and the current open gaps.

## 1. Modifications made to the site (already in the worktree)

All of this came from the "lanyard is laggy, jittery, sliced by its frame" round. None of it changes copy, colour or data.

| File | Change | Why |
| --- | --- | --- |
| `src/components/Team.tsx` | Replaced the GSAP timeline with a single `sync(progress)` writer for rail dash, clip opacity/offset, row-1 out, row-2 in, counter | Values are re-derived on every scroll tick, so a dropped frame can never strand a card or chip at half opacity |
| `src/components/Team.tsx` | Row 1 mounts on first paint; row 2 mounts at `p ≥ 0.66` and is never unmounted | Building row 1 at 30 % of a 440 svh pin (and rebuilding rows on every pass) was the "takes time to render" stall |
| `src/components/Team.tsx` | Removed the heading's `scale: 2.25` entrance | It ran past both screen edges and read as broken layout |
| `src/components/Team.tsx` | Lanyard host widened by ±10 % (`left/right: -10 %`) | The swing rotated card corners past the canvas edge, producing the sliced look |
| `src/components/Team.tsx` | Mobile / reduced-motion path settles rail and clips by hand; **now also clears the hidden stage** (see §2) | Those paths never run the scroll writer |
| `src/components/ui/Lanyard.jsx` | `MAX_STEP 1/960 → 1/480`, substeps capped at 8, two slow sines instead of a fast wind, strap width quantised, strap sampled at 52 points, DPR capped at 1.5 | Per-frame micro-changes in strap width and a fast breeze were the visible shimmer |
| `src/components/ui/Lanyard.css` | Top mask fade extended to 0 → 26 % | The strap appeared to start on a hard cut |
| `src/index.css` | Removed the `.dd-badge` CSS `badgeIn` keyframe | It animated the same wrapper GSAP transforms — two owners, visible twitch |

## 2. Defects verified by this pack

### P0 — team section was blank on phones and under reduced motion (fixed in this pass)

Evidence: `frames/mobile/056-team-000.png` and `frames/desktop/051-team-reduced-000.png` were empty black with only the fixed header. Measured on the live page: `#team` contained a canvas, but the sticky stage carried inline `visibility: hidden`.

Cause: the scroll effect writes visibility directly (`stage.style.visibility`) and only re-shows the stage when its `ScrollTrigger` becomes active. On a phone the effect first runs with `isMobile === false` (state starts `false`), hides the stage because the section is far below, then the media-query effect flips `isMobile` and the scroll effect returns early — the inline `hidden` is never reverted. Reduced motion fails identically because `usePrefersReducedMotion` resolves after the first effect run.

Fix: the early-return path now sets `stage.style.visibility = 'visible'`. Re-verified after the fix by re-shooting the mobile and reduced-motion frames.

This is very likely what a phone user saw when they said the lanyard "doesn't render properly" — not slowness, absence.

### P1 — six independent WebGL renderers in one section

`Team.tsx` mounts `<Lanyard>` per member: row 1 (3) + row 2 (3) = six three.js renderers, six GL contexts, six environment/PMREM setups, each running its own physics and render loop. They are all alive simultaneously from `p ≈ 0.66` onward, and stay alive until the page navigates (rows never unmount by design).

Measured cost (`perf.json`), 1440×900:

| state | busy % main thread | fps (hardware) |
| --- | --- | --- |
| hero | 9.8 | 60 |
| intro | 5.5 | 60 |
| manifesto | 5.7 | 60 |
| work | 7.8 | 60 |
| services | 11.7 | 60 |
| clients | 10.1 | 60 |
| footer | 11.6 | 60 |
| **team, row 1 (3 canvases)** | **18.9** | 60 |
| **team, six canvases** | **27.0** | 60 |
| **team, continuous scroll** | **42.7** | 60 |

With the same page forced onto SwiftShader (software WebGL — no GPU process, remote desktop, some VMs, GPU-blocklisted drivers):

| state | busy % | fps |
| --- | --- | --- |
| hero | 7.1 | 31.9 |
| footer | 11.1 | 60 |
| **team, row 1** | 1.2 | **0.3** |
| **team, six canvases** | 55.5 | **1.0** |
| **team, continuous scroll** | 6.3 | **4.6** |

Read that table carefully: every other section still renders at 60 fps in software; only the team collapses. Six live 3D scenes are the single biggest GPU dependency on the page, and the section has no fallback except a 1.8 s timeout per badge that swaps in `StaticBadge` only when no canvas exists — a software renderer produces a canvas, so the fallback never fires.

Options, in order of leverage:

1. One shared renderer + one canvas for all six badges (render six viewports into one drawing buffer, or composite the six cards into a single atlas).
2. Detect the renderer (`WEBGL_debug_renderer_info` → `SwiftShader`) and use `StaticBadge` for all members, or cap to one animated badge.
3. Keep three scenes alive instead of six: render row 2 only while it is on screen, and accept a small rebuild cost on the way back up.

### P2 — the footer's physics loop never stops

`Footer.tsx` starts Matter.js inside a `ScrollTrigger … once: true`, then runs `requestAnimationFrame(loop)` forever with no visibility or in-view gate and no teardown until unmount. Eight bodies plus static slots keep stepping at 60 fps after the footer is off-screen.

Measured impact is small (footer 11.6 % busy while visible; team scroll still 42.7 % with it running) but it is unconditional CPU on every other section, and on battery it prevents the page from idling. A one-line gate (`if (!inView) return;` or pause on `ScrollTrigger.onToggle`) removes it.

### P3 — one 1.2 MB JavaScript chunk

`dist/assets/index-*.js` is **1.2 MB** (single chunk, 500 kB warning on every build): three.js, matter-js, gsap, lenis, qrcode, router and all pages in one file. Nothing is route- or section-split, and `vite.config.ts` sets `cssCodeSplit: false`. The dev page loads **58 script modules / ≈5.1 MB**.

This is the first-paint cost, not the scroll cost: it delays first interaction on a phone far more than it affects the lanyard. `manualChunks` for `three`, `matter-js` and the `/work` route would be the cheap fix.

### P5 — mobile team role selector reads twice (minor, UI consistency)

In `frames/mobile/056-team-000.png` the active role appears twice: once as the pill under the card, once as the highlighted button (`ring-2 ring-cream`, `Pill tone="cream"`). Six buttons also wrap into two uneven rows, with the active one sitting alone on the first row. The desktop row uses one tangerine/lilac/lime pill per member, so the mobile control is the only place the same label is printed twice. Cosmetic, but it is the kind of thing that reads as "inconsistent" at a glance.

### P4 — per-mount texture generation

`makeFace()` (512×720) and `makeStrap()` (1536×192, rotated text) run per member per mount and `toDataURL()` each time: six canvases → six PNG encodes plus six decodes, synchronously during the team's first paint. Combined with renderer setup this is the tail of the "takes a moment to appear" feeling on slower machines. Cache the two image strings (they are deterministic per member) or precompute at module scope.

## 3. What is *not* wrong

- **Scroll smoothness on desktop**: hardware renderer holds 60 fps in every section, including the full team sweep (`team-scroll` 42.7 % busy, 60 fps median).
- **The hand-off**: verified at 12 progress points — row 1 `1 → 0.31 → 0`, row 2 `0 → 1`, rail drawn by `p = 0.2`, clips opaque by `p = 0.2`, counter `1/2 → 2/2`. No frame shows a half-faded card stranded.
- **Clipping**: no frame shows a card corner cut by the canvas edge; the widened host leaves 8 px of swing room each side at 1440×900.
- **Reduced motion**: no transitions run, and the fallback content is present (after the §2 fix).

## 4. Numbers that lie (do not repeat my mistakes)

- **fps measured while screenshots were being written is garbage.** The capture session writes ~19 MB of PNGs into a OneDrive-synced folder; the same team viewport measured 3.6, 4.5 and 144 fps in three sessions. Main-thread `busy %` from CDP is stable; fps is not.
- **Headless WebGL silently falls back to SwiftShader.** One run reported `ANGLE (Google, Vulkan 1.3.0 (SwiftShader …))` and produced the 4.5 fps table; the next reported the RTX 4050 and produced 60 fps everywhere. Always print the renderer with the number — `perf.json` stores it for both passes.
- **The display/vsync target moves between runs** (60 Hz vs 144 Hz), so raw fps is only comparable within one pass.

## 5. Priorities

1. ~~Fix the hidden team stage on mobile / reduced motion~~ — done and re-verified.
2. Split the bundle (`three`, `matter-js`, `/work`), so phones parse less before the first scroll.
3. Give the team a software-GPU path (renderer detection → static badges) — the difference is 1 fps versus 60.
4. Gate the footer physics loop on visibility.
5. Cache `makeFace` / `makeStrap` output.
6. Longer term: share one renderer across the six badges.

---

## 6. ProfileCard round — 2026-11-18

The team stage was replaced rather than tuned. `Lanyard.jsx`, `Lanyard.css`, `Lanyard.d.ts`, the `/lanyard-test` route and the `three` / `@types/three` dependencies are gone; `Team.tsx` is now a normal-height grid of six React Bits-style ProfileCards. All numbers below were re-measured after that change with the updated harness (`capture.mjs` / `perf.mjs`).

### What was removed / replaced

| Removed | Replaced by |
| --- | --- |
| Six `<Lanyard>` WebGL scenes, six animation loops, six GL contexts | `src/components/ui/ProfileCard.jsx` + `.css` (DOM/CSS only) |
| `makeFace` / `makeStrap` per-mount canvas textures | Brand-palette monogram fallback; real files come from `media.teamPhotos` |
| Rail, clips, two-row hand-off, `1/2 → 2/2` counter | One 0.65 s staggered reveal, `ScrollTrigger … once: true` |
| 440 svh pinned stage and mobile role selector | 3 / 2 / 1 column responsive grid, ~1.73 k px tall at 1440×900 |
| Misleading sound button with no media source | Hidden until `media.heroVideo` has an actual audio track |
| Continuous Matter.js rAF in the footer | IntersectionObserver + tab-visibility gate + body sleeping |
| One 1.2 MB JS chunk, `cssCodeSplit: false` | Vendor chunks + lazy `/work` routes + async matter / qrcode |

### Bundle (production build, same machine)

| Metric | Before | After |
| --- | --- | --- |
| Initial JS | **1,197.76 kB** (358.05 kB gzip), 1 chunk | **503.63 kB** (171.48 kB gzip), 4 chunks |
| Async JS | all in the chunk above | matter 85.81, qrcode 16.93, routes 6.11 kB |
| CSS | 38.92 kB (8.22 gzip), `cssCodeSplit: false` | 42.05 kB (9.22 gzip), code split enabled |
| Dev modules in one load | 58 scripts / ≈5.1 MB | 53 scripts / ≈3.2 MB (perf resources) |
| `#team` WebGL contexts | 6 | **0** |
| Canvases on the page | 4 → 7 (footer + 3/6 badges) | 1 (footer 2D canvas) |

Initial JS falls by 58 % raw / 52 % gzip. `matter-js` is now a dynamic import fired only when the footer approaches; the QR panel only loads when the WhatsApp dialog opens.

### Frame cost (1440×900, DPR 1)

Hardware pass, RTX 4050 via ANGLE/D3D11. busy % = CDP TaskDuration / wall time.

| State | Before | After |
| --- | --- | --- |
| Team, row 1 / card grid | 18.9 % busy, 60 fps | 17.2 % busy, 60 fps |
| Team, six cards / idle grid | 27.0 % busy, 60 fps | 18.7 % busy, 60 fps |
| Team scroll sweep | 42.7 % busy, 60 fps | 25.7 % busy, 60 fps |

Software pass (SwiftShader), the case where the old section collapsed:

| State | Before | After |
| --- | --- | --- |
| Team, one row / card grid | 0.3 fps | 60 fps |
| Team, six cards / idle grid | 55.5 % busy, **1.0 fps** | 30.2 % busy, **60 fps** |
| Team scroll sweep | 6.3 % busy, **4.6 fps** | 32.5 % busy, **45.1 fps** median (59.6 / 8.4 / 45.1) |

`busy %` in this run is higher than the historical baseline in unrelated sections too (services 24.8 % vs 11.7 %, clients 27.1 % vs 10.1 %) while `scriptPct` stays at 0.4–0.7 %. That is machine/render load on the day, not new JavaScript; only compare the team fps rows and the same-session states. The software team result is the meaningful one: six 3D scenes were the only thing that took the page to 1 fps, and they are gone.

### Verified in this round

- `manifest.json`: 50 frames. Every team frame has 6 unique cards, opacity 1, 6 `mailto:` contact links, 0 canvases, no `pin-spacer`, 0 broken images.
- Reduced motion: 6 cards, opacity 1 × 6, `transform: none`, 0 canvases, no pin.
- Mobile 390×844: one 350×596 card per row, `scrollWidth === innerWidth`, no horizontal scroll.
- Footer: canvas 1416×900, all eight stickers landed, transforms identical 2.5 s apart, `data-physics="settled"`, still settled after scrolling away. Loop state is `idle → running → settled`; tab-hidden/unmount cancel the frame and clear the engine.
- Hero: 0 `<video>` elements, 0 sound buttons (there is no audio source); the reel pause/play control still toggles and flips its label.
- ProfileCard tilt: pointer move produced `--pc-rx: 2.2deg`, `--pc-ry: 3.2deg`, glare at 81.8 %, and both returned to `0.00deg` after leaving. One rAF loop exists only while a card is moving.
- No page errors or console errors in desktop, mobile or reduced-motion runs.

### Still missing

- `media.heroVideo` is empty, so the hero is still the generated gradient montage and sound must stay hidden. When a real reel with audio lands, set `heroVideo`; the sound button appears only if `loadedmetadata` reports an audio track, muted by default.
- `media.teamPhotos` is empty, so all six cards use monograms. Add files keyed by `aarav`, `isha`, `kabir`, `zoya`, `dev`, `meera`; the `<img>` path already has lazy loading, async decoding and a broken-image fallback.
- Member handles and personal contact addresses do not exist in the project, so cards show none. The contact button opens the studio inbox (`hello@desidraft.com`) with the member name in the subject rather than inventing personal addresses.
