# Choose Practice Type 改版 — 工程說明

給實作的人看的。設計理由不在這裡，在 `spec.html`。

- **設計稿**：`choose-practice-type-color.html`、`locked-state.html`
- **掃描對象**：本機 `dahua-dash-develop`（`package.json` 5.7.0，檔案日期 2026-06-18）
- **掃描日期**：2026-08-27

---

## 1. 這次做什麼

三件事，可以分開上：

| # | 事情 | 風險 |
|---|---|---|
| 1 | 八個練習**改名**，四欄重新分組 | 低，但要改的地方散 |
| 2 | 建立對話框從六張卡**攤平成八張**，建立流程各少一步 | 中，動到 routing 與 step 定義 |
| 3 | 素材沒建立時**把卡片鎖起來** | 低，純前端 |

**第 1 件有一個阻擋點，見 §4，先看那一節再排時程。**

---

## 2. 名稱對照

| 新名稱 | 欄 | 現在叫什麼 | 對應的 DB `practiceType` |
|---|---|---|---|
| Content Mirroring | Content | Mirroring Practice | `MIRRORING` |
| Vocabulary Mirroring | Vocabulary | Vocabulary → Mirroring | `VOCABULARY` ＋子型別 `MIRRORING` |
| Vocabulary Quiz | Vocabulary | Vocabulary → Multiple Choice | `VOCABULARY` ＋子型別 `MULTIPLE_CHOICE` |
| Sentence Scramble | Sentence | Sentence Scramble（不變） | 本機 checkout 沒有，見 §6 |
| Sentence Response | Sentence | Sentence Patterns → Guided Response | 同上 |
| Sentence Building | Sentence | Sentence Patterns → Sentence Building | 同上 |
| Comprehension Quiz | Comprehension | Multiple Choice | `MULTIPLE_CHOICE` |
| Open-ended Questions | Comprehension | QA Practice | `QA` |

`Open-ended Questions` 是八個裡唯一的複數，不是漏改。

---

## 3. 三條規則

**① 名稱是標籤，enum 是契約。**
`MIRRORING` / `VOCABULARY` / `MULTIPLE_CHOICE` / `QA` 這些值進 DB、進 GraphQL
（`upsertPractice.practiceType`）、也進 URL（`/dashboard/practice/create?type=MIRRORING`）。
**一個都不要改。** 這次只換顯示用的字。

**② 既有練習不會被改名。**
`practiceName` 是老師自己打的，不是從型別名產生的
（唯一例外是 Word Bank 自動命名 `Word Bank Mirroring - {date}`，那是另一個功能）。
所以改標籤不會動到任何一筆既有資料，也不需要 migration。

**③ 有兩組字長得一樣但不是同一件事。**
`Multiple Choice` 和 `Q&A` 同時是**練習型別**和 **Question Bank 裡的題型**。
這次只改前者。全域取代必爆，見 §5.2。

---

## 4. 阻擋點：一個 `practiceType` 對不到八個名稱

攤平之後，`VOCABULARY` 這一個 enum 值要顯示成兩個名字
（Vocabulary Mirroring / Vocabulary Quiz），`FOLLOW_PATTERN` 之後也是兩個。
但現在畫面上拿得到的只有頂層型別：

- `PracticeTypeChip` 有 **8 個呼叫端，全部只傳 `type={practiceType}`**
  （`practice-table-row.js:208`、`practice/view/index.js:272`、`assignments/view/history/index.js:191`、
  `student/practice/list/practice-cards-item.js:250`、`student/practice/completed/practice-accordion-item.js:102`、
  `student/practice/submitted/submitted-accordion-item.js:80`、
  `assignments/content/vocabulary/practice-header.js:32`、`layouts/dashboard/header.js:85`）
- 全 repo **grep 不到 `vocabularyPracticeType` 這個欄位**——子型別在建立流程裡選完就沒有被讀回列表

**所以列表、篩選、通知這三個地方沒辦法顯示新的八個名字，除非先補子型別。**

要先決定走哪一條：

| 方案 | 做法 | 代價 |
|---|---|---|
| **A. 補子型別欄位**（建議） | practice 物件多帶一個 `practiceSubType`，`PracticeTypeChip` 改吃 `(type, subType)` | 要動 GraphQL query／schema，8 個呼叫端都要補傳 |
| **B. 拆 enum** | 新增 `VOCABULARY_MIRRORING` / `VOCABULARY_QUIZ` 等值 | DB 要 migration、舊 URL 會失效，違反規則① |
| **C. 只改建立畫面** | 對話框用新名字，列表／篩選維持舊的四個 | 老師在兩個畫面看到兩套名字，等於沒解決 §3.1 的問題 |

沒決定之前，§5 的字串只能改一部分。

---

## 5. 字串盤點

### 5.1 要改的：**39 處 / 17 個檔案**

| 檔案 | 處 |
|---|---|
| `sections/practice/components/AddNewPracticeDialog.js` | 4 |
| `components/practice/practice-type-chip.js` | 4 |
| `sections/practice/view/index.js` | 4 |
| `app/api/discord-notify/route.js` | 6 |
| `sections/practice/components/CreatePracticeSuccessDialog.js` | 3 |
| `config/practices.js` | 3 |
| `sections/practice/view/vocabulary/create/practice-type-selection.js` | 3 |
| `sections/assignments/view/history/mc/index.js` | 2 |
| `sections/projects/view/create/steps/confirm/project-create-dialog.js` | 2 |
| `sections/observability/view/index.js` | 1 |
| `sections/practice/view/unified/steps/step-two-vocabulary-type.js` | 1 |
| `sections/assignments/content/vocabulary/start-page.js` | 1 |
| `sections/assignments/content/vocabulary/completion-dialog.js` | 1 |
| `sections/student/word-bank/component/mastery-progress.js` | 1 |
| `sections/student/word-bank/practice-hub/constants.js` | 1 |
| `sections/questionsBank/view/generate/questions-generate-view.js` | 1 |
| `sections/student/practice/qa/index.js` | 1 |

這 39 處只是**名稱本身**。同一批檔案裡還有說明文字、tags、標題句
（例如 `AddNewPracticeDialog` 的四段 description 和四組 tags、
`CreatePracticeSuccessDialog` 的 highlights），那些也要一起看過，數量再加一倍上下。

四個**單一事實來源**應該優先收斂，其餘都是從它們長出來的：

1. `components/practice/practice-type-chip.js` → `PRACTICE_TYPE_CONFIG`（列表上的標籤）
2. `sections/practice/view/index.js` → `PRACTICE_TYPE_FILTER_TABS`（篩選下拉）
3. `sections/practice/components/AddNewPracticeDialog.js`（建立對話框）
4. `app/api/discord-notify/route.js` → `TYPE_LABELS`（Discord 通知，最容易漏）

> **順手清掉的重複**：`PRACTICE_SUCCESS_CONFIG` 有兩份，
> `config/practices.js:126` 和 `sections/practice/components/CreatePracticeSuccessDialog.js:25`，
> 欄位不同名（`heroTitle` vs `title`）但講同一件事。改名時兩份都要動，建議直接合併成一份。

### 5.2 不能改的（同字不同義）：**30 處 / 15 個檔案**

`Multiple Choice` / `Q&A` 在這些地方指的是 **Question Bank 的題型**或**題目類別**，
不是練習型別。改到就是 bug：

| 檔案 | 處 |
|---|---|
| `utils/question-bank-helpers.js` | 7 |
| `sections/practice/components/mc-questions-preview.js` | 4 |
| `sections/practice/view/unified/steps/step-one-mc.js` | 3 |
| `sections/questionsBank/view/generate/add-question-modal.js` | 2 |
| `sections/projects/handout/components/handout-page.js` | 2 |
| `sections/projects/handout/hooks/use-handout-data.js` | 2 |
| `enum/practices.js`（註解） | 2 |
| 其餘 8 檔各 1 | 8 |

**不要用全域取代。** 一個檔一個檔看。

### 5.3 不能改的（enum / DB / URL）：**132 處**

| 值 | 出現次數 |
|---|---|
| `'QA'` | 45 |
| `'MIRRORING'` | 33 |
| `'VOCABULARY'` | 27 |
| `'MULTIPLE_CHOICE'` | 27 |

### 5.4 i18n：**不用改，因為根本沒接**

`src/locales/langs/*.json` 五個語系檔加起來只有 7.7 KB，
裡面**沒有任何一個練習名稱**——practice 相關的字全部是硬編碼英文。

所以這次改名沒有翻譯成本。但也代表 CLAUDE.md 寫的
「所有使用者可見文字都要走 i18next」在 practice 這一塊沒有落實，
如果之後要補，改名是順便做掉的好時機（39 處本來就要一個一個動）。

---

## 6. 版本落差（重要）

**本機這份 checkout 比 spec 描述的狀態舊。** 掃描結果只是下限。

| | spec（`origin/develop @ 42b56202`） | 本機 checkout |
|---|---|---|
| 建立對話框卡片數 | 6 | **4** |
| `maxWidth` | 920 | 920（要改成 1080） |
| Sentence Scramble | 有 | **grep 不到** |
| Sentence Patterns / `FOLLOW_PATTERN` | 有 | **grep 不到** |
| Vocabulary 子型別畫面 | 有 | 有（`step-two-vocabulary-type.js`） |

**上工前先 pull develop 重掃一次。** 少掉的兩個練習
（Sentence Scramble、Sentence Patterns 及其兩個子項）會再帶進一批字串，
`PRACTICE_TYPES` enum 也要確認 `FOLLOW_PATTERN` 實際叫什麼。

---

## 7. 名稱以外要一起處理的

**建立流程各少一步。** 攤平之後 `StepTwoVocabularyType` 和
`StepTwoSentencePatternType` 這兩個「Practice Type」步驟在選卡當下就決定了，
`practice-unified-view.js` 的 `STEPS_BY_TYPE` / `VOCABULARY_MC_STEPS` 要跟著重寫。

**對話框要放寬。** `AddNewPracticeDialog.js` 的 `maxWidth: 920` → `1080`，
`maxWidth="md"` → `"lg"`。八張卡排成四欄三列，比現在高，`maxHeight: '85vh'` 要實機確認會不會出現捲軸。

**鎖定狀態。** 目前 `hasContent === false` 是整批 `opacity .5` + `pointerEvents: none`。
設計稿改成卡片本體轉灰、但解鎖動線可讀可點，所以不能沿用 `pointerEvents: none`。
題庫的檢查要從 `handleQbType()` 事後跳 Alert 提前到 render 時判斷（`relatedQbs.length === 0`）。

**Mixed Mode。** `practice-type-selection.js` 裡 `mixed` 已經 `available: false`，
但 `VOCABULARY_PRACTICE_TYPES.MIXED` 和 `UI_TO_DB` / `DB_TO_UI` 兩張對照表都還留著。
要嘛補回來、要嘛連資料層一起清掉，別再留著。

**Sentence Patterns 的權限。** 列表篩選用 `isDahuaAdmin` 擋，建立對話框沒擋。
攤平成 Sentence Response / Sentence Building 之後兩邊要一致。

---

## 8. 檢查清單

- [ ] pull develop，重跑一次 §5 的掃描（本機版本舊，見 §6）
- [ ] 決定 §4 走哪一個方案，沒決定之前不要動列表／篩選
- [ ] 四個單一事實來源先改（chip config / filter tabs / 建立對話框 / discord `TYPE_LABELS`）
- [ ] 合併兩份 `PRACTICE_SUCCESS_CONFIG`
- [ ] `enum/practices.js` 一個字都沒動
- [ ] Question Bank 的 `Multiple Choice` / `Q&A` 一個字都沒動
- [ ] 建立一個新練習 → 列表 → 篩選 → 指派 → 學生端 → 完成 → Discord 通知，全程名稱一致
- [ ] 舊 URL `?type=MIRRORING` 仍然開得起來
- [ ] 既有練習的 `practiceName` 沒有被動到
