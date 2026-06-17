/* ════════════════════════════════════════════════
   HISTORY — S5 Calendar + Session List, S6 Detail
   Desktop: monthly grid + split detail (transcript | words)
   Mobile:  week strip + session list → S6 separate screen
   AI Summary: shown above transcript, translation controlled by toggle
   依賴：data.js, app.js, wordbank.js (buildWordCardEl)
   ════════════════════════════════════════════════ */

/* ── 狀態 ── */
var calYear = 2026;
var calMonth = 4; /* 0-indexed: 4 = May */
var calSelectedDate = '2026-05-28';
var histActiveSession = null;
var detailSession = null;
var showTranslation = false;

/* ════════ Entry ════════ */
function goToHistory() {
  showHomeBar();
  updateHeaderTitle('Historial');
  hideHeaderBack();
  currentBackAction = null;

  histActiveSession = historyData.length ? historyData[0] : null;
  calSelectedDate = histActiveSession ? histActiveSession.date : '2026-05-28';
  var d = new Date(calSelectedDate);
  calYear = d.getFullYear();
  calMonth = d.getMonth();

  buildCalendar();
  showScreen('screen-5');
}

/* ════════ Helpers ════════ */
function getSessionDates() {
  var dates = {};
  historyData.forEach(function(s) { dates[s.date] = true; });
  return dates;
}

function padDate(n) { return String(n).padStart(2, '0'); }

/* ════════ Calendar (render both for RWD switching) ════════ */
function buildCalendar() {
  buildCalendarDesktop();
  buildCalendarMobile();
}

/* ════════════════════════════════════════
   DESKTOP — Monthly Calendar
   ════════════════════════════════════════ */
function buildCalendarDesktop() {
  var wrap = document.getElementById('cal-wrap-desktop');
  if (!wrap) return;
  var sessionDates = getSessionDates();
  var months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  var dayLabels = ['D','L','M','X','J','V','S'];

  var firstDay = new Date(calYear, calMonth, 1).getDay();
  var daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  var today = new Date();
  var todayStr = today.getFullYear() + '-' + padDate(today.getMonth() + 1) + '-' + padDate(today.getDate());

  var html = '<div class="cal-header">' +
    '<button class="cal-nav" onclick="calPrev()"><span class="material-icons-round">chevron_left</span></button>' +
    '<div class="cal-title">' + calYear + ' de ' + months[calMonth] + '</div>' +
    '<button class="cal-nav" onclick="calNext()"><span class="material-icons-round">chevron_right</span></button>' +
  '</div>';

  html += '<div class="cal-days">';
  dayLabels.forEach(function(d) { html += '<div class="cal-day-label">' + d + '</div>'; });
  html += '</div><div class="cal-grid">';
  for (var i = 0; i < firstDay; i++) html += '<button class="cal-cell empty"></button>';
  for (var d = 1; d <= daysInMonth; d++) {
    var dateStr = calYear + '-' + padDate(calMonth + 1) + '-' + padDate(d);
    var cls = 'cal-cell';
    if (dateStr === todayStr) cls += ' today';
    if (dateStr === calSelectedDate) cls += ' selected';
    if (sessionDates[dateStr]) cls += ' has-data';
    html += '<button class="' + cls + '" onclick="selectCalDate(\'' + dateStr + '\')">' + d + '</button>';
  }
  html += '</div>';
  wrap.innerHTML = html;

  showDaySessions(calSelectedDate);
}

/* ════════════════════════════════════════
   MOBILE — Week Strip Calendar
   ════════════════════════════════════════ */
function buildCalendarMobile() {
  var sessionDates = getSessionDates();
  var sel = new Date(calSelectedDate);
  var dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  /* Date header */
  var header = document.getElementById('cal-date-header');
  if (header) {
    header.innerHTML =
      '<div class="cal-date-left">' +
        '<div class="cal-date-num">' + sel.getDate() + '</div>' +
        '<div class="cal-date-info">' +
          '<div class="cal-date-day">' + dayNames[sel.getDay()] + '</div>' +
          '<div class="cal-date-month">' + monthNames[sel.getMonth()] + ' ' + sel.getFullYear() + '</div>' +
        '</div>' +
      '</div>' +
      '<button class="cal-today-btn" onclick="goToToday()">Today</button>';
  }

  /* Week strip */
  var strip = document.getElementById('cal-week-strip');
  if (!strip) return;
  var dayOfWeek = sel.getDay();
  var weekStart = new Date(sel);
  weekStart.setDate(weekStart.getDate() - dayOfWeek);

  var stripHtml = '<button class="cal-week-nav" onclick="calPrev()"><span class="material-icons-round">chevron_left</span></button>';
  stripHtml += '<div class="cal-week-days">';
  for (var i = 0; i < 7; i++) {
    var d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    var dateStr = d.getFullYear() + '-' + padDate(d.getMonth() + 1) + '-' + padDate(d.getDate());
    var cls = 'cal-week-item';
    if (dateStr === calSelectedDate) cls += ' selected';
    if (sessionDates[dateStr]) cls += ' has-data';
    stripHtml += '<button class="' + cls + '" onclick="selectCalDate(\'' + dateStr + '\')">' +
      '<span class="cal-week-label">' + dayNames[d.getDay()].charAt(0) + '</span>' +
      '<div class="cal-week-num">' + d.getDate() + '</div>' +
    '</button>';
  }
  stripHtml += '</div>';
  stripHtml += '<button class="cal-week-nav" onclick="calNext()"><span class="material-icons-round">chevron_right</span></button>';
  strip.innerHTML = stripHtml;

  showDaySessions(calSelectedDate);
}

/* ════════ Calendar navigation ════════ */
function selectCalDate(dateStr) {
  calSelectedDate = dateStr;
  var d = new Date(dateStr);
  calYear = d.getFullYear();
  calMonth = d.getMonth();
  buildCalendar();
}

function goToToday() {
  var now = new Date();
  calSelectedDate = now.getFullYear() + '-' + padDate(now.getMonth() + 1) + '-' + padDate(now.getDate());
  calYear = now.getFullYear();
  calMonth = now.getMonth();
  buildCalendar();
}

function calPrev() {
  if (isDesktop()) {
    calMonth--;
    if (calMonth < 0) { calMonth = 11; calYear--; }
  } else {
    var d = new Date(calSelectedDate);
    d.setDate(d.getDate() - 7);
    calSelectedDate = d.getFullYear() + '-' + padDate(d.getMonth() + 1) + '-' + padDate(d.getDate());
    calYear = d.getFullYear();
    calMonth = d.getMonth();
  }
  buildCalendar();
}

function calNext() {
  if (isDesktop()) {
    calMonth++;
    if (calMonth > 11) { calMonth = 0; calYear++; }
  } else {
    var d = new Date(calSelectedDate);
    d.setDate(d.getDate() + 7);
    calSelectedDate = d.getFullYear() + '-' + padDate(d.getMonth() + 1) + '-' + padDate(d.getDate());
    calYear = d.getFullYear();
    calMonth = d.getMonth();
  }
  buildCalendar();
}

/* ════════ Session list ════════ */
function showDaySessions(dateStr) {
  var sessions = historyData.filter(function(s) { return s.date === dateStr; });
  renderDesktopSessions(dateStr, sessions);
  renderMobileSessions(dateStr, sessions);
}

function renderDesktopSessions(dateStr, sessions) {
  var section = document.getElementById('hist-day-section-desktop');
  if (!section) return;

  var parts = dateStr.split('-');
  var label = parseInt(parts[1]) + '/' + parseInt(parts[2]);
  var html = '<div class="hist-day-label">' + label + ' — <span>' + sessions.length + '</span> sesiones</div>';

  if (!sessions.length) {
    html += '<div class="hist-day-empty">Sin grabaciones este día</div>';
    section.innerHTML = html;
    return;
  }

  section.innerHTML = html;
  var list = document.createElement('div');
  list.className = 'hist-session-list';

  sessions.forEach(function(session, idx) {
    var langDisplay = session.lang === 'zh' ? 'ZH' : 'ES';
    var card = document.createElement('div');
    card.className = 'hist-s-card';
    if (histActiveSession === session || (!histActiveSession && idx === 0)) {
      card.classList.add('active');
      setTimeout(function() { showHistDetailDesktop(session); }, 0);
    }
    card.onclick = function() {
      histActiveSession = session;
      document.querySelectorAll('.hist-s-card').forEach(function(el) { el.classList.remove('active'); });
      card.classList.add('active');
      showHistDetailDesktop(session);
    };
    card.innerHTML =
      '<div class="hist-s-card-top">' +
        '<div class="hist-s-name">' + session.name + '</div>' +
        '<div class="hist-lang-badge">' + langDisplay + '</div>' +
      '</div>' +
      '<div class="hist-s-meta">' +
        '<div class="hist-s-meta-item"><span class="material-icons-round">access_time</span>' + session.time + '</div>' +
        '<div class="hist-s-meta-item"><span class="material-icons-round">timer</span>' + session.duration + '</div>' +
        '<div class="hist-s-meta-item"><span class="material-icons-round">bookmark</span>' + session.words.length + '</div>' +
      '</div>';
    list.appendChild(card);
  });
  section.appendChild(list);

  if (!histActiveSession && sessions.length) histActiveSession = sessions[0];
}

function renderMobileSessions(dateStr, sessions) {
  var section = document.getElementById('hist-day-section-mobile');
  if (!section) return;

  if (!sessions.length) {
    section.innerHTML = '<div class="hist-day-empty">Sin grabaciones este día</div>';
    return;
  }

  var list = document.createElement('div');
  list.className = 'hist-session-list';

  sessions.forEach(function(session) {
    var wordCount = session.words.length;
    var langDisplay = session.lang === 'zh' ? 'ZH' : 'ES';

    var chipsHtml = session.words.slice(0, 3).map(function(w) {
      return '<span class="hist-preview-chip">' + w + '</span>';
    }).join('');
    if (wordCount > 3) chipsHtml += '<span class="hist-more-pill">+' + (wordCount - 3) + '</span>';

    var card = document.createElement('div');
    card.className = 'hist-s-card';
    card.onclick = function() { goToSessionDetail(session); };
    card.innerHTML =
      '<div class="hist-s-card-top">' +
        '<div class="hist-s-name">' + session.name + '</div>' +
        '<div class="hist-lang-badge">' + langDisplay + '</div>' +
      '</div>' +
      '<div class="hist-s-meta">' +
        '<div class="hist-s-meta-item"><span class="material-icons-round">access_time</span>' + session.time + '</div>' +
        '<div class="hist-s-meta-item"><span class="material-icons-round">timer</span>' + session.duration + '</div>' +
        '<div class="hist-s-meta-item"><span class="material-icons-round">bookmark</span>' + wordCount + ' palabras</div>' +
      '</div>' +
      (chipsHtml ? '<div class="hist-s-chips">' + chipsHtml + '</div>' : '');
    list.appendChild(card);
  });

  section.innerHTML = '';
  section.appendChild(list);
}


/* ════════════════════════════════════════
   DESKTOP — Detail in right panel
   ════════════════════════════════════════ */
function showHistDetailDesktop(session) {
  var right = document.getElementById('hist-right');
  if (!right) return;
  detailSession = session;
  showTranslation = false;
  var langDisplay = session.lang === 'zh' ? 'ZH' : 'ES';

  right.innerHTML =
    '<div class="detail-meta-card">' +
      '<div class="detail-session-name">' + session.name + '</div>' +
      '<div class="detail-meta-row">' +
        '<div class="detail-meta-pill"><span class="material-icons-round">schedule</span> ' + session.duration + '</div>' +
        '<div class="detail-meta-pill"><span class="material-icons-round">bookmark</span> ' + session.words.length + ' palabras</div>' +
        '<div class="detail-lang-dot">' + langDisplay + '</div>' +
        '<div style="margin-left:auto;display:flex;align-items:center;gap:8px;">' +
          '<span style="font-size:12px;font-weight:500;color:#64748b;">Traducir</span>' +
          '<button class="toggle-switch" id="hist-trans-toggle" onclick="toggleHistTranslation()"></button>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="hist-split-panels">' +
      '<div class="hist-panel-left">' +
        '<div class="hist-panel-label">Transcripción</div>' +
        '<div class="detail-scroll" id="hist-detail-scroll"></div>' +
      '</div>' +
      '<div class="hist-panel-right">' +
        '<div class="hist-panel-label">Palabras guardadas</div>' +
        '<div class="words-scroll" id="hist-words-scroll"></div>' +
      '</div>' +
    '</div>';

  buildHistTranscript('hist-detail-scroll', session);
  buildHistWords('hist-words-scroll', session);
}

function toggleHistTranslation() {
  showTranslation = !showTranslation;
  var toggle = document.getElementById('hist-trans-toggle');
  if (toggle) toggle.classList.toggle('on', showTranslation);
  /* 控制左側Transcripción + Resumen IA + 右側單字卡 */
  document.querySelectorAll('#hist-right .trans-native').forEach(function(el) {
    el.classList.toggle('hidden', !showTranslation);
  });
  /* 右側單字卡的 show-tl class */
  var wordsScroll = document.getElementById('hist-words-scroll');
  if (wordsScroll) wordsScroll.classList.toggle('show-tl', showTranslation);
}


/* ════════════════════════════════════════
   MOBILE — S6 Detail (separate screen)
   ════════════════════════════════════════ */
function goToSessionDetail(session) {
  showSubBar('Transcripción');
  currentBackAction = function() {
    showHomeBar();
    updateHeaderTitle('Historial');
    currentBackAction = null;
    showScreen('screen-5');
  };
  buildSessionDetail(session);
  showScreen('screen-6');
}

function buildSessionDetail(session) {
  detailSession = session;
  showTranslation = false;
  var langDisplay = session.lang === 'zh' ? 'ZH' : 'ES';

  document.getElementById('detail-meta').innerHTML =
    '<div class="detail-session-name">' + session.name + '</div>' +
    '<div class="detail-meta-row">' +
      '<div class="detail-meta-pill"><span class="material-icons-round">schedule</span>' + session.duration + '</div>' +
      '<div class="detail-meta-pill"><span class="material-icons-round">bookmark</span>' + session.words.length + ' palabras</div>' +
      '<div class="detail-lang-dot">' + langDisplay + '</div>' +
    '</div>';

  switchDetailTab('transcript');
  document.getElementById('trans-toggle-s6').classList.remove('on');

  buildHistTranscript('detail-scroll', session);
  buildDetailWords('words-scroll-s6', session);
}

function switchDetailTab(tab) {
  document.querySelectorAll('.detail-tab').forEach(function(el) {
    el.classList.toggle('active', el.dataset.tab === tab);
  });
  document.getElementById('panel-transcript').classList.toggle('active', tab === 'transcript');
  document.getElementById('panel-words').classList.toggle('active', tab === 'words');
}

function toggleTranslationS6() {
  showTranslation = !showTranslation;
  document.getElementById('trans-toggle-s6').classList.toggle('on', showTranslation);
  document.querySelectorAll('#detail-scroll .trans-native').forEach(function(el) {
    el.classList.toggle('hidden', !showTranslation);
  });
}


/* ════════════════════════════════════════
   SHARED — Build transcript with AI summary
   ════════════════════════════════════════ */
function buildHistTranscript(scrollId, session) {
  var scroll = document.getElementById(scrollId);
  if (!scroll) return;
  scroll.innerHTML = '';

  /* ── AI Summary ── */
  if (session.summary) {
    var summaryEn = session.summary.en || '';
    var summaryNative = session.summary[session.lang] || '';

    var card = document.createElement('div');
    card.className = 'ai-summary-card';
    card.innerHTML =
      '<div class="ai-summary-header">' +
        '<div class="ai-summary-badge"><span class="material-icons-round">auto_awesome</span> Resumen IA</div>' +
      '</div>' +
      '<div class="ai-summary-text">' + summaryEn + '</div>' +
      '<div class="ai-summary-text trans-native hidden" style="color:#64748b; margin-top:8px; padding-left:12px; border-left:2px solid #d1fae5;">' + summaryNative + '</div>';
    scroll.appendChild(card);
  }

  /* ── Transcript ── */
  transcriptData.forEach(function(item) {
    var block = document.createElement('div');
    block.className = 'trans-block';

    var enDiv = document.createElement('div');
    enDiv.className = 'trans-en';
    item.en.split(/(\s+)/).forEach(function(tok) {
      var clean = tok.trim().replace(/[.,!?']/g, '').toLowerCase();
      if (session.words.indexOf(clean) !== -1) {
        var span = document.createElement('span');
        span.className = 'word saved';
        span.textContent = tok;
        enDiv.appendChild(span);
      } else {
        enDiv.appendChild(document.createTextNode(tok));
      }
    });

    var nativeDiv = document.createElement('div');
    nativeDiv.className = 'trans-native hidden';
    nativeDiv.textContent = session.lang === 'zh' ? item.zh : item.es;

    block.appendChild(enDiv);
    block.appendChild(nativeDiv);
    scroll.appendChild(block);
  });
}

function buildHistWords(scrollId, session) {
  var scroll = document.getElementById(scrollId);
  if (!scroll) return;
  scroll.innerHTML = '';
  if (!session.words.length) {
    scroll.innerHTML = '<div style="text-align:center;padding:32px;color:#94a3b8;font-size:13px;">No se guardaron palabras esta vez</div>';
    return;
  }
  session.words.forEach(function(w) {
    scroll.appendChild(buildWordCardEl(w, session.lang));
  });
}

function buildDetailWords(scrollId, session) {
  var scroll = document.getElementById(scrollId);
  if (!scroll) return;
  scroll.innerHTML = '';
  if (!session.words.length) {
    scroll.innerHTML = '<div class="wd-empty"><span class="material-icons-round">bookmark_border</span>No se guardaron palabras esta vez</div>';
    return;
  }
  session.words.forEach(function(w) {
    scroll.appendChild(buildWordCardEl(w, session.lang));
  });
}
