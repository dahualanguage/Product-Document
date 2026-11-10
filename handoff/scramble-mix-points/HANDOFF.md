# Sentence Scramble：一句用到多個教學點（Mix teaching points）— Engineer Handoff

Sentence Scramble 現在是**一個教學點一句**。這一包加一個出題方式：老師打開開關後，AI 寫的句子**一句同時用到兩個或三個教學點**，老師在第二步可以調哪幾個點合在一句、各要幾句。

**只動 Sentence Scramble**。Sentence Cloze、Response、Building 不碰。**這不是重寫，是在現有流程上加**；前端為主，後端生句子的那條要改（最後一節）。程式碼基準：`dahua-dash` `origin/develop` @ `bcdf3d33`（2026-11-05）。

這一包接在 [`../sentence-practices/`](../sentence-practices/)（四種 Sentence 練習）和 [`../teaching-points/`](../teaching-points/)（教學點方框）後面：那兩包的規則照舊，這一包只寫開關打開之後多出來的東西，以及三處 Scramble 跟那兩包不一樣的地方（第 5 節）。

---

## 名詞對照

| 這份文件的用詞 | 程式裡是什麼 | 意思 |
|---|---|---|
| 教學點 | teaching point | 專案裡的生詞或語法點 |
| 開關 | 第一步 *Generate new sentences* 卡裡新加的 **Mix teaching points** | 打開＝一句用到兩個以上的點；關著＝現在的一點一句 |
| 可合的點 | 開關底下那排、勾著的點 | 會被 AI 合進句子的點 |
| 自己一句的點 | 開關底下那排、老師勾掉的點 | 不合進去，照現在的方式各自出句 |
| 組 | 一句裡實際用到的那幾個點，例如「起床＋早饭＋一……就」 | 第二步小卡照組排，一組一張 |
| 小卡 | 第二步最上面 TEACHING POINTS 區塊裡的卡（程式裡 `TeachingPointSteppers`，`steps/shared/teaching-point-steppers.js`） | 調每組要幾句 |
| Add new 卡 | 小卡最後一張虛線卡 | 老師自己指定一組點，加一句 |
| 句子卡 | 第二步下半部一句一張（`sentence-scramble-preview.js`） | 跟現在一樣，多幾顆 chip |
| 句子的點 | `teachingPointHighlights`，前端用 `resolveSentencePoints()`（`src/utils/scramble-teaching-points.js`）讀 | 一句掛的教學點。**現在的資料就能掛多個** |

---

## 原型怎麼看

一份檔 [`scramble-mix-points.html`](scramble-mix-points.html)，`&combo=1` 是開關打開。

| 要看什麼 | 網址 |
|---|---|
| 第一步，開關關著（＝現在） | [`?step=1&sel=1&n=12`](scramble-mix-points.html?step=1&sel=1&n=12) |
| 第一步，開關打開，运动、睡觉 勾掉自己一句 | [`?step=1&sel=1&combo=1&single=运动,睡觉&n=12`](scramble-mix-points.html?step=1&sel=1&combo=1&single=运动,睡觉&n=12) |
| 第一步，數字打低於下限 | 同上，把數字改成 3 |
| 第二步，開關打開 | [`?step=2&sel=1&combo=1&single=运动,睡觉&n=12`](scramble-mix-points.html?step=2&sel=1&combo=1&single=运动,睡觉&n=12)；點最後一張 **Add new** 看選點 |
| 第二步，開關關著（＝四種共用的那套） | [`?step=2&n=12`](scramble-mix-points.html?step=2&n=12) |
| 第三步、第四步 | 不動，照 Sentence 那一包 |

mock 只有 14 句合好的句子；按 + 把 mock 用完之後會複製一句充數，內容對不上，正式由後端生。

---

## 1 · 第一步：開關和可合的點

```
HOW MANY SENTENCES ──────────────────────────────────────
┌ [12] sentences · up to 20 ┐
┌ ✦ Generate new sentences ─────────────┐ ┌ ❝ Example sentences from teaching points ┐
│ (●) Mix teaching points                │ │                                           │
│ Two or more per sentence · untick to   │ │                                           │
│ keep a point on its own                │ │                                           │
│ [☑起床][☑早饭][☑上课][☑图书馆][☐运动][☐睡觉][☑一……就] │ └───────────────────────────────────────────┘
└────────────────────────────────────────┘
```

- **現在**：Generate new sentences 卡只有標題和一行說明。
- **改成**：
  1. 卡裡多一個開關 **Mix teaching points**，預設關。只在這張卡被選中時顯示；選了例句卡就不顯示（用不到）。
  2. 開了，底下一行小字 *Two or more per sentence · untick to keep a point on its own*，再底下一排**勾選的教學點**（跟方框裡勾的同一批，方框多勾或取消，這排跟著動），預設全勾。老師勾掉的點＝自己一句，不合。
  3. 可合的點只剩一個時，小字變紅 *Pick at least two points to combine*，Generate 不能按。
  4. **最少句數**：開關關著＝點數（現行）。開關打開＝⌈可合的點數 ÷ 2⌉ ＋ 自己一句的點數。數字欄低於它時備注欄變紅 *at least N · every teaching point in at least one sentence*。
  5. 總數上限 20 不變。每點 5 句的上限（`MAX_PER_POINT`）**開關打開時不用**，改成「每個點至少出現在一句」。
- **改哪裡**：`components/step-one/scramble-source-panel.js`（開關、點那排、最少句數）、`step-one-sentence-scramble.js`（存開關和勾掉的點）。
- **卡住的**：建立時要帶「開關開了」和「哪些點自己一句」給後端（最後一節第 1 題）。

### 開關打開後 AI 怎麼生（給後端的規則）

- 可合的點裡，每句用**兩個或三個**；自己一句的點各自出句，不合。
- **每個勾的點至少出現在一句**。
- 總數＝老師填的數字。
- 哪幾個點合在一起由 AI 決定；不同的句子可以用不同的組合，同一組可以出不只一句。
- 建議組數不要多於點數（7 個點不要出 7 種以上的組合），不然第二步小卡會比點還多。這條要問後端做不做得到（第 2 題）。

---

## 2 · 第二步：小卡照組排

開關打開時，TEACHING POINTS 小卡**不再一點一張，改成一組一張**：

```
TEACHING POINTS · 7 ──────────────────────────── Sentences · 12  up to 20
┌ 起床 早饭 一……就 ┐ ┌ 上课 图书馆 ┐ ┌ 起床 上课 ┐ ┌ 图书馆 一……就 ┐
│   − 1 +          │ │   − 2 +     │ │   − 2 +   │ │   − 2 +        │
└──────────────────┘ └─────────────┘ └───────────┘ └────────────────┘
┌ 早饭 上课 一……就 ┐ ┌ 早饭 图书馆 ┐ ┌ 运动       ┐ ┌ 睡觉           ┐
│   − 2 +          │ │   − 1 +     │ │   − 1 +   │ │   − 1 +        │
└──────────────────┘ └─────────────┘ └───────────┘ └────────────────┘
┌ ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌ ┐
│   ＋ Add new     │
└ ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌ ┘
```

- **現在**：一個點一張卡，chip ＋ 「− 數字 +」；每點最多 5；`auto-fill` 排。
- **改成**：
  1. **一組一張**。組＝句子裡實際用到的那幾個點（從每句的 `teachingPointHighlights` 讀）。chip 並列、數字＝這組有幾句。**同一組不分先後**：「上课＋图书馆」和「图书馆＋上课」是同一張。
  2. **順序**：合的組在前（照句子第一次出現的順序），自己一句的點在後。勾了但目前一句都沒有的點也留一張，數字 0。
  3. **排版固定一列四張**，每張等寬，往下排；不用 `auto-fill`、組合卡不佔兩格。
  4. **+**：這組再生一句（帶同樣的點），接在這組最後一句後面。0 句的單點按 +＝生一句只有這個點。總數到 20 時所有 + 灰掉、卡裡藍字 *Up to 20 in total*。沒有每點 5 的上限。
  5. **−**：拿掉這組最後一句。0 句時灰掉；整份只剩一句時擋住，上方提示 *Keep at least one sentence.*（同現行）。
  6. **Add new 卡**：最後一張虛線卡。點了**就在這張卡裡展開**（不浮選單）：小字 *Pick up to three points* ＋ 可合的點一排 chip（點一下勾、再點取消，最多三個）＋ **Cancel**／**Add**。勾一個＝生一句只有這個點（給只在組合裡出現的點加單獨句用）；勾兩三個＝生一句合。沒勾 Add 不能按。生出來的句子接在同組句子後面，沒有同組就接最後；小卡多一張（或原本那組 +1），Add new 卡收回虛線。總數到 20 時 Add new 灰掉。
  7. 右上角的 *Sentences · 12 up to 20* 不變。
- **開關關著**：小卡照 Sentence 那一包（一點一張、每點 5）。
- **改哪裡**：`steps/shared/teaching-point-steppers.js`、`src/utils/teaching-point-steppers.js`（`buildPointSteppers` 多一個「照組」的版本）、`src/utils/scramble-teaching-points.js`（`buildTeachingPointUsage` 現在是一點一筆，要多一個「一組一筆」）、`sentence-scramble-preview.js`（+／−／Add new 的呼叫）。
- **卡住的**：+ 和 Add new 要後端「照指定的幾個點生一句」並回傳哪一句是新的（最後一節第 3 題）。

---

## 3 · 第二步：句子卡

- **現在**：Q 編號後面一顆教學點 chip；英文翻譯在拼音詞塊**下面**。
- **改成**：
  1. 一句有幾個點就掛幾顆 chip，排在 Q 編號後面並列（讀 `resolveSentencePoints()`）。
  2. **英文翻譯搬到拼音詞塊上面**：Q 編號＋chip → 英文 → 拼音詞塊。
  3. 拖曳、剪刀、編輯、刪除、Edit Pinyin 照舊。
- **改哪裡**：`sentence-scramble-preview.js` 的句子卡。
- 第 2 點只定了 Scramble；Cloze／Response／Building 要不要跟著改，見「設計還沒定的」。

---

## 4 · 學生端

不動。學生拼的句子一樣，只是長一點。`scramble-student-preview.js` 和 `src/sections/assignments/content/` 底下 Scramble 的畫面不用改。

---

## 5 · 跟前兩包不一樣的地方（Scramble 這一份改了）

| 東西 | 前兩包寫的 | 這一包（Scramble） |
|---|---|---|
| HOW MANY 那行備注 | *sentences · up to 20 · across 7 teaching points*（教學點包 §10 拿掉 *1–2 each*） | 只寫 **sentences · up to 20**。開關開關都一樣。低於下限那句紅字照留 |
| 兩張來源卡的副標 | *AI writes new sentences for the teaching points you tick*／*14 available* | **拿掉**，卡只剩標題。例句卡因為沒句子可挑而灰掉時才寫一句原因：*No example sentences for the ticked points*（沒選專案時 *Pick projects first*） |
| 句子卡的英文位置 | 拼音詞塊下面 | 拼音詞塊**上面**（第 3 節） |

這三條其他三種 Sentence 練習要不要跟，設計還沒定，先只改 Scramble。

---

## 不用改的

| 題目 | 現況 |
|---|---|
| 一句掛多個點的資料 | `teachingPointHighlights` 已經是陣列，`resolveSentencePoints()` 會回全部；不用改結構 |
| 教學點方框、Add teaching points、例句清單 | 照教學點那一包 |
| 第三步 Settings、第四步 Assign | 不動 |
| 開關關著的所有行為 | 就是現在 ＋ Sentence 那一包 |

---

## 驗收

1. 第一步選 Generate new sentences：卡裡有 Mix teaching points 開關，預設關；切到例句卡開關不見。
2. 開了：底下一排勾的點，跟方框同步；勾掉 运动、睡觉。
3. 數字打 3：備注欄變紅 *at least 5 · every teaching point in at least one sentence*（5 個可合的 ⌈5÷2⌉＝3，加 2 個自己一句）。
4. 備注欄平常只有 *sentences · up to 20*；兩張來源卡沒有副標。
5. 只留一個可合的點：紅字 *Pick at least two points to combine*，Generate 按不下去。
6. Generate：12 句，每句用到兩到三個可合的點；运动、睡觉 各自一句；七個點每個都至少出現一次。
7. 第二步小卡一組一張，合的在前、單點在後，一列四張；數字加起來＝句數。
8. 某組按 +：多一句同樣幾個點，接在那組後面；總數到 20 全部灰掉。
9. 某組按 − 到 0：那張卡不見（單點的留著寫 0）；整份剩一句時 − 擋住。
10. Add new：卡自己展開、沒浮選單；勾一個點 Add → 多一句只有這個點、多一張單點卡；勾三個 Add → 一句三個點；第四個勾不了。
11. 句子卡：chip 並列在 Q 後面；英文在拼音上面。
12. 開關關著建立一份：第一步、第二步跟改之前一模一樣。
13. 學生端打開這份練習：句子較長，其餘不變。

---

## 要問後端

1. **建立時怎麼帶**：`upsertPractice` 要多「開關開了」和「哪些點自己一句」。建議 `scrambleMixPoints: Boolean`、`scrambleOwnPoints: [String!]`（自己一句的點；其餘勾的點都可合）。沒帶＝現行行為。
2. **生句子的 prompt**：現在一個點一句。開關打開要改成「可合的點每句用兩到三個、每點至少一句、自己一句的點各自出句、總數照填的數字」。是改 prompt 參數就好，還是新的流程？組數能不能限制不多於點數？
3. **第二步 + 和 Add new**：要「照指定的幾個點生一句」。現有 `scrambleAppendTeachingPoints: [String!]` 是每個點各一句；建議多一個 `scrambleAppendMix: [[String!]!]`（每一筆是一組點，各生一句），回傳整份 `updatedArticleArray`、新句帶齊 `teachingPointHighlights`。前端把新句移到同組最後一句後面再送一次順序（同 Sentence 包契約 §3）。
4. **每點 5 的上限**：開關打開時後端不要擋 `MAX_PER_POINT`，只擋總數 20。

---

## 不在這一包裡的

- 提案 A（老師在第一步自己圈組合）：留著當備案，不做。[線上看](https://project-logeg.vercel.app/specs/chinese-modules/iterations/v21-scramble-combined-points/proposal-a.html?step=1&sel=1&combo=1&n=12)
- Cloze、Response、Building 要不要有這個開關。
