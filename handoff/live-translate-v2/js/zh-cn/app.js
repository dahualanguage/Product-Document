/* ════════════════════════════════════════════════
   APP — Navigation, Screen System, Toast
   RWD 抽象层：自动侦测 Desktop / Mobile 切换导航
   ════════════════════════════════════════════════ */

/* ── RWD 侦测 ── */
var mql = window.matchMedia('(min-width: 769px)');
function isDesktop() { return mql.matches; }

/* ── 全域状态 ── */
var currentTab = 'record';
var currentBackAction = null;

/* ════════ Screen 切换 ════════ */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(function(s) { s.classList.remove('active'); });
  document.getElementById(id).classList.add('active');
}

/* ════════ Tab 切换 ════════ */
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

  var titles = { record: '即时翻译', wordbank: '单字库', practice: '练习', history: '历史纪录' };

  if (tab === 'record') {
    updateHeaderTitle(titles[tab]);
    hideHeaderBack();
    showScreen('screen-1');
  } else if (tab === 'wordbank') {
    updateHeaderTitle(titles[tab]);
    hideHeaderBack();
    if (typeof goToWordBank === 'function') goToWordBank();
  } else if (tab === 'practice') {
    updateHeaderTitle(titles[tab]);
    hideHeaderBack();
    if (typeof goToPracticeSetup === 'function') goToPracticeSetup();
  } else if (tab === 'history') {
    updateHeaderTitle(titles[tab]);
    hideHeaderBack();
    if (typeof goToHistory === 'function') goToHistory();
  }
}

/* ════════ Bottom Nav 显示/隐藏 (Mobile only) ════════ */
function showBottomNav() {
  if (isDesktop()) return; /* Desktop sidebar 永远显示 */
  document.getElementById('bottom-nav').classList.remove('hidden');
}
function hideBottomNav() {
  if (isDesktop()) return;
  document.getElementById('bottom-nav').classList.add('hidden');
}

/* ════════ Header / TopBar 抽象层 ════════ */

/* Desktop: 更新 app-header 标题 */
function updateHeaderTitle(title) {
  var el = document.getElementById('header-title');
  if (el) el.textContent = title;
}

/* Desktop: 显示/隐藏返回按钮 */
function showHeaderBack() {
  var el = document.getElementById('header-back-btn');
  if (el) el.classList.add('visible');
}
function hideHeaderBack() {
  var el = document.getElementById('header-back-btn');
  if (el) el.classList.remove('visible');
}

/* 统一的 SubBar：同时更新 Desktop header + Mobile topbar */
function showSubBar(title) {
  /* Mobile: 切换 topbar */
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
  /* Mobile: 恢复 topbar */
  var topbarHome = document.getElementById('topbar-home');
  var topbarSub = document.getElementById('topbar-sub');
  if (topbarHome) topbarHome.style.display = 'flex';
  if (topbarSub) topbarSub.classList.remove('active');

  /* Desktop: 隐藏返回 */
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

  updateHeaderTitle('即时翻译');
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
