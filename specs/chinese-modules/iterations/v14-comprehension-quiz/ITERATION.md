# v14 — Comprehension Quiz（基準）

- **功能名稱**：Comprehension Quiz（`MULTIPLE_CHOICE`）建立流程的基準
- **網址**：https://dahua-dash-dev.web.app/dashboard/practice/create/?type=MULTIPLE_CHOICE
- **截圖**：使用者尚未提供。基準檔照程式碼複刻，之後拿實機截圖對一次
- **分岔自**：v3 `create-mirroring.html`（三步殼、Footer、ProcessingDialog、第三步 Assign 原封不動；第一、二步新畫，題目卡樣式參考 v6 `create-quiz.html` 第三步）
- **日期**：2026-10-19（登記）
- **小 spec**：`spec.html`（①步驟形狀 ②設定項 ③學生端 ④查到的問題）
- **設計檔**：`create-comprehension-quiz.html`（基準檔，現行產品的複刻，`?step=` 從 0 數）· `proposal.html`（提案，`?step=` 從 1 數；分岔自 v3 `proposal.html`，套八張卡共用的 S1–S9）
- **範圍**：New Comprehension Quiz 這條建立流程的三步：Question Bank → Edit & Preview → Assign Practice。學生端不改，spec §③ 抄出來了
- **程式碼基準**：dahua-dash `origin/develop` @ `c8179072`（2026-10-19 fetch）
  - 老師端：`steps/step-one-mc.js`、`steps/shared/use-question-bank-step.js`、`qa/create/article-preview-section.js`、`practice-unified-view.js`（ExamModeCard 第 160–215 行、isMC 第二步第 2164–2186 行、`mcEditMinStep`）、`steps/mc-step-two-section.js`（mode="combined"）、`components/edit-in-question-bank-button.js`、`utils/{question-bank-counts,practice-step-gating,processing-dialog-copy}.js`、`enum/practices.js`
  - 學生端：`assignments/content/mc/{index,use-mc-practice,scoring}.js`、`utils/score.js`
- **狀態**：基準 ＋ 提案第一輪（2026-10-19，套共用設計 S1–S9；Planning 兩案改嵌 `proposal.html`）

## 登記時就查到的

1. **這條流程沒有任何顯示／音檔／拼音／翻譯／Max attempts 設定。** 第二步只有 Practice Name、Test Mode（開關＋分鐘數）、題目卡。學生端的 Pinyin／Translation 是學生自己在課文面板上按的 switch（`ProjectContentPanel`），題目翻譯只有 `comprehension` 類別有、也是學生按；老師端管不到。
2. **名稱在第一步被設、第二步才看到。** `handleSelectBank` 選了題庫就把 `practiceName` 設成題庫名；題庫名＝專案名時練習就叫「我的一天」。
3. **第一步按 Next 就 `createPractice`**，之後回第一步題庫下拉鎖住（`lockedSk = practice.questionsBankSk`），要換題庫只能整份重來。EDIT 模式更直接：`mcEditMinStep = 1`，第一步進不去、Back 在第二步就鎖。
4. **Edit Questions & Answers in Question Bank 會離開流程。** `router.push` 到題庫頁（帶 `returnTo=practice.edit(id)`），回來走 EDIT 模式。題目內容在這條流程裡只能刪、換順序，不能改字——改字要去題庫、再用題庫的「Save & Sync to Practices」推回來。
5. **第二步預設全部展開**（`collapsedSet` 初始是空的），10 題全開頁面很長，拖曳換序要拖過整張長卡。
6. **刪題只在本機 state**，按 Save 才把 `mcQuestions ＋ examMode ＋ timeLimit` 一起 `upsertPractice`。刪光了整段換成 InlineEmpty（連 Project Content 卡與題庫鈕都不見），Save 鈕仍可按——`mcHasNoQuestions` 只擋第一步；後端收到空陣列會怎樣無法確認。
7. **卡片叫 Test Mode、欄位叫 `examMode`。** 建議時間 `round(題數×30/60)` 分（下限 1、Slider 1–60）；practice 剛建好時 `timeLimit` 從建議值起算，CREATE 一進第二步就是 5 分。
8. **ProcessingDialog 對 MC 沒有自己的文案**：`resolveProcessingCopy` 落到預設「Processing content...」＋「Creating audio, pinyin & translations」那段。會不會真的出現無法確認（MC 建立後 `status` 是否直接 COMPLETE，前端看不到）。
9. **學生端沒有開始頁**：進來就是第一題。Test Mode 的倒數從進頁面那一刻起算（`sessionStorage exam_start_`），刷新不重置、老師試做離開才清；時間到自動交卷（`force`）。選了選項**立刻顯示對錯、不能改**（`isCurrentAnswered`），只能 Previous 回看。
10. **True/False 的 `choice` 形狀無法確認**（後端生的，前端只 `Object.entries`）；基準檔用 `A True / B False`。
11. **第三步照 v3 複刻、沒重畫**：產品 `step-three.js` 之後改版（HistoryTab／HistoryRow／內嵌 NewAssignmentForm，鈕文字由 `assignAction?.label ?? 'Done'` 決定）。Planning 第四步嵌 v8 時再看。
12. **Planning 讀的 DOM 跟契約對不上**（給接手的人）：`teacher-planning-b.html` 第 687 行、`teacher-planning.html` 第 5842 行都讀 `#stepper .stp-item`，基準檔照契約／v3 畫的是 `.step`；`.clsrow` 只在各版 `proposal.html` 有，v3／v7 基準檔沒有，這裡只給已指派的那張卡加 `.clsrow.done` ＋ `data-cls`。

## 基準檔怎麼看

`create-comprehension-quiz.html`，`?step=` 從 0 數；`&proj=` 預選題庫（題庫名＝專案名：0 我的一天 · 1 环境保护与可持续发展 · 2 餐厅点餐（对话））。

| 網址 | 看到什麼 |
|---|---|
| `?step=0` | 第一步，還沒選題庫；Next 可按，按了 snackbar「Please pick a question bank.」 |
| `?step=0&proj=0` | 選了「我的一天」：下拉面上名稱＋兩顆小 chip、三顆統計 chip（4／6／10）、Questions Preview（課文框＋十列題目） |
| `?step=0&proj=1` | 選了「环境保护与可持续发展」（2／3／5，少量內容） |
| `?step=0&proj=2` | 選了「餐厅点餐（对话）」：沒題，紅字 ＋ Next 灰（`mcHasNoQuestions`）、沒有 Preview |
| `?step=0&proj=0&gen=1` | 按了 Next、正在 `createPractice`：標題下 LinearProgress、Next 轉圈 |
| `?step=0&proj=0&done=1` | practice 已建立、回頭看第一步：題庫下拉鎖住（`lockedSk`）。`step>0` 自動視為 done |
| `?step=1&proj=0` | 第二步：Practice Name（＝題庫名）→ Test Mode 關 → Project Content 卡 → Edit in Question Bank 鈕 → Edit & Preview ＋ 統計 chip ＋ 十張卡**全部展開**；鈕叫 Save |
| `?step=1&proj=0&exam=1` | Test Mode 開：Suggested time 5 min、Slider（可點）、「5 minutes (10 questions, ~30s per question)」 |
| `?step=1&proj=0&open=1` | 只有第一題展開，其餘收合（看卡片收合的樣子） |
| `?step=1&proj=0&dlg=1` | ProcessingDialog（MC 的預設文案） |
| `?step=2&proj=0` / `&assigned=1` | 第三步 Assign（八種共用、照 v3）／已指派一個班（`.clsrow.done`） |

卡片上的 ✕ 會真的刪、拖曳會真的換序、Test Mode 開關與 Slider 可以操作、下拉可以換題庫（換了題目與名稱跟著換）。

## 提案怎麼看

`proposal.html`，`?step=` **從 1 數**；`&proj=` 預選題庫，索引跟基準檔一樣（0 我的一天 · 1 环境保护与可持续发展 · 2 餐厅点餐（对话）＝沒題）。三步：Question Bank → Edit & Preview → Assign Practice（v3 的 Edit Sentences 整步拿掉）。沒有 R11 面板——這條流程沒有設定（查到的第 1 條）。

| 網址 | 看到什麼 |
|---|---|
| `?step=1&proj=0` | 第一步：`.dd` 題庫選單（觸發鈕 題庫名 ＋ `4 True/False · 6 Multi-Choice`）→ Practice name（S1，已填入題庫名）→ `.frame`（Comprehension 欄 wash）：課文一段一行帶編號 ＋ Questions 一列一題（型別 chip ＋ 題目） |
| `?step=1&proj=0&dd=1` | 選單打開：每列 題庫名 ＋ 題數；沒題的那列紅字 `No questions`、灰掉不可選 |
| `?step=1&proj=2` | 沒題的題庫：frame 換成一條原因（S9／R9）、Next 灰 |
| `?step=2&proj=0` | 第二步：Test Mode 卡（關）→ eyebrow `Questions · 10`（hint `True/False 4 · Multi-Choice 6 · drag to reorder` ＋ `Edit Questions & Answers in Question Bank` 次要鈕）→ 十張卡**全部收合**（拖曳把手、Q 號膠囊、型別 chip、分類 chip、題目、展開、✕）；鈕叫 Save |
| `?step=2&proj=0&exam=1` | Test Mode 開：Suggested time 5 min、Slider 1–60（可點、←→ 可調）、`5 minutes (10 questions, ~30s per question)` |
| `?step=2&proj=0&open=1` | 第一題展開：選項兩欄、正解框色（型別色）＋ ✓ |
| `?step=3&proj=0` / `&assigned=1` / `&pick=3b,4a&roster=3b` / `&review=1` | 第三步 Assign：v3 的原樣（S8） |

✕ 會真的刪（剩一題時鎖住、hint 寫原因）、拖曳會真的換序（展開狀態跟著卡走）、Test Mode 開關與 Slider 可以操作、下拉可以換題庫（題目跟著換；名稱沒改過才跟著換）。沒搬過來的基準檔參數：`&gen`／`&done`（第一步建 practice、回頭鎖住——S10 待工程）、`&dlg`（MC 的 ProcessingDialog 會不會出現無法確認）。

## Change log

<!-- 只記 UX；基準檔的複刻與修正是鷹架，不記。 -->

| 端 | 改了什麼 | 說明 |
|---|---|---|
| 文件 | 2026-10-19 登記、基準檔 | 為 Planning mode 四張灰卡而開。沒有提案。 |
| 老師端 | 2026-10-19 第一輪：套共用設計 S1–S9（沒有 R11） | `proposal.html` 從 v3 `proposal.html` 分岔。S1 Practice name 搬到第一步、S2 題庫選單改 `.dd` ＋ 內容 `.frame`（Comprehension 欄 wash；課文一段一行 ＋ 題目預覽，現行第二步的 Project Content 卡併進來）、S8 Assign 照 v3、S9 捲回最上面／沒題時 Next 灰並寫原因。第二步：Test Mode 卡照 ExamModeCard，題目卡照 v6 `renderMcCard`（預設收合、剩一題 ✕ 鎖住寫原因）。 |
