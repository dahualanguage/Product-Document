# Vocabulary Mirroring — API Contract

搭配 [`HANDOFF.md`](HANDOFF.md)。程式碼基準：`dahua-dash` `origin/develop` @ `599dd4cb`。

這一份是**草案**：欄位名稱照現有結構延伸，型別與放的位置由後端定。每一節開頭寫「現在怎樣」，接著寫「要變成怎樣」，最後是要問的。

---

## 核心概念

一個 Vocabulary Mirroring 練習 ＝ **一份有順序的字表**，每個字底下 **N 張卡**（字卡 ＋ 0～5 句例句），每張卡各自可以「不給學生」。老師在第一步決定**要練哪些字**，在第二步決定**每個字給哪幾張卡、什麼順序、哪張圖、幾句例句**，在第三步決定**學生畫面顯示什麼**。

三件事跟現在不一樣：

1. **practice 在第二步儲存**，不是第一步生成時。第一步隨時可以回去重選。
2. **卡是可變的**：一個字不一定三張，例句可以到五句、也可以一張都不練。
3. **學生端要讀老師的顯示設定**（現在完全沒讀）。

---

## 1. 建立與生成（第一步 → 第二步）

### 現在

`practice-unified-view.js` 的 `ensurePracticeCreated` 在第一步按 Next 時呼叫 `upsertPractice($practice: PracticeInput!)`，`typeFields` 帶 `projectConfigSks` 與 `generateVocaUpdatedArticleArrayType`；後端把每個專案的**全部** teaching point 拿去生成。之後增減字都要 `practice.id`：

- 加字：`updatePracticeAI` 的 `updateVoca: { projectConfigSk, newVoca: [String], newVocaMeta }`（`handleAddVocab`）
- 隱藏／只練句子：`updateVoca: { projectConfigSk, editVocab: { vocabIdx, hidden, examplesOnly, wordOnly } }`（`handleToggleHidden`）

### 要變成

**建立時就帶要練的字**，生成只跑勾到的：

```graphql
# PracticeInput 增加（VOCABULARY 專用）
vocabSelection: [VocabSelectionInput!]

input VocabSelectionInput {
  projectConfigSk: String!
  words: [String!]!              # 勾到的 teaching point（專案裡本來就有的字）
  extraWords: [ExtraWordInput!]  # 老師加的字：From Project 的詞或 Custom word
}
input ExtraWordInput {
  word: String!
  type: TeachingPointType        # WORD / VERB / NOUN / ADJECTIVE / GRAMMAR / PHRASE / MEASURE_WORD / OTHER；預設 WORD
}
```

- `words` 為空 ＋ `extraWords` 為空 → 前端不會送（Next 是灰的）。
- 回頭再按 Next：前端算出**新增的字**與**取消的字**，新增的走現有的 `updateVoca.newVoca`（一次可以多個），取消的直接從字表拿掉（不是 `hidden`——老師在第一步取消勾選，意思是「這個字不在這份練習裡」）。
- `practiceName` 前端送 `A + B`（多專案用「 + 」串），後端不用算。

> **要問（E4）**：`upsertPractice` 能不能吃 `vocabSelection`？生成是不是本來就逐字的，還是整個專案一次？如果是整個專案一次，就先生成再用現有的 `hidden` 把沒勾的藏掉——前端可以接受，但那樣第一步「取消勾選」就得對到 `hidden: true`，跟第二步的 Hide 撞在同一個欄位，要分兩個。

---

## 2. 字表（第二步儲存）

### 現在

字表在 `vocabularyData[].vocab[]`，每個字有 `hidden`、`examplesOnly`、`wordOnly`、`selectedImageIndex`、`example1`、`example2`、`customImage { s3Key … }`；學生端 `updatedArticleArray` 是攤平的卡（`vocaSource` 標 vocabulary / example1 / example2，有 `groupId` 的走 group、沒有的走固定 `groupSize 3` 的 stride）。順序＝生成順序，不能改。

### 要變成

每個字（`vocab[]` 的項目）增加或改成：

| 欄位 | 型別 | 現在 | 說明 |
|---|---|---|---|
| `order` | `Int` | 沒有 | 學生練的順序，第二步 ↑↓ 改的就是它。或者直接以陣列順序為準、`updateVoca` 允許整份重排——擇一 |
| `hidden` | `Boolean` | 有 | 整個字不給學生（第二步 `Hide`）。**不要**拿它表示第一步的取消勾選 |
| `imageHidden` | `Boolean` | 沒有 | 這個字的字卡不放圖（第二步 `☐ Image`）。跟第三步全域的 `imagePreference` 是兩層：全域 Hidden 時全部沒圖，全域 Shown 時再看逐字 |
| `wordCardSkipped` | `Boolean` | 有 `examplesOnly` | 字卡不練（`☐ Word`）。現有 `examplesOnly` 語意一樣，可以直接沿用，文法點預設 true |
| `examples` | `[ExampleCard!]` | `example1` / `example2` 兩個欄位 | **改成陣列，0～5 句**。每句 `{ content, pinyin, translation, s3Path, audioVariants, skipped: Boolean, source: AI \| TEACHER }`；`skipped` 就是第二步 `☐ Example k`。現有的 `wordOnly`（只練字）＝ 全部 `skipped` |
| `selectedImageIndex` / `customImage` | 有 | 有 | 不變；老師上傳的圖走 §3 |

`updateVoca.editVocab` 對應加上這些欄位；第二步按 Next 時前端**一次送整份**（每個字的 `order`、四種開關、例句陣列），不逐次打。

學生端的 `updatedArticleArray` 由後端從這份字表攤出來：**跳過 `hidden` 的字、`wordCardSkipped` 的字卡、`skipped` 的例句**，每張卡帶 `groupId`。前端 `parsePracticeCards()` 走 group 那條路（已經有），把 stride 那條路的 `groupSize 3` 拿掉或只留給舊資料。

> **要問（E4 / E6）**：`example1` / `example2` 改成陣列會動到 `edit-vocab-dialog.js`、`syncVocabEdit`（同步回專案）、`getPractices` / `getAssignments` / `getStudentAssignments` 的欄位。如果不想動 schema，替代方案是保留 `example1` / `example2` 再加 `extraExamples: [ExampleCard]`——前端兩種都能接，但學生端攤平的邏輯要照新的來。

---

## 3. 老師上傳的圖（E5）

### 現在

`VocabularyImage` 只能在 AI 生的候選裡挑一張（`selectedImageIndex`）。`importVocabularyImage($source: VocabularyImageSource!, $sourceId: String!)` 已經存在，回 `customImage { s3Key … }`，`vocabulary-cards-preview.js` 也已經會優先用 `customImage.s3Key`——所以**存與顯示的路徑都有了，缺的只是「來源是老師的檔案」**。

### 要變成

```graphql
enum VocabularyImageSource { …現有的…, UPLOAD }

# 二選一：
# (a) 前端先拿 presigned URL 把檔案放上 S3，再 importVocabularyImage(source: UPLOAD, sourceId: <s3Key>)
getVocabularyImageUploadUrl(practiceId: ID!, projectConfigSk: String!, vocabIdx: Int!, contentType: String!): { uploadUrl, s3Key }
# (b) 直接 multipart 上傳的端點，回 customImage
```

- 限制：PNG / JPG，5 MB，橫式優先（對話框文案已經這樣寫）。
- 圖跟著 **practice 的這個字** 走（不是專案的字）；`syncVocabEdit` 要不要把它同步回專案，由老師端現有的「sync to project」開關決定。
- 學生端 `card-stack.js` 現在呼叫 `getVocabularyImageUrls(content, TAGS.ZH_CN)` 照字算網址、寫死 zh-CN——要改成**先看 `customImage`，再看 `selectedImageIndex`，語言用 `targetLanguage`**（spec 問題 10 的另一半）。

> **要問**：走 (a) 還是 (b)？`customImage` 回來的欄位夠學生端直接組網址嗎？

---

## 4. 再生一句例句（E6）

### 現在

例句在建立時一次生兩句，之後只能改字（`edit-vocab-dialog.js` → `syncVocabEdit`），不能加。

### 要變成

```graphql
generateVocabExample(practiceId: ID!, projectConfigSk: String!, vocabIdx: Int!): {
  error, message, requestId
  example: ExampleCard          # 含 content / pinyin / translation / s3Path（音檔生完再回，或先回文字、音檔走現有的 audioStatus）
}
```

- 一次一句，前端在 `examples.length >= 5` 時不再顯示按鈕。
- 生出來的句子要跟這個字已有的例句不重複（把現有例句一起送給模型）。
- 音檔：如果同步生成太慢，先回文字、`audioStatus` 走現有的 GENERATING → 前端用第三步同一種 Alert 表示「這一句的音檔還在生」。

> **要問**：有沒有現成的「對單一個字生例句」的 Lambda？還是只能整個 practice 重跑？

---

## 5. 學生端要讀的（E1 — 這一節不做，第三步的預覽就是假的）

### 現在

`assignments/content/index.js` 渲染 `<VocabularyPractice>` 只傳：

```
updatedArticleArray · vocabularyData · practiceName · assignmentSk · practiceSk · practiceType
generateVocaUpdatedArticleArrayType · selectedDuration · isAlreadySubmitted · targetLanguage
maxAttempts · speedPreference · changeSpeed
```

`use-vocabulary-practice.js`：`showPinyin = useState(!isESL)`、`showTranslation = useState(true)`；`imagePreference` 零引用。同一個檔案裡 Mirroring 有 `setShowPinyin(pinyinPreference !== 'NO_PINYIN')`，Scramble 有把 `pinyinPreference` 傳下去。

### 要變成

| 老師設定 | 學生端行為 | 齒輪面板（`settings-panel.js`） |
|---|---|---|
| `pinyinPreference = PINYIN` | 拼音開，學生不能關 | 沒有 Pinyin 那一列 |
| `= NO_PINYIN` | 拼音關，學生不能開 | 沒有那一列 |
| `= STUDENT_CHOICE` | **開著開始**（維持現在的 `useState(true)`），學生可以關 | 有 Pinyin toggle |
| `translationPreference` | 同上三態（`SHOW` / `HIDE` / `STUDENT_CHOICE`） | 同上 |
| `imagePreference = SHOW` | 字卡左半有圖（再看逐字的 `imageHidden`） | — |
| `= HIDE` | 字卡沒有圖：**右半的文字置中占滿整張卡**（`card-stack.js` 現在沒有這個分支，圖載失敗才變純文字——把那條路徑正式化） | — |
| `speedPreference = STUDENT_CHOICE` | 現況已有：`speedSelectable` → 面板有 Speed 下拉 | 有 |
| `maxAttempts` | 現況不變：逐卡計、用完顯示 3 星、`isAutoAdjusted` | — |

- `index.js` 把 `pinyinPreference / translationPreference / imagePreference` 傳進 `<VocabularyPractice>`；`use-vocabulary-practice.js` 的兩個 `useState` 初始值改成照設定算，`hidePinyin` / `hideTranslation` 傳給 `SettingsPanel`。
- **開始頁**（`start-page.js`）的 Show Pinyin／Show Translation 兩個開關：老師鎖定時不顯示或 disabled。
- **卡的順序與數量照 §2 攤出來的 `updatedArticleArray`**，總卡數（進度條的 `total`）跟著變；隱藏的字不在左欄 Vocabulary List 裡。

> **要問（E1）**：這三個值學生端沒讀，是 bug 還是有意（Vocabulary 一律學生自決）？如果是有意，老師端第三步的 Pinyin／Translation／Image 三格就該拿掉，不是畫預覽。**這一題先答，其他的才有意義。**

---

## 6. 不變的

- 第三步的 `speedPreference` / `changeSpeed` / `voice` / `maxAttempts`：欄位與值不動，只換老師端的控制項。改 Speed／Voice 重產音檔照舊，但前端不再全螢幕遮罩。
- 第四步：`assignPractice($practiceId, $programId, $classes: [AssignClassInput!]!)` ＋ 逐班 `upsertAssignment`。不動。
- 成績端：`isAutoAdjusted`、`auto-pass` 標、逐卡星星。不動。
