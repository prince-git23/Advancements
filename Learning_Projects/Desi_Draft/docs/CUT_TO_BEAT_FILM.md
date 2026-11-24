# CUT TO THE BEAT — FILM CASE STUDY

The 18.5-second vertical film is now the project page: a playable 9:16 master, three
format sheets built from its own frames and audio, and a storyboard read off the
footage. Source: `src/assests/cut_to_beat.mp4` — 720 × 1280, 24 fps, 444 frames,
18.54 s, H.264 + AAC 48 kHz stereo.

## 1. The master

| File | Size | Notes |
| --- | --- | --- |
| `public/videos/cut-to-the-beat-master.mp4` | 3.48 MB (from 20.9 MB) | CRF 26, High profile, `+faststart`, same 720 × 1280 / 24 fps |
| `public/images/portfolio/cut-to-the-beat/poster-9x16.jpg` | 1 frame | the poster is frame 1.2 s, not a designed cover |

The source measures **−16.6 LUFS, true peak +0.1 dBFS, LRA 1.2 LU** — already loud and
a hair over full scale. The encode therefore applies no gain, only
`alimiter=limit=0.89` (−1 dBTP) to remove the inter-sample over. Nothing else in the
track was touched: no compression, no EQ, no noise reduction.

The audio is a continuous mixed bed with no speech formants in the spectrogram, and the
film types every claim on screen, so it is written to be read with the sound off. No
captions were authored because there is no spoken word to caption; the on-screen type is
the transcript, and it is in the DOM as the chapter copy.

## 2. Chapters, verified from the picture

Frame-by-frame inspection (contact sheet at 2 fps, `audit/video/cut/contact.jpg`) gives
these picture boundaries. Only one hard scene change registers in the whole film
(8.83 s) — the rest is one continuous motion-design scene carried by camera moves, which
is why no "beat timestamp" is claimed anywhere on the page.

| Time | Chapter | What is on screen |
| --- | --- | --- |
| 0.0 – 3.0 | the hook | phone on a desk, posts floating up, “YOUR CONTENT ISN’T GROWING?”, “3 MISTAKES.” |
| 3.0 – 6.3 | #1 inconsistent branding | a wall of posts that each look like a different brand |
| 6.3 – 8.8 | #2 too much selling | hand-held phone, discount stickers, “give value before you pitch” |
| 8.8 – 12.4 | #3 ignoring insights | edit suite and timeline, then “STOP GUESSING. LEARN WHAT WORKS.” |
| 12.4 – 15.4 | the fix | “THE FIX: CONSISTENCY. VALUE. INSIGHTS.” on a consistent layout wall |
| 15.4 – 18.54 | make every post count | the studio ring, the line, “SAVE THIS BEFORE YOUR NEXT POST” |

Six stills at 720 × 1280 sit beside them (`chapter-01…06.jpg`). The storyboard's
“watch this beat” button seeks the single film element to the chapter's real start —
the display labels are rounded to the second, the seek is not.

## 3. The three sheets

Rendered from `audit/sheets/cutSheets.tsx` (composition in code, real tokens, real
typefaces) and captured by `audit/tools/sheets.mjs`:

| Sheet | Output | Weight | Built from |
| --- | --- | --- | --- |
| 01 opening hook | 1080 × 1920 | 99 kB | orange field, the film's hook line, its own first 3 s of audio as bars |
| 02 rhythm | 1200 × 1200 | 89 kB | the master's full waveform (96 RMS windows) in lime, six picture chapters |
| 03 end card | 1920 × 1080 | 79 kB | the real wordmark, cream field, coral rule, a real end frame at 17 s |

The bars are `peaks` in `src/data/cutToBeat.ts`, computed from the encoded master
(mono 8 kHz, 96 RMS windows, `^0.7` for visibility). They are the actual track, not an
illustration of one. Sheet 02 also prints “waveform: the master's own audio · marks:
picture chapters” so the marks are never mistaken for a beat grid.

## 4. The page

`/work/cut-to-the-beat` keeps the case-study template and swaps only its media for this
project:

- the still cover is replaced by a **film stage**: dark panel, the 9:16 player (364 px on
  desktop, capped to the column on tablet, full width under 360 px), project meta and the
  measured waveform beside it;
- **the formats** — the three sheets on one baseline at 9:16 / 1:1 / 16:9;
- **the storyboard** — six tabs (2-column grid on phones, a row from 768 px), each with
  the real frame, one paragraph and the move used;
- **the edit, broken down** — six notes with the sheets as thumbnails.

Copy that claimed a format system without a film ("15s, 30s, 45s cuts", "first client
film in production") was replaced with what is now true: one 18.5 s master, 444 frames,
published on this site.

## 5. Playback and accessibility

- muted, `playsInline`, loop, `preload="metadata"`, autoplay attempted on mount and
  rejected safely (poster + play button stay).
- One player on the page. Storyboard buttons seek that element — no second instance.
- Controls: play/pause, sound toggle (`aria-pressed`), timecode, 9:16 badge; all ≥ 40 px.
- Pauses when the tab is hidden and when the film leaves the viewport, resumes on return
  unless the visitor paused it.
- Reduced motion: `preload="none"`, poster only, no autoplay; pressing “watch this beat”
  is a deliberate action and still plays.
- Tabs are a real `tablist` with arrow-key support, `aria-selected` and `aria-controls`.

## 6. Validation

Production build clean (`tsc` 0, 167 kB / 55.6 kB gzip page chunk). At 1440 × 900,
1280 × 800, 1024 × 768, 768 × 1024, 390 × 844 and 360 × 800: video renders at 0.563 ratio
(9:16), `readyState 4`, no media error, no console error, no horizontal overflow, no
layout shift (width/height attributes plus `aspect-ratio` reserve the box).

Interaction test: chapter 4 tab → “#3 ignoring insights”; “watch this beat” → film seeks
to 9.7 s, plays, and scrolls the stage into view. Reduced-motion run: film at 0 s and
unfetched until the button is pressed.

**Limits.** Inspected in desktop Chromium at mobile viewports, not on a physical handset.
The waveform is real but its bar count is chosen for the layout, not for beat accuracy —
no tempo or beat grid is claimed. The 1:1 and 16:9 sheets are compositions for those
frames, not extra exports of the film, and the page says so.
