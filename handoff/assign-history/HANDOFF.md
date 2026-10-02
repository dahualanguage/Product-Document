# Assign Practice · 指派歷史 ＋ 逾期扣分 — Engineer Handoff

老師建立**任一種** practice 的最後一步 **Assign Practice**（八種共用，`steps/step-three.js` ＋ `assignments/view/assign-practice.js`）加兩件事：①上面變成一份**歷史清單**——每一輪指派一列，分 In progress｜Past due，可 Edit／Extend due date／Unassign；②HOW IT COUNTS 多一段 **After the due date**——Full credit｜Reduced credit，Reduced 時一張最多三段的扣分階梯。另外學生端 `/student/practice` 的清單要看得到這條規則。

**這不是重寫，是在 Content Mirroring 那一包的第四步上加。** 但**這一包有後端**：每班的 assignment 要多一個陣列欄位（`lateTiers`）、歷史要逐輪回（現在前端把同一班的幾輪合併成一列）、逾期交的成績要算出 Adjusted。契約在 [`API-CONTRACT.md`](API-CONTRACT.md)。程式碼基準：`dahua-dash` `origin/develop` @ `bcfdaa8d`（2026-10-02 fetch；Assign 那一步與相關 mutation 從 `5447ca51` 起沒動）。

- 老師端原型：[`assign-history.html`](assign-history.html) —— `?step=4&hist=1` 指派中、`&past=1` 已過期、`&histclosed=1` History 收起、`&pick=5c&review=1` 再派一班的覆核框、`&edit=1` Edit 對話框（`&who=1` 名單展開、`&stage=review` Review changes）、`&past=1&edit=2` Extend due date、`&rm=1` Unassign 確認框、`&pick=5c&late=reduced` 逾期扣分（`&tiers=1:10,3:20,7:100` 三段）、`&pick=5c&kind=optional` Optional、`?step=4&pick=5c&nodue=1` 沒 Due。頁底狀態列每個狀態都有入口
- 學生端原型：[`student-practice-list.html`](student-practice-list.html) —— 預設 Mandatory 分頁；`?tab=optional` Bonus 分頁（沒有規則，跟現行一樣）；假資料 [`student-mock.js`](student-mock.js)（NOW ＝ 2026-09-19 10:00，跟老師端同一個世界）
- 四十九輪每一輪改了什麼、為什麼、PM 的問題與畫面上的假設：[v8 ITERATION.md](https://project-logeg.vercel.app/specs/chinese-modules/iterations/v8-assign-history/ITERATION.md)；現行畫面的複刻（對照組）：[v3 Assign 已指派](https://project-logeg.vercel.app/specs/chinese-modules/iterations/v3-content-mirroring/create-mirroring.html?step=2&assigned=1)、[學生端清單](https://project-logeg.vercel.app/specs/chinese-modules/iterations/v8-assign-history/student-practice.html)
- 姊妹包：[Content Mirroring](../content-mirroring/) §第四步（Assign 搬回頁面、diff 名冊、預覽框只講例外、單顆頁腳鈕）——**這一包的殼就是那個頁面**；[practice-shared](../practice-shared/) 的 S8 是八張卡共用的 Assign 規格

---

## 為什麼要做

PM 給的兩條需求：

1. **Assign 頁要有歷史，分得出已指派（過期）／指派中。** 現在第四步一班一張卡（`buildAssignedClasses` 把 `assignHistory` 按 `classSk` 合併），Start／Due、Edit／Unassign；沒有「過期」的概念，Due 過了長得跟進行中的一樣；同一班派過兩輪只看得到一列。
2. **逾期成績比例。** 老師設 Due 過後完成的作業算幾成，例如 90%：逾期交的最終成績 ＝ 原始成績 × 90%。設定層級是每個 practice 的每一班，放在 Assign 那一步；Teacher Dashboard 同時顯示 Original 與 Adjusted（**成績頁不在這一包，另開一版**）。現在：Due 過了學生端照樣能做（只掛 *Overdue · Nd* chip，`student/game-ui/utils.js`），成績照算，沒有任何扣分。

程式碼裡已經確定、設計照它畫的（細節在 ITERATION.md「需求 2 要先對的」）：

- **「過期」不用新欄位**：現在時間 > `expiredDate`，用學校時區判（#968 的 `getDayDifference(…, timezone)`）。
- **Optional 一定有 Due**（`resolveOptionalDates`：沒填就 start ＋ 30 天），而且那個 Due 多半是老師沒意識到的系統值 → **Optional 不套逾期扣分**，整段不出現。
- **Mandatory 可以沒 Due** → 沒 Due 時這段淡掉，寫 *Set a due date to use this.*
- **成績是 0–100**（`getScorePercent`：星星 × 20；MC 直接 `mcResult.score`），100 × 90% ＝ 90 直接算得出來。
- **老師已經能改分**（`overrideScore`，成績頁顯示琥珀 pill *Adjusted*、可 *Revert to system*）——PM 的「Adjusted Score」跟它撞名，見「動工前要先問的」。
- **產品沒有「不收」**：學生端從來不鎖，所以這一版**沒有截止日、不鎖學生端**；老師要「等於不收」就把最後一段設 Score 0。

---

## 範圍與前提

- 殼是 Content Mirroring 那一包定的第四步（Assign 在頁面上、不是對話框）。**如果那一包的第四步還沒做**，這一包的兩件事也能先落在現行的 `step-three.js`（卡片清單）＋ `assign-practice.js`（對話框）上：History 取代卡片清單、After the due date 進對話框的 How it counts——邏輯一樣，只是樣子不是原型那樣。
- 八種 practice 共用同一個第四步，**改一次八種一起變**，這是預期的。
- 前三步不動；Assign 的 mutation 名稱不動（`assignPractice`／`upsertAssignment`／`unassignPractice`），只加欄位。

---

## 需求 1 · HISTORY 清單（`step-three.js`）

```
HISTORY · 6          [ In progress · 2 ] [ Past due · 4 ]                    Hide
─────────────────────────────────────────────────────────────────────────────────
MANDATORY   Chinese 3B · 6 students     Sep 18 → Oct 2 · due 23:59 · late work 90%     Edit   Unassign
OPTIONAL    Chinese 4A · 8 students     Sep 10 → Sep 25 · due 23:59                     Edit   Unassign
```

- **一輪一列，不是一班一列。** 同一班派過兩輪就是兩列（原型的 3B：一列過期、一列進行中）。資料要逐輪回，見契約 §1。新的在上（照 start 排）。
- **In progress｜Past due** 貼在標題旁，選中實心主綠白字、數字半透明白；預設看進行中。Past due ＝ 現在時間 > `expiredDate`（學校時區）。哪一組是空的寫一句說明。
- **一列三欄**：①標籤欄 **MANDATORY**（`--primary-dark` 綠）／**OPTIONAL**（資訊藍 `#508AFC`）——它是屬性不是狀態，過期列也上色；②班級名 ＋ *N students*；③*Sep 10 → Sep 25 · due 23:59*，過期寫 *ended Sep 8, 23:59*、**整列灰**，去年的帶年份；Reduced credit 的列在 due 後面接 *late work 90%*（多段：*Sep 18–19 90% · Sep 20–23 80% · Sep 24 and after 0%*），Full credit 不寫；④動作：進行中 **Edit／Unassign**，過期 **Extend due date／Unassign**。沒有交件數（成績是成績頁的事）、沒有狀態點、沒有 Ended pill（tab 已經分組）。
- **可收合**：眉標右端 Hide／Show；收起只剩標題 ＋ 一句摘要 *2 in progress · 4 past due*，NEW ASSIGNMENT 往上靠。預設展開。
- **同一個 tab 超過 5 列先列 5 列**，底下 *Show all N*。
- **NEW ASSIGNMENT 的 WHO**：班級列只有班名 ＋ *Assigned* pill（整班已派、不能再選）或 *Choose students*；**「已指派」只算進行中的輪**，過期過的班可以再派一輪；名單裡 *In another class* 的衝突也只看進行中。列不再有副標（人數在覆核與 Choose students 都看得到）。

### Edit（進行中的列）

照產品現有的 `editMode`：**只限那一班**的對話框，兩階段。

| 段 | 內容 |
|---|---|
| WHO | 預設收合：一行 *All 6 students* ＋ **Change students**；展開是 diff 名冊（已派的維持勾選標 *Assigned*、新勾 *New*、取消勾 *Will remove*、被別班派走的不能選標 *In ⟨班級⟩*），按鈕變 Done。只有改了學生才有副標 *1 will be removed · 2 added* |
| WHEN | Start／Due（原生 datetime-local）＋ Due 快捷 +1／+3／+7 days |
| HOW IT COUNTS | 跟新指派卡**同一套**（TYPE 兩張卡、AFTER THE DUE DATE 兩張卡 ＋ 階段表，格子縮窄、範圍淡字不放） |
| **Review changes** | 只列有改的：*Students being added／removed*、*Schedule and type* 前→後、*Late work* 前→後（*Sep 18–19 90% · … → …*）；沒改東西時 Review changes 灰掉 |
| **Save changes** | 加人 → `assignPractice`（只帶新勾的）；減人 → `unassignPractice`；日期／Optional／階段表 → `upsertAssignment`（契約 §2）。三種各自平行送，跟現有 `handleSubmit` 的 add／remove／date tasks 一樣 |

### Extend due date（過期的列）

同一個對話框，副標 *Ended Sep 8, 23:59. A later due date reopens it for the class.*；存完那列回到 In progress，tab 跟著切過去。資料上只是改那一輪的 `expiredDate`，沒有新狀態。

### Unassign

照產品 `ConfirmDialog`「Unassign class」改寫：標題 *Unassign Chinese 4A?*，內文講清楚 N 個學生的錄音與成績會被刪、不能復原；按鈕 **Keep it**／**Unassign Chinese 4A**（紅）。→ `unassignPractice` 帶那一輪那一班的全部 `userIds`（現行行為）。Unassign 掉的輪**從歷史消失**（紀錄已刪，沒東西可列）。

---

## 需求 2 · After the due date（`assign-practice.js` 的 How it counts）

HOW IT COUNTS 改成**兩段選項卡**（跟 v6 Vocabulary Quiz 的 Question Types 同一套，照產品 `function-selector.js` 的可點 Card：icon 方塊 ＋ 標題，選中 ＝ 綠外框 ＋ 淡綠底，卡高 60px）：

```
TYPE
  [ ✉ Mandatory · Sends reminder emails ]   [ 📝 Optional ]

AFTER THE DUE DATE · Due Sep 17, 23:59
  [ ✓ Full credit ]   [ % Reduced credit ]

  AFTER                      CREDIT              100 BECOMES
  [2026/09/17 23:59]  Sep 18–19     − [ 90 ]% +            90      ×
  [2026/09/19 23:59]  Sep 20–23     − [ 80 ]% +            80      ×
  [2026/09/23 23:59]  Sep 24 and after − [ 0 ]% + [Score 0]   0
  + Add a stage · up to 3
```

- **TYPE**：Mandatory（副標 *Sends reminder emails*——寄提醒信是兩種唯一的實質差別）｜Optional（icon `note_add`）。＝ 現有 `isOptional`。
- **AFTER THE DUE DATE**：小標右邊帶 *Due Sep 17, 23:59*。Full credit（預設，＝ 現況）｜Reduced credit。
  - **Optional 時整段不出現**（不是變淡）。
  - **Mandatory 沒 Due 時整段淡掉**，小標旁 *Set a due date to use this.*
- **階段表**（Reduced credit 才出現；最多三列、預設一列 `{days:1, off:10}`）：
  - **AFTER** ＝ **可見的原生 `datetime-local` 欄位**（跟 WHEN 的 Start／Due 同一種，高 32px；顯示格式交給瀏覽器）。值是「這一段從它之後開始」的分界：**日期 ＝ Due ＋ (days − 1) 天，第一段就是 Due 當天**；時間預設跟 Due 一樣，可以改（存成這一段自己的 `time`）。右邊淡字是這段實際涵蓋的範圍，**兩段以上才寫**：*Sep 18–19*、最後一段 *Sep 24 and after*；分界時間跟 Due 不同時寫到分（*Sep 18–Sep 19 12:59*）。範圍 ＝ (這段分界, 下一段分界]。
  - **CREDIT** ＝ 算幾成：步進器 ±5，中間是**可以直接打字的 3 字寬數字欄**（滑上去淡灰底、點 % 那一格就聚焦並全選、Enter 或離開欄位套用），夾在前後段之間（前一段 − 5 ～ 後一段 ＋ 5，最後一段到 0）。最後一段多一顆 **Score 0**（＝ 0%，按下綠框；中間段灰掉、tooltip *Only the last stage can score 0*）。**畫面打的是算幾成，存的是扣幾 %**（`off = 100 − credit`）。
  - **100 BECOMES** ＝ 例子：100 × credit（90／80／0），擋「−10% 是乘還是減」的歧義。
  - 第二、三列可 ×（第一列不能）。**Add a stage · up to 3**：新段 `days = min(DAYS_MAX, last.days × 2 + 1)`、`off = min(100, last.off + 10)`（1 → 3 → 7 天；−10 → −20 → −30）。
  - **存的是「Due 後第幾天」**：Due 改了，三段的日期自動平移，不會出現階段早於 Due；選到前後段範圍外的日期夾回去。
- **Edit 對話框同一張表**（窄：格子縮窄、範圍淡字不放）。
- **覆核框**（再派一班的 *Assign to N classes*）副標帶規則：*Mandatory · 10 students · late work 90%*；歷史列與 Review changes 用同一句文法。
- **同一輪選了多班共用一份規則**（跟日期一樣）；*Set dates per class* 展開後每班可以各自設——但原型只畫共用那條，逐班的 UI 跟逐班日期同一個樣子。

---

## 學生端 · `/student/practice` 清單（`student/practice/list/`）

只動 **Mandatory 而且老師選了 Reduced credit** 的列；Optional 與 Full credit 的列什麼都不加。規則是**列右側、CTA 左邊的一塊字**（不是 chip），列的高度不變：

| 狀態 | 第一行（14px／700，前面一顆實心 icon） | 第二行（12px） |
|---|---|---|
| 到期前 | ⓘ *Late work counts 90%*（info 藍 `#2563EB`） | *then 80% from 20 Sept · 0% from 24 Sept*（一段規則就沒有這行） |
| 已過期、在某一段裡 | ⚠ *Now counts 90%*（warning 珊瑚，跟實心的 *Overdue* chip 分得開） | *80% from 20 Sept · 0% from 24 Sept*（後面幾段） |
| 已過期、最後一段是 0 | ⚠ *No credit now* | — |

- 語序一律「數字 from 日期」；日期格式跟到期 chip 一樣走 `en-NZ`（*18 Sept*）。
- 資料 ＝ 老師端 `lateTiers` 同一份，從 `getStudentAssignments` 回（契約 §4）；「現在在哪一段」前端用 `now` 對分界算（學校時區，跟 `formatDueChip` 同一個 `timezone`）。
- 改哪裡：`normalize-assignment.js` 把 `lateTiers` 帶過去；`game-ui/practice-row.js` 在 CTA 左邊開一個插槽；`list/assignment-section.js` 傳規則文字進去。
- **沒做、下一步**：練習完成頁的 *Submitting now counts 80% · 80 → 64*、History 的 Original／Adjusted——跟 Teacher Dashboard 一起另開一版。

---

## 不要順手改的

- **mutation 名稱與既有參數不動**：`assignPractice($practiceId, $programId, $classes)`、`upsertAssignment(startDate / expiredDate / isOptional / skipped)`、`unassignPractice`。只加 `lateTiers`。
- **`isOptional` 的語意不動**（只差不寄提醒信）；`resolveOptionalDates` 的 30 天不動。
- **不鎖學生端**：沒有截止日、沒有「不收」。要鎖是另一個功能，另外估。
- **`overrideScore` 的行為先不動**，成績頁的 *Adjusted* pill 也先不改名——PM 問題 6 還沒回（見下）。
- 學生端只動清單列；完成頁、History、開始頁都不動。

---

## 動工順序

| 階段 | 內容 | 可否獨立上線 |
|---|---|---|
| **1** | 後端：每班 assignment 加 `lateTiers`（寫：`upsertAssignment` ＋ `AssignClassInput`；讀：`getAssignments.assignHistory` ＋ `getStudentAssignments`）；`assignHistory` 逐輪回、每班自帶日期（契約 §1、§2） | 可——沒人讀就沒有影響 |
| **2** | 老師端第四步：HISTORY 清單（逐輪、In progress｜Past due、收合、Show all）、Edit／Extend due date／Unassign、HOW IT COUNTS 選項卡 ＋ 階段表 | 可——階段 1 沒好就先不出現 AFTER THE DUE DATE 那段 |
| **3** | 學生端清單：規則那塊字 | 可 |
| **4** | 逾期成績：後端在提交時算 `lateCredit`（契約 §3），成績頁／Dashboard 顯示 Original＋Adjusted | 可——PM 四條已回（見下）；成績頁的畫面另開一版 |

階段 2 上線而階段 4 還沒好，老師設了 Reduced credit 但成績沒有真的扣——**別把 4 拖太久**，或在階段 4 好之前先不開放 Reduced credit 那張卡。

---

## 動工前要先問的

全部細節在 [`API-CONTRACT.md`](API-CONTRACT.md)，這裡只列題目。

**PM 已定（2026-10-02 回的，四條都跟畫面上的假設一致）**

| # | 題目 | PM 的答案 |
|---|---|---|
| P1 | **逾期看哪個時間？** | **Submit to teacher 那一刻（`submittedDate`）。** 沒按 Submit ＝ 沒交，沒有成績可扣；`lastDate` 不用 |
| P2 | **Optional 套不套？** | **不套**（Optional 的 Due 多半是系統自動填的 30 天） |
| P3 | **事後 Extend due date 要不要回算？** | **回算**：存 Original，Adjusted 每次用當下的 Due 算，延長就自然回復 |
| P4 | **跟老師手動改分（`overrideScore`）的關係？** | **分開**：老師改分與逾期扣分是兩件事，各自一個欄位、各自一個標籤（老師改的維持 *Adjusted*，系統扣的叫 *Late · ×90%*）；老師改過的分數不再乘逾期成數 |
| P5 | 學生端要不要在 Due 前看到規則？ | **要，已處理好**：清單列那塊字（上一節）。完成頁跟成績頁一起另開一版 |

**要問後端**

| # | 題目 |
|---|---|
| E1 | `assignHistory` 現在一輪多班時日期回在哪一層？同一班再派一輪，是新的 entry 還是覆蓋？（契約 §1） |
| E2 | `lateTiers` 放 assignment × class（跟 `isOptional` 同層）可以嗎？`AssignClassInput` 能不能一起帶？（契約 §2） |
| E3 | Adjusted 是後端存還是前端算？建議後端在提交時寫 `lateCredit`，Due 改了照當下 Due 重算（P3 已定要回算）（契約 §3） |
| E4 | 「第 n 天」怎麼算：學校時區的日曆日、分界時刻 ＝ Due 的時刻（或老師改的 `time`）——跟 #968 同一套 `timezone`？（契約 §2） |
