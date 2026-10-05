# Vocabulary Quiz — API Contract

搭配 [`HANDOFF.md`](HANDOFF.md)。程式碼基準：`dahua-dash` `origin/develop` @ `b130ab5b`（2026-10-05）。

這一份是**草案**：欄位名稱照現有結構延伸，型別與放的位置由後端定。每一節開頭寫「現在怎樣」，接著寫「要變成怎樣」，最後是要問的。

---

## 核心概念

1. **一題 ＝ 一個字 × 一種題型（一格）。** 第二步產出的是**格子的集合**，第三步的清單就是這個集合攤開來、每格至少一題。兩步是同一份資料。
2. **格子的集合仍用現有的 `mcQuestionTypeSelection`** 表達（每個字一筆、`questionTypes[]`），不換形狀。Use all／Random／Must cover 是前端把老師的決定算成集合的方法。
3. **老師的決定要另外存**（`mcQuestionPlan`），回第二步才看得到自己選過什麼；只存集合推不回來。
4. **改選擇只動差額**：新格子生題、取消的格子拿掉題、其餘不動。

---

## 1. 格子的集合（`mcQuestionTypeSelection`）

### 現在

```graphql
mcQuestionTypeSelection: [{ projectConfigSk, vocabulary, questionTypes: [String] }]
```

第二步 Next 時（`practice-unified-view.js`）連同 `generateVocaUpdatedArticleArrayType: MULTIPLE_CHOICE` 一起 patch（`updatePracticeAI` 或 draft 路徑），後端照它生 `multipleChoiceQuestions`。Random 模式是前端 `buildRandomDistribution` 把總數平均分到每個字再隨機挑題型；Advanced 是逐格勾。

### 要變成

**形狀不變。** 前端照 HANDOFF 的規則算出集合：

| 老師的決定 | 集合 |
|---|---|
| Use all question types | 每個字 × 八種（圖沒好的字去掉兩種圖片題型） |
| Set a number N · Random | 從全部可出的格子隨機挑 N 格 |
| Set a number N · Must cover `[t1, t2…]` | 照勾的順序 `t1` 逐字、`t2` 逐字……填到 N 格；不夠從其餘可出的格子隨機補 |

- 同字同題型兩題：集合裡仍是一格；第二題只存在 `multipleChoiceQuestions`（§3）。
- 可出 ＝ 不是 pattern 類（`isPatternVocabEntry`）且圖片題型要 `isImageReadyForMc`。

---

## 2. 老師的決定（`mcQuestionPlan`，新欄位）

### 現在

沒有。回第二步時 `buildInitialSelection` 從集合還原逐格勾選，分不出老師當初選的是 Random 20 還是 Advanced。

### 要變成

```graphql
input McQuestionPlanInput {
  mode: McQuestionPlanMode!     # ALL | RANDOM | MUST_COVER
  questionCount: Int            # ALL 時省略
  mustTypes: [String!]          # MUST_COVER 時，照老師勾的順序（填題順序跟它走）
}
type McQuestionPlan { mode questionCount mustTypes }

# PracticeInput / draft 多一個欄位，跟 mcQuestionTypeSelection 同一次 patch 送
mcQuestionPlan: McQuestionPlanInput
# getPractices / getPracticeDraft / startEditPractice 一起回
mcQuestionPlan { mode questionCount mustTypes }
```

- 後端只存不算；集合（§1）仍由前端算好一起送。
- 沒有 `mcQuestionPlan` 的舊 practice：前端用集合推——全部格子都在 ＝ ALL，否則 RANDOM ＋ `questionCount` ＝ 格數。

> **要問（E4）**：放 practice 本體還是只放 draft？建議跟 `mcQuestionTypeSelection` 同一層。

---

## 3. 改選擇只生差額（`multipleChoiceQuestions` 的保留）

### 現在

`practice-unified-view.js` 的註解：*Regenerating discards the questions that exist, including any the teacher deleted or reordered on the Settings step*。集合一變就整份重生；第三步的刪除／排序／Swap 用 `upsertPractice({ multipleChoiceQuestions })`（`toMcQuestionInput`）整份覆蓋存回。

### 要變成

第二步 Next 送新集合時，後端對照現有的 `multipleChoiceQuestions`：

| 格子 | 要做什麼 |
|---|---|
| 新集合有、現有題目沒有 | **生這一格的題**，接在清單最後 |
| 新集合沒有、現有題目有 | **拿掉**這個字這種題型的題（含第二題） |
| 兩邊都有 | **不動**（順序、Swap 過的選項都留著） |

- 回傳仍是整份 `multipleChoiceQuestions`，前端直接用。
- 沒改集合就不打這個 patch（同現行 `changed` 判斷）。

> **要問（E2）**：生成是整份跑還是能逐格？不能逐格的話，退而求其次：後端整份重生後，**按 `vocabSource + questionType` 把舊題的順序與刪除套回來**——前端也能做（送出前記下順序，回來後重排），但刪除要後端配合（刪掉的格子不在集合裡，本來就不會生）。
> **要問（E1）**：圖沒好的格子被勾了（Use all 時前端已經先排除；Must cover 自動補也排除），後端收到還是會排隊生嗎？如果會，第二步的題數跟第三步會對不上。

---

## 4. Add Question 加任一種題型

### 現在

`handleAddMcQuestion`：選一個字，**在 `TEXT_STEM_TYPES` 三種裡隨機**一種，前端 `buildMcQuestion()` 本地拼（題幹是字或翻譯、正解與干擾項從其他字拿），存進 `multipleChoiceQuestions`。Raffle（Swap type）同一條路。

### 要變成

老師**自己選題型**（八種都能選，圖沒好的字兩種圖片題型 disabled）。拼題：

| 題型 | 題幹 | 來源 |
|---|---|---|
| CN_TO_EN／EN_TO_CN／EN_TO_PINYIN | text | 同現行 `buildMcQuestion` |
| IMAGE_TO_CN／IMAGE_TO_PINYIN | image `s3Path` | 字的 `customImage.s3Key` 或 AI 選中的那張（`selectedImageIndex`）——同學生端字卡用的那張 |
| AUDIO_TO_EN／AUDIO_TO_CN／AUDIO_TO_PINYIN | audio `s3Path` | 字的發音音檔（`updatedArticleArray` 裡 `vocaSource: vocabulary` 那張卡的 `s3Path`） |

正解與干擾項的規則跟文字題一樣（答案側是翻譯／中文／拼音）。

- 加的題**同時把那一格勾進 `mcQuestionTypeSelection`**（第二步才看得到），已在集合裡就只加題。
- 存法不變：`upsertPractice({ multipleChoiceQuestions })`。

> **要問（E3）**：前端本地拼圖片／音檔題可以嗎（`s3Path` 要跟後端生的同一種格式）？不行的話要一個 `generateMcQuestion(practiceId, projectConfigSk, vocabulary, questionType)` 端點，回一題。

---

## 5. 學生端（可做可不做）

`MC_TYPE_COLORS` 只有 `true_or_false`／`multi_choice`，八種 `VOCAB_MC_*` 的題型 chip 落到 `#666`。老師端每種題型各有顏色（第二步 `TYPE_META`）；補八個 key 就一致。畫面其他都不動。

---

## 6. 不變的

- `multipleChoiceQuestions` 的形狀、`toMcQuestionInput`、學生端 `adaptVocabMCQuestions`。
- 第一步建 practice 時 `vocabSubType` 先不送、第二步才 commit `MULTIPLE_CHOICE`（同現行）。
- `TEXT_STEM_TYPES` 與 Swap type（Raffle）的隨機規則。
- 頁腳：第三步 Save、第四步 Assign／Done（practice-shared S9）。
- 沒有 `examMode`／`timeLimit`。

---

## 7. 待確認

| # | 題目 | 卡住哪一項 |
|---|---|---|
| E1 | 圖沒好的格子被勾了，後端排隊生還是略過 | §1、§3 題數對不對得上 |
| E2 | 能不能只生新格子、保留其他題的順序與刪除 | §3 |
| E3 | 圖片／音檔題幹的題前端本地拼可以嗎，還是要單題生成端點 | §4 |
| E4 | `mcQuestionPlan` 放 practice 還是 draft | §2 |
