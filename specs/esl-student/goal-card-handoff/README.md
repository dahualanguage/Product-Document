# Goal Card — Engineering Handoff

> ESL Student Weekly Goal Card component — 完整前端交接文件

| Item | Value |
|------|-------|
| Component | Goal Card |
| Product | ESL Student — Word Bank |
| Date | 2026-05-15 |
| Status | Ready for Dev |

---

## Quick Start

打開 [`../goal-card-options.html`](../goal-card-options.html) 看所有 5 個 scenario 的互動 demo。

---

## Folder Structure

```
goal-card-handoff/
├── README.md                  ← 本文件
├── logic/
│   ├── states.md              ← 5 個 state 的觸發條件與視覺變化
│   ├── kpi-types.md           ← 合法的 KPI 類型（共 3 種）
│   └── tab-switch.md          ← Multi-goal tab 切換邏輯
└── design-specs/
    └── tokens.md              ← 顏色、圖示、CSS class 規格
```

---

## Overview

Goal Card 是 ESL Student Word Bank 首頁上方的每週目標卡片，由 ESL Teacher 設定。

- **1 個 goal** → 單張 card
- **2+ goals** → tab 架構，每個 tab 一張 card
- **無 goal** → empty state

詳見 `logic/states.md`。
