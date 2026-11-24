# Desi Draft — launch readiness

State of the site after the Flora Alchemy real-asset, motion and responsive pass,
and the final Team / Testimonials / Footer refinement (§10).
Nothing below is a claim about a live deployment: no domain has been pointed at
this build, so nothing here is verified in production.

## 1. Contact details — what is published

| Detail | Value | Why |
| --- | --- | --- |
| Instagram | **published** — `https://www.instagram.com/desidraftt.co/` | the studio's own public profile; opened and inspected directly |
| Email | empty (`site.email = ''`) | inbox never confirmed as deliverable |
| City / address | empty (`site.address = []`) | unverified business address |
| WhatsApp | empty | no verified number |
| LinkedIn / TikTok | empty | no verified profile URLs |
| Google Maps | empty | follows the address |

Instagram is the only verified public channel, so `hasContactChannel` is now
true and the contact panel shows it as a real destination instead of the
"details being confirmed" copy:

- Footer: the Instagram icon renders on its own (the other two stay hidden).
- Contact panel: "email us" is absent (no inbox), the Instagram link is present.
- Header WhatsApp button and QR dialog remain hidden while `site.whatsapp` is empty.

The profile itself: bio **"Ideas Into Impact. · Branding · Digital Marketing ·
Social Media Management"**, two published posts, both reels. Their public
thumbnails are 360–640 px, which is below portfolio grade — see §8 for what is
still needed from the studio.

## 2. CTAs

Every CTA is one of three honest things: a `mailto:` from a verified address, a
link to the verified Instagram profile, or a button that opens the on-site
contact panel. A shipped project also carries one external link to itself.

| CTA | Location | Destination now |
| --- | --- | --- |
| start a conversation | Services block | contact panel |
| start a project | footer contact column | contact panel |
| work with us | footer collaboration column | contact panel (“work with us”) |
| say hi | each of the three team cards | contact panel (“hello <name>”) |
| start a conversation | every unfinished case study | contact panel |
| **Visit Live Website** | Flora Alchemy header pill, phone section, closing band | `https://flora-alchemyy.vercel.app/` — `target="_blank"`, `rel="noopener noreferrer"` |

The contact panel is now a real enquiry form backed by `server/` (`npm run api`):
name, email, project, timeline and brief are validated on the server, stored in
SQLite and optionally forwarded to `ENQUIRY_WEBHOOK_URL`. The inbox is readable
with `GET /api/enquiries` and a Bearer `ENQUIRY_ADMIN_TOKEN`; the database
(`server/data/`) is gitignored. Nothing is invented in the form, and it is the
only destination that does not need a public inbox: no fabricated URL, no
`href="#"`, no `javascript:` links anywhere in the rendered pages. `cta.mjs`
asserts the live link's exact URL, target and `rel`.

## 3. Homepage

- Hero: still no showreel, so the code-drawn montage carries the frame and the
  play/pause control is not rendered. Added this pass: a 7% parallax drift and
  a 1.04 scale on the media layer inside the existing 75% pin (one transform,
  scrub-driven, removed entirely under reduced motion).
- Featured work is now **Flora Alchemy**, drawn from the live storefront
  capture, tagged `live` and `websites & digital` (the chip reads from the
  project's category instead of a hardcoded string).
- The featured project is excluded from the three cards below it, so the same
  project can no longer appear twice.
- Team, Services, footer physics, contact panel, SEO and favicon are untouched in
  this pass; the later Team/Testimonials/Footer pass is recorded in §10.

## 4. Flora Alchemy — rebuilt around the real work

| Item | Now |
| --- | --- |
| Public name | **Flora Alchemy** (as spelled on the live site) |
| Route | `/work/floral-alchemy` unchanged; `/work/floral-meets-graffiti` still redirects |
| Status | `live` — the storefront is open at the address below |
| Headline | `flora alchemy` + serif aside *sculpting a botanical digital experience* |
| Category | `web` (was `spaces`); the now-empty `spaces` filter was removed |
| Cover | live home capture at 16:10 (`coverFit: 'interface'`) |
| Brand block | the client's own roundel, tagline “Sculpted Nature. Hand-Bound Memories.” and positioning copy |
| Photography | 13 real product/atelier/packaging frames, all credited `photography © Flora Alchemy` |
| Interface | 4 browser-framed captures: shop, product page, Custom Gift Studio, Gift Finder |
| Responsive | the same shop at 390 × 844, in a phone frame |
| External link | `Visit Live Website` → `https://flora-alchemyy.vercel.app/` |

Removed with the old narrative: the café brief, the café client field, the
concept render (`concept-room-wide.jpg`) and the four café surface sheets
(`elevation-a`, `botanical-motif`, `lettering-passes`, `counter-and-menu`). No
café photograph, menu, interior or invented brand remains on the page, and the
case study no longer asks for a "finished room" frame it cannot have.

The service group **creative spaces** still exists in Services — it is an
offering, not a portfolio claim, and no case study is now attached to it.

## 5. Motion and interaction — what changed

| Area | Change |
| --- | --- |
| Portfolio cards | pointer-fine only 3D tilt, ±4° on `perspective(1100px)`, written to `style` on one rAF; reset on leave; nothing for touch or reduced motion |
| Case study | cover + section reveals kept; new parallax on the three full-bleed frames (desktop, `gsap.matchMedia`, ≤2.6% translate, image pre-scaled 1.06 so no edge shows) |
| Case study resilience | only frames *below the fold* are hidden for their entrance, so a deep link or restored scroll can never strand a section at opacity 0 |
| Hero | media-layer parallax inside the existing pin |
| Duplicate work | no second animation system owns a property: hovering a case-study frame is not a `.group`, so CSS hover scale and GSAP parallax never touch the same image |

Reduced motion: every new effect is skipped, not shortened.

## 6. Performance — measured

Route `/work/floral-alchemy`, production build, 1440 × 900, headless Chromium,
`audit/tools/case-perf.mjs`. Raw output: `audit/perf-floral-before.json` and
`audit/perf-floral-after.json`.

| Metric | Before | After |
| --- | --- | --- |
| Image bytes on the route (full scroll) | 815 KB / 8 files | 1,103 KB / 24 files |
| Largest image | 141 KB JPEG | 90 KB WebP |
| Floral frames | 5 × 1600×900 JPEG, ~500 KB | 20 real frames, 12–90 KB each |
| Intrinsic `width`/`height` | none (layout shifted as images landed) | on every frame |
| Format | JPEG | WebP (quality 82), 480/960/1440 candidates |
| LCP | 364 ms | 356 ms |
| Long tasks during a 6 s scroll | 0 | 0 |
| Frame rate (headless, 1440) | 60 fps | 60 fps |
| DOM nodes | 322 | 468 |
| Scroll height | 7,183 px | 10,195 px |

Reading this honestly: the page now carries three times the content, so total
bytes went up, but **each frame is 3–10× lighter**, every box is reserved before
the image lands (no layout shift), and the oversized 1600 × 900 JPEGs that made
the old page stutter while decoding are gone. Headless Chromium reports 0 long
tasks and 60 fps both before and after, so this environment does **not**
reproduce the lag the page was reported with; the measurable improvements are
per-frame weight, decode size and reserved layout, not a measured frame-rate
gain on the reporter's hardware. A real-device trace is still the only way to
close that item.

## 7. Build and hosting

```
npm run build          # tsc --noEmit && vite build && node scripts/seo.mjs
npx vite preview --port 4174 --host 127.0.0.1
```

- Production build: exit 0, 442 modules, `index` 164.53 kB (55.14 kB gzip),
  CSS 52.59 kB (10.81 kB gzip). WorkDetail chunk 20.38 kB.
- `dist/images/portfolio/flora-alchemy/` holds 33 WebP files, 1.5 MB in total.
- `dist/` contains `index.html`, `assets/`, `favicon.svg`, `images/`, `work/`,
  `robots.txt`, `_redirects`. No source maps, no dev tooling, no audit files.
- SPA fallback: `public/_redirects` → `/* /index.html 200` (Netlify, Cloudflare
  Pages). Vercel needs an equivalent rewrite if it is the chosen host.
- No canonical or sitemap is emitted until the real origin is configured.

### Required production configuration

```bash
SITE_URL=https://<real-domain> npm run build
```

With `SITE_URL` set the build script absolutises `og:image` / `twitter:image`,
adds `og:url`, writes the home canonical, the 8-route sitemap and the robots
`Sitemap:` line. Without it, `robots.txt` is written without a sitemap and no
canonical is emitted — both configurations were verified in the previous pass.

## 8. Still dependent on the studio

1. **A verified inbox** — the only remaining contact blocker. One address
   restores mailto CTAs everywhere with no component changes.
2. **Written reuse permission for the Flora Alchemy photography** — the images
   are the client's own published assets, credited on every frame. If the studio
   does not hold a licence to reuse them off the client's domain, that must be
   confirmed before publication.
3. **Instagram exports** — the two published reels exist, but the public
   thumbnails are 360–640 px. Original stills or covers (1080 px+) are needed
   before they can join the portfolio.
4. **Domain** — required for canonical, sitemap and OG absolute URLs.
5. **Hosting decision** — `_redirects` covers Netlify and Cloudflare Pages;
   Vercel/other hosts need their own rewrite for `/work/*`.
6. **Hero reel, team portraits, one client film** — unchanged from the previous
   pass; slots are listed in `ASSET_GAP_REGISTER.md`.
7. **Project scope credit** — the case study lists website design, frontend
   development, product presentation, responsive experience and e-commerce
   interface. Confirm that list against the studio's records before publishing.

## 9. Checks run in this pass

| Check | Result |
| --- | --- |
| `npx tsc --noEmit` | clean |
| `npm run build` | exit 0, 442 modules |
| `verify.mjs` (6 viewports × 9 routes) | 54 page loads, 0 problems; Flora route 24 images, 0 broken, 0 empty plates at every viewport |
| `qa.mjs` | all checks passed, 0 console errors, 2 external links (Instagram, live site), 0 `mailto:` |
| `cta.mjs` | all CTA checks passed, including the live link's URL/target/rel |
| `case-perf.mjs` before / after | see §6 |
| `flora.mjs` | 9 live captures of the storefront at 1440 and 390 |
| Visual inspection | Flora cover, brand block, product row, interface grid, packaging, phone section at 1440 and 390; homepage featured card |

Not verified: any deployed domain (no deployment was made), mail deliverability,
reuse rights for the client photography, and the lag report on real hardware.
Visual inspection covered the frames listed above; it was not an exhaustive
click-through of every control on every page.

## 10. Team, testimonials and footer pass

The last refinement before launch closed on these three sections. It changed no
brand asset, route, project record or case-study copy.

### 10.1 Team — three active members

| Item | Before | Now |
| --- | --- | --- |
| Public cards | six | **three** |
| Heading | "six people, six jobs — strategy, social, edit, copy, community and design." | "three people, one studio." |
| Roles line | inside the headline | one small caps line under it, read from the data |
| Tablet grid | 2 + 1 left-aligned | 2 columns, third card centred at card width |
| Mobile grid | 1 column | 1 column |

`data/team.ts` now holds six **records** with an `active` flag. The public
`team` export is the three flagged active; `formerTeam` keeps zoya (copy), dev
(community) and meera (design) as historical credits that are never rendered.
The section, its heading and the footer count all read that list — no count is
hard-coded.

> ⚠ **Selection needs studio confirmation.** No signed team record exists in
> this repository; the names are studio credits and none has a supplied
> portrait. The three flagged active — strategy, social creative, video + edit —
> were chosen because those are the disciplines the service list and case
> studies actually substantiate, not by array position. If the real active trio
> differs, flip `active` on the records; nothing else needs editing.

### 10.2 Testimonials

- **Measure:** 92% of the viewport (94% at tablet, 1600px cap) instead of the old
  narrow shell. At 1440 the shell is 1325px wide with 430px cards.
- **Cards:** 26px padding, 19px quote and reviewer name (17.5px on a phone),
  12px role line, 52px avatar (46px on a phone), 190px minimum height.
- **Speed:** travel is a fixed rate (38px/s × multiplier) and each column's
  duration is measured from its real height, so a longer quotation does not
  change the pace. The old 21px/s base read as stalled, so it was raised:
  **51.3px/s on desktop/laptop** (measured 50.8; was ~21.5px/s, so 2.4×), 28.5px/s
  at tablet and 22.8px/s on a phone (was ~10.5px/s). Hover or focus still pauses.
- **Data:** nine published records, one per supplied portrait. The quotation on
  each was written by the studio and approved for publication in review on
  2026-11-23. No role, company, project or rating is claimed, because none was
  supplied. There is no longer a draft route or placeholder copy: a record with
  no quotation is simply not rendered. Setting `approved: false` (or
  `consent.portrait: false`) drops that card on the next build.

### 10.3 Footer

| Item | Before | Now |
| --- | --- | --- |
| Groups | job vacancy / studio / contact, uneven | 01 collaboration · 02 the studio · 03 start a project, equal columns at `lg` |
| Vacancy | "experienced account manager" (not confirmed open) | removed; group 01 is an open invitation with a **work with us** button |
| Studio copy | "six people, six jobs." | "three people, one studio." plus the three verified roles |
| CTA | text link / small control | **56px** cream pill, opens the contact dialog |
| Social | 36px icons | 44px icons, verified profiles only — Instagram (`@desidraftt.co`) |
| Bottom | absolute credits button | bottom bar: studio line, back to top, credits; `safe-area-inset-bottom` padding |
| Mobile stickers | could sit on the contact copy | static, moved into the wordmark band; no physics under 768px |

The cobalt field, oversized handwritten wordmark, sticker art and the desktop
sticker physics are unchanged.

### 10.4 What is still missing

1. **Reviewer sign-off** — the nine quotations are studio-written copy approved
   in review, not words each reviewer sent in. Each named person should confirm
   their line and their portrait use before launch; 
   `src/data/testimonials.ts` carries the switch.
2. **Team confirmation and portraits** — the active-three selection above, and
   real photographs for the three cards.
3. **Email / WhatsApp / address** — still empty, so every enquiry CTA opens the
   on-site contact dialog (no dead links).
4. **LinkedIn / TikTok** — no profile URLs supplied, so only Instagram links.

### 10.5 Checks run in this pass

| Check | Result |
| --- | --- |
| `npm run build` (`tsc --noEmit` + vite + seo) | exit 0 |
| `team-footer.mjs` (12 viewports) | clean — 3 team cards at every width, 1/2/3 rows by breakpoint, 3 footer groups, 56px CTA, 0 overflow, 0 console errors |
| `testimonials.mjs` (7 viewports + reduced motion) | clean — 9 published cards, 3/2/1 columns, 176px+ cards, 19/17.5px quote, 52/46px avatar, hover pause, long quote grows without overflow, static grid under reduced motion |
| `qa.mjs`, `a11y.mjs`, `verify.mjs`, `responsive.mjs` | see §9 and the two audit docs |
| `final-metrics.mjs` | recorded the numbers quoted above |
| Screenshots | `audit/frames/team-footer-{1440,768,390}.jpg`, `footer-{1440,768,390}.jpg`, `footer-reduced-1440.jpg`, `testimonials-*.jpg` |

The FAQ-style copy audits (`COPY_AND_MESSAGING_AUDIT.md`, `FINAL_COPY_AUDIT.md`)
still describe the six-person wording as a decision; both predate this pass and
are superseded by §10.1 above.
