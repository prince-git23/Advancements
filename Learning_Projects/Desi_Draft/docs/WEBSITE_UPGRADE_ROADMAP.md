# Desi Draft — Website Upgrade Roadmap

Ordered by trust impact, then craft, then polish. Every item names the file it touches and the evidence required to close it.

## Phase 0 — Discovery and documentation (done, this pass)

- [x] Full source inspection (architecture, routes, motion, data, assets).
- [x] Recording review — **blocked: no recording file exists in the workspace.** Cannot transcribe.
- [x] Six requirement documents in `docs/`.
- [x] Asset gap register with 19 tracked items and per-slot names.

## Phase 1 — Trust corrections (done, this pass)

| Item | Change | State |
| --- | --- | --- |
| Fictional client wall | Deleted `Clients.tsx`, `data/clients.ts`, nav entry, section index | Done |
| 360° / TVC / influencer / OOH claim | Rewritten in `Manifesto.tsx` | Done |
| "future-proof team of 6 digitally native creators" | Rewritten in `Team.tsx` | Done |
| Asset-slot apologies in public copy | Removed `mediaNote` from model, data and template | Done |
| Developer notes in case studies | Website facts and chips rewritten | Done |
| Project named after its technique | Renamed to **Floral Alchemy**, slug `/work/floral-alchemy`, legacy redirect | Done |
| Gradient "art" standing in for photography | Replaced with neutral paper plates (no gradients, no fake imagery) | Done |
| Fake social posts on a card | Replaced with a labelled wireframe plan | Done |
| Missing per-project metadata | Title, description and OG tags set from the project record | Done |

## Phase 2 — Content that only the studio can supply (blocked)

These cannot be closed by code. Each is tracked in `docs/ASSET_GAP_REGISTER.md`.

1. ~~Floral Alchemy photography~~ — **closed**: the project is a live storefront, rebuilt this pass from its own published photography and captures. The café research stays closed.
2. ~~Café client name and display permission~~ — **closed**: there is no café project. The client is named by its public brand, Flora Alchemy.
3. **One real film** for Cut to the Beat, in three ratios. This is the single biggest credibility unlock: it turns a format document into a video case study.
4. **Instagram exports** — two reels are published, but public thumbnails stop at 640 px. 1080 px covers or original stills are needed before they join the portfolio.
5. **Six team portraits** and written consent to publish names/roles.
6. **Real contact details**: email, WhatsApp, LinkedIn, TikTok, address confirmation. Instagram is now published.
7. **Credits modal name** — currently `[your name]`.
8. **Reuse permission** for the Flora Alchemy photography if the studio is not the rights holder.

## Phase 3 — Portfolio depth (next, once media exists)

- [ ] Swap neutral plates for real frames, one project at a time, keeping `MediaSlot` unchanged.
- [ ] Add a second real client project per discipline where possible; do not populate categories with concepts.
- [ ] Turn the Floral Alchemy page into a build diary (dated stages) once the room opens.
- [ ] Add measured outcomes only where a client supplies reporting access.
- [ ] Replace the hero montage with a real reel (`media.heroVideo`).
- [ ] Regenerate `public/work/*.jpg` after any visual redesign so the self-case-study never shows a stale site.

## Phase 3b — Flora Alchemy real-asset pass (done)

| Item | Change | Evidence |
| --- | --- | --- |
| Café narrative removed | Project rewritten as a botanical commerce case study; concept render + four café sheets deleted from `public/` | `src/data/floraAlchemy.ts` |
| Real assets collected | 13 product/atelier/packaging photographs from the client's site, WebP, credited on every frame | `docs/IMAGE_ASSET_REGISTER.md` §3 |
| Live interface captured | 4 desktop + 1 phone screenshot of the deployed storefront via `audit/tools/flora.mjs` | `public/images/portfolio/flora-alchemy/site-*.webp` |
| Case study rebuilt | Brand block, product sequence, making strip, browser-framed interface, packaging, phone section, live link | `/work/floral-alchemy` |
| Category moved | `spaces` → `web`; the empty `spaces` filter removed; featured project excluded from the cards below it | `src/data/portfolio.ts`, `WorkFeature.tsx` |
| Responsive media | `srcSet`, intrinsic `width`/`height`, `sizes`, lazy + async decode; 480/960/1440 candidates | `AssetFrame.tsx` |
| Card depth | ±4° pointer-fine tilt, one rAF, reset on leave | `ProjectCard.tsx` |
| Case-study depth | Parallax on three full-bleed frames; entrance guard so nothing is stranded invisible | `CaseStudy.tsx` |
| Instagram | The verified profile is now published site-wide | `src/data/site.ts` |

## Phase 4 — Craft and interaction (partly done)

- [x] Case-study cover and media reveal, reduced-motion safe.
- [x] Portfolio hover scale on project frames (subtle, 1.02).
- [x] Gentle pointer tilt on portfolio media, pointer-fine only (±4°, `ProjectCard`).
- [x] Scroll parallax on the case study's full-bleed frames, desktop only, three frames maximum.
- [x] Hero media parallax inside the existing pin (no new pin, no new trigger).
- [ ] Sticky case-study meta rail on desktop (needs a project with enough scroll length to justify it).
- [ ] Editorial transition *into* a case study (shared-element cover) — evaluate after a real film exists, since the transition currently carries the whole moment on a coloured band.
- [ ] Intro pin shortened from 300% to ~220% after measuring on a low-end Android device.
- [x] Filter chips show their resulting count at rest (`PortfolioFilters` renders `counts[id]` on every chip), so no hover-only count is needed.

## Phase 5 — Performance and accessibility

Baseline at the time of writing (production build):

| Metric | Value |
| --- | --- |
| Initial JS | 164.53 kB `index` + vendor chunks, 55.14 kB gzip for `index` |
| CSS | 52.59 kB / 10.81 kB gzip |
| `/work/floral-alchemy` images | 1,103 kB across 24 frames, largest 90 kB WebP, all with intrinsic size |
| Lazy chunks | Matter 85.8 kB, WorkDetail 15.3 kB, QR 16.9 kB, WorkIndex 4.3 kB |
| Hero fps (pinned) | 60 GPU / 43.8 software (SwiftShader) |
| Team / services / footer fps | 60 GPU and software |
| Busy main thread (GPU) | hero 4.6% · work 6.2% · team 8.2–9.1% · services 10.8% · footer 10.6% |
| Horizontal overflow | 0 px at 1440, 768, 390, 360 |
| Console errors | none |

Tasks:

- [x] Favicon added (`public/favicon.svg`, linked in `index.html`) — removes the last console 404.
- [ ] Reduce hero montage cost or replace with video; target ≥45 fps.
- [ ] Re-measure after any phase 3 media lands (images change LCP).
- [ ] Keep route-level splitting: never import `portfolio.ts` into the initial chunk twice.

## Phase 6 — Structure

- [ ] Decide whether Services should link to filtered work per group (they already map 1:1).
- [ ] Consider a `/about` route only if there is real studio photography; otherwise the one-pager is more honest.
- [ ] If more than ~8 case studies exist, paginate or group the index by discipline.

## What is deliberately not on this roadmap

- A new 3D scene, lanyard, WebGL or shader work. There is no essential 3D feature and the old one was removed for measured reasons.
- A CMS. Six projects do not need one; the typed data file is faster and reviewable in git.
- Testimonials, awards, client logos or metrics sections until the evidence exists.
- AI-generated imagery of any kind for client, team or project representation.

## Definition of done for the portfolio

A prospective client can, in under two minutes: see one real piece of work in motion, understand what the studio actually does, see who is behind it, and reach a real inbox — without encountering a single invented claim. Today the site meets every part of that except the first.
