# v4 — 優化 Practice-Vocabulary Mirroring

- **功能名稱**：優化 Practice-Vocabulary Mirroring（建立流程）
- **網址**：https://dahua-dash-dev.web.app/dashboard/practice/create/?type=VOCABULARY&subType=MIRRORING
  （Choose Practice Type 點 **Vocabulary Mirroring** 進來的那條；`subType` 是 `AddNewPracticeDialog.buildCreateUrl()` 帶上的）
- **截圖**：使用者尚未提供。基準檔照程式碼複刻，之後拿實機截圖對一次
- **分岔自**：v3（版本線上接續；設計檔不沿用 v3 的檔案——v3 是 Content Mirroring 的三步，跟這條建立流程沒有一條連結相通）
- **日期**：2026-09-10（登記）
- **小 spec**：`spec.html`（三步的現況逐塊拆解 ＋ 學生端「一個字＝三張卡」＋ 查到的問題 ＋ 待決事項）
- **設計檔**：`create-vocabulary.html`（基準檔，現行產品的複刻）、`proposal.html`（**提案**，第一輪只換共用元件）
- **範圍**：New Vocabulary Mirroring 這條建立流程的三步。學生端不改，但第二步的預覽要對照它，所以 spec §4 把它抄出來了
- **程式碼基準**：dahua-dash `origin/develop` @ `77ea5d6f`（2026-09-10 fetch）
  - v3 收在 `17990056`。中間 4 個 commit（#930 word-bank add-words validation、reading challenge QA / spelling）
    用 `git diff --name-only` 確認**沒有動到 Vocabulary 建立流程或學生端 vocabulary 的任何一支檔案**
- **狀態**：**已定稿、已交接**（2026-09-16；2026-09-29 依使用者指示回套畫廊的兩條，交接包複本未動）。交接包：`handoff/vocabulary-mirroring/`（HANDOFF.md ＋ API-CONTRACT.md ＋ 原型複本 ＋ 入口頁），線上 https://project-logeg.vercel.app/handoff/vocabulary-mirroring/ 。E1–E6 全部寫進契約，等工程回答。
- 走過的輪次：第一輪（2026-09-10）換共用元件；第二輪（2026-09-11）第一步的 teaching point 可勾選、可加字（邏輯照 planning mode）；第三輪 Next 取代 Load Content；第四輪流程改四步 Teaching Points → Vocabulary → Settings → Assign；第五輪第二步 Vocabulary 重畫（一個字＝三張卡、拿掉 Add Vocab、圖片可上傳）；第六～十八輪（2026-09-11）第二步與第三步逐項修（見 change log）；**第十九輪（2026-09-15）第三步 Settings 照 R11 改成工具列＋畫布；第二十輪（2026-09-15）第二步的卡：練不練全部用眼睛、例句可再生（一次一句、最多再三句，新能力 E6）；第二十一輪（2026-09-15）群組標頭加 Word cards／Examples 兩顆組開關；第二十二輪 Examples 改成下拉選 0～n 句；第二十三輪標頭計數拿掉、組開關靠右；第二十四輪上傳圖片的對話框；第二十五輪 Back 回第一步不再鎖住（practice 在第二步才存）；第二十六輪多專案的名稱 A + B；第二十七輪例句卡文字置右；第二十八輪拼音逐詞斷開；第二十九輪例句置左；第三十輪卡的開關收成標頭 chip、眼睛只剩圖片那一顆；第三十一輪圖片也有組開關；第三十二輪圖上的眼睛改成 ☑ Image chip；第三十七輪（交接後）Hide 改回眼睛、總開關做成小工具列；第三十八輪小工具列加標題 Apply to all words；第三十九輪標題／工具列／卡的間距**。**未部署**（等使用者說 OK 才 `vercel deploy`）

## 登記時就查到的兩件事（寫進 spec，不是改動）

1. **「攤平後 Practice Type 那一步是多餘的，可以順手拿掉」——產品已經拿掉了。**
   `practice-design-rules.html` §4 與 8/31 的 inventory 都還把它列成待刪；
   現行 `STEPS_BY_TYPE[VOCABULARY]` 是 `['Vocabulary','Settings','Assign Practice']` 三步，
   `practice-stepper-config.js` 的註解直接寫 *the sub type … arrives in the URL, so no flow asks for it again*。
   留下的痕跡只剩第二步的檔名 `vocabulary-step-three-section.js`。
2. **老師在第二步設的 Pinyin / Translation / Image，學生端的 Vocabulary 畫面一個都沒讀。**
   `assignments/content/index.js` 渲染 `<VocabularyPractice>` 時只傳 `maxAttempts / speedPreference / changeSpeed`；
   `use-vocabulary-practice.js` 的 `showPinyin` 起始值是 `useState(!isESL)`、`showTranslation` 是 `useState(true)`，
   `imagePreference` 在整個 `assignments/` 底下沒有任何引用。
   同一個檔案裡 Mirroring 那條路徑有 `setShowPinyin(pinyinPreference !== 'NO_PINYIN')`、Sentence Scramble 有把 `pinyinPreference` 傳下去——
   **只有 Vocabulary 沒有**。這是「是不是有意的」那一類，要問工程。

## 基準檔怎麼看

`create-vocabulary.html`，用網址參數切狀態：

| 網址 | 看到什麼 |
|---|---|
| `?step=0&empty=1` | 第一步 Vocabulary —— 還沒選專案（只有一句 *Pick at least one project…*） |
| `?step=0` | 第一步，已選一個專案 —— Teaching Points Preview ＋ Load Content；**Next 是灰的** |
| `?step=0&gen=1` | 按下 Load Content 之後 —— practice 已建立、status GENERATING，第一步 inline 的 loading 卡（ProcessingDialog 在 step 0 不會開） |
| `?step=0&loaded=1` | 生詞載好了 —— Autocomplete 鎖住，Vocabulary Content 手風琴 ＋ 生詞卡（編輯／隱藏／選圖／Read Sentences Only） |
| `?step=1` | 第二步 Settings —— Practice Name、Display Settings（三個下拉印 enum）、Audio Settings、Max attempts、兩欄 Vocabulary Preview |
| `?step=1&img=0` | 第二步，Image 設成 HIDE（只影響這一頁的預覽） |
| `?step=1&banner=1` | 第二步，改了 Speed／Voice 之後音檔重產中（Alert ＋ ProcessingIndicator，兩個下拉 disabled） |
| `?step=2` / `?step=2&assigned=1` | 第三步 Assign Practice（八種共用），未指派／已指派 |
| `?step=1&dlg=1` | Generating audio… 全螢幕遮罩 |

## 提案怎麼看

`proposal.html`，`?step=` 從 1 數（基準檔仍從 0 數）：

| 網址 | 看到什麼 |
|---|---|
| `?step=1`（從頭走：還沒選專案）/ `&sel=1` 已選 / `&dd=1` / `&pool=1` / `&gen=1` | 第一步 Teaching Points：Project 選單（c-dropdown-menu-18，多選）、Practice name（c-input-2）、可勾的 teaching point frame ＋ Add words；`&gen=1` 生成中 |
| `?step=2` / `&upload=1` / `&more=1` / `&updlg=1` / `&updlg=2` | 第二步 Vocabulary：一個字一列、右邊是學生卡；`&upload=1` 第一個字換成老師上傳的圖；`&more=1` 第一個字已生成到五句；`&updlg=1` 上傳對話框選檔、`&updlg=2` 預覽。`?step=1&back=1` 是從這裡 Back 回第一步的樣子（第二十五輪起不鎖：可以重選，多勾的掛 New） |
| `?step=3` / `&all=1` / `&voice=1` / `&settings=1` / `&tip=1` / `&banner=1` | 第三步 Settings（**R11：工具列＋畫布，同一張卡**）：工具列 Pinyin｜Translation｜Image ／ Speed｜Voice ‖ Auto pass ⓘ；畫布是學生的主欄（頂欄、進度條、齒輪、一疊卡、Play 鈕、`Card 1 of N ▾`）。`&all=1` 卡片清單原地展開、`&voice=1` Voice 下拉打開、`&settings=1` 學生的齒輪面板打開（Translation 預設 Their choice 所以有齒輪）、`&tip=1` Auto pass 說明開著、`&banner=1` 音檔重產中 |
| `?step=4&pick=3b,4a&roster=4a&assigned=1` | 第四步 Assign：已指派一班、再派兩班、4A 名冊展開（郑雅文標 In Chinese 3B） |
| `?step=4&pick=4a&review=1&assigned=1` | 送出前的預覽框 |

## Change log

<!-- 開始改之後，改一項補一行。
     只記「設計改了什麼」——基準檔的複刻與修正、mock 自己的 bug，
     都是鷹架不是改動，不進這張表。 -->

| 端 | 改了什麼 | 說明 |
|---|---|---|
| 老師 | **畫廊回套（2026-09-29）：清單每列一顆小播放鍵** | 使用者看共用設定畫廊時定的兩條（2026-09-23），回套到已交接的 v4（使用者 2026-09-29：「已交接但可以更新」）。①Card x of N 展開的清單每列一顆小播放鍵，點了只聽那一張、不換預覽（點列本身仍是換卡＋自動播，照產品）；②主 Play 鈕放大成實心主綠（純視覺，記檔頭）。交接包 `handoff/vocabulary-mirroring/` 的複本沒有跟著改。 |
| 老師 | **第一輪：只換 v3 動過的共用元件，其餘原封不動** | 使用者指示（2026-09-10）。「共用」照 `practice-design-rules.html` §1 那張表：八張卡共用的 Stepper、標題前的型別圖示、頁腳、換步驟捲回最上面、Assign 整步；五種共用的 Audio Settings（Speed／Voice）與 Max attempts。Audio Mode 卡 Vocabulary 本來就沒有。再加 v3 在第一步換的三個 ReUI 元件（見下一列）。**刻意留著沒動的**：Load Content 那條、載入後的生詞卡、Practice Config 分隔線、Display Settings 手風琴（三個下拉還是印 enum）、Vocabulary Preview 兩欄卡——所以第二步現在是新舊並置，落差看得見，那就是下一輪要決定的東西。 |
| 老師 | 第一步的三個欄位換成 v3 用的 ReUI 元件 | 第一版漏了，使用者指出（2026-09-10）後補。①Project 選單 → `c-dropdown-menu-18`（標籤在上、outline 觸發鈕、選單有群組標題、每列 語言 mark ＋ 名稱 ＋ 級數 ＋ 詞數）。**Vocabulary 是多選**，所以跟 v3 有一處不同：點一下切換勾選、選單不關、觸發鈕把選到的專案一個一個列出來；practice 建好之後鎖住（照產品 `disabled={isPracticeReady}`），鎖頭取代箭頭。②Practice name → `c-input-2`，**從第二步搬到第一步**——v3 同一個決定，理由一樣（選 Project 的當下它就被填好了）；產品取的是第一個選到的專案，說明文字照寫 *Filled in from the first project*。③Teaching Points Preview → `c-frame-6` ghost frame，一個專案一個，底色用 Vocabulary 欄的 wash `#FFF8E7`；Title `Teaching points`、Description `⟨專案名⟩ · N words`，收掉原本的「Teaching Points Preview」大標與那句 *Review the teaching points…*。Load Content 那條沒動。`?step=0&dd=1` 看選單打開。 |
| 老師 | Stepper 換成 c-stepper-2、標題前加型別圖示 | 做法照 v3。圖示用 `PRACTICE_TYPE_ENTRIES` 裡 VOCABULARY_MIRRORING 自己的 tag（`#FEF3C7` / `#D97706` / `ic:round-mic`），不是 v3 的綠。同理送出前預覽框裡的班名用 Vocabulary 欄的 label 色 `#8F6209`——v3 用 CONTENT 欄的 `#00754A`，這裡照同一條規則換成自己那一欄。 |
| 老師 | Audio Settings 面板 → Speed／Voice 兩列 chip | 照 v3：點一下＝選它＋聽它，`Their choice` 不給 ▶。`zh-CN` 只有一組所以沒有地區標籤。原本那句 *Controls audio playback speed, pronunciation precision, and voice.* 隨面板一起消失（v3 問題 3）。眉標用 v3 的 **On play**——它是那組元件的一部分，不是這裡新發明的。音檔重產中（`&banner=1`）整組變淡不能點，對應原本兩個下拉的 disabled。 |
| 老師 | Max attempts 欄位 → Move on after N tries ＋ 加減鈕 | 照 v3。**說明文字依型別**：Mirroring 寫 *on one sentence*，這裡照產品自己的字寫 *on one card*（`vocabulary-step-three-section.js`）。沒解 spec §5 問題 3——「一個字＝三張卡」仍然看不出來，這一輪不碰。 |
| 老師 | Assign 整步照 v3 搬回頁面 | 三段 Who does it／When／How it counts、一份時間套用到所有班、名冊是 diff、送出前預覽只講例外。頁腳一顆鈕依狀態換字（Assign to N classes／Done／Skip for now），跟 v3 那個「未定案」的版本一致——v3 定了什麼這裡就跟著。假資料（三個班、郑雅文同時在 3B 與 4A）跟 v3 同一份。 |
| 兩端 | 換步驟捲回最上面 | 照 v3。 |
| 老師 | **第二輪：第一步的 teaching point 可以勾選、可以加字** | 使用者指示（2026-09-11），邏輯參考 `teacher-planning.html` 的 Vocabulary 面板（`renderVocPointsPanel`），UI 沿 v3 的 frame／chip。每個專案一個 frame：標頭一顆全選框（全勾／部分／沒勾三態）＋ 專案名 ＋ `已選/總數`；teaching point 是勾選 chip，帶短型別標（Noun／Verb／Grammar…，照 planning 的 TPT；卡片上仍用產品的長標籤）。**Add words** 在同一個 frame 的第二個 panel：`From Project` 收合，展開是專案課文裡的詞（去重、去標點），已在清單裡的變灰打勾、其餘按 + 加入；`Custom word` 輸入 ＋ Add（Enter 也行）。加進來的字掛 **Added** 標、預設勾起來、歸在它所在的專案底下，不重複加。一個字都沒勾就不能 Load Content。生成後的 Vocabulary Content 與第二步的 Vocabulary Preview 只列勾起來的字；加進來的字的拼音／翻譯／例句由 AI 生，mock 不編，卡片上寫一句 *generated with the content*。**這是把「決定要練哪些字」提前到生成之前**——產品現在 hide 與 Add Vocab 都要等 `practice.id`，所以要問工程 createPractice 能不能吃一份字表（spec E4）。`?step=0&sel=1&pool=1` 看 From Project 展開。 |
| 兩版 | 提案的 `?step=` 改成從 1 數（2026-09-14） | 使用者指示。`?step=1` 就是第一步；v3、v4 兩份提案與 spec、版本頁、ITERATION 的連結一起改。基準檔維持從 0 數（照產品 `parseStepParam`）。 |
| 老師 | 第三十九輪：標題、總開關、卡的間距排版 | 使用者指示（2026-09-16）。原本標題「我的一天」跟兩層高的工具列掛在同一列上互相拉扯，工具列又跟底下的卡沒有對齊邊。改成：標題自己一行；總開關變成**整寬的一條**（左邊 Apply to all words、右邊三格），跟卡片同一個左右邊界；標題→工具列 12px、工具列→第一張卡 16px、卡與卡 12px。 |
| 老師 | 第三十八輪：總開關的小工具列加標題 `Apply to all words` | 使用者定案（2026-09-16）。三格的小標已經講了內容，標題講的是**範圍**——底下每列的 chip 是一個字，這三顆是全部的字。做成工具列最左邊一格（灰字、不是控制項），跟三格綁在一起，不放上方眉標（會跟「我的一天」打架）。候選過 For all words／Cards for students／Defaults。 |
| 老師 | 第三十七輪：Hide 改成眼睛；三顆總開關做成一條小工具列 | 使用者指示（2026-09-16，交接後補的兩件）。①每列右上的 `Hide` 文字鈕改回一顆眼睛（icon-only，藏著時畫 visibility），整列「不給學生」跟三十輪之前的語言一致，chip 仍是逐卡的勾選。②群組標頭右邊三顆太不明顯——原本是三顆灰字 ghost 鈕；改成一條白底小工具列，每格 10px 大寫小標在上（IMAGES／WORD CARDS／EXAMPLES）、控制項在下，跟第三步工具列同一種語言；全開時綠色（勾選框圖示＋綠底）、部分是不定框、全關紅字。 |
| 老師 | **第三十六輪：預覽做成一個視窗** | 使用者說帶子還是怪（2026-09-15），選了我提的方案 A。怪的原因：白工具列 → 淡綠帶子 → 灰學生畫面，三種材質疊在一起沒有關係，帶子在「宣告」底下是預覽而不是「看起來就是」預覽。改成：灰色地板（#DFE5EC）上一個有圓角、有陰影的視窗，框頂一條 34px 視窗列——左邊三個灰點、中間 *Student view*——學生的卡在框裡。「視窗裡的視窗＝預覽」是大家看過的慣例，不用文字解釋；第三十四輪的綠帶子與 2px 深灰線拿掉，底部那行只剩計數。v3 還是帶子，等使用者看過這一版再決定要不要跟。 視窗列的三個點是 macOS 的視窗鈕（使用者指出），改成左上角一個突起的 **Student view 標籤頁**（候選過：小螢幕圖示的列、沒有列只留角落小標）——「一個分頁」不綁平台。看過之後改成方案 B：視窗列留著，左邊一個小螢幕圖示（desktop_windows）取代三個點，中間 Student view。 |
| 老師 | 第三十五輪：畫布不畫學生端的頂欄與進度條 | 使用者指示（2026-09-15）。第十九輪照 practice-header.js 畫的那一段（Vocabulary Mirroring chip ＋ 練習名稱 ＋ 頭像、`1 / 17` 進度條）拿掉，畫布從齒輪與那疊卡開始。R11 說畫布是「學生的主欄」，這裡收窄成「學生看到的那張卡」——頂欄與進度條跟設定無關，佔了 90px 沒有在講任何一個控制項的效果。v3 的標題列（練習名稱＋齒輪）沒動。 |
| 老師 | 第三十四輪：工具列與畫布之間加一條分隔帶 | 使用者指示（2026-09-15），跟 v3 一起改：*Preview · what a student sees* 的灰帶，底部 *Preview ends here*。 使用者要再醒目一點：改用這一欄自己的色票（v3 CONTENT `#EFFBF4`／`#00754A`，v4 Vocabulary `#FFF8E7`／`#8F6209`），上緣 2px 同色線、字 12px。再改：線太多——兩邊細線與上下框線都拿掉，只留一條綠色帶子（v4 也用綠，不用琥珀），底下一條 2px 深灰 `#637381`。 |
| 老師 | Auto pass → Max tries | 使用者定案（2026-09-16）。討論過的：產品全名是 *Max attempts before auto pass*，用完次數不是跳過而是真的算過（星星顯示 3 顆、紀錄 `isAutoAdjusted`、成績頁掛 auto-pass 標），所以「auto pass」這個詞成績頁還在用。工具列只留 *AUTO PASS* 四個字時，數字沒有意思。選了最乾淨的 **MAX TRIES · [− 3 +] ＋ ⓘ**，後果只在 tooltip：*How many times a student may retry one sentence before it is let through — the sentence then counts as passed (auto pass, default 3).*（v4 寫 card）。R11 表格那一列跟著改。 |
| 老師 | 第三十三輪：Their choice → Choice by student | 使用者指示（2026-09-15），跟 v3 一起改。第三步工具列的 Pinyin／Translation／Speed 三處。 |
| 老師 | 第三十二輪：圖片的眼睛也改成 chip | 使用者指示（2026-09-15）。每張圖右上的眼睛拿掉，標頭 chip 列最前面多一顆 `☑ Image`（它是字卡的一部分，所以排在 Word 前面）。關掉時大圖變成 No image、縮圖列收起，跟第六輪一樣。**整頁沒有眼睛了**：Image／Word／Example 全是同一列的勾選 chip，群組標頭三顆是它們的總開關。 |
| 老師 | 第三十一輪：圖片也有組開關 | 使用者指示（2026-09-15）。群組標頭右邊多一顆 `Images · 5 of 5`，跟 Word cards 同一種三態鈕：全開按了全關、部分或全關按了全開，全關時變灰、計數變紅。文法點沒有圖不算。每張圖右上的眼睛照留當例外——先全關再把某個字的圖打開，計數會顯示 `1 of 5`。現在群組標頭三顆：Images／Word cards／Examples，跟第三步工具列第一行 Pinyin／Translation／Image 是同一組概念的兩個層級（這裡是老師選內容，那裡是學生畫面顯不顯示）。 |
| 老師 | **第三十輪：眼睛太多——「哪幾張卡要練」收成標頭列的一組 chip** | 使用者指示（2026-09-15，選了我提的方案 A）。第二十輪把 Practised 換成眼睛之後，一列字有 5～8 顆眼睛、整頁四十幾顆：整個字、單張卡、圖片、全部四種範圍共用同一個圖示。改法：每列標頭序號旁邊一組多選 chip `☑ Word ☑ Example 1 ☑ Example 2 …`，照學生練的順序排，跟第一步 teaching point chip 同一種語言（勾＝在裡面）；點一顆就開關那張卡，關掉的卡變灰、標 `SKIPPED`。卡上只剩鉛筆。`Hide` 變純文字鈕；群組標頭的 `Word cards 5 of 5`、`Examples 2 per word ▾` 拿掉眼睛只留字。整頁的眼睛只剩圖片上那一顆（方案 B 把它併進縮圖列，還沒做）。額外拿到的：那一列 chip 就是「一個字＝N 張卡」的圖，第五輪想講的事在這裡講完。每一種範圍現在各一種長相：整個字＝Hide 文字鈕、單張卡＝標頭 chip、圖片＝縮圖上的眼睛、全部＝群組標頭的下拉。 |
| 老師 | 第二十九輪：例句置左 | 使用者指示（2026-09-15）。第二十七輪的置右改成置左：逐詞的拼音／字從左邊開始排，翻譯也靠左。 |
| 老師 | 第二十八輪：例句的拼音逐詞斷開 | 使用者指示（2026-09-15）。原本拼音是一整行放在句子上面，改成**每個詞一組、拼音在上字在下**，整段靠右換行——這是學生端 EXAMPLE 卡本來的排法（`shared/word-groups.js`），老師看到的跟學生看到的同一種。mock 用一份小詞表做最長匹配（產品有自己的斷詞），「一……就」的句子特別處理成 一／起床；一会儿的兒化音拆成三個音節才對得上三個字。 |
| 老師 | 第二十七輪：例句卡的文字置右 | 使用者指示（2026-09-15）。第二步例句卡裡的拼音／句子／翻譯從置中改成靠右，跟右上角的編輯鈕與眼睛對齊。第三步學生端的卡沒動（那是照 card-stack.js 抄的）。 |
| 老師 | 第二十六輪：選兩個專案，Practice name 帶入 `A + B` | 使用者指示（2026-09-15）。產品取第一個專案的名字（`step-one-vocabulary.js`），提案改成選到的專案用「 + 」串起來：`我的一天 + 环境保护与可持续发展`；取消一個就跟著縮回去。老師在欄位裡自己改過之後就不再跟著專案變（`nameEdited`）——原本這個欄位連打字都不會留住，順手補了。說明句改成 *Filled in from the projects you pick.* |
| 老師 | **第二十五輪：Back 回第一步不再鎖住——practice 在第二步才存** | 使用者指示（2026-09-15），跟工程談定：practice 不在第一步生成時建立，而是**在第二步 Vocabulary 儲存**。所以第一步永遠是可編輯的——專案選單、teaching point 勾選、Add words 都不鎖，第四輪那句「Generated. Hide or edit a word in the Vocabulary step.」拿掉。回頭之後：已生成的字保留它的卡、圖、例句；**多勾的字掛 `New`**，frame 底下一行說 *2 new words are generated when you press Next*；取消勾的字寫 *1 unticked word leaves the practice*；按 Next **直接回第二步，不做生成動畫**（使用者指示）——新字的卡先出現、內容在卡上生（跟第一步加的字一樣印 *Generated with the content*），生成動畫只留給第一次。**這一條同時解掉兩件待決**：「生成後鎖住要不要解」→ 解；「生成後沒有加字入口」→ 回第一步加就好，Add words 一直在。E4 的問法跟著變：不是「createPractice 能不能吃字表」，而是「第二步儲存時帶整份字表（含順序、逐卡開關、例句數、上傳的圖）」。 |
| 老師 | 第二十四輪：上傳圖片的對話框 | 使用者指示（2026-09-15）。縮圖列的 `+` 原本按了就當作上傳好，現在開一個對話框（殼跟 Assign 的預覽框同一套 MUI Dialog）。**兩階段**：①選檔——一整塊拖放區 *Drop an image here, or click to choose*，底下 *PNG or JPG · up to 5 MB · landscape works best*；②預覽——檔名與大小、*Choose a different file*、再畫一張縮小的學生字卡（照 card-stack.js 的比例，左半就是這張圖、右半拼音／字／翻譯照目前的顯示設定），讓老師在按下去之前就看到它會出現在哪。頁腳 Cancel／**Use this image**，按了縮圖列多一格 `YOUR IMAGE`、選中它、如果那個字的圖原本藏著會打開。已經上傳過再按是 *Replace your image for ⟨字⟩*。副標一句講清楚 AI 的四張候選不會消失。仍是 E5 的新能力，spec 沒再加題。 |
| 老師 | 第二十三輪：標頭那串計數拿掉，組開關搬到它的位子 | 使用者指示（2026-09-15）。`6 words · 17 cards for students · in this order · 1 hidden` 整串拿掉，兩顆組開關靠右放在原本的位子，選單改成向右對齊展開。理由：卡數已經在 Examples 選單每一列裡、字卡開了幾個在 Word cards 的計數裡，字數與隱藏數在卡上看得到，那串字是重複的；in this order 早就該跟著 ↑↓ 走。 |
| 老師 | 第二十二輪：Examples 的組開關改成下拉，選 0～n 句 | 使用者指示（2026-09-15）。`Examples · 2 per word ▾` 打開是 `No examples / 1 example per word / 2 examples per word / … n`，每列右邊寫會變成幾張卡；n 是目前例句最多的字有幾句（沒生成過是 2，生到五句就是 5）。選 k → 每個字都練**前 k 句**，多的關掉；例句不夠 k 句的字就練它有的，選單底下一行說明。個別眼睛照留：某個字被單獨改過、對不上「前 k 句」，觸發鈕就顯示 `mixed`，再選一次就統一回來。Word cards 那顆維持第二十一輪的三態鈕——字卡一個字只有一張，沒有數量可選。`&exn=1` 看選單打開。 |
| 老師 | 第二十一輪：字卡／例句卡各一顆組開關，一次設定，個別眼睛照留 | 使用者指示（2026-09-15）。群組標頭（我的一天）右邊兩顆跟 Hide 同款的 ghost 鈕：`Word cards · 5 of 5`、`Examples · 12 of 12`，計數是「開著的／全部」，只算沒被 Hide 的字，文法點沒有字卡不算。**三態**：全開 → 眼睛畫 visibility_off，按了全關；部分或全關 → 畫 visibility，按了全開；全關時鈕變灰、計數變紅。每張卡的眼睛照留，老師可以先「只練例句」再把某一個字的字卡打開回來，組開關的計數會顯示 `1 of 5`。這是「一次設定 ＋ 個別例外」，跟 Assign 那一步名冊的做法同一種。 |
| 老師 | **第二十輪：第二步的卡——練不練全部用眼睛，例句可以再生（一次一句、最多再三句）** | 使用者指示兩件（2026-09-15）。①**Practised 開關拿掉，換成眼睛**：字那一行右邊一顆、每句例句右上一顆，跟右上 `Hide`、藏圖的眼睛同一個圖示——「學生看不看得到」從四種畫法收成一種語言（我先前建議第 1 條）。關掉的卡照舊變淡；圖示的方向照 Hide 鈕：看得到時畫 `visibility_off`（動作＝藏起來），藏起來時畫 `visibility`。②**Generate another example**：例句卡底下一列虛線鈕，**一次生一句**（轉圈 1.6 秒代替 AI），右邊寫還能按幾次 `3 more times`；生成的掛 `New`、跟原本兩句一樣可編可藏；到五句換成一行 `5 examples · the most for one word`。第一版是一鍵補到五句，使用者改成一次一句——老師看一句、留一句，不會一次塞三句進來再逐句藏。老師加的字（還沒生）也能按，補的是佔位卡。連帶：第一輪的 `1fr 1fr` 兩列網格改成不定列數、字那一塊貼齊上緣（五句時置中會浮在半空）；第三步的卡數、清單、`Card 1 of N` 跟著算（`exOf()`），底部改寫成 `6 words · 21 cards · 1 word hidden · 2 cards hidden`。**這是新能力**：產品的 `edit-vocab-dialog.js` 只有 `example1` / `example2` 兩個欄位，後端一個字固定兩句、學生端 `parsePracticeCards` 固定 groupSize 3——例句數要變成可變的，記成 spec E6。 |
| 老師 | **第十九輪：第三步 Settings 照 R11 改成「工具列＋畫布，同一張卡」** | 使用者指示（2026-09-15；R11 定案時說之後每種 practice 的 Settings 都用這個面板）。做法照 v3 第三步的參考實作搬。**型別差異只有三處**：工具列第一行多一格 Image（Shown／Hidden 兩段）；第二行沒有 Translation first（Vocabulary 沒這個設定，`settings-panel.js` 的 `hideTranslationFirst` 預設 true）；畫布上是學生的一疊字卡。畫布照 `assignments/content/vocabulary/index.js` 的主欄抄：`practice-header.js` 的頂欄（Vocabulary Mirroring chip ＋ 練習名稱 ＋ 頭像）與 `practice-progress-bar.js` 的進度條（`current / total`，total 是卡數）、`settings-panel.js` 的齒輪（右上；Their choice 幾個就幾列，Speed 的 Their choice 是面板裡的下拉）、`card-stack.js` 的一疊卡；Play 鈕字寫著會怎麼播（`Play · Normal · Xiaorou (Female)`），按下去走 `PRACTICE_STATE.PLAYING`（喇叭變 volume-up、綠），點清單換卡也自動播（產品換到新卡就播）；「Card 1 of N · word ▾」在容器裡原地展開全部卡片，取代 ‹ › 翻頁與 All N cards 手風琴；底部一行 `What a student sees · 6 words · 17 cards · 1 hidden`。**連帶三件**：①Move on after N tries 改回產品的 **Auto pass** ＋ ⓘ（tooltip 用 `MaxAttemptsField` 原文）——R11 明說 R7 那個例子作廢；②On screen／On play／Passing 三個眉標與 rows 卡全部拿掉——工具列沒有眉標、沒有副標；③**第三步底下那份 Vocabulary Preview 清單拿掉**——全部卡片已經在畫布的「Card 1 of N ▾」裡，v3 的第三步也只有那張卡，逐字審卡本來就在第二步。要退回去要重寫 `renderPreviewCard`（第十一輪那一段）。左欄 Vocabulary List 與卡底下的星星／錄音鈕不畫（v3 同一個取捨：預覽只要主欄與那張卡）。第十二輪畫在卡上方的兩顆學生開關收進齒輪面板——那才是產品放它們的地方。前提仍是 E1：學生端現在沒讀這三個值。 |
| 老師 | 第十八輪：順序 ↑↓ 也搬到第二步 | 使用者指示（2026-09-11）。第二步每列標頭序號旁邊 ↑↓，在整份清單裡換位（含隱藏的字）；標頭寫 `in this order`。第三步的預覽只照這個順序顯示，不再有 ↑↓。第三步現在純粹是「看與聽」：樣本卡、全部卡片清單、播放鍵、三個顯示設定。 |
| 老師 | 第十七輪：「要不要練」的開關搬到第二步 | 使用者指示（2026-09-11）。字與兩句例句各一顆開關，從第三步的預覽搬到第二步 Vocabulary 的卡上——決定要練哪些卡跟決定要不要這個字是同一件事，放同一步。第三步只顯示結果（關掉的變淡、標 *Not practised*），順序 ↑↓ 仍留在第三步。第二步標頭的 `cards for students` 只算開著的卡。 |
| 老師 | 第十六輪：翻頁獨立成一個小容器 | 使用者指示（2026-09-11）。`‹ Card 1 of 17 · word ›` 從卡的標頭列移出來，變成卡正下方一顆白色藥丸；「WHAT A STUDENT SEES」那一列拿掉——眉標 On screen 已經在講這件事。 |
| 老師 | 第十五輪：樣本卡底下加「All N cards」清單 | 使用者指示（2026-09-11），跟 v3 同一個做法。清單在樣本卡正下方、同一張卡裡，收合預設關；每列是序號、字或例句、kind（word／example 1／example 2）、播放鍵；點一列就切成上面的樣本卡，目前那張加粗。關掉的卡不列。 |
| 老師 | 第十四輪：Speed／Voice 兩列也拿掉副標 | 使用者指示（2026-09-11）。*Tap one to hear it…* 兩句拿掉，chip 上的 ▶ 本身就說明了可以試聽。這是 v3 共用元件的文案，v3 那邊沒跟著改。 |
| 老師 | 第十三輪：On screen 三列拿掉副標 | 使用者指示（2026-09-11）。Pinyin／Translation／Image 三列只留標籤與控制項；樣本卡本身就在講「它改的是什麼」，副標是重複的。On play 與 Passing 的副標（v3 共用元件的）沒動。 |
| 老師 | **第十二輪：Display Settings 換成 v3 的「樣本卡＋控制項同一張卡」** | 使用者指示（2026-09-11）。第三步上方的 MUI 手風琴（三個印 enum 的下拉）與 Practice Config 分隔線拿掉，換成 **On screen**：上半是學生的一疊卡（照 `card-stack.js`：560×280、後兩張各偏 8px；字卡左半是圖、右半拼音在字上面、翻譯在下面、關掉時位置留著；例句卡沒有圖），`‹ Card 1 of 17 · word ›` 翻頁走「字 → 例句 1 → 例句 2 → 下一個字」，關掉的卡跳過；下半三列控制項：Pinyin／Translation 三段 **Shown / Hidden / Their choice**、Image 兩段 **Shown / Hidden**（Vocabulary 獨有）。**跟 v3 不同的一處**：學生端 Vocabulary 的 Their choice 是「開著開始、學生自己關」（`useState(true)`），Mirroring 是「收起來、點眼睛」——照 Vocabulary 自己的程式碼畫，Their choice 時樣本上方多兩顆學生端的開關（`settings-panel.js`）。**前提仍是 E1**：學生端現在根本沒讀這三個值，樣本畫的是「如果讀了會長這樣」。 |
| 修 | `S.img` 撞名 | 第五輪把「每個字選哪張圖」也叫 `S.img`，撞到 Image 設定值，下拉印出 `[object Object]`（使用者截圖抓到）。改成 `S.imgSel` 與 `S.image`。鷹架的 bug，不是設計改動。 |
| 老師 | **第十一輪：第三步的 Vocabulary Preview 改用第二步的排版，加順序與逐卡開關** | 使用者指示（2026-09-11）。原本產品那份兩欄綠框卡（`vocabulary-cards-preview.js`）換掉，跟第二步同一種排版：圖、字、例句上下。三件新東西：①標頭 ↑↓ 調順序，學生就照這個順序練（產品沒有排序，是新能力）；②字底下不印詞性與級數；③字、Example 1、Example 2 各一顆開關，關掉的那張學生不練——「一個字不必三張全練」（產品沒有逐卡開關，是新能力：現行 `parsePracticeCards` 固定一個字三張）。群組標頭寫 `N words · M cards for students · in this order`，M 只算開著的卡。每張保留播放鍵（這一步的用途本來就是逐句確認音檔）；拼音／翻譯仍照 Display Settings 的值顯示（產品的條件，§5 問題 2 未動）。第二步隱藏的字不列。**兩個新能力要問工程**：順序能不能存（`updatedArticleArray` 的 idx）、逐卡能不能關（後端 groupId／vocaSource 結構有沒有「跳過」）——併入 E4。 |
| 老師 | 第十輪：第二步字那一塊收緊、拿掉圖片說明 | 使用者指示（2026-09-11）。字那一塊原本佔一整欄（1fr），字右邊空一大塊；改成內容寬（最寬 260px），例句吃剩下的。圖片底下那句 *Shown on the word card. Upload your own instead.* 拿掉，其他狀態的說明句一併拿掉。 |
| 老師 | 第九輪：Custom word 可以選型別 | 使用者指示（2026-09-11）。照產品 `CustomWordDialog` 旁邊那個下拉：`TEACHING_POINT_TYPE_OPTIONS` 八個選項（Word / Vocabulary、Verb、Noun、Adjective、Grammar / Structure、Phrase / Idiom、Measure Word、Other），預設 Word / Vocabulary。放在 Custom word 輸入框與 Add 之間，用 c-dropdown-menu 的觸發鈕。加進來的字帶著型別，第二步字底下印它；選 Grammar / Phrase / Other 的走 examples-only（跟產品的 NON_WORD_TYPES 一樣）。 |
| 老師 | 第八輪：第一步的 teaching point chip 拿掉詞性 | 使用者指示（2026-09-11）。chip 只剩勾選框 ＋ 字；第一步加進來的字仍掛 Added。詞性在第二步的字底下還看得到。 |
| 老師 | 第七輪：字那一塊不是卡 | 使用者指示（2026-09-11），照產品原本生詞卡的排法：字 18px 粗、拼音灰、翻譯綠、底下詞性 chip ＋ 級數 chip，沒有框。只有例句是卡（Example 1／Example 2 上下排）。型別 chip 從標頭移到字底下；標頭剩序號、Hide。「一個字＝三張卡」的說法因此退回一句底部說明（*Each word is practised as its own cards…*），不再在卡上標 Card 1／2／3。 |
| 老師 | 第六輪：Vocabulary 卡四處修正 | 使用者指示（2026-09-11）。①標頭不再印 `N cards`（三張卡本身就在畫面上，不必再數）。②標頭不再印字——字只在 Card 1 出現一次，標頭剩序號、型別、Hide。③**圖片可以隱藏**：大圖右上角一顆眼睛，藏起來就是「這個字的字卡只有文字」；縮圖與 Upload 一起收起來。這是逐字的圖片開關，產品只有全域的 `imagePreference`（而且學生端沒讀）——是新能力，併進 E1／E2 那題一起問。④例句改成**上下排**：Card 1 · Word 佔左邊整高，Card 2／Card 3 在右邊一上一下。 |
| 老師 | **第五輪：第二步 Vocabulary 重畫——一個字一列，右邊就是學生的三張卡** | 使用者指示三件事（2026-09-11）。①**這一步不再有 Add Vocab**——加字在第一步做完了。代價：生成後沒有加字的入口，而第一步又鎖著；產品原本的 Add Vocab（From Project／Custom Word）就是為這個情況存在的。要決定：解鎖第一步，還是接受「生成後不能再加」。②**生詞卡重排**：每個字一列，標頭是序號、字、型別、`N cards`、右邊一顆 Hide／Show；左邊圖片區，右邊三張卡 **Card 1 · Word／Card 2 · Example 1／Card 3 · Example 2**，排版照 `card-stack.js`（拼音在字上面、字、翻譯在下面）。這是 spec §5 問題 3 的答案——「一個字＝三張卡」直接畫在畫面上，`Move on after 3 tries` 是每張卡 3 次也就看得懂了。文法點（examples only）的第一張是灰的 *Word · not practised*，只算 2 cards；例句卡右上角一顆編輯鈕（產品：例句可改、字不可改）；隱藏的字整列變淡、標 *Hidden from students*。群組標頭改成一行 `N words · M cards for students · K hidden`，MUI 手風琴收掉。③**圖片可以自己上傳**：大圖 ＋ AI 四張候選縮圖 ＋ 一格虛線 Upload；上傳後那張標 *YOUR IMAGE*、縮圖列多一格、Upload 變成「換一張」。**這是產品沒有的能力**（`VocabularyImage` 只有在 AI 候選裡挑），spec E5。 |
| 老師 | **第四輪：流程從三步變四步，`Teaching Points → Vocabulary → Settings → Assign Practice`** | 使用者指示（2026-09-11）。第一步 **Teaching Points**：選專案、Practice name、勾 teaching point、加字；按 Next 生成（原地轉圈）→ **生完自動進第二步**（照 Scramble 的 auto-advance）。第二步 **Vocabulary**：生成後的生詞卡（產品的 `VocabularyDisplaySection`，沒動）——審卡、編例句、隱藏、選圖都在這裡。回到第一步時專案與 teaching point 鎖住、Add words 收成一句 *Generated. Add or hide words in the Vocabulary step.*（R9：鎖住要給原因）。**不是自創**：跟 v3 把審句獨立成 Edit Sentences 同一個做法，而且 `STEPS_BY_TYPE[FOLLOW_PATTERN]` 的第一步本來就叫 `Teaching Points`。連帶：頁腳 Save 移到第三步（`assignStepIdx - 1`）。 |
| 老師 | **第三輪：Load Content 那條拿掉，頁腳 Next 直接做它的事** | 使用者指示（2026-09-11）。勾好字按 Next → 建 practice、生成（按鈕轉圈，照 LoadingButton）→ 生詞卡出現、**留在第一步**給老師看卡 → 再按 Next 才到 Settings。沒選專案或一個字都沒勾時 Next 是灰的。解掉 spec §5 問題 5 的一半：內容區不再有一顆跟頁腳搶位置的按鈕，「Load」與「generate」兩個動詞也只剩一個位置。**標籤留 Next**（使用者的話）；Scramble／Follow Pattern 同一位置叫 Generate，要不要對齊留給下一輪。D4 因此定案。 |
| 老師 | 提案的第一步從「還沒選專案」開始走 | 使用者要求（2026-09-10）。`?step=0` 預設空白：從選單挑專案 → Teaching points frame 出現 → Load Content → 生成（原型 2.4 秒）→ 生詞載好、選單鎖住、Next 亮起，一路點得過去。原本「已選一個專案」改成 `&sel=1`。 |
