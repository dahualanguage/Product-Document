# 迭代工作流

這條版本線的基準是**現行產品實際的樣子**——設計稿要對得上 dahua-dash 的程式碼。

> 跟 `versions/` + `teacher-redesign-versions.html` 那條 redesign v0–v12 的線**沒有關係**。那條是探索性質、已經跑在產品前面很多；這條是從現行產品長出來的。兩條各走各的，互不覆寫。

---

## 一句話

**一版 = 一個資料夾。** 要改就複製最新那個資料夾，在複製品裡改，改完它就是新的一版。

```
specs/chinese-modules/iterations/
├── index.html          ← 2.4 卡片指到這裡：所有版本 + 預覽 + change log
├── v1-practice-hierarchy/          ← 已定稿，不再動
│   ├── spec.html                   ← 小 spec：這一版在描述什麼
│   ├── ITERATION.md                ← 來源、範圍、change log
│   ├── choose-practice-type-a.html ← 設計檔（提案 A）
│   └── choose-practice-type-b.html ← 設計檔（提案 B）
├── v2-.../                  ← 已定稿，不再動
└── v3-.../                  ← 進行中（= 沙盒），只有這裡可以改

資料夾命名：v{N}-{功能英文短名}
```

沒有另外一個叫 sandbox 的地方。**編號最大的那個資料夾就是沙盒**，定稿之後它就凍住，再複製一份出來變成下一個沙盒。

---

## 你的四個步驟

### ① 你給網址

你給三樣東西：**① 功能名稱 ② 網址 ③ 截圖**。網址對應到：

```
https://dahua-dash-dev.web.app/<路徑>      →   線上產品（第一版的基準）
https://project-logeg.vercel.app/<路徑>   →   ~/Projects/Product-Document-main/<路徑>
http://127.0.0.1:8765/<路徑>              →   同上（本地預覽）
```

- **第一次**（開 v1）：給**線上產品**的網址（例如 `https://dahua-dash-dev.web.app/dashboard/practice/`）。我先把它登記成一版（資料夾 + `ITERATION.md` + 連結），**不會先動手畫**——等你說要改哪裡再開始。
- **之後**：不用給網址，直接說「開新的一版」，我複製目前最新的資料夾。
- 想從舊版分岔：給那一版的網址，例如 `.../iterations/v2/xxx.html`。

**網址指的是「那一版」，不是「那一頁」。** 就算你只給其中一頁的網址，我也會把同一個資料夾整套複製過去——頁面之間會互相跳頁，只複製一頁的話點下去就 404。

### ② 我開沙盒

建 `iterations/v{N}-{功能短名}/`，裡面放：

- **`spec.html`** — 這一版的小 spec。每個迭代項目都有一份，描述現況、查到的問題、待決事項。用既有的 spec 樣板（麵包屑 `Home / Chinese Modules / 2.4 Versions & Iteration / v{N}` + `On this page` 側欄）。
- **`ITERATION.md`** — 功能名稱、網址、截圖、日期、change log。
- **設計檔** — 你指定的那一頁（不是整套；範圍由你說）。

然後掛上 2.4 版本頁。

**這一步只登記，不動設計。** 要改什麼由你說了算——你講之前我不會自己先做一版。

有設計檔之後，給你本地預覽網址：

```bash
cd ~/Projects/Product-Document-main && python3 -m http.server 8765 --bind 127.0.0.1
```

→ `http://127.0.0.1:8765/specs/chinese-modules/iterations/v3/<頁面>`

### ③ 你在沙盒裡改

改動只發生在 `iterations/v3/`。前面的 v1、v2 和線上其他檔案都不會被動到，所以隨時可以放著不管、隔幾天再回來。

改完存檔就好，**不用另外決定「要不要保留這版」**——資料夾本身就是保留。

### ④ 留 change log

寫在 `iterations/v3/ITERATION.md`，**改一項補一行**，不要等定稿才回想。

```markdown
# v3

- **來源**：https://project-logeg.vercel.app/specs/chinese-modules/iterations/v2/xxx.html
- **分岔自**：v2
- **日期**：2026-08-19
- **這一版在做什麼**：一句話

## Change log

| 端 | 改了什麼 | 說明 |
|---|---|---|
| 兩端 | 標題寫成陳述句 | 一到三句完整的句子，講清楚改了什麼、為什麼。 |
| 老師 | ... | ... |
| 學生 | ... | ... |
```

「端」只有三個值：**老師**、**學生**、**兩端**。每一版的資料夾裡都同時放兩端的檔案，就算這一輪只動老師端——這樣改老師端的時候可以順手開學生端對照該不該跟著動。

### 定稿

你說「這版定了」，我做三件事：

1. 在 `ITERATION.md` 標上定稿日期
2. 把 change log 同步進 `iterations/index.html`（版本清單 + 預覽 + 每版改了什麼）
3. 本地預覽給你確認，你 OK 之後才部署

定稿之後那個資料夾就不再動。下次要改，回到步驟①。

---

## 下次要找東西時

| 我想找 | 去哪 |
|---|---|
| 現在最新的設計 | `iterations/` 裡編號最大的資料夾 |
| 某一版當時長什麼樣 | `iterations/v{N}/` |
| 哪一版改了什麼 | `iterations/index.html`，或該版的 `ITERATION.md` |
| 全部版本一覽 | index 首頁 **2.4 Versions & Iteration** |

---

## 2.4 卡片

已經加在 `index.html` 第 2 區「Chinese Modules」底下（配色接 2.1 藍 / 2.2 綠 / 2.3 橘，用紫 `#8b5cf6`）：

```
2.4   Versions & Iteration
      產品設計的版本線

  All Versions                 iterations/index.html            [New]
  In Progress — v1 Practice    iterations/v1-.../practice-list  [Draft]
```

第 2 區副標同步改成 `Overview → Teacher → Student → Versions`。

`In Progress` 永遠指向目前那個沙盒，每次開新版就更新這一行。

> **2.2 Teacher 卡片裡的 Version History / Design Log 不動。** 那兩頁屬於 redesign v0–v12 那條探索線，跟這條線無關，留在原地才對。（這一點推翻了我原本打算把它們搬進 2.4 的計畫。）

---

## 兩個要你決定的

**A. 資料夾叫什麼。** 目前用的是 `iterations/`，版本資料夾是 `v{N}-{功能英文短名}/`（例如 `v1-practice-hierarchy/`）。叫 `versions/` 不行（已被 redesign 那條線佔走），其他名字都可以，決定了我一次改到底。

**B. 「Workflow」那一列要不要上架。** `index.html` 目前沒有任何 `.md` 連結，Vercel 靜態服務 `.md` 不會 render 成網頁（會變純文字或直接下載）。要掛上去就得把這份文件轉成 `versioning-workflow.html`；不掛的話那一列拿掉，文件只留在 repo 裡。

---

## 附錄：我這邊會處理掉的細節（你不用管）

- **跨頁連結**：整套複製到同一個資料夾，相對路徑自然就通，不用改。老師端側欄集中在一個 `teacher-nav.js` 裡，13 頁共用。
- **圖片路徑**：`assets/` 整個 18 MB（吉祥物 GIF 佔 17 MB），不會每版複製一份；沙盒只帶 shell 檔，圖片改走 `../../assets/`。
- **檔名正規化**：從 redesign 那條線的凍結快照分岔時，`redesign-v{N}-{slug}.html` 要改回通用檔名側欄才找得到。
- **多行 Edit 會失敗**：這些 HTML 檔用 Edit 工具做多行替換常報 "String not found"，改用 `python3` 做 `s.replace()` 並 assert `count==1`。檔案是 LF。
- **不要把這個資料夾放回 iCloud**（Desktop／Documents）。2026-08-06 前它在 Desktop 上被 iCloud 同步，`git status` 要 5 分 16 秒、`vercel deploy` 永遠卡在 `Retrieving project…`。現在放在 `~/Projects/`，Desktop 上是 symlink。
- **部署**：`npx --yes vercel@latest deploy --prod`，走 CLI 直接上傳本機工作檔、不經過 git，所以沒 commit 的改動也會上線。驗證用 CLI 印出的 deployment 專屬網址，不要對 `project-logeg.vercel.app` 連續 curl（會觸發 bot 防護回 403）。