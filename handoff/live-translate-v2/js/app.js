/* ════════════════════════════════════════════════
   APP — Navigation, Screen System, Toast
   RWD 抽象層：自動偵測 Desktop / Mobile 切換導航
   ════════════════════════════════════════════════ */

/* ── RWD 偵測 ── */
var mql = window.matchMedia('(min-width: 769px)');
function isDesktop() { return mql.matches; }

/* ── 全域狀態 ── */
var currentTab = 'record';
var currentBackAction = null;

/* ════════ Screen 切換 ════════ */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(function(s) { s.classList.remove('active'); });
  document.getElementById(id).classList.add('active');
}

/* ════════ Tab 切換 ════════ */
function switchTab(tab) {
  currentTab = tab;

  /* 更新 sidebar (desktop) */
  document.querySelectorAll('.sidebar-item').forEach(function(el) {
    el.classList.toggle('active', el.dataset.tab === tab);
  });
  /* 更新 bottom nav (mobile) */
  document.querySelectorAll('.nav-item').forEach(function(el) {
    el.classList.toggle('active', el.dataset.tab === tab);
  });

  showHomeBar();
  showBottomNav();

  var titles = { record: '即時翻譯', wordbank: '單字庫', quiz: '測驗', history: '歷史紀錄' };

  if (tab === 'record') {
    updateHeaderTitle(titles[tab]);
    hideHeaderBack();
    showScreen('screen-1');
  } else if (tab === 'wordbank') {
    updateHeaderTitle(titles[tab]);
    hideHeaderBack();
    if (typeof goToWordBank === 'function') goToWordBank();
  } else if (tab === 'quiz') {
    updateHeaderTitle(titles[tab]);
    hideHeaderBack();
    if (typeof goToQuiz === 'function') goToQuiz();
  } else if (tab === 'history') {
    updateHeaderTitle(titles[tab]);
    hideHeaderBack();
    if (typeof goToHistory === 'function') goToHistory();
  }
}

/* ════════ Bottom Nav 顯示/隱藏 (Mobile only) ════════ */
function showBottomNav() {
  if (isDesktop()) return; /* Desktop sidebar 永遠顯示 */
  document.getElementById('bottom-nav').classList.remove('hidden');
}
function hideBottomNav() {
  if (isDesktop()) return;
  document.getElementById('bottom-nav').classList.add('hidden');
}

/* ════════ Header / TopBar 抽象層 ════════ */

/* Desktop: 更新 app-header 標題 */
function updateHeaderTitle(title) {
  var el = document.getElementById('header-title');
  if (el) el.textContent = title;
}

/* Desktop: 顯示/隱藏返回按鈕 */
function showHeaderBack() {
  var el = document.getElementById('header-back-btn');
  if (el) el.classList.add('visible');
}
function hideHeaderBack() {
  var el = document.getElementById('header-back-btn');
  if (el) el.classList.remove('visible');
}

/* 統一的 SubBar：同時更新 Desktop header + Mobile topbar */
function showSubBar(title) {
  /* Mobile: 切換 topbar */
  var topbarHome = document.getElementById('topbar-home');
  var topbarSub = document.getElementById('topbar-sub');
  var subTitle = document.getElementById('sub-title');
  if (topbarHome) topbarHome.style.display = 'none';
  if (topbarSub) topbarSub.classList.add('active');
  if (subTitle) subTitle.textContent = title;

  /* Desktop: 更新 header */
  updateHeaderTitle(title);
  showHeaderBack();
}

function showHomeBar() {
  /* Mobile: 恢復 topbar */
  var topbarHome = document.getElementById('topbar-home');
  var topbarSub = document.getElementById('topbar-sub');
  if (topbarHome) topbarHome.style.display = 'flex';
  if (topbarSub) topbarSub.classList.remove('active');

  /* Desktop: 隱藏返回 */
  hideHeaderBack();
}

/* ════════ Back 返回 ════════ */
function goBack() {
  if (currentBackAction) {
    currentBackAction();
  } else {
    goHome();
  }
}

function goHome() {
  showHomeBar();
  showBottomNav();
  currentBackAction = null;
  currentTab = 'record';

  document.querySelectorAll('.sidebar-item').forEach(function(el) {
    el.classList.toggle('active', el.dataset.tab === 'record');
  });
  document.querySelectorAll('.nav-item').forEach(function(el) {
    el.classList.toggle('active', el.dataset.tab === 'record');
  });

  updateHeaderTitle('即時翻譯');
  hideHeaderBack();
  showScreen('screen-1');
}

/* ════════ Toast ════════ */
function showToast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, 1800);
}
