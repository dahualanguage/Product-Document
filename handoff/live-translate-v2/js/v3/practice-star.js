/* ════════════════════════════════════════════════
   PRACTICE — S9 練習設定, S10 練習預覽, S8 練習引擎 + 結果頁
   依賴：data.js, app.js, wordbank.js (getAllUniqueWords, getWordFreq)
   ════════════════════════════════════════════════ */

/* ── 狀態 ── */
var pracQueue = [];
var pracIndex = 0;
var pracCorrect = 0;
var pracResults = [];
var pracEarned = [];              /* 本次練習獲得熟練點數的單字 [{word, native, mastered}] */
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

/* ── 星等版 (star)：跟讀依發音給 1~5 星，≥3 星通過 ── */
var STAR_MAX = 5;
var STAR_PASS = 3;
var pracMirrorStars = 0;   /* 目前跟讀題最近一次錄音的星數 */
var demoFailUsed = false;  /* demo：第 2 題首次固定 2 星未過，只觸發一次 */

function starHTML(n) {
  var h = '';
  for (var i = 1; i <= STAR_MAX; i++) {
    h += '<span class="material-icons-round' + (i <= n ? ' on' : '') + '">' + (i <= n ? 'star' : 'star_border') + '</span>';
  }
  return '<span class="prac-star-row">' + h + '</span>';
}

function showPracStars(stars) {
  var el = document.getElementById('prac-stars');
  if (el) el.innerHTML = starHTML(stars);
}

/* 裝飾用波形（idle 靜態、錄音時律動） */
function waveHTML() {
  var heights = [28, 50, 70, 40, 86, 58, 100, 66, 38, 80, 52, 92, 60, 34, 76, 46, 64, 36];
  var bars = '';
  heights.forEach(function(h, i) {
    bars += '<span style="height:' + h + '%;animation-delay:' + (i * 0.06).toFixed(2) + 's"></span>';
  });
  return '<div class="prac-wave" id="prac-wave">' + bars + '</div>';
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
  quizTypesOn = { spelling: false, mirroring: true };   /* 星等版：只跟讀 */
  quizCount = 5;
  quizListMode = 'random';                              /* 星等版：內建隨機 */
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

  var isFree = (typeof isPro !== 'undefined' && !isPro);
  var left = (isFree && typeof practiceRemainingQuota === 'function') ? practiceRemainingQuota() : Infinity;

  var btn = document.getElementById('quiz-start-btn');
  if (btn) {
    if (quizWords.length === 0) {
      btn.disabled = true;
      btn.textContent = '尚無單字';
      btn.classList.remove('quiz-subscribe');
      btn.onclick = null;
    } else if (left <= 0) {
      /* 免費版今日次數用完 → 按鈕改為「立即訂閱」導向付費牆 */
      btn.disabled = false;
      btn.textContent = '立即訂閱';
      btn.classList.add('quiz-subscribe');
      btn.onclick = function() { if (typeof showPracticeLimitPaywall === 'function') showPracticeLimitPaywall(); };
    } else {
      btn.disabled = false;
      btn.textContent = '開始練習';
      btn.classList.remove('quiz-subscribe');
      btn.onclick = function() { showQuizPreview(); };
    }
  }

  /* 免費版：顯示今日剩餘練習題數 */
  var note = document.getElementById('quiz-quota-note');
  if (note) {
    if (isFree) {
      note.style.display = 'block';
      note.classList.toggle('empty', left <= 0);
      note.innerHTML = '今日剩餘練習 <strong>' + left + '</strong> / ' + maxFreePractice + ' 題';
    } else {
      note.style.display = 'none';
    }
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
    /* 確保「差一顆星就熟練」的字入選，方便展示練習後升級為熟練 */
    if (typeof wordMastery !== 'undefined' && typeof MASTERY_TARGET === 'number') {
      quizWords.forEach(function(w) {
        if ((wordMastery[w] || 0) === MASTERY_TARGET - 1 && pool.indexOf(w) === -1) {
          pool[pool.length - 1] = w;
        }
      });
    }
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
  wrap.className = 'quiz-list-wrap quiz-list-preview';
  words.forEach(function(w) {
    var native = (wordMap[w] && wordMap[w]['zh']) || '';
    var item = document.createElement('div');
    item.className = 'quiz-word-item';   /* 星等版：不可勾選，僅預覽 + 發音 */
    item.innerHTML =
      '<div class="quiz-word-en">' + w + '</div>' +
      '<div class="quiz-word-zh">' + native + '</div>' +
      '<button class="quiz-word-play" onclick="previewPlay(this)" aria-label="播放發音">' +
        '<span class="material-icons-round">volume_up</span>' +
      '</button>';
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

/* 預覽單字發音：喇叭 icon 跳動（demo 不彈 toast，未來接 TTS） */
function previewPlay(btn) {
  btn.classList.remove('playing');
  void btn.offsetWidth;
  btn.classList.add('playing');
}


/* ════════════════════════════════════════
   S8 — 練習引擎
   ════════════════════════════════════════ */
function startQuizPractice() {
  /* 免費版：今日練習次數已用完 → 直接跳付費牆，不進練習畫面 */
  if (typeof practiceRemainingQuota === 'function' && practiceRemainingQuota() <= 0) {
    if (typeof showPracticeLimitPaywall === 'function') showPracticeLimitPaywall();
    return;
  }
  var words = Object.keys(quizSelected);
  if (!words.length) return;
  quizTypesOn = { spelling: false, mirroring: true };   /* 星等版：只跟讀 */
  demoFailUsed = false;                                  /* 重置 demo 未過案例 */

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
  pracEarned = [];

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

function showPracQuestion() {
  var total = pracQueue.length;
  var pct = Math.round((pracIndex / total) * 100);
  document.getElementById('prac-fill').style.width = pct + '%';

  if (pracIndex >= total) {
    showPracResults();
    return;
  }

  /* 免費版：每題扣配額，達上限 → 跳升級付費牆 */
  if (typeof practiceConsumeQuota === 'function' && !practiceConsumeQuota()) {
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
  pracMirrorStars = 0;
  var native = (wordMap[word] && wordMap[word]['zh']) || '';

  area.innerHTML =
    '<div class="prac-counter"><strong>' + (pracIndex + 1) + '</strong> / ' + total + '</div>' +
    '<div class="prac-card prac-card-mirror">' +
      '<div class="prac-word-row">' +
        '<div class="prac-word-big">' + word + '</div>' +
        '<button class="prac-play-btn" id="prac-play" onclick="playPracWord(\'' + word + '\')" title="播放示範">' +
          '<span class="material-icons-round">volume_up</span>' +
        '</button>' +
      '</div>' +
      (native ? '<div class="prac-word-zh">' + native + '</div>' : '') +
      waveHTML() +
      '<div class="prac-mirror-controls" id="prac-mirror-controls">' +
        '<button class="prac-rec-btn" id="prac-rec" onclick="togglePracRec(\'' + word + '\')">' +
          '<span class="material-icons-round">mic</span> 開始錄音' +
        '</button>' +
      '</div>' +
      '<div class="prac-feedback">' +
        '<div class="prac-answer" id="prac-answer"></div>' +
        '<div class="prac-stars" id="prac-stars"></div>' +
      '</div>' +
    '</div>';
}

function togglePracRec(word) {
  var btn = document.getElementById('prac-rec');
  var wave = document.getElementById('prac-wave');
  if (btn.classList.contains('recording')) {
    btn.classList.remove('recording');
    if (wave) wave.classList.remove('recording');

    /* demo：模擬發音評分 1~5 星（多數落在 3~5，偶爾 1~2）；未來接語音評分 API */
    var stars;
    if (pracIndex === 1 && !demoFailUsed) {
      stars = 2;               /* demo：第 2 題首次固定 2 星（不通過），展示未過流程 */
      demoFailUsed = true;     /* 只觸發一次，再唸一次即恢復隨機 */
    } else {
      stars = (Math.random() < 0.18)
        ? (Math.random() < 0.5 ? 1 : 2)
        : (3 + Math.floor(Math.random() * 3));   /* 3、4、5 */
    }
    var passed = stars >= STAR_PASS;
    pracMirrorStars = stars;

    var answer = document.getElementById('prac-answer');
    answer.className = 'prac-answer ' + (passed ? 'correct' : 'wrong');
    answer.textContent = passed ? '✓ 發音通過！' : '未達 3 星，請再唸一次';
    showPracStars(stars);
    renderMirrorControls(word, passed);
  } else {
    btn.classList.add('recording');
    btn.innerHTML = '<span class="material-icons-round">stop</span> 停止錄音';
    if (wave) wave.classList.add('recording');
  }
}

/* 錄音後的控制列：通過 → 再唸一次 + 下一題；未過 → 只給再唸一次 */
function renderMirrorControls(word, passed) {
  var wrap = document.getElementById('prac-mirror-controls');
  if (!wrap) return;
  wrap.className = 'prac-mirror-controls done';
  var again = '<button class="prac-again-btn" onclick="retryMirroring(\'' + word + '\')">' +
                '<span class="material-icons-round">mic</span> 再唸一次</button>';
  if (passed) {
    var isLast = (pracIndex + 1 >= pracQueue.length);
    wrap.innerHTML = again +
      '<button class="prac-next-btn" onclick="advanceMirroring()">' + (isLast ? '看結果' : '下一題') + '</button>';
  } else {
    wrap.innerHTML = again;   /* 未達 3 星：只能再唸一次 */
  }
}

/* 再唸一次：重建同一題，回到可錄音狀態 */
function retryMirroring(word) {
  var area = document.getElementById('prac-area');
  if (area) buildMirroringQ(area, word);
}

/* 通過後前進：記錄本題（通過）成績並下一題 */
function advanceMirroring() {
  var word = pracQueue[pracIndex].word;
  var passed = pracMirrorStars >= STAR_PASS;
  pracResults.push({ word: word, type: 'mirroring', correct: passed, stars: pracMirrorStars, userAnswer: '' });
  if (passed) {
    pracCorrect++;
    if (typeof addMasteryPass === 'function') {
      var before = (typeof wordMastery !== 'undefined' && wordMastery[word]) || 0;
      addMasteryPass(word);                                            /* 跟讀通過 → 熟練度 +1 */
      var after = (typeof wordMastery !== 'undefined' && wordMastery[word]) || 0;
      if (after > before) {                                            /* 有實際加到點數才記錄 */
        pracEarned.push({
          word: word,
          native: (wordMap[word] && wordMap[word]['zh']) || '',
          mastered: (typeof MASTERY_TARGET !== 'undefined') && after >= MASTERY_TARGET && before < MASTERY_TARGET
        });
      }
    }
  }
  pracIndex++;
  showPracQuestion();
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
    html += '<div class="results-item">' +
              '<div class="results-item-icon ' + (r.correct ? 'correct' : 'wrong') + '">' +
                '<span class="material-icons-round">' + (r.correct ? 'check' : 'close') + '</span>' +
              '</div>' +
              '<div class="results-item-word">' + r.word +
                '<div class="results-item-native">' + native + '</div>' +
              '</div>' +
              starHTML(r.stars || 0) +
            '</div>';
  });
  html += '</div>';   /* /results-detail-list */
  html += '</div>';   /* /results-detail */

  /* ── 行動按鈕（完成為主、再練一次為次） ── */
  html += '<div class="results-actions">';
  html += '<button class="results-btn-primary" onclick="backFromResults()"><span class="material-icons-round">check</span> 完成</button>';
  html += '<button class="results-btn-text" onclick="retryPractice()"><span class="material-icons-round">replay</span> 再練一次</button>';
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
  pracEarned = [];

  var area = document.getElementById('prac-area');
  area.className = 'prac-area';
  showScreen('screen-8');
  showPracQuestion();
}

function backFromResults() {
  showBottomNav();
  var area = document.getElementById('prac-area');
  area.className = 'prac-area';

  /* 練習完成 → 一律跳轉到單字庫，並提示本次獲得點數的單字 */
  switchTab('wordbank');
  showWbEarnedBanner(pracEarned);
}

/* ── 練習完成後，於單字庫頂端提示本次獲得點數的單字 ── */
function showWbEarnedBanner(earned) {
  var host = document.querySelector('#screen-7 .detail-body');
  if (!host) return;

  var old = document.getElementById('wb-earned-banner');
  if (old) old.remove();
  if (!earned || !earned.length) { host.classList.remove('wb-has-banner'); return; }
  host.classList.add('wb-has-banner');

  var chips = earned.map(function(e) {
    return '<span class="wb-earned-chip' + (e.mastered ? ' mastered' : '') + '">' +
             '<b>' + e.word + '</b>' + (e.native ? ' ' + e.native : '') +
             '<span class="wb-earned-tag">' + (e.mastered ? '熟練!' : '+1') + '</span>' +
           '</span>';
  }).join('');

  var banner = document.createElement('div');
  banner.className = 'wb-earned-banner';
  banner.id = 'wb-earned-banner';
  banner.innerHTML =
    '<div class="wb-earned-head">' +
      '<span class="material-icons-round">military_tech</span>' +
      '<span class="wb-earned-title">本次練習有 ' + earned.length + ' 個單字獲得熟練點數</span>' +
      '<button class="wb-earned-close" onclick="dismissWbEarned()" aria-label="關閉">' +
        '<span class="material-icons-round">close</span>' +
      '</button>' +
    '</div>' +
    '<div class="wb-earned-chips">' + chips + '</div>';
  host.insertBefore(banner, host.firstChild);
}

function dismissWbEarned() {
  var b = document.getElementById('wb-earned-banner');
  if (b) b.remove();
  var host = document.querySelector('#screen-7 .detail-body');
  if (host) host.classList.remove('wb-has-banner');
}
