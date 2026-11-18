# Practice 列表的狀態分頁 ＋ Results 頁 — Engineer Handoff

老師看成績的一條路，兩頁一起改：

1. **Practice 列表**：篩選列最左邊多一組分頁 **All｜Unassigned｜In progress｜Ended**，把「到期了、該看成績」的練習集中起來；卡上每班寫結束日和交卷數；還沒有東西可看的 Result 停用。
2. **Results 頁**（按 Result 進去那頁）：整頁照 Students 頁的長相重排；沒交的人集中在每班最上面，旁邊就是 Send reminder；分數放進右欄最上面一張大卡；看得到學生交出去之前練的每一次；遲交寫出天數；星星拿掉。

**前端為主。** 後端要多給三樣資料（最後一節）。程式碼基準：`dahua-dash` `origin/develop` @ `36664ed4`（2026-11-17）。

---

## 名詞對照

| 這份文件的用詞 | 程式裡是什麼 | 意思 |
|---|---|---|
| 列表 | `/dashboard/practice`，`src/sections/practice/view/index.js` | Practice List 頁 |
| 分頁 | 新做的 | 列表篩選列最左邊的 All｜Unassigned｜In progress｜Ended |
| 班級指派 | 一個 class assignment（同一班指派兩次取最新） | 一個班的一次指派：有自己的到期日、Mandatory／Optional、交卷數 |
| 結束 | 班級指派的 due date ＜ 今天（學校時區） | 那一班過了到期日 |
| Results 頁 | `/dashboard/assignments/submissions`，`src/sections/assignments/view/history/index.js` | 老師看一份指派全班成果的頁 |
| 班級卡 | `src/utils/assignment/submission-roster.js` 的 `buildRoster` 一組 | Results 左欄一個班一張卡；同一班指派兩次出兩張 |
| 貼頂列 | 新做的，照 `src/sections/teacher/students/student-detail.js` 的 sticky top bar | 右欄最上面、捲動時貼著的那條：學生頭像、名字、班名 |
| 分數卡 | 新做的，取代 `score-override-control.js` 現在畫的那一塊 | 右欄內容最上面的大卡：分數、狀態 tag、Edit score、每次作答（Attempt、Submission） |
| 三階色 | `src/utils/score.js` 的 `scoreTier`（80／60） | 分數 80 以上綠、60–79 橘、60 以下紅 |
| V2 | `SCORING_ENGINE.DAHUA_V2`；`isV2Scored()` | 新版評分：0–100 分、一字一欄、聲調圖、沒有星星。中文練習現在交卷都是 V2 |
| 型別簡稱 | QA＝Open-ended Questions、Follow Pattern＝Sentence Building／Response、MC＝Vocabulary Quiz／Comprehension Quiz | 程式裡的名字 |

---

## 原型怎麼看

兩份檔，互相連得過去：列表按 Result 進 Results 頁，Results 頁按 Back 回到原來的分頁。假資料的「今天」是 2026-11-20。

| 要看什麼 | 網址 |
|---|---|
| 列表，All | [`practice-list.html`](practice-list.html) |
| 列表，Unassigned | [`practice-list.html?tab=unassigned`](practice-list.html?tab=unassigned) |
| 列表，In progress（全球暖化 7A 已結束、7B 還在跑） | [`practice-list.html?tab=progress`](practice-list.html?tab=progress) |
| 列表，Ended | [`practice-list.html?tab=ended`](practice-list.html?tab=ended) |
| 列表檢視 ＋ ⋯ 選單 | [`practice-list.html?tab=ended&view=list&menu=1`](practice-list.html?tab=ended&view=list&menu=1) |
| 很長的班名 | [`practice-list.html?tab=all&longcls=1`](practice-list.html?tab=all&longcls=1) |
| 列表沒有練習（看不到 Unassigned 分頁） | [`practice-list.html?empty=1`](practice-list.html?empty=1) |
| Results，Vocabulary Mirroring | [`results.html?type=vocab`](results.html?type=vocab) |
| Results，Content Mirroring | [`results.html?type=mirroring`](results.html?type=mirroring) |
| 交之前練過的學生 | [`results.html?type=vocab&stu=emma`](results.html?type=vocab&stu=emma) |
| 遲交的學生 | [`results.html?type=vocab&stu=liam`](results.html?type=vocab&stu=liam) |
| 答舊版、改過分的學生 | [`results.html?type=vocab&stu=olivia`](results.html?type=vocab&stu=olivia)、[`stu=ava`](results.html?type=vocab&stu=ava) |
| 選到沒交的學生 | [`results.html?type=vocab&unsub=1`](results.html?type=vocab&unsub=1) |
| Send reminder 確認框 | [`results.html?type=vocab&remind=1`](results.html?type=vocab&remind=1) |
| Edit score 對話框 | [`results.html?type=vocab&edit=1`](results.html?type=vocab&edit=1) |
| 其他型別 | `type=vocabquiz`、`quiz`、`scramble`、`building`、`response`、`openended` |

---

# 第一部分：Practice 列表

## 1 · 標題列與篩選列

```
Practice List                                   [+ New practice] [▦][☰]
┌──────────────────────────────────────────────────────────────────────┐
│ All 12 │ Unassigned 2 │ In progress 5 │ Ended 5 ┃ Type ▾ Assignment ▾ Class ▾      🔍 Search │
│ ════                                                                   │
```

- **現在**：標題底下一列三個下拉（`All practice types · 12`、`All assignment types`、`All classes`）＋ 搜尋 ＋ New Practice；沒有分頁。
- **改成**：
  1. **New practice** 搬到標題列右邊，在卡片／列表切換鈕旁邊。
  2. 白框裡第一列是篩選列：最左邊四個分頁，一條細直線，三個下拉，搜尋靠右。
  3. 分頁是底線式：沒選的灰字；選中的字 `#00A749`、底線 2px `#00CB61`。每個分頁名後面一顆數字：沒選的灰底灰字，選中的淡綠底（`rgba(0,203,97,.14)`）綠字。
  4. 三個下拉縮成短名稱 **Type／Assignment／Class**；「· 12」這種數字拿掉，數字只在分頁上。
  5. 下拉和搜尋四個分頁共用（在 Ended 選了 Class 7A，就是 Ended 裡的 7A）。
- **改哪裡**：`src/sections/practice/view/index.js`、`src/utils/practice-list-filters.js`。

## 2 · 四個分頁的規則

| 分頁 | 放哪些練習 | 排序 |
|---|---|---|
| All | 全部 | 建立時間新到舊（跟現在一樣） |
| Unassigned | 一個班都還沒指派 | 建立時間新到舊 |
| In progress | 還有至少一班**沒過**到期日，或有班沒設到期日 | 建立時間新到舊 |
| Ended | **每一班都過了**到期日 | 最近結束的在前：一個練習多班結束取最晚的那個日期；同一天再照建立時間 |

- 一個練習只會在 Unassigned、In progress、Ended 其中一個。所以三個數字加起來等於 All。
- 一個練習派給 7A、7B，7A 過期、7B 還沒：**只在 In progress**。卡上 7A 那行照樣寫結束和交卷數（下一節），老師在 In progress 就看得到、也能進 Result。
- 沒設到期日的班永遠不結束，所以有這種班的練習不會進 Ended。
- 「過了到期日」＝到期日 ＜ 今天，照學校時區算日界。
- **Unassigned 是 0 的時候，這個分頁不出現。** 老師正停在 Unassigned、把最後一個指派出去，畫面回到 All。
- 預設停在 All。
- **空狀態**：
  - Ended：*No ended assignments yet* ／ *A practice shows here once all of its classes pass their due date.*
  - In progress：*Nothing in progress* ／ *Assign a practice and it shows here until its due date passes.*
  - All：跟現在一樣。Unassigned 沒有空狀態（0 就不出現）。
- **卡住的**：Ended 卡上的交卷數要後端給（最後一節第 1 題）。分頁判斷只用到期日，現在就拿得到。

## 3 · 卡片上每班兩行

```
Assigned to 2 classes
[Class 8A] [Mandatory]
Ended Nov 10 · 12/12 submitted
[Grade 7 Mandarin Chinese Heritage Le…] [Mandatory]
Due Nov 25
```

- **現在**：每班一行：灰 chip 班名 ＋ Mandatory／Optional chip ＋ 右邊小字；過期寫紅字 `Overdue · Nov 18`；沒到期日空著。班名長就把整行擠爆。
- **改成**：
  1. 每班兩行。第一行：灰 chip 班名 ＋ Mandatory／Optional chip。第二行：狀態小字，靠左。
  2. 班名太長用 … 截斷，滑過（`title`）看全名。Mandatory／Optional 一定看得到。
  3. 第二行三種寫法：
     - 結束了：`Ended Nov 10 · 12/12 submitted`。交卷數全交是綠字，沒全交是深色。
     - 還在跑：`Due Nov 25`，七天內綠字（跟現在一樣）。
     - 沒到期日：`No due date`。
  4. 不再寫紅字 Overdue。
  5. 結束的班排在前面，其他照到期日。
  6. 班與班之間空 10px。
- **改哪裡**：`src/components/dahua/practice/` 底下卡片每班那列、`src/components/dahua/practice/practice-card-config.js`（`buildPracticeAssignmentMap` 多帶交卷數）。
- **卡住的**：交卷數（最後一節第 1 題）。拿不到之前先只寫 `Ended Nov 10`。

## 4 · Result 鈕停用

- **現在**：每張卡的 Result 都能按。沒指派過的按了跳 snackbar *No assignment found for this practice*；指派了沒人交的進去是空頁。
- **改成**：兩種情況 Result 停用（產品 disabled 的樣子），滑過寫原因：
  - 沒指派過：*Not assigned yet*
  - 指派了、每一班都 0 人交：*No submissions yet*
  - 卡片底下、列表檢視右邊、⋯ 選單裡的 Result 三處一起停用。
- **改哪裡**：卡片元件、`src/sections/practice/practice-table-row.js`。
- **卡住的**：「沒人交」要交卷數（最後一節第 1 題）。拿不到之前只判斷「沒指派過」。

## 5 · 列表檢視

- **現在**：看不到指派狀態；Result 藏在 ⋯ 選單裡叫 Student Submissions。
- **改成**：每列右邊多一欄，每班一行（班名、Mandatory／Optional、狀態，寫法同第 3 節，班名過長截斷）；再右邊一顆 Result 鈕（停用規則同第 4 節）。
- **改哪裡**：`src/sections/practice/practice-table-row.js`。

## 6 · 用字

| 位置 | 現在 | 改成 |
|---|---|---|
| ⋯ 選單 | Student Submissions | Result |
| ⋯ 選單 | Test Practice | Test |
| Results 頁標題 | Assignment Submission List | Result（網址要不要改見最後一節第 4 題） |

看成績的動作從分頁、卡片到頁面都叫 **Result**。⋯ 選單其他項目（Assign Practice、Share、Clone、Edit、Delete）不動。

## 7 · 按 Result、按 Back

- 按 Result 進 Results 頁，帶練習型別、名稱、班級；Results 頁的 Back 回到列表原來那個分頁和檢視（卡片／列表）。
- 從 Dashboard 進 Results 頁的，Back 回 Dashboard（跟現在一樣）。

---

# 第二部分：Results 頁

## 8 · 頁面骨架

```
┌ 側欄 ┬ 左欄 380px ───────────┬ 右欄 ─────────────────────────────────┐
│      │ ← Back                │ (AH) Ava Huang                    (L)   │ ← 貼頂列
│      │ [🎤] 全球暖化          │       Class 7A                          │
│      │      Vocabulary Mirr.  ├─────────────────────────────────────────┤
│      │ ───────────────────── │ ┌ SCORE ─────────────── ✎ Edit score ┐ │
│      │ ┌ Class 7A ────── ⌃ ┐ │ │ 85 /100  [Adjusted]                 │ │ ← 分數卡
│      │ │ Due Nov 20        │ │ └─────────────────────────────────────┘ │
│      │ │ ┌ NOT SUBMITTED (2)  [✉ Send reminder] ┐ │ Score breakdown …      │
│      │ │ │ [Mason Xu] [Noah Zhang]              │ │ Recordings …           │
│      │ │ └───────────────────────────────────────┘ │ Teacher comment …      │
│      │ │ SUBMITTED                                  │                        │
│      │ │ (AH) Ava Huang   85                        │                        │
│      │ │ (LW) Liam Wang   68  [Late 2d · ×80%]      │                        │
```

- **現在**：一張 Card 高 78vh，左 340px、右邊捲；Back、標題、chip 在 Card 外面；頂上三張合計卡。
- **改成**：
  1. 照 Students 頁（`src/sections/teacher/students/index.js`）：這條路由藏 dashboard 的 header，側欄照舊。
  2. 兩欄 grid：左 380px｜右其餘，高 100vh，兩欄各自捲。1100px 以下左欄 330px；900px 以下改上下疊、整頁一起捲。
  3. 左欄白底，右邊一條細線。右欄底色 `rgba(244,247,251,.85)`，內容區左右內距 30px、最寬 1000px，段與段之間 24px。
  4. **頂上三張合計卡（Submitted／Avg Score／Perfect）拿掉**，頁面上不放任何全班合計數字。
- **改哪裡**：`src/sections/assignments/view/history/index.js`、dashboard layout（藏 header 照 `/school/teacher-students` 的做法）。

## 9 · 左欄頭

- **現在**：Card 外面一行 Back ＋ h5 標題 ＋ chip。
- **改成**：左欄最上面：`← Back` 小連結 → 36px 型別 icon 方塊 ＋ 練習名（22/800）→ 底下一行灰字寫型別（例 *Vocabulary Mirroring*，13/600）。底下一條細線，再來是班級卡。
- **改哪裡**：`index.js`、`left-panel.js`。

## 10 · 班級卡

- **現在**：名單照班分組，組頭只有班名。
- **改成**：
  1. 每個班級指派一張淺灰卡（底 `#F4F6F9`、框 `#E6EBF1`、圓角 14px），卡與卡之間 12px。收起來也看得出一班一張。
  2. 卡頭：班名（18/800）＋ 下一行到期日（14/600 灰，例 *Due Nov 20*）＋ 右邊開合箭頭（沒有框）。**卡頭不放任何數字**（沒有 8/10 submitted、沒有平均分）。
  3. 點卡頭收起或展開這一班；收起時只剩卡頭。
  4. 對齊：卡內距 8px；班名、NOT SUBMITTED、SUBMITTED、學生頭像的左緣同一條線。
  5. 左欄捲軸位置一直留著（`scrollbar-gutter: stable`），展開、收起時卡片一樣寬。
- **改哪裡**：`left-panel.js`（`ClassGroup`）。

## 11 · 沒交的人 ＋ Send reminder

- **現在**：沒交的人混在名單裡，每列底下寫 Not submitted；Results 頁沒有 Send reminder。
- **改成**：
  1. 沒交的人**移出名單**，集中在班級卡最上面一個白框（框 `#e6ebf1`、圓角 12px）。跟 Dashboard 的 Not submitted 同一個樣子。
  2. 白框標題列：左邊灰色大寫 `NOT SUBMITTED (2)`，右邊綠色實心 **Send reminder**。底下一排名字 chip（白底灰框）。
  3. 按 Send reminder 跳確認框（Dashboard 的 `src/sections/teacher/shared/reminder-popup.js` 同一個）：標題 *Send reminder*，一行 *2 students in Class 7A who have not submitted*，底下列出會收到的名字，Cancel｜Send reminder。送出後 3 秒內同一班再按沒反應（跟 Dashboard 一樣）。
  4. 全班都交了，這個白框不出現。
- **改哪裡**：`left-panel.js`；寄信沿用 Dashboard 的 handleRemind。

## 12 · 交了的名單

- **現在**：名字一行、底下 Submitted 一行；右邊 primary 外框分數 chip ＋ Old version／逾期 chip。
- **改成**：
  1. 白框底下一個灰色大寫小標 `SUBMITTED`，再來一人一列。只列交了的人，照名字排。
  2. 一列：40px 漸層頭像 ＋ 縮寫（`utils/name.js` 的 `getAvatarColor`、`getInitials`）｜名字 14/700（太長 …）｜分數｜tag 欄。
  3. 分數：純數字 15/800，**靠左**對齊（85 和 100 的第一個數字在同一條線），顏色照三階色（第 16 節）。
  4. tag 欄固定寬 110px（1100px 以下 96px），沒 tag 就空著，分數才對得齊。只放兩種 tag：
     - 遲交：`Late 2d · ×80%`（第 15 節）
     - 交之前練過：灰色 `Attempt 1 · 72`（第 14 節）
  5. Old version、Adjusted 不放在列上，點進去在分數卡才看。
  6. 選中：1.5px 綠框 `#6ee7b7` ＋ 淡綠底 `#ecfdf5`。滑過：白底（在灰卡上）。點一列，右欄捲回頂。
- **改哪裡**：`left-panel.js`（`StudentRow`）。

## 13 · 右欄：貼頂列與分數卡

### 貼頂列

- 46px 頭像 ＋ 名字 19/800 ＋ 底下一行班名 13/600 灰；最右邊帳號頭像。
- 毛玻璃底 `rgba(244,247,251,.85)` ＋ blur，底下一條細線，貼在右欄頂上。
- 五種 panel 共用這一條（現在 sentence／Follow Pattern／QA 各自畫名字）。
- 選到沒交的學生：貼頂列照出，名字底下寫 *Not submitted*；底下只有空狀態 *This student has not submitted yet*。
- 沒選人：*Select a student to view results*；全班沒人交：*No submissions yet*。

### 分數卡

```
┌ SCORE ─────────────────────────────── ✎ Edit score ┐
│ 68 /100   [Late 2 days · ×80%]                      │
└──────────────────────────────────────────────────────┘
```

- **現在**：`score-override-control.js` 在每個 panel 裡畫名字、星星、百分比、Late／Adjusted chip、鉛筆鈕；Quiz／Scramble 另外一張分數環卡。
- **改成**：右欄內容最上面一張全寬白卡（圓角 14px）：
  1. 第一行：左邊灰色大寫 `SCORE`，右邊綠字 **Edit score**（只有能改分的型別有：Content／Vocabulary Mirroring、Open-ended、Sentence Building／Response）。
  2. 第二行：大分數 48/800（顏色照三階色）＋ `/100`，右邊狀態 tag：`Adjusted`（老師改過分）、`Late 2 days · ×80%`（遲交）、`v2 · Old version`（答的是舊版練習，跟現在的 `OldVersionChip` 同字）。
  3. **沒有星星**（第 17 節）。
  4. 交之前練過的學生，卡片底下多一排每次作答的按鈕（第 14 節）。
  5. Quiz／Scramble 的分數環拿掉，分數只在這張卡。
- **改哪裡**：`index.js`（`renderDetail` 外面包一層放貼頂列和分數卡）、五個 panel 拿掉自己的分數區、`score-override-control.js`。

### Edit score 對話框

- 標題 *Edit score*，一行 *The system gave Ava Huang 64/100. Your score replaces it on the list and for the student.*
- 標籤在上的輸入框（0–100）。
- 底下：改過分才有的 *Revert to system*（白框、琥珀字）靠左；*Cancel*（白框）、*Save*（綠色實心）靠右。
- 能改哪些型別、Revert 的規則、改分後不再乘遲交扣分：都跟現在一樣。

## 14 · 交出去之前練過的學生（Attempt 與 Submission）

一個學生一個指派，老師端只有**一筆 Submission**（學生按 Submit to Teacher 的那筆）。在那之前學生可以練好幾次（Practice Again），每一次叫 **Attempt**，沒有交給老師。

- **現在**：`index.js` 的 `buildHistoryByUser` 只留 `isSubmitted` 的那筆；沒交的作答全部過濾掉，老師看不到學生交出去之前練了幾次、分數怎麼變。
- **改成**：
  1. **名單**：分數是 Submission 的分數；學生交之前練過的，tag 欄多一個灰 tag `Attempt 1 · 72`（最後一次 Attempt 的編號和分數）。只寫數字，不寫差幾分。
  2. **分數卡**：底下一條細線，一排按鈕，**每次作答一顆，直接排出來**（不收在下拉裡），照時間排，Submission 在最後：
     ```
     [Attempt 1  Nov 12  72]  [Submission  Nov 15  92]
     ```
     每顆寫 Attempt 幾或 Submission、日期、那次的分數（三階色）。正在看的那顆綠框淡綠底。按鈕多了自動換行。
  3. 點 Attempt：
     - 大分數換成那次的分數，tag 換成灰色 `Attempt`。
     - 底下一行 *Practice attempt on Nov 12, not submitted. The submission (92) is the score on the list.*
     - **不能 Edit score**（按鈕不出現）。老師只能改 Submission 的分數、只能對 Submission 寫評語。
     - 底下 Score breakdown、每句卡換成那一次的內容；沒有 Teacher comment。
  4. 名單上的分數、成績報表都算 Submission。
  5. 換一個學生，回到看 Submission。
- **改哪裡**：`index.js`（`buildHistoryByUser` 除了 Submission，也留同一學生沒交的作答、照時間排）、`left-panel.js`、分數卡。
- **卡住的**：沒交的作答後端有沒有留分數、能不能跟 Submission 一起拿回來（最後一節第 2 題）。

## 15 · 遲交寫出幾天

- **現在**：`src/components/late-credit-chip/late-credit-chip.js` 只寫 `Late · ×80%`。
- **改成**：
  - 分數卡：`Late 2 days · ×80%`（1 天寫 `1 day`）。
  - 名單 tag 欄太窄，寫短版 `Late 2d · ×80%`，滑過（`title`）看全句。名單 tag 欄不加寬，加寬會把學生名字擠成 `Emma C…`。
  - 拿不到天數時退回現在的 `Late · ×80%`。
- **改哪裡**：`late-credit-chip.js`（多一個天數參數、一個短版）。
- **卡住的**：天數要後端給（最後一節第 3 題）。

## 16 · 分數的顏色（三階色）

| 分數 | 顏色 |
|---|---|
| 80 以上（含 80） | 綠 `#047857` |
| 60–79 | 橘 `#d97706` |
| 60 以下 | 紅 `#e11d48` |

- 門檻用現成的 `src/utils/score.js` `scoreTier`；色號用 `src/sections/teacher/shared/practice-detail-popup.js` 的 `SCORE_TIER_COLORS`（建議搬到 `utils/score.js` 共用）。
- 看最後的分數：改過分看改過的，扣過遲交看扣完的。名單列和分數卡是同一個值、同一個顏色。
- 用在：名單列分數、分數卡大分數、每次作答按鈕上的分數、每句卡和每題的分數（第 17 節）。
- 沒交的沒有分數，不上色。
- 列表卡上的交卷數不是分數，不套這條（全交才綠）。

## 17 · 星星全部拿掉

- **現在**：V1 打的分在分數卡、每句卡、重錄清單、Sentence Building／Response 每題、Open-ended 每輪對話顯示 0–5 星（`Rating`，只在非 V2 時出現）。中文練習現在交卷都是 V2，所以新交的本來就沒有星星；**只剩改版前交的舊紀錄**會出現。
- **改成**：
  - 分數卡：拿掉，只留 `85 /100`。
  - 每句卡、重錄清單、每題、每輪對話：換成分數 `80/100`（星數 × 20），顏色照三階色。
- **改哪裡**：`score-override-control.js`、`sentence-card-shell.js`、`retake-history-list.js`、`panels/follow-pattern-panel.js`、`panels/qa-panel.js`。

## 18 · 右欄各段

每一段：段頭（30px icon 方塊 ＋ 標題 13/800 ＋ 灰色計數 pill ＋ 右邊 32px 開合鈕，照 Students 頁 `student-detail.js` 的 SectionHeader）＋ 一張白卡（圓角 14px）。卡裡的內嵌區（圖表盒、字詞回饋、Student answer）淺灰底 `#f8fafc`、不再疊框。

| 型別 | 段落，由上到下 |
|---|---|
| Content Mirroring | Score breakdown → **Sentences**（計數 = 句數）→ Teacher comment |
| Vocabulary Mirroring | Score breakdown → **Recordings**（計數 = 卡數）→ Teacher comment |
| Vocabulary Quiz、Comprehension Quiz | **Questions**（右邊 `All · 8｜Wrong · 3` 切換）。沒有改分、沒有評語（跟現在一樣） |
| Sentence Scramble、Sentence Cloze | **Sentences**（同上的 All／Wrong）。沒有改分、沒有評語 |
| Sentence Building、Sentence Response | **Questions**（計數 `2 passed`）→ Teacher comment |
| Open-ended Questions | **Conversation**（卡裡 Conversation｜AI Feedback 兩個切換）→ Teacher comment |

### Score breakdown

- **現在**：三列「標籤｜6px 長條｜%」。
- **改成**：**不用長條**。Fluency／Accuracy／Pronunciation 三格並排，每格：灰色大寫小標 ＋ 大數字 26/800 `85%`，格與格之間一條細直線。
- 顏色門檻照現在 `sentence-panel.js`（85 以上綠、70 以上橘、其他紅），字用深一階：`#047857`／`#B45309`／`#B91C1C`。

### Content Mirroring 的每句卡（V2）

中文現在交卷都是 V2，每句卡照 Vocabulary Mirroring 的 V2 卡畫：

- 卡頭：灰膠囊 `#1`；Auto Pass 的句子加琥珀 tag `Auto Pass · 5 tries`；右邊分數 `90/100` ＋ 播放鈕。
- 一字一欄（拼音／字／狀態圖示：綠勾、黃驚嘆號、紅叉、灰麥克風）＋ 句子英文。
- 結果一行：*Perfect!／Good job!／Try again!* ＋ 幾個字要改、幾個字要複習、幾個字沒唸到。
- 聲調圖：學生實線、範例虛線；第一個有問題的字框起來。
- 圖底下那個字的回饋：聲調卡（學生唸的聲調 → 應該的聲調）或 *Word not detected*。
- 有重錄的句子，底下照現在的重錄清單。
- V1 的畫法（逐詞三色、星星、AI Feedback、Pinyin on／Translation on 小標籤）只剩改版前的舊紀錄，照現在的元件、星星照第 17 節換成分數。

### Teacher comment

綠色 icon 方塊 ＋ 一張卡：textarea（圓角 11px，focus 綠框 ＋ 光暈）；左下字數 `0 / 2000 characters`，右下綠框小鈕 **Send comment**（已送過寫 **Update comment**；沒字時停用）。寄送規則不動。

---

## 不用改的

- **列表**：卡片配色、Assign Now、分頁（頁碼）、三個下拉的選項、Share／Clone／Edit／Delete。
- **Results**：哪些型別能改分、Revert to system、遲交扣分怎麼算、評語怎麼寄、Not in class／Left class 的判斷、各型別卡裡的資料（逐詞顏色、V2 欄色、criteria、AI Feedback 文字、重錄清單）。

---

## 驗收

| # | 老師做什麼 | 畫面應該怎樣 |
|---|---|---|
| 1 | 開 Practice 列表 | 標題列右邊有 New practice；篩選列最左邊 All｜Unassigned｜In progress｜Ended 帶數字，預設 All；三個下拉寫 Type／Assignment／Class |
| 2 | 數一數 | Unassigned＋In progress＋Ended 的數字加起來等於 All |
| 3 | 把最後一個沒指派的練習指派出去 | Unassigned 分頁消失；剛才停在 Unassigned 的話回到 All |
| 4 | 切到 Ended | 只剩每一班都過期的練習，最近結束的在前；每班第二行 `Ended Nov 10 · 12/12 submitted` |
| 5 | 找一個 7A 過期、7B 沒過期的練習 | 只在 In progress；7A 寫 `Ended Nov 18 · 8/10 submitted` 排前面，7B 寫 `Due Nov 25` |
| 6 | 看一張班名很長的卡 | 班名 … 截斷、滑過看全名；Mandatory 還在同一行 |
| 7 | 看沒指派過、和指派了沒人交的卡 | Result 灰掉，滑過 *Not assigned yet*／*No submissions yet*；列表檢視和 ⋯ 選單一樣 |
| 8 | 切列表檢視、打開 ⋯ | 每列右邊每班一行 ＋ Result 鈕；選單寫 Result、Test |
| 9 | 按一張 Vocabulary Mirroring 的 Result | 沒有 dashboard header；左欄白、右欄灰各自捲；頂上沒有合計卡 |
| 10 | 看 Class 7A 那張灰卡 | 卡頭只有 Class 7A／Due Nov 20；先是 NOT SUBMITTED 白框（名字 ＋ Send reminder），再來 SUBMITTED 名單 |
| 11 | 按 Send reminder | 確認框列出沒交的名字；送出後 3 秒內再按沒反應 |
| 12 | 看名單 | 一列：頭像、名字、分數、tag；分數靠左對齊；80 綠、70 橘、50 紅 |
| 13 | 點遲交的 Liam | 名單 `Late 2d · ×80%`；分數卡 `68 /100` ＋ `Late 2 days · ×80%` |
| 14 | 點 Emma（交之前練過一次） | 名單 `Attempt 1 · 72`；分數卡 92 底下兩顆按鈕 `Attempt 1`、`Submission`，Submission 綠框 |
| 15 | 按 Attempt 1 | 大分數 72、`Attempt`、一行說明；沒有 Edit score、沒有評語；底下換成那次的內容 |
| 16 | 換一個學生再回 Emma | 回到看 Submission |
| 17 | 看 Content Mirroring 的一份 | Score breakdown 三格數字、沒有長條；每句一字一欄 ＋ 聲調圖 ＋ `90/100`；整頁沒有星星 |
| 18 | 切到 Comprehension Quiz | 同一條貼頂列和分數卡；沒有 Edit score；Questions ＋ All／Wrong；沒有分數環 |
| 19 | 點一個沒交的學生 | 貼頂列寫 Not submitted；底下 *This student has not submitted yet* |
| 20 | 按 Back | 回列表剛才那個分頁和檢視 |
| 21 | 視窗縮到 900px 以下 | Results 左右改上下疊、整頁一起捲 |

---

## 要問後端

| # | 問題 | 影響哪裡 |
|---|---|---|
| 1 | 列表要每個班級指派的**交卷數**（submitted／total）。現在 Results 頁是一個指派打一次 `getAssignmentHistories`，列表 12 張卡 × 每張幾班這樣抓太重。能不能 `getAssignments` 一次帶回，或加一個 summary 欄位？ | 列表第 3 節的 `8/10 submitted`、第 4 節的「沒人交」停用 |
| 2 | 學生交出去之前的作答（`isSubmitted` 為 false 的 history）後端有沒有留著分數與每句結果？`getAssignmentHistories` 現在會回這些嗎（前端 `buildHistoryByUser` 把它們濾掉）？要能跟 Submission 一起拿回 | Results 第 14 節（Attempt） |
| 3 | 遲交幾天用哪個時間算？history 只有 `creationTime`／`lastModified`（老師改分也可能動到）和指派的 `expiredDate`。能不能一起回 `submittedDate`，或直接回 `daysLate`（照學校時區算日界）？ | Results 第 15 節 |

## 前端自己決定

| # | 問題 | 影響哪裡 |
|---|---|---|
| 4 | Results 頁網址 `/dashboard/assignments/submissions` 要不要跟著標題改成 result？改網址會讓已經分享出去的連結失效 | 第 6 節 |

---

## 不在這一包裡的

- Teacher Dashboard（Active Assignments、Submissions 兩欄）另一包。
- 學生端看自己成績的頁面不動。
