# Goal Card — States

Goal Card 共有 5 個 state，由後端資料決定，前端依 class 切換視覺。

---

## State 1 — In Progress（正常進行中）

**觸發條件**
- 本週有 goal
- 距截止日 > 1 天（或進度未落後）

**CSS class**：`.goal-card`（base，無額外 modifier）

**視覺**
- 左側 bar：綠色漸層 `#34d399 → #059669`
- Progress bar fill：綠色 `#6ee7b7 → #10b981`
- Days left tag：紅底 `background: #fef2f2; color: #ef4444`
- Icon：trophy SVG（綠色）

---

## State 2 — Urgent（緊急，落後進度）

**觸發條件**
- 距截止日 ≤ 1 天，且進度未達標

**CSS class**：`.goal-card.urgent`

**視覺變化（覆蓋 base）**
- 左側 bar：amber→red `#fbbf24 → #ef4444`
- Progress bar fill：金色 `#fde68a → #f59e0b`
- Date 文字色：`#d97706`
- Progress value 色：`#d97706`
- Icon 背景：`#fefce8`；icon 色：`#d97706`
- Icon：換成 `warning`（Material Icons Round）

---

## State 3 — Multiple Goals（多個目標）

**觸發條件**
- Teacher 設定了 2 個以上的 goal

**結構**：Tab 架構（非 `.goal-card` modifier，而是外層包 `.goal-tabs-wrap`）

```html
<div class="goal-tabs-wrap v13">
  <div class="goal-tabs-nav">
    <button class="goal-tabs-btn active">Goal 1</button>
    <button class="goal-tabs-btn">Goal 2</button>
  </div>
  <div class="goal-tabs">
    <div class="goal-tab-panel active" id="goal-tab-1">...</div>
    <div class="goal-tab-panel" id="goal-tab-2">...</div>
  </div>
</div>
```

**視覺**
- 外框：gray border `#e2e8f0`（非綠色）
- 每個 tab 內的 card：有綠色左側 bar（`.v13` modifier 控制）
- Active tab：border `#e2e8f0`，bottom border 白色（視覺連結卡片）
- 切換邏輯：見 `tab-switch.md`

---

## State 4 — Empty（無目標）

**觸發條件**
- Teacher 本週未設定任何 goal

**CSS class**：`.goal-card.empty`

**視覺**
- 邊框：`2px dashed #e2e8f0`，背景 `#f8fafc`
- 無左側 bar（`::before { display: none }`）
- 無 progress bar
- Icon：`flag`（Material Icons Round，色 `#cbd5e1`）
- 文字：muted gray

---

## State 5 — Completed（已完成）

**觸發條件**
- 進度達到目標數值（e.g. 5/5）

**CSS class**：`.goal-card.completed`

**視覺變化**
- Progress bar fill：100% 寬，全綠
- Days left tag：移除（改為 congrats badge）
- Congrats badge：`.goal-card-congrats`，`celebration` icon + "Great job!"
  - 背景 `#ecfdf5`，邊框 `1.5px solid #6ee7b7`，文字 `#059669`
