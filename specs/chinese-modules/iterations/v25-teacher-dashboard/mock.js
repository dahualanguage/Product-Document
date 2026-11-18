/* ===========================================================================
   v25 共用假資料 —— 基準檔（teacher-dashboard-baseline.html）與提案（proposal.html）共用。

   要先載 ../v24-practice-list-ended/mock.js（window.V24）：Active Assignments 的每一列就是 v24 列表上
   「一個練習 × 一個班」的指派，名稱、型別、班名、到期日、交卷數都從那邊來，三頁（Dashboard → Practice List → Result）才對得起來。
   今天跟 v24 一樣 ＝ 2026-11-20。

   Dashboard 拿得到的東西（getTeacherAssignmentOverview）：
     assignments：練習名、型別／子型別、班名、到期日、submittedCount／totalCount、沒交的學生名單（userId、名字）
     submissions：每一次交卷（學生、班、練習、型別、交卷時間、reviewed／reviewSkipped）
     timezone：學校時區（這裡不算時區）
   Word Game 的列另外讀（word-game-rows.js），只有 Dashboard 有，v24 列表沒有。
   =========================================================================== */
window.V25 = (function () {
  const M = window.V24;
  const TODAY = M.TODAY;
  const TOMORROW = '2026-11-21';

  /* ---------- 型別 chip：practice-type-config.js getTypeConfig ----------
     Dashboard 的 chip 吃 PRACTICE_TYPE_COLUMNS 那一欄的 wash／label（不是 v24 卡片上的 tag 色），字是 getTypeLabel 的全名 */
  const COLUMN = {
    CONTENT:       { wash: '#EFFBF4', label: '#00754A' },
    VOCABULARY:    { wash: '#FFF8E7', label: '#8F6209' },
    SENTENCE:      { wash: '#FEF2F8', label: '#BE185D' },
    COMPREHENSION: { wash: '#F7F3FE', label: '#6D28D9' },
  };
  const COLUMN_OF = { MIRRORING: 'CONTENT', VOCAB_MIRRORING: 'VOCABULARY', VOCAB_QUIZ: 'VOCABULARY', SENTENCE_SCRAMBLE: 'SENTENCE', SENTENCE_CLOZE: 'SENTENCE', SENTENCE_BUILDING: 'SENTENCE', SENTENCE_RESPONSE: 'SENTENCE', COMPREHENSION_QUIZ: 'COMPREHENSION', OPEN_ENDED: 'COMPREHENSION' };
  const WORD_GAME = { label: 'Word Game', color: '#0d9488', bg: '#ccfbf1' };
  const typeConfig = (type) => {
    if (type === 'WORD_GAME') return WORD_GAME;
    const c = COLUMN[COLUMN_OF[type]];
    return { label: M.TYPES[type].label, color: c.label, bg: c.wash };
  };

  /* ---------- 批改收件匣收哪些（NO_REVIEW_TYPES ＋ NO_REVIEW_IDS）----------
     不收：Comprehension Quiz、Sentence Scramble、Sentence Cloze、Word Game、Vocabulary Quiz */
  const REVIEWABLE = new Set(['MIRRORING', 'VOCAB_MIRRORING', 'SENTENCE_BUILDING', 'SENTENCE_RESPONSE', 'OPEN_ENDED']);
  // 型別篩選（buildTypeFilterOptions）：All ＋ 收件匣會收的五種，icon／色照 practice-type-labels 的 tag
  const TYPE_FILTER = [
    { value: 'all', label: 'All practice types' },
    ...['MIRRORING', 'VOCAB_MIRRORING', 'SENTENCE_BUILDING', 'SENTENCE_RESPONSE', 'OPEN_ENDED'].map((t) => ({ value: t, label: M.TYPES[t].label, icon: M.TYPES[t].tag.icon, color: M.TYPES[t].tag.label })),
  ];

  /* ---------- 名單：7A／7B 照 v23 mock（沒交的排最後，8/10、5/8 才對得上）；8A／8B 這裡捏 ---------- */
  const ROSTER = {
    'Class 7A': ['Emma Chen', 'Liam Wang', 'Olivia Liu', 'Ava Huang', 'Ethan Lin', 'Mia Wu', 'Lucas Yang', 'Sophia Zhao', 'Noah Zhang', 'Mason Xu'],
    'Class 7B': ['Isabella Sun', 'Amelia Ma', 'Benjamin Hu', 'Charlotte Zhou', 'Henry Gao', 'James Guo', 'Harper Luo', 'Daniel Tang'],
    'Class 8A': ['Aiden Li', 'Chloe Zheng', 'Dylan Wu', 'Grace Feng', 'Jayden Cao', 'Lily Shen', 'Nathan Qiu', 'Ruby Pan', 'Samuel Deng', 'Victoria Ye', 'William Kong', 'Zoe Tan'],
    'Class 8B': ['Alex Jiang', 'Bella Song', 'Caleb Mo', 'Elena Xie', 'Felix Yuan', 'Hannah Lu', 'Ian Cheng', 'Julia Han', 'Kevin Bai', 'Maya Du', 'Oscar Ren'],
  };
  const idOf = (name) => name.toLowerCase().replace(/[^a-z]+/g, '-');

  /* ---------- Active Assignments：v24 的練習 × 班 攤平 ----------
     getDateSection：過期 overdue、今天 today、明天 tomorrow、其餘（含沒到期日）later */
  const sectionOf = (due) => {
    if (!due) return 'later';
    if (due < TODAY) return 'overdue';
    if (due === TODAY) return 'today';
    if (due === TOMORROW) return 'tomorrow';
    return 'later';
  };
  const ASSIGNMENTS = [];
  M.PRACTICES.forEach((p) => p.classes.forEach((k) => {
    const roster = ROSTER[k.name];
    ASSIGNMENTS.push({
      rowKey: `${p.id}-${k.name}`,
      practiceId: p.id,
      practiceName: p.name,
      type: p.type,
      className: k.name,
      classId: k.name.replace('Class ', '').toLowerCase(),
      due: k.due,
      section: sectionOf(k.due),
      submittedCount: k.submitted,
      totalCount: k.total,
      submittedStudents: roster.slice(0, k.submitted),
      notSubmittedStudents: roster.slice(k.submitted).map((n) => ({ userId: idOf(n), studentName: n })),
      practice: p,
    });
  }));
  // Word Game 的目標（word-game-rows.js）：每週目標，沒有 assignment row，所以不能 Skip、沒有 View results
  ASSIGNMENTS.push({
    rowKey: 'wg-8a', practiceId: null, practiceName: 'Level 1 · 每天玩 15 分鐘', type: 'WORD_GAME', className: 'Class 8A', classId: '8a',
    due: TOMORROW, section: sectionOf(TOMORROW), isWeekly: true, submittedCount: 9, totalCount: 12,
    submittedStudents: ROSTER['Class 8A'].slice(0, 9),
    notSubmittedStudents: ROSTER['Class 8A'].slice(9).map((n) => ({ userId: idOf(n), studentName: n })),
    wordGame: true,
  });

  /* ---------- To Review：交了卷、型別會進收件匣的 ----------
     ago ＝ 距今幾小時；reviewed／skipped 照 review-model：reviewed 蓋過 skipped、兩種都離開 To Review 進 Reviewed */
  const HOURS = { h: 1, d: 24 };
  const ago = (s) => Number(s.slice(0, -1)) * HOURS[s.slice(-1)];
  // [practiceId, 班, 學生 index, 多久前, 狀態('' | 'reviewed' | 'skipped')]
  const SUB_ROWS = [
    ['p2', 'Class 7A', 0, '1h', ''],          // Comprehension Quiz：不進收件匣（NO_REVIEW），放著證明被濾掉
    ['p1', 'Class 7A', 0, '2h', ''],
    ['p1', 'Class 7A', 1, '5h', ''],
    ['p1', 'Class 7B', 0, '7h', ''],
    ['p10', 'Class 7B', 1, '1d', ''],
    ['p4', 'Class 8A', 2, '1d', ''],
    ['p4', 'Class 8A', 3, '2d', ''],
    ['p4', 'Class 8B', 0, '2d', ''],
    ['p1', 'Class 7A', 2, '3d', ''],
    ['p10', 'Class 7B', 2, '4d', ''],
    ['p12', 'Class 7A', 4, '9d', ''],
    ['p5', 'Class 7B', 0, '12d', ''],
    ['p12', 'Class 7A', 1, '31d', ''],
    ['p12', 'Class 7A', 2, '33d', ''],
    ['p1', 'Class 7A', 3, '1d', 'reviewed'],
    ['p4', 'Class 8A', 0, '2d', 'reviewed'],
    ['p4', 'Class 8A', 1, '2d', 'reviewed'],
    ['p10', 'Class 7B', 0, '3d', 'reviewed'],
    ['p4', 'Class 8B', 1, '4d', 'skipped'],
    ['p12', 'Class 7A', 0, '20d', 'skipped'],
    ['p1', 'Class 7A', 4, '5d', 'reviewed'],
    ['p5', 'Class 7B', 1, '6d', 'reviewed'],
  ];
  const AI = [72, 80, 85, 88, 91, 64, 77, 95];
  const SUBMISSIONS = SUB_ROWS.map(([pid, cls, si, when, st], i) => {
    const p = M.PRACTICES.find((x) => x.id === pid);
    const name = ROSTER[cls][si];
    return {
      id: `s${i}`, practiceId: pid, practiceName: p.name, type: p.type, className: cls, studentName: name, userId: idOf(name),
      hoursAgo: ago(when), reviewed: st === 'reviewed', reviewSkipped: st === 'skipped', ai: AI[i % AI.length], practice: p,
    };
  });
  const reviewable = (s) => REVIEWABLE.has(s.type);
  const statusOf = (s) => (s.reviewed ? 'reviewed' : s.reviewSkipped ? 'skipped' : 'pending');
  const isSettled = (s) => statusOf(s) !== 'pending';

  // formatRelativeTime
  const relTime = (hours) => {
    if (hours < 1) return 'just now';
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const d = Math.floor(hours / 24);
    return `${d} day${d > 1 ? 's' : ''} ago`;
  };

  // 批改抽屜的題目（通用）
  const QUESTIONS = [
    { zh: '今天天氣很好。', py: 'jīntiān tiānqì hěn hǎo.', en: 'The weather is nice today.', score: 4 },
    { zh: '我喜歡吃水餃。', py: 'wǒ xǐhuān chī shuǐjiǎo.', en: 'I like eating dumplings.', score: 5 },
    { zh: '聖誕節快樂！', py: 'shèngdàn jié kuàilè!', en: 'Merry Christmas!', score: 3 },
  ];
  const QUICK = {
    MIRRORING: ['Great mirroring — nailed it!', 'Practice your tones a bit more.', 'Clear pronunciation, keep it up!'],
    VOCAB_MIRRORING: ['Good grasp of the vocabulary!', 'A little more work on pronunciation.', 'Well done — passed!'],
    SENTENCE_BUILDING: ['Most answers correct — well done!', 'Review the ones you missed.', 'All correct — excellent!'],
    SENTENCE_RESPONSE: ['Most answers correct — well done!', 'Review the ones you missed.', 'All correct — excellent!'],
    OPEN_ENDED: ['Clear and complete answer — great!', 'Good pronunciation, keep it up!', 'Try adding a bit more detail.'],
  };

  /* ---------- 連去 v23 Result 頁：跟 v24 的 resultHref 同一條（型別、名稱、每班到期），多帶 back=dashboard ---------- */
  const resultHref = (a, file, extra = '') => M.resultHref(a.practice, file, `&back=dashboard${extra}`);

  return { TODAY, TOMORROW, typeConfig, TYPE_FILTER, ROSTER, ASSIGNMENTS, SUBMISSIONS, reviewable, statusOf, isSettled, relTime, QUESTIONS, QUICK, resultHref, esc: M.esc, fmtDay: M.fmtDay };
}());
