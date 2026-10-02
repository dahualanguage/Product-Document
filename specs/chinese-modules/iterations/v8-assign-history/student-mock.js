/* v8 · 學生端 /student/practice 的假資料——基準檔 student-practice.html 與提案 student-proposal.html 共用。
   跟老師端 proposal.html 同一個世界：Chinese 3B 的「我的一天」在 Sep 17 23:59 到期、Reduced credit 三段。
   欄位照 normalize-assignment.js：name / type / subType / expiredDate / progress / isComplete / isSubmitted / isOptional。
   多的 late（提案用）：null ＝ Full credit；{ tiers:[{days,off}] } ＝ Reduced credit（跟老師端 lateTiers 同一份）。 */
const NOW = new Date('2026-09-19T10:00');   // 週五早上十點；學校時區＝本地

const ASSIGNMENTS = [
  /* ---- Mandatory · Today（到期日 ≤ 今天，含已過期）---- */
  { id:'a1', name:'我的一天 · Lesson 3', type:'MIRRORING', typeId:'content-mirroring', klass:'Chinese 3B',
    expiredDate:'2026-09-17T23:59', progress:40, isComplete:false, isSubmitted:false, isOptional:false,
    late:{ tiers:[{ days:1, off:10 }, { days:3, off:20 }, { days:7, off:100 }] } },
  { id:'a2', name:'早饭 · 生词', type:'VOCABULARY', typeId:'vocabulary-quiz', klass:'Chinese 3B',
    expiredDate:'2026-09-19T23:59', progress:0, isComplete:false, isSubmitted:false, isOptional:false,
    late:{ tiers:[{ days:1, off:10 }] } },
  /* ---- Mandatory · Later ---- */
  { id:'a3', name:'上课 · 句型', type:'SENTENCE_SCRAMBLE', typeId:'sentence-scramble', klass:'Chinese 3B',
    expiredDate:'2026-09-20T23:59', progress:0, isComplete:false, isSubmitted:false, isOptional:false, late:null },
  { id:'a4', name:'图书馆 · 阅读', type:'MULTIPLE_CHOICE', typeId:'comprehension-quiz', klass:'Chinese 3B',
    expiredDate:'2026-09-25T23:59', progress:100, isComplete:true, isSubmitted:false, isOptional:false,
    late:{ tiers:[{ days:1, off:10 }, { days:3, off:20 }, { days:7, off:100 }] } },
  { id:'a5', name:'运动 · 对话', type:'FOLLOW_PATTERN', typeId:'sentence-response', klass:'Chinese 3B',
    expiredDate:'2026-10-02T23:59', progress:0, isComplete:false, isSubmitted:false, isOptional:false, late:null },
  /* ---- Optional ---- */
  { id:'o1', name:'我的一天 · 跟读', type:'VOCABULARY', typeId:'vocabulary-mirroring', klass:'Chinese 4A',
    expiredDate:'2026-09-25T23:59', progress:0, isComplete:false, isSubmitted:false, isOptional:true, late:null },
  { id:'o2', name:'唐诗 · 问答', type:'QA', typeId:'open-ended-questions', klass:'Chinese 4A',
    expiredDate:'2026-10-10T23:59', progress:60, isComplete:false, isSubmitted:false, isOptional:true, late:null },
];

/* 八種 practice 的名稱／欄色（practice-type-labels.js PRACTICE_TYPE_ENTRIES ＋ PRACTICE_TYPE_COLUMNS）；
   學生端 TypeIconTile / TypeTag 用的是欄的 wash ＋ label（STUDENT_GAME_TYPE_COLORS），不是 tag 那組。 */
const TYPE_ENTRIES = [
  { id:'content-mirroring',    label:'Content Mirroring',    col:'CONTENT',       icon:'mic' },
  { id:'vocabulary-mirroring', label:'Vocabulary Mirroring', col:'VOCABULARY',    icon:'bookmark' },
  { id:'vocabulary-quiz',      label:'Vocabulary Quiz',      col:'VOCABULARY',    icon:'bookmark' },
  { id:'sentence-scramble',    label:'Sentence Scramble',    col:'SENTENCE',      icon:'shuffle' },
  { id:'sentence-response',    label:'Sentence Response',    col:'SENTENCE',      icon:'route' },
  { id:'sentence-building',    label:'Sentence Building',    col:'SENTENCE',      icon:'route' },
  { id:'comprehension-quiz',   label:'Comprehension Quiz',   col:'COMPREHENSION', icon:'checklist' },
  { id:'open-ended-questions', label:'Open-ended Questions', col:'COMPREHENSION', icon:'chat_bubble' },
];
const COLUMN_COLORS = {
  CONTENT:       { bg:'#EFFBF4', text:'#00754A' },
  VOCABULARY:    { bg:'#FFF8E7', text:'#8F6209' },
  SENTENCE:      { bg:'#FEF2F8', text:'#BE185D' },
  COMPREHENSION: { bg:'#F7F3FE', text:'#6D28D9' },
};
