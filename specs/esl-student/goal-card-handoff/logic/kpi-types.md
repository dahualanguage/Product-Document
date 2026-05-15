# Goal Card — Valid KPI Types

Teacher 設定 goal 時只能選以下 3 種 KPI，前端顯示邏輯依此對應。

---

## 3 種合法 KPI

| KPI Type | 中文 | Goal title 範例 | Progress 範例 |
|----------|------|----------------|--------------|
| Practice count | 練習次數 | "Practice 5 times" | 2 of 5 |
| Practice minutes | 練習分鐘 | "Practice 30 minutes" | 12 of 30 |
| Words learned | 學會單字數 | "Master 10 new words" | 4 of 10 |

---

## 注意

- **不支援** 特定 practice mode 的目標（如 "Complete 3 mirroring sessions"）
- **不支援** 複習類目標（如 "Review 20 vocabulary cards"）
- Goal title 為 free text，由 teacher 輸入；progress 數值由後端計算

---

## Progress Bar 計算

```
fill width = (current / target) * 100%
```

- `current`：後端回傳的當前進度值
- `target`：teacher 設定的目標值
- 超過 100% 時 clamp 至 100%，觸發 Completed state
