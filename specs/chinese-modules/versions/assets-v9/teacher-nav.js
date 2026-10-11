/* ============================================================================
   teacher-nav.js — one definition of the teacher sidebar, injected into every
   page. Mirrors the CLASS_TEACHER menu in dahua-dash (MENU_BY_ROLE), plus the
   Dashboard entry the real app does not have yet and the new Planning entry.

   Usage:  <aside class="side" id="side" data-current="projects"></aside>
           <script src="assets/teacher-nav.js"></script>
   The script also wires the ≤1024px drawer (toggle + scrim + Escape).
   ============================================================================ */
(function () {
  'use strict';

  var NAV = [
    { group: null, items: [
      { k: 'dashboard',   t: 'Dashboard',      i: 'space_dashboard',  h: 'redesign-v9-dashboard.html' },
    ]},
    { group: 'Content', items: [
      { k: 'projects',    t: 'Projects',       i: 'folder',           h: 'redesign-v9-projects.html' },
      { k: 'banks',       t: 'Question Banks', i: 'quiz',             h: 'redesign-v9-question-banks.html' },
    ]},
    { group: 'Practice', items: [
      { k: 'planning',    t: 'Planning',       i: 'auto_awesome',     h: 'redesign-v9-planning.html' },
      { k: 'practice',    t: 'Practice List',  i: 'assignment',       h: 'redesign-v9-practice.html' },
      { k: 'wordgame',    t: 'Word Game',      i: 'sports_esports',   h: 'redesign-v9-wordgame.html' },
    ]},
    { group: 'Overview', items: [
      { k: 'program',     t: 'Program',        i: 'groups',           h: 'redesign-v9-program.html' },
      { k: 'classes',     t: 'Classes',        i: 'school',           h: 'redesign-v9-classes.html' },
      { k: 'leaderboard', t: 'Leaderboard',    i: 'emoji_events',     h: 'redesign-v9-leaderboard.html' },
      { k: 'students',    t: 'Students',       i: 'people',           h: 'redesign-v9-students.html' },
    ]},
  ];

  var BRAND =
    '<div class="brand">' +
      '<div class="logo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" ' +
      'stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/>' +
      '<path d="M6 12v5c3 3 9 3 12 0v-5"/></svg></div>' +
      '<div class="bt"><b>DAHUA AI</b></div>' +
    '</div>';

  var side = document.getElementById('side');
  if (!side) return;
  var current = side.getAttribute('data-current') || '';

  var html = BRAND;
  NAV.forEach(function (sec, si) {
    if (sec.group) html += '<div class="nav-grp">' + sec.group + '</div>';
    html += '<nav class="nav"' + (si === 0 ? ' style="margin-top:4px"' : '') + '>';
    sec.items.forEach(function (it) {
      var on = it.k === current;
      html += '<a class="' + (on ? 'on' : '') + '"' + (on ? '' : ' href="' + it.h + '"') +
        ' data-navkey="' + it.k + '">' +
        '<span class="material-icons-round">' + it.i + '</span> ' + it.t + '</a>';
    });
    html += '</nav>';
  });
  html += '<div class="grow"></div><a class="report-issue" href="#">Report Issue</a>';
  side.innerHTML = html;

  /* ---------- ≤1024px drawer ---------- */
  // Pages that already ship their own drawer script opt out with data-drawer="self".
  if (side.getAttribute('data-drawer') === 'self') return;

  var scrim = document.getElementById('navScrim');
  if (!scrim) {
    scrim = document.createElement('div');
    scrim.className = 'nav-scrim';
    scrim.id = 'navScrim';
    scrim.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(scrim, document.body.firstChild);
  }

  function setOpen(open) {
    side.classList.toggle('open', open);
    scrim.classList.toggle('on', open);
    document.body.classList.toggle('nav-open', open);
    [].forEach.call(document.querySelectorAll('[data-navtoggle]'), function (b) {
      b.setAttribute('aria-expanded', String(open));
    });
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-navtoggle]')) { setOpen(!side.classList.contains('open')); return; }
    if (e.target === scrim) setOpen(false);
    if (e.target.closest('.side .nav a')) setOpen(false);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  window.addEventListener('resize', function () { if (window.innerWidth > 1024) setOpen(false); });
})();