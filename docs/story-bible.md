# Story bible — *What Maya Knew*

The single source of truth for dates, facts and voices. When a lead, a clue or
a line of dialogue disagrees with this file, the lead is wrong.

Written 2026-09-21 after a full playthrough where the player said the puzzles
were great and the *information* was not: facts arrived with no visible source,
dates disagreed with each other, and every character sounded like the same
careful machine.

---

## 1. Rules

1. **Every fact the player is asked to use must visibly come from somewhere.**
   A lead that relies on a fact from an earlier lead says so on screen, with
   the source: *"From Maya's `lena_timeline.txt`"*. Threads can be played in any
   order, so a lead must never lean on something only another thread shows.
2. **Plain English.** Contractions. Short common words. One idea per sentence.
   If a clue or a question needs a hint just to be *understood*, it is broken.
   The puzzle is working out what the evidence means, never decoding the prose.
3. **Wording changes; logic does not.** Answers, required pairs, unlock order
   and which clue fills which slot are fixed. Puzzle-bearing text (A2's posts,
   the diff lines being compared, accepted answers) stays word for word.
4. **The surname gate holds.** "Callahan" stays out of anything reachable in the
   first hour. The unit tests enforce it.

---

## 2. People and voices

**Thomas Reyes** — the player. 58. Retired crime reporter, 23 years at a Portland
paper. Widower (his wife **Carmen** died when Maya was a teenager).
*Voice:* the way a good reporter talks when he's frightened and holding it
together. Short, exact sentences. Contractions. Concrete nouns, few adjectives,
no stacked metaphors. Dry, sometimes funny in a tired way. He notices details
because it was his job. He talks to Maya in his head now and then. He is **not**
a hardboiled detective — no "the rain fell like…", no aphorisms, no noir poses.
> ✗ "Maya is never late twice."  ✓ "Maya's never late. Not once, not for me."

**Maya Reyes** — 24. Sociology grad student at Millhaven University; thesis on
online surveillance. Funny, stubborn, a bit cocky, loves her dad and teases him.
*Voice in her notes:* how a 24-year-old writes to herself — fragments, lowercase
when she's rushing, arrows, "ok so", question marks, the odd swear word softened.
Sharp, not polished. Her private notebook never reads like an essay.
> ✗ "He's performing concern. The information is wrong in the wrong places."
> ✓ "he acts worried. fine. but he knows stuff NOBODY posted. how??"

**Ray** — 61. Thomas's best friend for thirty years, Maya's godfather. Owns a
small photography business in Millhaven. Warm, a bit folksy, big-hearted, dad
jokes, remembers birthdays. Calls Thomas "Tom" or "buddy". Texts like a man in
his sixties: full sentences, occasional "..." and no emoji except a thumbs-up.
**He must be likeable.** Nothing he says before the reveal may read as sinister.
The horror is that he is exactly as kind as he seems *and* he did this.

**Det. Dana Okafor** — Millhaven PD. Blunt, tired, fair. Short plain sentences.
Never cruel. Tells Thomas exactly what a piece of evidence is and isn't worth.

**stillwater_m** — Ray's forum persona. Sounds like a concerned local. Polite,
helpful, a little too well informed. (Puzzle text — edit with care.)

**Lena Vasquez** — 29. Painter; taught a studio class at Millhaven University on
Tuesdays and Thursdays. Lived in Portland near the waterfront. Posted as
**@velvet.echo**. Flatmate **Priya Raman**.

**Corey Marsh** — Lena's ex. Works at an auto body shop in Tigard. Innocent. The
forum decided he did it because stillwater_m kept saying so.

**Owen Pryce** — ran the Millhaven Arts Collective. Refused to give the paper
his guest list. Not involved.

**Rosa Velasquez** — reporter, *Pacific Reporter*, digital-safety beat.

---

## 3. Canonical timeline

**2024 (last year) — Lena**
| Date | What happened | First shown to the player |
|---|---|---|
| Fri Apr 12, 5:40pm | Lena leaves her studio | `lena_timeline.txt` (A1) |
| Fri Apr 12, evening | Forum later claims someone watched her street that night; blames Corey | `c_marsh_crossref.txt` (A1) |
| Fri Apr 12, 7:52pm | stillwater_m photographs the waterfront two streets from her flat | A4 (his Flickr GPS) |
| Fri Apr 12, 11:10pm | Her phone goes quiet at the flat | `lena_timeline.txt` |
| Sat Apr 13, 6:38pm | stillwater_m photographs Alder Hall from outside | A4 |
| Sat Apr 13, 6:41pm | Lena's last post, from the hall doorway | `lena_timeline.txt`, C1 |
| Sat Apr 13, 7:00pm | Doors open, Millhaven Arts Night, Alder Hall | programme (C9) |
| Sat Apr 13, 7:45pm | Lena's artist talk, main hall | programme (C9), `lena_timeline.txt` |
| Sat Apr 13, 7:47pm | His kit photographed alone in the empty side gallery | C2 / C9 |
| Sat Apr 13, 8:11pm | stillwater_m photograph from inside the hall | A4 |
| Sat Apr 13, 10:00pm | Hall closes. Nobody saw her leave | `lena_timeline.txt` |
| Mon Apr 15 | Priya reports her missing. *Courier* piece prints | C4 |
| Tue Apr 16 | Priya's statement to police (never released) | B4 |
| Thu Apr 18 | Police press release | B2 |
| May | stillwater_m joins the PDXmissing forum | `NOTES_DO_NOT_DELETE.txt` (A1) |
| Sep 2 | Archive snapshots: WHOIS still open (**R. Callahan**) and his Twitter | A6, A12 |
| Mon Nov 4 | Maya finds the forum and posts her first question | B1, A12 |
| Sat Nov 9 | Privacy shield switched on; **@nightwatch_rc** created the same day | A7, A9, A12 |
| Thu Nov 14 | Second archive snapshots (WHOIS shielded; Twitter cleaned) | A6, A12 |
| Wed Nov 20 | Wayback copy of stillwater-media.net (author tag still in it) | B7 |
| Dec | Forum posts Dec 6, 8, 15, 22 | A2, B2, B4 |

**2025 (this year) — Maya**
| Date | What happened | First shown |
|---|---|---|
| Feb 1–3 | Maya's username scan; Twitter gone Feb 2, Flickr locked Feb 3 | A3 |
| Feb 19 | Notebook: "He has a key to Dad's house" | B11 |
| Sun Mar 2 | Ray at Thomas's for dinner; Maya watches him | B11 (Mar 7 note) |
| Thu Mar 6 | Maya emails Rosa | B12 |
| Sun Mar 9, 11:47pm | The unsent draft to Dad | B12 |
| **Mon Mar 10, 7:52am** | Maya's voicemail. Someone at the door. Taken. | Prologue |
| Mon Mar 10, 8:04am | Three wrong passwords on her laptop. He set fire to her notebook, pulled the smoke alarm down and left in a hurry, leaving the laptop (locked, and traceable) and the board | Apartment, A1 brief |
| Tue Mar 11, 8:20pm | Maya doesn't show for dinner | Prologue |
| Wed Mar 12, morning | Police take a report and shrug | Prologue |
| Wed Mar 12, 12:04pm | Ray calls | Prologue |
| Wed Mar 12, 6:30pm | Thomas lets himself into her flat | Prologue |
| **Wed Mar 12, 6:40pm** | **The game clock starts.** She's been gone 58h 48m | Board |

Case number **2025-0310** is the date she was taken.
