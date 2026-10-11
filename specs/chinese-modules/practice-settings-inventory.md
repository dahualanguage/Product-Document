# 八張卡的設定盤點 — Planning 設計 flow 步驟 0

> **用途**：Planning mode 要為每一種練習畫一張設定面板（設計 flow 第 3 步），
> 這份文件是那五張面板的素材來源。Mirroring 那一張已經畫完。
>
> **程式碼基準**：`dahua-dash` `origin/develop` @ `219ac37d`（2026-08-31）
> **卡片與命名基準**：`iterations/v1-practice-hierarchy/spec.html` §4（2026-08-27 定案，第二層攤平成八張）
> **日期**：2026-08-31

---

## 1 · 八張卡走哪幾步

八張卡對到六個型別，其中兩個型別各有兩個子型別。攤平定案（v1 spec §4.5）之後
`Practice Type` 那一步變成多餘 —— 選卡的當下就決定了 —— 所以下表的刪除線是**攤平後要拿掉的**。

> **更正（2026-09-10，v4 登記時）**：刪除線那一步**產品已經拿掉了**。現行 `STEPS_BY_TYPE` 裡
> Vocabulary 是 `Vocabulary → Settings → Assign`、Follow Pattern 是 `Teaching Points → Question Review → Settings → Assign`，
> `practice-stepper-config.js` 註解：*the sub type … arrives in the URL, so no flow asks for it again*。下表保留當時的樣子不改。

出處：`src/utils/practice-stepper-config.js` 的 `STEPS_BY_TYPE` / `VOCABULARY_MC_STEPS`。

| 卡 | 型別（子型別） | 步驟 |
|---|---|---|
| Content Mirroring | `MIRRORING` | Content → **Settings & Preview** → Assign |
| Vocabulary Mirroring | `VOCABULARY` (`MIRRORING`) | Vocabulary → ~~Practice Type~~ → **Settings** → Assign |
| Vocabulary Quiz | `VOCABULARY` (`MULTIPLE_CHOICE`) | Vocabulary → ~~Practice Type~~ → Question Types → **Settings** → Assign |
| Sentence Scramble | `SENTENCE_SCRAMBLE` | Content → Edit Sentences → **Settings** → Assign |
| Sentence Response | `FOLLOW_PATTERN` (`GUIDED_RESPONSE`) | Teaching Points → ~~Practice Type~~ → Question Review → **Settings** → Assign |
| Sentence Building | `FOLLOW_PATTERN` (`SENTENCE_BUILDING`) | Teaching Points → ~~Practice Type~~ → Question Review → **Settings** → Assign |
| Comprehension Quiz | `MULTIPLE_CHOICE` | Question Bank → **Edit & Preview** → Assign |
| Open-ended Questions | `QA` | Content → **Settings & Preview** → Assign |

粗體是本文盤點的那一步。**Assign 是八張唯一都要走的一步**，而它還沒設計 ——
所以設計 flow 的第 4 步（Assign 面板）不必等任何一張練習面板。

---

## 2 · 設定總表

Response 和 Building 走同一個檔案（`follow-pattern-settings.js`），設定完全一樣，
所以八張卡只有**六份設定**。

| 設定 | Content Mirroring | Open-ended Q | Vocabulary（兩張） | Sentence Scramble | Sentence Resp/Build | Comprehension Quiz |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Practice name | ✅ | ✅ | ✅ | ✅ | — | — |
| **Audio Mode**（純聽力） | ✅ 共用卡 | ✅ 共用卡 | — | — | ✅ 自己畫的 | — |
| Pinyin | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| Translation | ✅ | — | ✅ | — | ✅ | — |
| Image（圖片顯不顯示） | — | — | ✅ | — | — | — |
| English first | ✅ | — | — | — | — | — |
| Guide phrase language | — | ✅ | — | — | — | — |
| Speed | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| Voice | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| Auto pass 次數 | ✅ 共用欄位 | — | ✅ 共用欄位 | ✅ 自己畫的 | ✅ 自己畫的 | — |

檔案：
`mirroring-step-two-section.js` ·
`qa-step-two-section.js` ·
`vocabulary-step-three-section.js` ·
`sentence-scramble-preview.js` ·
`follow-pattern-settings.js` ·
`mc-step-two-section.js`
（都在 `src/sections/practice/view/unified/steps/`）

### 這張表講了三件事

**① Comprehension Quiz 整欄是空的。** 它沒有任何設定 —— `mc-step-two-section.js` 是一份題目清單：
型別與分類的 chip、逐題刪除、以及一顆 `Edit in Question Bank`。它那一步叫 **Edit & Preview**，
不叫 Settings，名字本來就講了。**所以第 3 步實際上是四張面板，不是五張。**

**② 大部分設定是共用元件，不是各自長的。** 三個共用元件撐起整張表：

| 元件 | 內容 |
|---|---|
| `audio-mode-toggle-card.js` | Audio Mode 開關 ＋ tooltip ＋ 一行說明 |
| `audio-settings-panel.js` | Speed ＋ Voice，兩個下拉都有**逐項試聽鍵** |
| `max-attempts-field.js` | `Max attempts before auto pass` 數字欄位 |

所以「一張面板、列隨練習出現」這個做法有程式碼支撐 —— 產品自己就是這樣組的。

**③ 三個不一致，是產品自己的，不是設計的。**

- **Audio Mode**：Mirroring 和 QA 用共用卡，**Follow Pattern 自己畫了一份一模一樣的**。
- **Auto pass**：Mirroring 和 Vocabulary 用共用欄位（`Max attempts before auto pass`），
  Scramble 叫 `Attempts per sentence`、Follow Pattern 叫 `Attempts per question`，兩個都自己畫。
  **同一個東西有三個名字。**
- **Practice name**：六份裡四份有，Follow Pattern 和 MC 沒有。

面板要不要把這三個統一，是設計決定 —— 但要知道統一之後跟現行畫面會長得不一樣。

---

## 3 · 選項值（照抄程式碼，不要自己編）

出處 `src/config/practices.js`、`src/enum/practices.js`。

```js
SPEED_OPTIONS = [ {1.0,'Fast'}, {0.8,'Normal'}, {0.6,'Slow'} ]   // 三段，預設 0.8
DEFAULT_MAX_ATTEMPTS = 3 · MIN_MAX_ATTEMPTS = 1 · MAX_MAX_ATTEMPTS = 10
PINYIN_PREFERENCES      = PINYIN | NO_PINYIN | STUDENT_CHOICE
TRANSLATION_PREFERENCES = SHOW | HIDE | STUDENT_CHOICE
IMAGE_PREFERENCES       = SHOW | HIDE                    // 只有 Vocabulary
SPEED_PREFERENCES       = TEACHER_FIXED | STUDENT_CHOICE
```

Voice 不是固定清單 —— `useVoiceCatalog({ targetLanguage, audioOption })` 依語言取回來的，
每個聲音有 `sampleUrl`。

---

## 4 · Planning 原型現在對不上的地方

| 位置 | 原型現在 | 產品 | 處置 |
|---|---|---|---|
| Auto pass 上限 | `min=1 max=20` | **1–10**，預設 3 | 要改。20 是舊資料，這一版沒有 20 |
| Auto pass 預設 | 空白（`—`） | 3 | 要決定：沿用 3，還是保留「沒設定」這個狀態 |
| Speed | 三段 ✅ | Fast / Normal / Slow | 對得上 |
| Pinyin / Translation | Shown / Hidden / Their choice | 同三個值 | 對得上（**原型的說法比產品好**，見下） |

---

## 5 · 要問工程的（接上 `mirroring-settings-questions.md`）

前三題**過了 638 個 commit 之後全部還在**，狀態不變：

1. **純聽力模式下學生端長什麼樣**（Q1 延伸）—— 仍然缺畫面，Mirroring 面板的預覽還在說謊。
2. **pronunciation slack**（Q2）—— `audio-settings-panel.js:95` 那個 TODO 還在，
   而 `:61` 的說明文字**還是寫著 "pronunciation precision"**。`DEFAULT_SLACK` / `SLACK_OPTIONS` 也還在 config 裡。
3. **下拉直接露出 enum 值**（Q3）—— `follow-pattern-settings.js` 的 Pinyin / Translation
   兩個下拉是 `Object.entries(PINYIN_PREFERENCES).map(...)`，老師看到的就是 `NO_PINYIN`、`STUDENT_CHOICE`。
   **不只 Mirroring，Follow Pattern 也是。**

這一輪新長出來的：

4. **`Attempts per sentence` / `Attempts per question` / `Max attempts before auto pass`
   是不是同一個欄位？** 如果是，Planning 面板要用哪一個說法。
5. **Follow Pattern 的 Audio Mode 是不是跟 Mirroring 的同一件事？**
   它自己畫了一份，行為（強制鎖住拼音／翻譯）有沒有跟著？
6. **Vocabulary 的 `imagePreference` 關掉之後學生看到什麼？** 生詞卡沒有圖的樣子要畫得出來。
7. **QA 的 `guidePhraseLanguage` 是什麼？** 八個設定裡只有它完全沒有對照畫面。