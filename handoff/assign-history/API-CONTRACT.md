# Assign Practice · 指派歷史 ＋ 逾期扣分 — API Contract

搭配 [`HANDOFF.md`](HANDOFF.md)。程式碼基準：`dahua-dash` `origin/develop` @ `bcfdaa8d`（2026-10-02）。

這一份是**草案**：欄位名稱照現有結構延伸，型別與放的位置由後端定。每一節開頭寫「現在怎樣」，接著寫「要變成怎樣」，最後是要問的。

---

## 核心概念

1. **逾期規則是 assignment × class 的欄位**，跟 `startDate`／`expiredDate`／`isOptional` 同一層——一輪指派裡每一班各自一份（前端送同一組值 N 次，跟日期一樣）。
2. **規則是一個最多三筆的陣列** `lateTiers:[{days, off, time?}]`：`days` ＝ Due 後第幾天起、`off` ＝ 扣幾 %、`time` ＝ 這段分界的時刻（沒設 ＝ Due 的時刻）。`null` 或空陣列 ＝ Full credit（＝ 現況）。
3. **逾期不鎖、只扣**：學生端照常作答與提交；提交時落在哪一段就乘那一段的成數。最後一段 `off:100` ＝ 算 0 分，不是不收。
4. **逾期看 Submit to teacher 那一刻**（`submittedDate`）。沒按 Submit ＝ 沒交，不算。
5. **成績存 Original，Adjusted 用當下的 Due 算**：老師事後 Extend due date，Adjusted 自然回復。
6. **老師手動改分（`overrideScore`）跟逾期扣分分開**：override 有值就是最終分，不再乘。

---

## 1. 歷史清單要的資料（`getAssignments.assignHistory`）

### 現在

```graphql
assignHistory {
  assignedTime
  startDate
  expiredDate
  classes { classSk className isOptional students { userId studentName } }
}
```

`assignedTime`／`startDate`／`expiredDate` 在 entry 層，`isOptional` 在 class 層。前端 `utils/practice-assignment-rows.js` 的 `buildAssignedClasses` 把所有 entry **按 `classSk` 合併成一班一列**（學生取聯集、日期取最新）；`assign-practice.js` 的 `collectPreviousDatesByClass` 則是逐班取日期。

### 要變成

HISTORY 是**一輪 × 一班一列**：

| 要什麼 | 現在 | 要變成 |
|---|---|---|
| 一輪一個 entry | 看起來是（每次 `assignPractice` 一筆） | **確認**：同一班再派一輪是**新 entry**，不覆蓋舊的；Edit（加減人、改日期）改的是**那一輪那一班**，不產生新 entry |
| 每班自帶日期與規則 | 日期在 entry 層 | `classes[]` 每班自帶 `startDate`／`expiredDate`／`isOptional`／`lateTiers`（一輪多班、*Set dates per class* 時每班不同） |
| 分得出哪一輪 | `assignedTime` | 留著當 key（`assignedTime + classSk`），列上不顯示 |
| Past due | — | 前端算：`now > expiredDate`（學校時區，用回傳的 `timezone`，跟 #968 的 `getDayDifference` 同一套）。**不加狀態欄位** |
| Unassign 之後 | `unassignPractice` 刪紀錄 | 那一輪那一班的 entry（或它的 `classes[]` 項目）**不再回來** |

```graphql
assignHistory {
  assignedTime
  classes {
    classSk
    className
    startDate            # ← 搬到班這一層（或兩層都回，前端以班為準）
    expiredDate
    isOptional
    lateTiers { days off time }   # ← 新增，§2
    students { userId studentName }
  }
}
```

前端：`buildAssignedClasses` 改成**不合併**——一個 `(entry, class)` 一列；`collectPreviousAssignments`（算誰已經被派、擋重複）只看 **In progress** 的輪（`expiredDate` 未過）。

> **要問（E1）**：同一班再派一輪，後端現在是新 entry 還是覆蓋？一輪多班、逐班日期不同時，日期回在哪一層？

---

## 2. 逾期規則欄位 `lateTiers`

### 現在

`upsertAssignment($assignmentSk, $classSk, $startDate, $expiredDate, $isOptional, $skipped)`；`AssignClassInput { classSk, userIds, startDate, expiredDate, isOptional }`。沒有任何逾期相關欄位。

### 要變成

```graphql
input LateTierInput {
  days: Int!      # ≥ 1，嚴格遞增。這一段從「Due 後第 days 天」起算：分界 = Due 日期 + (days − 1) 天
  off: Int!       # 0–100，嚴格遞增。扣幾 %；算幾成 = 100 − off；100 = 算 0 分
  time: String    # "HH:mm"，分界的時刻；省略 = Due 的時刻
}

# 寫
mutation upsertAssignment(…, $lateTiers: [LateTierInput!])     # 跟 isOptional 同層；null / [] = Full credit
input AssignClassInput { classSk userIds startDate expiredDate isOptional lateTiers: [LateTierInput!] }

# 讀
type LateTier { days: Int!  off: Int!  time: String }
assignHistory.classes[].lateTiers: [LateTier!]            # 老師端 History、Edit 的初始值
getStudentAssignments.assignments[].lateTiers: [LateTier!]   # 學生端清單（§4）
```

**語意**（前端已照這個畫，後端算分照同一套）：

- 第 k 段的分界 `B_k = (expiredDate 的日期 + (days_k − 1) 天) 的 time_k`，`time_k` 預設 ＝ `expiredDate` 的時刻。第一段 `days:1` → `B_1` ＝ Due 當下。
- 第 k 段涵蓋 `(B_k, B_{k+1}]`，最後一段到永遠。提交時刻 `T ≤ B_1`（＝ 沒逾期）→ 全額。
- 存的是相對天數：**Due 改了，分界自動平移**，不必重寫 `lateTiers`。
- 驗證：最多 3 筆；`days` 與 `off` 都嚴格遞增；`off ≤ 100`。
- **`isOptional: true` 時忽略**（前端不會送；後端收到也當 Full credit）。**沒有 `expiredDate` 時忽略**。
- 時區：分界用**學校時區**解讀（跟 `getAssignments` 回的 `timezone`、#968 的逾期判定同一套）。

> **要問（E2）**：放 assignment × class 可以嗎？`AssignClassInput` 一起帶，`assignPractice` 一次寫進每班？
> **要問（E4）**：`time` 用 `"HH:mm"` 字串、以學校時區解讀——跟 `startDate`／`expiredDate` 現在的 datetime-local 字串是同一種解讀嗎？

---

## 3. 逾期成績（AssignmentHistory）

### 現在

- 0–100 分：`getScorePercent(history)`（星星 × 20；MC 用 `mcResult.score`）。
- 提交：八種都有 *Submit to teacher*，寫 `isSubmitted`／`submittedDate`／`submittedScore`。
- 老師改分：`upsertAssignmentReview(review: { overrideScore })`，`getAssignmentStarRating` 裡 override 蓋過系統分（非 MC），成績頁顯示 *Adjusted* pill。

### 要變成

後端在**提交時**（寫 `isSubmitted` 那一刻）照 §2 的語意算出落在哪一段，寫到 history：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `lateCredit` | `Int` | 算幾成，0–100；`null` ＝ 沒逾期／沒規則（＝ 100）。存的是提交當下算出的值 |
| `lateSubmittedAt` | `String` | 用來算的那個時刻 ＝ `submittedDate`。之後 Due 改了要重算用；跟 `submittedDate` 同值的話可以不另存，但重算時要明確讀這個欄位 |

```graphql
# getAssignmentHistories / getStudentAssignmentAttempts / getTeacherAssignmentOverview.submissions 都多回
lateCredit
lateSubmittedAt
```

- 前端：`adjusted = Math.round(getScorePercent(history) × lateCredit / 100)`；Original 仍是 `getScorePercent`。
- **`overrideScore` 有值時就是最終分，不再乘 `lateCredit`**；`lateCredit` 仍照常寫入，只是顯示與計算時 override 優先。成績頁兩個標籤分開：系統扣的 *Late · ×90%*，老師改的 *Adjusted*。
- **Extend due date 之後**：Due 改了就用 `lateSubmittedAt` 對新的分界**重算 `lateCredit`**（後端在 `upsertAssignment` 改 `expiredDate` 時順便做，或讀的時候算）。
- 成績頁與 Dashboard 的畫面另開一版。

> **要問（E3）**：後端存還是前端算？前端算的話 `getAssignmentHistories` 要同時回 `expiredDate`（已有）跟 `lateTiers`（要加），Dashboard 的 `submissions` 也要帶，三個 query 都要改——不如存一個 `lateCredit`。

---

## 4. 學生端清單（`getStudentAssignments`）

### 現在

清單 query 回 `startDate`／`expiredDate`／`isOptional`／`isSubmitted`／`submittedDate`／`timezone`；`normalize-assignment.js` 轉成 `expiredDate`／`isOptional`／`isComplete`／`isSubmitted`。列上只有到期 chip（`formatDueChip`）。

### 要變成

```graphql
assignments {
  …
  lateTiers { days off time }   # ← 新增；Optional 或 Full credit 回 null
}
```

- 前端照 §2 的語意用 `now`（學校時區）算現在在哪一段：到期前 *Late work counts 90%*、過期 *Now counts 90%*／*No credit now*，第二行後面幾段 *80% from 20 Sept · 0% from 24 Sept*。
- `normalize-assignment.js` 帶 `lateTiers`；只有 `!isOptional && lateTiers?.length` 的列才畫。
- 單筆 query（進練習時）這一版不用。

---

## 5. 不變的

- `assignPractice`／`unassignPractice`／`upsertAssignment` 的既有參數與回傳；`skippedUsers`、`deletedCount` 照舊。
- `isOptional`（只差不寄提醒信）、`resolveOptionalDates`（Optional 沒填 Due 就 ＋ 30 天）。
- 學生端作答與提交流程：不擋、不鎖、不提示截止。
- `overrideScore`／`upsertAssignmentReview` 的寫法。

---

## 6. 待確認

| # | 題目 | 卡住哪一項 |
|---|---|---|
| E1 | `assignHistory` 同一班再派一輪是新 entry 還是覆蓋？一輪多班的日期在哪一層？ | §1 一輪一列 |
| E2 | `lateTiers` 放 assignment × class、`AssignClassInput` 一起帶？ | §2 |
| E3 | `lateCredit` 後端存（建議）還是前端算？ | §3 |
| E4 | `time` 的時區解讀、「第 n 天」是不是學校時區的日曆日 | §2、§3 |
