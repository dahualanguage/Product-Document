# Broadcast History — Engineering Handoff

> ESL Coordinator Broadcast History screen — 完整前端交接文件

| Item | Value |
|------|-------|
| Component | Broadcast History |
| Product | ESL Coordinator |
| Date | 2026-05-15 |
| Status | Ready for Dev |

---

## Quick Start

打開 [`../demo-coordinator-v1.html`](../demo-coordinator-v1.html) → 點 sidebar **History** 查看互動 demo。

---

## Folder Structure

```
broadcast-history-handoff/
├── README.md                    ← 本文件
├── logic/
│   ├── states.md                ← Session / group 狀態定義
│   ├── group-collapse.md        ← Group 展開／收合邏輯
│   └── filters.md               ← 2-layer filter 邏輯
└── design-specs/
    └── tokens.md                ← 顏色、CSS class、尺寸規格
```

---

## Overview

Broadcast History 是 ESL Coordinator 查看自己和所有 ESL / Subject Teachers 上課紀錄的頁面，採 50:50 左右分割佈局。

- **左側**：session 列表，依 class 分組，支援 2-layer filter
- **右側**：選中 session 的 transcript 面板
- 每個 class group 可展開 / 收合，預設第一個 group 展開

詳見 `logic/states.md`。
