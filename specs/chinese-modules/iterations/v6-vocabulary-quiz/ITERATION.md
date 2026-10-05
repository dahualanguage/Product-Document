# v6 — 優化 Practice-Vocabulary Quiz

- **功能名稱**：優化 Practice-Vocabulary Quiz（建立流程）
- **網址**：https://dahua-dash-dev.web.app/dashboard/practice/create/?type=VOCABULARY&subType=MULTIPLE_CHOICE
  （Choose Practice Type 點 **Vocabulary Quiz** 進來的那條；`subType` 是 `AddNewPracticeDialog.buildCreateUrl()` 帶上的）
- **截圖**：使用者尚未提供。基準檔照程式碼複刻，之後拿實機截圖對一次
- **分岔自**：v4（第一步 Vocabulary 與第四步 Assign 沿用 v4 的基準複刻與假資料；設計檔不沿用 v4 的提案）
- **日期**：2026-09-17（登記）
- **小 spec**：`spec.html`（四步現況 ＋ 八種題型 ＋ 學生端「一題一張卡」＋ 查到的問題 ＋ 待決事項）
- **設計檔**：`create-quiz.html`（基準檔，現行產品的複刻）、`proposal.html`（**提案**，`?step=` 從 1 數；第一輪只換共用的）
- **範圍**：New Vocabulary Quiz 這條建立流程的四步。學生端不改，但 spec §5 把它抄出來了（老師端第三步的題目卡跟它不是同一張）
- **程式碼基準**：dahua-dash `origin/develop` @ `3e821fa4`（2026-09-17 fetch）
  - 三包交接收在 `599dd4cb`。中間的 commit 動到 `vocabulary-mc-question-types-step.js`、`mc-step-two-section.js`、`enum/practices.js`（多了 `VOCAB_MC_AUDIO_TO_PINYIN`）——都是這張卡的檔案，基準檔照新的畫
- **狀態**：**2026-10-05 定案（第四十四輪）並交接**——使用者說「ok 照之前的流程打包」。交接包 `handoff/vocabulary-quiz/`：`vocabulary-quiz.html`（＝ proposal.html 的複本，路徑改成絕對）、`HANDOFF.md`、`API-CONTRACT.md`（格子集合沿用 `mcQuestionTypeSelection`、新欄位 `mcQuestionPlan`、改選擇只生差額、Add Question 加圖片／音檔題型）、`index.html`。第四十三輪（眉標 For reference 可點）與第四十四輪（QUESTION TYPES 那段拿掉、預覽併進 Must cover chip）見 change log。程式碼基準交接時 fetch 到 `b130ab5b`，這張卡的檔案自 `3e821fa4` 起沒動。上一個儲存點 2026-10-02 第四十二輪：第四十輪 HOW MANY 兩卡對調（Set a number 左）；第四十一輪 HOW MANY 段文字重寫；第四十二輪 QUESTION TYPES 那段預設收合。線上 2026-09-29 第三十九輪版在這次部署前仍是舊的。

## 登記時就查到的

1. **那一步叫 Settings，裡面沒有任何設定。** `vocabulary-step-three-section.js` 的 Display／Audio／Max attempts 全包在 `!isMultipleChoice` 裡，Quiz 只渲染 Practice Name ＋ `McQuestionsPreview` ＋ Add Question。所以共用改動的 S3–S7（R11 工具列）對它不適用；能套的是 S1（名稱搬第一步）、S2、S8、S9。
2. **第一步跟 Vocabulary Mirroring 是同一支檔案**（`step-one-vocabulary.js`），差別只有 `showReadModes={!isVocabMC}`。v4 第一步的提案（多選、A + B、勾 teaching point、Add words、Next 生成、回頭不鎖）做完它就有了。
3. **生成只跑一次**：第一步 Next 建 practice 時 subType 先不送，第二步 Next 才連同 `mcQuestionTypeSelection` 一起 patch。再回第二步改選擇會重生，**重生會丟掉第三步做過的刪除與排序**（程式碼註解自己講的），畫面沒有提醒。
4. **學生端跟 Comprehension Quiz 是同一個 `MCPractice`**，只差資料來源與沒有 examMode；八種 vocab 題型都不在 `MC_TYPE_COLORS` 裡，題型 chip 落到 `#666`。

## 基準檔怎麼看

`create-quiz.html`，用網址參數切狀態（`?step=` 從 0 數，照產品 `parseStepParam`）：

| 網址 | 看到什麼 |
|---|---|
| `?step=0` / `&empty=1` / `&gen=1` / `&loaded=1` | 第一步 Vocabulary，同 v4 基準（少了 Read Sentences Only） |
| `?step=1` | 第二步 Question Types · Random（一個 Number of questions） |
| `?step=1&adv=1` | Advanced：八張題型卡 ＋ 逐字矩陣（运动 的圖還沒好，兩個圖片題型 disabled） |
| `?step=1&adv=1&zero=1` | 一個題型都沒選 → warning Alert |
| `?step=2` | 第三步 Settings：Practice Name ＋ 六題預覽（文字／圖片／音檔題幹）＋ Add Question |
| `?step=2&add=1` | Add Question 對話框 |
| `?step=3` / `&assigned=1` | 第四步 Assign（八種共用） |

## 提案怎麼看

`proposal.html`，`?step=` 從 1 數（基準檔仍從 0 數）：

| 網址 | 看到什麼 |
|---|---|
| `?step=1` / `&sel=1` / `&dd=1` / `&pool=1` / `&gen=1` / `&back=1` | 第一步 Teaching Points：v4 的提案原封不動 |
| `?step=2` | 第二步 Question Types：八張參考小格 ＋ QUESTIONS 面板（HOW MANY 兩張選項卡，Use all 40 選中） |
| `?step=2&pv=AUDIO_TO_CN` | 點了「Audio → Chinese」那張卡：學生看到的那一題（`pv=` 換成八種任一個的縮寫） |
| `?step=2&fewer=20` | Custom 20 題、Random：多一層 HOW TO PICK 兩張選項卡 |
| `?step=2&fewer=20&must=1` | Custom 20 題、Must cover 剛切過來——八個題型 chip 一個都還沒勾（預設），0 題 |
| `?step=2&fewer=20&must=CN_TO_EN,AUDIO_TO_CN` | Must cover 勾了兩個 chip——必考給 10 題，不夠 20 的 10 題自動隨機補（chip 下一行純文字註釋） |
| `?step=3&fewer=20&must=CN_TO_EN,AUDIO_TO_CN&pvq=4` | 第四題按了 Preview：學生看到的那一題，‹ › 翻前後題 |
| `?step=3` / `&add=1` | 第三步 Questions：矩陣攤出來的題目清單（拖曳、Raffle、刪除＝取消格）；`&add=1` Add Question（選字＋選題型＝勾一格） |
| `?step=4&pick=3b,4a&roster=4a&assigned=1` / `&review=1` | 第四步 Assign：v4 的提案 |

## Change log

<!-- 只記 UX——流程、語意、互動、命名；純視覺替換（位置、字級、線、顏色、間距）不進這張表，
     逐輪的視覺改動在 proposal.html 檔頭註解。基準檔的複刻與修正、mock 自己的 bug 是鷹架，也不記。
     2026-09-18 依使用者指示整理過一次：第三／四／七／九／十／十二／十五／十八／十九／二十／二十四／二十五／二十七／二十八／二十九輪與 Index 鈕併掉或拿掉。 -->

| 端 | 改了什麼 | 說明 |
|---|---|---|
| 文件 | **第四十五輪：定案、交接** | 2026-10-05。使用者「ok 照之前的流程打包」。交接包 `handoff/vocabulary-quiz/`（原型複本、HANDOFF.md、API-CONTRACT.md、index）；index 卡片狀態改 done、第一顆鈕改成交接包。設計沒改。 |
| 老師 | **第四十四輪：QUESTION TYPES 那段拿掉，預覽併進 Must cover 的 chip** | 使用者指示（2026-10-05：「上面的這些預覽，直接坐在最下面（must cover 的選項）」）。第二步最前面那段參考卡（第四十二、四十三輪已收合成一條眉標）整個拿掉，老師一進來就是 HOW MANY QUESTIONS。預覽改掛在 MUST COVER THESE TYPES 的八顆 chip 上：整顆仍是勾必考，右端一顆螢幕小圖示（使用者定：一直顯示、不等 hover）開同一個學生視角對話框；Advanced 標回到 chip；小標旁藍字 *see what the student gets*。chip 格子改成放不下就自動減欄、Advanced 窄時掉到第二行（使用者「會爆版」）。代價：Use all／Random 時第二步沒有題型預覽——使用者接受。`&qt=` 失效。 |
| 老師 | 第四十三輪：眉標的 For reference 本身可以點 | 使用者指示（2026-10-02）。收合時 *For reference · click to see the 8 types ⌄*、展開時 *… · click one to see what the student gets ⌃*；右邊的 Show／Hide 拿掉。第四十四輪整段拿掉後不再適用，留作紀錄。 |
| 老師 | **第四十二輪：QUESTION TYPES 那段預設收合，眉標右邊 Show／Hide** | 使用者指示（2026-10-02：「這塊還是看起來不像參考就可以的」）。八張題型卡跟下面的選項卡同樣是白卡＋色塊＋粗標題，分不出哪排是看的、哪排是點的。三個走法（A 降成圖例、B 卡去白底、C 收進眉標）使用者選 C：眉標 *QUESTION TYPES · 8 · For reference* 留著、右邊一顆 **Show**，點了才展開八張卡與「click one to see what the student gets」；開著題型預覽時自動展開。這一輪推翻第十六輪「題型卡在最前面」——老師進第二步直接看到 HOW MANY QUESTIONS。同輪：備注欄算式底下列出這次要考的字（中文＋拼音唯讀 chip，不能刪，改字回第一步），讓「5 words」有所指。 |
| 老師 | **第四十一輪：HOW MANY 段先講 40 是哪來的，Custom 改名 Set a number** | 使用者指示（2026-10-02：「讓老師知道進來要做的是 1. 先設定題數 2. 也可以選擇全部都練習，全部都練習要溝通清楚」「左的 40 還是會一瞬間不知道 40 是什麼」）。小標改 **HOW MANY QUESTIONS**，底下一行放大的算式 *5 words × 8 question types = up to 40*，在兩張卡之前講一次 40 的來源；左卡 *Custom* → **Set a number**（題數欄照舊在卡裡，老師第一眼就看到要做的動作）；右卡先改成 *Use all 40* ＋ 副標 *Every word in every question type*，使用者再改成只剩標題 **Use all question types**（40 已在上面的算式講過）。 HOW TO PICK 的 *Must cover*（副標 Pick the types）也改成只剩標題 **Must cover question types**，兩張「全部／必考」的卡同一個句型。 眉標 *QUESTIONS · 20* 改成 **HOW MANY QUESTIONS**（卡內同名小標拿掉，一欄就好）。討論過 *Use all practice type*：`practiceType` 在產品裡是 MIRRORING／QA／MULTIPLE_CHOICE，跟上面眉標 QUESTION TYPES 撞詞，所以用 question type。第四十輪先把兩張卡對調（Set a number 在左、預設選中）。 |
| 老師 | **第三十九輪：第三步標出必考題型出的題** | 使用者指示（2026-09-29：「下一步也顯示哪些是自己選的題型 tag」）。Must cover 模式下，題型是老師勾的必考的題，題目卡標頭多一顆綠色 *Must cover* chip（rule 圖示，跟第二步那張選項卡同一顆）；自動補的仍是藍色 *Random pick*。兩顆互斥，一題只有一顆。Random 與 Use all 時都不標。同一輪使用者再定：**必考的題沒有 Swap type 鈕**（換了題型就不是必考的那一種），chip 佔它的位置；Random pick 與其他題照常有。 |
| 老師 | **第三十八輪：矩陣整個拿掉，第二步只剩三層選項卡** | 使用者指示（2026-09-29：「把矩陣的格子拿掉」「還沒到題數用隨機補齊這句改成註釋，不用藍勾」）。前一輪先把矩陣收合在一列後面，這一輪連那一列都拿掉：第二步從上到下只剩 HOW MANY → HOW TO PICK → MUST COVER THESE TYPES。逐字逐格的細調不在第二步做——要動單題去第三步（刪、Swap type、Add Question）。Must cover 勾的題型填不到題數時，自動補的那句改成純文字：*Must types give 10 questions · the other 10 are picked at random from the rest to reach 20*；藍勾是矩陣格子的語言，格子沒了就不用。第三步自動補的題仍標藍色 *Random pick* chip，圖示從勾改成 shuffle。資料仍是同一份（第二輪的「兩步同一份資料」沒變，只是第二步不再把它攤開）。`&mx=` 參數拿掉。 |
| 老師 | **第三十六～三十七輪：QUESTIONS 面板重排成三層選項卡，必考題型改在 chip 勾** | 使用者指示（2026-09-29：「重新排列 Questions 面板，讓用戶清楚知道有全選跟自訂題數，可以選擇必考題型」；前一步先把 Fewer than that 改名 **Custom**）。R11 那條工具列在這裡不夠清楚：三個決定擠成一行小段鈕，必考要點矩陣欄頭才找得到。改成照 Planning 的三個問句一層一層往下開：**HOW MANY** 兩張 radio 卡 *Use all 40*（副標就是算式 5 words × up to 8 types，ALL POSSIBLE 那格拿掉）／*Custom*（題數欄在標題旁）→ Custom 才出現 **HOW TO PICK 20** 兩張卡 *Random*／*Must cover* → Must cover 才出現 **MUST COVER THESE TYPES** 八個題型 chip（勾＝必考）。**必考只在 chip 勾**——第八輪把必考放在矩陣欄頭是為了同一份清單只勾一層，這一輪把那一層搬到 chip，欄頭在 Must cover 時只顯示（必考的實心綠、其他純標籤，不能點）；Random 時欄頭仍是整欄勾／取消。矩陣的格子、列主勾、藍勾自動補、狀態句都沒變。同一輪後半使用者再定四件：①選項卡改照產品 function-selector.js 那張可點 Card（icon 方塊＋標題，選中＝綠外框＋淡綠底；一度畫成 radio 圓圈，查過產品沒有那種組合）；②副標精簡——Use all 只留 5 words × 8 types、Custom 與 Random 沒有副標、Must cover 只寫 Pick the types；③Use all 時矩陣上方的黃色警示（第三十一輪）拿掉；④**矩陣預設收合**——面板最後一列 *Word × type · 20 of 40 cells ticked · Show*，點了才攤開，矩陣從主角變成細調。網址參數：`&fewer=` 仍是 Custom 的題數，新增 `&mx=1` 直接展開矩陣。 |
| 老師 | **第二十六輪：已在考卷裡的題型照樣可以選＝加第二題** | 使用者先問「現在灰是什麼意思」（灰＝這個字用這種題型的題已經在考卷裡，光灰掉像壞掉），再指示「就也放空心圓就好，不用讓他不能選」（2026-09-17）。已在考卷裡的題型跟其他一樣是空心圓、可以選，只多右邊小字 IN QUIZ；選了按 Add，就多**第二題**同字同題型（產品的 Add Question 本來就不查重複）。資料上：第二題的 key 多一段序號，矩陣的格 ⇔ 這個字這種題型**至少一題**；刪一題只拿掉那一題，那一格沒題了才取消格；Swap type 也只換這一題。所以第二步 QUESTIONS 數的是格、第三步數的是題，加了第二題兩邊會差一——這是允許重複的代價，記著。淡掉只剩沒圖的。用 CDP 驗過：加一題重複 20→21 題、格仍 20；刪第一題格還在；刪第二題格才取消。 |
| 老師 | **第二十三輪：Raffle 改名 Swap type** | 使用者問「raffle 是什麼」（2026-09-17）。它是產品現有的按鈕（`handleRaffleMcQuestion`）：同一個字隨機換成另一種文字題幹題型、選項重拼；名字看不出在做什麼。使用者選了 **Swap type**（其他候選：Reroll、Shuffle）。tooltip 註明產品叫 Raffle，工程對得回去。 |
| 老師 | ~~第二十二輪：整份考卷的 Preview~~（**退回第二十一輪**） | 使用者說「是綜合的 preview」我做成頁腳一顆走整份，看過後說「回到上一步」（2026-09-17）——整輪退回，每題那顆 Preview 留著。留這一列當紀錄。原本做的：——不是每題一顆，是整份走一遍。每題那顆拿掉；第三步**頁腳 Next 旁邊一顆 Preview**（外框、小螢幕圖示），開 Student view 對話框，裡面照學生端 `QuestionScreen` **整個**畫：頂欄進度條＋ `1 / 20`、那張卡、底部 Previous／Next（最後一題 Finish）。**選一個選項立刻回饋**（正解綠框 ✓、選錯紅框 ✕，選了不能改），跟學生端一樣。一個刻意的差別：學生端 Next 要選了才亮，預覽不擋，老師可以直接翻——對話框底下一行小字說明。`&pvq=1` 開、`&pvans=A` 那題已選 A。 |
| 老師 | **第二十一輪：每題一顆 Preview** | 使用者指示（2026-09-17：「這個練習後多一個 Preview」）。第三步每張題目卡 Raffle 旁邊多一顆 *Preview*（小螢幕圖示），開第二步同一個 Student view 對話框，但看的就是**這一題**（同一個字、同一組選項），標題 `Q4 · Audio → Chinese · 起床`，底部 ‹ Q3 ／ Q5 › 可以照考卷順序一題一題翻，不用關掉再點。這一顆把 spec 問題 8（老師端題目卡跟學生端不是同一張）解掉：老師端的卡維持緊湊兩欄，要看學生那一張按 Preview。 對話框後來只留 Close（‹ › 翻題拿掉，要看別題就關掉再點）。 |
| 老師 | **第十七輪：點題型卡＝預覽學生看到的那一題** | 使用者指示（2026-09-17）。八張說明卡現在可以點（右邊一個小螢幕圖示，眉標提示 *Click a type to see what the student gets*）。開一個對話框：標題就是那種題型（使用者說不用副標，說明句拿掉），中間一扇 **Student view** 視窗（R11 那個，監視器圖示），裡面照學生端 `mc/index.js` 的 `QuestionScreen` 畫**一題**：題型 chip（產品 `MC_TYPE_COLORS` 沒有 vocab 題型，落到灰 `#666`，照畫）、題幹框（grey 6% 底）——文字題幹 h5 置中／圖片題幹 maxHeight 200／音檔題幹 64px 綠色播放鈕＋ *Click to play audio*、選項單欄四個 32px 圓字母。題目用第一個字照第三步同一支 `buildQ()` 拼。底部左邊 ‹ › 可以翻到前一種／後一種題型，不用關掉再點。跟 v3／v4 同一個取捨：只畫那張卡，頂欄進度條與 Previous／Next 不畫。 |
| 老師 | **第十五～十六輪：版面——題型卡獨立在最前面，工具列＋矩陣一扇窗** | 使用者說 UI 太亂要重新梳理（2026-09-17）：三張卡疊三段、五種元件、一段長說明句，而且最大那塊（八張卡）不做任何決定。第十五輪照 R11 收成一扇窗（工具列 HOW MANY／HOW TO PICK ＋ 畫布就是矩陣，長說明句改成一行狀態）；使用者：「還是想要卡片在前面，但下面的可以」。第十五輪把八張卡縮成窗裡的一排圖例，使用者要的是卡片獨立在最前面——放回第十四輪那一段（大數字 `8` ＋ 八張說明卡，不能勾），窗裡的圖例拿掉免得重複。所以第二步兩段：**QUESTION TYPES**（說明）→ **QUESTIONS · 20**（工具列 HOW MANY／HOW TO PICK ＋ 矩陣）。 |
| 老師 | **第十四輪：Use all 不用勾** | 使用者指示（2026-09-17：「就不要用勾」）。鎖住的 checkbox 長得還是像能點的；Use all 時矩陣改成**一顆綠點一格**、每列沒有主勾、欄頭是純標籤（沒有外框）。勾這個元件只在 Fewer than that 出現，看到勾就知道能改。 |
| 老師 | **第十三輪：Use all 時矩陣鎖住** | 使用者指示（2026-09-17）。Use all 的意思是「每一格都是題」，矩陣只是把它攤開給老師看，所以格子、每列的主勾、欄頭都不能點（游標不變、沒有 hover），眉標右邊寫 *Every cell is one question · switch to Fewer than that to change cells*。要改任何一格就先切 Fewer than that——切過去題數預設 20、Random。 |
| 老師 | **第十一輪：Must cover 從 0 開始算，自動補的格子另一個顏色** | 使用者指示（2026-09-17：「不要維持 Random 的結果」「老師選了題型後才開始算有沒有到題數」「還沒到題數會自動 Random，勾號用不同顏色」）。切到 Must cover：矩陣全空、`QUESTIONS · 0`，沒有 warning（說明句已經在教下一步）。勾一個欄頭：那種題型逐字填滿（綠勾）；勾到的加起來不到題數，差額從其他格子自動隨機補，**補的格子用藍勾**（`--info`，滑上去說 *Picked at random to reach 20*），說明句寫 *Must types filled 10 of 20; the other 10 were picked at random*。勾到夠了就沒有藍勾。老師自己點的格子一律綠勾（點掉藍勾＝拿掉那一題）。 前一輪（第十輪）先定了切到 Must cover 時預設一種都不勾。第三步（第十九輪）自動補的那幾題 Q 號旁邊一顆藍色 *Random pick* chip，跟矩陣的藍勾同一個意思，Swap type／刪除照常。 |
| 老師 | **第八輪：必考的勾就是矩陣欄頭** | 使用者指示（2026-09-17：「這邊也可以結合在一起」，指必考 chip 那一排跟矩陣欄頭）。chip 拿掉；Must cover 模式下點欄頭＝這種題型必考（實心綠 `TR`），再點一下取消；Random 與 Use all 時欄頭照舊＝整欄勾／取消（淡綠外框）。說明句改成指向欄頭，前面放一顆實心的小樣本。同一份題型清單只剩矩陣這一處能勾，跟第六輪的教訓一致。 |
| 老師 | **第六輪：八張題型卡回到第一段、題型數放大** | 使用者指示（2026-09-17：「卡片在最前面，告訴用戶題型」「總共多少題型的數字放大」）。第一段 **QUESTION TYPES**：大數字 `8` ＋ *question types · every word can be asked each way*，底下八張卡**只是說明，不能勾**（沒有 checkbox、白底、游標不變）。第一版做成「卡也能勾＝這種題型在考卷裡」，使用者指出**跟 Must cover 矛盾**（兩層勾同一份清單；Fewer + Random 抽完有的題型一題都沒有，上面的勾就說謊了）。給了三個走法：A 卡＝必考、拿掉 Random／Must cover 切換；B 卡純說明、勾選留在 Must cover；C 第五輪。使用者選 **B**。所以 HOW MANY／HOW TO CHOOSE 的邏輯回到第四輪（上限 `5 words × up to 8 types`、Random across all types｜Must cover），只有 Must cover 的勾選從八張卡改成一排小 chip（八種都列），免得同一頁出現兩組一樣的卡。眉標右邊提示 *Pick which ones below, or untick a column in the list*。 |
| 老師 | ~~第五輪：八張題型卡一開始就在~~（**已退回第四輪**） | 使用者指示（2026-09-17）。第四輪的卡只在 Must cover 時出現；改成第一段 **QUESTION TYPES** 永遠在，眉標右邊 `8 of 8 in this quiz`。**卡的意思跟著變**：勾＝這種題型在考卷裡（等於矩陣整欄；欄頭與卡互相同步）。連帶 **Random／Must cover 兩個模式拿掉**——Fewer than that 時題數在勾的題型之間**輪流分**（第一輪每種題型各拿一個字、第二輪再各拿一個），每種勾的題型都拿得到；「必考」變成「只勾要考的」。這跟 Planning 的三個問句不一樣（Planning 是題數 → Random／必考 → 必考哪幾種），是這一輪為了讓卡一開始就有意義做的取捨，**要跟使用者確認**。第三步 Add Question 只能加勾了的題型（沒勾的灰掉、說 *not in the quiz*），Raffle 只在勾了的文字題幹題型裡換。**使用者看過後說「回到上一步」（2026-09-17）——整輪退回第四輪：卡只在 Must cover 時出現，Random／Must cover 兩個模式留著。留這一列是因為「卡一開始就在」要付的代價（卡的意思得換成「在不在考卷裡」）已經試過、不用再試。** |
| 老師 | **第二輪：Question Types 照 Planning，第三步跟矩陣綁成同一份資料** | 使用者定案三件（2026-09-17）：①題數不是獨立欄位，由矩陣算；②必考照 Planning；③Raffle／Add 留。做法照 `teacher-planning-flow-spec.html` §6 · Vocabulary Quiz，把對話的三個問句收成一個面板：**大數字 ＋ 四段組成條**（Chinese／Image／Translation／Audio 四個題幹組，老師要看的是「這份考卷由什麼組成」）→ `HOW MANY · Use all 38｜Fewer than that [20] of 38` → 縮了才出現 `HOW TO CHOOSE · Random across all types｜Must cover`，Must cover 時八張題型卡變成勾選（**八種**，含 599dd4cb 之後新增的 Audio → Pinyin，Planning 的表是七種）→ 矩陣照題幹分四組、欄只寫答案側 TR／CN／PY、Advanced 是欄頭一顆橘點；格子逐字算可用性，**只查圖**（產品的 `isImageReadyForMc`；Planning 多查翻譯／拼音，但生成後每個字都有，照 R3 不畫）、不能出的格子灰色破折號、滑上去說缺什麼；欄頭與每列各一顆主勾選。**必考＝優先補滿**（照 Planning 的 `vocFillMust`：勾的題型逐一填滿全部單字再換下一個，剩的隨機補；題數小於單字數時第二個勾的輪不到）。老師改任何一格，計數跟著變。**第三步改叫 Questions**（它沒有設定）：清單就是矩陣攤出來的（`in this order`），拖曳排序留著、**刪一題＝取消那一格**、**Add Question 改成選字＋選題型＝勾一格**（產品是隨機題型；已在考卷裡的與不能出的題型灰掉並說原因）、**Raffle＝把這一格換成同一個字另一種還沒勾的文字題幹題型**。這一條把 spec 問題 3／4／6／7 一起解掉：兩步是同一份資料，就沒有「重生會丟掉刪除排序」這回事——只有新勾的格子才生（E2／E3 要問）。題目卡的題型 chip 用該題幹組的顏色。 |
| 老師 | **第一輪：只換共用的，Quiz 自己的兩步先不動** | 使用者指示（2026-09-17：「step 1 不能照共用元件改嗎」→ D2 定案）。從 v4 的 proposal.html 分岔：①第一步 Teaching Points 原封不動——同一支 `step-one-vocabulary.js`，多選專案、名稱 A + B、勾 teaching point、Add words、Next 生成、回頭不鎖只生新的，全部直接得到；②第四步 Assign 照 v4（八種共用）；③第二步 Question Types 與第三步題目清單照基準檔抄，**只拿掉第三步的 Practice Name**（S1：名稱已在第一步）。型別圖示用 Quiz 自己的 tag（`ic:round-bookmark`，同一組琥珀）。所以這一頁刻意是新舊並置，中間兩步的落差就是下一輪要決定的。 |
| 文件 | 登記：基準檔 ＋ spec | 2026-09-17。基準檔從 v4 分岔，中間兩步照 `vocabulary-mc-question-types-step.js` 與 `vocabulary-step-three-section.js` 的 `isMultipleChoice` 分支複刻；spec §6 十個問題、§7 四題待決 ＋ 六題要問工程。Random 的預設題數從程式碼看不出來（`buildInitialSelection` 在 shared helper），基準檔先放 12，**待查**。 |
