/* ===========================================================================
   v23 共用假資料 —— 基準檔（results-baseline.html）與提案（proposal.html）共用同一份，兩邊才比得起來。

   這頁是老師看「一份指派」的成果：左欄名單、右欄一個學生的細節。右欄照練習型別換 panel
   （history/index.js renderDetail），所以假資料也照型別分：

     type=vocab      Vocabulary Mirroring「全球暖化」—— V2 引擎（每個字一欄、0–100）→ sentence-panel.js 的 V2SentenceCard
     type=mirroring  Content Mirroring「我的一天」—— V2 引擎（2026-11-18 改；中文現在交卷都是 V2）：一字一欄、聲調圖、分數 /100
     type=vocabquiz  Vocabulary Quiz「全球暖化」—— mcResult → mc-panel.js（題型是 VOCAB_MC_*）
     type=quiz       Comprehension Quiz「环境保护」—— mc-panel.js（True/False、Multi-Choice ＋ 分類）
     type=scramble   Sentence Scramble「我的一天」—— scramble-panel.js（Cloze 也走這個 panel）
     type=building   Sentence Building —— follow-pattern-panel.js（Teaching Point 綠框）
     type=response   Sentence Response —— follow-pattern-panel.js（Pattern 綠框）
     type=openended  Open-ended Questions —— qa-panel.js（對話 ＋ AI Feedback 兩個 tab）

   名單兩個班級指派（7A、7B）＋ 一個離開班級的學生；每個學生一個基本分，各型別的細節
   用同一套模板、分數照基本分縮放（這是設計稿，不是真資料）。
   分數規則照產品：V1 星星 ×20 ＝ 百分比；V2 直接 0–100；逾期 lateCredit 乘上去再四捨五入；
   老師改分 overrideScore 蓋過系統分、逾期不再乘（utils/assignment.js lateCreditOf）。
   =========================================================================== */
window.V23 = (function () {
  /* ---------- 練習（八張卡在這頁的樣子） ---------- */
  // tag ＝ practice-type-labels.js PRACTICE_TYPE_ENTRIES[*].tag（PracticeTypeChip 用 wash／label）
  const PRACTICES = {
    vocab:     { key: 'vocab',     name: '全球暖化',   practiceType: 'VOCABULARY',        label: 'Vocabulary Mirroring',  tag: { wash: '#FEF3C7', label: '#D97706', icon: 'mic' },            panel: 'sentence', engine: 'V2' },
    mirroring: { key: 'mirroring', name: '我的一天',   practiceType: 'MIRRORING',         label: 'Content Mirroring',     tag: { wash: '#DCFCE7', label: '#15803D', icon: 'mic' },            panel: 'sentence', engine: 'V2' },   // 2026-11-18：使用者確認中文現在交卷都是 V2
    vocabquiz: { key: 'vocabquiz', name: '全球暖化',   practiceType: 'VOCABULARY',        label: 'Vocabulary Quiz',       tag: { wash: '#FEF3C7', label: '#D97706', icon: 'bookmark' },       panel: 'mc' },
    quiz:      { key: 'quiz',      name: '环境保护',   practiceType: 'MULTIPLE_CHOICE',   label: 'Comprehension Quiz',    tag: { wash: '#EDE9FE', label: '#7C3AED', icon: 'quiz' },           panel: 'mc' },
    scramble:  { key: 'scramble',  name: '我的一天',   practiceType: 'SENTENCE_SCRAMBLE', label: 'Sentence Scramble',     tag: { wash: '#FCE7F3', label: '#EC4899', icon: 'view_column' },    panel: 'scramble' },
    building:  { key: 'building',  name: '我的一天',   practiceType: 'FOLLOW_PATTERN',    label: 'Sentence Building',     tag: { wash: '#CCFBF1', label: '#14B8A6', icon: 'route' },          panel: 'fp', subType: 'SENTENCE_BUILDING' },
    response:  { key: 'response',  name: '我的一天',   practiceType: 'FOLLOW_PATTERN',    label: 'Sentence Response',     tag: { wash: '#CCFBF1', label: '#14B8A6', icon: 'route' },          panel: 'fp', subType: 'GUIDED_RESPONSE' },
    openended: { key: 'openended', name: '环境保护',   practiceType: 'QA',                label: 'Open-ended Questions',  tag: { wash: '#DBEAFE', label: '#2563EB', icon: 'chat_bubble' },    panel: 'qa' },
  };
  // 能改分的只有這四種（score-override-control.js OVERRIDABLE_PRACTICE_TYPES）；MC／Scramble 連評語都沒有（panel 沒放）
  const OVERRIDABLE = new Set(['MIRRORING', 'VOCABULARY', 'QA', 'FOLLOW_PATTERN']);
  const hasReview = (p) => p.panel === 'sentence' || p.panel === 'fp' || p.panel === 'qa';

  /* ---------- 名單：每個班級指派一組（submission-roster.js buildRoster） ---------- */
  // base ＝ 系統分（0–100）；late ＝ lateCredit；old ＝ 答的是舊版；override ＝ 老師改過的分；null ＝ 沒交
  const GROUPS = [
    { key: 'a1', className: 'Class 7A', due: 'Due Nov 20', students: [
      { id: 'emma',   name: 'Emma Chen',    base: 92, on: 'Nov 15', prev: [{ base: 72, on: 'Nov 12' }] },   // 2026-11-18：重交過（提案用；prev＝之前交的，舊到新）
      { id: 'liam',   name: 'Liam Wang',    base: 85, late: 80, lateDays: 2 },   // 2026-11-18：lateDays＝遲交幾天（交卷時間 − 到期日）
      { id: 'olivia', name: 'Olivia Liu',   base: 78, old: 2 },
      { id: 'noah',   name: 'Noah Zhang',   base: null },
      { id: 'ava',    name: 'Ava Huang',    base: 64, override: 85 },
      { id: 'ethan',  name: 'Ethan Lin',    base: 100 },
      { id: 'mia',    name: 'Mia Wu',       base: 58, on: 'Nov 19', prev: [{ base: 66, on: 'Nov 14' }] },   // 2026-11-18：重交、分數變低
      { id: 'lucas',  name: 'Lucas Yang',   base: 88 },
      { id: 'sophia', name: 'Sophia Zhao',  base: 71 },
      { id: 'mason',  name: 'Mason Xu',     base: null },
    ] },
    { key: 'b1', className: 'Class 7B', due: 'Due Nov 18', students: [
      { id: 'isa',    name: 'Isabella Sun', base: 96 },
      { id: 'james',  name: 'James Guo',    base: null },
      { id: 'amelia', name: 'Amelia Ma',    base: 82 },
      { id: 'ben',    name: 'Benjamin Hu',  base: 47 },
      { id: 'char',   name: 'Charlotte Zhou', base: 100 },
      { id: 'henry',  name: 'Henry Gao',    base: 69, late: 60, lateDays: 4 },
      { id: 'harper', name: 'Harper Luo',   base: null },
      { id: 'daniel', name: 'Daniel Tang',  base: null },
    ] },
  ];
  // 產品還有兩組尾巴：Not in class（名單外交卷者）、Left class（交了之後被移出班級，group.left=true、不算進小卡、不能改分）。
  // 2026-11-12 使用者「先拿掉這些特殊情況再 demo」→ demo 不放；兩張 html 的 g.left 判斷留著。

  const applyLate = (score, late) => (late == null ? score : Math.round((score * late) / 100));
  // 列表與右上角顯示的分（getScorePercent：改分蓋過系統分、改分之後不再乘逾期）
  const scoreOf = (s) => {
    if (s.base == null) return null;
    if (s.override != null) return s.override;
    return applyLate(s.base, s.late);
  };
  const lateOf = (s) => (s.override != null ? null : s.late ?? null);
  const starsOf = (s) => Math.round(((s.override ?? s.base) / 20) * 2) / 2;

  // 左欄順序：交了的在前、再照名字（left-panel.js ClassGroup）
  const sortedStudents = (g) => [...g.students].sort((a, b) => {
    const sa = a.base != null, sb = b.base != null;
    if (sa !== sb) return sa ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  const allStudents = () => GROUPS.flatMap((g) => g.students.map((s) => ({ ...s, group: g })));
  const summary = () => {
    const rows = allStudents().filter((s) => s.base != null && !s.group.left);
    const scores = rows.map(scoreOf);
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    return { submitted: rows.length, avg, perfect: scores.filter((x) => x === 100).length };
  };
  // v23 提案：三個數字改每班各算（2026-11-12 使用者「這些數值應該要 under 在每個 class 以下，不是綜合所有 class」）
  const summaryFor = (g) => {
    const rows = g.students.filter((s) => s.base != null);
    const scores = rows.map(scoreOf);
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    return { submitted: rows.length, total: g.students.length, avg, perfect: scores.filter((x) => x === 100).length };
  };
  const firstSubmitted = () => {
    for (const g of GROUPS) { const s = sortedStudents(g).find((x) => x.base != null); if (s) return s.id; }
    return null;
  };
  const studentById = (id) => allStudents().find((s) => s.id === id) || null;

  /* ---------- 逐詞三色（graded-sentence.js COLORS）與 V2 欄色（pronunciation-scoring.js ROW_COLORS） ---------- */
  const STATUS = { correct: '#22C55E', warning: '#F59E0B', incorrect: '#EF4444', default: '#374151' };
  const ROW = { green: '#22C55E', yellow: '#F59E0B', red: '#EF4444', grey: '#9ca3af' };

  /* ---------- Vocabulary Mirroring「全球暖化」—— 一個詞三張卡（parsePracticeCards：vocab → example1 → example2），V2 每個字一欄 ---------- */
  // c = 每個字 [字, 拼音, 欄色]；tone = 選到的那個字的聲調對照（學生念的／應該念的）
  const VOCAB = [
    { word: '全球暖化', py: 'quán qiú nuǎn huà', en: 'global warming', cards: [
      { c: [['全','quán','green'],['球','qiú','green'],['暖','nuǎn','red'],['化','huà','green']], overall: 76, result: 'ok', tone: { word: '暖', pinyin: 'nuan', heard: 2, expected: 3 } },
      { text: '全球暖化是一个严重的问题。', c: [['全','quán','green'],['球','qiú','green'],['暖','nuǎn','green'],['化','huà','green'],['是','shì','green'],['一','yí','green'],['个','ge','green'],['严','yán','yellow'],['重','zhòng','green'],['的','de','green'],['问','wèn','green'],['题','tí','green']], overall: 91, result: 'ok', tone: { word: '严', pinyin: 'yan', heard: null, expected: 2 } },
      { text: '科学家一直在研究全球暖化。', c: [['科','kē','green'],['学','xué','green'],['家','jiā','green'],['一','yì','green'],['直','zhí','green'],['在','zài','green'],['研','yán','green'],['究','jiū','green'],['全','quán','green'],['球','qiú','green'],['暖','nuǎn','green'],['化','huà','green']], overall: 98, result: 'perfect' },
    ] },
    { word: '温室效应', py: 'wēn shì xiào yìng', en: 'greenhouse effect', cards: [
      { c: [['温','wēn','green'],['室','shì','green'],['效','xiào','green'],['应','yìng','yellow']], overall: 84, result: 'ok', tone: { word: '应', pinyin: 'ying', heard: 1, expected: 4 } },
      { text: '温室效应让地球越来越热。', c: [['温','wēn','green'],['室','shì','green'],['效','xiào','green'],['应','yìng','green'],['让','ràng','green'],['地','dì','green'],['球','qiú','green'],['越','yuè','green'],['来','lái','green'],['越','yuè','green'],['热','rè','green']], overall: 95, result: 'perfect' },
      { text: '二氧化碳会加强温室效应。', c: [['二','èr','green'],['氧','yǎng','red'],['化','huà','green'],['碳','tàn','green'],['会','huì','green'],['加','jiā','green'],['强','qiáng','grey'],['温','wēn','green'],['室','shì','green'],['效','xiào','green'],['应','yìng','green']], overall: 62, result: 'retry', tone: { word: '氧', pinyin: 'yang', heard: 2, expected: 3 } },
    ] },
    { word: '冰川', py: 'bīng chuān', en: 'glacier', cards: [
      { c: [['冰','bīng','green'],['川','chuān','green']], overall: 100, result: 'perfect' },
      { text: '北极的冰川正在融化。', c: [['北','běi','green'],['极','jí','green'],['的','de','green'],['冰','bīng','green'],['川','chuān','green'],['正','zhèng','green'],['在','zài','green'],['融','róng','yellow'],['化','huà','green']], overall: 88, result: 'ok', tone: { word: '融', pinyin: 'rong', heard: null, expected: 2 } },
      { text: '冰川融化会让海平面上升。', c: [['冰','bīng','green'],['川','chuān','green'],['融','róng','green'],['化','huà','green'],['会','huì','green'],['让','ràng','green'],['海','hǎi','green'],['平','píng','green'],['面','miàn','green'],['上','shàng','green'],['升','shēng','green']], overall: 97, result: 'perfect' },
    ] },
    { word: '排放', py: 'pái fàng', en: 'emission', cards: [
      { c: [['排','pái','green'],['放','fàng','green']], overall: 93, result: 'ok' },
      { text: '工厂排放了很多废气。', c: [['工','gōng','green'],['厂','chǎng','green'],['排','pái','green'],['放','fàng','green'],['了','le','green'],['很','hěn','green'],['多','duō','green'],['废','fèi','red'],['气','qì','green']], overall: 74, result: 'ok', tone: { word: '废', pinyin: 'fei', heard: 1, expected: 4 } },
      { text: '我们要减少二氧化碳的排放。', c: [['我','wǒ','green'],['们','men','green'],['要','yào','green'],['减','jiǎn','green'],['少','shǎo','green'],['二','èr','green'],['氧','yǎng','green'],['化','huà','green'],['碳','tàn','green'],['的','de','green'],['排','pái','green'],['放','fàng','green']], overall: 96, result: 'perfect' },
    ] },
    { word: '节能', py: 'jié néng', en: 'save energy', cards: [
      { c: [['节','jié','green'],['能','néng','green']], overall: 99, result: 'perfect' },
      { text: '节能减碳，从我做起。', c: [['节','jié','green'],['能','néng','green'],['减','jiǎn','green'],['碳','tàn','green'],['从','cóng','green'],['我','wǒ','green'],['做','zuò','green'],['起','qǐ','green']], overall: 94, result: 'perfect' },
      { text: '这种灯泡很节能。', c: [['这','zhè','green'],['种','zhǒng','yellow'],['灯','dēng','green'],['泡','pào','green'],['很','hěn','green'],['节','jié','green'],['能','néng','green']], overall: 86, result: 'ok', tone: { word: '种', pinyin: 'zhong', heard: null, expected: 3 } },
    ] },
  ];
  // 攤成 scores 的樣子：idx 0..14、content、engine V2
  const vocabCards = () => VOCAB.flatMap((w, wi) => w.cards.map((card, ci) => ({
    idx: wi * 3 + ci, kind: ci === 0 ? 'word' : 'example', content: card.text || w.word, en: ci === 0 ? w.en : null,
    engine: 'V2', cols: card.c.map(([ch, py, color]) => ({ word: ch, pinyin: py, color })),
    overall: card.overall, result: card.result, tone: card.tone || null, s3: true,
    retakes: ci === 0 && wi === 0 ? 3 : (card.result === 'retry' ? 2 : 1),
  })));

  /* ---------- Content Mirroring「我的一天」—— V1：逐詞三色、星星、AI Feedback ---------- */
  const MIRROR = [
    { text: '我每天六点半起床。', en: 'I get up at six thirty every day.', overall: 4.5, words: [['我','wǒ','correct'],['每天','měi tiān','correct'],['六点半','liù diǎn bàn','warning'],['起床','qǐ chuáng','correct']],
      fb: { pron: { summary: 'Most sounds are clear; one syllable needs attention.', items: [{ word: '六点半', pinyin: 'liù diǎn bàn', color: 'yellow', issue: '"diǎn" was heard closer to "dian" with a flat tone.', tip: 'Dip the voice on the third tone, then let it rise slightly.' }] }, tone: { summary: 'Tones are mostly right.', items: [] } } },
    { text: '起床以后我先刷牙洗脸。', en: 'After getting up I brush my teeth and wash my face first.', overall: 3.5, words: [['起床','qǐ chuáng','correct'],['以后','yǐ hòu','correct'],['我','wǒ','correct'],['先','xiān','correct'],['刷牙','shuā yá','incorrect'],['洗脸','xǐ liǎn','warning']],
      fb: { pron: { summary: 'Two words need work.', items: [{ word: '刷牙', pinyin: 'shuā yá', color: 'red', issue: '"shuā" sounded like "sua" — the retroflex "sh" was missing.', tip: 'Curl the tongue tip back toward the roof of the mouth for "sh".' }, { word: '洗脸', pinyin: 'xǐ liǎn', color: 'yellow', issue: '"liǎn" was slightly short.', tip: 'Hold the vowel a little longer before closing the "n".' }] }, tone: { summary: 'One tone slipped.', items: [{ word: '刷牙', pinyin: 'shuā yá', color: 'red', issue: '"yá" was said with a falling tone.', tip: 'The second tone rises — like asking a question.' }] } } },
    { text: '早饭我喜欢喝豆浆吃包子。', en: 'For breakfast I like to drink soy milk and eat baozi.', overall: 5, words: [['早饭','zǎo fàn','correct'],['我','wǒ','correct'],['喜欢','xǐ huan','correct'],['喝','hē','correct'],['豆浆','dòu jiāng','correct'],['吃','chī','correct'],['包子','bāo zi','correct']], fb: null },
    { text: '我坐地铁去学校，大概要三十分钟。', en: 'I take the subway to school; it takes about thirty minutes.', overall: 4, words: [['我','wǒ','correct'],['坐','zuò','correct'],['地铁','dì tiě','correct'],['去','qù','correct'],['学校','xué xiào','correct'],['大概','dà gài','warning'],['要','yào','correct'],['三十','sān shí','correct'],['分钟','fēn zhōng','correct']],
      fb: { pron: { summary: 'Clear overall.', items: [{ word: '大概', pinyin: 'dà gài', color: 'yellow', issue: '"gài" was a little quiet.', tip: 'Give the second syllable the same weight as the first.' }] }, tone: null } },
    { text: '下午四点放学以后我去打篮球。', en: 'After school at four in the afternoon I go play basketball.', overall: 3, autoPass: true, attempts: 5, words: [['下午','xià wǔ','correct'],['四点','sì diǎn','warning'],['放学','fàng xué','correct'],['以后','yǐ hòu','correct'],['我','wǒ','correct'],['去','qù','correct'],['打','dǎ','incorrect'],['篮球','lán qiú','warning']],
      fb: { pron: { summary: 'Several words need practice.', items: [{ word: '打', pinyin: 'dǎ', color: 'red', issue: '"dǎ" was heard as "tǎ".', tip: 'Keep "d" unaspirated — no puff of air.' }, { word: '篮球', pinyin: 'lán qiú', color: 'yellow', issue: '"qiú" was heard closer to "chiu".', tip: 'Spread the lips for "q" and keep the tongue forward.' }] }, tone: { summary: 'One tone to fix.', items: [{ word: '四点', pinyin: 'sì diǎn', color: 'yellow', issue: '"diǎn" did not dip.', tip: 'Start low, dip, then rise for the third tone.' }] } } },
    { text: '晚上我做作业，十点睡觉。', en: 'In the evening I do homework and go to bed at ten.', overall: 4.5, words: [['晚上','wǎn shang','correct'],['我','wǒ','correct'],['做','zuò','correct'],['作业','zuò yè','correct'],['十点','shí diǎn','correct'],['睡觉','shuì jiào','warning']],
      fb: { pron: { summary: 'Nearly there.', items: [{ word: '睡觉', pinyin: 'shuì jiào', color: 'yellow', issue: '"shuì" lost the "u" glide.', tip: 'Round the lips before "shui".' }] }, tone: null } },
  ];
  const mirrorCards = () => MIRROR.map((s, i) => ({
    idx: i, content: s.text, en: s.en, engine: 'V1', overall: s.overall, autoPass: !!s.autoPass, attempts: s.attempts || 1,
    words: s.words.map(([word, pinyin, status]) => ({ word, pinyin, status })), fb: s.fb, s3: true,
    interaction: { pinyin: i !== 2, translation: i === 0 || i === 4 },
    retakes: i === 1 ? 3 : (s.autoPass ? 5 : 1),
  }));
  // 2026-11-18：Content Mirroring 改 V2（使用者確認中文都是 V2）——同一批句子拆成一字一欄，status 換成 V2 的四色，分數 ×20
  const V2COLOR = { correct: 'green', warning: 'yellow', incorrect: 'red' };
  const mirrorV2Cards = () => MIRROR.map((s, i) => {
    const cols = s.words.flatMap(([w, py, st]) => { const sy = py.split(' '); return [...w].map((ch, k) => ({ word: ch, pinyin: sy[k] || '', color: V2COLOR[st] })); });
    const overall = Math.round(s.overall * 20);
    return { idx: i, kind: 'sentence', content: s.text, en: s.en, engine: 'V2', cols, overall,
      result: overall >= 94 ? 'perfect' : overall >= 60 ? 'ok' : 'retry', autoPass: !!s.autoPass, attempts: s.attempts || 1,
      tone: i === 0 ? { word: '六', pinyin: 'liu', heard: 2, expected: 4 } : null,   // 跟畫面框起來的第一個黃字同一個 s3: true,
      retakes: i === 1 ? 3 : (s.autoPass ? 5 : 1) };
  });
  const rubricOf = (cards) => {
    const v2 = cards[0]?.engine === 'V2';
    const scale = v2 ? 100 : 5;
    const avg = cards.reduce((a, c) => a + c.overall, 0) / cards.length;
    return { fluency: Math.round((avg / scale) * 100) - 4, accuracy: Math.round((avg / scale) * 100) + 2, pronunciation: Math.round((avg / scale) * 100), vocabulary: 0 };
  };

  /* ---------- Quiz（mc-panel.js）：題目讀的是學生答的那一版（getMCReview） ---------- */
  const QUIZ_Q = [
    { q: '课文说全球暖化的主要原因是人类活动。', type: 'true_or_false', cat: 'comprehension', choice: { A: 'True', B: 'False' }, ans: 'A' },
    { q: '根据课文，哪一种做法最能减少二氧化碳？', type: 'multi_choice', cat: 'comprehension', choice: { A: '多开车', B: '多坐公共交通', C: '多买东西', D: '多开空调' }, ans: 'B' },
    { q: '「温室效应」的拼音是？', type: 'multi_choice', cat: 'pinyin', choice: { A: 'wēn shì xiào yìng', B: 'wén shí xiāo yīng', C: 'wēn shī xiào yìng', D: 'wèn shì xiǎo yìng' }, ans: 'A' },
    { q: '课文提到冰川融化会让海平面下降。', type: 'true_or_false', cat: 'comprehension', choice: { A: 'True', B: 'False' }, ans: 'B' },
    { q: '「排放」的意思是？', type: 'multi_choice', cat: 'meaning', choice: { A: 'to emit', B: 'to recycle', C: 'to save', D: 'to plant' }, ans: 'A' },
    { q: '我们要____用电，少开灯。', type: 'multi_choice', cat: 'usage', choice: { A: '节能', B: '节约', C: '排放', D: '保护' }, ans: 'B' },
    { q: '课文最后一段鼓励大家从日常生活做起。', type: 'true_or_false', cat: 'comprehension', choice: { A: 'True', B: 'False' }, ans: 'A' },
    { q: '下面哪一个不是课文提到的环保做法？', type: 'multi_choice', cat: 'comprehension', choice: { A: '自带购物袋', B: '随手关灯', C: '少用一次性餐具', D: '多买新衣服' }, ans: 'D' },
  ];
  const VQUIZ_Q = [
    { q: '全球暖化', type: 'VOCAB_MC_CN_TO_EN', cat: 'meaning', choice: { A: 'global warming', B: 'greenhouse effect', C: 'glacier', D: 'emission' }, ans: 'A' },
    { q: 'greenhouse effect', type: 'VOCAB_MC_EN_TO_CN', cat: 'meaning', choice: { A: '全球暖化', B: '温室效应', C: '节能', D: '冰川' }, ans: 'B' },
    { q: '', type: 'VOCAB_MC_AUDIO_TO_CN', cat: 'pinyin', choice: { A: '冰川', B: '冰山', C: '冰箱', D: '冰水' }, ans: 'A' },
    { q: 'emission', type: 'VOCAB_MC_EN_TO_PINYIN', cat: 'pinyin', choice: { A: 'pái fàng', B: 'pài fáng', C: 'pái fáng', D: 'pāi fàng' }, ans: 'A' },
    { q: '', type: 'VOCAB_MC_IMAGE_TO_CN', cat: 'meaning', choice: { A: '排放', B: '节能', C: '冰川', D: '温室' }, ans: 'B' },
    { q: '节能', type: 'VOCAB_MC_CN_TO_EN', cat: 'meaning', choice: { A: 'save energy', B: 'save money', C: 'save time', D: 'save water' }, ans: 'A' },
  ];
  // 每個學生答錯哪幾題照分數算：分數越低錯越多
  const mcResultFor = (questions, s) => {
    const base = s.base ?? 0;
    const wrong = Math.round(((100 - base) / 100) * questions.length);
    const wrongSet = new Set([1, 3, 5, 7, 0, 2, 4, 6].slice(0, wrong).filter((i) => i < questions.length));
    const answers = questions.map((q, i) => {
      const isCorrect = !wrongSet.has(i);
      const keys = Object.keys(q.choice);
      const selected = isCorrect ? q.ans : keys.find((k) => k !== q.ans);
      return { questionIndex: i, isCorrect, selected, correct: q.ans };
    });
    const correctCount = answers.filter((a) => a.isCorrect).length;
    return { answers, totalCount: questions.length, correctCount, score: Math.round((correctCount / questions.length) * 100) };
  };

  /* ---------- Sentence Scramble（scramble-panel.js） ---------- */
  const SCRAMBLE = [
    ['我', '每天', '六点半', '起床', '。'],
    ['起床', '以后', '我', '先', '刷牙', '洗脸', '。'],
    ['早饭', '我', '喜欢', '喝', '豆浆', '吃', '包子', '。'],
    ['我', '坐', '地铁', '去', '学校', '。'],
    ['下午', '四点', '我', '去', '打', '篮球', '。'],
    ['晚上', '我', '十点', '睡觉', '。'],
  ];
  const scrambleResultFor = (s) => {
    const base = s.base ?? 0;
    const wrong = Math.round(((100 - base) / 100) * SCRAMBLE.length);
    const wrongSet = new Set([1, 4, 2, 0, 3, 5].slice(0, wrong));
    const answers = SCRAMBLE.map((correctOrder, i) => {
      const isCorrect = !wrongSet.has(i);
      const submittedOrder = isCorrect ? correctOrder : [correctOrder[1], correctOrder[0], ...correctOrder.slice(2)];
      return { questionIndex: i, isCorrect, submittedOrder, correctOrder };
    });
    const correctCount = answers.filter((a) => a.isCorrect).length;
    return { answers, totalCount: SCRAMBLE.length, correctCount, score: Math.round((correctCount / SCRAMBLE.length) * 100) };
  };

  /* ---------- Follow Pattern（follow-pattern-panel.js getFollowPatternReview） ---------- */
  const FP = {
    SENTENCE_BUILDING: [
      { q: 'Use 每天 to say something you do every morning.', ref: '每天', answer: '我每天早上七点起床。', transcript: '我每天早上七点起床。', stars: 5, attempts: 1, passed: true,
        criteria: [['TEACHING_POINT', 'PASS', 'Uses 每天 as a time adverb before the verb.'], ['GRAMMAR', 'PASS', null], ['CONTENT', 'PASS', null]], feedback: 'Natural and complete.' },
      { q: 'Use 以后 to describe what you do after school.', ref: '以后', answer: '放学以后我去打篮球。', transcript: '放学以后我去打篮球。', stars: 4, attempts: 2, passed: true,
        criteria: [['TEACHING_POINT', 'PASS', '以后 follows the event correctly.'], ['GRAMMAR', 'PASS', null], ['CONTENT', 'PASS', null]], feedback: 'Good. Second attempt added the subject 我.',
        repeat: { source: 'PATTERN', sentence: '放学以后我去打篮球。', translation: 'After school I go to play basketball.', count: 2, text: '2 recordings · best 88 / 100' } },
      { q: 'Use 大概 to estimate how long something takes.', ref: '大概', answer: '坐地铁大概三十分钟。', transcript: '坐地铁大概三十分钟。', stars: 3, attempts: 3, passed: false,
        criteria: [['TEACHING_POINT', 'PASS', null], ['GRAMMAR', 'FAIL', 'Missing the verb 要 before the duration.'], ['CONTENT', 'PASS', null]], correction: '坐地铁大概要三十分钟。', feedback: 'Almost — add 要 before the time span.' },
      { q: 'Use 喜欢 to say what you like for breakfast.', ref: '喜欢', answer: null, transcript: null, stars: 0, attempts: 0, passed: false, criteria: [] },
    ],
    GUIDED_RESPONSE: [
      { q: '你每天几点起床？', ref: '我每天……起床。', answer: '我每天六点半起床。', transcript: '我每天六点半起床。', stars: 5, attempts: 1, passed: true,
        criteria: [['PATTERN', 'PASS', 'Follows 我每天……起床。'], ['GRAMMAR', 'PASS', null], ['CONTENT', 'PASS', null]], feedback: 'Perfect match to the pattern.' },
      { q: '起床以后你先做什么？', ref: '起床以后我先……。', answer: '起床以后我先刷牙。', transcript: '起床以后我先刷牙。', stars: 4, attempts: 1, passed: true,
        criteria: [['PATTERN', 'PASS', null], ['GRAMMAR', 'PASS', null], ['CONTENT', 'PASS', null]], feedback: 'Good.',
        repeat: { source: 'PATTERN', sentence: '起床以后我先刷牙洗脸。', translation: 'After getting up I brush my teeth and wash my face first.', count: 1, text: '1 recording · 92 / 100' } },
      { q: '你怎么去学校？要多长时间？', ref: '我坐……去学校，大概要……。', answer: '我坐公交车去学校，大概二十分钟。', transcript: '我坐公交车去学校大概二十分钟', stars: 3, attempts: 2, passed: false,
        criteria: [['PATTERN', 'FAIL', 'The pattern needs 要 before the duration.'], ['GRAMMAR', 'PASS', null], ['CONTENT', 'PASS', null]], correction: '我坐公交车去学校，大概要二十分钟。', feedback: 'Close — keep 要 from the pattern.' },
      { q: '你晚上几点睡觉？', ref: '我晚上……睡觉。', answer: null, transcript: null, stars: 0, attempts: 0, passed: false, criteria: [] },
    ],
  };
  const fpReviewFor = (subType, s) => ({
    practiceSubType: subType, audioMode: false, practiceEdited: false,
    questions: FP[subType].map((q, i) => ({ idx: i, question: q.q, reference: q.ref, answer: q.answer, transcript: q.transcript, stars: q.stars,
      attemptCount: q.attempts, passed: q.passed, stale: false,
      criteria: q.criteria.map(([criterion, status, reason]) => ({ criterion, status, reason })),
      correction: q.correction || null, feedback: q.feedback || null, repeat: q.repeat || null, s3: q.answer ? true : false })),
  });

  /* ---------- Open-ended Questions（qa-panel.js）：對話 ＋ aiSummaryResult ---------- */
  const QA = {
    conversations: [
      { user: 'teacher', content: '课文里说，全球暖化会带来哪些影响？' },
      { user: 'student', content: '冰川会融化，海平面会上升。', overall: 4.5, words: [['冰川','bīng chuān','correct'],['会','huì','correct'],['融化','róng huà','correct'],['海平面','hǎi píng miàn','correct'],['会','huì','correct'],['上升','shàng shēng','warning']] },
      { user: 'teacher', content: '很好。那我们每个人可以做什么来减少排放？' },
      { user: 'student', content: '我们可以少开车，多坐公共交通。', overall: 2.5, words: [['我们','wǒ men','correct'],['可以','kě yǐ','correct'],['少','shǎo','incorrect'],['开车','kāi chē','correct'],['多','duō','correct'],['坐','zuò','warning'],['公共交通','gōng gòng jiāo tōng','incorrect']],
        checks: [{ id: 'c1', name: 'Pronunciation', reason: 'Two words were hard to understand: 少, 公共交通.' }] },
      { user: 'teacher', content: '再说一次：我们可以少开车，多坐公共交通。' },
      { user: 'student', content: '我们可以少开车，多坐公共交通。', overall: 4, words: [['我们','wǒ men','correct'],['可以','kě yǐ','correct'],['少','shǎo','correct'],['开车','kāi chē','correct'],['多','duō','correct'],['坐','zuò','correct'],['公共交通','gōng gòng jiāo tōng','warning']] },
      { user: 'teacher', content: '你自己平常有做过哪些节能的事？' },
      { user: 'student', content: '我出门的时候会关灯，也会自己带购物袋。', overall: 5, words: [['我','wǒ','correct'],['出门','chū mén','correct'],['的时候','de shí hou','correct'],['会','huì','correct'],['关灯','guān dēng','correct'],['也','yě','correct'],['会','huì','correct'],['自己','zì jǐ','correct'],['带','dài','correct'],['购物袋','gòu wù dài','correct']] },
    ],
    aiSummary: {
      stats: { totalQuestions: 3, totalAttempts: 4, mirroringCount: 1, hasAIAssistance: true },
      feedbackForStudent: 'You understood the passage well and answered every question with a complete sentence. Pronunciation slipped on 公共交通 the first time, but the repeat was clear.',
      studentHighlights: ['Used 冰川 and 海平面 from the text correctly', 'Gave a personal example for 节能'],
      practiceAreas: ['The third tone in 少 (shǎo)', 'Linking four-syllable words like 公共交通'],
      personalizedRecommendations: ['Record 公共交通 three times slowly, then at normal speed', 'Try answering the first question with two sentences next time'],
    },
  };

  /* ---------- 一個學生在一份練習的 history（右欄要的） ---------- */
  const historyFor = (p, s) => {
    const h = { student: s, score: scoreOf(s), late: lateOf(s), old: s.old || null, override: s.override ?? null, stars: starsOf(s), comment: s.id === 'emma' ? '' : (s.id === 'liam' ? 'Nice work — watch the third tone in 暖.' : '') };
    if (p.panel === 'sentence') {
      const cards = p.practiceType === 'MIRRORING' ? (p.engine === 'V2' ? mirrorV2Cards() : mirrorCards()) : (p.engine === 'V2' ? vocabCards() : mirrorCards());
      h.cards = cards; h.rubric = rubricOf(cards); h.v2 = p.engine === 'V2';
    } else if (p.panel === 'mc') {
      h.questions = p.key === 'vocabquiz' ? VQUIZ_Q : QUIZ_Q; h.mc = mcResultFor(h.questions, s); h.score = applyLate(h.mc.score, s.late); h.late = s.late ?? null;
    } else if (p.panel === 'scramble') {
      h.sc = scrambleResultFor(s); h.score = applyLate(h.sc.score, s.late); h.late = s.late ?? null;
    } else if (p.panel === 'fp') {
      h.review = fpReviewFor(p.subType, s);
    } else if (p.panel === 'qa') {
      h.conversations = QA.conversations; h.aiSummary = QA.aiSummary;
    }
    return h;
  };

  /* ---------- 共用的小圖（兩邊同一套 SVG，顏色是評分語意、不是版面 token） ---------- */
  const svgStatus = (status, size = 14) => {
    const c = STATUS[status] || STATUS.default;
    if (status === 'correct') return `<svg width="${size}" height="${size}" viewBox="0 0 18 18"><circle cx="9" cy="9" r="9" fill="${c}"/><path d="M5.5 9L8 11.5L12.5 6.5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
    if (status === 'warning') return `<svg width="${size}" height="${size}" viewBox="0 0 18 18"><circle cx="9" cy="9" r="9" fill="${c}"/><path d="M9 5V10" stroke="#fff" stroke-width="2" stroke-linecap="round"/><circle cx="9" cy="13" r="1.5" fill="#fff"/></svg>`;
    return `<svg width="${size}" height="${size}" viewBox="0 0 18 18"><circle cx="9" cy="9" r="9" fill="${c}"/><path d="M6 6L12 12M12 6L6 12" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`;
  };
  // V2 欄的狀態點（student-pitch-chart.js StatusIcon：check／priority_high／close／mic_off）
  const svgRow = (color, size = 14) => {
    const icon = { green: 'M5.5 9L8 11.5L12.5 6.5', red: 'M6 6L12 12M12 6L6 12', yellow: 'M9 5V10M9 13v.01', grey: 'M6 6L12 12' }[color];
    if (!icon) return `<span style="display:inline-block;width:${size}px;height:${size}px"></span>`;
    return `<svg width="${size}" height="${size}" viewBox="0 0 18 18"><circle cx="9" cy="9" r="9" fill="${ROW[color]}"/><path d="${icon}" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
  };
  // MUI Rating（readOnly，#FFAB00 實心、灰空心）
  const svgStars = (value, size = 18, gap = 2) => {
    let out = '';
    for (let i = 1; i <= 5; i += 1) {
      const fill = value >= i ? 1 : value >= i - 0.5 ? 0.5 : 0;
      const id = `st${size}-${i}-${Math.round(value * 10)}`;
      out += `<svg width="${size}" height="${size}" viewBox="0 0 24 24" style="margin-right:${gap}px"><defs><linearGradient id="${id}"><stop offset="${fill * 100}%" stop-color="#FFAB00"/><stop offset="${fill * 100}%" stop-color="rgba(145,158,171,.48)"/></linearGradient></defs><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="url(#${id})"/></svg>`;
    }
    return `<span style="display:inline-flex;align-items:center">${out}</span>`;
  };
  // Follow Pattern 的漸層星（star-rating.js GradientStar）
  const svgGradStars = (value, size = 14) => {
    let out = '';
    for (let i = 1; i <= 5; i += 1) {
      const filled = value >= i, half = !filled && value >= i - 0.5;
      const fill = filled ? '#FFC107' : half ? 'url(#gs-half)' : '#E0E0E0';
      out += `<svg width="${size}" height="${size}" viewBox="0 0 24 24" style="margin-right:4px"><defs><linearGradient id="gs-half"><stop offset="50%" stop-color="#FFC107"/><stop offset="50%" stop-color="#E0E0E0"/></linearGradient></defs><path d="M12 2.5c.4 0 .8.2 1 .6l2.4 5.1 5.4.8c.5.1.9.4 1 .9.2.5 0 1-.3 1.3l-4 4 1 5.5c.1.5-.1 1-.5 1.2-.4.3-.9.3-1.3.1L12 19.5l-4.7 2.5c-.4.2-.9.2-1.3-.1-.4-.3-.6-.7-.5-1.2l1-5.5-4-4c-.3-.3-.5-.8-.3-1.3.1-.5.5-.8 1-.9l5.4-.8 2.4-5.1c.2-.4.6-.6 1-.6z" fill="${fill}"/></svg>`;
    }
    return `<span style="display:inline-flex;align-items:center">${out}</span>`;
  };
  // 聲調箭頭（tone-arrow.js）
  const svgTone = (tone, color) => {
    const d = { 1: 'M6 10 L34 10', 2: 'M6 16 L34 4', 3: 'M6 4 C14 18, 26 18, 34 8', 4: 'M6 4 L34 16', 5: 'M6 11 L34 11' }[tone] || 'M6 10 L34 10';
    return `<svg width="40" height="20" viewBox="0 0 40 20"><path d="${d}" stroke="${color}" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M30 ${tone === 2 ? '2 L35 4 L31 8' : tone === 4 ? '12 L35 16 L30 18' : '8 L35 10 L30 13'}" stroke="${color}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  };
  // 音高圖（student-pitch-chart.js 的 recharts：虛線＝示範、實線＝學生、每欄照欄色）—— 設計稿畫的是形狀，不是真曲線
  const svgPitch = (cols, width = 640, height = 160, selected = -1) => {
    const n = cols.length; const padL = 40, padR = 20, top = 8, bottom = 12;
    const w = (width - padL - padR) / n;
    const yOf = (v) => top + (height - top - bottom) * (1 - v);
    const seed = (i, k) => 0.35 + 0.3 * Math.sin(i * 1.7 + k) + 0.15 * Math.cos(i * 0.9 + k * 2);
    let s = `<svg width="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" style="display:block">`;
    for (let g = 0; g <= 4; g += 1) { const y = top + ((height - top - bottom) * g) / 4; s += `<line x1="${padL}" x2="${width - padR}" y1="${y}" y2="${y}" stroke="#ccc" stroke-dasharray="3 3"/>`; }
    for (let i = 1; i < n; i += 1) { const x = padL + w * i; s += `<line x1="${x}" x2="${x}" y1="${top}" y2="${height - bottom}" stroke="#9ca3af" stroke-dasharray="6 4"/>`; }
    if (selected >= 0) s += `<rect x="${padL + w * selected}" y="${top}" width="${w}" height="${height - top - bottom}" fill="${ROW[cols[selected].color]}" fill-opacity=".08"/>`;
    const pts = (k) => cols.map((c, i) => [0, 0.5, 1].map((t) => `${padL + w * (i + t)},${yOf(seed(i + t, k))}`).join(' ')).join(' ');
    s += `<polyline points="${pts(1)}" fill="none" stroke="#9ca3af" stroke-width="2.5" stroke-dasharray="6 3"/>`;
    cols.forEach((c, i) => {
      if (c.color === 'grey') return;
      const seg = [0, 0.5, 1].map((t) => `${padL + w * (i + t)},${yOf(seed(i + t, 2) + (c.color === 'red' ? -0.18 : c.color === 'yellow' ? -0.08 : 0))}`).join(' ');
      s += `<polyline points="${seg}" fill="none" stroke="${ROW[c.color]}" stroke-width="2.5"/>`;
    });
    s += `<text x="12" y="${height / 2}" font-size="11" fill="#637381" transform="rotate(-90 12 ${height / 2})" text-anchor="middle">semitone</text>`;
    [0, 4, 8, 12].forEach((v, i) => { s += `<text x="${padL - 6}" y="${yOf(i / 3) + 4}" font-size="11" fill="#637381" text-anchor="end">${v}</text>`; });
    return `${s}</svg>`;
  };

  const TONE_LABELS = { 1: 'Flat', 2: 'Rising', 3: 'Low', 4: 'Falling', 5: 'Neutral' };
  const TONE_MARKS = { a: 'āáǎà', e: 'ēéěè', i: 'īíǐì', o: 'ōóǒò', u: 'ūúǔù' };
  const applyTone = (py, tone) => {
    if (!tone || tone === 5) return py;
    const vowelOrder = ['a', 'e', 'o', 'i', 'u'];
    const v = vowelOrder.find((x) => py.includes(x));
    if (!v) return py;
    return py.replace(v, TONE_MARKS[v][tone - 1]);
  };
  const MC_TYPE_LABELS = { true_or_false: 'True / False', multi_choice: 'Multi-Choice', VOCAB_MC_CN_TO_EN: 'Chinese → Translation', VOCAB_MC_IMAGE_TO_CN: 'Image → Chinese', VOCAB_MC_IMAGE_TO_PINYIN: 'Image → Pinyin', VOCAB_MC_EN_TO_CN: 'Translation → Chinese', VOCAB_MC_EN_TO_PINYIN: 'Translation → Pinyin', VOCAB_MC_AUDIO_TO_EN: 'Audio → Translation', VOCAB_MC_AUDIO_TO_CN: 'Audio → Chinese', VOCAB_MC_AUDIO_TO_PINYIN: 'Audio → Pinyin' };
  const MC_TYPE_COLORS = { true_or_false: '#10B981', multi_choice: '#3B82F6' };
  const MC_CATEGORY_LABELS = { comprehension: 'Comprehension', pinyin: 'Pinyin', meaning: 'Meaning', usage: 'Fill in blank' };
  const CRITERIA = {
    PASS: { PATTERN: 'Great pattern usage!', TEACHING_POINT: 'Teaching point nailed!', CONTENT: 'Content clear and complete!', GRAMMAR: 'Grammar on point!' },
    FAIL: { PATTERN: 'Pattern needs work', TEACHING_POINT: 'Missing teaching point', CONTENT: 'Content not accurate', GRAMMAR: 'Grammar needs fixing' },
    PENDING: { PATTERN: 'Pattern not checked yet', TEACHING_POINT: 'Teaching point not checked yet', CONTENT: 'Content not checked yet', GRAMMAR: 'Grammar not checked yet' },
  };
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  return { PRACTICES, OVERRIDABLE, hasReview, GROUPS, scoreOf, lateOf, starsOf, sortedStudents, allStudents, summary, summaryFor, firstSubmitted, studentById, historyFor,
    STATUS, ROW, svgStatus, svgRow, svgStars, svgGradStars, svgTone, svgPitch, TONE_LABELS, applyTone, MC_TYPE_LABELS, MC_TYPE_COLORS, MC_CATEGORY_LABELS, CRITERIA, esc };
}());
