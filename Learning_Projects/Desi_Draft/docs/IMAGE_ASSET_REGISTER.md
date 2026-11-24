# Desi Draft — Image Asset Register

Source, rights and classification for every visual on the site. Updated 2026-11-22.

## Classifications

| Code | Meaning |
| --- | --- |
| `REAL_PROJECT_PHOTO` | An actual artefact of the studio's own work: a capture of the running build, or a photograph of the real thing. |
| `STUDIO_SUPPLIED_ASSET` | Supplied by the studio, provenance on file. |
| `LICENSED_EXTERNAL_ASSET` | Third party, licence recorded in this table. |
| `AI_CONCEPT_VISUAL` | Generated. Always labelled on the image. Never used for a person, a client, a logo or a completed build. |
| `CLIENT_SUPPLIED` | Published by the client on their own site; credited on every frame. |
| `MOCKUP` | Interface or device framing drawn in the DOM around a real capture. |
| `PLACEHOLDER` | Designed empty plate naming the missing frame. |

**Licences:** no stock photography and no other agency's work. Every pixel is either a capture
of this repository's own build, a vector drawn in this repository, client photography from the
Flora Alchemy storefront (credited in the frame and in the case study), or generated concept
photography listed in §4. Generated imagery never stands in for a real person, a client, a logo,
a published post or a finished build, and every frame that uses it is labelled `concept`.
Reuse rights for the client photography are recorded in §3.

## 1. Screenshots of the build (real captures)

| File | Type | Source | Creator | Licence | Placement | Class | Approval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `public/work/desi-draft-home.jpg` | JPEG 1440×900 | Production build | `audit/tools/capture.mjs` | Own work | Home card, case study cover | REAL_PROJECT_PHOTO | n/a |
| `public/work/desi-draft-work.jpg` | JPEG 1440×900 | Production build | same | Own work | Case study gallery | REAL_PROJECT_PHOTO | n/a |
| `public/work/desi-draft-mobile.jpg` | JPEG 390×844 | Production build | same | Own work | Home card inset, gallery | REAL_PROJECT_PHOTO | n/a |

**2026-11-23:** the three `/work` captures above were re-taken from the current production preview
(1440 × 900 home, 1440 × 900 work index, 390 × 844 work index), so the Desi Draft case study shows
the latest build rather than the 2026-11-18 version. Same filenames, same dimensions.

**2026-11-23, testimonials:** nine portraits were supplied by the studio in
`public/images/testimonials/` (`Abhishek_Rahangdale`, `Asmita_Paunikar`, `Nishtha_Rawat`,
`Paritosh_Upadhyay`, `Sanskar_Kokne`, `Sanskruti_Dubey`, `Shifa_Joe`, `Siddhant_Parshivnikar`,
`Vidhi_Saratkar`). Each has a 512 × 512 centre-cropped derivative (`*-512.jpg`, 24–58 KB) used by the
review cards; the originals are kept alongside. **Publication is blocked:** no quotation, role,
company or portrait consent has been supplied, so the records in `src/data/testimonials.ts` are
marked `approved: false` and the public page renders no testimonial content.

**2026-11-23, Selected Work:** `public/videos/flora-alchemy-scroll.mp4` is a screen recording of
the live Flora Alchemy storefront (1280 × 800, 8.8 s, H.264, 1.15 MB, no audio), captured with
`audit/tools/record-flora.mjs` from https://flora-alchemyy.vercel.app/. It is documentary footage
of the client's live site, not a mockup. `flora-alchemy/site-home-mobile-390.webp` was re-captured
at the top of the same page so the phone card shows the header and headline rather than a
mid-scroll crop; same filename and 390 × 844 dimensions.

## 2. Artefacts composed in code and captured

Renderer: `audit/sheets/sheets.tsx`, captured by `audit/tools/sheets.mjs` at the ratios below.
They are exports of the studio's own design system, not photography of a third party.

| File | Type | Ratio | Subject | Class | Client approval |
| --- | --- | --- | --- | --- | --- |
| `cut-to-the-beat/reel-cover-9x16.jpg` | JPEG 900×1600 | 9:16 | Reel cover with beat-marked waveform | REAL_PROJECT_PHOTO | Studio format |
| `cut-to-the-beat/hook-frame-9x16.jpg` | JPEG 900×1600 | 9:16 | Hook headline plus the three frames of the hook, with timecodes | REAL_PROJECT_PHOTO | Studio format |
| `cut-to-the-beat/timeline-1x1.jpg` | JPEG 1200×1200 | 1:1 | Beat-marked timeline, eight cut slots | REAL_PROJECT_PHOTO | Studio format |
| `cut-to-the-beat/end-card-16x9.jpg` | JPEG 1600×900 | 16:9 | End card: lockup plus the three master ratios drawn at their own proportions | REAL_PROJECT_PHOTO | Studio format |
| `always-on/grid-plan-4x5.jpg` | JPEG 1200×1500 | 4:5 | Month grid plan, 12 numbered tiles each carrying its format diagram, one open slot | REAL_PROJECT_PHOTO | Studio system |
| `always-on/post-set-1x1.jpg` | JPEG 1200×1200 | 1:1 | Three-post set: handle row, voice line, post copy (concept composition) | **AI_CONCEPT_VISUAL: no** — conceptual artwork, code-drawn | Studio system |
| `always-on/reel-cover-9x16.jpg` | JPEG 900×1600 | 9:16 | Sound-off reel cover with burned-in caption band and waveform | REAL_PROJECT_PHOTO | Studio system |
| `hook-turn-payoff/beat-sheet-16x9.jpg` | JPEG 1600×900 | 16:9 | 30 s beat sheet: three beats, seven-shot column, four script lines, timing bar | REAL_PROJECT_PHOTO | Studio format |
| `hook-turn-payoff/storyboard-4x3.jpg` | JPEG 1200×900 | 4:3 | Three storyboard frames with shot, timecode and lens under each | REAL_PROJECT_PHOTO | Studio format |
| `studio-identity/identity-sheet-16x9.jpg` | JPEG 1600×900 | 16:9 | The identity in use: live homepage, wordmark lockups, stickers, colour by role | REAL_PROJECT_PHOTO | Own identity |
| `studio-identity/type-specimen-16x9.jpg` | JPEG 1600×900 | 16:9 | Four faces with role, sample, usage note and settings, plus character sets | REAL_PROJECT_PHOTO | Own identity |
| `studio-identity/sticker-sheet-16x9.jpg` | JPEG 1600×900 | 16:9 | Sixteen die-cuts, numbered and named | REAL_PROJECT_PHOTO | Own identity |

Note on `always-on/post-set-1x1.jpg`: it is a *concept composition* — three type cards, no
client, no published post. The register keeps it distinct from generated imagery because it
was drawn in code from the studio's own tokens; the site labels it `concept set`.

Composition pass: the sheets above were rebuilt after review because several were mostly
empty field — an isolated oversized wordmark, a raw swatch row, near-blank tiles and frames
with a void in the middle. Every sheet now carries the information it claims to show (format
diagrams, shot metadata, timecodes, script lines) at a size that survives a 1400 px container
and a 390 px phone. Ratios, filenames and page layout are unchanged; only the drawings inside
the frames changed.

## 3. Flora Alchemy — client photography and live captures

Flora Alchemy (`https://flora-alchemyy.vercel.app/`) is a live project, so its case study uses
the brand's own published photography and screen captures of the deployed storefront. Nothing
on this project is a studio drawing, a concept render or a generated image.

| File | Type | Ratio | Subject | Class | Source | Credit |
| --- | --- | --- | --- | --- | --- | --- |
| `floral-alchemy/site-home-1440/960.webp` | WebP 1440×900 | 16:10 | Storefront home | REAL_PROJECT_PHOTO (live capture) | `audit/tools/flora.mjs` | Live site |
| `floral-alchemy/site-shop-1440/960.webp` | WebP 1440×900 | 16:10 | Shop: catalogue + filters | REAL_PROJECT_PHOTO | same | Live site |
| `floral-alchemy/site-product-1440/960.webp` | WebP 1440×940 | 16:10 | Product detail | REAL_PROJECT_PHOTO | same | Live site |
| `floral-alchemy/site-custom-gifts-1440/960.webp` | WebP 1440×900 | 16:10 | Custom Gift Studio | REAL_PROJECT_PHOTO | same | Live site |
| `floral-alchemy/site-gift-finder-1440/960.webp` | WebP 1440×900 | 16:10 | Gift Finder | REAL_PROJECT_PHOTO | same | Live site |
| `floral-alchemy/site-home-mobile-390.webp` | WebP 390×844 | 390:844 | Home at 390 px | REAL_PROJECT_PHOTO | same | Live site |
| `floral-alchemy/atelier-table.webp` | WebP 512×286 | 16:9 | The atelier table | CLIENT_SUPPLIED | Client website | © Flora Alchemy |
| `floral-alchemy/brand-logo.webp` | WebP 640×640 | 1:1 | Brand roundel | CLIENT_SUPPLIED | Client website | © Flora Alchemy |
| `floral-alchemy/product-blush-posy-960/480.webp` | WebP 960×1279 | 3:4 | Blush pink lily & rose | CLIENT_SUPPLIED | Client website | © Flora Alchemy |
| `floral-alchemy/product-sunshine-daisy-960/480.webp` | WebP 960×1280 | 3:4 | Sunshine daisy sunflower | CLIENT_SUPPLIED | Client website | © Flora Alchemy |
| `floral-alchemy/product-lily-960/480.webp` | WebP 960×1280 | 3:4 | Blue & white lily | CLIENT_SUPPLIED | Client website | © Flora Alchemy |
| `floral-alchemy/deckled-card-set.webp` | WebP 512×279 | 16:9 | Deckled stationery set | CLIENT_SUPPLIED | Client website | © Flora Alchemy |
| `floral-alchemy/keepsake-box-open.webp` | WebP 512×279 | 16:9 | Keepsake box, open | CLIENT_SUPPLIED | Client website | © Flora Alchemy |
| `floral-alchemy/letter-and-wax-seal.webp` | WebP 512×279 | 16:9 | Handwritten note + wax seal | CLIENT_SUPPLIED | Client website | © Flora Alchemy |
| `floral-alchemy/keepsake-box-ribbon.webp` | WebP 512×279 | 16:9 | Box, velvet ribbon | CLIENT_SUPPLIED | Client website | © Flora Alchemy |
| `floral-alchemy/pressed-botanical-card.webp` | WebP 512×279 | 16:9 | Pressed botanical card | CLIENT_SUPPLIED | Client website | © Flora Alchemy |
| `floral-alchemy/wrapped-posy-tag.webp` | WebP 512×286 | 16:9 | Wrapped posy + tag | CLIENT_SUPPLIED | Client website | © Flora Alchemy |
| `floral-alchemy/chenille-lavender.webp` | WebP 512×279 | 16:9 | Chenille lavender, macro | CLIENT_SUPPLIED | Client website | © Flora Alchemy |
| `floral-alchemy/dried-bundle.webp` | WebP 512×279 | 16:9 | Dried bundle, orange thread | CLIENT_SUPPLIED | Client website | © Flora Alchemy |
| `floral-alchemy/single-stem-pot.webp` | WebP 512×279 | 16:9 | Single stem in a pot | CLIENT_SUPPLIED | Client website | © Flora Alchemy |
| `floral-alchemy/sunflower-charm.webp` | WebP 512×279 | 16:9 | Sunflower charm | CLIENT_SUPPLIED | Client website | © Flora Alchemy |

All WebP files were encoded from the originals at quality 82 (ffmpeg/libwebp). The photographs
are 512 px at source on the client's site — they are displayed no larger than that allows, and
the product portraits are the only frames above 960 px.

**Rights:** these are the client's published assets, used here with the studio's direction to
integrate the project. The site prints `photography © Flora Alchemy` on every frame and in the
facts list. If the studio does not hold a written licence for reuse off the client's own domain,
that permission must be confirmed before this build is published (see `LAUNCH_READINESS.md`).

## 4. Generated imagery — concept photography

All files below are `AI_CONCEPT_VISUAL`: generated in one pass on 2026-11-22 for the three
studio-format studies. No real person, client, product, logo or published post is depicted. The
UI labels each one (`concept post`, `concept cover`, `concept frame`, `concept mockup`) and the
block copy states the same, so none can be mistaken for delivered work.

| File | Ratio | Subject | Placement | Label |
| --- | --- | --- | --- | --- |
| `always-on/post-01-founder.jpg` | 880×1184 | Founder talking to camera at a studio desk | Always On · post set, grid tile 01 | `concept post` |
| `always-on/post-02-package.jpg` | 880×1184 | Hands tying twine around a kraft box | Always On · post set, grid tile 03 | `concept post` |
| `always-on/post-03-counter.jpg` | 880×1184 | Two cups on a café counter | Always On · post set, grid tile 06 | `concept post` |
| `always-on/post-04-designer.jpg` | 880×1184 | Designer at a wall of pinned swatches | Always On · post set, grid tile 08 | `concept post` |
| `always-on/reel-01-lamp.jpg` | 752×1392 | Hand switching on a desk lamp at night | Always On · reel 01, grid tile 11 | `concept cover` |
| `always-on/reel-02-notebook.jpg` | 752×1392 | Hands writing in a notebook, overhead | Always On · reel 02, grid tile 04 | `concept cover` |
| `always-on/reel-03-parcels.jpg` | 752×1392 | Woman carrying kraft parcels through a doorway | Always On · reel 03, grid tile 07 | `concept cover` |
| `hook-turn-payoff/frame-01-hook-9x16.jpg` | 752×1392 | Hand over the record button, night studio | Hook, Turn, Payoff · frame 01 | `concept frame` |
| `hook-turn-payoff/frame-02-turn-9x16.jpg` | 752×1392 | Same desk pulled back: two cups, empty chair | Hook, Turn, Payoff · frame 02 | `concept frame` |
| `hook-turn-payoff/frame-03-payoff-9x16.jpg` | 752×1392 | Same desk, the chair now occupied | Hook, Turn, Payoff · frame 03 | `concept frame` |
| `studio-identity/mockup-print-3x4.jpg` | 880×1184 | Blank cotton cards and marigolds on a desk | Identity · application 01 | `concept mockup` |
| `studio-identity/mockup-letterhead-3x4.jpg` | 880×1184 | Blank letterhead, envelope, pen on kraft | Identity · application 02 | `concept mockup` |
| `studio-identity/mockup-stickers-3x4.jpg` | 880×1184 | Blank die-cut sheets on a sunlit desk | Identity · application 03 | `concept mockup` |
| `studio-identity/mockup-wall-4x3.jpg` | 1184×880 | Blank framed poster on a studio wall | Identity · application 04 | `concept mockup` |

**Mockup compositing:** the four stock environments are generated, but the Desi Draft wordmark and
sticker artwork placed on them are the repository's real SVG assets, positioned in the DOM over the
photograph. The wordmark is never generated and no printed run is claimed.

**Continuity:** the three Hook, Turn, Payoff frames were generated by editing frame 01, so the desk,
lamp, camera, tally light and colour grade stay identical across the sequence. The Always On set was
generated together with one palette and one lighting direction so the project reads as one studio.

The earlier 2026-11-19 concept render (`concept-room-wide.jpg`) and the four café interior sheets
were removed with the café narrative in the Flora Alchemy rebuild; that history stays in
`IMAGE_GENERATION_BRIEF.md` for the record only.

## 5. Vector art drawn in the repository

| Group | Location | Use | Class |
| --- | --- | --- | --- |
| Wordmark | `src/components/Logo` / `Header` | Nav, footer, end card | REAL_PROJECT_PHOTO (own identity) |
| Sixteen stickers | `src/components/art/Stickers.tsx` | Section punctuation, sticker sheet | REAL_PROJECT_PHOTO (own identity) |
| Doodles | `src/components/art/Doodles.tsx` | Underlines, arrows, ellipses | REAL_PROJECT_PHOTO (own identity) |
| Sheet compositions | `audit/sheets/sheets.tsx` | Renderer for the artefacts above | Own work (dev-only, not shipped) |

## 6. Placeholders still on the site

| Slot | Where | Class | Reason |
| --- | --- | --- | --- |
| Six monogram portraits | Team | PLACEHOLDER | No photography, no likeness rights. |
| Hero montage | Hero | PLACEHOLDER (motion) | Code-drawn stand-in; `media.heroVideo` empty. |
| Social post covers | Always On | AI_CONCEPT_VISUAL (labelled) | Concept posts, reels and grid are published as illustrations of the system. Real creatives from the first retainer replace them when that work is cleared. |
| Storyboard frames | Hook, Turn, Payoff | AI_CONCEPT_VISUAL (labelled) | Concept frames for a method, not a filmed commercial. Replace with stills from a released studio film. |
| Identity mockups | Studio Identity | MOCKUP over AI_CONCEPT_VISUAL | Real wordmark and stickers composited in the browser over generated environments. Not a claim of a printed run. |

## 7. Rights checklist for any future asset

- [ ] Studio owns it, or the licence is written here before it is committed.
- [ ] No identifiable person without consent.
- [ ] No client interior, logo, menu or packaging without display permission.
- [ ] Alt text describes the image, not the intention.
- [ ] `ratio` in the slot matches the file; no upscaling.
- [ ] Compressed: stills ≤ 400 KB, film ≤ 8 MB.
- [ ] If generated: the prompt is recorded and the UI prints `concept`.

## Selected Work refinement — 23 Nov 2026

No new image files were generated in this pass. The following existing assets changed role:

| Asset | Now used as |
| --- | --- |
| `videos/cut-to-the-beat-master.mp4` | contained in a dedicated 9:16 frame inside the card; three chapter stills sit beside it with timecodes |
| `always-on/post-01…04`, `reel-01…03` | twelve-post grid tiles with written format, pillar and copy overlays |
| `hook-turn-payoff/frame-01…03` | native 9:16 storyboard frames, labelled HOOK / TURN / PAYOFF |
| `studio-identity/sticker-sheet-16x9.jpg` | sticker system panel in the identity card |
| `work/desi-draft-work.jpg` | live desktop application in the identity card |
| `flora-alchemy/site-home-mobile-390.webp` | mobile application capture inside the Flora card |

Copy correction: the identity set is described as **four typefaces** (previously “four faces”). All generated assets above remain labelled concept work.
