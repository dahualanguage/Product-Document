/* ===========================================================================
   v22 共用假資料 —— 基準檔與提案共用同一份，兩邊才比得起來。

   專案沿用 v3 的第一個專案（环境保护与可持续发展 · zh-CN · HSK 4），六句。
   words 是 updatedArticleArray[i].splitContent ＋ 每個詞的拼音（產品的
   sentences[].pinyin），拼音照產品的習慣放在字的「上面」。
   dur 是每句參考音檔在 Normal（0.8）的秒數，照每個字 0.4 秒估的——
   **產品沒有存字級時間軸**（ai_word_boundaries 只在評分結果裡回來），
   所以提案的提詞機是「一句一段、句內線性」的近似，見 ITERATION.md E5。

   評分結果（RESULT）照 V1 引擎的形狀：overall 0–5、每個詞 correct / warning /
   incorrect（graded-sentence.js 的三色）。整篇一筆是 v22 要問工程的 E1，
   這裡先假設後端回「整篇一個 overall ＋ 逐詞狀態」。
   =========================================================================== */
window.V22 = (function () {
  const PROJECT = { name: '环境保护与可持续发展', lang: 'zh-CN', level: 'HSK 4' };

  // [詞, 拼音]；標點拼音留空
  const SENTENCES = [
    { tr: 'In recent years, global warming has become increasingly serious.', dur: 5.5,
      words: [['近年来','jìn nián lái'],['，',''],['全球','quán qiú'],['暖化','nuǎn huà'],['的','de'],['问题','wèn tí'],['越来越','yuè lái yuè'],['严重','yán zhòng'],['。','']] },
    { tr: 'Many countries have begun to value environmental protection and formulate related policies.', dur: 7.5,
      words: [['许多','xǔ duō'],['国家','guó jiā'],['开始','kāi shǐ'],['重视','zhòng shì'],['环境','huán jìng'],['保护','bǎo hù'],['，',''],['并且','bìng qiě'],['制定','zhì dìng'],['相关','xiāng guān'],['的','de'],['政策','zhèng cè'],['。','']] },
    { tr: 'Every one of us can start from daily life, such as turning off lights, bringing our own bags, and using fewer disposable utensils.', dur: 12,
      words: [['我们','wǒ men'],['每个人','měi ge rén'],['都','dōu'],['可以','kě yǐ'],['从','cóng'],['日常','rì cháng'],['生活','shēng huó'],['做起','zuò qǐ'],['，',''],['例如','lì rú'],['随手','suí shǒu'],['关灯','guān dēng'],['、',''],['自备','zì bèi'],['购物袋','gòu wù dài'],['、',''],['减少','jiǎn shǎo'],['使用','shǐ yòng'],['一次性','yí cì xìng'],['餐具','cān jù'],['。','']] },
    { tr: 'Although one person’s power seems small, if everyone is willing to change, it can make a big difference.', dur: 11.5,
      words: [['虽然','suī rán'],['一个人','yí ge rén'],['的','de'],['力量','lì liàng'],['看起来','kàn qǐ lái'],['很','hěn'],['小','xiǎo'],['，',''],['但是','dàn shì'],['如果','rú guǒ'],['每个人','měi ge rén'],['都','dōu'],['愿意','yuàn yì'],['改变','gǎi biàn'],['，',''],['就','jiù'],['能','néng'],['产生','chǎn shēng'],['很大','hěn dà'],['的','de'],['影响','yǐng xiǎng'],['。','']] },
    { tr: 'Protecting the environment is not only the government’s responsibility, but each of ours.', dur: 7.5,
      words: [['保护','bǎo hù'],['环境','huán jìng'],['不只是','bù zhǐ shì'],['政府','zhèng fǔ'],['的','de'],['责任','zé rèn'],['，',''],['也是','yě shì'],['我们','wǒ men'],['每一个人','měi yí ge rén'],['的','de'],['责任','zé rèn'],['。','']] },
    { tr: 'Let us work together to leave a cleaner, better planet for the next generation.', dur: 8,
      words: [['让','ràng'],['我们','wǒ men'],['一起','yì qǐ'],['努力','nǔ lì'],['，',''],['为','wèi'],['下一代','xià yí dài'],['留下','liú xià'],['一个','yí ge'],['更','gèng'],['干净','gān jìng'],['、',''],['更','gèng'],['美好','měi hǎo'],['的','de'],['地球','dì qiú'],['。','']] },
  ];
  SENTENCES.forEach((s) => { s.zh = s.words.map((w) => w[0]).join(''); s.py = s.words.map((w) => w[1]).filter(Boolean).join(' '); });

  const TOTAL_DUR = SENTENCES.reduce((a, s) => a + s.dur, 0);   // ≈ 52s at Normal

  // 評分：整篇 4.0 / 5；標出的詞以外都算 correct
  const RESULT = {
    overall: 4.0,
    warning:   { 1: [3], 3: [4, 17], 5: [10] },       // 句 → 詞 index
    incorrect: { 2: [18], 3: [13] },
  };
  const wordStatus = (si, wi) => {
    if ((RESULT.incorrect[si] || []).includes(wi)) return 'incorrect';
    if ((RESULT.warning[si] || []).includes(wi)) return 'warning';
    return 'correct';
  };
  // 一句一句模式下單句的分數（基準檔用）
  const SENTENCE_SCORES = [4.5, 4.0, 3.5, 3.0, 4.5, 4.0];

  const VOICES = ['Xiaorou (Female)', 'Xiaoyi (Female)', 'Yunxiao (Male)', 'Yunxia (Male)'];   // config/practices.js zh-CN 那組
  const SPEEDS = [['Slow', 0.6], ['Normal', 0.8], ['Fast', 1.0]];

  const isPunct = (w) => /^[。，、；：？！…—·「」（）]+$/.test(w);
  const mmss = (s) => { s = Math.max(0, Math.round(s)); return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; };

  return { PROJECT, SENTENCES, TOTAL_DUR, RESULT, wordStatus, SENTENCE_SCORES, VOICES, SPEEDS, isPunct, mmss };
})();
