# FINAL RESPONSIVE AUDIT — Desi Draft

Every viewport below was rendered from the production build (`vite preview`) with
`audit/tools/vp.mjs`, which reports document width, scroll width and any element whose box
crosses the viewport edge, then screenshots the page top to bottom.

## 1. Measurements after this pass

| Viewport | Page height (px) | Horizontal overflow | Notes |
| --- | --- | --- | --- |
| 1920 × 1080 | 10,604 | none (`scrollWidth 1920`) | Hero headline capped by `clamp`, work grid at max 1400 px |
| 1440 × 900 | 9,670 | none | Reference layout |
| 1280 × 800 | 8,978 | none | Same column structure as 1440 |
| 1024 × 768 | 8,277 | none | Sidebar-free 12-col grid collapses to 7/5 at `lg` |
| 768 × 1024 | 10,761 | none | Manifesto fan switches to its 4-across mobile composition, team 2-col |
| 430 × 932 | 11,696 | none | Large-phone layout |
| 390 × 844 | 11,168 | none | Reference mobile |
| 360 × 800 | 10,827 | none | Smallest supported width |

Before the pass, at 1440 the home page was **11,330 px** and at 390 **14,165 px**; the drop is
the intro pin reduction (motion audit §2.4), not removed content.

The sampler only flagged `div.absolute inset-0` layers inside `overflow-hidden` parents (hero
media and montage scenes). Those are intentionally wider than the frame and cannot scroll the
page — `document.scrollWidth` equals `clientWidth` at every viewport, so there is no horizontal
scroll anywhere.

## 2. Mobile-specific work

| Problem | Fix |
| --- | --- |
| Featured work image was a 4:5 crop of a desktop capture — frame edges cut, storefront unreadable | Mobile ratio is now 16:10 (full storefront, intact browser chrome); 16:9 at `sm`, 16:11 at `lg` |
| Six team cards were 4:5 posters of empty colour | Cards without a portrait now render a 16:11 poster with a smaller monogram; info band unchanged |
| The header wordmark collided with section headings while scrolling | Themed scrim behind the header at all widths (104 px) |
| Intro produced ~2 screens of blank cream on a phone | Pin reduced to `+=110%` below 768 px |
| Hero pointer depth is meaningless on touch | Pointer depth is inside the `!reduced` pointer-fine branch; touch never triggers it |

## 3. What each breakpoint keeps

- **Desktop / laptop (1280–1920):** full depth — pointer parallax in the hero, card tilt,
  manifesto fan tilt, footer sticker physics, `ScrollTrigger` pins on hero and intro.
- **Tablet (768–1024):** same sections, single pins, 2-column team and work grids, fan cards
  re-measured from the viewport rather than scaled (`.fan-card` has its own `max-width` and
  negative gutter per breakpoint).
- **Mobile (360–430):** no pinned horizontal surprises beyond the intro (which stays
  scroll-driven and cancellable), no hover-only affordances — the work menu opens on tap, the
  card link is the whole card, contact opens from visible buttons, and every image keeps its
  source ratio inside `overflow-hidden` frames.

## 4. Type and tap targets

- Headlines use `clamp()` at every size (`2.75rem–7.25rem` hero, `1.5rem–5.4rem` sections), so
  no line is clipped at 360 px; the hero wraps to four lines instead of overflowing.
- Smallest tap targets are the 44 px hero controls, the 56 px burst, the 44 px WhatsApp slot and
  the footer social buttons (36 px until the Team/Testimonials/Footer pass, 44 px since); filter
  chips are 32 px tall with 8 px gaps.
- Body copy sits between 13 px and 16 px; the smallest text on the site is 9–11 px uppercase
  metadata (labelled audit trail, not reading copy) and now sits at 4.8:1 or better.

## 5. Checks run

- `vp.mjs` at all eight viewports: no overflow, page heights as tabulated.
- `verify.mjs`: 54 page loads across 1440/768/390/360 — 0 broken images, 0 overflow, 0 console
  errors.
- Visual pass over home at each stop (hero, intro, manifesto, featured work, cards, team,
  services, footer) and over `/work` and two case studies at 390 and 1440.

## 6. Known limitations

- Sheets (beat sheet, grid plan, identity boards) are 1600 px artefacts; at 360 px their internal
  type is small. They are documents, not UI text, and the surrounding captions and DOM tables
  carry the readable version.
- The hero is a gradient montage until a real reel exists; its 9:16 and 16:9 framing is
  unaffected by viewport, but the content is a stand-in.

---

# Second pass — measured after the chapter restructure and the density fixes

`vp.mjs` against the production build, `MAX=1` (the harness samples at `y = 0` and then reports
the document's full height). Overflow is `documentElement.scrollWidth` against
`clientWidth`.

| Viewport | Page height | Horizontal overflow |
| --- | --- | --- |
| 1920 × 1080 | 10 719 px | none (1920 = 1920) |
| 1440 × 900 | 9 807 px | none (1440 = 1440) |
| 1366 × 768 | 9 084 px | none (1366 = 1366) |
| 1280 × 800 | 9 126 px | none (1280 = 1280) |
| 1024 × 768 | 8 423 px | none (1024 = 1024) |
| 768 × 1024 | 10 862 px | none (768 = 768) |
| 430 × 932 | 11 518 px | none (430 = 430) |
| 390 × 844 | 11 001 px | none (390 = 390) |
| 360 × 800 | 10 665 px | none (360 = 360) |

The only elements the overflow probe reports as wider than the document are the hero's
`-inset-2` media bleed and the montage layers inside it. Both sit inside an `overflow: hidden`
shell by design, and the document itself never scrolls sideways.

## Changes with a measured effect

- **Mobile services:** five lone sticker rows removed → 351 px shorter at 390 × 844, and every
  group now ends on its list rather than on a floating icon.
- **Cream seam:** services/work boundary went from 22 vh to 16 vh, 1440 height 9 843 → 9 807 px.
- **Chapter labels** are one line at every width (they wrap as a unit, `flex-wrap` with a
  `gap-y-1`), no clipped or rotated text at 360 px.
- **Masked headings** gained 0.2 em of internal padding and a negative margin of the same size,
  so descenders are complete and the leading is unchanged — no section grew.

## Still not captured

- The 1920 and 1366 stops were sampled at the fold only; section-level inspection at those two
  widths was done by measuring heights, not by eyeballing every section.
- Tablet 768 was checked at the fold and by height; its two-column team grid and stacked
  service rows were confirmed in the previous pass and are unchanged in structure.

---

# Third pass — hero film, shared audio control, and the whitespace correction

Measured on the production build with `audit/tools/final-check.mjs` (height/overflow/header
theme), `audit/tools/layout.mjs` (per-section gutters, heading clipping, services geometry) and
`audit/tools/hero-audio.mjs` (one control per width, mute behaviour, hero stickers, fan bounds).
`qa.mjs` and `a11y.mjs` were re-run after the change.

## 1. Twelve widths, measured

| Viewport | Page height | Horizontal overflow | Header at intro→manifesto |
| --- | --- | --- | --- |
| 1920 × 1080 | 10,679 px | none | dark (ink on cream) |
| 1440 × 900 | 9,728 px | none | dark |
| 1366 × 768 | 9,008 px | none | dark |
| 1280 × 800 | 9,010 px | none | dark |
| 1024 × 768 | 8,330 px | none | dark |
| 900 × 900 | 10,479 px | none | dark |
| 820 × 900 | 10,255 px | none | dark |
| 776 × 660 | 8,987 px | none | dark |
| 768 × 1024 | 10,674 px | none | dark |
| 430 × 932 | 11,828 px | none | dark |
| 390 × 844 | 11,214 px | none | dark |
| 360 × 800 | 10,946 px | none | dark |

`document.scrollWidth === innerWidth` at all twelve widths, and no page errors. `layout.mjs`
reported **no clipped headings** at any width (the `clipped` list is empty), including
"visual communication", which is one line at every stop.

The phone page is ~200 px taller than the previous pass at 390. That is the cost of removing a
full-viewport overlap: the manifesto is no longer pulled over the pinned intro, so the two
sections stop sharing one screen (see §3). No screen in that span is empty — the pinned intro
fills the viewport for the whole pin — but the scroll distance is honest rather than hidden.

## 2. Hero

| Item | Before | After |
| --- | --- | --- |
| Decorative stickers over the film | smiley, sparkle, plus a lime spiky die-cut used as the sound button | 0 (`[data-collide="sticker"]` count in `#hero` = 0) |
| Sound control | lime die-cut at `left: 4%` / `top: 42%`, `xl` only; a separate 44 px circle bottom-left below 1280 | one 44 px control, bottom-right, all widths, inset 28 px (desktop) / 40 px (phones) |
| Film grade | 45–80 % black gradients, no base wash | 20 % ink wash over the frame + 26 % top scrim + 46–54 % directional bottom gradient (48–62 % at the floor) |
| Exit | card collapsed and tilted only | same shutter plus a scrubbed veil to 82 % ink, so the cut dips to black |

Video sources are unchanged: 16:9 `desi-draft-hero-16x9.mp4` in landscape, 9:16
`hero-mobile-portrait.mp4` at `(orientation: portrait), (max-width: 767px)`. Both were confirmed
with `ffprobe` to carry AAC stereo, which is why the control is offered at all — the old code
assumed it.

## 3. The intro → manifesto hand-off

On a phone the manifesto was pulled `-100svh` over the pinned intro. With the mobile pin at
`+=110%` that put "02 the thinking" and the fan on screen while the travelling sentence was
still crossing (captured at 390 × 844). Two changes, both scoped to `max-width: 767px`:

- intro pin `+=110%` → `+=85%`;
- `#manifesto` margin-top `0` (a media-scoped rule in `index.css`, so it does not touch the
desktop composition).

The sentence leaves the frame before the next section arrives. Because that opened a gap where
no header trigger was active, the header now measures a section's `pin-spacer` host rather than
the section element, so the theme flips at the hand-off instead of leaving the dark scrim over
cream (verified at all twelve widths in §1).

## 4. Whitespace and composition

- **Manifesto fan, phones:** four cards at `1vw/4.35` (was `1vw/3.55`) with a `-6.4vw` overlap
  measure **311 px wide at 390** and **286 px at 360** — previously 439 px in a 390 px viewport,
  which cropped the first card and the last pill at the section's `overflow: hidden` edge.
  The hangs-off-the-edge pills are hidden below 768; they were the clipped elements.
- **Section padding, phones only:** manifesto `14vh/7vh` → `10vh/6vh`, team `14vh/12vh` →
  `10vh/9vh`, work `8vh/10vh` → `6vh/8vh`, services `7vh/8vh` → `6vh/7vh`. Internal gaps 9vh/8vh
  → 6vh. Desktop values are untouched.
- **Services ledger** keeps the rebuilt geometry from the previous pass, re-measured here:
  heading column 515 px at 1440 (gap to number 32), 323 px at 776 (gap 20), 320 px at 390.
- Footer `gutR` is negative in the harness because decorative canvases and stickers are counted;
  that is a measurement artefact, not a layout overflow (page `scrollWidth` stays equal to the
  viewport).

## 5. Not verified

- The footage itself is one continuous clip. Individual shots inside the film were not re-cut,
  re-graded per shot, or given new match cuts; the transitions available to this pass are the
  ones between the film and the page (entrance clip-path, exit shutter + veil).
- The soundtrack was not played to its end in the harness; the mute property, `volume` and
  `aria-pressed` were exercised, not the last frame of the 20 s master.
- Section-level screenshots were reviewed at 1440, 776 and 390; 1920 and 1366 are measured, not
  eyeballed.

## 6. Pass 2026-11-23 — full-route sweep

`audit/tools/responsive.mjs` now walks every route at every required width. It reports page
overflow, content escaping the viewport (ignoring deliberate scroll rails and clipped stages),
clipped headings, broken images, console errors, and a footer-height sanity check.

Routes: `/`, `/work`, and the six case studies. Widths: 1440, 1280, 1024, 768, 430, 390, 360.

Result: **clean on all 56 combinations** (two consecutive runs). `audit/tools/verify.mjs` also
loaded 54 route/viewport pairs with 0 overflow, 0 broken images, 0 pending plates and 0 console
errors.

Footer, pass 2026-11-23:

- The forced `h-[100svh] min-h-[100svh] max-h-[100svh]` panel was removed. Height is now content-
  driven: 841 px at 1440 × 900, 626 px at 768 × 1024, 657 px at 390 × 844.
- Columns: 3 across at ≥768 px, 2 at ≥640 px, 1 below. Side padding is 24 px on phones and 40 px
  from `md`, replacing 28/48 px.
- The script wordmark is in normal flow directly under the columns with a small negative top
  margin, so the empty band above it in the reference is gone; the footer's own overflow crops
  the mark at the base.
- The Matter.js sticker drop no longer runs below 768 px (or under reduced motion). Phones park
  four static stickers in the wordmark band; the other four are hidden, so no sticker can land on
  the contact copy while the page is scrolling.
- The canvas uses `touch-action: pan-y`, so the interactive layer cannot block vertical scrolling.
- Studio size copy in the footer now derives from `data/team` rather than being typed twice.

Team, pass 2026-11-23:

- `TeamMember` gained `photo` and `intro`; the card renders `member.photo`, then
  `media.teamPhotos[id]`, then the monogram plate. `ProfileCard` supports the optional intro line.
- The heading, the role list and the footer count are derived from the team array. The grid is
  1 / 2 / 3 columns.
- **Resolved in the final pass (§4.4):** `data/team.ts` now carries an `active` flag, the public
  list is exactly three members, and the other three live in `formerTeam`. Portraits are still
  missing — that is recorded in `LAUNCH_READINESS.md` §10.

## 7. Selected Work stack, pass 2026-11-23

`src/components/WorkFeature.tsx` is now five project cards (Flora Alchemy, Cut to the Beat, Always
On, Hook Turn Payoff, Studio Identity) in a window-scrolled ScrollStack on desktop **and on a
phone**, with the same five cards as a plain vertical list at tablet width (640–1023) and under
reduced motion.

**Geometry**

- Section width 88vw, capped at 1680px on desktop; 92% effective width at 1024–1439; phone gutters
  `clamp(18px, 4.5vw, 40px)`.
- Card split 1.55fr / 1fr — media 61 %, copy 39 % at every stacked width.
- Card height `clamp(500px, 66vh, 660px)`: 500 at 1024 × 768, 594 at 1440 × 900, 660 at 1920.
- Copy column padding 22–40px; title `clamp(2rem, 3.1vw, 3.15rem)` (32px at 1024, 45px at 1440,
  50px at 1920); description one 8–16 word sentence; proof line and CTA on one row.

**Breakpoints**

- ≥1024: pinned stack, `stackPosition 14%`, 24px between pinned cards, 90px of travel between
  projects. Sticky is relative to the window — no ancestor has `overflow: hidden`.
- <640: the same pinned stack with a card that cannot outgrow the screen — `calc(100svh - 150px)`,
  `stackPosition 10%`, 8px between pinned cards, 24px of travel, scale 0.97. The card becomes one
  column (media above the copy), the deliverable list is dropped, and the long media sets stay
  inside the panel as swipe rails: the twelve posts are 4:5 cards at the panel's full height, the
  three frames are 9:16 figures at 46% width, and the identity board keeps its own layer.
  Measured at 390 × 844: card 694px (viewport 844), media 380px, poster tiles 283 × 354, one
  frame 153 × 272, page overflow 0.
- 640–1023: no pinning, no transforms, natural document flow; media above copy; 4:3 media (Flora
  uses a 390 × 844 phone capture in a 74vh box; Cut keeps 9:16 film inside a 4:3 frame).
- Reduced motion: the static list at every width (`workstack.mjs` asserts zero `.scroll-stack`
  nodes).

**Measured (nine required viewports)**

| Viewport | Mode | Cards | Overflow | Section | Title |
| --- | --- | --- | --- | --- | --- |
| 1920 × 1080 | stack | 5 | 0 | 4305px | 50px |
| 1440 × 900 | stack | 5 | 0 | 3916px | 45px |
| 1366 × 768 | stack | 5 | 0 | 3441px | 42px |
| 1280 × 800 | stack | 5 | 0 | 3549px | 40px |
| 1024 × 768 | stack | 5 | 0 | 3444px | 32px |
| 768 × 1024 | static | 5 | 0 | 5170px | 42px |
| 430 × 932 | stack (phone) | 5 | 0 | 4277px | 31px |
| 390 × 844 | stack (phone) | 5 | 0 | 4225px | 28px |
| 360 × 800 | stack (phone) | 5 | 0 | 3993px | 26px |

`audit/tools/workstack.mjs` also checks per card: media spans the card, media ratio 0.54–0.66 on
desktop, card fits the viewport, title stays inside the copy column, description 7–20 words, one
`/work/<slug>` link, at least one image or video. It asserts only one preview video plays at a time,
that the Cut film pauses once its card is covered, that a card link really opens its case study, and
that reduced motion renders five static cards with no stack.

Screenshots (first card / front of the middle stack / final card):
`audit/frames/stack-first-<width>.jpg`, `stack-middle-<width>.jpg`, `stack-last-<width>.jpg`,
`stack-cut-<width>.jpg`, plus `stack-mobile-<width>.jpg` and `stack-reduced-1440.jpg`.

**Known, intentional**

- Pinned cards sit 24px apart, so a 24px strip of the previous card (its own top edge) stays
  visible above the front card. That is the deck; the strip is dimmed by the stack.
- The heading is covered by the first pinned card as it settles — normal scroll behaviour, not
  overlap inside a card.
- A phone pins the deck too, but its card is shorter than the screen (`calc(100svh - 150px)`), so
  a pinned card is never taller than the viewport. The month grid and the storyboard stop being
  tall vertical walls and become one-swipe horizontal rails inside that panel.

---

## 4. Team, testimonials and footer pass

Measured on the production build with `audit/tools/final-metrics.mjs`; the
no-overflow claim is asserted separately at all twelve required widths by
`audit/tools/team-footer.mjs` (1920, 1440, 1366, 1280, 1024, 900, 820, 768, 430,
390, 360, 320 — 0 horizontal overflow at every one).

### 4.1 Testimonial measure

The old section was capped at 1400px inside a 1400px measure with a second
gutter, so at 1440 it used roughly 1,250px of a 1,440px screen and the three
columns were ~380px wide. The shell now uses **92% of the viewport** (94% at
tablet) up to a hard 1600px, with a 20px gutter on a phone.

| Viewport | Shell width | Share of viewport | Columns | Card |
| --- | --- | --- | --- | --- |
| 1920 × 1080 | 1600 | 83% (1600px cap) | 3 | 521 × 224 |
| 1440 × 900 | 1325 | 92% | 3 | 430 × 224 |
| 1366 × 768 | 1257 | 92% | 3 | 407 × 224 |
| 1280 × 800 | 1178 | 92% | 3 | 381 × 249 |
| 1024 × 768 | 942 | 92% | 3 | 302 × 256 |
| 768 × 1024 | 722 | 94% | 2 | 352 × 256 |
| 390 × 844 | 350 | 90% (20px gutters) | 1 | 350 × 239 |
| 320 × 720 | 280 | 88% (20px gutters) | 1 | 280 × 239 |

At 1920 the 1600px maximum is the binding constraint, so the section is 83% of
that viewport rather than 90%; that is the cap the brief asks for, not an empty
margin.

### 4.2 Card type and padding

| Item | Desktop/laptop | Phone |
| --- | --- | --- |
| Card padding | 26px | 22px |
| Card minimum height | 190px | 176px |
| Quote | 19px | 17.5px |
| Reviewer name | 19px | 17.5px |
| Role / company (only when supplied) | 12px | 12px |
| Avatar | 52px | 46px |

Card height is a minimum (190px), not a fixed value: a long quotation grows the
card, which `testimonials.mjs` asserts by replacing the quote with three
paragraphs and checking the card grows without overflow or clipping. These are
the published sizes; the section is no longer a draft preview, so the scale was
raised 2px on the quote and name, 6px on the avatar and 22px on the card floor.

### 4.3 Animation speed

Travel is a rate, not a per-column duration: 38px/s × the tier multiplier
(1.35 desktop, 0.75 tablet, 0.6 mobile), with each column's duration measured
from its real height. The 21px/s base read as stalled, so it was raised to
38px/s — a card now passes in roughly six seconds on a laptop. Travel:

| Tier | px/s | vs. previous (~21.5px/s) |
| --- | --- | --- |
| Desktop / laptop (≥1024) | 51.3 (measured 50.8) | 1.8× |
| Tablet (640–1023) | 28.5 | 1.9× |
| Phone (<640) | 22.8 | 2.2× |

### 4.4 Team

| Viewport | Cards | Rows | Card width |
| --- | --- | --- | --- |
| 1920–1024 | 3 | 1 | 477 / 435 / 412 / 385 / 305 |
| 900–768 | 3 | 2 (third centred) | 349 |
| 430–320 | 3 | 3 | 358 / 358 / 328 / 288 |

The section measure widened from 1240px to 1480px, so the three cards fill the
row rather than leaving side margins.

### 4.5 Footer

| Viewport | Group widths (01/02/03) | Footer height | CTA |
| --- | --- | --- | --- |
| 1920 | 461 / 461 / 464 | 1014 | 56px |
| 1440 | 403 / 403 / 403 | 864 | 56px |
| 1366 | 378 / 378 / 378 | 870 | 56px |
| 1024 | 264 / 264 / 264 | 770 | 56px |
| 768 | 320 / 320 / 680 (group 03 spans) | 901 | 56px |
| 390 | 334 / 334 / 334 (stacked) | 979 | 56px |
| 320 | 264 / 264 / 264 (stacked) | 1047 | 56px |

The three groups are equal columns at `lg`, two plus a spanning third at `sm`,
and one stack below 640. Nothing is clipped at any width (`team-footer.mjs`
counts clipped footer elements: 0).

### 4.6 Screenshots

`audit/frames/team-footer-{1440,768,390}.jpg` (team), `footer-{1440,768,390}.jpg`,
`footer-reduced-1440.jpg`, `testimonials-{1920,1440,1024,768,430,390,360}.jpg`.

## 8. Manifesto pass 2026-11-23 — tablet and phone

“a studio built for the feed.” held up on a laptop and not below it. Two causes, both measured
on the production build.

**The fan needs 1024px.** At 1024 it measured a painted box of 225px; the old table branch carried
the same five cards down to 768, where the formula gives ~139px each — narrow enough that the next
card is painted over the copy, so “Creative strategy and campaign concepts.” and “Scripts,
storytelling and copywriting.” were partly covered (visible in the 768 frame before this pass). The
fan now stops at 1024 and the section uses the snap strip below it, with bigger cards than the
phone:

| Viewport | Mode | Card box, as painted | Section height |
| --- | --- | --- | --- |
| 1920 / 1440 | fan | 306 × 367 | 852 / 821 |
| 1024 | fan | 225 × 270 | 646 |
| 1000 / 900 / 768 | strip | 420 × 525 | 873 / 876 / 880 |
| 430 | strip | 300 × 375 | 668 |
| 390 | strip | 286 × 358 | 629 |
| 360 | strip | 262 × 328 | 585 |
| 320 | strip | 230 × 288 | 526 |

`audit/tools/pillar-text.mjs` reports the copy that any neighbouring card covers: **0px on every
card at 1920, 1440, 1280 and 1024.** The strip keeps its own scroll, so the page still has 0
horizontal overflow at all twelve widths, and a vertical wheel over it still moves the page.

**The heading had a fixed floor.** `clamp(2.2rem, 5.2vw, 4.5rem)` bottomed out at **35.2px**, which
put the italic third line at **278px inside a 288px column at 320** — both gutters nearly touched.
Below 768 the heading is now `clamp(1.75rem, 8.6vw, 2.35rem)` (28px at 320, 33.5px at 390, 37.6px
from 476 up); from 768 the laptop ramp is unchanged (`clamp(2.4rem, 5.2vw, 4.5rem)` → 39.9px at 768,
72px at 1440+), so desktop composition does not move.

Checked with `audit/tools/pillars.mjs` (ten widths, fan hover ≥1024, strip tap and page-scroll
below, closed-motion pass) and `audit/tools/responsive.mjs` (56 route × width combinations,
**clean**). Frames: `audit/frames/spot-f{320,390,768,900,1440}-manifesto.png`,
`audit/frames/pillars-{320..1920}.png`.

Still open: the strip has no swipe affordance beyond the peek of the next card; that is a design
decision for the studio, not a layout fix.

## 9. Case-study image rails, phones

The three case-study galleries that are 3–4 across on a laptop fell to two columns or a stacked
column on a phone, which read as a wall of half-frames. Below 640px `.study-rail` turns each into
a one-up snap rail: one image fills the column, the rest are one swipe away.

| Gallery | Phone | Laptop |
| --- | --- | --- |
| the month, as a grid (Always On) | 1 per view, 358px in 390 | 4 columns, 322px cards |
| four reel covers (Always On) | 1 per view, 358px | 4 columns, 316px |
| three frames, one scene (Hook Turn Payoff) | 1 per view, 358px | 3 columns, 425px |

Measured at 390 and 1440 with `audit/tools/study-shot.mjs`: rail display `flex` → `grid`, card
width 358 of a 390 viewport (16px gutters), page overflow 0, and the first card starts at x=16.
That last number needed `scroll-padding-inline: var(--dd-gutter)`: with `scroll-snap-align: start`
and no scroll padding, mandatory snapping parks the rail 16px in and the first card sits flush to
the screen edge.

`responsive.mjs` now forces lazy images to fetch and decode inside a horizontal rail before the
broken-image check. Without that, images that a vertical page sweep never reaches were reported as
broken on `always-on` at 430/390/360 even though every file exists.

Frames: `audit/frames/rail-always-on-{0,1}-390.png`, `rail-htp-0-390.png` and the 1440 equivalents.
