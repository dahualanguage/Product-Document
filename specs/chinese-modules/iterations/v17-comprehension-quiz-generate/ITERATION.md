# v17 — Comprehension Quiz：拿掉題庫、進練習才生成

- **功能名稱**：New Comprehension Quiz（`MULTIPLE_CHOICE`）建立流程
- **網址**：https://dahua-dash-dev.web.app/dashboard/practice/create/?type=MULTIPLE_CHOICE
- **截圖**：沿用 v14
- **分岔自**：v14 `proposal.html`（外殼、Stepper、第一步欄位、Test Mode 卡、題目卡、Assign 步全部沿用）；教學點 frame、Add teaching points、Generating 畫面搬自 v12 `proposal.html`
- **日期**：2026-10-23
- **範圍與理由**：`../v16-remove-question-bank/spec.html`（整個「拿掉題庫」的提案）。這一版只畫 Comprehension Quiz 那條流程
- **設計檔**：`proposal.html`（`?step=` 從 1 數；參數見檔頭）。基準檔沿用 v14 `create-comprehension-quiz.html`，不重做
- **狀態**：**2026-11-16 Content Base 題卡的 Answer conditions 打開時可以改（跟 v18 同一套）**。2026-11-12 第三步三塊分開 Settings → Test Mode → Preview；Test Mode 六條定案、一張卡（開關在上、開了才展開秒數）**（見「這一版定了什麼」最後一條）；同日 Content Base 題卡加 Answer conditions（跟 v18 同一套）。2026-11-04 起 Comprehension Quiz 的唯一版本（v14 併進來；v14 的 `create-comprehension-quiz.html` 是基準）。提案第一輪，未部署、未 commit

## 這一版定了什麼

- 三步不變：Content → Edit & Preview → Assign Practice。第一步從 Question Bank 改名 Content。
- 第一步：專案單選（後端生題一次一個專案）→ Practice name → **What to ask**（題庫頁 Bulk generate 的七格壓成 4×2 格子（2026-11-03 起 3×2，Fill in blank 拿掉）：Comprehension／Pinyin／Meaning／Fill in blank × True/False／Multiple choice，每格 0–10，True/False 沒有 Fill in blank）→ **Teaching points**（照 v12 的 frame：全選、勾選 chip、語法點標 Grammar、Add teaching points；容器黃底 #FFF8E7）→ **Article**（課文一段一行）→ 主鈕 Generate。
- 字彙類三格從勾的教學點出題；Comprehension 從整篇課文出題、不看教學點。（沒有字彙題時 frame 轉灰、說明寫「這次用不到」——2026-11-02 拿掉。）語法點不出拼音題。
- Generate 灰著的原因寫在格子底列（R9）：沒選專案／總數 0／有字彙題但沒勾教學點。
- 生成中整頁換 Generating；生成後回第一步主鈕變 Next，回頭多勾、多填只補新的（掛 New）、取消勾的點它的題跟著離開（v12 的做法）。
- 第二步：Test Mode 卡照 v14；一題一張卡，**展開＝編輯**（題目一欄、選項四欄、正解單選點；True/False 只選 True／False），改過的掛 Edited；字彙題多一顆教學點 chip；**Generate more** 鈕打開同一張 4×2 格子（預設 0）、Add N questions 接在最後掛 New。「Edit in Question Bank」那顆鈕拿掉。
- Content Base 題卡上有 **Answer conditions**（2026-11-12 加）：產品題庫頁 Q&A 區塊兩類（Content Base＝程式裡的 shortAnswer、Extension）每一題都在 Suggested Answer 底下掛同一個 `answer-conditions.js`，後端從題目＋建議答案生成、分 Must cover／Not required、老師只能看。搬進 Quiz 之後照 v18 同一套畫：收起時在建議答案底下唯讀；**鉛筆打開時可以改（2026-11-16，使用者「要可以修改」）**：Must cover／Not required 每條一個輸入框、✕ 刪、各組底下 Add，底下一行「The AI grades the student’s spoken answer against these」；手寫題還沒有條件時兩組都空著只有 Add，一行「留空的話存檔時 AI 從你的題目和建議答案寫出來」；收起時空白條丟掉；改了條件的 AI 題掛 Edited。True/False、Multiple choice 沒有。
- 第三步 Assign 照 v3／v14（S8）。
- **Test Mode（2026-11-12 使用者一題一題定）**：①Content Base 在 Quiz 裡照 Free response 一樣對話式，追問、重錄都留著，倒數只管總時間。②**每種題型各一格「每題幾秒」**（True/False、Multiple choice、Content Base；有題的才列），**總時間＝秒數 × 題數加總**，產品的 1–60 分滑桿與「題數 × 30 秒」建議值拿掉；預設 30／30／120 秒待 PM。③Test Mode 開著學生先看到**開始頁**（幾題幾分鐘、題型拆分、要麥克風／Audio only 要耳機、「按 Start 才倒數、時間到交卷」），按 Start 才開始倒數——產品現在進頁面就跑、沒有開始頁。④時間到讓進行中的那題收尾（錄完、評完）才交卷，不能再開新題——待工程。⑤**一張卡，開關在上、開了才展開**（使用者「test mode 集合在一張卡片，先用一個 toggle 打開再顯示」；同日一度併進工具列第二行 Off｜On ＋ 第三行秒數格，使用者要回一張卡）：Settings 卡底下照產品那張卡的外殼（timer icon ＋ Test Mode ＋ 說明 ＋ 開關），開了虛線底下一列：每種題型一格 −／秒數／＋（10 秒一格、下限 10）＋ TIME LIMIT 總時間（一度有一行小字講總時間怎麼來、按 Start 才倒數，使用者「拿掉」）；學生視窗標題右邊照產品放倒數 chip（mm:ss）。⑥提 PM：Test Mode 開著**不顯示每題對錯**，交卷後在成績頁看（產品現在不管開不開都立刻顯示；沒畫，等 PM 定）。demo：`&exam=1`、`&exam=1&start=1`。

## 查到的、沒畫的

1. 現行字彙類題目的字是後端從教學點清單隨機抽（commerce-api `getGenerateQuestions` 帶 `vocab` → dash-py `pinyin_meaning.py` 隨機 sample），教學點不夠題數才從文章抓。這一版改成老師勾點，抽字的隨機性仍在後端（勾 7 個點、要 2 題，哪 2 個點被抽到還是後端決定）——要不要給每點各幾題（像 v7 第二步的 −／+），待討論。
2. 第一步 Generate 之後建 practice 的 ProcessingDialog 沒畫（MC 建完 status 是不是直接 COMPLETE 無法確認，v14 E1）。
3. 已指派後回來改題、追加題的版本確認沒畫（走練習本身的 draft／發布影響，v16 待定 4）。
4. 「Add 0 questions」那顆鈕：Generate more 面板全 0 時灰著、原因在格子底列（R9）。
5. Answer conditions 現在存在題庫題目上（`answerConditions.requiredConditions／notRequiredConditions`），Quiz 的 `mcQuestions` 快照沒有這個欄位；Content Base 題進 Quiz 之後條件要跟著存、改題後重產的時機要定（跟 v18 查到的第 4 條同一題）。改完題目後「條件更新中」的等待狀態沒畫。2026-11-16 起老師可以改條件：老師改過的條件，改題目或建議答案時後端重產會不會蓋掉，待問工程（跟 v18 同一題；建議老師改過就不再自動重產）。
6. Test Mode 待工程三條：(a) 時間到時進行中的那題怎麼收尾（定案 ④：錄完、評完才交卷）；(b) 總時間由前端算好存 `timeLimit`，還是各題型秒數也要存（老師回來改題數時要重算）；(c) Content Base 對話式在 Quiz 裡的追問、重錄次數是否沿用 Free response 的上限。待 PM 兩條：預設秒數 30／30／120；Test Mode 開著不顯示對錯（定案 ⑥）。
7. **要問工程**：題數上限拿掉之後，後端一次能生多少題 True/False／Multiple choice？題庫頁每類最多 10 是前端擋的，生成 API（commerce-api `getGenerateQuestions` → dash-py）有沒有自己的上限、題數多時要多久，無法確認。

8. **要問工程**：課文只用聽的（Audio only 底下 ARTICLE 選 Audio only）要存在練習設定上，課文音檔有沒有現成的（專案朗讀音檔）還是要另外產；學生可不可以重播、播放時能不能同時答題，沒畫。

## Change log

| 日期 | 改了什麼 | 說明 |
|---|---|---|
| 2026-11-18 | 第二步只剩一題時，眉標右邊那句 *Last question — a … needs at least one, so it can’t be removed* 拿掉；那題的刪除鈕照樣停用 | 使用者「拿掉」。v17 同一句一起拿掉 |
| 2026-11-16 | 第三步 Practice mode 選 **Audio only** 時，右邊多一格 **ARTICLE**（Text visible｜Audio only）：課文也只聽時，學生視窗左欄課文換成一顆大播放鈕 *Listen to the article · Normal · Xiaorou*（同題目那顆的樣子），開始頁那句改 *The article and questions are read aloud*；Text visible 時跟以前一樣 | 使用者「Audio only 可以再選擇課文是不是也只用聽的」。原本 Audio only 時那格是一句說明（*Questions are read aloud…*），換成這個控制項；Practice mode 回 Text visible 課文一定看得到。Speed／Voice 課文跟題目共用。demo `&audio=1&artaudio=1`。待問工程見第 8 條 |
| 2026-11-16 | 第二步 Content Base 題卡打開時 **Answer conditions 可以改**：每條一個輸入框、✕ 刪、Must cover／Not required 各一顆 Add；收起時照舊唯讀清單、空白條丟掉；改了的 AI 題掛 Edited；拿掉「you can’t edit them directly」那句 | 使用者「New Comprehension Quiz 的 Answer conditions 要可以修改」。直接搬 v18 11/13 那套（CSS、renderConds、closeQ、condadd／condrm、輸入）；Suggested answer 標題旁的口說版說明句沒動。待問工程：老師改過的條件，改題後重產會不會蓋掉 |
| 2026-11-13 | 第二步的 **Generate more** 從眉標右邊搬到題目清單最底下（置中；打開的面板也在底下，上面一條虛線） | 使用者「兩個題型的 Generate more 都改到放在最底下」（v17、v18 一起）。新題本來就接在清單最後，按鈕就在新題會出現的地方 |
| 2026-11-12 | 學生視窗 Question N of M 清單每列加型別 chip | 使用者貼清單截圖「在這裡的也放上是什麼題型的 tag」。題號、播放鍵之後放同題卡的 tchip（True/False 綠、Multi-Choice 藍、Content Base 紫＋麥克風），22px 小一號。同日另兩條小改：Test Mode 卡底下那行小字拿掉、標籤從 10px 小標改 14px（使用者「這列太小了」） |
| 2026-11-12 | 第三步拆成三塊：**Settings（工具列）→ Test Mode → Preview（Student view）**，各隔 32px | 使用者「放在 setting 底下但是 UI 有間隔一點」→「setting test mode content」→（Content 不是課文）→「preview」。工具列自己一張卡（底線拿掉）、Test Mode 卡在中間、Student view ＋ 底下那行小字自己一張卡（灰地板跟著圓角）。R5「預覽和設定同一張卡」在這張卡上讓位給使用者的順序；工具列改哪格、底下視窗照樣跟著變 |
| 2026-11-12 | Test Mode 回到一張卡：開關在上，開了才展開每種題型的秒數格 ＋ 總時間 | 使用者「test mode 集合在一張卡片，先用一個 toggle 打開再顯示」。工具列第二行的 TEST MODE 格與第三行拿掉，卡回到 Settings 卡底下（外殼照產品 ExamModeCard）；展開區＝同一組秒數格 ＋ 總時間 ＋ 一行小字；視窗倒數 chip、開始頁不變 |
| 2026-11-12 | **Test Mode 併進工具列**（同日改回一張卡，見上一列）：TEST MODE Off｜On；開了第三行每種題型一格「每題幾秒」＋ 總時間；視窗倒數 chip ＋ 開始頁；底下那張卡拿掉 | 使用者「討論 v17 的 test mode」→「一題一題問我」→ 六題定案（見「這一版定了什麼」最後一條）。滑桿、建議值、`renderExamCard` 與 `.slider`／`.exam-bd` CSS 一起拿掉；總時間即時算（Generate more 之後不用重設）。mock：3 T/F × 30s ＋ 5 MC × 30s ＋ 2 Content Base × 120s ＝ 8 min。**沒畫**：不顯示對錯（待 PM）、時間到的收尾（待工程） |
| 2026-11-12 | Content Base 題卡加 **Answer conditions**（Must cover／Not required，唯讀） | 使用者在 v18 加回之後問「content base 有這個機制嗎」→ 產品題庫頁兩類 Q&A 題都掛同一個元件 → 「好」。跟 v18 同一套 `.acond`：建議答案底下紫框、鉛筆打開多一行說明（口說版文案）、手寫題存檔前只有說明；mock 五題各帶 `rc`／`nr`（ART_OE 第三格）。T/F、MC 不動。**沒畫**：改完題目後「條件更新中」 |
| 2026-11-04 | 上下鈕搬到左邊把手那一欄 | 使用者「上下擺在這裡」（指拖曳把手）。題卡左邊一條直欄：∧、把手、∨，垂直置中；右邊只剩 Edit、Delete |
| 2026-11-04 | 題號膠囊改灰階、加上移／下移鈕 | 使用者「把 Q1 的 tag 改成灰階，增加往上往下改順序的按鈕」。Q 膠囊從綠底白字改灰底深灰字；題卡右邊 Edit 前多 ↑ ↓，第一題的 ↑、最後一題的 ↓ 灰掉；拖曳換序照留 |
| 2026-11-04 | 題數欄改成「− 數字 ＋」 | 使用者「這個模組改成 - 1 ＋，兩邊的都改」。樣子照 v20 的 .stp；數字仍可直接打；0 時 − 灰掉。v17／v18 同一套，Generate more 也是 |
| 2026-11-04 | Generate more 鈕加重 | 使用者「太不明顯」。從灰細框小鈕改成綠框、淺綠實底、綠字粗體、38px 高；位置不動（第二步眉標右邊） |
| 2026-11-04 | 第二步眉標的提示句拿掉 | 使用者「拿掉 True/False N · Multi-Choice N · drag to reorder · click a question to edit it」。眉標只剩 QUESTIONS · N 和 Generate more；只剩一題時「Last question…」那句照留 |
| 2026-11-04 | 總數搬到題型卡之上 | 使用者「0 questions 總數往上擺在題型之上」。卡片左上一行大字總數「N questions」，底列整條拿掉 |
| 2026-11-11 | 手寫 Content Base：建議答案可以讓 AI 寫 | 使用者「手動的 Content Base 如果老師沒有自己輸入答案也可以 AI 生成」。手寫的 Content Base 卡展開時，建議答案欄 placeholder *What a good answer looks like — or let AI write it*；底下一列 **✦ AI writes the suggested answer**（同選擇題那顆的樣子）：題目有字、答案空的才能按，按了照課文寫一句（demo 對得上 mock 題就用它的答案），老師可以改。待問工程：生建議答案的 API（同 Free response 的生題） |
| 2026-11-11 | 第二步的 ARTICLE 可收合 | 使用者「改成可以收合」→「更明顯一點，做成一個寬幅的 btn」。眉標拿掉，換成一顆寬幅按鈕（同教學點 frame 的 Add teaching points 列）：有框、左 📖 **Article · 我的一天**、小字 *Comprehension questions are written from this*、右端箭頭；hover 淺綠；打開時按鈕和課文是**同一個容器**（使用者「拉開的時候讓兩塊的容器是一起的」）：一個綠框包住、按鈕當標頭（淺綠底、底下一條細線）、箭頭轉 180°、課文在同一個框裡。預設展開，`&art=0` 收起 |
| 2026-11-11 | 第二步、第三步都顯示課文 | 使用者「第二步跟第三步都顯示文章」。第二步：ARTICLE 那塊（跟第一步同一個）放在 Questions 上面。第三步：學生視窗改兩欄（從 v18 搬）——左 Content 課文逐詞＋拼音（拼音照 PINYIN 設定）、右一題；Audio only 時課文照樣在（聽的是題目不是課文） |
| 2026-11-11 | 三步變四步：Settings & Preview 用共用元件（§10 R11），Listening 卡收掉 | 使用者「新增 Settings 共用元件呢」（貼元件總表 #settings）。Content → **Edit Questions** → **Settings & Preview** → Assign。第三步＝工具列 ＋ Student view 視窗同一張卡（從 v18 搬）：**PRACTICE MODE**（Text visible｜Audio only ＝ 聽力版，Audio only 時 Pinyin 格換成一句 *Questions are read aloud — students see only the answer choices*）‖ **PINYIN**（Shown｜Hidden｜Choice by student）／ **SPEED**｜**VOICE**。沒 Max tries（一題答一次）、沒 Translation（題目不翻）。視窗＝學生端一題：Q 號、型別 chip；Text visible 時拼音＋題目＋小喇叭，Audio only 時換成虛線框裡一顆大播放鈕 *Listen, then answer · Normal · Xiaorou*；底下 True｜False、A–D，Content Base 是紫色麥克風 *Tap to record your answer*；Question N of M 下拉換題；右上齒輪（Choice by student 才有 Pinyin 列）。**Test Mode 卡搬到這一步**、接在 Settings 卡底下；開了視窗標題多 *· 5 min*。第二步只剩題目，Save 搬到第三步。元件總表 §10 多一顆 Comprehension Quiz 的 tab 與一列。demo：`&audio=1`、`&py=shown|hidden|choice`、`&sc=1`、`&voice=1`、`&list=1`。題目拼音只有 mock 那幾題有（ART_PY），老師手寫的存檔時後端產 |
| 2026-11-11 | 新功能 ②：手寫選擇題讓 AI 寫錯誤選項 | 使用者「老師手寫問題後，多選題只要自己輸入答案後，其他三個錯誤選項 AI 可以新增」。手寫的 Multi-Choice 卡展開時，選項格的 placeholder 改成 *Correct answer*（點了正解的那格）／*Wrong answer*；選項底下一列：左邊說明、右邊 **✦ AI writes the wrong answers** 鈕。題目和正解都有字、且還有空格才能按；按了把空的格填上（demo 照問法挑一組干擾詞），老師照樣可以改；四格都有字時說明變 *All four filled — edit any of them*。待問工程：生干擾詞的 API |
| 2026-11-11 | 新功能 ①：Listening 開關卡 | 使用者「聽力版本：三種題型都可以用聽的，是否跟多選一開始會給用戶看答案」。第二步 Test Mode 卡底下多一張 **Listening** 開關卡（耳機 icon）：*Questions are read aloud instead of shown. Students see only the answer choices.* 開了底下列三種題型怎麼聽：True/False 敘述唸出來 → True／False 看得到；Multi-Choice 題目唸出來 → A–D 看得到；Content Base 題目唸出來 → 學生用說的；小字 *Audio is made from each question when you save. Students can replay it.* 我的回答：**選項一開始就給看**（跟現在選擇題一樣），只有題目／敘述藏起來改成播放。`&listen=1`。待定：重播次數、語速／聲音要不要跟其他練習的 Voice／Speed 設定、Test Mode 倒數一題幾秒；學生端畫面等細談 |
| 2026-11-11 | 第二步眉標那句「N of your own questions still need … before you can save」拿掉 | 使用者「拿掉」。手寫題沒寫完 Save 仍灰著，打開的空白卡自己就是提示 |
| 2026-11-11 | 六張合成三張：一種型別一張，底下兩列題數 | 使用者「插圖可以合併成一個，變成底下兩個欄位」。每張卡＝AI 那張示意 → icon＋型別名（Content Base 掛 🎤 Spoken）→ 兩列 **✦ AI writes − N ＋**／**✎ You write − N ＋**。任一列有數字卡就亮框；總數六格相加。Generate more 面板同一張。下排 Write a … 卡、AI WRITES／YOU WRITE 小標都收掉 |
| 2026-11-11 | Write 收成下排的小標 | 使用者「Write 感覺可以統一成一個標題」。兩排各一個小標：上排 **AI WRITES**、下排 **YOU WRITE**（11px 大寫灰字）；下排卡名不再「Write a …」，只剩型別名（True/False｜Multiple choice｜Content Base 🎤 Spoken），鉛筆 icon 照舊分辨 |
| 2026-11-11 | 副標全拿掉，Content Base 掛 🎤 Spoken 小標 | 使用者「都不用副標，只要凸顯 Content Base 是口說就好」。六張卡只剩名字；Content Base 和 Write a Content Base 的名字旁一顆紫色 **Spoken** 小標（mic icon），其餘卡沒有 |
| 2026-11-11 | 六張卡的副標縮短 | 使用者「這三個小題的副標又太多了」。上排 *Right or wrong?*／*One of four answers*／*Answered by speaking*；下排三張一律 *Written by you, not AI*。AI 怎麼評、題目從課文出都不在卡上講 |
| 2026-11-11 | 第三種題型改名 **Content Base**、學生用說的回答 | 使用者「Open-ended 應該要換個名詞」→ 討論（Short answer／Written answer／Content Base／Free response）→ 使用者定：**v18 練習改名 Free response；v17 這一種叫 Content Base，但用口說回答**。卡名 Content Base、說明 *Spoken answer from the article · AI checks it against the suggested answer*、icon record_voice_over、示意照 v18 的 Content Base（課文灰條＋開麥的題目）；下排 Write a Content Base。第二步 chip 前面一支麥克風；建議答案欄的小字改 *the AI compares the student’s spoken answer against this*。程式裡的 key 仍叫 oe。學生端口說作答、算分、Test Mode 秒數：使用者「等下再細談」 |
| 2026-11-11 | Write a … 三張卡的示意改成虛線灰條 | 使用者「這三個配圖像是讓用戶直接在這頁打，會帶出錯誤的意圖」。原本畫成輸入框＋placeholder（*Type your statement*／*Type your question*／*Suggested answer*），像能打字。改成跟上排 AI 卡同一套灰條示意，只是虛線（＝還沒寫）＋前面一支小鉛筆；True｜False、A–D、答案框照舊虛線。沒有任何文字 |
| 2026-11-11 | Open-ended Questions 的 Content Base 題搬進來：第三種題型 **Open-ended** | 使用者「把現在 Open-ended Questions 的 content based question 也改到 Comprehension Quiz，因為都是考 Comprehension 的內容」。What to ask 變六張 3×2：上排 AI 出的 True/False｜Multiple choice｜**Open-ended**（*Answered from the article in their own words*，紫色、icon question_answer 照題庫 Q&A），下排 Write a True/False｜Write a Multiple choice｜**Write an Open-ended**（*Your own question and suggested answer — not AI*）。第二步 Open-ended 題卡：chip 紫色 *Open-ended*；收起時列 **SUGGESTED ANSWER**（照 v18）；展開＝題目一欄＋ *Suggested answer · the AI compares the student’s answer against this* 一欄，沒有選項。手寫的 Open-ended 要有題目和建議答案才能 Save。mock 題照 v18 的 Content Base 五題。demo：`&own=TF,MC,OE`。**待定**：①名字（Open-ended／Content Base／Short answer）②v18 Open-ended Questions 是不是只剩 Extension ③學生端在 Quiz 裡打字作答、AI 比對建議答案、Test Mode 計時——現行 Comprehension Quiz 只有選擇題，要問工程 |
| 2026-11-09 | What to ask 從兩張變四張 2×2：下排「Write my own」老師自己出題 | 使用者「讓 question type 可以讓老師新增手寫問題的選項」→「卡裡最上面先選 True/False｜Multiple choice 在第一步」→「變成四張卡片 2x2 排版」。上排照舊（AI 出的 True/False、Multiple choice），下排 **Write a True/False**（*Your own statement — not AI*）、**Write a Multiple choice**（*Your own question and answers — not AI*；一度叫 Write my own …，使用者從四組選項選了動詞開頭的 B）：示意是虛線的空題目欄＋空的 True｜False／A–D，鉛筆 icon 用該型別的顏色，題數 − N ＋ 同一套；總數四格相加。填幾題，第二步就在最後出幾張空白題卡（型別固定、掛 **Yours**、直接打開），寫題目、選項、點正解。手寫題沒寫完（題目或任一選項空白）Save 灰著、眉標寫 *N of your own questions still need a question and answers before you can save*；手寫題不掛 Edited。只填手寫題時第一步主鈕是 Next、不跑 Generating。Generate more 面板同一張四卡，手寫的接在最後、不掛 New。中間兩版（第三張卡；卡裡切型別）作廢。demo：`&own=TF,MC` |
| 2026-11-04 | 底列拿掉「Ask for at least one question」 | 使用者「也拿掉」。底列只剩「N questions」；0 題時 Generate／Add 照樣灰著，但畫面上不再寫原因（跟判準 R9「灰著要給原因」不一致，使用者定） |
| 2026-11-04 | 第二步題卡答案直接展開 | 使用者「答案直接展開」。收起的題卡也列出選項（True/False 兩格、Multiple choice A–D），正解綠／藍底加勾，唯讀；鉛筆打開才是可改的題目欄與選項 |
| 2026-11-04 | 底列拿掉「All questions are written from the whole article」 | 使用者「不用副標」。底列只剩總數，0 題時加原因 |
| 2026-11-04 | 拿掉「Use a suggested mix」 | 使用者問怎麼算的（固定 3＋5，我定的，不看課文；產品題庫頁沒有建議值）→「拿掉好了」。總數 0 時底列只剩原因 *Ask for at least one question*；&filled=1 的 demo 數字照留 |
| 2026-11-04 | 題型卡的範例改成示意灰條 | 使用者問範例會不會跟文章變（不會，寫死的「我的一天」）→「改示意」。題目、選項畫成灰條，只留 True／False、A–D 字樣和正解顏色；Generate 前沒有真題，放真句子會被當成預告、換專案也對不上 |
| 2026-11-04 | 拿掉「up to 10 of each」上限 | 使用者「這個限制可以拿掉嗎」。查 4bf77dc2：10 是題庫頁 `bulk-question-type-section.js` 前端自己擋的（`current < 10`、`numVal >= 10` 灰掉加號），不是練習的規則。數字欄只留下限 0、底列那句拿掉。後端一次生成有沒有上限待問工程（見下面第 5 條） |
| 2026-11-04 | 第一步先看課文、再問題型；課文不斷句 | 使用者「先顯示 Article 內容，再問題目；Article 不用斷句」。順序改成 專案 → 名稱 → Article → What to ask；課文從一句一列加編號改成整篇一段 |
| 2026-11-04 | What to ask 兩種題型改成圖示卡 | 使用者「True/False 跟 Multiple choice 用圖示來顯示」。兩張並排的卡，上半是學生會看到的一題縮圖（True/False：我每天八点起床。＋ True｜False，正解綠框；Multiple choice：我几点起床？＋ A–D 四格，正解藍框，題目照第二步的範例），下半 icon ＋ 名稱 ＋ 一句（Is the statement right?／Pick one of four answers）＋ 題數欄；填了題數那張外框換成該型別的顏色 |
| 2026-11-04 | 只考 Comprehension：What to ask 只問題型、教學點 frame 拿掉 | 使用者「只會剩下考 Comprehension，所以就不用問要不要考 Pinyin/Meaning 了，只要問考試的題型」。格子收成兩列：True/False（A statement about the article — students pick True or False）、Multiple choice（A question about the article with four choices），各 0–10；底列寫 *All questions are written from the whole article*，建議值 3＋5。沒有字彙題，教學點 frame 用不到、一起拿掉；第二步題卡上的分類 chip（每題都是 Comprehension）拿掉，Generate more 同一張兩列 |
| 2026-11-03 | 拿掉 Fill in blank：格子 4×2 → 3×2、說明句改字 | v19（2026-10-27）定 Fill in blank 變成獨立的 Sentence Cloze、Comprehension Quiz 不再出。這裡跟著改：WHAT TO ASK 剩 Comprehension／Pinyin／Meaning × True/False／Multiple choice，建議值 3/3、2、2；教學點框說明句 *Pinyin and Meaning questions are written from the points you tick* |
| 2026-11-03 | Custom teaching point 旁加型別下拉 | 使用者「所有的 add 應該都要有詞性」：Vocabulary 那顆型別下拉（八個型別、預設 Word / Vocabulary，照產品 CustomWordDialog）套到八張卡；v17／v20／v21 補上，加的點記 ptype。產品的 teaching-point-picker 沒有型別，交接時要提 |
| 2026-11-02 | From project 那列右邊的 N to add · M words 拿掉 | 使用者「拿掉」。那行是 v4 第二輪自己加的，產品沒有。摺疊列只剩箭頭＋Add teaching points from project。共用元件，v4／v6／v17／v20／v21 一起改 |
| 2026-11-02 | 拿掉「沒字題時教學點 frame 淡掉＋這次用不到」 | 使用者「先拿掉」。Pinyin／Meaning 都 0 題時 frame 跟平常一樣，說明句固定寫 *Pinyin, Meaning and Fill in blank questions are written from the points you tick*（這句的 Fill in blank 要等 v19 那條改） |
| 2026-11-02 | From project 池子裡已在清單的點改綠色 | 使用者「已經選取過的灰色改成綠色的」：原本 opacity .5 灰掉，改成跟勾選 chip 同一套綠框淡綠底、綠勾，仍不能點。共用元件，v4／v6／v17／v20／v21 一起改 |
| 2026-11-02 | 教學點 frame 底下兩行併一行 | 使用者「這裡改成一句就好」：ADD TEACHING POINTS 小標拿掉，From Project 摺疊列改寫 **Add teaching points from project**（右邊 N to add · M words、底下 Custom teaching point 輸入欄不變）。共用元件，v4／v6／v17／v20／v21 一起改；定案記在 `iterations/practice-components.html` §7 |
| 2026-10-23 | 第一輪：拿掉題庫、第一步選專案＋勾教學點＋填各類題數、第二步可改可追加 | 使用者「先做一個 Comprehension Quiz 的新版本，一開始一樣先帶出 teaching point 然後拿掉 Question bank，老師要出什麼題目在 practice 選就好」。從 v14 proposal 分岔 |
| 2026-10-23 | 第二輪：What to ask 格子加回題庫頁的 icon | 使用者「參考舊的 UI 增加 icon」。列頭一顆 40px 圓角 tile（chat_bubble_outline／translate／swap_horiz／edit_note，照 bulk-question-type-section.js 的 CATEGORY_ICONS），用這張卡的紫；欄頭 True/False 綠 check_circle、Multiple choice 藍 list_alt（SECTION_STYLES） |
| 2026-10-23 | 第三輪：題數預設改回全 0 | 使用者問「預設的數字是怎麼來的」。第一輪的 3/3/0/0/2/2/2 是我為 demo 編的；產品題庫頁每類預設 0、老師自己填（step2-configure-generate.js DEFAULT_CONFIG）。改成全 0，Generate 灰著、底列寫「Ask for at least one question」；demo 用的那組改掛 `&filled=1`，第二步以後自動帶 |
| 2026-10-23 | 第四輪：底列加「Not sure? Use a suggested mix」一鍵帶入 | 使用者「好」。總數 0 時底列多一顆連結字，按了帶入 3/3 Comprehension、2 Pinyin、2 Meaning、2 Fill in blank；不預填 |
| 2026-10-23 | 第五輪：那句縮成「Use a suggested mix」 | 使用者「有更簡短的說法嗎」。數字拿掉，按了格子自己會填；hover 的 title 留完整說明 |
