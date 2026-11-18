/* ===========================================================================
   v24 共用假資料 —— 基準檔（practice-list-baseline.html）與提案（proposal.html）共用。

   練習列表拿得到的東西（view/index.js ＋ practice-card-config.js buildPracticeAssignmentMap）：
     每個練習：名稱、型別／子型別、版本、專案名、建立時間
     每個練習每個班：班名、Mandatory／Optional、到期日（同一班指派兩次取最新）、學生名單
   拿不到的：交了幾個、平均分（v24 定案 ④ 要請工程一次給 submitted／total；這裡先假設有）

   今天＝2026-11-20（schoolTimezone 以學校為準，這裡不算時區）——定在這一天是為了讓「全球暖化」7A（Nov 18）已結束、7B（Nov 25）還在跑，同一張卡兩種狀態都看得到。
   「結束」照 v24 定案 ①（2026-11-18 改）：**每一班都**過了到期日才算；沒到期日的班永遠不結束。
   所以 In progress（還有一班沒到期）跟 Ended 不再重疊：指派過的練習只會在其中一個。
   =========================================================================== */
window.V24 = (function () {
  const TODAY = '2026-11-20';

  // 型別外觀 = practice-card-config.js getPracticeTypeConfig（卡片的框、頭、icon）＋ practice-type-labels.js 的 tag（chip）
  const TYPES = {
    MIRRORING:        { label: 'Content Mirroring',    tag: { wash: '#DCFCE7', label: '#15803D', icon: 'mic' },         card: { border: '#BBF7D0', headerBg: '#F0FDF4', divider: '#DCFCE7', iconBg: '#DCFCE7', iconColor: '#16A34A', btn: '#00CB61', btnHover: '#00A749' } },
    VOCAB_MIRRORING:  { label: 'Vocabulary Mirroring', tag: { wash: '#FEF3C7', label: '#D97706', icon: 'mic' },         card: { border: '#FDE68A', headerBg: '#FFFBEB', divider: '#FEF3C7', iconBg: '#FEF3C7', iconColor: '#D97706', btn: '#FFAB00', btnHover: '#B76E00' }, icon: 'bookmark' },
    VOCAB_QUIZ:       { label: 'Vocabulary Quiz',      tag: { wash: '#FEF3C7', label: '#D97706', icon: 'bookmark' },    card: { border: '#FDE68A', headerBg: '#FFFBEB', divider: '#FEF3C7', iconBg: '#FEF3C7', iconColor: '#D97706', btn: '#FFAB00', btnHover: '#B76E00' }, icon: 'bookmark' },
    SENTENCE_SCRAMBLE:{ label: 'Sentence Scramble',    tag: { wash: '#FCE7F3', label: '#EC4899', icon: 'view_column' }, card: { border: '#FBCFE8', headerBg: '#FDF2F8', divider: '#FCE7F3', iconBg: '#FCE7F3', iconColor: '#EC4899', btn: '#EC4899', btnHover: '#DB2777' } },
    SENTENCE_CLOZE:   { label: 'Sentence Cloze',       tag: { wash: '#FCE7F3', label: '#EC4899', icon: 'edit_note' },   card: { border: '#FBCFE8', headerBg: '#FDF2F8', divider: '#FCE7F3', iconBg: '#FCE7F3', iconColor: '#EC4899', btn: '#EC4899', btnHover: '#DB2777' }, icon: 'view_column' },
    SENTENCE_BUILDING:{ label: 'Sentence Building',    tag: { wash: '#CCFBF1', label: '#14B8A6', icon: 'route' },       card: { border: '#99F6E4', headerBg: '#F0FDFA', divider: '#CCFBF1', iconBg: '#CCFBF1', iconColor: '#14B8A6', btn: '#14B8A6', btnHover: '#0D9488' } },
    SENTENCE_RESPONSE:{ label: 'Sentence Response',    tag: { wash: '#CCFBF1', label: '#14B8A6', icon: 'route' },       card: { border: '#99F6E4', headerBg: '#F0FDFA', divider: '#CCFBF1', iconBg: '#CCFBF1', iconColor: '#14B8A6', btn: '#14B8A6', btnHover: '#0D9488' } },
    COMPREHENSION_QUIZ:{ label: 'Comprehension Quiz',  tag: { wash: '#EDE9FE', label: '#7C3AED', icon: 'quiz' },        card: { border: '#DDD6FE', headerBg: '#F5F3FF', divider: '#EDE9FE', iconBg: '#EDE9FE', iconColor: '#7C3AED', btn: '#7C3AED', btnHover: '#6D28D9' } },
    OPEN_ENDED:       { label: 'Open-ended Questions', tag: { wash: '#DBEAFE', label: '#2563EB', icon: 'chat_bubble' }, card: { border: '#BFDBFE', headerBg: '#EFF6FF', divider: '#DBEAFE', iconBg: '#DBEAFE', iconColor: '#2563EB', btn: '#508AFC', btnHover: '#193592' } },
  };
  // 卡片 header 的 icon 照 getPracticeTypeConfig（Vocabulary 兩種都是 bookmark、Cloze 跟 Scramble 一樣 view_column）；tag.icon 是型別 chip／標題用的
  const cardIcon = (t) => TYPES[t].icon || TYPES[t].tag.icon;

  // classes: [班名, 到期日 (null＝沒設), optional, submitted, total]
  const PRACTICES = [
    { id: 'p1',  name: '全球暖化',     type: 'VOCAB_MIRRORING',   project: '全球暖化',   created: '2026-11-03', v: 2, classes: [['Class 7A', '2026-11-18', false, 8, 10], ['Class 7B', '2026-11-25', false, 3, 8]] },
    { id: 'p2',  name: '环境保护',     type: 'COMPREHENSION_QUIZ', project: '环境保护',   created: '2026-11-02', v: 1, classes: [['Class 7A', '2026-11-20', false, 5, 10]] },
    { id: 'p3',  name: '我的家人 (2)', type: 'SENTENCE_RESPONSE',  project: '我的家人',   created: '2026-11-01', v: 1, classes: [] },
    { id: 'p4',  name: '我的一天',     type: 'MIRRORING',          project: '我的一天',   created: '2026-10-28', v: 3, classes: [['Class 8A', '2026-11-10', false, 12, 12], ['Class 8B', '2026-11-10', false, 9, 11]] },
    { id: 'p5',  name: '环境保护',     type: 'OPEN_ENDED',         project: '环境保护',   created: '2026-10-27', v: 1, classes: [['Class 7B', null, true, 2, 8]] },
    { id: 'p6',  name: '我的一天',     type: 'SENTENCE_BUILDING',  project: '我的一天',   created: '2026-10-25', v: 1, classes: [['Class 8B', '2026-11-28', false, 0, 11]] },
    { id: 'p7',  name: '我的学校',     type: 'SENTENCE_CLOZE',     project: '我的学校',   created: '2026-10-22', v: 1, classes: [['Class 8A', '2026-11-15', false, 7, 12], ['Class 8B', '2026-12-01', true, 1, 11]] },
    { id: 'p8',  name: '全球暖化',     type: 'VOCAB_QUIZ',         project: '全球暖化',   created: '2026-10-20', v: 1, classes: [['Class 7A', '2026-11-05', false, 10, 10]] },
    { id: 'p9',  name: '我的一天',     type: 'SENTENCE_SCRAMBLE',  project: '我的一天',   created: '2026-10-15', v: 2, classes: [['Class 8A', '2026-10-30', true, 11, 12]] },
    { id: 'p10', name: '天气',         type: 'OPEN_ENDED',         project: '天气',       created: '2026-10-12', v: 1, classes: [['Class 7B', '2026-11-01', false, 5, 8]] },
    { id: 'p11', name: '春节',         type: 'VOCAB_MIRRORING',    project: '春节',       created: '2026-10-08', v: 1, classes: [] },
    { id: 'p12', name: '春节',         type: 'MIRRORING',          project: '春节',       created: '2026-10-05', v: 1, classes: [['Class 7A', '2026-10-20', false, 6, 10]] },
  ].map((p) => ({
    ...p,
    classes: p.classes.map(([name, due, optional, submitted, total]) => ({ name, due, optional, submitted, total, ended: !!due && due < TODAY })),
  }));

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fmtDay = (d) => { const [, m, dd] = d.split('-').map(Number); return `${MONTHS[m - 1]} ${dd}`; };
  const daysUntil = (d) => Math.round((new Date(d) - new Date(TODAY)) / 86400000);

  // v24 定案 ①②：Ended＝任一班過期；In progress＝任一班還沒過期或沒到期日；沒指派的只在 All
  const isEnded = (p) => p.classes.length > 0 && p.classes.every((c) => c.ended);   // 2026-11-18 改：每一班都過了到期日才算 Ended（原本任一班）；沒到期日的班永遠不結束，所以這張也不會進 Ended
  const inProgress = (p) => p.classes.some((c) => !c.ended);
  const latestEnd = (p) => p.classes.filter((c) => c.ended).map((c) => c.due).sort().pop() || '';
  const byCreated = (a, b) => b.created.localeCompare(a.created);
  const byEnded = (a, b) => latestEnd(b).localeCompare(latestEnd(a)) || byCreated(a, b);   // 定案 ⑤
  const listFor = (tab) => {
    if (tab === 'ended') return PRACTICES.filter(isEnded).sort(byEnded);
    if (tab === 'progress') return PRACTICES.filter(inProgress).sort(byCreated);
    if (tab === 'unassigned') return PRACTICES.filter((p) => !p.classes.length).sort(byCreated);   // 2026-11-17：一個班都還沒指派
    return [...PRACTICES].sort(byCreated);
  };
  const counts = () => ({ all: PRACTICES.length, unassigned: PRACTICES.filter((p) => !p.classes.length).length, progress: PRACTICES.filter(inProgress).length, ended: PRACTICES.filter(isEnded).length });

  // 進 v23 Results 頁要帶的 type（v23 mock.js 的 PRACTICES key）
  const V23_TYPE = { MIRRORING: 'mirroring', VOCAB_MIRRORING: 'vocab', VOCAB_QUIZ: 'vocabquiz', SENTENCE_SCRAMBLE: 'scramble', SENTENCE_CLOZE: 'scramble', SENTENCE_BUILDING: 'building', SENTENCE_RESPONSE: 'response', COMPREHENSION_QUIZ: 'quiz', OPEN_ENDED: 'openended' };
  const resultHref = (p, file, extra = '') => {
    const cls = p.classes.map((k) => `${k.name}|${k.due ? `Due ${fmtDay(k.due)}` : `From ${fmtDay(p.created)}`}`).join(';');
    return `../v23-practice-results/${file}?type=${V23_TYPE[p.type]}&name=${encodeURIComponent(p.name)}&cls=${encodeURIComponent(cls)}${extra}`;
  };
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  return { TODAY, TYPES, PRACTICES, cardIcon, fmtDay, daysUntil, isEnded, inProgress, latestEnd, listFor, counts, resultHref, esc };
}());
