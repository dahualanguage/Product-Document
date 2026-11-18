# v22 — Content Mirroring：整篇朗讀（Whole passage）

- **功能名稱**：Content Mirroring 整篇朗讀——老師要練學生的流暢度，現行一句一句讀練不到長句與整篇的完整度；讓學生整篇讀，讀之前可以自己選要不要先聽整篇（2026-11-04 使用者開版）
- **網址**：https://dahua-dash-dev.web.app/dashboard/practice/create/?type=MIRRORING（現行只有一句一句）
- **截圖**：無（學生端照程式碼複刻）
- **日期**：2026-11-04（登記、討論）→ 2026-11-05（初版四張）
- **分岔自**：v3 Content Mirroring（建立流程）。v3 提案的工具列＋Student view 已在 #1072 上線，所以老師端基準重新複刻現在的產品，不沿用 v3 的 create-mirroring.html
- **設計檔**：
  - `spec.html`（2026-11-16 開，格式照 v10）：先只放待定「Max tries 用在整篇還合理嗎」（產品現況、問題、A／B／C、選 B 要定的三件事）；其他節之後補
  - `mock.js` 共用假資料（六句、逐詞拼音、每句秒數、評分結果）
  - `steps-content.js`（2026-11-16）老師端第一、二步 **Content → Edit Sentences**，基準與提案共用（Reading unit 第三步才選，這兩步提案跟現行一樣）。選專案 → Next → Splitting sentences... → 切／合／藏句子 → Next，第三步預覽吃改過的句子。`?step=1|2|3`；第一步 `&proj=1|2` `&dd=1`；第二步 `&gen=1` `&cut=N` `&hid=N`
  - `teacher-settings.html`（**老師端基準**，現行前三步複刻：Content、Edit Sentences、Settings；沒給 step＝第一步，舊參數 `?audio=1` `&list=1` `&gear=1` `&sent=N` 沒給 step 直接到 Settings）
  - `proposal-teacher.html`（**老師端提案**：前兩步同基準；第三步第一行多一格 Reading unit；`?step=3&unit=whole`、`?step=3&audio=1&unit=whole` 看變灰；舊連結沒給 step 直接到 Settings）
  - `student-practice.html`（**學生端基準**，現行一句一句；`?screen=start|practice|done`、`&state=playing|idle|recording|recorded|uploading|scoring|scored`、`&audio=1` `&panel=1` `&gear=1` `&sent=N`）
  - `proposal-student.html`（**學生端提案**：`?screen=start|listen|ready|record|recorded|scoring|result|done`、`&t=秒` 停在 Karaoke 的那一刻、`&listen=0` `&tr=1` `&py=0` `&gear=1` `&game=0`）
- **程式碼基準**：dahua-dash `origin/develop` @ `0e16a0c5`（2026-11-04 fetch）；第一、二步 @ `1c1870bb`（2026-11-16 fetch）。期間 Mirroring 從三步變四步，多了 Edit Sentences（#1081，10/23；切合對話行 #1150，11/13）
- **狀態**：**2026-11-16 學生端照使用者三條改：整句亮、每句一個分數＋平均、低分句可單練（未部署、未 commit）**。**2026-11-16 老師端補上第一、二步（Content、Edit Sentences），兩張老師頁可以從頭點到 Settings**（使用者「現在 demo 只有 Settings 頁，把前一步也補齊」；未部署、未 commit）。**2026-11-05 初版畫完、同日改成互動版**（兩張提案不靠網址參數也能一路點；學生端 TTS 唸、MediaRecorder 真錄、評分假等 4 秒；老師端每格可切、Play 會唸）；**2026-11-05 已部署** https://project-logeg.vercel.app/specs/chinese-modules/iterations/v22-mirroring-whole-passage/ ；未 commit

## 使用者定的

| 日期 | 題目 | 定案 |
|---|---|---|
| 11-04 | 放哪 | **方案 3**：Mirroring 的 Settings 多一格 Reading unit: Sentence｜Whole passage，跟 Practice mode 分開兩軸（不是第三個 mode、不是新型別） |
| 11-04 | 學生端長相 | **Karaoke**：整篇攤開，正在唸的位置跟著亮 |
| 11-04 | 錄的時候 | **提詞機**：高亮照參考速度自己往前走，學生跟著唸 |
| 11-04 | 評分 | 學生唸完才送 AI 評分，會等一段時間——要有等待狀態 |
| 11-04 | 聽整篇 | 學生自己選（開始卡），需求原文「在阅读前，学生可以选择是否听整片课文」 |
| 11-16 | 高亮 | **一次亮一整句**，不逐詞（產品沒有字級時間軸，做不到斷詞逐一亮）。聽和錄都一樣 |
| 11-16 | 結果的分數 | **一句一個分數，大分數＝各句平均**（完成卡寫 Average，不是一個整篇分數） |
| 11-16 | 整篇與單練 | **只能整篇一起唸**；結果頁錯誤較多的句子可以單獨練（聽 → 錄 → 送出 → 那句換新分數、平均重算） |
| 11-05 | Translation first × 整篇 | **保留**：開著＝先把整篇英文唸一遍，再播中文整篇；不是每句交替（三個選項：拿掉／先整篇英文／每句交替，使用者選第二個） |

## 查到的事實（有出處）

| 事實 | 出處 |
|---|---|
| 一句一個音檔、一句一個 idx；錄音上傳 `getUploadAudioSignedURL({ idx })` 後端照 idx 評分，前端輪詢 `scores[idx]`；Max tries 每句各算；完成卡成績＝逐句平均 | `build-assignment-practice.js`、`practice-content-list.js`、`mirroring-average.js` |
| 「聽整篇」現在沒有：`fullDialogueAudioRef` 只剩 pause，沒有人播；左欄喇叭只播單句 | `practice-content-list.js:235,711`、`content-window.js` |
| 字級時間軸只在評分結果裡（`ai_word_boundaries`），練習本身沒存參考音檔的字級時間 | `pronunciation-scoring.js`、`message-list.js` fetchBoundaries |
| 評分等待時產品會蓋一個配對小遊戲（Modal）＋ 琥珀色處理鈕 ＋ Did you know 提示 | `scoring-match-game.js`、`record-button.js` |
| ESL Reading Challenge 也是一句一句錄，沒有整篇先例；Catchup 英文 shadowing 的 SpeechSuper 回 `fluency`，中文 V2 引擎回 overall／words，有沒有 fluency 不知道 | `rc-mirroring.js`、`scoreCatchupShadowing.js` |

## 提案做了什麼（初版 2026-11-05）

**老師端（proposal-teacher.html）**
1. 第一行 Practice mode 旁邊多一格 **Reading unit: Sentence｜Whole passage**，同一組（兩個都是換練法，但 Reading unit 不換掉整個學生畫面，所以不併進 Practice mode）。
2. Audio only 時 Reading unit 變灰＋一句「Whole passage needs the text on screen」（R9）。**假設，待定。**
3. Translation first 照舊保留；Yes 時 Student view 的 Play 鈕照產品規則寫 `Play · English first · Normal · Xiaorou (Female)`（`&tfirst=1`）。
4. Max tries 的 ⓘ 單位改成 the passage（整篇算一次）。
5. Student view 換成學生真正看到的課文卡（＝學生提案的 ready 畫面），Sentence x of N 選單拿掉，底下計數 `6 sentences · read as one passage`。

**學生端（proposal-student.html）**
1. 開始卡多一列 **Listen first — Hear the whole passage before you read**（預設開；關掉直接進 ready）。副標 `Read the whole passage aloud`；MIN 用整篇秒數估（~1）。
2. **listen**：Translation first 開著時先一段 **Meaning**（藍色色票、整篇英文的 Karaoke、`&tfirst=1&phase=meaning`），再進中文。課文整篇攤在句卡的殼裡（藍色 Meaning 色票 ＝ 「在聽」），Karaoke：還沒到灰 #94A3B8、唸過墨 #0F172A、正在唸綠 #16A34A＋底線、正在唸的那句整句 #E8FFF0 底（左欄現行同一色）。底下一條播放列：暫停、進度、時間、Speed／Voice chip；`Skip to reading`。
3. **ready**：YOUR TURN ＋ 錄音鈕（產品 state C）＋ `Listen again`。
4. **record**：提詞機（同一套 Karaoke，照 Speed 往前走），錄音鈕變 stop ＋ 計時；高亮跑完改說 `tap stop when you are done`（學生比高亮慢是正常的）。
5. **recorded**：聽自己的 ＋ Retry／Submit（產品 state D）。
6. **scoring**：課文變淡、琥珀處理鈕、Did you know、多一句 `A whole passage takes longer than one sentence — about a minute.`；產品的配對小遊戲照蓋（`&game=0` 看底下）。
7. **result**：整篇逐詞三色（graded-sentence.js 的綠／琥珀／紅＋小圓點）、分數卡（x/5 星＋ Great!）＋ 圖例 ＋ `4 words need attention · 2 need practice`，動作列 My recording／Redo／End Practice。
8. **done**：完成卡 `Average` 改 `Score`（整篇只有一筆）。
9. 沒有左欄——課文本身就是主欄。Translation 開著時每句底下一行小字英文（`&tr=1`）。

## 待定（我的假設，要你定）

- Audio only × Whole passage 能不能同時？提案是不能（Reading unit 變灰）。
- 「Listen first」要不要也讓老師鎖（Shown／Hidden／Choice by student 那套）？提案只有學生端的開關。
- 提詞機的速度跟 Speed 綁在一起（學生選了 Slow 就慢慢走）——對嗎？
- 整篇多長還合理？對話類（有 speaker）要不要也能整篇？
- 結果頁要不要保留「點一個詞聽自己跟範例」（現行逐句結果有）？提案文案寫了，但沒畫互動。
- **Max tries 用在整篇還合理嗎**（2026-11-16 使用者提）：詳見 `spec.html` 第 3 節。建議 B：回到每句、用在單練。
- 單練的新分數**直接蓋掉**那句的舊分數（提案這樣畫）；還是留最高分、或兩個都記？老師端成績頁要看哪一個？
- 「錯誤較多」的門檻：提案用 **低於 4 分**（mock 是第 3、4 句）。要用分數、還是用紅字（Needs practice）的數量？
- 單練算不算一次 Attempt、受不受 Max tries 限制？提案沒算。
- （2026-11-16 補第二步時想到）Reading unit 在第三步才選，第二步切／合句子對整篇模式還有用嗎？有：提詞機的高亮一句一段、Translation 一句一行、評分逐句對齊都還靠句子邊界。所以第二步照留、不跟 Reading unit 連動。要不要在第二步就提示「整篇模式學生看不到句子的分界」——提案沒加，等你定。

## 要問工程（E）

- **E1** 整篇錄音怎麼評：後端新評分、還是一個特殊 idx 代表整篇？現行 `getUploadAudioSignedURL` 綁 idx。**11-16 起要的是「整篇一段錄音 → 每句一個分數」**：後端能不能把整篇錄音按句切開、各句照現行評？還是前端錄的時候按句的時間切檔？
- **E7**（11-16）單練一句時沿用現行的單句評分（綁 idx）就好，新分數寫回同一個 idx？
- **E2** 中文 V2 引擎有沒有 fluency 分數？沒有的話「流暢度」在結果頁拿什麼呈現（提案先只用現有的 overall ＋ 逐詞三色）。
- **E3** 長錄音上限：Catchup 有 `RECORDING_TOO_LARGE`，Mirroring 的上傳有沒有秒數或大小限制？整篇約 1 分鐘。
- **E4** 老師 review 頁與成績頁，整篇一筆要怎麼顯示（Original／Adjusted 那套、auto-pass 標）。
- **E5**（11-16 使用者定整句亮，這題不用問了）~~真 Karaoke 要字級時間軸：能不能在生音檔時把參考音檔的 word boundaries 存下來？沒有的話就是現在這個「一句一段、句內按字數線性」的近似（mock.js 的 dur）。~~
- **E6** 整篇評分要多久？提案寫「about a minute」是估的。

## Change log

<!-- 只記「設計改了什麼」——基準檔的複刻與修正、mock 自己的 bug，都是鷹架不是改動，不進表。 -->

| 端 | 改了什麼 | 說明 |
|---|---|---|
| 學生 | 聽與錄的高亮改成**整句一起亮**（正在唸的整句綠字＋#E8FFF0 底），拿掉逐詞的綠字底線 | 2026-11-16 使用者「只能整句一起亮起，沒辦法做到斷詞逐一亮起」。錄的提示改「Read the highlighted sentence — it moves on by itself」；老師端預覽同一句文案一起改 |
| 學生 | 結果頁**每句右邊一個分數**（≥4 綠、≥3 琥珀、其他紅），分數卡改 **Average**＝各句平均；完成卡 Score 改回 Average | 2026-11-16 使用者「結果頁是提供一句一句的分數，再平均」。mock 用 `SENTENCE_SCORES`（平均 3.9） |
| 學生 | 結果頁改 **方案 B**：先看六句精簡清單（編號・分數・一行句子・低分句 Practice・展開箭頭），點一列才展開拼音與逐詞三色（一次開一列、展開自動捲進來）；平均卡壓成一條（AVERAGE 3.9/5 ★ Great! ＋ 圖例與統計） | 2026-11-16 使用者「這一頁的 UI 可以再優化，先討論」→ 給 A（結論上移、清單變輕）／B（總覽、點開才看細節）／C（要練的排前面）→ 使用者「B」。目的是六句一眼看完、要練的不會在折線下。按鈕改名（Practice／Redo／End Practice 容易混）提了、還沒定，沒動。`&open=N` |
| 學生 | 結果頁低於 4 分的句子淡紅底、旁邊 **Practice**；點了進單練畫面（Back to result、上次的三色、Listen to the reader、錄 → Retry／Submit → 舊分數 → 新分數、Try again／Back to result），回結果頁那句變綠底＋↑、平均重算 | 2026-11-16 使用者「只能整段課文一起念，但結果頁錯誤較多的可以單獨練習」。單練時整篇的錄音先收著，回來 My recording 還是整篇。假評分每次 +1；`&screen=drill&s=4`、`&d=scored` |
| 老師 | Settings 多一格 Reading unit | 2026-11-05 初版，見上「提案做了什麼」 |
| 學生 | 整篇朗讀流程八個畫面 | 2026-11-05 初版，見上 |
| 兩端 | 提案改成互動版 | 2026-11-05 使用者「做成可以互動的版本」。學生端：開始卡開關、Start、暫停／跳過、錄音鈕 3 2 1、停、Retry／Submit、Redo／End、Practice Again 都是真的；聲音用瀏覽器 speechSynthesis（產品的英文翻譯本來就這樣唸；中文這裡也用它代替參考音檔，`&tts=0` 關）；錄音用 MediaRecorder，My recording 放自己的聲音；評分是假的（4 秒）；配對小遊戲可以翻。老師端：工具列每格可切、Student view 跟著變、Play 用 TTS 唸（Yes 先英文；整篇一句一句亮）、Sentence x of N 可選、齒輪是學生側的開關。網址參數留著當截圖深連結，`&dev=1` 顯示狀態列。 |
| 兩端 | Translation first 在整篇模式保留：先整篇英文、再整篇中文 | 2026-11-05 使用者定。我第一版把它換成一句「Translation first is off — the passage plays as one piece」拿掉，使用者問那句是什麼意思，講了三條路（拿掉／先整篇英文／每句交替），選先整篇英文。老師端那格放回去；學生端聽整篇多一個 Meaning 段，開始卡與齒輪多一列 Translation First。 |

### 鷹架（不進 change log）

- 學生端殼（側欄＋頁首）照 v8 基準複刻，待實機對。
- 學生基準第一版的開發狀態列蓋到動作列、左欄 Pinyin 開關跟收合鈕疊到——都修了。
- 學生提案第一版唸過的句子用 class `done`，撞到完成卡的 `.done`（白底 440px 陰影），畫面多一塊白色殘影——我一度以為是 scrollIntoView 捲歪了，截圖證明不是；改名 `past`。
- Karaoke 的「正在唸」一度落在標點上——跳過標點。
- 互動版第一輪：播放用的高亮函式在每次重畫都跑，把「輪到你」的靜態課文也染成第一句綠、其餘灰——限制只在聽／錄兩個畫面動。
