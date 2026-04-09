# My Word Bank — Engineering Handoff

> ESL Student Word Bank homepage — 完整前端交接文件

| Item | Value |
|------|-------|
| UI Version | v7 |
| Date | 2026-03-30 |
| Status | Ready for Dev |
| Designer | Product Team |

---

## Quick Start

1. 打開 `code/demo-word-bank.html` 看完整互動 demo（中文版）
2. 打開 `code/demo-word-bank-es.html` 看西班牙文版
3. 所有 CSS/JS 都在單一 HTML 檔案內，可直接檢視

---

## Folder Structure

```
word-bank-handoff/
├── code/                       ← 完整 demo 原始碼（single-file HTML）
│   ├── demo-word-bank.html     ← 中文 L1 版本
│   ├── demo-word-bank-es.html  ← 西班牙文 L1 版本
│   └── assets/                 ← Logo 等靜態資源
│
├── design-specs/               ← 設計規格
│   ├── colors.md               ← 色彩 tokens
│   ├── typography.md           ← 字型規格
│   ├── spacing.md              ← 間距與佈局
│   └── screenshots/            ← 畫面截圖（TODO: 補充）
│
├── components/                 ← Component 拆解
│   └── component-map.md        ← 所有元件說明 + data model
│
├── logic/                      ← 互動邏輯
│   └── interactions.md         ← 所有互動行為 + 狀態切換
│
└── README.md                   ← 你正在看的這份文件
```

---

## Page Layout Overview

```
┌──────────────────────────────────────────────────────┐
│                   App Frame (100vw × 100vh)           │
├────────┬─────────────────────────────────────────────┤
│        │  Header (56px)  │ "My Word Bank"   Versions │
│  Side  ├─────────────────────────────────────────────┤
│  bar   │                                             │
│  88px  │  ┌─ Notice Banner ─────┬─ Practice Grid ──┐ │
│        │  │  🎉 14 Words!       │ [4 buttons 1×4]  │ │
│  Logo  │  └─────────────────────┴──────────────────┘ │
│  ────  │  ┌─ Challenge Card ────┬─ 3 Set Cards ────┐ │
│  Dash  │  │  (word tags)        │ Focus│New│Almost  │ │
│  Live  │  └─────────────────────┴──────────────────┘ │
│  Word* │         ─── Collapse / Expand ───            │
│        │                                             │
│        │  Filter: All │ By Subject │ Live │ Teacher.. │
│        │                                             │
│        │  ┌─ Word Detail ───────┬─ Word List ──────┐ │
│        │  │  hypothesis         │  hypothesis  ✓   │ │
│        │  │  定義 / 圖片         │  plant       ○   │ │
│        │  │  Example            │  equation    ○   │ │
│        │  │  Mastery 2/5        │  ...             │ │
│        │  └─────────────────────┴──────────────────┘ │
└────────┴─────────────────────────────────────────────┘
```

---

## Key Design Decisions

### 1. Image-based Definition
簡單單字（如 "plant"）不需要文字定義，直接顯示 200×200 照片。
判斷依據：`imageUrl` 欄位有值 → 隱藏文字定義，顯示圖片。

### 2. Dynamic Example Sentence
每個單字都有獨立的例句，點擊切換時動態更新。
單字在例句中以 `<mark>` 高亮。

### 3. Mastery Progress (5-hit Rule)
- 每個單字需要 5 次正確練習才能從 Learning → Mastered
- 必須完成 3 種練習各至少 1 次：Spelling、Multiple Choice、Mirroring
- Mastered 單字可以手動重置回 Learning

### 4. i18n — 多語系支援
- UI shell 固定英文（Source、Subject 等 label）
- 翻譯欄位（word, definition, example）根據學生 L1 切換
- 目前有中文版和西班牙文版兩個 demo

### 5. Removed Fields (vs v6)
- ~~Type~~（Word Type classification）— 已移除
- ~~Word Level~~（WIDA/ELPAC/CEFR tags）— 已移除
- Meta rows 只剩 Source 和 Subject

---

## Related Files

| File | Description |
|------|-------------|
| `components/component-map.md` | 所有元件拆解、data model、API 建議 |
| `design-specs/colors.md` | 完整色彩 token 表 |
| `design-specs/typography.md` | 字型、字重、字級 |
| `design-specs/spacing.md` | Grid 佈局、間距、容器寬度 |
| `logic/interactions.md` | 互動行為、狀態轉換、edge cases |
