# v17 — Comprehension Quiz：拿掉題庫、進練習才生成

- **功能名稱**：New Comprehension Quiz（`MULTIPLE_CHOICE`）建立流程
- **網址**：https://dahua-dash-dev.web.app/dashboard/practice/create/?type=MULTIPLE_CHOICE
- **截圖**：沿用 v14
- **分岔自**：v14 `proposal.html`（外殼、Stepper、第一步欄位、Test Mode 卡、題目卡、Assign 步全部沿用）；教學點 frame、Add teaching points、Generating 畫面搬自 v12 `proposal.html`
- **日期**：2026-10-23
- **範圍與理由**：`../v16-remove-question-bank/spec.html`（整個「拿掉題庫」的提案）。這一版只畫 Comprehension Quiz 那條流程
- **設計檔**：`proposal.html`（`?step=` 從 1 數；參數見檔頭）。基準檔沿用 v14 `create-comprehension-quiz.html`，不重做
- **狀態**：提案第一輪，未部署、未 commit

## 這一版定了什麼

- 三步不變：Content → Edit & Preview → Assign Practice。第一步從 Question Bank 改名 Content。
- 第一步：專案單選（後端生題一次一個專案）→ Practice name → **What to ask**（題庫頁 Bulk generate 的七格壓成 4×2 格子：Comprehension／Pinyin／Meaning／Fill in blank × True/False／Multiple choice，每格 0–10，True/False 沒有 Fill in blank）→ **Teaching points**（照 v12 的 frame：全選、勾選 chip、語法點標 Grammar、Add teaching points；容器黃底 #FFF8E7）→ **Article**（課文一段一行）→ 主鈕 Generate。
- 字彙類三格從勾的教學點出題；Comprehension 從整篇課文出題、不看教學點。沒有字彙題時教學點 frame 轉灰、說明寫「這次用不到」。語法點不出拼音題。
- Generate 灰著的原因寫在格子底列（R9）：沒選專案／總數 0／有字彙題但沒勾教學點。
- 生成中整頁換 Generating；生成後回第一步主鈕變 Next，回頭多勾、多填只補新的（掛 New）、取消勾的點它的題跟著離開（v12 的做法）。
- 第二步：Test Mode 卡照 v14；一題一張卡，**展開＝編輯**（題目一欄、選項四欄、正解單選點；True/False 只選 True／False），改過的掛 Edited；字彙題多一顆教學點 chip；**Generate more** 鈕打開同一張 4×2 格子（預設 0）、Add N questions 接在最後掛 New。「Edit in Question Bank」那顆鈕拿掉。
- 第三步 Assign 照 v3／v14（S8）。

## 查到的、沒畫的

1. 現行字彙類題目的字是後端從教學點清單隨機抽（commerce-api `getGenerateQuestions` 帶 `vocab` → dash-py `pinyin_meaning.py` 隨機 sample），教學點不夠題數才從文章抓。這一版改成老師勾點，抽字的隨機性仍在後端（勾 7 個點、要 2 題，哪 2 個點被抽到還是後端決定）——要不要給每點各幾題（像 v7 第二步的 −／+），待討論。
2. 第一步 Generate 之後建 practice 的 ProcessingDialog 沒畫（MC 建完 status 是不是直接 COMPLETE 無法確認，v14 E1）。
3. 已指派後回來改題、追加題的版本確認沒畫（走練習本身的 draft／發布影響，v16 待定 4）。
4. 「Add 0 questions」那顆鈕：Generate more 面板全 0 時灰著、原因在格子底列（R9）。

## Change log

| 日期 | 改了什麼 | 說明 |
|---|---|---|
| 2026-10-23 | 第一輪：拿掉題庫、第一步選專案＋勾教學點＋填各類題數、第二步可改可追加 | 使用者「先做一個 Comprehension Quiz 的新版本，一開始一樣先帶出 teaching point 然後拿掉 Question bank，老師要出什麼題目在 practice 選就好」。從 v14 proposal 分岔 |
| 2026-10-23 | 第二輪：What to ask 格子加回題庫頁的 icon | 使用者「參考舊的 UI 增加 icon」。列頭一顆 40px 圓角 tile（chat_bubble_outline／translate／swap_horiz／edit_note，照 bulk-question-type-section.js 的 CATEGORY_ICONS），用這張卡的紫；欄頭 True/False 綠 check_circle、Multiple choice 藍 list_alt（SECTION_STYLES） |
| 2026-10-23 | 第三輪：題數預設改回全 0 | 使用者問「預設的數字是怎麼來的」。第一輪的 3/3/0/0/2/2/2 是我為 demo 編的；產品題庫頁每類預設 0、老師自己填（step2-configure-generate.js DEFAULT_CONFIG）。改成全 0，Generate 灰著、底列寫「Ask for at least one question」；demo 用的那組改掛 `&filled=1`，第二步以後自動帶 |
| 2026-10-23 | 第四輪：底列加「Not sure? Use a suggested mix」一鍵帶入 | 使用者「好」。總數 0 時底列多一顆連結字，按了帶入 3/3 Comprehension、2 Pinyin、2 Meaning、2 Fill in blank；不預填 |
| 2026-10-23 | 第五輪：那句縮成「Use a suggested mix」 | 使用者「有更簡短的說法嗎」。數字拿掉，按了格子自己會填；hover 的 title 留完整說明 |
