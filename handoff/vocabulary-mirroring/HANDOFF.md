# Vocabulary Mirroring — Engineer Handoff

老師建立 **Vocabulary Mirroring** 練習的那條流程（New Practice → Vocabulary Mirroring；`?type=VOCABULARY&subType=MIRRORING`）：三步改成四步、生成前就決定要練哪些字、生成後一個字一列直接畫成學生會拿到的卡、Settings 那一步變成「工具列 ＋ 學生預覽」同一張卡。

**這不是重寫，是在現有流程上改**，但**這一包有後端**：practice 改在第二步儲存（已跟工程談定）、字表要能帶順序／逐卡開關／例句數／老師上傳的圖、學生端要開始讀三個顯示設定。契約在 [`API-CONTRACT.md`](API-CONTRACT.md)。程式碼基準：`dahua-dash` `origin/develop` @ `599dd4cb`（2026-09-15）。

- 設計原型：[`vocabulary-mirroring.html`](vocabulary-mirroring.html) —— `?step=1|2|3|4` 從 1 數。第一步：預設從頭走、`&sel=1` 已選專案、`&dd=1` 選單打開、`&pool=1` From Project 展開、`&gen=1` 生成中、`&back=1` 從第二步回來；第二步：`&more=1` 第一個字已生到五句、`&exn=1` 例句數下拉、`&updlg=1|2` 上傳對話框選檔／預覽；第三步：`&banner=1` 音檔重產中、`&all=1` 卡片清單展開、`&voice=1` Voice 下拉、`&settings=1` 學生齒輪面板、`&tip=1` Max tries 說明；第四步同 Content Mirroring
- 完整設計說明、學生端「一個字＝三張卡」的抄錄、問題清單、E1–E6：[v4 spec](https://project-logeg.vercel.app/specs/chinese-modules/iterations/v4-vocabulary-mirroring/spec.html)
- 三十幾輪每一輪改了什麼、為什麼：[v4 ITERATION.md](https://project-logeg.vercel.app/specs/chinese-modules/iterations/v4-vocabulary-mirroring/ITERATION.md)
- 姊妹包：[Content Mirroring](../content-mirroring/) —— **第三步的工具列元件、第四步 Assign 整步在那一包**，這裡只寫差異。先做那一包

---

## 為什麼要做

編號照 spec §5，每一條都在程式碼裡看得到：

1. **老師設的 Pinyin／Translation／Image，學生端一個都沒讀。** `assignments/content/index.js` 渲染 `<VocabularyPractice>` 只傳 `maxAttempts / speedPreference / changeSpeed`；`use-vocabulary-practice.js` 的 `showPinyin` 是 `useState(!isESL)`、`showTranslation` 是 `useState(true)`；`imagePreference` 在整個 `assignments/` 底下零引用。Mirroring 與 Scramble 都有讀，只有 Vocabulary 沒有。
2. 預覽跟學生端對同一個 `STUDENT_CHOICE` 畫出相反的東西（預覽不印、學生端開著開始）。
3. **「一個字＝三張卡」在老師端看不出來**，但學生要念三句、評分三次、`maxAttempts` 逐卡算——設 3 其實是一個字最多 9 次。
4. 三個下拉印 enum 值（`NO_PINYIN`、`STUDENT_CHOICE`、`SHOW`、`HIDE`）。
5. `Load Content` 這個名字講「載入」，做的是建 practice ＋ 叫 AI 生成，按完 Project 就鎖死；頁腳的 Next 灰著但不說為什麼。
6. 第一步跟第二步各畫一份生詞卡（`vocabulary-display-section.js` / `vocabulary-cards-preview.js`），長得不一樣。
7. 練習名字取 `value[0]`——多選時只有第一個專案。

---

## 流程：三步 → 四步，practice 在第二步儲存

```
現行  Vocabulary → Settings → Assign Practice
提案  Teaching Points → Vocabulary → Settings → Assign Practice
```

- `STEPS_BY_TYPE[VOCABULARY]` 改成四個標籤（Follow Pattern 本來就有 `Teaching Points`，不是新詞）。
- **第一步永遠可編輯**：專案、teaching point、加字都不鎖。按 Next 生成 → 自動進第二步（照 Scramble 的 auto-advance）。回到第一步改過再按 Next：**直接回第二步、不做生成動畫**，多勾的字掛 `New`、內容在卡上生（跟第一步加的字一樣印 *Generated with the content*），取消勾的字離開練習，其他字的卡、圖、例句、順序都留著。
- **第二步按 Next 才是儲存**：整份字表（含順序、每張卡練不練、例句、圖）在這一步送出，見契約 §2。
- 頁腳：`Next → Next → Save → Assign / Done`。

---

## 第一步 · Teaching Points（`step-one-vocabulary.js`）

- **Project 多選** → `c-dropdown-menu-18`：點一下切換勾選、選單不關、觸發鈕把選到的專案一個一個列出來。
- **Practice name**：`c-input-2`，說明 *Filled in from the projects you pick. Change it if this practice needs its own name.*。**選兩個以上專案用「 + 」串**：`我的一天 + 环境保护与可持续发展`，取消一個就縮回去；老師改過名稱之後不再跟著專案變（問題 7）。
- **每個專案一個 `c-frame-6` frame**（底色 Vocabulary 欄的 wash `#FFF8E7`）：標頭一顆三態全選框 ＋ 專案名 ＋ `已選/總數`；teaching point 是**勾選 chip**（勾＝會生成）。邏輯照 Follow Pattern／Scramble 已經有的 `steps/shared/teaching-point-picker.js` ＋ `use-teaching-point-pool.js`，不必再寫一份。
- **Add words** 在同一個 frame 的第二個 panel：`From Project` 收合，展開是專案課文（`splitArticleArray`）裡的詞，去重去標點，已在清單裡的變灰打勾、其餘按 + 加入；`Custom word` 輸入 ＋ 型別下拉（`TEACHING_POINT_TYPE_OPTIONS` 八個，預設 Word / Vocabulary，Grammar／Phrase／Other 走 examples-only）＋ Add（Enter 也行）。加進來的字掛 `Added`、預設勾起來、歸在它所在的專案底下。**這把 `handleAddVocab` / `CustomWordDialog` 的事提前到生成之前**——契約 §1。
- **`Load Content` 拿掉**，頁腳 Next 做它的事（問題 5）：沒選專案或一個字都沒勾時 Next 灰。生成中 Next 轉圈（LoadingButton）、內容區是現有的 `VocabularyLoadingState`。
- 回頭時 frame 底下一行說明：沒改 → *Generated. Tick more words or untick some — the cards you already have stay as they are.*；有改 → *2 new words are added to the Vocabulary step when you press Next · 1 unticked word leaves the practice*。

---

## 第二步 · Vocabulary（`vocabulary-display-section.js` 換掉；`vocabulary-cards-preview.js` 不再用）

生成後的字表只畫**一份**（問題 6），一個字一列，右邊就是學生會拿到的卡：

```
1  ↑↓   ☑ Image  ☑ Word  ☑ Example 1  ☑ Example 2                      Hide
   ┌ 圖 ────┐  起床            ┌ EXAMPLE 1 ─────────────────────── ✎ ┐
   │        │  qǐ chuáng      │ wǒ  měi tiān  qī diǎn  qǐ chuáng      │
   └────────┘  get up         │ 我   每天     七点     起床   。       │
   [1][2][3][4][+]  verb HSK 2 │ I get up at seven every day.          │
                              └───────────────────────────────────────┘
                              ┌ EXAMPLE 2 ─────────────────────── ✎ ┐ …
                              [ ✦ Generate another example   3 more times ]
```

- **群組標頭**（`我的一天`）右邊三顆總開關：`Images · 5 of 5`、`Word cards · 5 of 5`（三態鈕：全開按了全關、部分或全關按了全開）、`Examples · 2 per word ▾`（下拉 0～n，每個字練前 k 句，每列寫會變成幾張卡；個別改過顯示 `mixed`）。**每列的 chip 照留當例外**。
- **每列標頭**：序號、`↑↓`（在整份清單裡換位，學生就照這個順序練）、一組多選 chip `☑ Image ☑ Word ☑ Example 1 …`（照學生練的順序；點一顆就開關那張卡，關掉的卡變灰、標 `SKIPPED`）、右邊 `Hide`（整個字不給學生；隱藏的列變淡、標 *Hidden from students*、chip 收起）。**整頁沒有眼睛圖示**——「學生拿不拿到」全部是同一種勾選 chip。
- **圖片**：大圖 ＋ AI 四張候選縮圖 ＋ 一格 `+`。`+` 開對話框（MUI Dialog）：①拖放區 *Drop an image here, or click to choose / PNG or JPG · up to 5 MB · landscape works best*；②預覽——檔名與大小、*Choose a different file*、一張縮小的學生字卡（左半就是這張圖）；`Use this image` 之後縮圖列多一格 `YOUR IMAGE` 並選中。再按是 *Replace your image for ⟨字⟩*。AI 候選不消失。→ 契約 §3（E5）
- **字那一塊不是卡**：字 18px、拼音、翻譯、詞性 chip、`HSK 2` chip（照現有排法）。文法點（`examplesOnly`）沒有字卡、沒有圖，印 *Sentences only*。
- **例句卡**：`EXAMPLE k` 眉標、右上鉛筆（現有 `edit-vocab-dialog.js`，例句可改、字不可改）；**拼音逐詞斷開放在每個詞上面**、整段靠左——這是學生端 EXAMPLE 卡的排法（`shared/word-groups.js`），老師看到的跟學生看到的同一種。
- **`Generate another example`**：例句卡底下一列虛線鈕，**一次生一句**、最多再按三次（一個字最多五句），右邊寫還能按幾次；生成的掛 `New`，跟原本兩句一樣可編可藏；到五句換成 *5 examples · the most for one word*。→ 契約 §4（E6）
- 老師在第一步加的字（還沒生）：拼音／翻譯／例句印 *Generated with the content.*，沒有鉛筆。

---

## 第三步 · Settings（`vocabulary-step-three-section.js` 換掉）

跟 Content Mirroring 那一包**同一套工具列 ＋ 畫布**，只有三處不同：

| | Content Mirroring | Vocabulary Mirroring |
|---|---|---|
| 第一行 | Practice mode ‖ Pinyin ｜ Translation | Pinyin ｜ Translation ｜ **Image**（`imagePreference`：`Shown` / `Hidden` 兩段） |
| 第二行 | Translation first ｜ Speed ｜ Voice ‖ Max tries | Speed ｜ Voice ‖ Max tries（**沒有** Translation first、沒有 Practice mode——Vocabulary 沒這兩個設定） |
| 畫布上 | PRACTICE SENTENCE 卡 | **`card-stack.js` 的一疊卡**：字卡左半是圖、右半拼音在字上面、翻譯在下面（關掉時位置留著）；例句卡沒有圖 |

- Max tries 的 tooltip 寫 *one card*：*How many times a student may retry one card before it is let through — the card then counts as passed (auto pass, default 3).*
- 畫布不畫學生端的頂欄與進度條，視窗裡直接是齒輪（`settings-panel.js`；Choice by student 幾個就幾列，Speed 的是下拉）＋ 那疊卡 ＋ `Play · Normal · Xiaorou (Female)` ＋ `Card 1 of 17 · word ▾`（原地展開全部卡片，關掉的不列，翻頁順序 字 → 例句 1 → 例句 2 → 下一個字）。
- 底部一行：`6 words · 17 cards · 1 word hidden · 2 cards hidden`。
- **前提是 E1**：學生端要開始讀這三個值，不然畫布畫的是「如果讀了會長這樣」。契約 §5。

---

## 第四步 · Assign Practice

跟 Content Mirroring 那一包**完全一樣**（八種共用），班名色用 Vocabulary 欄的 label `#8F6209`。

---

## 不要順手改的

- **enum 值不動**：`PINYIN` / `NO_PINYIN` / `STUDENT_CHOICE`、`SHOW` / `HIDE`、`IMAGE_PREFERENCES`、`generateVocaUpdatedArticleArrayType = MIRRORING`。
- **逐卡評分不動**：每張卡仍要錄音、≥ 3 星才過、`maxAttempts` 逐卡算；只是老師端現在看得到「一個字＝N 張卡」。
- **Vocabulary Quiz 這條不在範圍**（`VOCABULARY_MC_STEPS` 多一步 Question Types）；第一步、第二步的元件它會共用，第三步不會。
- 學生端只做契約 §5 那幾件（讀三個設定、跳過關掉的卡、例句數照資料算），畫面不動。

---

## 動工順序

1. **先做 Content Mirroring 那一包的 1／3／5**（步驟數、工具列元件、Assign）。
2. **第一步**：多選專案 ＋ `A + B` 名稱、teaching point 勾選（沿用 shared picker）、Add words、Next 生成、回頭可改（契約 §1）。
3. **第二步**：一個字一列、chip、總開關、順序、Hide、逐詞拼音、鉛筆編輯（契約 §2）。這一步做完就能儲存字表，即使 E5／E6 還沒好。
4. **第三步**：工具列多一格 Image、畫布換成 `card-stack.js` 的一疊卡。
5. **後端 ＋ 學生端**（契約 §5）：三個設定傳到 `<VocabularyPractice>`、`parsePracticeCards` 照資料算、跳過關掉的卡。**這一批不做，第三步的預覽就是假的。**
6. **上傳圖片（E5）、再生一句（E6）**：兩個新端點，最後做，前端已留好位置。

---

## 動工前要先問後端的

全部寫在 [`API-CONTRACT.md`](API-CONTRACT.md)，這裡只列題目：

| # | 題目 |
|---|---|
| **E1** | Vocabulary 學生端不讀 Pinyin／Translation／Image，是有意的嗎？答案決定第三步的預覽是真是假 |
| E2 | Image 關掉時學生端長什麼樣？現行 `card-stack.js` 沒有「沒有圖」的分支（圖載失敗才變純文字） |
| **E4** | 建立時能不能直接帶「要練哪些字 ＋ 額外的字」？第二步儲存時能不能帶整份字表（順序、逐卡開關、例句數）？ |
| E5 | 老師自己上傳的圖：有沒有上傳到 S3 的端點？`importVocabularyImage($source, $sourceId)` 已經有 `customImage`，能不能多一個 `UPLOAD` 來源？ |
| E6 | 一個字的例句能不能多於兩句、一次再生一句？`edit-vocab-dialog.js` 只有 `example1` / `example2`，學生端 `groupSize` 固定 3 |
