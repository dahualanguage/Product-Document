# 通知信設定（Notification settings）— Engineer Handoff

> **先看這個：[DAHUA AI Email Templates](https://claude.ai/code/artifact/dce51479-50bc-47b7-9309-4eedd21ff9d7)**
> 九封通知信現在長什麼樣、什麼時候寄、帶哪些參數，全部整理在這一份（來源是 commerce-api `src/email/brevo/templates/`，用 README 的測試參數渲染）。這一包所有的「模板 14、15、17、22、48、49、59」都是指它裡面的那幾封；設定頁的 Preview 放的也是它渲染出來的信（`emails/` 那七個檔）。讀下面之前先把它開著對照。

DAHUA AI 會寄九種通知信，現在全部由系統固定觸發，沒有人能設定。這一包做三件事：

1. **老師的 Settings 頁**：老師決定「我收哪些信」「我的學生收哪些信」，並且可以設自動提醒（到期前幾天、逾期後幾天各寄一封，附一段留言）。預設值等於今天的行為，老師不動設定，一切照舊。
2. **學生的 Settings 頁**：學生一個總開關，決定要不要收 DAHUA 寄來的 email。
3. **寄信規則**：每封信寄之前先看老師的設定，再看學生的總開關。

**有後端**：設定要存在 User 上、兩個每日排程要讀設定、自動提醒是新的排程、要有一張寄信紀錄表做 24 小時去重、Assignment reminder 那封信要多一段老師留言。契約在 [`API-CONTRACT.md`](API-CONTRACT.md)。

程式碼基準：`dahua-dash` `origin/develop` @ `9b19074a`（2026-10-27）。這一天的程式：Account 選單只有 Home／Profile；`updateUser` 的 input 沒有任何偏好欄位；整個 repo 沒有 `notificationPreferences`。也就是從零開始，不是改既有的設定頁。

---

## 名詞對照

| 文件裡的詞 | 意思 |
|---|---|
| 模板編號（14、15、17、22、48、49、59） | Brevo（寄信服務）的信件模板編號，在 commerce-api `src/email/brevo/templates/`。畫面上一律不出現編號，只出現下面的名字 |
| **Daily summary（老師收的）** | 模板 17。每天早上寄給老師，列今天到期的作業誰交了誰沒交 |
| **Question bank ready** | 模板 22。AI 題庫生成完成時寄給老師 |
| **New assignment** | 模板 14。老師派作業時寄給學生（延後開始的作業在開始日寄） |
| **Teacher feedback** | 模板 15。老師留回饋時寄給學生 |
| **Assignment reminders** | 模板 48。老師按 Remind 時寄給學生的催交信 |
| **Word Game goal reminders** | 模板 49。老師在 Word Game 頁按 Remind 時寄給學生 |
| **Daily summary（學生收的）** | 模板 59。每天早上寄給學生，合併所有老師的作業 |
| Welcome（12／13） | 建帳號時的歡迎信。不出現在任何設定頁 |
| **Reminders 清單** | 老師設自動提醒的那個小表。一列就是一封信：「幾天」＋「到期日之前／之後」 |
| **Message** | 老師寫給學生的一段話，進提醒信裡的「A Note From Your Teacher」那段 |
| **end date** | Word Game 目標的結束日。產品用詞，不叫 goal date |
| **due date** | 作業的到期日 |
| **總開關** | 學生 Settings 頁唯一的開關，管 DAHUA 寄給這個學生的所有 email |
| **Mail Box** | 學生端側欄的站內通知收件匣。產品還沒有，是第三期的事，規格在 [student-redesign 那一包](../student-redesign/) |
| **編自己** | 老師從 Account 選單進 users/edit 編自己的帳號。管理員也會用同一頁編別人，那時候不叫「編自己」 |

---

## 這一包有什麼

| 檔案 | 是什麼 | 網址參數 |
|---|---|---|
| [`teacher-settings.html`](teacher-settings.html) | 老師的 Settings 頁原型 | `?open=48,49` 把兩個提醒的開關打開看規則小表 · `?preview=17` 直接開那封信的 Preview · `?changed=1` Save 變成可按 · `?saved=1` 存成功的 snackbar · `?menu=1` 右上 Account 選單 |
| [`student-settings.html`](student-settings.html) | 學生的 Settings 頁原型（學生端 UI） | `?off=1` 總開關關著 · `?changed=1` · `?saved=1` |
| [`student-mailbox.html`](student-mailbox.html) | 學生的 Mail Box 原型（第三期，參考） | `?open=1` 第一則展開 · `?type=reminder` · `?empty=1` |
| `emails/` | 七封信渲染好的樣子，給 Preview 對話框的 iframe 用 | — |
| [`API-CONTRACT.md`](API-CONTRACT.md) | 資料形狀、排程、mutation 要改什麼 | — |

對照組（現行畫面的複刻）：[老師的 Profile 頁](https://project-logeg.vercel.app/specs/chinese-modules/iterations/v10-teacher-email-settings/profile.html?menu=1)。PM 版的完整說明（為什麼做、使用情境、走一遍）：[Spec](https://project-logeg.vercel.app/specs/chinese-modules/iterations/v10-teacher-email-settings/spec.html)。九封信的基準：最上面的 Email Templates。

原型是自包含的 HTML（vanilla JS，沒有 build）。工程師用 Next.js 14／React 18／MUI v5／Apollo 在 `dahua-dash` 重寫，不是搬 HTML。行為、狀態、預設值以原型為準。

---

## 已定的規則

| 題目 | 定案 |
|---|---|
| 設定頁在哪 | 老師：Account 選單那一項，從 **Profile 改名 Settings**，頁面標題 Edit User 改 Settings。同一頁，不另開 route。學生：學生端右上頭像 → Settings，新頁 |
| 誰看得到信的設定 | 只有「編自己」時。管理員替別人編帳號時頁面維持原本的 Edit User，沒有信的設定 |
| 老師頁的結構 | 三張卡，各自一顆 Save：**Profile**（現有欄位）、**Emails you receive**、**Emails your students receive** |
| 每列長什麼樣 | 只有信的名字、一個 Preview 連結、右邊一個開關。沒有說明文字、沒有模板編號 |
| 開關 | 全部是 Switch。沒有「每次都問」這種選項 |
| 規則小表 | 開關開著時，列的底下出現灰底小表放規則；關掉整塊收起 |
| 預設值 | 等於今天的行為：四個今天會寄的信預設開；兩個自動提醒預設關（今天沒有自動提醒） |
| 老師 Daily summary 的規則 | Time（寄送時間）／Send 勾選「Only when someone hasn't submitted」（預設不勾＝天天寄）／Format（每個作業一封｜合併一封，預設每個作業一封） |
| 自動提醒怎麼設 | **Reminders 清單**：一列一封，[n] days [before／after the due date]。Add reminder 想加幾列就幾列，只剩一列時不能刪。加一段 Message（上限 1000 字） |
| 一列是幾封 | 一封。「2 days before the due date」是到期前 2 天那天寄一封，不是從那天起每天寄 |
| Assignment reminders 預設 | 關。開了之後清單預設兩列：2 days before、1 day after。Message 預設句見第 1 節 |
| Word Game goal reminders 預設 | 關。開了之後清單預設一列：3 days before the end date。Message 預設照產品現有的提醒文案 |
| 自動提醒的上限 | 學生交了就停；兩列落在同一天只寄一封；同一個學生同一個作業 24 小時內最多一封（老師手動按的也算進去） |
| 學生的 Daily summary | 老師不能關，老師的 Settings 頁**不列**。歸學生的總開關管 |
| 學生的設定 | 一個總開關 **Emails from DAHUA AI**，不分信的種類。關掉＝ DAHUA 寄給這個學生的 email 一封都不寄 |
| 學生的總開關是最後一關 | 寄給學生的每一封都先看它。老師開、學生關 → 不寄。老師關 → 什麼都沒有 |
| Preview | 點每列的 Preview 開對話框，裡面放那封信渲染好的樣子。固定顯示預設版，不跟設定連動 |
| 信的文案 | Brevo 模板不動。唯一例外：模板 48（Assignment reminders）要照模板 49 加「A Note From Your Teacher」一段放老師的 Message |
| 信的名字 | 設定頁、Preview 對話框標題、之後的 Mail Box 三處一致，用上面名詞對照的名字 |
| 不在這一包 | Teacher Dashboard 的 Send reminder 按鈕不動；派作業對話框不加勾選；班級層級覆寫、學校預設不做 |

---

## 1 · 老師的 Settings 頁

```
Account 選單：Home ／ Settings ／（Dahua admin 才有）Payment and Billings

Settings
┌ Profile ─────────────────────────────────────────────────┐
│ （現有 Edit User 的欄位，原樣）                 [Save changes] │
└───────────────────────────────────────────────────────────┘
EMAILS YOU RECEIVE
┌───────────────────────────────────────────────────────────┐
│ Daily summary  👁 Preview                            (●  ) │
│   ┌ Time    [07:30 ⏰]                                    ┐ │
│   │ Send    ☐ Only when someone hasn't submitted          │ │
│   └ Format  [One email per assignment ▾]                  ┘ │
│ Question bank ready  👁 Preview                      (●  ) │
│                                                     [Save] │
└───────────────────────────────────────────────────────────┘
EMAILS YOUR STUDENTS RECEIVE
┌───────────────────────────────────────────────────────────┐
│ New assignment  👁 Preview                           (●  ) │
│ Teacher feedback  👁 Preview                         (●  ) │
│ Assignment reminders  👁 Preview                     (  ○) │
│ Word Game goal reminders  👁 Preview                 (  ○) │
│                                                     [Save] │
└───────────────────────────────────────────────────────────┘
```

**現在怎樣**：Account 選單那一項叫 Profile，點進去是 users/edit 的 Edit User 表單，只有一張卡。沒有任何信的設定。

**改成怎樣**：

- 選單文字 Profile → **Settings**。編自己時頁面標題 Edit User → **Settings**，breadcrumb 那一列拿掉；管理員編別人時標題、breadcrumb 都不動。
- 第一張卡加標題 **Profile**，欄位和 Save changes 原樣。
- 下面多兩段，每段一個眉標（Emails you receive／Emails your students receive）＋一張白底卡。卡裡一列一封信：左邊信的名字＋灰色小字 Preview（眼睛圖示），右邊一個 Switch。兩段的卡各自一顆 **Save**，沒改過是灰的，存成功 snackbar「Settings saved」。
- Switch 開著且那封信有規則時，列的底下出現灰底小表（標籤在左、控制項在右）；關掉整塊收起。

**每一列**

| 列 | 預設 | 開著時的規則小表 |
|---|---|---|
| Daily summary（老師收的） | 開 | **Time**：時間欄，原型寫 07:30，真正的預設值要用今天排程的時間（問後端 B3）。**Send**：一個勾選「Only when someone hasn't submitted」，預設不勾。**Format**：下拉 One email per assignment｜One email for all assignments，預設前者 |
| Question bank ready | 開 | 沒有 |
| New assignment | 開 | 沒有。延後開始的作業照舊在開始日寄 |
| Teacher feedback | 開 | 沒有 |
| Assignment reminders | **關** | **Reminders** 清單＋ **Message**，見下面 |
| Word Game goal reminders | **關** | **Reminders** 清單＋ **Message**，見下面 |

**Reminders 清單（兩個提醒共用同一個元件）**

```
Reminders   [2] days [before the due date ▾]  ×
            [1] day  [after the due date  ▾]  ×
            + Add reminder
Message     ┌──────────────────────────────────────────────┐
            │ You have not submitted this assignment yet.  │
            │ Please finish and submit it when you can.    │
            └──────────────────────────────────────────────┘
```

- 一列＝一封：數字欄（0–30）＋「day／days」跟著數字變＋下拉（before the due date｜after the due date）＋右邊 × 移除。
- **Add reminder** 加一列，沒有列數上限。只剩一列時 × 藏起來。
- Word Game 那一個下拉的字是 before the end date｜after the end date。
- **Message**：多行文字欄，上限 1000 字。預設句：
  - Assignment reminders：`You have not submitted this assignment yet. Please finish and submit it when you can.`
  - Word Game goal reminders：`You have not reached this Word Game goal yet. Jump back in when you can — keep it up!`（照產品 `remindMessage()` 現有的口吻）
- 規則小表裡沒有任何解釋句。24 小時上限、同一天只寄一封這些是後端規則，不寫在畫面上。

**Preview 對話框**：MUI Dialog，寬 720，標題＝信的名字、副標「Subject: …」、右上 X，內容一個 iframe 放那封信渲染好的樣子（`emails/<模板編號>-….html` 那七個檔就是）。固定預設版，不跟老師改的設定連動。

**改哪裡（dahua-dash）**

| 要改什麼 | 檔案 |
|---|---|
| 選單文字 Profile → Settings | `src/layouts/common/account-popover.js` |
| 頁面標題、breadcrumb 只在編自己時換掉 | `src/sections/users/view/user-create-and-edit-view.js`（判斷條件：路由的 id ＝ 登入者的 id） |
| 兩段信的設定，掛在 Edit User 表單下面 | `src/sections/users/user-new-edit-form.js` 旁邊新開元件，不塞進現有表單（Save 分開、mutation 的 input 不同段） |
| 存設定 | `src/api/graphql/mutations/updateUser.js` 的 input 多一個欄位（契約第 1 節） |
| 元件尺寸 | 照產品現有的 MUI 設定：Switch 58×38、TextField small 高 40、Checkbox padding 8、Button contained 的 disabled 色 |

**卡住的**：Time 的預設值（B3）、School 有沒有時區欄位（B1）。

---

## 2 · 學生的 Settings 頁

```
（學生端的殼：左側欄 Home／Leaderboard／Assignment List／History／Word Game／Mail Box，右上頭像）

Settings
PROFILE
┌ First name [Amy]   Last name [Chen]                          ┐
│ Email（唯讀） School（唯讀） User ID（唯讀）                   │
│ Native language [English]  Target language [Chinese (Simplified)] │
│                                        [Cancel] [Save changes] │
└───────────────────────────────────────────────────────────────┘
EMAILS YOU RECEIVE
┌ ✉  Emails from DAHUA AI                                 (●  ) ┐
│    Daily summary, new assignments, teacher feedback and reminders │
│                                                        [Save] │
└───────────────────────────────────────────────────────────────┘
```

**現在怎樣**：學生端沒有 Settings 頁，學生改不了任何東西。

**改成怎樣**：

- 學生端右上頭像 → **Settings**，新頁，用學生端的殼與元件（跟 `/student/practice` 同一套：側欄、Fredoka／Nunito 字型、圓角卡）。
- **Profile** 一張卡：First／Last name、Email／School／User ID（唯讀）、Native／Target language、Class（唯讀）＋ Cancel／Save changes。欄位照 `user-new-edit-form.js` 學生會有的那幾個。
- **Emails you receive** 一張卡，只有一列：信封圖塊、標題 **Emails from DAHUA AI**、底下一行灰字 `Daily summary, new assignments, teacher feedback and reminders`、右邊一個開關。預設開。底下一顆 Save。
- 沒有 Preview。關掉＝ DAHUA 寄給這個學生的所有 email 都不寄（Daily summary、New assignment、Teacher feedback、兩種提醒、之後若有的 Announcements）。站內 Mail Box 不受影響。

**改哪裡（dahua-dash）**

| 要改什麼 | 檔案 |
|---|---|
| 新 route | `src/app/student/settings/page.js`（照 `src/app/student/` 其他頁的寫法） |
| 頁面 | `src/sections/student/settings/`，殼沿用學生端 layout |
| 右上頭像選單加 Settings | 學生端 layout 的頭像選單 |
| 存設定 | 同一個 `updateUser`，input 的 student 那一段（契約第 1 節） |

**卡住的**：沒有。

---

## 3 · 寄信規則

| 規則 | 內容 |
|---|---|
| 誰的設定管哪封 | 寄給學生的信（New assignment、Teacher feedback、兩種提醒）看「那個作業的老師」的設定。寄給老師的信（老師的 Daily summary、Question bank ready）看老師自己的設定。學生的 Daily summary 只看學生的總開關 |
| 學生的總開關是最後一關 | 寄給學生的每一封，老師那邊過了之後，再看學生的總開關 |
| 自動提醒什麼時候寄 | 每天跑一次：對每個開了提醒的老師、每個作業、每個還沒交的學生，看 Reminders 清單有沒有一列落在今天 |
| 自動提醒的上限 | 學生交了就停。兩列落在同一天只寄一封。同一個學生同一個作業 24 小時內最多一封，**老師手動按 Remind 的也算進去** |
| Optional 作業 | 派作業時選 Optional 的，現在就不寄提醒信。原則上 Optional 作業不進自動提醒。涵蓋哪幾封要後端確認（B4） |
| 時區 | Daily summary 的 Time 和「n 天前」都用學校時區（B1） |
| 預設值 | User 上沒有設定（null）＝今天的行為，排程和寄信的程式要把 null 當預設 |

---

## 4 · 學生的 Mail Box（第三期，這一包只放原型當參考）

側欄新項目，帶未讀數。三型：Feedback（對應 Teacher feedback）、Reminder（對應兩種提醒，內容就是老師設的 Message）、Announcement（還沒有信）。點開一則＝讀過，徽章減一；每則一顆按鈕跳去原本的地方（Open in History／Go to assignment／Play Word Game）。Daily summary 不進 Mail Box。

版面照 [student-redesign 那一包](../student-redesign/student-redesign.html#mail)。資料形狀在契約第 6 節。做第一、二期時不用動它，只要記得：**寄 Teacher feedback 和兩種提醒的時候要同時寫一筆 Notification**，第三期才有東西可以顯示。

---

## 不要順手改的

- Brevo 模板的文案與版型不動（只有模板 48 加一段 Message）。
- Teacher Dashboard、Students 頁、Word Game 頁的手動 Remind 按鈕和確認框都不動。它們呼叫的兩個 mutation 不改簽名（契約第 4 節只要它們多寫一筆紀錄）。
- 派作業對話框不加「要不要寄信」的勾選。Mandatory／Optional 那個選項照舊。
- 管理員編別人帳號的 Edit User 頁一個字都不變。
- 老師的 Settings 頁不列學生的 Daily summary。

---

## 動工順序

| 階段 | 內容 | 可否獨立上線 |
|---|---|---|
| **1** | 老師 Settings 頁：改名、三張卡、四個開關（Daily summary 的 Time／Send／Format、Question bank ready、New assignment、Teacher feedback）、Preview 對話框。學生 Settings 頁：Profile ＋ 總開關。後端：`notificationPreferences` 存取（契約第 1 節）、老師 Daily summary 排程讀設定（第 2 節）、New assignment／Teacher feedback 寄前讀開關（第 3 節）、學生 Daily summary 排程讀總開關（第 5 節） | 可。老師可以關信、改彙整時間；學生可以關 email |
| **2** | 自動提醒：兩個提醒的開關＋ Reminders 清單＋ Message；後端新排程、寄信紀錄表、24 小時上限、模板 48 加 Message 段、手動 Remind 寫紀錄（第 4 節） | 可。階段 1 的頁面上先不顯示這兩列也行 |
| **3** | Mail Box：Notification 資料、側欄項目與徽章、三型列表（第 6 節） | 可 |
| 之後 | 班級層級覆寫、學校層級預設、Remind 按鈕旁的「Reminded n ago」 | — |

階段 2 沒好之前，老師頁不要出現 Assignment reminders、Word Game goal reminders 兩列，免得老師開了沒反應。

---

## 要問後端的

| # | 題目 | 卡住哪一項 |
|---|---|---|
| B1 | School／Program 有沒有時區欄位？沒有的話 Daily summary 的 Time 和「n 天前」用什麼時區算？ | 老師 Daily summary 的 Time、自動提醒 |
| B2 | 手動 Remind 現在刻意不去重（按兩次寄兩封，程式註解寫明是故意的）。24 小時上限會改掉這個行為，可以嗎？可以的話紀錄表要在後端，前端那 3 秒 cooldown 不算 | 第 3 節的上限、契約第 4 節 |
| B3 | 老師的 Daily summary（模板 17）排程現在固定幾點寄？那個時間就是 Time 的預設值 | 老師頁 Time 欄的預設 |
| B4 | 派作業選 Optional 的「不寄提醒信」涵蓋哪幾封？New assignment 寄不寄、兩封 Daily summary 列不列、手動 Remind 按得到嗎？ | 第 3 節 Optional 那條 |
| B5 | 學生 Daily summary（模板 59）的排程現在有沒有讀任何開關或條件？ | 確認現況真的沒人能關 |
| B6 | 模板 48 加「A Note From Your Teacher」段與 MESSAGE 參數，照模板 49 的做法可以嗎？`sendStudentAssignmentReminder` 要多傳 message | 契約第 4 節 |

**查程式碼就能答、不用問的**

- 手動 Remind 在哪：Teacher Dashboard `src/sections/teacher/dashboard/{index,active-assignments-panel}.js` → `src/sections/teacher/shared/reminder-popup.js` 確認框 → 對每個學生呼叫 `sendStudentAssignmentReminder`（Word Game 列呼叫 `sendWordGame2AssignmentReminder`）；Students 頁 `src/sections/teacher/students/student-detail.js` 一次一人；Word Game 頁 `src/sections/word-game/components/remind-dialog.js` 可改訊息、上限 1000 字。
- Word Game 提醒的預設文案：`src/sections/word-game/constants.js` 的 `remindMessage()`。
- 前端的 3 秒 cooldown：`src/sections/teacher/dashboard/index.js` 的 `remindCooldowns`，只是本機 state。

**要問 PM 的（不擋工程）**

- 自動提醒的預設天數 2 before／1 after 可以嗎？
- Announcements 要不要有 email、誰能發？第三期才用到。
