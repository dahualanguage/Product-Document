# Interactions & Logic

## Practice Flow State Machine

```
[Setup] → Next → [Preview] → Start → [Practice: Word] → Record+Pass → [Practice: Sentence] → Record+Pass → [Next Word or Result]
```

---

## Setup Page

| Action | Behavior |
|--------|----------|
| Click category card | 高亮選中，取消其他 `.selected` |
| Click count card | 高亮選中，取消其他 `.selected` |
| Click "Next →" | 隱藏 Setup，從 word bank 隨機抽取 N 個單字，顯示 Preview |
| Click "Cancel" | 返回 Word Bank Dashboard |

---

## Quick Vocab Preview

| Action | Behavior |
|--------|----------|
| 進入頁面 | 顯示隨機抽取的單字列表（每頁 5 筆） |
| Click page number | 切換頁面 |
| Click "Back" | 返回 Word Bank Dashboard |
| Click "Start" | 隱藏 Preview，顯示 Progress Bar + Practice Area，載入第 1 個單字的 Word step |

---

## Practice — Word Step

| Action | Behavior |
|--------|----------|
| 進入 | 顯示英文單字 + L1 翻譯，啟動 10 秒倒數 |
| Click 🎤 (first) | 開始錄音，按鈕變紅 + pulse 動畫 |
| Click 🎤 (second) | 停止錄音，送出 AI 評分 |
| AI 回傳 4-5 星 | ✅ 通過 → 顯示星星 + feedback bar，按鈕變 "Say Sentence →" |
| AI 回傳 1-3 星 | ❌ 失敗 → 顯示星星 + speaker hint ("Try again")，`attempts++` |
| 失敗 3 次 | 強制結束 → 顯示 feedback bar，按鈕變 "Say Sentence →"，`wrong++` |
| Timer = 0 | 時間到 → 跟 3 次失敗相同處理 |
| Click "Say Sentence →" | 進入 Sentence step |

---

## Practice — Sentence Step

| Action | Behavior |
|--------|----------|
| 進入 | 顯示英文例句 + L1 翻譯，啟動 30 秒倒數 |
| Click 🎤 (first) | 開始錄音 |
| Click 🎤 (second) | 停止錄音，送出 AI 評分 |
| AI 回傳 4-5 星 | ✅ 通過 → 顯示星星 + per-word 發音 feedback + "Next Word →"，progress bar 更新 |
| AI 回傳 1-3 星 | ❌ 失敗 → 顯示星星 + per-word feedback + speaker hint |
| 失敗 3 次 | 強制結束 → feedback bar + "Next Word →"，`wrong++` |
| Timer = 0 | 同上 |
| Click "Next Word →" | 載入下一個單字的 Word step，或進入 Result |

---

## Per-Word Pronunciation Feedback

Sentence step 完成錄音後，將例句拆成單字，每個單字顯示發音評分。

| Score | Icon | Text color | Tooltip |
|-------|------|-----------|---------|
| Correct | ✅ green circle | `#166534` | "Correct" |
| Warning | ⚠️ amber circle | `#92400e` | "Keep Practicing" |
| Incorrect | ❌ red circle | `#991b1b` | "Incorrect" |

Tooltip 在 hover 時顯示於單字上方。

---

## Timer

| Step | Duration | Warning threshold |
|------|----------|-------------------|
| Word | 10 seconds | ≤ 5s → red |
| Sentence | 30 seconds | ≤ 5s → red |

Timer 格式：`M:SS`（如 `0:20`、`1:00`）

---

## Star Rating

| Stars | Result | Behavior |
|-------|--------|----------|
| 4-5 | Pass | `correct++`（首次通過時），顯示 feedback，進入下一步 |
| 1-3 | Fail | `attempts++`，顯示 hint，可重試 |
| 0 | Timeout | `wrong++`，強制進入下一步 |

首次通過 = `attempts === 0` 時 → `correct++`
重試後通過 = `attempts > 0` 時 → `wrong++`

---

## Progress Bar

```
width = (currentWordIndex / totalWords) × 100%
```

- 完成每個單字的 Sentence step 後更新
- 全部完成時 = `100%`
- 動畫：`transition: width 0.4s ease`

---

## Result Screen

| Condition | Behavior |
|-----------|----------|
| 全部單字完成 | 顯示 🎉 + 統計（Correct / Wrong / Accuracy%） |
| Click "Back to Word Bank" | 返回 `demo-word-bank.html` |
| Click "Practice Again" | `location.reload()` 重新開始 |

### Accuracy 計算

```
accuracy = Math.round(correct / (correct + wrong) × 100)
```

---

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| 單字數 < 選擇數量 | 使用所有可用單字 |
| 錄音失敗 | 顯示 hint，允許重試 |
| Timer 到但正在錄音 | 停止錄音，直接判定失敗 |
| 只有 1 頁預覽 | 隱藏 pagination |
| 全部答對 | Result 顯示 100% accuracy |
| 全部答錯 | Result 仍正常顯示統計 |
