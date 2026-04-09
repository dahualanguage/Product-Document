# Spelling Practice — Engineering Handoff

## Overview

Spelling Practice is a practice module within the ESL Student Word Bank app. Students hear a word's pronunciation and must type the correct spelling. A progressive hint system assists on wrong attempts.

Two demo variants are included:
- **EN** (`demo-spelling.html`) — prompt is a **definition**; 2-tier hints; no timer
- **ES** (`demo-spelling-es.html`) — prompt is a **context sentence with blank**; 3-tier hints; 60s countdown timer per word

## Flow

```
Word Bank Homepage → Spelling Practice
  1. Setup Page      — choose word category + session duration
  2. Vocab Preview   — preview selected words (word + translation + audio)
  3. Practice Loop   — hear/read prompt → type answer → check → hints if wrong
  4. Completion       — score summary (correct / wrong / accuracy %)
```

## Screens

| # | Screen | Location |
|---|--------|----------|
| 1 | Practice Setup | `.setup-page` — category + duration picker |
| 2 | Quick Vocab Preview | `.preview-page` — word list with audio preview |
| 3 | Question Card (main practice) | `.practice-area` → `.q-card` |
| 4 | Completion | Dynamically replaces `.practice-area` innerHTML |

## Key Design Decisions

- **EN prompt = definition only** — forces recall from meaning, no example sentence visible
- **ES prompt = context sentence with blank** — fill-in-the-blank style
- **Auto-play audio** on each new word; manual replay via "Play word" button
- **Hint system** — EN: 2-tier (first letter → pattern). ES: 3-tier (audio → first letter → pattern)
- **Timer (ES only)** — 60s per word, turns red at ≤10s, auto-fails on timeout
- **Scoring** — first-try correct = Correct; any hints needed = Wrong
- **Web Speech API** — uses `SpeechSynthesis` for TTS; production should use a dedicated audio service

## EN vs ES Differences at a Glance

| Feature | EN | ES |
|---------|----|----|
| Prompt | Definition block | Context sentence with blank |
| Audio hint | Always visible | Hidden → revealed on 1st wrong |
| Hint tiers | 2 (letter → pattern) | 3 (audio → letter → pattern) |
| Timer | None | 60s per word |
| Bottom stats bar | Yes | No |
| Feedback panel | Slide-in card | Submit button text changes |
| Button style | Flat green | Gradient green |
| Preview pagination | None | 5 per page |
| Duration → word count | N/A | `{ 3: 6, 5: 10, 10: 15, 15: 20 }` |

## Quick Start

Open `code/demo-spelling.html` (EN) or `code/demo-spelling-es.html` (ES) in a browser. Both auto-skip to the Vocab Preview page for demo purposes.

## Folder Structure

```
spelling-handoff/
├── README.md                    ← You are here
├── code/                        ← Complete demo source
│   ├── demo-spelling.html       ← EN variant (definition-based)
│   ├── demo-spelling-es.html    ← ES variant (sentence-based + timer)
│   └── assets/
│       └── dh_single.png        ← App logo
├── design-specs/
│   ├── colors.md                ← Full color palette (EN + ES differences)
│   ├── typography.md            ← Font stack, type scale
│   └── spacing.md               ← All spacing values by component
├── components/
│   └── component-map.md         ← Component hierarchy, CSS classes, visibility toggles
└── logic/
    └── interactions.md          ← Screen flow, hint progression, scoring, timer, data model
```

## For Engineers

1. **Start here** → read this README for the big picture
2. **Open the demos** → `code/demo-spelling.html` and `code/demo-spelling-es.html` in browser
3. **Component structure** → `components/component-map.md` for the full hierarchy and CSS class map
4. **Interaction logic** → `logic/interactions.md` for state machines, hint tiers, scoring, timer
5. **Visual specs** → `design-specs/` for exact colors, typography, and spacing values

All CSS is inline in the HTML files — no external stylesheets. The demo is a static HTML prototype; all state is managed via vanilla JS closure variables.
