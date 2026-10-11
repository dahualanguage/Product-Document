---
name: word-game-design
description: Build kids' gamified Chinese-learning student UI in the DAHUA AI "Word Game" visual style — rounded Fredoka + Nunito type, a brand-green candy palette (green primary; gold stars, coral hearts/urgent, purple bonus), chunky frosted 20px cards with a soft "toy-press" 3D feel, and springy overshoot motion. Use when creating or editing student-facing game, dashboard, home, word-bank, assignment, leaderboard, or practice screens/components/prototypes for the DAHUA AI Chinese Modules product, or when a request asks for this playful storybook-quest look. Provides ready-to-paste design tokens (tokens.css), component recipes (components.css), and two canonical live references.
---

# Word Game Design System

The playful, storybook-quest visual language for the DAHUA AI student experience (kids learning Chinese). This skill lets you generate or edit UI that matches the product exactly — same fonts, palette, radii, components, and motion.

## When to use

- Building or editing **student-facing** screens/components for the Chinese Modules product: Home, Word Game, Word Bank, Assignment List, Leaderboard, History, Mail Box, practice/quiz flows.
- Creating a high-fidelity **prototype** in this style.
- Any request for a "kids' game", "storybook", "playful rounded" look for this product.

Do **not** use this for the neutral teacher/admin spec pages (those use the separate `specs/design-system.html` / Public Sans system).

## Aesthetic direction — three rules

1. **Rounded & chunky.** One `20px` radius for every card & panel (rows 16px, buttons 14px, chips 8px). Thick inner borders (`inset 0 0 0 1.5–2px`) and a pressed `inset 0 -3px 0 rgba(0,0,0,.16)` bottom on every filled control give a soft, tactile 3D "toy" feel.
2. **Green-first, candy accents.** Brand green dominates and is the default for anything core/required/primary. Accents are **semantic triggers, not decoration** — each maps to one meaning and stays low-frequency:

   | Accent | Use it ONLY for | Never for |
   |---|---|---|
   | **Green** `--green` | core, required, primary actions, progress/mastery, active nav | — (this is the default) |
   | **Gold** `--gold` | stars, rewards, achievements | ordinary emphasis |
   | **Coral** `--coral` | hearts, urgent/overdue, unread badges | generic "important" |
   | **Purple** `--purple` | **optional / bonus / New Challenge / Multiple-Choice type** | core progress, primary buttons, headings, decoration |

   If a thing is not literally optional/bonus/challenge/MC, it is **not** purple — it is green. On a typical screen purple shows up in only one or two places (the Optional block, a Challenge entry, MC tags).
3. **Frosted over scene.** Content sits on translucent white panels (`rgba(255,255,255,.95)` + `backdrop-filter:blur`) floating above an illustrated landscape background.

## Typography

- **Fredoka** (`--font-d`) — display: headings, panel titles, numbers, button labels, mode/task titles. Weights 400–700.
- **Nunito** (`--font-b`) — body: paragraphs, labels, chips. Weights 400–900.
- Load both from Google Fonts (see `references/tokens.css` header).
- Chinese subtitles use the system CJK fallback at a lighter weight (`.zh`, weight 400, `--ink-soft`).

Never substitute Inter / Roboto / system-ui as the primary face — the rounded character is the brand.

## How to build

1. Paste the font `<link>` and `:root` block from **`references/tokens.css`** into your page.
2. Pull the component recipes you need from **`references/components.css`** (panel, qrow, due-hero, mode-row, tags/chips, buttons, sidebar nav/stat, coach, toast).
3. Follow the layout shell below. Keep radii, the toy-press shadow, and the green-first rule intact.

## Core tokens (quick reference — full set in tokens.css)

| Token | Value | Role |
|---|---|---|
| `--green` / `--green-d` / `--green-l` | `#12A150` / `#0B7A3B` / `#DCF7E6` | primary / text / soft bg |
| `--gold` `--coral` `--purple` | `#FFC219` `#FF5A6E` `#7C3AED` | stars / hearts·urgent / bonus |
| `--ink` / `--ink-soft` / `--line` | `#243B2E` / `#5B7266` / `#E4EDE7` | text / subtext / borders |
| `--shell` / `--paper` | `#EAF3EC` / `#FFFFFF` | app bg / cards |
| radius | card `20` · row `16` · btn `14` · chip `8` | unified scale |
| toy-press | `inset 0 -3px 0 rgba(0,0,0,.16)` | all filled controls |

### Practice-type colors (fixed — reuse everywhere the type appears)

| Type | bg / text | icon |
|---|---|---|
| Q&A | `#E6F0FF` / `#2563EB` | 💬 |
| Mirroring | `#FFEDE0` / `#EA7A21` | 🎤 |
| Vocabulary | `#E9F9EE` / `#0B7A3B` | 📚 |
| Multiple Choice | `#F0E9FF` / `#7C3AED` | ✅ |

## Layout shell

- App: `display:grid; grid-template-columns:262px 1fr; height:100vh; padding:16px; gap:16px;` on `--shell`.
- **Sidebar** (`262px`, white, radius 20, floating): brand row → nav items (`.navitem`, active = green) → spacer → stat cards (`.stat.gold` Stars, `.stat.coral` Hearts). Unread badges via `.nb`.
- **Stage** (radius 20, `overflow:hidden`): holds each screen; the game/home screen carries a full-bleed illustrated background with frosted panels on top.
- **Dashboard grid** is **tasks-first**: `grid-template-columns:1.35fr 1fr` — left = deadlines (nearest as a `.due-hero` + `.qrow` list), right rail = optional quests + free-practice launch rows.
- Mascot **Douhua** (豆花, tabby cat, GIFs in `/assets/game/moscot/`) greets in the `.coach` strip and illustrates mode rows. The coach strip doubles as the Home header.

## Motion

Springy, never linear. Entrances use `pop`/`slide` with overshoot `cubic-bezier(.34,1.56,.64,1)`; stagger lists with `animation-delay:{i*50}ms`. Hover lifts `translateY(-3~8px)` + soft shadow; mascots `scale(1.08) rotate(-3deg)`. Idle heroes may breathe (`floaty` ±7px) and stars `twinkle`.

## Canonical references (in this repo)

- **Live design system:** `specs/chinese-modules/student-game-design-system.html` — visual spec of every token & component.
- **Working example:** `specs/chinese-modules/student-redesign.html` — the full interactive Home dashboard + Assignments built in this style.

Open these to see the exact intended result before generating new screens.

## Do / Don't

- ✅ One 20px card radius everywhere; small tiers only for rows/buttons/chips.
- ✅ Give every filled button/tile the toy-press inset shadow.
- ✅ Keep stats in the sidebar; don't duplicate ⭐/❤️ in headers or coach.
- ✅ Default everything to **green**; reach for an accent only when its exact meaning applies (see the accent table above).
- ❌ **Purple is reserved for optional / bonus / New Challenge / Multiple-Choice only.** Never purple for core progress, primary buttons, section headers, or "just to add color" — use green.
- ❌ No purple-on-white generic gradients, no Inter/Roboto, no flat sharp corners.
- ❌ Don't add accents (gold/coral/purple) decoratively — only when they mean something.
