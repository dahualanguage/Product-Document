# v23 — Practice Results 頁（老師看學生交回來的成果）

- **功能名稱**：Practice 的 Results 頁——老師從 Practice 列表點進一份指派，左欄看全班交了誰、幾分，右欄看一個學生的細節、改分、留評語（2026-11-12 使用者開版，說是「大更新」）
- **網址**：https://dahua-dash-dev.web.app/dashboard/assignments/submissions/?sk=…&name=全球暖化&type=VOCABULARY（路由 `/dashboard/assignments/submissions`，網址帶 `sk` 指派、`name` 練習名、`type` 練習型別）
- **截圖**：無（照程式碼複刻）
- **日期**：2026-11-12（登記 → 同日基準 ＋ 提案第一輪）
- **分岔自**：無。這頁跟八張 practice 卡的建立流程（v3–v21）是不同的頁面；八張卡在這頁各有自己的右欄
- **入口**：v24 Practice 列表的 Ended tab（2026-11-12 開）。v24 定案 ⑥：看成績的動作統一叫 **Result**——這頁的標題 `Assignment Submission List` 要跟著改（網址 `/submissions` 改不改待問工程，寫在 v24）
- **設計檔**：
  - `mock.js` 共用假資料（名單兩個班級指派 ＋ 離開的一位；八種型別各一套右欄資料；逐詞三色、V2 欄色、星星、聲調箭頭、音高圖的 SVG）
  - `results-baseline.html`（**基準**，現行頁逐項照 sx 複刻；左欄 ＋ 六種 panel 全部）
  - `proposal.html`（**提案**，同一份資料套其他頁的 token）
  - `spec.html`（**spec**，v10 的七節網頁格式；**11/13 起 v24 也在同一份**：§2.1 為什麼多一個 tab、§3.1–3.2 列表、§4 L1–L6；段落前標「列表」／「Results」；2026-11-13 開，起因是使用者問「分數顏色的規則是什麼」→「把這個寫在 spec」。§3.4 分數的顏色：80／60 兩個門檻照 `utils/score.js`、色號照 `practice-detail-popup.js`；只上名單列與貼頂列、看最後的分數；Score breakdown 的 bar 另一套門檻 85／70）
  - 兩份網址參數一樣：`?type=vocab|mirroring|vocabquiz|quiz|scramble|building|response|openended`、`&stu=<id>`、`&unsub=1`、`&empty=1`、`&ai=1`（AI Feedback 展開）、`&rt=1`（重錄清單展開）、`&wrong=1`、`&tab=feedback`、`&edit=1`、`&noedit=1`、`&grp=b1`
- **程式碼基準**：dahua-dash `origin/develop` @ `696f4a42`（2026-11-12 fetch）
- **狀態**（第三輪 2026-11-12 照 Students 頁的 UI 重做，見 change log）：**2026-11-12 基準 ＋ 提案第一輪畫完（使用者「先把其他頁的 design token 套到這一頁中」）**：只換長相、不動資訊架構；八種型別都有。未 commit、未部署；底下「待定」四條等使用者

## 現行頁面長什麼樣（程式碼讀出來的）

出處 `src/app/dashboard/assignments/submissions/page.js` → `src/sections/assignments/view/history/`。

**頁面殼**（`history/index.js`）
- 上面：`← Back`（回 `/dashboard/practice`）、練習名 h5 ＋ 型別 chip（`PracticeTypeChip`，吃 `type` 和練習的 subType——所以 Vocabulary 會分 Mirroring／Quiz）。
- 一張 Card，裡面左右兩欄、高 78vh：左欄固定 340px，右欄捲動。手機改上下。
- 載入中整張換 loader；右欄沒選人寫 `No submissions yet`／`Select a student to view results`；選了沒交的寫 `This student has not submitted yet`。

**左欄**（`left-panel.js`）
- 最上面三張小卡：**Submitted**（藍）、**Avg Score**（綠）、**Perfect**（橘，＝100 分的人數）。離開班級的學生列出來但不算。
- 底下每個「班級指派」一組（同一班指派兩次會出現兩組；組名＝班名 · 到期標籤），可收合，右邊 chip `已交/總數`。
- 組裡一列一個學生：交了的在前、再照名字排。交了的右邊有分數 chip（primary outlined），前面可能多 `v2 · Old version`（答的是舊版練習）和逾期扣分 chip；沒交的名字灰、右邊 `–`。
- 名單外的交卷者（分享連結進來的）收在 `Not in class`；離開的收在 `Left class`。**demo 兩組都不放**（2026-11-12 使用者「先拿掉這些特殊情況再 demo」），mock 只有兩班。
- 分數：Scramble／Cloze 用 `scrambleResult.score`，其他走 `getScorePercent()`，都套逾期扣分。

**右欄**：照型別換 panel（`history/index.js` 的 `renderDetail`）

| 型別 | panel | 內容 |
|---|---|---|
| Content Mirroring、Vocabulary Mirroring、ESL Mirroring | `sentence-panel.js` | 學生名 ＋ 右上 `ScoreOverrideControl`；`Score breakdown`（rubric，有才顯示）；一句一張卡；底下 `Teacher Comment` |
| Vocabulary Quiz（VOCABULARY 帶 `mcResult`） | `mc-panel.js` | 跟 Comprehension Quiz 一樣 |
| Comprehension Quiz（MULTIPLE_CHOICE） | `mc-panel.js` | `ScoreSummaryCard`（分數環 ＋ 學生名 ＋ `N questions · M wrong`）；`Question Details` ＋ All／Wrong 切換；一題一張卡（Q 號紅綠、題型 chip、分類 chip、題目、答錯時紅框學生答案＋綠框正解、答對只綠框）。**沒有改分、沒有評語**（程式註解寫 by design）。題目讀的是學生答的那一版，練習改過會提示 |
| Sentence Scramble、Sentence Cloze | `scramble-panel.js` | 同 MC 的結構：分數環、`Sentence Details` All／Wrong、一句一張卡（正確順序綠 chip、答錯多一排學生順序紅 chip）。**沒有改分、沒有評語** |
| Sentence Building、Sentence Response（FOLLOW_PATTERN） | `follow-pattern-panel.js` | 學生名 ＋ 改分；Audio Mode／練習改過的提示；一題一張卡（Q 號 ＋ 狀態 chip Passed／Not passed／Not answered／Question changed、星星 ＋ 幾次 attempts、題目、Pattern 或 Teaching Point 綠框、Student answer 灰框含錄音與 Heard as、四個 criteria 紅綠灰、Correction 橘框、feedback 斜體、底下 Repeat practice 的句子 ＋ 所有錄音）；評語 |
| Open-ended Questions（QA） | `qa-panel.js` | 頭像 ＋ 學生名 ＋ 改分；一張卡兩個 tab：**Conversation**（老師問左灰泡、學生答右邊、泡泡顏色照發音分、V2 的有 `QaV2Feedback`、底下紅框列 FAILED 的 checks）／**AI Feedback**（Statistics、AI Summary、Highlights 綠、Practice Areas 藍、Recommendations 橘）；評語 |

**句卡**（Mirroring／Vocabulary 一句一張，`sentence-card-shell.js`、`mirroring-sentence-card.js`、`sentence-panel.js` 的 `V2SentenceCard`）
- 殼：`#N` chip ＋ 逐詞上色的句子（`GradedSentence`）；分隔線；星星 ＋ `Auto Pass`（琥珀，左邊四px 橘條）＋ `Pinyin: ON/OFF`、`Translation: ON/OFF` chip（學生練的時候開沒開）；右邊動作。
- Mirroring 多：綠色 `AI Feedback` 鈕（展開 `PronunciationDetailPanel` ＋ 字色圖例 ＋ 音高圖）、紅色播放鈕。
- V2 引擎（`pronunciationScores.syllables`）換成另一種卡：灰頭 `#N` ＋ 句子 ＋ 小播放鈕，身體是 `V2FeedbackPanel`；Vocabulary 每音節。
- 有重錄歷史的（`showsRetakeHistory`）底下一列 `View all N recordings`，展開每次 Attempt 的分數 ＋ 播放，點一個就把那次的分數換到卡上；全部沒評到分的句子自己一張「只有錄音」的卡。

**共用的兩個**（`panels/shared/`）
- `score-override-control.js`：右上 `NN/100` ＋ 逾期 chip ＋ `Adjusted` chip（有改過）＋ 鉛筆（能改的才有）；非 V2 的多一排星星。點鉛筆開 `Edit Score` 對話框（0–100 整數、`Revert to system`）。**只有 Mirroring、Vocabulary、QA、Follow Pattern 能改**。
- `teacher-comment-box.js`：`📝 Teacher Comment` 四行輸入、`N / 2000 characters`、右下 `Send Comment`／`Update Comment`。看的人不能編輯（個人老師）整塊不出現。

**資料怎麼來**：進頁先抓名單（`getAssignments`）＋ 每個班級指派的交卷清單（`getAssignmentHistories`，只留 `isSubmitted` 的，一人一筆）；點一個學生才抓那一筆的細節（`withRetakeSummary`）。MC 和 Follow Pattern 的題目另外抓（`getMCReview`／`getFollowPatternReview`）。

## 這頁最近動過什麼（dahua-dash PR）

| PR | 做了什麼 |
|---|---|
| #1052 | 改成「每個班級指派」各一組名單、各自算分 |
| #1057 | 細節和錄音改成點到才載入 |
| #1082 | 老師看得到一句的每一次錄音（重錄歷史） |
| #1120 | Sentence Cloze 走 Scramble 的 panel |
| #1124／#1131 | 西班牙文（es-MX）、Mirroring 星星照後端表 |
| #1135 | Sentence Patterns 多 Repeat practice 這一段 |
| #1149 | Compare 與單字卡用單字音庫 |

## 使用者定的

| 日期 | 題目 | 定案 |
|---|---|---|
| 11-12 | 第一步做什麼 | **先把其他頁的 design token 套到這一頁**，資訊架構先不動 |

## 提案做了什麼（第一輪 2026-11-12：只換 token）

套的是 v17／v20／v22 proposal.html 與元件總表 §13 那一組，出處與值寫在 proposal.html 檔頭。逐區：

> **第三輪（2026-11-12）整頁改照 Students 頁**（`/school/teacher-students`，`src/sections/teacher/students/index.js`／`student-roster.js`／`student-detail.js`，分數照 `teacher/shared/practice-detail-popup.js`）：藏 header 的滿版兩欄（380px 名單｜細節，各自捲）、slate／emerald 色票、頭像 tile（`utils/name.js` 的 getAvatarColor ＋ getInitials）、列 r13 選中綠框、SectionHeader（icon 方塊 ＋ 13/800 標題 ＋ 灰計數 pill ＋ 開合鈕）、r14 #e6ebf1 卡、綠框／白框小鈕、三階色分數。下表「提案」欄是第一、二輪的 token 版；第三輪覆蓋的地方標 **S**。

| 區塊 | 基準（MUI） | 提案（token） |
|---|---|---|
| 標題 | h5 ＋ soft chip | **S**：搬進左欄頭（student-roster 的 header 位置）：Back 小連結 → 36px 型別 icon ＋ 名稱 20/800 → TypeBadge（11/800 r7）。Students 頁那行「Select a student to view details」副標沒搬（使用者 2026-11-12 拿掉） |
| 外框 | Card 78vh、左右兩欄各自內捲 | **S**：照 Students 頁 index.js——藏 dashboard header，整頁 grid `380px｜1fr`、100vh；左欄白底 border-right 自己捲，右欄灰底自己捲、頂上貼頂 bar；1100px 以下 330px、900px 以下上下疊。卡裡不疊卡：V2 圖表盒、字詞回饋、Student answer 改 grey100 內嵌、沒框線 |
| 左欄三個數字 | 三張小卡、藍／綠／橘數字，**全部班級合計** | **每班各算一組**，放在班級段頭底下（收起時還在）：**S** 兩顆小 tile（Submitted、Avg score；**Perfect 拿掉**）照 student-detail 的 Word Game tile（#f6f9fc 底 #e6ebf1 框 r10，數字 16/800 墨色，標籤 10.5/800 大寫）。頂上不再有合計 |
| 班級組 | chevron ＋ 深色計數 chip | **S**：照 SectionHeader——班名 13/800 ＋ 到期 12/600 ＋ 灰 pill `8/10 submitted` ＋ 右邊 28px 開合鈕（收起箭頭轉 180°）；組與組之間一條 #eef2f7 線 |
| 學生列 | 選中 primary.lighter 實色；分數 primary outlined chip；Old／Late 各自的 chip | **S**：照 student-roster 的列——r13、40px r11 漸層頭像 ＋ 縮寫、名字 14/700；**一行排：名字｜分數｜tag 欄**（Late／Old version／Adjusted；沒有就空著，分數才對得齊；不寫 Submitted；2026-11-12 使用者「重新排列」）；選中 1.5px #6ee7b7 框 ＋ #ecfdf5 底、hover #f6f9fc；分數 15/800 右邊、照 practice-detail-popup 三階色（#047857／#d97706／#e11d48）；沒交的頭像淡、名字 #94a3b8、右邊 `—`。第二輪的分數軌拿掉 |
| 學生標頭 | sentence／FP／QA：h6 名字 ＋ caption；Quiz／Scramble 另一張分數環卡 | **S**：五種 panel 同一條**貼頂 bar**（student-detail 的 sticky top bar：毛玻璃、border-bottom）——46px r13 頭像 ＋ 名字 19/800 ＋「Class 7A · 15 cards」13/600；右邊分數照 practice-detail-popup（22/800 三階色 ＋「/ 100」＋ Late chip ＋ Adjusted tag）＋ 綠框小鈕 **Edit score**（那頁 Adjust 鈕的樣子）＋ 帳號頭像；星星只有 V1／FP／QA 有 |
| Score breakdown | caption ＋ Divider ＋ LinearProgress | **S**：SectionHeader（bar_chart 藍方塊）＋ 一張 r14 卡裝三列「標籤｜6px 條｜%」；門檻色照產品 |
| 句卡（Mirroring V1） | `#1` 綠 chip、句子置中、Rating ＋ Auto Pass ＋ Pinyin: ON／OFF chip、綠 AI Feedback 鈕 ＋ 紅播放 | 題卡骨架：灰膠囊 `#1`（question-card-spec 3.4）＋ Auto Pass `.tag.warn` ＋ Pinyin on／off `.pill` 在標頭；右邊星星 ＋ `.btn.outlined.sm` AI Feedback（帶開合箭頭）＋ 淡綠圓播放鍵；句子靠左、拼音在上；Translation on 時底下一行英文 |
| AI Feedback 展開 | 藍／綠兩個色塊區、emoji 💡 Tip | grey100 底的展開區，兩個 `.fbsec`（眉標 ＋ icon、灰計數 pill）、Tip 不用 emoji；圖例 ＋ 字格 ＋ 音高圖照留 |
| V2 卡（Vocabulary） | outlined r20 灰頭 ＋ 深色 chip；身體再一層 r24 面板（Good job! 24px、h3 分數）＋ 圖 ＋ WordFeedback | 同一副題卡骨架：灰膠囊 `#1` ＋ Word／Example pill，右上分數 18px ＋ 播放；逐字三色一列（拼音在上）＋ 英文；Good job! 18px ＋ 摘要點；圖表盒一層；WordFeedback 的 Tone 卡換灰底 ＋ 眉標 |
| 重錄清單 | Divider ＋ 主色文字鈕 ＋ Attempt 列（選中 primary.lighter、36px 綠播放） | 同樣一列，`.btn.text.sm` 開合、選中淡綠、28px 淡綠播放鍵 |
| Quiz／Scramble 分數卡 | Card r24 ＋ 80px 環 | 第一輪 `.card` ＋ 72px 環；**第二輪拿掉**，改用上面同一個學生標頭（三階色改由左欄分數軌帶） |
| Question Details ＋ All／Wrong | h6 ＋ ToggleButtonGroup | **S**：SectionHeader（型別 icon ＋ 型別色方塊）Questions／Sentences／Cards／Conversation ＋ 灰 pill（`3 wrong`／`15 cards`／`2 passed`）；右邊 `.seg` All · 8｜Wrong · 3 ＋ 開合鈕 |
| 題卡（Quiz） | 整張卡紅綠框、Q 號紅綠 chip、題型 chip、分類 outlined chip、題目灰底框 | 卡框中性，對錯只在右上 icon 與答案列；灰膠囊 Q1 ＋ `.tchip`（True/False 綠、Multi-Choice 藍、帶 icon；VOCAB_MC_* 灰）＋ 分類 `.pill.mand`；題目純文字；答案列 ok／bad 兩色 wash；圖／音題幹寫一句說明 |
| 題卡（Scramble） | Sentence N chip、正確順序綠 chip、學生順序紅 chip | 灰膠囊 `#1`；兩組 tile（1px 框）；**學生順序只把放錯位置的字標紅**（見待定 ③） |
| 題卡（Follow Pattern） | 灰頭 Q1 ＋ outlined 狀態 chip；Pattern／Teaching Point 綠框；Student answer 灰框；Correction 橘框 | 灰膠囊 Q1 ＋ 狀態 `.tag`（Passed ok／Not passed bad／Not answered off／Question changed warn）；**參考框用教學點容器的黃** #FFF8E7；Student answer grey100 ＋ 眉標；Correction 用 `.alert` 的琥珀 ＋ 左側 3px；Repeat practice 一段 grey100 ＋ 眉標 |
| QA | Avatar ＋ h6；Tabs；老師 #f0f0f0 泡泡、學生泡泡照發音分；AI Feedback 四個 emoji 標題色塊 | 頭像拿掉（待定 ①）；Tabs 換 `.seg`；老師泡泡 grey200 r12、學生泡泡 wash ＋ 1px 框；AI Feedback 改五段眉標（Statistics 一列數字、Summary、Highlights 綠勾、Practice areas 琥珀旗、Recommendations 編號）——沒有 emoji（待定 ②） |
| Teacher Comment | Card ＋ 📝 標題（primary 色）＋ 四行 TextField ＋ 右下 contained | **S**：SectionHeader（rate_review 綠方塊）＋ r14 卡裝 `textarea`（r11、focus 綠框 ＋ #d1fae5 光暈，照那頁搜尋框）；計數字在左、綠框小鈕 **Send comment** 在右 |
| Edit Score 對話框 | Dialog xs：浮動標籤 TextField | `.dlg`：標題 ＋ 一句說明（待定 ④）＋ `.fld` 標籤在上；**S** 按鈕換那頁的小鈕：Revert to system 白框（琥珀字）靠左、Cancel 白框／Save 綠實心靠右 |
| 沒有動的 | — | 逐詞三色、V2 欄色、分數環三階、criteria 紅綠灰、星星——這些是分數的意思，不是版面 token |

## 待定（跟基準不一樣、但不是 token 的地方——要你定）

1. **QA 的頭像拿掉了**：五個 panel 只有 QA 有 Avatar，其他四個都是純名字。提案統一成沒有。要留就加回來。
2. **四個 emoji 標題換成眉標 ＋ icon**（📊🎯⭐💡 與 📝 Teacher Comment）：其他提案頁沒有 emoji。文字沒改。
3. **Scramble 的 Student order 只把放錯位置的字標紅**：基準是整排紅、正確順序整排綠。提案正確順序不上色、學生順序逐位比對。這是多推一步，不是純換皮。
4. **Edit score 對話框多了一句**「The system gave Ava Huang 64/100. Your score replaces it on the list and for the student.」：產品沒有這句。要嚴格只換皮就拿掉。
5. ~~名單每列的分數軌（第二輪）~~ 第三輪拿掉了——三階色改由分數數字帶（practice-detail-popup 就是這樣畫）。
6. **Students 頁有、這頁沒搬的**：搜尋框、班級下拉（Results 產品沒有；名單已經照班分段）。要加先寫待問。
- （2026-11-18）重交過的學生，名單和成績算哪一次：最新、最高、還是第一次？提案照產品現況算最新。
- （2026-11-18）學生重交之後，老師對舊那次改過的分數和評語：沿用到新的一次，還是留在舊的那次？提案是留在舊的那次。

## 待問

2. **後端**（2026-11-18）：遲交幾天用哪個時間算？history 只有 `creationTime`／`lastModified`（重開、改分都可能動到）和指派的 `expiredDate`；v8 定案扣分看 `submittedDate`，能不能把 `submittedDate` 或直接 `daysLate` 一起回在 `getAssignmentHistories`？跨時區以學校時區算日界。
1. **後端**（2026-11-18）：學生第二次 Submit to Teacher 時，第一次那筆（含老師改的分、評語）是被蓋掉，還是留著只把 `isSubmitted` 拿掉？`history/index.js` 註解寫「後端保證一個學生一個指派最多一筆已交」。重交的切換要每一次都留著、能一次拿回來。

## 改了什麼（change log）

| 日期 | 改了什麼 | 說明 |
|---|---|---|
| 2026-11-18 | **重交改叫 Attempt／Submission**：交出去之前練的每一次叫 `Attempt N`，交給老師的那一筆叫 `Submission`（一人一筆）。名單 tag `Resubmitted · 72` → `Attempt 1 · 72`；分數卡按鈕 `Attempt 1 · Nov 12 · 72`｜`Submission · Nov 15 · 92`，拿掉 `Latest`；看 Attempt 時 tag `Attempt`、說明改 *Practice attempt on Nov 12, not submitted. The submission (92) is the score on the list.*、沒有改分和評語 | 使用者「應該第一次是 attempt，第二次才是 submission」。跟產品一致（後端保證一人一指派最多一筆已交；前端把沒交的作答濾掉）。原本待定「舊那次的改分和評語跟不跟」因此不存在：老師只能改、只能評 Submission。問後端第 2 題改成「沒交的作答有沒有留分數、能不能拿回」。spec、HANDOFF.md、交接包複本同步 |
| 2026-11-18 | **spec 更新成最新設計**（`v23-practice-results/spec.html`）：章節改成 1 原型與檔案、2 範圍、3 設計規格（3.1–3.8，列表三節、Results 五節，各附原型預覽）、4 要改的地方（L1–L6、R1–R9）、5 要問工程、6 驗收 21 條、7 名詞對照；跟 HANDOFF.md 一致；程式碼基準 36664ed4；原本開著的設計題照原型寫成規則 | 使用者「更新為最新的設計」。舊版停在 11/13：分數在貼頂列、班級標頭有計數與 tile、分頁是灰底 seg、名詞對照的 Ended 還是任一班、三個檔案路徑錯 |
| 2026-11-18 | **打包交接**：`handoff/practice-results/`（HANDOFF.md ＋ practice-list.html、results.html 兩份原型複本，假資料內嵌、互相連得過去）。v23、v24 一包 | 使用者「打包這次的設計」。程式碼基準 36664ed4。複本時順手補回分數卡的 `v2 · Old version` tag（分數卡改版時漏掉） |
| 2026-11-18 | **Content Mirroring 改成 V2 畫法**：每句一字一欄 ＋ 英文、`90/100`、Good job! ＋ 幾個字要改／要複習、聲調圖、聲調卡、Auto Pass tag；拿掉 V1 的 AI Feedback、Pinyin／Translation on/off pill；段名照舊 Sentences | 使用者確認中文現在交卷都是 V2 → 選「改成新版」。mock：同一批六句拆字、status → 綠／黃／紅、分數 ×20；第一句聲調卡是「六」（唸成二聲、應該四聲）。底下說明條的「AI Feedback 展開」連結拿掉 |
| 2026-11-18 | **星星全部拿掉**：分數卡底下的星拿掉；每句卡、重錄清單、Sentence Building／Response 每題、Open-ended 每輪對話的星換成 `80/100`（星 ×20），顏色照分數三階 | 使用者先問「現在的 code 是不是沒有星號了」→ 查 develop @ 36664ed4：還有，只有非 V2 引擎打的分才出現 → 「拿掉星星」。中文是不是已全面 V2 → **使用者確認：是**（現在交卷都用 V2，星星只會出現在改版前的舊紀錄）。提案的 Content Mirroring mock 還是 V1 畫法，過時，待決定要不要改成 V2 |
| 2026-11-18 | 遲交 tag **寫出遲交幾天**：`Late · ×80%` → `Late 2 days · ×80%`（分數卡寫全；名單寫短 `Late 2d · ×80%`、滑過看全句——名單 tag 欄加寬會把學生名擠成 Emma C…，所以不加寬） | 使用者「late ×80 的把遲交多少天寫出來」。天數＝交卷時間 − 到期日；產品的 history 有 `expiredDate` 與 `creationTime`／`lastModified`，前端算得出近似值，準的要後端給（待問 2）。mock：Liam 2 天、Henry 4 天 |
| 2026-11-18 | **Score breakdown 不用長條**：Fluency／Accuracy／Pronunciation 三格並排，每格小標（大寫灰）＋ 大數字 `85%`；顏色門檻照產品 85／70，字用深一階（#047857／#B45309／#B91C1C） | 使用者「這裡不用用 bar 來呈現」 |
| 2026-11-18 | 每一次交卷**直接排在分數卡上**：分數底下一排按鈕 `Submission 1 · Nov 12 · 72`｜`Submission 2 · Nov 15 · 92 · Latest`，看的那次綠框，點了切換；原本的 `Submission 2 of 2 ▾` 下拉拿掉 | 使用者「讓這些內容直接顯示在第一層」 |
| 2026-11-18 | **重交過的學生**：名單 tag 欄多灰 tag `Resubmitted · 72`（上一次的分數）；分數卡右上多 `Submission 2 of 2 ▾`，選單列每次的日期＋分數、最新標 Latest；切到舊的那次＝分數卡顯示當時的分、`Earlier submission`、一行說明列表算最新那次、不能 Edit score、底下細節換成那一次 | 使用者「如果一個學生有重新提交，會有不同成績變化」→ 查產品：老師只看得到最新一筆 → A 標變化／B 切換／C 都要 → 使用者「C，直接寫數字就好，不用 ↑13」。mock：Emma 72→92、Mia 66→58（`prev`）；舊那次的細項照分數比例縮放。`?stu=emma` |
| 2026-11-18 | 班級標頭的 **Avg score 拿掉**：標頭只剩班名 ＋ 到期日 | 使用者「拿掉平均分數」。頁面上已經沒有任何合計數字（Perfect 11-12 拿掉、頂上三張卡 11-12 拿掉）；spec 裡還寫著舊的兩顆 tile，一起改成現況 |
| 2026-11-16 | **沒交的人移出名單**：每班數字框底下一個淡紅框，標題「Not submitted ＋人數」＋ Send reminder，底下列頭像＋名字；班級標頭的「8/10 submitted」小標拿掉；名單只剩交了的人 | 使用者「not submitted 的學生名字要明顯一點、跟 send reminder 放在一起、not submitted 的資訊出現一次就好」。沒交的人點不進右欄了（原本點進去只有「還沒交」一行）；說明條拿掉「沒交的」連結 |
| 2026-11-16 | 兩顆數字框（Submitted／Avg score）拿掉：平均分移到班級標頭右邊（分數三階色），交卷資訊只剩紅框；Send reminder 確認框補內文區，列出會收到的人 | 使用者「Submitted 跟 Not submitted 資訊還是重複了」「send 的 pop up 視窗壞掉了」（說明字貼著分隔線、沒有內文） |
| 2026-11-16 | 修：確認框（Send reminder、Edit score）裡的按鈕點了沒反應——框擋掉了點擊往外傳，改成只有點灰底才關 | 使用者第二次說「send 的 pop up 視窗壞掉了」；實際點過：開框、Cancel、Send（出 snackbar）、點灰底關都正常 |
| 2026-11-16 | 紅框和確認框裡的沒交名單拿掉頭像，只留名字 | 使用者「Not submitted 名單不用出現頭像」 |
| 2026-11-16 | 右欄貼頂列拿掉「· 15 cards」（Mirroring 類），只留班名；張數在底下 Cards 段標頭 | 使用者「拿掉 card 這個詞」 |
| 2026-11-16 | 右欄段標頭「Cards · 15 cards」改「Recordings · 15 recordings」（V2 Mirroring；V1 仍是 Sentences） | 使用者「改一個說法」。不用 Words：Vocabulary Mirroring 每個詞一張詞卡＋兩張例句卡，混在一起；每張都是一次朗讀錄音 |
| 2026-11-16 | 段標頭的計數 pill 只寫數字（Recordings 15、Sentences 5），不再重複名詞 | 使用者「不用重複兩次名詞」 |
| 2026-11-16 | 班級標頭放大：班名 17px、到期 14px，左邊跟練習標題對齊 | 使用者「放大 Class 7A · Due Nov 18」 |
| 2026-11-16 | 左欄整理：型別色塊改成標題底下灰色小字；平均分移到班名下一行；收合箭頭拿掉外框；沒交的紅框拿掉，只留紅色「Not submitted · 2」＋同列文字按鈕 Send reminder，名字改淡灰標籤；左邊同一條線 | 使用者「這塊排版很亂」→「其他的先照你的改」 |
| 2026-11-16 | 左欄分四層：練習（22 粗＋灰小字，底下細線）→ 班級（18 粗＋「Due · Avg score」灰 meta 行）→ 區段標籤（NOT SUBMITTED 紅／SUBMITTED 灰，11 大寫字距）→ 名單；班與班之間細線。只動字級、粗細、留白、線，不加新色；SUBMITTED 不放人數 | 使用者「重新排版這塊、要有階級層次」 |
| 2026-11-16 | Not submitted 區改成淡紅底容器（框線對齊班名左邊線），名字白底標籤 | 使用者「Not submitted 區域也變成一個容器」 |
| 2026-11-16 | Not submitted 區改成跟 v25 Dashboard 展開列同一套：白底灰框、灰色「NOT SUBMITTED (N)」小標、白底灰框名字、右邊綠色實心 Send reminder | 使用者「跟 dashboard UI 一樣」 |
| 2026-11-16 | 對齊：Send reminder 移到「NOT SUBMITTED」同列右邊、名字在下面一整排（左欄窄，原本名字擠成兩行、按鈕卡中間）；框邊＝學生列選取框邊；標題、班名、標籤、名字、頭像同一條左線；箭頭右緣＝按鈕右緣 | 使用者「排版對齊」。版型跟 Dashboard 差在按鈕位置（Dashboard 夠寬放名字右邊） |
| 2026-11-16 | 每班包成一張淺灰底卡（#F4F6F9、灰框、圓角 14），收起時卡片照樣分開；卡內學生列 hover 改白；練習標題左邊跟著對到班名那條線 | 使用者「class 欄位新增容器底色，讓在折疊起來的時候看得出來區分」 |
| 2026-11-16 | 修：展開／收起時卡片寬度不同（展開有捲軸、收起沒有）→ 名單一直留捲軸位置 | 使用者「展開跟收合的時候寬度不同，請統一」 |
| 2026-11-16 | 右欄貼頂列的分數改成白底「分數欄」：上 SCORE 小標（同左欄標籤）＋右邊文字鈕 Edit score；中 大分數 28px 三階色 ＋ /100；狀態 tag（Adjusted、Late）貼在分數右邊；V1 的星在最下；不能改時只少 Edit score | 使用者「放在分數欄位、重新排版這些資訊」。Edit score 從綠框鈕降成文字鈕：這裡主要是看分數 |
| 2026-11-16 | 分數欄從貼頂列移到右欄內容最上面（Score breakdown 上面），全寬大卡：SCORE 小標＋右上 Edit score、分數 48px、tag 貼右邊、V1 星在下；貼頂列只剩頭像、名字、班名 | 使用者「直接放在 Score breakdown 上面、變成一個大欄位」。八種型別都有這張卡；Quiz／Scramble 沒有 Edit score 是產品現況 |
| 2026-11-13 | **Send reminder**：每個班級指派的兩顆 tile 底下多一行 `N not submitted ＋ Send reminder`（全交沒有這行）→ 確認框照 Dashboard 的 reminder-popup（`N students in Class who have not submitted`、Cancel｜Send reminder）→ 3 秒 cooldown、snackbar `Reminder sent to N students in Class`；`&remind=1` | 使用者「result 頁也放上 send reminder」。寄的對象＝這個班級指派裡沒交的人，一人一封，跟 Dashboard 同一支 mutation（sendStudentAssignmentReminder）。產品的 Results 頁現在沒有這顆，基準不加 |
| 2026-11-13 | 跟 v25 Teacher Dashboard 接起來：Dashboard 每列的 View results 帶 `back=dashboard` 進來，Back 回 Dashboard（其餘仍回 v24 的 tab）；側欄 Dashboard → v25。基準連基準、提案連提案 | 使用者「把 v23 v24 的 demo 也連接到 dashboard」 |
| 2026-11-13 | `spec.html` 併入 v24：標題改「Practice 列表的 Ended tab ＋ Results 頁」，§2.1 為什麼多一個 tab、§3.1 三個 tab、§3.2 卡片與列表檢視、要改的地方分 L／R 兩表、驗收加列表五步；分數顏色改編號 §3.6 | 使用者「v24 的 spec 也寫在同一份」「寫說為什麼要新增一個 tab 的邏輯」 |
| 2026-11-13 | 開 `spec.html`（七節），分數三階色的規則寫成 §3.4（併入 v24 後是 §3.6） | 使用者「現在分數顏色的規則是什麼」→「把這個寫在 spec」。v23 原本沒有 spec，一併把第三輪的骨架、名單、貼頂列、各段、尺寸、要改的地方、待定、驗收寫進去 |
| 2026-11-13 | 學生列的 tag 只留 Late；Old version、Adjusted 從列上拿掉（右欄標頭照舊有） | 使用者「先只留下 late 的 tag」 |
| 2026-11-13 | 學生列的分數改靠左（首位數字對齊，85／100 同一條線起頭）；名單裡的 tag 放大（10 → 11.5px、內距加大），別處的 tag 不動 | 使用者「分數欄位對齊第一個數字」「tag 放大」。tag 欄 96 → 110px |
| 2026-11-12 | 學生列改一行：名字｜分數｜tag（有才放），Submitted 那行拿掉 | 使用者「重新排列：學生名，成績，tag（如果有）；放 submitted 不用」。tag 欄固定 96px，分數對齊 |
| 2026-11-12 | 左欄頭的副標「Select a student to view results」拿掉 | 使用者「拿掉」。右欄沒選人的空狀態（產品原文）照留 |
| 2026-11-12 | 每班的 **Perfect**（＝100 分的人數）拿掉，只剩 Submitted、Avg score 兩顆 | 使用者「Perfect 是什麼」→「拿掉這個欄位」。產品左欄那張橘色小卡就不搬了 |
| 2026-11-12 | **第三輪：整頁照 Students 頁（/school/teacher-students）的 UI 重做**——藏 header 的滿版兩欄、slate／emerald 色票、頭像 tile 名單、SectionHeader ＋ r14 卡、綠框／白框小鈕、貼頂 bar 放學生 ＋ 三階色分數 ＋ Edit score；每班三顆 tile；分數軌拿掉 | 使用者「參考現在 student 頁的 UI」＋ 網址。產品碼 `src/sections/teacher/students/*`、`teacher/shared/practice-detail-popup.js`、`utils/name.js` @ 696f4a42。側欄仍是 dashboard 的綠（它不屬於 Students 頁）。搜尋框、班級下拉沒搬（待定 ⑥） |
| 2026-11-12 | **第二輪：UI 重整一遍**（/frontend-design）——拿掉 78vh 外框卡與兩個內捲，名單變貼頂的卡、細節照頁面捲；每班數字拿掉框；學生列多分數軌；五種 panel 同一個學生標頭（Quiz／Scramble 分數環卡拿掉）；圖表盒、字詞回饋、Student answer 改灰底內嵌；評語從卡改段落；1100px 以下上下疊 | 使用者「這頁的 UI 先重新調整一遍」。顏色、字體、token 全沒動；資訊一項沒少。分數軌是唯一多出來的畫法 → 待定 ⑤ |
| 2026-11-12 | 左欄 Submitted／Avg score／Perfect 改**每班各一組**，放在班級組標題底下；頂上的合計拿掉、組標題的計數 chip 併進 Submitted | 使用者「這些數值應該要 under 在每個 class 以下，不是綜合所有 class」。基準檔不動（產品是合計） |
| 2026-11-12 | mock 拿掉 Left class 那組（Grace Ho）；demo 只有 Class 7A／7B 兩班 | 使用者「先拿掉這些特殊情況再 demo」。Not in class／Left class 是產品 `buildRoster` 的尾巴組，規則仍寫在「現行頁面」 |
| 2026-11-12 | 跟 v24 接起來：吃 `&name=` `&cls=班名|到期;…` `&back=tab`，標題與左欄班名跟著 v24 的卡；Back 回 v24 原來的 tab（基準檔回 v24 基準） | 使用者「把 v23 v24 互動連貫再一起」。名單裡的人和分數還是這頁自己的假資料 |
| 2026-11-12 | **提案第一輪：整頁套其他頁的 token**（八種型別、所有狀態） | 使用者「先把其他頁的 design token 套到這一頁中」。逐區對照見「提案做了什麼」；四條不是 token 的差異列在「待定」 |
| 2026-11-12 | 基準檔：現行頁複刻（左欄 ＋ 六種 panel） | 鷹架。mock.js 兩邊共用 |
| 2026-11-12 | 登記 | 使用者「接下來我要做一個大更新開新的 v，是要來更新 practice 的 result 頁」＋ 網址。讀完 `history/` 全部十三個檔，沒畫 |
