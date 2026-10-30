# v21 — Sentence Scramble：一句結合多個教學點

- **功能名稱**：Sentence Scramble 的新出題方式——一句話同時用到兩個或多個教學點（2026-10-29 使用者開版）
- **網址**：https://dahua-dash-dev.web.app/dashboard/practice/create/?type=SENTENCE_SCRAMBLE（現行只會每個教學點各出各的句子）
- **截圖**：無（基準是 v20 的提案，不是現行產品）
- **日期**：2026-10-29（登記）
- **分岔自**：v20 `proposal.html?type=scramble`（四種 Sentence 練習合一份的 Scramble 分支）。**只動 Sentence Scramble**，Cloze／Response／Building 不碰
- **設計檔**：
  - 基準：`../v20-sentence-practices/proposal.html?type=scramble&step=1&sel=1&n=12`（不複製，直接連過去看）
  - `proposal-a.html`（**提案 A**，2026-10-29：老師在第一步自己圈組合。`&combo=1` 每點各自一組；`&groups=起床+早饭+一……就,上课+图书馆,运动+睡觉` 預設合併；`&gpick=1` 第二組正在加點）
  - `proposal.html`（**提案 B＋C**，第一輪 2026-10-29：從 v20 `proposal.html` 整份複製、鎖在 Scramble；`&combo=1` 開關打開，其餘參數同 v20：`?step=`、`&sel=1`、`&n=12`、`&ex=1`）
- **程式碼基準**：dahua-dash `origin/develop` @ `7528c30f`（同 v19／v20）
- **狀態**：**2026-10-29 兩案並行**：提案 B＋C（`proposal.html`）、提案 A（`proposal-a.html`，第一步圈組合）；未 commit、未部署。登記同日；形狀四條討論後定（下表），提案照它畫

## 使用者定的（2026-10-29）

| 題目 | 定案 |
|---|---|
| 範圍 | **只有 Sentence Scramble**。v20 其他三種不動 |
| 新東西 | **多一個出題方式**：一句話同時用到兩個或多個教學點（現在是一個點一句） |

## 形狀（2026-10-29 討論後定）

| 題目 | 定案 |
|---|---|
| 放哪裡 | 第一步「Generate new sentences」那張卡裡多一個開關 **Combine teaching points in one sentence**；不加第三張來源卡。選例句卡時開關不顯示（用不到） |
| 誰決定哪幾個點合在一句 | ~~AI 從勾的點裡自己配~~ → **2026-10-29 改成 B＋C**（使用者問「結合什麼 teaching point 可以讓老師選嗎」）。**C**：第一步開關底下列出勾的點、預設全勾，老師勾掉的點不參與結合、自己一句。**B**：第二步可合的點按 + 先問「Combine 起床 with」、點一個配對 chip 才生一句帶這兩個點；勾掉的點按 + 照舊生一句。AI 仍負責第一次的配法 |
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
| 2026-10-29 | 提案 A 第三輪：預設組合拿掉、選點欄黏在那一列底下、拆組鈕拿掉、一組最多三個點 | 使用者自己試用後四條：「刪除預設讓我自己用看看」「下面那欄黏著按加的那題」「拆組鈕不用，都有 × 了」「一個 group 限制三個」。到三個時 Add point 換成小字 Up to 3 points、選單自動收起 |
| 2026-10-29 | 提案 A：一組可以只有一個點 | 使用者「A 方案可以保留選擇一個 teaching point 的選項嗎」。改成開關打開時每個勾的點各自一組（On its own＝自己出句，虛線框），老師把點加進別組就合（Add point 從別組搬過來）；合併的組可以拆（call_split）、單點可以拿出來。New group、On their own 那行、「needs two points」都拿掉。句數行寫「2 combined groups · 3 on their own」，最少句數＝組數 |
| 2026-10-29 | 提案 A 另開一份 | 使用者「再開一個提案 A」。`proposal-a.html`：開關打開後老師把勾的點圈成幾組（Group 1、2、3…，每組 Add point／×，New group；沒圈到的點自己一句），AI 照組生句；句數輪流分給每一組和每個單獨的點；第二步小卡的 + ＝那一組再生一句，沒有配對選單。跟 B＋C 並行，之後給使用者比 |
| 2026-10-29 | 第二輪：老師可以選結合什麼（B＋C） | 使用者「結合什麼 teaching point 可以讓老師選嗎」→ 三案（A 第一步圈組合／B 第二步小卡 + 選配對／C 第一步只選範圍）→ 定 B＋C。第一步：開關底下一列可合的點（`&single=运动,睡觉` 預設勾掉）、句數行多「2 on their own」、最少句數＝可合的一半＋單獨的；第二步：可合的點按 + 浮出「Combine 起床 with」配對選單。mock 沒有那一對時複製一句充數（內容對不上，正式由後端生） |
| 2026-10-29 | 提案第一輪 | 使用者「好」（同意四條建議）。從 v20 複製鎖 Scramble，加開關、COMBO mock、多 chip、小卡算法；狀態列多「1 結合多點」「2 結合多點」 |
| 2026-10-29 | 登記 | 使用者「開一個 v21 基於 v20 的 SENTENCE_SCRAMBLE 繼續優化；只優化 SENTENCE_SCRAMBLE；多一個新出題方式可以一次結合兩個或多個 teaching point 造成一個句子」。基準＝v20 scramble 分支；提案等形狀討論定了再畫 |
