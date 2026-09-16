# Practice 共用改動 — Engineer Handoff

Content Mirroring 與 Vocabulary Mirroring 兩包定下來的決定裡，有一批不是那兩張卡自己的，是**八張練習卡共用的元件與規則**：名稱在哪一步、Settings 長什麼樣、用什麼字、Assign 怎麼做。這一包把它們抽出來，逐項寫成規格，並對照每一張卡現在的程式碼說明「能不能直接套、為什麼」。

**這不是重寫，是改共用元件。** 建立流程八種都走 `practice-unified-view.js`，Settings 五種共用 `AudioModeToggleCard` / `AudioSettingsPanel` / `MaxAttemptsField`，Assign 八種共用 `step-three.js`——**改一次，五種／八種一起變**。沒有新增練習型別、沒有動 enum 值。程式碼基準：`dahua-dash` `origin/develop` @ `599dd4cb`（2026-09-15）。

- 完整規格（S1–S11 × 八張卡的矩陣、每一項的規格與現況、動工順序）：[`shared-practice-changes.html`](shared-practice-changes.html)
- 三張卡的 Settings 畫好的樣子（可互動）：[`shared-settings-gallery.html`](shared-settings-gallery.html)
- 規格本身以兩個交接包為準，這裡只寫差異：[Content Mirroring](../content-mirroring/HANDOFF.md)、[Vocabulary Mirroring](../vocabulary-mirroring/HANDOFF.md)
- 判準（R11 是 Settings 的固定形狀）：[practice-design-rules.html](https://project-logeg.vercel.app/specs/chinese-modules/iterations/practice-design-rules.html)

---

## ⚠ 先看：還沒定的、要先問的

動工前先過這一節。有答案的直接照下面的表做；沒有的先不要動。

**要問後端（答案會改設計）**

| # | 題目 | 卡住哪一項 |
|---|---|---|
| E3 | 拼音／翻譯／模式改動為什麼會重產音檔？草稿路徑後端會 enqueue SQS（`use-practice-editor.js` 的註解），第二步就被全螢幕遮罩擋住 | S3 的「改了就看到」。五種都受影響 |
| S10 | Scramble、Follow Pattern 第一步 Generate 之後鎖住——生成能不能只補新勾的 teaching point、儲存能不能延到審題那一步（＝ Vocabulary 契約 §1） | S10 |
| S11 | `updatedArticleArray` 項目能不能帶 `hidden`（＝ Content Mirroring 的 H1） | S11 Scramble 的審句步 |
| E1 | 新的發音 Lambda 什麼時候支援 slack 參數 | 「發音嚴格度」要不要進工具列 |

**要先確認行為（查程式碼就能答，動工的人順手查）**

| 題目 | 為什麼 |
|---|---|
| Follow Pattern 自己畫的 Audio Mode（`follow-pattern-settings.js` 165–187）跟共用 `AudioModeToggleCard` 是不是同一件事：學生端 `follow-pattern/question-card.js` 只是題目不顯示文字（*Listen to the question*），Mirroring 是整片換成聽力卡 | 是同一個 `audioMode` 布林才能換成同一格 Practice mode（S5） |
| Scramble 的 `scramble-sentence-list.js` 有沒有用 `canSplitMerge`／`contentType === 'CONVERSATION'` | 對話類提醒要不要出現在它的審句步（S11） |
| QA 的 `guidePhraseLanguage` 在學生端只影響 `StartPracticeButton.js` 的前導語（播哪種語言、哪種在前）——畫布上要能看到它改了什麼 | S3 QA 那一格的畫布（畫廊已照這個畫） |

**設計還沒定（不擋動工，做到那一步再問）**

| 題目 | 現況 |
|---|---|
| 第一步的 *Generate*（Scramble、Follow Pattern）vs *Next*（Vocabulary） | 唯一跨卡還沒統一的字；先各留各的 |
| 各卡自己的部分：Vocabulary Quiz 的 Question Types ＋ 題目清單、Comprehension Quiz 的題目清單、QA 的 Guide phrase language、Scramble 的 Number of questions | **待設計梳理**，會逐張另開版本；工具列先留格子 |

**查到的更正（免得照舊資料做）**

- Vocabulary Quiz 與 Comprehension Quiz 的 Settings 步**沒有**顯示／音檔設定（`vocabulary-step-three-section.js` 把 Display／Audio／Max attempts 全包在 `!isMultipleChoice` 裡；`mc-step-two-section.js` 只有題目清單）。早先的 spec 草案寫成「同一套工具列」，已更正：S3–S7 對這兩張不適用。
- Comprehension Quiz **有** Practice Name 欄位，只是不在 section 檔，在 `practice-unified-view.js` 的 `isMC` 分支。S1 對它一樣是「搬到第一步」。

---

## 一張表看完

● 兩包已做　✓ 直接套　◐ 套得上但有差異　△ 要問工程　— 不適用

| 定案 | Content Mirroring | Open-ended Questions | Vocabulary Mirroring | Vocabulary Quiz | Sentence Scramble | Response／Building | Comprehension Quiz |
|---|---|---|---|---|---|---|---|
| **S1** Practice name 在第一步、多來源 A + B | ● | ✓ | ● | ✓ | ✓ | ✓ | ✓ |
| **S2** 第一步的元件（來源選單、內容 frame、teaching point 勾選） | ● | ◐ 題庫選單 | ● | ✓ 同一支檔案 | ◐ | ◐ | ◐ 題庫選單 |
| **S3** Settings ＝ 工具列 ＋ 視窗預覽（R11） | ● | ◐ 多一格 Guide phrase language | ● | — 沒有設定 | ◐ | ◐ | — 沒有設定 |
| **S4** Shown｜Hidden｜Choice by student | ● | ✓ | ● | — | ✓ | ✓ | — |
| **S5** Practice mode：Text visible｜Audio only | ● | ✓ | — | — | — | ◐ 自己畫的 Audio Mode | — |
| **S6** Max tries ＋ ⓘ | ● | — | ● | — | ✓ 原 Attempts per sentence | ✓ 原 Attempts per question | — |
| **S7** Speed 試聽、Voice 分組標地區 | ● | ✓ | ● | — | ✓ | ✓ | — |
| **S8** Assign 搬回頁面 | ● | ✓ | ● | ✓ | ✓ | ✓ | ✓ |
| **S9** 頁腳標籤、捲回最上面、Next 灰著要說原因 | ● | ✓ | ● | ✓ | ✓ | ✓ | ✓ |
| **S10** 回第一步不鎖、只生新的 | — | — | ● △ | △ | △ | △ | — |
| **S11** 審句步：眼睛＝隱藏、對話類提醒只在這一步 | ● | — | — | — | ◐ | — | — |

Vocabulary Quiz 與 Comprehension Quiz 的 Settings 步**沒有**顯示／音檔設定（`isMultipleChoice` 時只有 Practice Name ＋ 題目清單），S3–S7 不適用。

---

## 每一項要動哪裡

| # | 定案 | 改哪裡 | 說明 |
|---|---|---|---|
| S1 | Practice name 在第一步 | `step-one-qa.js`、`step-one-sentence-scramble.js`、`step-one-follow-pattern.js`、`step-one-mc.js` | 六種現在都在第一步就 `setValue('practiceName', …)`（題庫名／第一個專案名），欄位卻在第二步（`qa-step-two-section`、`sentence-scramble-preview`、`follow-pattern-preview`；MC 的在 `practice-unified-view.js` 的 `isMC` 分支）。搬到第一步、來源選單正下方；多來源用「 + 」串；老師改過就不再覆蓋。Vocabulary Quiz 共用 `step-one-vocabulary.js`，v4 做完它就有 |
| S2 | 第一步的元件 | 各 `step-one-*.js` | 來源選單 `c-dropdown-menu-18`（題庫也照畫）、內容 `c-frame-6` ghost frame（該欄自己的 wash）、teaching point 勾選 chip（Scramble／Follow Pattern 已有 `steps/shared/teaching-point-picker.js`，這是它的版面版）。第一步只有「選來源、看內容、決定要練哪些」，不放編輯器 |
| S3 | 工具列 ＋ 視窗預覽 | 共用：分段控制項、工具列容器、視窗殼；各卡：`qa-step-two-section.js`、`sentence-scramble-preview.js`（settings 模式）、`follow-pattern-settings.js` | 每張卡的格子見 spec §5 的表；畫布各自照學生端主欄抄（`qa/components/MessageList.js`、`sentence-scramble/index.js`、`follow-pattern/question-card.js`）。畫好的樣子在畫廊 |
| S4 | Shown｜Hidden｜Choice by student | 一個共用 seg 元件取代四處 `Object.entries(ENUM).map` 的下拉 | enum 值不動，只換顯示的字 |
| S5 | Practice mode | `AudioModeToggleCard` → 工具列第一格；Follow Pattern 自己畫的那份（`follow-pattern-settings.js` 165–187）換成同一格 | 對到 `audioMode` 布林；Audio only 時同一行的 Pinyin／Translation 換成一句說明 |
| S6 | Max tries ＋ ⓘ | `MaxAttemptsField`；Scramble、Follow Pattern 的自訂標籤 | 三個名字收成一個，tooltip 單位各寫 sentence／card／question。成績端 `auto-pass` 標與 `isAutoAdjusted` 不動 |
| S7 | Speed 試聽、Voice 分組 | `AudioSettingsPanel` | 改一次五種一起變；拿掉 *pronunciation precision* 那句 |
| S8 | Assign 搬回頁面 | `step-three.js` ＋ `assign-practice.js` | 八種共用；mutation 不變 |
| S9 | 頁腳與捲動 | `practice-unified-view.js` | 換步驟 `scrollTo(0,0)`；Next 灰著要在內容區說原因；Generate vs Next 這個字還沒統一（待定） |
| S10 | 回第一步不鎖 | Scramble、Follow Pattern 的 `use-teaching-point-pool.js` | **要問**：生成能不能只補新勾的 teaching point、儲存能不能延到審題那一步（＝ Vocabulary 契約 §1） |
| S11 | 審句步 | `scramble-sentence-list.js` | **要問**：`updatedArticleArray` 項目能不能帶 `hidden`（＝ Content Mirroring 的 H1）；對話類能不能切合併要先查 `canSplitMerge` 有沒有用在這裡 |

---

## 動工順序

1. **共用元件先**：S4 分段控制項、S5 Practice mode 格、S6 Max tries、S7 Speed chip ＋ Voice 下拉、S3 工具列容器與視窗殼。做完 Content Mirroring 那一包的第三步，其餘三張只剩「放哪幾格 ＋ 抄自己的畫布」。
2. **S8 Assign 與 S9 頁腳／捲動**：各一處，八張同時變。
3. **S1 名稱搬家 ＋ S2 第一步元件**：一張卡一張卡做。Comprehension Quiz 最小（名稱搬家、Assign、捲動），可以當第一張試。
4. **各卡自己的畫布**：QA、Scramble、Follow Pattern 各抄一份學生端主欄（畫廊就是目標）。
5. **S10／S11** 等後端答覆再排。

---

## 要問後端的

| # | 題目 |
|---|---|
| E3 | 拼音／翻譯／模式改動為什麼會重產音檔？（草稿路徑 enqueue SQS，`use-practice-editor.js` 的註解）純 metadata 不該讓第二步被全螢幕遮罩擋住——這一題一次解，五種都受益 |
| E1 | 新的發音 Lambda 什麼時候支援 slack 參數？決定「發音嚴格度」要不要進工具列 |
| S10 | 生成後能不能只補新勾的 teaching point、儲存延到審題那一步 |
| S11 | `updatedArticleArray` 項目能不能帶 `hidden` |

---

## 不在這一包裡的

- Vocabulary 第二步「一個字一列 ＋ 逐卡 chip ＋ 總開關 ＋ 上傳圖 ＋ 再生例句」——Vocabulary 自己的，在那一包。
- QA 的 Guide phrase language、Vocabulary Quiz 的 Question Types、Scramble 的 Number of questions——各卡獨有，工具列留格子，內容各自定；**各卡自己的部分待設計梳理**，會逐張另開版本。
- 學生端畫面。畫布是照學生端抄的，不是反過來改學生端。
