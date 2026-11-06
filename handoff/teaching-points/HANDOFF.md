# 教學點方框（Teaching points）— Engineer Handoff

老師建立練習時，第一步用來「勾要練哪些教學點」的那個黃色方框。**六種練習都有它，現在三個步驟檔各做各的，長相和用字不一樣。這一包把它定成一個樣子，請六種一起改齊。**

網頁版（有目錄和嵌入的原型預覽，內容相同）：<https://project-logeg.vercel.app/specs/chinese-modules/iterations/teaching-points-spec.html>

**這不是重寫，是改現有畫面。以前端為主**；有兩題要問後端（最後一節）。程式碼基準：`dahua-dash` `origin/develop` @ `bcdf3d33`（2026-11-05）。

這一包蓋過下面四包裡講教學點方框的段落（其他內容仍然有效）：
[`../vocabulary-mirroring/`](../vocabulary-mirroring/)、[`../vocabulary-quiz/`](../vocabulary-quiz/)、[`../sentence-scramble/`](../sentence-scramble/)、[`../sentence-practices/`](../sentence-practices/)。那四包寫的 *Add words*、*Custom word*、*ADD TEACHING POINTS* 小標、*N to add · M words*、「例句清單在方框最下面」、*1–2 each*，都以這一包為準。

---

## 名詞對照

| 這份文件的用詞 | 程式裡是什麼 | 意思 |
|---|---|---|
| 教學點 | teaching point | 專案裡的生詞或語法點。練習的內容從勾選的教學點生出來 |
| 方框 | `ContentFrame`（`components/step-one/content-frame.js`） | 黃底的外框，一個專案一個。裡面是白色面板 |
| 教學點按鈕 | `TeachingPointChips`（Sentence 四種）、`TeachingPointChip`／`AddedWordChip`（Vocabulary 兩種） | 方框裡一顆一顆可勾的按鈕，勾了＝這個點會進練習 |
| 加點列 | `FromProjectWords`（Sentence）、`AddWordsPanel` 裡的 From Project（Vocabulary） | 寫著 **Add teaching points from project** 的那一列，點一下展開或收起 |
| 詞池 | `getProjectWordPool()` 回來的陣列 | 加點列展開後出現的那一排詞：專案課文裡的詞，按一下就加成教學點 |
| 自訂輸入列 | 加點列底下的輸入欄 ＋ 型別下拉 ＋ Add 鈕 | 老師自己打一個教學點 |
| 型別 | `TEACHING_POINT_TYPE_OPTIONS`（`src/enum/projects.js`） | Word / Vocabulary、Verb、Noun、Adjective、Grammar / Structure、Phrase / Idiom、Measure Word、Other |
| 例句清單 | `ScrambleExampleList`（`components/step-one/scramble-example-list.js`） | 老師選了「Example sentences from teaching points」之後出現的清單，一句一個勾選框 |
| 六種練習 | 見下一節的表 | Vocabulary Mirroring、Vocabulary Quiz、Sentence Scramble、Sentence Cloze、Sentence Response、Sentence Building |

---

## 哪些練習有這個方框

| 練習 | 程式裡的型別 | 第一步的檔案 | 方框現在怎麼做的 |
|---|---|---|---|
| Vocabulary Mirroring | `VOCABULARY` | `steps/step-one-vocabulary.js` | 檔案裡自己的按鈕元件 ＋ `AddWordsPanel` |
| Vocabulary Quiz | `VOCABULARY`（`isVocabMC`） | 同上 | 同上；型別下拉只列詞類（沒有 Grammar、Phrase、Other） |
| Sentence Scramble | `SENTENCE_SCRAMBLE` | `steps/step-one-sentence-scramble.js` | `steps/shared/teaching-point-picker.js` |
| Sentence Cloze | `SENTENCE_CLOZE` | 同上 | 同上 |
| Sentence Response | `FOLLOW_PATTERN`／`GUIDED_RESPONSE` | `steps/step-one-follow-pattern.js` | 同一個 picker，但沒有加點列、底色是粉紅 |
| Sentence Building | `FOLLOW_PATTERN`／`SENTENCE_BUILDING` | 同上 | 同上 |

路徑都在 `src/sections/practice/view/unified/` 底下。Content Mirroring、Open-ended Questions、Comprehension Quiz 沒有教學點方框，不在範圍內。

---

## 原型怎麼看

兩份原型，方框是同一套；差別只在 Sentence 那份多了例句清單。

| 要看什麼 | 網址 |
|---|---|
| Sentence 四種，方框收起 | [`teaching-points-sentence.html?type=scramble&step=1&sel=1&n=12`](teaching-points-sentence.html?type=scramble&step=1&sel=1&n=12)（`type` 換成 `fillin`、`response`、`building`） |
| 加點列展開 | 同上再加 `&pool=1` |
| 選了例句（Scramble、Cloze、Building） | [`teaching-points-sentence.html?type=scramble&step=1&sel=1&ex=1&n=12`](teaching-points-sentence.html?type=scramble&step=1&sel=1&ex=1&n=12) |
| 兩個專案 | 任一網址打開後，在 Projects 選單多勾「环境保护与可持续发展」 |
| Vocabulary Mirroring | [`teaching-points-vocabulary.html?step=1&sel=1`](teaching-points-vocabulary.html?step=1&sel=1)（加 `&pool=1` 展開加點列、`&tdd=1` 打開型別下拉） |
| Vocabulary Quiz | [線上原型](https://project-logeg.vercel.app/specs/chinese-modules/iterations/v6-vocabulary-quiz/proposal.html?step=1&sel=1)（方框跟 Vocabulary Mirroring 一樣） |

原型只示範第一步的方框；第二個專案的教學點在第二步沒有對應的假資料，不用理會。

---

## 方框定案的樣子

每個選到的專案一個方框，方框之間隔 12px。由上往下：

```
┌─ 黃底方框 ─────────────────────────────────────────────┐
│ 我的一天                                          7/7 │  標頭：專案名、小字 Teaching points、已勾／總數
│ Teaching points                                       │
│ ┌─ 白色面板 ────────────────────────────────────────┐ │
│ │ [✓ 起床] [✓ 早饭] [✓ 一……就 Grammar] [✓ 看书 Added] │ │  教學點按鈕
│ └───────────────────────────────────────────────────┘ │
│ ┌─ 白色面板 ────────────────────────────────────────┐ │
│ │ ┌───────────────────────────────────────────────┐ │ │
│ │ │ Add teaching points from project            ⌄ │ │ │  加點列（預設收起）
│ │ └───────────────────────────────────────────────┘ │ │
│ │ [Custom teaching point      ] [Word / Vocabulary ⌄] [Add] │  自訂輸入列
│ └───────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────┘
```

### 規則

| 區塊 | 規則 |
|---|---|
| 底色 | 六種一律黃 `#FFF8E7`（`PRACTICE_TYPE_COLUMNS.VOCABULARY.wash`）。外框圓角 14px、內距 3px、面板之間 3px，照現在的 `ContentFrame` |
| 標頭 | 專案名（14px／600）＋ 小字 **Teaching points**（14px、次要色）＋ 右邊 `已勾/總數`（13px／600、次要色）。**沒有全選框** |
| 教學點按鈕 | 樣式照現在的（高 34px、圓角 10px、勾了綠框淡綠底）。勾＝會進練習，再點一下＝取消勾，按鈕留在原位 |
| 按鈕上的標 | **Added**：老師在這一步自己加進來的點（底 `#DCECFE`、字 `#193592`）。**Grammar**：型別是 `GRAMMAR` 的點，專案裡的或自己加的都掛（底 `#F3E8FF`、字 `#7C3AED`）。兩個可以同時出現，順序是字、Added、Grammar。字級 11px／700、內距 1px 7px、圓角 6px。按鈕上不印其他型別 |
| 預設勾選 | 選進來的專案，它的教學點**預設全勾**。把專案從 Projects 選單取消，它的點一起退出 |
| 沒有教學點的專案 | 第一個白色面板寫 *No teaching points. You can add some below.* |
| 加點列 | 一整列是一顆按鈕，文字 **Add teaching points from project**，箭頭在最右邊。**預設收起**，每個專案各自開合。上面沒有小標、右邊沒有數字 |
| 詞池 | 加點列展開後接在它正下方，兩者連成一塊。還不是教學點的詞：`＋ 詞`，按一下就加進這個專案的按鈕列最後、已勾、掛 Added，型別是預設的 Word / Vocabulary。已經是教學點的詞：打勾、不能按。專案沒有課文時寫 *This project has no text to pull words from.* |
| 自訂輸入列 | 輸入欄（placeholder **Custom teaching point**）＋ 型別下拉（預設 Word / Vocabulary）＋ **Add**。六種都有型別下拉。按 Enter 也能加（中文輸入法選字的 Enter 不算，照 `add-words-panel.js` 現在的判斷）；空的時候 Add 不能按。加的點歸這個方框的專案，出現在按鈕列最後、已勾、掛 Added |
| 重複 | 加的字已經在這個專案的按鈕列裡：不新增，只把那顆勾起來 |

### 尺寸與顏色

| 東西 | 值 |
|---|---|
| 加點列（收起） | 寬 100%；內距 10px 12px 10px 14px；白底；框 1px 分隔線色；圓角 10px；字 14px／700、主文字色；箭頭 20px（`expand_more`）、主文字色 |
| 加點列（滑過） | 框 `rgba(0,203,97,.45)`、底 `rgba(0,203,97,.06)` |
| 加點列（展開） | 框與底同「滑過」；下面兩個圓角變直角；箭頭轉 180°、變主色 `#00CB61`。箭頭轉動 0.15 秒 |
| 詞池 | 接在加點列下方：框 1px `rgba(0,203,97,.45)`、沒有上框線；圓角只有下面兩角 10px；底 `rgba(0,203,97,.06)`；內距 10px 12px 12px；詞與詞之間 6px、自動換行 |
| 詞池裡還沒加的詞 | 跟沒勾的教學點按鈕同一個樣子（白底、分隔線色框、次要色字），前面的圖示換成 18px 的 `＋`（淡灰） |
| 詞池裡已是教學點的詞 | 框 1.5px 主色 `#00CB61`；底 `rgba(0,203,97,.16)`；字 `#00A749`／700；前面一個勾（`#00A749`）；不能按 |
| 自訂輸入列 | 距離上面 8px；三個東西之間 8px；輸入欄撐滿、型別下拉固定 200px、Add 鈕高 40px |

---

## 要改的地方

每一條的寫法：現在怎樣 → 改成怎樣 → 改哪個檔 → 哪幾種練習。

### 1. 加點的區塊搬進每個專案的方框裡

- **現在**：Sentence Scramble／Cloze 是所有專案的方框排完之後，最底下才有**一個**白色面板（標題 *ADD TEACHING POINTS*），裡面每個專案一列 *From Project 專案名*，自訂的點也列在這個面板裡。Sentence Response／Building 沒有加點列，自訂的點在另一個方框（標題 *Custom*、小字 *Teaching points you add yourself*）。Vocabulary 兩種已經是每個專案的方框裡各有一塊。
- **改成**：六種都是「每個專案的方框裡，按鈕面板底下有自己的加點列和自訂輸入列」。老師加的點出現在**那個專案**的按鈕列最後，掛 Added。不再有 *Custom* 方框，也不再有最底下那個合併的面板。
- **改哪個檔**：`steps/shared/teaching-point-picker.js`（`ProjectTeachingPointFrames`、`CustomTeachingPointFrame`、`FromProjectWords`）、`steps/step-one-sentence-scramble.js`、`steps/step-one-follow-pattern.js`。Response／Building 要補上詞池（`getProjectWordPool`，Scramble 已經在用）。
- **哪幾種**：Sentence 四種。Vocabulary 兩種位置已經對。
- **卡住的**：Sentence 自訂的點現在不分專案（`scrambleCustomPoints` 是一串字）。見「問後端」第 2 題；答案回來前，前端先記在表單狀態裡（哪個專案加的）。

### 2. 加點列換樣子、換字

- **現在**：一個小箭頭 ＋ 文字 *From Project*（Sentence 還多專案名），右邊一行 *N to add · M words*；上面有一條 *ADD TEACHING POINTS*（Vocabulary 寫 *ADD WORDS*）的小標加橫線。Vocabulary 在詞池是空的時候整列不顯示。
- **改成**：整列是一顆有框的按鈕，文字 **Add teaching points from project**，箭頭在最右邊；小標、橫線、右邊那行數字都拿掉。展開時跟詞池連成一塊淺綠色的區域。樣子見上面「尺寸與顏色」。詞池是空的時候這一列照樣顯示，展開寫 *This project has no text to pull words from.*
- **改哪個檔**：`teaching-point-picker.js` 的 `FromProjectWords`、`components/step-one/add-words-panel.js`。
- **哪幾種**：六種。

### 3. 詞池裡「已經是教學點」的詞要明顯

- **現在**：灰字、灰勾（`text.disabled`）。
- **改成**：主色實線框、深一點的綠底、綠色粗字、綠勾（值見上面）。還沒加的詞不變。
- **改哪個檔**：同第 2 條兩個檔（`projectWordSx`、`wordChipSx`）。
- **哪幾種**：六種。

### 4. 自訂輸入列：用字統一、六種都有型別下拉

- **現在**：Vocabulary 的 placeholder 是 *Custom word*，有型別下拉，輸入時底下多一句 *Pick the word type on the right before adding.*。Sentence 四種的 placeholder 已經是 *Custom teaching point*，沒有型別下拉。
- **改成**：六種都是「輸入欄 *Custom teaching point* ＋ 型別下拉 ＋ Add」。底下那句提示拿掉。型別選項照各練習現在的清單（Vocabulary Quiz 維持只列詞類）。
- **改哪個檔**：`add-words-panel.js`、`teaching-point-picker.js`。
- **哪幾種**：六種。
- **卡住的**：Sentence 自訂的點現在只存字、沒有型別。見「問後端」第 1 題；答案回來前，型別先留在表單狀態，只用來決定掛不掛 Grammar 標。

### 5. 標頭：拿掉全選框，小字統一

- **現在**：專案名前面有一個三種狀態的全選框。Sentence 四種的小字寫 *Teaching points · From project*，Vocabulary 寫 *Teaching points*。
- **改成**：沒有全選框；小字六種都寫 **Teaching points**。右邊的 `已勾/總數` 不變。
- **改哪個檔**：`teaching-point-picker.js` 的 `ProjectTeachingPointFrames`（`headerStart`、`description`）、`step-one-vocabulary.js`（`ContentFrame` 的 `headerStart`）。`onToggleGroup`／`handleToggleAll` 沒有別處用到就一起拿掉。
- **哪幾種**：六種。

### 6. 方框底色一律黃

- **現在**：Sentence Response／Building 用 Sentence 欄的粉紅（`PRACTICE_TYPE_COLUMNS.SENTENCE.wash`，`#FEF2F8`）。其他四種已經是黃。
- **改成**：六種都用 `PRACTICE_TYPE_COLUMNS.VOCABULARY.wash`（`#FFF8E7`）。
- **改哪個檔**：`steps/step-one-follow-pattern.js`。
- **哪幾種**：Sentence Response、Sentence Building。

### 7. 按鈕上的標：Added、Grammar

- **現在**：Sentence 四種的按鈕上沒有任何標。Vocabulary 自己加的字用另一個元件（`AddedWordChip`）：字後面印型別名稱（例如 *Verb*），點一下是**整顆移除**。
- **改成**：六種的按鈕是同一種。自己加的點掛 **Added**；型別是 Grammar 的點（專案裡的、或自己加時選 Grammar / Structure 的）掛 **Grammar**。按鈕上不印其他型別名稱。自己加的點點一下是**取消勾**，按鈕留著、可以再勾回來。
- **改哪個檔**：`teaching-point-picker.js` 的 `TeachingPointChips`、`step-one-vocabulary.js`（`TeachingPointChip`、`AddedWordChip` 併成一種）。
- **哪幾種**：六種。
- **卡住的**：專案教學點的型別現在沒有傳到按鈕（`extractConfigWords` 只回字串）。見「查程式碼就能答」第 3 題。

### 8. 沒有教學點的專案：文案統一

- **現在**：Sentence 四種寫 *No teaching points found in this project. You can add some below.*；Vocabulary 寫 *No teaching points yet. Add words below.*
- **改成**：六種都寫 *No teaching points. You can add some below.*
- **改哪個檔**：`teaching-point-picker.js`、`step-one-vocabulary.js`。
- **哪幾種**：六種。

### 9. 例句清單搬進方框，教學點按鈕當左欄

- **現在**：老師選了 *Example sentences from teaching points* 之後，例句清單是方框**外面、最下面**的一張卡。左欄用灰字寫教學點的名字；上面的教學點按鈕照樣留著，同一個點出現兩次。
- **改成**：例句清單放進**每個專案的方框裡**，取代原本放按鈕的那個白色面板（加點列的面板在它下面）。清單左欄就是教學點按鈕本身，勾或取消在這裡做。每個專案的清單各有自己的標題列：**Example sentences**　*Untick any you don’t want · N of M picked*（N、M 只算這個專案）。
  - 勾著、有例句的點：右邊列它的例句，一句一列，樣式照現在。
  - 勾著、沒有例句的點（例如自己加的）：右邊寫 *No examples · will be generated*（12px、淡色）。
  - 沒勾的點：左邊按鈕留著，右邊空白。
  - 左欄最小寬 128px，按鈕和例句之間 12px。
  - 沒選例句卡時，按鈕面板照常顯示，沒有清單。
  - 清單以外的提示（哪些點沒有例句、還會生成幾句）照 Sentence 練習那一包，這裡不改。
- **改哪個檔**：`components/step-one/scramble-example-list.js`、`steps/step-one-sentence-scramble.js`、`teaching-point-picker.js`。
- **哪幾種**：Sentence Scramble、Sentence Cloze。Sentence Building 接上例句來源時用同一套。Vocabulary 兩種和 Sentence Response 沒有例句清單。

### 10. 句數那一行拿掉「1–2 each」

這一條不在方框裡，在方框上面那張「要幾句」的卡，一起改。

- **現在**：*12 sentences · up to 20 · across 7 teaching points · 1–2 each*。
- **改成**：*12 sentences · up to 20 · across 7 teaching points*。句子怎麼分給各個點的算法不變，只是不寫出來。低於下限時的 *at least N · one per teaching point* 照留。
- **改哪個檔**：`components/step-one/scramble-source-panel.js`（第 20 行附近算 `each` 的函式和用到它的那一行）。
- **哪幾種**：用到這張卡的 Sentence 練習。

---

## 不用改的

| 題目 | 現況 |
|---|---|
| 預設全勾、取消專案時點一起退出 | 已經是這樣（`use-teaching-point-pool.js`；Vocabulary 用 `deselected` 反著記） |
| 教學點按鈕本身的尺寸與勾選顏色 | 已經對 |
| 詞池預設收起 | 已經是這樣 |
| 例句每一列的樣式（勾選框、中文、拼音、翻譯） | 已經對 |
| Projects 選單、Practice name | 不動 |

---

## 驗收

六種練習各開一次第一步，逐項對：

1. 選兩個專案：出現兩個黃色方框，每個方框底下各有自己的加點列和自訂輸入列；頁面最底下沒有另一個合併的面板，也沒有 *Custom* 方框。
2. 標頭沒有全選框，小字是 *Teaching points*。
3. 加點列預設收起、箭頭在右；展開後跟詞池連成一塊淺綠，箭頭朝上。
4. 詞池裡已是教學點的詞是綠框綠字打勾、按不動；按一個 `＋` 的詞，它出現在這個專案的按鈕列最後、已勾、掛 Added，詞池裡那顆變成打勾。
5. 自訂輸入列有型別下拉。選 Grammar / Structure 加一個點：按鈕掛 Added 和 Grammar。
6. 點一下自己加的點：變成沒勾，但還在；再點一下勾回來。
7. 專案裡型別是 Grammar 的教學點掛 Grammar。
8. 選一個沒有教學點的專案：寫 *No teaching points. You can add some below.*
9. Sentence Response／Building 的方框是黃的。
10. Sentence Scramble／Cloze 選例句：按鈕那一排不見，例句清單在方框裡、左欄是教學點按鈕；取消勾一個點，它的例句收起、按鈕留著。
11. 句數那一行沒有 *1–2 each*。

---

## 要問的

### 問後端

1. **Sentence 自訂教學點的型別要不要存？** 現在 Sentence 四種自己加的點只送字串。加了型別下拉之後，型別要不要跟著送、放哪個欄位？（Vocabulary 兩種已經有 `{ word, type }`。）
2. **Sentence 自訂教學點要不要記是哪個專案的？** 畫面上它歸某一個專案的方框。這只是前端擺放的位置，還是後端也要知道（例如回頭編輯時要放回同一個方框）？

### 查程式碼就能答

3. 專案教學點的型別從哪裡讀：`extractConfigWords()` 現在只回字串。`cfg.teachingPointMeta` 或 `vocabHandlerResult.result.vocab` 的每一筆有沒有型別欄位可以帶出來給 Grammar 標用。
4. Sentence Response／Building 補詞池：`step-one-follow-pattern.js` 能不能直接照 `step-one-sentence-scramble.js` 的做法（`getProjectWordPool` ＋ `projectWordGroups`）。

---

## 不在這一包裡的

- **生成之後回到第一步**：已經生過的點要不要鎖、多勾的點掛 *New*。這跟「什麼時候存檔」綁在一起，另外談；現在的鎖點行為先不動。
- **第二步以後的畫面**（教學點小卡、句子卡、Settings、Assign）：照各練習自己那一包。
- **Sentence Scramble 的「一句結合多個教學點」**：還在設計中，不影響這個方框。
