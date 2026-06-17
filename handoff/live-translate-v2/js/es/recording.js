/* ════════════════════════════════════════════════
   RECORDING — 語言選擇、計時器、波形、Transcripción、
               單字保存、總結頁 (S1, S2, S4)
   依賴：data.js, app.js
   ════════════════════════════════════════════════ */

/* ── 狀態 ── */
var currentLang = 'zh';
var savedWords = [];
var timerInterval = null;
var timerSec = 0;
var isPaused = false;
var hasStartedSession = false;

/* ════════ Idle waveform (S1) ════════ */
(function() {
  var h = [14,20,32,46,60,74,86,78,62,48,34,22,16,26,40,56,70,82,90,80,
           66,50,36,24,18,28,44,60,76,88,82,68,52,38,26,20,30,46,62,78,
           88,76,60,44,30,20,14,22,36,52];
  var wrap = document.getElementById('waveform-idle');
  if (!wrap) return;
  h.forEach(function(v) {
    var b = document.createElement('div');
    b.className = 'bar';
    b.style.height = v + 'px';
    wrap.appendChild(b);
  });
})();

/* ════════ Live waveform builder ════════ */
function buildLiveWave(id) {
  var h = [10,16,24,34,42,48,40,30,22,14,10,16,26,36,44,48,38,28,20,12,
            9,14,24,34,42,46,36,26,18,12,10,18,28,38,44,40,30,22,14,10];
  var wrap = document.getElementById(id);
  if (!wrap) return;
  wrap.innerHTML = '';
  h.forEach(function(v, i) {
    var b = document.createElement('div');
    b.className = 'bar';
    b.style.height = v + 'px';
    b.style.animationDelay = (i * 0.05) + 's';
    wrap.appendChild(b);
  });
}

/* ════════ Language selector ════════ */
var hints = {
  zh: 'Elige un idioma y toca para empezar<br>Traduce inglés en vivo.',
  es: 'Selecciona el idioma y toca<br>iniciar para traducir.'
};
var startLabels = { zh: 'Iniciar grabación', es: 'Iniciar' };

function toggleDropdown() {
  document.getElementById('lang-dropdown').classList.toggle('open');
}

function selectLang(code, label, locale) {
  currentLang = locale;
  document.getElementById('target-code').textContent = code;
  document.getElementById('target-label').textContent = label;
  document.getElementById('hint-text').innerHTML = hints[locale];
  document.getElementById('lang-dropdown').classList.remove('open');
  document.getElementById('start-label').textContent = startLabels[locale];
  document.querySelectorAll('.lang-option').forEach(function(el) {
    el.classList.toggle('selected', el.textContent.trim().startsWith(label));
  });
}

/* 點擊外部關閉 dropdown */
document.addEventListener('click', function(e) {
  var wrap = document.getElementById('target-wrap');
  if (wrap && !wrap.contains(e.target)) {
    document.getElementById('lang-dropdown').classList.remove('open');
  }
});

/* ════════ Timer ════════ */
function startTimer() {
  timerSec = 0;
  document.getElementById('timer-badge').classList.add('live');
  /* Desktop 有第M個 timer badge */
  var badge2 = document.getElementById('timer-badge-mobile');
  if (badge2) badge2.classList.add('live');

  timerInterval = setInterval(function() {
    if (!isPaused) {
      timerSec++;
      var m = String(Math.floor(timerSec / 60)).padStart(2, '0');
      var s = String(timerSec % 60).padStart(2, '0');
      var display = m + ':' + s;
      document.getElementById('timer-display').textContent = display;
      var display2 = document.getElementById('timer-display-mobile');
      if (display2) display2.textContent = display;
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  document.getElementById('timer-badge').classList.remove('live');
  var badge2 = document.getElementById('timer-badge-mobile');
  if (badge2) badge2.classList.remove('live');
}

/* ════════ S1 → S2: Start Recording ════════ */
function startRecording() {
  hideBottomNav();
  if (!hasStartedSession) {
    savedWords = [
      { word: 'vocabulary', trans: wordMap['vocabulary'][currentLang] },
      { word: 'photosynthesis', trans: wordMap['photosynthesis'][currentLang] }
    ];
    buildLiveWave('live-wave');
    buildTranscript('transcript-2', true, ['vocabulary', 'photosynthesis']);
    hasStartedSession = true;
  }
  startTimer();
  updateHeaderTitle('Grabando');
  hideHeaderBack();
  showScreen('screen-2');
}

/* ════════ Resume Recording (from S4) ════════ */
function resumeRecording() {
  hideBottomNav();
  startTimer();
  updateHeaderTitle('Grabando');
  hideHeaderBack();
  showScreen('screen-2');
}

/* ════════ S2 → S4: End Session ════════ */
function endSession() {
  stopTimer();
  var m = String(Math.floor(timerSec / 60)).padStart(2, '0');
  var s = String(timerSec % 60).padStart(2, '0');
  document.getElementById('final-time').textContent = m + ':' + s;
  document.getElementById('saved-count').textContent = savedWords.length;

  /* Default session name */
  var now = new Date();
  var pad = function(n) { return String(n).padStart(2, '0'); };
  var defaultName = now.getFullYear() + '/' +
    pad(now.getMonth() + 1) + '/' + pad(now.getDate()) + '  ' +
    pad(now.getHours()) + ':' + pad(now.getMinutes());
  document.getElementById('session-name').value = defaultName;

  buildSummary();
  showBottomNav();
  updateHeaderTitle('Resumen de traducción');
  hideHeaderBack();
  showScreen('screen-4');
}

/* ════════ Reset ════════ */
function resetToStart() {
  savedWords = [];
  isPaused = false;
  hasStartedSession = false;
  showBottomNav();
  updateHeaderTitle('Traducción en vivo');
  hideHeaderBack();
  showScreen('screen-1');
}

function finishSession() {
  resetToStart();
}

/* ════════ Pause ════════ */
function togglePause(btn) {
  isPaused = !isPaused;
  btn.querySelector('.material-icons-round').textContent = isPaused ? 'play_arrow' : 'pause';
  btn.style.borderColor = isPaused ? '#10b981' : '';
  btn.style.color = isPaused ? '#10b981' : '';
}

/* ════════ Build Transcript ════════ */
function buildTranscript(containerId, clickable, preSelected) {
  preSelected = preSelected || [];
  var container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  transcriptData.forEach(function(item, i) {
    var block = document.createElement('div');
    block.className = 'trans-block' + (i === transcriptData.length - 1 ? ' incoming' : '');

    var enDiv = document.createElement('div');
    enDiv.className = 'trans-en';

    if (clickable) {
      var words = item.en.split(/(\s+)/);
      words.forEach(function(tok) {
        var clean = tok.trim().replace(/[.,!?']/g, '').toLowerCase();
        if (wordMap[clean]) {
          var span = document.createElement('span');
          span.className = 'word';
          span.textContent = tok;
          span.dataset.word = clean;
          if (preSelected.indexOf(clean) !== -1) {
            span.classList.add('saved');
          }
          span.onclick = function() { saveWord(span, clean); };
          enDiv.appendChild(span);
        } else {
          enDiv.appendChild(document.createTextNode(tok));
        }
      });
    } else {
      enDiv.textContent = item.en;
    }

    var nativeDiv = document.createElement('div');
    nativeDiv.className = 'trans-native';
    nativeDiv.textContent = currentLang === 'zh' ? item.zh : item.es;

    block.appendChild(enDiv);
    block.appendChild(nativeDiv);
    container.appendChild(block);
  });

  setTimeout(function() { container.scrollTop = container.scrollHeight; }, 50);
}

/* ════════ Save Word ════════ */
function saveWord(span, word) {
  if (span.classList.contains('saved')) return;
  document.querySelectorAll('.word[data-word="' + word + '"]').forEach(function(el) {
    el.classList.add('saved');
  });

  var trans = wordMap[word][currentLang];
  if (!savedWords.some(function(w) { return w.word === word; })) {
    savedWords.push({ word: word, trans: trans });
  }

  showToast(currentLang === 'zh' ? 'Guardado: ' + trans : 'Guardado: ' + trans);
}

/* ════════ Unsave Word ════════ */
function unsaveWord(word) {
  savedWords = savedWords.filter(function(w) { return w.word !== word; });
  document.querySelectorAll('.word[data-word="' + word + '"]').forEach(function(el) {
    el.classList.remove('saved');
  });
  buildSummary();
  showToast('Eliminado: ' + word);
}

/* ════════ Build Summary (S4) ════════ */
function buildSummary() {
  var list = document.getElementById('s4-word-list');
  if (!list) return;
  list.innerHTML = '';
  document.getElementById('saved-count').textContent = savedWords.length;

  if (savedWords.length === 0) {
    list.innerHTML = '<div style="text-align:center;padding:32px 0;color:#94a3b8;font-size:14px;">' +
      (currentLang === 'zh' ? 'No se guardaron palabras esta vez' : 'No se guardaron palabras') + '</div>';
    return;
  }

  savedWords.forEach(function(item) {
    var row = document.createElement('div');
    row.className = 'word-row';
    row.style.cursor = 'pointer';
    row.title = 'Toca para quitar';
    row.innerHTML = '<div class="word-dot"></div>' +
      '<div class="word-en">' + item.word + '</div>' +
      '<div class="word-native">' + item.trans + '</div>' +
      '<span class="material-icons-round" style="font-size:16px;color:#cbd5e1;">close</span>';
    row.onclick = function() { unsaveWord(item.word); };
    list.appendChild(row);
  });
}
