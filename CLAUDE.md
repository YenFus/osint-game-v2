# Project: What Maya Knew — OSINT Noir Web Game

## Story
A father investigates his missing daughter Maya's secret investigation into a missing stranger (Lena).
Three non-linear paths. Same killer (Ray — family friend). Full noir. Online safety theme.

## Developer Style
- Visual and iterative — build in chunks, test after each
- Browser testing with Playwright after every change
- No TODOs, always complete code
- Visual feedback = top priority

## Run: npm run dev → localhost:5173
## Test: Use Playwright to open localhost:5173

## Stack
- React + Vite + Tailwind CSS v4
- Zustand for game state (src/store/gameStore.js)
- No router — phase-based rendering in App.jsx

## Structure
- src/pages/       — IntroPage, ApartmentPage, InvestigationPage, ConvergencePage, EndingPage
- src/components/  — Notifications, DocumentReader, OSINTTool, SuspectBoard
- src/store/       — gameStore.js (Zustand)
- src/data/        — gameData.js (all story content, nodes, characters)

## Game Phases
intro → apartment → investigation (paths A/B/C) → convergence → ending

## Visual Identity
- Dark noir: bg #0a0a0f, text #c8c0b0
- Fonts: Share Tech Mono, Crimson Pro, Barlow Condensed
- Red accent: #c0392b
- CRT scanline overlay (.crt class)
- All tools simulated — no real OSINT required

## After Every Change
- Game loads without console errors
- Current phase renders correctly
- No visual glitches
- Notifications appear and auto-dismiss
