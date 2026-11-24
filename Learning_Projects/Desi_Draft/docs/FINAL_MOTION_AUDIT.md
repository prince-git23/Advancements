# FINAL MOTION AUDIT — Desi Draft

> Superseded by `docs/FINAL_MOTION_AND_3D_AUDIT.md` (chapter restructure, mask retune, current
> measurements). Kept for the earlier pass's detail.

Motion stack unchanged: **GSAP 3.12 + ScrollTrigger + Lenis 1.1**, with Framer Motion used only
inside modals, Matter.js only inside the footer, and no new dependency added in this pass.

Tokens live in `src/lib/motion.ts` (`ease.out|soft|pop|pill|wipe`, `dur.xs…lg`,
`stagger.tight|base`) and every scroll goes through `scrollToTarget()` in `src/lib/scroll.ts`.
Components do not invent their own curves; where a literal is used it is a GSAP quickTo with an
explicit `power3.out`, matching `ease.soft`.

---

## 1. The system, section by section

| Section | Motion | Purpose |
| --- | --- | --- |
| Preloader | Count + wipe, then `dd:ready` event | Gate the hero reveal; fires an event rather than a timer so the two never race |
| Hero — entrance | Word masks (`.hero-word-inner`, `yPercent 112 → 0`, 1 s, `power4.out`, 0.06 stagger) + hand-drawn ellipse stroke draw (0.9 s) + sparkle `back.out(2)` | Headline arrives as typography, not as a fading block |
| Hero — pointer depth | Three layers move at different rates: media ∓8 px, headline ±9 px, sticker ±22 px (0.8 s quickTo) | Dimensional separation without a WebGL renderer |
| Hero — scroll | 75 % pin: shell height → 0 ("shutter"), media `yPercent 7` + `scale 1.04`, headline `yPercent -18` + fade | Hands the page over to the intro instead of scrolling a static poster |
| Hero — media | `HeroMontage` cuts six gradient looks every 2.6 s; pauses when the tab is hidden or the reel is paused | Reads as footage while there is no reel |
| Intro | Pinned horizontal travel, per-character transform (y / rotate / scale by distance from the viewport centre), sticker drift, paragraph fade after 84 % | One sentence crossing the screen; the only section that moves sideways |
| Manifesto | Line masks (0.1 stagger), fan cards rise (0.12 stagger), per-card scroll parallax (`data-speed`), pointer tilt ±8° with pill counter-parallax | Depth on the portrait fan |
| Work | Section reveal (0.09 stagger), card tilt ±4° on `perspective(1100px)` (pointer-fine only), image `scale 1.02` on hover | Hover affordance with a real target, not decoration |
| Team | Card stagger (0.07) + ProfileCard rAF tilt/glare/holo, disabled for touch and reduced motion | Six objects, one composition |
| Services | Heading masks, row stagger (0.07), colour wipe on hover (scale-x) | Ties each discipline to its colour |
| Footer | Matter.js stickers drop once the footer enters view, settle, then the loop stops; visibility-aware; reduced motion parks them statically | The one playful moment, with a hard stop |
| Route change | Diagonal band 0.7 s in / 0.7 s out, logo fade, route swaps at 700 ms | Continuity between pages |

## 2. What this pass changed

1. **Hero annotation was not drawing.** The hand-drawn ellipse and underline were set to
   `strokeDashoffset: 1` at mount and animated to 0 on `dd:ready`. In production the reveal
   sometimes never fired, leaving both permanently invisible — measured `strokeDashoffset: 1px`
   on a settled page at both 1440 and 390. The strokes are now part of the guaranteed state:
   the reduced-motion branch draws them immediately, and a 4.2 s watchdog reveals them if the
   timeline never runs. Verified at 4.2 s: all paths `0px`.
2. **One annotation instead of two.** With the strokes finally visible, the ellipse and the
   wobbly underline collided under "mainstream". The underline was removed and the ellipse
   retuned to sit around the word. Fewer marks, same gesture.
3. **Hero depth added** (media / headline / sticker at three rates) with 8 px of media bleed
   (`-inset-2`) so the deepest layer can never expose an edge. Max displacement is 8 px — it
   reads as parallax, not as a moving image.
4. **Intro pacing.** Pin 300 % → 165 % desktop / 110 % mobile. The sentence still crosses the
   viewport exactly once; the section no longer holds three screens for it. ScrollTrigger is
   created inside `gsap.context()` and reverted on unmount, as before.
5. **Card stagger and reveals untouched.** Section entrances were already at 0.6–0.9 s with
   `power3.out` and single-fire triggers; changing them would have been churn.

## 3. Performance discipline kept

- All timelines are created inside `gsap.context(scope)` and reverted on unmount; no duplicated
  ScrollTriggers after navigation (team/work/services re-mount cleanly).
- `will-change` is set on a card's tilt only while the pointer is over it, and cleared 500 ms
  after leave (scoped in the previous pass, still in place).
- The footer's Matter.js bundle is imported on first intersection, not on first paint.
- The hero montage and the footer loop both stop on `visibilitychange`.
- Videos play one at a time (`playing` set in `AssetFrame`) and pause when hidden.
- No new RAF loop was added: the hero pointer depth uses GSAP `quickTo` on the existing ticker.

Measured with `audit/tools/perf.mjs` after the changes:

| Section | Hardware (GPU) | Software fallback |
| --- | --- | --- |
| hero | 60 fps, 4.8 % busy | 46 fps, 6.3 % busy |
| intro | 60 fps, 5.3 % | — |
| manifesto | 60 fps, 6.0 % | — |
| work | 60 fps, 7.6 % | — |
| team (cards / idle / scroll) | 60 fps, 9.7 / 9.2 / 14.1 % | 60 fps, 20.4 / 17.7 / 23.9 % |
| services | 60 fps, 11.6 % | — |
| footer | 60 fps, 13.8 % | 60 fps, 12 % |

No long tasks were recorded in any section. The software pass is the stress case (no GPU
compositing) and still holds 60 fps everywhere except the hero montage.

## 4. Reduced motion

`usePrefersReducedMotion()` is read on first render, so reduced trees never build an animation
they then have to undo. With the preference on: Lenis is not initialised, the hero words and
strokes are set to their final state, the intro renders a static sentence + paragraph, the
manifesto and cards skip entrance tweens, the footer parks its stickers in a fixed ring, and the
route transition navigates immediately. Verified by computed style, not by eye alone.

## 5. Not done, and why

- **No Three.js scene.** The brief allows it "where genuine 3D is justified". Here the depth is
  parallax, tilt and layered type; a WebGL scene would add a renderer, a texture budget and a
  mobile fallback for no storytelling gain, and the site's own rule is that decoration must do
  work. CSS 3D + GSAP `quickTo` covers every depth cue the design actually uses.
- **No pinned case-study camera moves.** Case studies already carry a cover reveal, section
  reveals and ≤2.6 % parallax on full-bleed frames; a pinned sequence per project would make a
  long page longer.

## 6. Selected Work stack, pass 2026-11-23

`src/components/ui/ScrollStack.tsx` is the published ReactBits component (JS + CSS) ported to
TypeScript, with one deliberate change: `smoothScroll` defaults to **false**. Lenis already owns
wheel smoothing; ScrollStack's independent glide would be a second scroll controller. Nothing in
the stack writes `window.scrollTo` unless glide is explicitly enabled, and it is not.

Configuration used:

| Prop | Desktop ≥1024 | Phone <640 | Why |
| --- | --- | --- | --- |
| `useWindowScroll` | `true` | `true` | window-level sticky; no nested scroller |
| `smoothScroll` | `false` | `false` | Lenis stays the only wheel controller |
| `itemDistance` | 90 | 24 | travel between projects; shorter cards need less |
| `itemStackDistance` | 24 | 8 | visible deck edge |
| `stackPosition` | `14%` | `10%` | clears the fixed header |
| `itemScale` / `baseScale` | 0.025 / 0.93 | 0.015 / 0.97 | ≤7 % shrink; the phone deck barely recedes |
| `dimAmount` | 0.38 | 0.30 | covered cards recede |
| `blurAmount` / `rotationAmount` | 0 / 0 | 0 / 0 | no decorative blur or spin |
| `tiltAmount` | 1 | 0 | no 3D lean on a touch deck |
| `holdDistance` | 120 | 60 | short hold after the last card |
| `snap` | `false` | `false` | scroll never gets taken away from the user |

A phone card is capped at `calc(100svh - 150px)`, so the pinned card is always shorter than the
screen; the twelve-post grid and the three-frame storyboard live inside that panel as horizontal
swipe rails instead of stretching the card. Tablet (640–1023) is the only width that renders the
plain list.

`workstack.mjs` verifies the first card's `top` does not move while the page scrolls under it, that
only one preview video is unpaused at a time, and that the Cut film pauses as soon as its card is
covered.

**Video.** Two real moving assets: `public/video` already had the 9:16 master; this pass added a
recorded scroll of the live Flora Alchemy storefront (`public/videos/flora-alchemy-scroll.mp4`,
1.15 MB, 8.8 s, H.264, no audio). Cut to the Beat autoplays muted while front; the Flora recording
starts paused on its poster (a scroll recording that autoplays reads as a broken screenshot at the
crop), with a 40px play control. Both pause and reset when their card is not front, and both carry
a poster so no empty frame is ever painted.

**Motion removed.** The old filter-change stagger (GSAP `fromTo` over `.sw-item`) is gone with the
filters themselves: the home showcase no longer starts a tween on mount, and the only per-frame
work in the section is ScrollStack's single `requestAnimationFrame` for transforms.

**Reduced motion.** The stack is not rendered at all; the five cards render as `.sw-card--static`
at every width, so no pinning, no transforms and no autoplay. All copy, media and links remain.

**Cleanup.** ScrollStack removes its scroll/wheel/pointer/resize listeners, disconnects its
`ResizeObserver` and cancels both rAF handles on unmount; the preview videos are paused on
unmount.
