# Vocabulary Quiz — Engineer Handoff

老師建立 **Vocabulary Quiz** 的那條流程（New Practice → Vocabulary Quiz；`?type=VOCABULARY&subType=MULTIPLE_CHOICE`）。四步裡這一包真正動的是中間兩步：

```
現行  Vocabulary → Question Types → Settings → Assign Practice
提案  Teaching Points → Question Types → Questions → Assign Practice
```

1. **第一步 Teaching Points**：跟 Vocabulary Mirroring 同一支 `step-one-vocabulary.js`，**整步照 [Vocabulary Mirroring 那一包](../vocabulary-mirroring/) 的第一步做**（多選專案、名稱 A + B、勾 teaching point、Add words、Next 生成、回頭可改），這裡不重寫。
2. **第二步 Question Types**：Random／Advanced 兩種模式與逐字矩陣拿掉，收成三個往下開的決定——**出幾題** → **怎麼挑** → **哪些題型必考**；必考 chip 上可以預覽學生拿到的那一題。
3. **第三步 Questions**（現名 Settings，裡面沒有設定）：題目清單跟第二步是**同一份資料**——刪一題＝取消那一格、Add Question＝選字＋選題型、Swap type、每題一顆 Preview；標出必考與隨機補的題。
4. **第四步 Assign**：八種共用，照 [Content Mirroring 那一包](../content-mirroring/)。

**這不是重寫，是在現有流程上改。有後端**：回第二步改選擇時只生新的格子、不重生整份（現在會丟掉第三步的刪除與排序）；老師的「出幾題／怎麼挑／必考哪些」要存下來；Add Question 要能加非文字題幹的題型。契約在 [`API-CONTRACT.md`](API-CONTRACT.md)。程式碼基準：`dahua-dash` `origin/develop` @ `b130ab5b`（2026-10-05；這張卡的檔案從 `3e821fa4` 起沒動）。

- 原型：[`vocabulary-quiz.html`](vocabulary-quiz.html)，`?step=1|2|3|4` 從 1 數。第一步同 Vocabulary Mirroring 那一包（`&sel=1`、`&dd=1`、`&pool=1`、`&gen=1`、`&back=1`）；第二步 `?step=2` Use all、`&fewer=20` Set a number 20 · Random、`&fewer=20&must=1` Must cover 剛切過來（一個都沒勾、0 題）、`&fewer=20&must=CN_TO_EN,AUDIO_TO_CN` 勾了兩種（必考 10 題 ＋ 隨機補 10 題）、再加 `&pv=AUDIO_TO_CN` 開題型預覽；第三步 `?step=3&fewer=20&must=CN_TO_EN,AUDIO_TO_CN`、`&add=1` Add Question、`&pvq=4` 第四題的 Preview；第四步同 Content Mirroring 那一包（`&pick=3b,4a&roster=4a&assigned=1`、`&review=1`）。頁底狀態列每個狀態都有入口。
- 對照組（現行畫面的複刻）：[Question Types · Advanced](https://project-logeg.vercel.app/specs/chinese-modules/iterations/v6-vocabulary-quiz/create-quiz.html?step=1&adv=1)、[Settings](https://project-logeg.vercel.app/specs/chinese-modules/iterations/v6-vocabulary-quiz/create-quiz.html?step=2)。
- 姊妹包：[Vocabulary Mirroring](../vocabulary-mirroring/)（第一步）、[Content Mirroring](../content-mirroring/)（第四步、頁腳）、[practice-shared](../practice-shared/)（S1／S2／S8／S9 適用；S3–S7 的 Settings 工具列**不適用**，Quiz 沒有顯示／音檔設定）。

---

## 已定的規則

| 題目 | 定案 |
|---|---|
| 一題是什麼 | 一個**字 × 一種題型**＝一格＝一題。八種題型（`MC_QUESTION_TYPES`，順序照 `MC_QUESTION_TYPE_LABELS`）。上限 ＝ 字數 × 8 |
| 哪些字 | 第一步勾的 teaching point，**pattern 類（GRAMMAR／PHRASE／OTHER）不進來**（同現行 `isPatternVocabEntry`） |
| 圖片題型 | 字的圖還沒好就不能出（同現行 `isImageReadyForMc`）；第二步不擋、第三步 Add Question 裡那兩種灰掉寫 *No image yet* |
| 出幾題 | **Set a number**（預設選中，預設 20、夾在 1～上限）或 **Use all question types**（＝ 每一格都是題） |
| 怎麼挑（Set a number 才有） | **Random**（在全部格子裡隨機）或 **Must cover question types** |
| Must cover 怎麼填 | 切過來時一種都沒勾＝ 0 題。勾了題型後：**照勾的順序，一種題型逐字填滿再換下一種**，填到題數為止；勾的加起來不到題數，差額**從其餘格子隨機補**。老師多勾少勾，重算一次 |
| 哪些是必考、哪些是補的 | 第三步題目卡標 **Must cover**（題型在必考清單裡）或 **Random pick**（補的）；Random／Use all 時都不標 |
| 第三步能做什麼 | 拖曳排序、刪除（最後一題不能刪）、**Swap type**（＝現行 Raffle：同一個字換成另一種文字題幹題型，隨機）、**Add Question**（自己選字＋選題型，不是隨機）、每題 **Preview**。必考的題沒有 Swap type |
| 同字同題型可以兩題 | 可以（現行 Add Question 本來不查重複）。第二步數的是格、第三步數的是題，加了第二題兩邊會差一 |
| 回第二步改了再 Next | **只生新勾的格子**；取消的格子那幾題拿掉；其他題的順序與刪除**留著**。沒改就什麼都不做（同現行） |
| 預覽 | 對話框裡照學生端 `mc/index.js` 的 `QuestionScreen` 畫**一題**（題型 chip、題幹框、四個選項）；不畫進度條與 Previous／Next |
| 不在這一包 | Test mode（Comprehension Quiz 才有）；學生端畫面不動 |

---

## 1 · 第一步 Teaching Points

照 Vocabulary Mirroring 那一包的第一步。Quiz 的差別只有一個：`showReadModes={!isVocabMC}`（沒有 Read Sentences Only），其餘照抄。第一步 Next 建 practice 時 subType 仍先不送（同現行）。

---

## 2 · 第二步 Question Types（`vocabulary-mc-question-types-step.js` 換掉）

```
HOW MANY QUESTIONS ─────────────────────────────────────────────
┌ ⓘ  5 words × 8 question types = up to 40                      ┐
│    [起床 qǐ chuáng] [早饭 zǎo fàn] [上课 shàng kè] [图书馆 …] [运动 …]   │   ← 唯讀，改字回第一步
└────────────────────────────────────────────────────────────────┘
[ ⚙ Set a number  [20] of 40 ]      [ ▦ Use all question types ]

HOW TO PICK 20            （Set a number 才出現）
[ ⤮ Random ]                        [ ☑ Must cover question types ]

MUST COVER THESE TYPES   🖥 see what the student gets     （Must cover 才出現）
[☐ 🈶 Chinese → Translation      🖥] [☐ 🖼 Image → Chinese            🖥] …（八顆，四欄；放不下自動減欄）
Must types give 10 questions · the other 10 are picked at random from the rest to reach 20
```

- 眉標只有一條 **HOW MANY QUESTIONS**。灰底備注欄先講 40 是哪來的（字數、題型數粗體，結果更大、綠），底下列出這次要考的字（中文＋拼音的唯讀 chip，沒有刪除鈕）。
- 選項卡照產品 `function-selector.js` 的可點 Card：icon 方塊 ＋ 標題，選中 ＝ 綠外框 ＋ 淡綠底，高 60px，**沒有 radio 圓圈、沒有副標**。
- **Set a number**：題數欄在卡裡（數字 input，blur／Enter 套用，夾在 1～上限），右邊 *of 40*。預設選中、預設 20（上限不到 20 就是上限）。點 Use all 再點回來，題數回到 20。
- **Use all question types**：每一格都是題，底下兩段都不出現。
- **HOW TO PICK N**：Random｜Must cover question types。切到 Must cover 時必考清單清空。
- **MUST COVER THESE TYPES**：八顆 chip（四欄 grid，`minmax(250px, 1fr)` 自動減欄）。整顆點＝勾／取消必考（checkbox 圖示 ＋ 題型 icon ＋ 名字 ＋ 拼音題型的 *Advanced* 小標，窄時掉到第二行）；**右端一顆螢幕小圖示一直顯示**，點了開預覽對話框（不會動到勾選）。小標旁藍字 *🖥 see what the student gets*。
  - 底下一行藍字狀態：一個都沒勾 *Nothing is a must yet — tick the types every word should be asked in*；勾了但不夠 *Must types give 10 questions · the other 10 are picked at random from the rest to reach 20*；夠了 *Must types fill every question*。
- 這一步**沒有矩陣**。逐題的細調去第三步。
- 頁腳 Next ＝ 把格子的集合（契約 §1）＋ 老師的三個決定（契約 §2）送出去生題；沒改就直接進第三步。

### 題型預覽對話框

標題 ＝ 題型名（帶 icon），中間灰底一張卡，照學生端 `QuestionScreen`：題型 chip、題幹框（文字 h5 置中／圖片 maxHeight 200／音檔 64px 綠色播放鈕 ＋ *Click to play audio*）、四個選項單欄直排（32px 圓字母）。題目用第一個能出這種題型的字拼。底部只有 Close。

---

## 3 · 第三步 Questions（`vocabulary-step-three-section.js` 的 `isMultipleChoice` 分支 ＋ `mc-questions-preview.js` 換掉）

- 步驟名 **Settings → Questions**（`VOCABULARY_MC_STEPS[2]`）。Practice Name 不在這一步（已在第一步）。
- 眉標 **QUESTIONS · 20**，右邊 *In this order · drag a card to reorder*。
- **題目卡固定尺寸**：

```
⋮⋮ (Q1) 起床  [🈶 Chinese → Translation] [☑ Must cover]                     [🖥 Preview] 🗑
   ┌────────┐  A. library                     B. get up ✓
   │  起床   │  C. breakfast                   D. exercise
   └────────┘
```

  - 標頭：拖曳把手、Q 號（主色圓）、**單字**、題型 chip（帶 icon）、狀態 chip（**Must cover** 綠／**Random pick** 藍，互斥，Random／Use all 時沒有）、**Swap type**（外框小鈕，必考的題沒有）；右端 **Preview**（外框小鈕、螢幕圖示）、紅色刪除。
  - 題幹一律在左邊 120 × 90 的框：文字題幹印字、圖片題幹印圖、音檔題幹一顆播放鈕。右邊選項兩欄四格、正解綠框 ＋ ✓（老師端看得到正解，學生端看不到）。
- **刪除**：拿掉這一題；那個字那種題型沒有別的題了，第二步的格子跟著取消。最後一題不能刪（*At least one question is required*）。
- **Swap type** ＝ 現行 Raffle，只改名：同一個字換成另一種**文字題幹**題型（`TEXT_STEM_TYPES` 裡隨機、排除目前的），選項重拼。tooltip 註明 *(product: Raffle)*。
- **Add Question** 對話框：*Pick a word and a question type. It ticks that cell in Question Types; a type already in the quiz gets a second question.* 兩列 chip：**Word**（單選）、**Type**（八種單選；已在考卷裡的照樣可選、右邊小字 *IN QUIZ*；沒圖的字的兩種圖片題型 disabled、tooltip *No image yet*）。按 **Add question** 加在清單最後。
- **Preview**：跟第二步同一個對話框，看的就是**這一題**（同一個字、同一組選項），標題 *Q4 · Audio → Chinese · 起床*。
- 頁腳這一步仍是 **Save**（倒數第二步真的送出：整份題目清單，契約 §3）。

---

## 4 · 第四步 Assign Practice

跟 Content Mirroring 那一包完全一樣，八種共用。班名色用 Vocabulary 欄的 label `#8F6209`。

---

## 不要順手改的

- **enum 值不動**：`VOCAB_MC_*` 八個、`MC_QUESTION_TYPE_LABELS`、`TEXT_STEM_TYPES`、`IMAGE_STEM_MC_QUESTION_TYPES`。
- **題目資料的形狀不動**：`multipleChoiceQuestions[]{ questionType, stem{type,value,s3Path}, options[]{label,value,isCorrect}, correctAnswer, vocabSource }`；學生端 `adaptVocabMCQuestions` 照舊。
- **學生端 `MCPractice` 不動**（只有契約 §5 那一行顏色，可做可不做）。
- 沒有 Test mode；`examMode` 不傳。
- Vocabulary Mirroring 那條（`subType=MIRRORING`）第二、三步不受影響；第一步元件共用是預期的。

---

## 動工順序

| 階段 | 內容 | 可否獨立上線 |
|---|---|---|
| **1** | 第一步：Vocabulary Mirroring 那一包的第一步（同一支檔案，做了就有） | 可 |
| **2** | 第二步：三層選項卡 ＋ 必考 chip ＋ 預覽對話框；送出時把格子集合算出來（契約 §1）。生成邏輯先不動 | 可——後端沒好時行為跟現行一樣（改了就整份重生） |
| **3** | 第三步：改名 Questions、題目卡、Must cover／Random pick chip、Swap type、Add Question 選題型、Preview | 可——Add Question 非文字題型要等 4 |
| **4** | 後端：老師的三個決定存起來（契約 §2）、**改選擇只生新格子**（契約 §3）、Add Question 加圖片／音檔題型（契約 §4） | — |

---

## 要問後端的

| # | 題目 | 卡住哪一項 |
|---|---|---|
| E1 | 圖片題型在圖還沒好時勾了，後端是**排隊等圖好了再生**，還是**略過**？現在 tooltip 寫 *generated once available* | 第二步 Use all／Must cover 的題數會不會對不上第三步 |
| E2 | 能不能**只生新增的格子**、保留其他題的順序與刪除？現在 `mcQuestionTypeSelection` 一變就整份重生 | 契約 §3；第三步的工不白做 |
| E3 | Add Question 加圖片／音檔題幹的題：前端用字的 `customImage`／音檔 `s3Path` 本地拼可以嗎？還是要一個單題生成的端點？ | 契約 §4 |
| E4 | `mcQuestionPlan`（mode／questionCount／mustTypes）放 practice 還是 draft？ | 契約 §2；回第二步要看得到自己選過什麼 |
