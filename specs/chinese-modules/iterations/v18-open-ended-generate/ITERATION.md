# v18 — Open-ended Questions：拿掉題庫、進練習才生成

- **功能名稱**：New Open-ended Questions（`QA`）建立流程
- **網址**：https://dahua-dash-dev.web.app/dashboard/practice/create/?type=QA
- **截圖**：沿用 v13
- **分岔自**：v13 `proposal.html`（外殼、Stepper、第一步欄位、第二步的 R11 工具列＋學生視窗、Assign 步全部沿用）；第一步的格子、教學點 frame、Generating、第二步的題目卡＋Generate more 跟 v17 同一套
- **日期**：2026-10-23
- **範圍與理由**：`../v16-remove-question-bank/spec.html`。這一版只畫 Open-ended Questions 那條流程；Comprehension Quiz 在 v17
- **設計檔**：`proposal.html`（`?step=` 從 1 數；參數見檔頭）。基準檔沿用 v13 `create-qa.html`，不重做
- **狀態**：提案第一輪，未部署、未 commit

## 這一版定了什麼

- 三步變四步：Content → Edit Questions → Settings & Preview → Assign Practice。多一步是故意的：生成完要有地方看過、改過，再去設音檔（跟 Sentence Scramble 的 Edit Sentences 同一個理由）。
- 第一步：專案單選 → Practice name → **What to ask**（兩列：Content Base／Extension，題庫頁 Q&A 區塊的兩個 radio；icon 照 CATEGORY_ICONS；一欄題數 0–10；預設全 0、底列「Use a suggested mix」帶入 5＋2）→ **Article** → Generate。**沒有教學點**（第二輪拿掉；第一輪原本照 v17 畫了黃底 frame）。
- 沒課文的專案：Generate 灰、原因在格子底列「This project has no article content yet」，課文 frame 裡一條黃色提醒。
- 第二步 Edit Questions：一題一張卡（類別 chip 用 v13 的 .qtype、題目＋拼音、播放、編輯、✕、拖曳）。展開＝編輯題目與建議答案；拼音唯讀，改了題目重產拼音與音檔。Generate more 同一張格子接在最後掛 New。現行「Edit Questions & Answers in Question Bank」鈕沒了。
- 第三步：v13 第二步的工具列＋學生視窗原封不動，底下的課文與題目清單拿掉（題目在第二步處理完；要看哪一題用視窗裡的 Question x of N）。
- 第四步 Assign：S8。

## 查到的、沒畫的

1. Open-ended 的題目沒有「對應到哪個教學點」的欄位（後端只把專案的教學點當提示塞進 prompt），所以第一步不勾點、卡上也沒有教學點 chip，跟 v17 不同。後端照舊會拿專案的教學點當提示，老師不用管。
2. Generate 之後建 practice 的 ProcessingDialog 沒畫（照現行「Processing content...」）。
3. 已指派後回來改題的版本確認沒畫（v16 待定 4）；學生答題時建議答案怎麼進評分（v16 待定 2）。

## Change log

| 日期 | 改了什麼 | 說明 |
|---|---|---|
| 2026-10-23 | 第一輪：四步、第一步選專案＋勾教學點＋填兩類題數、第二步可改可追加、第三步只留工具列＋視窗 | 使用者「也做 Open-ended Questions 沒有 Question bank 的版本」。從 v13 proposal 分岔，格子與卡片跟 v17 同一套；題數預設 0、Use a suggested mix 直接套 v17 第三、四、五輪的定案 |
| 2026-10-23 | 第二輪：第一步的教學點 frame 拿掉 | 使用者「就不用 teaching point 了」。What to ask → Article → Generate；Generate more 的說明不再提教學點 |
| 2026-10-23 | 修：按 Generate 到不了第二步 | 使用者「現在沒辦法到第二步」。底欄少了「1 選單打開」那顆連結，render 最後一行 el('l0d') 是 null 就炸，計時器沒掛上。補上連結，兩個檔的那兩行改成 `el(id)?.classList`。用 CDP 走過「Use a suggested mix → Generate」和「從頭選專案 → 打字 → Generate」兩條路確認到第二步 |
| 2026-10-23 | 第三輪：格子底列的說明句拿掉 | 使用者「整句拿掉留總數和上限」。底列只剩「N questions · up to 10 of each」，擋住時才多一句原因 |
