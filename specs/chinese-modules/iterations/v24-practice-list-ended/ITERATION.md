# v24 — Practice 列表：Ended tab（結束的指派集中看成績）

- **功能名稱**：Practice 列表多一個 tab 放「指派已經到期」的練習——這些才有看成績的需求；是 v23 Results 頁的入口（2026-11-12 使用者「我想從 practice 那頁開始整理」）
- **網址**：https://dahua-dash-dev.web.app/dashboard/practice/
- **截圖**：使用者給了一張卡片檢視的卡（⋯ 選單打開：Share／Clone／Edit／Delete；底下 Test｜Result）
- **日期**：2026-11-12（討論六條 → 基準 ＋ 提案第一輪）
- **分岔自**：無。v1 動過這頁的「New Practice → Choose Practice Type」對話框，列表本身沒動過
- **跟 v23 的關係**：v24 是入口（列表 → Result），v23 是進去的頁（Results）。看成績的動作統一叫 **Result**（定案 ⑥），v23 的頁面標題要跟著改
- **設計檔**：
  - `mock.js` 共用假資料（12 個練習、每班的到期日／Mandatory／交卷數；今天＝2026-11-20，讓「全球暖化」7A 已結束、7B 還在跑）
  - `practice-list-baseline.html`（**基準**，現行列表複刻；`?view=card|list`、`&menu=1` 第一張卡的 ⋯ 打開）
  - `proposal.html`（**提案**，三個 tab ＋ Ended 卡；`?tab=all|progress|ended`、`&view=card|list`、`&menu=1`）
  - **spec**：跟 v23 同一份 `../v23-practice-results/spec.html`（2026-11-13 使用者「v24 的 spec 也寫在同一份」）。§2.1「為什麼多一個 tab」九步邏輯、§3.1 三個 tab、§3.2 卡片與列表檢視、§4 L1–L6、§6 驗收 1–5
- **程式碼基準**：dahua-dash `origin/develop` @ `696f4a42`（2026-11-12 fetch）
- **狀態**：**2026-11-12 六條定案、基準 ＋ 提案第一輪畫完**。未 commit、未部署；待問工程一條

## 使用者定的（2026-11-12，一題一題）

| # | 題目 | 定案 |
|---|---|---|
| ① | 一個練習什麼時候算「結束」 | ~~任一班過了到期日就進 Ended~~ → **2026-11-18 改：每一班都過了到期日才進 Ended**；卡上照樣每班一列標出結束的班和還在跑的班；沒設到期日的班永遠不結束 |
| ② | tab 怎麼分 | **All｜In progress｜Ended** 三個。一個練習 7A 過期、7B 還在跑會同時在後兩個（**2026-11-18 改：不會了**，只在 In progress）；沒指派過的只在 All；數字加起來不等於 All（跟現在 Mandatory／Optional 下拉一樣）。**2026-11-17 改**：多一個 Unassigned，沒指派過的在 All 和 Unassigned |
| ③ | 沒結束的能不能看成績 | **照舊都能看**；Ended 只是把該看的集中，不是限制 |
| ④ | Ended 卡上多什麼 | **每班 `8/10 submitted`**；平均分進 Result 再看。交卷數列表一次拿到 → 待問工程 |
| ⑤ | 排序 | **Ended 照最近結束的在前**（一個練習多班結束取最晚那個）；All、In progress 照舊建立時間新到舊 |
| ⑥ | 用字 | tab 用 **All／In progress／Ended**（In progress 跟 v8 HISTORY 同字；Ended 跟卡上 `ended Sep 25` 同字）；看成績統一叫 **Result**（照卡片現在的按鈕；列表選單的 Student Submissions、Results 頁標題 Assignment Submission List 都改） |
| ⑦ | 還沒有成績的 | **Result 鈕停用**（卡片底下、列表右邊、⋯ 選單那條）：沒指派、或指派了但一個人都還沒交。滑過寫原因 Not assigned yet／No submissions yet。產品現在能按、按了跳 snackbar |

## 現行頁面（程式碼讀出來的）

出處 `src/sections/practice/view/index.js`、`practice-table-row.js`、`src/components/dahua/practice/*`、`src/utils/practice-list-filters.js`。

- **沒有 tab**。一列三個下拉 ＋ 搜尋 ＋ New Practice：Practice type（All ＋ 九種，帶數量）、Assignment type（All／Mandatory／Optional）、Class（指派過的班）。右上切卡片／列表檢視（記在 localStorage）。一頁 12 筆，固定照建立時間新到舊。
- **卡片檢視**（`PracticeCardItem` FULL）：卡框與頭的底色照型別（九種各一組色票）；頭：40px icon ＋ 名稱 ＋ `v1` ＋ 型別 chip ＋ ⋯；內容：Belongs to 專案名；`Assigned to N classes`，每班一列＝班名灰 chip ＋ Mandatory／Optional chip ＋ 到期小字（`Due Nov 20`，七天內轉綠、過了寫 `Overdue · Nov 18` 紅）；沒指派＝虛線 `Assign Now`；底下 `Test`（outlined）｜`Result`（contained，顏色照型別）。⋯ 選單：Assign Practice（有指派才有）、Share、Clone、Edit、Delete。
- **列表檢視**（`practice-table-row.js`）：48px 圓 icon ＋ 名稱 ＋ 型別 chip ＋ `v1` outlined chip ＋ 一行小字（專案 · 題庫 · 建立日期）＋ ⋯。看不到指派狀態。⋯ 選單七條：Assign Practice、Test Practice、**Student Submissions**、Share、Clone、Edit、Delete。
- **Result 怎麼開**：`resolvePracticePageAssignment` 拿這個練習的第一筆指派 sk 進 `/dashboard/assignments/submissions`；Results 頁自己再把所有班級指派攤開。沒指派過 → snackbar `No assignment found for this practice`。
- **列表拿得到的資料**：每個練習每個班的到期日（同一班指派兩次取最新）、Mandatory／Optional、學生名單；練習身上有 `hasAssignmentHistory` 旗標。**拿不到**交卷數、平均分。
- v8 的 HISTORY 清單已經在用 **In progress／Past due** 與 `ended Sep 25`。

## 提案做了什麼（第一輪 2026-11-12）

1. **三個 tab**（`.seg`，帶數量）放在篩選列上面：All · 12｜In progress · 5｜Ended · 7。三個下拉、搜尋、檢視切換三個 tab 共用。
2. **卡片照產品現在的樣子**（第二版）：卡框、頭的底色、icon 方塊、Test／Result 按鈕顏色都照 `getPracticeTypeConfig` 九組色票，跟基準一樣。第一版曾壓成 v23 的單色 token，使用者「UI 可以更接近現在上線的版本嗎？有顏色」改回。
3. **每班一列照產品**（灰 chip 班名 ＋ Mandatory／Optional chip ＋ 右邊小字），小字改寫：還在跑 `Due Nov 25`（七天內綠，照產品）；結束了不再寫紅字 Overdue，改 **`Ended Nov 18`** ＋ **`8/10 submitted`**（全交的綠字；定案 ①④）。Ended 的班排前面。沒到期日寫 `No due date`（產品現在空著）。
4. **Ended tab** 照最近結束在前（定案 ⑤）；卡片一樣，沒有另一種卡。
5. **列表檢視**每列右邊多一欄指派狀態（每班一行同上）＋ `Result` 按鈕；⋯ 選單的 Student Submissions 改叫 **Result**、Test Practice 改叫 Test（跟卡片同字，R10）。
6. 空狀態：Ended 空寫 `No ended assignments yet — a practice shows here once one of its classes passes its due date`；In progress 空寫 `Nothing in progress`；All 照產品。
7. **Result 停用**（定案 ⑦）：`我的家人 (2)`（沒指派）、`春节` Vocabulary Mirroring（沒指派）、`我的一天` Sentence Building（8B 0/11）三張的 Result 灰掉，title 寫原因。
8. 沒改：Assign Now 虛線鈕、New Practice、分頁、三個下拉的內容。

## 待問

1. **工程**：列表要每個班級指派的 `submitted／total`（定案 ④）。現在 Results 頁是一個指派一個 `getAssignmentHistories`；列表 12 張卡 × N 班這樣抓太重，要請後端在 `getAssignments` 一次帶回交卷數（或加一個 summary 欄位）。拿不到就先只顯示 `Ended Nov 18`。
2. **工程**：Results 頁標題 `Assignment Submission List`、網址 `/submissions` 要不要一起改成 Result（定案 ⑥）；網址改會動到分享出去的連結。

## 待定

- 一個練習 7A 結束、7B 還在跑，在 In progress tab 的卡上 Ended 的班也排前面嗎？提案是「Ended 的班一律排前面」，兩個 tab 同一張卡。

## 改了什麼（change log）

| 日期 | 改了什麼 | 說明 |
|---|---|---|
| 2026-11-18 | **spec 更新成最新設計**（`v23-practice-results/spec.html`）：章節改成 1 原型與檔案、2 範圍、3 設計規格（3.1–3.8，列表三節、Results 五節，各附原型預覽）、4 要改的地方（L1–L6、R1–R9）、5 要問工程、6 驗收 21 條、7 名詞對照；跟 HANDOFF.md 一致；程式碼基準 36664ed4；原本開著的設計題照原型寫成規則 | 使用者「更新為最新的設計」。舊版停在 11/13：分數在貼頂列、班級標頭有計數與 tile、分頁是灰底 seg、名詞對照的 Ended 還是任一班、三個檔案路徑錯 |
| 2026-11-18 | **打包交接**：`handoff/practice-results/`（HANDOFF.md ＋ practice-list.html、results.html 兩份原型複本，假資料內嵌、互相連得過去）。v23、v24 一包 | 使用者「打包這次的設計」。程式碼基準 36664ed4。複本時順手補回分數卡的 `v2 · Old version` tag（分數卡改版時漏掉） |
| 2026-11-18 | tab 選中改**主綠**：字 #00A749、底線 #00CB61、數字淡綠底綠字（原本黑字黑底線、黑底白字數字）；沒選中的滑過變深 | 使用者「tab 換個顏色」。用產品主色，跟 New practice 鈕、側欄選中同一個綠 |
| 2026-11-18 | 卡上**每班改兩行**：第一行班名 chip ＋ Mandatory／Optional；第二行狀態小字（`Ended Nov 10 · 12/12 submitted`、`Due Nov 25`、`No due date`），靠左；班名太長用 … 截斷、滑過看全名；列表檢視的班名欄也截斷 | 使用者「現在這邊太擠了，教室名稱也有可能會更長」。原本一行塞四樣、狀態靠右擠在卡邊。`&longcls=1` 看長班名 |
| 2026-11-18 | **Ended 改成每一班都截止才算**（原本任一班過期就進）；In progress 照舊（還有一班沒到期）。兩個 tab 不再重疊，Unassigned＋In progress＋Ended＝All（mock：2＋5＋5＝12）。全球暖化（7A 過期、7B 還沒）、我的学校（8A 過期、8B 還沒）從 Ended 拿掉，只在 In progress，卡上照樣每班一列、過期的班寫 Ended ＋ 交卷數 | 使用者先問「現在 In progress 5、Ended 7 的規則是什麼」→ 聽完「Ended 改成全部都截止」。推翻 11-12 定案 ① 的「任一班」與 ② 的「可以同時在兩個」 |
| 2026-11-17 | **沒有未指派的練習時，Unassigned 這個 tab 不出現**（空狀態拿掉）；停在這個 tab 時沒有了就回 All | 使用者「沒有未指派的練習的時候就不用有這個分類」 |
| 2026-11-17 | 多一個 tab **Unassigned**：一個班都還沒指派的練習；順序 All｜Unassigned｜In progress｜Ended；照建立時間新的在前；空的時候寫 *Everything is assigned* / *Practices you create show here until you assign them to a class.* | 使用者「新增一個 tab 叫 unassign」。用 Unassigned（形容詞，跟 In progress／Ended 同一類）；排在 All 後面是照生命週期（沒指派 → 進行中 → 結束）。mock 有兩張（我的家人 (2)、春节）。`?tab=unassigned`、`&empty=1` |
| 2026-11-16 | **tab 收進篩選列**：三個 tab 改底線式、搬進白框，跟三個下拉同一列；下拉縮成短名稱 Type／Assignment／Class；下拉上的「· 12」拿掉，數字只留在 tab | 使用者「Practice List 的這些 filter UI 結合在一起」。高度少一半、只剩一個框。下拉選了值以後要顯示「Class: 7A」這種，還沒畫。New practice 搬到標題列右邊、卡片／列表切換鈕旁（使用者「往上擺不用跟 filter 一起」），篩選列 1280 寬也放得下一列 |
| 2026-11-13 | 跟 v25 Teacher Dashboard 接起來：側欄 Dashboard → v25（基準連基準、提案連提案）；v25 的側欄 Practice List 連回這頁 | 使用者「把 v23 v24 的 demo 也連接到 dashboard」 |
| 2026-11-13 | spec 寫進 v23 的 `spec.html`（同一份）；加「為什麼多一個 tab」的邏輯：成績到期才有意義 → 列表看不出到期 → Result 鈕不是線索 → 要的是狀態切面不是第四個下拉 → 結束以班為單位 → 集中不是限制 → 最近結束在前 → 卡上寫交卷數 → 沒東西看的 Result 停用 | 使用者「v24 的 spec 也寫在同一份」「寫說為什麼要新增一個 tab 的邏輯」 |
| 2026-11-12 | **跟 v23 接起來**：Result（卡片、列表、⋯ 選單）→ v23 proposal.html 帶 type／name／cls／back；v23 的 Back 回原來的 tab。基準檔也互連（Result／Student Submissions → v23 基準；v23 基準的 Back → v24 基準） | 使用者「把 v23 v24 互動連貫再一起」。v23 左欄的班名、到期小字照 v24 帶過去的換；名單裡的人和分數還是 v23 自己的假資料（v23 mock 只有兩組） |
| 2026-11-12 | 還沒有成績的 Result 鈕停用（沒指派／沒人交），滑過寫原因 | 使用者「讓還沒有 result 的 practice 的 result 按鈕 disable」。要判斷「沒人交」也得靠待問 1 的交卷數 |
| 2026-11-12 | 卡片改回產品的型別配色（卡框、頭、icon、按鈕） | 使用者「UI 可以更接近現在上線的版本嗎？有顏色」。第一版壓成 v23 的單色 token；新的只剩 tab、每班的 Ended ＋ 交卷數、列表檢視的狀態欄與 Result 鈕、用字 |
| 2026-11-12 | **提案第一輪：三個 tab ＋ Ended 卡（每班 Ended 日期 ＋ 交卷數）＋ 用字統一 Result** | 使用者一題一題定六條（見上表） |
| 2026-11-12 | 基準檔：現行列表複刻（卡片 ＋ 列表檢視） | 鷹架 |
