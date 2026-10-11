# v3 — 優化 Practice-Content Mirroring

- **功能名稱**：優化 Practice-Content Mirroring（建立流程）
- **網址**：https://dahua-dash-dev.web.app/dashboard/practice/create/?type=MIRRORING
- **截圖**：New Content Mirroring 建立流程 —— Content / Settings & Preview / Assign Practice 三步
- **分岔自**：v2（版本線上接續；設計檔不沿用 v2 的檔案，見下）
- **日期**：2026-09-09
- **小 spec**：`spec.html`（三步的現況逐塊拆解 + 查到的問題 + 待決事項）
- **設計檔**：`create-mirroring.html`（基準檔，現行產品的複刻）、`proposal.html`（**提案**，`?step=3` 是 Settings 主體、`&audio=1` 是純聽力；提案的 `?step=` 從 1 數，基準檔仍從 0 數）
- **範圍**：只動 New Content Mirroring 這條建立流程的三步。學生端不在這一版的範圍裡（但問題清單有兩題會牽動它，見 spec §4）
- **程式碼基準**：dahua-dash `origin/develop` @ `17990056`（2026-09-10 重新 fetch）
  - 原本寫的是 `c01d0ac0`。中間 14 個 commit 有 `#922 practice type UI improvements — naming, colors, filter icons, layout`，但 `git diff --name-only` 確認**沒有動到 Mirroring 建立流程的任何一支檔案**（改的是 follow-pattern / scramble / 清單頁 / AddNewPracticeDialog），所以基準檔的複刻不受影響。四個欄位顏色也沒變，只是每一項多了一個 `tag`。
- **狀態**：**已定稿、已交接**（2026-09-16；2026-09-29 依使用者指示回套畫廊的兩條，交接包複本未動）。交接包：`handoff/content-mirroring/`（HANDOFF.md ＋ 原型複本 ＋ 入口頁），線上 https://project-logeg.vercel.app/handoff/content-mirroring/ 。
- 原本的狀態（2026-09-10 存檔）：提案完成、未定稿。四步都有提案畫面。D2「可以動共用元件，改好之後五種一起改」與 D3「樣本句真的畫成學生畫面」已放行
- **未定案的一項**：第四步頁腳「Assign 與 Done 合併成一顆」是使用者要求試的版本（2026-09-10），代價是勾了班就沒有離開的出口；上一版「兩顆鈕、任何時候只有一顆是綠的」保留在 spec §6.5 裡，要退回去是幾行的事

## 這一版為什麼沒有整套複製 v2

流程講的「複製最新那個資料夾」是為了跨頁連結不會斷。v2 那套是 Teacher Dashboard 的 To Review，
跟 Content Mirroring 的建立流程沒有任何一條連結相通，複製過來只是三個開不起來的檔案。
所以這一版照使用者指定的範圍，只畫 New Content Mirroring 需要的畫面。

## 基準檔怎麼看

`create-mirroring.html`，用網址參數切狀態：

| 網址 | 看到什麼 |
|---|---|
| `?step=0` | 第一步 Content —— 只有 Project 下拉 + Content Preview |
| `?step=0&sent=1` | 第一步，但**從第二步 Back 回來**的樣子（句子編輯器這時才存在） |
| `?step=1` | 第二步 Settings & Preview —— 五塊設定 + 句子清單 |
| `?step=1&audio=1` | 第二步，Audio Mode 打開（拼音／翻譯被鎖成 STUDENT_CHOICE） |
| `?step=2` | 第三步 Assign Practice —— 還沒指派 |
| `?step=2&assigned=1` | 第三步，已指派一個班 |
| `?step=1&dlg=1` | 「Generating audio…」全螢幕遮罩 |
| `proposal.html?step=1&dd=1` | 提案 · 專案選單打開的樣子 |
| `proposal.html?step=2` | 提案 · 第二步 Edit Sentences |
| `proposal.html?step=2&split=3` | 提案 · 第 4 句進入切句模式 |
| `proposal.html?step=1&proj=2` | 提案 · 對話類專案（限制提前到第一步講） |
| `proposal.html?step=3` | 提案 · 第三步 Settings |

## Change log

<!-- 開始改之後，改一項補一行。
     只記「設計改了什麼」——基準檔的複刻與修正、mock 自己的 bug，
     都是鷹架不是改動，不進這張表。 -->

| 端 | 改了什麼 | 說明 |
|---|---|---|
| 老師 | **畫廊回套（2026-09-29）：清單每列一顆小播放鍵** | 使用者看共用設定畫廊時定的兩條（2026-09-23），回套到已交接的 v3（使用者 2026-09-29：「已交接但可以更新」）。①Sentence x of N 展開的清單每列一顆小播放鍵，點了只聽那一句、不換預覽，點列的其他地方才換；②主 Play 鈕放大成實心主綠（純視覺，記檔頭）。交接包 `handoff/content-mirroring/` 的複本沒有跟著改。 |
| 老師 | 工具列與畫布之間加一條分隔帶 | 使用者指示（2026-09-15）：要一條明顯的線告訴老師底下是預覽。一條灰底、上下細線的帶子，中間 *Preview · what a student sees*，帶一個學生圖示；底部那行改成 *Preview ends here* ＋ 計數，上下兩端把預覽框起來。v4 同步。 使用者要再醒目一點：改用這一欄自己的色票（v3 CONTENT `#EFFBF4`／`#00754A`，v4 Vocabulary `#FFF8E7`／`#8F6209`），上緣 2px 同色線、字 12px。再改：線太多——兩邊細線與上下框線都拿掉，只留一條綠色帶子（v4 也用綠，不用琥珀），底下一條 2px 深灰 `#637381`。**最後改成視窗**（使用者看過 v4 那版後叫 v3 也改）：帶子與深灰線都拿掉，灰色地板 #DFE5EC 上一個有陰影的框、框頂 *Student view* 視窗列，主欄在框裡；底部只剩計數。 視窗列的三個點是 macOS 的視窗鈕（使用者指出），改成左上角一個突起的 **Student view 標籤頁**（候選過：小螢幕圖示的列、沒有列只留角落小標）——「一個分頁」不綁平台。看過之後改成方案 B：視窗列留著，左邊一個小螢幕圖示（desktop_windows）取代三個點，中間 Student view。 |
| 老師 | Auto pass → Max tries | 使用者定案（2026-09-16）。討論過的：產品全名是 *Max attempts before auto pass*，用完次數不是跳過而是真的算過（星星顯示 3 顆、紀錄 `isAutoAdjusted`、成績頁掛 auto-pass 標），所以「auto pass」這個詞成績頁還在用。工具列只留 *AUTO PASS* 四個字時，數字沒有意思。選了最乾淨的 **MAX TRIES · [− 3 +] ＋ ⓘ**，後果只在 tooltip：*How many times a student may retry one sentence before it is let through — the sentence then counts as passed (auto pass, default 3).*（v4 寫 card）。R11 表格那一列跟著改。 |
| 老師 | Their choice → Choice by student | 使用者指示（2026-09-15）。Pinyin／Translation／Translation first／Speed 四個「學生自己決定」的選項一律改字；R11、v4 同步。Their 指誰要靠上下文，Choice by student 不用。 |
| 老師 | 模式選擇併進工具列 | 使用者指示（2026-09-15）：Audio only 的調節要跟下方的面板融在一起。原本眉標 *How students practise* ＋ 兩張 radio 卡（各帶一句說明）疊在畫布上面，是一個獨立的區塊；改成工具列第一行最前面一格 `STUDENTS · Text on screen｜Audio only` 分段控制項，跟 Pinyin／Translation 同一行、同一張卡。兩句說明拿掉——工具列沒有副標，而且切到 Audio only 時同一行的 Pinyin／Translation 會換成 *Pinyin and translation are up to the student*、畫布上的卡跟著變，效果本身就在說明。R11 的骨架同步改：模式不再是「最上面獨立一塊」，而是工具列的第一格。小標從 *Students* 改成 **Practice mode**（2026-09-16；Students 是名詞，跟底下兩個選項接不成句；產品叫 Audio Mode）。選項標籤從 *Text on screen* 改成 **Text visible**（使用者要換說法；候選過 Read & repeat／With text／Show sentence，選了跟 Audio only 對稱的形容詞；*Readable* 討論過不用——那是「易讀」不是「有文字」）。 |
| 老師 | 對話類的提醒改成 warning Alert | 使用者指示（2026-09-15）：太不顯眼。原本是一行 12px 棕字＋小圖示，跟上面的副標幾乎同一個灰度。改成 MUI Alert warning 的 standard 變體：`warning.lighter` #FFF5CC 底、`warning.darker` #7A4100 字、左緣一道 #FFAB00、22px 圖示、15px 500 字重（先 13 再改 15，圖示與文字垂直置中）。**只留第二步**（句子表上面）——使用者接著說第一步不用提醒，直接在下一步顯示就好；先前「限制提前到第一步講」那一列因此退回：第一步只列課文，Split／Merge 不能用這件事到第二步才說。文案再縮成一句 *Conversation — lines can't be split or merged.*（使用者從三個候選裡選的；原因與「還是可以隱藏」都拿掉，隱藏鈕就在旁邊）。 |
| 老師 | 課文照專案存的分段顯示，不再是一整塊 | `getSplitArticleText()` 把 `splitArticleArray`（一段一段的陣列）用 `join('')` 壓成一整塊——**而下一步要老師修的正是這個切分**，做那件事需要的結構在這一頁被丟掉了。改成一段一行帶編號：是哪一篇照樣讀得到、有多少用數的（副標 `5 lines` 是計數不是宣稱）、接下來是什麼看得出來（第二步是同一份清單）。示範資料刻意做成 **5 lines → 6 sentences**，因為專案的分段不等於 AI 最終切的句子；文案用 `lines` 不用 `sentences`，那個詞留給第二步。 |
| 老師 | 對話類內容的限制提前到第一步 | `canSplitMerge = selectedProject?.contentType !== 'CONVERSATION'` **在第一步就算出來了，卻只在第二步用**——到那裡才跳橘色警告說不能切句合併。老師選專案的當下就該知道。提案在第一步的 Frame 裡講，第二步也照著把合併鈕與 Split 鈕收掉（刪除仍可），兩邊說同一件事。`?proj=2` 是對話類專案。 |
| 老師 | 兩個順手砍掉的 | ①重複的副標——專案名稱就在正上方 24px 的選擇器裡，改成 `N lines`；②`max-height:200px` 的內捲把「還有多少」藏起來，第一步底下沒有東西在搶空間，讓它長完。**提過但沒做**：收到跟欄位同寬 520px（中文 16px 舒適行長約 520–640px）——決定維持整欄寬，收窄會讓這一塊失去份量；改成一段一行之後行長問題本來就緩解了。 |
| 老師 | Content preview 換成 ReUI 的 `c-frame-6`（ghost 變體） | `Frame → FrameHeader(Title+Description) → FramePanel → FrameFooter`。ghost = **外框沒有邊框**，只剩底色與 panel。重點是**同心圓角**，ghost 因為少了那 1px 邊框，算式也少減 1：panel 圓角 = 14 − 3 = 11px（default 變體是 14 − 3 − 1 = 10px），內外兩道弧線平行。選 ghost 是因為這一頁 1px 邊框已經夠多——兩個欄位各一道、panel 一道，再加外框就三層；ghost 讓層次靠底色差而不是線。外框 3px 內距，內 panel 白底細邊 `shadow-xs` 16px 內距。**順手收掉三層重複的標題**——現行同一件事被標了四次（Content Preview 分隔線／綠色專案名／Article Content 小標／綠框），現在是 Title `Article content` ＋ Description 直接放專案名稱 ＋ 白底 panel，沒有 footer（照 c-frame-6 的範例）。Description 原本寫 `From ⟨專案名⟩`，那個 `From` 沒做事——標題已經說了這是課文；第二步的 `Split from ⟨專案名⟩ · 5 sentences` 保留 `Split from`，那句在講句子從哪切出來的，拿掉就不成句。句子列的上下內距 10 → 14px、分隔線兩側 2 → 10px，合併鈕（22px 高、壓在線上）才不會擠著上下兩句。外框底色原版是 `bg-muted/50`，換成產品自己的淺綠色票 **`PRACTICE_TYPE_COLUMNS.CONTENT.wash` = `#EFFBF4`**（`practice-type-labels.js`）——Content Mirroring 就是 Content 欄那張卡，用它自己那一欄的 wash；現行的課文預覽本來也是綠底綠框，換掉的是框線結構不是顏色。用實色而非半透明，因為 ghost 沒有邊框、形狀全靠底色撐。同一個色票也收掉我先前在三處各調的 alpha（.06 模式卡 / .07 切句列 / .10 外框）——一個淺綠，一個值。**只動提案頁。** |
| 兩端 | 語言標籤照 BCP-47 原樣印，示範專案改成 `zh-CN` | `src/enum/languageTags.js` 的正規格式是小寫語言＋大寫地區（`zh-CN` / `zh-TW` / `zh-HK`），而下拉直接印 `cfg.targetLanguage`。**基準檔與提案頁原本都印錯**——基準檔寫成大寫 `ZH-TW`，提案頁被我縮成 `TW`，兩個都不是產品的樣子，一起修掉。示範專案改成 `zh-CN`，課文與句子換成簡體；聲音清單跟著 `getVoiceList()` 走，`zh-CN` 只回四個簡體聲音（Xiaorou / Xiaoyi / Yunxiao / Yunxia），所以提案頁現在是單一個 `zh-CN` 組，組標題也用同一套標籤。基準檔的聲音清單原本是我編的四個名字，一併換成 config 裡真的那四個。 |
| 老師 | 逐班日期改成「現況陳述＋切換動作」 | 第一版是一個 checkbox `Give each class its own dates`，而且把「現在是全部同一份」寫在右上角的 hint 上——同一個概念的兩半隔了一整張卡，使用者直接問「這是什麼意思」。改成日期正上方一行：`These dates apply to all N classes.` ＋ `Set dates per class`，切過去是 `Each class has its own dates.` ＋ `Use one schedule for all`，而且**真的展開成逐班的 Start / Due**（第一版勾了不會展開，只是個殼）。它切的是兩種模式，不是加一個選項。 |
| 老師 | 頁腳 Assign 與 Done 合併成一顆 | 使用者要求試的。有勾班→`Assign to N classes`；沒勾、已指派過→`Done`；沒勾、完全沒指派→`Skip for now`（照現行空狀態的說法，產品自己就說 *You can assign classes later from the practice list*）。**代價**：①勾了班就沒有離開的出口，得先取消勾選；②按鈕會換意思。②用兩道緩衝壓下來（中間隔一個預覽框、送出後停在 `Assigned ✓` 1.6 秒），①沒有解。**上一版是兩顆鈕但任何時候只有一顆是綠的**，沒有這兩個代價，退回去是幾行的事。 |
| 老師 | 送出前先開預覽框 | 產品本來就有——送出鍵寫 `Review · …`，按下去是 `ConfirmDialog`。提案的預覽守「只講例外，不覆述常規」：標題用跟觸發鈕一模一樣的字（同一個動作同一個說法，底下就是 Back / Assign，不必再寫「Review before assigning」）、副標只留 `Mandatory · 10 students`、整班就寫 `all 5 students` **不列名字**、有人拿不到才把那個人與原因寫出來。**比產品多一段「被跳過的人」**——產品建立模式的確認框不講衝突，但衝突真的會發生，老師該在按下去之前就知道。班名用 `CONTENT.label` `#00754A`（那組色票裡唯一為文字準備的綠；primary 當 14px 內文對比只有 2.3:1）。 |
| 兩端 | 捲動重置（§4 問題 12） | `practice-unified-view.js` 整份只有一個 `scrollIntoView`，是對話框關閉後捲到某張卡用的，**沒有換步驟時的捲動重置**——第四步一長，按 Next/Back 就落在半空中。提案在三個時機捲回最上面：換步驟、送出指派（結果長在頁面最頂端的 Assigned 清單）、結束流程。`Done` / `Skip for now` 在原型裡回到乾淨的第一步（產品是 `handleFinish` 導去練習清單或專案頁）。基準檔維持原狀。 |
| 老師 | 第四步 Assign 從對話框搬回頁面 | 現行是「一個只放按鈕的頁面 ＋ 一個 1728 行的對話框」，而且對話框裡 Schedule／Optional／Students **每選一個班就整組重複一次**，沒有「全部同一個時間」；對話框自己還有 1/2/3，等於 stepper 裡面又一個 stepper。提案搬回頁面，沿用第三步的分段方式：**Who does it ／ When ／ How it counts**。①一份時間套用到所有選到的班，選兩班以上才出現「Give each class its own dates」——後端本來就是逐班 `upsertAssignment`，前端送同一組值 N 次，不需要後端配合；②名冊預設收起來，要挑人才按 Choose students；③Due 快捷從五顆（+1/+2/+3/+5/+7）減成三顆（+1/+3/+7），涵蓋明天／這禮拜／下禮拜。**一份作業可以重複指派**，這一點決定了整步的形狀：指派不是終點也不是一次性動作，所以兩顆按鈕是對的——`Assign to N classes` 是加一筆（送出後表單清空可以再來），頁腳 `Done` 是結束流程。版面因此是「已指派的清單在上、再派一次的表單在下」：清單是會長大的結果，表單是動作。（我一度把兩顆按鈕當成待解問題，那是把指派讀成一次性動作了。） |
| 老師 | Assign 的三個狀態搬到頁面上 | 現行這些狀態都有，只是藏在 modal 的 per-class 區塊裡。**整班已派**→不再出現在可選清單（掛 Assigned 變灰），要改從上面清單按 Edit；**部分已派**→**仍然可選**，副標寫 `6 of 8 assigned · 2 left`，這是「先派一部分之後再補」那條路（我第一版把已指派的班整個灰掉，等於把它切斷）；**學生層級是一份 diff**——本班已派的維持勾選標 `Assigned`、新勾標 `New`、取消勾標 `Will remove`，已被別班派走的不能選、標 `In ⟨班級⟩`（示範資料裡郑雅文 同時在 3B 與 4A）。 |
| 老師 | Assign 的用字對齊 `AssignmentTypeChip` | 現行開關寫 `Optional — no emails`，那是在講**副作用**；`AssignmentTypeChip` 的註解說它其實是 *required work or optional, self-paced practice*，而那顆 chip 印的是 **Mandatory**，跟開關的用字對不起來。提案兩邊都用 Mandatory / Optional，並各寫清楚是什麼。另外卡片上的 `Cancel` 改成 **Remove**——它旁邊就是 Edit，讀起來像「取消編輯」，但確認文案寫的是 `Student records will be permanently deleted.`，按鈕的字跟它做的事不同一件。 |
| 老師 | **流程從三步變四步**：審句獨立成 `Edit Sentences` | `sourceLocked = Boolean(practice?.id)` —— 練習一建立，Project 鎖住、文章預覽整個不渲染、換成句子表。**兩個長得完全不同的畫面擠在同一步，而 Stepper 上只寫著一個 `Content`**，老師第一次走過去根本不知道有審句這件事。提案把它拆成 `Content → Edit Sentences → Settings → Assign Practice`。**這不是自創**：`practice-stepper-config.js` 裡 Sentence Scramble 已經是 `['Content','Edit Sentences','Settings','Assign Practice']`，Follow Pattern 是 `['Teaching Points','Question Review',…]`——做同一件事（生完給老師審）的型別本來就有獨立一步，Mirroring 是唯一的例外。標籤沿用 Scramble 的 `Edit Sentences`。連帶解掉三件事：句子表不必「按 Next 再 Back」才發現、文章不會突然消失（它留在第一步）、Project 點不動也不必解釋（按了 Next 就不能改前一步，是 stepper 的常識）。基準檔維持三步。 |
| 老師 | 句子表三個控制項重畫 | **切句**：現行用一條 Tip 解釋「點字與字之間放游標，再用 New Line 提示切句」——用文字解釋看不見的控制項，就是那個控制項沒做好。改成一顆 Split 鈕，按下去插入點才出現，標點後面的斷點標明顯、其餘很淡（提示不是限制）。**合併**：藍色圓鈕原本長在句子左邊、看起來屬於這一列，但它做的是「跟上一句合併」——移到兩句之間的分隔線上，位置本身就說明作用在哪個接縫。**刪除**：現行三段（逐列標記 → sticky 列 Confirm delete → 再一個 Dialog）收成兩段，不可逆所以保留確認，但不必確認兩次。checkbox 欄與 Actions 欄標題一併拿掉。 |
| 老師 | 第一步兩個欄位參考 ReUI `c-input-2` / `c-dropdown-menu-18` | Practice name 照 `c-input-2`（Field + FieldLabel + Input）：**標籤在輸入框上面**，不是 MUI 的浮動凹槽標籤，高度 56 → 40。Project 照 `c-dropdown-menu-18`：不是表單 Select，是 **outline 按鈕 ＋ 選單**，選單有群組標題、每列「圖示＋名稱」、箭頭 `ml-auto` 靠右。c-18 那個 provider logo 的位置放 `targetLanguage`、右邊放 `levelType + level`——都是產品下拉本來就有的欄位。觸發鈕帶著語言／級數 chip 是**沿用**現行行為——MUI Select 收合時渲染的就是選中 MenuItem 的 children，chip 本來就在（我一度寫成「只有打開才看得到」，那是錯的，實機截圖已證實）。`?dd=1` 可直接看選單打開的樣子。**只動提案頁，基準檔維持 MUI 原樣。** |
| 老師 | Stepper 換成 ReUI 的 `c-stepper-2` | 指示圈 24px、四個狀態都顯示數字（不換打勾）、連接線是 2px 圓角實心條而非髮絲線，而且**走過的那一段變綠**——進度看得出來，不只是「現在在第幾步」。配色改成產品的綠：原版 active 用 `bg-primary`（shadcn 預設近黑）、completed 用 `green-500`，這裡兩個都是綠的，所以改用實心＋光環區分「正在這一步」。原版沒有文字標籤，這裡保留 Content / Settings / Assign Practice。未走到那格從 `bg-accent` 加深到 `grey.300`——淺灰在 `#f4f7fb` 的頁面底色上會整個糊掉。**只動提案頁，基準檔的 Stepper 維持 MUI 原樣。** |
| 老師 | Settings 一步重畫：三段取代五張卡 | 依「它改變什麼」分成 **On screen**（樣本句＋Pinyin＋Translation）／**On play**（Translation first＋Speed＋Voice）／**Passing**（Move on after N tries）。現行是五張同樣重的 Paper 疊在一起，看不出哪個影響大。分組沿用 Planning 那條線已經在走的原則，不是新發明的。 |
| 老師 | Audio Mode 從設定升成模式 | 提到最上面變成兩選一：`Text on screen` / `Audio only`。它換的是練習本身不是顯示偏好；開關會暗示「有一個是預設、另一個是加購」，但這是兩種同等的練法。 |
| 老師 | 樣本句：預覽跟設定合成同一張卡 | 這一版的主角。卡的上半是學生螢幕的真實排版（拼音在字的**上面**、Their choice 的翻譯**預設收起來**要點眼睛、正在唸的那句左邊 4px `#22C55E`＋底色 `#E8FFF0`），下半就是改它的 Pinyin／Translation 兩列。同一張卡不可能跟自己矛盾，spec §4 問題 6「Preview 在說謊」因此消失。可以翻頁看五句。 |
| 老師 | 純聽力：不是變灰，是交出去 | 切到 `Audio only`，樣本句換成學生真正看到的耳機卡（照 `renderAudioModePanel`），兩個顯示設定換成一句「Pinyin and translation are up to the student／There is no text on screen to pre-set.」。現行是安靜地把下拉鎖成 STUDENT_CHOICE 再變灰，老師只能猜。 |
| 老師 | 四個下拉換成分段控制項，Voice 換成 chip | Pinyin／Translation／Translation first／Speed 都只有 3–4 個兩字選項，收進下拉沒省到空間卻要兩次點擊。四個「學生自己決定」現在一律講 `Their choice`，並排就看得出來（問題 4）。Voice 是唯一長的清單，但它連下拉都不當——改成 chip、點一下＝選它＋聽它，因為聲音不聽就選不出來；標籤用 `config/practices.js` 裡的原字串 `Xiaorou (Female)`，不縮寫成 F/M。 |
| 老師 | 聲音的地區標籤只在「不只一組」時出現 | 解問題 11。`getVoiceList('zh-TW')` 回的是繁體 3 個＋簡體 4 個串在一起、標籤沒有任何地區標記——那才需要分組標地區。`zh-CN` 只回一組，標上語言只是把已經選好的專案語言再講一次，所以隱藏；說明文字也跟著狀態走，單組時只留「Tap one to hear it.」。示範資料三個專案都是 zh-CN，所以多組那個情況在這份 mock 上看不到。 |
| 老師 | Speed 改成跟 Voice 同一種 chip | 速度跟聲音是同一類決定——都得**先聽過才選得出來**，所以用同一個元件：點一下＝選它＋聽它。`▶ Slow` / `▶ Normal` / `▶ Fast`，而 `Their choice` **刻意不給 ▶**，因為它不是一個聽得到的速度——少一個播放鍵本身就說明了「這裡沒有東西可以聽」。原本那顆獨立的 `Hear a sample` 因此多餘，連同它的 CSS 一起收掉。前提是 `handlePreviewSpeed` 取的是 `currentVoice.exampleAudio[SPEED_KEY_MAP[speed]]`，樣本本來就是「聲音 × 速度」的組合，用現有素材就播得出來。 |
| 老師 | 用字全部改成老師的話 | `Max attempts before auto pass` → **Move on after 3 tries**（原標籤講的是機制）；`Translation First` → **Play the translation first** ＋ Yes/No/Their choice（是問句就用 Yes/No 答）；enum 值 `PINYIN`/`NO_PINYIN`/`STUDENT_CHOICE` → Shown/Hidden/Their choice（問題 2）。 |
| 老師 | Practice name 移到第一步 | 選 Project 的當下它就被填好了，欄位卻在第二步（問題 1）。搬到 Project 下拉正下方，並註明它是從專案帶過來的。 |
| 老師 | 工具列右上的收合鈕拿掉（2026-09-15） | 使用者指示。畫布永遠顯示——它就是這一步的主體，沒有收起來的理由。`&prev=0` 作廢。R11 的「收合只收畫布」那句要拿掉。 |
| 老師 | 預覽拿掉左欄的把手（2026-09-14） | 使用者指示。學生端左欄清單練習開始前本來就收著，預覽裡那條 38px 的把手只是在說「這裡有個東西沒畫」，沒有資訊，拿掉。預覽現在就是主欄。 |
| 老師 | 切句模式的插入點加重（2026-09-14） | 使用者：「分段的句子綠色不明顯」。淡綠底上原本 .14 alpha 的細線幾乎看不到；改成 4px、.45 alpha 的深綠條，hover 再放寬。標點後面原本標成更深的那格拿掉（使用者：不用特別深的），所有插入點一樣重。切句模式字距拉開 1px 給插入點站。 |
| 文件 | Settings 面板定案為 R11（2026-09-14） | 使用者：「儲存這個設計樣式，之後每個 practice 的 Settings 都會用這種面板」。寫進 `practice-design-rules.html` §2 R11：工具列＋畫布的骨架、每個控制項用什麼、純聽力怎麼換、為什麼是這個形狀、走過的岔路。v4 Vocabulary 的第三步還是舊形狀，下一輪照 R11 改。 |
| 老師 | 預覽的翻頁改成在容器裡展開的清單（2026-09-14） | 使用者指示「不要左右切」、「在容器裡展開，不要下拉」。卡底下那顆 `Sentence 1 of 6 ▾` 按下去，清單在卡底下原地展開（編號＋句子，目前那句打勾），點一句就換上面的預覽、清單留著；再按一次收起。不是浮出來的選單，所以點外面不會關。左右箭頭拿掉。 |
| 老師 | Move on after N tries 改回產品的 Auto pass（2026-09-14） | 使用者指示，照產品原本的用字：標籤 `AUTO PASS`、數字 `3`，ⓘ 提示用產品 `MaxAttemptsField` 自己的 tooltip 原文 *How many times a student may retry one item before it is let through (default 3).*（使用者指定）。這推翻 v3 原本 R7 的改名（*Move on after 3 tries*）；設計判準 R7 那個例子要跟著更新。 |
| 老師 | **更正：學生畫面畫錯主角，重畫成主欄（2026-09-14）** | 使用者拿實機截圖指出「現在是統一用 toggle」。查 `assignments/content/index.js`：學生端 Mirroring 是**兩欄**——左欄才是我畫的整份清單（`content-window.js`，練習開始前收起，翻譯是逐句眼睛），**主欄是 `practice-content-list.js → message-list.js` 的 PRACTICE SENTENCE 大卡**（bg `#F0FAF4`、框 `dahua.green[200]`、圓角 24、拼音斜體在上、句子 40px/800、翻譯 body2 在下），右上角 Settings 是跟 Vocabulary **共用的 `settings-panel.js`**，Pinyin／Translation／Translation first／Speed 四個 toggle 各自只在老師選 Their choice 時出現（`resolveToggleVisibility`）。Their choice 時拼音預設開、翻譯預設關（`studentPinyinOn` true／`studentTranslationOn` false）。v3 spec §6.3 與 §4 問題 4 寫的「翻譯 Their choice 是點眼睛」只對左欄成立，主欄是 toggle——**兩邊機制不一樣是產品自己的**，之後補進 spec。預覽現在照主欄畫：標題列＋齒輪（面板 `&settings=1`）、那張卡、底下一顆 Play 鈕按了走 message-list 的兩段——先英（藍卡 Meaning）再中（綠卡 Listen & Repeat）——Play the translation first 與 Speed／Voice 就在鈕上寫著；純聽力時卡變成灰斜體 *Listen carefully and repeat the sentence.*。左欄畫成收起的把手。翻頁藥丸是老師的工具，學生端沒有。 |
| 老師 | **Settings 第四版：工具列 ＋ 畫布，同一張卡（2026-09-14）** | 使用者要求「重新設計」。題目是他自己講的那個字——工作列：上面六個控制項、下面學生的畫布，那它就該長得像貼在畫布頂上的一條工具列（像設計工具的屬性列），不是一張表單卡。**一張卡就是學生畫面**，工具列是它的頂部兩行，收合只收畫布、工具列留著（右上角一顆 chevron），底部一行 *What a student sees · 5 sentences · 1 hidden*。**兩行是明說的**：第一行＝畫面上看得到的（Pinyin、Translation）；第二行＝喇叭播什麼（Translation first、Speed、Voice）｜Move on after——六個控制項總寬約 1390px 本來就放不進一行，與其讓它自己換行，不如照它們影響的東西分兩行。每個控制項「10px 大寫標籤在上、28px 控制項在下」，眉標、副標全部不要，結構靠分組線講。**Voice 換成一顆帶 ▶ 的下拉**：它是這一頁唯一長的清單（zh-TW 專案會有七個），R3 說長的才收起來；打開每列一顆 ▶，點一列＝選它＋聽它沒變。純聽力時第一行換成一句「Pinyin and translation are up to the student」。前一版（兩欄三列的卡）作廢。 |
| 老師 | ~~控制卡第三列改成 Voice 靠左＋Move on 靠右（2026-09-14）~~ 已被第四版取代 | 使用者截圖抓到 Voice 四顆 chip 撐破右欄。Voice 需要約 680px，半欄放不下；改成 Pinyin｜Translation、Play the translation first｜Speed、然後 Voice 與 Move on after N tries 合佔整列。窄一點的視窗 chip 會換行，不會再切掉。 |
| 老師 | 控制卡不 sticky（2026-09-14） | 使用者改變決定。收成三列之後卡只有 200px 高，捲動時貼著頂欄的必要性沒了，拿掉 sticky 與它的陰影。 |
| 老師 | 控制卡收成兩欄三列（2026-09-14） | 使用者指示「工作列小一點，例如 Pinyin、Translation 合在同一排」。六列改成三列：Pinyin｜Translation、Play the translation first｜Move on after N tries、Speed｜Voice，右欄寬一點給四顆聲音 chip。卡高從約 390px 降到約 200px，sticky 之後底下的學生畫面看得到更多。 |
| 老師 | **Settings 第三版：六個控制項一張卡在上（sticky），學生畫面整份在下（2026-09-14）** | 使用者指示「讓面板更像直接在學生看到的畫面上編輯：編輯欄位在上、學生預覽在下」，討論後定了三件事：六個控制項全部上去、預覽用整份清單但可收合、控制卡 sticky。**控制卡**一張六列——Pinyin、Translation、Play the translation first、Speed、Voice、Move on after N tries——順序照它們在學生畫面上出現的位置，On screen／On play／Passing 三段眉標拿掉；純聽力時前兩列換成「Pinyin and translation are up to the student」。捲動時卡貼在頂欄底下。**學生畫面**照 `content-window.js` 整份畫：綠色練習名稱＋分隔線、第二步沒隱藏的句子全部列出、正在唸的那句綠條＋淺綠底、拼音灰斜體在字上、翻譯在字下（Their choice 有眼睛）、每句右邊喇叭、Their choice 的拼音開關在右上角。點一句＝換成正在唸的那句；按喇叭＝在那句底下閃一行 *English first, then Chinese · Normal · Xiaorou (Female)*，聽的三個設定就在畫面上看得到。純聽力時整塊換成耳機卡。「樣本句 ＋ All 5 sentences」那組因此消失——清單就是畫面。收合標題寫 `What a student sees · 5 sentences · 1 hidden`。**Tries 在預覽裡沒有東西可露出**：學生端不印次數，用完才多一顆可以繼續的鈕（`message-list.js`），留在控制卡就好。mock 限制：拼音／翻譯只有第一個專案那五句有，第二步切過的句子對不回去就沒有。 |
| 老師 | 切句鈕帶字（2026-09-14） | 使用者指示「讓剪刀更明顯」。純 icon 的剪刀改成 `✂ Split` 藥丸，跟 Merge 同一種形狀但灰框黑字，兩個動作分得開；進切句模式變成實心綠的 `✕ Cancel`。眼睛維持純 icon——它是次要動作。 |
| 老師 | 句子列加編號（2026-09-14） | 使用者指示。每句左邊 1、2、3…，跟第三步 All sentences 清單的編號對得起來；合併鈕跟著句子左緣對齊。隱藏的句子編號照留，不重排。 |
| 老師 | 句子列的剪刀／眼睛放大到 20px（2026-09-14） | 使用者問「icon 現在多大」才發現是 13px——那條規則沒給字級，繼承了 button 的預設。改成 20px、按鈕 34px，照產品同位置的 `IconButton size="small"` ＋ Iconify 20。 |
| 老師 | 刪除改成隱藏（2026-09-14） | 使用者指示。原本「標記 → 確認列 → Delete N」兩段式，改成一顆眼睛：按下去那句變淡加刪除線、學生看不到，再按一次就回來，沒有確認。可逆的動作不需要確認。標頭句數只算沒隱藏的，另寫 `N hidden`。跟 v4 第二步的 Hide 同一個機制。（產品現在是真的刪掉——`MirroringSentenceEditor` 的 marked for deletion——改成隱藏要問工程 `updatedArticleArray` 能不能帶 hidden。） |
| 老師 | Merge with previous 靠左、加重（2026-09-14） | 使用者指示。原本置中、灰字 22px，在寬列上離句子太遠又太淡；改成貼齊句子左緣、26px、綠字綠框。仍然長在兩句之間的線上——它作用在接縫這件事沒變。 |
| 老師 | ~~All 5 sentences 搬進樣本句那張卡（2026-09-11）~~ 已被 Settings 第三版取代 | 使用者指示。原本收在 Passing 底下的清單移到樣本句正下方、同一張卡裡，收合預設關；點清單裡任一句就切成樣本句（目前那句加粗），每句保留播放鍵。「看一句」與「看全部」不再隔著兩段設定。 |
| 老師 | Settings 各列的副標拿掉（2026-09-11） | 使用者指示。Pinyin／Translation／Play the translation first／Speed／Voice 五列只留標籤與控制項，樣本句底下那句 *Drawn from the student practice screen, not a stand-in.* 也拿掉。樣本句本身在講「它改的是什麼」，chip 上的 ▶ 本身在講「可以試聽」，副標是重複的。跟 v4 同一個決定。 |
| 老師 | 句子清單收起來 | 它真正的用途是逐句確認音檔，那是驗證不是預覽。樣本句用 `‹ Sentence 1 of 5 ›` 翻頁，全清單收進 `All 5 sentences`。 |
