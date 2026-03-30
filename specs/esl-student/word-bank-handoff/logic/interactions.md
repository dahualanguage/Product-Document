# Interactions & Logic

## Word Selection

| Action | Behavior |
|--------|----------|
| Click word list item | 1. 高亮選中項 (`.selected`)<br>2. 更新 detail card 所有欄位<br>3. 若有 `imageUrl` → 顯示圖片，隱藏文字定義<br>4. 若無 `imageUrl` → 顯示文字定義，隱藏圖片<br>5. 更新例句，單字以 `<mark>` 高亮<br>6. 更新 mastery progress + practice checks |

### Example Sentence Rendering

```javascript
// 從 data-example 取得純文字例句
var sentence = item.dataset.example;
// 用 RegExp 找到單字並包上 <mark>
var regex = new RegExp('(' + escapedWord + ')', 'i');
exampleEl.innerHTML = sentence.replace(regex, '<mark>$1</mark>');
```

---

## Filter System

| Action | Behavior |
|--------|----------|
| Click filter tab | 1. 啟用該 tab，其他 tab 取消<br>2. 重設至第 1 頁<br>3. 若為 "By Subject" → 展開 subject sub-pills<br>4. 重新篩選 word list<br>5. 更新 count badge |
| Click sub-pill | 1. 啟用該 pill<br>2. 在當前 tab 類別內再篩選<br>3. 重設至第 1 頁 |

### Filter Logic

```
All        → show all
By Subject → show where subject === activeSub
Live       → show where source === "live"
Teacher    → show where source === "teacher"
Learning   → show where state === "learning"
Mastered   → show where state === "mastered"
```

---

## Pagination

| Action | Behavior |
|--------|----------|
| Click page number | 切換到該頁，自動選取頁面第一個單字 |
| Click ‹ / › | 上/下一頁 |
| Filter change | 重設至第 1 頁 |

- 每頁 8 筆
- 只有 1 頁時隱藏 pagination
- 非當前頁的 items 以 CSS 隱藏（`display: none`）

---

## Translate Toggle

| Action | Behavior |
|--------|----------|
| Toggle ON | 顯示：L1 翻譯、L1 播放按鈕、L1 定義、L1 例句 |
| Toggle OFF | 隱藏上述所有 L1 內容 |

Toggle 狀態是全域的，切換單字時保持。

---

## Collapse / Expand

| Action | Behavior |
|--------|----------|
| Click "Collapse ▲" | 上方區域（Practice + Sets）以 `max-height` 動畫收合<br>Label 變為 "Expand ▲" |
| Click "Expand ▲" | 展開上方區域<br>Label 變為 "Collapse ▲" |

- 動畫：`max-height 0.4s ease`, `opacity 0.3s ease`
- 收合狀態下切換 filter，上方保持收合

---

## Notice Banner

| Action | Behavior |
|--------|----------|
| Change days select | 更新 mastered count（API call） |
| Click "How it works" | 開啟 Mastery 說明浮層 |

### Mastery 說明浮層

- Overlay 背景點擊可關閉
- 內容：The Power of 5 規則 + Mix Your Practice 規則
- "Got it" 按鈕關閉

---

## Mastery Progress

### 規則

```
word.mastery >= 5
  AND word.spellDone === true
  AND word.mcDone === true
  AND word.mirrorDone === true
→ state = "mastered"
```

### Retry（重置 Mastered → Learning）

| Step | Behavior |
|------|----------|
| 1. Click "Back to Learning" | 顯示確認 popup |
| 2. Popup 顯示 | "Move Back to Learning? This will reset all progress for **[word]**." |
| 3. Click "Yes, Reset" | `mastery → 0`, `spell/mc/mirror → false`, `state → "learning"` |
| 4. Click "Cancel" | 關閉 popup，不做任何變更 |

---

## Practice Setup Modal

| Action | Behavior |
|--------|----------|
| Click practice button | 開啟 modal，預選對應 practice way |
| Click set card | 開啟 modal，顯示 category + subject 選項 |
| Select practice way | 高亮選中選項 |
| Select duration | 高亮選中時間 |
| Click "Start" | 導向練習頁面 |

### Duration Options

| Duration | Words |
|----------|-------|
| 3 mins | 6 words |
| 5 mins | 10 words |
| 10 mins | 20 words |
| 15 mins | 30 words |

---

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| 新學生（空 word bank） | 顯示 empty state + "Start learning to build your word bank" |
| 篩選無結果 | Word list 區域顯示 "No words found" |
| 全部 mastered | Banner：慶祝訊息 |
| 無 mastered 單字 | 隱藏 notice banner |
| 翻譯不可用 | Toggle 仍可操作，空欄位顯示空白 |
| 長單字/定義 | List 中截斷（`max-width: 280px` + ellipsis），detail card 顯示完整 |
| 單頁結果 | 隱藏 pagination |
