# v21 — Sentence Scramble：一句結合多個教學點

- **功能名稱**：Sentence Scramble 的新出題方式——一句話同時用到兩個或多個教學點（2026-10-29 使用者開版）
- **網址**：https://dahua-dash-dev.web.app/dashboard/practice/create/?type=SENTENCE_SCRAMBLE（現行只會每個教學點各出各的句子）
- **截圖**：無（基準是 v20 的提案，不是現行產品）
- **日期**：2026-10-29（登記）
- **分岔自**：v20 `proposal.html?type=scramble`（四種 Sentence 練習合一份的 Scramble 分支）。**只動 Sentence Scramble**，Cloze／Response／Building 不碰
- **設計檔**：
  - 基準：`../v20-sentence-practices/proposal.html?type=scramble&step=1&sel=1&n=12`（不複製，直接連過去看）
  - `proposal-a.html`（**提案 A · 備案**，2026-11-09 定先走 B＋C、這份留著不刪。2026-10-29：老師在第一步自己圈組合。`&combo=1` 每點各自一組；`&groups=起床+早饭+一……就,上课+图书馆,运动+睡觉` 預設合併；`&gpick=1` 第二組正在加點；2026-11-05 起同一個點可以寫在好幾組：`&groups=运动+一……就,运动+睡觉`）
  - `proposal.html`（**提案 B＋C · 2026-11-09 定先走這案**，第一輪 2026-10-29：從 v20 `proposal.html` 整份複製、鎖在 Scramble；`&combo=1` 開關打開，其餘參數同 v20：`?step=`、`&sel=1`、`&n=12`、`&ex=1`）
- **程式碼基準**：dahua-dash `origin/develop` @ `7528c30f`（同 v19／v20）
- **狀態**：**2026-11-10 定案並交接 `handoff/scramble-mix-points/`**（原型複本＋HANDOFF.md；後端 1–4 待回）。2026-11-09 定先走 B＋C（`proposal.html`）；提案 A（`proposal-a.html`）留著當備案、不刪、不再改。2026-10-29 起兩案並行，登記同日；形狀四條討論後定（下表），提案照它畫

## 使用者定的（2026-10-29）

| 題目 | 定案 |
|---|---|
| 範圍 | **只有 Sentence Scramble**。v20 其他三種不動 |
| 新東西 | **多一個出題方式**：一句話同時用到兩個或多個教學點（現在是一個點一句） |

## 形狀（2026-10-29 討論後定）

| 題目 | 定案 |
|---|---|
| 放哪裡 | 第一步「Generate new sentences」那張卡裡多一個開關 **Combine teaching points in one sentence**；不加第三張來源卡。選例句卡時開關不顯示（用不到） |
| 誰決定哪幾個點合在一句 | ~~AI 從勾的點裡自己配~~ → **2026-10-29 改成 B＋C**（使用者問「結合什麼 teaching point 可以讓老師選嗎」）→ 10-29 另開 A 並行 → **2026-11-09 定先走 B＋C，A 留著當備案**。**C**：第一步開關底下列出勾的點、預設全勾，老師勾掉的點不參與結合、自己一句。**B**：第二步可合的點按 + 先問「Combine 起床 with」、點一個配對 chip 才生一句帶這兩個點；勾掉的點按 + 照舊生一句。AI 仍負責第一次的配法 |
| 句數怎麼算 | **一句就算一句**，總數 20 照舊；每點 5 的上限改成「每個點至少出現在一句」，所以最少句數＝點數的一半（無條件進位）。小卡顯示這個點出現在幾句；+ 生一句帶這個點加另一個點、− 拿掉最後一句有這個點的 |
| 第二步句子卡 | 一句掛兩個以上的 chip，排在 Q 編號後面並列；拖曳、剪刀、編輯、刪除照舊 |
| 學生端 | 不變，句子長一點 |

## 提案第一輪（2026-10-29）

- **第一步**：Generate new sentences 卡裡多一個開關；開了底下一行小字 *Each sentence uses two or more of the ticked teaching points · every point appears at least once*。句數那一行的「1–2 each」換成「two or more per sentence」，最少句數改成點數一半。
- **第二步**：教學點小卡的數字＝這個點出現在幾句（七個點加起來會超過總數，因為一句算給兩個點以上）；沒有每點 5 的上限。句子卡 Q 編號後面並列兩到三個教學點 chip。
- **第三步、第四步**：不動。
- mock：14 句 AI 配好的句子（`COMBO`，每句兩到三個點），照勾的點挑、先保證每個點至少一句再補到總數。

## 要討論的（已定，留紀錄）

- 這個方式放哪裡：第一步「句子從哪來」現在是兩張卡（Generate new ｜ Example sentences），是加第三張、還是在 Generate new 裡多一個開關
- 誰決定哪幾個點合在一句：老師自己圈，還是 AI 從勾的點裡配
- 句數怎麼算：總數 20、每點 5 的規則，一句算兩個點各一句還是算一句；教學點小卡的 −／+ 在這個模式下怎麼動
- 第二步的句子卡：一句掛兩個以上的 chip 怎麼擺；拖曳、剪刀、編輯照舊
- 學生端：不變（拼句畫布一樣），只是句子長一點

## 要問工程的

- **E1** 後端生句子的 prompt 現在是一個點一句；一次餵多個點生一句，是改 prompt 參數就好，還是新的 API？
- **E2** 練習資料裡每句只掛一個 `teachingPoint`？一句掛多個點，資料結構要不要改

## Change log

| 日期 | 改了什麼 | 說明 |
|---|---|---|
| 2026-11-10 | 定案、打包交接 | 使用者「可以打包這個 v 了」。`handoff/scramble-mix-points/`：`scramble-mix-points.html`（proposal.html 複本，標題、logo、狀態列換成交接包的）＋ `HANDOFF.md`（名詞對照、原型怎麼看、第一步開關與 AI 生句規則、第二步小卡照組排＋Add new、句子卡、學生端不動、跟 sentence-practices／teaching-points 兩包不同的三處、不用改的、驗收 13 條、問後端 1–4：建立怎麼帶、prompt、+／Add new 的 append、每點 5 不擋）。程式碼基準改記 bcdf3d33（產品已有 `teaching-point-steppers.js`、`resolveSentencePoints` 回多個點） |
| 2026-11-10 | 0 句單點的 + 不再浮「Mix X with」選單 | 打包前順手收：Add new 已經能一個點、也能合，0 句的單點按 + 直接生一句只有這個點，整個第二步不再有浮出來的選單 |
| 2026-11-10 | 第二步小卡固定一列四張 | 使用者「固定 4×n 排列」。開關打開時 TEACHING POINTS 小卡不再 auto-fill、組合卡不再佔兩格：每張等寬，一列四張往下排，Add new 卡（收起或展開）也是一格 |
| 2026-11-10 | Add new 卡就地展開、一個點也能加 | 使用者「可以單獨增加，然後不要額外多一塊」。點 **Add new** 不再浮一塊選單，而是這張虛線卡自己變成實線卡（佔兩格）：*Pick up to three points* ＋ 點 chip 勾選 ＋ Cancel／Add。勾一個點＝自己一句（給只出現在組合裡的點加單獨句用），勾兩三個＝一句合。新句接在同組句子後面，沒有同組就接最後 |
| 2026-11-10 | 第一步備注欄只留「sentences · up to 20」 | 使用者「改成 sentences · up to 20 就好」。*across 7 teaching points · 5 mixed · 2 on their own* 和沒勾點時的 *tick teaching points below* 都拿掉；數字低於下限時那句紅字（*at least N · every teaching point in at least one sentence*）照留 |
| 2026-11-10 | 句子卡的英文搬到拼音詞塊上面 | 使用者「卡片中的英文放在拼音上面」。Q 號＋教學點 chip → 英文 → 拼音詞塊；只動 B＋C 這份，v20 四種共用的句子卡沒改（要不要跟著改待定） |
| 2026-11-10 | 第二步小卡照組合排：合在一句的點同一張卡 ＋ New mix | 使用者「如果兩個 teaching point combine，這裡要組合在一起」。開關打開時，TEACHING POINTS 小卡不再一點一張，而是照句子裡實際的組合分：同一組點（起床＋早饭＋一……就）一張卡、chip 並列、卡佔兩格，數字＝這組有幾句，− 拿掉這組最後一句、+ 這組再生一句；自己一句的點各一張排在後面；勾了但一句都沒有的點留一張 0，+ 走原本的 *Mix X with* 選單。最後一張虛線 **Add new**（一度叫 New mix，使用者「改成 add new 就好」）：挑兩到三個點 → Add，新句接在最後。同一組點不分先後（上课＋图书馆＝图书馆＋上课）。B 的「每點小卡 + 先選配對」只剩 0 句那種情況用 |
| 2026-11-10 | 兩張來源卡的副標拿掉 | 使用者「副標應該都可以拿掉」。*AI writes new sentences for the teaching points you tick* 與 *14 available* 都拿掉，卡只剩標題（Generate new 卡開關照舊）。例句卡沒句子可挑而灰掉時才留一句原因（*No example sentences for the ticked points*／*Pick projects first*） |
| 2026-11-10 | Generate new 卡的文案改短 | 使用者「先討論文案」→「更短」。開關 *Combine teaching points in one sentence* → **Mix teaching points**；說明三件事併成一句 *Two or more per sentence · untick to keep a point on its own*；「every point appears at least once」不在卡裡講，只留在備注欄低於下限時那句。備注欄 *two or more per sentence · 2 on their own* 改講數字 **5 mixed · 2 on their own** |
| 2026-11-09 | 定先走 B＋C；提案 A 留著 | 使用者「現在決定先走 B＋C，但 A 也不要刪掉」。`proposal.html` 是接下來要改、要交接的那份；`proposal-a.html` 留在資料夾當備案，狀態列、spec、index 都標「備案」，不再跟著改 |
| 2026-11-05 | 教學點方框套第二版（兩份提案） | 跟 v20 同一套：開合列有框箭頭在右、全選框拿掉、例句清單搬進框裡 chip 當左欄、選進來的專案預設全勾。句數行開關關著時的 *1–2 each* 拿掉（B＋C 開關打開時仍寫 *two or more per sentence*）。規格在 `handoff/teaching-points/` |
| 2026-11-05 | 提案 A：句數行拿掉「N combined groups · N on their own」 | 使用者「不用」。開關打開時那一行只寫 *12 sentences · up to 20 · across 7 teaching points*；組數直接看底下的列。低於下限時的 *at least N · one per group* 照留 |
| 2026-11-05 | 提案 A：同一個教學點可以放進不只一組 | 使用者「grouping 的 teaching point 可以被複選」。Add point 不再把點從別組搬走：运动 可以同時在「运动＋一……就」和「运动＋睡觉」兩組，各自出句。已經在合併組裡的點不再自己一列；從最後一個合併組拿出來（×）才回到 On its own。兩組點一模一樣時只留一組。說明句多一句 *a point can be in more than one group*。第二步小卡的 + ＝這個點所在的組裡句子最少的那一組再生一句。**還不能**：同一個點又自己出句、又跟別人合（待問） |
| 2026-11-04 | 題卡骨架：Q 膠囊灰階、左邊 ∧ 把手 ∨ | 使用者「題卡的共同骨架都吃這個設定」（照 v17／v18）。句子卡與問答卡左邊一條直欄，上下鈕換一格、把手照舊拖曳；Q 膠囊從綠改灰。編輯中的卡不變 |
| 2026-11-03 | 教學點 chip 語法點掛 Grammar 標 | 使用者「要」（元件總表 §7.4 待定那條）。原本只有 v17 掛；現在 frame 裡型別是 GRAMMAR 的點（專案的、或 Custom 選 Grammar / Structure 加的）都掛紫色 Grammar，跟 Added 可以並存。Vocabulary 兩張待定 |
| 2026-11-03 | Custom teaching point 旁加型別下拉 | 使用者「所有的 add 應該都要有詞性」：Vocabulary 那顆型別下拉（八個型別、預設 Word / Vocabulary，照產品 CustomWordDialog）套到八張卡；v17／v20／v21 補上，加的點記 ptype。產品的 teaching-point-picker 沒有型別，交接時要提 |
| 2026-11-02 | From project 那列右邊的 N to add · M words 拿掉 | 使用者「拿掉」。那行是 v4 第二輪自己加的，產品沒有。摺疊列只剩箭頭＋Add teaching points from project。共用元件，v4／v6／v17／v20／v21 一起改 |
| 2026-11-02 | From project 池子裡已在清單的點改綠色 | 使用者「已經選取過的灰色改成綠色的」：原本 opacity .5 灰掉，改成跟勾選 chip 同一套綠框淡綠底、綠勾，仍不能點。共用元件，v4／v6／v17／v20／v21 一起改 |
| 2026-11-02 | 教學點 frame 底下兩行併一行 | 使用者「這裡改成一句就好」：ADD TEACHING POINTS 小標拿掉，From Project 摺疊列改寫 **Add teaching points from project**（右邊 N to add · M words、底下 Custom teaching point 輸入欄不變）。共用元件，v4／v6／v17／v20／v21 一起改；定案記在 `iterations/practice-components.html` §7 |
| 2026-10-29 | 提案 A 第三輪：預設組合拿掉、選點欄黏在那一列底下、拆組鈕拿掉、一組最多三個點 | 使用者自己試用後四條：「刪除預設讓我自己用看看」「下面那欄黏著按加的那題」「拆組鈕不用，都有 × 了」「一個 group 限制三個」。到三個時 Add point 換成小字 Up to 3 points、選單自動收起 |
| 2026-10-29 | 提案 A：一組可以只有一個點 | 使用者「A 方案可以保留選擇一個 teaching point 的選項嗎」。改成開關打開時每個勾的點各自一組（On its own＝自己出句，虛線框），老師把點加進別組就合（Add point 從別組搬過來）；合併的組可以拆（call_split）、單點可以拿出來。New group、On their own 那行、「needs two points」都拿掉。句數行寫「2 combined groups · 3 on their own」，最少句數＝組數 |
| 2026-10-29 | 提案 A 另開一份 | 使用者「再開一個提案 A」。`proposal-a.html`：開關打開後老師把勾的點圈成幾組（Group 1、2、3…，每組 Add point／×，New group；沒圈到的點自己一句），AI 照組生句；句數輪流分給每一組和每個單獨的點；第二步小卡的 + ＝那一組再生一句，沒有配對選單。跟 B＋C 並行，之後給使用者比 |
| 2026-10-29 | 第二輪：老師可以選結合什麼（B＋C） | 使用者「結合什麼 teaching point 可以讓老師選嗎」→ 三案（A 第一步圈組合／B 第二步小卡 + 選配對／C 第一步只選範圍）→ 定 B＋C。第一步：開關底下一列可合的點（`&single=运动,睡觉` 預設勾掉）、句數行多「2 on their own」、最少句數＝可合的一半＋單獨的；第二步：可合的點按 + 浮出「Combine 起床 with」配對選單。mock 沒有那一對時複製一句充數（內容對不上，正式由後端生） |
| 2026-10-29 | 提案第一輪 | 使用者「好」（同意四條建議）。從 v20 複製鎖 Scramble，加開關、COMBO mock、多 chip、小卡算法；狀態列多「1 結合多點」「2 結合多點」 |
| 2026-10-29 | 登記 | 使用者「開一個 v21 基於 v20 的 SENTENCE_SCRAMBLE 繼續優化；只優化 SENTENCE_SCRAMBLE；多一個新出題方式可以一次結合兩個或多個 teaching point 造成一個句子」。基準＝v20 scramble 分支；提案等形狀討論定了再畫 |
