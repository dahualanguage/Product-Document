# v10 — 老師自訂寄信規則（Teacher Email Settings）

- **功能名稱**：Notification settings（老師自己決定九封通知信裡哪些寄、何時寄、寄給誰）
- **網址**：產品裡還沒有這一頁。提案掛在 `/dashboard/users/edit/:id`（Account 選單那一項，第五輪從 Profile 改名 **Settings**）；派作業對話框有一個當次覆寫的勾選。**範圍：只討論設定頁**（2026-09-30 使用者）
- **截圖**：無（使用者未給；基準檔照程式碼畫）
- **日期**：2026-09-30（登記＋提案第一輪）
- **設計檔**：
  - `teacher-dashboard.html`（**參考，不在卡片上**：現行 /school/teacher-dashboard 的 Send reminder，從 v2 基準分岔；`?open=1`、`?remind=1`。畫了之後使用者問「為什麼要畫」，收斂成只討論設定頁，留著給之後開 Dashboard 那一版用）
  - `profile.html`（**基準**：現行 /dashboard/users/edit?id=<自己>，Edit User 表單；`?menu=1` 打開右上 Account 選單）
  - `proposal.html`（**提案**，從 profile.html 分岔：Edit User 下面疊第二張 Card「Notifications」；`&changed=1` Save 可按、`&saved=1` 顯示 snackbar）
  - `emails/`（7 封信渲染好的 HTML，從 Email Templates artifact 抽出，給 Preview Dialog 的 iframe 用）
  - `digest-discussion.html`（2026-10-20 會議用：Daily digest 老師關不掉、跟 14／48 的重疊、四個選項、要定的兩件事）
  - `discussion.html`（討論稿：三個方案、每封信開放什麼、規則、資料接點、分期、待確認。不是照基準畫的）
- **基準**：九封信現在怎麼寄，收在 [DAHUA AI Email Templates](https://claude.ai/code/artifact/dce51479-50bc-47b7-9309-4eedd21ff9d7)（commerce-api `src/email/brevo/templates/`，用 README 的測試參數渲染）
- **程式碼基準**：dahua-dash `origin/develop` @ `96d64382`（2026-09-30 fetch）。**本機 `~/Downloads/dahua-dash-develop` 過期**，第一稿照它寫「Remind 找不到」是錯的，fetch 後更正。2026-10-19 再對 `c8179072`：產品仍沒有任何通知設定（account-popover 只有 Home／Profile；updateUser input 沒有 preferences）
- **狀態**：**進行中 · 沙盒**（2026-10-19 第二輪自我檢查，等回饋）。第一輪已隨 2026-10-12 commit `9782ded` 部署到 project-logeg.vercel.app；第二輪未 commit

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

- **命名**（第五輪，使用者）：Account 選單 Profile → **Settings**；編自己時頁面標題 Edit User → **Settings**，breadcrumb「Dashboard · Settings」那一列拿掉（使用者：不用這個副標），管理員編別人維持 Edit User，切換條件跟 Notifications 卡一樣是 id === authUser.id；第一張 Card 加標題 **Profile**。結構＝Settings 頁 → Profile 卡 ＋ Notifications 卡。
- **三張卡**（第六輪，使用者「兩個標題更明顯一點，或是換成兩個卡片」）：Settings 頁 → **Profile**／**Emails you receive**（17、22）／**Emails your students receive**（14、15、48、49、59），卡標題 h6 同款，間距 24。每張卡自己一顆 Save、dirty 以卡為單位，存同一個 preferences 各送自己那一段；snackbar「Settings saved」。「Notifications」這個名字不再出現在畫面上。
- ~~**不做分頁**（使用者 2026-10-01）：維持 Profile 一張 Card，下面疊第二張 Card **Notifications**（Grid spacing 3 → 間距 24）。~~ 第六輪拆成兩張。
- **文案只有標題和控制項**（第三輪，使用者）：Card 標題 h6 Notifications，沒有副標。兩段 subtitle2 **Emails you receive**／**Emails your students receive**，沒有 caption。每列只有信的名字（跟 Preview 開出來的一致）＋ Preview 連結，沒有說明句、沒有模板編號（編號留在 `data-row` 給工程）。
- **每列兩欄**（第四輪，使用者「不太好閱讀」）：左＝信的名字＋灰色 Preview 小連結（visibility 圖示），右＝狀態控制，Switch／Select／Chip 全在同一直線上。段標題用 Edit User 卡 Roles 同款 subtitle1 16/600，跟列名稱 14/600 分兩級。
- **名詞**（第十三輪，使用者定）：17 和 59 都叫 **Daily summary**（同一類：每日 cron 彙整，老師一封、學生一封，兩張卡各一個）；Word Game 的期限叫 **end date**（跟產品錯誤訊息、信裡的 Ends 一致）；作業一律 assignment、提醒一律 reminder（按鈕維持 Remind）、Teacher feedback 不動。側欄 Practice List 要不要改名是別的版本的事。
- 列：Daily summary（Switch）、Question bank ready（Switch）／New assignment（Switch，第十四輪從 Select 改）、Teacher feedback（Switch，同）、Assignment reminders（Switch）、Word Game goal reminders（Switch）、Daily summary（Chip Managed by school）。**沒有 Ask me each time**（使用者 2026-10-19：「改成開關就好」），派作業對話框不需要當次覆寫的勾選。
- **規則＝灰底標籤／值小表**（background.neutral），只在 Switch 開著時出現，關掉整塊收起（Collapse，不再淡掉）。48／49 預設關 → 頁面預設很短。
- Daily summary（老師收的那封）的小表：Time [07:30]／Send（Select：Every day something is due｜Only when someone hasn't submitted，第四輪從 Checkbox 改 Select）／Format（Select：One email per assignment｜One email for all assignments）。**沒有 Deferred start 設定**（第三輪拿掉＝維持現況：延後開始的作業在開始日寄）。
- **Assignment reminders 的小表**（第十輪）：**Reminders 清單**，一列＝一封：[n] days [before the due date｜after the due date] ＋ ×，底下 **Add reminder**，最多 4 列（滿了 Add 變灰），只剩一列時 × 藏起來。預設兩列（2 days before／1 day after）＝今天的行為。老師要「7 天前＋2 天前」就加一列。固定時間點、不是區間（使用者問「選 2 天前是寄兩封還是一封」→ 一封）。沒有 then every 和 Limit（第八輪，使用者：多餘）；上限 4 由 Add 變灰表達，不寫字。**Message**（第十一輪，使用者「48 也加可以輸入，先給一句預設文字」）：多行、上限 1000，預設 You have not submitted this assignment yet. Please finish and submit it when you can.；進信裡「A Note From Your Teacher」那段（模板 48 要照 49 加這段）。小表底下虛線隔開**全頁唯一的解釋句**：One reminder per student per assignment every 24 hours, including the ones you send yourself.（改掉現在按兩次寄兩封的行為，所以要讓老師看得到）。天數的 day／days 跟數字走。
- **Word Game goal reminders 的小表**（第十二輪，使用者：模組要跟 Assignment reminders 一樣）：同一個 Reminders 清單模組，[n] days [before｜after the end date]（第十三輪 goal date → end date）、Add reminder 最多 4 列，預設一列 3 days before／Message 多行（上限 1000 字，跟 Word Game 的 Remind 對話框一樣），預設照產品 remindMessage() 的口吻去掉代入：You have not reached this Word Game goal yet. Jump back in when you can — keep it up!24 小時那句不重複寫。
- **Preview**（第七輪）：點每列的 Preview 開 MUI Dialog（720 寬，標題＝信的名字、副標 Subject: …、右上 X），裡面一個 iframe 放那封信渲染好的樣子；渲染檔 `emails/<模板>.html` 從 Email Templates artifact 抽出（7 封，README 測試參數）。固定顯示預設版，不跟設定連動（第一期不做）。
- 底部狀態列（跟 v6／v8 同款）：← Index 回 Versions & Iteration、現行複刻、討論稿；右邊各狀態入口（預設／提醒規則打開／改過・可存／存成功／Preview 17／Preview 59／Account 選單）。
- 網址參數：`&open=48,49` 把那幾列的 Switch 打開看小表；`&preview=17` 直接打開那封信的 Preview；`&changed=1` 兩顆 Save 可按；`&saved=1` snackbar。
- **這張 Card 只在「編自己」時出現**（id === authUser.id）；管理員開別人的 users/edit 看不到（待問 6 的決定）。
- 59 右邊一顆 Chip **Managed by school**，沒有開關。12／13 不出現。
- 底列只有一顆 **Save**（跟 Edit User 的 Save Changes 分開，不同 mutation），沒改過是灰的；存成功 snackbar「Notification settings saved」。
- 元件照產品：MUI Switch 58×38（switch.js）、TextField small 40 高、Select icon right 10、Checkbox padding 8、Chip soft、Button contained disabled 色。

## 要問 PM／工程的

1. **PM** 59 digest 真的不給老師關？學校端若要「老師能關」，就得改成班級層級才不會互相蓋掉。**2026-10-20 會議討論**：老師把 14／48 全關，學生仍每天收到 digest 且內容就是這位老師的作業；選項與建議見 `digest-discussion.html`（建議 v10 先加一句 Sent even if the emails above are off，「Include my assignments in the daily digest」等 PM 定）。
2. ~~**PM** 14 的 Ask each time 值不值得做？多數老師只選 Always／Never 的話這個選項可以砍。~~ **2026-10-19 使用者定：不做，14／15 就是開關。** 原本的補充留著當背景：現在前後端都沒有這個選項，assignAssignment 一派就寄 14；做的話派作業對話框要多一個勾選、mutation 多一個參數。派作業對話框現有的唯一寄信槓桿是 TYPE 的 Mandatory（*Sends reminder emails*）｜Optional：Optional 不寄「提醒信」。
9. **Backend** Optional 作業「不寄提醒信」到底涵蓋哪幾封？14 New assignment 寄不寄？17／59 Daily summary 會不會列它？48 手動 Remind 按得到嗎？答案決定 v10 的規則要不要寫「Optional 作業不進自動提醒、不進 Daily summary」。
3. **Backend** School／Program 有沒有時區欄位？17 的 sendAt 和自動提醒的「n 天」都靠它。
4. **Backend** 手動 Remind 今天刻意不去重（按兩次寄兩封）。24 小時上限會改掉這個行為，要不要？要的話 ReminderLog 得在後端，前端 3 秒 cooldown 不夠。
5. **Backend** 17 現在的 cron 固定幾點寄？那個時間就是設定頁的預設值，要寫在畫面上。
6. ~~**Design** Notifications 放 Profile 分頁（本提案）還是 Account 選單獨立一項？users/edit 也被管理員拿來編別人，分頁只能在「編自己」時出現。~~ **2026-10-19 定**：留在 Profile 頁（第二張 Card），只在編自己時出現；不加 Account 選單項。
8. **Backend／PM** 48 的 Message：Brevo 模板 48 要加「A Note From Your Teacher」段與 MESSAGE 參數（照 49），sendStudentAssignmentReminder 多傳 message。Dashboard／學生頁的 Remind 確認框要不要也加文字欄（跟 Word Game 的對話框一致）？是另一版的範圍，先登記。
7. ~~**PM** 48 自動提醒的預設次數：第二輪畫 Stop after 4（＝系統上限）；要不要預設低一點（例如 2）？~~ 第八輪拿掉次數欄位，固定到期前一封、逾期後一封。改問：**PM** 預設天數 2／1 可以嗎？

## Change log

| 日期 | 誰 | 改了什麼 |
|---|---|---|
| 2026-10-19 | 老師 | 第十四輪：使用者「改成開關就好，不用 Ask me each time」→ 14／15 從 Select 改 Switch，預設開；待問 2 結案；派作業對話框不再需要當次覆寫勾選 |
| 2026-10-19 | 老師 | 第十三輪：統一名詞（使用者定）：17 Due today summary、59 Daily digest 都改 **Daily summary**；Word Game 的 goal date → **end date**；assignment／reminder／Teacher feedback 維持。digest-discussion.html 同步改名 |
| 2026-10-19 | 老師 | 第十二輪：使用者「Word Game goal reminders 的天數模組應該也要跟 Assignment reminders 一樣」→ 49 改用同一個 Reminders 清單（before／after the goal date、Add reminder 最多 4 列），預設一列 3 days before |
| 2026-10-19 | 老師 | 第十一輪：使用者「為什麼只有 Word Game 可以改文字」→「48 也加可以輸入，先給一句預設文字」。Assignment reminders 多一列 Message（多行 1000 字）＋預設句；49 預設改成產品 remindMessage() 口吻。模板 48 要加 note 段（待問 8）；原則④「Brevo 模板不動」在 48 破例 |
| 2026-10-19 | 老師 | 第十輪：使用者「選 2 天前是寄兩封還是一封」「7 天寄一封、2 天寄一封怎麼設」→ 固定兩格改成可加列的 Reminders 清單：一列一封、[n] days before／after the due date、Add reminder 最多 4 列、預設兩列＝今天的行為。一列＝一封把「從那天開始」的歧義解掉 |
| 2026-10-19 | 老師 | 第九輪：使用者「After due [1] day 看不太出來是什麼意思」→ 規則標籤改講「哪一封」、值講「什麼時候」：1st reminder [2] days before the due date／2nd reminder [1] day after the due date；Word Game 同款 Reminder [3] days before the goal date |
| 2026-10-19 | 老師 | 第八輪：使用者「then every 跟 Limit 感覺很多餘」→ 拿掉。Assignment reminders 只剩 Before due／After due 兩個數字，到期前一封、逾期後一封；系統上限變成隱含的 2，畫面不寫。規則裡「自動提醒每作業最多 4 封」改成最多 2 封 |
| 2026-10-19 | 老師 | 第七輪：Preview 做成 Dialog（使用者「不用我一直同意」，照建議直接做）：iframe 放渲染好的信，固定預設版不跟設定連動；渲染檔 emails/ 從 Email Templates artifact 抽出 |
| 2026-10-19 | 老師 | 第六輪：使用者「Emails you receive／Emails your students receive 兩個標題更明顯一點，或是換成兩個卡片」→ Notifications 卡拆成兩張，各自一顆 Save（一張卡一個表單，跟 Profile 卡一致）；頁面＝Settings → Profile／Emails you receive／Emails your students receive；snackbar 改 Settings saved |
| 2026-10-19 | 老師 | 第五輪：使用者「Profile 是不是改成 setting 比較合適」→ Account 選單 Profile → **Settings**；編自己時標題 Edit User → Settings、breadcrumb 列拿掉（管理員編別人不動）；第一張 Card 加標題 Profile。選單、標題、卡片三層名字對齊：Settings → Profile ＋ Notifications |
| 2026-10-19 | 老師 | 第四輪：使用者「現在的 UI 看起來不太好閱讀」→ 每列固定「左名稱／右狀態控制」，14／15 的 Select 搬到右欄跟 Switch 同一直線；規則收進灰底標籤／值小表，**Switch 關掉整塊收起**（原本淡掉 48%）；17 的 Only when someone hasn't submitted 從 Checkbox 改成 Send 的 Select；Preview 改灰色小連結 |
| 2026-10-19 | 老師 | 第三輪：使用者「提案太多解釋文字跟副標，把文案拉出來討論」→ 22 條列出、砍成 13 條。砍掉 Card 副標、兩段 caption、每列說明句、模板編號、59 說明；標題改成信的名字（跟 Preview 一致）；**14 的 Deferred start 設定拿掉＝維持現況**；17 的 school time 拿掉等待問 3；全頁只留一句解釋：48 的 24 小時一封、手動也算（改掉現行行為） |
| 2026-10-19 | 老師 | 第二輪（自我檢查，沒有新回饋）：48 的規則從一句話改成三行，「up to 2 times」跟「每作業最多 4 封」對不上 → Stop after [4]；規則底下補系統上限（已繳交就停、24 小時一封、手動也算）讓老師看得到；49 預設訊息改多行；48／49 說明寫清楚手動 Remind 在哪；Card 只在編自己時出現（待問 6 定） |
| 2026-09-30 | 文件 | 登記：九封信現況分三類（系統事件／老師動作／排程）；基準檔兩張 teacher-dashboard.html、profile.html（使用者：「應該一樣複製現行產品的 UI 先討論」）；九封信本身的基準是 Email Templates artifact。第一稿寫「Remind 在 repo 找不到」，fetch 到 96d64382 後證明是本機過期，Remind 在 Teacher Dashboard／Students／Word Game 三處 |
| 2026-10-01 | 老師 | 提案第一輪照基準畫：Notifications 做成第二張 Card 疊在 Edit User 下面，不做分頁（使用者定）。兩段、每列 Switch／Select、59 鎖定 Chip、自己一顆 Save。討論稿改名 discussion.html |
| 2026-09-30 | 文件 | 範圍收斂：只討論設定頁。teacher-dashboard.html 從卡片拿掉、留作參考；提案 §5.3（Dashboard 作業列的 Set up／Reminded n ago）拿掉，48／49 只留設定頁上的規則欄位。使用者：「Teacher Dashboard · Send reminder 這個為什麼要畫」→「只討論設定頁」 |
| 2026-09-30 | 老師 | 提案第一輪：設定分「我收」／「我的學生收」兩層；設定長在派作業、留評語、Teacher Dashboard 作業列旁邊，設定頁只存預設值；48／49 從手動加上自動規則與 Reminded n ago；59 鎖定不給老師關；三方案並列、建議 B |
