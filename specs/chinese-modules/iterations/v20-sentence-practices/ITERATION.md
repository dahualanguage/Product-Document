# v20 — Sentence 欄四種練習同一份（Scramble ／ Cloze ／ Response ／ Building）

- **功能名稱**：Sentence Scramble、Sentence Cloze、Sentence Response、Sentence Building 的建立流程（四步）
- **網址**：Scramble `…/practice/create/?type=SENTENCE_SCRAMBLE`；Response／Building `?type=FOLLOW_PATTERN&subType=GUIDED_RESPONSE|SENTENCE_BUILDING`；Cloze 產品裡還沒有
- **日期**：2026-10-28（開版）
- **分岔自**：v19 `proposal.html`（＝v7 Scramble ＋ 填空）整份複製，再把 v12 Sentence Response／v15 Sentence Building 的第二、三步搬進來
- **設計檔**：
  - `choose-practice-type.html`（Choose Practice Type 九張卡，2026-10-29；從 `handoff/choose-practice-type/` 複製只加 Cloze）
  - `proposal.html`（**提案**，一份檔四種型別：`?type=scramble|fillin|response|building`，預設 scramble；其餘參數同 v7／v19，response／building 另有 v12 的 `&regen=1`、`&audio=1`、`&tr=`、`&pin=`、`&sc=1`）
  - 基準檔不搬，留在各自的資料夾當對照組：v7 `create-scramble.html`、v12／v15 `create-follow-pattern.html`、v19 `baseline-fill-in-blank.html`
- **程式碼基準**：dahua-dash `origin/develop` @ `7528c30f`（v19 fetch 的那一版；v12／v15 是 `c8179072`）
- **狀態**：**2026-10-30 第三輪**（Building 第一步加回例句來源、例句＝Suggested answer）。**2026-10-29 第二輪**（Response／Building 第一步不用例句；TEACHING POINTS 小卡改成「− 數字 +」＋ 大字總數；spec 改成嵌入提案＋tab；未 commit、未部署）。使用者定位：四種結構一樣、工程會一起開發，所以併成一份。v7／v12／v15／v19 留著當紀錄不再更新（index 卡標「不再更新 · 併入 v20」反灰），之後只改這一版；`spec.html` 照 v16 版型重寫（頂欄、左側目錄、十一節），提案用 tab 嵌在第 4 節

## 使用者定的（2026-10-28）

| 題目 | 定案 |
|---|---|
| 版本 | 四個跟 sentence 有關的 practice **統一成一個 v**；之後改共用的東西只改一處 |
| 第一步 | ~~四種都要有 Example sentences from teaching points~~ → 2026-10-29 改只有 Scramble／Cloze → **2026-10-30 再改：Scramble／Cloze／Building 三種有兩張來源卡，只有 Response 沒有**。Building 的 Suggested answer 可以直接吃教學點的例句（使用者「Sentence Building 的答案可以吃 teaching point 的例句」）、Question 照教學點寫；Response 的題卡還要 Question＋Pattern，例句只能當答案、省不到什麼，維持不用 |

## 第一輪（2026-10-28）

- **一份檔**：`?type=` 切型別。標題、icon、第二步的名字（Edit Sentences／Question Review）、教學點 chip 的顏色（Sentence 欄粉／FOLLOW_PATTERN 的 teal）跟著換；狀態欄最左邊可以直接切四種。
- **第一步 Teaching Points**：專案多選、名稱、How many sentences／questions（數字欄＋up to 20＋怎麼分）、每專案一個 frame 勾教學點、Add teaching points。單位字 sentence／question 照型別。Scramble／Cloze 多兩張來源卡 **Generate new sentences ｜ Example sentences from teaching points**（選了例句，frame 裡攤開例句清單勾選）；Response／Building 沒有（10/29 第二輪定）。
- **第二步**：眉標 TEACHING POINTS · N ＋ 每點一張小卡 −／+——四種同一個元件 `renderTpCards`（之後統一改就改這裡）。底下：scramble＝v7 的句子卡（剪刀、Edit、Delete）；fillin＝v19 的句子卡（教學點＝空格、選項詞塊列）；response／building＝v12 的題卡（Question／Pattern／Suggested answer 三框，Building 沒 Pattern、Question 唯讀）。
- **第三步 Settings**：scramble／fillin 工具列 PINYIN ‖ SPEED／VOICE ‖ MAX TRIES；response／building 多 PRACTICE MODE 與 TRANSLATION（v12）。畫布各自：拼句（v7）／填空（v19）／題卡＋錄音鈕（v12）。
- **第四步 Assign**：一樣。
- 沒改設計、只是合併：v7／v12／v15／v19 各自定過的東西都原樣搬過來。

## 要問工程的（從各版帶過來）

- **E1**（v7 E6／v12 E1）題數上限 20、每點 5 是前端還是後端擋？四種共用同一個 `MAX_QUESTION_COUNT`？
- **E2**（v19 E1）Sentence Cloze 的生成管線能不能沿用 Follow Pattern 的「每點生一句＋教學點挖空」，再多生三個干擾詞？
- **E4**（2026-10-30）Building 選例句時，例句直接當 Suggested answer、Question 由教學點寫——後端 Follow Pattern 的 SENTENCE_BUILDING 生成能不能吃一句現成的句子當答案？
- **E3**（v19 E3）題庫拿掉 Fill in blank 之後，舊題庫裡已有的題怎麼辦（跟 v16 一起算）。

## Change log

| 日期 | 改了什麼 | 說明 |
|---|---|---|
| 2026-10-30 | Scramble／Cloze 第三步加 Translation（Shown｜Hidden｜Choice by student） | 使用者「Sentence Scramble／Sentence Cloze 的 setting 可以設定翻譯開關學生選擇」。工具列 Pinyin 旁邊多一組 Translation，三個選項跟 Response／Building 同一套；畫布在 Listen 底下多一行翻譯；Choice by student 時學生端 Settings 面板多 Translation 開關（跟 Pinyin 一樣）。預設 Choice by student、學生端開關預設開（跟 Response／Building 一樣）。這樣四種的工具列只差 Response／Building 的 Practice mode |
| 2026-10-30 | Building 第一步加回「Example sentences from teaching points」，例句＝Suggested answer | 使用者「Sentence Building 的答案可以吃 teaching point 的例句」。選了例句後第二步每句一題：Suggested answer 是那句例句（詞塊切法同 Scramble、教學點高亮、卡上標 Example）、Question 照教學點寫（請用「起床」造句。）；該點份額不夠的才生。Response 維持不用。例句卡底下小字 each one becomes a suggested answer。E4：後端 Building 生成能不能吃現成的句子當答案 |
| 2026-10-29 | spec 改成 v16 同一套版型 | 使用者「這頁 spec 的排版可以跟其他頁的一樣嗎？照 v16」。頂欄＋左側目錄＋十一節（為什麼併、範圍、名詞對照、提案 tab 嵌入、四步、哪裡不一樣、教學點小卡規則、九張卡、已定與待定、要問工程、檔案）。嵌入的提案留在第 4 節，九張卡 tab 排第一 |
| 2026-10-29 | 名字 Sentence Fill-in → **Sentence Cloze** | 使用者「fill in 改成 Cloze」。改標題、九張卡、spec tab、index 卡；網址參數 `?type=fillin` 與程式裡的 `fillin` 不動；v19 凍結不改、舊名留著當紀錄 |
| 2026-10-29 | Sentence 欄四張的順序 | 使用者定：Scramble、Cloze（上列）／ Building、Response（下列） |
| 2026-10-29 | Choose Practice Type 的 Sentence 欄改排 2×2 | 使用者「Sentence 的卡片比較多了，改成 2x2」。格子變五格寬，Sentence 欄佔兩格、標題線橫貫兩格，四張卡兩列；對話框 1080 → 1280 讓卡片寬度跟原來差不多。欄高 1／2／2／2 |
| 2026-10-29 | Choose Practice Type 第九張卡 Sentence Cloze | 使用者「這裡要多新增 fill in 的，把這個新增後也放在 spec」。`choose-practice-type.html` 從 handoff 整份複製，Sentence 欄加第四張（示意圖：一句話挖一個空、底下詞塊挑一個；文案 Pick the word that completes the sentence，跟 v19 學生畫布的提示句同一句）。handoff 那份沒動。spec 上排 tab 最右邊多一顆 |
| 2026-10-29 | 小卡裡的單位字拿掉、卡縮窄一列七張 | 使用者「sentences 是不是不用一直出現」，討論後定：眉標右邊已有 Sentences · N，卡裡只留 chip ＋ 步進器「− 2 +」；卡最小寬 170 → 128，七個點一列排完 |
| 2026-10-29 | 第二輪：第二步清單眉標的副標拿掉 | 使用者「拿掉全部的副標」。Sentences · N 後面的「In this order · drag a card to reorder · scissors to adjust blocks · click pinyin to fix tones」、Questions · N 後面的「Sentence Response · students answer with the pattern · …」都刪，眉標只剩標題＋橫線。四種一起 |
| 2026-10-29 | 第二輪：TEACHING POINTS 小卡統一改——數字夾在 − + 中間、眉標右邊大字 Sentences · 18 | 使用者「統一優化這個元件：−1+ 加減在數字旁邊；放大目前的題數 Sentences · 18」。原本是左邊「2 sentences」、右邊 −／+ 分開兩頭，總數只有小字 Up to 20 in total。改成每張卡 chip ＋ 步進器「− 2 +」＋ 單位字；眉標右邊 Sentences · **18**（22px）＋ 小字 up to 20，到頂轉琥珀。四種同一個 `renderTpCards`，一次改完 |
| 2026-10-29 | 第二輪：Response／Building 第一步拿掉兩張來源卡 | 使用者「我發現 Response／Building 其實不用直接用 teaching point 的例句」。題卡是 Question／Pattern／Suggested answer，例句只能當 Suggested answer、題目和 Pattern 還是得另外生，省不到什麼。E2 跟著刪 |
| 2026-10-29 | spec 改成直接嵌入提案，tab 切四種練習與四步 | 使用者「這兩個表格我看不懂，spec 中直接嵌入 practice 的 frame 用 tab 區分」。10/28 的四種怎麼分表格、元件圖、小卡示意都拿掉 |
| 2026-10-28 | spec 畫出元件圖；v7／v12／v15／v19 index 卡標不再更新、反灰 | 使用者「我的意思只是要聚集這四種練習，因為結構都一樣，工程師會一起開發」「在 spec 裡畫出元件」「v7／v12／v15／v19 留著當紀錄不再改，標註不再更新反灰」。設計沒改 |
| 2026-10-28 | 開版：四種合一份、v12／v15 補回例句來源卡 | 使用者「統一 4 個跟 sentence 有關的 practice，版本統一成一個 v；有些沒有 Example sentences from teaching points，都統一改成有」。從 v19 複製，搬入 v12 的 Question Review、FP Settings、ProcessingDialog；TEACHING POINTS 小卡抽成一個 `renderTpCards` |
