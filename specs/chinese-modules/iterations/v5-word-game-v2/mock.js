/* ============================================================================
   v5 — Word Game V2 · 共用假資料（基準檔 word-game.html 與提案 proposal.html 都吃這一份）

   資料形狀照 dahua-dash origin/develop @ 599dd4cb：
     LEVELS            src/sections/student/word-game-v2/constants.js（x/y = 1920×1080 底圖上的 % 中心點，size = px 寬）
     stage 欄位         utils/stage-map.js isValidStage：level(1-based) / type TEACHING|QUIZ|BOSS / title / passed / unlocked / attempts / bestScore 0–5
     current stage     utils/stage-map.js getCurrentGridIndex：最小的 unlocked && !passed
     ring 百分比        utils/stage-map.js getStageStarPercent：bestScore / 5
     世界狀態           screens/world-map-screen.js getLevelStatus：> maxUnlocked → LOCKED；=== current → CURRENT；其餘 UNLOCKED
     Stars 徽章         components/game-v2-layout.js：class points 總和（不是關卡星星加總）

   假設（產品資料沒看到的）：
     · unit 的大小照使用者的統計表（平均 20–25、最少 4–6、最多 43）挑的；每個 unit 裡每第 3 關測驗、最後一關 Boss 是假設；bestScore 是假的。
   ============================================================================ */
window.WG = (() => {
  const LEVELS = [
    { id: 0, name: '渡口', emoji: '🏮', theme: '#12A150', x: 15, y: 79, size: 240, labelY: 30 },
    { id: 1, name: '石橋', emoji: '🌸', theme: '#FF9600', x: 46, y: 75, size: 230, labelY: 30 },
    { id: 2, name: '龍亭', emoji: '🐉', theme: '#1CB0F6', x: 76, y: 61, size: 225, labelY: 30 },
    { id: 3, name: '翠閣', emoji: '🏯', theme: '#7C3AED', x: 42, y: 35, size: 235, labelY: 30 },
    { id: 4, name: '寶塔', emoji: '🗼', theme: '#FF5A6E', x: 14, y: 44, size: 230, labelY: 30 },
    { id: 5, name: '仙閣', emoji: '☁️', theme: '#FFC219', x: 64, y: 20, size: 200, labelY: 30 },
    { id: 6, name: '天宮', emoji: '🌙', theme: '#7C3AED', x: 85, y: 24, size: 280, labelY: 30 },
  ];

  // World 1 · 155 stages（照 2026-09-15 使用者截圖：16/155）
  // Unit 的大小照使用者給的統計（HSK 2–4：一個 unit 平均 20–25 關，最少 4–6、最多 43）—— 不是固定十關。
  // 這裡 7 個 unit：6 / 22 / 25 / 18 / 30 / 24 / 30 = 155（第一個故意很小，像離合詞那種）。每個 unit 裡每第 3 關是 QUIZ、最後一關是 BOSS（假設）。
  // passed 0..15，current = idx 16（Stage 17，還沒打過）
  const UNIT_SIZES = [6, 22, 25, 18, 30, 24, 30];
  const UNIT_NAMES = [
    ['離合詞', 'Separable verbs'], ['問候', 'Greetings'], ['家人', 'Family'], ['數字', 'Numbers'], ['食物', 'Food'],
    ['購物與消費', 'Shopping & Spending'], ['近義詞辨析', 'Similar words'],
  ];
  const TOTAL = UNIT_SIZES.reduce((a, b) => a + b, 0);
  const CURRENT = 16;
  const stages = [];
  const units = [];
  UNIT_SIZES.forEach((size, u) => {
    const from = stages.length;
    for (let k = 0; k < size; k += 1) {
      const i = from + k;
      const type = k === size - 1 ? 'BOSS' : (k + 1) % 3 === 0 ? 'QUIZ' : 'TEACHING';
      const passed = i < CURRENT;
      const unlocked = i <= CURRENT;
      let bestScore = 0;
      if (passed) bestScore = type === 'TEACHING' ? 5 : [4, 4, 5, 3, 4][Math.floor(i / 3) % 5];
      stages.push({ level: i + 1, type, title: `Stage ${i + 1}`, passed, unlocked, attempts: passed ? 1 : 0, bestScore });
    }
    const list = stages.slice(from);
    const done = list.filter((s) => s.passed).length;
    const status = list.every((s) => s.passed) ? 'done' : list.some((s) => s.unlocked) ? 'current' : 'locked';
    units.push({ id: u + 1, zh: UNIT_NAMES[u][0], en: UNIT_NAMES[u][1], from, to: from + size, count: size, done, status });
  });

  // 分頁：格子卡高度固定、不捲，所以一頁裝得下多少 unit 是用高度算的（不是關卡數）：
  //   unit 的高度 = 標頭 56 + 底 12 + 每列 71（節點 59 + 列距 12），unit 之間 10。
  //   卡裡 unit 區的高度由畫面量出來（proposal.html 量 .units 的 clientHeight，視窗改變就重算），
  //   一個 unit 不切頁；裝不下就整個換下一頁。
  const UNIT_HEAD = 68, ROW_H = 71, UNIT_GAP = 10;
  const unitHeight = (u) => UNIT_HEAD + Math.ceil(u.count / 10) * ROW_H;
  const buildPages = (areaH) => {
    const pages = [];
    units.forEach((u) => {
      const h = unitHeight(u);
      const last = pages[pages.length - 1];
      if (last && last.height + UNIT_GAP + h <= areaH) { last.units.push(u); last.height += UNIT_GAP + h; }
      else pages.push({ units: [u], height: h });
    });
    return pages;
  };
  const tallestUnit = Math.max(...units.map(unitHeight));

  return {
    units,
    buildPages,
    tallestUnit,
    student: { name: 'Ethan', initials: 'E', stars: 1280 },
    currentLevelId: 1,
    maxUnlockedLevel: 1,
    LEVELS,
    world: { id: 1, stages, total: TOTAL, completed: CURRENT, currentIndex: CURRENT },
    subtitle: (id) => (id === 0 ? 'Pinyin & Tone Challenge' : 'Vocabulary'),
    starPct: (s) => Math.min(100, (s.bestScore / 5) * 100),
    q: (k, d) => { const v = new URLSearchParams(location.search).get(k); return v === null ? d : v; },
  };
})();
