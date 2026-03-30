# Interactions & Logic

## Practice Flow

```
[Setup] → Next → [Preview] → Start → [Question 1] → Check → ... → [Question N] → [Result]
```

---

## Setup & Preview (shared)

同 Mirroring — 選擇類別 + 時長 → 預覽單字列表 → 開始練習。

---

## Question Flow

每題流程：

```
載入單字 → 學生輸入 → Check
  ├── 正確（首次）→ correct++ → input 變綠 → "Next Word →"
  ├── 正確（重試）→ wrong++ → input 變綠 → "Next Word →"
  ├── 錯誤（第1次）→ 顯示翻譯+定義 → 清空 input → 重試
  ├── 錯誤（第2次）→ 顯示首字母 → 清空 input → 重試
  └── 錯誤（第3次）→ wrong++ → input 顯示答案（disabled）→ "Next Word →"
```

---

## Progressive Hint System

| Attempts | Action | UI Change |
|----------|--------|-----------|
| 0 | 初始 | 只顯示 context sentence + input |
| 1st wrong | 顯示 Level 1 提示 | HintSection 淡入：翻譯 + 🔊 + 定義 |
| 2nd wrong | 顯示 Level 2 提示 | FirstLetterHint 淡入：💡 Starts with **H** |
| 3rd wrong | 顯示答案 | Input 填入正確單字 + disabled + 紅色邊框 |

### Hint Section CSS

```css
.hint-section { display: none; }
.hint-section.revealed { display: block; }

.hint-letter { display: none; }
.hint-letter.revealed { display: block; }
```

---

## Input Handling

| Action | Behavior |
|--------|----------|
| 輸入文字 | 即時顯示在 input |
| Click "Check" | 驗證答案（`trim().toLowerCase()` 比對） |
| Press Enter | 同 "Check"；若 input disabled 則觸發 Next |
| 答對 | Input border 變綠 + bg `#f0fdf4`，按鈕變 "Next Word →" |
| 答錯 | Input border 閃紅 800ms → 恢復，清空 input，focus |
| 3 次答錯 | Input 顯示正確答案，disabled，按鈕變 "Next Word →" |

### Answer Validation

```javascript
const isCorrect = input.value.trim().toLowerCase() === word.word.toLowerCase();
```

- 不區分大小寫
- 去除前後空白
- 完全比對（不接受部分拼字）

---

## Context Sentence

例句中的答案以模糊遮罩顯示：

```html
<span class="blank" style="filter: blur(5px); user-select: none;">hypothesis</span>
```

- 單字可見但模糊，學生無法直接複製
- 不同瀏覽器 blur 效果可能略有差異

---

## Timer

| Property | Value |
|----------|-------|
| Duration | 60 seconds per word |
| Warning | ≤ 10 seconds → timer 變紅 |
| Timeout | 時間到 → 視為答錯，顯示正確答案 |

### Timeout Behavior

```
Timer = 0 →
  wrong++
  input.disabled = true
  input.value = correctWord
  input.className = 'wrong'
  button = "Next Word →"
  progress bar 更新
```

---

## Scoring

| Condition | Result |
|-----------|--------|
| 首次答對 (`attempts === 0`) | `correct++` |
| 重試後答對 (`attempts > 0`) | `wrong++` |
| 3 次答錯 | `wrong++` |
| 時間到 | `wrong++` |

### Accuracy 計算

```
accuracy = Math.round(correct / total × 100)
```

---

## Progress Bar

```
width = (currentWordIndex / totalWords) × 100%
```

- 答對或 3 次答錯後更新（含 timeout）
- 全部完成 = 100%

---

## Result Screen

同 Mirroring — 🎉 + Correct / Wrong / Accuracy%

| Action | Behavior |
|--------|----------|
| "Back to Word Bank" | 返回 `demo-word-bank.html` |
| "Practice Again" | `location.reload()` |

---

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| 空白提交 | 不處理，return |
| 只打空格 | `trim()` 後為空，不處理 |
| 大小寫不同 | 接受（`toLowerCase()` 比對） |
| Timer 到且正在輸入 | 停止計時，強制顯示答案 |
| 單字數 < 選擇數量 | 使用所有可用單字 |
| 全部答對 | 100% accuracy |
| 全部答錯 | 0% accuracy，仍顯示 result |
| 快速連按 Enter | Input disabled 後觸發 Next，不會重複計分 |
