# Teacher · Word Game — Engineer Handoff

Chinese-module **CLASS_TEACHER** 的 **Practice ▸ Word Game** 頁設計交接：把 Word Game 當作**目標式作業**指派給班級、管理與監控各班進度、檢視遊戲關卡內容。

這裡的檔案是 **高擬真互動原型（reference mockup）**，工程師以 **Next.js 14 / React 18 / MUI v5 / Apollo** 在正式 app（`dahua-dash`）重寫 —— 不是直接搬 HTML。行為、狀態、配色以原型為準。

> **先讀這個**：設計決策與語意定義在 spec —— `specs/chinese-modules/teacher-wordgame-spec.html`（Draft v5 · 設計定案版，Q1–Q11 已全數拍板）。本文件只講**前端怎麼做**；達標判定、baseline、API 契約等語意問題以 spec §6 為準。

---

## 本次打包範圍

| 畫面 | 檔案 | 內容 |
|------|------|------|
| **Word Game** | `teacher-wordgame.html` | 兩欄版面（Assignments / Student Levels / Game Content）、Assign 對話框（班級複選 + 日曆區間 + 三種目標）、Manage 對話框（Edit / Delete）、關卡頁（搜尋 / 型別 filter / 分頁） |

目前設計版本：**Redesign v8**（原型最後更新 2026-08-07）＝ v7 的設計 + **響應式（RWD）** + 本次的**未達標提醒**與**作業歷史（History）**。凍結快照見 `specs/chinese-modules/versions/redesign-v7-wordgame.html`。

---

## 目錄結構

```
handoff/teacher-wordgame/
├── index.html              ← 入口
├── HANDOFF.md              ← 本文件
└── teacher-wordgame.html   ← 原型（自包含，inline CSS/JS）
```

技術：HTML 自包含，CSS 寫在 `<style>`、主邏輯是單一 IIFE `(function(){…})()`、**純 vanilla JS、無外部 library**。假資料寫在 JS 頂部常數，替換成 GraphQL 即可。

側邊欄的 Dashboard / Students 連結指向 **同層的另外兩個交接包**（`../teacher-dashboard/`、`../teacher-students/`），在 repo 內可直接點過去。

---

## 外部依賴

| 資源 | CDN |
|------|-----|
| Plus Jakarta Sans 字型 | `fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800` |
| Material Icons Round | `fonts.googleapis.com/icon?family=Material+Icons+Round` |

正式 app 請改用專案既有的 MUI 字型設定與 icon 方案（Material Icons 名稱可沿用）。

---

## 版面結構

```
┌─ Topbar ─────────────────────────── [ + Assign Word Game ] ─┐
  LEFT ① Word Game Assignments        [ N assignments ] [ Manage ]
      表頭：Dates · Class · Goal · Reached
      每列可展開 → 未達標學生名單
  LEFT ② Student Levels
      班級複選下拉（含 All students）+ 排序鈕
      名冊：Student · Class · Level·Stage · Content
  RIGHT   Game Content                                [ 7 worlds ]
      7 個 world 列；L0 / L1 可點進關卡頁，L2–L6 🔒 Coming soon
└─────────────────────────────────────────────────────────────┘
```

`.wg-cols` = `min(680px,100%) 400px`，≤1200px 收合為單欄。左欄是兩個**獨立 panel**（各有自己的標題與控制項），不是一個 panel 兩段。

---

## 色彩 Token 速查

沿用 dashboard / students 的設計系統（`#059669` emerald 為 primary、`#0f172a` ink、`#64748b` muted、`#e6ebf1` line、`#f4f7fb` bg、`#d97706` amber、`#e11d48` rose）。本頁另有：

### 等級色（綠 → 紅，Level 0–6）
| Level | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| Hex | `#34C759` | `#8BC34A` | `#CDDC39` | `#FFCA28` | `#FF9800` | `#FF7043` | `#EF5350` |

用於 `HSK · stages` 文字色與 Level chip。**世界一律以 `Level N` + 教學內容名顯示**，不用遊戲內的奇幻世界名（渡口 / 石桥…）。

### 關卡型別
| 型別 | 文字色 | 底色 | icon |
|------|--------|------|------|
| TEACHING | `#0B7A3B` | `#e6f7ec` | `menu_book` |
| QUIZ | `#2563EB` | `#e8f0ff` | `quiz` |
| BOSS | `#e11d48` | `#ffe4e6` | `local_fire_department` |

### 到期急迫色（貫穿整列）
逾期 / 今天 = rose、快到期 = amber、之後 = 中性灰。**`Reached X / total` 的數字顏色跟著到期日跑**；全員達標改顯示綠色 `All complete`。

---

## 元件對照

| 區塊 | 說明 |
|------|------|
| **Assignments 列** | `Start – Due` 期間（依急迫上色）· 班徽 · Goal · **`Pending X / total`**（**尚未完成**人數，非已完成人數）+ 展開箭頭。整列可點展開；**全班完成時顯示 `All complete`、不渲染箭頭且整列不可點**（沒有可展開的內容就不給展開的暗示）|
| **展開：未達標名單** | Reach / Complete 目標 → `Student · Level · Stage · To goal`；min/day 目標 → `This week · 區間 · Goal N days` + 每生**缺幾天**。每一列右端有 **Remind** 鈕（見下方互動規則）|
| **History 對話框** | 兩層：作業清單（含**已結束**的作業）→ 點入看**逐位學生的成績**。見下方「作業歷史」章節 |
| **Manage 對話框** | 每個作業一張卡：班級 · 期間 + 天數（`Jul 24 – Jul 29 · 6d`）· 三顆膠囊（目標型別 / 目標值 / N students）+ **Edit** / **Delete**。刻意沒有 New（走主按鈕）與 End early |
| **Assign 對話框** | Assign to（班級複選）→ When（日曆區間）→ Goal Type → （min/day 才有）Days |
| **Student Levels** | 班級複選下拉（含 All students 全選）+ 排序切換鈕（進度低→高 / 高→低）；`Content` 欄＝該生**目前所在關卡的名稱** |
| **Game Content** | 7 個 world 列：`Level N` + 教學內容名 + `HSK N · M stages`；L2–L6 顯示 🔒 Coming soon 且 `disabled` |
| **關卡頁** | 非彈窗，**就地換頁**（主 topbar + `.wg-cols` 隱藏、`#stgPage` 顯示），左上返回鈕 / Escape 返回。搜尋（標題 + 詞 / 拼音）、型別 filter（含即時數量）、每頁 12 關 + 頁碼 |

---

## 關鍵互動規則（rebuild 時務必保留）

### 指派：一班同一時間只有一個作業
- Assign 對話框的 **When 是可收合的日曆區間選擇器**（並排兩個月，可翻月），點第一下設起日、第二下設迄日。
- **未選班級前整個日曆 disabled** —— 要先知道是哪幾班，才知道哪些日子被占用。
- 被選班級**已有作業的日期畫成不可選**（斜紋 + 刪除線）；若圈選的區間中間跨過已占用的日子，**直接拒絕**並 toast「That range overlaps a booked period」。
- **Edit 時占用檢查要排除作業自己**，否則原本的期間會被自己擋住。
- ⚠️ **後端必須同步驗證重疊**，不能只靠 UI 擋（並發、直接呼叫 API）。

### 目標三型
| 型別 | 欄位 | 達標定義 |
|------|------|----------|
| `Complete N stages` | 關卡數 | **相對**：從指派當下起再清 N 關（需 per-student baseline） |
| `Reach a level / stage` | Level（可選具體 Stage） | **絕對**：`world ≥ N`（指定 Stage K 時 `world > N` 或 `world = N` 且 `done ≥ K`） |
| `Play a set time each day` | 分鐘（預設 10/15/20/30 + 自訂）+ **Days**（Every day / Weekdays / Weekend / 自訂 7 個 chip） | 逐週結算（**週一為一週之始**），單日 = 當天累計滿 N 分（可分次、不可補玩），所選天數 = 該週應達成天數 |

- **達標是布林，不是百分比** —— 個人層級沒有進度 %、不畫個人進度條；`Reached X / total` 只存在於班級層級。
- 已移除的東西**不要加回來**：`Just play` 純遊玩模式、`Earn stars` 目標、leaderboard / 星星、關卡頁的 Insights 三榜、右欄的 per-stage cohort 統計。

### 未達標提醒
- 未達標名單每一列右端一顆 **Remind**（綠框信封，與 Dashboard / Students 的寄信鈕同款）。
- 點擊開確認 popup：標題顯示「學生 · Class X」，訊息**依該筆作業的目標預填**且可編輯，送出後 toast「Reminder sent to …」。
- 按鈕要 `stopPropagation`，否則點提醒會順帶把整列摺疊起來。

### 作業歷史（History）
- 進入點：`Word Game Assignments` 面板標題右側的 **History** 鈕，與 Manage 並列。
- **清單頁**：同時列出**進行中**（`Active`）與**已結束**（`Ended`）的作業 —— 這是唯一看得到已結束作業的地方，主面板只顯示進行中。每張卡右側是 `N / M complete` 結果摘要。
- **詳情頁**：標題列左側出現返回鍵回清單（同一個 modal 內換頁，不另開視窗）。表格依目標型別切換欄位，一律呈現「**數值 ＋ 超出／不足**」（超出綠、不足紅）：
  | 目標型別 | 欄位 |
  |------|------|
  | `Complete N stages` | Student · Stages cleared · vs goal（**不顯示 Level**）|
  | `Reach a level` | Student · Level · Stages cleared · vs goal（差距以**關數**表示）|
  | `Play a set time each day` | Student · **每週一欄** · Total |
- **逐週歷史（min/day 專屬）**：作業橫跨幾週就開幾欄，欄名帶日期區間（`W1 · Jun 22–26`）；每格是該週**實際時數 + 差距**（`88 min` `+13 min`），最後一欄 `Total` 是整期總時數與總差距。
- **一致性要求**：「該週時數 ≥ 週目標」必須與「指定日全數達成」等價，否則會出現「時數超標卻標紅」的矛盾（例如三天各衝 30 分鐘）。原型用 `達標天數 × 每日分鐘 + 小於每日分鐘的餘數` 保證兩者等價；**正式版請以每日布林為準來上色，時數只是呈現**。
- **排序**：Student 欄標題內建高低切換鈕，依表格對應「總時數」或「累計關數」；狀態在整個 History 視窗內保留，切換作業不重設。
- 寬表格以 `overflow-x:auto` 在 modal 內橫向捲動。**已知限制**：週數多時（實測 11 週約 1620px）捲動時 Student 欄會跟著捲走，正式版建議把姓名欄 `position:sticky; left:0`，或超過一定週數改用摘要 + 展開。

### 其他
- **刪除為軟刪**：畫面不顯示、日曆不再占用，資料保留。原型用 `skipped:true` 模擬。
- **提早結束不做**：要提早結束就 Edit 把 End date 改到今天。
- **Level 2–6 鎖住**：右欄不可點；**Assign 對話框的 Level 下拉也要只留 L0 / L1**（見下方「原型與定案的差異」）。
- 關卡頁 `Escape` 與 Assign / Manage 對話框的 `Escape` 共用同一個 keydown handler，重寫時注意層級順序。

---

## ⚠️ 原型與定案的差異（實作前必看）

以下兩點**已經拍板但原型仍未改**。請**以本文件的定義為準**，不要照抄原型行為：

1. **`Complete N stages` 目前用「跨世界累計前綴和（絕對值）」算差距** → 應改為**相對 baseline**（`目前已清關數 − 指派當下的 baseline ≥ N`）。
   > 這也是原型 demo 資料看起來怪的原因：因為比的是累計值，門檻要灌水到 100 關才會有人未達成。正式版用相對 baseline 後，「25 關」這種正常目標就會自然產生未達成者。
2. **Assign 對話框的 Level 下拉仍列出 L0–L6** → 應只留 **L0 / L1**（不可指派到未開放等級）。

（2026-08-07 更新：原本列在這裡的另外兩點已處理 —— **未達標提醒鈕**已實作，見上方「未達標提醒」；**逐週 Mon–Sun 結算**在展開名單本來就已是週制，完整的逐週歷史則由新的 **History** 提供。展開名單刻意只呈現「當週」，因為它回答的是「現在誰落後」；要看整期每一週請走 History。）

---

## Demo 假資料 → API 替換指引

假資料都在 `teacher-wordgame.html` 的 `<script>` 頂部常數：

| 變數 / 函式 | 結構 | 替換為 |
|------|------|--------|
| `WORLDS[]` | 7 個 world：`{id, emoji, theme, units[], stages[]}`，`stages` 為 world 內**扁平有序**清單，型別 `TEACHING / QUIZ / BOSS` | `getWordGame2StageMap`（WG2 既有） |
| `LVCONTENT[]` | 各 Level 的教學內容名（L0 `Pinyin & Tone Challenge`、L1 `Vocabulary` 為真，L2–L6 為 placeholder） | 內容 metadata |
| `WGA[]` | 作業：`{cls, goalType:'count'｜'reach'｜'minutes', stages/level/minutes, days, reqDays, start, due, skipped?}` | Word Game 作業 query（**新資料表**） |
| `CLASSES[]` / `ROSTER{}` | 班級 + 每班學生 `{n, world, done, total, stars}` | 班級名冊 + **批次**每生進度（需能對一整班/多班查詢） |
| `metGoal(s,a)` / `stagesToGoal(s,a)` / `daysMet(s,req)` | 前端即時推算達標與差距 | **改由後端回傳** `reached: Boolean` 與差距 —— 否則 Word Game 頁 / Students 頁 / Dashboard 三處會各算一次、算法遲早漂移 |
| `PREFIX[]` / `clearedStages(s)` | 跨世界累計清關數（前綴和） | 後端 baseline 機制（見上方差異第 1 點） |
| `occRanges()` | 由現有作業推出的「已占用期間」 | `getClassBookedPeriods(classIds, excludeAssignmentId)` |

送出動作 → mutation：**建立 / 更新作業**（`upsertWordGameAssignment`，需回 `ASSIGNMENT_PERIOD_CONFLICT` + 衝突區間）、**刪除作業**（軟刪）、**提醒未達標學生**。GraphQL 層位置：`src/api/graphql/`（`queries/`、`mutations/`）。

> **注意**：`Play min/day` 需要「每生每日 Word Game 遊玩分鐘數」，這是目前**完全不存在**的 telemetry。建議分期：**Phase 1** 只做 Complete / Reach 兩種目標（資料已存在）→ **Phase 2** 等 telemetry 再做 min/day。

---

## 響應式（RWD）— 2026-08-06 新增

支援策略：**平板完整優化；手機求可讀、可操作、不橫向捲動**（不追求像素級精緻）。

| 斷點 | 行為 |
|------|------|
| **≤1200px** | 兩欄 → 單欄（Assignments / Student Levels 之後接 Game Content） |
| **≤1024px** | 側邊欄改**抽屜**：topbar 出現漢堡鈕，側邊欄疊在半透明遮罩上滑出。關閉方式：點遮罩、點任一導覽連結、Escape、視窗拉回 >1024px。`.wg` 從自身捲動改為整頁捲動 |
| **≤1100px / ≤820px** | 關卡卡片 4 欄 → 2 欄 → 1 欄 |
| **≤820px** | Assignments / 未達標名單 / 名冊三張表 → **卡片**（表頭收起）：作業列變成「班徽＋期間 → Goal → Reached＋箭頭」三行；名單列以 `flex-wrap` 讓姓名獨佔一行 |
| **≤820px** | 日曆**兩個月 → 一個月**（第二個月與其標題隱藏，翻月鈕仍可用）；Manage 卡片可換行、拖曳把手隱藏 |
| **≤700px** | Assign / Manage / 細節對話框 → **全螢幕 sheet**（`border-radius:0`、滿版高度）；Assign 按鈕整寬 |

### 實作陷阱（原型踩過，重寫時同樣會遇到）
- **大寫容器裡不能放 Material Icons**：`text-transform:uppercase`（和 `letter-spacing`）會破壞 icon font 的連字比對，圖示會變成字面文字（`swap_vert` 顯示成「SWAP VERT」）。表頭類元件放 icon 時要在 icon 上覆寫 `text-transform:none; letter-spacing:normal`。MUI 用 `<Typography textTransform="uppercase">` 包表頭時同樣會中招。
- **不要用位置選擇器排版對話框標題列**：原型的 `.cmodal-hd > div:nth-child(2){flex:1}` 在標題列前面加了一顆返回鈕之後就套錯元素，把圖示徽章拉成一條長條。改用 class 指定。
- **表頭與資料列是各自獨立的 grid**：只有兩者 `grid-template-columns` 完全一致才會對齊，欄位用 `auto` 寬度時（例如表頭那格是空的、資料列那格有按鈕）就會錯位，要給固定寬度。

### 實作方式（rebuild 時的對應）

- 原型的 RWD **全部集中在 `<style>` 最末端一段註解為 `RWD` 的區塊**，桌機樣式完全沒動。
- 抽屜 JS 是 `</body>` 前的獨立 IIFE，只靠兩個 hook：`[data-navtoggle]`（漢堡鈕）與 `#navScrim`（遮罩）。狀態 = `.side.open` + `.nav-scrim.on` + `body.nav-open`（鎖背景捲動），並同步 `aria-expanded`。
- **React 版建議**：抽屜用 MUI `<Drawer variant="temporary">` + `useMediaQuery(theme.breakpoints.down('lg'))`；對話框在手機用 `fullScreen` prop，不要手刻。斷點值可對應專案既有的 MUI breakpoints，數字不必完全一致，但**行為與順序要一致**。
- 表格卡片化在原型是純 CSS（`grid-template-areas` / `flex-wrap`）。React 版若用 MUI `Table`，請在窄螢幕改渲染卡片元件，不要靠 CSS 硬擠。

---

## 建議放置位置（`dahua-dash` repo）

| 內容 | 目錄 |
|------|------|
| 頁面 route | `src/app/teacher/word-game/...` |
| 版面（assignments / student levels / game content / stages page）| `src/sections/teacher/word-game/...` |
| 可複用元件（class multi-select、date-range calendar、goal-type form、assignment card）| `src/components/...` |
| GraphQL query / mutation | `src/api/graphql/queries`、`.../mutations` |
| i18n | 所有文案走 i18next key（原型是英文 demo 文案）|

側邊欄位置：**Practice ▸ Word Game**（Practice List 之下）。

---

## 交接後的溝通

有設計疑問或不清楚的互動規則，請找設計者確認，不要自行臆測。特別是「原型與定案的差異」那四點 —— 原型看到的行為是舊的，以本文件為準。