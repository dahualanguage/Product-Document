# 通知信設定（Notification settings）— API Contract

搭配 [`HANDOFF.md`](HANDOFF.md)。程式碼基準：`dahua-dash` `origin/develop` @ `9b19074a`（2026-10-27）。寄信的程式在 commerce-api（`src/email/brevo/templates/` 放模板；排程與 mutation 的 resolver 也在那邊），這份只看得到 dahua-dash 這一側呼叫的樣子，後端的欄位名與放的位置由後端定。

這一份是**草案**。每一節先寫「現在怎樣」，再寫「要變成怎樣」，最後是要問的。

---

## 核心概念

1. **設定存在 User 上**，一個 JSON，老師一段、學生一段。用現有的 `updateUser` 存，不開新 mutation。
2. **null 就是今天的行為**。沒存過設定的老師和學生，寄信的程式要當成預設值處理（四封開、兩個提醒關、學生總開關開）。
3. **寄之前查兩層**：寄給學生的信先看「那個作業的老師」的設定，再看學生的總開關。
4. **自動提醒是新的每日排程**，靠一張寄信紀錄表做 24 小時去重；老師手動按的 Remind 也寫進同一張表。
5. **模板不動**，只有模板 48 多一個 MESSAGE 參數。
6. **Mail Box 是一張 Notification 表**，寄 Teacher feedback 和兩種提醒的地方同時寫一筆；學生端讀列表、未讀數、標已讀。

---

## 1. 設定怎麼存（`updateUser`）

### 現在

`UpdateUserInput` 只有帳號欄位（名字、email、語言、角色……），沒有任何偏好。Account 選單的 Profile 進 `users/edit/:id`，表單送 `updateUser`。

### 要變成

```graphql
# UpdateUserInput 多一個欄位
notificationPreferences: NotificationPreferencesInput

input NotificationPreferencesInput {
  teacher: TeacherNotificationPreferencesInput
  student: StudentNotificationPreferencesInput
}

input TeacherNotificationPreferencesInput {
  dailySummary:          { enabled: Boolean, sendAt: String, onlyWhenMissing: Boolean, format: DailySummaryFormat }
  questionBankReady:     { enabled: Boolean }
  newAssignment:         { enabled: Boolean }
  teacherFeedback:       { enabled: Boolean }
  assignmentReminders:   { enabled: Boolean, schedule: [ReminderRuleInput!], message: String }
  wordGameGoalReminders: { enabled: Boolean, schedule: [ReminderRuleInput!], message: String }
}

input ReminderRuleInput { days: Int!  anchor: ReminderAnchor! }   # days 0–30
enum ReminderAnchor { BEFORE_DUE  AFTER_DUE }                      # Word Game 的「due」就是 end date，同一個 enum
enum DailySummaryFormat { PER_ASSIGNMENT  COMBINED }

input StudentNotificationPreferencesInput { emails: Boolean }
```

存在 User 上的樣子（讀回來給設定頁用，`me` 或現有的 user query 多回這個欄位）：

```json
{
  "teacher": {
    "dailySummary":          { "enabled": true,  "sendAt": "07:30", "onlyWhenMissing": false, "format": "PER_ASSIGNMENT" },
    "questionBankReady":     { "enabled": true },
    "newAssignment":         { "enabled": true },
    "teacherFeedback":       { "enabled": true },
    "assignmentReminders":   { "enabled": false, "schedule": [ { "days": 2, "anchor": "BEFORE_DUE" }, { "days": 1, "anchor": "AFTER_DUE" } ], "message": "You have not submitted this assignment yet. Please finish and submit it when you can." },
    "wordGameGoalReminders": { "enabled": false, "schedule": [ { "days": 3, "anchor": "BEFORE_DUE" } ], "message": "You have not reached this Word Game goal yet. Jump back in when you can — keep it up!" }
  },
  "student": { "emails": true }
}
```

- 上面這份就是**預設值**。User 上是 null、或少了哪個鍵，寄信的程式都照這份補。
- 前端一張卡一顆 Save，只送那張卡的那一段（`teacher` 裡的兩個子集，或 `student`）；後端合併，不要整包蓋掉。
- `sendAt` 存 `HH:mm`，解讀用學校時區（B1）。
- `message` 上限 1000 字，空字串＝用預設句。
- `schedule` 沒有列數上限；前端擋至少一列。
- 只有老師（CLASS_TEACHER）會有 `teacher` 段；只有學生會有 `student` 段。管理員替別人編帳號時前端不送這個欄位。

> **要問（B1）**：School／Program 有沒有時區欄位？

---

## 2. 老師的 Daily summary（模板 17）

### 現在

每天固定時間排程，對每個老師、每個今天到期的作業寄一封，列誰交了誰沒交。老師關不掉、改不了時間。

### 要變成

排程跑的時候，對每個老師讀 `teacher.dailySummary`：

| 設定 | 行為 |
|---|---|
| `enabled: false` | 這個老師一封都不寄 |
| `sendAt` | 到了這個時間（學校時區）才寄。排程改成每小時或更密地跑，挑 `sendAt` 落在這一輪的老師 |
| `onlyWhenMissing: true` | 那個作業沒有人沒交，就不寄那一封 |
| `format: COMBINED` | 今天到期的所有作業合併成一封；`PER_ASSIGNMENT` 維持現在一個作業一封 |

- `COMBINED` 需要模板 17 能放多個作業的區塊，或另開一個模板。哪一種由後端定；信的名字在畫面上都叫 Daily summary。

> **要問（B3）**：排程現在固定幾點？那就是 `sendAt` 的預設值，前端要寫在畫面上。

---

## 3. New assignment（模板 14）、Teacher feedback（模板 15）

### 現在

`assignPractice`／`upsertAssignment` 一派就寄 14（延後開始的在開始日寄）；留回饋的 mutation 一存就寄 15。沒有任何開關。

### 要變成

寄之前查兩層，兩層都過才寄：

1. 那個作業的老師 `teacher.newAssignment.enabled`（或 `teacher.teacherFeedback.enabled`）。
2. 收信的學生 `student.emails`。

- mutation 的簽名不變，前端不多傳參數。
- 老師關了 New assignment，延後開始的作業到開始日也不寄。
- （第三期）寄 Teacher feedback 的同時寫一筆 Notification（第 6 節），不管 email 有沒有寄出去。

---

## 4. 自動提醒：Assignment reminders（模板 48）、Word Game goal reminders（模板 49）

### 現在

沒有自動提醒。老師手動按 Remind：

- 作業：`sendStudentAssignmentReminder`（Teacher Dashboard 對未交的學生逐一呼叫；Students 頁一次一人）。模板 48 沒有留言段。
- Word Game：`sendWordGame2AssignmentReminder`，帶 `message`（上限 1000 字，預設 `remindMessage()`）。模板 49 有「A Note From Your Teacher」段。
- 後端刻意不去重：按兩次寄兩封。前端只有 3 秒 cooldown。

### 要變成

**新的每日排程**（一天一次就夠，時間用學校時區的早上）：

```
對每個 teacher.assignmentReminders.enabled 的老師
  對這個老師派出去、還沒過期太久的每個作業
    對每個還沒交的學生
      對 schedule 的每一列：今天 == dueDate − days（BEFORE_DUE）或 dueDate + days（AFTER_DUE）？
        是 → 準備寄一封
      去重：這個學生這個作業今天只寄一封；24 小時內 ReminderLog 已有一筆就不寄
      學生的 student.emails 關著 → 不寄 email（第三期仍寫 Notification）
      寄模板 48，MESSAGE = teacher.assignmentReminders.message（空就用預設句）
      寫 ReminderLog
```

Word Game 同一套：`teacher.wordGameGoalReminders`、日期用 Word Game assignment 的 end date、模板 49、`sendWordGame2AssignmentReminder` 同樣的 message。

**ReminderLog（新的表）**

```
ReminderLog { id, studentId, assignmentId（或 wordGameAssignmentId）, kind: ASSIGNMENT | WORD_GAME, source: AUTO | MANUAL, teacherId, sentAt }
```

- 自動排程寫 `AUTO`；兩個手動 Remind 的 mutation 寫 `MANUAL`。
- 24 小時上限查這張表：同一 student ＋同一 assignment，`sentAt` 在 24 小時內有任何一筆（不分 AUTO／MANUAL）就不寄，mutation 回一個「剛剛已經提醒過」的訊息給前端顯示。
- Optional 作業不進自動排程（B4 確認範圍）。
- 已繳交的學生不在「還沒交」的名單裡，自然就停。

**模板 48 要改**：照模板 49 加「A Note From Your Teacher」一段和 `MESSAGE` 參數；`sendStudentAssignmentReminder` 多一個 `message` 參數（可選，沒帶就用老師設定裡的，再沒有就用預設句）。手動 Remind 的確認框要不要讓老師改這段文字，是另一版的事，這一包不動。

> **要問（B2）**：24 小時上限會改掉「按兩次寄兩封」的刻意行為，可以嗎？
> **要問（B4）**：Optional 作業的「不寄提醒信」涵蓋哪幾封？
> **要問（B6）**：模板 48 加段、mutation 加 `message`，照 49 的做法可以嗎？

---

## 5. 學生的 Daily summary（模板 59）

### 現在

每天早上排程，一個學生一封，合併所有老師的作業（今天開始的、明天到期的）。沒有任何開關。

### 要變成

排程寄之前讀學生的 `student.emails`，關著就跳過這個學生。老師那邊沒有任何設定會影響這封信。

> **要問（B5）**：這個排程現在有沒有讀任何條件？確認真的沒有人能關。

---

## 6. Mail Box（Notification）

### 現在

沒有站內通知，沒有這張表。

### 要變成

**一張表**

```
Notification {
  id
  studentId
  type:        FEEDBACK | REMINDER | ANNOUNCEMENT
  fromKind:    TEACHER | DAHUA
  fromUserId   # TEACHER 時是老師的 id；前端用它顯示寄件人名字
  assignmentId            # FEEDBACK、REMINDER（作業）
  wordGameAssignmentId    # REMINDER（Word Game）
  classId                 # 顯示班級名
  body         # FEEDBACK：老師的回饋文字；REMINDER：老師的 Message（當次送的那段）；ANNOUNCEMENT：公告全文
  readAt       # null ＝ 未讀
  createdAt
}
```

- 標題、預覽、按鈕要去哪，前端照 type 和關聯的作業自己組（HANDOFF 第 4 節的表），不存文字。
- **寫入時機**（跟寄 email 同一個地方，不管 email 有沒有寄）：
  - 留回饋的 mutation 存成功 → 一筆 FEEDBACK（老師的 Teacher feedback 開關關著就不寫，因為根本沒有「通知」這件事發生）。
  - 自動提醒排程寄一封 → 一筆 REMINDER；`sendStudentAssignmentReminder`／`sendWordGame2AssignmentReminder` 手動寄一封 → 一筆 REMINDER。24 小時去重擋掉的不寫。
  - ANNOUNCEMENT 的來源待 PM 定；表先留這一型。
- 學生的 `student.emails` 只管 email，不影響寫 Notification。

**三個 API**

```graphql
# 列表（新的在前）；type 不給＝全部
myNotifications(type: NotificationType, limit: Int = 50, before: DateTime): [Notification!]!

# 未讀數：側欄徽章 ＋ 四顆 chip 的數字（一次回四個，免得打四次）
myNotificationCounts: { all: Int!, feedback: Int!, reminder: Int!, announcement: Int! }

# 標已讀（點開那一則時打）
markNotificationRead(id: ID!): Notification!
```

- `limit`／`before` 先放著，第一版前端不做載入更多。
- 徽章的數字在學生端 layout 載入時打一次 `myNotificationCounts`，標已讀之後前端自己減一，不重打。
- 關聯的作業被刪了：Notification 留著，按鈕灰掉（前端查不到作業就灰）。

---

## 7. 不變的

- 手動 Remind 的兩個 mutation 名稱與呼叫方式（只多寫一筆 ReminderLog、48 多一個可選的 `message`）。
- 派作業與留回饋的 mutation 簽名。
- 模板 14、15、17（PER_ASSIGNMENT 時）、22、49、59 的內容。
- 管理員編別人帳號的 `updateUser` 呼叫（不帶 `notificationPreferences`）。
- History、作業頁、Word Game 頁本身不動，Mail Box 只是跳過去。

---

## 8. 待確認

| # | 題目 | 卡住哪一節 |
|---|---|---|
| B1 | School／Program 的時區欄位 | §1 `sendAt`、§4 的「今天」 |
| B2 | 24 小時上限改掉手動不去重的行為 | §4 |
| B3 | 模板 17 排程現在幾點 | §2 預設值 |
| B4 | Optional 作業不寄提醒信的範圍 | §4 |
| B5 | 模板 59 排程有沒有讀任何條件 | §5 |
| B6 | 模板 48 加 MESSAGE 段、mutation 加 `message` | §4 |
