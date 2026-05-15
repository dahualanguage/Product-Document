# Broadcast History — Design Tokens & CSS Specs

---

## Color Tokens

### Session Group Header

| Token | Hex | 用途 |
|-------|-----|------|
| Header bg | `#f1f5f9` | `.session-group-header` background |
| Header bg (hover) | `#e9eef4` | `.session-group-header:hover` |
| Header text | `#0f172a` | class name 文字 |
| Count label | `#94a3b8` | session 數量文字 |
| Dot (collapsed) | `#cbd5e1` | `.session-group-dot` |
| Dot (expanded) | `#10b981` | `.session-group.open .session-group-dot` |
| Chevron (collapsed) | `#94a3b8` | `.session-group-chevron` |
| Chevron (expanded) | `#64748b` | `.session-group.open .session-group-chevron` |

### Teacher Tag（Group Header 右側）

| Tag | Background | Text | Border |
|-----|------------|------|--------|
| Other teacher | `#ecfdf5` | `#059669` | `1px solid #6ee7b7` |
| My Class (you) | `#fef9c3` | `#854d0e` | `1px solid #fde047` |

### Session Row

| Token | Hex | 用途 |
|-------|-----|------|
| Row bg (default) | `#fff` | base |
| Row bg (hover) | `#f8fafc` | `:hover` |
| Row bg (selected) | `#f0fdf4` | `.selected` |
| Row dot (default) | `#e2e8f0` | `.session-row-dot` |
| Row dot (selected) | `#10b981` | `.session-row.selected .session-row-dot` |
| Arrow (default) | `#cbd5e1` | `.session-row-arrow` |
| Arrow (hover) | `#94a3b8` | `:hover .session-row-arrow` |
| Arrow (selected) | `#10b981` | `.selected .session-row-arrow` |
| Row name | `#0f172a` | `.session-row-name` |
| Row meta | `#94a3b8` | `.session-row-meta` |
| Separator | `#e2e8f0` | `.session-row-meta .sep` |
| Border between rows | `#f1f5f9` | `border-top` on each row |

### Status Badge

| State | Background | Text | Border |
|-------|------------|------|--------|
| IN PROGRESS | `#fff` | `#059669` | `1px solid #e2e8f0` |
| ENDED | `#f1f5f9` | `#94a3b8` | `1px solid #e2e8f0` |

### Transcript Panel

| Token | Hex | 用途 |
|-------|-----|------|
| Panel bg | `#fff` | `.history-right` |
| Panel header border | `#e2e8f0` | `border-bottom` |
| Panel name | `#0f172a` | `.transcript-panel-name` |
| Panel meta | `#94a3b8` | `.transcript-panel-meta` |
| Segment text | `#334155` | `.transcript-segment-text` |
| Segment border | `#f1f5f9` | `border-bottom` between segments |
| Empty state text | `#94a3b8` | `.transcript-empty` |

### Filter Pills

| State | Background | Text | Border |
|-------|------------|------|--------|
| L1 default | `#fff` | `#64748b` | `1px solid #e2e8f0` |
| L1 active | `#059669` | `#fff` | `#059669` |
| L2 default | `#fff` | `#64748b` | `1px solid #e2e8f0` |
| L2 active | `#ecfdf5` | `#059669` | `1px solid #059669` |

---

## CSS Class Reference

### Layout

| Class | 用途 |
|-------|------|
| `.history-layout` | 50:50 flex 外層容器，`overflow: hidden` |
| `.history-left` | 左側 session 列表，`flex: 1`，`overflow-y: auto`，`background: #f8faf9` |
| `.history-right` | 右側 transcript panel，`flex: 1`，`background: #fff` |

### Group

| Class | 用途 |
|-------|------|
| `.session-group` | 單一 class group 容器（collapsed 狀態） |
| `.session-group.open` | 展開狀態 |
| `.session-group-header` | 可點擊的 group header 行 |
| `.session-group-dot` | 左側圓點狀態指示 |
| `.session-group-teacher` | 右側 teacher tag badge |
| `.session-group-teacher.you` | "My Class" 黃色 tag |
| `.session-group-chevron` | `expand_more` icon，旋轉動畫 |
| `.session-group-rows` | session rows 收合容器 |

### Session Row

| Class | 用途 |
|-------|------|
| `.session-row` | 單一 session 行 |
| `.session-row.selected` | 目前選中（transcript 顯示中） |
| `.session-row-dot` | 左側小圓點 |
| `.session-row-info` | 名稱 + meta 文字區塊 |
| `.session-row-name` | class 名稱（13px bold） |
| `.session-row-meta` | 日期 · 時間 · 時長 |
| `.session-row-badge` | ENDED status badge |
| `.session-row-badge.inprogress` | IN PROGRESS status badge |
| `.session-row-arrow` | 右側 `›` 箭頭 |

### Transcript Panel

| Class | 用途 |
|-------|------|
| `.transcript-empty` | 未選取 session 時的提示文字 |
| `.transcript-panel-header` | 選取後顯示的 header（名稱 + meta） |
| `.transcript-panel-name` | Session class 名稱 |
| `.transcript-panel-meta` | 日期 · 時間 · 時長 + badge |
| `.transcript-panel-badge` | Ended / In Progress badge（small） |
| `.transcript-segments` | transcript 內容捲動區 |
| `.transcript-segment` | 單段 transcript |
| `.transcript-segment-text` | 文字內容（14px，`line-height: 1.75`） |

### Filter

| Class | 用途 |
|-------|------|
| `.filter-row` | Layer 1 pill 列 |
| `.filter-pill` | Layer 1 pill 按鈕 |
| `.filter-pill.active` | 目前選中的 L1 |
| `.filter-sub-row` | Layer 2 pill 列（預設 `display: none`） |
| `.filter-sub-row.show` | 顯示中的 L2 列 |
| `.filter-sub` | Layer 2 pill 按鈕 |
| `.filter-sub.active` | 目前選中的 L2 |

---

## Typography

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Page title | 20px | 800 | `#0f172a` |
| Group header | 14px | 700 | `#0f172a` |
| Session count label | 11px | 500 | `#94a3b8` |
| Teacher tag | 11px | 700 | varies |
| Session row name | 13px | 600 | `#0f172a` |
| Session row meta | 12px | 400 | `#94a3b8` |
| Status badge | 10px | 700 | varies (uppercase) |
| Transcript name | 16px | 800 | `#0f172a` |
| Transcript meta | 12px | 400 | `#94a3b8` |
| Transcript text | 14px | 400 | `#334155` |

---

## Dimensions

| Element | Value |
|---------|-------|
| Group card border-radius | `14px` |
| Group header padding | `14px 20px` |
| Session row padding | `12px 20px` |
| Group dot size | `8×8px`, `border-radius: 50%` |
| Session row dot size | `6×6px`, `border-radius: 50%` |
| Status badge border-radius | `20px` |
| Status badge padding | `3px 12px` |
| Collapse animation | `max-height .35s ease` |
| Chevron animation | `transform .2s` |
| History left/right split | `flex: 1` / `flex: 1`（50:50） |
