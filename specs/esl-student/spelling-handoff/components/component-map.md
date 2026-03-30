# Component Map

## Overview

```
AppFrame
├── Sidebar (88px)
│   ├── Logo
│   └── NavItem × 3 (Dashboard, Live Class, Word Bank*)
├── Header (56px)
│   ├── BackButton ("Word Bank")
│   ├── Divider
│   ├── Title ("Spelling Practice")
│   └── HeaderBadge ("All Random · 10 words")
├── ProgressBar (4px)
└── Content (scrollable)
    ├── SetupPage (hidden after selection)
    │   └── SetupCard
    │       ├── CategoryGrid × 4
    │       ├── CountGrid × 4
    │       └── Footer (Cancel / Next)
    ├── PreviewPage
    │   └── PreviewCard
    │       ├── PreviewList (word + translation + play)
    │       └── Footer (Back / Pagination / Start)
    └── PracticePage
        └── QuestionCard
            ├── QuestionCounter ("Q3 of 10" + Timer)
            ├── HintSection (translation + definition, hidden)
            ├── FirstLetterHint ("Starts with H", hidden)
            ├── ContextSentence (sentence with blank)
            ├── InputArea (text input + Check button)
            └── Feedback + NextButton
```

---

## 1. SetupCard (shared pattern)

同 Mirroring — 選擇類別 + 時長。

### Category Options

| Option | data-cat |
|--------|----------|
| Newest | `newest` |
| All Random | `all-random` (預設) |
| Untested | `untested` |
| Most Errors | `most-errors` |

### Duration Options

| Duration | Words |
|----------|-------|
| 3 mins | 6 words |
| 5 mins | 10 words (預設) |
| 10 mins | 15 words |
| 15 mins | 20 words |

---

## 2. PreviewCard (shared pattern)

同 Mirroring — 顯示單字 + 翻譯 + 播放按鈕，每頁 5 筆。

---

## 3. QuestionCard

拼字練習主卡片。

### HintSection (漸進式提示)

| Level | Trigger | Content |
|-------|---------|---------|
| Hidden | 初始狀態 | 不顯示 |
| Level 1 | 第 1 次錯誤 | 翻譯 + 播放按鈕 + 英文定義 |
| Level 2 | 第 2 次錯誤 | + 首字母提示 "Starts with H" |
| Level 3 | 第 3 次錯誤 | 直接在 input 顯示正確答案 |

### ContextSentence

| Element | Description |
|---------|-------------|
| Sentence | 英文例句 |
| Blank | 答案位置，以 `blur(5px)` 模糊化顯示 |

### InputArea

| Element | Description |
|---------|-------------|
| Label | "Type the correct word" |
| Input | 文字輸入框，支援 Enter 提交 |
| Check button | 驗證答案 → 答對變 "Next Word →" |

---

## 4. Result Screen (shared pattern)

同 Mirroring — 🎉 + Correct / Wrong / Accuracy + 返回/再練。

---

## 5. Data Model

### Word Object

```typescript
interface SpellingWord {
  word: string;          // "hypothesis"
  tl: string;            // "假說" (L1 translation)
  def: string;           // English definition (hint level 1)
  sentence: string;      // "We need to test our <blank> before drawing any conclusions."
}
```

> `sentence` 中使用 `<blank>` 標記答案位置，JS 渲染時替換為 `<span class="blank">word</span>`。

### Practice State

```typescript
interface PracticeState {
  current: number;       // Current word index (0-based)
  correct: number;       // Correct count (first attempt only)
  wrong: number;         // Wrong count
  total: number;         // Total words
  attempts: number;      // Retry count for current word (0-3)
  timeLeft: number;      // Timer countdown (seconds, starts at 60)
}
```

---

## 6. Suggested API

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `GET /api/student/word-bank` | GET | 取得單字列表 (同 Word Bank) |
| `POST /api/student/practice/spelling/start` | POST | 開始練習，回傳 session ID |
| `POST /api/student/practice/spelling/answer` | POST | 提交答案，回傳是否正確 |
| `POST /api/student/practice/spelling/complete` | POST | 完成練習，儲存結果 |

### Answer Request

```typescript
{
  sessionId: string;
  wordId: string;
  answer: string;        // 學生輸入的拼字
  attempt: number;       // 第幾次嘗試 (1-3)
}
```

### Answer Response

```typescript
{
  correct: boolean;
  correctWord: string;   // 正確答案（錯誤時回傳）
}
```
