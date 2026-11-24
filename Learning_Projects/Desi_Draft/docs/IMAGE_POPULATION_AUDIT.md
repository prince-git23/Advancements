# Desi Draft — Image Population Audit

Every image container in the application, what fills it today, and what is still missing.
Audited against the running build (Vite preview on `127.0.0.1:4174`) and source, 2026-11-19.

**How to read the status column**

| Status | Meaning |
| --- | --- |
| `POPULATED · REAL` | An actual artefact from this studio (screenshot, drawing, exported sheet). |
| `POPULATED · CONCEPT` | A concept visualisation, printed as such on the image. Never shown as built work. |
| `DESIGNED` | Not an image slot: the card draws a live diagram in the DOM. Intentionally not a photo. |
| `EMPTY · PLATE` | Neutral asset plate naming the missing frame. Deliberate, not a broken image. |
| `EMPTY · MONOGRAM` | Team portrait fallback (typographic monogram). No synthetic faces are permitted. |

Paths marked `—` mean the slot has no `src` and renders the plate.

---

## 1. Home page (`/`)

| # | Section | Component | Project | Current asset | Slot size | Ratio | Required subject | Imgs | Status | Recommended replacement | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| H1 | Hero | `HeroMontage` | studio | `media.heroVideo` (empty) | full-bleed 1440×~820 | 16:9 → cover | 15–30s montage of real studio work | 1 film | EMPTY · gradient stand-in | Real reel; set `media.heroVideo` + `heroPoster` | Studio (film) |
| H2 | Work — featured | `WorkFeature` → `AssetFrame` | Flora Alchemy | `/images/portfolio/floral-alchemy/site-home-1440.webp` | 7 of 12 cols | 16:11 desktop / 4:5 phone | Live storefront home | 1 | POPULATED · REAL (live capture) | Recapture with `flora.mjs` after a client redesign | Live deployment |
| H3 | Work — website card | `ProjectCard` → `BrowserMockup` | desi draft dot com | `/work/desi-draft-home.jpg` | browser frame | 16:10 | Home page screenshot | 1 | POPULATED · REAL | Recapture after any redesign | Real capture |
| H4 | Work — website card, phone | `BrowserMockup` inset | desi draft dot com | `/work/desi-draft-mobile.jpg` | 24% of card, max 120px | 9:18 | Phone screenshot | 1 | POPULATED · REAL | Recapture at 390×844 | Real capture |
| H5 | Work — video card | `ProjectCard` | Cut to the Beat | `/images/portfolio/cut-to-the-beat/reel-cover-9x16.jpg` | max 330px wide | 9:16 | Reel cover, reads sound-off | 1 | POPULATED · REAL (artefact) | Swap for a real film still once a film exists | Code-rendered |
| H6 | Work — social card | `ProjectCard` → `AssetFrame` | Always On | `/images/portfolio/always-on/grid-plan-4x5.jpg` | card width | 4:5 | Month plan, 12 tiles with format diagrams | 1 | POPULATED · REAL (artefact) | Redraw if the monthly formats change | Code-rendered |
| H7 | Work — script card | `ProjectCard` → `ScriptBlock` | Hook, Turn, Payoff | none (DOM) | min-height 260px | fluid | Beat structure | — | DESIGNED | None | — |
| H8 | Work — brand card | `ProjectCard` → `AssetFrame` | Studio identity | `/images/portfolio/studio-identity/identity-sheet-16x9.jpg` | card width | 16:7 desktop | The identity in use: homepage, lockups, stickers, colour by role | 1 | POPULATED · REAL | — | Code-rendered |
| H9 | Team | `Team` → `ProfileCard` | 6 members | `media.teamPhotos` (empty) | 3/2/1 col grid | 4:5 | Six portraits, same light | 6 | EMPTY · MONOGRAM | Real portraits with written consent | Studio |
| H10 | Intro / Manifesto | `Intro`, `Manifesto` | studio | none | — | — | No image slots in this build | 0 | n/a | — | — |

## 2. Work index (`/work`, `/work?c=<discipline>`)

| # | Section | Component | Project | Current asset | Slot size | Ratio | Required subject | Imgs | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| W1 | Featured card (`row`) | `ProjectCard` | Flora Alchemy | live storefront capture | 6 of 12 cols | 4:3 → 16:9 | as H2 | 1 | POPULATED · REAL |
| W2 | Website card | `ProjectCard` | desi draft dot com | screenshots ×2 | as H3/H4 | 16:10 / 9:18 | as H3/H4 | 2 | POPULATED · REAL |
| W3 | Video card | `ProjectCard` | Cut to the Beat | reel cover | as H5 | 9:16 | as H5 | 1 | POPULATED · REAL |
| W4 | Brand card | `ProjectCard` | Studio identity | identity sheet | as H8 | 16:9 | as H8 | 1 | POPULATED · REAL |
| W5 | Social card | `SocialGrid` | Always On | DOM diagram | — | 3×3 | — | — | DESIGNED |
| W6 | Script card | `ScriptBlock` | Hook, Turn, Payoff | DOM | — | — | — | — | DESIGNED |
| W7 | Filtered empty state | `WorkIndex` | — | none | — | — | Text only, no image | 0 | n/a (correct) |

## 3. Case studies (`/work/<slug>`)

The cover is rendered by `CaseStudy` at a per-kind ratio; the "the work" section is rendered by `MediaStory`.

| # | Project | Frame | Current asset | Ratio | Required subject | Status |
| --- | --- | --- | --- | --- | --- | --- |
| F1 | Flora Alchemy | cover | `site-home-1440.webp` | 16:10 desktop / 4:5 phone | live storefront home | POPULATED · REAL |
| F2 | Flora Alchemy | the brand | `brand-logo.webp` | 1:1 | client mark + tagline | POPULATED · REAL (client) |
| F3 | Flora Alchemy | the work — lead | `atelier-table.webp` | 16:9 | the atelier table | POPULATED · REAL (client) |
| F4 | Flora Alchemy | the work — products | `product-blush-posy-960.webp` | 3:4 | blush lily & rose | POPULATED · REAL (client) |
| F5 | Flora Alchemy | the work — products | `product-sunshine-daisy-960.webp` | 3:4 | sunshine daisy | POPULATED · REAL (client) |
| F6 | Flora Alchemy | the work — products | `product-lily-960.webp` | 3:4 | blue & white lily | POPULATED · REAL (client) |
| F7 | Flora Alchemy | the work — paper | `deckled-card-set.webp` | 16:9 | deckled stationery + seals | POPULATED · REAL (client) |
| F8 | Flora Alchemy | the work — keepsake | `keepsake-box-open.webp` | 16:9 | open keepsake box | POPULATED · REAL (client) |
| F9 | Flora Alchemy | the work — the note | `letter-and-wax-seal.webp` | 16:9 | handwritten note + wax seal | POPULATED · REAL (client) |
| F10 | Flora Alchemy | the making ×4 | `chenille-lavender`, `dried-bundle`, `single-stem-pot`, `sunflower-charm` | 16:9 each | materials and craft | POPULATED · REAL (client) |
| F11 | Flora Alchemy | the interface ×4 | `site-shop`, `site-product`, `site-custom-gifts`, `site-gift-finder` | 16:10 each | deployed interface | POPULATED · REAL (live capture) |
| F12 | Flora Alchemy | the packaging ×3 | `keepsake-box-ribbon`, `pressed-botanical-card`, `wrapped-posy-tag` | 16:9 each | packing and finishing | POPULATED · REAL (client) |
| F13 | Flora Alchemy | on a phone | `site-home-mobile-390.webp` | 390:844 | the same shop at 390 px | POPULATED · REAL (live capture) |
| C7 | desi draft dot com | cover | `desi-draft-home.jpg` | 16:10 | home screenshot | POPULATED · REAL |
| C8 | desi draft dot com | gallery 1 | `desi-draft-work.jpg` | 16:10 | work index screenshot | POPULATED · REAL |
| C9 | desi draft dot com | gallery 2 | `desi-draft-mobile.jpg` | 9:19.5 | phone screenshot | POPULATED · REAL |
| C10 | Cut to the Beat | cover | `reel-cover-9x16.jpg` | 9:16 | reel cover | POPULATED · REAL |
| C11 | Cut to the Beat | gallery 1 | `hook-frame-9x16.jpg` | 9:16 | hook frame | POPULATED · REAL |
| C12 | Cut to the Beat | gallery 2 | `timeline-1x1.jpg` | 1:1 | beat-marked timeline | POPULATED · REAL |
| C13 | Cut to the Beat | gallery 3 | `end-card-16x9.jpg` | 16:9 | 16:9 end card | POPULATED · REAL |
| C14 | Always On | cover | `grid-plan-4x5.jpg` | 4:5 | month grid plan | POPULATED · REAL |
| C15 | Always On | gallery 1 | `post-set-1x1.jpg` | 1:1 | three-post set | POPULATED · CONCEPT |
| C16 | Always On | gallery 2 | `reel-cover-9x16.jpg` | 9:16 | sound-off reel cover | POPULATED · REAL |
| C17 | Hook, Turn, Payoff | cover | `beat-sheet-16x9.jpg` | 16:9 | annotated beat sheet | POPULATED · REAL |
| C18 | Hook, Turn, Payoff | gallery 1 | `storyboard-4x3.jpg` | 4:3 | three storyboard frames | POPULATED · REAL |
| C19 | Studio identity | cover | `identity-sheet-16x9.jpg` | 16:9 | identity in use: live site, lockups, stickers, colour by role | POPULATED · REAL |
| C20 | Studio identity | gallery 1 | `type-specimen-16x9.jpg` | 16:9 | four faces, settings, character sets | POPULATED · REAL |
| C21 | Studio identity | gallery 2 | `sticker-sheet-16x9.jpg` | 16:9 | sixteen die-cuts | POPULATED · REAL |
| C22 | all | related cards | `p.cover` forced to 4:3 | 4:3 | thumbnail | POPULATED for 5 of 6; plate for none |

### Composition pass — what was corrected

- `Studio identity`: the cover no longer shows an isolated oversized wordmark over empty
  field. It shows the system applied — a real capture of the homepage, the lockups, the
  sticker set, the wordmark size ladder, and colour shown on the surfaces it governs instead
  of a raw swatch row. The case-study card no longer draws a second DOM palette strip; the
  readable `PalettePlate` table remains, the duplicated DOM type plate is gone (the specimen
  frame carries it), so the page shows the palette once and the type once.
- `Always On`: the empty-tile wireframe is replaced by the plan itself — twelve numbered,
  format-labelled tiles, each with its composition diagram, and the one open slot drawn as an
  open slot. The case study no longer repeats the plan as a second DOM diagram.
- `Hook, Turn, Payoff`: the beat sheet's central void now carries the seven-shot column and the
  four script lines with timecodes; the storyboard frames carry shot, timecode and lens.
- `Cut to the Beat`: the hook frame gains the three frames and their timings, the end card
  gains the three master ratios drawn at their own proportions.
- Caption overlays use a compact pill rather than a full-width dark gradient, which read as a
  grey strip across pale sheets; captions stay legible on both photographs and paper-white boards.

No layout, typography, colour, navigation, breakpoint, animation or card proportion changed;
filenames and asset ratios are unchanged.

## 4. Gaps that remain after this pass

| Gap | Where | Why it is still empty | Owner |
| --- | --- | --- | --- |
| Finished Floral Alchemy room | C6 | The room has not been fitted out. Showing a render here would be the one dishonest frame on the site. | Studio / client |
| Hero reel | H1 | No film exists. The gradient montage is a stand-in, not a claim. | Studio (edit) |
| Six team portraits | H9 | No photography, no portrait rights. Synthetic faces are ruled out. | Studio |
| Real film for Cut to the Beat | C10–C13 | No client film released. The frames are the format's own cover system. | Studio (edit) |
| Studio photograph | Intro | Not needed by the current layout. | Studio |
| Client logo wall | — | Section deleted; the ten previous tiles were fictional. | Client |

## 5. Confirmed non-problems

- **No broken paths.** Every `src` in `portfolio.ts` resolves inside `public/` (verified over HTTP: 200).
- **No stretched images.** Every frame is `object-cover` inside an `aspect-ratio` box; source ratios match the slot `ratio` in all 18 populated frames.
- **No layout shift.** Every image sits in a wrapper with an explicit `aspect-ratio`, so the box is reserved before the file arrives.
- **No empty carousels.** There is no carousel left in the codebase; the two that existed were removed with the fictional work data.
- **No fake play buttons.** The play glyph only renders when `cover.src` matches `.mp4|.webm|.mov`.
- **No duplicated slides.** Each slot is keyed by its `slot` string; no asset appears twice within one gallery.
