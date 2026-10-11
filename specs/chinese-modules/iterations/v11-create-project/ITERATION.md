# v11 — Create New Project（建立專案）基準

- **功能名稱**：Create New Project（老師建一個 Project：課程設定 → 生內容 → 審稿 → 教學點）
- **網址**：https://dahua-dash-dev.web.app/dashboard/projects/create
- **截圖**：無（使用者未給；基準檔照程式碼複刻）
- **日期**：2026-10-08（登記＋基準檔）
- **為什麼開這一版**：Planning mode 提案一的「New content」路原本只是助手欄裡一題（主題＋HSK＋教學點）然後假裝寫好——少了來源怎麼來、課文沒得改、教學點沒確認。使用者定：**四步都複刻**、教學點跟練習的 mock 對齊（「我的一天」七個字）。提案一的新內容路改成嵌這一頁（跟練習頁同一種做法）。
- **設計檔**：`create-project.html`（**基準**，現行產品的複刻；這一版沒有 proposal——Planning 嵌的就是基準）
- **程式碼基準**：dahua-dash `origin/develop` @ `0fa7cca9`（2026-10-08 fetch）
  - `src/sections/projects/view/create/project-create-view.js`（四步、CardWrap）、`steps/setup`、`steps/generateContent/*`（Create／Revise／Summary 三張功能卡、content-type-chips、word-limit-slider、teaching-points-input、generation-progress-dialog）、`steps/edit`、`steps/confirm`（字盒、Mode、How it works、圖例、rhf-new-vocab-pane、Analyze、生詞卡、未存提示列）、`src/components/wizard-step-header`、`src/enum/projects.js`
- **狀態**：**基準完成**（2026-10-08）。未部署

## 基準檔怎麼看

`create-project.html`，`?step=` 從 1 數：

| 網址 | 看到什麼 |
|---|---|
| `?step=1` | Course Settings：Test Type（TOCFL／HSK／ACTFL）、Level、Target Language、Student's Native Language 四個下拉；Next Step 說明框；Back 灰、Save & Continue |
| `?step=2` / `&fn=revise` / `&fn=summary` | Generate Content：左邊三張功能卡（Create 標 Recommended、Revise 標 ≈ 90 sec、Summary），右邊那一張的表單。Create：Content Type 七顆 chip、Word Limit 100–1500 滑桿、Topic（100 字）、Teaching Points（可空、打字成 tag）。Revise：Upload Image｜Paste Text 分頁 ＋ 同一組設定 ＋ Reset。Summary：上傳區 ＋ Reset／Skip to Enter Text Manually |
| `?step=2&gen=1` / `&gen=done` | 生成中的對話框（Analyzing → Generating → Organizing → Done!，鼓勵語）／生好了（All set! 🎉，自動進第三步） |
| `?step=3` | Review & Edit：Project Name、Article Content（10 列，3000 字）；Back／Save & Continue |
| `?step=4` / `&mode=segment` | Teaching Points：Project Name 鎖住、綠色狀態列「N Teaching Points Selected · Ready to Generate Cards」、課文字盒（拼音在上、點字選、粉＝選了、藍＝分析過）、右欄 Mode（Select Words｜Modify Segments）＋ How it works ＋ 圖例、Add more teaching points（字＋型別＋說明）、Analyze Teaching Points。`&mode=segment` 是改分詞的 textarea ＋ 說明 |
| `?step=4&analyzed=1` / `&saved=1` | 分析完：字盒變藍、底下 Teaching Points Card 一張一張（字／拼音／翻譯／詞性／程度、Explanation、Example 1／2，右上 Edit／Delete），底部「You have unsaved changes」列 ＋ Save；`&saved=1` 存好的對話框 |
| `&topic=天气&std=HSK&lvl=2` | 第一、二步預填（Planning 嵌入用） |

假資料：課文＝v3「我的一天」五句；教學點＝v4 的七個（起床、早饭、睡觉 在課文裡選；上课、图书馆、运动、一……就 從 Add more 加），例句同 v4。

## Change log

<!-- 這一版只有基準，沒有提案；之後若在 Planning 以外改這一頁再開表 -->

| 端 | 改了什麼 | 說明 |
|---|---|---|
