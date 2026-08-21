# Skip Review — API Contract

搭配 [`HANDOFF.md`](HANDOFF.md)。程式碼基準：`dahua-dash` `origin/develop` @ `1cca25a6`。

---

## 核心概念

被 skip 的單位是**一筆提交**，也就是既有的 **assignment history**（`assignmentHistorySk`）。

這一點很重要：學生端的每一次 attempt 用的就是同一個 sk（`getStudentAssignmentAttempts` 回傳的 `attempts[].sk`）。所以**在 assignment history 上加一個布林，兩端就都讀得到**，不需要各自維護狀態。

> 跟左欄的 `upsertAssignment({ skipped })` 是**不同層級**：那個 skip 的是 assignment × class（不再催沒交的人），這個 skip 的是單一學生的單次提交（交了但不批改）。刻意同名同義，但不要共用欄位。

---

## 1. Schema 增加的欄位

`AssignmentHistory` 加兩個欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `skipped` | `Boolean` | 老師決定不批改這一筆。預設 `false` |
| `skippedAt` | `String` | Unix timestamp（秒），跟既有時間欄位一致 |

**與 `reviewed` 的關係**：兩者獨立，但 UI 上 `skipped: true` 一律連同 `reviewed: true` 一起寫——skip 掉的要落在 Reviewed 分頁裡。反過來，老師事後補批時把 `skipped` 清回 `false`（`reviewed` 維持 `true`）。

> 不要用「`reviewed: true` 且 `teacherComment` 為空」來代表 skipped。那樣分不出「跳過」跟「批了但沒留言」，灰章綠章就做不出來。

---

## 2. Query 要多回傳的欄位

### `getTeacherAssignmentOverview`（老師端）

`submissions` 區塊加 `skipped`：

```graphql
submissions {
  assignmentHistorySk
  assignmentSk
  userId
  studentName
  classSk
  className
  practiceName
  practiceType
  submittedAt
  reviewed
  skipped        # ← 新增
}
```

檔案：`src/api/graphql/queries/getTeacherAssignmentOverview.js`

### `getStudentAssignmentAttempts`（學生端）

`attempts` 區塊加 `skipped`（放在既有的 `teacherComment` / `aiFeedbackForStudent` 旁邊）：

```graphql
attempts {
  sk
  attempt
  # …
  teacherComment
  aiFeedbackForStudent
  skipped        # ← 新增
}
```

檔案：`src/api/graphql/queries/getStudentAssignmentAttempts.js`

---

## 3. 新增 Mutation：`skipAssignmentReview`

**必須支援批次**——UI 是多選，老師一次可能跳過十幾筆，不能打十幾個 request。

```graphql
mutation skipAssignmentReview(
  $programId: String!
  $items: [SkipAssignmentReviewInput!]!
  $skipped: Boolean!
) {
  skipAssignmentReview(programId: $programId, items: $items, skipped: $skipped) {
    error
    message
    requestId
    updated {
      assignmentHistorySk
      skipped
      skippedAt
    }
  }
}

input SkipAssignmentReviewInput {
  assignmentSk: String!
  userId: String!
  assignmentHistorySk: String!
}
```

參數對齊既有的 `upsertAssignmentReview`（同樣是 `assignmentSk` + `userId` + `assignmentHistorySk` 三件組），前端已經有這三個值。

`skipped: false` 用來取消——不過目前 UI 沒有這條路（老師改變心意是走「補批」，見下），保留它是為了將來要做 undo 時不必改契約。

新檔：`src/api/graphql/mutations/skipAssignmentReview.js`，寫法照 `upsertAssignmentReview.js`。

### 部分失敗

`updated` 只回實際寫成功的。前端據此更新 local state，數量對不上就用 warning toast 交代（比照 `handleRemindConfirm` 現有的 `succeeded / failed` 寫法）。

---

## 4. 既有 Mutation 要順帶處理的

`upsertAssignmentReview`（老師真的批改並送出）成功時，**一併把該筆的 `skipped` 清成 `false`**。

這就是這一版的復原路徑：skip 掉的提交還在 Reviewed 分頁看得到，老師打開來寫一段留言送出，它就變回真正批改過的（灰章變綠章）。**因為有這條路，這一版不做 undo。**

前端可以在送出時明確帶 `skipped: false`，或由後端在寫入 review 時自動清掉——後者比較不會漏，建議走後者。

---

## 5. 前端已知的行為（後端可據此驗收）

- To Review 分頁 = `!reviewed && !NO_REVIEW_TYPES.has(practiceType)`
- Reviewed 分頁 = `reviewed`（**包含 `skipped` 的**，計數也含）
- Skip review 抽屜的候選清單 = `!reviewed`，所以 skip 過的**不會再出現**在裡面
- `NO_REVIEW_TYPES` = `MULTIPLE_CHOICE` / `SENTENCE_SCRAMBLE` / `WORD_GAME`（機器自動判分，根本不進收件匣，也不該被 skip）

---

## 6. 待確認

一份作業被 `upsertAssignment({ skipped: true })` 之後，它**已經交上來的 submissions** 會不會從 `getTeacherAssignmentOverview` 消失？

前端這一側確定不會（`handleSkipConfirm` 只 filter `assignments`，沒動 `submissions`）。如果後端會一起濾掉，這一版要處理的量會少一塊。