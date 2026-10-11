# Mirroring 練習設定 — 要問工程的幾件事

> **狀態**：Q1 已回答（2026-08-26），並由此長出一個新問題；Q2、Q3 待回。

**背景**：Planning mode 的「設定練習細項」那一步（spec `teacher-planning-spec.html` §8.2）正在重畫成右側面板。
對照現行產品的 Mirroring 設定畫面時，發現三個問題。

**程式碼基準**：`dahua-dash` `origin/develop`
**主要檔案**：`src/sections/practice/view/unified/steps/mirroring-step-two-section.js`
**日期**：2026-08-26

---

## Q1（會擋設計）· 「學生能自己調」在產品裡有兩套做法

同一個概念，兩種實作：

| 設定 | 學生能不能自己調，怎麼表示 |
|---|---|
| 拼音 · 翻譯 | 靠一個**外部總開關** `Audio Mode` |
| 速度 | **自己的選項裡**就有 `STUDENT_CHOICE` |

### Audio Mode 實際做的事（已對照程式碼）

```js
// mirroring-step-two-section.js · handleAudioMode
// Match legacy behavior: enabling Audio Mode forces pinyin/translation
// to STUDENT_CHOICE so the student picks at runtime.
if (next) {
  setValue('pinyinPreference', PINYIN_PREFERENCES.STUDENT_CHOICE);
  setValue('translationPreference', TRANSLATION_PREFERENCES.STUDENT_CHOICE);
}
```

- 兩個下拉在 `audioMode` 為真時被停用：`disabled={audioMode}`（第 364、379 行）
- Tooltip：*"When Audio Mode is enabled, students can choose whether to show pinyin and translation during audio practice. **Pinyin and Translation will be locked to Student Choice.**"*

所以 Audio Mode **不是第三個設定，是會覆寫另外兩個的總開關**。

### 速度是另一套

```js
// src/enum/practices.js:120
export const SPEED_PREFERENCES = {
  TEACHER_FIXED: 'TEACHER_FIXED',
  STUDENT_CHOICE: 'STUDENT_CHOICE',
};
```

畫面上 Speed 下拉直接就有 `Student choice`，說明是「Students pick their own speed and start at Normal.」——**不需要任何外部開關**。

### 要問的

> **`audioMode` 是不是純粹由那幾個 preference 推導得出的值？**
> 還是說 `audioMode === true` 會讓**學生端**切換成不同的播放介面／流程（例如純聽力模式），因此帶有那兩個 preference 之外的意義？

### ✅ 已回答（2026-08-26）

> **`audioMode === true` 會讓學生端切換成不同的播放介面 —— 純聽力模式。**

所以它**不是推導值，不能合併**。但這個答案同時說明了另一件事：

**它根本不屬於「顯示設定」。** 拼音、翻譯、速度改的是「同一個練習長什麼樣」；Audio Mode 改的是**這個練習是什麼** —— 學生從「看著句子跟讀」變成「純聽力」。把它跟拼音、翻譯並排在一張設定清單裡，才是它一直讓人覺得重複的真正原因。

它會強制鎖住那兩個偏好也就不奇怪了：**純聽力模式底下本來就沒有「預先決定顯示什麼」這回事**，只有學生自己在練習當下要不要叫出來。

### 因此設計要這樣改

1. **把 Audio Mode 從設定清單裡拿出來，往上放**，跟練習本身放在一起 —— 它是練習模式，不是顯示偏好。
2. **打開時，拼音／翻譯兩排要看得出被鎖住**（變灰 + 一句原因：「純聽力模式下由學生自己決定」），而不是安靜地被改掉。
3. **預覽要跟著換。** 面板叫「What the student sees」—— 純聽力模式下學生看到的畫面跟現在畫的完全不同，不能還是那三行句子。
4. **名字要說人話。** 「Audio Mode」沒有講出它是純聽力；面板上要用老師看得懂的說法。

### 由此產生的新問題 —— ✅ 已解決（2026-08-31，從程式碼查到，未經工程回覆）

> **純聽力模式下，學生端實際長什麼樣？**

答案在 `src/sections/assignments/content/index.js`：

```js
// :430  For MIRRORING, we show an AudioModePanel instead of hiding the panel.
const hideContentPanel = audioModeOn && (practiceType === 'QA' && !hasContentBasedArticle);
renderMirroringContent = audioModeOn ? renderAudioModePanel : <ContentWindow …/>
setStudentPinyinOn(!audioMode);   // :376  拼音預設關
```

- **Mirroring 不是把左邊藏起來，是把課文換成一張 Audio Mode 卡**（`:488–546`）：
  耳機圖、`Audio Mode is ON`（ON 為 `#22C55E`）、`Please pay attention and repeat the sentences.`，
  底下一塊 `#F0FAF4` 提示 `Need help? Check the settings for text options.`。整個藏掉的只有 QA。
- **拼音預設是關的**，學生在練習當中從設定把文字叫回來。
- 開始卡換標題為 `Audio Mode` · `Listen and repeat —— text is hidden`，
  而且拼音／翻譯開關卡整張不顯示（`practice-list-mirroring-start-card.js:44–74`）。

原型的預覽已照此改完（`teacher-planning.html`）。

**教訓**：這一題掛了五天等工程截圖，而答案一直在 repo 裡。之後遇到「學生端長什麼樣」這類問題，
先去 `src/sections/assignments/` 找，找不到再問。

---

## Q2 · Auto Pass 之外，「發音嚴格度」是被暫時關掉的

現行畫面上 **Audio Settings** 的說明寫著：

> *"Controls audio playback speed, **pronunciation precision**, and voice."*

但畫面上只有 Speed 和 Voice 兩個控制項。原因在程式碼裡：

```js
// src/sections/practice/view/unified/components/audio-settings-panel.js:190
{/* TODO: Re-enable pronunciation slack selector once the new pronunciation
    Lambda supports the slack parameter … */}
```

而選項本身是現成的：

```js
// src/config/practices.js:226
export const DEFAULT_SLACK = 0.7;
export const SLACK_OPTIONS = [
  { value: 0.7, label: '🟢 Gentle (Easy)' },
  { value: 0.5, label: '🟡 Teaching standard (Normal)' },
  { value: 0.3, label: '🔴 Exam level (Hard)' },
];
```

### 要問的

> **新的發音 Lambda 什麼時候會支援 slack 參數？**
> 這決定「發音嚴格度」要不要現在就設計進 Planning 的面板。

**同時建議**：在它回來之前，把 Audio Settings 的說明文字裡的 *pronunciation precision* 拿掉——**現在的文案在承諾一個畫面上沒有的東西**。（設計這邊就是被這句話誤導過一次，憑它做了一個不存在的設定。）

---

## Q3（小）· 下拉直接把 enum 值露給老師看

Display Settings 兩個下拉顯示的是原始值：

```
Pinyin       PINYIN
Translation  STUDENT_CHOICE
```

老師看到的是資料庫欄位值，不是人話。Planning 的面板已經改成 **Shown / Hidden / Their choice**；建議現行畫面也一併換掉，兩邊講一樣的話。

---

## 附：現行畫面的五個區塊 vs Planning 面板的分組

| 現行產品 | Planning 面板（提案） |
|---|---|
| Audio Mode（獨立卡） | **移到最上面，跟練習本身放在一起** —— 它是練習模式，不是顯示偏好 |
| English First（獨立卡） | 併入「按下播放會聽到」 |
| Display Settings（拼音 + 翻譯） | 貼在學生畫面預覽的正上方 |
| Auto Pass | 「什麼時候算過」 |
| Audio Settings（速度 + 聲音） | 併入「按下播放會聽到」 |

分組的原則是**依「它改變什麼」**，不是依欄位來源：看得到什麼的貼在預覽上、聽得到什麼的收成一組、什麼時候算過關單獨一行。