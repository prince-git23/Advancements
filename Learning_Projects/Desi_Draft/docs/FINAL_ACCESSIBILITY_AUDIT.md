# FINAL ACCESSIBILITY AUDIT — Desi Draft

Target: **WCAG 2.2 AA**, checked against the production build (`vite preview`, port 4174),
not the dev server. Probe: `audit/tools/a11y.mjs`, run over `/`, `/work` and
`/work/floral-alchemy` at 1440 × 900.

## 1. Automated results

| Check | `/` | `/work` | `/work/floral-alchemy` |
| --- | --- | --- | --- |
| Images without `alt` | 0 | 0 | 0 |
| `<h1>` per page | 1 | 1 | 1 |
| Heading-level skips | 0 | 0 | 0 |
| Controls with no accessible name | 0 | 0 | 0 |
| Focus stops with a visible ring | all sampled | all sampled | all sampled |
| Text below 4.5:1 (10–15 px) | 6 | 2 | 0 |

The "below 4.5:1" entries are **not** failures of the interface text. Every one is a caption
printed over a project photograph (`text-[10px] text-cream/90` on the asset plates, e.g.
"HOME, 1440 × 900", "9:16 MASTER"). The probe cannot resolve a background that is an image, so
it reports them against white and returns ratios around 1.0. Inspected in the captures, those
captions sit on the dark gradient band inside the frame and read clearly. They are recorded
here as a measurement limitation, not silently dropped.

## 2. What this pass changed

1. **Chapter labels entered the page.** Seven 10 px labels ("01 the idea" … "07 the
   connection"). Ink on cream measures 5.4:1; cream over the ink team section measures 16.5:1.
2. **The footer label failed AA and was fixed.** Cream on royal (#4B63E8) measures 4.12:1 —
   below the 4.5:1 floor for 10 px text. It now sits on the same cream pill the footer already
   uses for its three columns (`bg-cream text-ink`), which measures 16.5:1. The accent rule
   inside it is decorative and one pixel tall, so it carries no information on its own.
3. **The team note** ("portraits in progress · roles shown as credited") moved from `cream/65`
   to `cream/70`, which is a measured improvement on ink and still subordinate to the names.
4. **Header scrim.** Not an accessibility item by itself, but the reason it changed: the fixed
   wordmark sat on a scrolling heading at 94 % opacity, which is a legibility problem for both.
   It is now solid where the mark is.
5. **No interaction was added that depends on hover.** The new service evidence links are real
   links with an underline-free but colour-changing hover; keyboard focus uses the global ring.

## 3. Baseline guarantees held in place

- **Headings**: one `h1` per route, sections use `h2`, cards and case-study blocks use `h3`.
  `/work` has an `sr-only` `h2` so the filtered grid is not an orphaned list.
- **Keyboard**: skip path through the header, nav, work menu, every card, filters and footer;
  the contact dialog traps focus, closes on `Escape`, and restores focus to the opener.
  Captured focus stops all show the same 2 px ring with offset.
- **Images**: every meaningful frame carries a description of what it is, not "image". Purely
  decorative art (`SplatBlob`, `TickMarks`, `Sparkle`, sticker die-cuts) is `aria-hidden`.
- **Video**: the hero ships no film, so there is no speech to caption. When a reel arrives it
  needs captions and a transcript; there is a sound control that only appears if the file
  actually carries an audio track.
- **Motion**: `prefers-reduced-motion` removes the intro pin, the hero shutter, both pointer
  depths, the fan parallax, card tilt, case-study parallax, and parks the footer stickers in a
  static ring. All content is visible immediately in that mode.
- **Targets**: icon buttons are 32–36 px, footer socials 36 px, all above the 24 px AA minimum.
- **Language**: `lang="en"` on the document; the studio's Hinglish lines ("chai > coffee",
  "shaadi season = content season") are Latin-script and read correctly without a `lang` switch.
- **No essential information is hover-only**: status chips, evidence links, service items and
  case-study metadata are always in the DOM and always visible.

## 4. Documented exceptions

| Item | Ratio | Why it stays |
| --- | --- | --- |
| Tangerine "work" burst in the header | ≈ 3.1:1 against cream | It is the studio's mark, not text: the word inside it is set at 15 px bold on a saturated die-cut. Raised as far as the brand colour allows without changing the mark's colour. |
| 10 px captions over photographs | probe-unmeasurable | Actual presentation is cream on a dark band inside the image; verified visually at 1440 and 390. |

## 5. Not verified here

- A real screen-reader pass (NVDA / VoiceOver). The probe checks the accessibility tree, not
  the spoken experience, and no screen reader is available in this environment.
- 400 % zoom / 320 px reflow. 360 px was measured with no horizontal overflow, which is the
  closest proxy available without a zoom harness.
- Windows High Contrast / forced-colours mode. The site does not use `forced-colors` media
  queries; its borders are true borders, but this was not tested.

---

## 6. Team, testimonials and footer pass

### 6.1 Controls

| Control | Height | Name | State |
| --- | --- | --- | --- |
| work with us (footer 01) | 48px | visible text | hover fills cream, 2px outline |
| start a project (footer 03) | 56px | visible text | hover fills lime, 2px cream outline |
| back to top | 40px | visible text | 2px cream outline |
| credits | 40px | visible text | 2px cream outline |
| Instagram | 44 × 44px | `Instagram — @desidraftt.co` | 2px cream outline |
| say hi (each team card) | 40px on a phone, 34px above | `Contact desi draft about <name>` | 2px outline |

`team-footer.mjs` asserts the start-project control is at least 44px at all
twelve widths, that no footer control is under 32px, that every footer control
is tabbable (5), that a keyboard-focused control paints a 2px outline, and that
the primary CTA opens the contact dialog rather than pointing at a dead href.

The team card contact button remains 34px on pointer devices (its 40px phone
size is unchanged); it is inside a card whose whole surface is the target, and
it carries an explicit `aria-label`. Recorded here rather than restyled, because
the ProfileCard is shared with the case studies.

### 6.2 Text contrast

Ratios computed from the rendered colours (WCAG 2.x relative luminance), not
estimated by eye.

| Element | Size | Colour | Ground | Ratio |
| --- | --- | --- | --- | --- |
| testimonial quote | 17px | ink 84% | #F7F3EA | **12.07** |
| reviewer name | 17px | ink | #F7F3EA | **17.88** |
| role / company | 11.5px | ink 66% | #F7F3EA | **6.30** |
| footer group copy | 14px | `#FAF8F4` | royal #4B63E8 | **4.66** |
| footer bottom line | 11px | `#FAF8F4` | royal | **4.66** |
| work with us (label) | 15px | cream | ink pill | **16.51** |
| back to top (label) | 12px | `#FAF8F4` | royal | **4.66** |
| team roles line | 12px | cream 70% | ink #0A0A0A | **8.26** |
| team card role | 13px | ink 62% | card surface | **5.34** |
| draft badge | 10px | ink | lime | **17.59** |

Two real failures were found by measurement and fixed rather than documented:

1. **Footer body copy** at cream 85% on royal measured **3.43:1** — under AA at
   14px. Brand cream itself is only 4.12:1 on cobalt, so no opacity of it can
   pass. Small footer copy now uses `#FAF8F4` (4.66:1, visually the same family)
   via `.footer-text`; display headings stay brand cream, which clears the 3:1
   large-text floor.
2. **Team status badges** were cream on every band: 4.12:1 on aarav's royal,
   **2.84:1** on isha's coral. The badge ink now follows the band — `#FAF8F4` on
   royal and forest, ink on coral — all above 4.5:1 at 10px bold uppercase.

`a11y.mjs` re-run after the fix: the footer copy no longer appears in the low
list. The remaining reported entries are the known image-background captions the
probe cannot resolve (it measures them against white). One unrelated finding was
left alone: `/work/studio-identity` jumps h1 → h3 in `StudioStudies` (a
case-study heading level, outside this pass).

### 6.3 Semantics

- Testimonial cards are `<figure>` / `<blockquote>` / `<figcaption>`; the
  duplicated loop cards are `aria-hidden`, so each reviewer is announced once.
- Social links carry visible-to-AT labels and never point at a platform
  homepage (`team-footer.mjs` fails the run if they do).
- The footer bottom bar is a real row after the wordmark in reading order, so
  "back to top" is not an absolutely positioned afterthought.
- Reduced motion: the marquee is replaced by a static grid, the sticker physics
  never runs (`physics=none`), and the team cards render without the GSAP
  entrance (existing behaviour, re-checked).
