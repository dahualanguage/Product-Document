/* ════════════════════════════════════════════════
   PRACTICE — S9 练习设置, S10 练习预览, S8 练习引擎 + 结果页
   依赖：data.js, app.js, wordbank.js (getAllUniqueWords, getWordFreq)
   ════════════════════════════════════════════════ */

/* ── 状态 ── */
var pracQueue = [];
var pracIndex = 0;
var pracCorrect = 0;
var pracResults = [];
var pracReturnTo = 'practice';
var pracStartTime = null;

/* 练习设置状态 */
var quizSelected = {};
var quizWords = [];
var quizTypesOn = { spelling: true, mirroring: false };
var quizCount = 5;
var quizListMode = 'random';

var quizMistakeWords = ['photosynthesis', 'submit', 'assignment', 'record'];
var quizNewestWords = ['plant', 'record', 'energy', 'sunlight'];


/* ════════════════════════════════════════
   S9 — 练习设置
   ════════════════════════════════════════ */
function goToPracticeSetup() {
  showHomeBar();
  updateHeaderTitle('练习');
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
    btn.textContent = quizWords.length > 0 ? '开始练习' : '尚无单字';
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
   S10 — 练习预览
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

  showSubBar('练习预览');
  currentBackAction = backToPracticeSetup;
  showScreen('screen-10');
}

function backToPracticeSetup() {
  showSubBar('练习');
  currentBackAction = function() { switchTab('record'); };
  showScreen('screen-9');
}


/* ════════════════════════════════════════
   S8 — 练习引擎
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

  var title = (quizTypesOn.spelling && quizTypesOn.mirroring) ? '拼写 + 跟读' :
              quizTypesOn.spelling ? '拼写练习' : '跟读练习';
  showSubBar(title);
  currentBackAction = function() {
    showSubBar('练习');
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

  var title = (pracTypes.spelling && pracTypes.mirroring) ? '拼写 + 跟读' :
              pracTypes.spelling ? '拼写练习' : '跟读练习';
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
  var d = wordDetails[word] || {};
  var native = (wordMap[word] && wordMap[word]['zh']) || '';
  var s = (d.senses && d.senses[0]) || {};
  var total = pracQueue.length;

  area.innerHTML =
    '<div class="prac-counter"><strong>' + (pracIndex + 1) + '</strong> / ' + total + '</div>' +
    '<div class="prac-card">' +
      '<span class="prac-type-badge spelling">拼写</span>' +
      '<div class="prac-zh">' + native + '</div>' +
      (s.pos ? '<div class="prac-sub">' + s.pos + '</div>' : '') +
      (s.def ? '<div class="prac-def">' + s.def + '</div>' : '') +
      '<input class="prac-input" id="prac-input" type="text" placeholder="输入英文拼写" autocomplete="off" autocapitalize="off">' +
      '<button class="prac-submit" id="prac-submit" onclick="checkPracSpelling(\'' + word + '\')">确认</button>' +
    '</div>';

  setTimeout(function() {
    var inp = document.getElementById('prac-input');
    if (inp) {
      inp.focus();
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') checkPracSpelling(word); });
    }
  }, 300);
}

function checkPracSpelling(word) {
  var input = document.getElementById('prac-input');
  var answer = document.getElementById('prac-answer');
  var val = input.value.trim().toLowerCase();
  if (!val) return;

  var isCorrect = (val === word);
  pracResults.push({ word: word, type: 'spelling', correct: isCorrect, userAnswer: val });

  input.readOnly = true;

  if (isCorrect) {
    input.className = 'prac-input correct';
    input.value = '✓ ' + val;
    pracCorrect++;
  } else {
    input.className = 'prac-input wrong';
    input.value = '✗ ' + val + '  →  ' + word;
  }

  var btn = document.getElementById('prac-submit');
  setTimeout(function() {
    btn.textContent = '下一题';
    btn.onclick = function() { pracIndex++; showPracQuestion(); };
  }, isCorrect ? 0 : 1000);
}

function buildMirroringQ(area, word) {
  var total = pracQueue.length;

  area.innerHTML =
    '<div class="prac-counter"><strong>' + (pracIndex + 1) + '</strong> / ' + total + '</div>' +
    '<div class="prac-card">' +
      '<span class="prac-type-badge mirroring">跟读</span>' +
      '<div class="prac-word-big">' + word + '</div>' +
      '<button class="prac-play-btn" onclick="showToast(\'🔊 ' + word + '\')">' +
        '<span class="material-icons-round">volume_up</span>' +
      '</button>' +
      '<div style="font-size:11px;color:#94a3b8;text-align:center;margin-bottom:8px;">点击播放示范</div>' +
      '<button class="prac-rec-btn" id="prac-rec" onclick="togglePracRec(\'' + word + '\')">' +
        '<span class="material-icons-round">mic</span> 开始录音' +
      '</button>' +
      '<div class="prac-answer" id="prac-answer"></div>' +
    '</div>';
}

function togglePracRec(word) {
  var btn = document.getElementById('prac-rec');
  if (btn.classList.contains('recording')) {
    btn.classList.remove('recording');
    btn.innerHTML = '<span class="material-icons-round">mic</span> 开始录音';
    var answer = document.getElementById('prac-answer');
    answer.className = 'prac-answer correct';
    answer.textContent = '✓ 录音完成！';
    pracCorrect++;
    pracResults.push({ word: word, type: 'mirroring', correct: true, userAnswer: '' });
    setTimeout(function() { pracIndex++; showPracQuestion(); }, 1000);
  } else {
    btn.classList.add('recording');
    btn.innerHTML = '<span class="material-icons-round">stop</span> 停止录音';
  }
}


/* ════════════════════════════════════════
   练习结果页
   ════════════════════════════════════════ */
function showPracResults() {
  document.getElementById('prac-fill').style.width = '100%';

  var total = pracQueue.length;
  var wrongCount = total - pracCorrect;
  var wrongResults = pracResults.filter(function(r) { return !r.correct; });

  var area = document.getElementById('prac-area');
  area.className = 'results-body';
  area.style.padding = '';

  var html = '';

  /* ── 成绩摘要 ── */
  html += '<div class="results-summary">';
  html += '<div class="results-icon"><span class="material-icons-round">emoji_events</span></div>';
  html += '<div class="results-title">练习完成！</div>';
  html += '<div class="results-stats">';
  html += '<div class="results-stat"><div class="results-stat-val">' + total + '</div><div class="results-stat-label">总题数</div></div>';
  html += '<div class="results-stat"><div class="results-stat-val correct">' + pracCorrect + '</div><div class="results-stat-label">答对</div></div>';
  html += '<div class="results-stat"><div class="results-stat-val wrong">' + wrongCount + '</div><div class="results-stat-label">答错</div></div>';
  html += '</div>';
  html += '</div>';

  /* ── 行动按钮 ── */
  html += '<div class="results-actions">';
  html += '<button class="results-btn-primary" onclick="retryPractice()"><span class="material-icons-round">replay</span> 再练一次</button>';
  html += '<button class="results-btn-text" onclick="backFromResults()"><span class="material-icons-round">arrow_back</span> 回单字库</button>';
  html += '</div>';

  area.innerHTML = html;
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
