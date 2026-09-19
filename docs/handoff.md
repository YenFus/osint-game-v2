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
**8.1** (round 13). Round 14's score: see §7.

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
| HEAD | `7d9db54` — "The connect board had a dead band across the middle" |
| Remote | https://github.com/YenFus/osint-game-v2 (pushed, tree clean) |
| Live artifact | https://claude.ai/artifact/MuuT8ffPzFCtHUonQoDHXv — **Version 26** |
| Tests | 37 pass (`npm test`) — was 36; round 14 added one to the phrase suite |
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
| `gate.cjs` | earliest surname sighting |
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

## 7. Round 14 critic result

> **PENDING** — the round was running when this doc was written. First launch
> died on an account rate limit having produced nothing; it was relaunched
> against the same HEAD. Fill this section in with the score, sub-scores,
> per-claim verdicts, and the prioritised gap list when it reports.

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
- **A13 keeps ~60px slack top and ~50px bottom**; connect leads end with ~130px of
  bare cork under the last row (the feedback panel fills it once you start linking).
- **20 leads were not re-audited** in round 14: A1 A3 A6 A7 A8 A11 B1 B4 B5 B7 B8
  B11 B12 C1 C2 C3 C5 C7 C8 C9 — beyond the regression passing.
- **The name gate moved** from the 10th lead to the **15th** (`gate.cjs` reports
  earliest surname sighting: C5 after 15 leads). Unit tests requiring ≥9 prior
  leads still pass. Open question: does the reveal now land *too late*?

---

## 9. The critic is not always right

Round 13 asserted that `.ded-slot` was "a `<div tabIndex=0>` with an aria-label but
no role". **It was not.** Every `.ded-slot` on the board carried `role="button"` and
`tabindex="0"`, and `.final-slot` was already a real `<button>`. Measured before
touching anything.

There *was* a real defect in that area — a `div[role=button]` wrapping a real
`<button class="unpin">`, i.e. interactive inside interactive — and that was fixed.

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
