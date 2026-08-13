# Student · Home / Word Game — Engineer Handoff

Chinese-module **學生端**的重新設計交接：以「今天要做什麼」為主軸的 Home、作業清單、Word Game（HSK 關卡地圖 + Word Bank）、排行榜、練習歷史、信箱。

這裡的檔案是 **高擬真互動原型（reference mockup）**，工程師以 **Next.js 14 / React 18 / MUI v5 / Apollo** 在正式 app（`dahua-dash`）重寫 —— 不是直接搬 HTML。行為、狀態、配色以原型為準。

> **本次打包的重點（老師 ↔ 學生的接點）**
> 1. Home 的 **Word Game 卡片會顯示老師指派的目標**（`From your teacher · Due Aug 3` / `Play 15 min / day · Weekdays` / 今日進度條）。
> 2. 老師若指派的是 **分鐘型目標（min/day）**，學生進入 Word Game 畫面時 **右上角出現計時器**，累計今天玩了多久。
>
> 這兩者對應老師端的 `Play a set time each day` 目標，語意定義在 `specs/chinese-modules/teacher-wordgame-spec.html`（Draft v5 · 設計定案版）與 `handoff/teacher-wordgame/HANDOFF.md`。**學生端的達標判定不要自己算，跟老師端共用後端的同一份答案。**

---

## 本次打包範圍

| 畫面 | id | 內容 |
|------|----|------|
| **Home** | `#game` | 教練問候 · **Do Next**（老師指派、最近到期，第一筆是 hero 卡）· Optional Practice · **Word Game 卡片（含老師目標橫幅）** |
| **Assignment List** | `#assign` | Mandatory / Optional 分頁 · 型別 filter · Today / Later 兩段清單 |
| **Word Game** | `#wordgame` | **右上角遊玩計時器** · HSK 0–6 等級列 · 54 關關卡地圖（蛇行路徑）· Word Bank 分頁 |
| **Leaderboard** | `#board` | 前三名頒獎台 + 自己的名次 + 全班名單 |
| **History** | `#hist` | 練習紀錄（Not submitted / Waiting / Reviewed）+ 展開看逐次分數、老師與 AI 回饋 |
| **Mail Box** | `#mail` | 老師回饋 / 提醒 / 公告三型，未讀 badge |

---

## 目錄結構

```
handoff/student-redesign/
├── index.html              ← 入口
├── HANDOFF.md              ← 本文件
├── wg-goal-variants.html   ← 目標橫幅三種型別的文案預覽（提案，未定案）
├── student-redesign.html   ← 原型（單檔，inline CSS/JS）
└── assets/                 ← 原型用到的圖（相對路徑，勿更名）
    ├── dh_single.png
    └── game/
        ├── bg.png                  遊戲天空背景
        ├── leaderboardbg.png       排行榜背景
        └── moscot/
            ├── moscot4.gif         Word Game 卡片吉祥物
            └── moscot10.gif        Home 教練問候
```

技術：單一 HTML，CSS 寫在 `<style>`、主邏輯是一個大 IIFE `(function(){…})()`、**純 vanilla JS、無外部 library、無 build step**。假資料是 JS 頂部的常數陣列，換成 GraphQL 即可。

畫面切換靠 `.screen.on` —— 六個 `<section class="screen">` 疊在同一個 `.stage` 裡，切換只是換 class（**不是** 換頁 / `display:none`）。這點在計時器那節會再提到。

---

## 外部依賴

| 資源 | CDN |
|------|-----|
| Fredoka（標題字） | `fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700` |
| Nunito（內文字） | `fonts.googleapis.com/css2?family=Nunito:ital,wght@…` |
| Material Icons Round | `fonts.googleapis.com/icon?family=Material+Icons+Round` |

正式 app 請改用專案既有的字型設定。原型的圖示大多是 **inline SVG**（雙色：淺綠 `#8FE7AE` 填底 + 主綠 `#12A150` 前景），這套雙色風格請保留，換成 icon set 時挑同樣調性的。

---

## 版面結構

```
┌ .app  (grid: 262px | 1fr, height:100vh, padding:16px) ────────────┐
│ ┌ .side ──────────┐ ┌ .stage ─────────────────────────────────┐   │
│ │ DAHUA AI        │ │  六個 .screen 疊在一起，.on 的那個顯示     │   │
│ │ · Home          │ │                                          │   │
│ │ · Leaderboard   │ │  Home = .dash-cols（左 Do Next / 右 rail）│   │
│ │ · Assignment    │ │  右 rail = Optional Practice + Word Game  │   │
│ │ · History       │ │                                          │   │
│ │ · Mail Box  [2] │ │                                          │   │
│ │ ─────────────   │ │                                          │   │
│ │ ⭐ Stars 319     │ │                                          │   │
│ │ ❤️ Hearts 10     │ │                                          │   │
│ │ Report Issue    │ │                                          │   │
│ └─────────────────┘ └──────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────┘
```

`body{ overflow:hidden }`，捲動發生在各 `.screen` 內部。≤820px 側邊欄隱藏、所有雙欄收成單欄（**手機版只做到「不破版」，尚未完整優化**）。

---

## 色彩 Token 速查

學生端是**遊戲化**的設計系統，跟老師端（emerald `#059669` / slate）**不共用**。

| Token | 值 | 用途 |
|------|----|------|
| `--green` / `--green-d` / `--green-l` | `#12A150` / `#0B7A3B` / `#DCF7E6` | 主色、深色文字、淺底 |
| `--purple` / `--purple-l` | `#7C3AED` / `#EDE4FF` | Optional / 獎勵 |
| `--gold` / `--gold-d` | `#FFC219` / `#E8A400` | 星星 |
| `--coral` / `--coral-l` | `#FF5A6E` / `#FFE1E5` | 愛心、逾期 |
| `--ink` / `--ink-soft` / `--line` | `#243B2E` / `#5B7266` / `#E4EDE7` | 文字與框線 |
| `--font-d` / `--font-b` | Fredoka / Nunito | 標題 / 內文 |

圓角一律走變數：`--r-card:20px`、`--r-row:16px`、`--r-btn:14px`、`--r-chip:8px`。陰影有 `--shadow-sm/md/lg` 三階，**卡片的立體感來自 `0 3px 0` 的實色下緣**（不是模糊陰影），重寫時別換成一般 `boxShadow`。

### 到期急迫色（`.due-chip` 的 `u` 欄位）

| `u` | 意義 | 色 |
|-----|------|----|
| `over` | 已逾期 | coral |
| `now` | 今天到期 | coral（較淺） |
| `soon` | 明天 | gold |
| `ok` | 之後 / Anytime | 中性綠灰 |

---

## 重點一：Word Game 卡片上的老師目標（`.wg-goal`）

位置：Home → 右 rail → Word Game 卡片，插在卡片標題 `.p-hd` 與 `.continue`（吉祥物 + 進度）之間。**目前是靜態 HTML，要接資料。**

```
┌ Word Game                                    Enter ▸ ┐
│ ┌ .wg-goal（琥珀色）────────────────────────────────┐ │
│ │ From your teacher                    [ Due Aug 3 ]│ │
│ │ Play 15 min / day · Weekdays                      │ │
│ │ ▓▓▓▓▓▓▓▓░░░░░░░  8/15 min today                   │ │
│ │ 7 more minutes to finish today! 🔥                │ │
│ └───────────────────────────────────────────────────┘ │
│ 🐱  HSK 1 / Stage 17 / 54  ▓▓▓▓░░░░░░                 │
│ [           Continue ▸           ]                    │
└───────────────────────────────────────────────────────┘
```

配色：底 `linear-gradient(180deg,#FFF7E6,#FFFCF3)`、框 `#FBE3AE`、進度條 `linear-gradient(90deg,#F59E0B,#D97706)`、文字 `#7C2D12` / `#B45309` / `#92400E`。**刻意用琥珀色**跟卡片其他綠色元素區隔 —— 這是「老師交代的事」，不是遊戲本身。

### 三種目標型別的文案（對應老師端）

> 📄 **看實際長相：[`wg-goal-variants.html`](wg-goal-variants.html)** —— 八張卡並排，含三型的進行中／已達標，加上「沒有指派」、完整文案總表（含 i18n 變數），以及三件還沒定案的事。**分鐘型以外的都是提案，尚未定案。**

| 老師端目標 | 學生端第二行 | 進度列 | 沒目標時 |
|------|------|------|------|
| `Play a set time each day` | `Play 15 min / day · Weekdays` | `8/15 min today` + 進度條 | — |
| `Complete N stages` | `Clear 25 stages` | `12/25 stages` | — |
| `Reach a level / stage` | `Reach HSK 2` | `HSK 1 · Stage 17` | — |
| 無指派 | **整個 `.wg-goal` 不渲染**（卡片回到只有 Continue 的樣子） | | |

### 實作要求

- **達標與差距由後端回傳**，前端不要自己算 —— 老師端 Word Game 頁、老師端 Students 頁、學生端這張卡片，三處必須是同一個答案，各算一次遲早會漂移。
- **達標是布林**。這裡的進度條是「今天還差多少」的**當日**提示，不是整份作業的完成百分比（作業層級沒有 %）。
- 達標後改綠色 + `✓ Done for today!`，並收掉 `.wg-goal-nudge` 那行催促文案。
- `Due` 過期後的處理**尚未設計**（要變灰？要消失？）—— 實作前找設計者確認。
- 文案全部走 i18next key（原型是英文 demo 文案）。

---

## 重點二：Word Game 的遊玩計時器（`.wg-timer`）

位置：`#wordgame` 畫面右上角（`position:absolute; top:34px; right:20px`）的白底綠框膠囊 —— 時鐘 SVG + `m:ss`。

### 目前原型的行為（`student-redesign.html` 檔尾的獨立 IIFE）

- 每秒 +1，但**兩個條件同時成立才走**：
  1. `#wordgame` 這個 section 帶著 `.on`；
  2. `document.visibilityState !== 'hidden'`（分頁切走就停）。
- 今日累計存在 `localStorage['wg_play_time']`，格式 `{ date:'YYYY-MM-DD', secs:N }`，**跨日自動歸零**（讀出來的 `date` 對不上今天就從 0 開始）。

> ⚠️ **陷阱**：畫面切換是 `.screen.on` 的 class 切換、不是 `display:none`，所以判斷「有沒有在 Word Game 畫面」要用 `classList.contains('on')`，**不能用 `offsetParent === null`** —— 那個判斷在這個結構下永遠是 false。

### 正式版要改的地方

| 項目 | 原型 | 正式版 |
|------|------|--------|
| 儲存 | `localStorage`（換裝置就歸零、可被竄改） | **後端**每日累計；localStorage 只當離線暫存 |
| 上報 | 無 | 定期 heartbeat（建議 15–30s 一次）+ 離開畫面 / `visibilitychange` 時 flush |
| 時區 | 瀏覽器本地日 | **班級時區**（與老師端的每日結算一致，見 spec §6） |
| 顯示 | 只有累計時間 | 有 min/day 目標時建議顯示 **`8 / 15 min today`**，達標後打勾變綠 |
| 何時出現 | 一律顯示 | 建議 **只有在有 min/day 目標時才出現**（沒目標時計時器沒有意義）— 待設計者確認 |

**「不可補玩」是規則**：單日累計滿 N 分鐘可以分好幾次湊，但昨天沒玩不能今天補。前端只負責誠實回報時間，判定在後端。

> **注意**：這份「每生每日 Word Game 遊玩分鐘數」telemetry **目前完全不存在**。老師端 HANDOFF 建議的分期同樣適用：**Phase 1** 先做 Complete / Reach 兩種目標（資料已存在，卡片橫幅可直接上），**Phase 2** 等 telemetry 進來再做 min/day 目標與計時器。

---

## 其他畫面的元件對照

| 區塊 | 說明 |
|------|------|
| **Do Next（Home 左欄）** | 老師指派、依到期排序。**第一筆是 hero 卡**（大圖示 + 型別標籤 + 到期 chip + `Start now ▸` 大按鈕），其餘是 `.qrow` 小列。`See all ▸` 跳 Assignment List |
| **Optional Practice** | 選做任務，右上顯示獎勵（`+30 ⭐` / `🎁 Chest`）。按 `Pick up` 後就地變成 `Added ✓`（不可重複點）+ toast |
| **Assignment List** | Mandatory / Optional 兩個 seg tab（各帶數量）→ 型別 filter（All / Q&A / Mirroring / Vocabulary / Multiple Choice）→ **Today**（今天到期或逾期）與 **Later** 兩段。Today 空了要顯示 `All clear for today!` 的空狀態，不是留白 |
| **Word Game 等級列** | HSK 0–6 七顆 chip：已過 `⭐`、當前高亮、未解鎖 `🔒`。**可以點進看已完成 / 未解鎖等級的地圖**（只是不能玩）|
| **關卡地圖** | 每列 6 關的**蛇行路徑**（偶數列 `.rev` 反向），節點狀態 `done / current / locked`。地圖下方一行提示會依看的是哪個等級換句（完成 / 鎖住 / 目前進度）|
| **Word Bank** | 與地圖同層的分頁：漢字 · 拼音 · 英文 · 熟練度 ⭐ · 播音。目前是靜態 demo 列 |
| **History** | 四種 filter，每列可展開：逐次分數折線（`log[]`）· 最佳 / 最近分數 · 老師評語 + AI 評語。狀態三型 `practiced` → Not submitted、`submitted` → Waiting、`reviewed` → Reviewed |
| **Mail Box** | 三型（feedback / reminder / announcement），未讀有底色與側邊條，側邊欄 badge 顯示未讀數；feedback 可 `link` 到 History 對應紀錄 |

**Word Game 的等級鎖定邏輯目前與老師端不一致**：學生端用「照進度解鎖」（過了 HSK 1 才開 HSK 2），老師端則把 **Level 2–6 標成 `Coming soon` 全鎖**。正式版請以「內容還沒做完 → 全鎖」為準，兩邊要一致。

---

## Demo 假資料 → API 替換指引

假資料都在 `student-redesign.html` 的 `<script>` 裡：

| 變數 | 結構 | 替換為 |
|------|------|--------|
| `DUE_SOON[]` | `{t, zh, type, due, u}` —— 老師指派的必做練習（`u` = 急迫度 `over/now/soon/ok`）| 學生作業 query（後端算好到期文字與急迫度，或回原始日期由前端格式化）|
| `QUESTS[]` | `{t, zh, type, reward, due, u}` —— 選做任務 | 選做任務 query |
| `MANDATORY` / `OPTIONAL` | 目前直接 = `DUE_SOON` / `QUESTS` | Home 與 Assignment List **必須同源**，正式版也請共用同一份 query 結果 |
| `TYPE{}` | 四種練習型別的標籤 / 色 class / inline SVG | 前端常數即可（不用 API），但標籤文字走 i18n |
| `HSK_LEVELS` / `STAGES` / `curLevel` / `curStage` | `7` / `54` / 目前等級 / 目前關卡 | WG2 既有的 `getWordGame2StageMap` + 該生進度。**`STAGES` 目前寫死 54，實際各 world 關數不同**，要改成由資料決定 |
| `LB[]` | `{name, stars, initials, me?}` | 班級排行榜 query |
| `HIST[]` | `{id, title, zh, type, status, date, best, last, attempts, teacher, ai, log[]}` | 練習歷史 query |
| `MAIL[]` | `{type, ico, from, title, preview, time, unread, link}` | 通知 / 信箱 query |
| `.wg-goal`（靜態 HTML） | 老師指派的 Word Game 目標 | **新的** Word Game 作業 query（與老師端同一張表）—— 需回：目標型別、目標值、Days、到期日、**今日已完成量**、**`reached: Boolean`** |
| `wg_play_time`（localStorage） | `{date, secs}` | 遊玩時間 telemetry（見上方「重點二」）|

GraphQL 層位置：`src/api/graphql/`（`queries/`、`mutations/`）。

---

## 建議放置位置（`dahua-dash` repo）

| 內容 | 目錄 |
|------|------|
| Home / 作業 / 歷史 / 信箱 route | `src/app/student/...` |
| 版面與區塊 | `src/sections/student/...` |
| **Word Game（已有）** | route `src/app/student/word-bank-game/`、版面 `src/sections/student/word-bank-game/` |
| 計時器（接在既有 HUD 上） | `src/sections/student/word-bank-game/components/game-top-bar.js`（現有的 `HoverBadge` 樣式可直接沿用：icon `ic:round-timer`、`iconColor #10B981`、`borderColor #A7F3D0`、label `Play Time Today`）|
| 可複用元件（練習列、型別標籤、到期 chip、目標橫幅）| `src/components/...` |
| i18n | 所有文案走 i18next key |

> 正式 app 的 Word Game 是 **Word Bank Game / WG2**，程式碼只在 `dahua-dash` 的 `origin/develop` 上 —— 動手前先 pull。原型的關卡地圖是示意版，**不要拿它取代已經在跑的 WG2 畫面**；這份原型對 Word Game 的貢獻是「老師目標橫幅」與「計時器」兩塊，其餘（等級列 / 地圖 / Word Bank）以現有 WG2 為準。

---

## 相關文件

| 文件 | 內容 |
|------|------|
| `specs/chinese-modules/teacher-wordgame-spec.html` | **Draft v5 · 設計定案版** —— 目標語意、達標判定、一班一期間、每日結算與時區。**學生端的達標規則以這份為準** |
| `handoff/teacher-wordgame/HANDOFF.md` | 老師端 Word Game 交接（指派 / 管理 / 監控 / 歷史）|
| `specs/chinese-modules/student-game-design-system.html` | 學生端遊戲化設計系統（本原型的 token 來源）|
| `specs/chinese-modules/submit-flow.html` | 練習提交 / 重做 / 送交老師的流程規格（History 畫面對應）|

---

## 交接後的溝通

有設計疑問或不清楚的互動規則，請找設計者確認，不要自行臆測。特別是三件**還沒定案**的事：目標到期後橫幅怎麼呈現、計時器是否只在 min/day 目標時出現、以及學生端等級鎖定要如何對齊老師端的 `Coming soon`。