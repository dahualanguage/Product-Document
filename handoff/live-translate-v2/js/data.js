/* ════════════════════════════════════════
   DATA — 共用假資料（Demo 用）
   工程師請將此處替換為 API 回傳資料
   ════════════════════════════════════════ */

/* ── 逐字稿資料 ── */
var transcriptData = [
  {
    en: 'The teacher opened the lesson by reviewing last week\'s vocabulary words.',
    zh: '老師通過複習上週的詞彙開始了這節課。',
    es: 'La maestra comenzó la lección repasando el vocabulario de la semana pasada.'
  },
  {
    en: 'Please take out your notebooks and write down the key terms on the board.',
    zh: '請拿出筆記本，把黑板上的關鍵詞抄下來。',
    es: 'Por favor saquen sus cuadernos y escriban los términos clave del pizarrón.'
  },
  {
    en: 'Today we will focus on photosynthesis and how plants convert sunlight into energy.',
    zh: '今天我們將重點學習光合作用，以及植物如何將陽光轉化為能量。',
    es: 'Hoy nos enfocaremos en la fotosíntesis y cómo las plantas convierten la luz solar en energía.'
  },
  {
    en: 'The assignment is due on Friday — make sure you submit it before three o\'clock.',
    zh: '作業截止日期是週五，請確保在三點前提交。',
    es: 'La tarea vence el viernes — asegúrense de entregarla antes de las tres.'
  },
  {
    en: 'If you have any questions, raise your hand and I will come to help you.',
    zh: '如果有任何問題，請舉手，我會過來幫助你。',
    es: 'Si tienen alguna pregunta, levanten la mano y yo iré a ayudarlos.'
  },
  {
    en: 'The experiment showed that plants grow faster when exposed to more sunlight.',
    zh: '實驗表明，植物在接受更多陽光照射時生長更快。',
    es: 'El experimento mostró que las plantas crecen más rápido con más luz solar.'
  },
  {
    en: 'Can anyone explain the difference between a hypothesis and a conclusion?',
    zh: '有人能解釋假說和結論之間的區別嗎？',
    es: '¿Alguien puede explicar la diferencia entre una hipótesis y una conclusión?'
  },
  {
    en: 'Remember to record your observation in the notebook after each experiment.',
    zh: '記得在每次實驗後將觀察結果記錄在筆記本上。',
    es: 'Recuerden registrar sus observaciones en el cuaderno después de cada experimento.'
  },
  {
    en: 'The temperature inside the greenhouse was significantly higher than outside.',
    zh: '溫室內的溫度明顯高於室外。',
    es: 'La temperatura dentro del invernadero era significativamente más alta que afuera.'
  },
  {
    en: 'We need to solve this equation before moving on to the next chapter.',
    zh: '我們需要先解出這個方程式，才能繼續下一章。',
    es: 'Necesitamos resolver esta ecuación antes de pasar al siguiente capítulo.'
  },
  {
    en: 'Write a paragraph summarizing what you learned about democracy today.',
    zh: '寫一段總結你今天對民主所學到的內容。',
    es: 'Escriban un párrafo resumiendo lo que aprendieron sobre la democracia hoy.'
  },
  {
    en: 'The revolution changed the political structure of the entire civilization.',
    zh: '這場革命改變了整個文明的政治結構。',
    es: 'La revolución cambió la estructura política de toda la civilización.'
  }
];

/* ── 可保存單字 + 翻譯對照 ── */
var wordMap = {
  'vocabulary':     { zh: '詞彙',       es: 'vocabulario' },
  'notebooks':      { zh: '筆記本',     es: 'cuadernos' },
  'photosynthesis': { zh: '光合作用',   es: 'fotosíntesis' },
  'sunlight':       { zh: '陽光',       es: 'luz solar' },
  'energy':         { zh: '能量',       es: 'energía' },
  'assignment':     { zh: '作業',       es: 'tarea' },
  'submit':         { zh: '提交',       es: 'entregar' },
  'questions':      { zh: '問題',       es: 'preguntas' },
  'plant':          { zh: '植物；種植', es: 'planta; plantar' },
  'record':         { zh: '紀錄；錄製', es: 'registro; grabar' },
  'hypothesis':     { zh: '假說',       es: 'hipótesis' },
  'experiment':     { zh: '實驗',       es: 'experimento' },
  'conclusion':     { zh: '結論',       es: 'conclusión' },
  'observation':    { zh: '觀察',       es: 'observación' },
  'temperature':    { zh: '溫度',       es: 'temperatura' },
  'equation':       { zh: '方程式',     es: 'ecuación' },
  'paragraph':      { zh: '段落',       es: 'párrafo' },
  'democracy':      { zh: '民主',       es: 'democracia' },
  'revolution':     { zh: '革命',       es: 'revolución' },
  'civilization':   { zh: '文明',       es: 'civilización' }
};

/* ── 單字詳細資料（詞性、定義、例句） ── */
var wordDetails = {
  'vocabulary': {
    pron: '/vəˈkæb.jə.ler.i/',
    senses: [{
      pos: 'noun',
      def: 'All the words known and used by a particular person or group.',
      defZh: '一個人或群體所認識和使用的所有單字。',
      defEs: 'Todas las palabras conocidas y usadas por una persona o grupo.',
      example: 'The teacher reviewed last week\'s <b>vocabulary</b> words.',
      exZh: '老師複習了上週的詞彙。',
      exEs: 'La maestra repasó el vocabulario de la semana pasada.'
    }]
  },
  'assignment': {
    pron: '/əˈsaɪn.mənt/',
    senses: [{
      pos: 'noun',
      def: 'A task or piece of work assigned to someone as part of a course of study.',
      defZh: '作為課程學習的一部分而分配給某人的任務或作業。',
      defEs: 'Una tarea asignada a alguien como parte de un curso de estudio.',
      example: 'The <b>assignment</b> is due on Friday.',
      exZh: '作業截止日期是週五。',
      exEs: 'La tarea vence el viernes.'
    }]
  },
  'submit': {
    pron: '/səbˈmɪt/',
    senses: [{
      pos: 'verb',
      def: 'To give a document or piece of work to someone in authority for them to consider.',
      defZh: '將文件或作品交給有權限的人審閱。',
      defEs: 'Entregar un documento o trabajo a alguien con autoridad.',
      example: 'Make sure you <b>submit</b> it before three o\'clock.',
      exZh: '請確保在三點前提交。',
      exEs: 'Asegúrense de entregarlo antes de las tres.'
    }]
  },
  'questions': {
    pron: '/ˈkwes.tʃənz/',
    senses: [{
      pos: 'noun',
      def: 'Sentences or phrases used to find out information.',
      defZh: '用來尋找資訊的句子或短語。',
      defEs: 'Oraciones o frases usadas para obtener información.',
      example: 'If you have any <b>questions</b>, raise your hand.',
      exZh: '如果有任何問題，請舉手。',
      exEs: 'Si tienen alguna pregunta, levanten la mano.'
    }]
  },
  'energy': {
    pron: '/ˈen.ɚ.dʒi/',
    senses: [{
      pos: 'noun',
      def: 'The power from something such as electricity or oil that can do work.',
      defZh: '來自電力或石油等物質的力量，可以用來做功。',
      defEs: 'La potencia proveniente de algo como la electricidad o el petróleo.',
      example: 'Plants convert sunlight into <b>energy</b>.',
      exZh: '植物將陽光轉化為能量。',
      exEs: 'Las plantas convierten la luz solar en energía.'
    }]
  },
  'photosynthesis': {
    pron: '/ˌfoʊ.toʊˈsɪn.θə.sɪs/',
    senses: [{
      pos: 'noun',
      def: 'The process by which green plants use sunlight to make food from carbon dioxide and water.',
      defZh: '綠色植物利用陽光將二氧化碳和水轉化為養分的過程。',
      defEs: 'El proceso por el cual las plantas verdes usan la luz solar para producir alimento.',
      example: 'Today we will focus on <b>photosynthesis</b> and how plants convert sunlight into energy.',
      exZh: '今天我們將重點學習光合作用。',
      exEs: 'Hoy nos enfocaremos en la fotosíntesis.'
    }]
  },
  'sunlight': {
    pron: '/ˈsʌn.laɪt/',
    senses: [{
      pos: 'noun',
      def: 'The light that comes from the sun.',
      defZh: '來自太陽的光線。',
      defEs: 'La luz que proviene del sol.',
      example: 'Plants convert <b>sunlight</b> into energy through photosynthesis.',
      exZh: '植物通過光合作用將陽光轉化為能量。',
      exEs: 'Las plantas convierten la luz solar en energía.'
    }]
  },
  'notebooks': {
    pron: '/ˈnoʊt.bʊks/',
    senses: [{
      pos: 'noun',
      def: 'Small books for writing notes in.',
      defZh: '用來寫筆記的小本子。',
      defEs: 'Libretas pequeñas para escribir notas.',
      example: 'Please take out your <b>notebooks</b> and write down the key terms.',
      exZh: '請拿出筆記本，把關鍵詞抄下來。',
      exEs: 'Saquen sus cuadernos y escriban los términos clave.'
    }]
  },
  'plant': {
    pron: '/plænt/',
    senses: [
      {
        pos: 'noun',
        def: 'A living organism that grows in the earth and absorbs water through its roots.',
        defZh: '生長在土壤中，通過根部吸收水分的生物體。',
        defEs: 'Un organismo vivo que crece en la tierra y absorbe agua por sus raíces.',
        example: 'There are many <b>plants</b> in the classroom.',
        exZh: '教室裡有很多植物。',
        exEs: 'Hay muchas plantas en el salón de clase.'
      },
      {
        pos: 'verb',
        def: 'To put a seed or plant in the ground so that it can grow.',
        defZh: '把種子或植物放入土壤中使其生長。',
        defEs: 'Poner una semilla o planta en la tierra para que crezca.',
        example: 'We will <b>plant</b> flowers in the garden tomorrow.',
        exZh: '明天我們會在花園裡種花。',
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
        defZh: '構成過去事件證據的事物。',
        defEs: 'Algo que constituye una evidencia sobre el pasado.',
        example: 'The teacher kept a <b>record</b> of each student\'s progress.',
        exZh: '老師記錄了每位學生的進度。',
        exEs: 'La maestra mantuvo un registro del progreso de cada estudiante.'
      },
      {
        pos: 'verb',
        def: 'To set down in writing or some other permanent form for later reference.',
        defZh: '以書寫或其他永久形式記錄下來，以供日後參考。',
        defEs: 'Registrar por escrito u otra forma permanente para referencia futura.',
        example: 'Please <b>record</b> the experiment results in your notebook.',
        exZh: '請在筆記本中記錄實驗結果。',
        exEs: 'Registren los resultados del experimento en su cuaderno.'
      }
    ]
  }
};

/* ── 歷史紀錄（Demo 用） ── */
/* summary.en / summary.zh → 工程師替換為 AI API 回傳 */
var historyData = [
  {
    name: '理科課 · 光合作用單元',
    date: '2026-05-28',
    time: '14:30',
    duration: '15:23',
    lang: 'zh',
    words: ['photosynthesis','sunlight','energy','plant','record','vocabulary','notebooks','assignment','hypothesis','experiment','conclusion','observation','temperature','equation'],
    summary: {
      en: 'This lesson introduced the core principles of photosynthesis, explaining how plants convert sunlight, carbon dioxide, and water into energy. The class also reviewed last week\'s vocabulary and assigned a written homework due Friday.',
      zh: '本堂課介紹了光合作用的核心原理，說明植物如何利用陽光將二氧化碳與水轉化為能量。課堂中也複習了上週的詞彙，並指派了一份週五截止的書面作業。'
    }
  },
  {
    name: '英語聽力練習',
    date: '2026-05-28',
    time: '09:45',
    duration: '03:47',
    lang: 'zh',
    words: ['vocabulary','photosynthesis','energy'],
    summary: {
      en: 'A short listening practice session focusing on vocabulary review. Students practiced identifying key science terms including vocabulary, photosynthesis, and energy.',
      zh: '一堂簡短的聽力練習，重點複習詞彙。學生練習辨識關鍵科學術語，包括詞彙、光合作用和能量。'
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
      zh: '寫作課講解了學術論文結構。學生練習在書面語境中使用科學詞彙，重點是正確使用光合作用、能量等術語。'
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
      zh: '學生完成了一份光合作用實驗報告，記錄了陽光強度如何影響植物的能量產生。'
    }
  },
  {
    name: '數學課翻譯',
    date: '2026-05-15',
    time: '11:00',
    duration: '18:42',
    lang: 'zh',
    words: ['energy','questions','submit'],
    summary: {
      en: 'Math class with live translation support. Students worked on energy-related equations and submitted their answers.',
      zh: '數學課搭配即時翻譯。學生做了能量相關的方程式，並提交了答案。'
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
      zh: '生物複習課程，涵蓋植物生物學基礎知識，包括光合作用過程和植物的能量轉換。'
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
      zh: '歷史課探討了革命與民主在文明發展中的關係。學生撰寫了摘要段落。'
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
      zh: '化學實驗課，學生提出假說、進行溫度實驗、記錄觀察結果，並使用方程式得出結論。'
    }
  }
];
