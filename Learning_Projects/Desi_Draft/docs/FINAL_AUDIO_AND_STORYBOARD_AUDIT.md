# FINAL AUDIO AND STORYBOARD AUDIT — Desi Draft

## 1. The reference recording

The directive describes a 61-second screen recording of the site with a very quiet audio
track (approximately −33.4 LUFS integrated, peak around −17.1 dBFS).

**That file is not in this workspace and was not delivered as an attachment to this
conversation.** Checked before writing anything below: the project root, `public/`,
`public/images`, `public/work`, `audit/`, `audit/frames`, `audit/sheets`, `docs/`, and every
file larger than 1 MB outside `node_modules/` and `dist/`. There is no `.mp4`, `.mov`,
`.webm`, `.m4a`, `.mp3` or `.wav` anywhere in the project.

What that means, plainly:

- The audio was **not** extracted, normalised, measured or analysed.
- No speech-to-text was run, because there is nothing to run it on.
- **No transcript, timestamp or quotation in this document is invented.** The only
  timestamps available are the ones the directive supplies (work ≈ 6–10 s, team ≈ 27–33 s,
  services ≈ 36 s, Flora Alchemy ≈ 42–45 s). They are recorded here as *unverified against
  the media*, and are treated as observations about a recording of an earlier build.
- Whether the track contains voice, music or room tone is unknown. It was not assumed to be
  a website soundtrack, and it was **not** used as the hero video. The hero still ships no
  reel: `media.heroVideo` is empty and the `HeroMontage` gradient stands in for it, which is
  the honest state until a real film exists.

### Completing Phase 1 when the file is supplied

Put the file at `audit/reference/recording.mp4` (or give the path) and the following runs
unchanged:

```bash
# 1. what is actually in the container
ffprobe -v error -show_entries stream=codec_type,codec_name,channels,sample_rate \
        -of json recording.mp4

# 2. mono 16 kHz for speech, with loudness raised toward a normal working level
ffmpeg -i recording.mp4 -vn -ac 1 -ar 16000 \
       -af loudnorm=I=-16:TP=-1.5:LRA=11 audio.wav

# 3. a measured level for the document, not an estimate
ffmpeg -i audio.wav -af ebur128=peak=true -f null - 2>&1 | tail -20
```

A recording made at −33 LUFS has a poor signal-to-noise ratio once normalised. Any segment
that is not confidently intelligible must be marked *uncertain* with its timestamp, not
guessed at. Transcription itself needs a local model (whisper / faster-whisper); none is
installed in this project and none was added, because a new dependency for a missing file
would be dead weight.

## 2. Requested changes: what can and cannot be verified

| # | Directive reference | What the directive asks for | Verified against the current build? | What was done |
| --- | --- | --- | --- | --- |
| 1 | work ≈ 6–10 s | A very large empty region while oversized type enters; some text partly outside the frame. | **Partly.** The empty region traces to the intro pin holding three viewport heights (fixed in the previous pass: `+=165%` desktop / `+=110%` below 768 px). The "text outside the frame" reproduced as **clipped descenders** in masked display headings. | Intro pin travel left at the shortened value. Masked lines in `/manifesto` and `/services` given 0.2 em of mask padding and a longer reveal travel, so `things,` and `properly.` now print their full descenders (verified by full-resolution crop). |
| 2 | team ≈ 27–33 s | Monogram cards make the section feel unfinished; improve balance, hierarchy, interactions, mobile. | **Yes** — reproduced on the built site. | Cards without a portrait draw a 16:11 poster instead of a tall 4:5 field (`data-portrait="false"`); the "portraits in progress" note tone was raised to `cream/70`; section heading gained the chapter label; profile contact buttons remain real buttons with visible focus rings. Portraits are still missing — see §5. |
| 3 | services ≈ 36 s | Wide horizontal rows with considerable unused space; make title, explanation and deliverables easy to understand. | **Yes.** | Each group now carries an `evidence:` link to the project that proves it (four of five; *creative spaces* has no project and therefore no link). The lone sticker that consumed a whole row on phones is now desktop-only. Desktop row composition is unchanged. |
| 4 | Flora Alchemy ≈ 42–45 s | Keep the real assets and botanical identity; improve sequence, sizing, hierarchy, gallery transitions, mobile positioning, loading, scroll performance. | **Yes.** | Real captures preserved (`public/work/flora-alchemy/*`, live site `flora-alchemyy.vercel.app`). Featured image on phones is 16:10 rather than a butchered 16:9 crop; case-study cover is eager, later frames lazy; parallax capped at three frames, desktop only, scrub-driven. No café or graffiti narrative exists anywhere in the copy or the assets. |
| 5 | global whitespace | Find the root cause of empty bands rather than shaving margins. | **Yes**, section by section. | Root causes found this pass: a 22 vh cream-on-cream seam where services met the work section (both `pt/pb 10–12vh`); 74 px of lone sticker row per service group on phones; masked line boxes too short for the type. Fixed at those causes; intentional editorial space left alone. |
| 6 | 3D experience | Layered hero, typographic depth, portfolio tilt, scroll-linked depth; Three.js only where geometry earns it. | **Yes**, already implemented with CSS/GSAP. | See `FINAL_MOTION_AND_3D_AUDIT.md`. No WebGL renderer was added; the reasons are recorded there rather than left as an omission. |
| 7 | colour presets | Coordinated applications of the existing palette, driven by CSS custom properties. | **Yes.** | Five presets (`studio`, `motion`, `botanical`, `editorial`, `digital`) set only `--chapter-accent`. No surface, type colour or sticker was repainted, and no user-facing theme switcher was added. |
| 8 | responsive + accessibility + performance | Named viewports, WCAG 2.2 AA, measured cost. | **Yes.** | See `FINAL_RESPONSIVE_AUDIT.md`, `FINAL_ACCESSIBILITY_AUDIT.md`, `FINAL_PERFORMANCE_AUDIT.md`. |

## 3. The storyboard

The site now reads as one narrative instead of seven sections that happen to be stacked. The
seven chapters from the directive map onto the existing sections, and each is marked with its
number, its name and a one-pixel rule in the section's preset accent:

| Chapter | Section | The single idea | Where the marker sits |
| --- | --- | --- | --- |
| 01 the idea | Hero | "we make content for the new desi mainstream", as a title card | above the headline, over the darkened lower band |
| 02 the thinking | Pinned intro → Manifesto | where the audience is, and what the studio believes about making for them | once, above the manifesto heading (the intro is a title card, not a chapter) |
| 03 the making | Services | the five things the studio actually does, each with evidence | above the ledger heading |
| 04 the work | Work feature | the shipped project, then three disciplines and the index | above the section rule |
| 05 the people | Team | six credits, no invented portraits | above the heading |
| 06 the result | Case study | the live address, or the deck we can walk a client through | above the closing block, on `/work/:slug` only |
| 07 the connection | Footer | jobs, the studio, contact, social | as a cream pill above the columns |

**Order change:** *the making* now precedes *the work*. The services ledger already ended with
"see the work behind these →", which previously pointed at the footer; the narrative now
delivers on that promise in the next screen. Everything else keeps its position — the hero is
still the first frame, the people still follow the work, the footer is still the last thing on
the page.

Chapter 06 deliberately has no home-page block. A result can only be shown honestly where
there is a result — a live address or a real deck — and the home page handing off to a case
study is more truthful than inventing a "results" band with no numbers in it.

## 4. Unclear or unverifiable requests

- **The spoken brief itself.** Not one word of the track has been heard. Anything said in the
  recording that is not reflected in the written directive is unknown.
- **Which build the recording shows.** The defects named at 6–10 s, 27–33 s, 36 s and 42–45 s
  were being repaired before the recording arrived as a written brief; the recording appears
  to predate those repairs. The timestamps can therefore describe symptoms that no longer
  exist in the current build.
- **Music and voice.** Whether the track is a reference track the studio wants echoed on the
  site cannot be answered without the file. No site audio was introduced.

## 5. Information still missing

Unchanged by this pass, and blocking real content rather than polish:

1. Hero reel (16:9, compressed) and a poster frame — `media.heroVideo` / `media.heroPoster`.
2. Six team portraits, at least 1200 × 1500, with consent to publish. The cards say
   "portraits in progress" until then.
3. A finished film for *cut to the beat* and *hook, turn, payoff*; both currently show format
   frames and beat sheets, which is what exists.
4. Instagram originals — only 360–640 px thumbnails are available, too small to print.
5. Written permission to reuse Flora Alchemy photography beyond the case study.
6. Verified email, WhatsApp number, street address and map link — every field is empty in
   `src/data/site.ts` until somebody confirms it, and the enquiry CTAs fall back to the
   on-site dialog instead of a dead `mailto:`.
7. Case-study outcomes (reach, sales, retention). None are published; none were invented.
8. A real project behind the *creative spaces* service group.
