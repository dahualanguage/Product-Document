# v13 — Practice-Open-ended Questions（基準）

- **功能名稱**：Practice-Open-ended Questions（建立流程，產品型別 `QA`）
- **網址**：https://dahua-dash-dev.web.app/dashboard/practice/create/?type=QA
- **截圖**：使用者尚未提供。基準檔照程式碼複刻，之後拿實機截圖對一次
- **分岔自**：v3 `create-mirroring.html`（同樣三步殼 Content → Settings & Preview → Assign Practice；外殼、Stepper、Footer、ProcessingDialog、第三步 Assign 原封不動，前兩步新畫）
- **日期**：2026-10-19（登記）
- **小 spec**：`spec.html`（四節：步驟形狀／設定項與學生端有沒有讀／學生端畫面／查到的問題與要問工程的）
- **設計檔**：`create-qa.html`（基準檔，現行產品的複刻，`?step=` 從 0 數）、`proposal.html`（**提案**，`?step=` 從 1 數；第一輪套八張卡共用的 S1–S9／R11，從 v3 `proposal.html` 分岔）
- **範圍**：New Open-ended Questions 這條建立流程的三步。學生端不改，spec §3 抄出來了
- **程式碼基準**：dahua-dash `origin/develop` @ `c8179072`（2026-10-19 fetch）
  - 第一步 `steps/step-one-qa.js` ＋ `steps/shared/use-question-bank-step.js` ＋ `qa/create/article-preview-section.js`
  - 第二步 `steps/qa-step-two-section.js` ＋ `components/{audio-mode-toggle-card,audio-settings-panel,audio-status-banner,edit-in-question-bank-button}.js`
  - 第三步 `steps/step-three.js`（八種共用）。**注意**：c8179072 的 step-three.js 已經是 History 分頁（In progress／Past due）＋ 內嵌 `NewAssignmentForm`，不是 v3 那張「Assigned students ＋ Assign Practice 鈕」。契約規定第三步直接抄分岔來源的基準、不重畫，所以這份基準檔的第三步是 v3 的舊畫面；Assign 的現況歸 v8-assign-history
  - 學生端 `src/sections/assignments/content/qa/{practice-content-list,content-window}.js`、`qa/components/{QAPracticeStartCard,MessageList,StartPracticeButton}.js`、`content/index.js`
- **狀態**：基準（10/19 上午）＋ 提案第一輪（10/19 下午：套共用設計，Planning 要嵌的那一份）。未部署、未 commit

## 登記時就查到的

1. **`guidePhraseLanguage` 老師端有設、學生端沒有任何畫面在讀。** 唯一的消費者 `qa/components/StartPracticeButton.js`（Ready to Start? ＋ 四句 guide phrase、照語言播中／英音檔）在 c8179072 **沒有被任何檔案 import**；`practice-content-list.js` 第 104 行把 `guidePhraseLanguage` 解構出來之後也沒用。學生現在看到的 start 卡是 `QAPracticeStartCard`，裡面沒有 guide phrase。欄位有存進 `upsertPractice`／`getStudentAssignments`，只是沒人讀。
2. **Audio Mode 只鎖 Pinyin。** `handleAudioMode` 開了就把 `pinyinPreference` 設成 `STUDENT_CHOICE`、下拉 disabled、Display Settings 整塊變灰（grey.100、opacity .78）。QA 設定沒有 Translation、沒有 Translation First、沒有 Max attempts（Mirroring 那幾塊都沒有）。學生端：`index.js` 第 457 行 `setStudentPinyinOn(!audioMode)`——Audio Mode 關時學生拼音預設開、開時預設關；start 卡在 `PINYIN`／`NO_PINYIN` 時顯示「Display settings are set by your teacher.」，`STUDENT_CHOICE` 才給 Show Pinyin 開關。
3. **名稱在第一步被設、第二步才看到。** `useQuestionBankPicker.handleSelectBank`（CREATE）選了題庫就 `setValue('practiceName', 題庫名)`；Practice name 欄位在第二步最上面。同一條毛病 v3／v7 都登記過。
4. **第二步的拼音只在 `PINYIN` 時印。** `qa-step-two-section.js` 第 502 行 `pinyinPreference === PINYIN_PREFERENCES.PINYIN` 才印 `contentPinyin`；選 `STUDENT_CHOICE` 老師端預覽看不到拼音，但學生端（非 Audio Mode）預設是開的——老師看到的跟學生預設看到的不一樣。
5. **第一步到第二步中間建 practice 的對話框文案走預設分支。** `processing-dialog-copy.js` 沒有 QA 分支：建 practice 時 `practice.status` 還不是 COMPLETE ⇒ `isProcessing` ⇒ 「Processing content...」＋「Creating audio, pinyin & translations」；只有第二步換 Speed／Voice（draft 的 `audioStatus === GENERATING`）才是「Generating audio...」。第一步 Next 之後畫面已經在第二步（skeleton）才開對話框（`activeStep > 0`）。
6. **「Article」其實是「題」。** QA 的 `updatedArticleArray` 每一筆是一題（`content`＝題目、`questionSk` 對回題庫拿 type 與 suggestedAnswer），所以第二步標題叫「Articles (8)」、刪題的對話框叫「Remove this article?」、剩一題時提示「At least one article must be kept.」。題目內容不能在這裡改——右上角「Edit Questions & Answers in Question Bank」跳去題庫改。
7. **第一步的「No questions」會把 Next 灰掉**（`qaHasNoQuestions`：選了題庫但 `_qaTotalQuestions === 0`），沒選題庫按 Next 是 snackbar「Please pick a question bank.」。題庫下拉照 `creationTime` 新到舊排。
8. 學生端有讀 `pinyinPreference`／`audioMode`／`speedPreference`／`changeSpeed`／`audioOption`；`guidePhraseLanguage` 沒讀（第 1 條）；`maxAttempts` QA 不設（學生端的 `RECORDING_CONFIG.maxScoredAttempts` 是寫死的）。
9. ~~**無法確認**：課文在預覽裡是 `splitArticleArray.join('')` 一整段還是帶換行~~ **2026-10-20 實機截圖確認：一句一行**（第二步 Article Content 的 Typography 是 `whiteSpace:'pre-wrap'`，後端陣列帶換行）。基準檔 `create-qa.html` 仍畫成一段，之後對實機修。第一步預覽的題目列 `noWrap`，長題目會被截掉（基準檔的題都短，看不到）。另：第二步的 Articles 是**依專案（課文）分組**的——專案名綠字 → Article Content → 那篇的題目；題庫可以跨好幾篇課文（`projectGroupSks`）。

## 基準檔怎麼看

`create-qa.html`，`?step=` 從 0 數：

| 網址 | 看到什麼 |
|---|---|
| `?step=0` | 第一步，還沒選題庫（label 留在欄位裡當 placeholder） |
| `?step=0&proj=0` / `&proj=1` / `&proj=2` | 選了題庫：Questions Preview（專案名綠字、Article Content 淡綠框、每題一列 Content Base／Extension chip）。0 我的一天（5＋3）、1 环境保护与可持续发展（8＋4）、2 餐厅点餐（对话）（4＋2） |
| `?step=0&proj=0&dd=1` | 題庫下拉打開：每筆右邊小字「N content · N extension」 |
| `?step=0&noq=1` | 餐厅点餐 變成沒題目的題庫：下拉紅字「No questions」、預覽空白、Next 灰掉 |
| `?step=1&gen=1` | 第一步按 Next 之後：第二步 skeleton ＋ ProcessingDialog「Processing content...」、Next 轉圈 |
| `?step=1` | 第二步：Practice name → Audio Mode → Display Settings（Pinyin）→ Audio Settings → Guide Phrase → Articles (8) |
| `?step=1&audio=1` | Audio Mode 開：Pinyin 鎖 STUDENT_CHOICE、Display Settings 變灰、題目下沒拼音 |
| `?step=1&py=NO_PINYIN` / `&sc=1` / `&gpl=ENGLISH` | Pinyin 下拉其他值／Speed 選 Student choice 的 helper／Guide Phrase 選 English |
| `?step=1&regen=1` | 換了 Speed／Voice：AudioStatusBanner「Generating audio…」＋ ProcessingDialog「Generating audio...」、Speed／Voice／播放／刪除全鎖 |
| `?step=1&del=1` | 「Remove this article?」對話框 |
| `?step=2` / `&assigned=1` | 第三步 Assign（v3 基準的畫面，見上面「程式碼基準」的注意） |

DOM 契約（Planning 嵌入時讀）：`aside.side`、`.mainwrap > .hdr`、`.main > .container`、`.h4`、`#stepper` 裡 `.step.active`／`.step.done`、`.footer #back #next`（不能按加 `.dis`）、`#scrim .dlg h5#pd-title`、`.baseline`。

## 提案怎麼看

`proposal.html`，`?step=` 從 1 數（基準檔仍從 0 數）。`&proj=0|1|2` 的順序跟基準檔一樣（0 我的一天 · 1 环境保护与可持续发展 · 2 餐厅点餐（对话）），Planning 用同一個索引：

| 網址 | 看到什麼 |
|---|---|
| `?step=1` / `&proj=1` / `&proj=2` | 第一步 Content：Question bank 選單（`.dd`，每列 題庫名 ＋ `5 Content Base · 3 Extension`）→ Practice name（已填題庫名）→ frame（Comprehension 欄 wash）：Article 一段一行帶編號 ＋ Content Base／Extension 兩組題（題目、拼音、suggested answer，題號接著數） |
| `?step=1&dd=1` | 題庫選單打開 |
| `?step=1&dd=1&noq=1` | 餐厅点餐 變成沒題目的題庫：那一列紅字 No questions、不可選 |
| `?step=1&proj=2&noq=1` | 選到的題庫沒題：frame 換成一條原因（R9）、Next 灰掉 |
| `?step=2` | 第二步 Settings & Preview（R11，畫廊 `#p-qa`）：工具列 Practice mode ‖ Pinyin ／ Speed ｜ Voice ‖ Guide phrase language ＋ Student view 視窗（前導語、題目泡泡、Play、Question x of 8）；卡下面 QUESTIONS · 8 清單（型別 chip、題目、拼音、suggested answer、播放、移除） |
| `?step=2&audio=1` | Audio only：Pinyin 格換成「Pinyin is up to the student」、泡泡藏起來（`&reveal=1` 學生點過眼睛） |
| `?step=2&py=choice&settings=1` / `&sc=1` / `&gpl=ENGLISH` / `&voice=1` / `&list=1` | Pinyin 選 Choice by student 且學生齒輪面板打開／Speed 選 Choice by student／前導語英文／聲音下拉打開／題目清單打開（每列一顆播放鍵） |
| `?step=2&rm=1,2,3,4,5,6,7` | 移到剩一題：移除鈕灰掉、清單底下寫「At least one question must be kept」（R9） |
| `?step=3` / `&pick=3b,4a&roster=4a` / `…&review=1` / `&assigned=1` | 第三步 Assign：v3 proposal 的原樣（S8） |

DOM 契約（Planning 嵌入時讀）：`aside.side`、`.mainwrap > .hdr`、`.main > .container`、`.h4`（帶 `.tico`：`chat_bubble`，底 `#DBEAFE`／字 `#2563EB`）、`#stepper` 裡 `.stp-item.active`／`.done` ＋ `.stp-sep`、`.footer #back #next`（不能按加 `.dis`）、第二步 `.tb-row > .tb-grp`、第三步 `.clsrow.on[data-cls]`／`.clsrow.done`、`.baseline`。

## Change log

<!-- 只記 UX——流程、語意、互動、命名；純視覺替換不進這張表，逐輪的視覺改動在 proposal.html 檔頭註解。
     基準檔的複刻與修正、mock 自己的 bug 是鷹架，也不記。 -->

| 端 | 改了什麼 | 說明 |
|---|---|---|
| 老師 | **第一輪：套共用設計 S1–S9／R11** | 2026-10-19。從 v3 `proposal.html` 分岔，三步 Content → Settings & Preview → Assign Practice（v3 的 Edit Sentences 拿掉：QA 的題目在題庫改）。①第一步：S1 Practice name 搬到題庫選單正下方、選了就填題庫名；S2 題庫選單換 `.dd`（每列 題庫名 ＋ N Content Base · N Extension，沒題的紅字 No questions 且不可選）；課文＋題目進 `.frame`（Comprehension 欄 wash），課文一段一行帶編號、題目分 Content Base／Extension 兩組並帶拼音與 suggested answer（現行 noWrap 截掉長題，這裡不截）；選到沒題的題庫時 Next 灰掉、原因寫在內容區（R9）。②第二步：R11 工具列＋視窗預覽同一張卡（照畫廊 `#p-qa`）——現行的 Audio Mode 卡／Pinyin 下拉（印 enum）／Audio Settings／Guide Phrase 四張卡收成兩行工具列（S4 Pinyin 分段控制項、S5 Practice mode、S7 Speed chip ＋ Voice 下拉）；畫布照學生端主欄（前導語、題目泡泡、Play 鈕字面寫會怎麼播、Question x of N 原地展開）。卡下面保留題目清單，一題一列；清單一律帶拼音（學生看不看得到由 Pinyin 決定，畫布跟著變）；移除直接拿掉、不再開「Remove this article?」對話框；剩一題時移除鈕灰掉並寫原因（R9）；點清單某一列＝預覽那一題。③第三步：S8，v3 proposal 的 Assign 原封不動。S9 換步捲回最上面、頁腳 Next → Save → 依 Assign 狀態。 |
