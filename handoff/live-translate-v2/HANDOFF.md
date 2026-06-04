# Live Translate v2 — Engineer Handoff

## 本次打包範圍

**基礎 + 錄音功能**（S1 開始頁、S2 錄音頁、S4 總結頁）

後續模組將獨立打包：歷史紀錄、單字庫、練習、測驗。

---

## 目錄結構

```
handoff/live-translate-v2/
├── index.html              ← 統一入口（同時包含 Desktop + Mobile HTML）
├── HANDOFF.md              ← 本文件
├── styles/
│   ├── base.css            ← App shell、導航、RWD 斷點
│   └── recording.css       ← S1 開始、S2 錄音、S4 總結
├── js/
│   ├── data.js             ← 假資料（逐字稿、單字、歷史）→ 替換為 API
│   ├── app.js              ← 導航、畫面切換、Toast、RWD 抽象層
│   └── recording.js        ← 語言選擇、計時、波形、逐字稿、單字保存
└── assets/
    └── dh_single.png       ← Logo
```

---

## RWD 斷點

| 斷點 | 佈局 | 導航 | 標題列 |
|------|------|------|--------|
| `> 768px` | Desktop — sidebar + main | `app-sidebar` (88px) | `app-header` (56px) |
| `≤ 768px` | Mobile — 全版 column | `bottom-nav` (76px, M3) | `top-bar` + logo |

CSS 策略：**Desktop first**，`@media (max-width: 768px)` 覆蓋 mobile。

HTML 同時包含兩套導航元素，CSS `display: none` 切換。

---

## JS 載入順序（重要）

```html
<script src="js/data.js"></script>      <!-- 1. 資料 -->
<script src="js/app.js"></script>       <!-- 2. 導航框架 -->
<script src="js/recording.js"></script> <!-- 3. 錄音功能 -->
```

後續模組新增時，在 `recording.js` 之後加入：
```html
<script src="js/history.js"></script>
<script src="js/wordbank.js"></script>
<script src="js/practice.js"></script>
<script src="js/quiz.js"></script>
```

---

## 關鍵抽象：Navigation Abstraction

`app.js` 提供統一的導航 API，自動處理 Desktop / Mobile 差異：

| 函式 | 作用 | Desktop 行為 | Mobile 行為 |
|------|------|-------------|------------|
| `switchTab(tab)` | 切換主頁籤 | 更新 sidebar active | 更新 bottom-nav active |
| `showSubBar(title)` | 進入子頁面 | 更新 header 標題 + 顯示返回鍵 | 切換 topbar 為 sub 模式 |
| `showHomeBar()` | 回到主頁面 | 隱藏返回鍵 | 恢復 topbar home 模式 |
| `showBottomNav()` | 顯示底部導航 | No-op (sidebar 永遠顯示) | 移除 `.hidden` class |
| `hideBottomNav()` | 隱藏底部導航 | No-op | 加入 `.hidden` class |
| `goBack()` | 返回上一層 | 執行 `currentBackAction` | 同左 |

---

## 畫面對照表

### S1 — 開始頁

| 元素 | Desktop | Mobile |
|------|---------|--------|
| Language card | `max-width: 480px` 置中 | 全版 |
| Start button | `max-width: 360px` 置中 | 全版，貼底 (`margin-top: auto`) |

### S2 — 錄音頁

| 元素 | Desktop | Mobile |
|------|---------|--------|
| Transcript blocks | `max-width: 680px` 置中 | 全版 |
| Controls | 置中 | 同左 |

### S4 — 總結頁

| 元素 | Desktop | Mobile |
|------|---------|--------|
| Layout | 左右分欄 (`s4-desktop-layout`) | 單欄堆疊 (`flex-direction: column`) |
| 左欄 | 名稱 + 備註 + 按鈕 | 同左（上方） |
| 右欄 | 已保存單字列表 | 同左（下方） |

---

## 外部依賴

| 資源 | CDN |
|------|-----|
| Public Sans 字型 | `fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700;800` |
| Material Icons Round | `fonts.googleapis.com/icon?family=Material+Icons+Round` |

無外部 JS library — 全部 vanilla JavaScript。

---

## Demo 假資料 → API 替換指引

| `data.js` 變數 | 說明 | 替換為 |
|----------------|------|--------|
| `transcriptData[]` | 逐字稿（en + zh + es） | WebSocket 即時串流或 API 回傳 |
| `wordMap{}` | 可保存單字 + 翻譯 | 後端詞典 API |
| `wordDetails{}` | 單字詳情（詞性、定義、例句） | 後端詞典 API |
| `historyData[]` | 歷史錄音紀錄 | 後端 Session API |

---

## 色彩 Token 速查

| Hex | 用途 |
|-----|------|
| `#059669` | Primary — 主按鈕、active 狀態 |
| `#10b981` | Primary light — gradient、hover |
| `#ecfdf5` | Primary bg — sidebar active、chips |
| `#0f172a` | Text — 主標題 |
| `#64748b` | Text — 次要、muted |
| `#94a3b8` | Text — placeholder、icon |
| `#e2e8f0` | Border — 卡片、分隔線 |
| `#ef4444` | Danger — 停止按鈕、錄音中 |
| `#00B8D9` | Accent — 已保存單字 highlight |
