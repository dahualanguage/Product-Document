# Choose Practice Type — Engineer Handoff

老師按下 **New Practice** 之後那個對話框：把藏起來的第二層攤平成八張同層卡片，八個練習全部改名，素材沒建立時把卡片鎖起來。

**這不是重寫，是在現有畫面上改。** 對話框已經上線，這一版動的是卡片的數量、名字、版面與顏色，**沒有新增任何練習型別，也沒有動任何 enum 值**。程式碼基準：`dahua-dash` `origin/develop` @ `17026dda`。

- 設計原型：[`choose-practice-type.html`](choose-practice-type.html)
- 鎖定狀態：[`locked-state.html`](locked-state.html)（`?s=nobank` / `?s=nocontent` 直接開到某個情境）
- 完整設計說明與決策理由：[v1 spec](https://project-logeg.vercel.app/specs/chinese-modules/iterations/v1-practice-hierarchy/spec.html)

---

## 為什麼要做

現在的對話框是**六張卡**，但實際結構是兩層——`Vocabulary` 和 `Sentence Patterns` 各自還有兩個子項目，藏在建立流程的第 2 步。老師在選的當下看不到，選完才發現還要再選一次。

攤平之後產生兩個直接的問題：

1. **同名不同物。** 第一層和第二層各有一個 `Mirroring`、一個 `Multiple Choice`，名字一樣、意思不同。
2. **依賴看不出來。** `Multiple Choice` 和 `QA Practice` 需要題庫，但六張卡視覺權重完全一樣，要點下去才知道沒題庫、做不了。

---

## 八個名稱

攤平之後剛好是四欄。**左邊是新名稱，右邊是不能動的 enum。**

| 新名稱 | 欄 | 現在叫什麼 | `practiceType` | 子型別 |
|---|---|---|---|---|
| Content Mirroring | Content | Mirroring Practice | `MIRRORING` | — |
| Vocabulary Mirroring | Vocabulary | Vocabulary → Mirroring | `VOCABULARY` | `generateVocaUpdatedArticleArrayType = MIRRORING` |
| Vocabulary Quiz | Vocabulary | Vocabulary → Multiple Choice | `VOCABULARY` | `… = MULTIPLE_CHOICE` |
| Sentence Scramble | Sentence | Sentence Scramble（不變） | `SENTENCE_SCRAMBLE` | — |
| Sentence Response | Sentence | Sentence Patterns → Guided Response | `FOLLOW_PATTERN` | `practiceSubType = GUIDED_RESPONSE` |
| Sentence Building | Sentence | Sentence Patterns → Sentence Building | `FOLLOW_PATTERN` | `practiceSubType = SENTENCE_BUILDING` |
| Comprehension Quiz | Comprehension | Multiple Choice | `MULTIPLE_CHOICE` | — |
| Open-ended Questions | Comprehension | QA Practice | `QA` | — |

`Open-ended Questions` 是八個裡唯一的複數，不是漏改。

**欄名講的是「這一欄在練哪一種東西」**，不是素材從哪來。所以 `Sentence Scramble`（素材是課文句子）跟兩張教學點練習同欄——對學生來說它們都是「處理一個句子」。

---

## 三條規則

**① 名稱是標籤，enum 是契約。**
`PRACTICE_TYPES` 的值進 DB、進 GraphQL、也進 URL（`/dashboard/practice/create?type=MIRRORING`）。**一個都不要改。** 這次只換顯示用的字。

**② 既有練習不會被改名。**
`practiceName` 是老師自己打的，不是從型別名產生的。改標籤不會動到任何一筆既有資料，**不需要 migration**。

**③ 有兩組字長得一樣但不是同一件事。**
`Multiple Choice` 和 `Q&A` 同時是**練習型別**和 **Question Bank 裡的題型**。這次只改前者。**不要用全域取代。**

---

## 一個練習型別對到兩個名字

`VOCABULARY` 和 `FOLLOW_PATTERN` 各自要顯示成兩個名字，所以光看 `practiceType` 不夠，要一起看子型別。

**好消息：兩個子型別欄位都已經存在，不用新增。**

| 子型別欄位 | 屬於 | `getPractices` | `getAssignments` / `getAssignmentHistories` |
|---|---|---|---|
| `generateVocaUpdatedArticleArrayType` | VOCABULARY | ✅ 有 | ✅ 有 |
| `practiceSubType` | FOLLOW_PATTERN | ✅ 有 | ❌ **沒有** |

所以：

- **老師端練習列表與篩選** → 兩個都拿得到，純前端改，零後端成本
- **指派 / 歷史 / 學生端** → Vocabulary 顯示得出來，**Follow Pattern 顯示不出來**，缺 `practiceSubType`

要做的是把 `getTypeLabel(practiceType, subType)` 這件事集中成一個 helper，取代現在散在各處的 label 查表。

---

## 標籤登記處有四份

現在同一批標籤散在四個地方，改名要四個一起動，**建議這次順手收斂成一份**：

| 檔案 | 是什麼 |
|---|---|
| `src/components/practice/practice-type-chip.js` → `PRACTICE_TYPE_CONFIG` | 列表上的類型 chip（8 個呼叫端） |
| `src/sections/teacher/shared/practice-type-config.js` → `PRACTICE_TYPE_CONFIG` | Teacher Dashboard 用的另一份，含 `NO_REVIEW_TYPES` |
| `src/sections/practice/view/index.js` → `PRACTICE_TYPE_FILTER_TABS` | 篩選下拉 |
| `src/utils/discord-notify.js` ＋ `src/app/api/discord-notify/route.js` → `TYPE_LABELS` | Discord 通知（**最容易漏**） |

前兩份連顏色都不一樣（chip 的 `MIRRORING` 是 `primary` 綠，teacher 那份是 `#EA7A21` 橘），改名前先確認要不要一起統一。

---

## 要改的檔案

### 1. 建立對話框 — `src/sections/practice/components/AddNewPracticeDialog.js`

- 六張卡 → **八張**，四欄排列，欄高 `1 / 2 / 3 / 2`
- 每一欄上方一個共用標題＋一條該欄顏色的線
- icon 圓 → **學生畫面示意圖**（SVG 在原型裡，可直接抄）
- `maxWidth: 920` → **`1080`**、`maxWidth="md"` → `"lg"`
- 八張卡的 `onClick` 要能帶子型別出去（Vocabulary 兩張、Sentence 兩張）

### 2. 建立流程各少一步 — `src/sections/practice/view/unified/practice-unified-view.js`

`StepTwoVocabularyType` 和 `StepTwoSentencePatternType` 這兩個「Practice Type」步驟**在選卡當下就決定了**，變成多餘。四條流程各少一步，`STEPS_BY_TYPE` 要跟著重寫。子型別改成從對話框帶進來的參數。

### 3. 標籤四份 → 一份

見上一節。同時把 `getTypeLabel(type, subType)` 做出來。

### 4. 鎖定狀態 — 對話框 ＋ `locked-state.html`

現在只有「專案沒內容」會事先擋（`hasContent === false` → 整批 `opacity .5` + `pointerEvents: none`）；**沒題庫要點下去才知道**（`handleQbType()` 發現 `relatedQbs.length === 0` 才跳 Alert）。

這一版：

- 題庫的檢查**提前到 render 時**，`Comprehension Quiz` / `Open-ended Questions` 直接鎖住
- **不要用 `pointerEvents: none`** —— 卡片本體轉灰，但「Create Question Bank →」要維持可讀可點。鎖定的目的是指路，不是擋住
- 示意圖 `grayscale(1)` + `opacity .45`；欄位標題那條線**維持原色**（被鎖的是卡片，不是欄位）
- 卡上的解鎖動線只在「部分鎖定」時出現；八張全鎖時只留頂部那一個入口

> ⚠️ **教學點不列入檢查。** 教學點是在建立 Project 的流程裡就決定好的，「有 Project 但沒有教學點」實務上不會發生。

### 5. Mixed Mode 清掉

`practice-type-selection.js` 的 UI 早就註解掉了，這次**連資料層一起清**：`src/enum/practices.js` 的 `VOCABULARY_PRACTICE_TYPES.MIXED`、`UI_VOCABULARY_PRACTICE_TYPES.MIXED`，以及 `UI_TO_DB_VOCABULARY_TYPE` / `DB_TO_UI_VOCABULARY_TYPE` 兩張對照表裡的對應列。

---

## 不要順手改的

| | |
|---|---|
| **NEW 徽章** | 現有的全部留著。等**下一個新練習上線時一起拿掉**——新的那張掛 NEW，同時把舊的清乾淨。這一版不動。 |
| **Sentence Patterns 的可見性** | 列表篩選用 `isDahuaAdmin` 擋、對話框沒擋，這個不一致**維持現況**。攤平之後兩張比照原本那張處理。 |
| **對話框高度** | 三列卡片＋示意圖比現在高。怎麼處理（`maxHeight` / 捲軸 / 密度）由你在實機上判斷，設計端沒有指定。 |

---

## 顏色

四欄各自繼承**欄內某一張卡在現在線上已經有的顏色**，所以老師從舊介面過來認得出來。

| 欄 | ink | tint | wash | label | 繼承自 |
|---|---|---|---|---|---|
| Content | `#00B95C` | `#BBF1D0` | `#EFFBF4` | `#00754A` | Mirroring 的 `primary` |
| Vocabulary | `#EFA00B` | `#FFE49E` | `#FFF8E7` | `#8F6209` | Vocabulary 的 `warning` |
| Sentence | `#EC4899` | `#FBD5E8` | `#FEF2F8` | `#BE185D` | Sentence Scramble 的 `#EC4899` |
| Comprehension | `#8B5CF6` | `#E9DDFD` | `#F7F3FE` | `#6D28D9` | Multiple Choice 的 `#7C3AED` |

規則只有一條：**示意圖裡「學生會動到的部分」用該欄的顏色畫，其餘維持灰。** 灰色是素材，顏色是學生的那一筆。

`label` 是壓深版，**只給欄位標題的文字用**——粉彩當 12px 文字讀不動（`#EFA00B` 在白底上只有 1.9:1）。

被放掉的兩個顏色是 Sentence Patterns 的 `#00897B` 和 QA 的 `info` 藍，正好是卡片換了欄的那兩張。

---

## 順手補的兩件事

原型裡已經做了，實作時一併帶上，都不影響外觀：

- 卡片加 `tabindex` 與該欄顏色的 focus ring（現在用滑鼠以外的方式選不到卡）
- `prefers-reduced-motion` 時關掉 NEW 徽章的脈動動畫

---

## 動工順序

**階段 1 — 純前端，不必等後端**
1. 八個名稱：四份標籤登記處收斂成一份，做出 `getTypeLabel(type, subType)`
2. 建立對話框改成八張卡＋四欄＋示意圖＋顏色
3. 老師端練習列表與篩選改用新 helper（子型別 `getPractices` 已經有）
4. Mixed Mode 清掉

**階段 2 — 建立流程**
5. `STEPS_BY_TYPE` 重寫，四條流程各少一步，子型別改由對話框帶入

**階段 3 — 鎖定狀態**
6. 題庫檢查提前到 render，鎖定卡片＋解鎖動線

**階段 4 — 要後端回答之後**
7. 指派 / 歷史 / 學生端的 Follow Pattern 名稱（見下）

---

## 動工前要先問後端的一件事

**`getAssignments` / `getAssignmentHistories` 讀不讀得到 `practiceSubType`？**

`practiceSubType` 已經存在於 Practice 上（`upsertPractice` 寫、`getPractices` 讀），但這兩支 query 沒有帶。而 Assignment 是把 `practiceType` 攤平存的，不是 nested 在 practice 底下。

- **如果 Assignment 上讀得到** → 前端在 query 加一個欄位就結束，零後端成本
- **如果讀不到** → 需要後端補，那時候再開 `API-CONTRACT.md`

在有答案之前，指派 / 歷史 / 學生端的 `FOLLOW_PATTERN` 先維持顯示 `Sentence Patterns`（現況），不要硬猜。Vocabulary 那兩張不受影響，兩支 query 都已經有 `generateVocaUpdatedArticleArrayType`。

---

## 檢查清單

- [ ] `src/enum/practices.js` 的 `PRACTICE_TYPES` 一個字都沒動
- [ ] Question Bank 的 `Multiple Choice` / `Q&A` 一個字都沒動
- [ ] 四份標籤登記處都改到了（**特別是 discord-notify 兩支**）
- [ ] 建立一個新練習 → 列表 → 篩選 → 指派 → 學生端 → 完成 → Discord 通知，全程名稱一致
- [ ] Vocabulary 兩張、Sentence 兩張在列表上顯示的是各自的名字，不是母卡的名字
- [ ] 舊 URL `?type=MIRRORING` 仍然開得起來
- [ ] 既有練習的 `practiceName` 沒有被動到
- [ ] 沒題庫時 Comprehension Quiz / Open-ended Questions 鎖住，而且「Create Question Bank」點得下去
- [ ] 鍵盤 Tab 選得到卡片，focus ring 看得見
