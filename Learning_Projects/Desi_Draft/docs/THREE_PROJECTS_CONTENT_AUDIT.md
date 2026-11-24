# Three Projects — Content Audit

Date: 23 November 2026
Scope: Always On, Hook/Turn/Payoff, The Studio Identity, plus the Selected Work ScrollStack that presents all five projects.

This audit records what exists, what is authentic, what is concept material and what was changed. It follows the rule already used across the site: no invented clients, results, published feeds or manufactured products.

---

## 1. Always On — Social Media — In Development

### Existing content
- Twelve-post monthly structure, four Reel formats, colour rhythm and one open comment-reply slot (`portfolio.ts → social`).
- Four concept post designs with written headlines and copy, four Reel covers, four content pillars, a weekly schedule and a voice guide.
- Case-study component: `SocialStudy` in `src/components/portfolio/StudioStudies.tsx`.

### Available authentic assets
- Generated concept photography: `public/images/portfolio/always-on/post-01-founder.jpg` … `post-04-designer.jpg`, `reel-01-lamp.jpg`, `reel-02-notebook.jpg`, `reel-03-parcels.jpg` (labelled concept work).
- Typographic tiles are rendered in code, so copy stays real text.
- Cover plate `grid-plan-4x5.jpg` is an editorial plan image, not a published feed.

### Missing / weak
- No real client, campaign, published posts, reach or engagement data — and none may be invented.
- The case-study grid used to read as a planning wireframe at 6-up: tiles were small and the copy was tiny.
- Individual post creatives were only four; the twelve-post grid did not carry designed copy on every tile.

### Copy and status
- Status stays **In Development**.
- Description: “A monthly social-content system: twelve posts, four Reels and one consistent voice.”
- Supporting line: “Planned as a complete feed before the first caption is written.”
- Concept material is labelled “concept system”, “concept post”, “concept cover”.

### Genuine deliverables
- Monthly grid plan and colour rhythm.
- Recurring formats with shot lists.
- Caption and reply voice guide.
- Reel concepts built for sound-off viewing.

### Skills demonstrated
Content strategy, art direction, copy, community/reply design, format systems, mobile-first layout.

### Changes made
- Selected Work card: all twelve tiles now carry a format/pillar kicker, a written line and the wordmark; photo tiles add a legibility gradient. No flat colour tile is left unlabelled.
- Mobile: the card’s twelve posts become a readable two-column feed instead of 80 px tiles or a clipped rail.
- `SocialStudy` grid: 4-up on desktop (was 6-up) with larger copy, so each tile reads as a post rather than a spreadsheet cell.
- Concept badge moved out of the tile copy so it never covers a headline.

### Recommended case-study structure (implemented)
1. The month as a grid.
2. The post set (4:5, written copy).
3. Four Reel covers (9:16, sound-off hooks).
4. Pillars and schedule.
5. Voice rules.
6. Skills.

---

## 2. Hook, Turn, Payoff — Scripts & Storytelling — Ongoing

### Existing content
- Three-beat library: hook reads without sound, turn changes information, payoff lands the brand; 15/30/45 s templates (`portfolio.ts → scriptStudy`).
- Three generated storyboard frames forming one continuous desk scene.
- Timing bar, script excerpt table, shot list, skills.
- Case-study component: `ScriptStudy`.

### Available authentic assets
- Concept frames `hook-turn-payoff/frame-01-hook.jpg`, `frame-02-turn.jpg`, `frame-03-payoff.jpg` (labelled concept).
- Beat sheet plate `beat-sheet-16x9.jpg`.
- Timings held in project data: 0:00–0:03, 0:14–0:17, 0:26–0:30 on the 30 s template.

### Missing / weak
- There is no filmed commercial to verify against; frames are coherent concept visuals, not production stills.
- The supplied 25-second screen recording that was meant to accompany this pass is **not present in the workspace**, so its spoken notes and on-screen timings could not be transcribed or cross-checked.
- Timings are the studio’s own beat sheet, not independently re-measured this pass.

### Copy and status
- Status stays **Ongoing**.
- “Three beats, fixed timings and a hook built to work without sound.”
- Concept frames labelled “concept frame”; storyboard labelled as concept.

### Genuine deliverables
- 15/30/45 s script templates.
- Hook library with visual-first openings.
- Beat sheets and shot columns.
- Storyboard frames for the first three seconds.

### Skills demonstrated
Scriptwriting, story structure, hook development, storyboarding, sound-off readability, shot planning.

### Changes made
- Selected Work card: the three frames are now shown at native 9:16 (no crop to the wide panel), side by side, with HOOK / TURN / PAYOFF and their timings set in site typography.
- Mobile: the three frames stack vertically at 74% width so each is readable instead of a clipped horizontal rail.
- Case study already leads with “three frames, one scene”, then the timing bar, then the written script; documentation is subordinate to the storyboard.

### Recommended case-study structure (implemented)
1. Three frames, one scene, with beat, timing, direction and script line.
2. Timing bar with markers.
3. Script as written.
4. Skills.

---

## 3. The Studio Identity — Branding & Graphic Design — Studio

### Existing content
- Wordmark, lockups (ink, cream, script), five-colour palette with jobs, four-typeface system with roles, sixteen die-cut stickers, desktop and mobile site screens, concept physical applications.
- Case-study component: `IdentityStudy`.

### Available authentic assets
- `Logo` SVG wordmark (`src/components/art/Logo.tsx`).
- Palette: `#2E7D5B`, `#E8603C`, `#8499F8`, `#E8B4F5`, `#E4FBA8`.
- Typefaces in use: Archivo, Instrument Serif, DM Sans, Yellowtail.
- `public/images/portfolio/studio-identity/sticker-sheet-16x9.jpg`, `type-specimen-16x9.jpg`, `identity-sheet-16x9.jpg`.
- Live site plates: `public/work/desi-draft-work.jpg`, `site-home-1440.webp`, `site-home-mobile-390.webp`.
- Stickers drawn as vectors (`src/components/art/Stickers.tsx`).

### Missing / weak
- Physical mockups are generated environments with real brand assets composited in; they are not manufactured products.
- The phrase “four faces” appeared in the Selected Work card and in the case-study type specimen. The brand documentation and deliverables both define **four typefaces**, so the wording was wrong.

### Copy and status
- Status stays **Studio**.
- Copy corrected to “four typefaces and sixteen stickers” (card) and “four typefaces, four jobs” (specimen/title).
- Mockups labelled “concept mockup”.

### Genuine deliverables
- Wordmark and lockups.
- Five-colour palette with usage rules.
- Four-typeface system with roles.
- Sixteen die-cut stickers.
- Website design system.

### Skills demonstrated
Identity design, type systems, art direction, design systems, digital and print application.

### Changes made
- Copy correction “four faces” → “four typefaces” in `portfolio.ts`, `WorkFeature.tsx` and `StudioStudies.tsx`.
- Selected Work card now includes a real type line (Archivo · Instrument Serif · DM Sans · Yellowtail), the palette, the sticker sheet and a live site screen.
- Mobile: sticker sheet and site stack full-width, wordmark and palette no longer clip.

### Recommended case-study structure (implemented)
1. Wordmark and lockups.
2. Language: palette and typography with the specimen.
3. Digital application: desktop screens plus 390 px phone capture.
4. Graphic system: sticker sheet and vector set.
5. Concept physical applications, labelled.
6. Skills.

---

## 4. Selected Work ScrollStack — shared presentation

### Problems observed
- Heading clipped at section entry.
- Wide card panel forced portrait film into landscape with black areas.
- Twelve-post tile grid read as empty colour swatches.
- Storyboard frames cropped by the panel.
- Flora media sat low with dead space above and a detached badge.
- Text column had unused vertical space.

### Fixes
- Section clearance: `scroll-mt-[110px]` and larger top padding; the heading is fully visible before the first card pins (verified at 1440).
- Per-project media: 9:16 film contained in a dedicated portrait panel; native-ratio storyboard frames; 4:5 photography; responsive site captures; no global `object-fit: cover` on portrait sources.
- Cut: real film left, three chapter stills with timecodes right; mobile shows only the portrait film at its native ratio.
- Always On: twelve designed posts; 2-column mobile grid.
- HTP: native 9:16 frames with HOOK/TURN/PAYOFF labels; vertical stack on mobile.
- Flora: screen centred, phone inset and caption inside the frame.
- Card density: three real deliverables per card between the line and the CTA; no invented statistics.
- Status, project order, names and routes unchanged.

### Open items
- The 25-second reference recording was not supplied to the workspace (searched the project and attachment cache; only the hero, Cut master and Flora recording exist). Phase 1 transcription is therefore not possible and no transcript has been invented.
- Beat timings remain the studio’s beat sheet.
- Testimonial and Team content are still unpublished placeholders (unchanged from the previous audit).
