# v5 — 優化 Word Game V2：關卡格三件組

- **功能名稱**：Word Game V2 學生端 · 關卡格的三件組（Level 標頭卡／Unit 標頭／關卡節點）
- **網址**：https://dahua-dash-dev.web.app/student/word-game-v2/ （世界地圖 → 點一個世界 → 關卡格）
- **截圖**：使用者提供 2026-09-15（Level 1 · 16/155 · 6 頁；每十關第 3/6/9 是測驗、第 10 是 Boss）
- **分岔自**：v4（版本線上接續；設計檔不沿用 v4，這是學生端的遊戲畫面，跟練習建立流程沒有連結相通）
- **日期**：2026-09-15（登記＋第一輪提案同日）
- **設計檔**：`word-game.html`（基準檔，現行三個畫面的複刻：`?screen=map` 世界地圖、`?screen=stages` 關卡格、`&dlg=1` Continue 覆蓋層、`&sound=1` 音量面板）、`proposal.html`（**提案**，三件組；頁面下半是 Unit 三態＋節點十態的狀態表）
- **假資料**：`mock.js`，兩邊共用
- **範圍**：原本問到的是整頁 UI（世界地圖＋關卡格＋HUD），使用者收斂成「**主要是要改小關卡的元件**」。所以提案只換 `level-screen-a.js` 裡 outer ring + inner coin 那一顆；標頭卡、格子卡、分頁、HUD、吉祥物全部照現行不動
- **判準**：`~/Projects/Product-Document-main/.claude/skills/word-game-design/`（tokens.css / components.css）
- **程式碼基準**：dahua-dash `origin/develop` @ `599dd4cb`（2026-09-15 fetch）。WG2 的程式碼只在 origin/develop 上，兩份本地 checkout 都沒有
- **圖片**：從 origin/develop 的 `public/assets/game/v2/` 匯到 `specs/chinese-modules/assets/game/v2/`（底圖兩張、七座建築、logo、吉祥物 1/2/6），沙盒用 `../../assets/` 路徑
- **狀態**：**提案第九輪，已部署（2026-09-15）、未定稿**。第二輪（2026-09-15）使用者給了 Unit 元件的截圖（藍色膠囊、吉祥物、「Unit 12 · 购物与消费 / Shopping & Spending」），說之後會加進來、要三個元件一體——所以提案擴成 Level 標頭卡＋Unit 標頭＋關卡節點三件組，格子卡也跟著改成 20px panel。Unit 的大小**不固定**（使用者第四輪給的統計：HSK 2–4 平均 20–25 關、最少 4–6、最多 43），產品資料裡還沒有 Unit

## 登記時對整頁掃到的偏差（這一版只做第 3 項，其餘留著）

1. 世界地圖：Level 標籤黑底半透明、目前世界金色圈與橘黃漸層標籤、左上 Level 資訊是黑玻璃，不是白色霜面 panel
2. 右上 HUD：Stars 徽章框線 `#FDE68A`、音量鈕框線 `#E5E7EB`（Tailwind 色）；音樂滑桿紫、音效橘；**Stars 的數字用 `variant="h6"` 沒指定遊戲字體，走 Public Sans**
3. **關卡節點：目前藍 `#1CB0F6`、完成綠 `#6BAF6E`、測驗黃 `#FFC107`、鎖住灰 `#D5D5D5`、Boss 紅 `#EA2B2B` 全部不在色票內；數字 Nunito；沒有 toy-press；測驗多一個 📜 角標**
4. 標頭卡、格子卡圓角 32px（`borderRadius:4` × theme 8），不在 20/16/14/8 的階裡
5. 課程卡「Word」標籤用紫（核心內容不該紫）；播放鈕全部 info 藍；MUI Dialog 圓角 32、outlined 鈕圓角 25
6. 結算：Mission Complete 面板圓角 24；Level Complete 的 Continue 是金色主按鈕；Reward popup 圓角 28
7. 分級測驗的木桌色 `#F5E6D3` 不在色票內；音量鈕整段複製了 layout 的程式碼
8. 真 bug：`playtime-clock.js` 把 `GAME_FONT` 整個物件當 `fontFamily`，字型會 fallback

## 基準檔怎麼看

| 網址 | 看到什麼 |
|---|---|
| `word-game.html` | 世界地圖（Level 1 目前、0 已開、2–6 鎖住） |
| `word-game.html?screen=map&hover=3` | 世界 3 的 hover 光暈 |
| `word-game.html?screen=stages` | 關卡格第一頁（現行節點） |
| `word-game.html?screen=stages&page=2&dlg=1` | 第二頁＋ Continue / Start over 覆蓋層 |
| `word-game.html?sound=1` | 音量面板 |

## 提案怎麼看

| 網址 | 看到什麼 |
|---|---|
| `proposal.html` | 關卡格第一頁（提案節點），往下捲是十種狀態對照表 |
| `proposal.html?page=2` | 第二頁（全部鎖住） |
| `proposal.html?units=0` | 不畫 Unit，只看節點（第一輪的樣子） |
| `proposal.html?sheet=1` | 只看狀態表（Unit 三態＋節點十態） |

## Change log

| 端 | 改了什麼 | 說明 |
|---|---|---|
| 學生 | 第二輪：三件組一體——Level 標頭卡、Unit 標頭、關卡節點用同一種「硬幣」 | 同一組漸層（進行中綠、過關金、Boss 紫）、同一個 toy-press（只給填色的）、Fredoka 標題＋Nunito 副標、中文照 .zh（400、ink-soft）、圓角 20/16/14/8。Unit 標頭是拉寬的硬幣：左邊 40px 吉祥物磁磚、「Unit N · 中文」、英文副標、右邊一顆狀態（進行中＝6 / 10、完成＝★ 星星數、鎖住＝鎖）；底下淺色軌道裝十顆節點，Boss 在最右邊。三態：進行中綠填色白字、完成淡綠底綠字、鎖住白底淡框灰字。 |
| 學生 | 第九輪：空白處用豆花填 | 一頁沒裝滿、剩 ≥100px 時，豆花站進卡裡右下角講一句跟這一頁有關的話：有進行中的 unit →「Keep going! N stages left in Unit X.」；整頁鎖住 →「Clear Unit X-1 first and these will open up.」；整頁完成 →「All cleared here! Next unit is on the next page.」。高度隨剩餘空間縮放（最大 230px）；出現時右下角那隻大豆花收起來，畫面上只有一隻。 |
| 文件 | 第八輪：分頁規則寫進提案頁底下 | 使用者問「設定幾關會單獨一頁」——答案是沒有關卡數門檻、是用高度算的。把規則與三種視窗高的換算表放在狀態表上面（`?sheet=1` 看得到），並註明若要固定規則可改成用關卡數算。 |
| 學生 | 第七輪：一頁裝幾個 unit 用實際量到的高度算 | 第六輪把 unit 區寫死 590px，使用者的視窗比較矮，分頁被裁掉看不到（「現在直接卡住了」）。改成格子卡吃掉標頭卡以下的全部高度，畫完殼先量 `.units` 的 clientHeight 再用 `buildPages(高度)` 決定一頁裝幾個 unit，視窗改變就重算並盡量停在同一個 unit。視窗矮到連最高的 unit 都裝不下時整頁允許捲，不裁掉分頁。代價：矮視窗一頁裝得少（720px 高只裝得下第一個 6 關的 unit），頁數會變多。 |
| 學生 | 第六輪：也不捲 | 使用者說「也不要 scroll」。unit 區固定 590px、overflow hidden；一頁裝多少 unit 改成用高度算（標頭 68 ＋ 每列 71，unit 間 10），unit 不切頁、裝不下就整個換頁。假資料的七個 unit 變四頁：1+2、3+4、5+6、7。43 關的 unit（5 列＝423px）自己一頁還裝得下一個 6 關的。 |
| 學生 | 第五輪：格子卡高度固定 | 使用者說「固定容器高度，不要換一頁就忽大忽小」。格子卡吃掉標頭卡以下的全部高度，unit 在卡裡面捲、分頁釘在卡底。順手把換頁的門檻從 30 關提到 60 關（900px 高的視窗大約裝得下兩個 30 關的 unit），頁數 6 → 3，每頁比較滿。 |
| 學生 | 第四輪：Unit 不是固定十關 | 使用者給了統計（HSK 2–4：一個 unit 平均 20–25 關、離合詞最少 4–6、近義詞辨析最多 43）。Unit 區塊改成裝好幾列（每列 10、最後一列不補滿、Boss 是最後一顆），標頭副標加上「· N stages」；分頁改成對齊 unit（一頁裝整個 unit、累計到 30 關換頁（第五輪改 60）、超過的 unit 自己一頁），不再把一個 unit 切到兩頁。假資料改成 6 / 22 / 25 / 18 / 30 / 24 / 30 七個 unit。 |
| 學生 | 第三輪：格子卡不再是純白 | 使用者說「最下面的容器不要只是白色的」。改成淡綠水洗（`--shell` 那一階的 165° 漸層，.92 透明＋ blur 10），風景透一點進來；Unit 軌道改成白的才浮得起來，分頁 chip 的框線跟著換成 `#CFE3D6`。 |
| 學生 | 第二輪：Level 標頭卡與格子卡改成 20px panel | 返回鈕改成淡綠磁磚、標題「Level 1 · 石橋」、右邊數字 Fredoka「16 / 155 stages」；格子卡拿掉斜紋與列間的裝飾 emoji（Unit 標頭取代它們當分隔）；分頁改成同一套 chip（目前頁綠填色）。 |
| 學生 | 關卡節點的顏色全部收回色票 | 完成的教學關 = 綠漸層（進度）；過關的測驗／Boss = 金漸層（星星、獎勵）；目前 = 白底綠字＋綠色 3px 環＋心跳，不再用藍；還沒打倒的 Boss = 紫（挑戰）；鎖住 = `#EEF3F0` 淡框，不填色。 |
| 學生 | 每顆填色的 coin 帶 toy-press，數字改 Fredoka 600 | 跟 skill 的按鈕／tile 一致；hover 上浮 3px。 |
| 學生 | 外圈保留「星星環」，換成金色 | bestScore ÷ 5 的 conic 語意不變（不看有沒有過關），只把色從 `#C89200`／`#D0D0D0` 換成 `--gold-d`／`--line`。 |
| 學生 | 測驗節點右下角的 📜 拿掉 | 星星本身已經是測驗的記號，Boss 也沒有這個角標。 |
