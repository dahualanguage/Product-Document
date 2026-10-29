# v19 — Sentence Fill-in（新練習型別：把題庫的 Fill in blank 變成 Sentence 欄的練習）

- **功能名稱**：Sentence Fill-in（全新練習型別，2026-10-27 使用者定）。來源是題庫（Question Bank）選擇題的「Fill in blank」這一類（程式 key `usage`）
- **網址**：產品裡還沒有這條流程。它要取代的現行畫面：題庫精靈 https://dahua-dash-dev.web.app/dashboard/questions-bank/ 第二步的 Fill in blank 題數格、第三步的題目卡；學生端 Comprehension Quiz 答 Fill in blank 題的畫面
- **截圖**：無（基準檔照程式碼畫）
- **日期**：2026-10-27（登記＋基準）
- **分岔自**：提案（還沒畫）會從 v7 `proposal.html`（Sentence Scramble 四步）分岔；第二步的 TEACHING POINTS 小卡跟 v7／v12／v15 同一個元件
- **設計檔**：
  - `proposal.html`（**提案**，第一輪 2026-10-27：從 v7 `proposal.html` 整份複製再改；`?step=1|2|3|4`，參數同 v7：`&sel=1`、`&n=12`、`&ex=1`）
  - `baseline-fill-in-blank.html`（**基準**：Fill in blank 今天出現的三個畫面；`?view=generate|questions|student`、`&picked=B|C`）
  - 題庫這邊的對照：v14 `create-comprehension-quiz.html`（Comprehension Quiz 第二步的題目卡，裡面有同一題 usage）
  - Choose Practice Type 對話框：`handoff/choose-practice-type/choose-practice-type.html`（八張卡；這一版要加第九張）
- **程式碼基準**：dahua-dash `origin/develop` @ `7528c30f`（2026-10-27 fetch）
- **狀態**：**2026-10-28 併入 v20**（`../v20-sentence-practices/proposal.html?type=fillin`，之後在那裡改；這份停在第二輪）。**2026-10-28 提案第二輪**（選項列沒標題、干擾詞固定 3 個、只能改字；未 commit、未部署）。TEACHING POINTS 小卡元件等使用者定改法，到時候跟 v7／v12／v15 一起改

## 使用者定的（2026-10-27，討論後）

| 題目 | 定案 |
|---|---|
| 放哪裡 | **全新的練習型別**（不是 Sentence Response 的子型別）。Choose Practice Type 變九張卡，Sentence 欄第四張；enum 要新增 |
| 學生怎麼答 | **從詞塊裡挑一個填進空格**，像 Sentence Scramble 的 tiles（不是四選一、不是打字） |
| 挖空挖什麼 | **固定挖教學點本身**（生詞或語法點；兩槽的點每槽一個空格），老師不能移動挖空位置 |
| Comprehension Quiz 那邊 | **拿掉 Fill in blank**：v17 的 4×2 格子變 3×2（Comprehension／Pinyin／Meaning × True/False／Multiple choice） |
| 名字 | **Sentence Fill-in** |
| 結構 | 跟 Scramble／Response／Building 同一條四步：Teaching Points → Edit Sentences → Settings → Assign Practice；第二步用同一個 TEACHING POINTS 小卡（−／+）元件 |

## 提案第一輪（2026-10-27）

跟 v7 Sentence Scramble 同一條四步，只有「句子怎麼考」不一樣：

- **第一步 Teaching Points**：跟 v7 一樣（專案多選、名稱、總句數上限 20 輪流分、句子從哪來兩張卡、勾教學點、Add teaching points）。
- **第二步 Edit Sentences**：TEACHING POINTS 小卡 −／+ 跟 v7 一樣（同一個元件）。句子卡沒有剪刀：**教學點在句子裡的位置就是空格**——那個詞塊粉紅虛線框、字和拼音粉紅，老師看得到答案；底下一列選項詞塊（沒有標題，跟題庫一樣）：答案詞塊（粉紅、打勾）＋ 干擾詞塊固定 3 個；編輯模式多一欄 Distractors（頓號分隔、只能改字，不能加減）。兩槽語法點（一……就）兩個空格、兩個答案詞塊，干擾詞預設 才／也／都。中文改了存檔後拼音、翻譯、空格都重算（同 v7 的 Auto-update on save）。
- **第三步 Settings**：工具列跟 v7 一樣（PINYIN ‖ SPEED／VOICE ‖ MAX TRIES），畫布＝學生的填空畫面：提示句 *Pick the word that completes the sentence.*、Listen to sentence、句子照排、空格是粉紅虛線 slot、底下詞塊池＝答案＋干擾詞打散、Check。Max tries 的 tooltip：*After the last try the answer is shown and the practice moves on*。
- **第四步 Assign**：跟 v7 一樣。
- 沒畫的：Choose Practice Type 對話框的第九張卡（Sentence 欄第四張，icon edit_note、粉紅）；v17 Comprehension Quiz 格子拿掉 Fill in blank 那一列（4×2 → 3×2）；學生端答對／答錯／揭曉的狀態。

## 現況（照程式碼）

- Fill in blank 不是練習，是題庫選擇題的四類之一：`MULTI_CHOICE_CATEGORIES` = Comprehension／Fill in blank（usage）／Pinyin／Meaning（`src/enum/questions-bank.js`）。True/False 沒有這一類。
- 題庫精靈第二步（`step2-configure-generate.js` → `bulk-question-type-section.js`）：Multi-Choice 區塊裡一列 **Fill in blank · Select the correct word**，−／+ 0–10。字是後端從專案的教學點隨機抽（v17 查到：commerce-api `getGenerateQuestions` 帶 vocab → dash-py 隨機 sample），老師只填題數。
- 題目形狀：一句話挖掉一個詞（全形底線 ＿＿＿）、選項 A–D、正解一個（`choice` 物件 ＋ `answer` 陣列）。手動加題的表單（`multiple-choice-form.js`）選項 2–6 個。
- 第三步題目卡（`multi-choice-questions.js`）：題幹 TextField（label Question n、粗體）＋ 選項 Grid 6/6 Paper，正解 info 色框＋ check 圓；hover 出刪除鈕。
- 學生端（`assignments/content/mc/index.js` QuestionScreen）：跟其他選擇題一樣答——型別 chip Multi-Choice ＋ 分類 chip Fill in blank、灰底題幹框、四列選項，點了立刻判（正解綠、選錯紅、其餘淡 .5），不能改；Previous／Next。沒有音檔、沒有拼音（課文面板的 Pinyin switch 只管課文）。
- 練習型別 enum（`src/enum/practices.js` `PRACTICE_TYPES`）沒有克漏字；`PRACTICE_TYPE_ENTRIES` 八張卡（`practice-type-labels.js`），Sentence 欄 ink `#EC4899`／tint `#FBD5E8`／wash `#FEF2F8`／label `#BE185D`。

## 要問工程的

- **E1** 新型別的生成管線：Follow Pattern 已經會「對每個教學點生一句＋把教學點挖空成 ＿＿＿」（`follow-pattern-questions.js` 的 Pattern）。Sentence Fill-in 能不能沿用它生句子，再多生干擾詞塊？干擾詞塊幾個（Scramble 的 tiles 是句子本身的詞，這裡要另外生）？
- **E2** 題數上限 20、每點 5：跟 v7／v12 同一個 `MAX_QUESTION_COUNT`？（v12 E1 還沒回）
- **E3** 題庫拿掉 usage 之後，舊題庫裡已有的 Fill in blank 題怎麼辦（v16 的拿掉題庫提案一起算）。

## Change log

| 日期 | 改了什麼 | 說明 |
|---|---|---|
| 2026-10-28 | 「Word bank」標籤拿掉 | Word bank 是我取的，而且撞到產品既有功能（學生的 Word Bank：側欄入口、New words in your Word Bank 提示、Word Bank Game）。題庫的 A–D 選項畫面上沒有標題，這裡也不標 |
| 2026-10-28 | 選項列照現行題庫收斂 | 第一輪的 × 拿掉／Add word 是我自己加的，產品裡沒有（題庫 Fill in blank 固定四個選項、老師只能改選項文字）。使用者定「照原本的邏輯」：干擾詞固定 3 個、編輯模式只能改字 |
| 2026-10-27 | 提案第一輪 | 從 v7 proposal.html 分岔：第二步句子卡改成「教學點＝空格」＋ 選項列（答案＋干擾詞、可加減）；第三步畫布改成填空（句子照排、虛線 slot、詞塊池）；小卡元件原樣留著等統一改 |
| 2026-10-27 | 登記＋基準檔 | 使用者定五條（全新型別、tiles 填空、固定挖教學點、Comprehension Quiz 拿掉 Fill in blank、名字 Sentence Fill-in）。基準檔 `baseline-fill-in-blank.html` 照 7528c30f 複刻題庫第二步生題格、第三步題目卡、學生答題三個畫面 |
