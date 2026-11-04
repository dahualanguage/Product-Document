# v17 — Comprehension Quiz：拿掉題庫、進練習才生成

- **功能名稱**：New Comprehension Quiz（`MULTIPLE_CHOICE`）建立流程
- **網址**：https://dahua-dash-dev.web.app/dashboard/practice/create/?type=MULTIPLE_CHOICE
- **截圖**：沿用 v14
- **分岔自**：v14 `proposal.html`（外殼、Stepper、第一步欄位、Test Mode 卡、題目卡、Assign 步全部沿用）；教學點 frame、Add teaching points、Generating 畫面搬自 v12 `proposal.html`
- **日期**：2026-10-23
- **範圍與理由**：`../v16-remove-question-bank/spec.html`（整個「拿掉題庫」的提案）。這一版只畫 Comprehension Quiz 那條流程
- **設計檔**：`proposal.html`（`?step=` 從 1 數；參數見檔頭）。基準檔沿用 v14 `create-comprehension-quiz.html`，不重做
- **狀態**：**2026-11-04 起 Comprehension Quiz 的唯一版本**（v14 併進來；v14 的 `create-comprehension-quiz.html` 是基準）。提案第一輪，未部署、未 commit

## 這一版定了什麼

- 三步不變：Content → Edit & Preview → Assign Practice。第一步從 Question Bank 改名 Content。
- 第一步：專案單選（後端生題一次一個專案）→ Practice name → **What to ask**（題庫頁 Bulk generate 的七格壓成 4×2 格子（2026-11-03 起 3×2，Fill in blank 拿掉）：Comprehension／Pinyin／Meaning／Fill in blank × True/False／Multiple choice，每格 0–10，True/False 沒有 Fill in blank）→ **Teaching points**（照 v12 的 frame：全選、勾選 chip、語法點標 Grammar、Add teaching points；容器黃底 #FFF8E7）→ **Article**（課文一段一行）→ 主鈕 Generate。
- 字彙類三格從勾的教學點出題；Comprehension 從整篇課文出題、不看教學點。（沒有字彙題時 frame 轉灰、說明寫「這次用不到」——2026-11-02 拿掉。）語法點不出拼音題。
- Generate 灰著的原因寫在格子底列（R9）：沒選專案／總數 0／有字彙題但沒勾教學點。
- 生成中整頁換 Generating；生成後回第一步主鈕變 Next，回頭多勾、多填只補新的（掛 New）、取消勾的點它的題跟著離開（v12 的做法）。
- 第二步：Test Mode 卡照 v14；一題一張卡，**展開＝編輯**（題目一欄、選項四欄、正解單選點；True/False 只選 True／False），改過的掛 Edited；字彙題多一顆教學點 chip；**Generate more** 鈕打開同一張 4×2 格子（預設 0）、Add N questions 接在最後掛 New。「Edit in Question Bank」那顆鈕拿掉。
- 第三步 Assign 照 v3／v14（S8）。

## 查到的、沒畫的

1. 現行字彙類題目的字是後端從教學點清單隨機抽（commerce-api `getGenerateQuestions` 帶 `vocab` → dash-py `pinyin_meaning.py` 隨機 sample），教學點不夠題數才從文章抓。這一版改成老師勾點，抽字的隨機性仍在後端（勾 7 個點、要 2 題，哪 2 個點被抽到還是後端決定）——要不要給每點各幾題（像 v7 第二步的 −／+），待討論。
2. 第一步 Generate 之後建 practice 的 ProcessingDialog 沒畫（MC 建完 status 是不是直接 COMPLETE 無法確認，v14 E1）。
3. 已指派後回來改題、追加題的版本確認沒畫（走練習本身的 draft／發布影響，v16 待定 4）。
4. 「Add 0 questions」那顆鈕：Generate more 面板全 0 時灰著、原因在格子底列（R9）。
5. **要問工程**：題數上限拿掉之後，後端一次能生多少題 True/False／Multiple choice？題庫頁每類最多 10 是前端擋的，生成 API（commerce-api `getGenerateQuestions` → dash-py）有沒有自己的上限、題數多時要多久，無法確認。

## Change log

| 日期 | 改了什麼 | 說明 |
|---|---|---|
| 2026-11-04 | Generate more 鈕加重 | 使用者「太不明顯」。從灰細框小鈕改成綠框、淺綠實底、綠字粗體、38px 高；位置不動（第二步眉標右邊） |
| 2026-11-04 | 第二步眉標的提示句拿掉 | 使用者「拿掉 True/False N · Multi-Choice N · drag to reorder · click a question to edit it」。眉標只剩 QUESTIONS · N 和 Generate more；只剩一題時「Last question…」那句照留 |
| 2026-11-04 | 總數搬到題型卡之上 | 使用者「0 questions 總數往上擺在題型之上」。卡片左上一行大字總數「N questions」，底列整條拿掉 |
| 2026-11-04 | 底列拿掉「Ask for at least one question」 | 使用者「也拿掉」。底列只剩「N questions」；0 題時 Generate／Add 照樣灰著，但畫面上不再寫原因（跟判準 R9「灰著要給原因」不一致，使用者定） |
| 2026-11-04 | 第二步題卡答案直接展開 | 使用者「答案直接展開」。收起的題卡也列出選項（True/False 兩格、Multiple choice A–D），正解綠／藍底加勾，唯讀；鉛筆打開才是可改的題目欄與選項 |
| 2026-11-04 | 底列拿掉「All questions are written from the whole article」 | 使用者「不用副標」。底列只剩總數，0 題時加原因 |
| 2026-11-04 | 拿掉「Use a suggested mix」 | 使用者問怎麼算的（固定 3＋5，我定的，不看課文；產品題庫頁沒有建議值）→「拿掉好了」。總數 0 時底列只剩原因 *Ask for at least one question*；&filled=1 的 demo 數字照留 |
| 2026-11-04 | 題型卡的範例改成示意灰條 | 使用者問範例會不會跟文章變（不會，寫死的「我的一天」）→「改示意」。題目、選項畫成灰條，只留 True／False、A–D 字樣和正解顏色；Generate 前沒有真題，放真句子會被當成預告、換專案也對不上 |
| 2026-11-04 | 拿掉「up to 10 of each」上限 | 使用者「這個限制可以拿掉嗎」。查 4bf77dc2：10 是題庫頁 `bulk-question-type-section.js` 前端自己擋的（`current < 10`、`numVal >= 10` 灰掉加號），不是練習的規則。數字欄只留下限 0、底列那句拿掉。後端一次生成有沒有上限待問工程（見下面第 5 條） |
| 2026-11-04 | 第一步先看課文、再問題型；課文不斷句 | 使用者「先顯示 Article 內容，再問題目；Article 不用斷句」。順序改成 專案 → 名稱 → Article → What to ask；課文從一句一列加編號改成整篇一段 |
| 2026-11-04 | What to ask 兩種題型改成圖示卡 | 使用者「True/False 跟 Multiple choice 用圖示來顯示」。兩張並排的卡，上半是學生會看到的一題縮圖（True/False：我每天八点起床。＋ True｜False，正解綠框；Multiple choice：我几点起床？＋ A–D 四格，正解藍框，題目照第二步的範例），下半 icon ＋ 名稱 ＋ 一句（Is the statement right?／Pick one of four answers）＋ 題數欄；填了題數那張外框換成該型別的顏色 |
| 2026-11-04 | 只考 Comprehension：What to ask 只問題型、教學點 frame 拿掉 | 使用者「只會剩下考 Comprehension，所以就不用問要不要考 Pinyin/Meaning 了，只要問考試的題型」。格子收成兩列：True/False（A statement about the article — students pick True or False）、Multiple choice（A question about the article with four choices），各 0–10；底列寫 *All questions are written from the whole article*，建議值 3＋5。沒有字彙題，教學點 frame 用不到、一起拿掉；第二步題卡上的分類 chip（每題都是 Comprehension）拿掉，Generate more 同一張兩列 |
| 2026-11-03 | 拿掉 Fill in blank：格子 4×2 → 3×2、說明句改字 | v19（2026-10-27）定 Fill in blank 變成獨立的 Sentence Cloze、Comprehension Quiz 不再出。這裡跟著改：WHAT TO ASK 剩 Comprehension／Pinyin／Meaning × True/False／Multiple choice，建議值 3/3、2、2；教學點框說明句 *Pinyin and Meaning questions are written from the points you tick* |
| 2026-11-03 | Custom teaching point 旁加型別下拉 | 使用者「所有的 add 應該都要有詞性」：Vocabulary 那顆型別下拉（八個型別、預設 Word / Vocabulary，照產品 CustomWordDialog）套到八張卡；v17／v20／v21 補上，加的點記 ptype。產品的 teaching-point-picker 沒有型別，交接時要提 |
| 2026-11-02 | From project 那列右邊的 N to add · M words 拿掉 | 使用者「拿掉」。那行是 v4 第二輪自己加的，產品沒有。摺疊列只剩箭頭＋Add teaching points from project。共用元件，v4／v6／v17／v20／v21 一起改 |
| 2026-11-02 | 拿掉「沒字題時教學點 frame 淡掉＋這次用不到」 | 使用者「先拿掉」。Pinyin／Meaning 都 0 題時 frame 跟平常一樣，說明句固定寫 *Pinyin, Meaning and Fill in blank questions are written from the points you tick*（這句的 Fill in blank 要等 v19 那條改） |
| 2026-11-02 | From project 池子裡已在清單的點改綠色 | 使用者「已經選取過的灰色改成綠色的」：原本 opacity .5 灰掉，改成跟勾選 chip 同一套綠框淡綠底、綠勾，仍不能點。共用元件，v4／v6／v17／v20／v21 一起改 |
| 2026-11-02 | 教學點 frame 底下兩行併一行 | 使用者「這裡改成一句就好」：ADD TEACHING POINTS 小標拿掉，From Project 摺疊列改寫 **Add teaching points from project**（右邊 N to add · M words、底下 Custom teaching point 輸入欄不變）。共用元件，v4／v6／v17／v20／v21 一起改；定案記在 `iterations/practice-components.html` §7 |
| 2026-10-23 | 第一輪：拿掉題庫、第一步選專案＋勾教學點＋填各類題數、第二步可改可追加 | 使用者「先做一個 Comprehension Quiz 的新版本，一開始一樣先帶出 teaching point 然後拿掉 Question bank，老師要出什麼題目在 practice 選就好」。從 v14 proposal 分岔 |
| 2026-10-23 | 第二輪：What to ask 格子加回題庫頁的 icon | 使用者「參考舊的 UI 增加 icon」。列頭一顆 40px 圓角 tile（chat_bubble_outline／translate／swap_horiz／edit_note，照 bulk-question-type-section.js 的 CATEGORY_ICONS），用這張卡的紫；欄頭 True/False 綠 check_circle、Multiple choice 藍 list_alt（SECTION_STYLES） |
| 2026-10-23 | 第三輪：題數預設改回全 0 | 使用者問「預設的數字是怎麼來的」。第一輪的 3/3/0/0/2/2/2 是我為 demo 編的；產品題庫頁每類預設 0、老師自己填（step2-configure-generate.js DEFAULT_CONFIG）。改成全 0，Generate 灰著、底列寫「Ask for at least one question」；demo 用的那組改掛 `&filled=1`，第二步以後自動帶 |
| 2026-10-23 | 第四輪：底列加「Not sure? Use a suggested mix」一鍵帶入 | 使用者「好」。總數 0 時底列多一顆連結字，按了帶入 3/3 Comprehension、2 Pinyin、2 Meaning、2 Fill in blank；不預填 |
| 2026-10-23 | 第五輪：那句縮成「Use a suggested mix」 | 使用者「有更簡短的說法嗎」。數字拿掉，按了格子自己會填；hover 的 title 留完整說明 |
