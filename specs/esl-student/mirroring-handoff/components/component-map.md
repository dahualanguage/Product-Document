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
│   ├── Title ("Vocabs Mirroring")
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
        └── MirrorCard
            ├── QuestionCounter ("Word 1 of 10" + Timer)
            ├── HintBar (speaker + "Try again")
            ├── CardContent (Word/Translation or Sentence/Translation)
            ├── PronFeedback (per-word, sentence step only)
            ├── StarRating (★ × 5)
            ├── RecordButton (mic)
            └── FeedbackBar + NextButton
```

---

## 1. SetupCard

練習設定頁，選擇單字類別與練習時長。

### Category Options

| Option | data-cat | Description |
|--------|----------|-------------|
| Newest | `newest` | 最新加入的單字 |
| All Random | `all-random` | 隨機全部（預設） |
| Untested | `untested` | 尚未測試的單字 |
| Most Errors | `most-errors` | 錯誤率最高 |

### Duration Options

| Duration | Words |
|----------|-------|
| 3 mins | 6 words |
| 5 mins | 10 words (預設) |
| 10 mins | 15 words |
| 15 mins | 20 words |

---

## 2. PreviewCard

Quick Vocab Preview，顯示即將練習的單字列表。

| Element | Description |
|---------|-------------|
| Title | "Quick Vocab Preview" |
| Badge | 單字數量 (e.g. "10 words") |
| Subtitle | "Review these words before you start" |
| List item | 單字 + L1 翻譯 + 播放按鈕 |
| Pagination | 每頁 5 筆，≤1 頁時隱藏 |
| Footer | Back（返回 Word Bank）/ 頁碼 / Start |

---

## 3. MirrorCard

練習主卡片，兩種模式切換。

### Mode A: Word Step

| Element | Description |
|---------|-------------|
| Main text | 英文單字 (32px bold) |
| Translation | L1 翻譯 (18px) |
| Timer | 10 秒倒數 |

### Mode B: Sentence Step

| Element | Description |
|---------|-------------|
| Sentence | 英文例句 (22px) |
| Translation | L1 例句翻譯 (15px) |
| Timer | 30 秒倒數 |
| Pron feedback | 每個單字的發音評分（完成錄音後顯示） |

### Common Elements

| Element | Description |
|---------|-------------|
| Counter | "Word N of M" |
| Timer | 倒數計時，≤5 秒時變紅 |
| Star rating | 1-5 星，4+ 星通過 |
| Record button | 點擊開始/停止錄音 |
| Hint bar | 第一次失敗後顯示（speaker + "Try again"） |
| Next button | "Say Sentence →" 或 "Next Word →" |

---

## 4. Result Screen

練習完成統計畫面。

| Element | Description |
|---------|-------------|
| Emoji | 🎉 |
| Title | "Practice Complete!" |
| Subtitle | "You finished all N words" |
| Correct | 正確數 (green) |
| Wrong | 錯誤數 (red) |
| Accuracy | 正確率 % |
| Actions | "Back to Word Bank" / "Practice Again" |

---

## 5. Data Model

### Word Object

```typescript
interface MirroringWord {
  word: string;          // "hypothesis"
  tl: string;            // "假說" (L1 translation)
  def: string;           // English definition (used in hints)
  phonetic: string;      // "/haɪˈpɒθ.ə.sɪs/"
  sentence: string;      // "We need to test our hypothesis before drawing conclusions."
  sentenceTl: string;    // "我們需要在得出結論之前驗證我們的假說。"
}
```

### Practice State

```typescript
interface PracticeState {
  current: number;       // Current word index (0-based)
  correct: number;       // Correct count
  wrong: number;         // Wrong count
  total: number;         // Total words
  step: 'word' | 'sentence';  // Current step
  attempts: number;      // Retry count for current step (max 3)
  isRecording: boolean;  // Recording state
  timeLeft: number;      // Timer countdown (seconds)
}
```

### Setup State

```typescript
interface SetupState {
  category: string;      // "all-random" | "newest" | "untested" | "most-errors"
  count: number;         // 3 | 5 | 10 | 15 (minutes)
}
```

---

## 6. Suggested API

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `GET /api/student/word-bank` | GET | 取得單字列表 (同 Word Bank) |
| `POST /api/student/practice/mirroring/start` | POST | 開始練習，回傳 session ID |
| `POST /api/student/practice/mirroring/evaluate` | POST | 送出錄音，回傳 AI 評分 |
| `POST /api/student/practice/mirroring/complete` | POST | 完成練習，儲存結果 |

### Evaluate Request

```typescript
{
  sessionId: string;
  wordId: string;
  step: 'word' | 'sentence';
  audioBlob: Blob;       // 錄音檔案
}
```

### Evaluate Response

```typescript
{
  starRating: number;    // 1-5
  perWordScores?: {      // sentence step only
    word: string;
    score: 'correct' | 'warning' | 'incorrect';
  }[];
}
```
