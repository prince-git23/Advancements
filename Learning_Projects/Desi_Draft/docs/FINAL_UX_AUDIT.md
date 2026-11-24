# FINAL UX AUDIT — Desi Draft

Scope: the whole site as it renders — `/`, `/work`, `/work/:slug` (six case studies), the
contact dialog, the work menu and the footer. Reviewed at 1920, 1440, 1280, 1024, 768, 430,
390 and 360 wide, in the built production bundle (`vite preview`), not in dev mode.

The design language was treated as fixed: cream and ink surfaces, Archivo / Instrument Serif /
DM Sans / Yellowtail, tangerine–royal–forest–lilac–lime accents, rounded image frames, sticker
die-cuts, the fixed mark with the "work" burst, and the existing section order. No new
component library, colour, font, route or section was introduced.

---

## 1. What was actually broken

| # | Defect | Evidence | Fix |
| --- | --- | --- | --- |
| 1 | The fixed wordmark and "work" burst sat directly on section headings and case-study images as they scrolled under the header. | 1440 screenshots of `/work` and the team section: "desi draft" overlapped `selected work, still being made` and a project heading. | Added a themed scrim behind the header (`.header-scrim`), 104 px, cream over light sections / 90 % ink over dark ones, fading to transparent. Pure CSS, no JS, no layout change. |
| 2 | The intro held a pinned screen for **three viewport heights** to move one sentence across, so most of that scroll was empty cream — especially on phones. | Home page height was 11,330 px at 1440 and 14,165 px at 390; frames at those offsets were blank apart from a fragment of the sentence. | Pin reduced to `+=165%` on desktop and `+=110%` below 768 px. Same choreography, one screen of travel. Page height is now 9,670 px / 11,168 px. |
| 3 | Six team cards rendered as tall 4:5 colour posters with a monogram, because no portraits exist. They dominated a section that has no photography in it. | 1440 team capture: six ~440 px-tall empty panels. | Cards without a photo now draw their poster at 16:11 with a smaller monogram (`data-portrait="false"`); a real portrait restores the 4:5 portrait. The honest "portraits in progress" label stays. |
| 4 | The featured work image on phones was a 4:5 crop of a 1440 px desktop screenshot, so the browser chrome was cut off on both sides and the storefront was unreadable. | 390 capture of `/` showed a mid-page slice of the Flora Alchemy homepage with no frame edges. | Featured frame uses 16:10 on mobile (full storefront, frame intact), keeping 16:9/16:11 above `sm`. |
| 5 | The sticky filter bar on `/work` was `bg-cream/95` + blur, so project colour bled through and the filter labels lost contrast while scrolling. | 1440 capture: a violet card visible through the filter row. | Bar is solid cream. Sticky behaviour, height and position unchanged. |
| 6 | The brand card carried a context-free swatch strip with a 10 px caption under the cover image. | Card capture at 1440. | Strip removed; the card is the identity sheet. |
| 7 | The Always On card was a 3 × 3 wireframe of empty tiles. | Card capture. | Card shows the month-plan artefact the case study already uses. |
| 8 | Text tones below AA: 10–11 px labels at `ink/40`, `/45`, `/50`, `/55` measured 2.6–4.1:1 on cream. | Contrast probe (`audit/tools/a11y.mjs`). | Micro-label tones raised to `ink/60`–`/62` (4.8:1+). No size, weight, tracking or layout change. |
| 9 | The `live` status chip was cream on forest green at 4.17:1. | Same probe. | Chip text is white (5.0:1). Chip size and colour unchanged. |
| 10 | `/work` jumped from `h1` to `h3` (card titles), a heading-order break. | Probe: `skips: 1`. | Visually hidden `h2` ("projects") above the grid. Now `skips: 0`. |

## 2. What was preserved on purpose

- Section order, spacing scale, container widths, card proportions, sticker placement and the
  diagonal page transition.
- The burst menu: hover opens, click toggles on touch, Escape closes and returns focus.
- The contact dialog as the single enquiry path — no fabricated email, phone or form.
- Footer sticker physics, the giant wordmark and the credits dialog.
- Every route, the preloader, and the per-section header theme switching.

## 3. Interactions verified

- Header theme flips light/dark through hero → intro → manifesto → work → team → services →
  footer (existing ScrollTrigger per section; re-checked after the scrim was added).
- Work menu: pointer open/leave, touch toggle, outside click, Escape, focus return.
- Card → case study, next/previous project, browser back.
- Filter chips on `/work` (all / video / social / scripts / web / brand) and the empty state.
- Contact dialog open/close from five different CTAs, including at 390 px (panel 331 px wide).
- Flora Alchemy "Visit Live Website" → `flora-alchemyy.vercel.app`, new tab, `noopener`.
- Hero: play/pause and fullscreen controls, video paused when the tab is hidden.
- Footer: stickers settle and stop; credits dialog.

Automated: `verify.mjs` 54 page loads, 0 problems; `qa.mjs` all checks passed (0 console
errors); `cta.mjs` all checks passed.

## 4. Accessibility

Measured with `audit/tools/a11y.mjs` on `/`, `/work` and a case study:

| Check | Result |
| --- | --- |
| Images without `alt` | 0 |
| Pages with exactly one `h1` | all |
| Heading-order skips | 0 (was 1) |
| Links/buttons with no accessible name | 0 |
| Keyboard focus | 13 tab stops on `/`, every one with a visible focus ring |
| Reduced motion | every effect branches on `prefers-reduced-motion`; computed styles verified static |

Known exception, left as a brand decision: the white "work" lettering inside the tangerine
burst measures ~3.1:1 at 15 px. The control carries `aria-label="Open work menu"` and the same
destination is reachable from the logo, but raising it means changing the burst (darker
orange or dark lettering), which is a brand call rather than a code fix.

## 5. Remaining UX gaps (blocked on content, not code)

1. Six team portraits are missing, so the team section is six monogram posters.
2. No hero film exists (`media.heroVideo` empty), so the hero shows the designed gradient
   montage. It is honest, but a real reel is the single biggest upgrade available.
3. No verified inbox, telephone or address, so every CTA routes to the dialog.
4. "creative spaces" is offered as a service with no case study behind it.

---

# Second pass — storyboard, chapters, and defects found in the built site

Everything below was found by looking at the production build in the browser at 1440 × 900 and
390 × 844, then fixed at the cause and re-captured. Files: `audit/frames/spot-*`,
`audit/frames/vp-h1440-*`, `audit/frames/crop-svc*.jpg`.

## 6.1 The narrative layer

The page now carries the seven-chapter storyboard from the brief as small editorial labels:
`01 the idea` (hero), `02 the thinking` (manifesto), `03 the making` (services),
`04 the work` (work), `05 the people` (team), `06 the result` (case study, above the closing
block), `07 the connection` (footer, as a cream pill).

- The label is 10 px uppercase at 0.22 em tracking, with a 24 px rule in the section's preset
  accent. Nothing else in the section changes colour.
- Five presets (`studio`, `motion`, `botanical`, `editorial`, `digital`) are CSS custom
  properties on `data-theme`; only `--chapter-accent` reads them.
- Chapter 02 is named once, on the manifesto. The pinned intro before it is a title card, not a
  section with a heading, and labelling it turned a full-screen kinetic line into a slide.
- Chapter 06 has no home-page block: a result can only be shown where one exists, so it lives
  in the case study next to the live address or the deck offer.

## 6.2 Order change, and why

Services moved above the work section. The ledger's last line was already "see the work behind
these →" — pointing at the footer. With the two sections adjacent, the narrative reads
*making → work → people*, and that link now lands where it says it will. The section ids
(`#work`, `#services`, `#team`) and every nav target are unchanged.

The two cream sections met in a 22 vh dead band (`pb-10vh` + `pt-12vh`). Services now ends at
8 vh and the work section opens at 8 vh; the soup of empty cream between them is gone without
touching editorial space inside either section.

## 6.3 Defects fixed

| # | Defect | Evidence | Cause | Fix |
| --- | --- | --- | --- | --- |
| 1 | The services headline lost the tails of `g`, `p` and `y` — "five things," and "done properly." printed with their descenders sliced off. | 1:1 crop of `/services` at 1440. | Each line is `overflow: hidden` for its reveal, and the line box (line-height 0.94) is shorter than the glyphs. | 0.2 em of padding inside the mask plus `-0.2em` margin to keep the leading identical; reveal travel raised to 135 % so the line is still hidden before it plays. Verified after the fix. |
| 2 | The fixed wordmark sat on the team heading as it scrolled under the header — cream display type ghosted straight through "desi draft". | `crop-team-head.jpg` at 1440. | The scrim was 94 % opaque with a gradient that fell to 0.78 at 42 % of its height. | Scrim is solid to 58 % of its 96 px height, then fades. Nothing is painted over the mark any more. |
| 3 | Service rows on phones ended in a lone 58 px sticker on its own row, leaving each group looking half-filled. | `/services` at 390. | The sticker column is `md:col-span-2`, so on one column it becomes a full row of its own. | Stickers are desktop-only; the coloured ✦ bullets already identify each group. 351 px removed from the mobile page. |
| 4 | The services ledger promised evidence and gave none — "the portfolio is the evidence" with no way to reach it from the row. | Reading the rendered section. | Copy was written before the case studies existed. | Each group carries `evidence: <project>` linking to its real case study. *Creative spaces* has none, so it has no link. |
| 5 | The footer chapter label measured 4.12:1 (cream on royal) — under AA at 10 px. | `a11y.mjs` low-contrast list. | Cream on the brand blue is only just too light at small sizes. | Label sits on the footer's existing cream pill (`bg-cream text-ink`, 16.5:1). |
| 6 | Hero headline and chapter label sit on whatever the reel shows; the only scrim was at the top of the frame. | Hero capture; no film ships yet, so any future reel inherits the risk. | The bottom gradient had been removed when the underline was fixed. | Static lower band, `from-black/60 via-black/30 to-transparent` over 46 % of the frame, outside the pointer-depth group. |

## 6.4 The "large empty region with oversized type" from the recording

The recording's work-section observation resolves into two independent causes, and both were
addressed:

1. **The empty region was scroll length, not layout.** The intro pinned for three viewport
   heights to move one sentence. The pin is now `+=165%` on desktop and `+=110%` below 768 px,
   which is one screen of travel with the same choreography.
2. **The clipped type was a mask box, not an oversized heading.** The heading sizes are
   unchanged; the boxes that clip them were too short (§6.3, row 1). No global type scale was
   reduced and no negative margins were added.

## 6.5 Intentionally left alone

- The manifesto's 14 vh opening and 9 vh before the card fan; the sections are cream on cream
  and the space is the composition.
- The work section's 10 vh close before the team's ink field — that gap is the colour break.
- The footer's fixed 100 svh, which is a stage for the sticker physics, not a content box.

---

# Third pass — the film is the hero, one sound control, and the hand-offs

Reviewed on the production build at 1920, 1440, 1366, 1280, 1024, 900, 820, 776, 768, 430, 390
and 360 wide, with `hero-audio.mjs` (functional), `layout.mjs` and `final-check.mjs`
(measurement), and screenshots at 1440, 776 and 390.

## 7.1 The hero composition

| # | Defect | Cause | Fix |
| --- | --- | --- | --- |
| 1 | Three decorative stickers sat over the footage — a blue smiley, a pink sparkle, and the lime spiky star that was actually the desktop sound button. They read as random objects dropped on the film. | Composition carried over from the montage era, when the film was an abstract gradient and ornaments gave it interest. | Smiley and sparkle removed from the hero. The lime die-cut is gone with them. Nothing was added in their place; the Work burst, wordmark, headline, stroke and transport controls are the composition. Pointer depth is now two layers (film and headline) instead of three. |
| 2 | The volume control did not exist on desktop. On phones a 44 px circle sat bottom-left with the transport; at `xl` a lime spiky die-cut at `left 4% / top 42%` stood in for it — unreadable as a control, and nowhere near the other buttons. | Two separate implementations, one per breakpoint, and the desktop one was dressed as a sticker. | One control, rendered once: `h-11 w-11` round, cream border, ink/40 ground, bottom-right inside the hero, in the same bar as play/pause and fullscreen. It starts muted, toggles the element's own track, carries `aria-label` + `aria-pressed`, a visible focus ring, hover and active states, and sits above the safe-area inset. |
| 3 | The film was graded by gradients alone: a 80 % bottom wash on phones crushed the shadow detail and flattened the violet studio light. | Gradients were tuned for legibility in isolation, not for the footage. | A single 20 % ink wash over the frame, a 26 % top scrim for the mark, and a 46–54 % directional bottom gradient. Measured on the actual frames: highlights on the lens and the tangerine desk stay intact, cream type still reads at 390 and 1440. |
| 4 | Scrolling out of the hero cut straight from a bright frame to the next section. | The shutter collapsed the card but never dipped the image. | A veil over the film is scrubbed to 82 % ink across the exit, so the card closes into black and reverses cleanly when scrolling back. |

## 7.2 Section hand-offs and whitespace

- **Intro → manifesto, phones.** The manifesto was pulled a full viewport over the pinned intro,
  so "02 the thinking" and the fan shared the screen with the travelling sentence. Mobile pin is
  now `+=85%` and the pull is removed below 768; the sentence leaves before the next section
  arrives. Desktop keeps the overlap (it lands exactly at the pin's end there).
- **Header theme across that hand-off.** With no trigger active in the new gap, the header kept
  the dark hero scrim over cream — visible as a grey band. The header now measures the section's
  `pin-spacer` when one exists; measured `dark` (ink on cream) at all twelve widths.
- **Fan cards, phones.** 439 px of cards in a 390 px viewport, first card and last pill cropped by
  `overflow: hidden`. Re-measured to 311 px at 390 / 286 px at 360, and the edge-hanging pills are
  retired below 768 rather than clipped.
- **Mobile section padding** trimmed where it was structural rather than editorial: manifesto,
  team, work and services each lose 2–4 vh at top and 1–3 vh at the close, plus the manifesto's
  internal 9 vh / 8 vh gaps. Desktop rhythm is unchanged.
- **Left alone on purpose:** the manifesto's cream-on-cream opening, the work→team colour break,
  the footer stage, and the services ledger's column measure.

## 7.3 What was verified, and what was not

Verified: one sound control at every width, visible, in the hero's bottom-right quadrant, 28 px
from the right edge (40 px on phones) and never overlapping the headline; pressing it sets
`video.muted = false`, `aria-pressed="true"`, label "Mute film", and pressing again restores both;
zero decorative stickers in the hero; correct 16:9 / 9:16 source per viewport; zero console errors
across all twelve widths; `qa.mjs` all checks passed (links, scroll forward and back, header theme
flip, card navigation, 0 console errors); `a11y.mjs` unchanged (0 missing alt, one `h1`, 0 heading
skips, 0 unnamed controls); reduced motion shows the poster with the headline settled and the
sound control present.

Not verified: the internal editing of the film. This pass could not add match cuts, rack focus,
speed ramps or masked transitions *inside* the footage — the shipped assets are one continuous
16:9 master and one continuous 9:16 cut, and inventing that edit would mean new footage, not a
code change. The transitions that were improved are the ones around the film: the masked
entrance, the graded frame, and the shutter-plus-veil exit. Likewise, the 20-second master was
not played to its final frame in the harness; playback, source switching, pausing when scrolled
away and the mute property were exercised.

The earlier note that "no hero film exists" is superseded: both films ship and play by default,
with the poster as the reduced-motion and failure fallback. The missing team portraits, the
single dialog-based enquiry path and the caseless "creative spaces" service remain open.
