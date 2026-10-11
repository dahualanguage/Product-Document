# v1 — Practice 練習層級優化

- **功能名稱**：Practice 練習層級優化
- **網址**：https://dahua-dash-dev.web.app/dashboard/practice/
- **截圖**：Choose Practice Type 對話框（六張卡：Mirroring / Vocabulary / Sentence Patterns / Sentence Scramble / Multiple Choice / QA）
- **日期**：2026-08-19
- **小 spec**：`spec.html`（現況的兩層練習結構 + 查到的問題）
- **設計檔**：`choose-practice-type-color.html`（定案）、`locked-state.html`（素材未建立時的鎖定狀態，`?s=nobank|nocontent`）；走過的探索稿收在 `_explorations/`，spec 不再引用
- **範圍**：只動 Choose Practice Type 這一頁
- **實作說明**：`IMPLEMENTATION.md`（名稱對照、字串盤點、阻擋點）
- **狀態**：設計定案（2026-08-27 收斂成單一設計，spec 只留最終稿）

## Change log

<!-- 開始改之後，改一項補一行 -->

| 端 | 改了什麼 | 說明 |
|---|---|---|
| 老師 | 第二層攤平成八張同層卡片 | Vocabulary 和 Sentence Patterns 原本各有兩個子項目，藏在建立流程的第 2 步。現在全部升到選擇畫面，六張變八張，選一次就決定完。建立流程的 `Practice Type` 那一步因此變成多餘。 |
| 老師 | 八個名稱全部重新定義成「素材 + 練法」 | 攤平後剛好是四種素材（課文／生詞／教學點／題庫）各兩個練法。名稱一律 `素材 + 練法`：Sentence Mirroring／Sentence Scramble／Vocabulary Mirroring／Vocabulary Quiz／Pattern Response／Pattern Building／Question Bank Quiz／Question Bank QA。兩個 Mirroring、兩個 Quiz 同名是刻意的——它們本來就是同一個練法，差別只在素材。 |
| 老師 | 題庫依賴寫進名字 | `Multiple Choice` → `Question Bank Quiz`，`QA Practice` → `Question Bank QA`。原本要點下去才知道這兩個需要題庫。 |
| 老師 | 版面改成 4 欄 × 2 列，依素材直向成對 | 沒有分組框線（維持扁平），靠欄位對齊表達同源關係。對話框寬度從 920 放寬到 1040。 |
| 老師 | 顏色與 icon 先貼齊 live | 六個顏色原封不動沿用線上；拆出來的四張用母卡顏色（Vocabulary 琥珀、Sentence Patterns 藍綠），icon 用子項目在第二層畫面上已有的那一個。這一版不動視覺，只動結構與名稱。 |
| 老師 | 卡片本體逐項對齊 `PracticeTypeCard` | 圓角 24px、內距 24px、icon 56px＋內圈細邊、標題 h6 1.125rem、間距 12px；hover 只換陰影（shadows[8]）與綠色框線、沒有位移。NEW 改成 GlowingChip 的真實樣子：error #FF5630 藥丸、24px 高、字重 800，帶琥珀色脈動動畫。對話框放寬到 1080px 容納四欄。 |
| 老師 | 提案 B：同源標題 | 在 A 之上，每一欄上方加一個共用標題，講明這一欄兩張考的是同一批素材：Sentence／Vocabulary／Teaching Points／Question Bank。沒有群組框線，只是欄位上方多一行小字。卡片名稱維持完整不縮短。標題與卡片排在同一個 grid（三列），跨欄元素才對得齊。 |
| 老師 | 提案 C：學生畫面示意圖 | 把 icon 圓換成學生實際畫面的縮圖，沿用 teacher-planning.html 的 THUMB 語彙（136×56、綠色標示學生會動到的部分）。六張直接對應既有的圖，Pattern Response／Pattern Building 照同一套語彙補畫。代價是放棄 live 的六個顏色。 |
| 老師 | 素材未建立時把卡片鎖起來 | 缺 Question Bank 時 Question Bank Quiz／QA 直接鎖住，卡上寫明「Needs Question Bank」並給出「Create Question Bank →」動線，頂部再用一句 Alert 交代整體。現況只有「專案沒內容」會事先擋下，沒題庫要點下去才知道。教學點不列入——它在建立 Project 時就決定好了，「有 Project 但沒教學點」不會發生。不沿用 live 的 opacity .5 + pointerEvents none——那會把解鎖動線一起壓灰且點不了。全部鎖定時卡上動線收起，只留頂部一個入口。 |
| 老師 | 設計稿嵌進 spec | spec §4 直接內嵌設計稿預覽，提案時結構、命名、畫面在同一頁講完。 |
| 老師 | 版面定案：B＋C 疊加 | 欄位標題（B）與學生畫面示意圖（C）同時採用，新增 `choose-practice-type-bc.html`。A／B／C 三張退為探索稿，spec 移到 §4.5 並註明用的是舊命名。 |
| 老師 | 欄位改成「練什麼」，不再是「素材從哪來」 | 四欄從 `Sentence／Vocabulary／Teaching Points／Question Bank` 改成 `Content／Vocabulary／Sentence／Comprehension`——前三欄是語言單位由大到小，第四欄是理解。 |
| 老師 | 八個名稱再改一版 | `Sentence Mirroring`→`Content Mirroring`、`Pattern Response`→`Sentence Response`、`Pattern Building`→`Sentence Building`、`Question Bank Quiz`→`Comprehension Quiz`、`Question Bank QA`→`Open-ended Questions`；Vocabulary 兩張與 `Sentence Scramble` 不變。 |
| 老師 | Sentence Scramble 換欄 | 素材是課文句子，但學生做的事是「處理一個句子」，跟兩張教學點練習同類，所以歸到 Sentence 欄。四欄因此不再等高：1 / 2 / 3 / 2，Content 欄底下空兩格。 |
| 老師 | 題庫依賴從名字退回鎖定狀態 | `Comprehension Quiz`／`Open-ended Questions` 的名字不再提題庫，所以 §3.2 完全靠 §5 的鎖卡解決——鎖定狀態從加分項變成命名成立的前提。 |
| 老師 | 鎖定狀態同步成同一套 | `locked-state.html` 換成新命名＋欄位標題＋示意圖；卡片轉灰的做法從「icon 圓變灰」改成示意圖 `grayscale(1)`＋`opacity .5`，綠色（學生會動到的部分）跟著消失。 |
| 老師 | 顏色以「四條軌道」的形式加回來 | 新增 `choose-practice-type-color.html`。規則是把 `THUMB` 語彙裡「綠色＝學生會動到的部分」升一級成「有顏色＝學生會動到的部分，色相＝哪一欄」——顏色接管既有的語意欄位，不是新的裝飾。色票沿用提案 A（＝ live）：Content 綠、Vocabulary 黃、Sentence 粉、Comprehension 紫——每一欄直接繼承欄內某一張卡原本就有的顏色，被放掉的兩個（Patterns 的 #00897B、QA 的 info 藍）正好是換了欄的那兩張。顏色只進示意圖不進卡片本體，欄位標題底下多一條該欄顏色的軌道線。標題文字另用壓深版（粉彩當 12px 文字讀不動）。已知衝突：`error` 紅的 NEW 徽章會撞 Sentence 欄的粉。 |
| 老師 | 鎖定狀態套上四軌顏色 | `locked-state.html` 與定案同一套色。鎖住時示意圖 `grayscale(1)` + `opacity .45`——該欄的顏色（＝學生會動到的部分）跟著消失；欄位標題那條軌道線維持原色（被鎖的是卡片不是欄位）；卡上唯一還有顏色的是解鎖動線，用該欄的 `label` 色。 |
| 文件 | spec 收斂成只留最終設計 | 刪掉 §4.6 的 A／B／C 探索段與重複的預覽，§4.3 不再說「顏色退場」，四支探索稿移到 `_explorations/`（附 README 說明它們是舊命名），`iterations/index.html` 的頁面清單跟著改成兩支。 |
| 老師 | `Open end Question` → `Open-ended Questions` | 原本照表格寫的 `Open end Question` 文法不對，定稿改成 `Open-ended Questions`。八個名稱裡唯一的複數——它是一組開放題，不像其他七個是一種練法。 |
| 文件 | 補上 IMPLEMENTATION.md | 給工程的實作說明：名稱對照、三條規則（enum 不能動）、`practiceType` 對不到八個名稱的阻擋點、實掃的字串盤點（39 要改／30 不能改／132 個 enum）、本機 checkout 比 develop 舊的落差。 |
| 文件 | §6 六條待決事項全部收掉 | Mixed Mode 清掉（連資料層）／對話框高度交給實作／NEW 徽章定為「現有的全部留著，等下一個新練習上線時一起拿掉」並把散在 §3.4／§4.4／§4.5 的重複討論收成一處／Sentence Patterns 可見性「先放著＝不動，不是待辦」／Content 欄空白與排序判定不是問題，直接從清單刪除。§6 從清單改成處置表，標題改成「待決事項處置」，§3.5 與 §4.5 就地標註已決定。 |
