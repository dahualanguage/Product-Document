# v10 — 老師自訂寄信規則（Teacher Email Settings）

- **功能名稱**：Notification settings（老師自己決定九封通知信裡哪些寄、何時寄、寄給誰）
- **網址**：產品裡還沒有這一頁。提案掛在 Profile（`/dashboard/users/edit/:id`）；派作業對話框有一個當次覆寫的勾選。**範圍：只討論設定頁**（2026-09-30 使用者）
- **截圖**：無（使用者未給；基準檔照程式碼畫）
- **日期**：2026-09-30（登記＋提案第一輪）
- **設計檔**：
  - `teacher-dashboard.html`（**參考，不在卡片上**：現行 /school/teacher-dashboard 的 Send reminder，從 v2 基準分岔；`?open=1`、`?remind=1`。畫了之後使用者問「為什麼要畫」，收斂成只討論設定頁，留著給之後開 Dashboard 那一版用）
  - `profile.html`（**基準**：現行 /dashboard/users/edit?id=<自己>，Edit User 表單；`?menu=1` 打開右上 Account 選單）
  - `proposal.html`（**提案**，從 profile.html 分岔：Edit User 下面疊第二張 Card「Notifications」；`&changed=1` Save 可按、`&saved=1` 顯示 snackbar）
  - `discussion.html`（討論稿：三個方案、每封信開放什麼、規則、資料接點、分期、待確認。不是照基準畫的）
- **基準**：九封信現在怎麼寄，收在 [DAHUA AI Email Templates](https://claude.ai/code/artifact/dce51479-50bc-47b7-9309-4eedd21ff9d7)（commerce-api `src/email/brevo/templates/`，用 README 的測試參數渲染）
- **程式碼基準**：dahua-dash `origin/develop` @ `96d64382`（2026-09-30 fetch）。**本機 `~/Downloads/dahua-dash-develop` 過期**，第一稿照它寫「Remind 找不到」是錯的，fetch 後更正
- **狀態**：**進行中 · 沙盒**（2026-10-01 提案第一輪照基準畫完，等回饋）。未部署

## 現況（照程式碼與九封信）

九封信全由系統固定觸發，老師不能設定。依觸發來源分三類：

| 類型 | 信 | 老師現在能控制的 |
|---|---|---|
| 系統事件 | 12 Welcome（student）、13 Welcome（teacher）、22 Question bank ready | 無 |
| 老師動作 | 14 New assignment、15 Teacher feedback、48 Outstanding reminder、49 Word Game goal reminder | 14／15 每做必寄；48／49 手動、一次一人 |
| 排程 | 17 Due today summary（teacher）、59 Daily digest（student） | 無：時間、要不要、合併都固定 |

dahua-dash 這邊：
- `src/layouts/common/account-popover.js`：Account 選單只有 Home／Profile／（Dahua admin 才有）Payment and Billings。**沒有通知設定頁。**
- `src/sections/assignments/view/assign-practice.js`：派作業流程**沒有**「要不要寄信」的選項。
- 留評語流程也沒有。
- **48／49 的 Remind 已經在三個地方**（一度以為找不到，是本機 checkout 過期）：
  - Teacher Dashboard `src/sections/teacher/dashboard/{index,active-assignments-panel}.js`：Active assignments 一列＝一個作業 × 一個班，展開後列出未交學生，一顆 **Send reminder** → `shared/reminder-popup.js` 確認框（N students in Class who have not submitted）→ `Promise.allSettled` 對每個學生呼叫 `sendStudentAssignmentReminder`（Word Game 列改呼叫 `sendWordGame2AssignmentReminder`，訊息用 `remindMessage()` 預設字）。**前端只有 3 秒 cooldown**（`remindCooldowns` 本機 state）。
  - Students 頁 `src/sections/teacher/students/student-detail.js`：學生明細每個作業一顆 **Remind**，同一個確認框，一次一人。
  - Word Game 頁 `src/sections/word-game/components/{assignment-panel,remind-dialog}.js`：落後的學生一人一顆 Remind，對話框可改訊息（上限 1000 字）。程式註解：**Nothing here dedupes: pressing send twice sends two mails, deliberately.**
- `src/api/graphql/mutations/updateUser.js`：已有 updateUser mutation，提案優先擴充它的 input 存 preferences。

## 提案（第一輪，2026-09-30）

**原則**：①預設值＝今天的行為 ②分兩層講「我收什麼」／「我的學生收什麼」 ③設定長在動作旁邊，設定頁只是總覽 ④老師設規則不改文案（Brevo 模板不動）⑤自動規則有系統上限、跨老師合併算。

**三個方案**：A 只有設定頁（老師層級）；**B（建議）** A ＋ 派作業／留評語 inline ＋ 48／49 自動提醒 ＋ Reminded n ago；C B ＋ 班級覆寫 ＋ 學校預設 ＋ 學生偏好。建議 B，C 留第三期。

**每封信開放什麼（B）**：
- 17：開關、寄送時間（學校時區）、只在有人未交時寄、一封合併 or 每個作業一封
- 22：開關
- 14：Always／Ask each time／Never；延後開始的作業在開始日寄（現況）或派的當下寄；派作業對話框可改當次
- 15：Always／Ask each time／Never；留評語時可改當次
- 48：自動規則（到期前 n 天、逾期後 n 天、之後每 n 天、最多 n 次）只在設定頁；手動保留；Dashboard 那一列的改動不在這一版
- 49：同 48 ＋ 預設 MESSAGE
- **59 不開放給老師**：每位學生一封、橫跨所有班級和老師，單一老師關掉會蓋到別人的作業。設定頁列出但鎖定，開關屬於學生本人或學校層級
- 12／13 不出現在設定頁

**規則**：優先順序 系統上限 ＞ 當次覆寫 ＞ 班級覆寫（第二期）＞ 老師預設 ＞ 系統預設。寄給學生的信以「那個作業的老師」的設定為準。系統上限：同一學生同一作業 24 小時最多一封提醒（手動＋自動合併）、自動提醒每作業最多 4 封、已繳交立即退出序列、學校時區。

**畫面**：設定頁（綠帶＝老師收、藍帶＝學生收、灰帶＝鎖定；每列 Preview 開 Brevo 模板）、派作業對話框底列 Email students now 勾選（從設定帶入）。Teacher Dashboard 作業列的 Set up／Reminded n ago 原本有畫，範圍收斂後拿掉。

**資料**：User.notificationPreferences 一個 JSON；Assignment 可選的 per-assignment override；ReminderLog（24h 上限與「Reminded n ago」）。接點：updateUser input、assignAssignment 多 emailStudents、teacherFeedback 多 notifyStudent、17 cron 讀設定、新 reminder cron、手動 Remind（既有的兩個 mutation）寫 log 並取代前端 3 秒 cooldown；Brevo 模板不動。

**分期**：Phase 1 設定頁＋派作業／評語 inline＋17 cron 讀設定；Phase 2 自動提醒＋ReminderLog＋Reminded n ago＋17 combine；Phase 3（＝方案 C）班級覆寫＋學校預設＋學生偏好。

### 目前的樣子（2026-10-01，提案第一輪）

- **不做分頁**（使用者 2026-10-01）：Profile 頁維持 Edit User 一張 Card，下面疊第二張 Card **Notifications**（Grid spacing 3 → 間距 24）。
- Card 標題 h6 Notifications ＋ 一句說明。兩段，各有 subtitle2 ＋ caption：**Emails you receive**（Sent to <email>）／**Emails your students receive**（Applies to all your classes）。
- 每列：`<tid>` 模板編號、標題 subtitle2、Preview 連結（開 Brevo 模板）、caption 說明；右邊 Switch（17、22、48、49）。14／15 沒有 Switch，用 Select Always｜Ask me each time｜Never。
- 17 開著時多三個控制：Send at（時間，school time）、Only when someone hasn't submitted（Checkbox）、One email per assignment｜Combine into one email（Select）。14 多一個 Deferred start 的 Select。48／49 關著時規則欄位淡掉（opacity .48）但保留。
- 59 右邊一顆 Chip **Managed by school**，沒有開關。12／13 不出現。
- 底列只有一顆 **Save**（跟 Edit User 的 Save Changes 分開，不同 mutation），沒改過是灰的；存成功 snackbar「Notification settings saved」。
- 元件照產品：MUI Switch 58×38（switch.js）、TextField small 40 高、Select icon right 10、Checkbox padding 8、Chip soft、Button contained disabled 色。

## 要問 PM／工程的

1. **PM** 59 digest 真的不給老師關？學校端若要「老師能關」，就得改成班級層級才不會互相蓋掉。
2. **PM** 14 的 Ask each time 值不值得做？多數老師只選 Always／Never 的話這個選項可以砍。
3. **Backend** School／Program 有沒有時區欄位？17 的 sendAt 和自動提醒的「n 天」都靠它。
4. **Backend** 手動 Remind 今天刻意不去重（按兩次寄兩封）。24 小時上限會改掉這個行為，要不要？要的話 ReminderLog 得在後端，前端 3 秒 cooldown 不夠。
5. **Backend** 17 現在的 cron 固定幾點寄？那個時間就是設定頁的預設值，要寫在畫面上。
6. **Design** Notifications 放 Profile 分頁（本提案）還是 Account 選單獨立一項？users/edit 也被管理員拿來編別人，分頁只能在「編自己」時出現。

## Change log

| 日期 | 誰 | 改了什麼 |
|---|---|---|
| 2026-09-30 | 文件 | 登記：九封信現況分三類（系統事件／老師動作／排程）；基準檔兩張 teacher-dashboard.html、profile.html（使用者：「應該一樣複製現行產品的 UI 先討論」）；九封信本身的基準是 Email Templates artifact。第一稿寫「Remind 在 repo 找不到」，fetch 到 96d64382 後證明是本機過期，Remind 在 Teacher Dashboard／Students／Word Game 三處 |
| 2026-10-01 | 老師 | 提案第一輪照基準畫：Notifications 做成第二張 Card 疊在 Edit User 下面，不做分頁（使用者定）。兩段、每列 Switch／Select、59 鎖定 Chip、自己一顆 Save。討論稿改名 discussion.html |
| 2026-09-30 | 文件 | 範圍收斂：只討論設定頁。teacher-dashboard.html 從卡片拿掉、留作參考；提案 §5.3（Dashboard 作業列的 Set up／Reminded n ago）拿掉，48／49 只留設定頁上的規則欄位。使用者：「Teacher Dashboard · Send reminder 這個為什麼要畫」→「只討論設定頁」 |
| 2026-09-30 | 老師 | 提案第一輪：設定分「我收」／「我的學生收」兩層；設定長在派作業、留評語、Teacher Dashboard 作業列旁邊，設定頁只存預設值；48／49 從手動加上自動規則與 Reminded n ago；59 鎖定不給老師關；三方案並列、建議 B |
