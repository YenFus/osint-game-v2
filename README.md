# What Maya Knew

A noir mystery game where you play as a father using real OSINT (Open Source Intelligence) techniques to investigate your missing daughter's secret case.

**Play it now:** [https://yenfus.github.io/osint-game-v2/](https://yenfus.github.io/osint-game-v2/)

---

## What Is This Game?

You are Thomas. Your daughter Maya has gone missing. While searching her apartment, you discover she was secretly investigating a stranger's disappearance — and the trail leads somewhere dangerous.

Explore three non-linear investigation paths. Use simulated OSINT tools — social media searches, public records, digital breadcrumbs — to uncover the truth. No real investigation skills required; everything is guided within the game.

**Theme:** Online safety, digital footprints, and what we leave behind.

---

## How to Play

- Click **New Game** to start, read Thomas's diary, then step into Maya's apartment
- Open the **case board**: leads from Maya's laptop, burned notebook and corkboard are pinned in three columns
- Work a lead (files, posts, photo metadata, public records…) and it drops a **clue** into your drawer
- Pin clues to the questions on the board — right answers stick, wrong ones cost time
- Maya has been missing for 59 hours and the clock keeps running. Hints and mistakes cost time; Ray Callahan will be texting you
- Pencil a clue under each of a thread's three questions, then test the theory — the board only tells you how many pins hold
- Close two threads (and find what Maya wrote) to open **The Suspect**: name who took her, choose three clues for the police, and make the call
- Ray says he leaves town before dawn on Thursday. The more nervous you make him, the sooner he goes
- Twelve endings, decided by the case you build, the time you take, and what you say to Ray

---

## Saving Your Progress

Your progress **saves automatically in your browser** as you play. You do not need to do anything.

A few things to know:

- **3 save slots** are available — use the Save/Load button in-game to manage them
- Saves are stored in your browser, not on any server
- **If you clear your browser history or cache, your saves will be deleted**
- Saves do not transfer between devices — a save on your laptop won't appear on your phone
- If you share a computer with others, you all share the same 3 save slots

---

## Running Locally (For Developers)

```bash
git clone https://github.com/YenFus/osint-game.git
cd osint-game
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

To build for production:
```bash
npm run build
```

---

## Tech Stack

React 19 + Vite + Zustand + Tailwind CSS v4, deployed to GitHub Pages.

---

## Copyright

© 2025 Mohit Sarode. All rights reserved.

This game and all its content — source code, story, characters, and design — are proprietary. The repository is public for transparency and to accept bug reports, but copying, redistribution, or derivative use is not permitted without written permission. See [LICENSE](./LICENSE) for details.
