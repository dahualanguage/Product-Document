# Subject Teacher v2 — Engineering Handoff

## Live Demo
https://dahaiai-nwv4jcy4d-kiki-8655s-projects.vercel.app/specs/subject-teacher/demo-subject-teacher-v2.html

### Scenario Demos
- [Session Found](https://dahaiai-nwv4jcy4d-kiki-8655s-projects.vercel.app/specs/subject-teacher/demo-subject-teacher-v2.html#session-found) — Disconnected session recovery
- [Still Here?](https://dahaiai-nwv4jcy4d-kiki-8655s-projects.vercel.app/specs/subject-teacher/demo-subject-teacher-v2.html#still-here) — No-voice timeout countdown

## Product Overview

Subject Teacher enables content-class teachers (math, science) to run live transcription sessions for ESL students. The teacher speaks, the system transcribes in real-time, and students receive the text on their devices.

## Screens

| # | Screen | Description |
|---|--------|------------|
| 1 | **Classes** | Room-based class list with expandable student roster |
| 2 | **Mic Test** | Pre-class microphone validation with waveform feedback |
| 3 | **Live Class** | Real-time transcript with timer, pause/resume |
| 4 | **Save Class** | Post-session naming dialog |
| 5 | **History** | Broadcast history with class filter and status badges |

## Scenario Modals

| Modal | Trigger | Description |
|-------|---------|------------|
| **Session Found** | Teacher enters mic test with a previous disconnected session | Resume or start new |
| **Still Here?** | No voice input for extended period during live class | Countdown auto-end or confirm presence |

## Folder Structure

```
subject-teacher-handoff/
├── code/
│   └── demo-subject-teacher-v2.html    ← Full working demo (single HTML file)
├── design-specs/
│   ├── colors.md                       ← Color tokens
│   ├── typography.md                   ← Font family, type scale
│   └── spacing.md                      ← Layout, padding, radius, sizing
├── components/
│   └── component-map.md                ← All UI components with descriptions
├── logic/
│   └── interactions.md                 ← User flows, click actions, state changes
└── README.md                           ← This file
```

## Design System Reference
- [ESL Design System](https://dahaiai-nwv4jcy4d-kiki-8655s-projects.vercel.app/specs/design-system.html) — Shared tokens across all products
- [Product Spec](https://dahaiai-nwv4jcy4d-kiki-8655s-projects.vercel.app/specs/subject-teacher/subject-teacher.html) — Full feature specification

## Tech Notes
- **Font:** Public Sans (Google Fonts) — unified across all ESL products
- **Icons:** Google Material Icons Round (CDN)
- **No framework dependencies** — pure HTML/CSS/JS demo
- **All styles inline** — no external CSS files
