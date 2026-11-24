# Desi Draft — Image Generation Brief

Specifications for every visual the site still needs, written before anything is produced.
Companion to `IMAGE_POPULATION_AUDIT.md` and `IMAGE_ASSET_REGISTER.md`. 2026-11-19.

## 0. What was actually produced in this pass

The site's empty frames split into two kinds, and they were treated differently.

1. **Artefacts the studio already owns** — an elevation drawing, a motif study, a lettering
   study, a counter/menu surface plan, reel covers, a beat-marked timeline, a month grid plan,
   a beat sheet, a storyboard, the identity sheet, the type specimen, the sticker sheet.
   These are not photographs of a project; they are the design work itself. They were
   **composed in code** from the real tokens, typefaces and sticker components in
   `src/`, rendered at their exact source ratio, and captured to
   `public/images/portfolio/`. Sixteen images, all classified `AI_CONCEPT_VISUAL: no` /
   `REAL artefact: yes` in the register.
2. **The one frame that reads as photography** — the Floral Alchemy room. The image
   generator produced a single 21:9 interior concept before its quota ran out. It is
   labelled `concept visualisation` on the image itself, on the card, and in the case study.

Everything below that is still open needs a camera, a film, or a person — not a generator.

## 1. Rules that apply to every image below

- Match the frame's declared `ratio` in `src/data/portfolio.ts`. Never crop a 3:2 photograph
  to 21:9 and call it a composition; frame it at 21:9.
- Natural or single-source light. No HDR, no lens flare, no teal-and-orange grade.
- Palette is the room's, not the site's: plaster cream `#EEEAE3`, oxblood `#9B2155`,
  leaf green `#2E7D5B`, cobalt `#4B63E8`. The site's colours are allowed to disappear into
  a photograph; they just cannot look pasted on.
- No recognisable person without written consent. No client logo, signage or menu without
  display permission.
- No legible invented copy. Where type appears in a mock, it is the studio's own words.
- Deliver at 2× the largest rendered size, JPEG q80–85 or WebP, ≤ 400 KB per still.
- Every file lands at the path in its row, with `src` set on the matching `MediaSlot`.

## 2. Open specifications

### 2.1 Floral Alchemy — finished room (the one blocking frame)

| Field | Value |
| --- | --- |
| Subject | The same corner as the concept render, after fit-out: botanical wall on the left, lettered service wall on the right, counter and seating in frame |
| Purpose | Closes the case study: concept → drawing → build → room |
| Style | Documentary architectural, 35 mm, neutral colour, fine grain |
| Lighting | Late-afternoon window light, no flash, practicals on |
| Palette | As built; must be close to the concept so the pair reads as one project |
| Framing | One-point perspective from the entrance, slight tilt, eye height 1.55 m |
| Orientation / ratio | Landscape, `21 / 9` (also shoot `16 / 9` for the plate fallback) |
| Resolution | ≥ 3000 px wide |
| Reference | The concept render in the case study, shot for shot |
| Filename | `public/images/portfolio/floral-alchemy/room-finished-21x9.jpg` |
| Destination | `portfolio.ts` → `cafe.gallery[4].src` |
| Classification | REAL_PROJECT_PHOTO |
| Gate | Client display permission |

### 2.2 Floral Alchemy — build detail set (optional, P2)

Four frames, each `4 / 5`, shot on the same visit as 2.1: taped wall edge mid-paint, the
chalk grid on bare plaster, a paint chip taped to the wall, the counter face at grazing
light. Filenames `build-01…04.jpg`, destination `cafe.gallery` (append). Classification
REAL_PROJECT_PHOTO. These replace nothing; they deepen the build diary.

### 2.3 Hero reel

| Field | Value |
| --- | --- |
| Subject | 15–30 s montage: the café walls being painted, a cut being assembled, a sticker being applied, the site on a phone |
| Purpose | The first thing a client sees is moving work rather than a gradient |
| Style | Phone-shot, handheld, honest; cut on the beat, no transitions |
| Lighting | Available light only |
| Palette | As shot |
| Framing | Vertical source, safe area for the 16:9 hero |
| Ratio | 16:9 delivery, ≥ 1920×1080; ≤ 8 MB MP4/WebM |
| Filename | `public/video/hero-reel.mp4` + `public/video/hero-poster.jpg` |
| Destination | `media.heroVideo`, `media.heroPoster` |
| Classification | REAL_PROJECT_PHOTO (film) |

### 2.4 Cut to the Beat — one real film

Same film in three native compositions, not one crop: `9 / 16`, `1 / 1`, `16 / 9`,
15 s and 30 s cuts. Filenames `film-9x16.mp4`, `film-1x1.mp4`, `film-16x9.mp4`, posters
`film-*-poster.jpg`. Destination: `cut.cover.src` (vertical) and `cut.gallery`. Only when a
real file is present does the card's play glyph render. Classification REAL_PROJECT_PHOTO.

### 2.5 Always On — one live campaign set (conditional)

Only if the studio runs its own account with real posts: three `1 / 1` frames + one
`9 / 16` reel cover, captured from the published account, not re-typeset. Filenames
`live-post-01…03.jpg`, `live-reel.jpg`. Classification REAL_PROJECT_PHOTO. Until then the
concept set already in place stays labelled `concept set`.

### 2.6 Six team portraits

| Field | Value |
| --- | --- |
| Subject | Each credited member, shoulders up, neutral expression, no props |
| Purpose | Replaces the monogram fallback; the section is the trust page |
| Style | Consistent studio portrait session, same lens and distance for all six |
| Lighting | One soft source camera-left, cream backdrop |
| Framing | Centred, eyes on the upper third |
| Ratio | `4 / 5`, ≥ 1200 px wide |
| Filenames | `public/images/team/<slug>-4x5.jpg` |
| Destination | `media.teamPhotos[name]` |
| Classification | REAL_PROJECT_PHOTO |
| Gate | Written consent for name, role and likeness |

**Synthetic portraits are not an acceptable substitute and were not produced.**

## 3. Generation prompt used for the one concept frame

Recorded for reproducibility; it is the only generated file in the repository.

```
Wide interior photograph of a small neighbourhood café in India, shot on 35mm film with soft
natural window light from the left. Warm plaster-cream walls (#EEEAE3), terrazzo floor,
bentwood chairs and a small marble table. On the left wall: large hand-painted botanical
line-work in muted leaf green and dusty oxblood — loose stems, leaves and petal outlines,
deliberately unfinished at the edges. On the right wall: abstract hand-sprayed graffiti
strokes and letterforms in cobalt blue over cream plaster, no readable words. Cinematic,
editorial art-direction photography, natural shadows, slight grain, no people, no readable
text or signage. Composition: room read from the entrance, wide symmetrical one-point
perspective, quiet and lived-in.
```

Output: 1568×672 (21:9), saved as
`public/images/portfolio/floral-alchemy/concept-room-wide.jpg`, 133 KB.

## 4. Prompts written but not run

The image generator returned a quota error after the first frame. These were queued and
are the correct next calls if generation is retried — each is a *photograph of a space or an
object*, never a UI, a person, a client or a finished build:

| # | Target | Prompt summary | Ratio |
| --- | --- | --- | --- |
| 1 | `cafe/build/brushwork-macro` | Raking light across hand-painted petals on cream plaster; pencil guide lines visible; unfinished edge; macro, shallow depth of field | `4 / 5` |
| 2 | `cafe/build/lettering-in-progress` | Cobalt and oxblood spray strokes on cream plaster, masking tape, chalk snap-line, paint can at the base of the wall, doorway light | `4 / 5` |
| 3 | `cafe/build/counter-and-menu` | Counter face with painted line-work, concrete top, brass tap, small printed menu card with unreadable type | `16 / 9` |
| 4 | `studio/desk-storyboard` | Overhead of a writing desk: notebook, three pencil storyboard frames, hand entering frame, warm desk lamp | `4 / 3` |
| 5 | `studio/edit-suite` | Dark edit suite, timeline glow on a monitor edge, headphones and a notebook, no readable screen content | `16 / 9` |

If any of these are generated later, they enter the register as `AI_CONCEPT_VISUAL`, and the
plate they replace only if the case study says `concept` on the image.

## 5. What will not be generated

- Team portraits, client logos, testimonials, awards, metrics, press mentions.
- Website screenshots: those come from the running build or not at all.
- A "finished" café interior, until the café is finished.
- Anything that would make a format (a system, a plan) look like a delivered client job.
