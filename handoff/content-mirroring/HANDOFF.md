# Content Mirroring — Engineer Handoff

老師建立 **Content Mirroring** 練習的那條流程（Practice List → New Practice → Content Mirroring）：三步改成四步、審句獨立成一步、Settings 那一步變成「工具列 ＋ 學生預覽」同一張卡、Assign 從對話框搬回頁面。

**這不是重寫，是在現有流程上改。** 建立流程已經上線（`practice-unified-view.js` 的 CREATE 模式），這一版動的是步驟數、每一步的版面與用字，**沒有新增練習型別、沒有動任何 enum 值、沒有改 GraphQL schema**（唯一要問後端的一項見最後一節）。程式碼基準：`dahua-dash` `origin/develop` @ `599dd4cb`（2026-09-15）。

- 設計原型：[`content-mirroring.html`](content-mirroring.html) —— `?step=1|2|3|4` 從 1 數；`?step=1&proj=2` 對話類專案、`?step=2&split=3` 切句模式、`?step=3&audio=1` 純聽力、`?step=3&voice=1` Voice 下拉、`?step=3&settings=1` 學生的齒輪面板、`?step=4&pick=3b,4a&roster=4a&assigned=1` 已指派再派兩班、`&review=1` 送出前的預覽框
- 完整設計說明與問題清單：[v3 spec](https://project-logeg.vercel.app/specs/chinese-modules/iterations/v3-content-mirroring/spec.html)
- 每一輪改了什麼、為什麼：[v3 ITERATION.md](https://project-logeg.vercel.app/specs/chinese-modules/iterations/v3-content-mirroring/ITERATION.md)
- Settings 那一步的固定形狀（之後每一種 practice 都照它）：[設計判準 R11](https://project-logeg.vercel.app/specs/chinese-modules/iterations/practice-design-rules.html)
- 姊妹包：[Vocabulary Mirroring](../vocabulary-mirroring/) —— 第三步工具列、第四步 Assign 跟這一包共用同一批元件，**先做這一包**

---

## 為什麼要做

現行三步 `Content → Settings & Preview → Assign Practice`，查到的問題都在程式碼裡看得到（編號照 spec §4）：

1. 練習的名字在第一步被決定（選 Project 那一刻 `practiceName` 就設好了），欄位卻長在第二步。
2. 兩個下拉直接印 enum 值：老師看到的是 `NO_PINYIN`、`STUDENT_CHOICE`（`Object.entries(PINYIN_PREFERENCES).map(...)`）。
3. Audio Settings 的說明寫 *pronunciation precision*，畫面上沒有這個控制項（`audio-settings-panel.js` 的 TODO）。
5. Audio Mode 改的是「這個練習是什麼」（學生端整片換成純聽力卡），卻排在顯示偏好中間、長得跟它們同一層。
6. 那一步叫 Preview，底下那份句子清單卻是老師視角的稿件，不是學生看到的東西；Audio Mode 打開時它照列五句、照顯示拼音。
7. 句子編輯（切句／合併）在第一步，但第一次走到第一步時它不存在——要按 Next 建出 practice 再 Back 回來才看得到。
9. 三步的主要按鈕是三個詞：Next → Save → Done。
12. 換步驟不會捲回頁面最上面。

---

## 流程：三步 → 四步

```
現行  Content → Settings & Preview → Assign Practice
提案  Content → Edit Sentences → Settings → Assign Practice
```

| 檔案 | 改什麼 |
|---|---|
| `src/utils/practice-stepper-config.js` | `STEPS_BY_TYPE[MIRRORING]` 改成四個標籤；`assignStepIdx` 仍是最後一步，`settingsStepIdx = assignStepIdx - 1` 的推導不用動 |
| `practice-unified-view.js` | practice 仍在「第一步按 Next」時建立（`ensurePracticeCreated`，現況不變）；新的第二步 Edit Sentences 讀寫同一份 `updatedArticleArray`；**換步驟時 `window.scrollTo(0, 0)`**（問題 12，現在整份只有一個處理對話框的 `scrollIntoView`） |
| 頁腳標籤 | `Next → Next → Save → Assign / Done`。第三步仍是 `resolvePrimaryActionLabel` 的 Save（倒數第二步真的送出）；第四步依狀態換字，見 §4 |

---

## 第一步 · Content（`step-one-mirroring.js`）

- **Project 選單** → ReUI `c-dropdown-menu-18` 的樣子：標籤在上、outline 觸發鈕、選單每列 語言 mark（BCP-47 原樣 `zh-CN` / `zh-TW`，照 `src/enum/languageTags.js`）＋ 名稱 ＋ 級數 ＋ 句數。
- **Practice name 從第二步搬到這裡**（問題 1），`c-input-2`，說明 *Filled in from the project. Change it if this practice needs its own name.*；行為不變（選 Project 時填入專案名，老師改過就不再覆蓋）。
- **課文預覽** → `c-frame-6` ghost frame：Title `Article content`、Description `N lines`、白底 panel 一段一行帶編號。**不要再 `join('')`**——現在 `getSplitArticleText()` 把 `splitArticleArray` 壓成一整塊，下一步要老師修的正是這個切分。底色用 `PRACTICE_TYPE_COLUMNS.CONTENT.wash` `#EFFBF4`（`practice-type-labels.js`）。
- 這一步**不放**句子編輯器、**不放**對話類的提醒（提醒在第二步講）。

---

## 第二步 · Edit Sentences（新的一步；元件從 `mirroring-sentence-editor.js` 搬）

- 一句一列：編號、句子、右邊 `Split` 藥丸鈕與一顆眼睛。**刪除改成隱藏**：眼睛按下去那一句變淡、學生端不練，再按一次回來——見最後一節，`updatedArticleArray` 的項目要能帶 `hidden`。
- **Split** 進入切句模式（`?step=2&split=3`）：句子逐字可點，點哪裡就從哪裡斷；`Merge` 鈕壓在兩句之間的分隔線上、靠左。
- **對話類專案**（`contentType === 'CONVERSATION'`，`canSplitMerge` 為 false）：Split／Merge 收掉，句子表上方一則 MUI Alert `severity="warning"`（standard 變體：`warning.lighter` 底、`warning.darker` 字、15px）寫 **`Conversation — lines can't be split or merged.`**。隱藏仍可用。
- 標頭：`Sentences` ／ `Split from ⟨專案名⟩ · N sentences`。

---

## 第三步 · Settings（`mirroring-step-two-section.js` 整個換掉）

這一步是 **R11 的參考實作**：**工具列 ＋ 畫布，同一張卡**。工具列貼在畫布頂上、兩行；畫布是學生的主欄，改哪個格子，底下的卡跟著變。

### 工具列（兩行，明說的，不是換行換出來的）

```
第一行   PRACTICE MODE            ‖  PINYIN                       ‖  TRANSLATION
         Text visible｜Audio only     Shown｜Hidden｜Choice by student   Shown｜Hidden｜Choice by student

第二行   TRANSLATION FIRST        ‖  SPEED                              ‖  VOICE                ‖  MAX TRIES ⓘ
         Yes｜No｜Choice by student   ▶Slow｜▶Normal｜▶Fast｜Choice by student   ▶ Xiaorou (Female) ▾    − 3 +
```

每格 10px 大寫小標在上、28px 控制項在下；組與組之間細直線；**沒有眉標、沒有副標**；不 sticky。

| 格 | 對到的欄位 | 控制項 | 說明 |
|---|---|---|---|
| Practice mode | `audioMode` (Boolean) | 分段 `Text visible` / `Audio only` | 取代 `audio-mode-toggle-card.js` 那張卡（問題 5）。切到 Audio only：第一行的 Pinyin／Translation 換成一句 *Pinyin and translation are up to the student*（現況就是強制 `STUDENT_CHOICE`，只是不再用變灰的下拉表達），畫布上的卡換成學生端的純聽力卡 |
| Pinyin | `pinyinPreference` | 分段 `Shown` / `Hidden` / `Choice by student` | 值仍是 `PINYIN` / `NO_PINYIN` / `STUDENT_CHOICE`，**只換顯示的字**（問題 2）。取代 `display-settings-accordion.js` 的下拉 |
| Translation | `translationPreference` | 同上 | `SHOW` / `HIDE` / `STUDENT_CHOICE` |
| Translation first | `translationFirstPreference` | 分段 `Yes` / `No` / `Choice by student` | 現有 `_LABELS` 的 On / Off / Student choice 改字 |
| Speed | `speedPreference` / `changeSpeed` | 四顆 chip，前三顆帶 ▶ | 點一下＝選它＋用目前 Voice 播一句樣本（`use-audio-preview.js` 已經有試聽）；`Choice by student` 不給 ▶ |
| Voice | `voice` | 一顆帶 ▶ 的下拉，打開每列一顆 ▶ | 這是面板裡唯一長的清單。`zh-TW` 專案的七個聲音**要分組標地區**（`zh-TW` 三個、`zh-CN` 四個），現在 `getVoiceList()` 把兩組串成一份、標籤看不出來（spec 問題 11） |
| Max tries | `maxAttempts` | 加減鈕 ＋ 數字 ＋ ⓘ | 取代 `max-attempts-field.js` 的 *Max attempts before auto pass*。tooltip：*How many times a student may retry one sentence before it is let through — the sentence then counts as passed (auto pass, default 3).* 成績頁的 `auto-pass` 標與 `isAutoAdjusted` 不動 |

Audio Settings 那句 *Controls audio playback speed, pronunciation precision, and voice.* 隨面板消失（問題 3）。

### 畫布（學生的主欄，照 `assignments/content/` 抄）

灰色地板（`#DFE5EC`）上一個有圓角、有陰影的視窗：34px 視窗列（左邊 `desktop_windows` 圖示、中間 `Student view`），裡面是 **`practice-content-list.js → message-list.js` 的 PRACTICE SENTENCE 卡**，不是左欄的句子清單：

- 標題列：練習名稱 ＋ 右上齒輪（`settings-panel.js`）。齒輪只在有任何 `Choice by student` 時出現，面板裡有幾列就看那幾個設定是 Choice by student（Pinyin／Translation／Translation first 是 toggle、Speed 是下拉）。
- 那張卡：拼音在句子上面、翻譯在下面，照目前工具列的值顯示；Choice by student 時照學生端的初始值（拼音開、翻譯關）。
- **Play 鈕字寫著會怎麼播**：`Play · English first · Normal · Xiaorou (Female)`；按下去走 `message-list.js` 的 `playbackDisplay.phase`——Translation first 時先 **Meaning**（藍卡、印英文）再 **Listen & Repeat**（綠卡），否則只有後者。
- **`Sentence 1 of N ▾`**：按了在容器裡原地展開全部句子（不是浮出來的選單、不是左右翻），點一句換預覽；隱藏的句子不列。
- 底部一行：`N sentences`（Audio only 時寫 `Audio only`）。

**這一步不再有那份「老師視角的句子清單」**（問題 6）——逐句確認音檔用畫布上的 Play。

### 改設定不該再整頁被擋

拼音／翻譯／Audio Mode 只是 metadata，前端已把它們排除在 `AUDIO_AFFECTING_FIELDS` 之外，但草稿路徑的後端仍會 enqueue SQS、`audioStatus` 翻成 GENERATING，第二步就出現 *Generating audio…* 全螢幕遮罩（`use-practice-editor.js` 的註解自己講了）。**這一版的即時預覽要成立，這件事要後端一起改**——見最後一節 E3。Speed／Voice 改動重產音檔是必要的，遮罩改成頁面頂端的 Alert ＋ 工具列第二行變淡不能點（原型 `?step=3&banner=1`）。

---

## 第四步 · Assign Practice（`step-three.js` ＋ `assign-practice.js`）

現行是「一個只放按鈕的頁面 ＋ 一個 1728 行的對話框」，對話框裡每選一個班 Schedule／Optional／Students 整組重複一次，自己還有 1/2/3。**搬回頁面**，三段各回答一個問題；八種練習共用，改一次八種一起變：

1. **Who does it** —— 班級列：勾選框、班名、副標。**整班已派**的列變灰掛 `Assigned`、不能再選（要改從上面的 Assigned 清單按 Edit）；**部分已派**的仍可選，副標 `6 of 8 assigned · 2 left`；勾了才出現 `Choose students`，名冊是一份 **diff**：已派的維持勾選標 `Assigned`、新勾標 `New`、取消勾標 `Will remove`、已被別班派走的不能選、標 `In ⟨班級⟩`。
2. **When** —— 一份 Start／Due 套用到所有選到的班（後端本來就是逐班 `upsertAssignment`，前端送同一組值 N 次）；日期上方一行 `These dates apply to all N classes. · Set dates per class`，切過去真的展開成逐班的 Start／Due。Due 快捷三顆 `+1 day / +3 days / +7 days`。
3. **How it counts** —— `Mandatory` / `Optional` 分段，用字對齊 `AssignmentTypeChip`（現行開關寫 *Optional — no emails*，講的是副作用）。

- **已指派的清單在上、再派一次的表單在下**：一份作業可以重複指派，所以指派不是終點。卡片上的 `Cancel` 改成 **`Remove`**（確認文案寫的是 permanently deleted，按鈕的字要跟它做的事同一件）。
- **送出前先開預覽框**（產品本來就有 `ConfirmDialog`）：標題用跟觸發鈕一模一樣的字 `Assign to 2 classes`，副標 `Mandatory · 10 students`，整班就寫 `all 5 students` 不列名字，**只列例外**——被跳過的人與原因（`assignPractice` 回的 `skippedUsers`）、沒選的人。班名用 `CONTENT.label` `#00754A`。
- **頁腳一顆鈕依狀態換字**：有勾班 → `Assign to N classes`；沒勾、已指派過 → `Done`；沒勾、完全沒指派 → `Skip for now`（產品自己的空狀態就說 *You can assign classes later from the practice list*）。送出後停在 `Assigned ✓` 1.6 秒、清空表單、捲回最上面。

Mutation 不變：`assignPractice($practiceId, $programId, $classes: [AssignClassInput!]!)` 一次送多班，逐班日期用 `upsertAssignment`。

---

## 不要順手改的

- **enum 值一個都不動**：`PINYIN` / `NO_PINYIN` / `STUDENT_CHOICE`、`SHOW` / `HIDE`、`audioMode`、`speedPreference`、`maxAttempts`。這一版只換顯示的字與版面。
- **成績端的 auto-pass 不動**：學生端用完次數星星顯示 3 顆、紀錄 `isAutoAdjusted`、老師成績頁掛 `auto-pass` 標——這些照舊，只有老師設定頁的小標從 Auto pass 改成 Max tries。
- **另外四種練習的 Settings**：Audio Settings 面板、Max attempts 欄位、Assign 那一步是五種／八種共用的，**改好之後一起變是預期的**（設計已放行），但 Sentence Scramble 的 *Attempts per sentence*、Follow Pattern 的 *Attempts per question* 這次不改名（spec 問題 10）。
- 學生端的畫面不動。畫布是照學生端抄的，不是反過來。

---

## 動工順序

1. **步驟數與捲動**：`STEPS_BY_TYPE`、頁腳標籤、換步驟捲回最上面。半天。
2. **第一步 ＋ 第二步**：三個 ReUI 元件、Practice name 搬家、課文一段一行；Edit Sentences 獨立成一步、刪除改隱藏、對話類 Alert。
3. **第三步工具列**：分段控制項、Speed chip 試聽、Voice 下拉分組、Max tries。這一批是共用元件，做完 Vocabulary 那一包的第三步只差三格。
4. **第三步畫布**：把 `message-list.js` 的 PRACTICE SENTENCE 卡與 `settings-panel.js` 抽成可以在老師端渲染的元件，接上工具列的值與播放階段。
5. **第四步 Assign**：搬回頁面、diff 名冊、預覽框只講例外、單顆頁腳鈕。八種共用。

---

## 動工前要先問後端的

| # | 題目 | 為什麼 |
|---|---|---|
| **H1** | `updatedArticleArray` 的項目能不能帶 `hidden: Boolean`？ | 第二步「刪除改隱藏」要存得下來，學生端 `practice-content-list.js` 跳過 `hidden` 的句子。現在只能真的把句子從陣列拿掉，拿掉就回不來 |
| **E3** | 拼音／翻譯／Audio Mode 觸發 SQS 重產音檔，是刻意的嗎？ | 純 metadata 卻重產音檔，第二步就會被全螢幕遮罩擋幾十秒。這一題決定第三步能不能「改了就看到」 |
| E1 | 新的發音 Lambda 什麼時候支援 slack 參數？ | 不管答案是什麼，*pronunciation precision* 那句文案已經隨面板拿掉了；要不要把「發音嚴格度」設計進工具列等答案 |
| E2 | 兩個下拉直接露出 enum 值，是有意的嗎？ | 若不是，一行字串的事——但這一版反正整組換成分段控制項 |
