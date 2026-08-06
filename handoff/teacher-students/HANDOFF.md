# Teacher · Students Page — Engineer Handoff

Chinese-module **CLASS_TEACHER** 的「學生」頁設計交接（master-detail：左側名冊 + 右側學生詳情）。這裡的檔案是 **高擬真互動原型（reference mockup）**，工程師以 **Next.js 14 / React 18 / MUI v5 / Apollo** 在正式 app（`dahua-dash`）重寫 —— 不是直接搬 HTML。行為、狀態、配色以原型為準。

---

## 本次打包範圍

| 畫面 | 檔案 | 內容 |
|------|------|------|
| **Students** | `teacher-students.html` | 學生名冊（搜尋 + class/HSK 篩選）、Word Game Level、Assignment Status、Assignment History + 練習細節 popup + Reminder/Skip popup |

目前設計版本：**Redesign v8**（2026-08-06）—— v7 移除了 Manage 按鈕 / HSK 等級篩選 / 單一學生編輯（此頁回到「查看」定位），v8 再加上**響應式（RWD）**。舊版（含 Manage + HSK 篩選）保留在 `specs/chinese-modules/versions/redesign-v0-students.html`。

---

## 目錄結構

```
handoff/teacher-students/
├── index.html            ← 入口
├── HANDOFF.md            ← 本文件
└── teacher-students.html ← Students 原型（自包含，inline CSS/JS）
```

技術：HTML 自包含，CSS 寫在 `<style>`、JS 是單一 IIFE、**純 vanilla JS、無外部 library**。假資料寫在 JS 頂部常數，替換成 GraphQL 即可。

> 這頁也可從 Dashboard 深連結進來：`teacher-students.html?s=<學生姓名>` 會自動選取並捲動到該生。

---

## 外部依賴

| 資源 | CDN |
|------|-----|
| Plus Jakarta Sans 字型 | `fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800` |
| Material Icons Round | `fonts.googleapis.com/icon?family=Material+Icons+Round` |

正式 app 請改用專案既有的 MUI 字型設定與 icon 方案（Material Icons 名稱可沿用）。

---

## 色彩 Token 速查

### 基礎
| Hex | 用途 |
|-----|------|
| `#059669` | Primary — 主按鈕、active、進度 |
| `#0f172a` / `#475569` / `#64748b` | 文字：主 / 次 / 弱 |
| `#e6ebf1` / `#eef2f7` | 邊框、分隔線 |
| `#f4f7fb` | 頁面底 |
| `#d97706` / `#e11d48` | amber（提醒）/ rose（逾期・危險）|

### 練習類型色系（**跨學生端／教師端共用，務必一致**）
| 類型 | key | 文字色 | 底色 |
|------|-----|--------|------|
| Q&A | `qa` | `#2563EB` | `#e8f0ff` |
| Mirroring | `mirror` | `#EA7A21` | `#fdeede` |
| Vocabulary | `vocab` | `#0B7A3B` | `#e6f7ec` |
| **Follow the Pattern**（原 Multiple Choice）| `mc` | `#7C3AED` | `#f1e9ff` |

### Word Game Level 四格主題色
| 格 | 文字/icon 色 | 卡片底（漸層）| Material icon |
|----|------|------|------|
| Level | `#7c3aed` | `#f5f3ff → #ede9fe` | `military_tech` |
| Stage | `#0d9488` | `#f0fdfa → #ccfbf1` | `flag` |
| Stars | `#d97706` | `#fffbeb → #fef3c7` | `star` |
| Hearts | `#e11d48` | `#fff1f2 → #ffe4e6` | `favorite` |

區塊標題前的彩色圖示徽章：Word Game（紫 `sports_esports`）、Assignment Status（琥珀 `fact_check`）、Assignment History（藍 `history`）。

### 頭像顏色規則（名冊 + 詳情表頭）

學生頭像用「姓名雜湊」從固定 6 色調色盤挑一色：

| index | Hex | 色 |
|---|---|---|
| 0 | `#2563EB` | 藍 |
| 1 | `#0B7A3B` | 綠 |
| 2 | `#EA7A21` | 橘 |
| 3 | `#7C3AED` | 紫 |
| 4 | `#e11d48` | 玫瑰 |
| 5 | `#0369a1` | 深藍 |

- **選色公式**：`AV[(name.charCodeAt(0) + name.length) % 6]`（首字元碼 + 姓名長度，取 6 的餘數）。
- **呈現**：`linear-gradient(145deg, 色+cc, 色)`（左上稍淡、右下實色）＋ 姓名縮寫（每個字取首字母，最多 2 個，大寫）。
- **特性**：deterministic（同一姓名永遠同色），但**不保證相鄰列不撞色**。正式版若要更均勻，可改雜湊整個姓名，或改以 class / HSK 決定顏色（比隨機更有意義）。

---

## 元件對照

| 區塊 | 說明 |
|------|------|
| **名冊（左）** | 24 筆學生，搜尋 + class / HSK 篩選；點選切換右側詳情；`?s=<name>` 可直接選取。 |
| **Word Game Level** | 四格彩色卡：Level / Stage / Stars / Hearts + Level Progress 進度條（綠→青→靛漸層）。 |
| **Assignment Status** | **只列未繳交**；欄位 Assignment / Type / Date / 動作。 |
| **Assignment History** | 欄位 Assignment / Type / Date / Score / **Detail**；欄序與 Assignment Status 對齊（共用 Type/Date 寬度）。 |
| **練習細節 popup** | 由 Assignment History 每列 **Detail** 開啟；依類型渲染（語音＝逐字發音評分 + Score breakdown；`mc`＝逐題批閱 + X/Y correct）。 |
| **Reminder / Skip popup** | 與 Dashboard 同款確認 popup（綠色信封寄信 / 紅色 Skip 確認）。 |

---

## 關鍵互動規則（rebuild 時務必保留）

- **Assignment Status 只顯示未繳交**，並分兩種狀態：
  - **期限內未繳**（`pend`）→ 日期中性 + 「Not submitted」，動作只有 **Remind**（寄提醒信）。
  - **逾期未繳**（`over`）→ 日期紅色 + 「Overdue」，動作為 **Skip** + **Remind**。
  - 全部繳交完 → 顯示空狀態文案。
- **Remind** → 開寄信 popup（訊息預填、可編輯）→ 送出 toast「Reminder sent to …」。
- **Skip** → 紅色確認 popup → 確認後該筆自名單移除並重繪、toast「Skipped …」。
- **練習細節 popup 依類型分流**：語音類（qa / mirror / vocab）= 逐字拼音 + ✓/!/✕ + 星等 + Play Audio + Score breakdown；`mc` = 逐題（Q 徽章、對錯、學生答案 vs 正解、X / Y correct 摘要）。
- **重要（實作細節）**：所有 modal / toast 的 DOM 必須放在存取它們的 `<script>` **之前**，否則初始化時抓不到元素會中斷點擊事件（原型踩過這個坑，已修正）。React 版用 state 控制即可，不受此限。

---

## Demo 假資料 → API 替換指引

假資料都在 `teacher-students.html` 的 `<script>` 頂部常數：

| 變數 | 結構 | 替換為 |
|------|------|--------|
| `STUDENTS[]` | 學生 + `hsk` + `cls` + word-game 統計（`w.master` / `w.learn`）+ `avg` | 學生 query |
| `ASSIGN(s)` | `{ n, t, due, st:'sub'｜'pend'｜'over', skipped? }` | 該生作業狀態 query（前端只顯示非 `sub`）|
| `history(s)` | `{ d, t, name, sc }` | 該生練習/作業歷史 query |
| Word Game 數值 | `level / stage / stars / hearts` 由 `s.hsk`、`s.avg`、`s.w` 推算 | 後端 word-game 進度 API |

送出動作 → mutation：**Send reminder**（寄提醒）、**Skip**（略過該生該作業）。GraphQL 層位置：`src/api/graphql/`（`queries/`、`mutations/`）。

---

## 建議放置位置（`dahua-dash` repo）

| 內容 | 目錄 |
|------|------|
| 頁面 route | `src/app/teacher/students/...` |
| 版面（roster + detail）| `src/sections/teacher/students/...` |
| 可複用元件（type pill、practice-detail modal、reminder/skip modal、word-game tiles）| `src/components/...` |
| GraphQL query / mutation | `src/api/graphql/queries`、`.../mutations` |
| i18n | 所有文案走 i18next key（原型是英文 demo 文案）|

---

## 響應式（RWD）— 2026-08-06 新增

支援策略：**平板完整優化；手機求可讀、可操作、不橫向捲動**（不追求像素級精緻）。

| 斷點 | 行為 |
|------|------|
| **≤1024px** | 側邊欄改**抽屜**：topbar 左側出現漢堡鈕，側邊欄疊在半透明遮罩上滑出。關閉方式：點遮罩、點任一導覽連結、Escape、視窗拉回 >1024px。內距整體縮小 |
| **≤1100px** | 名冊欄 380px → 330px |
| **≤900px** | master-detail → **整頁切換**：只顯示名冊，點學生整頁換到詳情，詳情 topbar 左上出現**返回鈕**回名冊（Escape 亦可）。狀態＝ `.main.detail-open`，名冊/詳情互斥顯示 |
| **≤760px** | Assignment Status / Assignment History 兩張表 → **卡片**：表頭收起、作業名整寬、`類型 · 日期 · 狀態` 併一行、動作鈕整寬 |
| **≤700px** | Word Game 四格 tiles 4 欄 → 2 欄 |

> **踩過的雷**：這兩張表原本是 `table-layout:fixed` + 三個固定 px 欄寬（150 / 110 / 200，合計 460px），手機寬度不足時欄位會**直接疊在一起**（標題和內容重疊）。重寫時若沿用 `<table>`，窄螢幕務必改成卡片或讓欄寬彈性化。

### 實作方式（rebuild 時的對應）

- 原型的 RWD **全部集中在 `<style>` 最末端一段註解為 `RWD` 的區塊**，桌機樣式完全沒動 —— 要比對「桌機 vs 響應式」看那一段即可。
- 抽屜 JS 是 `</body>` 前的獨立 IIFE，只靠兩個 hook：`[data-navtoggle]`（漢堡鈕，可有多顆）與 `#navScrim`（遮罩）。狀態 = `.side.open` + `.nav-scrim.on` + `body.nav-open`（鎖背景捲動），並同步 `aria-expanded`。
- **React 版建議**：抽屜用 MUI `<Drawer variant="temporary">` + `useMediaQuery(theme.breakpoints.down('lg'))`；不要照抄 `position:fixed + transform` 的手刻版本。斷點值（1024 / 900 / 820 / 760 / 700）可對應到專案既有的 MUI breakpoints，數字不必完全一致，但**行為與順序要一致**。
- 表格卡片化在原型是純 CSS（`grid-template-areas` / `flex-wrap`）。React 版若改用 MUI `Table`，請在 `sm` 以下改渲染卡片元件，不要靠 CSS 硬擠。

---

## 交接後的溝通

有設計疑問或不清楚的互動規則，請找設計者確認，不要自行臆測。