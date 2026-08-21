# Skip Review — Engineer Handoff

老師在 **To Review** 收件匣裡把「交上來、但決定不批改」的提交一次跳過。

**這不是重寫，是在現有程式碼上加東西。** Teacher Dashboard 已經上線，這一版只加一個入口、一個抽屜、一個新狀態。程式碼基準：`dahua-dash` `origin/develop` @ `1cca25a6`。

- 設計原型：[`skip-review.html`](skip-review.html)（`?skip=1` 直接打開、`&pick=stale` 看已勾選的樣子）
- 完整設計說明與決策理由：[v2 spec](https://project-logeg.vercel.app/specs/chinese-modules/iterations/v2-review-skip/spec.html)
- API 契約：[`API-CONTRACT.md`](API-CONTRACT.md)

---

## 為什麼要做

To Review 只有一個出口：批改完送出。老師沒批，它就永遠留著——線上目前最舊的一筆是 **59 天前**，那些不是「還沒輪到」，是「不會再批了」。

而且 `Send review` 在留言空白時是 disabled，所以「看過了、沒問題、不用回饋」現在**沒有辦法表達**。

> ⚠️ 左欄 Active Assignments 已經有一顆 **Skip**（`Skip assignment`），管的是「**沒交**的人」。這一顆管「**交了沒批**」，兩者不重疊。命名上刻意讓這一側**沒有任何地方只寫 Skip**。

---

## 老師端

### 1. 入口 — `src/sections/teacher/dashboard/review-panel.js`

面板標頭右上加一顆幽靈按鈕 `⃠ Skip review`（白底灰字、hover 轉紅，沿用左欄 Skip 的語彙）。**只在 `activeTab === 'toreview'` 時顯示**，切到 Reviewed 就收起來。

同一支檔案的 `SubmissionCard`：`skipped` 的提交在 `Reviewed` 分頁掛一枚**灰色 `Skipped` 章**，跟真的批過的綠色 `Reviewed` 章區分。

### 2. 抽屜 — 新增 `src/sections/teacher/dashboard/skip-review-drawer.js`

MUI `Drawer anchor="right"`，440px，跟現有的 `review-drawer.js` 同一種開法。

| 元素 | 行為 |
|---|---|
| 清單 | 只列 `!reviewed` 且非 `NO_REVIEW_TYPES` 的提交，**最舊的排最上面**（面板本身由新到舊，最該處理的沉在底部，這裡刻意倒過來） |
| 一列 | checkbox ＋ 學生名 ＋ 班級 chip ＋ 型別 tag／第二行 `練習名 · 天數`。超過 30 天的天數標綠。**整列可點** |
| Select all | 未勾顯示 `Select all (N)`，勾了變 `N selected`，部分勾選是半選狀態 |
| Older than 30 days | 一鍵勾起積很久的 |
| 型別下拉 | 打開時**沿用面板當下的 `typeFilter`**，在抽屜裡還能再改 |
| 底部 | `Cancel` ／ 紅色 `Skip review`，沒勾任何一筆時 disabled。**不掛數字**——數量由左上的 `N selected` 交代 |

**配色**：勾選中的列淺灰 `#f1f5f9`、checkbox 與天數用產品主色綠 `#059669`。**紅色只留給底部那顆按鈕**——在這個畫面裡紅色只代表「按下去會發生不可逆的事」。

**沒有二次確認**：抽屜本身就是那道確認。

### 3. 狀態與送出 — `src/sections/teacher/dashboard/index.js`

跟現有的 `handleSkipConfirm`（左欄）平行加一組，差別是**批次**：

```
onConfirm → skipAssignmentReview({ programId, items: [...], authUser })
          → setSubmissions(勾到的那些 → { reviewed: true, skipped: true, _reviewedAt: now })
          → enqueueSnackbar(`Skipped N submissions — moved to Reviewed`)
```

送出後那些提交**移到 Reviewed 分頁**，To Review 計數下降、Reviewed 上升。契約見 [`API-CONTRACT.md`](API-CONTRACT.md)。

### 4. 批改抽屜 — `src/sections/teacher/dashboard/review-drawer.js`

`skipped` 的提交打開時：顯示灰色 `Skipped`、**不蓋藍色 Reviewed 印章**。

送出按鈕的判斷從 `localReviewed` 改成 `localReviewed && !skipped`，也就是 **skipped 視同「還沒真的批過」**——老師改變心意，打一段留言送出就轉成真的 review、灰章變綠章（送出時一併把 `skipped` 清掉）。

> 這條路就是復原機制，所以**這一版不做 undo**，也不做「退回未批改」。

`Previous / Next student` 不必動——導覽清單本來就不吃分頁，走得到 Reviewed 的項目。

---

## 學生端

老師 skip 掉的那一筆**必須有落點**，否則學生會永遠停在「等待老師批改」——那正是這一版要解的。

線上學生端對應的畫面是 **Completed practice**：`src/sections/student/practice/completed/`。

| 檔案 | 改什麼 |
|---|---|
| `index.js` | attempt 的 mapping 加上 `skipped: attempt.skipped \|\| false`（旁邊就是既有的 `comment` / `aiSummary`） |
| `attempt-accordion.js` / `practice-accordion-item.js` | `skipped` 時：不顯示老師留言區塊，改成一張灰色中性卡，**只寫一行 `No teacher comment`**——不解釋、不道歉 |

其餘**全部照常**：分數、重試次數、AI Summary（`aiFeedbackForStudent` 本來就是自動產生的，跟老師批不批改無關）、以及重新練習的入口。**不要**引進「Skipped」這個字給學生看——被跳過是老師的作業流程，不是學生要學的概念。

> 高擬真的學生端畫面在 redesign 那條線上（[student-redesign.html](https://project-logeg.vercel.app/specs/chinese-modules/student-redesign.html?screen=hist&hist=reviewed&open=global-warming)），**那條線比線上產品早很多**，只當視覺參考，不要照著它的資訊架構改線上程式碼。

---

## 動工順序

| 階段 | 內容 | 可否獨立上線 |
|---|---|---|
| **1** | 後端加 `skipped` 欄位 + 批次 mutation（見 API-CONTRACT） | 可 — 沒人讀就沒有影響 |
| **2** | 老師端：入口 + 抽屜 + Skipped 章 + 批改抽屜的補批 | 可 — 學生端還沒改的話，那些提交只是不再出現在 To Review |
| **3** | 學生端：`No teacher comment` | 可 |

階段 2 上線而階段 3 還沒好，學生端會看到一筆「已提交但永遠沒有回饋」的記錄——跟現況一樣，不會更糟，但**別把 3 拖太久**。

---

## 動工前要先問後端的一件事

一份作業被 `upsertAssignment({ skipped: true })`（左欄那顆 Skip）之後，它**已經交上來的 submissions** 會不會從 `getTeacherAssignmentOverview` 的回傳裡消失？

前端這一側可以確定不會（`handleSkipConfirm` 只 filter `assignments`）。如果後端**會**一起濾掉，這一版要處理的量會少掉一塊，值得先確認再排工。