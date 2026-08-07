# Teacher Dashboard — Engineer Handoff

Chinese-module **CLASS_TEACHER** 教師端設計交接。這裡的檔案是 **高擬真互動原型（reference mockup）**，工程師以 **Next.js 14 / React 18 / MUI v5 / Apollo** 在正式 app（`dahua-dash`）重寫 —— 不是直接搬 HTML。原型是「設計的唯一真相來源」，行為、狀態、配色以原型為準。

---

## 本次打包範圍

| 畫面 | 檔案 | 內容 |
|------|------|------|
| **Dashboard** | `teacher-redesign.html` | 側邊欄、頂部搜尋、Active Assignments、To Review 面板 + 批閱抽屜 + 練習細節 popup |
| **Students** | `teacher-students.html` | 學生名冊（master-detail）、Word Game Level、Assignment Status、Assignment History + 練習細節 popup |

目前設計版本：**Redesign v8**（2026-08-06）—— 在 v3 的基礎上加上**響應式（RWD）**，見下方章節。

---

## 目錄結構

```
handoff/teacher-dashboard/
├── index.html                       ← 入口（連到兩個原型）
├── HANDOFF.md                       ← 本文件
├── teacher-redesign.html            ← Dashboard 原型（自包含，inline CSS/JS）
└── teacher-students.html            ← Students 原型（自包含）
```

技術：每個 HTML 皆 **自包含**，CSS 寫在 `<style>`、JS 是單一 IIFE `(function(){…})()`，**純 vanilla JS、無外部 library**。假資料寫在 JS 頂部的常數，替換成 GraphQL 即可。

---

## 外部依賴

| 資源 | CDN |
|------|-----|
| Plus Jakarta Sans 字型 | `fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800` |
| Material Icons Round | `fonts.googleapis.com/icon?family=Material+Icons+Round` |

正式 app 請改用專案既有的 MUI 字型設定與 icon 方案（Material Icons 名稱可直接沿用）。

---

## 色彩 Token 速查

### 基礎
| Hex | Token | 用途 |
|-----|-------|------|
| `#059669` | emerald | Primary — 主按鈕、active、進度 |
| `#047857` / `#065f46` | emerald-d / dd | Primary 深色（hover / 文字）|
| `#ecfdf5` / `#d1fae5` | emerald-l / l2 | Primary 底色（chip、active bg）|
| `#0f172a` | ink | 主標題文字 |
| `#334155` / `#475569` | slate / slate-2 | 次要文字 |
| `#64748b` / `#94a3b8` | muted / faint | 弱化文字、placeholder |
| `#e6ebf1` / `#eef2f7` | line / line-2 | 邊框、分隔線 |
| `#f4f7fb` | bg | 頁面底 |
| `#d97706` / `#e11d48` | amber / rose | 到期提醒 / 逾期・危險 |

### 練習類型色系（**跨學生端／教師端共用，務必一致**）
| 類型 | key | 文字色 | 底色 |
|------|-----|--------|------|
| Q&A | `qa` | `#2563EB` | `#e8f0ff` |
| Mirroring | `mirror` | `#EA7A21` | `#fdeede` |
| Vocabulary | `vocab` | `#0B7A3B` | `#e6f7ec` |
| **Follow the Pattern**（原 Multiple Choice）| `mc` | `#7C3AED` | `#f1e9ff` |

> 型別 key 仍是 `mc`（沿用），只是顯示名稱改為 **Follow the Pattern**；其練習內容尚未定案（目前 popup 仍沿用選擇題批閱視圖，之後會另行補上）。

---

## 頁面與元件對照

### Dashboard (`teacher-redesign.html`)

| 區塊 | 說明 / 狀態 |
|------|------|
| **側邊欄** | 對齊正式 app 的 CLASS_TEACHER 選單（Content: Projects / Question Banks・Practice: Practice List / Word Game・Overview: Program / Classes / **Leaderboard** / Students）＋最上方新增 Dashboard，最下方為紅色 **Report Issue** 連結（不是使用者卡片）。**結構固定，只在 Overview 末端追加；Dashboard / Students / Word Game 三頁必須完全一致，只有 active 項不同。** |
| **頂部搜尋** | 全域關鍵字搜尋 + 外部綠色 Search 鈕；輸入時比對 name + `kw` 標籤，跳出 Project / Question Bank / Practice / Student / Class 的分組建議。頂列最右側為 36px 圓形教師頭像（三頁一致，≤700px 隱藏以保留搜尋列寬度）。 |
| **Active Assignments** | 以「作業」為主體：一個作業可指派多班，各班有各自 due。依到期分區（Overdue / Today / Tomorrow / Later），每列可展開到「未繳交學生名單」。**四個分區的標題列本身可收合**（見下方互動規則）。標題旁 ⓘ 標示資料範圍。只追蹤 **Mandatory**（Optional 不追蹤）。 |
| **To Review 面板** | 兩個 tab **To Review / Reviewed**（各自計數）＋底下 practice-type 下拉；列可點開批閱抽屜。 |
| **批閱抽屜（drawer）** | 逐題可折疊（語音：中/拼音/英 + 錄音 + 1–5 分；選擇題：選項對錯）；**AI 分數（唯讀）/ 老師分數（可改）** 兩欄；Quick review 單選（填入評語框）。 |
| **練習細節 popup** | 由抽屜「View practice detail」開啟；依類型渲染（語音＝逐字發音評分；`mc`＝逐題批閱）。 |
| **Reminder / Skip popup** | 未繳交名單可寄提醒信（可編輯訊息）；逾期可 Skip（紅色確認）。 |

### Students (`teacher-students.html`)

| 區塊 | 說明 |
|------|------|
| **名冊** | 搜尋 + class / HSK 篩選；`?s=<name>` 可直接選取（dashboard 未繳名字深連結到此）。 |
| **Word Game Level** | 四格：Level / Stage / Stars / Hearts（各主題色 + icon）。**Level Progress 進度條已於 2026-08-07 移除** —— Stage 卡本身就是 `N/54`，進度條屬重複資訊。 |
| **Assignment Status** | **只列未繳交**：期限內 → Remind；逾期 → Skip + Remind（popup 同 dashboard）。 |
| **Assignment History** | 欄位 Assignment / Type / Date / Score / **Detail**（開練習細節 popup）；欄序與 Assignment Status 對齊。 |

---

## 關鍵互動規則（重要，rebuild 時務必保留）

- **批閱不自動跳下一位**：按 **Send review** 後，該筆標記為 **Reviewed**（綠色封章 + 清單 Reviewed 標，移到 Reviewed tab），抽屜停留原地；送出鈕變**灰色 disabled**，只有在**老師分數或評語有變更**時才重新啟用為 **Update review**。換人用 Previous / Next。
- **老師分數 save 提示**：老師改動分數時亮起「edited」提示，隨 Send review 一起送出。
- **To Review 過濾**：`view`（toreview / reviewed）× `ptype`（all / qa / mirror / vocab / mc）兩層過濾；tab 計數隨下拉更新。
- **Active Assignments**：3 層下鑽（作業 → 各班 → 未繳學生名單，深連結到 Students 頁）；進度以「未繳交數字」＋急迫度顏色呈現，非進度條。
- **分區收合**：Overdue / Today / Tomorrow / Later 四個分區標題整條可點收合，亦支援鍵盤（`role="button"` + `tabindex="0"` + Enter / Space + `aria-expanded`）。**收合狀態必須跨重繪保留** —— 原型用一個 module 層級的 `COLLAPSED` Set 記住被收合的分區 key，Skip 之後整份列表重繪也不會自己彈開。收合鈕是 28px 帶框按鈕、依分區上色（Overdue / Today 玫瑰、Tomorrow 琥珀、Later 灰），**刻意比列內下鑽用的裸箭頭重**，用來區分「外層分區」與「列內展開」兩個層級。
- **資料範圍提示**：Active Assignments 標題旁的 ⓘ 是 hover / focus 顯示的 tooltip（純 CSS：`data-tip` 屬性 + `::after`，`cursor:help`，不是可點的動作），文案 **「Only assignments from the last 6 months are shown.」**。這是設計上宣告的資料範圍 —— **後端查詢請套用同一個時間窗**。
- **練習細節 popup 依類型分流**：語音類（qa / mirror / vocab）= 逐字拼音 + ✓/!/✕ + 星等 + Play Audio + Score breakdown；`mc` = 逐題（Q 徽章、對錯、學生答案 vs 正解、X / Y correct 摘要）。
- **邊界**：已批改不可再送（除非再修改）、逾期日期標紅、Assignment Status 全繳完顯示空狀態、Skip 後該筆自名單移除。

---

## Demo 假資料 → API 替換指引

原型的假資料都在各 HTML 的 `<script>` 頂部常數：

| 變數（檔案）| 結構 | 替換為 |
|------|------|--------|
| `ASSIGNMENTS[]`（dashboard）| `{ t, type, classes:[{cls, due, duec, done, total, skipped? }] }` | 作業列表 query（作業 → 指派班級 → 繳交統計）|
| `REVIEWS[]`（dashboard）| `{ name, cls, type, practice, ago, ai, attempt, isNew, items[]｜questions[], reviewed, _sentScore, _sentNote }` | 待批閱提交 query（`items` = 語音逐題；`questions` = 選擇題）|
| `STUDENTS[]`（students）| 學生 + hsk + class + word-game 統計 | 學生 query |
| `ASSIGN(s)`（students）| `{ n, t, due, st:'sub'｜'pend'｜'over', skipped? }` | 該生作業狀態 query |
| `history(s)`（students）| `{ d, t, name, sc }` | 該生練習/作業歷史 query |

送出動作 → mutation：**Send review**（送分數 + 評語、標記 reviewed）、**Send reminder**（寄提醒）、**Skip**（略過該生該作業）。GraphQL 層位置：`src/api/graphql/`（`queries/`、`mutations/`）。

---

## 建議放置位置（`dahua-dash` repo）

| 內容 | 目錄 |
|------|------|
| 頁面 route | `src/app/teacher/...`（依現行 App Router 慣例）|
| 版面（Dashboard / Students）| `src/sections/teacher/...` |
| 可複用元件（type pill、review drawer、practice-detail modal、reminder/skip modal）| `src/components/...` |
| GraphQL query / mutation | `src/api/graphql/queries`、`.../mutations` |
| i18n | 所有文案走 i18next key（原型是英文 demo 文案）|

---

## 響應式（RWD）— 2026-08-06 新增

支援策略：**平板完整優化；手機求可讀、可操作、不橫向捲動**（不追求像素級精緻）。

| 斷點 | 行為 |
|------|------|
| **≤1024px** | 側邊欄改**抽屜**：topbar 左側出現漢堡鈕，側邊欄疊在半透明遮罩上滑出。關閉方式：點遮罩、點任一導覽連結、Escape、視窗拉回 >1024px。內距整體縮小 |
| **≤700px** | Active Assignments 表格 → **卡片**：欄位標題收起，一列變一張卡（作業名整寬 → 類型＋班級 → 日期＋未繳數 → 動作鈕）。未繳數補上行內標籤 `Not submitted ·`，避免變成孤兒數字 |
| **≤700px** | 統計卡 4 欄 → 2 欄；page-head 直排；批閱抽屜的分數區 2 欄 → 1 欄 |

> **注意（行為變更）**：舊版在 ≤820px 直接 `.side{display:none}` 把側邊欄整個藏掉，**藏了之後沒有任何導覽入口**；同時也把頂部 Search 一起藏掉。新版移除該規則 —— 側邊欄走抽屜，**Search 在所有寬度都保留**（手機縮成 icon-only 按鈕）。Search 是已定案的功能，重寫時不要再把它在窄螢幕拿掉。

### 實作方式（rebuild 時的對應）

- 原型的 RWD **全部集中在 `<style>` 最末端一段註解為 `RWD` 的區塊**，桌機樣式完全沒動 —— 要比對「桌機 vs 響應式」看那一段即可。
- 抽屜 JS 是 `</body>` 前的獨立 IIFE，只靠兩個 hook：`[data-navtoggle]`（漢堡鈕，可有多顆）與 `#navScrim`（遮罩）。狀態 = `.side.open` + `.nav-scrim.on` + `body.nav-open`（鎖背景捲動），並同步 `aria-expanded`。
- **React 版建議**：抽屜用 MUI `<Drawer variant="temporary">` + `useMediaQuery(theme.breakpoints.down('lg'))`；不要照抄 `position:fixed + transform` 的手刻版本。斷點值（1024 / 900 / 820 / 760 / 700）可對應到專案既有的 MUI breakpoints，數字不必完全一致，但**行為與順序要一致**。
- 表格卡片化在原型是純 CSS（`grid-template-areas` / `flex-wrap`）。React 版若改用 MUI `Table`，請在 `sm` 以下改渲染卡片元件，不要靠 CSS 硬擠。

---

## 2026-08-07 更新

| 變更 | 頁面 | 說明 |
|------|------|------|
| 側邊欄統一 | Dashboard | Overview 補上 **Leaderboard**；底部使用者卡片改為紅色 **Report Issue** 連結；brand 拿掉 `Teacher` 副標。三頁側邊欄自此完全一致。 |
| 頂列頭像 | Dashboard / Students | 右上角 36px 圓形教師頭像（琥珀底），與 Word Game 頁一致；≤700px 隱藏。 |
| 分區可收合 | Dashboard | Active Assignments 的 Overdue / Today / Tomorrow / Later 標題可收合，狀態跨重繪保留。 |
| 資料範圍提示 | Dashboard | Active Assignments 標題旁新增 ⓘ hover 說明：只呈現近半年資料。 |
| 移除 Level Progress | Students | Word Game 面板的進度條移除（Stage 卡已含 `N/54`），面板 padding 補為四邊一致。 |
| 區塊可收合 | Students | Assignment Status / Assignment History 兩個區塊標題可收合，切換學生時保留狀態。 |

---

## 交接後的溝通

有設計疑問或不清楚的互動規則，請找設計者確認，不要自行臆測。