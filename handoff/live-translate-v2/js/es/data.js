/* ════════════════════════════════════════
   DATA — 共用假資料（Demo 用）
   工程師請將此處替換為 API 回傳資料
   ════════════════════════════════════════ */

/* ── Transcripción資料 ── */
var transcriptData = [
  {
    en: 'The teacher opened the lesson by reviewing last week\'s vocabulary words.',
    zh: 'El profesor empezó la clase repasando el vocabulario de la semana pasada.',
    es: 'La maestra comenzó la lección repasando el vocabulario de la semana pasada.'
  },
  {
    en: 'Please take out your notebooks and write down the key terms on the board.',
    zh: 'Saca tu cuaderno y copia los términos clave de la pizarra.',
    es: 'Por favor saquen sus cuadernos y escriban los términos clave del pizarrón.'
  },
  {
    en: 'Today we will focus on photosynthesis and how plants convert sunlight into energy.',
    zh: 'Hoy nos centraremos en la fotosíntesis y cómo las plantas convierten la luz solar en energía.',
    es: 'Hoy nos enfocaremos en la fotosíntesis y cómo las plantas convierten la luz solar en energía.'
  },
  {
    en: 'The assignment is due on Friday — make sure you submit it before three o\'clock.',
    zh: 'La tarea es para el viernes — entrégala antes de las tres.',
    es: 'La tarea vence el viernes — asegúrense de entregarla antes de las tres.'
  },
  {
    en: 'If you have any questions, raise your hand and I will come to help you.',
    zh: 'Si tienes preguntas, levanta la mano y te ayudaré.',
    es: 'Si tienen alguna pregunta, levanten la mano y yo iré a ayudarlos.'
  },
  {
    en: 'The experiment showed that plants grow faster when exposed to more sunlight.',
    zh: 'El experimento muestra que las plantas crecen más con más luz solar.',
    es: 'El experimento mostró que las plantas crecen más rápido con más luz solar.'
  },
  {
    en: 'Can anyone explain the difference between a hypothesis and a conclusion?',
    zh: '¿Alguien puede explicar la diferencia entre hipótesis y conclusión?',
    es: '¿Alguien puede explicar la diferencia entre una hipótesis y una conclusión?'
  },
  {
    en: 'Remember to record your observation in the notebook after each experiment.',
    zh: 'Recuerda anotar las observaciones después de cada experimento.',
    es: 'Recuerden registrar sus observaciones en el cuaderno después de cada experimento.'
  },
  {
    en: 'The temperature inside the greenhouse was significantly higher than outside.',
    zh: 'La temperatura del invernadero es mayor que la del exterior.',
    es: 'La temperatura dentro del invernadero era significativamente más alta que afuera.'
  },
  {
    en: 'We need to solve this equation before moving on to the next chapter.',
    zh: 'Hay que resolver esta ecuación antes de seguir al siguiente capítulo.',
    es: 'Necesitamos resolver esta ecuación antes de pasar al siguiente capítulo.'
  },
  {
    en: 'Write a paragraph summarizing what you learned about democracy today.',
    zh: 'Escribe un párrafo resumiendo lo aprendido hoy sobre la democracia.',
    es: 'Escriban un párrafo resumiendo lo que aprendieron sobre la democracia hoy.'
  },
  {
    en: 'The revolution changed the political structure of the entire civilization.',
    zh: 'La revolución cambió la estructura política de la civilización.',
    es: 'La revolución cambió la estructura política de toda la civilización.'
  }
];

/* ── 可保存單字 + Traducir對照 ── */
var wordMap = {
  'vocabulary':     { zh: 'vocabulario',       es: 'vocabulario' },
  'notebooks':      { zh: 'cuaderno',     es: 'cuadernos' },
  'photosynthesis': { zh: 'fotosíntesis',   es: 'fotosíntesis' },
  'sunlight':       { zh: 'luz solar',       es: 'luz solar' },
  'energy':         { zh: 'energía',       es: 'energía' },
  'assignment':     { zh: 'tarea',       es: 'tarea' },
  'submit':         { zh: 'entregar',       es: 'entregar' },
  'questions':      { zh: 'pregunta',       es: 'preguntas' },
  'plant':          { zh: 'planta', es: 'planta; plantar' },
  'record':         { zh: 'registrar', es: 'registro; grabar' },
  'hypothesis':     { zh: 'hipótesis',       es: 'hipótesis' },
  'experiment':     { zh: 'experimento',       es: 'experimento' },
  'conclusion':     { zh: 'conclusión',       es: 'conclusión' },
  'observation':    { zh: 'observar',       es: 'observación' },
  'temperature':    { zh: 'temperatura',       es: 'temperatura' },
  'equation':       { zh: 'ecuación',     es: 'ecuación' },
  'paragraph':      { zh: 'párrafo',       es: 'párrafo' },
  'democracy':      { zh: 'democracia',       es: 'democracia' },
  'revolution':     { zh: 'revolución',       es: 'revolución' },
  'civilization':   { zh: 'civilización',       es: 'civilización' }
};

/* ── 單字詳細資料（詞性、定義、例句） ── */
var wordDetails = {
  'vocabulary': {
    pron: '/vəˈkæb.jə.ler.i/',
    senses: [{
      pos: 'noun',
      def: 'All the words known and used by a particular person or group.',
      defZh: 'Conjunto de palabras que una persona o grupo conoce y usa.',
      defEs: 'Todas las palabras conocidas y usadas por una persona o grupo.',
      example: 'The teacher reviewed last week\'s <b>vocabulary</b> words.',
      exZh: 'El profesor repasó el vocabulario.',
      exEs: 'La maestra repasó el vocabulario de la semana pasada.'
    }]
  },
  'assignment': {
    pron: '/əˈsaɪn.mənt/',
    senses: [{
      pos: 'noun',
      def: 'A task or piece of work assigned to someone as part of a course of study.',
      defZh: 'Tarea asignada como parte del aprendizaje en clase.',
      defEs: 'Una tarea asignada a alguien como parte de un curso de estudio.',
      example: 'The <b>assignment</b> is due on Friday.',
      exZh: 'La tarea es para el viernes.',
      exEs: 'La tarea vence el viernes.'
    }]
  },
  'submit': {
    pron: '/səbˈmɪt/',
    senses: [{
      pos: 'verb',
      def: 'To give a document or piece of work to someone in authority for them to consider.',
      defZh: 'Entregar un documento o trabajo a alguien autorizado para revisar.',
      defEs: 'Entregar un documento o trabajo a alguien con autoridad.',
      example: 'Make sure you <b>submit</b> it before three o\'clock.',
      exZh: 'Entrega antes de las tres.',
      exEs: 'Asegúrense de entregarlo antes de las tres.'
    }]
  },
  'questions': {
    pron: '/ˈkwes.tʃənz/',
    senses: [{
      pos: 'noun',
      def: 'Sentences or phrases used to find out information.',
      defZh: 'Frase o palabra usada para buscar información.',
      defEs: 'Oraciones o frases usadas para obtener información.',
      example: 'If you have any <b>questions</b>, raise your hand.',
      exZh: 'Si tienes preguntas, levanta la mano.',
      exEs: 'Si tienen alguna pregunta, levanten la mano.'
    }]
  },
  'energy': {
    pron: '/ˈen.ɚ.dʒi/',
    senses: [{
      pos: 'noun',
      def: 'The power from something such as electricity or oil that can do work.',
      defZh: 'Energía proveniente de fuentes como la electricidad o el petróleo.',
      defEs: 'La potencia proveniente de algo como la electricidad o el petróleo.',
      example: 'Plants convert sunlight into <b>energy</b>.',
      exZh: 'Las plantas convierten la luz solar en energía.',
      exEs: 'Las plantas convierten la luz solar en energía.'
    }]
  },
  'photosynthesis': {
    pron: '/ˌfoʊ.toʊˈsɪn.θə.sɪs/',
    senses: [{
      pos: 'noun',
      def: 'The process by which green plants use sunlight to make food from carbon dioxide and water.',
      defZh: 'Proceso por el cual las plantas verdes convierten luz, CO₂ y agua en nutrientes.',
      defEs: 'El proceso por el cual las plantas verdes usan la luz solar para producir alimento.',
      example: 'Today we will focus on <b>photosynthesis</b> and how plants convert sunlight into energy.',
      exZh: 'Hoy nos centraremos en la fotosíntesis.',
      exEs: 'Hoy nos enfocaremos en la fotosíntesis.'
    }]
  },
  'sunlight': {
    pron: '/ˈsʌn.laɪt/',
    senses: [{
      pos: 'noun',
      def: 'The light that comes from the sun.',
      defZh: 'Luz proveniente del sol.',
      defEs: 'La luz que proviene del sol.',
      example: 'Plants convert <b>sunlight</b> into energy through photosynthesis.',
      exZh: 'Las plantas convierten la luz solar en energía mediante la fotosíntesis.',
      exEs: 'Las plantas convierten la luz solar en energía.'
    }]
  },
  'notebooks': {
    pron: '/ˈnoʊt.bʊks/',
    senses: [{
      pos: 'noun',
      def: 'Small books for writing notes in.',
      defZh: 'Cuaderno pequeño para tomar notas.',
      defEs: 'Libretas pequeñas para escribir notas.',
      example: 'Please take out your <b>notebooks</b> and write down the key terms.',
      exZh: 'Saca el cuaderno y copia los términos clave.',
      exEs: 'Saquen sus cuadernos y escriban los términos clave.'
    }]
  },
  'plant': {
    pron: '/plænt/',
    senses: [
      {
        pos: 'noun',
        def: 'A living organism that grows in the earth and absorbs water through its roots.',
        defZh: 'Ser vivo que crece en el suelo y absorbe agua por sus raíces.',
        defEs: 'Un organismo vivo que crece en la tierra y absorbe agua por sus raíces.',
        example: 'There are many <b>plants</b> in the classroom.',
        exZh: 'Hay muchas plantas en el aula.',
        exEs: 'Hay muchas plantas en el salón de clase.'
      },
      {
        pos: 'verb',
        def: 'To put a seed or plant in the ground so that it can grow.',
        defZh: 'Poner semillas o plantas en el suelo para que crezcan.',
        defEs: 'Poner una semilla o planta en la tierra para que crezca.',
        example: 'We will <b>plant</b> flowers in the garden tomorrow.',
        exZh: 'Mañana plantaremos flores en el jardín.',
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
        defZh: 'Algo que constituye prueba de eventos pasados.',
        defEs: 'Algo que constituye una evidencia sobre el pasado.',
        example: 'The teacher kept a <b>record</b> of each student\'s progress.',
        exZh: 'El profesor registró el progreso de cada estudiante.',
        exEs: 'La maestra mantuvo un registro del progreso de cada estudiante.'
      },
      {
        pos: 'verb',
        def: 'To set down in writing or some other permanent form for later reference.',
        defZh: 'Registrado por escrito u otra forma permanente para referencia futura.',
        defEs: 'Registrar por escrito u otra forma permanente para referencia futura.',
        example: 'Please <b>record</b> the experiment results in your notebook.',
        exZh: 'Anota los resultados en el cuaderno.',
        exEs: 'Registren los resultados del experimento en su cuaderno.'
      }
    ]
  }
};

/* ── Historial（Demo 用） ── */
/* summary.en / summary.zh → 工程師替換為 AI API 回傳 */
var historyData = [
  {
    name: 'Ciencias · Fotosíntesis',
    date: '2026-05-28',
    time: '14:30',
    duration: '15:23',
    lang: 'zh',
    words: ['photosynthesis','sunlight','energy','plant','record','vocabulary','notebooks','assignment','hypothesis','experiment','conclusion','observation','temperature','equation'],
    summary: {
      en: 'This lesson introduced the core principles of photosynthesis, explaining how plants convert sunlight, carbon dioxide, and water into energy. The class also reviewed last week\'s vocabulary and assigned a written homework due Friday.',
      zh: 'Esta clase introduce los principios de la fotosíntesis y cómo las plantas convierten la luz solar en energía. También se repasó el vocabulario y se asignó tarea para el viernes.'
    }
  },
  {
    name: 'Práctica de inglés',
    date: '2026-05-28',
    time: '09:45',
    duration: '03:47',
    lang: 'zh',
    words: ['vocabulary','photosynthesis','energy'],
    summary: {
      en: 'A short listening practice session focusing on vocabulary review. Students practiced identifying key science terms including vocabulary, photosynthesis, and energy.',
      zh: 'Práctica corta de escucha para repasar términos científicos como vocabulario, fotosíntesis y energía.'
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
      zh: 'Clase de escritura sobre estructura de ensayos académicos y uso de vocabulario científico.'
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
      zh: 'Informe del experimento de fotosíntesis: efecto de la luz solar en la energía vegetal.'
    }
  },
  {
    name: 'Clase de matemáticas',
    date: '2026-05-15',
    time: '11:00',
    duration: '18:42',
    lang: 'zh',
    words: ['energy','questions','submit'],
    summary: {
      en: 'Math class with live translation support. Students worked on energy-related equations and submitted their answers.',
      zh: 'Clase de matemáticas con traducción en vivo. Ejercicios y entrega.'
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
      zh: 'Repaso de biología sobre fotosíntesis y conversión de energía en plantas.'
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
      zh: 'Clase de historia sobre revolución y democracia. Los estudiantes escribieron resúmenes.'
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
      zh: 'Clase de química: hipótesis, experimentos de temperatura, observaciones y conclusiones con ecuaciones.'
    }
  }
];
