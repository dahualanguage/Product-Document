# v15 — Practice-Sentence Building（FOLLOW_PATTERN · SENTENCE_BUILDING）

- **功能名稱**：Practice-Sentence Building（建立流程）——產品型別 `FOLLOW_PATTERN`、子型別 `SENTENCE_BUILDING`。產品裡跟 Sentence Response（`GUIDED_RESPONSE`）走同一條建立流程、同一份設定
- **網址**：https://dahua-dash-dev.web.app/dashboard/practice/create/?type=FOLLOW_PATTERN&subType=SENTENCE_BUILDING
- **分岔自**：**v12 第二輪（2026-10-22）**。使用者「直接開成兩個 v」——v12 原本一份檔用 `&sub=` 切兩個子型別，拆成 v12＝Sentence Response、v15＝Sentence Building，之後各自往下走、改一邊不動另一邊。代價：第一步、第四步、設定列那九成一樣的東西要改兩次
- **日期**：2026-10-22（拆版）
- **小 spec**：`spec.html`（從 v12 帶來，兩個子型別共用的查核仍在裡面）
- **設計檔**：`create-follow-pattern.html`（基準檔，預設 SENTENCE_BUILDING，`?step=` 從 0 數）、`proposal.html`（提案，子型別鎖死、`?step=` 從 1 數）
- **跟 Sentence Response 現在差在哪**（第一輪＝純複製，還沒分岔）：第一步只差標題；第二步沒有 Pattern 框、Question 是後端寫的造句指令、唯讀，眉標 *students build a sentence with the teaching point*；第三步畫布沒有 Use this pattern to answer:、提示句 Listen and build your own sentence、題目裡教學點高亮；第四步相同
- **可能要分岔的**（2026-10-22 討論中、未定）：第二步 Question 唯讀那一框要不要不畫、只留教學點＋建議答案；第一步要不要不問「幾題」、固定每點一題——這條卡在 E1
- **程式碼基準**：同 v12，dahua-dash `origin/develop` @ `c8179072`
- **狀態**：**2026-10-28 併入 v20**（`../v20-sentence-practices/proposal.html?type=building`；這份停在第一輪）。**2026-10-22 第一輪**——從 v12 第二輪整份複製、鎖死子型別（未 commit、未部署、已進 index 與 Planning）


## 要問工程的

- **E1 題數上限 20 是前端還是後端的？** 前端 `src/config/practices.js` 寫死 MIN 1／MAX 20（跟 Sentence Scramble 共用），`step-validators.js` 擋、數字欄夾回 20、預設題數＝點數跟 20 取小；送 API 的 `followPatternQuestionCount` 只是整數。GraphQL 後端的 repo 看不到，接真後端的 PR #776 沒提上限。要確認後端有沒有擋、能不能生超過 20（2026-10-22 使用者問）。

## v12 帶過來的（登記時查到的、基準檔與提案怎麼看）

下面是 v12 的原文，`&sub=` 那些在這份裡已經不用（提案鎖死 SENTENCE_BUILDING；基準檔預設 SENTENCE_BUILDING、`&sub=GUIDED_RESPONSE` 仍可切）。

## 登記時就查到的

1. **同一個東西三個名字。** 型別 label 是 Sentence Response（標題 New Sentence Response、Choose Practice Type 卡片），第二步 Question Review 的標頭卻寫 **Guided Response**（`follow-pattern-preview.js`：`isGuided ? 'Guided Response' : 'Sentence Building'`），學生端 intro 寫父型別 **Sentence Patterns**。Sentence Building 三處一致。
2. **第一步的說明句是舊文案。** 「Questions are generated from the selected teaching points once you pick a practice type and continue.」——子型別早在對話框選好、從網址帶進來（stepper-config 的註解自己也這樣說），第一步沒有「pick a practice type」這件事。生成完回到第一步也**沒有已生成清單**（Scramble 有 Generated Sentences），只有鈕從 Generate 變 Next。
3. **老師端看不到教學點在句子裡的位置。** chunk 的 `highlight` 旗標（`#D1FAE5` 底、`#065F46` 字）只在學生端 `FollowPatternChunks` 畫；老師端 `renderLine` 不讀 `highlight`，教學點只以卡片左上的 chip 出現。基準檔照老師端畫，所以第二步沒有高亮。
4. **Delete 不擋最後一題。** `handleDelete` 直接拿掉卡片再自動存檔，`handleSave` 才在 `kept.length === 0` 時 snackbar「Keep at least one question.」——畫面上已經是零張卡，按 Next 再被「Every question needs a question and a suggested answer.」擋。基準檔照這樣做。
5. **Pattern 不是模板，是答案挖空。** `follow-pattern-questions.js`：Pattern ＝ suggested answer 把一段以上換成 `＿＿＿`（`BLANK_PLACEHOLDER`），兩槽的點（一……就）每槽一個空格、教學點本身要留在 pattern 裡；老師改字時前端先跑 `findQuestionFailure`，錯了編輯器不關、錯誤寫在欄位下。
6. **Sentence Building 的題目是後端寫的、老師不能改。** `hasDerivedQuestion`：Question 框顯示伺服器從教學點寫出的句子（Edit 模式也是唯讀），前端沒有寫法；只有 `generation-draft-overlay.test.js` 的 fixture「請用「是」造句。」——實際文字**無法確認**，基準檔用「请用「起床」造句。」示意。學生端 Sentence Building 的題卡**沒有** Reference 框（「Use this pattern to answer:」只在 Guided），教學點不顯示給學生——但第三步 Audio Mode 的 tooltip 說「The pattern, the teaching point and the suggested answer are still shown」。
7. **第三步的小事。** Pinyin／Translation 下拉都是 enum 原字（`PINYIN`／`NO_PINYIN`／`STUDENT_CHOICE`、`SHOW`／`HIDE`／`STUDENT_CHOICE`）；FOLLOW_PATTERN 建立時兩者強制 `STUDENT_CHOICE`（`practice-create-input.js`，蓋掉表單預設 `PINYIN`）；沒有 Practice Name（Scramble 第三步有）；換 Speed／Voice 重生音檔的 ProcessingDialog 文案走 follow pattern 分支「Generating questions...」不是 audio 分支（跟 v7 問題 10 同款）；Suggested answer 的拼音是 `answerChunks.map(c => c.pinyin || c.text).join(' ')`，標點會混進去（「… qǐ chuáng 。」）。
8. 學生端有讀 `pinyinPreference`／`translationPreference`／`speedPreference`＋`changeSpeed`／`maxAttempts`／`audioMode`，五個都有（跟 Scramble 不一樣，Translation 這裡有用）。

## 基準檔怎麼看

`create-follow-pattern.html`，`?step=` 從 0 數。`&sub=GUIDED_RESPONSE|SENTENCE_BUILDING`（預設 GUIDED_RESPONSE）可以疊在任何一條上：標題、第二步標頭與卡片、第三步題目文字跟著換。

| 網址 | 看到什麼 |
|---|---|
| `?step=0` | 第一步 Teaching Points，還沒選專案 |
| `?step=0&proj=0` / `&proj=1` / `&proj=2` | 選了「我的一天」（七個點全勾、題數自動 7）／「环境保护与可持续发展」（12 個點、沒有題目假資料）／「餐厅点餐（对话）」（0 個點） |
| `?step=0&proj=0&warn=1` | 題數改成 4 的黃色警告 |
| `?step=0&proj=0&gen=1` / `&done=1` / `&fail=1` | 生成中（skeleton、Generate 轉圈）／生成完回到第一步（欄位照舊、鈕變 Next、沒有清單）／失敗的紅色 Alert |
| `?step=1` | 第二步 Question Review：Practice Name、Guided Response 標頭、Teaching Points header、七張題卡（Question → Pattern → Suggested answer） |
| `?step=1&sub=SENTENCE_BUILDING` | 同上，Sentence Building：藍色標頭、沒有 Pattern 框、Question 是後端寫的造句指令 |
| `?step=1&edit=1` | 第一題編輯中（答案改過：翻譯欄鎖住、Auto-update on save、header 鎖住「Save your changes first…」）；`&sub=SENTENCE_BUILDING` 時 Question 框唯讀 |
| `?step=1&py=1` / `&regen=1` | Edit Pinyin 對話框／存檔後重生的 ProcessingDialog「Updating pinyin & translation...」 |
| `?step=2` | 第三步 Settings：Audio Mode 卡（關）、Audio Settings、Student Settings（Pinyin／Translation／Attempts per question）、Questions (7) 每題兩顆播放 |
| `?step=2&audio=1` / `&sc=1` / `&voice=1` | Audio Mode 開（primary.lighter 底）／Speed 選 Student choice 的 helper／換聲音重生音檔的 ProcessingDialog |
| `?step=3` / `&assigned=1` | 第四步 Assign（八種共用，照 v7） |

互動（不靠網址）：第一步勾點、Select All、加 Custom 點、改題數、按 Generate 走一遍（1.6 秒後跳第二步）；第二步上下移、Edit／Cancel／Save、Delete（刪到零張出 snackbar）、點拼音開 Edit Pinyin；第三步 Audio Mode 開關、四個下拉（換 Voice 開重生對話框）。

## 提案怎麼看

`proposal.html`，`?step=` 從 1 數（基準檔仍從 0 數）。`&sub=GUIDED_RESPONSE|SENTENCE_BUILDING`（預設 GUIDED_RESPONSE）可以疊在任何一條上：標題、第二步眉標與卡片（Sentence Building 沒有 Pattern 框、Question 唯讀）、第三步畫布（沒有 Use this pattern to answer:）跟著換。`&proj=0|1|2` 跟基準檔同一個索引（Planning 用）。

| 網址 | 看到什麼 |
|---|---|
| `?step=1` / `&proj=0` / `&dd=1` / `&pool=1` | 第一步 Teaching Points：v7 的版面（Project 多選 `.dd`、Practice name、每專案一個 `.frame` 的 teaching point chip、Add teaching points）＋ 眉標 **HOW MANY QUESTIONS** 一張卡（數字欄 · questions · up to 20 · across 7 teaching points · 1 each，第二輪起在 frame 上面、照 v7）。沒選專案／沒勾點時 Generate 灰、原因寫在內容區 |
| `?step=1&proj=0&n=12` / `&warn=1` | 問 12 題（1–2 each）／題數 4 少於點數：算式轉琥珀 *only 4 of 7 teaching points get a question · ask for 7 to cover them all* |
| `?step=1&proj=2`（或把點全部取消勾選） | 沒勾點：How many questions 的欄位鎖住留空，同一列琥珀寫 *tick at least one teaching point below · questions are written from the points you tick*；Generate 灰。frame 裡只有「No teaching points. You can add some below.」 |
| `?step=1&proj=0&gen=1` / `&back=1` | 生成中（Generate 轉圈、綠色 loading 卡）／生成後回到第一步（不鎖；frame 標頭寫「已生成，多勾的點按 Next 才生」） |
| `?step=2` | 第二步 Question Review：TEACHING POINTS · 7 一排小卡（點名 ＋ n questions ＋ −／+；總數 20、每點 5）＋ QUESTIONS · 7 題卡（綠膠囊題號 ＋ 拖曳、教學點 chip、Edit／Delete；Question → Pattern（琥珀）→ Suggested answer（綠），拼音在字上、翻譯小字）。刪到剩一題擋、寫原因 |
| `?step=2&sub=SENTENCE_BUILDING` | 同上，Sentence Building：沒有 Pattern 框、Question 是後端寫的造句指令、眉標寫 *students build a sentence with the teaching point* |
| `?step=2&edit=1` / `&py=1` / `&regen=1` | 第一題編輯中（改中文 → 翻譯欄鎖住、Auto-update on save；Sentence Building 時 Question 唯讀）／Edit Pinyin 對話框／存檔後重生的 ProcessingDialog |
| `?step=3` / `&audio=1` / `&pin=PINYIN&tr=HIDE` / `&sc=1` | 第三步 Settings（R11 工具列＋學生題卡）／Audio only：Pinyin／Translation 換成一句、題目框只寫 Listen to the question／Pinyin 固定顯示、Translation 固定藏／Speed 選 Choice by student |
| `?step=3&voice=1` / `&settings=1` / `&all=1` / `&tip=1` | Voice 選單打開／學生的齒輪面板打開（Choice by student 才有）／換題清單打開（每列一顆播放鍵）／Max tries 的 tooltip |
| `?step=4` / `&pick=3b,4a&roster=3b` / `…&review=1` / `&assigned=1` | 第四步 Assign：v7 的原樣 |

互動（不靠網址）：第一步勾點、全選、From Project ＋ Custom 加點、改題數、按 Generate 走一遍（1.6 秒後跳第二步）、回頭改勾選再 Next 只補新點；第二步小卡 −／+、拖曳換序、Edit／Cancel／Save（改中文出 ProcessingDialog）、Delete、點拼音開 Edit Pinyin；第三步每一格都能點，畫布跟著變、Play／每列播放鍵假裝播 1.4 秒。

## Change log

<!-- 只記 UX——流程、語意、互動、命名；純視覺替換不進這張表，逐輪的視覺改動在 proposal.html 檔頭註解。
     基準檔的複刻與修正、mock 自己的 bug 是鷹架，也不記。 -->

| 端 | 改了什麼 | 說明 |
|---|---|---|
| 老師 | **第一輪：套共用設計 S1–S9／R11** | 2026-10-19。使用者「現在基礎的 UI 不一致」——Planning 嵌的前四種是走過迭代的 proposal，四張新卡嵌的是原樣複刻；這一輪替 v12 做 `proposal.html`，從 v7 的 proposal 分岔。**第一步**：S1 Practice name 在第一步、S2 Project 多選 `.dd` ＋ 每專案一個 `.frame` 的 chip ＋ Add teaching points（v7 的），Number of questions 放 frame 底下同一列（預設＝勾的點數、上限 20；少於點數時說哪幾個點沒題，取代基準的黃色 Alert）；基準的舊說明句「once you pick a practice type」拿掉；Generate 後自動進第二步，回頭不鎖、只生新勾的點。**第二步**：照 v7 版式（眉標 ＋ 每點一張小卡 −／+ ＋ 題卡）；卡內 Question／Pattern／Suggested answer 三塊照基準；基準的 Practice Name、Guided Response 標頭（跟型別 label 不一致，見問題 1）、「Select a teaching point · Generate」那列、上下箭頭拿掉；刪到剩一題擋並寫原因（R9；基準是刪到零張再 snackbar，見問題 4）。**第三步**：R11 工具列 ＋ 視窗預覽，搬畫廊 `#p-fp`：Practice mode Text visible｜Audio only（S5）、Pinyin／Translation 分段控制項（S4，值仍是 enum）、Speed chip ＋ Voice 下拉（S7）、Max tries −／+ ⓘ（S6）；畫布＝學生的題卡；基準的 Audio Mode 卡、三個 enum 下拉、Questions (n) 唯讀清單拿掉。**第四步**：v7 的 Assign 原封不動（S8）。頁腳 Generate → Next → Save → Assign（S9）。 |
| 老師 | **第二輪：先問幾題、再勾點；沒勾點的原因只寫一處** | 2026-10-21。使用者「跟 Sentence Scramble 一樣先問要產出幾句」——Number of questions 從 teaching point frame 底下搬到上面，照 v7 的版式（眉標 HOW MANY QUESTIONS → 一張卡 → 灰底算式列），沒有 v7 的兩張來源卡（這裡只有生成）。同一輪：第一步沒勾任何教學點時，原本 frame 裡、題數列、底下一行琥珀警告三句話講同一件事，鎖住的題數欄還印著一個沒來由的 8。收成一處：原因只寫在 Number of questions 那一列（琥珀），欄位留空；frame 裡那句留著（它講的是 frame 自己）。R8 只講例外、R9 灰著要給原因——一個原因一個地方。 |
| 老師 | **v15 第一輪：從 v12 拆出** | 2026-10-22。使用者「直接開成兩個 v」。整份複製 v12 第二輪，proposal.html 鎖死 SENTENCE_BUILDING，底欄「另一張」連回 v12。畫面跟 v12 的 Sentence Building 狀態一模一樣，還沒分岔。 |
