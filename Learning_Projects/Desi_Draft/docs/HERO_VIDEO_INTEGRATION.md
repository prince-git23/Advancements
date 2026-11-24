# HERO FILM — INTEGRATION RECORD

How the 20-second studio film was cut, encoded, framed and wired into the homepage, and what
was and was not verified. Measured on the production build (`vite preview`, `127.0.0.1:4174`)
with the harnesses in `audit/tools`.

Source: `src/assests/Hero.mp4` — 1280 × 720, 24 fps, 20.03 s, H.264, AAC 128 kbps stereo 48 kHz,
8.6 Mbps. Delivered: `public/video/desi-draft-hero-16x9.mp4`,
`public/video/desi-draft-hero-9x16.mp4`, plus two posters. `media.heroVideo` /
`heroVideoPortrait` / `heroPoster` / `heroPosterPortrait` in `src/data/media.ts`.

## 1. Two cuts, one film

| File | Size | Bitrate | Notes |
| --- | --- | --- | --- |
| `desi-draft-hero-16x9.mp4` | 1280 × 720, 2.53 MB | ≈ 1.0 Mbps | CRF 26, High profile, `+faststart` |
| `desi-draft-hero-9x16.mp4` | 720 × 1280, 2.03 MB | ≈ 0.8 Mbps | CRF 27, `unsharp` after upscale |
| `desi-draft-hero-poster.jpg` | 46 kB | — | frame at 0.6 s, 1280 × 720 |
| `desi-draft-hero-poster-9x16.jpg` | 42 kB | — | same beat, 720 × 1280 |

No WebM: H.264 High at these bitrates decodes in hardware on every target device, and a second
encode would double the bytes for a hero that is already under 3 MB. The `<video>` has exactly
one `<source>` per breakpoint, swapped on `matchMedia('(max-width: 767px)')`, so only one file is
ever requested — never both.

**The vertical cut is a 1.78× upscale of a 405 × 720 crop, not native 1080p.** It is delivered at
720 × 1280 because the source is 720p; claiming 1080 × 1920 would be upscaling for its own sake.
Every shot was reframed by hand at 24 fps, then lifted with a light unsharp pass.

### Shot map (source frames at 24 fps, crop x offset into the 1280 px frame)

| Frames | Shot | x | Subject held in the 405 px window |
| --- | --- | --- | --- |
| 0–46 | edit suite | 430 | monitor, timeline, the person at the desk |
| 46–95 | lens | 330 | hands and the lens barrel |
| 95–144 | storyboard | 740 | pencil on paper |
| 144–192 | keyboard | 120 | keys and hands |
| 192–288 | prints → sketch drift | 300 → 240 | printed compositions, then the drawing |
| 288–336 | monitor | 560 | timeline over the designer's shoulder |
| 336–384 | zine | 330 | printed spread |
| 384–400 | storyboard | 180 | paper and pencil |
| 400–408 | timeline | 330 | NLE |
| 408–430 | camera | 180 | body and lens |
| 430–480 | desk | 300 | wide studio |

Contact sheets: `audit/video/shots.jpg`, `audit/video/vert.jpg`; per-frame checks in
`audit/video/checkvert.jpg`. No blind centre crop, no letterboxed 16:9 inside a portrait frame.

## 2. Audio

Measured on the source with `ebur128`: −34.2 LUFS, true peak −3.9 dBFS, LRA 13.7 LU — quiet for
a hero that may be unmuted. The spectrogram (`audit/video/spec.png`) shows continuous broadband
energy with rhythmic transients and no formant structure, i.e. music and foley rather than speech.
It was treated as music: `volume=12dB` into `alimiter=limit=0.5:level=0:attack=5:release=80`,
which lands at **−24.2 LUFS, −4.1 dBFS true peak, LRA 13.9** — 10 dB louder, dynamics intact,
limiter never engaged for more than the transient peaks, no clipping.

Because no speech was found, no captions were authored. The film still has an `sr-only`
description of what it shows, since the visual content is the point.

**Limitation:** the track was not listened to on speakers or headphones here; "no speech" is
inferred from the spectrogram, not from hearing it. If the studio knows there is a voice line,
that is the one thing this pass could not catch.

## 3. Presentation by breakpoint

| Width | Mode | Behaviour |
| --- | --- | --- |
| ≥ 1280 | full-bleed 16:9, `object-cover` | film fills the hero behind the headline; ≤ 10 % cropped at 1440, none at 1920 |
| 768–1279 | contained 16:9 panel | nothing cropped; headline and chapter line sit below the film |
| < 768 | 9:16 panel, portrait file | `.hero-panel` caps width by viewport height (`calc((100svh - 360px) * 0.5625)`), so the panel, label, headline and controls always fit above the fold |

The panel width is derived from the available height rather than fixed, so a short phone gets a
smaller film rather than a headline pushed off screen. Rounded corners and the hairline frame
match the existing card language; there is no fake phone chrome, buttons or bezel.

Landscape phones stay under 768 px wide in most cases and therefore use the portrait panel, which
is intentional: the 9:16 cut reads correctly in a short viewport and the height-based cap keeps
everything visible.

## 4. Entrance

GSAP reveal, ~2.9 s total (compressed from the 6.5 s sketch — the headline has to be readable
before anyone scrolls):

1. `clip-path` mask opens the film;
2. "we make" rises in staggered words;
3. italic *content* slides in from −14 px;
4. "the new desi mainstream" appears line by line;
5. the hand-drawn underline is stroke-drawn beneath "mainstream";
6. the sparkle and the lime die-cut sound sticker fade up.

The text settles and stops. Reduced motion skips the timeline entirely and shows the poster, the
headline and the CTA immediately.

The oval that used to circle "mainstream" was removed: at 1024–1440 px, where the headline wraps
to two lines, its upper arc crossed the word before it. The underline the brief asks for does the
same job and cannot collide at any width.

## 5. Playback and controls

- `muted`, `playsInline`, `autoPlay` (unless reduced motion), `preload="auto"` above the fold.
- The control state is derived from the element's own `play`/`pause` events, so it cannot drift
  from reality; autoplay rejection leaves the poster and an enabled play button.
- Pauses when the tab is hidden **and** when the hero leaves the viewport (`IntersectionObserver`),
  and resumes when either returns — unless the visitor paused it, which is tracked separately in
  `userPaused`. (Verified: playing at top → paused after scrolling 6000 px → playing again on
  return.)
- Phones get a sound toggle, play/pause and fullscreen in a 40 px-target row under the headline;
  desktop keeps the lime sticker, which is a real `<button>` with an accessible label.
- If the film errors, the poster `<img>` replaces it; if that fails too, the static `HeroMontage`
  does. There is no path to an empty black hero.

## 6. Verification

Type check and production build clean; app chunk 166.9 kB / 55.6 kB gzip.

| Viewport | Overflow | Page height | Film source |
| --- | --- | --- | --- |
| 1920 × 1080 | 0 | 10 719 | 16:9, full-bleed |
| 1440 × 900 | 0 | 9 807 | 16:9, full-bleed |
| 1280 × 720 | 0 | 8 750 | 16:9, full-bleed |
| 1024 × 768 | 0 | 8 423 | 16:9, contained |
| 768 × 1024 | 0 | 10 862 | 16:9, contained |
| 430 × 932 | 0 | 11 518 | 9:16 |
| 390 × 844 | 0 | 11 001 | 9:16 |
| 360 × 800 | 0 | 10 665 | 9:16 |

Per width: `readyState 4`, no media error, no console error, one source requested, headline and
CTA inside the first screen, no layout shift from the poster to the first frame. Screenshots of
all eight widths are in `audit/frames/`. `qa.mjs`, `cta.mjs` and `a11y.mjs` pass unchanged
(h1 = 1, no unnamed controls, no missing alt).

Reduced motion at 1440: `readyState 0` and `paused: true` — the file is not downloaded at all,
the poster is shown, the full-bleed panel measures 1432 × 892 and the headline is available at
once.

**Limitations.** The mobile edit was inspected in desktop Chromium at mobile viewports, not on a
physical handset; iOS Safari's inline-autoplay and low-power-mode behaviour is therefore unproven
here. Video painting in the older headless screenshot harness lagged behind `currentTime`, so the
frame-vs-poster question was settled in the real browser tab, where the live frame renders.
