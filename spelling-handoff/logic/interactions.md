# Interactions — Spelling Practice

> Two variants: **EN** (`demo-spelling.html`) and **ES** (`demo-spelling-es.html`).
> Differences are noted with **(EN only)** / **(ES only)**.

## Screen Flow

```
Setup Page → Preview Page → Practice Loop → Completion Screen
     ↑            |
     └── Back ────┘   (EN: back to setup, ES: back to Word Bank)
```

---

## 1 — Setup Page

### Category Selection
- Tap an `.option-card` → deselect all others → add `.selected` to tapped card
- Updates `setupState.category`
- Options: `Newest`, `All Random`, `Untested`, `Most Errors`
- Default: `All Random`

### Duration Selection
- Tap a `.count-card` → deselect all others → add `.selected` to tapped card
- Updates `setupState.count`
- Options: `3`, `5`, `10`, `15` (minutes)
- Default: `5`
- **(ES only)** Each card also shows estimated word count: `{ 3: 6, 5: 10, 10: 15, 15: 20 }`

### Footer Actions
| Button | EN Action | ES Action |
|--------|-----------|-----------|
| Cancel | Navigate to `demo-word-bank.html` | Navigate to `demo-word-bank-es.html` |
| Next → | Validate both selections → `showPreview()` | Same |

### Demo shortcut
Both variants call `showPreview()` on page load, auto-skipping the setup page.

---

## 2 — Preview Page

### Word List Population
1. Shuffle `window._allWords` randomly
2. EN: Slice to `setupState.count` words. ES: Slice to `countMap[setupState.count]` words
3. Store as `window._previewWords`
4. Render each word as a `.preview-item` (word + translation + play button)
5. Update badge: `"N words"`

### Pagination (ES only)
- 5 words per page
- `renderPreviewPage(page)` renders current page slice + pagination buttons
- Prev/next arrows + numbered page buttons

### Audio Preview
- Tap `.preview-play` → call `speakWord(word)` via Web Speech API

### Footer Actions
| Button | EN Action | ES Action |
|--------|-----------|-----------|
| Back | Hide preview → show setup page | Navigate to `demo-word-bank-es.html` |
| Start | `startPractice()` → show badge, progress bar, practice area | Same |

---

## 3 — Practice Loop

### Word Loading (`loadWord`)
1. Reset `attempts = 0`
2. **Auto-play audio** via `speakWord(word)`
3. Pre-compute hint data (first letter, pattern string)
4. Hide all hint boxes
5. EN: Display definition in `.word-def`. ES: Render context sentence with `.blank` span
6. EN: Audio button always visible. ES: Show `.hint-section` with audio button
7. Clear and focus input
8. Update question counter (`N of Total`)
9. Update progress bar width
10. **(ES only)** Start 60s countdown timer

### Answer Submission — EN variant

```
User types answer → Click "Check" or press Enter
                          │
                    ┌──────┴──────┐
                 Correct?        Wrong
                    │              │
              ┌─────┴─────┐    attempts++
          1st try    With hints     │
              │          │    ┌─────┴──────┬──────────┐
          correct++   wrong++ │            │          │
              │          │  1st wrong   2nd wrong   3rd wrong
              └────┬─────┘    │            │          │
                   │      Reveal       Reveal      Show answer
              Show green  1st letter   pattern     in input
              feedback    + replay     + replay    wrong++
                   │      audio        audio       │
                   │        │            │       Btn → "Next Word →"
                   ▼        ▼            ▼          │
              [Next Word]  Clear input  Clear input  ▼
                   │       & re-focus   & re-focus  [Next Word]
                   ▼
              loadWord(next) or Completion
```

### Answer Submission — ES variant

```
User types answer → Click "Check" or press Enter
                          │
                    ┌──────┴──────┐
                 Correct?        Wrong
                    │              │
              ┌─────┴─────┐    attempts++
          1st try    With hints     │
              │          │    ┌─────┴──────┬──────────┬──────────┐
          correct++   wrong++ │            │          │          │
              │          │  1st wrong   2nd wrong   3rd wrong  Timeout
              │          │    │            │          │          │
              │          │  Reveal      Reveal     Reveal     Show answer
              │          │  audio btn   1st letter  pattern   wrong++
              │          │  + replay    + replay    + replay     │
              │          │    │            │          │          │
              │          │  Clear input  Clear      Show answer  │
              │          │  & re-focus   & refocus  wrong++      │
              └────┬─────┘    │            │          │          │
                   │          ▼            ▼          ▼          ▼
              Stop timer                        Btn → "Next Word →"
              Btn → "Next Word →"                     │
                   │                                  ▼
                   ▼                           loadWord(next) or Completion
              loadWord(next) or Completion
```

### Hint Progression — EN (2-tier, audio always visible)

| Attempt | Hint Revealed | Behavior |
|---------|---------------|----------|
| 1st wrong | First letter | Show `.hint-letter.revealed`, replay audio, flash input red 800ms, clear & refocus |
| 2nd wrong | Letter pattern | Hide `.hint-letter`, show `.hint-pattern.revealed`, replay audio, flash input red 800ms, clear & refocus |
| 3rd wrong | Full answer | Fill input with correct word, disable input, btn text → "Next Word →", count as Wrong |

### Hint Progression — ES (3-tier, audio hidden initially)

| Attempt | Hint Revealed | Behavior |
|---------|---------------|----------|
| 1st wrong | Audio play button | Show `.hint-section.revealed`, replay audio, flash input red 800ms, clear & refocus |
| 2nd wrong | First letter | Show `.hint-letter.revealed`, replay audio, flash input red 800ms, clear & refocus |
| 3rd wrong | Letter pattern | Hide `.hint-letter`, show `.hint-pattern.revealed`, replay audio, flash input red 800ms, clear & refocus |
| 4th wrong | Full answer | Fill input with correct word, disable input, btn text → "Next Word →", count as Wrong |

### Timer (ES only)

| Event | Behavior |
|-------|----------|
| Word loaded | Start 60s countdown |
| Correct answer | Stop timer |
| 3rd/4th wrong (fail) | Stop timer |
| Timer reaches 0 | Treat as wrong: show answer in input, wrong++, btn → "Next Word →" |
| Timer ≤ 10s | Add `.warning` class (red color) |

### Pattern Generation (`getPatternString`)
- Reveal characters at even indices (0, 2, 4, …)
- Replace odd indices with `_`
- Join with spaces
- Example: `hypothesis` → `h _ p _ t _ e _ i _`

### Scoring Rules

| Outcome | Correct++ | Wrong++ |
|---------|-----------|---------|
| Right on 1st try | ✓ | — |
| Right after 1+ hints | — | ✓ |
| Failed all attempts | — | ✓ |
| Timer expired (ES) | — | ✓ |

> Key rule: If any hints were needed, the word counts as **Wrong** even if eventually typed correctly.

### Input States

| State | Border | Background | Text Color | Duration |
|-------|--------|------------|------------|----------|
| Default | `#e2e8f0` | `#fff` | `#0f172a` | — |
| Focus | `#10b981` (EN) / `#86efac` (ES) | `#fff` | `#0f172a` | While focused |
| Correct | `#10b981` (EN) / `#22C55E` (ES) | `#f0fdf4` | `#166534` | Stays |
| Wrong flash | `#ef4444` | `#fef2f2` | `#991b1b` | 800ms then reset |
| Wrong final | `#ef4444` | `#fef2f2` | `#991b1b` | Stays (last wrong / timeout) |

### Keyboard Support
- **Enter** while input enabled → submit answer
- **Enter** while input disabled → click Next button

---

## 4 — Completion Screen

### Trigger
- `current >= total` after clicking Next

### Display
- Replaces `.practice-area` innerHTML (not a separate page)
- Progress bar set to 100%
- Shows: Correct count, Wrong count, Accuracy percentage

### Actions
| Button | EN Action | ES Action |
|--------|-----------|-----------|
| Back to Word Bank | `demo-word-bank.html` | `demo-word-bank-es.html` |
| Practice Again | `location.reload()` | `location.reload()` |

---

## Audio (Web Speech API)

```javascript
speakWord(text) {
  speechSynthesis.cancel();          // stop any playing audio
  var u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = 0.9;
  speechSynthesis.speak(u);
}
```

### When Audio Plays

| Event | EN | ES |
|-------|----|----|
| New word loaded | Auto-play | Auto-play |
| 1st wrong | Replay | Replay (+ reveal audio btn) |
| 2nd wrong | Replay | Replay |
| 3rd wrong | — | Replay |
| User clicks "Play word" | Manual (always available) | Manual (after 1st wrong) |
| Preview play button | Manual | Manual |

### Production Note
Demo uses `SpeechSynthesis` (browser TTS). Production should replace with a dedicated audio service for consistent pronunciation quality across devices.

---

## Data Model

```javascript
// Word object
{
  word: string,       // English word (the answer)
  tl: string,         // Translation (Chinese in EN, Spanish in ES)
  def: string,        // English definition (EN: shown as prompt)
  sentence: string    // Context sentence with <blank> placeholder (ES: shown as prompt)
}

// Duration → word count mapping (ES only)
countMap = { 3: 6, 5: 10, 10: 15, 15: 20 }

// Setup state
setupState = {
  category: string,   // 'Newest' | 'All Random' | 'Untested' | 'Most Errors'
  count: number       // 3 | 5 | 10 | 15 (minutes)
}

// Practice state (closure variables)
current: number       // current word index
correct: number       // first-try correct count
wrong: number         // wrong count (hints used or failures)
total: number         // total words in session
attempts: number      // wrong attempts on current word (0–3/4)
activeWords: Array    // words selected for this session
timeLeft: number      // (ES only) seconds remaining
timerInterval: number // (ES only) setInterval ID
```
