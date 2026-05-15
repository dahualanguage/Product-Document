# Broadcast History — Group Collapse 邏輯

---

## 機制

每個 class group 用 CSS `max-height` transition 實現展開/收合動畫，透過 `.open` class 切換。

---

## HTML 結構

```html
<div class="session-group [open]" data-teacher="mine" data-subject="esl">

  <!-- Header（點擊觸發 toggle） -->
  <div class="session-group-header">
    <div class="session-group-dot"></div>
    <span>Pull-out Group A · WIDA 1</span>
    <span class="session-count">10 sessions</span>
    <span class="session-group-teacher you">My Class</span>
    <span class="material-icons-round session-group-chevron">expand_more</span>
  </div>

  <!-- 收合容器（包住所有 session rows） -->
  <div class="session-group-rows">
    <div class="session-row" data-idx="0">...</div>
    <div class="session-row" data-idx="1">...</div>
    <!-- ... -->
  </div>

</div>
```

---

## Toggle 邏輯

```javascript
header.addEventListener('click', function() {
  groupEl.classList.toggle('open');
});
```

- 點擊 header → 切換父層 `.session-group` 的 `.open` class
- **不影響其他 group**（各自獨立狀態）

---

## CSS 核心

```css
/* 收合狀態 */
.session-group-rows {
  max-height: 0;
  overflow: hidden;
  transition: max-height .35s ease;
}

/* 展開狀態 */
.session-group.open .session-group-rows {
  max-height: 2000px;
}

/* Chevron 旋轉 */
.session-group-chevron {
  transition: transform .2s;
}
.session-group.open .session-group-chevron {
  transform: rotate(180deg);
}

/* Dot 顏色變化 */
.session-group.open .session-group-dot {
  background: #10b981;
}
```

---

## 預設狀態

| Group | 預設狀態 |
|-------|---------|
| 第 1 個 group（index 0） | `.open`（展開） |
| 第 2 個以後 | 無 `.open`（收合） |

```javascript
groupEl.className = 'session-group' + (gi === 0 ? ' open' : '');
```

---

## Session Count Label

Header 內顯示 session 數量，方便使用者在收合狀態下快速判斷：

```html
<span style="font-size:11px;font-weight:500;color:#94a3b8;margin-right:4px;">
  10 sessions
</span>
```

- 1 筆：`"1 session"`
- 2 筆以上：`"N sessions"`
