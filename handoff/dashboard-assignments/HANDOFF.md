# Teacher Dashboard：一次 Skip 多筆、長清單收合、看成績的入口 — Engineer Handoff

老師登入後的首頁 Teacher Dashboard，左右兩欄一起改：

1. **左欄 Active Assignments**：練習名可以直接點進成績頁；一段超過 6 列先收起來；一次可以 Skip 好幾筆過期的指派（按任一列的 Skip 就進勾選模式）；欄位對齊。
2. **右欄**：標題從 To Review 改成 **Submissions**；Skip review 不再開側邊抽屜，改成清單上直接勾。
3. **批改抽屜**：View practice detail 搬到最上面；底下兩顆鈕改叫 Previous submission｜Next submission。

**只改前端。** 多筆 Skip 用現有的 mutation 一筆一筆送（最後一節有一題要問後端）。程式碼基準：`dahua-dash` `origin/develop` @ `696f4a42`（2026-11-13）。

---

## 名詞對照

| 這份文件的用詞 | 程式裡是什麼 | 意思 |
|---|---|---|
| Dashboard | `/school/teacher-dashboard`，`src/sections/teacher/dashboard/index.js` | 老師首頁，左右兩欄 |
| 左欄 | `active-assignments-panel.js` | Active Assignments：還在跑的指派，一列＝一個練習 × 一個班 |
| 段 | `getDateSection`（`src/sections/teacher/shared/date-utils.js`） | 左欄照到期日分的四段：Overdue、Today、Tomorrow、Later |
| 段頭 | 每段最上面那條 | 段名 ＋ 數量 ＋ 欄名 PRACTICE｜CLASS｜DUE｜SUBMITTED ＋ 收合鈕 |
| 右欄 | `review-panel.js` | 交卷收件匣，兩個分頁 To Review｜Reviewed |
| 批改抽屜 | `review-drawer.js` | 點右欄一筆交卷，從右邊滑出來批改的那個 |
| Skip（指派） | `skip-popup.js`；`upsertAssignment`（`skipped: true`） | 把一筆過期指派從 Active Assignments 拿掉、不再追 |
| Skip review（交卷） | `skip-review-drawer.js` | 老師決定不批某筆交卷，它移到 Reviewed、標 Skipped |
| 勾選模式 | 新做的 | 清單每列前面出現勾選框、可以一次選好幾筆的狀態 |
| 操作列 | 新做的 | 勾選模式時出現在清單上方的一條：Cancel ＋ 紅色的 Skip 鈕 |
| Results 頁 | `/dashboard/assignments/submissions?sk=&name=&type=` | 一份指派全班成績的頁（另一包 `handoff/practice-results`） |
| Word Game 列 | `word-game-rows.js` | 左欄裡 Word Game 每週目標那種列；沒有 Results 頁、不能 Skip |

---

## 原型怎麼看

[`dashboard.html`](dashboard.html) 一份檔，假資料都在檔案裡。假資料的「今天」是 2026-11-20。側欄 Practice List、每列的練習名和 View results 會連去同層 `../practice-results/` 那包。

| 要看什麼 | 網址 |
|---|---|
| 預設 | [`dashboard.html`](dashboard.html) |
| Overdue 很多筆（看收合） | [`dashboard.html?many=1`](dashboard.html?many=1) |
| 左欄勾選模式 | [`dashboard.html?skipmany=1`](dashboard.html?skipmany=1) |
| 左欄勾選模式、很多筆 | [`dashboard.html?many=1&skipmany=1`](dashboard.html?many=1&skipmany=1) |
| 展開第一列（沒交的人 ＋ Send reminder） | [`dashboard.html?open=1`](dashboard.html?open=1) |
| Send reminder 確認框 | [`dashboard.html?remind=1`](dashboard.html?remind=1) |
| 批改抽屜 | [`dashboard.html?drawer=1`](dashboard.html?drawer=1) |
| 右欄 Reviewed 分頁 | [`dashboard.html?tab=reviewed`](dashboard.html?tab=reviewed) |
| 右欄勾選模式（Skip review） | [`dashboard.html?skip=1`](dashboard.html?skip=1) |
| 兩欄都空 | [`dashboard.html?empty=1`](dashboard.html?empty=1) |

---

# 左欄 Active Assignments

## 1 · 練習名可以點

- **現在**：練習名是純文字；要看成績得按 SUBMITTED 數字旁邊的小圖示（`open_in_new`，tooltip View results）。
- **改成**：練習名本身也是連結，連去**同一條網址**（Results 頁，`?sk=&name=&type=`）。滑過變主色 ＋ 底線。點名字不會順便展開那一列。
- **不變**：`open_in_new` 小圖示照留。Word Game 列沒有 Results 頁，名字維持純文字。
- **改哪個檔**：`active-assignments-panel.js`

## 2 · 一段超過 6 列先收起來

- **現在**：一段有幾列就全部列出來；過期很多的老師（實際看過 Overdue 71 筆）要捲很久才看得到 Today。
- **改成**：一段**超過 6 列**才收：只露前 6 列（排序照舊：沒交的人數多的在前），底下一條全寬的 `Show N more ∨`，點了全部展開、變 `Show less ∧`。剛好 6 列不收。
- **不記住**：重新整理後回到收起來的樣子。
- **跟段頭收合的關係**：段頭右邊的收合鈕照舊（整段收起來）；Show more 只管段內露幾列。
- **改哪個檔**：`active-assignments-panel.js`

## 3 · 欄位對齊

- **現在**：每一列是自己的 grid，欄寬用 `fr`，很長的練習名會把那一列的欄撐寬，PRACTICE／CLASS／DUE／SUBMITTED 每列起點差 2–17px，也跟段頭的欄名對不齊。
- **改成**：段頭和每一列用**同一組欄寬**，欄寬寫 `minmax(0, …fr)`，長練習名在自己那一欄裡換行，不推別欄。
- **改哪個檔**：`active-assignments-panel.js`

## 4 · 一次 Skip 好幾筆

- **現在**：Overdue 每列一顆 Skip，按了跳確認框，一次只能 Skip 一筆。
- **改成**：按**任一列的 Skip** 不直接跳確認框，而是讓 Overdue 進**勾選模式**，按的那一列先勾好。

**勾選模式的樣子**

| 地方 | 規則 |
|---|---|
| 段頭 | Overdue 段頭最前面多一個全選框，三種狀態：全選、部分選（橫線）、沒選 |
| 操作列 | 段頭底下、第一列上面出現一條淡紅底的列：右邊 `Cancel` ＋ 紅色 `Skip N assignment(s)`（N＝勾了幾筆，1 筆用單數；0 筆時寫 `Skip assignments` 並停用）。**不寫已選幾筆／共幾筆**，筆數只在紅鈕上 |
| 操作列的位置 | 貼在頁首底下（sticky），捲到哪都看得到。平常這條不存在，進勾選模式才出現 |
| 每一列 | 最前面一個勾選框；**點整列＝勾／取消**；勾了的列淡紅底。練習名暫時不當連結；Skip 鈕、展開箭頭、View results 小圖示先藏起來 |
| Overdue 段 | 進勾選模式時**自動全部展開**：Show more 先藏、所有過期列都列出來；段頭點了不收合 |
| Word Game 列 | 沒有勾選框、變淡、點不動（不能 Skip） |
| 其他段 | Today／Tomorrow／Later 不受影響 |
| 離開 | 按 `Cancel` 或 Esc |

**按紅鈕之後**

跳確認框（沿用現在單筆 Skip 那個 `skip-popup.js`，字改成可以是複數）：

| | 1 筆 | 多筆 |
|---|---|---|
| 標題 | `Skip assignment` | `Skip 3 assignments` |
| 副標 | `我的学校 - Class 8A` | `我的学校 - Class 8A and 2 more` |
| 說明 | `This overdue assignment will be removed from Active Assignments — students won't be chased for it anymore. You can still see it in the class history.` | `These 3 overdue assignments will be removed from Active Assignments — students won't be chased for them anymore. You can still see them in the class history.` |
| 紅鈕 | `Skip assignment` | `Skip 3 assignments` |
| 成功後 snackbar | `Skipped "我的学校" for Class 8A`（現在的句子） | `Skipped 3 assignments` |

確認後：勾的那些列從清單消失、離開勾選模式。確認框開著時按 Esc 先關確認框。勾選框可以用鍵盤 Enter／空白鍵切換。

- **怎麼送**：一筆一筆呼叫現有的 `upsertAssignment`（`skipped: true`），跟現在右欄 Skip review 抽屜的做法一樣。部分失敗：成功的消失、失敗的留著並維持勾選，snackbar 寫 `Skipped a, failed b`。
- **改哪個檔**：`active-assignments-panel.js`、`src/sections/teacher/shared/skip-popup.js`

---

# 右欄

## 5 · 標題改叫 Submissions

- **現在**：右欄標題 `To Review`，跟底下第一顆分頁同名。
- **改成**：`Submissions`（跟左欄 Active Assignments 成對：指派 ↔ 交卷）。
- **不變**：分頁 `To Review N`｜`Reviewed N`、型別下拉。
- **改哪個檔**：`review-panel.js`

## 6 · Skip review 改成清單上直接勾

- **現在**：標題右邊一顆 `Skip review`，按了從右邊滑出 Skip review 抽屜（`skip-review-drawer.js`），在抽屜裡勾。
- **改成**：**拿掉抽屜**。`Skip review` 鈕搬到型別下拉底下、清單上方的一條細列（靠右，白底紅框紅字），只在 To Review 分頁出現。按了，To Review 清單進勾選模式：

| 地方 | 規則 |
|---|---|
| 細列 | 變成操作列（淡灰底）：左邊全選框 ＋ `Select all`；右邊一顆圖示鈕 `history`（滑過出 `Older than 30 days`，按了只勾 30 天以上的、不篩掉別的）· `Cancel` · 紅色 `Skip review (N)`（0 筆時寫 `Skip review` 並停用）。不寫已選筆數 |
| 細列的位置 | 貼在頁首底下（sticky）；進出勾選模式時細列高度不變，清單不跳 |
| 每一列 | 前面一個勾選框，右邊的 `>` 箭頭拿掉；點整列＝勾 |
| 候選 | 照上面型別下拉篩過的那些 |
| 離開 | `Cancel`、Esc，或切到 Reviewed 分頁 |

右欄 400px 寬，四樣東西放不下，所以 30 天快選縮成只有圖示（抽屜裡本來有這個快選，照留）。

**按紅鈕之後**：確認框（同第 4 節那個）——標題 `Skip review for 3 submissions`（1 筆用單數）、副標 `Emma Chen · 全球暖化 and 2 more`、說明 `Skipped submissions move to the Reviewed tab, marked Skipped. Students keep their score — they just will not get a teacher comment for this one.`、紅鈕 `Skip review`。確認後那些交卷移到 Reviewed、標 Skipped，snackbar `Skipped 3 submissions — moved to Reviewed.`。送法照抽屜現在的寫法（一筆一筆）。

- **改哪個檔**：`review-panel.js`；`skip-review-drawer.js` 不再用到

---

# 批改抽屜

## 7 · View practice detail 搬到最上面

- **現在**：`View practice detail` 在題目卡底下。
- **改成**：搬到抽屜標頭（學生名、班 · 多久前）底下、題目卡上面，一整條寬。樣式不變。
- **改哪個檔**：`review-drawer.js`

## 8 · 底下兩顆鈕改名

- **現在**：`Previous`｜`Next student`。
- **改成**：`Previous submission`｜`Next submission`。這兩顆走的是交卷清單（同一個學生可能有好幾筆），不是學生名單。
- **不變**：走的順序照現在（整份清單、只吃型別篩選、不吃分頁）。
- **改哪個檔**：`review-drawer.js`

---

## 不用改的

- 左欄的段、顏色、排序、展開後的 NOT SUBMITTED 名單、Send reminder 確認框與 3 秒 cooldown。
- 單筆 Skip 的確認框內容（只是現在從勾選模式進去）。
- 右欄的分頁、型別下拉、每一筆的樣子、Reviewed／Skipped 標、狀態規則（`reviewed` 蓋過 `reviewSkipped`）。
- 批改抽屜裡的題目卡、AI Score｜Teacher Score、Quick review、Send review。
- 空狀態的字。
- Word Game 列的一切。

## 驗收

照下面走一次，畫面都對就算過。

| # | 老師做什麼 | 畫面應該怎樣 |
|---|---|---|
| 1 | 打開 Dashboard | 右欄標題是 `Submissions`；左欄每段的 PRACTICE／CLASS／DUE／SUBMITTED 跟段頭欄名上下對齊，長練習名換行 |
| 2 | 點左欄任一列的練習名 | 進那份指派的 Results 頁（跟按旁邊小圖示同一頁）；那一列沒有被展開 |
| 3 | 點 Word Game 列的名字 | 沒反應（純文字） |
| 4 | 有一段超過 6 列 | 只露 6 列，底下 `Show N more`；按了全開、變 `Show less`；剛好 6 列的段沒有這條 |
| 5 | 按 Overdue 某一列的 Skip | 沒跳確認框；Overdue 全展開、每列前面出現勾選框、剛按的那列已經勾好；段頭底下出現 `Cancel`｜`Skip 1 assignment` |
| 6 | 再勾兩列、捲到底 | 操作列一直貼在頁首底下；紅鈕變 `Skip 3 assignments`；Word Game 列沒有框、點不動 |
| 7 | 按段頭的全選框 | 全部勾；再按全部取消，紅鈕停用並寫 `Skip assignments` |
| 8 | 勾三列按紅鈕 → 確認 | 確認框標題 `Skip 3 assignments`、副標「第一筆 - 班 and 2 more」；確認後三列消失、snackbar `Skipped 3 assignments`、離開勾選模式 |
| 9 | 只勾一列按紅鈕 → 確認 | 確認框跟現在單筆 Skip 一樣；snackbar `Skipped "練習" for 班` |
| 10 | 勾選模式按 Esc | 離開勾選模式，列回原樣（Skip 鈕、箭頭、小圖示回來） |
| 11 | 右欄按 `Skip review` | 沒有抽屜；清單上方細列變 `Select all`、時鐘圖示、`Cancel`、`Skip review`；每列前面有框、箭頭不見 |
| 12 | 按時鐘圖示 | 只勾 30 天以上的；滑過看得到 `Older than 30 days` |
| 13 | 勾兩筆按 `Skip review (2)` → 確認 | 兩筆移到 Reviewed、標 Skipped；snackbar `Skipped 2 submissions — moved to Reviewed.` |
| 14 | 勾選模式時切到 Reviewed 分頁 | 離開勾選模式；Reviewed 分頁沒有 `Skip review` 細列 |
| 15 | 點右欄一筆交卷開抽屜 | `View practice detail` 在標頭底下、題目卡上面；底下是 `Previous submission`｜`Next submission` |

## 要問後端

| # | 問題 | 影響 |
|---|---|---|
| 1 | 多筆 Skip 一筆一筆呼叫 `upsertAssignment` 就好，還是要做一個一次收多筆的 mutation？過期很多的老師可能一次勾 30 幾筆 | 第 4 節。先照一筆一筆做，部分失敗的寫法見第 4 節 |

## 前端自己決定

- 一筆一筆送時，要不要並行、並行幾個。
- 勾選模式時 Show more 收合狀態要不要記住（原型是離開勾選模式就回到收起來）。

## 不在這一包裡的

- Results 頁、Practice 列表：另一包 `handoff/practice-results`。
- Send reminder 的寄信設定：`handoff/teacher-notifications`。
- 舊的 `handoff/teacher-dashboard`（2026-08 的 Redesign v8，含 Students 頁）是更早的版本，這一包不沿用它。
