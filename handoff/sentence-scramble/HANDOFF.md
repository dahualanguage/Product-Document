# Sentence Scramble — Engineer Handoff

老師建立 **Sentence Scramble** 的那條流程（New Practice → Sentence Scramble；`?type=SENTENCE_SCRAMBLE`）。四步都動，但只有前兩步是重畫：

```
現行  Content → Edit Sentences → Settings → Assign Practice
提案  Teaching Points → Edit Sentences → Settings → Assign Practice
```

1. **第一步 Teaching Points**：v4 的版面（多選專案、名稱 A + B、勾 teaching point、Add teaching points），加兩個 Scramble 自己的決定——**總共要幾句**（上限 20、輪流分給勾的點）、**句子從哪來**（AI 生成｜teaching point 現成的例句）。生成後回頭改點只生新的，不整份重生。
2. **第二步 Edit Sentences**：每個教學點一張小卡，**−／+ 直接加減那個點的句子**（總數 20、每點 5）；句子卡可拖曳、剪刀切塊、改中文／翻譯、刪除、改聲調。
3. **第三步 Settings**：共用的 R11 工具列（PINYIN ‖ SPEED／VOICE ‖ MAX TRIES）＋ 畫布就是**學生的拼句畫面**；現行的句子清單拿掉。
4. **第四步 Assign**：八種共用，照 [Content Mirroring 那一包](../content-mirroring/)。

**這不是重寫，是在現有流程上改。有後端**：建立時要帶每點幾句與指定的例句、CREATE 回頭改點要走 append、第二步 + 要能對單一個點再生一句。契約在 [`API-CONTRACT.md`](API-CONTRACT.md)。程式碼基準：`dahua-dash` `origin/develop` @ `b130ab5b`（2026-10-05；Scramble 的檔案從 `7e2afa52` 起只有 #981／#990 動到顯示，流程與欄位沒變）。

- 原型：[`sentence-scramble.html`](sentence-scramble.html)，`?step=1|2|3|4` 從 1 數。第一步 `?step=1&sel=1&n=12`（問 12 句）、`&n=20`（到頂）、`&ex=1&n=12`（例句模式）、`&dd=1` 選單、`&back=1` 生成後回來；第二步 `?step=2&n=12`，`&cut=1` 剪刀、`&edit=1` 編輯、`&del=1` 刪過一句、`&py=1` Edit Pinyin；第三步 `?step=3`，`&voice=1`、`&pyc=1&settings=1` Choice by student ＋ 齒輪、`&all=1` 換句清單；第四步同 Content Mirroring 那一包（`&pick=3b,4a&roster=4a`、`&review=1`、`&assigned=1`）。頁底狀態列每個狀態都有入口。
- 對照組（現行畫面的複刻）：[第一步已生成](https://project-logeg.vercel.app/specs/chinese-modules/iterations/v7-sentence-scramble/create-scramble.html?step=0&done=1)、[第二步](https://project-logeg.vercel.app/specs/chinese-modules/iterations/v7-sentence-scramble/create-scramble.html?step=1)、[第三步](https://project-logeg.vercel.app/specs/chinese-modules/iterations/v7-sentence-scramble/create-scramble.html?step=2)。
- 姊妹包：[Vocabulary Mirroring](../vocabulary-mirroring/)（第一步的專案多選、A + B、Add words 同一套元件）、[Content Mirroring](../content-mirroring/)（第三步工具列、第四步）、[practice-shared](../practice-shared/)（S1–S4、S6–S10 都適用；S3 的畫廊裡有 Scramble 那一格）。

---

## 已定的規則

| 題目 | 定案 |
|---|---|
| 第一步叫什麼 | **Teaching Points**（`STEPS_BY_TYPE[SENTENCE_SCRAMBLE][0]`）。Practice name 在第一步 |
| 總共幾句 | 老師填**總句數**（數字欄）：預設 ＝ 勾的點數、下限 ＝ 點數（每點至少一句）、上限 **20**（`MAX_QUESTION_COUNT`）。打超過夾回 20，打低於點數提示 *at least N · one per teaching point* |
| 怎麼分 | **輪流分**給勾的點：每點 ⌊T÷N⌋，前 T mod N 個點多一句。備注欄寫 *across 7 teaching points · 1–2 each* |
| 句子從哪來 | **Generate new sentences**（預設）｜**Example sentences from teaching points**。專案沒有例句可用時第二張卡淡掉 |
| 例句模式 | 照份額預勾每個點的前 k 句例句（k ＝ 那個點的份額）；清單可逐句取消。**有例句的點用勾的例句、沒例句的點（自訂的、專案沒例句的）照份額生**。總數 ＝ max(填的總數, 勾的例句數)；老師多勾了就跟著多 |
| 生成後回頭改點 | 多勾的點**只生新的**（append），已經審過的句子不動；取消勾的點，它的句子離開清單 |
| 第二步每點幾句 | 每點一張小卡 **−／+**：+ ＝ 對這個點再生一句，接在它最後一句後面；− ＝ 拿掉它最後一句。上限 **20 句總數、5 句一點**，到頂 + 灰、卡裡一行藍字說原因。整份至少一句 |
| 句子怎麼審 | 拖曳排序、剪刀（切／合詞塊，Save 才寫回）、編輯中文／翻譯（中文改了存檔後重生拼音／翻譯／音檔）、刪除（剩一句擋）、點拼音改聲調——都是現行功能，只換版面 |
| 第三步 | R11 工具列：**PINYIN** Shown｜Hidden｜Choice by student；**SPEED** Slow／Normal／Fast（試聽 chip）＋ Choice by student；**VOICE** 下拉；**MAX TRIES** − 3 + ⓘ。畫布 ＝ 學生的拼句畫面。**沒有 Translation、沒有 Practice mode** |
| 學生畫面的預覽 | 第三步的畫布就是；第二步不另做 Preview |
| 不在這一包 | 學生端畫面不動（拖曳、揭曉區都照舊） |

---

## 1 · 第一步 Teaching Points（`step-one-sentence-scramble.js`）

```
Projects  [zh-CN 我的一天 HSK 2 ▾]
Practice name  [我的一天]   Filled in from the projects you pick…

HOW MANY SENTENCES ─────────────────────────────────────────────
┌ [12] sentences · up to 20 · across 7 teaching points · 1–2 each ┐
[ ✦ Generate new sentences          ]  [ ❝ Example sentences from teaching points ]
  AI writes new sentences for the        14 available
  teaching points you tick

┌ ☑ 我的一天 · Teaching points                              7/7 ┐
│ [☑起床] [☑早饭] [☑上课] [☑图书馆] [☑运动] [☑睡觉] [☑一……就]      │
│ ADD TEACHING POINTS   › From Project   [Custom teaching point] Add │
│ Example sentences · Untick any you don't want · 12 of 14 picked   │   ← 例句模式才有
│  起床  ☑ 我每天七点起床。 wǒ měi tiān… I get up at seven every day. │
│        ☑ 周末我起床很晚。 …                                        │
│  …                                                                 │
│  No examples for 睡觉、一……就 · 2 sentences will be generated to reach 12 │
└────────────────────────────────────────────────────────────────────┘
                                                        [ Generate ]
```

- 專案多選、名稱 A + B、teaching point frame、Add teaching points（From Project ＋ Custom，自訂點是純文字）：照 Vocabulary Mirroring 那一包的第一步，元件共用（`use-teaching-point-pool.js`／`teaching-point-picker.js` 本來就是 Follow Pattern 與 Scramble 共用）。
- **HOW MANY SENTENCES** 一張卡：灰底備注欄（數字欄 ＋ *sentences · up to 20 · across N teaching points · a–b each*，到 20 時 *up to 20* 轉琥珀）→ 兩張選項卡（照 `function-selector.js` 的可點 Card，選中綠外框＋淡綠底，卡裡一句說明）。
- 數字欄：打字中照打的顯示，離開欄位才夾（點數 ～ 20）。勾／取消點時下限跟著變，低於下限自動抬到點數。
- **例句模式**：選了第二張卡，frame 最下面（Add teaching points 之下）攤開例句清單——每個點一列點名、每句一個 checkbox（中文、拼音、翻譯），預設照份額勾好；取消勾的點，它的例句不算。清單底下一句藍字講沒例句的點會生幾句。
- 頁腳 **Generate**（生成中轉圈，整步 skeleton）；生成完自動進第二步；回頭改過再按叫 **Next**，只生新勾的點（契約 §1）。

---

## 2 · 第二步 Edit Sentences（`sentence-scramble-preview.js` mode=sentences ＋ `scramble-sentence-list.js`）

```
TEACHING POINTS · 7 ──────────────────────────────── Up to 20 in total
┌ 起床        ┐ ┌ 早饭        ┐ ┌ 上课        ┐ …
│ 2 sentences │ │ 2 sentences │ │ 1 sentence  │
│      [− +]  │ │      [− +]  │ │      [− +]  │
└─────────────┘ └─────────────┘ └─────────────┘

SENTENCES · 12 ─────── In this order · drag a card to reorder · scissors to adjust blocks · click pinyin to fix tones
⋮⋮ (Q1) [起床]                                              ✂ ✎ 🗑
   wǒ   měi tiān  qī diǎn  qǐ chuáng
   我    每天      七点     起床      。
   I get up at seven every day.
```

- **TEACHING POINTS · N**：一排小卡（grid，`minmax(170px, 1fr)`）。每張：點名 chip（粉紅，Scramble 的識別色）、**n sentences**（數字 18px 粗體）、−／+ 步進器（28px）。
  - **+**：對這個點再生一句（契約 §3），新句接在這個點最後一句後面，SENTENCES · N 跟著加一。到 **5 句**時 + 灰、卡裡藍字 *Up to 5 per point*；總數到 **20** 時每張卡 + 都灰、卡裡藍字 *Up to 20 in total*（同時到兩個上限的卡優先寫 per point）。
  - **−**：拿掉這個點最後一句；整份只剩一句時擋住，上方黃色提示 *Keep at least one sentence.*（產品現在是 snackbar，兩種都可）。
  - 眉標右邊只有一句 *Up to **20** in total*（到 20 時 20 轉琥珀）。沒有「選一個點 · Generate one more」那一列。
  - disabled 的步進器：灰底、圖示淡四成、`cursor:not-allowed`——要一眼看出不能按。
- **SENTENCES · N**：一句一張卡，標頭 ＝ 拖曳把手、**Q 號**（主色實心膠囊，跟其他七張卡同一種）、教學點 chip；右邊 剪刀／編輯／刪除。詞塊列拼音在上、字在下（`splitContent` 一格一塊，標點不成塊、灰字）；翻譯小字。
  - **拖曳**排序（HTML5 drag，取代上下箭頭）。
  - **剪刀**：點了詞塊拆成字、字與字之間一條縫，點一下切（粉紅豎線）再點合；*Split into characters* 一次全切；底下 Preview 即時重組；**Save 才寫回**（同一句再點剪刀就關）。灰掉的條件照現行（沒 cells、中文改過沒存）。
  - **編輯**：中文、翻譯兩個輸入框；中文一改出現 *Auto-update on save*（存檔後後端重生拼音／翻譯／音檔）。Cancel／Save。
  - **刪除**：當下拿掉那一張，Q 號與小卡的句數跟著變。
  - **Edit Pinyin** 對話框照現行（點拼音）。
- 這一步**沒有試聽**（在第三步畫布上）。頁腳 Next。

---

## 3 · 第三步 Settings（`sentence-scramble-preview.js` mode=settings 換掉）

跟 Content Mirroring 那一包**同一套工具列 ＋ 畫布**，只有這些不同：

| | Content Mirroring | Sentence Scramble |
|---|---|---|
| 第一列 | Practice mode ‖ Pinyin ｜ Translation | **PINYIN** Shown｜Hidden｜Choice by student（只有這一格；沒有 Practice mode、沒有 Translation） |
| 第二列 | Translation first ｜ Speed ｜ Voice ‖ Max tries | **SPEED** Slow／Normal／Fast 試聽 chip ＋ Choice by student ｜ **VOICE** 下拉 ‖ **MAX TRIES** − 3 + ⓘ |
| Max tries 的 tooltip | …auto pass | *How many times a student may check one sentence. When they run out, the correct order is shown and the practice moves on (default 3).* |
| 畫布 | PRACTICE SENTENCE 卡 | **學生的拼句畫面**：粉紅提示句 *Rearrange the words to form the correct sentence.*、*0 / 3 tries*、*Listen to sentence · Normal · Xiaorou (Female)*、虛線 slot、打散的 tiles（拼音＋字）、Check 鈕——照 `assignments/content/sentence-scramble/index.js` 那張卡；不畫頂欄與進度條 |

- 齒輪只在 Pinyin 或 Speed 是 Choice by student 時出現，面板照 `settings-panel.js`。
- 畫布下方 **Sentence 1 of 7 ▾**：原地展開整份清單，**每列一顆小播放鍵**（只聽那一句、不換預覽），超過 15 列在清單裡捲。
- 底部一行 *7 sentences*。頁腳 **Save**（倒數第二步真的送出）。
- Speed／Voice 改了重生音檔照舊，等待文案要走 audio 分支（契約 §5）。

---

## 4 · 第四步 Assign Practice

跟 Content Mirroring 那一包完全一樣，八種共用。班名色用 Sentence 欄的 label `#BE185D`。

---

## 不要順手改的

- **enum 與欄位不動**：`pinyinPreference`（PINYIN／NO_PINYIN／STUDENT_CHOICE）、`speedPreference`／`changeSpeed`、`audioOption`、`maxAttempts`、`scrambleSentences` 的形狀、`MAX_QUESTION_COUNT = 20`。
- **不加 `translationPreference`**：學生端只在揭曉區用翻譯，老師不設。
- **學生端不動**：點一下填 slot（不做拖曳）、揭曉區、完成頁都照舊。
- 剪刀、Edit Pinyin、改中文重生的機制不動，只換版面。
- Follow Pattern 共用第一步的元件，改了一起變是預期的；它的題數欄位不在這一包。

---

## 動工順序

| 階段 | 內容 | 可否獨立上線 |
|---|---|---|
| **1** | 第一步版面：Teaching Points、HOW MANY SENTENCES（總數欄、輪流分、備注欄）、兩張來源卡；先只做 Generate new sentences 那條 | 可——`scrambleSentenceCount` 本來就有；份額先由後端照現行方式分 |
| **2** | 第二步：小卡 −／+（+ 走 `scrambleAppendTeachingPoints`，契約 §3）、句子卡拖曳、三個動作的版面 | 可 |
| **3** | 第三步：工具列 ＋ 拼句畫布、清單播放鍵；拿掉句子清單 | 可（Content Mirroring 那一包的工具列元件做了就有） |
| **4** | 後端：建立時帶每點份額（契約 §1）、CREATE 回頭只生新的（§1）、例句來源（§2）、+ 只生一句且落在那個點後面（§3） | — |

階段 4 沒好之前：第一步回頭改點仍會整份重生——**先在 Generate 鈕旁加一句警告**，不要默默丟掉第二步的工。

---

## 要問後端的

| # | 題目 | 卡住哪一項 |
|---|---|---|
| E1 | CREATE 第一步回頭多勾點，能不能也走 `scrambleAppendTeachingPoints`（EDIT 模式已經這樣）？ | §1 回頭只生新的 |
| E2 | 改一句中文存檔，後端是只重生那一句還是整份？ | 第二步能不能只鎖那一張卡 |
| E3 | 剪刀存的 `splitContent`，後端重推 cells 時會不會改回去？拼音怎麼對回來？ | 剪刀 Save |
| E6 | 換 Speed／Voice 重生音檔的等待文案走錯分支（`resolveProcessingCopy` 的 scramble 分支先於 audio） | 第三步，一行的事 |
| E7 | 建立 practice 時能不能直接帶指定的句子（例句）進去，切詞、音檔跟生成的走同一條？ | §2 例句來源 |
| E8 | 專案的例句本身有沒有音檔？沒有的話勾進來的句子要等重錄 | §2 |
| E9 | 同一個點既有例句又要生新句，生成能不能避開已勾的例句？ | §2 不撞句 |
| E10 | `scrambleAppendTeachingPoints` 一次生幾句？能不能限定一句、並回傳它好讓前端放到那個點的後面？ | §3 第二步 + |
