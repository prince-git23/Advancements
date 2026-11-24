# FINAL MOTION AND 3D AUDIT — Desi Draft

Supersedes `MOTION_AND_INTERACTION_SPEC.md` as the record of what is actually running.

## 1. Stack and budget

Unchanged, and no dependency was added:

| Layer | What it is used for |
| --- | --- |
| GSAP 3.12 + ScrollTrigger | every scroll-driven tween, every masked reveal, page-transition band |
| Lenis 1.1 | smooth scroll, synchronised with ScrollTrigger through `src/lib/smooth.ts` |
| CSS 3D (`perspective`, `preserve-3d`) | hero depth, manifesto fan, project-card tilt, case-study parallax |
| Framer Motion | modals only (contact dialog, credits) |
| Matter.js | footer stickers only, loaded on intersection |

No Three.js, no WebGL context, no second renderer. Tokens (`ease`, `dur`, `stagger`) live in
`src/lib/motion.ts`; components use them or a `gsap.quickTo` with `power3.out`, which is the
same curve.

## 2. What changed in this pass

1. **Masked headings no longer cut descenders.** The `/services` headline "done properly."
   and "five things," lost the tails of `p`, `y` and `g` at every width: the mask span is
   `overflow: hidden` and its line box was 0.94 em tall, shorter than the glyphs. Each masked
   line in `Services.tsx` and `Manifesto.tsx` now carries `pb-[0.2em] -mb-[0.2em]`, and the
   reveal travel moved from 108–110 % to 132–135 % so the line is still fully hidden at rest.
   Verified on a 1:1 crop: both descenders print.
2. **The section order changed, so the scroll sequence changed.** Services now runs before the
   work section (`App.tsx`). No ScrollTrigger was pinned to either section, so nothing had to
   be re-timed; the intro pin and the manifesto's `-mt-[100svh]` overlap are untouched.
3. **The header scrim became opaque where the mark sits.** At 94 % the team heading ghosted
   through the wordmark. The scrim is now 96 px tall, solid to 58 %, then a short fade. This
   is a contrast change, not a motion change: no tween touches it, and the 320 ms colour
   transition between light and dark sections is kept.
4. **Hero lower band darkened** for the new chapter label and the headline over real media:
   `from-black/60 via-black/30 to-transparent`, 46 % of the frame. Static layer, outside the
   pointer-depth group, so it cannot drift.
5. **Motion was not added to the chapter markers.** They are editorial furniture; animating
   seven labels would be noise for no storytelling gain.

## 3. Motion map

| Section | Entrance | Scroll-linked | Pointer | Reduced motion |
| --- | --- | --- | --- | --- |
| Hero | word masks rise 112 % → 0, 1 s `power4.out`, 60 ms stagger; ellipse stroke draw; sparkle scale-in | shutter: shell height → 0 over 75 %, media `yPercent 7` + `scale 1.04`, headline `-18 %` fade | three layers at three rates: media ∓8/6 px, headline ±9/6 px, sticker ±22/16 px, `quickTo` 0.8 s | all words and strokes set to their end state, no pin shutter, no pointer depth |
| Intro | pinned sentence crosses once; letters scatter by their distance from viewport centre | pin `+=165%` desktop / `+=110%` below 768 px; paragraph fades in the last 16 % | none | static sentence and paragraph, no pin |
| Manifesto | three masked lines, 132 %, 100 ms stagger; cards rise 140 px | fan parallax, per-card speed 0.9–1.2, scrub | fan tilt ±8°, depth 14–30 px, pills −6 px | all set visible, no parallax or tilt |
| Services | masked heading, 135 %; rows `y 26` + fade, 70 ms stagger, `once` | none | row wash scales from the left; sticker rotates; evidence arrow slides | all visible immediately |
| Work | heading, featured block and cards fade/rise 24 px, 90 ms stagger, `once` | case-study frames only (separate route) | card tilt ±4° on a single rAF, `will-change` only while hovered | no tilt, no lift |
| Case study | cover and sections rise 22–28 px once, and only when they start below the fold | parallax on up to three full-bleed frames, desktop ≥ 1024 px, image scaled 1.06 | link/arrow micro-motion | parallax removed entirely |
| Team | cards `y 26` + fade, 70 ms stagger, `once` | none | ProfileCard tilt 5°, parallax 3, holo 0.35, glare 0.25 | static cards |
| Footer | stickers drop under gravity once, sleep when settled | none | drag/poke wakes the bodies | eight stickers parked in a static ring |
| Page change | diagonal band sweep, logo on top, 700 ms route swap, 2.1 s maximum | — | — | instant navigation, no band |

Every GSAP effect is created inside `gsap.context(...)` scoped to its section and reverted on
unmount; `matchMedia` handles the desktop-only parallax. Lenis is stopped while modals are
open and re-synchronised after route changes.

## 4. The 3D system

Depth is used where it explains something, and nowhere else.

- **Hero (01).** Three planes — media, headline, smiley sticker — move at different rates
  against a fixed shell. "Camera movement" without a camera: the frame holds still, the
  contents shift. The media layer has an 8 px bleed (`-inset-2`) so a parallax move can never
  expose an edge. Pointer input is pointer-fine only; touch devices get the static frame.
- **Manifesto (02).** Four polaroids on a `perspective: 1200px` stage, each with its own
  depth, tilting toward the cursor. This is the "physical print on a table" idea, and the
  cards are the studio's own crew, so the depth belongs to the content.
- **Portfolio (04).** `Tilt` in `ProjectCard.tsx`: `perspective(1100px)`, ±4°, written to
  `style` on one rAF, never a React render per pointer move, `will-change` applied on enter
  and released 500 ms after leave. Touch and reduced motion opt out.
- **Case study (06).** Only the full-bleed frames move: `scale 1.06` plus ±2.6 % `yPercent`,
  scrub 0.5, three frames maximum, desktop only. It reads as a camera drifting over printed
  work, and costs nothing while the page is still.
- **Three.js was not added.** There is no scene in this site where real geometry would say
  something the layered frames do not: no product to orbit, no space to walk, no simulation
  that carries the story. A WebGL renderer would add a second animation loop, a texture
  budget, a mobile fallback path and a canvas that has to be paused when invisible — for an
  effect that CSS perspective already delivers at 60 fps. The decision is recorded here so it
  is not mistaken for an unfinished item.

## 5. Verification

- `tsc --noEmit` clean; production build clean.
- Section entrance animations are `once: true` and guarded so anything already in view is never
  hidden — a deep link or restored scroll position cannot strand a block at `opacity: 0`.
- No second transform owner on any element: the hero's three layers are separate elements, the
  cards own their own transform, and the chapter labels are never transformed.
- No ScrollTrigger is created outside a scoped context; every effect reverts on unmount.
- Reduced-motion paths were re-checked in code for all ten effects above; the site renders its
  final state immediately, and the pinned sections unpin.
- Measured frame rate (see `FINAL_PERFORMANCE_AUDIT.md`): 60 fps in every section on hardware
  rendering, hero 4.4 % main-thread busy; software rendering drops the hero to 50.3 fps
  average with one 15.7 fps hitch during its first parallax frame.
