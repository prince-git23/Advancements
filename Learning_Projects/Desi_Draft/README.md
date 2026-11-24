# desi draft

Portfolio site for a social-first creative studio: an editorial case-study portfolio built from a typed project model, parallax and pointer tilts, scroll-scrubbed letter physics, and a Matter.js sticker footer. No WebGL, no 3D models — the depth comes from perspective, rotation and layering.

## Run

```bash
npm install
npm run dev      # http://127.0.0.1:5173
npm run build    # typecheck + production build to dist/
npm run preview  # serve the production build
```

Stack: Vite + React + TypeScript + Tailwind, GSAP (ScrollTrigger), Lenis, Framer Motion (modals only), Matter.js, qrcode.react.

## Backend — enquiries

The contact panel is a real form backed by `server/` — a single Node HTTP service with no
dependencies. Enquiries are stored in SQLite (`node:sqlite`), validated on the server, same-origin
only, rate limited and honeypot-filtered; notification is optional and provider-agnostic.

```bash
npm run api      # http://127.0.0.1:8787 — API + dist/ when a build exists
npm run dev      # Vite proxies /api to the service above
```

| Route | What it does |
| --- | --- |
| `POST /api/enquiries` | the contact form. Validates, stores, returns `201 { ok, id }` |
| `GET /api/enquiries` | the studio inbox, newest first. Needs `Authorization: Bearer $ENQUIRY_ADMIN_TOKEN` |
| `GET /api/health` | liveness, storage path, whether a webhook/admin token is configured |

Configuration lives in `.env` (copy `.env.example`): `PORT`, `HOST`, `ENQUIRY_DB`,
`ENQUIRY_ADMIN_TOKEN` (required to read the inbox over HTTP) and `ENQUIRY_WEBHOOK_URL` (optional —
any JSON-accepting endpoint such as a Slack webhook, Zapier/Make hook or mail relay). Without a
webhook the enquiry is still saved. `server/data/` is gitignored: it holds people's names and
emails, never something to commit.

## Assets to replace

| What | Where |
| --- | --- |
| Logo wordmark | `src/components/art/Logo.tsx` (single `<Logo/>`; swap the `<text>` for converted SVG glyph paths) |
| Hero reel | `src/data/media.ts` → `heroVideo` / `heroPoster`; until set, an animated gradient montage stands in |
| Project media | `src/data/portfolio.ts` → each project's `cover` and `gallery` slots; set `src` to a file in `public/` and the neutral “frame pending” plate becomes the image or video |
| Project copy + status | `src/data/portfolio.ts` (no client names, metrics or dates are invented — add only what is real) |
| Team photos | `src/data/media.ts` → `teamPhotos` (keyed by member name), rendered by `src/components/Team.tsx` through `src/components/ui/ProfileCard.jsx`; with no photo the card shows a typographic monogram, never a synthetic portrait |
| Manifesto photos | `src/components/Manifesto.tsx` (`PlaceholderPortrait` cards) |
| Client logos | none — the previous fictional tile set was removed with its section; add real, cleared logos if a client list returns |
| Team names / roles / layout | `src/data/team.ts` |
| Services groups | `src/data/site.ts` → `serviceGroups` |
| WhatsApp number, email, address, socials, map link | `src/data/site.ts` |
| Credits name | `src/components/Footer.tsx` |
| Fonts | `index.html` (Archivo, Instrument Serif, DM Sans, Yellowtail) |

The stickers, blobs, doodles and bursts in `src/components/art/` are original SVGs; edit their paths/colours there.

## Project documentation

The brand, portfolio-content, asset-gap, copy, motion and roadmap documents live in `docs/`. The verification tools live in `audit/tools/` (see `audit/README.md`); their screenshots are generated on demand. Requirements that need real media, client permission or measured results are tracked in `docs/` and are deliberately unpublished on the site.

## Notes

- All scroll animation is built in `gsap.context()` and reverted on unmount; `ScrollTrigger.refresh()` runs after fonts load and on route changes.
- `prefers-reduced-motion` disables pinning, parallax, marquee and physics, and shows static fallbacks.
- Footer physics bodies approximate the top profile of the script wordmark so stickers land on the letters.
- The team section is a plain responsive ProfileCard grid (3 / 2 / 1 columns). It creates no WebGL contexts and has no pinned scroll stage.
