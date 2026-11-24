# Desi Draft — Portfolio Content Requirements

Inventory of every portfolio entry in `src/data/portfolio.ts` as of 2026-11-18, with the information state of each field. States: **VERIFIED** (in the repo or produced by it), **MISSING**, **NEEDS CONFIRMATION**, **IN PROGRESS**, **AWAITING PERMISSION**, **NOT FOR PUBLICATION**.

No field below has been filled with invented content.

## 0. Model

`PortfolioProject` (see `src/data/portfolio.ts`) holds: id, slug, title, optional titleAside, category, kind, status, client, standfirst, intro, challenge, approach, role[], services[], deliverables[], phase, cover `MediaSlot`, gallery `MediaSlot[]`, process[], facts[], optional seo, optional legacySlugs, plus optional coverFit, live {url,label}, brand, interfaceShots, phoneShot, materials, packaging for shipped projects.

`MediaSlot` holds: `src?`, `srcSet?`, `poster?`, `width?`, `height?`, `ratio`, `slot` (what the frame is), `alt`, `caption?`, `credit?`, `url?`. When `src` is absent the site renders a neutral "frame not shot" plate — never a synthetic photograph.

## 1. Flora Alchemy — `/work/floral-alchemy`

Rewritten 2026-11-19 against the live storefront at
`https://flora-alchemyy.vercel.app/`. The earlier café/interior brief was a
different business and has been withdrawn: nothing below refers to it.

| Field | Value | State |
| --- | --- | --- |
| Public name | **Flora Alchemy** (spelling from the live site) | VERIFIED |
| Route | `/work/floral-alchemy`; `/work/floral-meets-graffiti` redirects | VERIFIED |
| Headline aside | *sculpting a botanical digital experience* | STUDIO COPY |
| Category | Websites & Digital (`web`) | VERIFIED |
| Kind | feature (full-width, split card) | VERIFIED |
| Client | flora alchemy — botanical keepsakes | VERIFIED (public brand) |
| Status | live | VERIFIED — the storefront is open |
| External link | `https://flora-alchemyy.vercel.app/` | VERIFIED |
| Brand facts | tagline “Sculpted Nature. Hand-Bound Memories.”; handmade botanical keepsakes in small batches; 3 catalogue pieces; INR pricing | VERIFIED from the live site |
| Real media | 14 client photographs + 6 live screen captures, WebP, credited per frame | VERIFIED |
| Interface evidence | shop, product page, Custom Gift Studio, Gift Finder, phone home | VERIFIED (captures) |
| Role | website design, frontend development, product presentation, responsive experience, e-commerce interface | NEEDS CONFIRMATION against studio records |
| Images stale after a redesign | recapture with `audit/tools/flora.mjs` | PROCESS |
| Testimonial / metrics | none published | BY POLICY |

**Requirement:** every frame is the client's own published photography or a
capture of the deployed site. No concept render, no café interior, no generated
product image, and no claim about design work beyond the role list above until
the studio confirms it.

**Media provenance:** see `docs/IMAGE_ASSET_REGISTER.md` §3. Reuse off the
client's domain needs written permission; the credit line is printed on every
frame.

## 2. desi draft dot com — `/work/desi-draft-dot-com`

| Field | Value | State |
| --- | --- | --- |
| Category | Websites & Digital | VERIFIED |
| Client | the studio itself | VERIFIED |
| Status | live | VERIFIED |
| Real media | 3 screenshots captured from the production build (`public/work/desi-draft-home.jpg`, `-work.jpg`, `-mobile.jpg`) | VERIFIED |
| Challenge / approach | bundle weight, six WebGL renderers removed, routing, reduced motion | VERIFIED from `audit/REPORT.md` |
| Deliverables | responsive one-pager, typed portfolio, motion with reduced-motion paths, audit harness | VERIFIED |
| Outcome | build size, measured fps, overflow tests | VERIFIED in `audit/perf.json` |
| Client permission | own work | VERIFIED |
| Testimonial | none | MISSING |
| Metrics on the public page | deliberately omitted — audit numbers live in `audit/`, not in the case study | BY POLICY |

Two entries now carry real media (this one and Flora Alchemy). Its screenshots must be regenerated whenever the design changes materially, or the case study shows a site that no longer exists.

## 3. Cut to the Beat — `/work/cut-to-the-beat`

| Field | Value | State |
| --- | --- | --- |
| Category | Video & Motion | VERIFIED |
| Client | studio format | VERIFIED |
| Status | in development | VERIFIED |
| Real media | **none** — no film, no stills, no audio | MISSING |
| Client film | not released; not shot/cleared per `phase` | MISSING |
| Formats | 9:16, 1:1, 16:9 native sequences | VERIFIED as method |
| Lengths | 15s, 30s, 45s | VERIFIED as method |
| Outcome / metrics | none | MISSING |

**Requirement:** this is a *format*, not a completed client project. The card must never show a play control that implies a film is available. Current state: the play glyph is decorative on the asset plate and should be removed or labelled.

**Media needed:** one 15s vertical master with a 1:1 and 16:9 version of the same cut, plus poster frames. Until then the three ratio plates stay empty.

## 4. Always On — `/work/always-on`

| Field | Value | State |
| --- | --- | --- |
| Category | Social Media | VERIFIED |
| Client | studio format | VERIFIED |
| Status | in development | VERIFIED — unchanged |
| Cadence | 12 posts + 4 reels/month | VERIFIED as proposed system |
| Photography | 7 generated concept photographs | AI_CONCEPT_VISUAL, labelled |
| Plan sheets | `grid-plan-4x5.jpg`, `post-set-1x1.jpg`, `reel-cover-9x16.jpg` | REAL_PROJECT_PHOTO (studio system) |
| Posts published | none — "first retainer in discussion" | MISSING |

**Presentation now on the page** (`src/components/portfolio/StudioStudies.tsx`):

1. `01 the month, as a grid` — twelve tiles: eleven planned posts and the open reactive slot, each
   carrying its format and pillar, sequenced coral → lilac → periwinkle → lime.
2. `02 the post set` — four 4:5 concept posts with written copy overlaid in HTML, not baked into
   the photograph: founder talk, packaging macro, counter detail, studio portrait.
3. `03 four reel covers` — 9:16, hook in the top third, `sound off` chip, caption band clear of the
   interface; three photographic and one type-only cover.
4. `04 the pillars`, `05 the schedule`, `06 the voice` — four formats with jobs, four weeks of feed
   and reel slots, and three caption examples with the reason each one works.

**Rules kept:** still `in development`; no reach, engagement, follower or conversion numbers; every
post and cover is labelled concept, with the grid caption stating it is not a published feed.
**Media needed:** real creatives and reel covers from the first retainer, plus a capture of the
published grid once it exists.

## 5. Hook, Turn, Payoff — `/work/hook-turn-payoff`

| Field | Value | State |
| --- | --- | --- |
| Category | Scripts & Storytelling | VERIFIED |
| Client | studio format | VERIFIED |
| Status | ongoing | VERIFIED — unchanged |
| Structure | hook 0–3s, turn ~50%, payoff last 4s | VERIFIED as method |
| Formats | 15/30/45/60s | VERIFIED as method |
| Real media | none — script pages are not cleared for publication | MISSING / AWAITING PERMISSION |
| Storyboard | three generated concept frames, one continuous scene | AI_CONCEPT_VISUAL, labelled |

**Presentation now on the page:**

1. `01 three frames, one scene` — HOOK `the button` (0:00–0:03), TURN `the second cup`
   (0:14–0:17), PAYOFF `she was there` (0:26–0:30). The frames were generated by editing one base
   frame, so desk, lamp, camera, tally light and grade stay identical; the direction text and the
   script line sit under each frame.
2. `02 the timing` — a 0:00–0:30 bar with the coral hook, indigo story and forest brand segments,
   marked at 0:00 / 0:14 / 0:26.
3. `03 the script, as written` — six-row time / picture / sound excerpt.
4. `04 what this shows` — scriptwriting, story development, hooks, storyboards, shot planning,
   editing rhythm, sound-off readability, visual storytelling, motion direction.

**Rules kept:** `ongoing`; the page states these are concept frames, not a filmed commercial; no
campaign outcome is claimed.
**Media needed:** real stills from a released studio film and one redacted script page.

## 6. The Studio Identity — `/work/studio-identity`

| Field | Value | State |
| --- | --- | --- |
| Category | Branding & Graphic Design | VERIFIED |
| Client | the studio itself | VERIFIED |
| Status | studio | VERIFIED — unchanged |
| Palette / type / stickers | VERIFIED in `src/index.css`, `art/Stickers.tsx`, `art/sizes.ts` | VERIFIED |
| Identity + sticker sheets | `identity-sheet-16x9.jpg`, `type-specimen-16x9.jpg`, `sticker-sheet-16x9.jpg` | REAL_PROJECT_PHOTO (code-rendered) |
| Site captures | `public/work/desi-draft-home, desi-draft-work, desi-draft-mobile.jpg` | REAL_PROJECT_PHOTO |
| Physical applications | four generated environments, real mark composited in the DOM | MOCKUP + AI_CONCEPT_VISUAL |

**Presentation now on the page — five chapters:**

1. `the wordmark` — three live lockups (forest on cream, cream on forest, ink on lime) drawn from
   the real SVG wordmark, with usage notes.
2. `the visual language` — the five colours with jobs and hex values, the four typefaces with jobs,
   and the type specimen sheet.
3. `the digital experience` — real desktop captures of the home and work index in browser chrome,
   plus the 390px capture in a phone frame.
4. `the graphic system` — the sticker sheet export and eight of the sixteen live SVG die-cuts.
5. `the application` — four concept mockups: cards, stationery flat-lay, die-cut sheets and a
   poster, each with the real wordmark or sticker composited in the browser and a `concept mockup`
   badge. No printed run is claimed.

**Media needed:** photographs of any real printed stationery or stickers, if the studio produces a
run; a real desk photograph would replace mockup 01.

## 7. Categories and their coverage

| Category | Projects | Real media | Honest state |
| --- | --- | --- | --- |
| Video & Motion | 1 | 0 | format only |
| Social Media | 1 | 0 | system only |
| Scripts & Storytelling | 1 | 0 | library only |
| Websites & Digital | 1 | 3 screenshots | live |
| Branding & Graphic Design | 1 | 0 | identity in code |
| Spaces & Experiences | 1 | 0 | on site, in progress |

**No category is populated with an invented project.** A category with no evidence stays thin rather than being filled.

## 8. Fields required before any new case study is published

1. Real project name and slug.
2. Category and kind.
3. Client name **and** written display permission.
4. Status that matches reality (never "completed" without sign-off).
5. At least one real media asset with alt text and known ratio.
6. Role, services and deliverables in the studio's own words.
7. Challenge and approach written by someone who did the work.
8. Outcome only if measured; otherwise omit the field entirely.
9. Testimonial only with written permission and attribution.
10. A named person accountable for the accuracy of the page.
