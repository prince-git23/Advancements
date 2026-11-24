# Desi Draft — Asset Gap Register

What the site needs, what exists, and what must never be substituted. Updated 2026-11-19,
after the image population pass. See `IMAGE_POPULATION_AUDIT.md`,
`IMAGE_GENERATION_BRIEF.md` and `IMAGE_ASSET_REGISTER.md` for the current frame-by-frame state.

**Rule:** no AI-generated photograph of a client, a room, a team member or a finished project
may stand in for real documentation. Where a generated concept frame exists it is labelled
`concept visualisation` on the image itself. Artefacts the studio genuinely owns (plans,
sheets, drawings, captures) are used directly and are not substituted at all.

## 1. What exists today

| Asset | Path | Type | State |
| --- | --- | --- | --- |
| Home screenshot | `public/work/desi-draft-home.jpg` | 1440×900 capture | VERIFIED |
| Work index screenshot | `public/work/desi-draft-work.jpg` | 1440×900 capture | VERIFIED |
| Mobile screenshot | `public/work/desi-draft-mobile.jpg` | 390×844 capture | VERIFIED |
| 12 studio artefacts (reel covers, timeline, grid plan, beat sheet, storyboard, identity, type, stickers) | `public/images/portfolio/**` | JPEG exports of code | VERIFIED |
| 14 Flora Alchemy photographs | `public/images/portfolio/flora-alchemy/*.webp` | WebP, client site, credited | VERIFIED (reuse permission to confirm) |
| 6 Flora Alchemy interface captures | `public/images/portfolio/flora-alchemy/site-*.webp` | WebP 1440 and 390 | VERIFIED (live deployment) |
| Wordmark, stickers, blobs, doodles | `src/components/art/*` | vector, in code | VERIFIED |
| Palette, typefaces | `index.html`, `tailwind.config.js` | tokens | VERIFIED |

There is still no photograph of a human being or a real film in this repository. There is no
café: that project was a different business and the Flora Alchemy case study is now the live
storefront, built from the client's own photography.

## 2. Register

Priority: **P0** blocks launch of a page, **P1** needed for credibility, **P2** improves the portfolio.

| # | Asset | For | Spec | Priority | State | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Storefront, shop, product, custom-gift and gift-finder captures | Flora Alchemy case study | 1440×900, live build | P0 | SUPPLIED — `audit/tools/flora.mjs` | Studio |
| 2 | Product, atelier and packaging photography | Flora Alchemy gallery, making, packaging | ≥960px where available | P0 | SUPPLIED from the client site; low-res frames shown at 512 | Client |
| 3 | Brand mark | Flora Alchemy brand block | 1:1 | P1 | SUPPLIED | Client |
| 4 | Written reuse permission for client photography | Whole Flora Alchemy case study | written, on file | P0 before publication | MISSING — permission must be confirmed | Studio / client |
| 5 | 1080px Instagram covers or stills | Selected work / social | 1:1 or 9:16, ≥1080px | P1 | MISSING — public thumbnails are 360–640px | Social |
| 6 | 15s vertical master + 1:1 + 16:9 versions | Cut to the Beat | H.264/VP9, muted-safe, poster per ratio | P0 | MISSING — covers in place | Edit |
| 7 | Three campaign creatives + one reel cover | Always On | 1:1 ×3, 9:16 ×1 | P0 | CONCEPT SET + reel cover in place; real posts MISSING | Social |
| 8 | One redacted script page | Hook, Turn, Payoff | 16:9 scan or export | P1 | AWAITING PERMISSION (beat sheet in place) | Copy |
| 9 | Three storyboard frames (first 3 seconds) | Hook, Turn, Payoff | 4:3 | P1 | SUPPLIED (studio storyboard) | Copy |
| 10 | Identity sheet (wordmark + palette + type) | Studio Identity cover | 16:9 export | P1 | SUPPLIED (captured from code) | Design |
| 11 | Sticker sheet, 16 die-cuts | Studio Identity gallery | 16:9 export | P2 | SUPPLIED (captured from code) | Design |
| 12 | Hero reel (15–30s montage) | Hero | ≤8 MB, poster frame | P1 | MISSING — gradient stand-in | Edit |
| 13 | Six team portraits | Team | 4:5, ≥1200px, consistent light | P0 | MISSING — monograms, no synthetic faces | Studio |
| 14 | Studio photograph (the room, at work) | Intro / About | 16:9 | P2 | MISSING | Studio |
| 15 | Client logos (SVG, cleared) | Clients | monochrome + colour | P0 if the section returns | MISSING — the section was deleted | Client |
| 17 | Café client name + display permission | Floral Alchemy metadata | written approval | P0 | AWAITING PERMISSION | Client |
| 18 | Real WhatsApp number, Instagram, LinkedIn, TikTok, full address, map pin | Footer, header | verified values | P0 | REMOVED from the public UI — `site.ts` now holds empty strings and the components skip them; only `hello@desidraft.com` and "Pune, India" are published | Studio |
| 19 | Real team names, roles, consent | Team | written consent | P0 | NEEDS CONFIRMATION | Studio |

## 3. Frames the code expects, by slot name

Every string below drives the neutral plate. It disappears the moment `src` is set, and
falls back to the plate again if the file fails to load.

Populated this pass: `wall elevation plan`, `motif study`, `lettering study`, `counter face
elevation`, `reel cover — 9:16 master`, `format frame 01`, `beat-marked timeline`,
`end card — 16:9`, `month grid plan`, `campaign post set`, `reel cover — sound-off legible`,
`annotated beat sheet`, `storyboard — first three seconds`, `identity sheet`,
`type specimen`, `sticker sheet`.

Still plates:

- `finished room — wide, after fit-out`
- `wide room photograph — floral wall meeting lettered wall` (replaced by a labelled concept frame)

## 4. Acceptable interim states

1. **Studio artefact** (new): a plan, sheet or drawing the studio genuinely owns, captured at
   the slot's ratio. Preferred over any substitute.
2. **Labelled concept** (new): a generated visualisation, printed as `concept visualisation`
   on the image, never presented as the built thing.
3. **Neutral plate** (current for the last frames): paper tone, hairline frame, brand colour
   rule, the literal frame description and its ratio.
4. **Omission**: a project with no media can stay out of the home page while remaining at its route.
5. **Not acceptable**: stock photography, AI-generated rooms or people presented as real,
   colour-gradient "art" standing in for a photograph, or a play button over a film that
   does not exist.

## 5. Asset intake checklist

Before any asset is committed:

- [ ] The studio owns it or has written permission recorded in `IMAGE_ASSET_REGISTER.md`.
- [ ] Alt text describes the actual image, not the intended project.
- [ ] Ratio is recorded in the slot (`ratio`), and the frame is not upscaled.
- [ ] File is compressed (JPEG/WebP for stills, ≤400 KB; MP4/WebM for film, ≤8 MB).
- [ ] No identifiable person appears without consent.
- [ ] No client logo or interior appears without display permission.
- [ ] If generated, the image carries `tag: 'concept visualisation'` in the data.
- [ ] If it is a screenshot, it was captured from the current production build.
