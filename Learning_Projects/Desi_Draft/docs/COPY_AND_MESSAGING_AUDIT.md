# Desi Draft — Copy and Messaging Audit

Page-by-page review of every public string, with the decision taken in this pass. "Implemented" means the change is in the working tree; "Queued" means it needs content the studio has not supplied.

## Method

For each block: what it communicates → is it accurate → is it necessary → does it duplicate → does it have visual evidence → decision.

## 1. Metadata (`index.html`)

| Before | Problem | After |
| --- | --- | --- |
| `Desi Draft — a social media agency making content for the new desi mainstream. Reels, TikTok, campaigns, activations.` | "Agency", "campaigns", "activations" are unsupported. It also narrows a studio that builds websites to social. | `Desi Draft is a six-person studio making short-form film, social content, scripts, identities and websites. Case studies, process, and work still in progress.` |
| `desi draft — content for the new desi mainstream` | Fine, but says "content" twice with the description. | `desi draft — a content studio for the new desi mainstream` |

Per-project title/description/OG tags are now set from the project record in `WorkDetail.tsx`.

## 2. Hero

> we make content for the new desi mainstream

- **Communicates:** audience and category in seven words.
- **Accurate:** yes. It promises content, not a 360° service.
- **Necessary:** yes, it is the only positioning line above the fold.
- **Evidence:** partial — the portfolio below is the evidence.
- **Decision: retained verbatim.** It is the strongest sentence on the site and the brand's only memorable line. Do not "improve" it into "We craft compelling narratives".

The hero visual is `HeroMontage` (in-house illustrated gradient plates), not project footage. That is a compromise, not a claim: the montage contains no people and no fake project stills. When a reel exists it replaces the montage through `media.heroVideo`.

## 3. Intro

| Before | Problem | After |
| --- | --- | --- |
| "Audiences are more scattered *and* more reachable than ever. We help brands become leaders on the channels of the new mainstream." | "Become leaders" is an outcome claim with no measurement, and "channels of the new mainstream" repeats the hero. | "Short-form work, planned and cut in the same room. We write for the scroll first, then make the thing that earns it." |

The travelling line *we wanna be where the people are* is kept: it is voice, not a claim, and it is the section's whole visual idea.

## 4. Manifesto

| Before | Problem | After |
| --- | --- | --- |
| "an agency built for the future. from reels to TikTok." | "Built for the future" is the single most generic agency phrase available. "From reels to TikTok" describes two formats as if they were two capabilities. | "a studio built for the feed. from first frame to final cut." |
| "We are a true 360° agency, working the whole spectrum from Instagram Reels and TikTok to TVC, and from influencer collabs to out-of-home spectaculars." | **False by evidence.** No TVC, no influencer collaboration, no OOH buy exists in the repo. Also the longest sentence on the site. | "Six people in one room, working in the order you see it here: write it, shoot it, cut it, design the surfaces it lives on. No account layer, no borrowed logos, no numbers we cannot show you." |

The four fan cards carry pills ("chai > coffee", "desi is not a niche", "shaadi season = content season"). These are voice, and are retained; the monograms are typographic, not fake portraits.

## 5. Work — home block

| Before | Problem | After |
| --- | --- | --- |
| "Six disciplines. Two live projects, one studio identity, and the formats we are building next — labelled honestly." | Accurate but written for the reader as an audit note. "Labelled honestly" is self-congratulation. | "Six disciplines, six projects — one live site, one room on site now, and the formats being built next." |
| Section heading "selected work, still being made" | Good. Keeps the in-progress truth in the headline. | Retained. |

## 6. Work index

| Before | Problem | After |
| --- | --- | --- |
| "Case studies from the studio and the room we are building right now. No borrowed logos, no numbers we cannot show you." | Strong and true. | Retained. |
| "Plates with a label are frames we still have to shoot. They fill in as each project moves forward — nothing here is stock." | Explains the website's asset system to a prospective client. That is an audit note in public. | Removed. The neutral plates are now self-explanatory; the register lives in `docs/`. |
| `{n} projects · category` | Useful, keep. | Retained. |

## 7. Case studies

| Element | Problem | Decision |
| --- | --- | --- |
| `mediaNote` paragraphs ("the plates below mark the frames we are shooting…") | Five separate public apologies about missing media. The site was explaining its own gaps on every page. | **Removed** from the data model and the template. |
| Website facts: `loading: route-level code splitting, lazy media` and `3d: none` | Developer notes presented as project facts. | Replaced with `screens` and `type`. |
| Website chips: "no horizontal scroll", "filters in the URL", "lazy media", "reduced-motion paths" | Four implementation details used as creative outcomes. | Replaced with reader-facing facts about the site. |
| CTA "want the full deck for this one?" | Promises a deck that may not exist. | **Queued** — keep only where a real deck exists; until then use "talk to us about this project". |
| CTA "start a conversation" | Fine, unpretentious. | Retained. |
| `facts` block | Good idea: documentary facts, not metrics. | Kept; each value must remain verifiable. |

## 8. Services

- Heading "five things, done properly." — retained; specific and confident.
- Lede: "A service is a promise; the portfolio is the evidence. Every group below has a project or a format behind it — and we tell you which." — retained, and now literally true.
- Items: removed nothing, but flagged in the brand doc that **shooting, packaging and TVC-adjacent items** need a credit before they are advertised. Items such as *Accessibility passes* and *Performance budgets* are evidenced by `audit/`.
- Closing line "Send the brief and we will tell you what we would actually do — including what to cut." — retained; it is a differentiator.

## 9. Clients (section removed)

> proud to have worked with: chai co., mehendi mart, biryani bros, desi denim, shaadi squad, cricket cafe, masala snacks, lassi lab, rangoli wear, kulfi kings

- Source file comment: `Fictional client marks — replace with real SVG logos when cleared.`
- Ten invented brands presented under "proud to have worked with" is the single largest trust defect on the site.
- **Decision: section, component and data deleted.** It returns only with cleared, real logos. There is no public "conceptual brands" list either, because invented brand marks are not the studio's work.

## 10. Team

| Before | Problem | After |
| --- | --- | --- |
| "we are a young, future-proof team of 6 digitally native creators. not to brag!" | Three self-assessments in one sentence; "digitally native" means nothing to a client. | "six people, six jobs — strategy, social, edit, copy, community, design." |
| Six gradient monogram cards with no portraits | Looks like placeholder art pretending to be photography. | Monograms retained as a deliberate typographic state, with one line under the grid: *portraits in progress — roles shown as credited*. No fake faces. |
| "core team" status on every card | Redundant when every card says it. | Kept for now (design uses the chip), flagged as a P2 clean-up. |

## 11. Footer

- "looking for a job? experienced account manager" — specific, human, and links to a real mailbox. Retained.
- "\*we're millennials and gen-z: please do not call us." — retained; it is the studio's voice and explains the WhatsApp preference.
- WhatsApp link points at `+91 00000 00000`. **Not publishable.** Content task: supply the real number.
- Credits modal: "Design & code by **[your name]**." — a placeholder shipped to production. **Queued**: needs the real name.

## 12. Global rules applied

1. No sentence may survive if a competitor could paste it unchanged.
2. No outcome, reach, revenue or award claim without a source.
3. Status words are facts: *in progress*, *in development*, *live*, *studio*.
4. Technical/audit language belongs in `docs/` and `audit/`, never in a case study.
5. One joke per page.
6. Lowercase for texture, sentence case for reading paragraphs.

## 13. Remaining copy work (blocked on data, not writing)

| Item | Needs |
| --- | --- |
| Café client name and quote | display permission |
| Team names/roles confirmation + consent | studio |
| Real social handles and WhatsApp number | studio |
| Credits modal name | studio |
| A project with measured results | client reporting access |
| Testimonials | written permission |
