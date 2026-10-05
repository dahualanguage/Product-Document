# Sentence Scramble — API Contract

搭配 [`HANDOFF.md`](HANDOFF.md)。程式碼基準：`dahua-dash` `origin/develop` @ `b130ab5b`（2026-10-05）。

這一份是**草案**：欄位名稱照現有結構延伸，型別與放的位置由後端定。每一節開頭寫「現在怎樣」，接著寫「要變成怎樣」，最後是要問的。

---

## 核心概念

1. **老師決定的是總句數，系統輪流分給勾的點。** 每點份額前端算好送出，後端照份額生，第二步的小卡才對得上。
2. **句子有兩種來源**：AI 生成、專案 teaching point 現成的例句。例句**直接帶進 practice**（不生），只為沒例句的點生。
3. **生成後只做增量**：回頭多勾點＝append；第二步 + ＝ 對一個點 append 一句；取消的點＝拿掉它的句子。整份重生只在第一次 Generate。
4. **上限**：總數 20（`MAX_QUESTION_COUNT`）、每點 5——前端擋，後端驗證。

---

## 1. 建立與份額（第一步 Generate）

### 現在

`upsertPractice` 帶 `scrambleTeachingPoints: [String]`、`scrambleCustomPoints`、`scrambleSentenceCount: Int`（1–20，CREATE 時每勾一個點就被重設成點數）、`projectConfigSks`。後端照 count 生，怎麼分到點只有一句 *shared out over the selected teaching points*。選擇變了再按 Generate 整份重生；EDIT 模式用 `scrambleAppendTeachingPoints` 只補新點。

### 要變成

```graphql
input ScramblePointCountInput { teachingPoint: String!  count: Int! }   # count 1–5

# PracticeInput（SENTENCE_SCRAMBLE）
scrambleSentenceCount: Int                 # 仍送總數（老師填的，點數 ～ 20）
scramblePointCounts: [ScramblePointCountInput!]   # ← 新增：每點幾句，前端算好；Σ count = scrambleSentenceCount
```

- 份額規則（前端 `shares()`）：T 句分給 N 個勾的點，每點 ⌊T÷N⌋，照勾的順序前 T mod N 個點多一句。
- 後端照 `scramblePointCounts` 生：每句帶它的 `teachingPoint`（現在句子已經對得到點，`buildTeachingPointUsage` 在用）。
- **CREATE 回頭改點**：前端算出新增的點（`practice-generation-baseline.js` 已有 `scrambleAddedPoints`），只送 `scrambleAppendTeachingPoints`（照它的份額）；取消的點送 `scrambleSentences`（整份、不含那些句）。**不再送整份重生**。
- 沒有 `scramblePointCounts` 的舊 practice：行為同現行。

> **要問（E1）**：CREATE 第一步走 append 可以嗎？後端生成有沒有「這個 practice 已經有句子」的分支？

---

## 2. 例句來源（第一步 Example sentences from teaching points）

### 現在

沒有。例句只存在專案的 vocab（`vocabHandlerResult.result.vocab[].example1／example2`：中文、拼音、翻譯）；Scramble 的句子一律 AI 生。`scrambleSentences` 只在第二步編輯時用。

### 要變成

```graphql
input ScrambleSourceSentenceInput {
  teachingPoint: String!
  content: String!             # 例句中文
  contentPinyin: String        # 專案有就帶
  contentTranslation: String   # 專案有就帶
  source: ScrambleSentenceSource   # PROJECT_EXAMPLE（之後若有別的來源再加）
}

# PracticeInput 多一個欄位，跟 §1 同一次 upsertPractice 送
scrambleSourceSentences: [ScrambleSourceSentenceInput!]
```

- 後端：這些句子**直接進 practice**（切詞 `splitContent`、拼音 cells、音檔跟生成的走同一條管線），**不另外生**；每個點的 `count − 該點的例句數` 才生新的。老師勾的例句多過份額時以例句為準（總數跟著多，前端已夾在 20 以內）。
- 回傳的句子帶 `source`，第二步不特別標（老師自己勾的）。
- 例句的拼音、翻譯專案有就沿用，不重生。

> **要問（E7）**：建立時帶指定句子可以嗎？管線能不能跳過「生句」只跑「切詞＋音檔」？
> **要問（E8）**：專案例句有沒有音檔？沒有的話跟生成的一樣要等。
> **要問（E9）**：同一個點既有例句又要生新句，生成能不能避開已勾的例句（把它們當 negative example 送進去）？

---

## 3. 第二步 +／−（每點加減一句）

### 現在

第二步 header「選一個點 · Generate one more」→ `applyPatch({ scrambleAppendTeachingPoints: [point] })`，後端為那個點 append，句子接在清單**最後**。刪除走 `scrambleSentences`（整份覆蓋）。

### 要變成

| 動作 | 送什麼 | 後端 |
|---|---|---|
| **+**（某點） | `scrambleAppendTeachingPoints: [point]`（同現行） | **只生一句**；回傳整份 `updatedArticleArray`，新句帶 `teachingPoint`。前端把它移到那個點最後一句後面，立刻用 `scrambleSentences` 送一次順序（`idx` 照新順序） |
| **−**（某點） | `scrambleSentences`（整份，不含那個點最後一句；同現行刪除） | 同現行 |
| 上限 | 前端擋：總數 20、每點 5 | 後端驗證：append 後超過 20 回錯；每點超過 5 回錯 |

- 若後端能接受 `scrambleAppendTeachingPoints` 帶位置（例如 `{ teachingPoint, afterIdx }`），前端就不用補送一次順序——二選一。

> **要問（E10）**：append 一次生幾句？能不能限定一句、並在回傳裡標出哪一句是新的？

---

## 4. 句子編輯（第二步，不變）

`scrambleSentences: [{ idx, content, contentPinyin, contentTranslation, splitContent }]` 整份送（同現行 `sentence-scramble-preview.js` 的 `onSaveSentences`）：

- **排序**：`idx` 照新順序。
- **剪刀**：改 `splitContent`，`willRegenerate: false`。
- **編輯中文**：`content` 變了 → `willRegenerate: true`，後端重生那一句的拼音／翻譯／音檔。
- **刪除**：那一句不在陣列裡。
- **Edit Pinyin**：`splitContentPinyinOverride`（同現行）。

> **要問（E2）**：改一句中文，後端只重生那一句還是整份？只動一句的話前端只鎖那一張卡、不開全螢幕 ProcessingDialog。
> **要問（E3）**：剪刀存的 `splitContent`，後端重推 cells 時會不會改回去？`splitContentPinyin` 怎麼跟著新的切法對齊？

---

## 5. 第三步設定（不變，只換控制項）

| 控制項 | 欄位 | 備註 |
|---|---|---|
| PINYIN Shown｜Hidden｜Choice by student | `pinyinPreference` PINYIN／NO_PINYIN／STUDENT_CHOICE | 學生端有讀 |
| SPEED Slow／Normal／Fast／Choice by student | `speedPreference` ＋ `changeSpeed`（0.6／0.8／1.0） | 改了重生音檔（`updatePracticeAI`） |
| VOICE | `audioOption`（zh-CN 四個） | 改了重生音檔 |
| MAX TRIES | `maxAttempts` 1–10，預設 3 | 學生端用完揭曉正解 |

- **不加** `translationPreference`。
- 重生音檔的等待文案：`resolveProcessingCopy` 走 audio 分支（*Updating audio…*），不是 scramble 的 *Generating sentences…*（E6，一行）。

---

## 6. 不變的

- 學生端 `assignments/content/sentence-scramble/`：點一下填 slot、Check、Try Again、揭曉、完成頁。
- `MAX_QUESTION_COUNT = 20`。
- `scrambleCustomPoints`、`projectConfigSks`、`_scrambleGenerated*` 的 baseline 判斷（只是多比 `scramblePointCounts`）。
- 第四步 Assign 的 mutation。

---

## 7. 待確認

| # | 題目 | 卡住哪一項 |
|---|---|---|
| E1 | CREATE 回頭改點走 append | §1 |
| E2 | 改一句中文只重生那一句？ | §4、第二步鎖整步還是一張卡 |
| E3 | 剪刀的 `splitContent` 後端會不會改回去 | §4 |
| E6 | 重生音檔的等待文案走錯分支 | §5 |
| E7 | 建立時帶指定句子（例句） | §2 |
| E8 | 專案例句有沒有音檔 | §2 |
| E9 | 生成避開已勾的例句 | §2 |
| E10 | append 一次一句、回傳標新句 | §3 |
