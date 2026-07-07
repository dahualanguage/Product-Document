/* ════════════════════════════════════════════════
   PRACTICE — S9 練習設定, S10 練習預覽, S8 練習引擎 + 結果頁
   依賴：data.js, app.js, wordbank.js (getAllUniqueWords, getWordFreq)
   ════════════════════════════════════════════════ */

/* ── 狀態 ── */
var pracQueue = [];
var pracIndex = 0;
var pracCorrect = 0;
var pracResults = [];
var pracReturnTo = 'practice';
var pracStartTime = null;

/* 練習設定狀態 */
var quizSelected = {};
var quizWords = [];
var quizTypesOn = { spelling: true, mirroring: false };
var quizCount = 5;
var quizListMode = 'random';

var quizMistakeWords = ['photosynthesis', 'submit', 'assignment', 'record'];
var quizNewestWords = ['plant', 'record', 'energy', 'sunlight'];

/* ── 拼寫重試狀態 (v3) ── */
var pracAttempts = 0;      /* 目前拼寫題已錯次數（0~3） */

/* ── 星等版 (star)：第 1 次答對=★★★、第 2 次=★★、第 3 次=★、未過=0 ── */
function starHTML(n) {
  var h = '';
  for (var i = 1; i <= 3; i++) {
    h += '<span class="material-icons-round">' + (i <= n ? 'star' : 'star_border') + '</span>';
  }
  return '<span class="prac-star-row s' + n + '">' + h + '</span>';
}

function showPracStars(stars) {
  var el = document.getElementById('prac-stars');
  if (el) el.innerHTML = starHTML(stars);
}


/* ════════════════════════════════════════
   S9 — 練習設定
   ════════════════════════════════════════ */
function goToPracticeSetup() {
  showHomeBar();
  updateHeaderTitle('練習');
  hideHeaderBack();
  currentBackAction = null;
  quizSelected = {};
  quizTypesOn = { spelling: true, mirroring: false };
  quizCount = 5;
  quizListMode = 'random';
  buildPracticeSetup();
  showScreen('screen-9');
}

function buildPracticeSetup() {
  quizWords = getAllUniqueWords();
  document.querySelectorAll('.quiz-type-check').forEach(function(el) {
    el.classList.toggle('active', !!quizTypesOn[el.dataset.type]);
  });
  document.querySelectorAll('.quiz-sel-btn').forEach(function(el) {
    el.classList.toggle('active', el.dataset.mode === quizListMode);
  });
  buildQuizCountBtns();
  var btn = document.getElementById('quiz-start-btn');
  if (btn) {
    btn.disabled = quizWords.length === 0;
    btn.textContent = quizWords.length > 0 ? '開始練習' : '尚無單字';
  }
}

function toggleQuizType(type, btn) {
  quizTypesOn[type] = !quizTypesOn[type];
  if (!quizTypesOn.spelling && !quizTypesOn.mirroring) {
    quizTypesOn[type] = true;
    return;
  }
  btn.classList.toggle('active', quizTypesOn[type]);
}

function setQuizListMode(mode, btn) {
  quizListMode = mode;
  document.querySelectorAll('.quiz-sel-btn').forEach(function(el) {
    el.classList.toggle('active', el.dataset.mode === mode);
  });
}

function buildQuizCountBtns() {
  var group = document.getElementById('quiz-count-group');
  if (!group) return;
  group.innerHTML = '';
  var maxWords = quizWords.length;
  [5, 10, 15].forEach(function(n) {
    var canUse = maxWords >= n;
    var btn = document.createElement('button');
    btn.className = 'quiz-count-btn' + (quizCount === n ? ' active' : '') + (!canUse ? ' disabled' : '');
    btn.textContent = n;
    if (canUse) {
      btn.onclick = function() {
        quizCount = n;
        document.querySelectorAll('.quiz-count-btn').forEach(function(el) {
          el.classList.toggle('active', parseInt(el.textContent) === n);
        });
      };
    }
    group.appendChild(btn);
  });
}


/* ════════════════════════════════════════
   S10 — 練習預覽
   ════════════════════════════════════════ */
function applyListMode() {
  quizSelected = {};
  var pool;
  if (quizListMode === 'mistakes') {
    pool = quizMistakeWords.filter(function(w) { return quizWords.indexOf(w) !== -1; });
  } else if (quizListMode === 'newest') {
    pool = quizNewestWords.filter(function(w) { return quizWords.indexOf(w) !== -1; });
  } else {
    pool = quizWords.slice();
    for (var i = pool.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
    }
    pool = pool.slice(0, quizCount);
  }
  pool.forEach(function(w) { quizSelected[w] = true; });
}

function showQuizPreview() {
  if (!quizWords.length) return;
  quizSelected = {};
  applyListMode();

  var words = Object.keys(quizSelected);
  document.getElementById('quiz-preview-count').textContent = words.length;
  var list = document.getElementById('quiz-preview-list');
  list.innerHTML = '';

  var wrap = document.createElement('div');
  wrap.className = 'quiz-list-wrap';
  words.forEach(function(w) {
    var native = (wordMap[w] && wordMap[w]['zh']) || '';
    var item = document.createElement('div');
    item.className = 'quiz-word-item selected';
    item.innerHTML =
      '<div class="quiz-word-check"><span class="material-icons-round">check</span></div>' +
      '<div class="quiz-word-en">' + w + '</div>' +
      '<div class="quiz-word-zh">' + native + '</div>';
    item.onclick = function() {
      quizSelected[w] = !quizSelected[w];
      if (!quizSelected[w]) delete quizSelected[w];
      item.classList.toggle('selected', !!quizSelected[w]);
    };
    wrap.appendChild(item);
  });
  list.appendChild(wrap);

  showSubBar('練習預覽');
  currentBackAction = backToPracticeSetup;
  showScreen('screen-10');
}

function backToPracticeSetup() {
  showSubBar('練習');
  currentBackAction = function() { switchTab('record'); };
  showScreen('screen-9');
}


/* ════════════════════════════════════════
   S8 — 練習引擎
   ════════════════════════════════════════ */
function startQuizPractice() {
  var words = Object.keys(quizSelected);
  if (!words.length) return;

  for (var i = words.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = words[i]; words[i] = words[j]; words[j] = tmp;
  }

  pracQueue = [];
  words.forEach(function(w) {
    if (quizTypesOn.spelling) pracQueue.push({ word: w, type: 'spelling' });
    if (quizTypesOn.mirroring) pracQueue.push({ word: w, type: 'mirroring' });
  });

  pracIndex = 0;
  pracCorrect = 0;
  pracResults = [];
  pracReturnTo = 'practice';

  var title = (quizTypesOn.spelling && quizTypesOn.mirroring) ? '拼寫 + 跟讀' :
              quizTypesOn.spelling ? '拼寫練習' : '跟讀練習';
  showSubBar(title);
  currentBackAction = function() {
    showSubBar('練習');
    currentBackAction = function() { switchTab('record'); };
    showBottomNav();
    showScreen('screen-9');
  };

  hideBottomNav();
  showScreen('screen-8');
  showPracQuestion();
}

function startPracticeSession() {
  var words = Object.keys(wbSelected);
  if (!words.length) return;
  var typeCount = (pracTypes.spelling ? 1 : 0) + (pracTypes.mirroring ? 1 : 0);
  if (!typeCount) return;

  pracQueue = [];
  words.forEach(function(w) {
    if (pracTypes.spelling) pracQueue.push({ word: w, type: 'spelling' });
    if (pracTypes.mirroring) pracQueue.push({ word: w, type: 'mirroring' });
  });
  pracIndex = 0;
  pracCorrect = 0;
  pracResults = [];
  pracReturnTo = 'wordbank';

  var title = (pracTypes.spelling && pracTypes.mirroring) ? '拼寫 + 跟讀' :
              pracTypes.spelling ? '拼寫練習' : '跟讀練習';
  showSubBar(title);
  currentBackAction = function() {
    showBottomNav();
    switchTab('wordbank');
  };

  hideBottomNav();
  showScreen('screen-8');
  showPracQuestion();
}

function showPracQuestion() {
  var total = pracQueue.length;
  var pct = Math.round((pracIndex / total) * 100);
  document.getElementById('prac-fill').style.width = pct + '%';

  if (pracIndex >= total) {
    showPracResults();
    return;
  }

  var q = pracQueue[pracIndex];
  var area = document.getElementById('prac-area');

  if (q.type === 'spelling') {
    buildSpellingQ(area, q.word);
  } else {
    buildMirroringQ(area, q.word);
  }
}

function buildSpellingQ(area, word) {
  pracAttempts = 0;
  var native = (wordMap[word] && wordMap[word]['zh']) || '';
  var total = pracQueue.length;

  area.innerHTML =
    '<div class="prac-counter"><strong>' + (pracIndex + 1) + '</strong> / ' + total + '</div>' +
    '<div class="prac-card">' +
      '<span class="prac-type-badge spelling">拼寫</span>' +
      '<button class="prac-play-btn" id="prac-play" onclick="playPracWord(\'' + word + '\')" title="播放發音">' +
        '<span class="material-icons-round">volume_up</span>' +
      '</button>' +
      '<div class="prac-zh">' + native + '</div>' +
      '<input class="prac-input" id="prac-input" type="text" placeholder="輸入英文拼寫" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false">' +
      '<div class="prac-hint" id="prac-hint"></div>' +
      '<div class="prac-stars" id="prac-stars"></div>' +
      '<button class="prac-submit" id="prac-submit" onclick="checkPracSpelling(\'' + word + '\')">確認</button>' +
    '</div>';

  setTimeout(function() {
    playPracWord(word);   /* 開始時播放音檔 */
    var inp = document.getElementById('prac-input');
    if (inp) {
      inp.focus();
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') checkPracSpelling(word); });
    }
  }, 300);
}

/* 播放單字發音：喇叭 icon 輕微跳動（demo 不彈 toast，未來接 TTS / 音檔） */
function playPracWord(word) {
  var btn = document.getElementById('prac-play');
  if (btn) {
    btn.classList.remove('playing');
    void btn.offsetWidth;        /* 重排以重啟動畫 */
    btn.classList.add('playing');
  }
}

/* 依指定位置（1-indexed）顯示字母，其餘遮成 _ */
function maskWord(word, positions) {
  var out = [];
  for (var i = 0; i < word.length; i++) {
    out.push(positions.indexOf(i + 1) !== -1 ? word.charAt(i) : '_');
  }
  return out.join(' ');
}

function checkPracSpelling(word) {
  var input = document.getElementById('prac-input');
  if (input.readOnly) return;   /* 已作答鎖定，避免 Enter 重複觸發（單字重複 bug） */
  var hint = document.getElementById('prac-hint');
  var val = input.value.trim().toLowerCase();
  if (!val) return;
  var w = word.trim().toLowerCase();

  /* ── 答對：依已錯次數給星（第1次=★★★、第2次=★★、第3次=★） ── */
  if (val === w) {
    var stars = Math.max(1, 3 - pracAttempts);
    input.readOnly = true;
    input.className = 'prac-input correct';
    input.value = '✓ ' + val;
    if (hint) hint.innerHTML = '';
    pracResults.push({ word: word, type: 'spelling', correct: true, stars: stars, userAnswer: val });
    pracCorrect++;
    showPracStars(stars);
    goNextAfterSpelling(600);
    return;
  }

  /* ── 答錯：漸進提示，第 3 次錯直接判未通過 ── */
  pracAttempts++;
  input.className = 'prac-input wrong';

  if (pracAttempts === 1) {
    /* 第一次錯：提示開頭字母 */
    if (hint) hint.innerHTML = '<span class="prac-hint-tip">再試一次 · 開頭是 <b>' + w.charAt(0) + '</b></span>';
    input.value = '';
    input.focus();
  } else if (pracAttempts === 2) {
    /* 第二次錯：提示所有奇數位（1,3,5,7…） */
    var odds = [];
    for (var p = 1; p <= w.length; p += 2) odds.push(p);
    if (hint) hint.innerHTML = '<span class="prac-hint-tip">再試一次 · <span class="prac-mask">' + maskWord(w, odds) + '</span></span>';
    input.value = '';
    input.focus();
  } else {
    /* 第三次錯：未通過，跳下一題 */
    input.readOnly = true;
    input.value = '✗ ' + val + '  →  ' + word;
    if (hint) hint.innerHTML = '<span class="prac-fail">未通過 · 正解 <b>' + word + '</b></span>';
    pracResults.push({ word: word, type: 'spelling', correct: false, stars: 0, userAnswer: val });
    showPracStars(0);
    goNextAfterSpelling(1200);
  }
}

/* 拼寫作答結束後切換「下一題 / 看結果」 */
function goNextAfterSpelling(delay) {
  var isLast = (pracIndex + 1 >= pracQueue.length);
  var btn = document.getElementById('prac-submit');
  setTimeout(function() {
    btn.textContent = isLast ? '看結果' : '下一題';
    btn.onclick = function() { pracIndex++; showPracQuestion(); };
  }, delay);
}

function buildMirroringQ(area, word) {
  var total = pracQueue.length;

  area.innerHTML =
    '<div class="prac-counter"><strong>' + (pracIndex + 1) + '</strong> / ' + total + '</div>' +
    '<div class="prac-card">' +
      '<span class="prac-type-badge mirroring">跟讀</span>' +
      '<div class="prac-word-big">' + word + '</div>' +
      '<button class="prac-play-btn" id="prac-play" onclick="playPracWord(\'' + word + '\')" title="播放示範">' +
        '<span class="material-icons-round">volume_up</span>' +
      '</button>' +
      '<div style="font-size:11px;color:#94a3b8;text-align:center;margin-bottom:8px;">點擊播放示範</div>' +
      '<button class="prac-rec-btn" id="prac-rec" onclick="togglePracRec(\'' + word + '\')">' +
        '<span class="material-icons-round">mic</span> 開始錄音' +
      '</button>' +
      '<div class="prac-answer" id="prac-answer"></div>' +
      '<div class="prac-stars" id="prac-stars"></div>' +
    '</div>';
}

function togglePracRec(word) {
  var btn = document.getElementById('prac-rec');
  if (btn.classList.contains('recording')) {
    btn.classList.remove('recording');
    btn.innerHTML = '<span class="material-icons-round">mic</span> 開始錄音';
    var answer = document.getElementById('prac-answer');
    answer.className = 'prac-answer correct';
    answer.textContent = '✓ 錄音完成！';
    pracCorrect++;
    pracResults.push({ word: word, type: 'mirroring', correct: true, stars: 3, userAnswer: '' });
    showPracStars(3);
    setTimeout(function() { pracIndex++; showPracQuestion(); }, 1200);
  } else {
    btn.classList.add('recording');
    btn.innerHTML = '<span class="material-icons-round">stop</span> 停止錄音';
  }
}


/* ════════════════════════════════════════
   練習結果頁
   ════════════════════════════════════════ */
function showPracResults() {
  document.getElementById('prac-fill').style.width = '100%';

  var total = pracQueue.length;
  var passCount = pracResults.filter(function(r) { return r.correct; }).length;
  var failCount = total - passCount;

  var area = document.getElementById('prac-area');
  area.className = 'results-body';
  area.style.padding = '';

  var html = '';

  /* ── 成績摘要 ── */
  html += '<div class="results-summary">';
  html += '<div class="results-icon"><span class="material-icons-round">emoji_events</span></div>';
  html += '<div class="results-title">練習完成！</div>';
  html += '<div class="results-stats">';
  html += '<div class="results-stat"><div class="results-stat-val">' + total + '</div><div class="results-stat-label">總題數</div></div>';
  html += '<div class="results-stat"><div class="results-stat-val correct">' + passCount + '</div><div class="results-stat-label">通過</div></div>';
  html += '<div class="results-stat"><div class="results-stat-val wrong">' + failCount + '</div><div class="results-stat-label">未過</div></div>';
  html += '</div>';
  html += '</div>';

  /* ── 作答明細（可收合，內部固定高捲動） ── */
  html += '<div class="results-detail">';
  html += '<div class="results-detail-header" onclick="toggleResultsDetail()">' +
            '<span class="material-icons-round">fact_check</span> 作答明細（' + pracResults.length + '）' +
            '<span class="material-icons-round rd-chevron" id="rd-chevron">expand_less</span>' +
          '</div>';
  html += '<div class="results-detail-list" id="results-detail-list">';
  pracResults.forEach(function(r) {
    var native = (wordMap[r.word] && wordMap[r.word]['zh']) || '';
    var typeLabel = r.type === 'spelling' ? '拼寫' : '跟讀';
    html += '<div class="results-item">' +
              '<div class="results-item-icon ' + (r.correct ? 'correct' : 'wrong') + '">' +
                '<span class="material-icons-round">' + (r.correct ? 'check' : 'close') + '</span>' +
              '</div>' +
              '<div class="results-item-word">' + r.word +
                '<div class="results-item-native">' + native + '</div>' +
              '</div>' +
              starHTML(r.stars || 0) +
              '<span class="results-item-type">' + typeLabel + '</span>' +
            '</div>';
  });
  html += '</div>';   /* /results-detail-list */
  html += '</div>';   /* /results-detail */

  /* ── 行動按鈕 ── */
  html += '<div class="results-actions">';
  html += '<button class="results-btn-primary" onclick="retryPractice()"><span class="material-icons-round">replay</span> 再練一次</button>';
  html += '<button class="results-btn-text" onclick="backFromResults()"><span class="material-icons-round">arrow_back</span> 完成</button>';
  html += '</div>';

  area.innerHTML = html;
}

/* 收合 / 展開作答明細 */
function toggleResultsDetail() {
  var list = document.getElementById('results-detail-list');
  var chev = document.getElementById('rd-chevron');
  if (!list) return;
  var collapsed = list.classList.toggle('collapsed');
  if (chev) chev.textContent = collapsed ? 'expand_more' : 'expand_less';
}

function retryPractice() {
  pracIndex = 0;
  pracCorrect = 0;
  pracResults = [];

  var area = document.getElementById('prac-area');
  area.className = 'prac-area';
  showScreen('screen-8');
  showPracQuestion();
}

function backFromResults() {
  showBottomNav();
  var area = document.getElementById('prac-area');
  area.className = 'prac-area';

  if (pracReturnTo === 'wordbank') {
    switchTab('wordbank');
  } else {
    switchTab('practice');
  }
}
