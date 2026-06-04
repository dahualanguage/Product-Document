/* ════════════════════════════════════════════════
   WORD BANK — S7
   Desktop: split-panel (detail card + word list + pagination)
   Mobile:  scrollable card / list view + action bar
   依賴：data.js, app.js
   ════════════════════════════════════════════════ */

/* ── 狀態 ── */
var wbFilter = 'all';
var wbSortNewest = true;
var wbFilteredWords = [];

/* Desktop 狀態 */
var wbCurrentPage = 1;
var wbPerPage = 10;
var wbSelectedWord = null;
var wbTranslateOn = false;

/* Mobile 狀態 */
var wbViewMode = 'card';
var wbDeleting = false;
var wbSelectMode = false;
var wbSelected = {};
var pracTypes = { spelling: true, mirroring: false };

/* ════════ Shared helpers ════════ */
function getWordFreq() {
  var freq = {};
  historyData.forEach(function(session) {
    session.words.forEach(function(w) { freq[w] = (freq[w] || 0) + 1; });
  });
  return freq;
}

function getAllUniqueWords() {
  var seen = {};
  var words = [];
  historyData.forEach(function(session) {
    session.words.forEach(function(w) {
      if (!seen[w]) { seen[w] = true; words.push(w); }
    });
  });
  return words;
}

/* ════════ Shared: build word card element ════════ */
function buildWordCardEl(w, lang) {
  var native = (wordMap[w] && wordMap[w][lang]) || '—';
  var d = wordDetails[w] || {};
  var senses = d.senses || [];
  var isMulti = senses.length > 1;

  var card = document.createElement('div');
  card.className = 'wd-card';

  var headHtml =
    '<div class="wd-head">' +
      '<div>' +
        '<div class="wd-en">' + w + '</div>' +
        '<div class="wd-zh">' + native + '</div>' +
        (d.pron ? '<div class="wd-pron">' + d.pron + '</div>' : '') +
      '</div>' +
      '<button class="wd-play" onclick="event.stopPropagation();showToast(\'🔊 ' + w + '\')" title="發音">' +
        '<span class="material-icons-round">volume_up</span>' +
      '</button>' +
    '</div>';

  var sectionsHtml = senses.map(function(s) {
    var defText = s.def || '—';
    var defTl = lang === 'zh' ? (s.defZh || '') : (s.defEs || '');
    var exHtml = (s.example || '').replace(/<b>/g, '<span class="wd-highlight">').replace(/<\/b>/g, '</span>');
    var exTl = lang === 'zh' ? (s.exZh || '') : (s.exEs || '');
    var imgSrc = s.image || (!isMulti && d.image) || '';
    var imgHtml = imgSrc ? '<img class="wd-pos-image" src="' + imgSrc + '" alt="' + w + '">' : '';
    return '<div class="wd-pos-section">' +
      (s.pos ? '<span class="wd-pos-badge">' + s.pos + '</span>' : '') +
      imgHtml +
      (!imgSrc ? '<div class="wd-text">' + defText + '</div>' +
        (defTl ? '<p class="wd-tl-line">' + defTl + '</p>' : '') : '') +
      (exHtml ? '<div class="wd-example-wrap">' +
        '<div class="wd-label">Example</div>' +
        '<div class="wd-example">' + exHtml + '</div>' +
        (exTl ? '<p class="wd-tl-line">' + exTl + '</p>' : '') +
      '</div>' : '') +
    '</div>';
  }).join('');

  card.innerHTML = headHtml + sectionsHtml;
  return card;
}

/* ════════ Entry point ════════ */
function goToWordBank() {
  showHomeBar();
  updateHeaderTitle('單字庫');
  hideHeaderBack();
  currentBackAction = null;
  wbFilter = 'all';
  wbCurrentPage = 1;
  wbSelectedWord = null;
  wbTranslateOn = false;
  buildWordBank();
  showScreen('screen-7');
}

/* ════════ Build (dispatches to desktop or mobile) ════════ */
function buildWordBank() {
  var allWords = getAllUniqueWords();
  var freq = getWordFreq();
  var filtered = allWords.slice();

  if (wbFilter === 'freq') {
    filtered.sort(function(a, b) { return (freq[b] || 0) - (freq[a] || 0); });
  }
  if (!wbSortNewest) filtered.reverse();

  wbFilteredWords = filtered;

  if (isDesktop()) {
    buildWordBankDesktop(filtered, freq);
  } else {
    buildWordBankMobile(filtered, freq);
  }
}

function filterWb(filter) {
  wbFilter = filter;
  wbCurrentPage = 1;
  wbSelectedWord = null;
  buildWordBank();
}

function toggleWbSort() {
  wbSortNewest = !wbSortNewest;
  buildWordBank();
}


/* ════════════════════════════════════════
   DESKTOP — Split-panel rendering
   ════════════════════════════════════════ */

function buildWordBankDesktop(filtered, freq) {
  var allWords = getAllUniqueWords();
  var sortLabel = wbSortNewest ? '最新↓' : '最舊↓';

  var filters = document.getElementById('wb-filters');
  if (filters) {
    filters.innerHTML =
      '<button class="wb-filter-chip' + (wbFilter === 'all' ? ' active' : '') + '" onclick="filterWb(\'all\')">All <span class="wb-pill-count">' + allWords.length + '</span></button>' +
      '<button class="wb-filter-chip' + (wbFilter === 'freq' ? ' active' : '') + '" onclick="filterWb(\'freq\')">最常保存</button>' +
      '<button class="wb-filter-chip wb-sort-chip" onclick="toggleWbSort()" style="margin-left:auto;background:none;color:#94a3b8;">' + sortLabel + '</button>';
  }

  var countEl = document.getElementById('wb-wl-count');
  if (countEl) countEl.textContent = filtered.length;

  renderWbWordList();
}

function renderWbWordList() {
  var filtered = wbFilteredWords;
  var totalPages = Math.ceil(filtered.length / wbPerPage);
  if (wbCurrentPage > totalPages) wbCurrentPage = totalPages || 1;

  var start = (wbCurrentPage - 1) * wbPerPage;
  var end = Math.min(start + wbPerPage, filtered.length);
  var pageWords = filtered.slice(start, end);

  if (!wbSelectedWord || pageWords.indexOf(wbSelectedWord) === -1) {
    wbSelectedWord = pageWords.length ? pageWords[0] : null;
  }

  var container = document.getElementById('wb-wl-items');
  if (!container) return;
  container.innerHTML = '';

  if (!pageWords.length) {
    container.innerHTML = '<div style="text-align:center;padding:32px 0;color:#94a3b8;font-size:13px;">沒有符合的單字</div>';
    var detailCard = document.getElementById('wb-detail-card');
    if (detailCard) detailCard.innerHTML = '';
    renderWbPagination(totalPages);
    return;
  }

  var freq = getWordFreq();
  pageWords.forEach(function(w) {
    var d = wordDetails[w] || {};
    var senses = d.senses || [];
    var defText = senses.length ? senses[0].def : '';
    var defPreview = defText.length > 40 ? defText.substring(0, 40) + '...' : defText;
    var freqBadge = (wbFilter === 'freq' && freq[w] >= 3) ? '<span class="wb-wl-freq">' + freq[w] + '×</span>' : '';

    var item = document.createElement('div');
    item.className = 'wb-wl-item' + (w === wbSelectedWord ? ' selected' : '');
    item.innerHTML =
      '<div>' +
        '<div class="wb-wl-word">' + w + '</div>' +
        '<div class="wb-wl-def">' + defPreview + '</div>' +
      '</div>' +
      freqBadge;
    item.onclick = function() { selectWbWord(w); };
    container.appendChild(item);
  });

  renderWbDetailCard(wbSelectedWord);
  renderWbPagination(totalPages);
}

function selectWbWord(word) {
  wbSelectedWord = word;
  document.querySelectorAll('.wb-wl-item').forEach(function(el) {
    var itemWord = el.querySelector('.wb-wl-word').textContent;
    el.classList.toggle('selected', itemWord === word);
  });
  renderWbDetailCard(word);
}

function renderWbDetailCard(word) {
  var card = document.getElementById('wb-detail-card');
  if (!card || !word) { if (card) card.innerHTML = ''; return; }

  var d = wordDetails[word] || {};
  var senses = d.senses || [];
  var native = (wordMap[word] && wordMap[word]['zh']) || '';
  var isMulti = senses.length > 1;
  var tlShowClass = wbTranslateOn ? ' show' : '';

  var html = '<div class="wb-card-header">';
  html += '<div class="wb-card-word-row">';
  html += '<span class="wb-card-word">' + word + '</span>';
  html += '<span class="wb-card-play" onclick="showToast(\'🔊 ' + word + '\')" title="播放"><svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8.5v7a4.49 4.49 0 0 0 2.5-3.5zM14 3.23v2.06a6.51 6.51 0 0 1 0 13.42v2.06A8.51 8.51 0 0 0 14 3.23z"/></svg></span>';
  html += '<span class="wb-card-tl' + tlShowClass + '">' + native + '</span>';
  html += '<div class="wb-card-translate-toggle">';
  html += '<span class="wb-card-translate-label">Translate</span>';
  html += '<div class="wb-card-toggle-switch' + (wbTranslateOn ? ' on' : '') + '" onclick="toggleWbTranslate()" title="Toggle translation"></div>';
  html += '</div></div>';

  if (!isMulti && senses.length) {
    html += '<div class="wb-card-pos-row"><span class="wb-card-pos-badge">' + (senses[0].pos || 'noun') + '</span></div>';
  }
  html += '</div><div class="wb-card-body">';

  if (isMulti) {
    senses.forEach(function(s) {
      var defTl = s.defZh || '';
      var exTl = s.exZh || '';
      var imgSrc = s.image || '';
      var exHtml = (s.example || '').replace(/<b>/g, '<mark>').replace(/<\/b>/g, '</mark>');
      html += '<div class="wb-card-pos-section">';
      html += '<div class="wb-card-pos-section-header"><span class="wb-card-pos-badge">' + (s.pos || '') + '</span></div>';
      if (imgSrc) html += '<img class="wb-card-image" src="' + imgSrc + '" alt="' + word + '">';
      html += '<p class="wb-card-def">' + (s.def || '') + '</p>';
      if (defTl) html += '<p class="wb-card-tl-line' + tlShowClass + '">' + defTl + '</p>';
      if (exHtml) {
        html += '<div style="margin-top:10px"><div class="wb-card-example-label">Example</div>';
        html += '<div class="wb-card-example-text">' + exHtml + '</div>';
        if (exTl) html += '<p class="wb-card-tl-line' + tlShowClass + '">' + exTl + '</p>';
        html += '</div>';
      }
      html += '</div>';
    });
  } else if (senses.length) {
    var s = senses[0];
    var imgSrc = s.image || d.image || '';
    var exHtml = (s.example || '').replace(/<b>/g, '<mark>').replace(/<\/b>/g, '</mark>');
    if (imgSrc) html += '<img class="wb-card-image" src="' + imgSrc + '" alt="' + word + '">';
    html += '<p class="wb-card-def">' + (s.def || '') + '</p>';
    if (s.defZh) html += '<p class="wb-card-tl-line' + tlShowClass + '">' + s.defZh + '</p>';
    if (exHtml) {
      html += '<div><div class="wb-card-example-label">Example</div>';
      html += '<div class="wb-card-example-text">' + exHtml + '</div>';
      if (s.exZh) html += '<p class="wb-card-tl-line' + tlShowClass + '">' + s.exZh + '</p>';
      html += '</div>';
    }
  }

  html += '</div>';
  card.innerHTML = html;
}

function toggleWbTranslate() {
  wbTranslateOn = !wbTranslateOn;
  var toggle = document.querySelector('.wb-card-toggle-switch');
  if (toggle) toggle.classList.toggle('on', wbTranslateOn);
  var tlWord = document.querySelector('.wb-card-tl');
  if (tlWord) tlWord.classList.toggle('show', wbTranslateOn);
  document.querySelectorAll('.wb-card-tl-line').forEach(function(el) {
    el.classList.toggle('show', wbTranslateOn);
  });
}

function renderWbPagination(totalPages) {
  var container = document.getElementById('wb-pagination');
  if (!container) return;
  if (totalPages < 1) { container.innerHTML = ''; return; }
  var html = '<button class="wb-page-btn wb-page-arrow" onclick="wbGoPage(\'prev\')" ' + (wbCurrentPage === 1 ? 'disabled' : '') + '>&lsaquo;</button>';
  for (var p = 1; p <= totalPages; p++) {
    html += '<button class="wb-page-btn' + (p === wbCurrentPage ? ' active' : '') + '" onclick="wbGoPage(' + p + ')">' + p + '</button>';
  }
  html += '<button class="wb-page-btn wb-page-arrow" onclick="wbGoPage(\'next\')" ' + (wbCurrentPage === totalPages ? 'disabled' : '') + '>&rsaquo;</button>';
  container.innerHTML = html;
}

function wbGoPage(p) {
  var totalPages = Math.ceil(wbFilteredWords.length / wbPerPage);
  if (p === 'prev') { if (wbCurrentPage > 1) wbCurrentPage--; }
  else if (p === 'next') { if (wbCurrentPage < totalPages) wbCurrentPage++; }
  else wbCurrentPage = parseInt(p);
  wbSelectedWord = null;
  renderWbWordList();
}


/* ════════════════════════════════════════
   MOBILE — Scrollable card/list rendering
   ════════════════════════════════════════ */

function buildWordBankMobile(filtered, freq) {
  var allWords = getAllUniqueWords();

  /* Filters */
  var filters = document.getElementById('wb-filters-mobile');
  if (filters) {
    filters.innerHTML =
      '<button class="wb-filter-chip' + (wbFilter === 'all' ? ' active' : '') + '" onclick="filterWb(\'all\')">全部</button>' +
      '<button class="wb-filter-chip' + (wbFilter === 'freq' ? ' active' : '') + '" onclick="filterWb(\'freq\')">最常保存</button>';
  }

  /* Stats */
  var stats = document.getElementById('wb-stats-mobile');
  if (stats) stats.innerHTML = '詞彙數：<span>' + filtered.length + '</span>';

  /* Sort link */
  var sortLink = document.getElementById('wb-sort-link-mobile');
  if (sortLink) sortLink.textContent = wbSortNewest ? '最新↓' : '最舊↓';

  renderWbMobileCards(filtered, freq);
}

function renderWbMobileCards(filtered, freq) {
  var scroll = document.getElementById('wb-scroll-mobile');
  if (!scroll) return;
  scroll.innerHTML = '';
  scroll.classList.toggle('wb-deleting', wbDeleting);

  if (!filtered.length) {
    scroll.innerHTML = '<div class="wd-empty"><span class="material-icons-round">bookmark_border</span>沒有符合的單字</div>';
    return;
  }

  var showFreq = (wbFilter === 'freq');

  if (wbViewMode === 'list') {
    var wrap = document.createElement('div');
    wrap.className = 'wd-list-wrap';
    filtered.forEach(function(w) {
      var native = (wordMap[w] && wordMap[w]['zh']) || '';
      var freqBadge = (showFreq && freq[w] >= 3) ? '<span class="wd-list-freq">' + freq[w] + '×</span>' : '';
      var item = document.createElement('div');
      item.className = 'wd-list-item';
      item.innerHTML =
        '<div class="wd-list-dot"></div>' +
        '<div class="wd-list-en">' + w + '</div>' +
        freqBadge +
        '<div class="wd-list-zh">' + native + '</div>' +
        '<button class="wd-list-play" onclick="event.stopPropagation();showToast(\'🔊 ' + w + '\')" title="播放">' +
          '<span class="material-icons-round">volume_up</span>' +
        '</button>';
      wrap.appendChild(item);
    });
    scroll.appendChild(wrap);
  } else {
    filtered.forEach(function(w) {
      var card = buildWordCardEl(w, 'zh');
      card.style.position = 'relative';

      if (showFreq && freq[w] >= 3) {
        var badge = document.createElement('div');
        badge.className = 'wd-freq';
        badge.textContent = freq[w] + '×';
        var play = card.querySelector('.wd-play');
        if (play) play.parentNode.insertBefore(badge, play);
      }

      var del = document.createElement('button');
      del.className = 'wd-card-del';
      del.title = '刪除';
      del.innerHTML = '<span class="material-icons-round">close</span>';
      del.onclick = function(e) { e.stopPropagation(); deleteWbWord(w); };
      card.appendChild(del);

      scroll.appendChild(card);
    });
  }
}

function setWbView(mode) {
  wbViewMode = mode;
  document.querySelectorAll('#screen-7 .wb-view-btn').forEach(function(el) {
    el.classList.toggle('active', el.dataset.view === mode);
  });
  renderWbMobileCards(wbFilteredWords, getWordFreq());
}

function deleteWbWord(word) {
  historyData.forEach(function(session) {
    session.words = session.words.filter(function(w) { return w !== word; });
  });
  showToast('已刪除：' + word);
  buildWordBank();
}
