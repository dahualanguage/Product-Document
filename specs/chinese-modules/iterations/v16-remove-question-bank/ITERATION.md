# v16 — 拿掉題庫：題目改在練習裡生成

- **功能名稱**：New Open-ended Questions（`QA`）、New Comprehension Quiz（`MULTIPLE_CHOICE`）的建立流程，以及題庫（Question Bank）本身
- **網址**：https://dahua-dash-dev.web.app/dashboard/practice/create/?type=QA、`?type=MULTIPLE_CHOICE`、https://dahua-dash-dev.web.app/dashboard/questions-bank
- **截圖**：沿用 v13、v14
- **分岔自**：v13 `create-qa.html`、v14 `create-comprehension-quiz.html`（基準，沿用不重做）；第一、二步的形狀照 v7 Sentence Scramble 提案
- **日期**：2026-10-22（登記）、2026-10-23（範圍擴到 Comprehension Quiz 與題庫本身）
- **小 spec**：`spec.html`（十四節，照 v10 的格式）
- **設計檔**：還沒有。等後端回「練習自己存題目」這條路、PM 回待定 7–14 之後再開 `proposal.html`
- **範圍**：兩張卡的第一步從「選題庫」改成「選專案＋各類題數＋Generate」，題目存在練習身上、第二步可改可追加；兩張卡的題庫入口刪除、不留替代；題庫本身拿掉（側欄、題庫頁、專案頁題庫段、建專案完成頁的入口、Export／講義、Clone、課文警告、Question bank ready 信、Insight 題庫數），每一項的處置在 spec §5、§9。學生端不改
- **程式碼基準**：dahua-dash `origin/develop` @ `27464842`（2026-10-22 fetch）。自 v13／v14 的 `c8179072` 之後 QA 相關檔案只動了學生端 `qa/components/CompletionMessage.js`；題庫、兩張卡的第一二步沒變
- **PM 文件**：https://claude.ai/artifact/Jx69TwwEjtVjy57vpu1bQv（Claude Doc，內容同 spec）
- **狀態**：提案，等 PM／後端回待定

## 定案

- 2026-10-22：Open-ended 的題庫入口刪除、不留替代；建議答案跟題目一起生成、第二步可改。
- 2026-10-23：Comprehension Quiz 也拿掉題庫；所有依賴題庫的流程在這一版一起提出。

## Change log

| 日期 | 改了什麼 | 說明 |
|---|---|---|
| 2026-10-22 | 登記＋spec（只有 Open-ended） | 從「梳理 Question bank 在 Open-ended 的用途」討論出來；先寫 PM 文件，再照 v10 格式寫 spec。資料夾原名 v16-open-ended-generate |
| 2026-10-23 | 範圍擴大：Comprehension Quiz ＋ 題庫本身 | 使用者「Comprehension Quiz 也會拿掉 Question bank，等於現在有依賴 Question bank 的流程都會跟著這次提案提出」。spec 加 §5 題庫被誰用（13 條）、§7 加 Quiz 的三步、§9 題庫本身的處置（10 條）、待定 6→14。資料夾改名 v16-remove-question-bank |
