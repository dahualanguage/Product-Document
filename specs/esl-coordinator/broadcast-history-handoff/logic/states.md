# Broadcast History — States

Broadcast History 的視覺狀態分為兩層：**Group 狀態**與 **Session Row 狀態**。

---

## Group 狀態

### State 1 — Collapsed（預設，收合）

**觸發條件**
- 頁面載入時，除第一個 group 外，其餘 group 預設收合

**CSS class**：`.session-group`（無 `.open`）

**視覺**
- Session rows：`max-height: 0; overflow: hidden`（不可見）
- Dot indicator：`background: #cbd5e1`（灰色）
- Chevron：`expand_more`，向下，`color: #94a3b8`
- Header hover：`background: #e9eef4`

---

### State 2 — Expanded（展開）

**觸發條件**
- 第一個 group 預設為此狀態
- 使用者點擊 group header 切換

**CSS class**：`.session-group.open`

**視覺變化（覆蓋 base）**
- Session rows：`max-height: 2000px`（可見，動畫展開）
- Dot indicator：`background: #10b981`（綠色）
- Chevron：旋轉 180°，`color: #64748b`

---

## Session Row 狀態

### State 3 — Default

**CSS class**：`.session-row`

**視覺**
- 背景：`#fff`
- Row dot：`background: #e2e8f0`（灰色）
- Arrow：`color: #cbd5e1`

---

### State 4 — Hover

**CSS class**：`.session-row:hover`

**視覺變化**
- 背景：`#f8fafc`
- Arrow：`color: #94a3b8`

---

### State 5 — Selected（選中，transcript 顯示中）

**CSS class**：`.session-row.selected`

**視覺變化**
- 背景：`#f0fdf4`（淡綠）
- Row dot：`background: #10b981`（綠色）
- Arrow：`color: #10b981`

---

## Status Badge 狀態

| Badge | CSS class | Background | Text color | Border |
|-------|-----------|------------|------------|--------|
| IN PROGRESS | `.session-row-badge.inprogress` | `#fff` | `#059669` | `1px solid #e2e8f0` |
| ENDED | `.session-row-badge` | `#f1f5f9` | `#94a3b8` | `1px solid #e2e8f0` |

---

## Transcript Panel 狀態

### Empty（未選取任何 session）

- 顯示 `#tp-empty`：`"Select a session to view its transcript"`
- 隱藏 `#tp-header` 和 `#tp-segments`

### Populated（已選取 session）

- 隱藏 `#tp-empty`
- 顯示 `#tp-header`（class name + date · time · duration + badge）
- 顯示 `#tp-segments`（逐段 transcript text）
