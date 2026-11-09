# v18 — Open-ended Questions：拿掉題庫、進練習才生成

- **功能名稱**：New Open-ended Questions（`QA`）建立流程
- **網址**：https://dahua-dash-dev.web.app/dashboard/practice/create/?type=QA
- **截圖**：沿用 v13
- **分岔自**：v13 `proposal.html`（外殼、Stepper、第一步欄位、第二步的 R11 工具列＋學生視窗、Assign 步全部沿用）；第一步的格子、教學點 frame、Generating、第二步的題目卡＋Generate more 跟 v17 同一套
- **日期**：2026-10-23
- **範圍與理由**：`../v16-remove-question-bank/spec.html`。這一版只畫 Open-ended Questions 那條流程；Comprehension Quiz 在 v17
- **設計檔**：`proposal.html`（`?step=` 從 1 數；參數見檔頭）。基準檔沿用 v13 `create-qa.html`，不重做
- **狀態**：**2026-11-04 起 Open-ended Questions 的唯一版本**（v13 併進來；v13 的 `create-qa.html` 是基準）。提案第一輪，未部署、未 commit

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
| 2026-11-09 | What to ask 從兩張變四張 2×2：下排「Write a …」老師自己出題（同 v17） | 使用者「Open-ended Questions 也新增這樣的功能」。上排照舊（AI 出的 Content Base、Extension），下排 **Write a Content Base question**（*Your own question about the article — not AI*）、**Write an Extension question**（*Your own question about the student’s life — not AI*）：示意是虛線的空題目欄＋空的 Suggested answer 欄、灰底，鉛筆 icon 用該類別的顏色，題數 − N ＋ 同一套；總數四格相加。填幾題，第二步就在最後出幾張空白題卡（類別固定、掛 **Yours**、直接打開），寫題目和建議答案；拼音那行改寫 *Pinyin and audio are made from your question when you save*。題目或建議答案空著時 Next 灰著、眉標寫 *N of your own questions still need a question and a suggested answer before you can continue*；手寫題不掛 Edited。只填手寫題時第一步主鈕是 Next、不跑 Generating。Generate more 面板同一張四卡，手寫的接在最後、不掛 New。demo：`&own=CB,EX` |
| 2026-11-04 | 上下鈕搬到左邊把手那一欄 | 使用者「上下擺在這裡」（指拖曳把手）。題卡左邊一條直欄：∧、把手、∨，垂直置中；右邊只剩 Edit、Delete |
| 2026-11-04 | 題號膠囊改灰階、加上移／下移鈕 | 使用者「把 Q1 的 tag 改成灰階，增加往上往下改順序的按鈕」。Q 膠囊從綠底白字改灰底深灰字；題卡右邊 Edit 前多 ↑ ↓，第一題的 ↑、最後一題的 ↓ 灰掉；拖曳換序照留 |
| 2026-11-04 | 第三步學生預覽放上課文 | 使用者「把這一頁的預覽頁放上文章」（附產品學生端截圖）。照 `assignments/content/qa/content-window.js`：視窗左欄 Content（書本 icon、標題、底線、逐詞拼音，Pinyin 設定控制顯示），右欄題目（標頭改成 N Questions＋齒輪、guide phrase、題目泡泡、Play、Question x of N）。逐詞拼音用 pinyin-pro 產、只有「我的一天」有；Audio only 時左欄收掉（學生端純聽力不看課文——待確認） |
| 2026-11-04 | 第二步題卡拿掉播放鍵 | 使用者「在 Edit Questions 不用播放」。題卡右邊剩鉛筆、✕；聽題目在第三步 Settings & Preview 的學生視窗 |
| 2026-11-04 | Extension 不用灰色 | 使用者「Extension 示意不要用灰色」。示意卡底、icon、選中框、學生回答條改青綠（#F0FDFA／#CCFBF1／#0F766E／#14B8A6）；第二步的 Extension 小標同色，兩步對得起來 |
| 2026-11-04 | 題數欄改成「− 數字 ＋」 | 使用者「這個模組改成 - 1 ＋，兩邊的都改」。樣子照 v20 的 .stp；數字仍可直接打；0 時 − 灰掉。v17／v18 同一套，Generate more 也是 |
| 2026-11-04 | 照 v17 的原則改一輪 | 使用者「先依照 Comprehension Quiz 剛剛修改的原則修改」。①第一步先看課文、再問題目；課文整段不斷句、demo 加長成四段（Content Base 題的事實都還成立）②What to ask 兩種題目改成示意卡（Content Base：課文灰條裡一段標色＋問題條；Extension：問題條＋學生自己的回答條），總數大字擺在卡片上方 ③拿掉 10 題上限、底列原因、Use a suggested mix ④第二步建議答案直接展開（唯讀，鉛筆打開才改）、眉標提示句拿掉、Generate more 加重。Content Base／Extension 的類別 chip 保留（兩種都有，有資訊量） |
| 2026-10-23 | 第一輪：四步、第一步選專案＋勾教學點＋填兩類題數、第二步可改可追加、第三步只留工具列＋視窗 | 使用者「也做 Open-ended Questions 沒有 Question bank 的版本」。從 v13 proposal 分岔，格子與卡片跟 v17 同一套；題數預設 0、Use a suggested mix 直接套 v17 第三、四、五輪的定案 |
| 2026-10-23 | 第二輪：第一步的教學點 frame 拿掉 | 使用者「就不用 teaching point 了」。What to ask → Article → Generate；Generate more 的說明不再提教學點 |
| 2026-10-23 | 修：按 Generate 到不了第二步 | 使用者「現在沒辦法到第二步」。底欄少了「1 選單打開」那顆連結，render 最後一行 el('l0d') 是 null 就炸，計時器沒掛上。補上連結，兩個檔的那兩行改成 `el(id)?.classList`。用 CDP 走過「Use a suggested mix → Generate」和「從頭選專案 → 打字 → Generate」兩條路確認到第二步 |
| 2026-10-23 | 第三輪：格子底列的說明句拿掉 | 使用者「整句拿掉留總數和上限」。底列只剩「N questions · up to 10 of each」，擋住時才多一句原因 |
