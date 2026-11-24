# FINAL CONTENT AUDIT — Desi Draft

This is the inventory of what the site actually contains, what each asset is, and what is still
missing. It is deliberately blunt: the value of this portfolio depends on a visitor being able
to tell shipped work from studio systems.

Rule applied throughout: **no fabricated project, client, metric, testimonial or photograph.**
When something does not exist, the site either omits it or labels it as what it is.

---

## 1. Projects (six, all traceable to something the studio owns)

| Project | Status | What the content is | Evidence quality |
| --- | --- | --- | --- |
| **Flora Alchemy** (`/work/floral-alchemy`) | `live` | A real, deployed botanical storefront. 13 client photographs of product, atelier and packaging; 4 browser-framed captures of the live shop (home, product, Custom Gift Studio, Gift Finder); the brand's own roundel, tagline and positioning copy. | **Highest on the site.** Everything is either the client's photography or a capture of the running site. Every frame carries `photography © Flora Alchemy` / `interface capture`. |
| **desi draft dot com** (`/work/desi-draft-dot-com`) | `live` | This website, captured at 1440 and 390 (home and work index). | Real captures of a real deployment. |
| **Cut to the Beat** (`/work/cut-to-the-beat`) | `in development` | A studio format: edit grammar sheet — reel cover, hook frame, beat-marked timeline, 16:9 end card. | Code-rendered studio artefacts, labelled as formats. No film still exists yet. |
| **Always On** (`/work/always-on`) | `in development` | A monthly social system: grid plan (12 tiles with per-format diagrams), post set, sound-off reel cover. | Code-rendered plan; the only "concept" frame is labelled `concept set` on the image itself. |
| **Hook, Turn, Payoff** (`/work/hook-turn-payoff`) | `ongoing` | Script/structure format: annotated 30 s beat sheet with a seven-shot column and four script lines, plus a three-frame storyboard with shot, timecode and lens. | Code-rendered studio artefacts. |
| **The Studio Identity** (`/work/studio-identity`) | `studio` | Desi Draft's own identity: the live homepage in the board, wordmark lockups, the 16-sticker die-cut set, wordmark size ladder, colour by role, type specimen with settings and character sets, and a six-colour palette table. | Code-rendered from the real tokens; the homepage capture is real. No client branding project is implied anywhere. |

Supporting data: `src/data/portfolio.ts`, `src/data/floraAlchemy.ts`.

## 2. What was removed, and why

| Removed | Reason |
| --- | --- |
| Café / graffiti Flora Alchemy narrative, `concept-room-wide.jpg`, four café surface sheets | Described a project that never existed and contradicted the live client work |
| `spaces` category and filter | No project behind it |
| Brand card swatch strip, DOM palette strip on the brand card | Raw colour without context; the sheet carries it properly |
| Always On wireframe card (9 empty tiles), duplicate 3 × 3 diagram on its case study | Empty boxes reading as unfinished work; the month plan says more |
| Hero underline stroke | Duplicated the ellipse annotation once both finally rendered |

Everything removed was either fabricated, empty, or a duplicate of information shown elsewhere
on the same screen.

## 3. Imagery status

- **Photography (real):** 13 Flora Alchemy frames + 1 logo roundel, all client-owned.
- **Live captures (real):** 5 Flora Alchemy interface frames, 3 desi-draft.com frames.
- **Designed artefacts (honest, labelled):** the twelve studio sheets in
  `public/images/portfolio/**` — beat sheet, storyboard, timeline, hook frame, end cards, grid
  plan, post set, reel covers, identity board, type specimen, sticker sheet.
- **Placeholders (labelled in place):** six team portraits (monogram posters, "portraits in
  progress"), hero film (gradient montage), any media slot without a file (designed asset plate
  naming the frame still to be shot).

No AI-generated image is used to represent work. No stock photograph stands in for a project.

## 4. Copy inventory

- Every section has one heading, one short standfirst and, where relevant, a CTA that performs
  a real action. There are no repeated feature lists and no two sections share a sentence.
- The honesty line ("no borrowed logos, no numbers we cannot show you") appears **once**, on
  `/work`.
- Case studies carry `challenge`, `approach`, `role`, `deliverables` and `phase` — specific
  decisions, not adjectives.
- No testimonials, client logos, awards, dates or reach numbers appear anywhere, because none
  are verified.
- Full per-section verdicts are in `docs/FINAL_COPY_AUDIT.md`.

## 5. Missing assets — the actual blockers

| # | Missing | Where it bites | What is needed |
| --- | --- | --- | --- |
| 1 | **Hero reel** | Hero falls back to a gradient montage | 15–30 s cut of real studio work, 16:9 + 9:16, H.264/WebM, with a poster frame. Set `media.heroVideo` / `heroPoster`. |
| 2 | **Team portraits** | Six monogram posters on the darkest section | 6 photographs, same light, same crop, written consent. Set `media.teamPhotos`. |
| 3 | **A real film** | Cut to the Beat and Hook, Turn, Payoff are formats without a finished film | One released project (client-cleared) → real stills, a 9:16 master and an edit timeline. |
| 4 | **Instagram originals** | Only 360–640 px public thumbnails and two reels exist publicly | Original exports of the reels and graphics from the studio's own account. Low-res thumbnails must not be presented as originals. |
| 5 | **Flora Alchemy reuse permission** | Photography is credited but written reuse permission is not on file | A short written confirmation from the client that the photography and interface captures may be published. |
| 6 | **Verified contact details** | Every CTA routes to the on-site dialog | A tested inbox, and optionally a WhatsApp link — set `site.email` / `site.whatsapp` and the UI picks them up with no other change. |
| 7 | **Case-study outcomes** | No `outcome` paragraphs exist | Only writable with real numbers from a real client engagement. |
| 8 | **A project for "creative spaces"** | The service is offered with no evidence | Either a documented project or the group is dropped. |

## 6. What a visitor can conclude today

That this is a studio with one substantial, verifiably live client project, a site it built for
itself, a working identity system, and three clearly labelled production formats in progress —
and that it has not invented the rest. That is a smaller portfolio than a page of mock-ups, and
it is the honest one.
