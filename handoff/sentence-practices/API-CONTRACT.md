# Sentence 練習（四種）— API Contract

搭配 [`HANDOFF.md`](HANDOFF.md)。程式碼基準：`dahua-dash` `origin/develop` @ `7528c30f`（2026-10-27）。

這一份是**草案**：欄位名稱照現有結構延伸（Scramble 的欄位叫 `scramble…`、Follow Pattern 的叫 `followPattern…`，新的 Cloze 照樣叫 `cloze…`），型別與放的位置由後端定。每一節先寫「現在」，再寫「要變成」，最後是要問的。

Scramble 的 §1–§4 跟 [Scramble 那一包的契約](../sentence-scramble/API-CONTRACT.md) 一樣，這裡只重述結論並補上 Follow Pattern 與 Cloze 的對應欄位。

---

## 核心概念

1. **老師決定的是總句數，系統輪流分給勾的點。** 每點份額前端算好送出，後端照份額生，第二步的小卡才對得上。四種一樣。
2. **句子有兩種來源**：AI 生成、專案教學點現成的例句。例句**直接帶進 practice**（不生），只為沒例句的點生。Scramble、Cloze 的例句就是句子；Building 的例句是 Suggested answer，Question 由後端照教學點寫。Response 沒有例句來源。
3. **生成後只做增量**：回頭多勾點 ＝ append；第二步 + ＝ 對一個點 append 一句；取消的點 ＝ 拿掉它的句子。整份重生只在第一次 Generate。
4. **上限**：總數 20（`MAX_QUESTION_COUNT`）、每點 5——前端擋，後端驗證。
5. **Cloze 是新的 PracticeType**，資料形狀照 Scramble（句子 ＋ 切詞 ＋ 音檔），多存「空格在哪、干擾詞是什麼」。

---

## 1. 建立與份額（第一步 Generate）

### 現在

| 練習 | `upsertPractice` 帶什麼 |
|---|---|
| Scramble | `scrambleTeachingPoints: [String]`、`scrambleSentenceCount: Int`（1–20）、`projectConfigSk`／`projectConfigSks`、`maxAttempts` |
| Response／Building | `followPatternTeachingPoints: [String]`、`followPatternQuestionCount: Int`（1–20）、`practiceSubType`（GUIDED_RESPONSE／SENTENCE_BUILDING）、`projectConfigSk`／`projectConfigSks`、`maxAttempts`；`pinyinPreference`、`translationPreference` 建立時固定送 STUDENT_CHOICE |
| Cloze | 沒有 |

後端照 count 生，怎麼分到點只有一句說明 *shared out over the selected teaching points*。CREATE 模式回頭改點會整份重生（EDIT 模式已經走 append）。

### 要變成

```graphql
input PointCountInput { teachingPoint: String!  count: Int! }   # count 1–5

# PracticeInput — 三組平行欄位，各自只在自己的 practiceType 用
scrambleSentenceCount: Int                       # 總數（老師填的，點數 ～ 20），同現行
scramblePointCounts: [PointCountInput!]          # 新增：每點幾句，前端算好；Σ count = scrambleSentenceCount

followPatternQuestionCount: Int                  # 同現行
followPatternPointCounts: [PointCountInput!]     # 新增

clozeTeachingPoints: [String!]                   # 新增（照 scramble 那一組）
clozeSentenceCount: Int
clozePointCounts: [PointCountInput!]
```

- 份額規則（前端算）：T 句分給 N 個勾的點，每點 ⌊T÷N⌋，照勾的順序前 T mod N 個點多一句。
- 後端照 `…PointCounts` 生，每句（每題）帶它的 `teachingPoint`（Follow Pattern 的 `followPattern.teachingPoint` 本來就有；Scramble 用 `teachingPointHighlights`／usage 對得到）。
- **CREATE 回頭改點**：前端算出新增的點，只送 `…AppendTeachingPoints`（照它的份額）；取消的點送整份 `…Sentences`／`…Questions`（不含那些句）。**不再送整份重生**。
- 沒有 `…PointCounts` 的舊 practice：行為同現行。

> **要問**：CREATE 第一步回頭多勾點能不能走 append？後端生成有沒有「這個 practice 已經有句子」的分支？（Scramble 包 E1；Follow Pattern 同一題）
> **要問（問題 1）**：總數 20、每點 5 後端有沒有擋？四種同一個常數？

---

## 2. 例句來源（第一步 Example sentences from teaching points）

### 現在

沒有。例句只存在專案的 vocab（`vocabHandlerResult.result.vocab[].example1／example2`：中文、拼音、翻譯）。Scramble 與 Follow Pattern 的句子一律 AI 生。

### 要變成

```graphql
input SourceSentenceInput {
  teachingPoint: String!
  content: String!             # 例句中文
  contentPinyin: String        # 專案有就帶
  contentTranslation: String   # 專案有就帶
  source: SourceSentenceOrigin # PROJECT_EXAMPLE（之後若有別的來源再加）
}

# PracticeInput，跟 §1 同一次 upsertPractice 送
scrambleSourceSentences: [SourceSentenceInput!]       # Scramble：例句直接是句子
clozeSourceSentences: [SourceSentenceInput!]          # Cloze：例句直接是句子，再挖教學點
followPatternSourceAnswers: [SourceSentenceInput!]    # Building 專用：例句直接是 Suggested answer
```

- **Scramble／Cloze**：這些句子直接進 practice（切詞 `splitContent`、拼音 cells、音檔跟生成的走同一條管線），**不另外生**；每個點的 `count − 該點的例句數` 才生新的。老師勾的例句多過份額時以例句為準（總數跟著多，前端已夾在 20 以內）。
- **Building**：每一句例句變一題——`followPattern.suggestedAnswer` ＝ 例句、`answerChunks` 照例句切、`spans`（教學點在答案裡的位置）照例句算、`question` 由後端照教學點寫（同現行 SENTENCE_BUILDING 的寫法）。該點份額不夠的才生。回傳帶 `source: PROJECT_EXAMPLE` 讓第二步標 *Example*。
- **Response** 沒有這個欄位。
- 例句的拼音、翻譯專案有就沿用，不重生。

> **要問（問題 3）**：SENTENCE_BUILDING 的生成能不能吃一句現成的句子當答案、只寫 Question？
> **要問**：建立時帶指定句子可以嗎？管線能不能跳過「生句」只跑「切詞 ＋ 音檔」？專案例句有沒有音檔？生成能不能避開已勾的例句？（Scramble 包 E7、E8、E9）

---

## 3. 第二步 +／−（每點加減一句）

### 現在

Scramble：`applyPatch({ scrambleAppendTeachingPoints: [point] })`；Follow Pattern：`applyPatch({ followPatternAppendTeachingPoints: [point] })`。後端為那個點 append，新句接在清單**最後**。刪除走整份 `scrambleSentences`／`followPatternQuestions` 覆蓋。

### 要變成

| 動作 | 送什麼 | 後端 |
|---|---|---|
| **+**（某點） | `scrambleAppendTeachingPoints`／`followPatternAppendTeachingPoints`／`clozeAppendTeachingPoints: [point]`（同現行） | **只生一句**；回傳整份 `updatedArticleArray`，新句帶 `teachingPoint`。前端把它移到那個點最後一句後面，立刻用整份 `…Sentences`／`…Questions` 送一次順序 |
| **−**（某點） | 整份 `…Sentences`／`…Questions`，不含那個點最後一句（同現行刪除） | 同現行 |
| 上限 | 前端擋：總數 20、每點 5 | 後端驗證：append 後超過 20 回錯；每點超過 5 回錯 |

- 若後端能接受 append 帶位置（例如 `{ teachingPoint, afterIdx }`），前端就不用補送一次順序——二選一。

> **要問（問題 5／Scramble 包 E10）**：append 一次生幾句？能不能限定一句、並在回傳裡標出哪一句是新的？三種都要。

---

## 4. 句子／題目編輯（第二步）

### Scramble（不變）

`scrambleSentences: [{ idx, content, contentPinyin, contentTranslation, splitContent }]` 整份送（同現行 `sentence-scramble-preview.js`）。排序 ＝ `idx` 照新順序；剪刀改 `splitContent`、`willRegenerate: false`；改中文 `willRegenerate: true` 後端重算那一句；刪除 ＝ 不在陣列裡；Edit Pinyin ＝ `splitContentPinyinOverride`。

### Response／Building（不變）

`followPatternQuestions: [{ idx, question, suggestedAnswer, pattern（只有 GUIDED_RESPONSE）, teachingPoint, questionPinyin, questionTranslation, answerPinyin, answerTranslation, patternPinyin, patternTranslation }]` 整份送（同現行 `follow-pattern-preview.js`）。存前前端跑 `findQuestionFailure`（缺中文、缺答案、答案沒含教學點、pattern 沒空格）。SENTENCE_BUILDING 的 `question` 不送（後端寫的）。

### Cloze（新）

```graphql
input ClozeSentenceInput {
  idx: Int
  content: String!              # 整句中文
  contentPinyin: String
  contentTranslation: String
  distractors: [String!]!       # 固定 3 個；老師只能改字
}
# PracticeInput
clozeSentences: [ClozeSentenceInput!]
```

回傳（`updatedArticleArray[]` 多一塊，形狀照 `followPattern`）：

```graphql
cloze {
  teachingPoint: String
  spans: [[Int!]!]              # 空格在句子裡的位置（字元區間），兩槽的點兩段；後端算
  answerChunks: [{ text, pinyin, highlight }]   # 答案詞塊（＝教學點），兩槽兩塊
  distractors: [String!]        # 3 個
}
```

- 空格固定挖教學點本身，前端不送位置；中文改了後端重算 `spans`、拼音、翻譯、音檔。
- `splitContent`／`splitContentPinyin`／`s3Path` 跟 Scramble 一樣存，學生端念整句。

> **要問（Scramble 包 E2、E3）**：改一句中文只重算那一句還是整份？剪刀的 `splitContent` 後端重推 cells 時會不會改回去？

---

## 5. 第三步設定

| 控制項 | 欄位 | 哪幾種 | 備註 |
|---|---|---|---|
| Practice mode Text／Audio only | `audioMode: Boolean` | Response、Building | 現行 |
| Pinyin Shown｜Hidden｜Choice by student | `pinyinPreference` PINYIN／NO_PINYIN／STUDENT_CHOICE | 四種 | 現行 |
| Translation Shown｜Hidden｜Choice by student | `translationPreference` SHOW／HIDE／STUDENT_CHOICE | 四種 | **Scramble／Cloze 新送**；欄位本來就在 PracticeInput。建立時預設 STUDENT_CHOICE（照 Follow Pattern 的做法） |
| Speed Slow／Normal／Fast／Choice by student | `speedPreference` TEACHER_FIXED／STUDENT_CHOICE ＋ `changeSpeed`（0.6／0.8／1.0） | 四種 | 改了重生音檔 |
| Voice | `audioOption`（zh-CN 四個） | 四種 | 改了重生音檔 |
| Max tries | `maxAttempts` 1–5，預設 3 | 四種 | 學生端用完揭曉正解 |

- 學生端 Scramble／Cloze 要讀 `translationPreference`（現在只有 Follow Pattern 讀）：HIDE 關、其餘開；STUDENT_CHOICE 才有齒輪面板的開關。
- 重生音檔的等待文案：走 audio 分支（*Updating audio…*），不是各型別的 *Generating sentences…*／*Generating questions…*（Scramble 包 E6，Follow Pattern 同款）。

---

## 6. 新型別 Sentence Cloze

```graphql
enum PracticeType { …  SENTENCE_CLOZE }      # 名字由後端定；前端 PRACTICE_TYPES 跟著加
```

- **建立**：§1 的 `cloze…` 欄位。生成 ＝ 對每個教學點生一句、把教學點挖空、再生 3 個干擾詞。
- **學生作答**：一題一個答案（選了哪個詞塊），送出與批改照 Scramble 的 `submitSentenceScrambleAnswers`／`saveSentenceScrambleProgress` 做一組對應的 mutation；試幾次用 `maxAttempts`。答對／答錯／揭曉的畫面設計還沒定。
- **Choose Practice Type**：`PRACTICE_TYPE_ENTRIES` 加一筆（label Sentence Cloze、Sentence 欄、`practiceType: SENTENCE_CLOZE`、`subType: null`）；`STEPS_BY_TYPE` 加 `['Teaching Points', 'Edit Sentences', 'Settings', 'Assign Practice']`。
- **題庫**：`MULTI_CHOICE_CATEGORIES` 拿掉 `usage`；題庫精靈第二步、學生端 Comprehension Quiz 不再有這一類。

> **要問（問題 2）**：生成能不能沿用 Follow Pattern 現有的「每點生一句 ＋ 挖空成 `＿＿＿`」，再多生 3 個干擾詞？干擾詞從哪裡來（同專案其他教學點、AI 近義詞）？
> **要問（問題 4）**：舊題庫裡已有的 Fill in blank 題怎麼辦？

---

## 7. 不變的

- 學生端 `assignments/content/sentence-scramble/`（除了多讀 `translationPreference`）、`assignments/content/follow-pattern/` 全部。
- `MAX_QUESTION_COUNT = 20`、`MAX_MAX_ATTEMPTS = 5`。
- `scrambleCustomPoints`、`projectConfigSks`、`_scrambleGenerated*`／`_followPatternGenerated*` 的 baseline 判斷（只是多比 `…PointCounts`）。
- 第四步 Assign 的 mutation。

---

## 8. 待確認

| # | 題目 | 卡住哪一項 |
|---|---|---|
| 問題 1 | 兩個上限後端有沒有擋、四種共用 | §1 |
| 問題 2 | Cloze 生成沿用 Follow Pattern 管線、干擾詞來源 | §6 |
| 問題 3 | Building 吃現成句子當 Suggested answer | §2 |
| 問題 4 | 舊題庫的 Fill in blank 題 | §6 |
| 問題 5 | Follow Pattern append 一次一題、回傳標新題 | §3 |
| Scramble 包 E1 | CREATE 回頭改點走 append | §1 |
| Scramble 包 E2、E3 | 改一句只重算那一句；剪刀的 `splitContent` | §4 |
| Scramble 包 E6 | 重生音檔的等待文案走錯分支 | §5 |
| Scramble 包 E7、E8、E9 | 建立時帶指定句子；例句有沒有音檔；生成避開已勾例句 | §2 |
| Scramble 包 E10 | append 一次一句、回傳標新句 | §3 |
