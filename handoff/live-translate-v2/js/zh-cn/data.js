/* ════════════════════════════════════════
   DATA — 共用假数据（Demo 用）
   工程师请将此处替换为 API 回传数据
   ════════════════════════════════════════ */

/* ── 逐字稿数据 ── */
var transcriptData = [
  {
    en: 'The teacher opened the lesson by reviewing last week\'s vocabulary words.',
    zh: '老师通过复习上周的词汇开始了这节课。',
    es: 'La maestra comenzó la lección repasando el vocabulario de la semana pasada.'
  },
  {
    en: 'Please take out your notebooks and write down the key terms on the board.',
    zh: '请拿出笔记本，把黑板上的关键词抄下来。',
    es: 'Por favor saquen sus cuadernos y escriban los términos clave del pizarrón.'
  },
  {
    en: 'Today we will focus on photosynthesis and how plants convert sunlight into energy.',
    zh: '今天我们将重点学习光合作用，以及植物如何将阳光转化为能量。',
    es: 'Hoy nos enfocaremos en la fotosíntesis y cómo las plantas convierten la luz solar en energía.'
  },
  {
    en: 'The assignment is due on Friday — make sure you submit it before three o\'clock.',
    zh: '作业截止日期是周五，请确保在三点前提交。',
    es: 'La tarea vence el viernes — asegúrense de entregarla antes de las tres.'
  },
  {
    en: 'If you have any questions, raise your hand and I will come to help you.',
    zh: '如果有任何问题，请举手，我会过来帮助你。',
    es: 'Si tienen alguna pregunta, levanten la mano y yo iré a ayudarlos.'
  },
  {
    en: 'The experiment showed that plants grow faster when exposed to more sunlight.',
    zh: '实验表明，植物在接受更多阳光照射时生长更快。',
    es: 'El experimento mostró que las plantas crecen más rápido con más luz solar.'
  },
  {
    en: 'Can anyone explain the difference between a hypothesis and a conclusion?',
    zh: '有人能解释假说和结论之间的区别吗？',
    es: '¿Alguien puede explicar la diferencia entre una hipótesis y una conclusión?'
  },
  {
    en: 'Remember to record your observation in the notebook after each experiment.',
    zh: '记得在每次实验后将观察结果记录在笔记本上。',
    es: 'Recuerden registrar sus observaciones en el cuaderno después de cada experimento.'
  },
  {
    en: 'The temperature inside the greenhouse was significantly higher than outside.',
    zh: '温室内的温度明显高于室外。',
    es: 'La temperatura dentro del invernadero era significativamente más alta que afuera.'
  },
  {
    en: 'We need to solve this equation before moving on to the next chapter.',
    zh: '我们需要先解出这个方程序，才能继续下一章。',
    es: 'Necesitamos resolver esta ecuación antes de pasar al siguiente capítulo.'
  },
  {
    en: 'Write a paragraph summarizing what you learned about democracy today.',
    zh: '写一段总结你今天对民主所学到的内容。',
    es: 'Escriban un párrafo resumiendo lo que aprendieron sobre la democracia hoy.'
  },
  {
    en: 'The revolution changed the political structure of the entire civilization.',
    zh: '这场革命改变了整个文明的政治结构。',
    es: 'La revolución cambió la estructura política de toda la civilización.'
  }
];

/* ── 可保存单字 + 翻译对照 ── */
var wordMap = {
  'vocabulary':     { zh: '词汇',       es: 'vocabulario' },
  'notebooks':      { zh: '笔记本',     es: 'cuadernos' },
  'photosynthesis': { zh: '光合作用',   es: 'fotosíntesis' },
  'sunlight':       { zh: '阳光',       es: 'luz solar' },
  'energy':         { zh: '能量',       es: 'energía' },
  'assignment':     { zh: '作业',       es: 'tarea' },
  'submit':         { zh: '提交',       es: 'entregar' },
  'questions':      { zh: '问题',       es: 'preguntas' },
  'plant':          { zh: '植物；种植', es: 'planta; plantar' },
  'record':         { zh: '纪录；录制', es: 'registro; grabar' },
  'hypothesis':     { zh: '假说',       es: 'hipótesis' },
  'experiment':     { zh: '实验',       es: 'experimento' },
  'conclusion':     { zh: '结论',       es: 'conclusión' },
  'observation':    { zh: '观察',       es: 'observación' },
  'temperature':    { zh: '温度',       es: 'temperatura' },
  'equation':       { zh: '方程序',     es: 'ecuación' },
  'paragraph':      { zh: '段落',       es: 'párrafo' },
  'democracy':      { zh: '民主',       es: 'democracia' },
  'revolution':     { zh: '革命',       es: 'revolución' },
  'civilization':   { zh: '文明',       es: 'civilización' }
};

/* ── 单字详细数据（词性、定义、例句） ── */
var wordDetails = {
  'vocabulary': {
    pron: '/vəˈkæb.jə.ler.i/',
    senses: [{
      pos: 'noun',
      def: 'All the words known and used by a particular person or group.',
      defZh: '一个人或群体所认识和使用的所有单字。',
      defEs: 'Todas las palabras conocidas y usadas por una persona o grupo.',
      example: 'The teacher reviewed last week\'s <b>vocabulary</b> words.',
      exZh: '老师复习了上周的词汇。',
      exEs: 'La maestra repasó el vocabulario de la semana pasada.'
    }]
  },
  'assignment': {
    pron: '/əˈsaɪn.mənt/',
    senses: [{
      pos: 'noun',
      def: 'A task or piece of work assigned to someone as part of a course of study.',
      defZh: '作为课程学习的一部分而分配给某人的任务或作业。',
      defEs: 'Una tarea asignada a alguien como parte de un curso de estudio.',
      example: 'The <b>assignment</b> is due on Friday.',
      exZh: '作业截止日期是周五。',
      exEs: 'La tarea vence el viernes.'
    }]
  },
  'submit': {
    pron: '/səbˈmɪt/',
    senses: [{
      pos: 'verb',
      def: 'To give a document or piece of work to someone in authority for them to consider.',
      defZh: '将文档或作品交给有权限的人审阅。',
      defEs: 'Entregar un documento o trabajo a alguien con autoridad.',
      example: 'Make sure you <b>submit</b> it before three o\'clock.',
      exZh: '请确保在三点前提交。',
      exEs: 'Asegúrense de entregarlo antes de las tres.'
    }]
  },
  'questions': {
    pron: '/ˈkwes.tʃənz/',
    senses: [{
      pos: 'noun',
      def: 'Sentences or phrases used to find out information.',
      defZh: '用来寻找信息的句子或短语。',
      defEs: 'Oraciones o frases usadas para obtener información.',
      example: 'If you have any <b>questions</b>, raise your hand.',
      exZh: '如果有任何问题，请举手。',
      exEs: 'Si tienen alguna pregunta, levanten la mano.'
    }]
  },
  'energy': {
    pron: '/ˈen.ɚ.dʒi/',
    senses: [{
      pos: 'noun',
      def: 'The power from something such as electricity or oil that can do work.',
      defZh: '来自电力或石油等物质的力量，可以用来做功。',
      defEs: 'La potencia proveniente de algo como la electricidad o el petróleo.',
      example: 'Plants convert sunlight into <b>energy</b>.',
      exZh: '植物将阳光转化为能量。',
      exEs: 'Las plantas convierten la luz solar en energía.'
    }]
  },
  'photosynthesis': {
    pron: '/ˌfoʊ.toʊˈsɪn.θə.sɪs/',
    senses: [{
      pos: 'noun',
      def: 'The process by which green plants use sunlight to make food from carbon dioxide and water.',
      defZh: '绿色植物利用阳光将二氧化碳和水转化为养分的过程。',
      defEs: 'El proceso por el cual las plantas verdes usan la luz solar para producir alimento.',
      example: 'Today we will focus on <b>photosynthesis</b> and how plants convert sunlight into energy.',
      exZh: '今天我们将重点学习光合作用。',
      exEs: 'Hoy nos enfocaremos en la fotosíntesis.'
    }]
  },
  'sunlight': {
    pron: '/ˈsʌn.laɪt/',
    senses: [{
      pos: 'noun',
      def: 'The light that comes from the sun.',
      defZh: '来自太阳的光线。',
      defEs: 'La luz que proviene del sol.',
      example: 'Plants convert <b>sunlight</b> into energy through photosynthesis.',
      exZh: '植物通过光合作用将阳光转化为能量。',
      exEs: 'Las plantas convierten la luz solar en energía.'
    }]
  },
  'notebooks': {
    pron: '/ˈnoʊt.bʊks/',
    senses: [{
      pos: 'noun',
      def: 'Small books for writing notes in.',
      defZh: '用来写笔记的小本子。',
      defEs: 'Libretas pequeñas para escribir notas.',
      example: 'Please take out your <b>notebooks</b> and write down the key terms.',
      exZh: '请拿出笔记本，把关键词抄下来。',
      exEs: 'Saquen sus cuadernos y escriban los términos clave.'
    }]
  },
  'plant': {
    pron: '/plænt/',
    senses: [
      {
        pos: 'noun',
        def: 'A living organism that grows in the earth and absorbs water through its roots.',
        defZh: '生长在土壤中，通过根部吸收水分的生物体。',
        defEs: 'Un organismo vivo que crece en la tierra y absorbe agua por sus raíces.',
        example: 'There are many <b>plants</b> in the classroom.',
        exZh: '教室里有很多植物。',
        exEs: 'Hay muchas plantas en el salón de clase.'
      },
      {
        pos: 'verb',
        def: 'To put a seed or plant in the ground so that it can grow.',
        defZh: '把种子或植物放入土壤中使其生长。',
        defEs: 'Poner una semilla o planta en la tierra para que crezca.',
        example: 'We will <b>plant</b> flowers in the garden tomorrow.',
        exZh: '明天我们会在花园里种花。',
        exEs: 'Mañana plantaremos flores en el jardín.'
      }
    ]
  },
  'record': {
    pron: '/ˈrek.ɚd/ · /rɪˈkɔːrd/',
    senses: [
      {
        pos: 'noun',
        def: 'A thing constituting a piece of evidence about the past.',
        defZh: '构成过去事件证据的事物。',
        defEs: 'Algo que constituye una evidencia sobre el pasado.',
        example: 'The teacher kept a <b>record</b> of each student\'s progress.',
        exZh: '老师记录了每位学生的进度。',
        exEs: 'La maestra mantuvo un registro del progreso de cada estudiante.'
      },
      {
        pos: 'verb',
        def: 'To set down in writing or some other permanent form for later reference.',
        defZh: '以书写或其他永久形式记录下来，以供日后参考。',
        defEs: 'Registrar por escrito u otra forma permanente para referencia futura.',
        example: 'Please <b>record</b> the experiment results in your notebook.',
        exZh: '请在笔记本中记录实验结果。',
        exEs: 'Registren los resultados del experimento en su cuaderno.'
      }
    ]
  }
};

/* ── 历史纪录（Demo 用） ── */
/* summary.en / summary.zh → 工程师替换为 AI API 回传 */
var historyData = [
  {
    name: '理科课 · 光合作用单元',
    date: '2026-05-28',
    time: '14:30',
    duration: '15:23',
    lang: 'zh',
    words: ['photosynthesis','sunlight','energy','plant','record','vocabulary','notebooks','assignment','hypothesis','experiment','conclusion','observation','temperature','equation'],
    summary: {
      en: 'This lesson introduced the core principles of photosynthesis, explaining how plants convert sunlight, carbon dioxide, and water into energy. The class also reviewed last week\'s vocabulary and assigned a written homework due Friday.',
      zh: '本堂课介绍了光合作用的内核原理，说明植物如何利用阳光将二氧化碳与水转化为能量。课堂中也复习了上周的词汇，并指派了一份周五截止的书面作业。'
    }
  },
  {
    name: '英语听力练习',
    date: '2026-05-28',
    time: '09:45',
    duration: '03:47',
    lang: 'zh',
    words: ['vocabulary','photosynthesis','energy'],
    summary: {
      en: 'A short listening practice session focusing on vocabulary review. Students practiced identifying key science terms including vocabulary, photosynthesis, and energy.',
      zh: '一堂简短的听力练习，重点复习词汇。学生练习辨识关键科学术语，包括词汇、光合作用和能量。'
    }
  },
  {
    name: 'English Writing Class',
    date: '2026-05-24',
    time: '15:00',
    duration: '22:10',
    lang: 'zh',
    words: ['assignment','submit','questions','notebooks','vocabulary','sunlight','energy','photosynthesis'],
    summary: {
      en: 'The writing class covered academic essay structure. Students practiced using science vocabulary in written context, with emphasis on proper use of terms like photosynthesis and energy.',
      zh: '写作课讲解了学术论文结构。学生练习在书面语境中使用科学词汇，重点是正确使用光合作用、能量等术语。'
    }
  },
  {
    name: 'Matemáticas Avanzadas',
    date: '2026-05-24',
    time: '10:20',
    duration: '08:15',
    lang: 'es',
    words: ['energy','sunlight','assignment','submit','questions'],
    summary: {
      en: 'Advanced mathematics class conducted in Spanish. Covered energy-related word problems and assignment submission guidelines.',
      es: 'Clase de matemáticas avanzadas. Se cubrieron problemas de palabras relacionados con energía y pautas para la entrega de tareas.'
    }
  },
  {
    name: 'Science Lab Report',
    date: '2026-05-22',
    time: '13:45',
    duration: '31:52',
    lang: 'zh',
    words: ['photosynthesis','sunlight','energy','vocabulary','notebooks'],
    summary: {
      en: 'Students completed a lab report on photosynthesis experiments, documenting how sunlight intensity affects plant energy production.',
      zh: '学生完成了一份光合作用实验报告，记录了阳光强度如何影响植物的能量产生。'
    }
  },
  {
    name: '数学课翻译',
    date: '2026-05-15',
    time: '11:00',
    duration: '18:42',
    lang: 'zh',
    words: ['energy','questions','submit'],
    summary: {
      en: 'Math class with live translation support. Students worked on energy-related equations and submitted their answers.',
      zh: '数学课搭配即时翻译。学生做了能量相关的方程序，并提交了答案。'
    }
  },
  {
    name: 'Biology Review',
    date: '2026-05-08',
    time: '14:20',
    duration: '12:05',
    lang: 'zh',
    words: ['photosynthesis','plant','sunlight','energy'],
    summary: {
      en: 'Biology review session covering plant biology fundamentals, including photosynthesis process and energy conversion in plants.',
      zh: '生物复习课程，涵盖植物生物学基础知识，包括光合作用过程和植物的能量转换。'
    }
  },
  {
    name: 'History Class',
    date: '2026-05-06',
    time: '10:00',
    duration: '25:30',
    lang: 'zh',
    words: ['democracy','revolution','civilization','paragraph'],
    summary: {
      en: 'History class exploring the relationship between revolution and democracy in the development of civilization. Students wrote summary paragraphs.',
      zh: '历史课探讨了革命与民主在文明发展中的关系。学生撰写了摘要段落。'
    }
  },
  {
    name: 'Chemistry Lab',
    date: '2026-05-03',
    time: '13:30',
    duration: '20:15',
    lang: 'zh',
    words: ['hypothesis','experiment','conclusion','observation','temperature','equation'],
    summary: {
      en: 'Chemistry lab session where students formed hypotheses, conducted temperature experiments, recorded observations, and drew conclusions using equations.',
      zh: '化学实验课，学生提出假说、进行温度实验、记录观察结果，并使用方程序得出结论。'
    }
  }
];
