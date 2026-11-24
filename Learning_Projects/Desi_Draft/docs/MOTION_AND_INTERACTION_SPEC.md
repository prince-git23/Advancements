# Desi Draft — Motion and Interaction Specification

Audit of what actually animates, how, and the rules new motion must follow. Numbers are read from the source, not estimated.

## 1. Stack

| Layer | Library | Where |
| --- | --- | --- |
| Scroll + timeline | GSAP 3.12 + ScrollTrigger | `src/lib/smooth.ts` |
| Smooth scroll | Lenis 1.1 | `src/lib/smooth.ts` (`initSmoothScroll`) |
| Component transitions | framer-motion 11 | `Header.tsx`, `Modal.tsx` |
| Physics | Matter.js 0.20 | `Footer.tsx` (lazy import) |
| Everything else | CSS transforms / keyframes | `src/index.css`, `styles/layers.css` |

No WebGL, no three.js, no canvas 3D. The old six-renderer lanyard is gone (`audit/REPORT.md`).

## 2. 3D audit — what is real

| Element | Technique | Depth | Status |
| --- | --- | --- | --- |
| Manifesto fan | CSS `perspective: 1200px` on `.fan-stage`, GSAP `rotationX/Y` + translate per card | Pseudo-3D, max ±8° | Real perspective, not a 3D scene |
| Manifesto pile | `rotate()` + `translateY()` per card | 2D | Static composition |
| ProfileCard | pointer tilt, parallax, holo/glare gradients in CSS | Pseudo-3D | `src/components/ui/ProfileCard.jsx` |
| Hero | `translateY`, `height: 0` shutter | 2D | Pinned 75% |
| Footer stickers | Matter.js 2D rigid bodies | 2D | Physics, not 3D |
| Portfolio | image scale, grid reveal | 2D | — |

**Conclusion: there is no WebGL or three.js on the site, and none should be added.** "3D" in this project means CSS perspective only. Any documentation calling it a 3D scene is wrong.

### Perspective behaviour, by viewport

- `.fan-stage` uses `perspective: 1200px` regardless of width; card size comes from `--size` (CSS custom property, 96–108 desktop) and is re-measured on phones via the `.fan-card` media rules in `index.css`.
- Pointer tilt is disabled on coarse pointers (`useIsTouch`) and under reduced motion.
- No camera, so no clipping, DPR or context-loss handling is required. The only canvas (footer) is sized to CSS pixels ×1 and pauses when off-screen or hidden.

## 3. Section-by-section motion

| # | Section | Motion | Trigger | Duration / ease | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| 1 | Preloader | wordmark fill, counter, curtain | mount | ~1.6s | skipped |
| 2 | Hero | masked word reveal (`yPercent 112 → 0`), SVG ellipse + underline draw, sparkle pop, smiley pointer drift | `dd:ready` or 4s fallback | 1s `power4.out`, stagger 0.06 | words set to final, fades set visible |
| 3 | Hero scroll-out | shell height → 0, headline up 18%, controls fade | pinned 75% | scrub 0.6 | pin removed entirely |
| 4 | Intro | letter scatter, sticker drift, paragraph fade, pinned 300% | ScrollTrigger progress | per-frame JS writer | static centred statement |
| 5 | Manifesto | line masks, fan rise, per-card parallax, pointer tilt | scroll + pointer | 1.1s `power4.out`, stagger 0.1 | all static |
| 6 | Work | grid stagger, card reveal, filter replay | scroll / filter change | 0.6–0.7s `power3.out` | no transforms, all visible |
| 7 | Team | card stagger | scroll, once | 0.65s `power3.out`, 0.07 stagger | static |
| 8 | Services | heading line masks, row stagger, hover colour wash | scroll / hover | 0.6s, 550ms wash | static |
| 9 | Footer | Matter sticker drop, settle, sleep | in-view + lazy import | physics, ~1–3s | stickers parked statically |
| 10 | Route change | diagonal band sweep + logo, route changes at 700ms | link click | 0.7s `power4.inOut` | instant navigate |
| 11 | Case study | cover + section reveal (added this pass) | scroll, once | 0.7–0.8s `power3.out` | none, content visible |

## 4. Interaction rules

1. **One video plays at a time.** `AssetFrame` keeps a module-level `playing` set and pauses every other element on `play`.
2. **Never autoplay audio.** Mute controls render only when the decoded file actually has an audio track (`mozHasAudio`, `webkitAudioDecodedByteCount`, `audioTracks`).
3. **Pause when unseen.** Videos pause on `visibilitychange`; the footer simulation stops when out of view or hidden, and marks `data-physics="settled"` when asleep.
4. **Hover is never the only affordance.** Cards are links with visible arrows and focus rings; filter buttons are real buttons.
5. **Filters preserve the grid.** `planLayouts(total)` composes the filtered result so a single project gets a horizontal split, not a hole.
6. **Mouse, keyboard, touch.** ProfileCard tilt is pointer-only; all navigation is focusable; no interaction depends on hover on touch.
7. **Scroll budget.** Two pinned sections only (hero 75%, intro 300%). No new pins without removing one.

## 5. Reduced motion contract

`usePrefersReducedMotion()` is the only switch, plus `reducedMotion()` in `lib/motion.ts` for non-React paths.

When reduced:

- All GSAP timelines are not created (effects early-return), so content is in its final position.
- The hero pin is removed; the intro becomes a static centred sentence.
- The footer renders stickers in fixed, non-overlapping positions and never imports Matter.
- Route transitions navigate immediately.
- Hover transforms are disabled by CSS `@media (prefers-reduced-motion: reduce)`.

Verified in `audit/` reduced-motion frames: 0 hidden elements, 0 active transforms.

## 6. Adding motion — rules

1. Animate for hierarchy or storytelling; if it does neither, don't.
2. Max one new scroll trigger per section; scope every GSAP call in `gsap.context()` and `revert()` on unmount.
3. Never animate more than ~12 elements in one stagger.
4. Durations: 0.3–0.4s for UI feedback, 0.6–0.9s for entrances, 1s+ only for hero/route.
5. Eases: `power3.out` for entrances, `power4.inOut` for transitions, `none` for scroll-linked. No bounce except the hero sparkle.
6. Transform and opacity only. Never animate `width`, `height`, `top` or `left` outside a measured, pinned writer.
7. Every addition ships with a reduced-motion branch and an audit frame.

## 7. Known motion risks

| Risk | Detail | Mitigation |
| --- | --- | --- |
| Hero frame rate | the montage animates large layered gradients. Current sample: 60 fps on GPU, 43.8 fps under software rendering (`audit/perf.json`). An older 22.8 fps sample predates the portfolio rebuild. | Accepted; a real reel would replace the montage. Do not add more layers. |
| Intro is a 300% pin with a per-frame JS writer | expensive on low-end phones | already reduced-motion aware; consider shortening to 220% |
| Footer physics | Matter is 86 kB lazy | imported only in view; sleeps when settled |
| Case-study reveals | new in this pass | `once: true`, opacity + 26px translate only |
