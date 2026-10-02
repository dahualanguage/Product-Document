# v8 — Assign 的指派歷史 ＋ 逾期成績比例

- **功能名稱**：Assign Practice 那一步的兩個新需求（八種 practice 共用）
- **網址**：任一種 practice 建立流程的第四步，例如 https://dahua-dash-dev.web.app/dashboard/practice/create/?type=MIRRORING
- **截圖**：使用者尚未提供
- **分岔自**：v7 的 proposal.html（第四步＝v3／v4 定下來的 Assign 頁面，S8）。殼用 Content Mirroring，**只有第四步**
- **日期**：2026-09-21（登記）
- **設計檔**：`proposal.html`（提案，只有 Assign；`?step=4`）。基準對照 v3 的 `create-mirroring.html?step=2&assigned=1`
- **學生端**（第四十輪）：`student-practice.html`（基準，/student/practice 現行複刻；`?tab=optional`、`&type=<id>`、`&empty=1`）、`student-proposal.html`（提案，同參數）、`student-mock.js`（共用假資料，NOW＝2026-09-19 10:00）
- **程式碼基準**：dahua-dash `origin/develop` @ `5447ca51`（2026-09-21 重新 fetch；從 `7e2afa52` 之後只有 #968 學生端逾期判定改用學校時區，Assign 那步沒動；2026-10-02 交接時 fetch 到 `bcfdaa8d`，Assign 那一步、assignPractice／upsertAssignment／unassignPractice、getAssignments 的 assignHistory 都沒動，只有 updatedArticleArray 多兩個欄位）；Assign 的現況見 v7 spec §2 與 practice-shared 的 S8
- **狀態**：**2026-10-02 定案（第四十九輪）並交接**——使用者說「這個提案通過了」。交接包 `handoff/assign-history/`：`assign-history.html`（＝ proposal.html 的複本，路徑改成絕對）、`student-practice-list.html`（＝ student-proposal.html 的複本）＋ `student-mock.js`、`HANDOFF.md`、`API-CONTRACT.md`（`lateTiers` 每班一個陣列、`assignHistory` 逐輪回、提交時寫 `lateCredit`）、`index.html`。線上（https://project-logeg.vercel.app/specs/chinese-modules/iterations/v8-assign-history/proposal.html?step=4&hist=1 ／ student-proposal.html）在這次部署前仍是 2026-09-30 的第四十輪；第四十一～四十九輪（10/1–10/2）：Remove 改 Unassign；例子改 100 分；FROM 改 AFTER（日期往前一天）；最後一段 and after、一段不寫範圍；分界時間放上來、可以選；AFTER 改成可見的原生 datetime-local 欄位（藏起來的 input 點不開）；CREDIT 的 % 做成看得出能打字；分界時間改了範圍跟著變。需求 1 歷史清單＋Edit／Unassign、需求 2 After the due date、學生端清單都畫完。**PM 四條 2026-10-02 已回**：逾期看 Submit to teacher 那一刻（`submittedDate`）；Optional 不套；Extend due date 回算、存 Original；跟老師手動改分分開。學生端清單已處理好。畫面上的假設（都跟答案一致）：階梯式最多三段；沒有「不收」（最後一段 Score 0 ＝ 算 0）；Optional 不套；沒 Due 不套。Teacher Dashboard／成績頁的 Original／Adjusted 與學生端完成頁另開一版。

## 需求（PM 給的）

1. **assign page 要新增歷史頁面，區分已指派（過期）／指派中。**
2. **逾期成績比例（Late penalty）**：讓老師設定學生在 Assignment Overdue 後完成作業的成績比例。老師可設 Overdue 後的 Grade Percentage，例如 90%，逾期完成的最終成績＝原始成績 × 90%；設定層級是每個 Practice，放在 Assign 那一步；Teacher Dashboard 同時顯示 Original Score 與 Adjusted Score。例：80 分 × 90% ＝ 72。
   - TBD：扣分規則、時機；學生端是否在 Due Date 前看到規則；學生端是否同時顯示 Original 與 Adjusted。

## 現況

- 第四步上面 ASSIGNED 一個班一張卡：Start／Due、Edit／Cancel。沒有「過期」的概念，Due 過了長得跟進行中的一樣。「過期」不用新欄位：現在時間 > dueTime。
- 沒有逾期成績比例；Due 過了學生端還是能做、成績照算。

## 目前的樣子（2026-10-02，第四十九輪）

- **HISTORY · N**：標題旁 In progress｜Past due 切換（選中實心綠）；右端 Hide／Show 摺疊鈕，收起只剩標題＋一句摘要（*2 in progress · 4 past due*）；一個 tab 超過 5 列先列 5 列、底下 *Show all N*。一列＝標籤欄 MANDATORY（綠）／OPTIONAL（藍）｜班級＋N students｜Sep 10 → Sep 25 ＋ due 23:59（過期寫 ended …，整列灰）＋ late work 90%｜Edit／Unassign 或 Extend due date／Unassign。
- **Edit**：只限那一班的對話框。WHO 收合（All 6 students ＋ Change students）、WHEN Start／Due ＋ +1／+3／+7、HOW IT COUNTS 同新指派卡（選項卡＋階段表，格子縮窄、範圍淡字不放）。Review changes 只列有改的（Late work 寫 *Sep 18–19 90% · Sep 20–23 80% · Sep 24 and after 0%*），再 Save changes。
- **Unassign**（第四十一輪前叫 Remove）：*Unassign Chinese 4A?* ＋ 講清楚錄音與成績會被刪；Keep it／Unassign Chinese 4A。
- **NEW ASSIGNMENT** 一張卡：WHO（班級列只有班名＋ Assigned pill／Choose students，無副標）／WHEN／HOW IT COUNTS。HOW IT COUNTS 是兩段選項卡：**TYPE** Mandatory（*Sends reminder emails*）｜Optional；**AFTER THE DUE DATE · Due Sep 17, 23:59** Full credit｜Reduced credit。Optional 時 AFTER THE DUE DATE 整段不出現；Mandatory 沒 Due 才淡掉＋ *Set a due date to use this*。
- **Reduced credit 的階段表**（三欄小表，最多三列、預設一列）：**AFTER**＝可見的原生日期＋時間欄位（跟 Start／Due 同一種；值是「這段從它之後開始」的分界：日期＝這段第一天的前一天、第一段是 Due 當天；時間預設跟 Due，可改）＋淡字範圍（兩段以上才寫：*Sep 18–19*、最後一段 *Sep 24 and after*；分界時間不是 Due 的時刻就寫到分 *Sep 18–Sep 19 12:59*）；**CREDIT**＝算幾成（步進器 ±5，中間的數字可以直接打、Enter 套用、夾在前後段之間），最後一段多一顆 Score 0（＝0%）；**100 BECOMES**＝例子（90／80／0）；第二、三列可 ×；表尾 Add a stage · up to 3。資料 `lateTiers:[{days, off, time?}]`，Due 改了日期跟著平移。沒有截止日。
- **學生端清單**（student-proposal.html）：Mandatory 且 Reduced credit 的列，右側一塊字——到期前 *Late work counts 90%*（info 藍）、過期 *Now counts 90%*（warning 珊瑚），第二行後面幾段「數字 from 日期」。

## 提案怎麼看

| 網址 | 看到什麼 |
|---|---|
| `?step=4` | 還沒指派過：跟 v4 一樣 |
| `?step=4&hist=1` | 派過六次：HISTORY 清單，In progress · 2（3B 過期後又派一次、4A Optional）；每列 班級 · 類型 ＋ N students｜Sep 10 → Sep 25 ＋ due 23:59｜Edit／Remove；標題旁 In progress｜Past due 切換，預設看進行中 |
| `?step=4&hist=1&histclosed=1` | History 收起：只剩標題、摘要、Show 鈕 |
| `?step=4&hist=1&past=1` | Past due · 4：跨學期，去年的帶年份（Nov 3, 2025 → Nov 10, 2025）；整列灰、第二行 ended Sep 8, 23:59｜Extend due date／Remove |
| `?step=4&hist=1&pick=5c&review=1` | 再指派一班到 Review |
| `?step=4&hist=1&edit=1` | 進行中那列按 Edit：對話框只限那一班——Who（學生可取消勾選，標 Will remove）／When（Start、Due、+1／+3／+7）／How it counts；沒改東西時 Review changes 灰掉 |
| `?step=4&hist=1&edit=1&stage=review` | Review changes：只列有改的——Students being removed · 1、Schedule and type 的 Due 前後值；Back／Save changes |
| `?step=4&hist=1&past=1&edit=2` | 過期那列按 Extend due date：同一個對話框，副標 *Ended Sep 8, 23:59. A later due date reopens it for the class.*；存完那列回到 In progress，tab 跟著切 |
| `?step=4&hist=1&pick=5c&late=reduced` | 需求 2（第三十九輪起是三欄小表 FROM｜CREDIT｜80 BECOMES）：HOW IT COUNTS 第二列 **After the due date**，選 Reduced credit，底下一條 *1. Late by [1] 📅 day (= Sep 18) · −[10]% [Score 0]* ＋ Add a stage；上面歷史列 3B 的 due 後面接 *late work −10%*。demo 一律從一條規則開始（第三十二輪）；要看三段自己按 Add a stage，或帶 `&tiers=1:10,3:20,7:100`。`&late=reduced` 不帶 `tiers` ＝ 一段 −10%；舊的 `&pct=80` 仍可用（＝一段 −20%） |
| `?step=4&hist=1&pick=5c&kind=optional` | Optional 時 AFTER THE DUE DATE 整段不出現 |
| `?step=4&pick=5c&nodue=1` | Mandatory 但沒 Due：那一列灰掉，*Set a due date to use this.* |
| `?step=4&hist=1&edit=0` | Edit 對話框的 How it counts 也有這一列（3B 進行中是單段 −10%）；對話框窄，例子換到第二行、× 在右端；改了就進 Review 的 Late work 前→後（*−10% from day 1 · −20% from day 3 …*） |
| `?step=4&hist=1&rm=1` | Unassign：確認框，講清楚 6 個學生的錄音與成績會被刪、不能復原；Keep it／Unassign Chinese 4A |

## 需求 2 要先對的（2026-09-21 對過程式碼之後）

### 程式碼已經答了，不用問

| 原本要問 | 程式碼怎麼說 | 對設計的意思 |
|---|---|---|
| 逾期後學生還能不能做 | 能。學生端只掛 `Overdue · Nd` chip（`student/game-ui/utils.js`），沒有任何地方擋作答；逾期用**學校時區**判（#968） | 「逾期後完成」是真實路徑，規則有東西可套 |
| 「完成」是哪一刻 | 八種都有明確的 **Submit to teacher**，寫 `isSubmitted`／`submittedDate`／`submittedScore`；另有 `lastDate`（最後一次作答） | 「逾期」有時間戳可比，但要 PM 選哪一個（見下） |
| 成績長什麼樣 | 0–100 ＝ 星星 × 20（`getScorePercent`）；MC 直接 `mcResult.score` | 80 × 90% ＝ 72 直接算得出來 |
| 老師能不能改分 | **已經能**：`overrideScore`（0–100）蓋過系統分，成績頁顯示琥珀 pill **Adjusted**、可 *Revert to system*（`score-override-control.js`） | PM 的「Adjusted Score」跟現有的 Adjusted 撞名，要重新命名（見下） |
| Optional 有沒有 Due | **一定有**：沒填就自動 start ＋ 30 天（`resolveOptionalDates`），Optional 跟 Mandatory 的差別只有不寄提醒信 | Optional 的 Due 常是老師沒意識到的系統值，套逾期扣分會莫名其妙 |
| Mandatory 有沒有可能沒 Due | **有**：只有 Optional 擋清空 Due，Mandatory 可以 *No due date* | 沒 Due 的時候控制項要灰掉，寫一句 *Set a due date to use this*——設計上處理，不用問 |
| 比例存在哪一層 | `upsertAssignment` 只有 `startDate／expiredDate／isOptional／skipped`，日期跟 Optional 都是**每班一筆 assignment** | 比例跟日期一樣是每班的欄位；這一輪共用一個值、Set dates per class 時可各自設 |

### 問 PM 的（2026-10-02 已回，答案都跟畫面上的假設一致）

1. ~~**固定比例還是逐日遞減？**~~ **使用者 2026-09-24 定了：階梯式、最多三段**（例：1 天後扣 10%）。不是逐日遞減——每一段「From day n · deduct x%」，一段的扣分一直用到下一段開始；day 1 ＝ Due 過後的第一天。還要 PM 確認的只剩「第 n 天」怎麼算（照學校時區的日曆日？跨 23:59 就算下一天？），跟問題 2 綁在一起。工程的欄位從一個 `latePct` 變成一個陣列（每班最多三筆 `{days, off}`）。
2. **逾期看哪個時間？** Submit to teacher 那一刻（`submittedDate`），還是最後一次作答（`lastDate`）？有學生做完不按 Submit。建議：有 Submit 用 `submittedDate`，沒 Submit 用 `lastDate`。**PM 2026-10-02 定了：Submit to teacher 那一刻（`submittedDate`）。** 沒按 Submit ＝ 沒交，沒有成績可扣，`lastDate` 不用。
3. ~~**0% 是不是「逾期不收」？**~~ **2026-09-24 定了：不是鎖，是算 0。** 學生端從來不鎖、產品沒有「不收」，所以第十八輪加的 Accept until 拿掉了；老師要「等於不收」就把最後一段設 −100%。要鎖住學生端是另一個功能，另外估。
4. **Optional 套不套？** 因為 Optional 的 Due 多半是系統自動填的 30 天，**改建議不套**：Optional 時這一列灰掉，寫 *Optional work is never marked late*。（先前建議「一樣套」，看了 `resolveOptionalDates` 之後改。）**PM 2026-10-02 定了：不套。**
5. **事後 Extend due date 要不要回算？** 建議回算——存 Original，Adjusted 每次用當下的 Due 算，延長就自然回復。這跟工程「算還是存」是同一題。**PM 2026-10-02 定了：回算——存 Original，Adjusted 用當下的 Due 算。**
6. **跟老師手動改分的關係。** 老師改分（`overrideScore`）是改 Original 再扣，還是直接定最終分？建議直接定最終分、蓋過扣分（老師手動 ＝ 最後決定）。成績頁的標籤不能再叫 Adjusted，建議 **Late · ×90%**。**PM 2026-10-02 定了：分開。** 老師改分與逾期扣分是兩件事：各自一個欄位、各自一個標籤（*Adjusted*／*Late · ×90%*），老師改過的分數不再乘逾期成數。
7. **學生端**：Due 前就在開始頁寫一句 *Late work counts 90%*？完成頁 Adjusted 為主、Original 小字？（維持原建議。）**2026-10-02：學生端已處理好**——清單頁（第四十輪）照做；完成頁跟成績頁一起另開一版。

### 仍要問工程

- `upsertAssignment` 加一個欄位（每班），0–100，`null` ＝ 全額；跟 `isOptional` 同層。
- Adjusted 是後端存還是前端算？建議後端存 Original ＋ 逾期與否，Adjusted 用當下 Due 算（配合問題 5）。
- ~~「不收」如果是鎖住學生端，是新行為，要另外估。~~ 已不在這一版：沒有截止日、不鎖學生端。
- Teacher Dashboard 的 Original／Adjusted 是成績頁，不在這四步裡，要另開一頁畫。

### 對完之後怎麼畫（預設走向）

固定比例＋Optional 不套：HOW IT COUNTS 多一列 **After the due date** · `Not accepted｜Full credit｜Reduced credit` ＋ `[− 90 + ] %` ＋ 例子 *80 → 72*；Optional 或沒 Due 時整列灰掉各寫一句。HISTORY 的列在班級那行多一顆小字 *Late ×90%*。

## Change log

<!-- 只記 UX——流程、語意、互動、命名；純視覺替換不進這張表，逐輪的視覺改動在 proposal.html 檔頭註解。 -->

| 端 | 改了什麼 | 說明 |
|---|---|---|
| 文件 | **第五十一輪：PM 四條回了** | 2026-10-02。逾期看 Submit to teacher 那一刻（`submittedDate`）；Optional 不套；Extend due date 回算（存 Original、Adjusted 用當下 Due 算）；跟老師手動改分分開（各自欄位、各自標籤，改過的分數不再乘）；學生端清單已處理好。四條都跟畫面上的假設一致，設計沒改；交接包的 HANDOFF.md／API-CONTRACT.md 同步改成「已定」。 |
| 文件 | **第五十輪：定案、交接** | 2026-10-02。使用者說「這個提案通過了」。交接包 `handoff/assign-history/`（老師端＋學生端原型複本、HANDOFF.md、API-CONTRACT.md）；index 卡片狀態改 done、第一顆鈕改成交接包。設計沒改。 |
| 老師 | **第四十九輪：分界時間改了，範圍的日期跟著變** | 使用者指出（2026-10-02：把第二段改成 Sep 19 12:59，右邊仍寫 *Sep 20–23*）。範圍＝「這段的分界」到「下一段的分界」：分界時間跟 Due 一樣（23:59）才能用「隔天起」的日期寫法；時間不一樣就寫到分——第一段 *Sep 18–Sep 19 12:59*、第二段 *Sep 19 12:59–Sep 23*。歷史列與 Review 的句子同一套。 |
| 老師 | **第四十八輪：CREDIT 的 % 做成看得出能打字** | 使用者指示（2026-10-02：「% 數也支援手打」）。欄位本來就能打（第二十五輪），但只有 20px 寬、沒有邊框、看起來像純文字，沒人會去點。改成固定 3 字寬、滑上去淡灰底、游標 text，點 % 那一格任何地方都聚焦並全選，Enter 套用（跟離開欄位一樣）；仍夾在前後段之間。天數欄沒有了（第三十八輪起日期是欄位），所以只剩這一處。 |
| 老師 | **第四十七輪：AFTER 改成可見的原生日期＋時間欄位** | 使用者說「現在都沒辦法選擇」（2026-10-01）。第四十二輪靠 `showPicker()` 開日曆，不是每個瀏覽器都會跳（datetime-local 尤其），再加上 input 藏起來、點不到就什麼都不會發生。改成跟 WHEN 的 Start／Due 同一種**可見的原生 datetime-local 欄位**（縮成 32px）：點進去用瀏覽器自己的日期、時間控制項，Chrome 有日曆彈窗、Safari 是逐段輸入，都一定能改。代價是顯示格式交給瀏覽器（2026/09/17 下午11:59），不再是 *Sep 17 · 23:59* 的 pill；範圍淡字（Sep 18–20）留著。 |
| 老師 | **第四十六輪：分界的時間也可以選** | 使用者指示（2026-10-01：「時間也可以選」）。pill 點開的是日期＋時間（datetime-local）：日期仍換算成 Due 後第幾天，時間存成這一段自己的 `time`，沒設就跟 Due（23:59）。右邊的範圍淡字維持到日為止（Sep 18–20），時間只在 pill 上。工程欄位：每段 `{days, off, time?}`。 |
| 老師 | **第四十五輪：AFTER 的 pill 把時間放上來** | 使用者指示（2026-10-01：「讓時間的限制也放上來」）。pill 寫 *Sep 17 · 23:59*——每一段的分界都是 Due 的那個時刻（Due 之後第 n 天的同一時間），所以時間跟 Due 走、不另設；日曆仍只選日期。段頭小標的 *Due Sep 17, 23:59* 留著。 |
| 老師 | **第四十四輪：範圍淡字一段不寫、最後一段 and after** | 使用者問「Sep 18 onward 是什麼意思」（2026-10-01）。它是這一段涵蓋的日期範圍、最後一段沒有結束日——但只有一條規則時它跟 *After Sep 17* 是同一件事，像多講一次；onward 也不夠白話。改成：只有一段時不顯示範圍；多段時前面的段寫 *Sep 18–19*，最後一段寫 *Sep 24 and after*。歷史列與 Review 的句子同步（*Sep 24 and after 0%*）。 |
| 老師 | **第四十三輪：欄頭 FROM 改 AFTER** | 使用者問「如果改成 After 可以嗎」（2026-10-01）。可以，但日期要跟著往前一天：AFTER 的日期＝這段第一天的前一天，第一段就是 Due 當天（*After Sep 17*），右邊淡字改成這段實際的範圍（*Sep 18–19*／*Sep 20–23*／*Sep 24 onward*），所以意思跟 FROM 版完全一樣、不會差一天。選日期時換算成 days ＝ 選的日期 − Due ＋ 1。這是把第三十八輪「After 日期」的講法接回第三十九輪的表格。 |
| 老師 | **第四十二輪：例子改 100 分；日期 pill 修成可以點** | 使用者指示（2026-10-01：「80 分改成 100」「日期現在不能點」）。①欄頭改 *100 becomes*，例子 90／80／0——100 × 90% ＝ 90 一眼看得出成數，80 → 72 還要算。②FROM 的日期 pill 之前點不開日曆：透明的 date input 蓋在 pill 上，點到的是它的月／日文字段、不是右端的日曆小圖，瀏覽器不會跳出日曆。改成 pill 自己接 click 呼叫 `input.showPicker()`（Chrome 99＋、Safari 16＋；舊瀏覽器退回 focus），input 設 `pointer-events:none`。選了日期仍走原本的 change → 換算成 Due 後第幾天。新指派卡與 Edit 對話框同一條。 |
| 老師 | **第四十一輪：Remove 改叫 Unassign** | 使用者指示（2026-10-01）。歷史列的動作、確認框標題（*Unassign Chinese 4A?*）與確認鈕（*Unassign Chinese 4A*）、狀態列入口一起換——跟產品 ConfirmDialog 本來的「Unassign class」同一個字，也跟 WHO 那段的 Assigned pill 對得起來。Edit 的 Review 裡「Students being removed」是學生名單的事、階段表的 × 是刪一段，不是同一件事，維持原字。 |
| 學生 | **第四十輪：學生端看得到逾期規則（/student/practice 清單）** | 使用者指示（2026-09-30：「這個會連動學生端也會要知道規則」），PM 問題「學生端是否在 Due 前看到規則」由使用者定為**要**。新開兩支檔：`student-practice.html`（基準，照 list/index.js＋practice-row.js 複刻，殼抄 student-redesign.html）、`student-proposal.html`（提案），假資料共用 `student-mock.js`。提案只動 Mandatory 且老師選了 Reduced credit 的列。同一輪走了三步：先做 DUE CHIP 後一顆膠囊（*Late work 90%*／過期 *Counts 80% now* ＋ 標題下階段列）；使用者問文法（Late work 90% 少動詞）、再問「不用膠囊呢」、再說「字放大擺在右側」——定案：**不用膠囊，規則是列右側、按鈕左邊的一塊字**：第一行 14px 粗體＝現在的規則（到期前 *Late work counts 90%* 琥珀；過期 *Now counts 90%* 珊瑚），第二行 12px＝後面幾段，語序一律「數字 from 日期」（到期前 *then 80% from 20 Sept · 0% from 24 Sept*；過期 *80% from 20 Sept · 0% from 24 Sept*）。一段規則只有一行；列的高度不變。第一行前面一顆實心 icon（到期前 info 藍 #2563EB，過期 warning 珊瑚）。膠囊版留 `&style=chip` 當對照。**2026-09-30 儲存這一版。**Optional 與 Full credit 的列什麼都不加。規則資料＝老師端 lateTiers 同一份。日期格式跟到期 chip 一樣走 en-NZ（18 Sept）。**沒做**：練習完成頁的 *Submitting now counts 80% · 80 → 64*、History 的 Original／Adjusted——下一步。側欄六個項目的字是照 nav keys 推的，待實機截圖對。 |
| 老師 | **第三十九輪：階段表改成三欄小表 FROM｜CREDIT｜80 BECOMES（方案 C）** | 使用者要幾個提案（2026-09-30）。探索稿 `late-options.html` 並排四種：A 句子列（現況）、B 時間軸（一段一格、格寬＝天數、顏色跟成數走）、C 表格、D 先選常見規則再微調。使用者選 **C**。每列：FROM＝這段第一天的日期 pill（點了開小日曆，改日期＝改 Due 後第幾天）＋淡字 *to Sep 19*／*onward*，範圍就在列上，不用再講「以後」；CREDIT＝算幾成的步進器（90%），最後一段多一顆 Score 0；80 BECOMES＝例子（72／64／0），擋乘減的歧義；× 移除（第一段不能移）；表尾 Add a stage。第三十八輪那句「After 日期 (day n) · × 90%」退場——表格靠欄頭講清楚，不需要一句話的文法。歷史列與 Review 改寫成 *Sep 18–19 90% · Sep 20–23 80% · Sep 24 onward 0%*。對話框同一張表。資料模型不變。B 留著給 Teacher Dashboard 顯示用參考。 |
| 老師 | **第三十八輪：階段表改成 After [日期] (day n) · × 90% · 80 → 72** | 使用者問「文法現在對嗎」（2026-09-30）。第二十八輪的 *Late by 1 day* 讀起來是「剛好晚一天」，把「以後」講丟了；*−10%* 在 0–100 分上有乘減歧義（80 → 72 還是 70），例子在第二十八輪被我拿掉之後沒東西擋。討論過 Late 1+ days／From day 1／After Sep 17，使用者選 **After**（日期領頭，天數退到括號），扣幾 % 改成**算幾成**（× 90%），例子 80 → 72 放回來。日期 pill 本身就是控制項（小日曆改日期＝改 day n），天數步進器拿掉。Score 0 ＝ × 0%。歷史列寫 *late work 90% → 80% → 50%*，Review 同一句。資料模型不變（仍存 off）。 |
| 老師 | **第三十七輪：HOW IT COUNTS 改成選項卡** | 使用者指示（2026-09-29：「How it counts 按鈕改成跟 Vocabulary Quiz 一樣的設計邏輯」）。Mandatory｜Optional 與 Full credit｜Reduced credit 從分段控制項改成 v6 第三十七輪那種選項卡：TYPE／AFTER THE DUE DATE 各一段小標＋兩張卡（icon 方塊＋標題，選中＝綠外框＋淡綠底，照產品 function-selector.js 的可點 Card）。副標整段只留一句——Mandatory 的 *Sends reminder emails*（寄提醒信是兩種的唯一實質差別，標題看不出來）；Optional／Full credit／Reduced credit 只有標題。Reduced credit 時階段表接在卡下面；Optional 時整段**不出現**（使用者：「不用變淺，直接隱藏」——Optional 從來不算逾期，沒有東西可設）；Mandatory 但沒 Due 才淡掉、小標旁寫 *Set a due date to use this.*。新指派卡與 Edit 對話框同一套。 |
| 老師 | **第三十六輪：New assignment 的提示句拿掉** | 使用者指示（2026-09-29：「拿掉 One round: the classes below share these dates and this rule」）。眉標右邊那句（第二／四輪加的，還沒歷史時寫 *Who, when, and how it counts*）整個拿掉——WHO／WHEN／HOW IT COUNTS 三個小標已經說明這張卡是什麼，不用再解釋一次。 |
| 老師 | **第三十五輪：WHO 的班級列不用副標** | 使用者指示（2026-09-29：「這裡不用副標」）。拿掉 *8 students · did this before, ended Sep 8, 23:59*、*Everyone is assigned*、*n of N assigned · left* 三種副標：派過的事 History 已經講了（第一輪的「did this before」跟歷史清單重複），人數在覆核對話框與 Choose students 名單都看得到。列只剩班名 ＋ Assigned pill／Choose students。 |
| 老師 | **第三十四輪：History 可以收合** | 使用者指示（2026-09-29：「History 可能會很多所以要可以收合」）。眉標右端一顆 Hide／Show：收起時列表整個藏起來，標題旁的切頁換成一句摘要 *2 in progress · 4 past due*，New assignment 直接往上靠。另外同一個 tab 超過 5 列只先列 5 列（新的在上），底下 *Show all N*——長期用下來 Past due 會累積幾十筆，預設不該把整頁撐長。預設展開。 |
| 老師 | **第二十九輪：小日曆 icon ＋ Score 0 鈕** | 使用者指示（2026-09-29：「天數旁邊新增一個小日曆 icon，可以用日曆選」「扣分旁邊增加一個 0 分按鈕」）。①天數步進器右邊一顆 30px 日曆 icon，上面蓋一個透明的原生 date input：點 icon 開日曆，選了日期換算成 Due 後第幾天（夾在前後段之間），天數欄與括號日期跟著變——想用天數打、想用日期選都可以，存的仍是天數。②扣分步進器右邊一顆 **Score 0**：按了 ＝ −100%（逾期做了算 0 分），按下狀態綠框；只有最後一段能按（中間段設 0 會讓後面的段沒意義），前面的段灰掉、tooltip 說 *Only the last stage can score 0*。 |
| 老師 | **第二十八輪：一句話的文法，預設只有第一條** | 使用者指示（2026-09-29：「先預設只有第一條」「文法應該是 1. 遲交 X 天（＝Y 天日期）扣 N 分」）。列改成 *1. Late by [3] days (= Sep 20) · −[20]%*：主詞是「遲交幾天」（回到可打字的數字欄），日期只是括號裡的換算，扣的百分比在句尾。第二十六輪的日期選擇器與第二十七輪的 80 → 72 例子都拿掉——一句話講完就不再加東西。Reduced credit 一選只出現第一條，要更多再 Add a stage。Review 與覆核副標用同一句文法：*late by 1 day (= Sep 18) −10% · late by 3 days (= Sep 20) −20%*。 |
| 老師 | **第二十七輪：字減到最少** | 使用者指示（2026-09-29：「現在太多文字了，簡單好懂一點」）。列上只留看得懂規則的最少字：*STAGE 1 · From [Sep 18] +1 day · −[10]% · 80 → 72*——拿掉 deduct、*day n after the due date (Sep 17)*、*a score of 80 becomes*。Due 只在副標寫一次（*Due Sep 17, 23:59*），不再每列重複；副標也不再複述三段的規則（列本身就是規則）。Full credit 的副標改成 *Late work counts in full.*。Review 與覆核副標仍講日期（*−10% from Sep 18 · …*），那裡沒有列可看。 |
| 老師 | **第二十六輪：階段起點直接選日期，旁邊標注原本的 Due** | 使用者指示（2026-09-29：「日期加減改成直接選日期，然後標注原本的日期」）。「From day [− n +]」換成 date 選擇器（選這一段從哪一天開始），右邊小字 *day 3 after the due date (Sep 17)*——Due 一直看得到，老師選日期時不用心算。資料上仍存「Due 後第幾天」：Due 改了三段的日期自動平移，不會出現階段早於 Due；選到前後段範圍外的日期會夾回去（選擇器的 min／max 也照這個限制）。副標與 Review 改講日期：*−10% from Sep 18 · −20% from Sep 20 · −50% from Sep 24 · due Sep 17, 23:59*；歷史列維持 *−10% → −20% → −50%*（各班 Due 不同，列上講日期會太長）。 |
| 老師 | **第二十五輪：扣分的 % 可以自己打** | 使用者指示（2026-09-24：「% 數欄讓老師可以自己打」）。步進器中間從純文字改成 number input（−／＋ 仍每次 5），打完離開欄位就套用；超出前後段範圍（前一段 +5 ～ 後一段 −5，最後一段到 100）會夾回去，打非數字就還原。天數欄維持步進器。 |
| 老師 | **第二十四輪：拿掉 Accept until** | 使用者問「現在系統沒有不接受這個流程，所以應該不會有 Accept until？」（2026-09-24），對：學生端從來不鎖（只掛 Overdue chip），「收到哪天為止」在產品裡不存在，第十八輪是照 Canvas 的 Until 畫的、一直是要工程新做的鎖定。有了階段表之後它更多餘——最後一段的扣分一直用下去就是規則本身。所以拿掉：面板只剩 Full credit｜Reduced credit ＋ 階段表；歷史列、覆核副標、Review 都不再有 *until …*；扣分上限 95% → **100%**（最後一段 −100% ＝ 做了算 0 分，這就是「等於不收」，也回答了 PM 問題 3）。要鎖學生端是另一個功能。第十八～二十一輪的紀錄留著。 |
| 老師 | **第二十三輪：扣分改成最多三階段** | 使用者指示（2026-09-24：「重新設計 How it counts 面板，最多要有三階段的扣分機制，例如 1 天後扣 10%」）。Reduced credit 不再是一個百分比，而是一張**階段表**：每段 *From day [n] · deduct [−x%]*，最多三段、Add a stage 加、Stage 2／3 可移除；一段的扣分用到下一段開始，day 1 ＝ Due 過後的第一天（副標寫明）。用「扣 x%」不用「算 x%」——跟使用者的說法一致，也跟成績頁將來的 *Late · −10%* 標同一個字。步進器把天數與扣分夾在前後段之間，不會出現後段比前段輕的表。Accept until 照舊。歷史列與 Review 改寫成 *−10% → −20% → −50%*／*−10% from day 1 · −20% from day 3 · −50% from day 7*。這一輪把 PM 問題 1（固定或遞減）收掉；工程欄位從一個數變成最多三筆的陣列。 |
| 老師 | **第十九輪：拿掉 Not accepted** | 使用者指示（2026-09-21：「不用 Not accepted 這個選項」）。三段收成兩段 `Full credit｜Reduced credit`；「逾期不收」不再是一個選項，而是把 Accept until 設在 Due 當天或不延——一個日期講完「收到哪天」，比一顆按鈕加一個日期少一層。歷史列不再有 *late work not accepted*。 |
| 老師 | **第十八輪：逾期收件截止日** | 使用者指示（2026-09-21：「增加可以設定日期」），解讀成 Google Classroom／Canvas 的 Until：Due 過了還收到哪一天。Full credit／Reduced credit 時多一行 **Accept until** [日期] ＋ +3／+7／+14 days（從 Due 起算）＋ *No cutoff*；留空＝一直收（提示 *Leave empty to accept late work any time.*）。有截止日時說明尾巴接 *Not accepted after Sep 24, 23:59.*；Not accepted 沒有這一行。歷史列寫 *late work 90% until Oct 9*、全額但有截止寫 *late work accepted until …*；Edit 的 Review 列 *Late work · 90% credit → 90% credit until Oct 9*。 |
| 老師 | **第十七輪：需求 2 逾期成績比例第一版** | 使用者指示（2026-09-21：「可以設計另一個計分的了」），PM 七條未正式回，照「預設走向」畫，假設寫在狀態列。HOW IT COUNTS 多一列 **After the due date**：三段 `Not accepted｜Full credit｜Reduced credit`，預設 Full credit（＝現況：過期照算），Reduced 才出現 [− 90% + ]（5–95、每次 5）與例子 *80 becomes 72*；Not accepted 寫 *Students can’t submit once the due date has passed.*（學生端鎖住，是新行為）。**Optional 不套**（列灰掉：*Optional work is never marked late.*）、**沒 Due 不套**（*Set a due date to use this.*）。同一列也出現在 Edit 對話框，改了在 Review 列 *Late work · Full credit → 90% credit*；歷史列 due 後面接 *late work 90%*／*late work not accepted*，全額不寫；Assign 的 Review 頁副標一樣帶。Teacher Dashboard 的 Original／Adjusted 另開一頁，這裡沒畫。 |
| 老師 | **第十三輪：歷史列的 Edit／Remove 做出來** | 使用者指示（2026-09-21：「edit 跟 remove 的頁面也做出來」）。照產品 `step-three.js`／`assign-practice.js` 的現況：**Edit** 開只限那一班的對話框（editMode），Who 可加減學生、When 改 Start／Due、How it counts 改 Mandatory／Optional，按 **Review changes** 進覆核頁只列有改的（Students being added／removed、Schedule and type 前→後），再 **Save changes**；沒改東西時 Review changes 灰掉。過期列的 **Extend due date** 開同一個框，副標講「延後 Due 會重新開放」，存完那列回到 In progress、tab 跟著切過去。**Remove** 照產品 ConfirmDialog「Unassign class」（會刪學生紀錄）改寫成 *Remove this practice from Chinese 4A?* ＋ 講清楚 N 個學生的錄音與成績會被刪、不能復原；按鈕 Keep it／Remove from Chinese 4A。 |
| 老師 | **第七輪：歷史列改成班級領頭，拿掉交件數** | 使用者指示（2026-09-21：討論列的排法，A 班級領頭／B 日期領頭／C 表格，選 A；「submitted 不用在這邊顯示」「不用先 demo 只有部分學生被指派」）。列改成三欄：**班級 · Mandatory／Optional ＋ N students**｜**Sep 10 → Sep 25 ＋ due 23:59**（過期寫 *ended Sep 8, 23:59*、整列灰）｜Edit／Remove 或 Extend due date／Remove。拿掉：交件數與 *didn’t finish*（成績是成績頁的事，這裡只管派了誰、什麼時候）、狀態點與 Ended pill（tab 已經分組，不再重複講）、Mandatory／Optional 從 pill 降成班級名旁的小字（屬性不是狀態）。歷史一律整班，不 demo 部分學生。 |
| 老師 | **第四輪：New assignment／When／How it counts 收成一張卡** | 使用者指示（2026-09-21：「設計成看得出來是一次性設定」）。原本三段各自一條眉標一張卡，跟上面的歷史長得一樣，看不出這三段是「這一次指派」的一組設定。改成一條眉標 **NEW ASSIGNMENT**（提示 *One round: the classes below share these dates and this rule*）＋ 一張卡，卡裡左欄小標 WHO／WHEN／HOW IT COUNTS，右欄是原本的內容，段與段之間一條線。按 Assign 之後這張卡清空、上面 HISTORY 多一列。 |
| 老師 | **第三輪：上面改成歷史清單，上下一眼分得出新舊** | 使用者指示（2026-09-21：「上面改成更像 history 頁，上下看得出來新舊」）。原本上面是一班一張卡，長得跟下面的表單一樣。改成 **HISTORY · N** 一個清單：一列一筆，左邊日期範圍＋狀態點（綠＝進行中、灰＝過期）、中間班級＋Mandatory／Optional＋（過期）Ended pill＋進度、右邊 Edit／Remove 或 Extend due date／Remove；過期整列灰字；新的在上。In progress｜Past due 切換留在眉標右邊。下面 **NEW ASSIGNMENT** 還是勾班的表單。 |
| 老師 | 第二輪：WHO DOES IT 改叫 NEW ASSIGNMENT | 討論了班級列副標的四種寫法（A 統一文法／B 歷史改成 pill／C 這裡不講歷史）之後，使用者只要改眉標（2026-09-21）：上面那段是已經指派的（ASSIGNED），下面這段是這一次要指派的，叫 **NEW ASSIGNMENT** 兩段就分開了；右邊提示改成 *Pick the classes for this round · it gets its own dates*。副標先不動。 |
| 老師 | **第一輪：ASSIGNED 分成 In progress｜Past due** | 需求 1（2026-09-21）。ASSIGNED 眉標右邊一個切換 `In progress · N｜Past due · M`，預設看進行中。進行中的卡：`Sep 10, 08:00 → due Sep 25, 23:59`、`6 of 6 students · 2 of 6 submitted so far`、Edit／Remove。過期的卡：灰底、多一顆灰 pill *Past due*、`Ended Sep 8, 23:59 · started Sep 1`、`8 of 8 students · 6 of 8 submitted · 2 students didn’t finish`（琥珀字）、動作只剩 **Extend due date**（就是改日期，救沒交的）／Remove。**WHO DOES IT 的「已指派」只算進行中的**：過期過的班可以再指派，班級列寫 *5 students · did this before, ended Sep 8*；名單裡的「In another class」衝突也只看進行中的。哪一組是空的就寫一句說明。 |
| 文件 | 登記 | 2026-09-21。從 v7 分岔、殼換成 Content Mirroring、只留第四步；需求原文與要問的寫在上面。 |
