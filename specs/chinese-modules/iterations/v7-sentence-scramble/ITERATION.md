# v7 — 優化 Practice-Sentence Scramble

- **功能名稱**：優化 Practice-Sentence Scramble（建立流程）
- **網址**：https://dahua-dash-dev.web.app/dashboard/practice/create/?type=SENTENCE_SCRAMBLE
- **截圖**：使用者尚未提供。基準檔照程式碼複刻，之後拿實機截圖對一次
- **分岔自**：v6（外殼、第四步 Assign、ProcessingDialog 沿用基準複刻；前三步新畫）
- **日期**：2026-09-18（登記）
- **小 spec**：`spec.html`（四步現況 ＋ 學生端拼句 ＋ 查到的十一個問題 ＋ 待決 D1–D4／要問工程 E1–E6）
- **設計檔**：`create-scramble.html`（基準檔，現行產品的複刻，`?step=` 從 0 數）、`proposal.html`（**提案**，`?step=` 從 1 數；第一輪只換第一步）
- **範圍**：New Sentence Scramble 這條建立流程的四步。學生端不改，spec §6 抄出來了
- **程式碼基準**：dahua-dash `origin/develop` @ `7e2afa52`（2026-09-18 fetch）
  - 從 v6 的基準 `3e821fa4` 之後動到的 scramble 檔：`scramble-segment-editor.js`（新）、`sentence-scramble-preview.js`、`utils/scramble-tokens.js`——剪刀切塊是新功能，基準檔照新的畫
- **狀態**：**2026-10-05 定案（第二十七輪）並交接**——使用者說「好 儲存一樣打包」。交接包 `handoff/sentence-scramble/`：`sentence-scramble.html`（＝ proposal.html 的複本，路徑改成絕對）、`HANDOFF.md`、`API-CONTRACT.md`（每點份額 `scramblePointCounts`、例句來源 `scrambleSourceSentences`、第二步 +＝append 一句、CREATE 回頭只生新的）、`index.html`。第二十一～二十七輪（10/2–10/5）見 change log：第一步問總句數（上限 20）、分成「幾句」與「從哪來」兩部、照 v6 第二步版式；第二步接上第一步、每點一張小卡 −／+（總數 20、每點 5，卡內藍字提示）。上一個儲存點 2026-09-30 第二十輪（已部署）。程式碼基準交接時 fetch 到 `b130ab5b`：自 `7e2afa52` 起動到 scramble 的只有 #981／#990（第二步顯示新句的拼音、發音 sandbox），流程與欄位沒變。

## 登記時就查到的

1. **第一步叫 Content，裡面是教學點。** Planning 早就指出並改叫 scrpts；名稱在第一步被設、第二步才看到。
2. **Generate 之後改一個點就整份重生**，第二步的編輯全丟、沒提醒——但產品 EDIT 模式與第二步 header 已經有 append（只補新的），CREATE 第一步不走這條。
3. **題數會被勾選蓋掉**（每勾一個點自動重設成點數）。
4. **第二、三步是同一支檔案的兩個 mode**：第三步的 Sentences 清單是第二步再抄一遍，只多播放鈕；第二步反而不能試聽。
5. **老師端沒有學生畫面**：詞塊列是正確順序、拼音在上；學生看到的是打散的 tiles ＋ 虛線 slot、粉紅系、只能點不能拖。
6. **Pinyin 下拉是 enum 原字**、**Attempts per sentence** 用完是揭曉正解不是 auto pass；換 Speed／Voice 的等待文案走錯分支（「Generating sentences...」）。
7. 學生端有讀 `pinyinPreference`／`speedPreference`／`changeSpeed`／`maxAttempts`；`translationPreference` 沒讀、老師端也沒得設，翻譯只在答錯用完揭曉時出現。

## 基準檔怎麼看

`create-scramble.html`，`?step=` 從 0 數：

| 網址 | 看到什麼 |
|---|---|
| `?step=0` | 第一步，還沒選專案 |
| `?step=0&sel=1` / `&warn=1` | 選了「我的一天」，七個點全勾、題數自動 7；`&warn=1` 題數 4 的黃色警告 |
| `?step=0&gen=1` / `&done=1` / `&fail=1` | 生成中（skeleton、Generate 轉圈）／生成完回到第一步（Generated Sentences、鈕變 Next）／失敗 |
| `?step=1` | 第二步 Edit Sentences：Teaching Points header ＋ 七張句子卡 |
| `?step=1&edit=1` / `&cut=1` / `&py=1` / `&regen=1` | 第一句編輯中／第二句剪刀模式／Edit Pinyin 對話框／存檔後重生的 ProcessingDialog |
| `?step=2` / `&sc=1` / `&audio=1` | 第三步 Settings／Speed 選 Student choice／換聲音重生音檔 |
| `?step=3` / `&assigned=1` | 第四步 Assign（八種共用） |

## 提案怎麼看

`proposal.html`，`?step=` 從 1 數（基準檔仍從 0 數）：

| 網址 | 看到什麼 |
|---|---|
| `?step=1` / `&sel=1` / `&dd=1` / `&back=1` | 第一步 Teaching Points：v4 的版面（專案多選、名稱 A + B、勾點、Add teaching points）＋ HOW MANY SENTENCES（數字欄 · up to 20 · across 7 teaching points · 1–2 each）＋ 兩張來源卡 |
| `?step=1&sel=1&n=12` / `&n=20` | 問 12 句／到頂 20（up to 20 轉琥珀、第一步的 + 灰） |
| `?step=1&sel=1&ex=1&n=12` | 選「Example sentences from teaching points」：照份額預勾每點的例句（12 of 14 picked），清單在 Add teaching points 之下可逐句取消；沒例句的點底下一條 *No examples for X · N sentences will be generated to reach 12* |
| `…&exmode=add` | 第十一輪的附加版，留著回看 |
| `?step=2&n=12` | 第二步 Edit Sentences：TEACHING POINTS · 7 一排小卡（點名 ＋ n sentences ＋ −／+；眉標 *Up to 20 in total*）＋ SENTENCES · 12 句子卡（綠膠囊題號＋拖曳、教學點 chip、詞塊、翻譯；剪刀／編輯／刪除）。按 + 到每點 5 句或總數 20 時 + 灰、卡裡藍字說原因 |
| `?step=2&cut=1` / `&edit=1` / `&del=1` / `&py=1` | 第二句剪刀模式（能切／合／Save）、第一句編輯中、刪了第二句、Edit Pinyin |
| `?step=3` / `&voice=1` / `&pyc=1&settings=1` / `&all=1` | 第三步 Settings（R11 工具列＋學生拼句畫布）／Voice 選單打開／Pinyin 選 Choice by student、學生的齒輪面板打開／換句清單打開（每列一顆播放鍵） |
| `?step=4` / `&pick=3b,4a&roster=4a` / `…&review=1` / `&assigned=1` | 第四步 Assign：v4 的提案 |

## Change log

<!-- 只記 UX——流程、語意、互動、命名；純視覺替換不進這張表，逐輪的視覺改動在 proposal.html 檔頭註解。
     基準檔的複刻與修正、mock 自己的 bug 是鷹架，也不記。 -->

| 端 | 改了什麼 | 說明 |
|---|---|---|
| 文件 | **第二十八輪：定案、交接** | 2026-10-05。使用者「好 儲存一樣打包」。交接包 `handoff/sentence-scramble/`（原型複本、HANDOFF.md、API-CONTRACT.md、index）；index 卡片狀態改 done、第一顆鈕改成交接包。設計沒改。 |
| 老師 | **第二十七輪：第二步每個教學點上限 5 句，上限的理由寫在小卡裡** | 使用者指示（2026-10-05：「設定一的 teaching point 上限 5 句」「新增到五點的時候用小字在卡裡面提示」「滿 20 的時候不能再往上加的理由也寫在小卡裡」）。小卡到 5 句時 + 灰、卡裡一行藍字 *Up to 5 per point*；總數到 20 時每張卡 + 都灰、卡裡寫 *Up to 20 in total*（同時到兩個上限的卡優先寫 per point）。眉標提示從「You asked for 16 sentences · now 20 after edits · add or remove per point below · up to 20 · up to 5 per point」收成 **Up to 20 in total**（使用者「太多資訊了」）——第一步填的數字改過就不是事實、總數 SENTENCES · N 已在講、−／+ 自己會說。步進器的 disabled 樣式加強（灰底、淡四成、禁止游標），之前只是字色變淡、看起來還能按。提示字一度琥珀，使用者改藍。 |
| 老師 | **第二十五～二十六輪：第二步每個教學點一張小卡，−／+ 加減該點的句子** | 使用者指示（2026-10-02：「看不懂膠囊裡的 2 是句子數量」→ 四走法 A 單位寫進膠囊／B 上面小標／C 小卡＋數字放大／D 小表，選 **C** 並加「可以增加或刪減」；「第二步新增單字的卡片，都可以加到 20 個」）。每點一張 `.tpc-card`：點名 chip ＋「2 sentences」＋ −／+。+ 把這個點的下一句接在它最後一句後面（＝再生一句，append）；− 拿掉這個點最後一句；整份剩一句擋。基準那列「Select a teaching point · Generate one more」拿掉。第一步備注欄最前面的 ⓘ、眉標提示的 −／+ 圖示拿掉（使用者「拿掉 icon」）。 |
| 老師 | **第二十四輪：第二步接上第一步** | 使用者指示（2026-10-02：「下一步沒有跟上一步的動作連結、讓 teaching point 的數量可以更好被理解」）。句子清單照第一步問到的總數與份額（`defaultOrder()` 用 `shares()`），SENTENCES · N 跟著變；點 chip 的 (1) 改成右邊一顆數字徽章（第二十五輪再改成小卡）。 |
| 老師 | **第二十一～二十三輪：第一步直接問「總共要幾句」，分成「幾句」與「從哪來」兩部，版式照 v6 第二步** | 使用者指示（2026-10-02：「第一步會問老師要幾句，並告訴老師上限是 20 句」「問他幾句之後再問要用重新生成還是用 teaching point 內的句子，分成兩部」「參考這個 UI」）。生成卡裡的每點幾句步進器換成**總句數數字欄**（預設＝勾的點數、下限＝點數、上限 20 打超過夾回且 up to 20 轉琥珀；打字中不夾、離開欄位才夾），旁邊 *across 7 teaching points · 1–2 each*；總數**輪流分**給勾的點（`shares()`）。兩部：眉標 HOW MANY SENTENCES → 一張 canvas → 灰底備注欄（數字欄 · sentences · up to 20 · across …）→ 兩張來源卡 **Generate new sentences**｜**Example sentences from teaching points**（卡裡只剩一句說明）。例句模式也照份額預勾、`exTotal()`＝max(總數, 勾的)，清單底下改寫 *No examples for X · N sentences will be generated to reach 12*。這一輪收回第二十輪「拿掉 20 上限」：上限照產品 `MAX_QUESTION_COUNT`。 |
| 老師 | **第二十輪：拿掉 20 句上限；例句模式下沒有例句的點照樣生** | 使用者指示（2026-09-30：「先拿掉上限 20 的這個限制」「下面沒有例句的幫我生」）。之前「每點 2 句」在點數 × 2 > 20 時灰掉，而且判斷用的是全部勾的點（含沒例句的自訂點），老師勾 20 個點就被擋。上限整個拿掉：步進器只留每點最多 5 句，例句的 1｜2 一律能選；**產品的 MAX_QUESTION_COUNT = 20 是真的擋在後端，要問工程能不能放寬（E7）**。例句模式改成混合：有例句的點用勾的例句（勾幾句算幾句），沒有例句的點（自訂加的、專案沒例句的）照「每點幾句」生——例句卡裡不放算式（使用者：不用那一句），例句清單底下一條 *No examples for 睡觉、一……就 · 1 sentence each will be generated*。「N points have none picked」那句警告不再需要。第二步的假句子清單沒跟著變（本來就是固定 mock）。 |
| 老師 | **第十九輪：第一步先問「句子從哪來」——兩張選項卡** | 使用者指示（2026-09-30：「第一步就先詢問要生成例句還是用 teaching point 的」）。原本「用例句」是 teaching point 框裡的一個開關（第十輪），老師要先勾完點、往下捲才看得到有這條路，而且開關開了上面的步進器會消失（第十三輪），兩個決定藏在兩個地方。改成 Practice name 底下一段 **SENTENCES**、兩張選項卡（v6／v8 同一套）：**Generate new sentences**（卡裡是每點幾句的步進器＋算式 7 × 1 = 7 sentences）｜**Example sentences from teaching points**（標題使用者 2026-09-30 定，名詞片語跟左邊的 Generate new sentences 不對稱但更短；卡裡是每點 1｜2 ＋ 算式；沒選時寫 14 available）。選了例句，teaching point 框裡攤開例句清單、放在框最下面 **Add teaching points 之下**（使用者定的位置），上面一行 *Example sentences · Untick any you don’t want · 7 of 14 picked*；開關那一列拿掉。沒有例句可用時例句卡淡掉。資料與公式沒變（`S.exOpen`、`exAutoFill`、`perMax`）。 |
| 老師 | **第十八輪：畫廊回套——清單每列一顆小播放鍵** | 使用者看共用設定畫廊時定的（2026-09-23），2026-09-29 回套。第三步 Sentence x of N 展開的清單每列一顆小播放鍵，點了只聽那一句、不換預覽。Listen to sentence 那顆粉色鈕不動（畫廊也沒動它）。 |
| 老師 | 第十七輪：第四步 Assign 就是 v4 的提案 | 使用者要 Assign 也套新頁面（2026-09-21）。分岔時第四步已經帶了 v4 的提案（S8 搬回頁面：勾班、名單、Review、Assign to N classes），這一輪只確認它在 v7 裡沒壞——發現分岔時切掉了三個 helper，這一步一直是空白的，補回來。沒有新的設計決定。 |
| 老師 | **第十六輪：第三步套共用設計（R11 工具列＋畫布）** | 使用者指示（2026-09-21：「settings 套入我們設定好的共用設計」）。照 shared-practice-changes 的 S3–S7 與畫廊裡 Scramble 那一格：**工具列**兩列——`PINYIN · Shown｜Hidden｜Choice by student`（S4，取代 enum 原字的下拉）／`SPEED` 三顆試聽 chip ＋ Choice by student、`VOICE` 下拉（S7）‖ `MAX TRIES · [− 3 +] ⓘ`（S6，取代 Attempts per sentence；tooltip 寫 Scramble 的後果：用完揭曉正確順序、往下一句）。沒有 Practice mode（沒有 audioMode）、沒有 Translation（學生端沒讀）。**畫布**＝學生的拼句畫面（`sentence-scramble/index.js` 的那張卡：粉紅提示句、0 / 3 tries、Listen to sentence · Normal · Xiaorou、虛線 slot、打散的 tiles、Check），跟 v3／v4 一樣不畫頂欄；齒輪只在 Pinyin 或 Speed 是 Choice by student 時出現，面板照 settings-panel.js；底下「Sentence 1 of 7 ▾」換句。頁腳 *7 sentences*。**基準的 Sentences (7) 唯讀清單拿掉**（D3 定案：畫布就是句子，試聽在畫布上）。 |
| 老師 | **第十五輪：剪刀、編輯、刪除三個動作都做出來** | 使用者指示（2026-09-21）。**剪刀**：點那一句的剪刀，詞塊拆成字、字與字之間一條縫，點一下切（粉紅豎線）再點合；*Split into characters* 一次全切；底下 Preview 即時重組；Save 才寫回詞塊（同一句再點剪刀就關）。**編輯**：中文、翻譯兩個輸入框，中文一改就出 *Auto-update on save* 提示（存檔後後端重生拼音／翻譯／音檔），Save 寫回；mock 不做重生動畫。**刪除**：當下拿掉那一張，題號與教學點的句數跟著變；剩一句再刪擋住，上面出黃色提示 *Keep at least one sentence.*（產品是 snackbar）。用 CDP 驗過：切 早｜饭 存檔後詞塊變六塊、翻譯存得進去、刪到剩一句擋住。 |
| 老師 | **第十四輪：題號統一成 v6 的綠膠囊 ＋ 拖曳** | 盤點後使用者 OK（2026-09-21）。題號有三種長相：v6 綠色實心膠囊＋拖曳把手、v7 基準粉紅文字＋上下箭頭、第三步灰字「1.」。粉紅是 Scramble 的識別色，但題號與排序是八張卡共用的，跟卡的顏色沒關係。第二步句子卡改成綠膠囊 Q1 ＋ 左邊拖曳把手、卡可以拖，上下箭頭拿掉；標頭順序對齊 v6：把手、Q 號、教學點 chip（留粉紅），右邊剪刀／編輯／刪除。第三步的「1.」等 D3 決定那份清單留不留再說。 |
| 老師 | 第十三輪：1｜2 放到開關那句後面 | 使用者指示（2026-09-21）。開關、「1｜2 per point」、總數（*7 × 2 = 14 sentences · nothing generated*）收成同一列；開關開著時上面每點幾句那塊不出現，決定跟結果在同一行。 |
| 老師 | **第十二輪：取代版定案，加「每點一句｜兩句」** | 使用者選取代版（2026-09-21：「1 取代版可以選一句或是兩句」）。開關開了，上面那塊變成 **Example sentences per teaching point · 1｜2**：切了就自動把每個勾的點的前一句或兩句勾起來（專案每個詞剛好兩句例句），總數 *7 points × 2 = 14 sentences · from examples, nothing generated*；清單留著可以逐句微調，手動改過就顯示 *N sentences · from examples, adjusted below*；沒勾例句的點琥珀字提醒。2 那格在點數 × 2 超過 20 時灰掉。附加版收掉，只留 `&exmode=add` 回看。 |
| 老師 | **第十一輪：例句「取代」與「附加」兩個版本並存** | 使用者要兩個版本比（2026-09-21）。**取代版**（`&exmode=replace`）：開關叫 *Use example sentences instead of generating*，開了就只用勾的例句、一句不生——每點幾句那塊換成一行「N sentences · from the examples you pick below, nothing generated」，步進器與「只用例句」checkbox 都不出現；沒勾例句的點琥珀字提醒。**附加版**（預設，目前）：開關叫 *Use example sentences from these teaching points*，例句算進每點目標、不夠才生（第八輪公式），要一句不生就勾 checkbox。兩版差在「開關」的意思：取代版是「換一種來源」，附加版是「多一種來源」。 |
| 老師 | **第十輪：例句那段改成開關** | 使用者指示（2026-09-21：「做一個開關『要選用 teaching point 例句』才會展開例句」）。原本是摺疊的 chevron；改成一顆 switch **Use example sentences from these teaching points**，右邊寫 *N picked · M available*。開了才展開清單；關掉的話勾過的例句不算、「只用例句」也一起關——開關就是「要不要用例句」這個決定，清單是它的結果。 |
| 老師 | 第九輪：每點幾句那塊副標太多 | 使用者指示（2026-09-21）。標籤、算式、checkbox、說明句四層疊在一起；說明句拿掉，只留算式一行。「N 個點沒勾例句」併進算式那行、琥珀色；上限與「例句先算」的說明只在 ＋ 的 tooltip。 |
| 老師 | **第八輪：每點幾句的公式改成「目標數、例句先算」，多一個「只用例句」選項** | 先討論（2026-09-21）。第四輪的公式是「例句 ＋ 點數 × N」——N 套到每一個點，老師幫起床勾了例句還會再幫起床生一句，看得出總數、看不出哪個點兩句；欄位名稱還會跟著狀態變。使用者選方案 A 並要「全用例句、一句不生」變成一個選項。改法：**N 是每個點的目標數，勾的例句先算進去、不夠的才生**——每點拿 max(N, 該點勾的例句數)，總數那行寫 *7 points × 1 = 7 sentences · 3 from examples, 4 generated*（某點勾的例句多過 N 時多出來的寫 *+ 1 extra example*）；欄位名稱固定 Sentences per teaching point，N 最小 1。步進器底下一個 checkbox **Use the picked examples only — generate nothing**（勾了例句才出現）：勾了步進器灰掉，總數＝例句數，沒勾例句的點沒有句子，說明句直接說有幾個點分不到、請補勾或關掉。上限 20 總數，＋ 灰掉的門檻用總數算。 |
| 老師 | 第七輪：每點幾句改到 Practice name 底下 | 使用者指示（2026-09-21）。第六輪放在專案選單之前，太早——還沒選專案就問每點幾句沒意義；改到 Projects、Practice name 之後、teaching point frame 之前：先選來源、取名，再定每點幾句，再勾點。 |
| 老師 | 第六輪：每點幾句搬到第一步最上面 | 使用者指示（2026-09-21），問過確認是第一步不是第二步。Sentences per teaching point 的步進器＋總數從頁尾搬到專案選單之前：老師一進來先決定每點幾句，再勾點；還沒選專案時說明句寫 *Pick projects and tick teaching points below; the total updates as you go*，總數 0 × 1 = 0。 |
| 老師 | 第五輪：第二步照其他頁的版式 | 使用者指示（2026-09-21：「根據其他頁的 UI 邏輯排列這一頁，標題不用再重複一次」）。產品第二步頂著 icon ＋「Sentence Scramble」＋一句說明，跟頁首重複；改成 v6 的眉標＋卡：**TEACHING POINTS · 7**（卡裡是每點幾句的 chip ＋ 選一個點 Generate one more）→ **SENTENCES · 7**（眉標右邊寫 *In this order · arrows to reorder · scissors to adjust blocks · click pinyin to fix tones*，底下句子卡）。 |
| 老師 | **第四輪：從 Teaching Points 選例句當題目（PM 需求，方案 A）** | PM 需求（2026-09-21）：老師可以直接勾專案裡 teaching point 現成的例句當 Scramble 題目，保留原本的生成。討論了三個放法（A 第一步 frame 裡多一段、B 第一步模式切換、C 第二步 header 加一顆），使用者選 **A**。做法：勾了的點底下多一段 **Example sentences**（摺疊，像 From Project；標頭 *N picked · M available*），展開後逐點列出例句（中文、拼音、翻譯）各一個 checkbox，預設不勾——現有流程一個字不用改；Custom 的點沒有例句就沒有這段；取消勾的點，它的例句也不算。**勾的例句直接帶進去不生成**（切詞、音檔跟生成的走同一條，要問工程）。步進器改成「每點再生幾句新的」，勾了例句才能到 0；總數那行變 *4 picked from examples + 7 points × 1 = 11 sentences*，上限仍是 20（例句先扣掉再算每點上限）。要問工程：E7 建立時能不能直接帶指定句子進去、E8 例句有沒有音檔、E9 生成能不能避開已勾的例句。 |
| 老師 | **第三輪：每點幾句的上限跟著點數算** | 使用者指出（2026-09-18）：沒勾全部的點時，每點其實可以多幾句——1｜2｜3 的固定檔位是假的上限。改成 **− n ＋ 步進器**，上限＝20 ÷ 勾的點數（4 個點到 5、7 個點只能 2）；到頂 ＋ 灰掉、tooltip 說再加就超過 20；說明句寫 *up to N per point with M points (20 sentences max)*。勾回更多點時每點數自動夾回上限（7 點時 5 → 2），總數永遠 ≤ 20。用 CDP 驗過。 |
| 老師 | **第二輪：Number of questions 改問「每個點幾句」** | 先討論（2026-09-18）。產品問總數（1–20，預設 8，每勾一個點就被蓋成點數，點數多過題數才警告）；Planning 說題數獨立於點數、句子輪流分。問題：這個數不像 v6 有矩陣可以算，是老師真的要決定的，但「總數」讓老師自己算除法——7 個點填 10 題，哪三個點有第二句看不出來；而第二步 header 又有「選一個點再生一句」，兩套加句子的方式。三個走法：A 改問每個點幾句、B 欄位拿掉一點一句到第二步逐點加、C 維持總數靠說明句補。使用者選 **A**：`Sentences per teaching point · 1｜2｜3`，總數算出來寫旁邊 `7 points × 2 = 14 sentences`；每個點一定有句子，「分不到」的情況消失；要單獨多給某個點，第二步 header 那顆留著。上限照產品 20 總數，超過的檔位灰掉、tooltip 說明。 |
| 老師 | **第一輪：第一步套 v4 的版面，中間兩步先不動** | 使用者指示（2026-09-18：「先套上 v4 的版面」）。從 v6 的 proposal.html 分岔：①第一步改叫 Teaching Points（產品叫 Content，Planning 早說名字騙人），用 v4 的版面——專案多選、名稱 A + B 在第一步（S1）、勾 teaching point、Add teaching points（From Project ＋ Custom，自訂點是純文字、沒有型別）、Generate 生成、回頭不鎖只生新的（S10，要問工程 E1）；②多一個 **Number of questions**（Scramble 自己的）：預設＝勾的點數（上限 20），老師改過就不再跟著點數跑（產品會蓋掉，問題 3），說明句寫「在勾的點之間輪流分」，點數多過題數時直說哪幾個點分不到；③生成鈕照產品叫 Generate、生成後叫 Next；④第二步 Edit Sentences、第三步 Settings 照基準檔抄，只拿掉 Practice Name；⑤第四步 Assign 照 v4。這一頁刻意新舊並置，中間兩步的落差是下一輪要決定的。 |
| 文件 | 登記：基準檔 ＋ spec | 2026-09-18。外殼與第四步從 v6 基準分岔；前三步照 `step-one-sentence-scramble.js`、`sentence-scramble-preview.js`（sentences／settings 兩個 mode）、`scramble-chunk-row.js`、`scramble-segment-editor.js` 複刻；學生端照 `assignments/content/sentence-scramble/`。spec §7 十一個問題、§8 四題待決 ＋ 六題要問工程。 |
