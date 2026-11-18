# v25 — Teacher Dashboard（Active Assignments ＋ To Review）

- **功能名稱**：老師登入後的首頁 Teacher Dashboard——左欄 Active Assignments（照到期日分 Overdue／Today／Tomorrow／Later，每列一個練習 × 一個班，看交卷數、寄提醒、Skip），右欄 To Review 收件匣（批改抽屜、Skip review）。2026-11-13 使用者「把 v23 v24 的 demo 也連接到 dashboard，依照現行的 dashboard，然後接下來要優化 dashboard」
- **網址**：https://dahua-dash-dev.web.app/school/teacher-dashboard/
- **截圖**：無（照程式碼複刻）
- **日期**：2026-11-13（開版：基準 ＋ 提案第零輪，三頁接起來）
- **分岔自**：`v10-teacher-email-settings/teacher-dashboard.html`（@ 96d64382，9/30）。v10 那份只顧 Send reminder，右欄還停在 v2（@ 1cca25a6）的樣子；這一版整頁對到 696f4a42
- **跟 v23／v24 的關係**：Dashboard 是 demo 的起點——側欄 Practice List → [[v24]] 列表；每列 Submitted 旁的 open_in_new（產品的 View results）→ [[v23]] Results 頁，v23 的 Back 回 Dashboard。基準連基準、提案連提案
- **設計檔**：
  - `mock.js` 共用假資料。**吃 v24 的 mock**（`../v24-practice-list-ended/mock.js` 要先載）：Active Assignments 的每一列 ＝ v24 的一個練習 × 一個班（名稱、型別、班名、到期、交卷數都從那邊來），再加一列 Word Game 目標；To Review 的交卷從同一批練習生出來；名單 7A／7B 照 v23 mock、8A／8B 這裡捏。今天 ＝ 2026-11-20（跟 v24 同一天）
  - `teacher-dashboard-baseline.html`（**基準**，現行頁逐項照 sx 複刻）
  - `proposal.html`（**提案**，第零輪：跟基準長一樣，只有連去的地方換成 v23／v24 的提案）
  - 兩份網址參數一樣：`?open=1` 展開第一列 · `?remind=1` 展開並打開 Send reminder 確認框 · `?drawer=1` 打開批改抽屜 · `?tab=reviewed` 右欄 Reviewed 分頁 · `?skip=1` 打開 Skip review 抽屜 · `?empty=1` 兩欄都空
- **程式碼基準**：dahua-dash `origin/develop` @ `696f4a42`（2026-11-13 fetch）
- **狀態**：**2026-11-13 第一輪畫完**（四條一題一題定：多筆 Skip 抽屜、超過 6 列收合、抽屜詳情鈕上移、Next submission）。未 commit、未部署
  - 提案多兩個參數：`?skipmany=1` 打開多筆 Skip 抽屜 · `?many=1` Overdue 灌到 36 筆（鷹架，照使用者截圖那種 71 筆全 `0 / 1` 的樣子）

## 現行頁面長什麼樣（程式碼讀出來的）

出處 `src/sections/teacher/dashboard/{index,active-assignments-panel,review-panel,review-drawer,skip-review-drawer,word-game-rows}.js`、`src/sections/teacher/shared/{practice-type-config,date-utils,review-model,reminder-popup,skip-popup}.js`。

**頁面殼**（`index.js`）
- 沒有頁面標題（註解寫 title is in the sidebar）。背景 `#f4f7fb` 撐滿；兩欄 `1fr 400px`、gap 18；1160 以下疊成一欄。
- 資料一次拿（`getTeacherAssignmentOverview`）：assignments、submissions、學校時區；Word Game 的列另外每班各讀一次（`useWordGameRows`）再併進左欄。

**左欄 Active Assignments**（`active-assignments-panel.js`）
- 標頭 `Active Assignments` ＋ info 圖示（tooltip：Only assignments from the last 6 months are shown.）。
- 照到期日分四段 **Overdue／Today／Tomorrow／Later**（`getDateSection`，學校時區；沒到期日歸 Later）。段頭：左邊段名 ＋ 數量膠囊，接著欄名 PRACTICE｜CLASS｜DUE｜**SUBMITTED**，右邊收合鈕。Overdue／Today 紅、Tomorrow 橘、Later 灰（底色 ＋ 左邊 4px 色條）。段跟段之間 7px 的頁面底色隔開。
- 每列 ＝ 一個練習 × 一個班：練習名｜型別 chip（**PRACTICE_TYPE_COLUMNS 那一欄的 wash／label**，字是全名 Content Mirroring、Vocabulary Mirroring…；Word Game 自己一組 teal）｜班名灰 chip｜到期 `Nov 18`（段的顏色；Word Game 週目標底下多一行 THIS WEEK）｜**`8 / 10`**（交了的綠、0 灰）＋ 右邊 open_in_new（tooltip View results → `/dashboard/assignments/submissions?sk=&name=&type=`；Word Game 沒有）｜Skip 鈕（只有 Overdue、Word Game 沒有）＋ 展開箭頭（交齊的列沒有箭頭、不能展開）。
- 段內排序：沒交的人數多的在前。
- 展開：白框 `NOT SUBMITTED (N)` ＋ 一人一顆名字 chip（連去 Students 頁）＋ 右邊綠色 **Send reminder**。確認框（`reminder-popup.js`，440 寬）：`N students in Class who have not submitted`，Cancel｜Send reminder；送出後同一列 3 秒 cooldown，snackbar `Reminder sent to N students in Class`。Word Game 的字是 `who have not met this goal`。
- Skip：確認框（`skip-popup.js`）`Skip assignment` ＋ 練習名 - 班名，紅鈕；確認後那列從清單消失、snackbar `Skipped "練習" for Class`。
- 空狀態：綠色 check_box 圖示 ＋ `All caught up!`／`No active assignments right now.`（要等 Word Game 也讀完才顯示）。

**右欄 To Review**（`review-panel.js`、`review-model.js`）
- 標頭 `To Review`；To Review 分頁時右邊多一顆 **Skip review**（block 圖示，白框灰字、hover 紅）。
- 兩顆分頁鈕 `To Review N`｜`Reviewed N`（選中綠漸層）；底下型別下拉（MUI Select，選項帶 icon 方塊）：All practice types ＋ **收件匣會收的五種**（Content Mirroring、Vocabulary Mirroring、Sentence Building、Sentence Response、Open-ended Questions）。
- **不進收件匣的**：Comprehension Quiz、Sentence Scramble、Sentence Cloze、Word Game（`NO_REVIEW_TYPES`）＋ Vocabulary Quiz（`NO_REVIEW_IDS`）——自動改的不用老師批。
- 一列一次交卷：學生名 ＋ 班名 chip ＋ 型別 chip ＋（Reviewed 分頁）**Reviewed** 綠標或 **Skipped** 灰標；第二行 練習名 · 多久前。最新在前（Reviewed 分頁照批改時間）。
- 狀態規則：`reviewed` 蓋過 `reviewSkipped`（後端不清 skipped 旗標，老師回頭寫了評語就算 reviewed）；兩種都離開 To Review 進 Reviewed。
- 空狀態：`All caught up!`／`No submissions to review.`；Reviewed 分頁 `Nothing reviewed yet`／`Reviewed submissions show here.`。

**批改抽屜**（`review-drawer.js`，440 寬）：學生名 ＋ 班 · 多久前；一張卡 型別 chip ＋ 練習名 · N questions ＋（已批）Reviewed／Skipped 標 ＋ 一題一行（分數膠囊、展開看句子、拼音、錄音）；View practice detail；AI Score｜Teacher Score（能改分的四種才有輸入框）；Quick review 三句 ＋ 自訂評語 ＋ Send review（已批改成 Update review／Reviewed）；底下 Previous｜Next student——**走整份清單（只吃型別篩選，不吃分頁）**，所以從 To Review 點進去也會走到已批過的。

**Skip review 抽屜**（`skip-review-drawer.js`，新）：標題 `Skip review` ＋ `Pick the submissions you are not going to review.`；`Select all (N)` 勾選 ＋ **Older than 30 days** 快選（只勾、不篩）；型別下拉（開抽屜時跟右欄同步）；候選 ＝ 還沒批的、**最舊在前**，30 天以上的時間綠字；底下說明 `Skipped submissions move to the Reviewed tab, marked Skipped. Students keep their score — they just will not get a teacher comment for this one.`；Cancel｜Skip review（紅、沒勾停用）。一次一筆寫（沒有 batch mutation）；全成功才關抽屜，snackbar `Skipped N submissions — moved to Reviewed.`。

## 使用者定的（2026-11-13，一題一題）

| # | 題目 | 定案 |
|---|---|---|
| ① | Skip 一次多個 practice 怎麼做 | **A 抽屜**：照產品 Skip review 抽屜同一個模式。快選鈕（No submissions yet／Older than 30 days）**都不要**，只有 Select all。每列的 Skip 鈕照留；只有 Overdue |
| ② | 超過 6 列自動收合 | **A 露 6 列 ＋ Show N more**（不是整段收起）；**超過 6 才收**（剛好 6 全露）。圖二沒附到，照這個做 |
| ③ | View practice detail 往上 | **標頭底下整條**（不縮成標頭小鈕），放在題目卡上面 |
| ④ | Next student 的用字 | **Previous submission｜Next submission** 兩個都改 |

## 使用者定的（2026-11-17，Skip 改成勾選，一題一題）

使用者「Skip assignments 不要點擊後再出現側邊欄，改成點擊後前面出現勾選框」。推翻定案 ① 的抽屜。

| # | 題目 | 定案 |
|---|---|---|
| ⑦-1 | Skip N 的按鈕放哪 | **底部浮動條**：`N selected of M` · Cancel · `Skip N assignments`，捲到哪都看得到 |
| ⑦-2 | 收起來的列怎麼辦 | **進勾選模式時 Overdue 自動全展開**（Show more 先藏） |
| ⑦-3 | 要不要確認框 | **要**，沿用單筆 Skip 的確認框，標題與說明換成複數 |
| ⑦-4 | 右欄 Skip review | **一起改**成同一套（抽屜拿掉） |

## 提案做了什麼

**第零輪（2026-11-13）**：設計沒動，只把三頁接起來——Dashboard → （側欄 Practice List）v24 列表 → Result → v23 Results 頁；Dashboard 每列的 View results 直接進 v23、v23 的 Back 回 Dashboard。

**第一輪（2026-11-13）**：
1. **多筆 Skip**（定案 ①）：Overdue 段頭的數字旁多一顆紅框小鈕 `Skip…`（Overdue 裡能 Skip 的列 ≥ 2 才出現）→ 抽屜 **Skip assignments**／`Pick the overdue assignments you are not going to chase.`：`Select all (N)`、一列一勾（練習名 ＋ 型別 chip ＋ 班 chip；第二行 `Due Nov 15 · 7/12 submitted`，0 的灰字）、底下說明（沿用產品 Skip 確認框那段：leave Active Assignments、students won't be chased、still in class history）、Cancel｜**Skip N assignments**（紅、沒勾停用）。候選照畫面順序；Word Game 不進。確認後那些列消失、snackbar `Skipped N assignments`（一筆時用產品原句）。一次一筆寫（跟 Skip review 一樣沒有 batch）。
2. **露 6 列**（定案 ②）：每段超過 6 列只露前 6 列（排序不變：沒交的人數多在前），底下一條 `Show N more ∨`，點了全展、變 `Show less ∧`。段頭的 ∧ 收合照舊。
3. **抽屜詳情鈕上移**（定案 ③）：`View practice detail` 從題目卡底下搬到標頭底下、題目卡上面；樣式不變。
4. **用字**（定案 ④）：抽屜底列 `Previous`｜`Next student` → `Previous submission`｜`Next submission`。

**第二輪（2026-11-13）**：
6. **右欄標題 To Review → Submissions**（第三輪）：跟左欄 Active Assignments 成對（指派 ↔ 交卷）、不再跟第一顆分頁同名、跟 Next submission 同一個字；分頁 `To Review｜Reviewed` 與 Skip review 鈕不動。另外兩個沒選的：Review Queue（Reviewed 分頁名實不符）、Student Submissions（長、Student 是廢字）。
5. **練習名可點**：每列的練習名改成連結，點了進該練習的 v23 Result 頁（跟 Submitted 旁的 open_in_new 同一條網址，帶 `back=dashboard`；滑過綠字 ＋ 底線）。點名字不會順便展開那列。Word Game 沒有 Result 頁，名字維持純文字。open_in_new 圖示照留（產品有）。

**第四輪（2026-11-17）**：
7. **Skip 改成勾選**（定案 ⑦）：
   - 左欄：段頭 `Skip…` → Overdue 進勾選模式。段頭最前面一個全選框（全選／部分選／沒選三態）、`Skip…` 鈕藏起來；每列最前面一個勾選框，練習名不當連結，Skip 鈕、展開箭頭、View results 圖示先藏；點整列＝勾，選中的列淡紅底。Word Game 的列沒有框、變淡、不能點。勾選模式下 Overdue 段頭點了不收合。
   - 右欄：`Skip review` → To Review 清單進勾選模式，`Skip review` 鈕藏起來。清單上方一列 `Select all (N)`／`N selected` ＋ `Older than 30 days`（產品抽屜本來就有的快選，照留）；每列前面勾選框、箭頭拿掉。候選吃上面的型別篩選。換到 Reviewed 分頁＝離開勾選模式。
   - 兩欄底部各一條深色浮動條：`N selected of M` · `Cancel` · 紅色 `Skip N assignments`／`Skip review (N)`（0 筆時停用）。
   - 按下去跳確認框（單筆 Skip 同一個）：左欄標題 `Skip 3 assignments`、副標 `第一筆 - 班 and 2 more`、說明改複數；右欄標題 `Skip review for N submissions`、說明用原抽屜底下那段。確認後離開勾選模式、toast。
   - Esc：確認框開著先關確認框，否則離開勾選模式。勾選框可用鍵盤 Enter／空白鍵。
   - 每列原本的單筆 Skip 鈕照留（不在勾選模式時）。

## 待問

1. **工程**：多筆 Skip 一次一筆呼叫 `upsertAssignment`（跟 Skip review 一樣）就好，還是要 batch？部分失敗時照 Skip review 的做法：成功的消失、失敗的留著、snackbar 寫 `Skipped a, failed b`。

## 待定

- 圖二沒附到；定案 ② 是照我的讀法 A 做的，若圖二另有樣子再改。
- 「Show N more」展開後要不要記住（重新整理還開著）？提案是不記。

## 改了什麼（change log）

| 日期 | 改了什麼 | 說明 |
|---|---|---|
| 2026-11-18 | Active Assignments **欄位對齊**：段頭與每一列的 Practice／Class／Due／Submitted 起點一致（原本每列差 2–17px）；很長的練習名在欄內換行 | 使用者「dashboard 對齊」。每一列是自己的 grid、欄寬 `fr` 會被長練習名撐開；改 `minmax(0,…fr)`。基準檔照產品，沒改（產品可能也歪，要請工程看） |
| 2026-11-17 | 右欄 Submissions **照左欄同一套**：`Skip review` 從面板標題右邊搬到清單上方的細列（靠右）；勾選模式時細列變操作列——左邊全選框 ＋ `Select all`、右邊 `⟲`（Older than 30 days，只剩圖示，滑過有字）· `Cancel` · 紅色 `Skip review (N)`；底部浮動條拿掉；不寫已選筆數；細列貼頁首、進出不位移；只在 To Review 分頁 | 使用者「Submissions 的也照這樣改」。右欄 400px 寬，四樣放不下，30 天快選縮成圖示鈕 |
| 2026-11-17 | 操作列左邊的筆數**拿掉**（0 筆、勾了都不寫）；筆數只在 `Skip N assignments` 鈕上 | 使用者先說「不用出現 0 selected of 36」，再說「勾了一筆後的我也不要」 |
| 2026-11-17 | 底部浮動條**併進段頭底下那條細列**：勾選模式時細列變操作列——左 `N selected of 36`、右 `Cancel` ＋ 紅色 `Skip N assignments`（0 筆停用）；細列貼在頁首底下，捲到哪都看得到；進出勾選模式列不位移 | 使用者「下面浮動的 bar 就結合在那一欄上」。`Skip several` 鈕在勾選模式時換成這兩顆，離開靠 Cancel 或 Esc。右欄 Skip review 的浮動條沒動 |
| 2026-11-17 | 點 `Skip several` 之後細列與按鈕**留在原位**，按鈕變按下的樣子（淡紅底、深紅框），再點一次＝離開勾選模式 | 使用者「點擊後他不用跳掉，這樣會有閃爍」。原本進勾選模式時細列收起、底下清單往上跳一格 |
| 2026-11-17 | 細列裡的入口改成**按鈕** `☑ Skip several`（白底紅框紅字，樣式跟每列 Skip 鈕同一套），靠右、右緣對齊底下每列的 Skip 鈕 | 使用者「讓他變成一個按鈕，並且放在 list skip 的上方」。我讀成：細列裡的文字連結 → 按鈕，擺在 Skip 那一欄正上方。文字從 Select several to skip 縮成 Skip several（按鈕放不下長句；tooltip 留全句） |
| 2026-11-17 | 多筆 Skip 的入口從 Overdue 段頭（夾在 `OVERDUE 36` 跟欄名中間的紅框 `Skip…`）搬到**段頭底下的一條細列**：`⊘ Select several to skip`（淡粉底、紅字）；能 Skip 的 ≥ 2 筆才出現，進勾選模式後收起 | 使用者「這裡的 skip 有沒有推薦其他擺放位子，先討論」→ A 面板標題右邊（跟 Skip review 對稱）／B 段頭最右／C 段頭底下細列／D 滑過才出框 → 使用者選 **C**。原因：舊位置像欄名、跟段頭收合搶點擊 |
| 2026-11-17 | **Skip 改成勾選**：左欄 `Skip…` 與右欄 `Skip review` 都不再開抽屜，改成清單上直接出現勾選框 ＋ 底部浮動條 ＋ 確認框；左欄進勾選模式時 Overdue 全展開 | 使用者「Skip assignments 的樣式，不點擊後再出現側邊欄，改成點擊後前面出現勾選匡，先討論」→「一題一題問我」→ 四題定案（見上表 ⑦）。推翻 11/13 定案 ① 的抽屜；右欄是產品現行的抽屜，這次一起改。`?skipmany=1` 左欄勾選、`?skip=1` 右欄勾選 |
| 2026-11-13 | 右欄標題 `To Review` → `Submissions` | 使用者「To Review 標題有更好的建議嗎」→ 三案選 1。分頁、按鈕用字不動 |
| 2026-11-13 | 每列練習名改成連結 → 該練習的 v23 Result 頁（Word Game 除外） | 使用者「點擊 dashboard 的 practice name 可以連動到單個 practice 的 result」。open_in_new 圖示照留 |
| 2026-11-13 | **第一輪四條**：Overdue 段頭 `Skip…` → 多筆 Skip 抽屜（Select all、一列一勾、Skip N assignments）；每段超過 6 列露 6 ＋ `Show N more`；抽屜 `View practice detail` 搬到標頭底下；底列改 `Previous submission｜Next submission` | 使用者「先討論」→「一題一題問」→ 四條定案（見上表）。多筆 Skip 的快選鈕使用者說都不要 |
| 2026-11-13 | **三頁接起來**：側欄 Practice List → v24；每列 Submitted 旁的 View results → v23（帶 type／name／cls／`back=dashboard`）；v23 的 Back 吃 `back=dashboard` 回 Dashboard；v23／v24 四張頁的側欄 Dashboard 連回這頁。基準連基準、提案連提案 | 使用者「把 v23 v24 的 demo 也連接到 dashboard」 |
| 2026-11-13 | 基準檔：現行 Dashboard 複刻（從 v10 那份分岔、對到 696f4a42：Submitted 欄 ＋ View results、NOT SUBMITTED 小標、Skip review 鈕與抽屜、Skipped 標、型別下拉帶 icon、chip 改欄色全名、補側欄外殼） | 鷹架 |
