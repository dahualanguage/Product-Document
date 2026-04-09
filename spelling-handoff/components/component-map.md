# Component Map — Spelling Practice

> Two variants: **EN** (`demo-spelling.html`) and **ES** (`demo-spelling-es.html`).
> Differences are noted below.

## Component Hierarchy

```
AppFrame (.app-frame)
├── Sidebar (.app-sidebar)
│   ├── SidebarLogo (.sidebar-logo)
│   └── SidebarItem (.sidebar-item) × 3
│       └── icon (svg) + label (span)
│
└── MainArea (.app-main)
    ├── Header (.app-header)
    │   ├── BackButton (.back-btn)
    │   ├── HeaderDivider (.header-divider)
    │   ├── HeaderTitle (.app-header-title)
    │   └── HeaderBadge (.header-badge)        ← hidden until practice starts
    │
    ├── ProgressBar (.progress-bar-wrap)        ← hidden until practice starts
    │   └── ProgressBarFill (.progress-bar-fill)
    │
    └── ContentArea (.app-content)
        ├── SetupPage (.setup-page)
        ├── PreviewPage (.preview-page)
        ├── PracticePage (.practice-area)
        └── BottomStats (.bottom-stats)         ← EN only, hidden until practice starts
```

---

## 1 — SetupPage

**Container:** `.setup-page` → `.setup-card`

| Component | Class | Props / State |
|-----------|-------|---------------|
| SetupHeader | `.setup-header` | title "Practice Spelling" |
| SetupBody | `.setup-body` | — |
| CategoryGrid | `.option-grid` | 4 × `.option-card` |
| OptionCard | `.option-card` | `data-cat`, `.selected` toggle |
| CountGrid | `.count-grid` | 4 × `.count-card` |
| CountCard | `.count-card` | `data-count`, `.selected` toggle. ES shows "mins · N words" |
| SetupFooter | `.setup-footer` | Cancel + Next → buttons |

**State:** `setupState = { category, count }`

---

## 2 — PreviewPage

**Container:** `.preview-page` → `.preview-card`

| Component | Class | Props / State |
|-----------|-------|---------------|
| PreviewHeader | `.preview-header` | title, badge (word count), subtitle |
| PreviewList | `.preview-list` | dynamically populated |
| PreviewItem | `.preview-item` | word (green), translation, play button |
| PreviewPlay | `.preview-play` | circular 28px, triggers `speakWord()` |
| PreviewPagination | `.preview-pagination` | **(ES only)** prev/next + page buttons, 5 per page |
| PreviewFooter | `.preview-footer` | Back + Start buttons |

**EN Back** → returns to setup page
**ES Back** → navigates to Word Bank page (`demo-word-bank-es.html`)

---

## 3 — PracticePage (Question Card)

**Container:** `.practice-area` → `.q-card`

| Component | Class | ID | EN | ES |
|-----------|-------|----|----|----|
| QuestionCounter | `.q-counter` | `q-current` | "Question **3** of **10**" | Same + Timer |
| Timer | `.q-timer` | `q-timer` | — | 60s countdown, `.warning` at ≤10s |
| AudioPlayButton | `.hint-play` | `hint-play-btn` | Always visible | Inside `.hint-section`, revealed on 1st wrong |
| HintSection | `.hint-section` | `hint-section` | — | Wrapper, `.revealed` on 1st wrong |
| DefinitionBlock | `.word-def` | `word-def-text` | Definition text + label | — |
| ContextSentence | `.context-sentence` | — | — | Sentence with `<span class="blank">` |
| HintFirstLetter | `.hint-letter` | `hint-letter` | `.revealed` on 1st wrong | `.revealed` on 2nd wrong |
| HintPattern | `.hint-pattern` | `hint-pattern` | `.revealed` on 2nd wrong | `.revealed` on 3rd wrong |
| InputArea | `.input-area` | — | Label + input row | Same |
| SpellInput | `.spell-input` | `spell-input` | `.correct` / `.wrong` states | Same |
| SubmitButton | `.submit-btn` | `submit-btn` | Flat green | Gradient green |
| FeedbackBox | `.feedback` | `feedback` | `.show` + `.correct` / `.wrong` | Not used (submit btn changes text) |
| NextButton | `.next-btn` | `next-btn` | Inside feedback box | Not visible (submit btn acts as next) |

---

## 4 — BottomStats (EN only)

**Container:** `.bottom-stats`

| Component | Class | ID |
|-----------|-------|----|
| StatCorrect | `.stat-item` + `.stat-dot.green` | `stat-correct` |
| StatWrong | `.stat-item` + `.stat-dot.red` | `stat-wrong` |
| StatRemaining | `.stat-item` + `.stat-dot.gray` | `stat-remaining` |

---

## 5 — CompletionScreen (dynamically injected)

Replaces `.practice-area` innerHTML on completion. Inline styles, no reusable classes.

| Element | Content |
|---------|---------|
| Emoji | 🎉 |
| Title | "Practice Complete!" (20px, 800 weight) |
| Subtitle | "You finished all N words" |
| ScoreRow | Correct (green) / Wrong (red) / Accuracy % |
| Actions | "Back to Word Bank" (gray) + "Practice Again" (green / gradient) |

---

## Input State Classes

| Class | When Applied |
|-------|-------------|
| `.spell-input` (default) | Fresh / reset |
| `.spell-input.correct` | Correct answer submitted |
| `.spell-input.wrong` | Wrong answer — flashes 800ms on 1st/2nd wrong; stays on 3rd wrong/timeout |

## Visibility Toggles

| Element | Show | Hide |
|---------|------|------|
| `.setup-page` | default | `.hidden` class |
| `.preview-page` | `.visible` class | default (`display:none`) |
| `#practice-page` | `style.display = ''` | `style.display = 'none'` |
| `#progress-wrap` | `style.display = ''` | `style.display = 'none'` |
| `#bottom-stats` (EN) | `style.display = ''` | `style.display = 'none'` |
| `#header-badge` | `style.display = ''` | `style.display = 'none'` |
| `.hint-section` (ES) | `.revealed` class | default (`display:none`) |
| `.hint-letter` | `.revealed` class | default (`display:none`) |
| `.hint-pattern` | `.revealed` class | default (`display:none`) |
| `.feedback` (EN) | `.show` class | default (`display:none`) |

## EN vs ES Summary

| Feature | EN | ES |
|---------|----|----|
| Prompt | Definition block | Context sentence with blank |
| Audio hint | Always visible | Hidden → revealed on 1st wrong |
| Hint tiers | 2 tiers (letter → pattern) | 3 tiers (audio → letter → pattern) |
| Timer | None | 60s per word |
| Bottom stats | Yes | No |
| Feedback panel | Yes (slide-in) | No (submit btn text changes) |
| Submit style | Flat `#10b981` | Gradient `#77ED8B → #22C55E` |
| Duration labels | "mins" only | "mins · N words" |
| Preview pagination | None | 5 per page |
| Word count mapping | count = minutes | `{ 3: 6, 5: 10, 10: 15, 15: 20 }` |
