# Goal Card — Multi-Goal Tab Switch Logic

適用於 State 3（Multiple Goals）的 tab 切換行為。

---

## HTML 結構

```html
<div class="goal-tabs-wrap v13">
  <div class="goal-tabs-nav">
    <button class="goal-tabs-btn active" onclick="switchGoalTab(this, 'goal-tab-1')">Goal 1</button>
    <button class="goal-tabs-btn"        onclick="switchGoalTab(this, 'goal-tab-2')">Goal 2</button>
  </div>
  <div class="goal-tabs">
    <div class="goal-tab-panel active" id="goal-tab-1">
      <!-- goal-card for Goal 1 -->
    </div>
    <div class="goal-tab-panel" id="goal-tab-2">
      <!-- goal-card for Goal 2 -->
    </div>
  </div>
</div>
```

---

## JS 邏輯

```javascript
function switchGoalTab(btn, panelId) {
  // 1. 移除同層所有 btn 的 active
  btn.closest('.goal-tabs-nav')
     .querySelectorAll('.goal-tabs-btn')
     .forEach(t => t.classList.remove('active'));

  // 2. 啟用點擊的 btn
  btn.classList.add('active');

  // 3. 隱藏所有 panels
  btn.closest('.goal-tabs-wrap')
     .querySelectorAll('.goal-tab-panel')
     .forEach(p => p.classList.remove('active'));

  // 4. 顯示對應 panel
  document.getElementById(panelId).classList.add('active');
}
```

---

## CSS 行為

| State | 規則 |
|-------|------|
| `.goal-tabs-btn` (inactive) | `background: #fff; color: #94a3b8; border: 1px solid #e2e8f0` |
| `.goal-tabs-btn:hover` | `background: #f8fafc; color: #64748b` |
| `.goal-tabs-btn.active` | `border-color: #e2e8f0; border-bottom-color: #fff; color: #059669; font-weight: 700` |
| `.goal-tab-panel` | `display: none` |
| `.goal-tab-panel.active` | `display: block` |

---

## `.v13` modifier 說明

`.goal-tabs-wrap.v13` 是目前 production 使用的版本：
- 外框：gray border `#e2e8f0`（非綠色）
- 每個 panel 內的 card 保有綠色左側 bar（通過 `::before` 恢復）

```css
/* v13 — 外框 gray */
.v13 .goal-tabs {
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,.04), 0 4px 16px rgba(0,0,0,.03);
}

/* v13 — panel 內 card 恢復左側 bar */
.v13 .goal-tab-panel .goal-card {
  position: relative; overflow: hidden;
}
.v13 .goal-tab-panel .goal-card::before {
  display: block;
  content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px;
  background: linear-gradient(180deg, #34d399, #059669);
  border-radius: 0;
}
```

---

## 注意

- Tab panel 內的 `.goal-card` 去除 border 與 box-shadow（由外層 `.goal-tabs` 處理）
- 預設第一個 tab active
- `panelId` 需與 `<div id="goal-tab-N">` 對應
