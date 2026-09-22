# What Maya Knew: full review, 2026-09-22

Build reviewed: HEAD `227c51b` (artifact v37). I played from a fresh save in
the browser (menu → prologue → apartment → tutorial → A1 → A2), then went
through `harness/shotall.cjs` (212 desktop frames at 1440×950 and 212 phone
frames at 390×664, fresh run) and read every player-facing string in
`src/data/`. I judge it against *Golden Idol*, *Obra Dinn*, *Her Story*,
*Orwell* and *Telling Lies*.

---

## Headline

**A smart, humane OSINT mystery with puzzles good enough to sit next to
*Golden Idol*. What holds it back is how it looks and sounds, and how often
it tells you the story before you find it.**

You're Thomas Reyes, a retired crime reporter who lets himself into his
missing daughter's flat and works her case from her laptop, her half-burned
notebook and her corkboard. The puzzles are the reason to play. Eleven
verbs, each asking a different question of the evidence: EXIF in UTC against
Portland time, two WHOIS snapshots, a clock on a gallery wall against a
printed programme. The prologue is spare and it lands. The name reveal hits
hard.

But three things keep it from being great. It's nearly silent: no music,
and the effects are synthesized clicks. Every source (Reddit, a Twitter
archive, a WHOIS record, a court filing) sits in the same dark monospace
panel, so the "investigating the internet" fantasy never quite forms. And
the mystery shows its hand. The board lists the thread questions ("Has he
done this to a woman before?", "He built his website himself…") from minute
one, the cast list introduces Ray as the man with "a key to my house and my
WiFi password", and the plot never explains why whoever took Maya burned her
notebook but left her unlocked laptop and her corkboard behind.

---

## Scores

| Category | Score | Why |
|---|---|---|
| Story & mystery | **7.0** | Strong premise, three threads that converge on one postbox, a planted suspect in Corey. But Ray is the only other person with a speaking part, and the game keeps nudging you at him. Plot hole: the abductor was in the flat long enough to set fire to a notebook, yet left the unlocked laptop with an `INVESTIGATION` folder and a corkboard with his company's sign pinned to it. Lena's fate gets one italic line in the epilogue. |
| Writing & voice | **7.5** | Thomas is human now ("I used to do this for a living. I'll look myself."). Maya's notebook voice is right. Ray is warm. **Okafor is not the bible's Okafor.** Her call reactions are long, formal and uncontracted ("That is not a name — but it is a man behaving like one with something to lose."), when she's meant to be blunt and tired. |
| Puzzle design | **8.5** | Frozen, and it deserves to be. A13, A12, C9 and C6 are the standouts. |
| Deduction & case board | **7.5** | Pin-and-test works, and "Needs 2" is clear. But all nine questions are printed from the first second, so they work as a spoiler list for the story's beats. |
| Information flow & sourcing | **8.0** | The briefing sources nearly everything. Left: "the forum" means pdxmissing.org, yet A2 is Reddit's r/PDXmissing with no line joining the two. A2 says "December" but its posts run December to February. "Three details in four months" covers ten weeks. |
| Reading load | **7.5** | Every briefing is ≤ 78 words. The heaviest work screens are A13, A3, C1 and A9. |
| Clue moments & feedback | **8.0** | The clue card is great. After it you land on the board with no word on what just opened. |
| Onboarding | **7.0** | Four short cards float over a dimmed board and point at nothing. |
| Tension & pacing | **6.5** | Each lead runs board → brief → Start → puzzle → clue card → board. After 28 of them that's a lot of ceremony. The clock is a number that goes down. Nothing in the sound or the room gets tenser as Thursday 04:40 gets closer. |
| Visual design & art | **7.0** | The cork board, polaroids and index cards hang together, and the prologue photos are good. The lead screens are a monoculture: Reddit, Twitter, WHOIS, the business registry and a court filing all look like one dark panel. B1/B11's "burned notebook" is white text on a black rectangle. |
| Audio | **4.5** | One real recording (the voicemail). No music at all. Every other sound is Web Audio noise or an oscillator, including the room beds (numpy noise). For a mood piece this is the biggest gap in the game. |
| UI & controls (desktop) | **7.5** | Consistent tool row, hint costs shown up front, Start focused. |
| Mobile experience | **7.5** | Nothing blocks. With the briefing open, the puzzle starts past halfway down the screen. |
| Accessibility | **7.0** | Keyboard phrase selection, dialogs and reduced motion are all there. The voicemail transcript is screen-reader-only: a player with the sound off never sees what Maya said. |
| Polish & bugs | **7.5** | No broken states. The continuity items above are the polish problem. |
| Endings & payoff | **7.0** | Seven endings, each with the time in large type. The climax is a form and a static transcript. "The Call" is the best-written thing in the late game, and it's presented as a log. |
| Replay value | **5.5** | Seven endings, but nothing tells you they exist or which ones you've found. |

### Overall: **7.4 / 10**

A good game with a great one inside it. The puzzles and the writing are
ready. The sound, the look of the sources, and the way the mystery is staged
are not.

---

## What it needs, ranked (presentation only; no puzzle, answer, hint or unlock changes)

### Story coherence (cheap, high value)
1. **Explain what the abductor left behind.** Her laptop was *locked*, and it
   logged three wrong passwords at 8:04 on Monday, twelve minutes after the
   voicemail. Thomas gets in first try because he knows her password. The
   smoke alarm was pulled down, so whoever was there left in a hurry. That
   makes the fact he left the laptop into a clue.
2. **Stop the cast list from pointing at Ray.** His opening line mentions the
   key and the WiFi, which is B11's clue. Replace it with something warm.
3. **Unfold the board's questions.** Each question stays sealed ("Something
   Maya was asking. Keep working this thread.") until its thread has earned
   it. Answers and pins are unchanged.
4. **Forum vs Reddit.** One sourced line in A2's brief, and fix A2's
   timestamp and the "four months" line.
5. **Okafor voice pass.** Contractions, shorter sentences, same meaning.

### Audio (biggest gap)
6. Recorded foley for every event: paper, pin into cork, stamp, phone buzz,
   page turns, keys (CC0).
7. A quiet score: piano and strings for the menu, prologue, investigation,
   convergence and endings.
8. Visible captions while the voicemail plays.

### Look of the sources
9. Give each lead's source the look of what it is: a Reddit thread, a
   Wayback capture of a Twitter profile, a WHOIS terminal, newsprint, a
   court docket, a state registry form.
10. The burned notebook: a charred page photograph, with the ink coming up
    out of the char as you adjust.
11. Stage the name reveal as its own full-screen moment.
12. Stage the call: it rings, connects, and plays line by line with
    Okafor's responses.

### Flow and replay
13. After the clue card: "This opened: X, Y" and a pulse on the new cards.
14. A tutorial that points at the thing it describes.
15. An endings tracker on the menu ("Endings found: 2 of 7").

---

## Don't lose
- The puzzles, the briefings' "from …" lines, the clue card, the prologue,
  the name-reveal writing, and "The Call" transcript replaying what you
  pinned.
