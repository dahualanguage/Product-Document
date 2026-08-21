# v2 — To Review 增加 Skip

- **功能名稱**：To Review 增加 skip
- **網址**：https://dahua-dash-dev.web.app/school/teacher-dashboard/
- **截圖**：To Review 面板（To Review 15 / Reviewed 11 兩個分頁 + practice type 下拉 + 提交清單，最舊的一筆 59 days ago）
- **分岔自**：現行產品（不是 v1）
- **日期**：2026-08-20
- **小 spec**：`spec.html`（To Review 現況 + Active Assignments 既有的 Skip + 查到的問題 + 待決事項）
- **設計檔（老師端）**：`teacher-dashboard.html`（基準檔，現行產品的複刻，不動）、`skip-review-drawer.html`（提案，`?skip=1` 直接打開、`&pick=stale` 看已勾選的樣子）
- **設計檔（學生端）**：`student.html` —— `?screen=hist&hist=reviewed&open=global-warming`。來源是 redesign 那條線的 `student-redesign.html`，不是現行學生端產品
- **範圍**：Teacher Dashboard 的 To Review 面板 + 批改抽屜；左欄 Active Assignments 一併複刻，因為現行的 Skip 就在那裡，新的 skip 要跟它對得起來
- **程式碼基準**：dahua-dash `origin/develop` @ `1cca25a6`
- **狀態**：兩端都有畫面；六題**全數收斂**（2026-08-20）——四題不用討論、Q2 與 Q3 已拍板，只剩後端欄位一項待辦

## Change log

| 端 | 改了什麼 | 說明 |
|---|---|---|
| 老師 | 基準檔複刻現行 dashboard | 顏色行為逐項照抄 `review-panel.js` / `review-drawer.js` / `active-assignments-panel.js`，加 skip 之前先有一個對得上程式碼的起點。 |
| 老師 | To Review 標頭加一顆 Skip review | 幽靈按鈕，只在 To Review 分頁出現。 |
| 老師 | 打開是可多選的清單 | 只列未批改的，最舊的排最上面（面板本身由新到舊，最該處理的沉在底部）。 |
| 老師 | Select all ＋「Older than 30 days」 | 一鍵勾起積很久的，不用一列一列點。型別下拉沿用面板當下的過濾。 |
| 老師 | 做成右側抽屜，不是置中 modal | 跟批改抽屜同一種開法，一次看得到 11 列、只蓋右欄。曾另做置中 modal 版並排比較，已收掉。 |
| 老師 | 兩顆按鈕都叫 Skip review | 這一側沒有任何地方只寫 Skip，所以不會跟左欄的 Skip assignment 撞名。數量由「N selected」交代。 |
| 老師 | 紅色只留給 Skip 按鈕 | 勾選中的列改淺灰、checkbox 與天數改綠。紅色只代表「按下去不可逆」。 |
| 老師 | 標頭 icon 拿掉 | 只留標題 + 副標 + 關閉鈕，跟批改抽屜的標頭一致。 |
| 老師 | skip 完併進 Reviewed（Q2） | 不加第三個分頁，掛灰色 Skipped 章區分。代價是 Reviewed 的計數含 skip 掉的。 |
| 老師 | 抽屜裡 skipped 可以補批 | 打一段留言送出就轉成真的 review，灰章變綠章——所以不必另做 undo。 |
| 老師 | 六題收斂 | Q1／Q5 被設計本身回答掉、Q4 因 Q2 有了替代路徑、Q6 只剩一條路變成待辦。詳見 `spec.html` §6。 |
| 學生 | skip 掉的進 History → Reviewed（Q3） | 狀態章跟真的批過的一樣是綠色 Reviewed，學生端不引進「Skipped」這個詞；「等待老師批改」收掉。 |
| 學生 | 老師回饋卡只寫 `No teacher comment` | 不解釋、不道歉。AI Summary、分數、Redo 全部照常，未讀紅點不給。 |
