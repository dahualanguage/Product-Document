# Colors — Spelling Practice

> Two demo variants exist: **EN** (English, `demo-spelling.html`) and **ES** (Spanish, `demo-spelling-es.html`). Differences are noted with **(ES only)**.

## Primary Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Green 600 | `#059669` | Submit hover, active sidebar icon, preview word |
| Green 500 | `#10b981` | Submit button (EN), progress bar (EN), audio icon fill, input focus border (EN), correct state (EN), blank underline |
| Green 400 | `#22C55E` | **(ES)** Gradient button end, correct input border, setup start text |
| Green 300 | `#34d399` | Progress bar gradient end (EN) |
| Green 200 | `#a7f3d0` | Audio button border, preview play border |
| Green 100 | `#ecfdf5` | Audio button bg, preview play bg, active sidebar bg |
| Green 50 | `#f0fdf4` | Correct input bg, selected option card bg |
| Green Dark | `#065f46` | Audio button text |
| Green Bright | `#77ED8B` | **(ES)** Gradient button start, progress bar gradient start |

## Accent — ES variant

| Token | Hex | Usage |
|-------|-----|-------|
| Cyan 500 | `#00B8D9` | **(ES)** Header badge text, hint first-letter text/strong |
| Cyan 50 | `#E6F9FC` | **(ES)** Header badge bg, preview badge bg |

## Neutral Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Slate 900 | `#0f172a` | Headings, stat numbers, input text |
| Slate 700 | `#334155` | Definition/sentence text, option card text |
| Slate 600 | `#475569` | Feedback answer text, cancel hover |
| Slate 500 | `#64748b` | Back button, stat labels, timer text |
| Slate 400 | `#94a3b8` | Muted text (counter, labels, subtitle), sidebar icons |
| Slate 300 | `#cbd5e1` | Disabled button bg, stat dot gray, pill arrow |
| Slate 200 | `#e2e8f0` | Borders (cards, inputs, dividers, progress bg), context sentence left border |
| Slate 100 | `#f1f5f9` | Sidebar hover, preview item border |
| Slate 50 | `#f8fafc` | Definition bg, context sentence bg |
| Header border | `#C4CDD5` | App header bottom border |

## Content Background

| Element | Hex |
|---------|-----|
| Body / App Frame | `#fff` |
| Content area (`.app-content`) | `#EFF5FF` |
| Question card | `#fff` |
| Definition block (EN) | `#f8fafc` with `3px left border #10b981` |
| Context sentence (ES) | `#f8fafc` with `3px left border #e2e8f0` |

## Feedback States

| State | Background | Border | Text |
|-------|-----------|--------|------|
| Correct | `#f0fdf4` | `#86efac` | `#166534` |
| Wrong | `#fef2f2` | `#fca5a5` | `#991b1b` |
| Correct input | `#f0fdf4` border `#10b981` (EN) / `#22C55E` (ES) | — | `#166534` |
| Wrong input | `#fef2f2` border `#ef4444` | — | `#991b1b` |

## Hint Colors

| Hint | Background | Border | Text | Strong |
|------|-----------|--------|------|--------|
| First letter — EN | `#eff6ff` | `#bfdbfe` | `#2563eb` | `#1e40af` |
| First letter — ES | none | none | `#00B8D9` | `#00B8D9` |
| Pattern (purple) | `#f5f3ff` | `#ddd6fe` | `#7c3aed` | `#5b21b6` |

## Header / Preview Badge

| Element | Background | Text |
|---------|-----------|------|
| Mode badge (EN) | `#dbeafe` | `#1e40af` |
| Mode badge (ES) | `#E6F9FC` | `#00B8D9` |
| Preview badge (EN) | `#ecfdf5` | `#059669` |
| Preview badge (ES) | `#E6F9FC` | `#00B8D9` |

## Timer (ES only)

| State | Color |
|-------|-------|
| Normal | `#64748b` (stroke + text) |
| Warning (≤10s) | `#ef4444` (stroke + text) |

## Button Gradients (ES only)

| Element | Gradient |
|---------|----------|
| Submit / Next (correct) | `linear-gradient(135deg, #77ED8B, #22C55E)` |
| Submit hover | `linear-gradient(135deg, #5FE077, #1aab4e)` |
| Completion "Practice Again" | `linear-gradient(135deg, #77ED8B, #22C55E)` |
