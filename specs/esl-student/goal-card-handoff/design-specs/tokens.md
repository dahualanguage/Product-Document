# Goal Card — Design Tokens & CSS Specs

---

## Color Tokens

### In Progress (base)

| Token | Hex | 用途 |
|-------|-----|------|
| Left bar start | `#34d399` | `::before` gradient top |
| Left bar end | `#059669` | `::before` gradient bottom |
| Progress fill start | `#6ee7b7` | bar fill gradient left |
| Progress fill end | `#10b981` | bar fill gradient right |
| Progress bar track | `#f1f5f9` | fill background |
| Date text | `#059669` | `.goal-card-date` |
| Value text | `#059669` | `.goal-card-value` |
| Icon bg | `#f1f5f9` | `.goal-card-icon` background |
| Days left tag bg | `#fef2f2` | `.goal-card-tag` |
| Days left tag text | `#ef4444` | `.goal-card-tag` |

### Urgent

| Token | Hex | 用途 |
|-------|-----|------|
| Left bar start | `#fbbf24` | `::before` gradient top |
| Left bar end | `#ef4444` | `::before` gradient bottom |
| Progress fill start | `#fde68a` | bar fill gradient left |
| Progress fill end | `#f59e0b` | bar fill gradient right |
| Date text | `#d97706` | `.urgent .goal-card-date` |
| Value text | `#d97706` | `.urgent .goal-card-value` |
| Icon bg | `#fefce8` | `.urgent .goal-card-icon` |

### Completed

| Token | Hex | 用途 |
|-------|-----|------|
| Left bar start | `#6ee7b7` | `::before` gradient top |
| Left bar end | `#059669` | `::before` gradient bottom |
| Progress fill | full width, `#6ee7b7 → #059669` | bar at 100% |
| Icon bg | `#ecfdf5` | `.completed .goal-card-icon` |
| Congrats badge bg | `#ecfdf5` | `.goal-card-congrats` |
| Congrats badge border | `#6ee7b7` | `.goal-card-congrats` |
| Congrats badge text | `#059669` | `.goal-card-congrats` |

### Empty

| Token | Hex | 用途 |
|-------|-----|------|
| Border | `#e2e8f0` | `2px dashed` |
| Background | `#f8fafc` | card bg |
| Icon color | `#cbd5e1` | `.goal-card-empty-icon` |
| Title color | `#64748b` | `.goal-card-empty-title` |
| Sub text color | `#94a3b8` | `.goal-card-empty-sub` |

---

## CSS Class Reference

| Class | 用途 |
|-------|------|
| `.goal-card` | Base card（In Progress） |
| `.goal-card.urgent` | Urgent 狀態 |
| `.goal-card.completed` | Completed 狀態 |
| `.goal-card.empty` | Empty 狀態（無目標） |
| `.goal-card::before` | 左側 4px 顏色 bar |
| `.goal-card-icon` | 52×52px 圖示容器 |
| `.goal-card-content` | 右側內容 flex column |
| `.goal-card-header` | 日期 + tag 一行 |
| `.goal-card-date` | 顯示截止日 / "Due Fri" |
| `.goal-card-tag` | Days left / Completed tag |
| `.goal-card-from` | "From Teacher X" 行 |
| `.goal-card-title` | goal 標題（free text） |
| `.goal-card-bar-row` | progress bar + value 一行 |
| `.goal-card-bar` | progress track（bg `#f1f5f9`） |
| `.goal-card-fill` | progress fill（用 `width: X%`） |
| `.goal-card-value` | "X of Y" 數值文字 |
| `.goal-card-congrats` | Completed 時取代 tag |
| `.goal-tabs-wrap.v13` | Multi-goal tab 外層容器 |
| `.goal-tabs-nav` | tab 按鈕列 |
| `.goal-tabs-btn` | 單一 tab 按鈕 |
| `.goal-tabs-btn.active` | 目前選中的 tab |
| `.goal-tabs` | panel 容器 |
| `.goal-tab-panel` | 單一 panel（預設 hidden） |
| `.goal-tab-panel.active` | 顯示中的 panel |

---

## Icon Spec

### Goal Type Icon（全狀態通用）

Custom trophy SVG，嵌入在 `.goal-card-icon` 內：

```html
<div class="goal-card-icon">
  <svg class="trophy-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
    <path d="M12 15C8.7 15 6 12.3 6 9V4h12v5c0 3.3-2.7 6-6 6z" fill="#6ee7b7"/>
    <path d="M6 5H3v2c0 1.7 1.1 3.1 2.7 3.7C5.9 10 6 9.5 6 9V5z" fill="#34d399"/>
    <path d="M18 5h3v2c0 1.7-1.1 3.1-2.7 3.7C18.1 10 18 9.5 18 9V5z" fill="#34d399"/>
    <path d="M14 15.4V17h1a2 2 0 0 1 2 2v1H7v-1a2 2 0 0 1 2-2h1v-1.6c.6.1 1.3.2 2 .2s1.4-.1 2-.2z" fill="#059669"/>
    <rect x="9" y="19" width="6" height="1.5" rx=".75" fill="#059669"/>
  </svg>
</div>
```

**注意**：Urgent state 時，icon 換成 `warning`（Material Icons Round），不使用 trophy SVG。

```html
<!-- Urgent state only -->
<div class="goal-card-icon">
  <span class="material-icons-round">warning</span>
</div>
```

### Empty State Icon

```html
<span class="material-icons-round goal-card-empty-icon">flag</span>
```

### Completed Congrats Badge Icon

```html
<div class="goal-card-congrats">
  <span class="material-icons-round">celebration</span>
  Great job!
</div>
```

---

## Typography

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Goal title | 20px | 800 | `#0f172a` |
| Date | 14px | 700 | `#059669` (or `#d97706` urgent) |
| From teacher | 11px | 400 | `#94a3b8` |
| Progress value | 14px | 800 | `#059669` (or `#d97706` urgent) |
| Tag text | 10px | 700 | varies by state |
| Tab btn | 12px | 600/700 | `#94a3b8` / `#059669` active |

---

## Dimensions

| Element | Value |
|---------|-------|
| Card border-radius | `14px` |
| Card padding | `22px 24px` |
| Left bar width | `4px` |
| Icon container | `52×52px`, `border-radius: 14px` |
| Icon size | `24×24px` |
| Progress bar height | `8px`, `border-radius: 4px` |
| Tab btn border-radius | `10px 10px 0 0` |
| Tab panel border-radius | `0 12px 12px 12px` |
| Congrats badge border-radius | `20px` |
