# 題卡骨架（Question card）— Engineer Handoff

老師建立練習時，看生成出來的句子或題目的那一步，一題一張卡。**七種練習都有這種卡，現在五個檔各做各的：換序的方法、題號的寫法、刪除的圖示都不一樣。這一包把骨架定成一副，請七種一起改齊。**

網頁版（有目錄和嵌入的原型預覽，內容相同）：<https://project-logeg.vercel.app/specs/chinese-modules/iterations/question-card-spec.html>

**這不是重寫，是改現有畫面。只改前端，不用動後端。** 程式碼基準：`dahua-dash` `origin/develop` @ `e57f4a03`（2026-11-05）。

---

## 1. 原型怎麼看

四份原型，題卡的骨架是同一副；差別只在題號後面的 chip 和右上的鈕。

| 要看什麼 | 網址 |
|---|---|
| Sentence 四種的第二步 | [`question-card-sentence.html?type=scramble&step=2&n=12`](question-card-sentence.html?type=scramble&step=2&n=12)（`type` 換成 `fillin`、`response`、`building`） |
| Vocabulary Quiz 的第三步 | [`question-card-vocabulary-quiz.html?step=3`](question-card-vocabulary-quiz.html?step=3) |
| Comprehension Quiz 的第二步 | [`question-card-comprehension-quiz.html?step=2&proj=0`](question-card-comprehension-quiz.html?step=2&proj=0)。只看題卡的左欄、題號、刪除鈕 |
| Open-ended Questions 的第二步 | [`question-card-open-ended.html?step=2&proj=0`](question-card-open-ended.html?step=2&proj=0)。只看題卡的左欄、題號、刪除鈕 |

---

## 2. 範圍

### 哪些練習有題卡

| 練習 | 第幾步 | 題卡的檔案 | 現在的樣子 |
|---|---|---|---|
| Sentence Scramble | 2 | `steps/sentence-scramble-preview.js` | ∧ ∨ 疊在題號左邊，沒有把手、不能拖；題號是粉紅字 Q1；刪除是空心垃圾桶 |
| Sentence Cloze | 2 | 同上 | 同上 |
| Sentence Response | 2 | `steps/follow-pattern-preview.js` | 同上，題號是綠字 |
| Sentence Building | 2 | 同上 | 同上 |
| Vocabulary Quiz | 3 | `src/sections/practice/components/mc-questions-preview.js` | 把手在標頭那一列最左邊，只能拖、沒有 ∧ ∨；題號是綠色膠囊；刪除是實心垃圾桶 |
| Comprehension Quiz | 2 | `steps/mc-step-two-section.js`（`CombinedView`、`ConfigureView`） | 把手在標頭那一列最左邊，只能拖；題號寫 1.；刪除是 × |
| Open-ended Questions | 2 | `steps/qa-question-list.js` | 全部題目擠在一張卡裡、用橫線隔開；不能換序；題號寫 1；刪除是灰色 × |

沒寫完整路徑的都在 `src/sections/practice/view/unified/` 底下。Content Mirroring、Vocabulary Mirroring 沒有這種題卡，不在範圍內。

---

## 3. 題卡定案的樣子

一題一張卡。卡片分左右兩塊：左邊一條窄的直欄專門換序，右邊是內容。

```
┌────┬──────────────────────────────────────────────────────────┐
│ ∧  │ (Q1) [教學點或題型 chip]                ✂  ✎  🗑        │
│ ⠿  │ 各練習自己的內容                                         │
│ ∨  │                                                          │
└────┴──────────────────────────────────────────────────────────┘
```

### 規則

| 區塊 | 規則 |
|---|---|
| 左欄 | 卡片最左邊一條直欄，由上到下：∧、把手、∨。整條在卡片的高度上置中，卡片再高也只有一組 |
| 題號 | 灰色膠囊，寫 Q1、Q2…，在右邊內容第一列的最左邊。七種同一個顏色，不跟練習的色系走 |
| 題號後面 | 各練習自己的 chip，不改：Sentence 四種是教學點；Vocabulary Quiz 是詞 ＋ 題型；Comprehension Quiz、Open-ended 是題型 |
| 右上動作鈕 | 各練習自己的鈕照現在，刪除永遠排最後一顆 |
| 刪除鈕 | 空心垃圾桶圖示、紅色。七種都一樣，不用 ×、不用實心垃圾桶 |

### 換序

七種都有兩個方法換序：按上下鈕，或是拖。

| 動作 | 規則 |
|---|---|
| ∧、∨ | 按一下，這一題跟上一題／下一題交換位置，題號照新的位置重排。第一題的 ∧、最後一題的 ∨ 淡掉、不能按 |
| 拖 | 整張卡都可以拖（照 Vocabulary Quiz 現在的做法），把手是告訴老師「這張可以拖」。拖到另一張卡上放開，就移到那個位置。拖的時候這張卡變淡，游標底下那張卡的框變主色 |
| 存檔 | 換完順序怎麼存，照各練習現在的做法（Sentence 四種按 ∧ ∨ 現在就會存，拖也走同一條） |
| 忙碌中 | 正在存檔或生成的時候，∧ ∨ 和刪除停用、不能拖，照各練習現在的判斷 |

### 尺寸與顏色

| 東西 | 值 |
|---|---|
| 左欄 | 寬 26px；跟右邊內容隔 12px；卡片左邊內距 10px（其他三邊照各練習現在的）；∧、把手、∨ 之間隔 2px；整條垂直置中 |
| ∧、∨ | 按鈕 26×22px、圓角 6px、沒有底色；圖示 `ic:round-keyboard-arrow-up`／`-down` 22px；次要文字色 `#637381`；滑過底 `#F4F6F8`、圖示變主文字色；不能按時透明度 .25 |
| 把手 | 圖示 `ic:round-drag-indicator` 20px；淡色 `#919EAB`；游標 grab |
| 題號膠囊 | 高 24px、左右內距 8px、兩端全圓；底 `#F1F5F9`、框 1px `#E2E8F0`、字 `#475569` 12px／700 |
| 刪除鈕 | 圖示 `ic:round-delete-outline` 18px，`IconButton size="small"`。紅色照各檔現在的值（Sentence 四種 `#EF4444`；Vocabulary Quiz、Comprehension Quiz `error.main`）；Open-ended 從灰色改成 `error.main` |
| 拖曳中 | 被拖的卡透明度 .4；游標底下那張卡的框變 `primary.main`；過場 0.15 秒（照 `mc-questions-preview.js` 現在的值） |

---

## 4. 要改的地方

每一條：現在 → 改成 → 改哪個檔 → 哪幾種。

### 1. 換序的東西收到左欄

- **現在**：Sentence 四種的 ∧ ∨ 上下疊著、擠在題號左邊，沒有把手。Vocabulary Quiz、Comprehension Quiz 的把手在標頭那一列的最左邊，沒有 ∧ ∨。Open-ended 都沒有。
- **改成**：卡片最左邊一條直欄，由上到下 ∧、把手、∨，在卡片高度上置中。標頭那一列從題號開始。
- **改哪個檔**：`sentence-scramble-preview.js`、`follow-pattern-preview.js`、`mc-questions-preview.js`、`mc-step-two-section.js`、`qa-question-list.js`
- **哪幾種**：七種

### 2. Sentence 四種可以拖

- **現在**：只能按 ∧ ∨，一次移一格。
- **改成**：整張卡可以拖。放開時呼叫現有的 `handleReorder(from, to)`（它本來就收任意兩個位置）。拖曳的寫法照 `mc-questions-preview.js`。按了 Edit 或剪刀、卡片展開的時候不能拖。
- **改哪個檔**：`sentence-scramble-preview.js`、`follow-pattern-preview.js`
- **哪幾種**：Sentence 四種

### 3. Vocabulary Quiz、Comprehension Quiz 加 ∧ ∨

- **現在**：只能拖。
- **改成**：左欄多 ∧ ∨，按一下呼叫現有的 `onReorder(idx, idx − 1)`／`(idx, idx + 1)`。第一題的 ∧、最後一題的 ∨ 停用。
- **改哪個檔**：`mc-questions-preview.js`、`mc-step-two-section.js`（`CombinedView`、`ConfigureView` 兩個都改）
- **哪幾種**：Vocabulary Quiz、Comprehension Quiz

### 4. 題號改灰色膠囊

- **現在**：Sentence Scramble／Cloze 是粉紅字 Q1（`#EC4899`）。Response／Building 是綠字 Q1（`#10B981`）。Vocabulary Quiz 是綠色 `Chip color="primary"`。Comprehension Quiz 是灰字「1.」。Open-ended 是淡灰小字「1」。
- **改成**：七種都是灰色膠囊 Q1、Q2…（尺寸顏色見上一節）。
- **改哪個檔**：同第 1 條的五個檔
- **哪幾種**：七種

### 5. 刪除鈕統一成空心垃圾桶

- **現在**：Vocabulary Quiz 是實心垃圾桶 `ic:round-delete`。Comprehension Quiz 是紅色 × `ic:round-close`。Open-ended 是灰色 × `ic:round-close`。Sentence 四種已經是空心垃圾桶。
- **改成**：都用 `ic:round-delete-outline`。Open-ended 的顏色改成 `error.main`。
- **改哪個檔**：`mc-questions-preview.js`、`mc-step-two-section.js`、`qa-question-list.js`
- **哪幾種**：Vocabulary Quiz、Comprehension Quiz、Open-ended

### 6. Open-ended 一題一張卡

- **現在**：全部題目在同一張 `SectionCard` 裡，題與題之間一條橫線。
- **改成**：一題一張卡，卡與卡之間隔 12px。卡的外框照 Comprehension Quiz `CombinedView` 的那張（`Card variant="outlined"`，圓角、內距照它）。卡裡的題型 chip、題目、拼音、Suggested answer、播放鍵照現在。
- **改哪個檔**：`qa-question-list.js`
- **哪幾種**：Open-ended

### 7. Open-ended 可以換序

- **現在**：不能換序，只能刪。
- **改成**：跟其他六種一樣：左欄 ∧ ∨ ＋ 整張卡可以拖。
- **改哪個檔**：`qa-question-list.js`、`qa-step-two-section.js`
- **哪幾種**：Open-ended
- **卡住的**：現在沒有換序的程式，要先確認題目的順序改得動（第 5 節）。Open-ended 的第 1、4、5、6 條不用等它，左欄先放把手、∧ ∨ 等這一條一起上也可以。

### 8. Vocabulary Quiz 的提示句

- **現在**：題目清單標題右邊寫 *In this order · drag a card to reorder*。
- **改成**：*In this order · drag a card or use the arrows to reorder*
- **改哪個檔**：`mc-questions-preview.js`
- **哪幾種**：Vocabulary Quiz

### 不用改的

- Sentence 四種的刪除圖示、∧ ∨ 在第一題／最後一題停用的判斷：已經對，只是搬位置。
- Vocabulary Quiz、Comprehension Quiz 的拖曳：已經有，照留。
- 各練習刪到剩一題的擋法（Sentence 跳提示、Vocabulary Quiz 與 Open-ended 把鈕停用）、刪除鈕的提示文字：不動。
- 題號後面的 chip、卡片中間的內容、Edit 展開後的欄位：不動。

---

## 5. 要問的

查程式碼就能答，一題：

1. Open-ended 的題目是 `qa-step-two-section.js` 裡的 `articles` 陣列，現在只有刪除（`handleRequestDelete`）。換序能不能照 Sentence 的做法，用 `moveItem()`（`steps/shared/reorder.js`）改陣列順序再照原本的路存？學生端是不是照這個陣列的順序出題？（影響第 4 節第 7 條）

---

## 6. 驗收

照下面九步走一次，畫面都對就算過。

| # | 老師做什麼 | 畫面應該怎樣 |
|---|---|---|
| 1 | 建一個 Sentence Scramble，走到第二步 | 每張卡最左邊一條直欄：∧、把手、∨，垂直置中。題號是灰色膠囊 Q1，不是粉紅字。右上最後一顆是紅色空心垃圾桶 |
| 2 | 看第一張和最後一張 | 第一張的 ∧ 淡掉按不動，最後一張的 ∨ 淡掉按不動 |
| 3 | 按第二張的 ∧ | 它移到第一個位置，題號變 Q1；原本的第一張變 Q2 |
| 4 | 把第一張拖到第三張上放開 | 拖的時候那張卡變淡、第三張的框變綠；放開後它在第三個位置，題號重排 |
| 5 | 按任一張的垃圾桶 | 那一題消失，後面的題號往前補 |
| 6 | 換成 Sentence Cloze、Response、Building 各看一次第二步 | 左欄、題號、垃圾桶都跟第 1 步一樣；Response／Building 的題號不是綠字 |
| 7 | Vocabulary Quiz 走到第三步 | 左欄有 ∧、把手、∨（把手不在標頭那一列了）；題號是灰色膠囊；垃圾桶是空心的；標題右邊寫 *In this order · drag a card or use the arrows to reorder*。∧ ∨ 和拖都能換序 |
| 8 | Comprehension Quiz 走到第二步 | 左欄同上；題號是灰色膠囊 Q1，不是「1.」；刪除是垃圾桶，不是 ×。∧ ∨ 和拖都能換序 |
| 9 | Open-ended Questions 走到第二步 | 一題一張卡；左欄同上；題號是灰色膠囊 Q1；刪除是紅色垃圾桶。∧ ∨ 和拖都能換序（第 7 條做完之後） |

另外兩條：

- 七種練習的題卡截圖並排，左欄、題號、刪除鈕看不出差別。
- 第 2 節那五個檔裡，刪除鈕找不到 `ic:round-close` 和 `ic:round-delete`（實心）。

---

## 7. 名詞對照

| 這份文件的用詞 | 程式裡是什麼 | 意思 |
|---|---|---|
| 題卡 | 第 2 節那五個檔裡，每一題外面的那張 `Card` | 一題（或一句）一張的卡片。老師在這裡看內容、換順序、刪題 |
| 左欄 | 新做的 | 題卡最左邊那條直欄，放 ∧、把手、∨ |
| ∧、∨ | `ic:round-keyboard-arrow-up`／`-down` | 往上、往下移一題的按鈕 |
| 把手 | `ic:round-drag-indicator` | 六個小點的圖示，表示這張卡可以拖 |
| 題號 | 現在各檔寫法不同（第 4 節第 4 條） | Q1、Q2…，照卡片現在的位置編 |
| 動作鈕 | 標頭那一列右邊的 `IconButton`／`Button` | 剪刀、Edit、Preview、刪除這些 |
| 換序 | `moveItem()`（`steps/shared/reorder.js`） | 改題目的先後順序 |
