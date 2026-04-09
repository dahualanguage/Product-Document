# Component Map

## Overview

```
AppFrame
├── Sidebar (88px)
│   ├── Logo
│   └── NavItem × 3 (Dashboard, Live Class, Word Bank*)
├── Header (56px)
│   ├── Title ("My Word Bank")
│   ├── ProficiencySelect (WIDA/ELPAC/CEFR)
│   └── VersionLink
└── Content (scrollable)
    ├── UpperSection (collapsible)
    │   ├── Row1: NoticeBanner + PracticeGrid
    │   └── Row2: SetCards × 4
    ├── CollapseToggle
    ├── FilterTabs + SubPills
    └── LowerSection
        ├── WordDetailCard
        └── WordList + Pagination
```

---

## 1. Sidebar

**沿用現有設計** — 不需重新開發，確認 Word Bank 的 active 狀態正確即可。

| Nav Item | Icon | Route |
|----------|------|-------|
| Dashboard | grid icon | `/dashboard` |
| Live Class | video icon | `/live` |
| **Word Bank** | book icon | `/word-bank` (active) |

---

## 2. NoticeBanner

可關閉的通知條，顯示近期 mastery 成就。

| Field | Source | Example |
|-------|--------|---------|
| Days range | User select (1/3/7/14/30) | "7 days" |
| Mastered count | API | 14 |
| Streak | API | 12 day streak |

**Trigger:** 學生有新 mastered 單字時顯示。無 mastered 時隱藏。

---

## 3. PracticeGrid

4 個練習模式按鈕，1×4 grid。

| Button | Route |
|--------|-------|
| Practice All | `/practice?mode=all` |
| Spelling | `/practice?mode=spelling` |
| Multiple Choice | `/practice?mode=mc` |
| Mirroring | `/practice?mode=mirroring` |

---

## 4. SetCards

4 張智慧練習集卡片。

| Set | Logic | Display |
|-----|-------|---------|
| Challenge of the Day | AI 推薦的每日挑戰詞彙 | 顯示 word tags |
| Focus Subject Words | 按科目篩選 | 選擇後進入練習 |
| Newly Added | 最新加入的單字 | 按 `createdAt` 排序 |
| Almost There | 接近 mastery 的單字 | mastery 4/5 的詞 |

---

## 5. FilterTabs

| Tab | Filter Logic | Sub-pills |
|-----|-------------|-----------|
| **All** | 顯示全部 | 無 |
| **By Subject** | 按 `subject` 篩選 | Science, Math, History, Geography（附數量） |
| **Live Classes** | `source = "live"` | 無 |
| **Teacher Added** | `source = "teacher"` | 無 |
| **Learning** | `state = "learning"` | 無 |
| **Mastered** | `state = "mastered"` | 無 |

---

## 6. WordDetailCard

選中單字的完整詳情卡。

### Header

| Element | Description |
|---------|-------------|
| Word | 英文單字 (24px bold) |
| Play button | TTS 播放英文發音 |
| Translation | L1 翻譯（toggle 控制顯示） |
| TL Play button | TTS 播放 L1 發音（toggle 控制） |
| Translate toggle | 開關翻譯顯示 |
| POS badge | 詞性標籤 (noun, verb...) |

### Body — 兩種模式

#### Mode A: Text Definition（預設）

| Element | Description |
|---------|-------------|
| Definition | 英文定義 |
| TL Definition | L1 定義翻譯（toggle 控制） |
| Example | 例句，單字以 `<mark>` 高亮 |
| TL Example | L1 例句翻譯（toggle 控制） |
| Source | "Live Classroom" / "Practice" / "Teacher Added" |
| Subject | "Science" / "Math" / "History" / "Geography" |

#### Mode B: Image Definition（簡單單字）

| Element | Description |
|---------|-------------|
| Image | 200×200px 照片（1:1, cover） |
| Example | 同上 |
| Source / Subject | 同上 |

**切換邏輯：** `imageUrl` 有值 → Mode B，否則 → Mode A

### Mastery Progress

| Element | Description |
|---------|-------------|
| Progress bar | `N / 5`，填充百分比 |
| Spelling check | ✅ done 或 ○ pending |
| Multiple Choice check | ✅ done 或 ○ pending |
| Mirroring check | ✅ done 或 ○ pending |
| Hint | "N more practice(s) to master this word!"（remaining ≤ 3 時顯示） |

**Mastered 狀態時：** 隱藏 progress + checks，顯示 "Back to Learning" 按鈕。

---

## 7. WordList

可篩選、分頁的單字列表。

| Field | Display |
|-------|---------|
| Word | 13px bold |
| Definition preview | 11px muted，截斷 |
| State badge | "Learning" (amber) / "Mastered" (green) |

**Pagination:** 每頁 8 筆，切頁時自動選取第一個單字。

---

## 8. Data Model

### Word Object

```typescript
interface Word {
  id: string;
  word: string;                    // "hypothesis"
  translation: string;             // "假說" (based on student L1)
  definition: string;              // English definition (empty for image words)
  definitionTranslation: string;   // L1 definition
  imageUrl: string | null;         // Photo URL for simple words
  example: string;                 // "We need to test our hypothesis..."
  exampleTranslation: string;      // L1 example
  partOfSpeech: string;            // "noun"
  source: "live" | "practice" | "teacher";
  subject: string;                 // "Science"
  state: "learning" | "mastered";
  mastery: number;                 // 0-5
  spellDone: boolean;
  mcDone: boolean;
  mirrorDone: boolean;
}
```

### Source Values

| Value | Display | Meaning |
|-------|---------|---------|
| `live` | Live Classroom | 課堂中即時捕捉 |
| `practice` | Practice | 練習錯誤中產生 |
| `teacher` | Teacher Added | 老師手動指派 |

---

## 9. Suggested API

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `GET /api/student/word-bank` | GET | 取得單字列表（支援 filter + pagination） |
| `GET /api/student/word-bank/stats` | GET | 取得 mastery 統計（banner 用） |
| `GET /api/student/word-bank/sets` | GET | 取得智慧練習集 |
| `PATCH /api/student/word-bank/:id/reset` | PATCH | 重置單字回 Learning |

### Query Parameters

| Param | Type | Description |
|-------|------|-------------|
| `subject` | string | science, math, history, geography |
| `source` | string | live, practice, teacher |
| `state` | string | learning, mastered |
| `page` | number | 頁碼（1-based） |
| `perPage` | number | 每頁筆數（default: 8） |
