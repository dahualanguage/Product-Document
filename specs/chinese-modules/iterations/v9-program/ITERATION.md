# v9 — Program 頁（老師端 /school/program）

- **功能名稱**：Program Dashboard（CLASS_TEACHER 看到的 Program 頁：頁頭、三張統計卡、Program Users 兩段表、Pending Invitations）
- **網址**：https://dahua-dash-dev.web.app/school/program（使用者尚未給，照路由推的）
- **截圖**：使用者 2026-09-23 給了兩張（Students 表 + 上面一列 Class Teacher）
- **日期**：2026-09-23（登記＋基準檔）
- **設計檔**：`program.html`（基準，現行畫面複刻；`?tab=all|teachers|students`、`&cls=<班名>`、`&q=<關鍵字>`、`&edit=<email>` 現行 Edit User 對話框）；`proposal.html`（提案：多選學生批次改 Target Language／Game Level；`&dlg=1` 開對話框、`&sel=3,4,5` 開並先勾好、`&tl=zh-TW`、`&gl=4`、`&done=1`、`&fail=1`）
- **程式碼基準**：dahua-dash `origin/develop` @ `6405607f`（2026-09-23 fetch；5447ca51 → 6405607f 之間 school／theme／layouts 沒動）
- **狀態**：**進行中 · 沙盒**（2026-09-23 第三輪，提案畫完等回饋）。基準檔與提案都截圖核對過；未部署

## 現況（照程式碼）

- `src/sections/school/program/index.js`：頁頭 Program Dashboard ＋ Welcome back, {schoolName}!；Import Users 只有 SCHOOL_ADMIN 有。資料整形：一個人在多個班用「, 」串成一格；Join Date = createdAt `yyyy-MM-dd`；依 createdAt 新→舊。
- 三張 StatCard（Total Users／Students / Seats ⓘ／Teachers）。
- Program Users 卡（`school-users-section.js`）：All Users／Teachers & Coordinators／Students 三顆 Chip ＋ All Classes 下拉 ＋ Search；All 時兩段各一張表、不分頁；Teachers 段 Coordinator 排前面。
- 表格（`school-users-table.js`）：User（Avatar 36：學生 secondary.light、老師 warning.light）／Role（RoleChip soft：Class Teacher＝warning，Student 不在對照表 → secondary）／Class／Target Language（CHINESE program 才有）／Status（學生才有 Switch small＋Active）／Join Date／Actions（Edit）。
- **鉛筆 → Edit User 對話框**（`src/sections/school/dahua-admin/components/user-form.js` isEdit、`user-form-model.js`）：標題列 edit icon ＋ Edit User ＋ *Email, role, and program cannot be changed after creation.* ＋ 關閉鈕；Email（鎖住）、First Name／Last Name 兩欄；**學生才有** LEARNING PROFILE 分隔線 ＋ Native Language (optional)／Target Language (optional)（Not set｜Simplified Chinese｜Traditional Chinese，CHINESE program 才有）；非 ESL 老師只有 Email＋姓名。Cancel／Save Changes，沒改過就灰。**裡面沒有 Game Level**——現行單筆編輯也改不了等級。基準檔 `?edit=<email>`。
- Pending Invitations 卡（CLASS_TEACHER 看得到，只列自己班級的邀請）：Search by email、Email／Source／Role／Class／Created At／Actions、分頁列。

## 無法確認（截圖有、程式碼沒有）

2026-09-23 的截圖裡有三樣在 `6405607f` 與 98 條遠端分支、本機 `dahua-dash-develop` 都找不到：

1. 表格最左的**勾選欄**（`canBulkSelect` 這一頁沒傳）
2. Target Language 標題旁的 **ⓘ**
3. 整個 **Game Level ⓘ** 欄（沒有欄位、沒有 gameLevel 資料）

基準檔照截圖畫（那是使用者實機看到的），tooltip 文字寫「（無法確認）」。要問工程的只有一句：**截圖是哪個分支／哪次部署？** 拿到分支後把這三樣的出處補進基準檔檔頭。

## 需求（2026-09-23，使用者）

**多選學生，一次修改 Target Language／Game Level。** 先提案討論，還沒畫。

### 程式碼裡已經有的（可以直接借）

- 勾選欄：`school-users-table.js` 本來就支援 `canBulkSelect`（只有學生列有勾選框、表頭全選只選學生），只是這一頁沒開；截圖那個版本顯然開了。
- 批次動作條：`src/components/table/table-selected-action.js`——勾了之後一條 primary.lighter 的綠條蓋在表頭上，「N selected」＋右邊動作 icon。Dahua Admin 的 Users 頁用它做批次刪除（`src/sections/users/view/index.js`：可選的列才進 `selectableIds`，動作前 confirm，成功後清空選取、refetch）。
- Target Language：只有 zh-CN／zh-TW 兩個值（`TARGET_LANGUAGE_SELECT_OPTIONS`），存在 ProgramProfile，改一個人是 `editProgramProfile({programId,userId,targetLanguage})`；只有 CHINESE program 有。
- Game Level：每個學生一個 `wordGame2Level`（`getWordGame2HistoryByClass`），由學生自己在 Word Game 的分級測驗（`placement-screen.js` → `submitPlacement`）寫入；`maxUnlockedLevel = min(wordGame2Level, availableMaxHskLevel)`。**老師端沒有任何改它的 mutation。**

### 提案（討論用）

1. **入口用現成的選取條。** 勾學生 → 表頭變成綠條「3 selected」，右邊一顆 **Edit** 鈕。不做兩顆分開的按鈕，因為兩個欄位常常一起改（新學生進來要同時定語言和等級）。
2. **一個對話框、兩個欄位，預設「Keep current」。** Target Language：Keep current｜zh-CN｜zh-TW。Game Level：Keep current｜Level 0～6。欄位下方一行現況摘要（*2 students zh-CN · 1 not set*），讓老師知道自己在改什麼。只動有改的欄位。
3. **確認才送。** 對話框底部列出會被改的學生（名字＋現值 → 新值），按 Apply 才送出；成功「3 students updated」，部分失敗「2 of 3 updated」並保留失敗的勾選。
4. **權限跟單筆一致。** 只有 `canEditRow` 通過的學生列可以勾（班導只能勾自己班的），其他列勾選框 disabled；老師列永遠沒有勾選框（程式現況）。
5. **選取範圍。** 只在 Students 段；換分頁 Chip 或 All Classes 篩選就清空選取（跟 Admin Users 頁 refetch 清空同一個習慣）。

不做的：Game Level 欄位做成每列直接下拉（單筆快改）——可以之後補，不在這一輪。

### 目前的樣子（2026-09-23，第三輪）

- **入口**：Students 段標題列右邊常駐一顆 outlined small **Edit**（第二輪定的）。表格本身跟現行一樣，沒有勾選欄。
- **按 Edit 直接開「Edit students」對話框**（第三輪，使用者：「按了 edit 就會出現 popup，在 popup 裡選取」）。寬 900（maxWidth md），副標 *Pick the students, then set the fields to change. Fields left on Keep current are not touched.*
- **左欄＝學生清單**：搜尋 ＋ 班級下拉 ＋ Select all（有篩選時寫 *Select all (N shown)*）／*N selected*。一列一人：勾選框、頭像、姓名、班級、右側兩行 *Target Language zh-CN* ／ *Game Level Level 6*。勾了的列淡綠底，右邊欄位一選，該列直接顯示 **現值 → 新值**（綠色）。
- **右欄＝SET FOR SELECTED**：Target Language（Keep current｜zh-CN｜zh-TW）、Game Level（Keep current｜Level 0～6），下面 *Now: 1 student not set · 2 students zh-CN*（沒勾人時寫 *Pick students to see current values*）。警語兩條假設（調低等級／跳過分級）照第一輪。
- **底列**：*3 selected · 3 will change*｜Cancel｜**Apply to 3 students**（沒人會變時是灰的 Apply）。
- **送出**：一人一筆。全成功 → 關對話框、右上 snackbar *3 students updated*、表格更新。`&fail=1` → 對話框留著、只剩失敗的 Wilson Wu 還勾著、右欄多一條紅色 *Wilson Wu could not be saved. They are still selected — try again.*，snackbar *2 of 3 updated*。
- 第一輪（勾了才冒出綠條）與第二輪（Edit 鈕進入選取模式、在表格上勾）都被退回，留在 change log。

### 要問工程／PM 的（程式碼答不了）

1. **Game Level 的語意**：老師改的是 `wordGame2Level`（解鎖上限）嗎？調低會不會把已經破關的等級鎖回去、星星和進度留不留？
2. **沒做分級測驗的學生（現在顯示 —）**：老師直接設一個等級，學生是不是就跳過分級測驗？
3. **哪些角色可以批次改**：班導只限自己班？Coordinator／School Admin 全部？
4. **後端有沒有批次 mutation**，還是前端像批次刪除一樣 `Promise.all` 一人一筆？（決定失敗處理怎麼畫）
5. **Game Level 上限**：0～6 全開，還是只能設到 `availableMaxHskLevel`（現在有內容的最高級）？
6. **改 Target Language 會不會影響 Word Game 進度**（zh-CN／zh-TW 內容不同，要不要重置）？

## 基準檔跟截圖的差別（刻意的）

- 截圖裡 Joey Tsai（Class Teacher）上面被糊掉的那列補成 Programme Coordinator「Teacher Test」，對應右上角頭像的 T。
- 頁頭、三張 StatCard、Pending Invitations 在截圖外，照程式畫；席位 30、Total Users 8 是假的。
- 表頭 `sx backgroundColor:'grey.50'` 在這個 theme 沒有 grey[50]，實際吃到 override 的 background.neutral（grey200）；列 hover 的 'grey.50' 同理無效，所以列沒有 hover 底色。

## Change log

| 日期 | 誰 | 改了什麼 |
|---|---|---|
| 2026-09-23 | 文件 | 登記；基準檔 `program.html`（現行複刻，含三樣無法確認的欄位） |
| 2026-09-23 | 文件 | 需求：多選學生批次改 Target Language／Game Level。提案討論稿（選取條＋一個對話框兩欄位）＋六條待問 |
| 2026-09-23 | 文件 | 基準與提案都補上現行的 Edit User 對話框（`?edit=<email>`／鉛筆），確認裡面沒有 Game Level |
| 2026-09-23 | 老師 | 提案 `proposal.html` 第一輪：選取條 → Edit selected → 對話框（兩欄位 Keep current、現況摘要、兩條假設警語、Changes 清單）→ Apply → snackbar；部分失敗留著勾選 |
| 2026-09-23 | 老師 | 第二輪：Students 段常駐 **Edit** 鈕當入口，按了才進選取模式（勾選欄＋綠條 Cancel／Edit selected）；第一輪「勾了才冒出綠條」使用者說入口要先看得到 |
| 2026-09-23 | 老師 | 第三輪：按 Edit 直接開對話框，**學生在對話框左欄勾**（搜尋／班級／全選，每列現值，勾了顯示 現值 → 新值），右欄兩個欄位；表格不再有勾選欄。第二輪「在表格上進選取模式」被退回 |
