# desi draft

One-page portfolio for a social-first agency, built as a playable 2D art board: parallax, pointer tilts, a drag carousel, scroll-scrubbed letter physics and a Matter.js sticker footer. No WebGL, no 3D models — the depth comes from perspective, rotation and layering.

## Run

```bash
npm install
npm run dev      # http://127.0.0.1:5173
npm run build    # typecheck + production build to dist/
npm run preview  # serve the production build
```

Stack: Vite + React + TypeScript + Tailwind, GSAP (ScrollTrigger), Lenis, Framer Motion (modals only), Matter.js, qrcode.react.

## Assets to replace

| What | Where |
| --- | --- |
| Logo wordmark | `src/components/art/Logo.tsx` (single `<Logo/>`; swap the `<text>` for converted SVG glyph paths) |
| Hero reel | `src/data/media.ts` → `heroVideo` / `heroPoster`; until set, an animated gradient montage stands in |
| Work videos + posters | `src/data/media.ts` → `workVideos` / `workPosters`, keyed by project slug |
| Team photos | `src/data/media.ts` → `teamPhotos`, plus `src/components/Team.tsx` rendering `PlaceholderPortrait` |
| Manifesto photos | `src/components/Manifesto.tsx` (`PlaceholderPortrait` cards) |
| Client logos | `src/data/clients.ts` (currently fictional names on coloured tiles) |
| Project copy, stats, clients | `src/data/work.ts` |
| Team names / roles / layout | `src/data/team.ts` |
| Services lists | `src/data/site.ts` |
| WhatsApp number, email, address, socials, map link | `src/data/site.ts` |
| Credits name | `src/components/Footer.tsx` |
| Fonts | `index.html` (Archivo, Instrument Serif, DM Sans, Yellowtail) |

The stickers, blobs, doodles and bursts in `src/components/art/` are original SVGs; edit their paths/colours there.

## Notes

- All scroll animation is built in `gsap.context()` and reverted on unmount; `ScrollTrigger.refresh()` runs after fonts load and on route changes.
- `prefers-reduced-motion` disables pinning, parallax, marquee and physics, and shows static fallbacks.
- Footer physics bodies approximate the top profile of the script wordmark so stickers land on the letters.
