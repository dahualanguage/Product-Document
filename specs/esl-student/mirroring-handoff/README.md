# Vocabs Mirroring — Engineering Handoff

## Overview

Vocabs Mirroring 是語音跟讀練習模組。學生看到單字/例句後，透過麥克風錄音跟讀，系統以 AI 語音辨識評分（1-5 星），每個單字分為「Word」和「Sentence」兩個步驟。

## Page Flow

```
Word Bank Dashboard
  → Practice Setup (選擇類別 + 時長)
    → Quick Vocab Preview (預覽單字列表)
      → Practice (Word step → Sentence step × N words)
        → Result (完成統計)
```

## Layout

```
┌─────────────────────────────────────────────┐
│ Sidebar (88px) │ Header (56px, back + title) │
│                ├─────────────────────────────┤
│                │ Progress Bar (4px)           │
│                ├─────────────────────────────┤
│                │                             │
│                │   ┌───────────────────┐     │
│                │   │   Mirror Card     │     │
│                │   │ ┌───────────────┐ │     │
│                │   │ │  Word / 翻譯  │ │     │
│                │   │ │  or Sentence  │ │     │
│                │   │ └───────────────┘ │     │
│                │   │   ★ ★ ★ ★ ★      │     │
│                │   │   🎤 Record btn   │     │
│                │   │   [Next →]        │     │
│                │   └───────────────────┘     │
│                │                             │
└─────────────────────────────────────────────┘
```

## Key Design Decisions

1. **Two-step practice**: 每個單字先練「Word」（單字跟讀），再練「Sentence」（例句跟讀）
2. **Star rating (1-5)**: 4-5 星 = 通過，1-3 星 = 需重試（最多 3 次）
3. **Timer**: Word step 10 秒，Sentence step 30 秒
4. **Per-word pronunciation feedback**: Sentence step 顯示每個單字的發音評分（correct/warning/incorrect）
5. **Speaker hint**: 第一次失敗後顯示播放按鈕 + "Try again"

## Folder Structure

```
mirroring-handoff/
├── README.md                    ← 本文件
├── code/
│   ├── demo-vocabs-mirroring.html    ← EN/中文 working demo
│   ├── demo-vocabs-mirroring-es.html ← EN/西班牙文 working demo
│   └── assets/
│       └── dh_single.png            ← Logo
├── design-specs/
│   ├── colors.md                ← 色票
│   ├── typography.md            ← 字型
│   └── spacing.md               ← 間距 & 佈局
├── components/
│   └── component-map.md         ← 元件樹 + 資料模型
└── logic/
    └── interactions.md          ← 互動邏輯 + 狀態機
```

## Demo Files

| File | Language | Description |
|------|----------|-------------|
| `demo-vocabs-mirroring.html` | EN / 中文 | 主要 demo，隨機模擬 AI 評分 |
| `demo-vocabs-mirroring-es.html` | EN / 西班牙文 | 西語版本 |

> **Note:** Demo 中的語音辨識為模擬（`Math.random()`），實際需接入 AI Speech-to-Text API。
