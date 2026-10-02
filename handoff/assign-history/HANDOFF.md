# Assign Practice · 指派歷史 ＋ 逾期扣分 — Engineer Handoff

老師建立**任一種** practice 的最後一步 **Assign Practice**（八種共用，`steps/step-three.js` ＋ `assignments/view/assign-practice.js`）加兩件事，外加學生端清單一處：

1. **HISTORY 清單**：每一輪指派一列，分 In progress｜Past due，可 Edit／Extend due date／Unassign。
2. **After the due date**：HOW IT COUNTS 多一段 Full credit｜Reduced credit，Reduced 時一張最多三段的扣分階梯。
3. **學生端 `/student/practice` 清單**：Mandatory 且有扣分規則的列，看得到現在算幾成。

**這不是重寫，是在 Content Mirroring 那一包的第四步上加。** 有後端：每班 assignment 多一個陣列欄位 `lateTiers`、`assignHistory` 要逐輪回、提交時算 `lateCredit`。契約在 [`API-CONTRACT.md`](API-CONTRACT.md)。程式碼基準：`dahua-dash` `origin/develop` @ `bcfdaa8d`（2026-10-02）。

- 老師端原型：[`assign-history.html`](assign-history.html)。網址參數：`?step=4&hist=1` 指派中、`&past=1` 已過期、`&histclosed=1` History 收起、`&pick=5c&review=1` 再派一班的覆核框、`&edit=1` Edit 對話框（`&who=1` 名單展開、`&stage=review` Review changes）、`&past=1&edit=2` Extend due date、`&rm=1` Unassign 確認框、`&pick=5c&late=reduced` 逾期扣分（`&tiers=1:10,3:20,7:100` 三段）、`&pick=5c&kind=optional` Optional、`?step=4&pick=5c&nodue=1` 沒 Due。頁底狀態列每個狀態都有入口。
- 學生端原型：[`student-practice-list.html`](student-practice-list.html)。預設 Mandatory 分頁；`?tab=optional` Bonus 分頁（沒有規則，跟現行一樣）。假資料 [`student-mock.js`](student-mock.js)，NOW ＝ 2026-09-19 10:00，跟老師端同一個世界。
- 對照組（現行畫面的複刻）：[Assign 已指派](https://project-logeg.vercel.app/specs/chinese-modules/iterations/v3-content-mirroring/create-mirroring.html?step=2&assigned=1)、[學生端清單](https://project-logeg.vercel.app/specs/chinese-modules/iterations/v8-assign-history/student-practice.html)。
- 姊妹包：[Content Mirroring](../content-mirroring/) 第四步（Assign 搬回頁面、diff 名冊、覆核框只講例外、單顆頁腳鈕）是這一包的殼；[practice-shared](../practice-shared/) S8 是八張卡共用的 Assign 規格。

---

## 已定的規則

| 題目 | 定案 |
|---|---|
| 「過期」怎麼判 | 現在時間 > `expiredDate`，學校時區（`getDayDifference(…, timezone)`，同 #968）。不加狀態欄位 |
| 逾期看哪個時間 | **Submit to teacher 那一刻**（`submittedDate`）。沒按 Submit ＝ 沒交，沒有成績可扣；`lastDate` 不用 |
| 扣分形狀 | 階梯式，最多三段；每段「Due 後第 n 天起算幾成」。最後一段可以是 0%（算 0 分） |
| 逾期要不要鎖 | **不鎖、只扣**。學生端照常作答與提交，沒有截止日 |
| Optional | **不套**。Optional 一定有 Due（`resolveOptionalDates` 沒填就 ＋ 30 天），那個 Due 多半不是老師設的 |
| Mandatory 沒 Due | 不套，AFTER THE DUE DATE 那段淡掉 |
| 事後 Extend due date | **回算**：存 Original，Adjusted 用當下的 Due 算，延長就自然回復 |
| 跟老師手動改分（`overrideScore`）的關係 | **分開**：兩件事、各自欄位、各自標籤——老師改的維持 *Adjusted*，系統扣的叫 *Late · ×90%*；`overrideScore` 有值就是最終分，不再乘逾期成數 |
| 學生端 | 清單列看得到規則（這一包）。完成頁、History 的 Original／Adjusted、Teacher Dashboard 另開一版 |

---

## 範圍與前提

- 殼是 Content Mirroring 那一包定的第四步（Assign 在頁面上、不是對話框）。如果那一包還沒做，這一包的兩件事也能先落在現行 `step-three.js`（卡片清單）＋ `assign-practice.js`（對話框）上：History 取代卡片清單、After the due date 進對話框的 How it counts——邏輯一樣，樣子不是原型那樣。
- 八種 practice 共用同一個第四步，改一次八種一起變。
- 前三步不動；mutation 名稱不動（`assignPractice`／`upsertAssignment`／`unassignPractice`），只加欄位。

---

## 1 · HISTORY 清單（`step-three.js`）

```
HISTORY · 6          [ In progress · 2 ] [ Past due · 4 ]                    Hide
─────────────────────────────────────────────────────────────────────────────────
MANDATORY   Chinese 3B · 6 students     Sep 18 → Oct 2 · due 23:59 · late work 90%     Edit   Unassign
OPTIONAL    Chinese 4A · 8 students     Sep 10 → Sep 25 · due 23:59                     Edit   Unassign
```

- **一輪一列，不是一班一列。** 同一班派過兩輪就是兩列。現行 `buildAssignedClasses` 按 `classSk` 合併，要改成不合併（契約 §1）。新的在上（照 start 排）。
- **In progress｜Past due** 貼在標題旁，選中實心主綠白字、數字半透明白；預設看進行中。哪一組是空的寫一句說明。
- **一列三欄**：①標籤欄 **MANDATORY**（`--primary-dark` 綠）／**OPTIONAL**（資訊藍 `#508AFC`），過期列也上色；②班級名 ＋ *N students*；③*Sep 10 → Sep 25 · due 23:59*，過期寫 *ended Sep 8, 23:59*、整列灰，去年的帶年份；Reduced credit 的列在 due 後面接 *late work 90%*（多段：*Sep 18–19 90% · Sep 20–23 80% · Sep 24 and after 0%*），Full credit 不寫；④動作：進行中 **Edit／Unassign**，過期 **Extend due date／Unassign**。沒有交件數、狀態點、Ended pill。
- **可收合**：眉標右端 Hide／Show；收起只剩標題 ＋ 一句摘要 *2 in progress · 4 past due*，NEW ASSIGNMENT 往上靠。預設展開。
- **同一個 tab 超過 5 列先列 5 列**，底下 *Show all N*。
- **NEW ASSIGNMENT 的 WHO**：班級列只有班名 ＋ *Assigned* pill（整班已派、不能再選）或 *Choose students*；**「已指派」只算進行中的輪**，過期過的班可以再派一輪；名單裡 *In another class* 的衝突也只看進行中。列沒有副標。

### Edit（進行中的列）

照現有 `editMode`：只限那一班的對話框，兩階段。

| 段 | 內容 |
|---|---|
| WHO | 預設收合：*All 6 students* ＋ **Change students**；展開是 diff 名冊（已派的維持勾選標 *Assigned*、新勾 *New*、取消勾 *Will remove*、被別班派走的不能選標 *In ⟨班級⟩*），按鈕變 Done。只有改了學生才有副標 *1 will be removed · 2 added* |
| WHEN | Start／Due（原生 datetime-local）＋ Due 快捷 +1／+3／+7 days |
| HOW IT COUNTS | 跟新指派卡同一套（§2），格子縮窄、範圍淡字不放 |
| **Review changes** | 只列有改的：*Students being added／removed*、*Schedule and type* 前→後、*Late work* 前→後；沒改東西時灰掉 |
| **Save changes** | 加人 → `assignPractice`（只帶新勾的）；減人 → `unassignPractice`；日期／Optional／階段表 → `upsertAssignment`。三種各自平行送，跟現有 `handleSubmit` 的 add／remove／date tasks 一樣 |

### Extend due date（過期的列）

同一個對話框，副標 *Ended Sep 8, 23:59. A later due date reopens it for the class.*；存完那列回到 In progress，tab 跟著切過去。資料上只是改那一輪的 `expiredDate`。

### Unassign

照現有 `ConfirmDialog`「Unassign class」改字：標題 *Unassign Chinese 4A?*，內文講清楚 N 個學生的錄音與成績會被刪、不能復原；按鈕 **Keep it**／**Unassign Chinese 4A**（紅）。→ `unassignPractice` 帶那一輪那一班的全部 `userIds`。Unassign 掉的輪從歷史消失。

---

## 2 · After the due date（`assign-practice.js` 的 How it counts）

HOW IT COUNTS 改成兩段選項卡（照 `function-selector.js` 的可點 Card：icon 方塊 ＋ 標題，選中 ＝ 綠外框 ＋ 淡綠底，卡高 60px）：

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

- **TYPE**：Mandatory（副標 *Sends reminder emails*）｜Optional（icon `note_add`）。＝ 現有 `isOptional`。
- **AFTER THE DUE DATE**：小標右邊帶 *Due Sep 17, 23:59*。Full credit（預設，＝ 現況）｜Reduced credit。Optional 時整段**不出現**；Mandatory 沒 Due 時整段淡掉、小標旁 *Set a due date to use this.*
- **階段表**（Reduced credit 才出現；最多三列、預設一列 `{days:1, off:10}`）：
  - **AFTER** ＝ 可見的原生 `datetime-local` 欄位（跟 WHEN 的 Start／Due 同一種，高 32px，顯示格式交給瀏覽器）。值是「這一段從它之後開始」的分界：**日期 ＝ Due ＋ (days − 1) 天，第一段就是 Due 當天**；時間預設跟 Due，可改（存成這段的 `time`）。右邊淡字是這段涵蓋的範圍，**兩段以上才寫**：*Sep 18–19*、最後一段 *Sep 24 and after*；分界時間跟 Due 不同時寫到分（*Sep 18–Sep 19 12:59*）。範圍 ＝ (這段分界, 下一段分界]。
  - **CREDIT** ＝ 算幾成：步進器 ±5，中間是可直接打字的 3 字寬數字欄（Enter 或離開欄位套用），夾在前後段之間（前一段 − 5 ～ 後一段 ＋ 5，最後一段到 0）。最後一段多一顆 **Score 0**（＝ 0%；中間段灰掉、tooltip *Only the last stage can score 0*）。**畫面打的是算幾成，存的是扣幾 %**（`off = 100 − credit`）。
  - **100 BECOMES** ＝ 例子：100 × credit。
  - 第二、三列可 ×（第一列不能）。**Add a stage · up to 3**：新段 `days = min(DAYS_MAX, last.days × 2 + 1)`、`off = min(100, last.off + 10)`。
  - **存的是 Due 後第幾天**：Due 改了，分界自動平移；選到前後段範圍外的日期夾回去。
- **Edit 對話框同一張表**（窄版）。
- **覆核框**（*Assign to N classes*）副標帶規則：*Mandatory · 10 students · late work 90%*；歷史列與 Review changes 同一句文法。
- **同一輪多班共用一份規則**（跟日期一樣）；*Set dates per class* 展開後每班可各自設，UI 跟逐班日期同一個樣子。

---

## 3 · 學生端清單（`student/practice/list/`）

只動 **Mandatory 且 `lateTiers` 有值** 的列；Optional 與 Full credit 的列不加東西。規則是列右側、CTA 左邊的一塊字（不是 chip），列高不變：

| 狀態 | 第一行（14px／700，前面一顆實心 icon） | 第二行（12px） |
|---|---|---|
| 到期前 | ⓘ *Late work counts 90%*（info 藍 `#2563EB`） | *then 80% from 20 Sept · 0% from 24 Sept*（一段規則沒有這行） |
| 已過期、在某一段裡 | ⚠ *Now counts 90%*（warning 珊瑚） | *80% from 20 Sept · 0% from 24 Sept* |
| 已過期、最後一段是 0 | ⚠ *No credit now* | — |

- 語序一律「數字 from 日期」；日期格式跟到期 chip 一樣走 `en-NZ`。
- 資料 ＝ 老師端 `lateTiers` 同一份，從 `getStudentAssignments` 回（契約 §4）；現在在哪一段，前端用 `now` 對分界算（學校時區，跟 `formatDueChip` 同一個 `timezone`）。
- 改哪裡：`normalize-assignment.js` 帶 `lateTiers`；`game-ui/practice-row.js` 在 CTA 左邊開一個插槽；`list/assignment-section.js` 傳規則文字。

---

## 不要順手改的

- mutation 名稱與既有參數；`isOptional` 的語意；`resolveOptionalDates` 的 30 天。
- 不鎖學生端：沒有截止日、沒有「不收」。
- `overrideScore` 的寫法；成績頁現有的 *Adjusted* pill 留給老師改分用。
- 學生端只動清單列；完成頁、History、開始頁不動。

---

## 動工順序

| 階段 | 內容 | 可否獨立上線 |
|---|---|---|
| **1** | 後端：每班 assignment 加 `lateTiers`（寫：`upsertAssignment` ＋ `AssignClassInput`；讀：`getAssignments.assignHistory` ＋ `getStudentAssignments`）；`assignHistory` 逐輪回、每班自帶日期（契約 §1、§2） | 可——沒人讀就沒有影響 |
| **2** | 老師端第四步：HISTORY 清單、Edit／Extend due date／Unassign、HOW IT COUNTS 選項卡 ＋ 階段表 | 可——階段 1 沒好就先不出現 AFTER THE DUE DATE |
| **3** | 學生端清單：規則那塊字 | 可 |
| **4** | 逾期成績：提交時寫 `lateCredit`（契約 §3）；成績頁／Dashboard 的顯示另開一版 | 可 |

階段 2 上線而 4 還沒好，老師設了 Reduced credit 但成績沒有真的扣——別把 4 拖太久，或在 4 好之前先不開放 Reduced credit 那張卡。

---

## 要問後端的

| # | 題目 | 卡住哪一項 |
|---|---|---|
| E1 | `assignHistory` 同一班再派一輪是新 entry 還是覆蓋？一輪多班、逐班日期不同時，日期回在哪一層？ | §1 一輪一列 |
| E2 | `lateTiers` 放 assignment × class（跟 `isOptional` 同層）可以嗎？`AssignClassInput` 能不能一起帶？ | §2 |
| E3 | `lateCredit` 後端存（建議）還是前端算？ | §3 |
| E4 | `time` 的時區解讀、「第 n 天」是不是學校時區的日曆日——跟 #968 同一套 `timezone`？ | §2、§3 |
