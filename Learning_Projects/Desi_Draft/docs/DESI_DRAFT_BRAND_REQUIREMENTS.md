# Desi Draft — Brand Requirements

Generated from the repository on 2026-11-18. Every statement below is either quoted from the code or marked as unverified. No claim here was invented to fill a gap.

## 0. Evidence base and a stated limitation

| Source | Status |
| --- | --- |
| `src/data/site.ts`, `src/data/portfolio.ts`, `src/data/team.ts`, `src/data/clients.ts` | Read in full |
| `index.html` metadata, `src/App.tsx`, all section components | Read in full |
| `audit/REPORT.md`, `audit/perf.json`, `audit/frames` | Read |
| Public media in `public/` | 3 files, all screenshots of this website |
| **103-second screen recording with spoken audio** | **NOT PRESENT** |

**Limitation, stated plainly:** no `.mp4`, `.mov`, `.webm`, `.mp3`, `.wav`, `.m4a` or `.aac` file exists anywhere in this project (verified by a recursive search excluding `node_modules`). There is therefore no recording to listen to, and no timestamped transcript can be produced. Nothing in this document claims to represent the user's spoken requests. If the recording is supplied, it should be transcribed and this section replaced; until then, requirements are derived from the written brief and the code.

## 1. Official brand name

**Desi Draft** — written lowercase (`desi draft`) as the wordmark and in running copy, title case in metadata. The repo name, package name and email domain are all `desi-draft` / `desidraft.com`. No registered legal entity, GST number or studio address verification exists in the repository.

## 2. What the site currently claims

| Claim | Where | Verdict |
| --- | --- | --- |
| "we make content for the new desi mainstream" | Hero `<h1>`, page title | **Retained.** Positioning, not a capability claim. It is specific to the audience, memorable, and does not promise a service the studio cannot show. |
| "a true 360° agency … from Instagram Reels and TikTok to TVC, and from influencer collabs to out-of-home spectaculars" | `Manifesto.tsx` | **Removed.** Nothing in the repo evidences a TVC, an influencer collaboration or an OOH buy. A 360° claim is also the most generic sentence on the site. |
| "we are a young, future-proof team of 6 digitally native creators. not to brag!" | `Team.tsx` | **Replaced.** "Future-proof" and "digitally native" are self-assessments; the number 6 is true and verifiable in `team.ts`. |
| Client wall of ten brands | `data/clients.ts` + `Clients.tsx` | **Removed.** The file's own comment reads `Fictional client marks — replace with real SVG logos when cleared.` Displaying them under "proud to have worked with" is a false client claim. |
| "a social media agency" | `index.html` description | **Narrowed.** The disciplines in `portfolio.ts` are broader than social and the studio's own site is not social work. |

## 3. Positioning

**Recommended positioning statement**

> Desi Draft is a six-person studio making short-form content for Indian brands: the script, the shoot, the cut, and the surfaces the work lives on.

Why this and not the old manifesto:

- It names the actual production chain (write → shoot → cut → design), which is what the portfolio can prove.
- It keeps "desi" as the audience and cultural frame rather than as decoration.
- It makes no claim about scale (360°, full-service, award-winning) that the evidence cannot support.

**One-line version** (hero, retained): *we make content for the new desi mainstream.*

**The honest qualifier** used on the work index and in case study CTAs: *no borrowed logos, no numbers we cannot show you.* This is the brand's differentiator in a market of inflated agency sites, and it is demonstrably true of the site itself.

## 4. Target audience

| Segment | What they need to see | Evidence on site |
| --- | --- | --- |
| Café / restaurant owners opening or refreshing a room | Environmental art direction, menus, launch content | Floral Alchemy (in progress) |
| D2C and food brands running always-on social | A content system, not one-off posts | "Always On", "Hook, Turn, Payoff" |
| Founders who need a site and a brand at the same time | Design + frontend in one room | This website, the studio identity |
| Marketing leads buying short-form film | Format literacy (9:16 / 1:1 / 16:9, beat-cut) | "Cut to the Beat" |

Not evidenced anywhere in the repo: enterprise, government, real-estate, fashion-retail clients. Do not target them in copy until work exists.

## 5. Geographic focus

`site.ts` gives `2nd floor, 14 lane 3, Koregaon Park, Pune 411001` and `+91 00000 00000`.

- Pune is plausible and specific but **NEEDS CONFIRMATION** — the phone number is a placeholder, so the address may be too.
- Language and references are Indian-metro oriented (chai, shaadi season, biryani). Retain the Indian framing; do not claim "pan-India" or "global" anywhere.

## 6. Brand personality

Loud in typography, quiet in claims. Craft-obsessed, slightly irreverent, allergic to agency language. The design system already encodes this: heavy Archivo statements, Instrument Serif asides, die-cut stickers used as punctuation, five colours with assigned jobs.

**Traits:** direct · craft-first · self-aware · culturally fluent · anti-hype.

## 7. Brand voice

| Do | Don't |
| --- | --- |
| Short declarative sentences. Lowercase for texture. | "We are passionate about storytelling." |
| Name the actual work: cuts, grids, walls, type sizes. | "360° solutions", "synergy", "future-proof". |
| Admit stage: *in progress*, *in development*, *not shot yet*. | Imply completion, awards, reach or revenue. |
| One joke per page, maximum. | A pun in every heading. |
| Use first person plural, sparingly. | "Our team of experts". |

**Test applied to every public sentence in this pass:** *could a competitor paste this sentence onto their site unchanged?* If yes, it was rewritten or removed.

## 8. Value proposition

> We do the whole short-form job in one room — the idea, the script, the edit, and the design it sits in — and we only show work we can stand behind.

Differentiators that are real and demonstrable:

1. **Format-native editing.** Native 9:16, 1:1 and 16:9 composition is described in `portfolio.ts` and is a genuine editorial position, not a service badge.
2. **Design and frontend in the same team.** The site you are reading is the proof; it is also the only project with real media.
3. **Documented process.** Beat sheets, wall elevations, grid rhythm — the case studies show method, which is rarer than a showreel.
4. **Refusal to fake proof.** No stock, no invented clients, no metrics. This is a positioning choice, and the site must keep earning it.

## 9. Services — retention matrix

From `site.ts` `serviceGroups`. "Evidence" means something in the repo demonstrates it.

| Group | Retained | Evidence | Notes |
| --- | --- | --- | --- |
| Content production (edit, short-form, motion, type, colour/sound) | Yes | `cut-to-the-beat` format, this site's motion system | Shooting is claimed; only editing/motion is evidenced. Keep "shooting" only with a real film credit. |
| Creative strategy (scripts, hooks, planning, storyboards) | Yes | `hook-turn-payoff` library | Scripts are a studio format, not a client deliverable yet. |
| Digital experiences (site design, responsive frontend, React/Vite, motion, a11y, perf) | Yes | This website | Accessibility and performance work is real and audited in `audit/`. |
| Visual communication (identity, social creative, campaign, packaging, editorial, menus) | Yes, narrowed | Studio identity, Floral Alchemy menus | Packaging has no project behind it — keep only if a real pack shot exists. |
| Creative spaces (environmental art direction, floral, graffiti, wall composition, signage, install documentation) | Yes | Floral Alchemy | In progress; do not present as completed installation. |

**Removed from copy:** TVC production, influencer collaborations, out-of-home/spectaculars, "360°". None has a project, a frame or a credit in the repository.

## 10. Primary CTA

`mailto:hello@desidraft.com` with a pre-filled subject, plus a WhatsApp link.

- Email is the only channel with a real, non-placeholder value (`site.ts`).
- WhatsApp number `+91 00000 00000` is a **placeholder** — it must not ship. Until a real number exists, the footer's WhatsApp action should be treated as **AWAITING DATA**, not a live contact route.
- Case-study CTA copy: *"want the full deck for this one?"* → keep, but it promises a deck; only keep for projects where a deck exists.

## 11. Communication channels (state)

| Channel | Value in repo | State |
| --- | --- | --- |
| Email | hello@desidraft.com | VERIFIED (domain matches package name; mailbox not tested) |
| WhatsApp | +91 00000 00000 | PLACEHOLDER — do not publish |
| Instagram | `https://instagram.com` | PLACEHOLDER (no handle) |
| LinkedIn | `https://linkedin.com` | PLACEHOLDER |
| TikTok | `https://tiktok.com` | PLACEHOLDER |
| Address | Koregaon Park, Pune | NEEDS CONFIRMATION |

Fixing these is a content task, not a design task: each needs a real handle from the studio.

## 12. Copywriting direction (site-wide)

1. **Headings are statements, not labels.** "selected work, still being made" beats "Our Work".
2. **Every section must say something only Desi Draft could say.** If it reads like a template, cut it.
3. **Status is part of the voice.** *In progress*, *in development*, *studio format* are used as honest metadata, not apologies.
4. **No numbers without a source.** No "+120% reach", no "50+ brands", no "award-winning".
5. **Technical audit language stays in `docs/` and `audit/`.** Public pages do not explain their own performance budgets.
6. **Keep the lowercase, keep the serif aside, keep one sticker per surface.**

## 13. Brand assets that exist vs. do not

| Asset | State |
| --- | --- |
| Wordmark / logo (`art/Logo.tsx`) | Exists, in code |
| Palette, type system, 16 die-cut stickers | Exist, in code |
| Studio photography | MISSING |
| Team portraits | MISSING (`media.teamPhotos` is an empty map) |
| Client logos | MISSING (the ten in `clients.ts` were fictional and have been removed) |
| Project photography / film | MISSING except 3 site screenshots |

## 14. Open brand decisions (require the studio)

1. Confirm the legal/trading name and whether "studio" or "agency" is preferred in copy. This document recommends **studio** everywhere.
2. Confirm Pune address and a real WhatsApp number, or remove both.
3. Confirm whether the six names in `team.ts` are the real team and whether they consent to being published with role only (no portrait).
4. Confirm the café client's display permission and whether the project name may be used publicly.
