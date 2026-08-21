# v1 — Practice 練習層級優化

- **功能名稱**：Practice 練習層級優化
- **網址**：https://dahua-dash-dev.web.app/dashboard/practice/
- **截圖**：Choose Practice Type 對話框（六張卡：Mirroring / Vocabulary / Sentence Patterns / Sentence Scramble / Multiple Choice / QA）
- **日期**：2026-08-19
- **小 spec**：`spec.html`（現況的兩層練習結構 + 查到的問題）
- **設計檔**：`choose-practice-type-a.html`（A 攤平）、`choose-practice-type-b.html`（B ＋同源標題）、`choose-practice-type-c.html`（C ＋示意圖）、`locked-state.html`（素材未建立時的鎖定狀態，`?s=nobank|nocontent`）
- **範圍**：只動 Choose Practice Type 這一頁
- **狀態**：設計中（第二層攤平 + 全面改名已落稿）

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