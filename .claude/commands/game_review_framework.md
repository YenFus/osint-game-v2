# 🎮 Game Analysis & Review Framework

A comprehensive list of dimensions (X) to critically analyze any game, plus a ready-to-use AI prompt.

---

## The Dimensions of Game Analysis (X)

### 1. 🎯 Game Design & Core Loop
- **Core gameplay loop** — Is the primary loop (action → reward → progression) satisfying and clear?
- **Mechanics depth** — Are mechanics simple to learn but deep enough to master?
- **Pacing** — Does the game maintain tension, variety, and momentum?
- **Player agency** — Do choices feel meaningful and consequential?
- **Difficulty curve** — Is the challenge progression smooth or are there spikes/dead zones?
- **Feedback systems** — Does the game clearly communicate success, failure, and progress?

---

### 2. 🎨 Visual Design & Art Direction
- **Art style consistency** — Is the visual language cohesive across all elements?
- **Color palette** — Are colors intentional, mood-appropriate, and harmonious?
- **Visual hierarchy** — Can the player instantly identify what's important on screen?
- **Lighting & atmosphere** — Does lighting reinforce mood and guide attention?
- **Animation quality** — Are animations smooth, purposeful, and polished?
- **Environmental storytelling** — Do visuals tell stories without words?

---

### 3. 🖥️ UI/UX Design
- **Usability & intuitiveness** — Can a new player navigate without a tutorial?
- **Information architecture** — Is information organized logically and accessibly?
- **Readability** — Are fonts, sizes, and contrast accessible and comfortable?
- **Responsiveness** — Does the UI feel snappy and reactive to input?
- **Consistency** — Do UI patterns (buttons, menus, icons) behave the same everywhere?
- **Accessibility** — Are there considerations for colorblind users, screen readers, scalable text?
- **Onboarding flow** — Does the game teach mechanics naturally through play?

---

### 4. 📖 Narrative & Storytelling
- **Story structure** — Does the narrative have a compelling arc (setup, conflict, resolution)?
- **Character development** — Are characters believable, relatable, and evolving?
- **Dialogue quality** — Is writing natural, engaging, and voice-consistent?
- **Narrative integration** — Is the story woven into gameplay or does it feel bolted on?
- **World-building** — Is the game world internally consistent and richly detailed?
- **Emotional resonance** — Does the narrative evoke genuine emotional responses?
- **Branching & consequences** — Do player decisions meaningfully alter the story?

---

### 5. 🔊 Audio & Sound Design
- **Music** — Does the soundtrack reinforce mood, setting, and pacing?
- **Sound effects** — Are SFX satisfying, contextual, and well-mixed?
- **Ambient audio** — Does the soundscape create immersion?
- **Voice acting** (if applicable) — Is it natural, well-directed, and well-recorded?
- **Audio feedback** — Do player actions have responsive audio cues?
- **Dynamic audio** — Does music/sound adapt to gameplay state?

---

### 6. ⚙️ Technical Quality
- **Performance** — Frame rate stability, load times, memory usage
- **Bug density** — Frequency and severity of bugs encountered
- **Code architecture** — Is the codebase maintainable, modular, and scalable?
- **Cross-platform compatibility** — Does it work across target platforms/browsers?
- **Save system** — Is progress saved reliably and logically?
- **Error handling** — Does the game recover gracefully from edge cases?

---

### 7. 🧠 Player Psychology & Engagement
- **Motivation design** — What drives the player to continue (curiosity, mastery, story)?
- **Flow state** — Does the game facilitate periods of deep engagement?
- **Reward systems** — Are rewards well-timed, varied, and satisfying?
- **Retention hooks** — What brings the player back for another session?
- **Cognitive load** — Is the game overwhelming or appropriately challenging?
- **Emotional journey** — Does the experience create memorable emotional peaks and valleys?

---

### 8. 🌍 Level & Environment Design
- **Spatial design** — Are environments navigable and purposeful?
- **Exploration incentives** — Is curiosity rewarded?
- **Variety** — Do environments feel distinct and avoid monotony?
- **Interactive elements** — Are objects in the world interactive and meaningful?
- **Landmark design** — Can players orient themselves through visual landmarks?

---

### 9. 🔄 Systems Design & Balance
- **Economy balance** — Are in-game currencies/resources balanced?
- **Progression systems** — Does leveling/unlocking feel fair and motivating?
- **Interconnected systems** — Do game systems interact in interesting ways?
- **Exploit potential** — Are there obvious balance-breaking strategies?

---

### 10. 📦 Polish & Juice
- **Screen shake, particles, effects** — Do actions feel impactful?
- **Transitions** — Are scene/state transitions smooth?
- **Edge cases** — What happens at the boundaries of intended play?
- **First 5 minutes** — Does the opening hook the player immediately?
- **Attention to detail** — Are there delightful micro-details that reward observation?

---

### 11. 🚀 Market & Product Readiness
- **Target audience clarity** — Is it clear who this game is for?
- **Unique selling proposition** — What makes this game stand out?
- **Completeness** — Does it feel like a finished product or a prototype?
- **Monetization** (if applicable) — Is the model fair and well-integrated?
- **Discoverability** — Is the game's concept easy to communicate (elevator pitch)?

---

## 🔥 The Master Prompt

Copy and customize this prompt for your AI-assisted game review:

```
You are a senior game design critic, technical reviewer, and UX expert with 20+ years of experience shipping award-winning indie and AAA titles. Your job is to be my CRITICAL EYE — honest, constructive, and unsparing.

Analyze the current state of my game and provide a detailed, structured report covering EVERY dimension below. For each dimension, provide:
1. **Current Status** (🟢 Strong | 🟡 Needs Work | 🔴 Critical Issue)
2. **What's Working** — Specific things done well
3. **Issues Found** — Concrete problems with examples
4. **Priority Recommendations** — Ranked actionable improvements
5. **Industry Benchmark** — How this compares to similar published games

## Dimensions to Analyze:

### 1. Game Design & Core Loop
Evaluate the core gameplay loop, mechanics depth, pacing, player agency, difficulty curve, and feedback systems.

### 2. Visual Design & Art Direction
Assess art style consistency, color palette, visual hierarchy, lighting/atmosphere, animation quality, and environmental storytelling.

### 3. UI/UX Design
Review usability, information architecture, readability, responsiveness, consistency, accessibility (WCAG compliance), and onboarding flow.

### 4. Narrative & Storytelling
Critique story structure, character development, dialogue quality, narrative-gameplay integration, world-building, emotional resonance, and branching consequences.

### 5. Audio & Sound Design
Evaluate music, sound effects, ambient audio, voice acting (if present), audio feedback, and dynamic audio systems.

### 6. Technical Quality
Assess performance, bug density, code architecture, cross-platform compatibility, save systems, and error handling.

### 7. Player Psychology & Engagement
Analyze motivation design, flow state facilitation, reward systems, retention hooks, cognitive load management, and emotional journey.

### 8. Level & Environment Design
Review spatial design, exploration incentives, environmental variety, interactive elements, and landmark/wayfinding design.

### 9. Systems Design & Balance
Evaluate economy balance, progression systems, system interconnections, and exploit potential.

### 10. Polish & Juice
Assess screen effects, transitions, edge case handling, the first 5 minutes experience, and attention to detail.

### 11. Market & Product Readiness
Evaluate target audience clarity, unique selling proposition, completeness, and discoverability.

## Output Format:

Start with an **Executive Summary** (3-4 sentences on overall impression and top 3 priorities).

Then provide the detailed analysis per dimension.

End with a **Priority Action Plan** — a ranked list of the top 10 things to fix/improve next, ordered by impact.

Be brutally honest. I need a critic, not a cheerleader. Back every claim with specific evidence from the game. If something is mediocre, say so. If something is excellent, celebrate it. Do not hedge or soften — I need clarity to ship a great game.
```

---

## 🎯 Focused Variants

Use these shorter prompts when you want to zoom into a specific area:

### Quick UX Audit
```
Act as a UX expert. Audit my game's interface for: usability issues, accessibility gaps, information hierarchy problems, and interaction friction. Provide specific fixes ranked by severity.
```

### Narrative Deep-Dive
```
Act as a narrative designer. Analyze my game's story for: plot holes, pacing issues, character consistency, dialogue quality, and emotional impact. Rate each story beat's effectiveness.
```

### Technical Health Check
```
Act as a senior game developer. Review the codebase for: architecture issues, performance bottlenecks, maintainability concerns, and technical debt. Provide a refactoring priority list.
```

### First Impression Test
```
Act as a first-time player who has never seen this game. Document your experience minute-by-minute for the first 10 minutes. Note every moment of confusion, delight, frustration, or boredom. Be specific about what you clicked, what you expected, and what actually happened.
```

### Ship Readiness Assessment
```
Act as a game publisher evaluating this for release. Score the game 1-10 on: polish, market fit, completeness, uniqueness, and audience appeal. Would you greenlight this for launch? Why or why not?
```
