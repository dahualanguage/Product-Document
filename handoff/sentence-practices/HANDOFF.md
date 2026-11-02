# Sentence 練習建立流程（四種）— Engineer Handoff

老師建立 **Sentence Scramble、Sentence Cloze、Sentence Response、Sentence Building** 這四種練習的流程。四種的結構一樣（選教學點 → 看句子或題目 → 設定 → 指派），共用的東西寫一次、四種一起做；各練習只標不一樣的地方。

```
四種都是  Teaching Points → Edit Sentences（Response／Building 叫 Question Review）→ Settings → Assign Practice
```

**這不是重寫，是在現有流程上改。有後端。** 程式碼基準：`dahua-dash` `origin/develop` @ `7528c30f`（2026-10-27）。欄位與 API 在 [`API-CONTRACT.md`](API-CONTRACT.md)。

Sentence Scramble 在 2026-10-05 已經交過一包（[`../sentence-scramble/`](../sentence-scramble/)）。那一包的規格仍然有效；這一包跟它不同的地方只有三處，列在第 7 節。Response／Building／Cloze 以前沒有交接包，這一包是第一份。

---

## 名詞對照

先看這張表，下面的文字都用左欄的詞。

| 這份文件的用詞 | 程式裡是什麼 | 意思 |
|---|---|---|
| Sentence Scramble | `practiceType = SENTENCE_SCRAMBLE` | 學生聽一句，把打散的詞塊排回正確順序 |
| Sentence Cloze | **新的練習型別，enum 要新增**（建議 `SENTENCE_CLOZE`）。來源是題庫選擇題的 Fill in blank（分類 key `usage`） | 一句話挖掉教學點，學生從詞塊裡挑一個填回去。原型網址裡還叫 `fillin`，只是參數名 |
| Sentence Response | `practiceType = FOLLOW_PATTERN`，`practiceSubType = GUIDED_RESPONSE` | 看一個問句和句型，用句型回答（說） |
| Sentence Building | `practiceType = FOLLOW_PATTERN`，`practiceSubType = SENTENCE_BUILDING` | 給一個教學點，自己造一句（說） |
| 教學點 | teaching point | 專案裡的生詞或語法點。四種都從勾選的教學點生句子或題目 |
| 例句 | 專案 vocab 裡每個教學點附的 `example1`／`example2`（中文、拼音、翻譯） | 老師可以直接拿它當句子，不生成 |
| 來源 | 第一步「句子從哪來」的兩張選項卡：Generate new sentences ｜ Example sentences from teaching points | 只有 Scramble、Cloze、Building 有；Response 只有生成 |
| 份額 | 每個教學點要出幾句 | 老師填總數，前端輪流分給勾的點：每點 ⌊總數÷點數⌋，前「總數 mod 點數」個點多一句 |
| 教學點小卡 | 第二步最上面 TEACHING POINTS 區塊裡，每個教學點一張的小卡 | 調這個點要幾句。四種同一個元件 |
| 句子卡／題卡 | 第二步下半部，一句（一題）一張 | Scramble 和 Cloze 叫句子卡；Response 和 Building 叫題卡 |
| 干擾詞 | Cloze 的詞塊列裡不是答案的詞 | 固定 3 個，跟題庫 Fill in blank 四選一一樣 |
| 工具列 | 第三步上面那兩列控制項（程式裡 `SettingsToolbar`，已經上線） | Pinyin、Translation、Speed、Voice、Max tries；Response／Building 多 Practice mode |
| 學生畫面 | 第三步工具列底下的視窗（程式裡 `StudentViewWindow`，已經上線） | 就是學生會看到的那一題，老師可以先試 |
| Choice by student | enum 值 `STUDENT_CHOICE` | 老師不決定、學生自己在齒輪面板開關 |
| 句／題 | — | 同一個東西。Scramble、Cloze 的單位字是 sentence；Response、Building 是 question |
| 問題 1、問題 2… | — | 要問後端的題目，在最後一節。Scramble 那一包的 E1–E10 另有一欄對照 |

---

## 原型怎麼看

原型是一份檔 [`sentence-practices.html`](sentence-practices.html)，`?type=` 切練習、`&step=` 切步驟（從 1 數）。頁底狀態列每個狀態都有入口。

| 要看什麼 | 網址 |
|---|---|
| 第一步，已選專案、問 12 句 | `?type=scramble&step=1&sel=1&n=12`（type 換成 `fillin`、`response`、`building`） |
| 第一步，到頂 20 句 | `?type=scramble&step=1&sel=1&n=20` |
| 第一步，選了例句 | `?type=scramble&step=1&sel=1&ex=1&n=12`（`fillin`、`building` 也可以；`response` 沒有這張卡） |
| 第二步 | `?type=scramble&step=2&n=12`（四種都可以） |
| 第二步，總數到 20 | `?type=scramble&step=2&n=20` |
| 第二步，Scramble 剪刀／編輯／刪過一句／Edit Pinyin | `…&step=2&n=12&cut=1`、`&edit=1`、`&del=1`、`&py=1` |
| 第二步，Response 編輯中／存檔後重算 | `?type=response&step=2&edit=1`、`&regen=1` |
| 第三步 | `?type=scramble&step=3`（四種都可以） |
| 第三步，Translation 選 Choice by student、學生齒輪面板打開 | `?type=scramble&step=3&tr=STUDENT_CHOICE&sc=1` |
| 第三步，Response／Building 的 Practice mode 選 Audio only | `?type=response&step=3&audio=1` |
| 第四步 | `?type=scramble&step=4&pick=3b,4a&roster=4a&assigned=1` |
| Choose Practice Type 九張卡 | [`choose-practice-type.html`](choose-practice-type.html) |

現行畫面的複刻（跟原型並排看改了什麼）：
[Scramble 第一步已生成](https://project-logeg.vercel.app/specs/chinese-modules/iterations/v7-sentence-scramble/create-scramble.html?step=0&done=1)、[Scramble 第二步](https://project-logeg.vercel.app/specs/chinese-modules/iterations/v7-sentence-scramble/create-scramble.html?step=1)、[Response 第二步](https://project-logeg.vercel.app/specs/chinese-modules/iterations/v12-follow-pattern/create-follow-pattern.html?step=1)、[Building 第二步](https://project-logeg.vercel.app/specs/chinese-modules/iterations/v12-follow-pattern/create-follow-pattern.html?step=1&sub=SENTENCE_BUILDING)、[題庫的 Fill in blank 三個畫面](https://project-logeg.vercel.app/specs/chinese-modules/iterations/v19-sentence-fill-in/baseline-fill-in-blank.html?view=questions)。

---

## 已定的規則（四種共用）

| 題目 | 定案 |
|---|---|
| 第一步叫什麼 | 四種都叫 **Teaching Points**。Practice name 在第一步，照選的專案自動帶入 |
| 總共幾句 | 老師填**總數**（數字欄）：預設 ＝ 勾的點數、下限 ＝ 點數（每點至少一句）、上限 **20**。打超過夾回 20，打低於點數提示 *at least N · one per teaching point*。打字中不夾，離開欄位才夾 |
| 怎麼分 | 輪流分給勾的點（見名詞對照「份額」）。數字欄旁寫 *across 7 teaching points · 1–2 each* |
| 句子從哪來 | Scramble、Cloze、Building 有兩張來源卡，預設 Generate new sentences。Response 沒有，只生成 |
| 例句模式 | 選了第二張卡，教學點方框最下面攤開例句清單，照份額預勾每個點的前幾句；老師可逐句取消。有例句的點用勾的例句、沒例句的點照份額生。總數 ＝ max(填的總數, 勾的例句數) |
| 生成後回頭改點 | 多勾的點只生新的（append），已經審過的句子不動；取消勾的點，它的句子離開清單。不整份重生 |
| 第二步每點幾句 | 每點一張小卡，「− 數字 +」：+ 對這個點再生一句接在它最後一句後面；− 拿掉它最後一句。上限總數 20、每點 5 |
| 第二步區塊標題 | 只有標題和數字（TEACHING POINTS · 7、SENTENCES · 12），後面不接提示字 |
| 第三步 | 四種同一套工具列：Pinyin、Translation、Speed、Voice、Max tries；Response／Building 多 Practice mode。Translation 四種都有，預設 Choice by student |
| 第四步 | 八種練習共用，不動 |
| 學生端 | 只加一樣：Scramble／Cloze 讀 Translation 設定。其餘不動 |

---

## 四種哪裡不一樣

只有三個地方。其他全部相同。

| | Scramble | Cloze | Response | Building |
|---|---|---|---|---|
| 第一步來源卡 | 有 | 有 | 沒有 | 有。選的例句直接當 Suggested answer，Question 由後端照教學點寫 |
| 第二步每張卡 | 一句切成詞塊，剪刀調怎麼切；拖曳、編輯、刪除 | 教學點的位置變空格；底下詞塊列 ＝ 答案打勾 ＋ 3 個干擾詞；編輯時多一欄改干擾詞 | Question、Pattern、Suggested answer 三框都能改 | Question 唯讀（後端寫）、Suggested answer 能改 |
| 第三步學生畫面 | 拼句（打散的詞塊 ＋ 空格列） | 填空（句子照排、一格虛線空格、底下詞塊池） | 問句 ＋ 句型 ＋ 錄音鈕 | 題目 ＋ 錄音鈕 |

---

## 1 · 第一步 Teaching Points

**現在怎樣**
- Scramble（`step-one-sentence-scramble.js`）：選專案、Practice name、勾教學點、Number of sentences（1–20，勾選一變就自動重設成點數）、Generate。生成完回到這一步會列出已生成的句子。
- Response／Building（`step-one-follow-pattern.js`）：同上，欄位叫 Number of questions；回到這一步沒有清單。說明句還寫著「once you pick a practice type」，是舊文案。
- Cloze：產品裡沒有這條流程。

**改成怎樣**（四種同一個畫面）

```
Projects  [zh-CN 我的一天 HSK 2 ▾]
Practice name  [我的一天]

HOW MANY SENTENCES ─────────────────────────────────────────────
┌ [12] sentences · up to 20 · across 7 teaching points · 1–2 each ┐
[ Generate new sentences ]  [ Example sentences from teaching points ]   ← Response 沒有這一列
   AI writes new sentences      14 available

┌ ☑ 我的一天 · Teaching points                              7/7 ┐
│ [☑起床] [☑早饭] [☑上课] [☑图书馆] [☑运动] [☑睡觉] [☑一……就]      │
│ ADD TEACHING POINTS   From Project ▾   [Custom teaching point] Add │
│ Example sentences · 12 of 14 picked                               │   ← 選了例句才有
│  起床  ☑ 我每天七点起床。 wǒ měi tiān…  I get up at seven…        │
│  No examples for 睡觉、一……就 · 2 sentences will be generated     │
└────────────────────────────────────────────────────────────────────┘
                                                        [ Generate ]
```

1. **HOW MANY SENTENCES**（Response／Building 寫 QUESTIONS）一張卡：數字欄 ＋ *sentences · up to 20 · across N teaching points · a–b each*。到 20 時 *up to 20* 轉琥珀色。
2. **兩張來源卡**在數字欄底下（Scramble、Cloze、Building）。專案沒有例句可用時第二張卡淡掉。
3. **例句清單**：選了第二張卡，教學點方框最下面（Add teaching points 之下）攤開：每個點一列點名、每句一個 checkbox（中文、拼音、翻譯），預設照份額勾好。取消勾的點，它的例句不算。清單底下一句藍字講沒例句的點會生幾句。
4. **Building 的例句**：每句例句變成一題，Suggested answer ＝ 那句例句（詞塊切法同 Scramble、教學點高亮）、Question 由後端照教學點寫（例如「请用「起床」造句。」）。該點份額不夠的才生。例句卡底下小字 *each one becomes a suggested answer*。
5. **Generate** 生成中整步換 skeleton，完成自動進第二步。回頭改過再按叫 **Next**，只生新勾的點。
6. 拿掉：Scramble 回到第一步的已生成清單（第二步就是清單）；Follow Pattern 的舊說明句。

**改哪裡**：`step-one-sentence-scramble.js`、`step-one-follow-pattern.js` 合成一個第一步（專案多選、Practice name、教學點方框、Add teaching points 本來就共用 `shared/teaching-point-picker.js`、`shared/use-teaching-point-pool.js`）。Cloze 走同一個。

**卡住的**：建立時要帶每點份額與指定的例句（契約 §1、§2）；Building 吃現成句子當答案（問題 3）。

---

## 2 · 第二步 Edit Sentences／Question Review

### 2a · 教學點小卡（四種同一個元件）

**現在怎樣**：Scramble 與 Follow Pattern 各自一張灰底卡，標題 *Teaching Points (7) · Sentences (12)*，每點一顆 chip 寫「起床 (2)」，底下一個下拉「Select a teaching point」＋ Generate 鈕對那個點 append 一句，接在整份最後。

**改成怎樣**

```
TEACHING POINTS · 7 ─────────────────────────── Sentences · 12  up to 20
┌ 起床      ┐ ┌ 早饭      ┐ ┌ 上课      ┐ ┌ 图书馆    ┐ …
│  − 2 +    │ │  − 2 +    │ │  − 1 +    │ │  − 2 +    │
└───────────┘ └───────────┘ └───────────┘ └───────────┘
```

- 每張卡：教學點 chip ＋ 步進器「− 數字 +」。卡裡不放單位字。一列排得下七張（卡最小寬 128px）。
- 區塊右上角：大字總數 *Sentences · 12*（22px；Response／Building 寫 *Questions*）＋ 小字 *up to 20*。到 20 整組轉琥珀色。
- **+**：對這個點再生一句，接在這個點最後一句後面。到每點 **5** 句時這張卡的 + 灰掉、卡裡一行藍字 *Up to 5 per point*；總數到 **20** 時每張卡的 + 都灰掉、卡裡藍字 *Up to 20 in total*（同時到兩個上限的卡寫 per point）。
- **−**：拿掉這個點最後一句。這個點 0 句時 − 灰掉；整份只剩一句時擋住，上方黃色提示 *Keep at least one sentence.*。
- 灰掉的按鈕要一眼看出不能按：灰底、圖示淡四成、`cursor: not-allowed`。
- 拿掉：下拉 ＋ Generate 那一列。

**改哪裡**：`sentence-scramble-preview.js`、`follow-pattern-preview.js` 裡各自的 Teaching Points 卡，抽成一個共用元件。
**卡住的**：+ 要後端只生一句並回傳哪一句是新的（契約 §3；Scramble 包 E10，Follow Pattern 同一題）。

### 2b · 句子卡／題卡（各型別自己的）

區塊標題 *SENTENCES · 12*（Response／Building *QUESTIONS · 7*），後面不接提示字。每張卡標頭：拖曳把手、題號膠囊、教學點 chip；右邊動作鈕。拖曳排序取代上下箭頭。

**Scramble**（照 Scramble 那一包第 2 節，沒改）：詞塊列拼音在上、字在下；剪刀切／合詞塊（Save 才寫回）；編輯中文、翻譯（中文改了存檔後重算拼音、翻譯、音檔）；刪除（剩一句擋）；點拼音改聲調。

**Cloze**（新）
- 教學點在句子裡的位置就是空格：那個詞塊粉紅虛線框、字和拼音粉紅——老師看得到答案。空格固定挖教學點本身，老師不能移動。兩槽的語法點（一……就）兩個空格。
- 底下一列詞塊：答案詞塊（粉紅、打勾）＋ 干擾詞 3 個。這一列**沒有標題**。
- 編輯模式：中文、翻譯兩欄 ＋ **Distractors** 一欄（頓號分隔）。干擾詞只能改字，不能加減。中文改了存檔後拼音、翻譯、空格位置重算。
- 沒有剪刀。

**Response**（照現行 `follow-pattern-preview.js` 的三框，只換版面）
- Question（白底）→ Pattern（琥珀底）→ Suggested answer（綠底），每框拼音在上、字在下、翻譯小字。
- 編輯：三框各有中文、翻譯兩欄。Pattern ＝ Suggested answer 把一段換成 `＿＿＿`，教學點本身要留在 Pattern 裡；存前前端先跑 `findQuestionFailure`（現行），錯了編輯器不關、錯誤寫在欄位下。
- 中文改了翻譯欄鎖住、*Auto-update on save*，存檔後重算。

**Building**
- Question（唯讀，後端照教學點寫）→ Suggested answer（可改）。沒有 Pattern 框。
- 從例句來的題，卡上標 *Example*。

**改哪裡**：`scramble-sentence-list.js`（Scramble）、`follow-pattern-preview.js`（Response／Building）；Cloze 新寫一個句子卡。
**卡住的**：Cloze 的句子與干擾詞怎麼生（問題 2）。

---

## 3 · 第三步 Settings

**現在怎樣**：工具列和學生畫面已經上線（`scramble-settings-section.js`、`follow-pattern-settings.js`）。Scramble 的工具列只有 Pinyin ‖ Speed／Voice ‖ Max tries，**沒有 Translation**；學生端 Scramble 也沒讀 `translationPreference`。Follow Pattern 有 Practice mode ‖ Pinyin ‖ Translation ‖ Speed／Voice ‖ Max tries。

**改成怎樣**

| 控制項 | Scramble／Cloze | Response／Building |
|---|---|---|
| Practice mode（Text ｜ Audio only） | 沒有 | 有（現行） |
| Pinyin（Shown ｜ Hidden ｜ Choice by student） | 有 | 有 |
| **Translation**（Shown ｜ Hidden ｜ Choice by student） | **新加**，預設 Choice by student | 有（現行） |
| Speed（Slow／Normal／Fast 試聽 ＋ Choice by student）、Voice | 有 | 有 |
| Max tries（− 3 +，1–5） | 有，單位 sentence | 有，單位 question |

- Scramble／Cloze 的學生畫面：*Listen to sentence* 底下多一行翻譯；Translation 選 Choice by student 時，學生齒輪面板多一個 Translation 開關（跟 Pinyin 一樣），預設開。
- Cloze 的學生畫面：提示句 *Pick the word that completes the sentence.*、*0 / 3 tries*、Listen to sentence、句子照排、空格是粉紅虛線格、底下詞塊池 ＝ 答案 ＋ 3 個干擾詞打散、Check 鈕。Max tries 的 tooltip：*After the last try the answer is shown and the practice moves on.*
- 其他照現行。

**改哪裡**：`scramble-settings-section.js` 加 Translation 一格（元件跟 Follow Pattern 同一個）；Cloze 的 settings 直接用 Scramble 的，換學生畫面；學生端 `assignments/content/sentence-scramble/index.js` 讀 `translationPreference`。
**卡住的**：沒有。`translationPreference` 欄位本來就在 PracticeInput 裡。

---

## 4 · 第四步 Assign Practice

跟 Content Mirroring 那一包完全一樣，八種共用，不動。班名色用 Sentence 欄的 label `#BE185D`。

---

## 5 · Choose Practice Type 第九張卡

**現在怎樣**：八張卡，四欄（Content 1、Vocabulary 2、Sentence 3、Comprehension 2），對話框 1080 寬。

**改成怎樣**（[`choose-practice-type.html`](choose-practice-type.html)）
- Sentence 欄變四張，排 **2×2**：上列 Sentence Scramble、Sentence Cloze；下列 Sentence Building、Sentence Response。欄佔兩格寬，標題線橫貫兩格。格子變五格寬，對話框 1080 → **1280**，卡片寬度跟原來差不多。
- 新卡 **Sentence Cloze**：一句話 *Pick the word that completes the sentence*；示意圖一句話四個詞塊、其中一格粉紅虛線空格、底下三個詞塊、填對的那塊粉底；NEW 標；粉色系、icon `edit_note`，跟 Sentence 欄其他三張一致。
- 其他八張不動。

**改哪裡**：`practice-type-labels.js` 的 `PRACTICE_TYPE_ENTRIES` 加一筆（`practiceType` 用新 enum）、對話框的格子寬度；`practice-stepper-config.js` 的 `STEPS_BY_TYPE` 加新型別（四步名同 Scramble）。

---

## 6 · 題庫拿掉 Fill in blank

Cloze 取代題庫選擇題的 Fill in blank 分類（`MULTI_CHOICE_CATEGORIES` 裡 key `usage`）。

- 題庫精靈第二步的題數格子拿掉 Fill in blank 那一列（Comprehension／Pinyin／Meaning × True/False／Multiple choice，3×2）。
- 學生端 Comprehension Quiz 不再出這類題。
- 已經存在舊題庫裡的 Fill in blank 題怎麼處理：問題 4。

---

## 7 · 跟 Scramble 那一包不同的地方

Scramble 那一包（2026-10-05）的規格、契約都還有效。這一包只改了三處：

| 哪裡 | 那一包 | 這一包 |
|---|---|---|
| 第二步教學點小卡 | 左邊「2 sentences」、右邊 −／+ 分開兩頭；區塊右邊小字 *Up to 20 in total* | 「− 2 +」數字夾中間、卡裡沒單位字；區塊右上角大字 *Sentences · 12* ＋ 小字 *up to 20*（第 2a 節） |
| 第二步區塊標題 | 標題後接一串提示（drag a card to reorder · scissors…） | 只有標題和數字 |
| 第三步 | 沒有 Translation | 加 Translation，預設 Choice by student；學生端讀它（第 3 節） |

另外那一包寫 Max tries 1–10；程式碼 `7528c30f` 的 `MAX_MAX_ATTEMPTS` 是 5，以 **1–5** 為準。

---

## 不要順手改的

- **enum 與既有欄位不動**：`pinyinPreference`（PINYIN／NO_PINYIN／STUDENT_CHOICE）、`translationPreference`（SHOW／HIDE／STUDENT_CHOICE）、`speedPreference`、`audioOption`、`audioMode`、`maxAttempts`、`scrambleSentences` 與 `followPatternQuestions` 的形狀、`MAX_QUESTION_COUNT = 20`。
- **Practice mode 不給 Scramble／Cloze**。
- **學生端只加 Translation**（Scramble／Cloze）。拖曳、揭曉區、完成頁、Follow Pattern 的錄音流程都照舊。
- 剪刀、Edit Pinyin、改中文重算、`findQuestionFailure` 的檢查，機制不動、只換版面。
- Cloze 的學生端答對／答錯／揭曉畫面還沒定（見下一節），先不要自己設計。

---

## 設計還沒定的

工程不用等這些，但碰到時先不要自己決定：

- Cloze 的干擾詞從哪裡來（同專案的其他教學點、AI 生近義詞）——跟問題 2 一起定。
- Cloze 學生端答對／答錯／揭曉的畫面；兩槽語法點兩個空格時詞塊池要不要變。
- 總數到 20 時每張小卡都寫藍字 *Up to 20 in total*，七張卡七次，右上角已經轉琥珀——可能拿掉卡裡那行。

---

## 動工順序

| 階段 | 內容 | 可否獨立上線 |
|---|---|---|
| **1** | 教學點小卡元件（第 2a 節）＋ 區塊標題拿掉提示字，Scramble 與 Follow Pattern 一起換 | 可——+ 先沿用現行的 append（接在最後），等後端回傳新句再移位 |
| **2** | 第一步合成一個：HOW MANY SENTENCES 卡、來源卡、例句清單；先只做 Generate new sentences 那條 | 可——`scrambleSentenceCount`／`followPatternQuestionCount` 本來就有；份額先由後端照現行方式分 |
| **3** | Scramble 第三步加 Translation ＋ 學生端讀它 | 可 |
| **4** | Choose Practice Type 第九張卡 ＋ 新 enum ＋ Cloze 四步（第一、三、四步直接用 Scramble 的；第二步新句子卡） | 要後端先有 Cloze 的生成（問題 2） |
| **5** | 題庫拿掉 Fill in blank | 跟 v16 拿掉題庫一起排 |
| **6** | 後端：建立時帶每點份額（契約 §1）、回頭只生新的（§1）、例句來源三種（§2）、+ 只生一句並標出新的（§3）、Cloze 生成與干擾詞（§6） | — |

階段 6 沒好之前：第一步回頭改點仍會整份重生——**先在 Generate 鈕旁加一句警告**，不要默默丟掉第二步的工。

---

## 要問後端的

**問後端**

| # | 題目 | 卡住哪一項 |
|---|---|---|
| 問題 1 | 總數 20、每點 5 這兩個上限後端有沒有擋？四種（含新的 Cloze）共用同一個常數？前端只看到 `MAX_QUESTION_COUNT = 20` | 第一步數字欄、第二步小卡的 + |
| 問題 2 | Cloze 的生成能不能沿用 Follow Pattern 現有的「每點生一句、把教學點挖成 `＿＿＿`」那條，再多生 3 個干擾詞？干擾詞從哪裡來？ | Cloze 第一步 Generate、第二步詞塊列 |
| 問題 3 | Building 選例句時，例句直接當 Suggested answer、Question 由後端照教學點寫——SENTENCE_BUILDING 的生成能不能吃一句現成的句子當答案？ | Building 第一步例句、第二步題卡 |
| 問題 4 | 題庫拿掉 Fill in blank 之後，舊題庫裡已有的 Fill in blank 題怎麼辦？ | 第 6 節 |
| 問題 5 | `followPatternAppendTeachingPoints` 一次生幾題？能不能限定一題、並在回傳裡標出哪一題是新的？（跟 Scramble 包 E10 同一題，Follow Pattern 這邊也要） | 第二步 + |

**Scramble 那一包問過、還沒回的**（這一包一樣要）：E1 CREATE 回頭改點走 append、E2 改一句中文只重算那一句、E3 剪刀的 `splitContent` 後端會不會改回去、E6 換 Speed／Voice 的等待文案走錯分支（Follow Pattern 也是，走 *Generating questions…* 而不是 audio 分支）、E7 建立時帶指定的例句、E8 專案例句有沒有音檔、E9 生成避開已勾的例句、E10 append 一次一句。
