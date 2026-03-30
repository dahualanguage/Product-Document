# Spelling Practice — Engineering Handoff

## Overview

Spelling Practice 是拼字練習模組。學生根據上下文例句和提示，在輸入框中拼出正確的英文單字。系統提供漸進式提示：第一次錯誤顯示翻譯+定義，第二次錯誤顯示首字母，第三次錯誤直接顯示答案。

## Page Flow

```
Word Bank Dashboard
  → Practice Setup (選擇類別 + 時長)
    → Quick Vocab Preview (預覽單字列表)
      → Practice (逐題作答 × N words)
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
│                │   │   Question Card   │     │
│                │   │ Q3 of 10  ⏱ 1:00 │     │
│                │   │                   │     │
│                │   │ [Hint: 翻譯+定義] │     │
│                │   │ [💡 Starts with H] │     │
│                │   │                   │     │
│                │   │ Context sentence  │     │
│                │   │ with ___blank___  │     │
│                │   │                   │     │
│                │   │ [Type answer] [✓] │     │
│                │   └───────────────────┘     │
│                │                             │
└─────────────────────────────────────────────┘
```

## Key Design Decisions

1. **Progressive hints**: 漸進式提示系統（翻譯+定義 → 首字母 → 答案）
2. **Context sentence**: 例句中的答案以模糊遮罩 (`blur`) 顯示
3. **Timer**: 每題 60 秒，≤10 秒時變紅
4. **Scoring**: 首次答對 = correct，重試後答對或 3 次錯誤 = wrong
5. **Input feedback**: 正確時 input 變綠，錯誤時 input 閃紅

## Folder Structure

```
spelling-handoff/
├── README.md                    ← 本文件
├── code/
│   ├── demo-spelling.html       ← EN/中文 working demo
│   ├── demo-spelling-es.html    ← EN/西班牙文 working demo
│   └── assets/
│       └── dh_single.png        ← Logo
├── design-specs/
│   ├── colors.md                ← 色票
│   ├── typography.md            ← 字型
│   └── spacing.md               ← 間距 & 佈局
├── components/
│   └── component-map.md         ← 元件樹 + 資料模型
└── logic/
    └── interactions.md          ← 互動邏輯 + 提示系統
```
