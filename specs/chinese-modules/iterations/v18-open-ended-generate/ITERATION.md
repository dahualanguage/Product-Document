# v18 — Open-ended Questions：拿掉題庫、進練習才生成

- **功能名稱**：New Open-ended Questions（`QA`）建立流程 → **2026-11-11 改名 Free response**（使用者）
- **網址**：https://dahua-dash-dev.web.app/dashboard/practice/create/?type=QA
- **截圖**：沿用 v13
- **分岔自**：v13 `proposal.html`（外殼、Stepper、第一步欄位、第二步的 R11 工具列＋學生視窗、Assign 步全部沿用）；第一步的格子、教學點 frame、Generating、第二步的題目卡＋Generate more 跟 v17 同一套
- **日期**：2026-10-23
- **範圍與理由**：`../v16-remove-question-bank/spec.html`。這一版只畫 Open-ended Questions 那條流程；Comprehension Quiz 在 v17
- **設計檔**：`proposal.html`（`?step=` 從 1 數；參數見檔頭）。基準檔沿用 v13 `create-qa.html`，不重做
- **狀態**：**2026-11-13 多一條「沒有專案」的路（A 路：選單最後一項 No project → Language 欄 → 名稱自己填 → 只有 You write；`&proj=none`）**。2026-11-13 What to ask 改成 v17 的卡（一張卡、AI writes／You write 兩列）。2026-11-12 題卡加回 Answer conditions（產品題庫頁就有的、後端生成的唯讀條件；題庫拿掉後只剩這張卡能看到）。2026-11-11 改名 Free response、只剩 Extension（Content Base 搬去 v17 Comprehension Quiz）。2026-11-04 起 Open-ended Questions 的唯一版本（v13 併進來；v13 的 `create-qa.html` 是基準）。提案第一輪，未部署、未 commit

## 這一版定了什麼

- 三步變四步：Content → Edit Questions → Settings & Preview → Assign Practice。多一步是故意的：生成完要有地方看過、改過，再去設音檔（跟 Sentence Scramble 的 Edit Sentences 同一個理由）。
- 第一步：專案單選 → Practice name → **What to ask**（兩列：Content Base／Extension，題庫頁 Q&A 區塊的兩個 radio；icon 照 CATEGORY_ICONS；一欄題數 0–10；預設全 0、底列「Use a suggested mix」帶入 5＋2）→ **Article** → Generate。**沒有教學點**（第二輪拿掉；第一輪原本照 v17 畫了黃底 frame）。
- 沒課文的專案：Generate 灰、原因在格子底列「This project has no article content yet」，課文 frame 裡一條黃色提醒。
- 第二步 Edit Questions：一題一張卡（類別 chip 用 v13 的 .qtype、題目＋拼音、播放、編輯、✕、拖曳）。展開＝編輯題目與建議答案；拼音唯讀，改了題目重產拼音與音檔。Generate more 同一張格子接在最後掛 New。現行「Edit Questions & Answers in Question Bank」鈕沒了。
- 題卡上有 **Answer conditions**（2026-11-12 加回）：產品題庫頁每題 Q&A 的 Suggested Answer 底下本來就有這塊（`questionsBank/view/generate/questions/answer-conditions.js`，PR #978，2026-09-23）——後端從題目＋建議答案生成，分 **Must cover**（綠勾）／**Not required**（灰圈）兩組，老師只能看不能改，改了題目或建議答案後端會重產；AI 批改學生答案的「完整度」就是對著它。題庫拿掉之後這塊唯一的入口就是這張卡，所以照產品的樣子搬過來：收起時在建議答案那條底下唯讀；**鉛筆打開時可以改（2026-11-13，使用者「要可以編輯」）**：Must cover／Not required 每條一個輸入框、✕ 刪、各組底下 Add，底下一行「The AI grades the student’s answer against these」；手寫題還沒有條件時兩組都空著只有 Add，一行「留空的話存檔時 AI 從你的題目和建議答案寫出來」。改了條件的 AI 題掛 Edited。沒課文的佔位卡不顯示。學生端不顯示（產品也沒有）。
- 第三步：v13 第二步的工具列＋學生視窗原封不動，底下的課文與題目清單拿掉（題目在第二步處理完；要看哪一題用視窗裡的 Question x of N）。
- 第四步 Assign：S8。
- **沒有專案也能建（2026-11-13，A 路）**：Project 選單最後一項 **No project · Write the questions yourself**。選了之後：多一個 **Language** 欄（Simplified／Traditional Chinese，產品現在是從專案的 targetLanguage 查，這裡要練習自己存）、Practice name 不帶入要老師填、Article 區不顯示、What to ask 那張卡的 **AI writes 那列停用**（右邊寫 *Needs a project with an article*）只能填 You write、主鈕是 Next 不跑 Generating。第二步同樣的空白手寫卡；Generate more 改叫 **Add questions**（同一張面板）。第三步學生預覽左欄 Content 收掉（跟 Audio only 一樣只剩題目），Voice 清單照老師選的語言。為什麼只開手寫不開 AI：產品的生成都以課文為輸入、Extension 題的定義是 building on the article，沒課文就沒得生；要 AI 出題得另寫一條「給主題＋語言＋等級」的 prompt，之後再疊（B 路）。

## 查到的、沒畫的

1. Open-ended 的題目沒有「對應到哪個教學點」的欄位（後端只把專案的教學點當提示塞進 prompt），所以第一步不勾點、卡上也沒有教學點 chip，跟 v17 不同。後端照舊會拿專案的教學點當提示，老師不用管。
2. Generate 之後建 practice 的 ProcessingDialog 沒畫（照現行「Processing content...」）。
3. 已指派後回來改題的版本確認沒畫（v16 待定 4）；學生答題時建議答案怎麼進評分（v16 待定 2）。
5. **沒有專案的練習，要問工程四條**（2026-11-13）：①練習要能自己存 targetLanguage（現在語音、拼音、評分語言全從第一題的 projectConfigSk 查專案；`assignments/content/index.js` 的 getTargetLanguageFromProjectConfig 沒 sk 就回 undefined）②評分那條沒課文能不能跑（現在送 projectConfigSk＋questionSk，建議答案後端從題庫查；Extension 題本來就不從課文找答案）③Answer conditions 的生成有沒有吃課文 ④音檔的 voice 是依 targetLanguage 選，練習帶語言之後 voice library 那條能不能照舊。⑥（2026-11-18）沒有專案時練習也要自己存 `levelType`、`level`（現在從專案的 levelType／level 拿；評分、AI 提示用得到嗎？）。⑤（2026-11-18）語言選 Each student’s setting 時：練習存什麼（一個 `student` 值？）、學生端怎麼拿到自己的 `targetLanguage`、老師寫的題目與建議答案誰轉簡繁（後端 OpenCC 或生成時兩份都存）、拼音與 Answer conditions 要不要兩份、評分照學生的版本。另外學生端 `qa/content-window.js` 沒有專案內容時會把題目文字當課文印在左欄，要改成不顯示左欄。產品已有沒專案的練習（ESL Mirroring、Reading Challenge），upsertPractice 的 projectConfigSk 本來就是選填，資料模型不擋。
4. Answer conditions 現在存在題庫的題目上（`question.answerConditions`，`requiredConditions`／`notRequiredConditions` 兩個字串陣列），練習本身（`updatedArticleArray`）沒有這個欄位；題目改存在練習上之後，條件要跟著搬過去、改題後重產的時機也要定——v16 的 spec 已劃掉不再更新，這條待工程的問題記在這裡。重產要幾秒（產品手動加題時把表單鎖住就是在等它）——改完題目關掉鉛筆之後，條件要不要先顯示「更新中」，沒畫，等工程回時間再說。QA pipeline 那套拿條件去測 prompt 的工具 2026-10-26 已搬去 dahua-admin-dash，不在老師端。

## Change log

| 日期 | 改了什麼 | 說明 |
|---|---|---|
| 2026-11-18 | **Generate more 也能加預設題**：面板卡上多 Starter questions 一列（有專案、沒專案都有）；大於 0 時展開同一份分組清單，已在題目裡的預設題灰掉、標 Added、不能再勾；組名旁的數字只算還能加的；Add 後接在清單最後、掛 New。順手修掉面板下方外露的程式註解 | 使用者「Generate more 沒有帶出新的句子種類」＋截圖（露出 `/* 2026-11-13 A 路… */`） |
| 2026-11-18 | 第二步只剩一題時，眉標右邊那句 *Last question — a … needs at least one, so it can’t be removed* 拿掉；那題的刪除鈕照樣停用 | 使用者「拿掉」。v17 同一句一起拿掉 |
| 2026-11-18 | **有專案也能用預設題（方案 A）**：What to ask 卡右邊三列 AI writes｜Starter questions｜You write；Starter questions 大於 0 時卡片底下才展開分組勾選清單（同沒專案那一份）；總題數三列相加；第二步預設題排在課文題前面當暖身；只選預設題（AI writes 0）時主鈕是 Next | 使用者「有 project 的也想要用這些問題有什麼提案」→ A 卡上第三列／B 卡底下收合區／C 第二步 Generate more 再加 → 「A」。順序排前面是我的建議，沒另外問；簡繁照專案 |
| 2026-11-18 | 預設題清單拿掉拼音，一列只剩勾選框 ＋ 題目 | 使用者「不需要出現拼音」。第二步題卡照舊有拼音 |
| 2026-11-18 | 預設題清單**在框裡捲動**：外框最高 440px，超過在框內捲；主題標題捲動時黏在框頂 | 使用者「如果過多是需要 scroll」 |
| 2026-11-18 | 預設題從 12 題加到 **30 題、分五個主題**（About me、Family、School、Daily life、Food & hobbies 各 6 題）；清單照主題分組，每組小標題旁寫勾了幾題（`2 / 6`） | 使用者「demo 更多問題的畫面」。題目變多要分組才好找。題目仍是草稿 |
| 2026-11-18 | 沒有專案時多一組**預設題（Starter questions）**：What to ask 卡上原本停用的 AI writes 那列改成 `Starter questions − N ＋`；卡底下兩欄清單 12 題基礎自我介紹題（拼音＋題目、勾選框）。題數加＝從上往下補勾、減＝拿掉最後勾的；直接勾選題數跟著變。第二步勾的題變題卡（題目、拼音、建議答案、Answer conditions 都帶好，可再改）。沒專案時主鈕是 Next（不跑 Generating） | 使用者「no project 會帶入一個預設題型，是基礎的問題，例如你的名字，先幫我創幾個看看，老師可以選要幾題然後勾選問題」。12 題：名字、年齡、國籍、住哪、家裡幾口人、生日、會說什麼語言、喜歡吃什麼、喜歡的顏色、愛好、幾點起床、喜不喜歡學校。題目是草稿待使用者定；題目要不要跟著 Level 換、繁體學生看到繁體，待定。`&proj=none&starter=N` |
| 2026-11-18 | What to ask 只剩一張卡時**改橫向撐滿外框**：左邊示意圖、右邊 340px 放 AI writes／You write 兩列題數，中間一條直線；860px 以下改回上下疊 | 使用者「調整 UI，旁邊留白太多」。原本是 2×2 格子的一格，只剩一張卡就空了右半邊 |
| 2026-11-18 | 拿掉「Extension」字樣：What to ask 卡上方的類別標題（icon＋Extension）、Article 眉標右邊 *Extension questions build on this*、第二步題卡上的 Extension chip | 使用者「What to ask 可以就不用再叫 Extension 了，因為只有一種 type」。資料欄位 `extension` 照舊，只是畫面不寫 |
| 2026-11-18 | 沒有專案時 Language 下拉換成一排三個：**Test Type｜Level｜Target Language**（照產品建立專案第一步 `project-create-step-setup.js`：Choose Standard／Choose Level／Choose Language，左邊 icon）。Test Type 六種（TOCFL、HSK、ACTFL、CEFR、IB_DP、IB_MYP，`PROJECT_LEVEL_TYPE_MAPPER`）；Level 跟著 Test Type，沒選 Test Type 時停用；Target Language＝Chinese (Simplified)／Chinese (Traditional)／Each student’s setting。三樣都選才能 Next | 使用者「這三個應該都要可以選擇」（附建立專案頁的三個欄位）。沒專案就少了專案帶的標準與等級，老師要自己給。v11 的複刻只有三種 Test Type，產品現在是六種。`&proj=none&std=HSK&lvl=2&lang=student` |
| 2026-11-18 | 拿掉 Language 下拉裡的說明小字（收起時 *Simplified or Traditional, per student*、選單那列 *…from each student’s profile in Program*），只留選項名稱 | 同上一條規則 |
| 2026-11-18 | 拿掉 Practice name 與 Language 底下的說明句（*There is no project to take a name from…*、*Filled in from the project…*、*Pinyin, audio and answer checking…*、*Write in either one…*） | 使用者「拿掉，寫在 skill 裡，不要一直自己寫輔助副標」。產品的 PracticeNameField 沒有說明句 |
| 2026-11-18 | 沒有專案時欄位順序改 **Project → Practice name → Language**（名稱從最下面移到 Language 上面） | 使用者「Practice name 放在上方」。跟有專案時 Project 後面接名稱的順序一致 |
| 2026-11-18 | Language 從三顆切換鈕改成**下拉**（跟 Project 選單同一套）：收起時 `Each student’s setting · Simplified or Traditional, per student`；選單三列 zh-CN Simplified Chinese｜zh-TW Traditional Chinese｜Each student’s setting（底下一行 *Simplified or Traditional, from each student’s profile in Program*）；欄位底下說明縮成 *Write in either one. Pinyin, audio and answer checking follow each student too.* | 使用者「換一個 UI」。三顆切換鈕太長、第三項需要說明。`&langdd=1` 看選單打開 |
| 2026-11-18 | 沒有專案時 Language 多一個 **Each student’s setting**（Simplified｜Traditional｜Each student’s setting）：選了底下說明 *Each student sees Simplified or Traditional, from their profile in Program. Write in either one; pinyin, audio and answer checking follow each student.*；第三步預覽上方多 **Preview as Simplified student｜Traditional student**，繁體學生看到繁體的題目與引導語；Voice 選單兩組（zh-TW、zh-CN）都列，一個聲音唸簡繁都行 | 使用者「沒有 project 的時候 Language 新增一個根據學生的資料設定」。產品有這個資料：Chinese program 的學生 profile 有 `targetLanguage`（zh-TW／zh-CN），Program 頁可批次改（`school/program/index.js`、`bulk-edit-students-dialog.js`）。demo 簡轉繁只收這幾題用到的字。`&lang=student`、`&pv=zh-TW` |
| 2026-11-13 | 第二步題卡打開時 **Answer conditions 可以編輯**：每條一個輸入框、✕ 刪、Must cover／Not required 各一顆 Add；收起時照舊唯讀清單；收起時空白的條目丟掉；改了的 AI 題掛 Edited | 使用者「Answer conditions 要可以編輯」。產品題庫頁是唯讀、後端生成，這裡改成老師可改——**待問工程**：老師改過的條件，改題目或建議答案時後端重產會不會蓋掉（建議：老師改過就不再自動重產，或重產後標示 New 讓老師看）；手寫題留空存檔才由 AI 寫 |
| 2026-11-13 | 第二步題卡打開時 Suggested answer 標題旁那句「the AI compares the student’s answer against this」拿掉 | 使用者「拿掉這句」。標題只剩 Suggested answer；v17 的 Content Base 卡還有 spoken 版那句，沒動 |
| 2026-11-13 | **沒有專案也能建（A 路）**：Project 選單最後一項 No project；選了多 Language 欄、名稱自己填、Article 不顯示、AI writes 停用只留 You write、第二步 Generate more 改叫 Add questions、第三步預覽左欄收掉 | 使用者「現在可以沒有 project 的新增 practice 嗎？分析可行性」→ 查產品碼：QA 綁兩層（練習→題庫→專案），語言、評分、學生端左欄都從專案查，但資料模型不擋（ESL／Reading Challenge 已是沒專案的練習）→ 給 A（只開手寫）／B（沒課文也 AI 出題）兩條路，建議 A → 使用者「A」。demo `&proj=none`（第二、三步帶三題寫好的 Extension 題「My weekend」）、`&lang=zh-TW`。待問工程四條見上面第 5 點 |
| 2026-11-13 | 第二步的 **Generate more** 從眉標右邊搬到題目清單最底下（置中；打開的面板也在底下，上面一條虛線） | 使用者「兩個題型的 Generate more 都改到放在最底下」（v17、v18 一起）。新題本來就接在清單最後，按鈕就在新題會出現的地方 |
| 2026-11-13 | 第二步眉標上「N of your own questions still need a question and a suggested answer before you can continue」那句拿掉 | 使用者「拿掉」。手寫題沒寫完 Next 照樣停用，跟 v17 一樣不另外說明 |
| 2026-11-13 | **What to ask 改成跟 v17 同一個模組**：一張 Extension 卡，示意只畫 AI 那張，卡底下兩列題數 `AI writes`（從課文出）／`You write`（老師自己寫）；Write an Extension question 那張卡拿掉、副標拿掉 | 使用者「Free response 的題型 UI 模組改成跟 Comprehension Quiz 一樣，上欄是根據原來課文、下欄是自己寫」。題數的狀態沒變（`counts.extension`／`counts.own_extension`、`&own=EX`），第二步照舊出對應的卡 |
| 2026-11-12 | 第二步題卡加回 **Answer conditions**（Must cover／Not required，唯讀） | 使用者問「現在哪些練習有 Answer conditions」→ 查到只有題庫頁的 Q&A 題有、題庫拿掉就沒入口 → 「對 要加回去」。照產品 `answer-conditions.js` 的樣子（#FAF5FF 底、#E9D5FF 框、紫標題、綠勾／灰圈）放在建議答案底下，收起、打開都顯示；打開時底下多一行講它會跟著題目／建議答案重寫、不能直接改；手寫題存檔前只有說明一行。mock 八題 Extension 各寫了 1–2 條 Must cover、1–2 條 Not required（`rc`／`nr`）。**沒畫**：改完題目後「條件更新中」的等待狀態（等工程回要幾秒） |
| 2026-11-11 | 練習改名 **Free response**；Content Base 搬去 v17，只剩 Extension | 使用者「把 Open-ended Questions 的 content based question 也改到 Comprehension Quiz，因為都是考 Comprehension 的內容」→「v18 的練習名改成 Free response」→「剩下 Extension 只有一種題型」。標題 *New Free response*；What to ask 剩兩張（**Extension** *About the student’s own life, building on the article*｜**Write an Extension question**）、總數兩格相加；Article 區提示改 *Extension questions build on this*；`&own=EX` 一個數。mock 的 content 題留在檔裡沒用。**還沒改**：Choose practice type 那張卡的名字與說明、側欄／產品的 practice type label、index 以外提到 Open-ended Questions 的頁（planning、元件總表）——改名要整套走，等定案後一起 |
| 2026-11-11 | Write a … 卡的示意改虛線灰條（同 v17） | 使用者在 v17 說「像是讓用戶直接在這頁打，會帶出錯誤的意圖」，這裡一起改：鉛筆＋題目虛線、學生回答虛線，不再畫輸入框和 placeholder |
| 2026-11-09 | What to ask 從兩張變四張 2×2：下排「Write a …」老師自己出題（同 v17） | 使用者「Open-ended Questions 也新增這樣的功能」。上排照舊（AI 出的 Content Base、Extension），下排 **Write a Content Base question**（*Your own question about the article — not AI*）、**Write an Extension question**（*Your own question about the student’s life — not AI*）：示意是虛線的空題目欄＋空的 Suggested answer 欄、灰底，鉛筆 icon 用該類別的顏色，題數 − N ＋ 同一套；總數四格相加。填幾題，第二步就在最後出幾張空白題卡（類別固定、掛 **Yours**、直接打開），寫題目和建議答案；拼音那行改寫 *Pinyin and audio are made from your question when you save*。題目或建議答案空著時 Next 灰著、眉標寫 *N of your own questions still need a question and a suggested answer before you can continue*；手寫題不掛 Edited。只填手寫題時第一步主鈕是 Next、不跑 Generating。Generate more 面板同一張四卡，手寫的接在最後、不掛 New。demo：`&own=CB,EX` |
| 2026-11-04 | 上下鈕搬到左邊把手那一欄 | 使用者「上下擺在這裡」（指拖曳把手）。題卡左邊一條直欄：∧、把手、∨，垂直置中；右邊只剩 Edit、Delete |
| 2026-11-04 | 題號膠囊改灰階、加上移／下移鈕 | 使用者「把 Q1 的 tag 改成灰階，增加往上往下改順序的按鈕」。Q 膠囊從綠底白字改灰底深灰字；題卡右邊 Edit 前多 ↑ ↓，第一題的 ↑、最後一題的 ↓ 灰掉；拖曳換序照留 |
| 2026-11-04 | 第三步學生預覽放上課文 | 使用者「把這一頁的預覽頁放上文章」（附產品學生端截圖）。照 `assignments/content/qa/content-window.js`：視窗左欄 Content（書本 icon、標題、底線、逐詞拼音，Pinyin 設定控制顯示），右欄題目（標頭改成 N Questions＋齒輪、guide phrase、題目泡泡、Play、Question x of N）。逐詞拼音用 pinyin-pro 產、只有「我的一天」有；Audio only 時左欄收掉（學生端純聽力不看課文——待確認） |
| 2026-11-04 | 第二步題卡拿掉播放鍵 | 使用者「在 Edit Questions 不用播放」。題卡右邊剩鉛筆、✕；聽題目在第三步 Settings & Preview 的學生視窗 |
| 2026-11-04 | Extension 不用灰色 | 使用者「Extension 示意不要用灰色」。示意卡底、icon、選中框、學生回答條改青綠（#F0FDFA／#CCFBF1／#0F766E／#14B8A6）；第二步的 Extension 小標同色，兩步對得起來 |
| 2026-11-04 | 題數欄改成「− 數字 ＋」 | 使用者「這個模組改成 - 1 ＋，兩邊的都改」。樣子照 v20 的 .stp；數字仍可直接打；0 時 − 灰掉。v17／v18 同一套，Generate more 也是 |
| 2026-11-04 | 照 v17 的原則改一輪 | 使用者「先依照 Comprehension Quiz 剛剛修改的原則修改」。①第一步先看課文、再問題目；課文整段不斷句、demo 加長成四段（Content Base 題的事實都還成立）②What to ask 兩種題目改成示意卡（Content Base：課文灰條裡一段標色＋問題條；Extension：問題條＋學生自己的回答條），總數大字擺在卡片上方 ③拿掉 10 題上限、底列原因、Use a suggested mix ④第二步建議答案直接展開（唯讀，鉛筆打開才改）、眉標提示句拿掉、Generate more 加重。Content Base／Extension 的類別 chip 保留（兩種都有，有資訊量） |
| 2026-10-23 | 第一輪：四步、第一步選專案＋勾教學點＋填兩類題數、第二步可改可追加、第三步只留工具列＋視窗 | 使用者「也做 Open-ended Questions 沒有 Question bank 的版本」。從 v13 proposal 分岔，格子與卡片跟 v17 同一套；題數預設 0、Use a suggested mix 直接套 v17 第三、四、五輪的定案 |
| 2026-10-23 | 第二輪：第一步的教學點 frame 拿掉 | 使用者「就不用 teaching point 了」。What to ask → Article → Generate；Generate more 的說明不再提教學點 |
| 2026-10-23 | 修：按 Generate 到不了第二步 | 使用者「現在沒辦法到第二步」。底欄少了「1 選單打開」那顆連結，render 最後一行 el('l0d') 是 null 就炸，計時器沒掛上。補上連結，兩個檔的那兩行改成 `el(id)?.classList`。用 CDP 走過「Use a suggested mix → Generate」和「從頭選專案 → 打字 → Generate」兩條路確認到第二步 |
| 2026-10-23 | 第三輪：格子底列的說明句拿掉 | 使用者「整句拿掉留總數和上限」。底列只剩「N questions · up to 10 of each」，擋住時才多一句原因 |
