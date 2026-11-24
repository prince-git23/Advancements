# Three Projects — Final Audit

Date: 23 November 2026
Build: `npm run build` → success (Vite production build).
Preview: `http://127.0.0.1:4174` served from `dist/`.

This document records the final state after the Selected Work refinement pass. The three case studies (Always On, Hook/Turn/Payoff, Studio Identity) already carried the visual storytelling sections described in the brief; this pass corrected the Selected Work presentation, the case-study grid scale and one copy error, then re-verified every route.

---

## 1. Original problems

| Area | Problem |
| --- | --- |
| Section entry | Selected Work heading appeared clipped as the section entered the viewport. |
| Cut to the Beat | 9:16 film forced into a landscape card panel, leaving large black areas and uneven material. |
| Always On | Wide card showed twelve tiles that read as flat colour swatches, with an overlaid badge covering copy. |
| Hook, Turn, Payoff | Storyboard frames were cropped by the wide panel and documentation outweighed the images. |
| Studio Identity | Card omitted a type line; “four faces” contradicted the brand’s four-typeface system. |
| Flora Alchemy | Media sat low with dead space above and a badge detached from the composition. |
| Cards generally | Text column had unused vertical space and no deliverable metadata. |
| Mobile | Feed and storyboard modes either shrank to unreadable tiles or clipped inside a horizontal rail. |

## 2. Changes implemented

### Selected Work (`WorkFeature.tsx`, `WorkStack.css`)

- Added section clearance (`scroll-mt-[110px]`, `padding-block` from 72 px) so the chapter and heading are fully visible before card 1 pins. Verified in `audit/frames/entry-1440.jpg`.
- Added a three-item deliverables list to every card, sourced from the existing `project.deliverables`; no new claims or statistics.
- **Cut**: media panel split 1.62 / 1, portrait film contained over a blurred backdrop (no stretch), three real chapter stills with timecodes in the side column. Mobile: beats column removed, film alone, native ratio.
- **Always On**: every one of the twelve tiles now shows format/pillar, a written line and the wordmark. Photo tiles use a bottom gradient for legibility; type tiles use the palette colour directly. Concept badge sits in reserved space below the grid. Mobile becomes a two-column feed with readable copy.
- **HTP**: three frames at native 9:16 with HOOK/TURN/PAYOFF labels and timings in Archivo; card panel height adapts; mobile stacks the three frames vertically at 74% width.
- **Identity**: added the real type line (Archivo · Instrument Serif · DM Sans · Yellowtail); kept the SVG wordmark, palette, sticker sheet and live site screen. Mobile stacks them full-width without clipping.
- **Flora**: screen centred in the panel, phone inset kept, caption and badge inside the frame; mobile uses the full mobile capture.
- Media rules are per project; no blanket cover crop on portrait media. Text sizes raised where they had been 9 px.

### Case studies (`StudioStudies.tsx`)

- Always On grid changed from 6-up to 4-up on desktop and tile copy raised from 9.5 px to 10.5 px, so the grid reads as designed posts.
- “four faces” corrected to “four typefaces” in the case-study type specimen, its title and the identity card line.
- Existing sections verified as already present and aligned with the brief: three connected frames + timing bar + script excerpt (HTP); twelve-post grid, four post designs, four Reel covers, pillars, schedule, voice (Always On); lockups, palette, typography, desktop and mobile screens, sticker sheet, labelled mockups (Identity).

### Copy and status

- Always On — **In Development**; concept content labelled concept.
- Hook, Turn, Payoff — **Ongoing**; concept frames labelled.
- Studio Identity — **Studio**; physical applications labelled concept mockups.
- No client names, metrics, published feeds, manufactured products or testimonial claims were added.

## 3. Generated and authentic media

- No new generated images were added in this pass. Existing generated assets used: `always-on/post-01…04`, `reel-01…03`, `hook-turn-payoff/frame-01…03`, `studio-identity/mockup-*` — all already labelled concept in the interface.
- Authentic material used: the 18.5 s Cut master and its chapter stills, Flora desktop/mobile captures and storefront recording, the Desi Draft SVG wordmark, live site screenshot and vector stickers.
- The 25-second reference recording was not found in the workspace (only `hero-mobile-portrait.mp4`, `desi-draft-hero-16x9.mp4`, `cut-to-the-beat-master.mp4`, `flora-alchemy-scroll.mp4`). No transcript was produced and no audio was published.

## 4. Responsive testing

Automated:

- `audit/tools/workstack.mjs` — nine widths (1920 → 390/360): stack behaviour, no document overflow, video pause, link navigation, Lenis-only scrolling, reduced motion, broken images. Result: **SELECTED WORK STACK CLEAN**.
- `audit/tools/responsive.mjs` — eleven widths, all routes. Result: **RESPONSIVE SWEEP CLEAN**.
- `audit/tools/verify.mjs` — 54 page loads across routes and viewports: **0 with a problem**.
- `audit/tools/qa.mjs` — routes, internal links, scroll depth, header theme, card/next-project navigation, console errors: **ALL CHECKS PASSED**.
- `audit/tools/a11y.mjs` — exit 0.
- `audit/tools/studies.mjs` — services accordion hover, keyboard, mobile: **ALL STUDY CHECKS PASSED**.

Document-level horizontal overflow measured 0 at 1440 and 390 after the changes.

Manual visual review of `audit/frames/`: `entry-1440`, `card-1-1440` … `card-5-1440`, `cut-mobile-390`, `feed-mobile2`, `htp-mobile2`, `identity-mobile`, `case-alwayson-1/2`, `case-htp-1`, `case-identity-1`.

## 5. Remaining gaps

1. **Reference recording**: absent, so Phase 1 transcription, spoken-intent mapping and independent timing verification are not possible. The timings shown are the studio’s beat sheet.
2. **Always On** remains a concept system, not a published campaign; there are no real posts, reels or engagement figures.
3. **HTP** frames are generated concept visuals; no filmed commercial exists.
4. **Identity** physical applications are concept mockups, not manufactured items.
5. Testimonials and Team content remain unpublished placeholders; no approved copy or identities were supplied.
6. Screenshots were captured at 1440 and 390 for the changed areas; tablet widths (768–1024) are covered by the automated sweep, not by manual screenshots.
