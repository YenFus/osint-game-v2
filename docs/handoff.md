# Handoff — *What Maya Knew* quality loop

Written 2026-09-19, end of round 14's fix pass. Read this plus `CLAUDE.md` before
doing anything. Everything here is verified unless it says otherwise.

---

## 1. The goal

Make the game genuinely fun and excellent, judged by an **independent critic
subagent that scores it 1–10. 9.5 passes.** Keep looping until it passes.

The critic must cover every aspect and act like a full-time QA tester: story,
pacing, each of the 28 leads, art, audio, mobile, keyboard, screen reader,
endings, save/load, the tutorial, the name reveal.

**Score history:** 3.5, 3.8, 4.5, 4.8, 5.6, 5.8, 6.2, 6.8, 7.3, 7.6, 7.8, 7.7,
8.1, **8.2** (round 14 — full report in §7, open work list in §7.3).
**Round 16 came back 7.9** (down from 8.2 — it went deeper and found worse).
Round 16's fix pass is shipped and unscored; see §14.

**§15 is the one to read before briefing another critic.** A player found two
blocking bugs on a phone in ten minutes that sixteen rounds of review never
saw, because every check in this loop tested the resting state at 390x844.

**Start here:** read §14 — round 16's score, its fix pass, and what is left.
§13 is round 15. §7.2 is three claims round 14 proved false; do not repeat them, and note
§13.2 adds a fourth: round 14's own P0 was overstated.

Round 13's sub-scores, for reference on where the headroom is:
writing 9.2, endings 9.0, feedback 9.0, save/load 9.0, fairness 8.8, bugs 8.8,
performance 8.8, clue legibility 8.5, accessibility 8.4, mobile 8.3,
onboarding 8.0, visuals 8.0, UI/UX 7.8, pacing 7.8, puzzle variety 7.2,
**audio 5.0**.

Round 13's own summary of the gap: *puzzle variety is the score; stop shipping
unverified claims; make the screens as dense as the writing, because the
prose/endings layer is already 9.0+ while the layout layer is half-empty
panels.*

---

## 2. Current state

| | |
|---|---|
| Repo | `/Users/mohit/Projects/osint-game-v2`, branch `main` |
| HEAD | `b5e1c59` — "The free field manual printed the answer the paid hint charged for" |
| Remote | https://github.com/YenFus/osint-game-v2 (pushed, tree clean) |
| Live artifact | https://claude.ai/artifact/MuuT8ffPzFCtHUonQoDHXv — **Version 29** |
| Tests | 37 pass (`npm test`) |
| Lint | `npx eslint src` clean |
| Dev server | `http://localhost:5173/osint-game-v2/` — usually already running; **do not start a second**, port 5173 is `--strictPort` |

Commits in round 14, oldest first:

```
a820877  Three objects in a dark room with nothing to say they were clickable
f39dc21  The phrase lead underlined its own answers
16289a6  Five browse leads become five different questions
4a1e24a  A13 and A4 were about half empty panel
1532611  The board skipped from H1 straight to H3
f0ea6fa  The voicemail had no recording in it
f6bebd3  Two plates that only survived at thumbnail size
7d9db54  The connect board had a dead band across the middle
```

Commit subjects in this repo are **sentences about what changed**, not
conventional-commit prefixes. Match that style.

---

## 3. The loop, per round

1. Fix the critic's findings in `src/`.
2. `npx eslint src && npm test` (37 must pass).
3. Run the Playwright harness (§4).
4. **Look at the screenshots.** Non-negotiable — see §5.
5. `npx vite build --base=./ --outDir dist-artifact`
6. Republish to the artifact URL above (wrapper HTML + a files map built by a
   script, not echoed into chat).
7. Commit and push.
8. Launch the next critic round, and **tell it explicitly what you did not fix.**
   It scores honesty, and a false claim costs more than the bug would have.

### Republishing, concretely

`vite build` emits hashed asset names that change every build, so the wrapper
HTML has to be regenerated each time. The script that does it reads
`dist-artifact/index.html`, pulls the `index-*.js` / `index-*.css` / modulepreload
names out with regex, and writes a wrapper to the scratchpad. Then call the
Artifact tool with `url` (to update in place — omitting it creates a *new*
artifact), `root: dist-artifact`, and a `files` map of published-path → source-path.

You must `action: "read"` the artifact once in the session before you can publish
to it. On an update you only need to pass the files that changed; files you leave
out are kept.

---

## 4. The harness

Playwright driving **system Chrome** (`channel:'chrome'`, headless).
`node_modules/playwright` is installed in the project.

Scripts live in the session scratchpad, not the repo. Round 14's are at:

```
/private/tmp/claude-501/-Users-mohit-Projects-osint-game-v2/5addcecd-50e9-461f-ba6c-ad70d6aeeb7e/scratchpad/
```

**Copy them into your own scratchpad at the start of a session** — the path above
belongs to a session that has ended, and earlier rounds' scripts were copied
forward the same way.

| script | what it does |
|---|---|
| `r10.cjs` | full regression, every lead — the one to run first; has a good seed to copy |
| `newleads.cjs` | map / timeline / compare leads played to completion |
| `diff.cjs` | diff lead |
| `phrase.cjs` | phrase lead |
| `reveal2.cjs` | name-reveal card: contrast, single card, no tab escape, Enter dismisses |
| `gate.cjs` | earliest surname sighting — **reports one traversal path, not the floor.** Round 14 proved the true floor is 9 prerequisite leads / the 10th lead opened, while this script reported 15. Fix it to walk the `requiresCompleted` closure, or do not quote it. |
| `a11y.cjs` | tab stops inside the lead dialog |
| `inert.cjs` | background controls inert behind the modal |
| `endings.cjs` | all ending verdicts render on both viewports |
| `boardmob.cjs` | board at 390px |
| `c9pick.cjs`, `c1zoom.cjs` | the C-thread photo leads |
| `dens.cjs` | panel slack per lead (round 14; see caveat below) |
| `shoot.cjs` | screenshot N leads by id — the workhorse |
| `play2.cjs` | plays connect leads by card index to completion |
| `vm.cjs` | taps through the prologue and plays the voicemail |
| `chk1.cjs` | apartment hotspots + phrase lead interaction |
| `poster.cjs` | **STALE** — clicks `.drawer-toggle`, which is `display:none` above 700px, so it times out at desktop width. Not a game bug. Fix or delete it. |

### Seeding

Write localStorage key `maya-game-v3-storage` as `{"state":{…},"version":0}`, then
reload. The seed **must** include `nameRevealSeen:true`, `namePending:false` and
answered `rayLog` entries (`[{"id":"r1","choice":0},…"r4"]`) or modals block every
click. `currentNodeId` opens a specific lead.

Lead ids: `A1 A2 A3 A4 A6 A7 A8 A9 A11 A12 A13 / B1 B2 B4 B5 B7 B8 B11 B12 /
C1 C2 C3 C4 C9 C5 C6 C7 C8` (28 total; note the gaps — there is no A5, A10, B3…).

**Seeding trap:** a mid-game seed with `started:true` puts a `.started` class on the
apartment hotspots, which gives them a visible border. The round-12/13 finding that
they had no resting affordance was only reproducible with a *fresh* save. Test both.

**`dens.cjs` caveat:** it measures the outermost container, which always fills the
panel, so it reports ~18px slack for everything and does **not** detect the blank
*bands inside* a full-height container that the critic complains about. Either fix
it to measure painted ink per row, or just crop-screenshot the panel and look.

---

## 5. Verification discipline

The user was explicit: **do not swap screenshots for assertions to save tokens.**
Quality drops when you do. Trim tokens elsewhere — build file maps inside scripts,
grep for line ranges before reading, crop to the region in question.

Twice this project shipped bugs that every automated check passed:

- a reveal card rendering white-on-cream at **1.01:1** contrast;
- "evidence" documents that were placeholder squiggles under the magnifier.

Round 14 caught three more the same way, all of which had passing assertions:
a phrase highlight broken into notched boxes, the same lead rendering as a
one-word-per-tile grid at 390px, and a repaired tyre that came out looking
motion-blurred.

**Presence is not legibility. Look at the picture.**

---

## 6. Round 13's ten findings and what was done

| # | Finding | Outcome |
|---|---|---|
| 1 | Apartment hotspots invisible at rest (1440, fresh save) | Fixed — corner brackets, warm wash, staggered `roomBreath`; stops on hover/focus/touch, off under `prefers-reduced-motion` |
| 2 | A2 phrase lead signposted its answers (6 underlined candidates, 3 right) | Fixed by rewrite — all 69 words selectable, nothing marked at rest, pick first word + last word |
| 3 | A13 and A4 ~55% empty panel | Fixed — A4's maps fill their band; A13's blank quarter-panels now carry the case's own hours |
| 4 | Verb monoculture, 15/28 in two families | Fixed — five browse leads converted (§6.1) |
| 5 | AI tells at plate size in `ph-maya.jpg`, `ph-shop.jpg` | **Partial** — mugs and tyre and dissolving nose fixed; yoke seam and window deliberately left (§8) |
| 6 | No audio assets at all; voicemail played nothing | **Partial** — one real file; the rest of `useAudio.js` untouched (§8) |
| 7 | Missing h1s; prologue was one screen-sized `role="button"` | Fixed — prologue is a `<section>` + sr-only h1 + real advance button; board thread titles are h2 |
| 8 | Space leaks around `.ph-mark` | Fixed as part of #2 |
| 9 | B1 board thumbnail a near-black rectangle | Fixed — real generated plate `public/art/ph-notebook.jpg` |
| 10 | `.ded-slot` had no role; final slot `'before'` labelled "PATTERN" | **Disputed** (§9) |

### 6.1 The five lead conversions

Each asks a different question of the same evidence — none is a re-skin.

- **A9 → compare.** Not "flag the two odd accounts in a list of nine" but four
  separate things about `@nightwatch_rc` lined up against `stillwater_m`: the day
  it was made, the header cropped from his own photograph, the six accounts it
  follows, the hours it reads at.
- **A12 → diff.** Two dated WHOIS snapshots. Four fields match, three do not.
- **B2 → connect.** Not "which posts sound sinister" — tone proves nothing — but
  "where could this detail have come from". Two of four posts have a public
  source; two have none, and both link to the same *Nowhere public* card.
- **C4 → connect.** Three Courier cuttings against three board facts.
- **C6 → diff.** The Courier's printed summary against the clerk's unredacted
  filing. C4 tells you the paper doesn't print names in these cases; this makes
  that sentence playable.

Type census after (28 total):

```
input 5 · connect 4 · tag 3 · navigate 3 · diff 3 · compare 3
slider 2 · browse 2 · timeline 1 · phrase 1 · map 1
```

Order: `A1 nav · A2 phrase · A3 input · A4 map · A6 diff · A7 tag · A8 input ·
A9 compare · A11 connect · A12 diff · A13 timeline` /
`B1 slider · B2 connect · B4 compare · B5 input · B7 nav · B8 input · B11 slider ·
B12 browse` /
`C1 tag · C2 tag · C3 input · C4 connect · C9 compare · C5 browse · C6 diff ·
C7 connect · C8 nav`

Threads A and B have no adjacent repeats. **Thread C opens C1 tag, C2 tag** —
pre-existing, and a self-correction was sent to the round-14 critic after it was
briefed with the incorrect claim that no thread had an adjacent repeat.

---

## 7. Round 14 critic result — **8.2 / 10**

Up 0.1 from round 13. Run against HEAD `7d9db54`, artifact Version 26.
Zero code changes were made after this report; §7.3 is the open work list.

| | R13 | R14 | | | R13 | R14 |
|---|---|---|---|---|---|---|
| Writing | 9.2 | **8.8** | | Visuals | 8.0 | 8.2 |
| Story / pacing | 7.8 | 7.8 | | Audio | 5.0 | **5.8** |
| Puzzle variety | 7.2 | **8.5** | | Mobile | 8.3 | 8.5 |
| Fairness | 8.8 | **7.5** | | Accessibility | 8.4 | **6.5** |
| Clue legibility | 8.5 | 8.3 | | Endings | 9.0 | **7.5** |
| Onboarding | 8.0 | 8.0 | | Save / load | 9.0 | 8.5 |
| UI / UX | 7.8 | 7.8 | | Feedback | 9.0 | 8.3 |
| Bugs | 8.8 | **7.8** | | Performance | 8.8 | 9.0 |

**Read the shape, not the total.** The conversions worked — puzzle variety
+1.3, the single biggest sub-score move in the project's history. The score
barely moved anyway because the critic went deeper than round 13 did and found
worse things: accessibility −1.9, endings −1.5, fairness −1.3, bugs −1.0. Those
drops are not regressions this round introduced; they are defects that were
always there and had never been looked for.

### 7.1 Fix verdicts — nine of ten verified

All ten claims were measured, not taken on trust. Verified: hotspots (1 ✓),
phrase lead (2 ✓ — 69 words, 6 tab stops, 0 marked at rest), density (3 ✓ —
it back-solved the A4 map projection from a pixel position to 44.9147 N /
122.9931 W and confirmed it matched the photo's stated coordinates), art (5 ✓),
headings and prologue (7 ✓ — zero `[role=button]` on the page, one h1, no level
jump), space leaks (8 ✓), B1 thumbnail (9 ✓).

**The conversions (4) verified with one false sub-claim** — see §7.2.

**Audio (6) verified mechanically, and the envelope claim held exactly:** it
decoded the file and computed its own 56-bucket RMS against `VM_WAVE` —
**correlation 1.000, mean absolute difference 0.003.** Those bars are the file.

**On the mobile word-target question it was asked to judge: ship it.** WCAG
2.5.8 explicitly exempts targets whose position is determined by the flow of
text in a sentence, so the 24×24 floor does not apply; word boxes are
21–59 × 29px against a ~57px line pitch, leaving ~28px of vertical slack per
tap. The rejected alternative would have been much worse.

### 7.2 Three false claims — the expensive part

Round 13's lesson was "stop shipping unverified claims". Round 14 caught three.

1. **"No two adjacent leads in a thread share a verb" — false.** Thread C opens
   C1 tag → C2 tag. Self-corrected mid-round, but the critic had already found
   it independently. On the substance it agreed it is a real pacing problem: the
   first two things a C-thread player does are both "flag the suspicious item on
   this board", and **C2's magnifier is the strongest single interaction in the
   C thread, spent as a repeat.**
2. **"The name gate moved to the 15th lead" — false, and it was not a small
   error.** The gate has not moved at all. `C5.requiresCompleted = A7`, and the
   full prerequisite closure is `{C1,C2,C3,C4,A1,A2,A3,A6,A7}` = **9 leads**.
   The critic seeded exactly that state, opened C5, clicked through and read
   "Raymond T. Callahan" on the **10th lead opened** — where it was last round.
   **`gate.cjs` reports the surname sighting along one traversal path, not the
   floor.** Fix the harness, or stop quoting it.
3. **Connect-lead slack understated.** Claimed "~130px of bare cork". Measured:
   **A11 233px (34% of the cork), C7 234px (34%), B2 187px, C4 186px (28%).**
   45–80% more than reported, across four leads.

A fourth, smaller one: the counter-claim in §9 that *every* `.ded-slot` carried
`role="button"` was **not literally true either** — solved slots correctly had
neither role nor tabindex, and `r10.cjs`'s seed ships three solved deductions,
which is very likely how round 13 sampled a null role and generalised. Net: the
round-13 finding was still inaccurate as stated and the point stands, but the
rebuttal was overstated. Both disputed claims were otherwise upheld (§9).

### 7.3 The work list — prioritised by the critic

**P0 — the ending is a keyboard dead end.** `src/pages/EndingPage.jsx:296`

```jsx
<div className="fixed inset-0 …" onClick={() => setPhase('details')}>
```

No role, no tabIndex, no key handler. Measured on the reveal screen: **2
focusable elements on the whole page, both skip links.** A keyboard-only or
screen-reader player reaches "MAYA REYES / FOUND ALIVE / Click to continue" and
**cannot reach the epilogue, the phone call or the restart.** This is the exact
defect just removed from the prologue, sitting at the climax instead. Worth
~0.5 on its own, and it is a hard blocker.

**P1 — the answer input on five leads has no accessible name.**
`src/components/nodes/InputNode.jsx:184–196`. No label, no `aria-label`, no
`aria-labelledby`, no `id`/`for`. Its only name is `placeholder="Type your
answer..."` — fails 4.1.2 and 3.3.2 and never says *which* of the two questions
is being answered. Affects **A3, A8, B5, B8, C3**.

**P2 — dead panel on the leads round 14 did not touch.** Exactly the two it was
pointed at got fixed. Measured empty area below last content:
**B12 323px (37%)**; **C5 ~370px combined (~48% empty)**; **B1/B11 190px each**,
and B1's "notebook page" is a 1070×195 letterbox at 5.5:1, which is not the
aspect ratio of a notebook page; **the four connect leads 186–234px**.

**P3 — three fairness defects of the same class as the A2 one just fixed.**
- **B12 prints its own paid hint for free.** Monologue: *"She wrote to me the
  night before. She never sent it."* Paid hint (+20 min): *"Unsent messages live
  in Drafts."*
- **C2 renders `STILLWATER MEDIA / Event Photography` legibly at rest**, ~24pt,
  before the magnifier is touched — and it is one of the three things the lead
  asks you to find. The discovery mechanic is spent on something already read.
- **B2's `src-press` decoy is unfairly punishing.** Its own text says *"…last
  seen at the arts night…"*, which publicly names the venue, so linking it to
  *"I know that building"* is a defensible read and costs 15+ minutes. Narrow
  the press-release text or widen the accepted answer.

**P4 — audio is one file across eleven beats.** 5.8 is what one asset buys. No
score, no room tone, no ambient bed; `useAudio.js` unchanged. **The largest
single remaining gap after the a11y blockers.**

**P5 — C1/C2 verb adjacency** (§7.2).
**P6 — `← BOARD` is 63 × 16px on all 28 lead panels**, below the 24×24 minimum,
and it is the primary escape hatch from every lead.
**P7 — clue economy.** `A11`, `B1`, `B5` grant no clue at all (no `clue` key in
`LEAD_META`); A2 and B2 both grant `insider`. Four of 28 completions can add
nothing to the pool depending on order.

### 7.4 Seven findings nobody raised in 13 rounds

1. **The voicemail playhead does not line up with its own waveform.**
   `src/components/board/PrologueArt.jsx:123–131`. Bars are drawn at
   `x = 556 + i * 8.0` (556 → 1000.6); the playhead and its track at
   `596 + 408 * prog` (596 → 1004). At 0:00 the red playhead sits **40px — five
   bars — inside a waveform where nothing is lit**, and mid-playback the
   disagreement measures 23px. The lit/unlit boundary is correct; only the
   playhead is wrong. One-line fix: track `596`→`556`, `408`→`444.6`. This is in
   the game's single most emotionally loaded UI, and it shipped in Version 26.
2. **Save deletion has no confirmation.** `SaveLoadModal.jsx:148` — one click
   and the slot is `null`. Verified.
3. **B2's `src-nowhere` card is missing its full stop**, so it reads as
   truncated on the rendered card.
4. **C6's hint miscounts:** *"Six lines"* against seven rows per side.
5. **Landmark inconsistency:** the apartment page exposes one landmark (`main`);
   the board exposes five. Inconsistent AT navigation across the two main screens.
6. **B2's `src-press` is an orphan** — in no `requiredConnections` entry. Fine as
   a distractor, but combined with P3 it is a distractor that argues for itself.
7. **The A4 photo rail scrolls horizontally at 390px with no affordance** — no
   edge fade, no chevron, cards cut mid-card; 52 elements sit right of the viewport.

Also new, at plate size in `ph-shop.jpg`: the rear bumper splits into two
mismatched chrome halves with a floating strip, the tail-light housing dissolves
bottom-left, and the rocker panel under the door has a melted wave. Invisible at
card size.

### 7.5 On the record as healthy

Zero page and console errors across 60+ boots covering all 28 leads, six phases,
five ending variants, the tutorial, the name reveal and the save modal. 37/37
tests, build clean in 954ms, FCP 352ms, 60fps on the board, no leak pattern.
Save → overwrite → load → delete round-trips with zero missing state fields.
Lead overlay focus trap: 0 escapes in 30 tabs, Escape closes. `lang="en"`, no
duplicate ids, every `<img>` has alt, every `<svg>` labelled or `aria-hidden`,
one h1 per screen, no horizontal scroll at 390px on any lead tested. The board
tab order and focus ring were both called the best in the project.

### 7.6 What round 14's critic did not reach

Opened and inspected but did not drive to completion: **A1, A3, A6, A7, A8, B4,
B5, B7, B8, B11, C1, C3, C7, C8.** Did not test the Ray beats / `raySuspicion`
escalation, the journalist unlock path, the convergence page's final-slot
pinning end to end, or `prefers-contrast`. **A proper axe-core pass is still
owed** — its compositing contrast probe produced false positives (flagged
`.lead-new` at 1.2:1 when the true value is 6.06:1), so contrast was spot-checked
by pixel instead.

---

## 8. Known unfixed — carry this list forward

Stated to the round-14 critic as not-fixed. Honesty is scored; keep declaring these.

- **The voicemail is synthesis, not a recording.** macOS `say` (Samantha) put
  through a handset simulation in numpy: band-limited 300–3400 Hz with soft
  skirts, handset AGC, soft clip, line hiss, 60/180 Hz hum, room. Do not let it be
  described as a recording of a person. Pipeline is reproducible from
  `scratchpad/dsp.py` + `vm.txt`/`vm2.txt`.
- **The rest of the audio is unchanged.** `src/hooks/useAudio.js` is oscillators
  and noise buffers end to end. No score, no ambient bed, no room tone anywhere
  except inside that one file. **Audio was the 5.0 sub-score — this is probably
  the single largest remaining lever.**
- **`ph-maya.jpg`'s shoulder yoke seam.** Deliberately left. Every mask that
  covered it also caught the hair or the collar and the grey smear read visibly
  worse than the seam; a saddle-shoulder knit has a seam roughly there.
  `scripts/repair_plates.py` documents the reasoning in place.
- **`ph-maya.jpg`'s window reflection.** Judged to read as a night window at
  shallow focus. Untouched.
- **B2 grants the clue `insider`, which A2 also grants.** A player who does A2
  first gets nothing new from finishing B2. Pre-existing. `src/data/leadMeta.js`.
- **A13 keeps ~60px slack top and ~50px bottom** — round 14 measured ~110px left
  rail / ~80px right column, so this was understated too, though honest in kind.
- ~~connect leads end with ~130px of bare cork~~ — **understated, corrected by
  round 14: A11 233px (34%), C7 234px (34%), B2 187px, C4 186px (28%).** See §7.3 P2.
- **20 leads were not re-audited** in round 14: A1 A3 A6 A7 A8 A11 B1 B4 B5 B7 B8
  B11 B12 C1 C2 C3 C5 C7 C8 C9 — beyond the regression passing. Round 14's critic
  reached some but not all of them; the residue is in §7.6.
- ~~The name gate moved from the 10th lead to the 15th~~ — **FALSE, do not repeat
  this.** The gate has not moved. `C5.requiresCompleted = A7`; the prerequisite
  closure is 9 leads and the surname appears on the 10th lead opened, exactly
  where it was. `gate.cjs` reports one traversal path, not the floor. See §7.2.

---

## 9. The critic is not always right

Round 13 asserted that `.ded-slot` was "a `<div tabIndex=0>` with an aria-label but
no role". **It was not.** Every `.ded-slot` on the board carried `role="button"` and
`tabindex="0"`, and `.final-slot` was already a real `<button>`. Measured before
touching anything.

There *was* a real defect in that area — a `div[role=button]` wrapping a real
`<button class="unpin">`, i.e. interactive inside interactive — and that was fixed.

**But the rebuttal was overstated too, and round 14 caught that.** Solved slots
correctly had neither role nor tabindex, and `r10.cjs`'s seed ships three solved
deductions — very likely how round 13 sampled a null role and generalised. The
round-13 finding was still inaccurate as stated, so the point stands; but "every
`.ded-slot` had `role="button"`" was not literally true. **Check the state your
own measurement was taken in before you call someone else wrong.**

**Verify the critic's claims the same way you verify your own.** Round 13 also
listed two of the previous round's claimed fixes as false, which is why the brief
now says "verify before you believe anything in a fix list, including this one".

The final-slot `'before'`/"PATTERN" point was left alone deliberately: WHO / THERE /
PATTERN is a terse triplet matching the three questions, the accessible name
includes the full question, and `'before'` is an internal id persisted inside saved
games — renaming it breaks old saves for no user-visible gain.

---

## 10. Hard constraints

**Story.** Ray Callahan is the culprit, but "Callahan" must not appear in the first
hour. Three unit tests hold that gate. When writing leads, clues, plates or art,
keep the surname and initials out of early-reachable content.

**Art — no "AI slop".** Generate with local FLUX.1-schnell 4-bit via mflux:
`/Users/mohit/Projects/World Animator/.venv/bin/mflux-generate`, model
`madroid/flux.1-schnell-mflux-4bit`, driven by `scripts/gen_art.py`, which holds the
style bible and per-asset seeds.

- **A seed does not survive a resolution change.** The two plates the magnifier
  zooms into (`gallery-room`, `hall-banner`) are generated at 1344px and enlarged
  2× with Lanczos + unsharp. Re-roll them and you must re-measure the hotspot
  percentages in `gameData.js`.
- mflux refuses to overwrite; `gen_art.py` unlinks first.
- `python3 scripts/gen_art.py --variants 4 <name>` rolls seeds into
  `art/variants/` for picking by eye. Build a contact sheet and look at it.
- Targeted photo repair (repainting a clock, cloning out a badge, blurring garbled
  signage, 2× Lanczos + unsharp) uses PIL via `.venv-img/bin/python`, which also
  has numpy. See `scripts/repair_plates.py`.
- People in photos are fine **if they are art-directed and don't look generated**.

**Git.** Commit and push freely to the existing repo.

**Antigravity.** The `agy` CLI (`~/.gemini/antigravity/bin/agy`, model
`gemini-3.8-flash-high`) is useful as a whole-script continuity auditor. `agy -p`
ignores piped stdin — put the content inside the `-p` argument. Its file-reading
tools are auto-denied headless without a permissions config; writing
`~/.gemini/settings.json` was blocked by the permission classifier, and the user
has offered to grant permission if asked. It was **not** used in round 14.

---

## 11. Gotchas found in round 14 — these cost real time

- **Chrome ignores `display: inline` on `<button>`.** It renders inline-block
  regardless, so a button's painted box is the full line-height while an adjacent
  `<span>`'s is only the font's content area. A highlight spanning both comes out
  as boxes of two different heights with notches between them. Fix used: vertical
  padding in `em` on the inline spans — it paints without affecting layout or
  line-breaking. `.ph-gap { padding: 0.316em 0 }` in `src/styles/board.css`.
- **The blanket mobile touch-target rule is dangerous.** `src/index.css` gives
  every `button, [role="button"], a` `min-height: 44px; min-width: 44px` under two
  media queries. Applied to inline word buttons it turned prose into a grid of one
  word per tile. Exempted `.ph-w`/`.ph-gap` and gave them a zero-paint `::after`
  overlay for touch area instead. **Anything inline-and-clickable will hit this.**
- **CSS keyframes beat hover/focus declarations.** A resting `animation` on
  `.room-hot` kept overriding the `border-color` that `:hover`/`:focus-visible`
  were setting. The state rules need `animation: none`.
- **A hover rule can out-specify a selection rule.** `.ph-w:hover:not(:disabled)`
  is (0,3,1) and beat `.ph-w.sel` at (0,2,0), so hovering a selected word dimmed
  it. Added `:not(.sel):not(.hit)`.
- **The Artifact tool does not serve `.m4a`.** Audio must ship as `.mp4`, `.mp3`,
  `.wav`, `.ogg` or `.webm`. `afconvert -f mp4f -d aac -b 56000 -c 1 in.wav out.mp4`
  produces a servable file. (`afconvert` and `say` are the only audio tools on this
  machine — no ffmpeg, no sox.)
- **Python `str.replace` replaces every occurrence.** A patch to `prologue.css`
  duplicated a whole block into a media query because the anchor appeared twice.
  Assert the count first.
- **`git add -p <file> < /dev/null` does not fail cleanly** — it prints the hunk
  and then a following `git add <file>` stages the whole thing anyway. One commit
  ended up carrying more than its message described; the message was amended to say
  so rather than rewriting history.
- **A harness script that answers a slightly different question than you think is
  worse than no script.** `gate.cjs` reported the surname gate at 15 leads; the real
  floor is 9. It walks one path; the answer needed is the minimum over the
  `requiresCompleted` closure. Two of round 14's three false claims came from
  trusting a measurement without checking what it measured. **Before quoting a
  number at the critic, re-derive it a second way.**
- **Brief the critic on budget.** Round 14's first launch died on an account rate
  limit having produced nothing. The brief now tells it to batch Playwright work,
  crop screenshots, prioritise verifying the claimed fixes over the full sweep, and
  **produce a report even if the sweep is cut short rather than running out
  silently.** Relaunching is cheap — check HEAD, `git status`, `npm test` and a
  curl of localhost:5173, then relaunch with the same brief.

---

## 12. File map

```
src/data/gameData.js        all 28 leads, ~1250 lines — the bulk of the content
src/data/leadMeta.js        per-lead clue / hint / summary / board card / raySuspicion
src/data/caseData.js        CLUES, DEDUCTIONS, FINAL_SLOTS, SUSPECTS, evaluateCase, NAME_CLUES
src/data/caseData.test.js   the 37 tests, including the three surname-gate tests
src/data/prologueData.js    prologue beats; the voicemail beat carries `audio`
src/data/photoPlates.js     filename → plate mapping for lead thumbnails

src/components/nodes/       one component per lead verb (11 of them)
src/components/board/CaseBoard.jsx      the corkboard, deduction slots, final slots
src/components/board/PolaroidArt.jsx    SCENES (drawn) and PHOTO_SCENES (crops of real plates)
src/components/PrologueSequence.jsx     prologue + the voicemail player hook
src/hooks/useAudio.js                   oscillators and noise buffers (unchanged)

src/styles/board.css        ~1550 lines — nearly all lead and board styling
src/index.css               globals, incl. the two blanket touch-target rules
src/styles/prologue.css     prologue only

public/art/*.jpg            generated plates
public/audio/               one file: maya-voicemail.mp4
scripts/gen_art.py          style bible + per-asset seeds
scripts/repair_plates.py    targeted PIL repair, with the reasoning in docstrings
```

**Clue flow:** a lead's clue comes from `LEAD_META[id].clue`, granted on completion
by `InvestigationPage`, so **changing a lead's `type` does not disturb the clue
graph**. That is what made the five conversions safe. Leads that reveal the surname
call `flagNameSeen()`; `BrowseNode`, `InputNode` and `NavigateNode` do it via a
`revealsName` flag on an item, and `DiffNode` gained the same via `revealsName` on a
*change* (needed for A12 and C6).

---

## 13. Round 15 — what shipped, and what did not

HEAD `6531f33`, artifact **Version 28**. 37 tests, `npx eslint src` clean, build
930ms. Regression (`r10.cjs`) green, endings 11 verdicts on both viewports,
focus trap 30/30, background inert 56/56, no console or page errors anywhere.

### 13.1 Fixed

| Item | What was done |
|---|---|
| **P0** ending | Reveal plate is a real autofocused `<button>` carrying the verdict as its name; any key advances; plate marked `aria-hidden`. **But the finding was overstated — see §13.2.** |
| **P1** input names | `aria-labelledby` the question, `aria-describedby` the context note, on A3 A8 B5 B8 C3 |
| **P3** B12 hint leak | Monologue no longer says "never sent it", which was the paid hint's answer |
| **P3** B2 `src-press` | Press release no longer names the venue, so the decoy stops arguing for itself |
| **P6** `← Board` | 63×16 → **87×34** on all 28 panels |
| **P7** clue economy | Four new clues: A11 `postbox`, B1 `burned_page`, B5 `priya_words`, B2 `no_source` (was a duplicate `insider`). **28 leads, 28 distinct clues, no gaps, no duplicates** |
| **P2** partial | A3 **42%→4%**, A8 **48%→11%** — see §13.3 |
| **P4** audio | Four produced beds replace the oscillator tracks; `scripts/gen_ambience.py` |
| 7.4 #1 playhead | 40px out at 0:00 → worst 1.67px across the file |
| 7.4 #2 save delete | Two-step arm/confirm, self-disarming after 5s |
| 7.4 #3 / #4 | `src-nowhere` full stop; C6 "Six lines" → "seven lines each" |
| 7.4 #5 landmarks | Apartment 1 → 4 labelled landmarks ("Points of Interest", "Investigation Threads", "Maya's apartment") |
| **New** | The cork texture has 404'd on **every published artifact**, including 26 — see §13.4 |

### 13.2 Round 14's P0 was overstated — measured, not argued

> "A keyboard-only or screen-reader player … **cannot reach the epilogue, the
> phone call or the restart**. This is a hard blocker."

Not so. `EndingPage` has always had a 5.2s timer that advances the reveal
whether or not anyone clicks. Measured at 1440×950: at t=0.8s the page has 2
focusables (both skip links); **at t=6.0s it has 4, including the epilogue
disclosure and "← Play again", with no input at all.** The "2 focusable
elements" reading is accurate but describes a five-second window, not a trap.

The real defect was narrower and is fixed: a `div` with an `onClick`, no role,
no key handler, telling people to "click". **Do not score it as a blocker that
was cleared — score the narrower thing.** §9's rule applies to the critic too.

### 13.3 P2 — the dead-panel numbers, and a measurement trap worth knowing

**`dens.cjs` and any DOM-walk are the wrong instrument.** A row median fails
because the panel is two columns with different backgrounds, so a blank row
reads as half-deviating. What works is **local gradient**: a flat fill of any
colour has none, text and graphics have plenty. `scratchpad/ink.py` does this
and its B12/B1/B11 numbers landed within 2% of round 14's independent figures.

**The seed matters more than the instrument.** With `clues: []`, B5, B8 and C3
measured 42–45% empty. With the clue pool a player would actually hold at that
point, they measure **3%** — the notes column fills. My first three "findings"
there were artefacts of an unrealistic seed. Use `grab2.cjs`, which walks the
board order and seeds each lead with its predecessors' clues.

Honest state after the round, gradient-measured, realistic seeds:

```
C8 419px 47% · B7 394px 44% · B4 332px 37% · B12 313px 35%
B1/B11 298px 33% · A9 289px 32% · C5 182px 20%
A8 102px 11% · A3 36px 4%   (both fixed this round)
```

**Seven leads are still 20%+ empty and were not touched.** C8/B7 are navigate
leads whose file lists stop after four rows; B4 has genuinely good content that
simply does not fill; B1/B11 are slider leads with an interior band at y≈198.

### 13.4 The cork bug, and why thirteen rounds missed it

The main menu and the ending have been requesting
`/assets/art/cork-surface.jpg` and getting a **404 in every published version**.
`--cork` held a *relative* `url()`; a relative URL in a custom property is
substituted textually and Chrome resolves it against **the stylesheet that
reads it**, and `board.css` ships from `/assets/`.

It never reproduced on the dev server because `BASE_URL` there is the absolute
`/osint-game-v2/`. It only breaks under `--base=./`, which is the artifact.

**Serve `dist-artifact` and boot that, not just the dev server.** One command:

```bash
cd dist-artifact && python3 -m http.server 8899
```

Then watch for any response ≥400. That is how this was found, and it is the
only check in the loop that exercises what players actually get.

### 13.5 Not fixed — declare these

- **P5, C1/C2 verb adjacency — deliberately not done.** I drafted the
  conversion of C1 (tag) to a connect lead; the corkboard-with-string material
  invites it. Every version read worse. C1 ends by pointing at the Courier
  photo credit as "the next lead", which *is* C2, and C1→C2→C3 is a linear
  `unlocks` chain, so reordering breaks the setup too. **The critic's substance
  stands** — C2's magnifier is the best interaction in the thread and it is
  spent as a repeat — but a worse lead is not a fix. Whoever takes this needs a
  new opening interaction for thread C, not a reshuffle of the existing one.
- **P2 for the seven leads in §13.3.**
- **7.4 #6** `src-press` orphan, **7.4 #7** A4 photo rail at 390px, and
  **convergence still exposes one landmark** while the board exposes eight.
- Everything still standing in §8: the voicemail is synthesis; the yoke seam and
  window in `ph-maya.jpg`; `ph-shop.jpg`'s bumper, tail-light and rocker panel
  at plate size; A13's ~110px/~80px slack.
- **Audio is produced synthesis, not recordings.** Four beds and one voicemail.
  There is still no score and no SFX pass — `playSFX` is unchanged oscillators.
- **The axe-core pass is still owed** (§7.6), and round 14's 14 un-driven leads
  were not driven this round either.

### 13.6 Harness added this round

Copy these forward with the rest:

| script | what it does |
|---|---|
| `ink.py` | gradient-based blank-band measurement — the only slack measure here that has matched an independent one |
| `grab2.cjs` | captures all 28 panels seeded with each lead's realistic clue pool |
| `bed.cjs` | instruments Web Audio to prove beds fetch, decode and loop in the running game |
| `built.cjs` | boots `dist-artifact` off `:8899` and fails on any response ≥400 — **run this every round** |
| `lm.cjs` | landmark census per screen, with accessible names resolved |
| `p0.cjs` | the ending-reveal focus probe from §13.2 |

`gate.cjs` is still wrong (§7.2) and was not fixed. `poster.cjs` is still stale.

---

## 14. Round 16 — scored 7.9, then fixed

The critic scored **7.9 (down from 8.2)**. Read the shape: eleven of round 15's
thirteen claimed fixes verified exactly, one partial, none false. The score fell
because the sweep went deeper and found worse things — a hub-screen layout
collapse, and the fact that the two fixes round 15 took most credit for were
hollow one question below the surface.

| | R14 | R16 | | | R14 | R16 |
|---|---|---|---|---|---|---|
| Writing | 8.8 | **9.0** | | Visuals | 8.2 | 8.2 |
| Story / pacing | 7.8 | 7.8 | | Audio | 5.8 | **6.5** |
| Puzzle variety | 8.5 | **8.3** | | Mobile | 8.5 | **6.5** |
| Fairness | 7.5 | 7.6 | | Accessibility | 6.5 | **7.2** |
| Clue legibility | 8.3 | **7.6** | | Endings | 7.5 | **8.5** |
| Onboarding | 8.0 | 8.0 | | Save / load | 8.5 | **9.0** |
| UI / UX | 7.8 | **6.8** | | Feedback | 8.3 | 8.0 |
| Bugs | 7.8 | **6.5** | | Performance | 9.0 | 9.2 |

### 14.1 The lesson worth carrying

> The clue pool has 28 distinct entries **and** four of them score zero. The
> beds loop seamlessly **and** have no events in them. Neither is a lie. Both
> are the kind of claim that stops being useful one question down.

The standing rule is re-derive a number a second way. Round 16 added the
companion: **ask what the number would have to be for the player to notice.**
"28 distinct clues" was true and meaningless; the question was "can they be
pinned", and the answer was no for eleven of them.

### 14.2 Fixed this round

| | |
|---|---|
| **Board collapse** | `.cb-threads:has(.folded)` is (0,3,0); the responsive override is (0,1,0) and media queries add no specificity — so closing one thread pulled the mobile board back to three tracks at every width, overlapping with nothing scrollable. Now scoped to `min-width:1101px`. Twelve layouts measured clean (390/768/1024/1440 × 0/1/2 folded). |
| **Clue weights** | Eleven clues could not be pinned. Every clue now has a weight where it earns one and a written Okafor reaction in all three slots. Ceiling unchanged: 3.00 canonical, 2.50 best-without-naming, still gated by `namesSomeone`. |
| **Mobile apartment** | The user's own report. See §14.3. |
| **Contrast** | First axe run in the project's history: 134 nodes → **0**. |
| **Ending focus ring** | Round 15's own regression: `autoFocus` + `:focus-visible` on an `inset:0` button = a full-screen gold rectangle for every player. Indicator moved to the cue line. |
| **`#navigation`** | Skip link pointed at an id that never existed, on all six screens. Board nav has it now; the link only renders there. |
| **Field manual leaks** | B12 and B2 printed the paid hint's answer for free, one button to the left. Both teach technique now. |
| Small | `nested-interactive` in the apartment, `aria-progressbar-name` on the tag leads, focusable notes column, guarded `CLUES[id]?.spoken`. |

### 14.3 The mobile blocker — how to not ship this again

**The user hit this on a real phone: "could not move forward, things blocked or
couldn't be seen."** Reproduced at 390×844, 360×740 and 414×896.

The room photo sits above the sidebar on mobile and took ~45% of the screen,
leaving the sidebar 516px for 845px of content. The third thread *and* "Open the
case board" — the only way forward — were below the fold in a pane that scrolls
with **no affordance**. The page cannot scroll: the shell is `h-screen` +
`overflow:hidden`, and **the published artifact additionally pins `html, body`
to `overflow:hidden` in the wrapper**, so page-scroll is never available. Any
mobile fix has to work inside an inner scroller.

Room capped at 34vh; the button is `position: fixed` at the bottom with
`env(safe-area-inset-bottom)`. **Sticky does not work here** — the button's
parent section is only as tall as its own content, so it has no range; it
measured unchanged at 1109px.

**The harness lesson:** `mobsweep.cjs` first reported ~29 covered controls, and
almost all were false. `elementFromPoint` returns child nodes and pseudo
overlays that still forward the tap, and controls behind an open modal are
*correctly* covered and inert. Scope the probe to the modal when one is open,
skip `[inert]` and `.skip-link`, and then **tap the survivors** — `taptest.cjs`
proved A1/A7/B7/C8 were all fine. A fixed bottom bar will always "cover"
something mid-scroll; the real question is whether the last item scrolls clear,
which `bars.cjs` checks.

### 14.4 Still open — the critic's list, in its order

1. **C2 renders its own answer at rest.** Round 14 P3 item 2. I looked: the
   STILLWATER MEDIA sign is the largest, most legible object in the plate,
   readable before the magnifier is touched, and `table_sign` is the clue C2
   grants. **It also fell out of both §13 lists, which the critic correctly
   called an honesty gap — it was neither fixed nor declared.** It is declared
   now. The sign is also far too big for the room and reads as generated. Fix
   is a plate repair plus a re-measure of `ca-sign`'s hotspot percentages.
2. **Thread C's last beat.** B7 and C8 are the same screen — same layout, same
   placeholder, same four-row table, same footer, ~45% black. C8 *closes thread
   C* and it is a file browser.
3. **The beds have no events.** Over 720 × 50ms frames per bed, not one frame
   exceeds the file's own median by 6dB, and L/R correlation is 0.9945–0.9995 —
   they ship stereo and are effectively mono. Add one non-periodic event every
   8–15s, decorrelate L/R by 10–20ms, drop the harmonic stacks to one filtered
   layer. Then a SFX pass: `playSFX` is still oscillators.
4. **Seven leads 20%+ empty**: C8 47%, B7 44%, B4 37%, B12 35%, B1/B11 33%,
   A9 32%, C5 20%.
5. **A8 is over-signposted** — the question, the context note *and* a footnote
   under the list all say the same thing. Cut the footnote.
6. **P5, C1→C2 verb adjacency.** Still conceded, still unpaid. The critic agreed
   abandoning the conversion was right and named the real answer: thread C needs
   a *new* opening interaction, not a reshuffle of the existing one.
7. `prefers-contrast` has 0 rules. `caseData.test.js:273` tests node content for
   the surname but not `LEAD_META`, which carries it on four lines (they sit on
   leads with closure ≥ 9, so the gate holds — but nothing tests it).
8. Still standing from §8: the voicemail is synthesis; `ph-maya.jpg`'s yoke seam
   and window; `ph-shop.jpg`'s bumper, tail-light and rocker at plate size;
   A13's slack; `src-press` orphan; A4's rail at 390px; convergence has one
   landmark; `gate.cjs` and `poster.cjs` still wrong/stale.

### 14.5 Harness added this round

`axe1.cjs` (axe over all 28 leads, aggregated by colour pair — the only form
that makes 134 nodes actionable), `fold.cjs` (the board at 4 widths × 3 fold
counts), `mobsweep.cjs` + `taptest.cjs` + `bars.cjs` (§14.3), `mob2.cjs`
(apartment scroll chain on three phones), `ring.cjs`, `clue_audit.mjs` (weights,
fallbacks and the difficulty ceiling in one pass — run it after touching
`FINAL_SLOTS`).

**`built.cjs` earned its place again**: it is what proves the artifact bundle
serves, and the mobile work all had to be checked against `dist-artifact`
because of the wrapper's `overflow:hidden`.

---

## 15. The bug class the loop is blind to

Two bugs, both reported by the user from a real phone, both hit inside ten
minutes, neither found by sixteen rounds of critics or by any script here:

- **tap a detail on a photo lead → the magnified view is somewhere you cannot
  see it.** `zoomRef` had been declared in `TagNode` since the node was written
  and wired to nothing, and the plate and zoom were both sized off a fixed
  aspect ratio, so at a 600px viewport the pinned plate took 236 of the lead
  body's 274px and the glass got 38.
- **the burned notebook spilled its recovered text across the brightness
  slider.** The page is a flex item with no overflow of its own; flex items
  shrink below their content, so on a short screen the text ran out of the
  notebook and over the control.

### 15.1 Why every check missed them

They share one signature, and it is the whole lesson:

> **They need an interaction AND a short viewport at the same time.**

Everything in this loop — `r10`, `boardmob`, `mobsweep`, `dens`, `ink.py`, and
every critic sweep — measures the **resting state at 390×844**. Neither bug
exists at rest. Neither exists at 844px. Testing one dimension without the
other finds nothing, which is exactly what sixteen rounds found.

**390×844 is not a phone.** It is a phone with no browser. Safari and Chrome
take 150–200px, so a real device gives the page **600–670px**. Half the layout
budget in this game is spent before the first element renders.

### 15.2 `harness/mobplay.cjs` — in the repo, not the scratchpad

It is in `harness/` deliberately: scratchpad scripts get copied forward and
quietly dropped, and this one should not be. `harness/README.md` has the full
account. Run it every round:

```bash
node harness/mobplay.cjs
```

28 leads × 3 viewports (390×844, 390×664, 360×600), captured at rest, then
driven through that lead's own interaction, reporting only what the interaction
introduced. Four invariants: reachable, not painted over, not clipped without a
scroll, not zero-size. **Currently clean.**

### 15.3 The four traps — read these before trusting any occlusion result

The first version of this harness reported **737 findings** and almost every
one was noise. A harness that cries wolf is worse than none, and two of the
false claims in §7.2 came from exactly this kind of unchecked measurement.

1. **Cross-layer geometry.** Controls behind an open modal are correctly
   covered and inert. Comparing the dialog's geometry with the board's invents
   overlaps no player can see.
2. **`elementFromPoint` returns children.** A hit on a button's own child span
   is not an obstruction. Check containment both ways.
3. **A sticky bar always overlaps something mid-scroll.** That is what fixed
   footers do. It is a defect only if the control cannot be scrolled clear —
   so scroll it and re-test before reporting.
4. **Collapsed drawers keep their contents in the DOM.** The mobile clue drawer
   holds ~24 cards clipped to a zero-height box. Behind a toggle, not
   unreachable.

**Tap the survivors.** Geometry says a control looks obscured; a tap says
whether a player can use it. A1, A7, B7 and C8 all measured "covered" and all
tapped fine.

### 15.4 What to tell the next critic

Put this in the brief verbatim; it is the gap in every previous one:

> Test at **390×664 and 360×600** as well as 390×844 — a real phone loses
> 150–200px to browser chrome, and bugs exist in that band that do not exist
> above it. For every lead, **perform the interaction the lead is made of**
> (tap the hotspots, drag the sliders, type the answer, pin the cards) and
> re-check the layout afterwards. Resting-state screenshots pass while the
> game is unplayable. Then **tap** what you suspect, rather than reporting
> geometry.

### 15.5 Still open

Unchanged from §14.4 — C2's rest-legible sign, thread C's closing beat, the
beds having no events, seven leads 20%+ empty, A8 over-signposted, P5, and the
§8 list. Nothing in §15 displaced them; this was a separate class.

---

## 16. The screenshot round

The user asked for a critic that *looks*: "screenshot after every interaction or
anything that is different — the whole game should be screenshotted and
critiqued — only then you'll be able to see the minute details."

`harness/shotall.cjs` was written for this and is now the way to review the
game. 355 images, desktop and a 390×664 phone, every screen and one frame after
every interaction. **Zero page errors across all of it, twice.**

A critic subagent was launched over the set and **died immediately on an account
rate limit, producing nothing.** The review below is mine, from the pictures.

### 16.1 Fixed

| | |
|---|---|
| **Photo rails** (A4, A13) | A4 holds seven cards in 1561px of scroll in a 366px strip; the second was sliced through its own latitude with no affordance. Snap + a masked edge. Declared unfixed since round 14 as 7.4 #7. |
| **C8 and B7** | Not similar — *the same screen*, and C8 closes thread C. Both ~330px of black under a four-row file list. Filled with Thomas's voice via a new `content.idleBody`. Desktop **44%→21%** and **41%→25%**, mobile 5%. |

### 16.2 What the pictures show that the prose never did

**Duplicate screens are the real density problem.** Laid out side by side:

- **C1 and C2** are the same screen twice — same header, same `FLAGGED: 0/3`,
  same plate, same "0 of 8 details examined", same footer. Only the title
  differs. This is the C1→C2 verb adjacency, and it is far more damning seen
  than argued. **C9 then shows the same arts-night photograph a third time.**
- **B1 and B11** likewise: both "Burned Notebook", both "RECOVER THE BURNED
  INK", both `1 / 3`, both a dark plate over BRIGHTNESS 15 / CONTRAST 80.

Fixing the remaining empty panels one at a time misses this. Thread C needs a
different *opening*, and B11 needs to not be B1 again.

### 16.3 Density, all 28 leads, fresh

```
B4 35% · B12 33% · B1/B11 31% · A9 30% · B7 25% · C8 21% · C5 19%
```

### 16.4 Checked and found fine — do not "fix" these

Each looked like a defect in a contact sheet and was not, on zooming:
- **A13's timeline grid** — 368px in a 390px viewport, no overflow. The sheet's
  crop, not the game.
- **A8's wrong-answer feedback** — left-aligned and correct; thumbnail scaling
  made it look ragged.
- **B1's plate at rest** — a near-black rectangle by design; the handwriting is
  there at std 6.5 and the lead is about recovering it.
- The edge fade on the rails looked absent in a sheet while it was painting.

**Crop and zoom the real file before calling anything a defect.** Contact sheets
are for scanning only.

### 16.5 Genuinely good

The name reveal is the best screen in the game — cream on near-black, the name
huge, and the prose earns it. The prologue reads cleanly beat by beat. The seven
endings are all distinct in verdict, stamp and transcript length. The
wrong-answer feedback is specific and useful on every input lead. The writing
remains the strongest thing here by a distance.

### 16.6 The scratchpad is not storage

It was wiped between two sessions of this project and took the 355-image set
**and `r10.cjs`** with it. `mobplay.cjs`, `shotall.cjs`, `lib-state.cjs` and
`ink.py` survived because they had been moved into `harness/`. **`r10.cjs` is
gone and has not been rebuilt** — `node harness/shotall.cjs leads` boots all 28
leads on both viewports and reports page errors, which covers the smoke-test
part of what it did, but not its assertions. Rebuilding it belongs in `harness/`.

### 16.7 Still open

§14.4 stands, minus the two fixed above: C2's rest-legible sign, the beds having
no events, `playSFX` still oscillators, B4/B12/B1/B11/A9/C5 density, A8
over-signposted, P5 — now restated as §16.2, which is the sharper version of it.

---

## 17. The playthrough round: presentation only

After a full laptop playthrough the player said to **keep every puzzle, clue,
hint and unlock rule exactly as it is**, and to change only how information is
given. Their notes, and what each became:

| Note | Change |
|---|---|
| Facts appear without a source (A13 asked about Lena's hours and never showed them) | `brief: [{fact, from}]` on 21 leads in `leadMeta.js`, shown as "What you're working from" under the prompt (collapsed on phones). Timeline facts take `from`. |
| New clues were easy to miss (a toast off to the side) | `ClueCard.jsx`: a modal in front of the board with the title, the detail and "Where it came from". It waits for "Add to my notes". The drawer marks it new (`unreadClues`) until opened. |
| Every voice sounds AI-written, and the noir tone is cringe | `docs/story-bible.md` sets the voices. Every player-facing string is rewritten in plain first person. Thomas is a frightened, practical father, not a hardboiled narrator. |
| Ray's mood chip tips the player off | The mood, colour and alarm are gone from RayChip and RayPhone. Suspicion still runs underneath, unchanged. |
| The prologue voicemail sounds robotic | Kokoro-82M (Apache-2.0, local), voice `af_heart`, built line by line with a knock and a phone-line filter: `scripts/gen_voicemail.py`. Whisper confirmed the transcript word for word. |
| The prologue images look bad | Local FLUX.1-schnell photos (`gen_art.py` seeds, `prologue_bg.py` picks, blurs and crops) plus blurred backdrops. Seven beats, one fact each. |

Harness addition: `harness/cluecard.cjs` finishes A3 and shoots the card on
both viewports; `shotall.cjs` never completes a lead, so it can't see the card.

The artifact was missing all prologue art and the new voicemail until
version 34. That publish also removed 189 stale hashed bundles, since the
artifact caps out at 255 files.

---

## 18. The sound-and-presentation round (2026-09-22/23)

A full review of my own (docs/review-2026-09-22-claude.md, 7.4) found the
puzzles and writing ready and the *look, sound and staging* not. Everything
below is presentation; no answer, hint, clue id or unlock changed.

| Area | What changed | Where |
|---|---|---|
| Sound effects | Recorded CC0 foley, cut and level-matched; synth kept as fallback | `scripts/build_sfx.py`, `public/audio/sfx/`, `useAudio.js` (`SAMPLE_SFX`) |
| Music | Five cues written note by note, rendered on VSCO-2 CE piano/strings (CC0). Loops per phase, ducks under the voicemail/reveal/call, switches to the pulse cue in the last 2h before Ray leaves | `scripts/compose_score.py`, `scripts/score_lib.py`, `public/audio/mus-*.mp4`, `AudioManager.jsx` |
| Voicemail | On-screen captions timed with Whisper | `prologueData.js` `captions` |
| Source skins | Reddit, Wayback/Twitter, WHOIS terminal, scanner, sealed statement, court docket | `src/styles/skins.css`, `leadMeta.js` `skin`/`sourceLabel` |
| Burned notebook | Photo of a scorched page; ink fades in near the target | `public/art/burned-page.jpg`, `SliderNode.jsx`, `.rec-*` in board.css |
| Plot hole | Laptop locked (3 wrong passwords, Mon 8:04); smoke alarm pulled down | apartment text, A1 monologue + brief, B1 monologue, story bible |
| Board spoilers | Questions sealed until earned; open early if you hold an answering clue | `caseData.js` `opensAfter`, `dedOpen()`; `SealedSlot` in CaseBoard |
| Ray tells | Cast line without key/WiFi; journal border red only once named | `castData.js`, `CaseNotes.jsx` |
| Okafor | Contracted, shorter reactions | `caseData.js` FINAL_SLOTS, `EndingPage.jsx` |
| Climax | Full-screen typed name reveal; the call plays live before the verdict | `NameRevealCard.jsx`, `LiveCall.jsx` |
| Flow | Clue card lists new leads, offers "open it now" for a single one; spotlight tutorial; endings tracker | `ClueCard.jsx`, `BoardTutorial`, `store/endingsFound.js` |
| Apartment | Re-rolled photo (seed 417) whose corkboard matches the text; hotspots re-measured | `gen_art.py`, `ApartmentArt.jsx` |

**Listening without ears.** I can't hear audio, so every clip and cue was
checked with CLAP (laion/clap-htsat-unfused, via `.venv-tts`): labels such as
"a rubber stamp hitting paper" or "a sad solo piano piece" scored against the
file. It agreed with intent on every music cue and most clips; it is
unreliable on clips under ~0.2 s. Loop seams were checked by decoding in
Chrome (AAC priming is trimmed; `SCORE_LOOP_SECONDS` sets exact loop ends).

**Sources of third-party audio** are in `docs/CREDITS.md`. One clip (tack
into cork, pfranzen) is CC BY 4.0 and is credited on the About screen.

**Harness:** `harness/peek.cjs` shoots chosen leads or `reveal`/`call`/`board`.
`shotall.cjs` now shoots the live call before each ending. `cluecard.cjs`
clicks "Briefing" (it was "What you know").
