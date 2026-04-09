// ============================================================
// ESL Student Wireframes — Figma Plugin
// Recreates all 4 wireframe screens as native Figma objects
// ============================================================

// ── Color Helpers ──
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16) / 255,
    g: parseInt(h.substring(2, 4), 16) / 255,
    b: parseInt(h.substring(4, 6), 16) / 255,
  };
}

function solidFill(hex, opacity) {
  const c = hexToRgb(hex);
  const paint = { type: 'SOLID', color: c };
  if (opacity !== undefined) paint.opacity = opacity;
  return [paint];
}

function stroke(hex, weight) {
  return { strokes: solidFill(hex), strokeWeight: weight || 1 };
}

// ── Design Tokens ──
const C = {
  bg:       '#f1f5f9',
  bgLight:  '#f8fafc',
  white:    '#ffffff',
  border:   '#e2e8f0',
  borderLt: '#f1f5f9',
  textDark: '#0f172a',
  text:     '#1e293b',
  textSec:  '#334155',
  textBody: '#475569',
  textMuted:'#64748b',
  textFaint:'#94a3b8',
  sepBread: '#cbd5e1',
  green:    '#10b981',
  greenLt:  '#ecfdf5',
  greenBdr: '#a7f3d0',
  greenDk:  '#059669',
  greenD2:  '#065f46',
  greenPale:'#d1fae5',
  amber:    '#f59e0b',
  amberDk:  '#d97706',
  amberLt:  '#fef9c3',
  amberPale:'#fef08a',
  orange:   '#f97316',
  orangeLt: '#fff7ed',
  orangeDk: '#9a3412',
  indigo:   '#6366f1',
  indigoLt: '#eef2ff',
  blue:     '#3b82f6',
  blueLt:   '#eff6ff',
  blueDk:   '#1e40af',
  redDk:    '#854d0e',
  yellowBg: '#fef9c3',
};

// ── Font Loading ──
async function loadFonts() {
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Extra Bold' });
}

// ── Node Builders ──
function makeFrame(opts) {
  const f = figma.createFrame();
  f.resize(opts.w || 100, opts.h || 100);
  if (opts.x !== undefined) f.x = opts.x;
  if (opts.y !== undefined) f.y = opts.y;
  f.fills = opts.fill ? solidFill(opts.fill) : [];
  if (opts.cornerRadius) f.cornerRadius = opts.cornerRadius;
  if (opts.layoutMode) {
    f.layoutMode = opts.layoutMode;
    f.primaryAxisSizingMode = opts.primaryAxisSizingMode || 'FIXED';
    f.counterAxisSizingMode = opts.counterAxisSizingMode || 'FIXED';
    if (opts.itemSpacing !== undefined) f.itemSpacing = opts.itemSpacing;
    if (opts.paddingTop !== undefined) f.paddingTop = opts.paddingTop;
    if (opts.paddingBottom !== undefined) f.paddingBottom = opts.paddingBottom;
    if (opts.paddingLeft !== undefined) f.paddingLeft = opts.paddingLeft;
    if (opts.paddingRight !== undefined) f.paddingRight = opts.paddingRight;
  }
  if (opts.stroke) {
    f.strokes = solidFill(opts.stroke);
    f.strokeWeight = opts.strokeWeight || 1;
  }
  if (opts.name) f.name = opts.name;
  if (opts.clip !== undefined) f.clipsContent = opts.clip;
  if (opts.parent) opts.parent.appendChild(f);
  return f;
}

function makeRect(opts) {
  const r = figma.createRectangle();
  r.resize(opts.w || 100, opts.h || 100);
  if (opts.x !== undefined) r.x = opts.x;
  if (opts.y !== undefined) r.y = opts.y;
  r.fills = opts.fill ? solidFill(opts.fill, opts.opacity) : [];
  if (opts.cornerRadius) r.cornerRadius = opts.cornerRadius;
  if (opts.stroke) {
    r.strokes = solidFill(opts.stroke);
    r.strokeWeight = opts.strokeWeight || 1;
  }
  if (opts.name) r.name = opts.name;
  if (opts.parent) opts.parent.appendChild(r);
  return r;
}

function makeText(opts) {
  const t = figma.createText();
  t.characters = opts.text || '';
  const style = opts.bold ? (opts.extraBold ? 'Extra Bold' : 'Bold') : (opts.semiBold ? 'Semi Bold' : (opts.medium ? 'Medium' : 'Regular'));
  t.fontName = { family: 'Inter', style };
  t.fontSize = opts.size || 13;
  t.fills = solidFill(opts.color || C.text);
  if (opts.x !== undefined) t.x = opts.x;
  if (opts.y !== undefined) t.y = opts.y;
  if (opts.w) {
    t.resize(opts.w, t.height);
    t.textAutoResize = 'HEIGHT';
  }
  if (opts.letterSpacing) t.letterSpacing = { value: opts.letterSpacing, unit: 'PIXELS' };
  if (opts.lineHeight) t.lineHeight = { value: opts.lineHeight, unit: 'PIXELS' };
  if (opts.name) t.name = opts.name;
  if (opts.parent) opts.parent.appendChild(t);
  return t;
}

function makeLine(opts) {
  const l = figma.createLine();
  l.resize(opts.w || 100, 0);
  if (opts.x !== undefined) l.x = opts.x;
  if (opts.y !== undefined) l.y = opts.y;
  l.strokes = solidFill(opts.color || C.border);
  l.strokeWeight = opts.weight || 1;
  if (opts.parent) opts.parent.appendChild(l);
  return l;
}

function makeEllipse(opts) {
  const e = figma.createEllipse();
  e.resize(opts.w || 24, opts.h || opts.w || 24);
  if (opts.x !== undefined) e.x = opts.x;
  if (opts.y !== undefined) e.y = opts.y;
  e.fills = opts.fill ? solidFill(opts.fill) : [];
  if (opts.stroke) {
    e.strokes = solidFill(opts.stroke);
    e.strokeWeight = opts.strokeWeight || 1;
  }
  if (opts.name) e.name = opts.name;
  if (opts.parent) opts.parent.appendChild(e);
  return e;
}

// ── Badge / Pill ──
function makeBadge(text, bgColor, textColor, x, y, parent, opts) {
  const fw = opts && opts.w || (text.length * 7 + 16);
  const fh = opts && opts.h || 24;
  const f = makeFrame({ w: fw, h: fh, fill: bgColor, cornerRadius: opts && opts.radius || 4, x, y, parent, name: 'Badge: ' + text });
  makeText({ text, size: opts && opts.fontSize || 10, bold: true, color: textColor, x: (fw - text.length * 6) / 2, y: (fh - 12) / 2, parent: f });
  return f;
}

function makeProgressBar(pct, x, y, w, h, parent, opts) {
  const barBg = makeFrame({ w, h, fill: C.border, cornerRadius: h / 2, x, y, parent, name: 'ProgressBar ' + pct + '%' });
  const fillW = Math.max(1, (pct / 100) * w);
  const fillColor = pct >= 100 ? C.amberDk : C.amber;
  makeRect({ w: fillW, h, fill: fillColor, cornerRadius: h / 2, x: 0, y: 0, parent: barBg, name: 'Fill' });
  if (opts && opts.showLabel) {
    const labelColor = pct >= 100 ? C.amberDk : C.textMuted;
    makeText({ text: pct + '%', size: opts.labelSize || 10, bold: true, color: labelColor, x: w + 6, y: -1, parent: barBg });
  }
  return barBg;
}

// ── Sidebar Builder ──
function buildSidebar(parent, w, h, activeItem, sections) {
  const sb = makeFrame({ w, h, fill: C.bgLight, x: 0, y: 0, parent, name: 'Sidebar', stroke: C.border });

  let curY = 14;
  for (const section of sections) {
    // Section label
    makeText({ text: section.label, size: 9, color: C.textFaint, x: 16, y: curY, parent: sb, letterSpacing: 0.5, bold: true });
    curY += 20;
    for (const item of section.items) {
      const isActive = item.name === activeItem;
      const itemH = 30;
      if (isActive) {
        makeRect({ w: w, h: itemH, fill: C.greenLt, x: 0, y: curY, parent: sb, name: 'Active BG' });
        // Active border indicator
        makeRect({ w: 3, h: itemH, fill: C.green, x: w - 3, y: curY, parent: sb, name: 'Active Border' });
      }
      const iconText = item.icon || '';
      if (iconText) {
        makeText({ text: iconText, size: 12, color: isActive ? C.greenDk : C.textBody, x: 16, y: curY + 7, parent: sb });
      }
      const nameX = iconText ? 34 : 16;
      makeText({ text: item.name, size: 12, semiBold: true, color: isActive ? C.greenDk : C.textBody, x: nameX, y: curY + 7, parent: sb });
      if (item.count !== undefined) {
        const countStr = String(item.count);
        const countW = countStr.length * 7 + 12;
        const countBg = isActive ? C.greenPale : C.border;
        const countColor = isActive ? C.greenDk : C.textMuted;
        makeFrame({ w: countW, h: 18, fill: countBg, cornerRadius: 8, x: w - countW - 16, y: curY + 6, parent: sb, name: 'Count' });
        makeText({ text: countStr, size: 10, bold: true, color: countColor, x: w - countW - 16 + 6, y: curY + 8, parent: sb });
      }
      curY += itemH;
    }
    if (section !== sections[sections.length - 1]) {
      makeLine({ w: w - 32, x: 16, y: curY + 4, parent: sb, color: C.border });
      curY += 16;
    }
  }
  return sb;
}

// ── Title Bar ──
function buildTitleBar(parent, w) {
  const bar = makeFrame({ w, h: 48, fill: C.white, x: 0, y: 0, parent, name: 'Title Bar', stroke: C.border });
  // Star icon
  const iconBg = makeFrame({ w: 28, h: 28, fill: C.greenLt, cornerRadius: 6, x: 20, y: 10, parent: bar, name: 'Icon' });
  makeText({ text: '\u2605', size: 14, color: C.green, x: 7, y: 4, parent: iconBg });
  makeText({ text: 'My Word Bank', size: 14, bold: true, color: C.textDark, x: 58, y: 14, parent: bar });
  return bar;
}

// ============================================================
// WIREFRAME A: Word Bank Homepage
// ============================================================
function buildWireframeA(pageFrame) {
  const FRAME_W = 960;
  const FRAME_H = 680;
  const frame = makeFrame({ w: FRAME_W, h: FRAME_H, fill: C.bg, x: 0, y: 0, parent: pageFrame, name: 'A — Word Bank Homepage', cornerRadius: 12, stroke: C.border, clip: true });

  // Title Bar
  buildTitleBar(frame, FRAME_W);

  // Body
  const bodyY = 48;
  const SB_W = 170;
  const bodyH = FRAME_H - bodyY;

  // Sidebar
  buildSidebar(frame, SB_W, bodyH, 'All Words', [
    { label: 'OVERVIEW', items: [
      { name: 'All Words', icon: '\u2605', count: 42 },
      { name: 'Learning', icon: '\u270E', count: 28 },
      { name: 'Mastered', icon: '\u2713', count: 14 },
    ]},
    { label: 'SUBJECTS', items: [
      { name: 'Science', count: 12 },
      { name: 'Math', count: 9 },
      { name: 'History', count: 8 },
      { name: 'Geography', count: 7 },
      { name: 'English', count: 6 },
    ]},
    { label: 'SOURCES', items: [
      { name: 'Live Classroom', count: 18 },
      { name: 'Practice', count: 15 },
      { name: 'Teacher Added', count: 9 },
    ]},
  ]);
  // Move sidebar down
  const sbNode = frame.children[frame.children.length - 1];
  sbNode.y = bodyY;

  // ── Bento Grid ──
  const gridX = SB_W + 14;
  const gridY = bodyY + 14;
  const gridW = FRAME_W - SB_W - 28;
  const gridH = bodyH - 28;
  const gap = 12;
  const leftW = Math.floor(gridW * 0.6);
  const rightW = gridW - leftW - gap;
  const topH = Math.floor(gridH * 0.55);
  const bottomH = gridH - topH - gap;

  // ── TOP-LEFT: Word Entry Card ──
  const entryCard = makeFrame({ w: leftW, h: topH, fill: C.white, cornerRadius: 10, x: gridX, y: gridY, parent: frame, name: 'Word Entry Card' });

  // Entry header
  makeText({ text: 'NEWEST WORD', size: 10, semiBold: true, color: C.green, x: 24, y: 20, parent: entryCard, letterSpacing: 0.3 });
  makeText({ text: 'hypothesis', size: 26, extraBold: true, color: C.textDark, x: 24, y: 38, parent: entryCard });
  // Play button
  makeEllipse({ w: 32, h: 32, fill: C.greenLt, x: leftW - 60, y: 36, parent: entryCard, stroke: C.greenBdr, strokeWeight: 1.5, name: 'Play' });
  makeText({ text: '\u25B6', size: 12, color: C.green, x: leftW - 50, y: 43, parent: entryCard });
  // POS badge
  makeBadge('noun', C.greenLt, C.green, 24, 72, entryCard, { radius: 4, fontSize: 11 });

  // Entry body rows
  let rowY = 100;
  const lblX = 24;
  const valX = 110;
  const valW = leftW - valX - 20;
  const rows = [
    { label: 'DEFINITION', value: 'A proposed explanation made on the basis of limited evidence as a starting point for further investigation.', isContext: true },
    { label: 'TRANSLATION', value: '\u5047\u8AAA\uFF1B\u5047\u8A2D' },
    { label: 'EXAMPLE', value: 'We need to test our hypothesis before drawing any conclusions.', isContext: true },
    { label: 'SOURCE', value: 'Live Classroom' },
    { label: 'SUBJECT', value: 'Science' },
  ];
  for (const row of rows) {
    makeText({ text: row.label, size: 11, color: C.textFaint, x: lblX, y: rowY, parent: entryCard, letterSpacing: 0.3 });
    if (row.isContext) {
      const ctx = makeFrame({ w: valW, h: 36, fill: C.bgLight, cornerRadius: 6, x: valX, y: rowY - 2, parent: entryCard, name: 'Context' });
      makeRect({ w: 3, h: 36, fill: C.border, x: 0, y: 0, parent: ctx });
      makeText({ text: row.value, size: 13, color: C.textBody, x: 12, y: 8, w: valW - 20, parent: ctx });
      rowY += 44;
    } else {
      makeText({ text: row.value, size: 13, color: C.textSec, x: valX, y: rowY, parent: entryCard });
      rowY += 24;
    }
  }

  // Progress bar
  makeText({ text: 'PROGRESS', size: 11, color: C.textFaint, x: lblX, y: rowY, parent: entryCard, letterSpacing: 0.3 });
  makeProgressBar(40, valX, rowY + 2, 120, 8, entryCard, { showLabel: true });

  // Nav footer
  const navY = topH - 32;
  makeLine({ w: leftW, x: 0, y: navY, parent: entryCard, color: C.borderLt });
  makeBadge('\u2190 Prev', C.bgLight, C.sepBread, 16, navY + 6, entryCard, { radius: 6, w: 60, h: 22, fontSize: 11 });
  makeText({ text: '1 / 42', size: 10, semiBold: true, color: C.textFaint, x: leftW / 2 - 15, y: navY + 10, parent: entryCard });
  makeBadge('Next \u2192', C.greenLt, C.green, leftW - 76, navY + 6, entryCard, { radius: 6, w: 60, h: 22, fontSize: 11 });

  // ── TOP-RIGHT: Practice Buttons ──
  const practicePanel = makeFrame({ w: rightW, h: topH, fill: C.white, cornerRadius: 10, x: gridX + leftW + gap, y: gridY, parent: frame, name: 'Practice Panel' });
  makeText({ text: 'Practice', size: 12, bold: true, color: C.textDark, x: 16, y: 12, parent: practicePanel });
  makeBadge('This Week', C.greenLt, C.greenDk, 80, 12, practicePanel, { radius: 4, fontSize: 9 });

  const pBtns = [
    { label: 'a', name: 'Spelling', desc: 'Type the word', count: '5x this week' },
    { label: 'b', name: 'Vocabs Mirroring', desc: 'Pronounce the word', count: '3x this week' },
    { label: 'c', name: 'Multiple Choice', desc: 'Pick the answer', count: '7x this week' },
    { label: 'd', name: 'Contextual Mirroring', desc: 'Use in sentence', count: '2x this week' },
  ];
  const pbW = (rightW - 40) / 2;
  const pbH = (topH - 60) / 2;
  pBtns.forEach((btn, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const bx = 12 + col * (pbW + 8);
    const by = 40 + row * (pbH + 8);
    const card = makeFrame({ w: pbW, h: pbH, fill: C.bgLight, cornerRadius: 8, x: bx, y: by, parent: practicePanel, name: btn.name, stroke: C.border });
    makeText({ text: btn.label, size: 10, bold: true, color: C.green, x: 12, y: 10, parent: card, letterSpacing: 0.3 });
    makeText({ text: btn.name, size: 13, bold: true, color: C.textDark, x: 12, y: 26, parent: card });
    makeText({ text: btn.desc, size: 10, color: C.textFaint, x: 12, y: 44, parent: card });
    makeBadge(btn.count, C.greenLt, C.greenDk, 12, pbH - 28, card, { radius: 4, fontSize: 10, w: 80, h: 20 });
  });

  // ── BOTTOM-LEFT: Word List ──
  const listPanel = makeFrame({ w: leftW, h: bottomH, fill: C.white, cornerRadius: 10, x: gridX, y: gridY + topH + gap, parent: frame, name: 'Word List' });
  makeText({ text: 'Word List', size: 12, bold: true, color: C.textDark, x: 16, y: 12, parent: listPanel });
  makeBadge('42', C.bg, C.textMuted, 90, 12, listPanel, { radius: 4, fontSize: 10, w: 28 });

  // Tabs
  const tabs = ['Newest', 'Subject', 'Most Errors'];
  let tabX = 16;
  tabs.forEach((tab, i) => {
    const isActive = i === 0;
    const tw = tab.length * 7 + 24;
    makeBadge(tab, isActive ? C.green : C.bg, isActive ? C.white : C.textMuted, tabX, 36, listPanel, { radius: 20, fontSize: 11, w: tw, h: 24 });
    tabX += tw + 6;
  });

  // Word items
  const words = [
    { word: 'hypothesis', tl: '\u5047\u8AAA', subject: 'Science', pct: 40 },
    { word: 'photosynthesis', tl: '\u5149\u5408\u4F5C\u7528', subject: 'Science', pct: 60 },
    { word: 'equation', tl: '\u65B9\u7A0B\u5F0F', subject: 'Math', pct: 20 },
    { word: 'revolution', tl: '\u9769\u547D', subject: 'History', pct: 80 },
    { word: 'democracy', tl: '\u6C11\u4E3B', subject: 'History', pct: 100 },
    { word: 'latitude', tl: '\u7DEF\u5EA6', subject: 'Geography', pct: 0 },
  ];
  let wy = 68;
  words.forEach((w) => {
    makeText({ text: w.word, size: 13, semiBold: true, color: C.textDark, x: 16, y: wy, parent: listPanel });
    makeText({ text: w.tl, size: 10, color: C.textFaint, x: 16, y: wy + 16, parent: listPanel });
    makeBadge(w.subject, C.bg, C.textMuted, leftW - 180, wy + 4, listPanel, { radius: 3, fontSize: 9, w: 56, h: 18 });
    makeProgressBar(w.pct, leftW - 110, wy + 6, 48, 5, listPanel, { showLabel: true, labelSize: 10 });
    if (wy + 40 < bottomH) {
      makeLine({ w: leftW - 32, x: 16, y: wy + 34, parent: listPanel, color: C.borderLt });
    }
    wy += 38;
  });

  // ── BOTTOM-RIGHT: Learning Curve Chart ──
  const chartPanel = makeFrame({ w: rightW, h: bottomH, fill: C.white, cornerRadius: 10, x: gridX + leftW + gap, y: gridY + topH + gap, parent: frame, name: 'Learning Curve' });
  makeText({ text: 'Learning Curve', size: 12, bold: true, color: C.textDark, x: 16, y: 12, parent: chartPanel });
  makeBadge('\u2197 Trending up', C.greenLt, C.greenDk, 120, 12, chartPanel, { radius: 4, fontSize: 9, w: 90 });

  // Stats
  const stats = [
    { value: '14', label: 'Mastered' },
    { value: '28', label: 'Learning' },
    { value: '67%', label: 'Accuracy' },
  ];
  let sx = 16;
  stats.forEach((s) => {
    makeText({ text: s.value, size: 14, extraBold: true, color: C.textDark, x: sx, y: 36, parent: chartPanel });
    makeText({ text: s.label, size: 10, color: C.textFaint, x: sx, y: 52, parent: chartPanel });
    sx += 55;
  });

  // Chart area — simplified line chart
  const chartArea = makeFrame({ w: rightW - 32, h: bottomH - 100, fill: C.white, x: 16, y: 70, parent: chartPanel, name: 'Chart Area', clip: true });
  const cw = rightW - 32;
  const ch = bottomH - 100;

  // Grid lines
  for (let i = 0; i < 4; i++) {
    const ly = Math.floor((ch / 4) * i);
    makeLine({ w: cw, x: 0, y: ly, parent: chartArea, color: C.borderLt });
  }
  makeLine({ w: cw, x: 0, y: ch - 1, parent: chartArea, color: C.border });

  // Data points — Total Words line (indigo)
  const totalPts = [0.85, 0.7, 0.55, 0.4, 0.28, 0.12];
  const masteredPts = [0.97, 0.93, 0.88, 0.78, 0.68, 0.58];
  const numPts = totalPts.length;
  const ptSpacing = cw / (numPts + 1);

  totalPts.forEach((pct, i) => {
    const px = ptSpacing * (i + 1);
    const py = ch * pct;
    makeEllipse({ w: 6, h: 6, fill: C.indigo, x: px - 3, y: py - 3, parent: chartArea, name: 'Total pt ' + i });
    // Connect to next
    if (i < numPts - 1) {
      const nx = ptSpacing * (i + 2);
      const ny = ch * totalPts[i + 1];
      makeLine({ w: Math.abs(nx - px), x: Math.min(px, nx), y: (py + ny) / 2, parent: chartArea, color: C.indigo, weight: 2 });
    }
    // X-axis label
    makeText({ text: 'W' + (i + 1), size: 8, color: C.textFaint, x: px - 6, y: ch + 2, parent: chartArea });
  });

  // Mastered line (amber)
  masteredPts.forEach((pct, i) => {
    const px = ptSpacing * (i + 1);
    const py = ch * pct;
    makeEllipse({ w: 6, h: 6, fill: C.amber, x: px - 3, y: py - 3, parent: chartArea, name: 'Mastered pt ' + i });
  });

  // Legend
  const legendY = bottomH - 24;
  makeEllipse({ w: 8, h: 8, fill: C.indigo, x: 16, y: legendY, parent: chartPanel });
  makeText({ text: 'Total Words', size: 10, semiBold: true, color: C.textMuted, x: 28, y: legendY - 2, parent: chartPanel });
  makeEllipse({ w: 8, h: 8, fill: C.amber, x: 100, y: legendY, parent: chartPanel });
  makeText({ text: 'Mastered', size: 10, semiBold: true, color: C.textMuted, x: 112, y: legendY - 2, parent: chartPanel });

  return frame;
}

// ============================================================
// WIREFRAME B: Filtered View
// ============================================================
function buildWireframeB(pageFrame) {
  const FRAME_W = 960;
  const FRAME_H = 680;
  const frame = makeFrame({ w: FRAME_W, h: FRAME_H, fill: C.bg, x: 0, y: 100 + 680 + 60, parent: pageFrame, name: 'B — Filtered View', cornerRadius: 12, stroke: C.border, clip: true });

  // Title Bar
  buildTitleBar(frame, FRAME_W);

  const bodyY = 48;
  const SB_W = 170;
  const bodyH = FRAME_H - bodyY;

  // Sidebar — Science active
  buildSidebar(frame, SB_W, bodyH, 'Science', [
    { label: 'OVERVIEW', items: [
      { name: 'All Words', icon: '\u2605', count: 42 },
      { name: 'Learning', icon: '\u270E', count: 28 },
      { name: 'Mastered', icon: '\u2713', count: 14 },
    ]},
    { label: 'SUBJECTS', items: [
      { name: 'Science', count: 12 },
      { name: 'Math', count: 9 },
      { name: 'History', count: 8 },
      { name: 'Geography', count: 7 },
      { name: 'English', count: 6 },
    ]},
    { label: 'SOURCES', items: [
      { name: 'Live Classroom', count: 18 },
      { name: 'Practice', count: 15 },
      { name: 'Teacher Added', count: 9 },
    ]},
  ]);
  const sbNode = frame.children[frame.children.length - 1];
  sbNode.y = bodyY;

  // ── Filtered Main Area ──
  const mainX = SB_W + 14;
  const mainY = bodyY + 14;
  const mainW = FRAME_W - SB_W - 28;

  // Header bar
  makeText({ text: 'Science', size: 15, extraBold: true, color: C.textDark, x: mainX, y: mainY, parent: frame });
  makeBadge('12 words', C.orangeLt, C.orangeDk, mainX + 80, mainY, frame, { radius: 6, fontSize: 10, w: 60, h: 22 });

  // Practice button
  const practBtnW = 130;
  const practBtn = makeFrame({ w: practBtnW, h: 28, fill: C.green, cornerRadius: 6, x: mainX + mainW - practBtnW - 120, y: mainY - 2, parent: frame, name: 'Practice Science Btn' });
  makeText({ text: '\u25B6 Practice Science', size: 11, bold: true, color: C.white, x: 12, y: 6, parent: practBtn });

  // Sort dropdown
  makeBadge('Sort: Newest first \u25BE', C.bg, C.textMuted, mainX + mainW - 110, mainY, frame, { radius: 6, w: 110, h: 22, fontSize: 11 });

  // ── Word Card (expanded) ──
  const cardY = mainY + 34;
  const cardH = 190;
  const detailW = 220;
  const wordCard = makeFrame({ w: mainW, h: cardH, fill: C.white, cornerRadius: 10, x: mainX, y: cardY, parent: frame, name: 'Selected Word Card', clip: true });

  // Main section
  makeText({ text: 'SELECTED WORD', size: 10, semiBold: true, color: C.green, x: 24, y: 16, parent: wordCard, letterSpacing: 0.3 });
  makeText({ text: 'hypothesis', size: 26, extraBold: true, color: C.textDark, x: 24, y: 34, parent: wordCard });
  makeEllipse({ w: 32, h: 32, fill: C.greenLt, x: mainW - detailW - 70, y: 32, parent: wordCard, stroke: C.greenBdr, strokeWeight: 1.5 });
  makeBadge('noun', C.greenLt, C.green, 24, 68, wordCard, { radius: 4, fontSize: 11 });

  // Definition
  makeText({ text: 'DEFINITION', size: 11, color: C.textFaint, x: 24, y: 96, parent: wordCard, letterSpacing: 0.3 });
  const defCtx = makeFrame({ w: mainW - detailW - 60, h: 32, fill: C.bgLight, cornerRadius: 6, x: 110, y: 94, parent: wordCard });
  makeRect({ w: 3, h: 32, fill: C.border, x: 0, y: 0, parent: defCtx });
  makeText({ text: 'A proposed explanation made on the basis of limited evidence...', size: 12, color: C.textBody, x: 12, y: 8, w: mainW - detailW - 90, parent: defCtx });

  // Translation & Example
  makeText({ text: 'TRANSLATION', size: 11, color: C.textFaint, x: 24, y: 134, parent: wordCard });
  makeText({ text: '\u5047\u8AAA\uFF1B\u5047\u8A2D', size: 13, color: C.textSec, x: 110, y: 134, parent: wordCard });
  makeText({ text: 'EXAMPLE', size: 11, color: C.textFaint, x: 24, y: 158, parent: wordCard });
  makeText({ text: 'We need to test our hypothesis before drawing any conclusions.', size: 12, color: C.textBody, x: 110, y: 158, w: mainW - detailW - 140, parent: wordCard });

  // Detail sidebar
  const detailX = mainW - detailW;
  makeRect({ w: detailW, h: cardH, fill: C.bgLight, x: detailX, y: 0, parent: wordCard });
  makeLine({ w: 0, x: detailX, y: 0, parent: wordCard }); // vertical separator simulated
  makeRect({ w: 1, h: cardH, fill: C.borderLt, x: detailX, y: 0, parent: wordCard, name: 'Separator' });

  const detailRows = [
    { label: 'SOURCE', value: 'Live Classroom' },
    { label: 'SUBJECT', value: 'Science' },
    { label: 'WORD TYPE', value: 'Academic' },
    { label: 'STATE', value: 'Learning' },
  ];
  let dY = 16;
  detailRows.forEach((dr) => {
    makeText({ text: dr.label, size: 9, color: C.textFaint, x: detailX + 16, y: dY, parent: wordCard, letterSpacing: 0.4 });
    makeText({ text: dr.value, size: 12, color: C.textSec, x: detailX + 16, y: dY + 14, parent: wordCard });
    dY += 36;
  });

  // Progress in detail
  makeText({ text: 'LEARNING PROGRESS', size: 9, color: C.textFaint, x: detailX + 16, y: dY, parent: wordCard, letterSpacing: 0.4 });
  makeProgressBar(40, detailX + 16, dY + 16, 100, 8, wordCard, { showLabel: true });

  // Navigation
  makeBadge('\u2190', C.bgLight, C.sepBread, detailX + 16, cardH - 30, wordCard, { radius: 6, w: 28, h: 22 });
  makeText({ text: '1 / 12', size: 10, semiBold: true, color: C.textFaint, x: detailX + 80, y: cardH - 26, parent: wordCard });
  makeBadge('\u2192', C.greenLt, C.green, detailX + detailW - 50, cardH - 30, wordCard, { radius: 6, w: 28, h: 22 });

  // ── Filtered Word List Table ──
  const tableY = cardY + cardH + 12;
  const tableH = FRAME_H - tableY - 14;
  const tableFrame = makeFrame({ w: mainW, h: tableH, fill: C.white, cornerRadius: 10, x: mainX, y: tableY, parent: frame, name: 'Word List Table', clip: true });

  // Table header
  const headerH = 32;
  makeRect({ w: mainW, h: headerH, fill: C.bgLight, x: 0, y: 0, parent: tableFrame });
  const cols = [
    { label: 'WORD', x: 16, w: 120 },
    { label: 'EXAMPLE', x: 160, w: 180 },
    { label: 'SOURCE', x: 370, w: 90 },
    { label: 'STATE', x: 480, w: 70 },
    { label: 'PROGRESS', x: 570, w: 80 },
  ];
  cols.forEach((col) => {
    makeText({ text: col.label, size: 10, bold: true, color: C.textFaint, x: col.x, y: 10, parent: tableFrame, letterSpacing: 0.4 });
  });

  // Table rows
  const tableWords = [
    { word: 'hypothesis', tl: '\u5047\u8AAA', example: 'We need to test our hypothesis before\u2026', source: 'Live Classroom', srcBg: C.blueLt, srcColor: C.blueDk, state: 'Learning', stateBg: C.yellowBg, stateColor: C.redDk, pct: 40, selected: true },
    { word: 'photosynthesis', tl: '\u5149\u5408\u4F5C\u7528', example: 'Plants use photosynthesis to convert light\u2026', source: 'Live Classroom', srcBg: C.blueLt, srcColor: C.blueDk, state: 'Learning', stateBg: C.yellowBg, stateColor: C.redDk, pct: 60 },
    { word: 'organism', tl: '\u6709\u6A5F\u9AD4', example: 'An organism can be single-celled or\u2026', source: 'Practice', srcBg: C.greenLt, srcColor: C.greenDk, state: 'Learning', stateBg: C.yellowBg, stateColor: C.redDk, pct: 20 },
    { word: 'nucleus', tl: '\u7D30\u80DE\u6838', example: 'The nucleus contains the cell\u2019s genetic\u2026', source: 'Teacher Added', srcBg: C.greenLt, srcColor: C.greenDk, state: 'Mastered', stateBg: '#f0fdf4', stateColor: '#166534', pct: 100 },
    { word: 'ecosystem', tl: '\u751F\u614B\u7CFB\u7D71', example: 'A coral reef is a complex ecosystem\u2026', source: 'Live Classroom', srcBg: C.blueLt, srcColor: C.blueDk, state: 'Learning', stateBg: C.yellowBg, stateColor: C.redDk, pct: 80 },
    { word: 'molecule', tl: '\u5206\u5B50', example: 'A water molecule consists of two hydrogen\u2026', source: 'Practice', srcBg: C.greenLt, srcColor: C.greenDk, state: 'Mastered', stateBg: '#f0fdf4', stateColor: '#166534', pct: 100 },
  ];
  let ty = headerH;
  tableWords.forEach((w) => {
    const rowH = 36;
    if (w.selected) {
      makeRect({ w: mainW, h: rowH, fill: C.greenLt, x: 0, y: ty, parent: tableFrame });
    }
    makeText({ text: w.word, size: 13, bold: true, color: C.textDark, x: 16, y: ty + 6, parent: tableFrame });
    makeText({ text: w.tl, size: 10, color: C.textFaint, x: 16, y: ty + 22, parent: tableFrame });
    makeText({ text: w.example, size: 11, color: C.textMuted, x: 160, y: ty + 10, w: 190, parent: tableFrame });
    makeBadge(w.source, w.srcBg, w.srcColor, 370, ty + 8, tableFrame, { radius: 4, fontSize: 10, w: 85, h: 20 });
    makeBadge(w.state, w.stateBg, w.stateColor, 480, ty + 8, tableFrame, { radius: 4, fontSize: 10, w: 60, h: 20 });
    makeProgressBar(w.pct, 570, ty + 12, 48, 5, tableFrame, { showLabel: true, labelSize: 10 });
    makeLine({ w: mainW - 32, x: 16, y: ty + rowH - 1, parent: tableFrame, color: C.borderLt });
    ty += rowH;
  });

  return frame;
}

// ============================================================
// WIREFRAME C: Practice Setup — From Homepage
// ============================================================
function buildWireframeC(pageFrame) {
  const FRAME_W = 960;
  const FRAME_H = 560;
  const yOffset = 100 + 680 + 60 + 680 + 60;
  const frame = makeFrame({ w: FRAME_W, h: FRAME_H, fill: C.bg, x: 0, y: yOffset, parent: pageFrame, name: 'C — Practice Setup (Homepage)', cornerRadius: 12, stroke: C.border, clip: true });

  // Dimmed background (simplified representation)
  const bgFrame = makeFrame({ w: FRAME_W, h: FRAME_H, fill: C.bg, x: 0, y: 0, parent: frame, name: 'Background (dimmed)', clip: true });
  // Simple dimmed title bar
  buildTitleBar(bgFrame, FRAME_W);
  // Dim overlay
  makeRect({ w: FRAME_W, h: FRAME_H, fill: '#0f172a', opacity: 0.55, x: 0, y: 0, parent: frame, name: 'Overlay Dim' });

  // ── Popup Window ──
  const popupW = 520;
  const popupH = 420;
  const popupX = (FRAME_W - popupW) / 2;
  const popupY = (FRAME_H - popupH) / 2;
  const popup = makeFrame({ w: popupW, h: popupH, fill: C.white, cornerRadius: 14, x: popupX, y: popupY, parent: frame, name: 'Practice Setup Popup', clip: true });

  // Close button
  const closeBtn = makeFrame({ w: 28, h: 28, fill: C.bg, cornerRadius: 6, x: popupW - 42, y: 12, parent: popup, name: 'Close' });
  makeText({ text: '\u00D7', size: 16, color: C.textMuted, x: 8, y: 2, parent: closeBtn });

  // Header
  makeText({ text: '\u25B6 Practice Setup', size: 17, extraBold: true, color: C.textDark, x: 24, y: 20, parent: popup });
  makeText({ text: 'Via homepage shortcut \u2014 "Spelling" pre-selected', size: 11, color: C.textMuted, x: 24, y: 44, parent: popup });

  // Stepper
  const stepperY = 68;
  makeLine({ w: popupW, x: 0, y: stepperY + 30, parent: popup, color: C.border });

  // Step 1 (done)
  const step1Circ = makeEllipse({ w: 24, h: 24, fill: C.greenPale, x: 24, y: stepperY, parent: popup, name: 'Step 1' });
  makeText({ text: '\u2713', size: 11, bold: true, color: C.greenDk, x: 31, y: stepperY + 4, parent: popup });
  makeText({ text: 'Practice Type', size: 11, semiBold: true, color: C.greenDk, x: 54, y: stepperY + 4, parent: popup });

  // Connector line
  makeRect({ w: 60, h: 2, fill: C.greenBdr, x: 150, y: stepperY + 11, parent: popup });

  // Step 2 (active)
  makeEllipse({ w: 24, h: 24, fill: C.green, x: 220, y: stepperY, parent: popup, name: 'Step 2' });
  makeText({ text: '2', size: 11, bold: true, color: C.white, x: 228, y: stepperY + 4, parent: popup });
  makeText({ text: 'Word Category', size: 11, semiBold: true, color: C.textDark, x: 250, y: stepperY + 4, parent: popup });

  // Connector line
  makeRect({ w: 60, h: 2, fill: C.border, x: 350, y: stepperY + 11, parent: popup });

  // Step 3 (pending)
  makeEllipse({ w: 24, h: 24, fill: C.border, x: 420, y: stepperY, parent: popup, name: 'Step 3' });
  makeText({ text: '3', size: 11, bold: true, color: C.textFaint, x: 428, y: stepperY + 4, parent: popup });
  makeText({ text: 'Count', size: 11, semiBold: true, color: C.textFaint, x: 450, y: stepperY + 4, parent: popup });

  // Body
  const bodyY = stepperY + 40;

  // Locked row: Practice Type = Spelling
  const lockedRow = makeFrame({ w: popupW - 48, h: 34, fill: C.bg, cornerRadius: 8, x: 24, y: bodyY, parent: popup, name: 'Locked Row' });
  makeText({ text: 'PRACTICE TYPE', size: 10, bold: true, color: C.textFaint, x: 14, y: 10, parent: lockedRow, letterSpacing: 0.3 });
  makeText({ text: 'Spelling', size: 13, bold: true, color: C.textDark, x: 120, y: 8, parent: lockedRow });

  // Category selection label
  makeText({ text: 'Select word category', size: 13, bold: true, color: C.textSec, x: 24, y: bodyY + 46, parent: popup });

  // Category pills
  const catY = bodyY + 72;
  const categories = [
    { name: 'Newest', desc: 'Recently added', selected: false },
    { name: 'All Random', desc: 'Random from Learning', selected: true },
    { name: 'Untested', desc: '0 attempts', selected: false },
    { name: 'Most Errors', desc: 'Highest error rate', selected: false },
  ];
  let catX = 24;
  categories.forEach((cat) => {
    const pillW = cat.name.length * 8 + 40;
    const pillH = 50;
    const borderColor = cat.selected ? C.green : C.border;
    const bgColor = cat.selected ? C.greenLt : C.white;
    const pill = makeFrame({ w: pillW, h: pillH, fill: bgColor, cornerRadius: 10, x: catX, y: catY, parent: popup, name: cat.name, stroke: borderColor, strokeWeight: 2 });
    makeText({ text: cat.name, size: 13, bold: true, color: cat.selected ? C.greenDk : C.textDark, x: 12, y: 10, parent: pill });
    makeText({ text: cat.desc, size: 10, color: C.textFaint, x: 12, y: 28, parent: pill });
    catX += pillW + 10;
  });

  // Summary + Start
  const summaryY = catY + 68;
  makeLine({ w: popupW - 48, x: 24, y: summaryY, parent: popup, color: C.border });

  // Summary tags
  makeBadge('Spelling', C.greenLt, C.greenDk, 24, summaryY + 14, popup, { radius: 6, fontSize: 11, w: 65, h: 24 });
  makeText({ text: '\u2192', size: 10, color: C.sepBread, x: 96, y: summaryY + 18, parent: popup });
  makeBadge('All Random', C.blueLt, C.blueDk, 112, summaryY + 14, popup, { radius: 6, fontSize: 11, w: 80, h: 24 });
  makeText({ text: '\u2192', size: 10, color: C.sepBread, x: 198, y: summaryY + 18, parent: popup });
  makeText({ text: 'Count?', size: 11, semiBold: true, color: C.textFaint, x: 214, y: summaryY + 18, parent: popup });

  // Start button (disabled)
  const startBtn = makeFrame({ w: 90, h: 36, fill: C.green, cornerRadius: 8, x: popupW - 114, y: summaryY + 10, parent: popup, name: 'Start Btn' });
  makeText({ text: '\u25B6 Start', size: 14, bold: true, color: C.white, x: 16, y: 8, parent: startBtn });
  // Overlay to show disabled state
  makeRect({ w: 90, h: 36, fill: C.white, opacity: 0.6, cornerRadius: 8, x: popupW - 114, y: summaryY + 10, parent: popup, name: 'Disabled overlay' });

  return frame;
}

// ============================================================
// WIREFRAME D: Practice Setup — From Category
// ============================================================
function buildWireframeD(pageFrame) {
  const FRAME_W = 960;
  const FRAME_H = 560;
  const yOffset = 100 + 680 + 60 + 680 + 60 + 560 + 60;
  const frame = makeFrame({ w: FRAME_W, h: FRAME_H, fill: C.bg, x: 0, y: yOffset, parent: pageFrame, name: 'D — Practice Setup (Category)', cornerRadius: 12, stroke: C.border, clip: true });

  // Dimmed background
  const bgFrame = makeFrame({ w: FRAME_W, h: FRAME_H, fill: C.bg, x: 0, y: 0, parent: frame, name: 'Background (dimmed)', clip: true });
  buildTitleBar(bgFrame, FRAME_W);
  makeRect({ w: FRAME_W, h: FRAME_H, fill: '#0f172a', opacity: 0.55, x: 0, y: 0, parent: frame, name: 'Overlay Dim' });

  // ── Popup Window ──
  const popupW = 520;
  const popupH = 460;
  const popupX = (FRAME_W - popupW) / 2;
  const popupY = (FRAME_H - popupH) / 2;
  const popup = makeFrame({ w: popupW, h: popupH, fill: C.white, cornerRadius: 14, x: popupX, y: popupY, parent: frame, name: 'Practice Setup Popup', clip: true });

  // Close button
  const closeBtn = makeFrame({ w: 28, h: 28, fill: C.bg, cornerRadius: 6, x: popupW - 42, y: 12, parent: popup, name: 'Close' });
  makeText({ text: '\u00D7', size: 16, color: C.textMuted, x: 8, y: 2, parent: closeBtn });

  // Header
  makeText({ text: '\u25B6 Practice Setup', size: 17, extraBold: true, color: C.textDark, x: 24, y: 20, parent: popup });
  makeText({ text: 'Via "Practice Science" button \u2014 practicing Science words only', size: 11, color: C.textMuted, x: 24, y: 44, parent: popup });

  // Stepper
  const stepperY = 68;
  makeLine({ w: popupW, x: 0, y: stepperY + 30, parent: popup, color: C.border });

  // Step 1 (active)
  makeEllipse({ w: 24, h: 24, fill: C.green, x: 24, y: stepperY, parent: popup, name: 'Step 1' });
  makeText({ text: '1', size: 11, bold: true, color: C.white, x: 32, y: stepperY + 4, parent: popup });
  makeText({ text: 'Practice Type', size: 11, semiBold: true, color: C.textDark, x: 54, y: stepperY + 4, parent: popup });

  // Connector line
  makeRect({ w: 60, h: 2, fill: C.border, x: 150, y: stepperY + 11, parent: popup });

  // Step 2 (pending)
  makeEllipse({ w: 24, h: 24, fill: C.border, x: 220, y: stepperY, parent: popup, name: 'Step 2' });
  makeText({ text: '2', size: 11, bold: true, color: C.textFaint, x: 228, y: stepperY + 4, parent: popup });
  makeText({ text: 'Word Category', size: 11, semiBold: true, color: C.textFaint, x: 250, y: stepperY + 4, parent: popup });

  // Connector line
  makeRect({ w: 60, h: 2, fill: C.border, x: 350, y: stepperY + 11, parent: popup });

  // Step 3 (pending)
  makeEllipse({ w: 24, h: 24, fill: C.border, x: 420, y: stepperY, parent: popup, name: 'Step 3' });
  makeText({ text: '3', size: 11, bold: true, color: C.textFaint, x: 428, y: stepperY + 4, parent: popup });
  makeText({ text: 'Count', size: 11, semiBold: true, color: C.textFaint, x: 450, y: stepperY + 4, parent: popup });

  // Body
  const bodyY = stepperY + 40;

  // Locked row: Scope = Science
  const lockedRow = makeFrame({ w: popupW - 48, h: 34, fill: C.bg, cornerRadius: 8, x: 24, y: bodyY, parent: popup, name: 'Locked Row' });
  makeText({ text: 'SCOPE', size: 10, bold: true, color: C.textFaint, x: 14, y: 10, parent: lockedRow, letterSpacing: 0.3 });
  makeText({ text: 'Science \u00B7 12 words', size: 13, bold: true, color: C.textDark, x: 70, y: 8, parent: lockedRow });

  // Practice type label
  makeText({ text: 'Select a practice type', size: 13, bold: true, color: C.textSec, x: 24, y: bodyY + 46, parent: popup });

  // Practice type cards (2x2 grid)
  const typeY = bodyY + 72;
  const typeW = (popupW - 60) / 2;
  const typeH = 80;
  const types = [
    { name: 'Spelling', desc: 'Listen and type the word', selected: true },
    { name: 'Vocabs Mirroring', desc: 'Listen and repeat', selected: false },
    { name: 'Multiple Choice', desc: 'Pick the correct meaning', selected: false },
    { name: 'Contextual Mirroring', desc: 'Read and repeat in context', selected: false },
  ];
  types.forEach((type, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const tx = 24 + col * (typeW + 12);
    const ty = typeY + row * (typeH + 12);
    const borderColor = type.selected ? C.green : C.border;
    const bgColor = type.selected ? C.greenLt : C.white;
    const card = makeFrame({ w: typeW, h: typeH, fill: bgColor, cornerRadius: 10, x: tx, y: ty, parent: popup, name: type.name, stroke: borderColor, strokeWeight: 2 });
    // Icon placeholder
    const iconBg = type.selected ? C.greenPale : C.bg;
    const iconFrame = makeFrame({ w: 36, h: 36, fill: iconBg, cornerRadius: 8, x: 12, y: 12, parent: card, name: 'Icon' });
    makeText({ text: type.name.charAt(0), size: 16, bold: true, color: type.selected ? C.greenDk : C.textMuted, x: 10, y: 6, parent: iconFrame });
    makeText({ text: type.name, size: 13, bold: true, color: type.selected ? C.greenDk : C.textDark, x: 12, y: 54, parent: card });
    makeText({ text: type.desc, size: 11, color: C.textMuted, x: 12, y: 70, parent: card });
  });

  // Summary + Start
  const summaryY = typeY + typeH * 2 + 36;
  makeLine({ w: popupW - 48, x: 24, y: summaryY, parent: popup, color: C.border });

  // Summary tags
  makeBadge('Spelling', C.greenLt, C.greenDk, 24, summaryY + 14, popup, { radius: 6, fontSize: 11, w: 65, h: 24 });
  makeText({ text: '\u2192', size: 10, color: C.sepBread, x: 96, y: summaryY + 18, parent: popup });
  makeText({ text: 'Category?', size: 11, semiBold: true, color: C.textFaint, x: 112, y: summaryY + 18, parent: popup });
  makeText({ text: '\u2192', size: 10, color: C.sepBread, x: 178, y: summaryY + 18, parent: popup });
  makeText({ text: 'Count?', size: 11, semiBold: true, color: C.textFaint, x: 194, y: summaryY + 18, parent: popup });

  // Start button (disabled)
  const startBtn = makeFrame({ w: 90, h: 36, fill: C.green, cornerRadius: 8, x: popupW - 114, y: summaryY + 10, parent: popup, name: 'Start Btn' });
  makeText({ text: '\u25B6 Start', size: 14, bold: true, color: C.white, x: 16, y: 8, parent: startBtn });
  makeRect({ w: 90, h: 36, fill: C.white, opacity: 0.6, cornerRadius: 8, x: popupW - 114, y: summaryY + 10, parent: popup, name: 'Disabled overlay' });

  return frame;
}

// ============================================================
// WIREFRAME E: Word Bank Homepage v8 (Current Design)
// ============================================================
function buildWireframeE(pageFrame) {
  const FRAME_W = 1200;
  const FRAME_H = 1100;
  const yOffset = 100 + 680 + 60 + 680 + 60 + 560 + 60 + 560 + 60;
  const frame = makeFrame({ w: FRAME_W, h: FRAME_H, fill: C.white, x: 0, y: yOffset, parent: pageFrame, name: 'E — Word Bank Homepage v8', cornerRadius: 12, stroke: C.border, clip: true });

  // ── App Sidebar (88px) ──
  const SB_W = 88;
  const sidebar = makeFrame({ w: SB_W, h: FRAME_H, fill: C.white, x: 0, y: 0, parent: frame, name: 'Sidebar', stroke: C.border });
  // Logo
  makeText({ text: 'DH', size: 22, extraBold: true, color: C.greenDk, x: 22, y: 20, parent: sidebar });
  // Sidebar items
  const sidebarItems = [
    { label: 'Home', active: false },
    { label: 'Words', active: true },
    { label: 'Practice', active: false },
    { label: 'Classes', active: false },
    { label: 'Profile', active: false },
  ];
  let siy = 70;
  sidebarItems.forEach((item) => {
    if (item.active) {
      makeRect({ w: SB_W, h: 52, fill: C.greenLt, x: 0, y: siy, parent: sidebar });
    }
    makeText({ text: item.label, size: 10, semiBold: true, color: item.active ? C.green : C.textFaint, x: (SB_W - item.label.length * 6) / 2, y: siy + 30, parent: sidebar });
    siy += 56;
  });

  // ── App Header ──
  const headerH = 56;
  const headerBar = makeFrame({ w: FRAME_W - SB_W, h: headerH, fill: C.white, x: SB_W, y: 0, parent: frame, name: 'Header', stroke: C.border });
  makeText({ text: 'My Word Bank', size: 16, bold: true, color: C.textDark, x: 28, y: 18, parent: headerBar });
  makeBadge('v8', C.bg, C.textFaint, FRAME_W - SB_W - 60, 18, headerBar, { radius: 6, fontSize: 10, w: 32, h: 22 });

  // ── Content Area ──
  const contentX = SB_W + 4;
  const contentY = headerH;
  const PAD_L = 36;
  const PAD_R = 36;
  const contentW = FRAME_W - SB_W - 8;
  const LEFT_COL = 552;
  const GAP = 20;
  const rightColW = contentW - PAD_L - PAD_R - LEFT_COL - GAP;

  // ════════════════════════════════════
  // UPPER SECTION
  // ════════════════════════════════════
  let curY = contentY + 20; // padding-top: 20px

  // ── Row 1: Practice Modules + Learning Progress Panel ──
  const row1X = contentX + PAD_L;

  // Practice buttons (4 x 120px + 3 x 20px gap = 540... but 4*120 + 3*20 = 540, we said total 552)
  // Actually: 4 buttons of 120px + 3 gaps of 24px... wait, we changed to 20px gap
  // 4*120 + 3*20 = 540. But left col is 552. Let me use the actual practice grid.
  // Practice btn width = 120, gap was changed from 24 to... let me check
  // The practice-grid gap: was 24, we changed upper-top gap to 20, but practice-grid gap might still be 24
  // Actually practice-grid gap = 24 (only upper-top and sets-grid were changed)
  // 4*120 + 3*24 = 552. OK that's correct.

  const pracBtns = [
    { name: 'Mixed\nPractice', color: '#fda4af', iconColor: '#e11d48' },
    { name: 'Spelling', color: '#93c5fd', iconColor: '#3b82f6' },
    { name: 'Multiple\nChoice', color: '#c7d2fe', iconColor: '#6366f1' },
    { name: 'Vocabs\nMirroring', color: '#fed7aa', iconColor: '#ea580c' },
  ];
  const btnW = 120;
  const btnGap = 24;
  const btnH = 100; // approximate height matching notice banner
  pracBtns.forEach((btn, i) => {
    const bx = row1X + i * (btnW + btnGap);
    const card = makeFrame({ w: btnW, h: btnH, fill: C.white, cornerRadius: 12, x: bx, y: curY, parent: frame, name: btn.name.replace('\n', ' '), stroke: C.border });
    // Icon
    const iconF = makeFrame({ w: 44, h: 44, fill: btn.color, cornerRadius: 12, x: (btnW - 44) / 2, y: 14, parent: card, name: 'Icon' });
    makeRect({ w: 44, h: 44, fill: btn.color, cornerRadius: 12, x: 0, y: 0, parent: iconF, opacity: 0.3 });
    // Name
    const lines = btn.name.split('\n');
    lines.forEach((line, li) => {
      makeText({ text: line, size: 13, bold: true, color: C.textDark, x: (btnW - line.length * 7) / 2, y: 66 + li * 16, parent: card });
    });
  });

  // Learning Progress Panel (green banner)
  const bannerX = row1X + LEFT_COL + GAP;
  const bannerH = btnH;
  const banner = makeFrame({ w: rightColW, h: bannerH, fill: C.green, cornerRadius: 10, x: bannerX, y: curY, parent: frame, name: 'Learning Progress Panel' });
  // Gradient effect - lighter overlay on right
  makeRect({ w: rightColW / 2, h: bannerH, fill: '#77ED8B', x: rightColW / 2, y: 0, parent: banner, opacity: 0.4 });

  makeText({ text: 'In the last 7 days, you mastered', size: 16, bold: true, color: C.white, x: 25, y: 20, parent: banner });
  // Words badge
  makeBadge('14 words', C.white, C.greenDk, 25, 44, banner, { radius: 6, fontSize: 14, w: 80, h: 26 });
  makeText({ text: '!', size: 16, bold: true, color: C.white, x: 112, y: 46, parent: banner });
  // How it works button
  makeBadge('How it works', C.white, C.greenD2, rightColW - 120, 20, banner, { radius: 8, w: 100, h: 26, fontSize: 11 });
  // Subtitle
  makeText({ text: 'A little progress every day — keep it up!', size: 12, color: C.white, x: 25, y: 56, parent: banner });
  // Streak
  const streakBg = makeFrame({ w: 110, h: 26, fill: C.white, cornerRadius: 14, x: 25, y: 74, parent: banner, name: 'Streak' });
  makeRect({ w: 110, h: 26, fill: C.white, cornerRadius: 14, x: 0, y: 0, parent: streakBg, opacity: 0.2 });
  makeText({ text: '\uD83D\uDD25 12 day streak', size: 12, semiBold: true, color: C.white, x: 10, y: 5, parent: streakBg });

  curY += btnH + GAP; // gap: 20px

  // ── Row 2: Featured Card + Recommended Cards ──
  const cardH = 200;

  // Top 10 Most Missed (大推薦卡)
  const featCard = makeFrame({ w: LEFT_COL, h: cardH, fill: C.white, cornerRadius: 14, x: row1X, y: curY, parent: frame, name: 'Top 10 Most Missed', stroke: C.border });
  makeText({ text: 'Top 10 Most Missed', size: 15, bold: true, color: C.textDark, x: 20, y: 16, parent: featCard });
  makeText({ text: 'Most missed words in the last 30 days', size: 11, color: C.textMuted, x: 20, y: 36, parent: featCard });

  // Word tags
  const wordTags = ['photosynthesis', 'ecosystem', 'metamorphosis', 'hypothesis', 'chromosome', 'precipitation', 'evaporation', 'condensation', 'atmosphere', 'biodiversity'];
  let tagX = 20;
  let tagY = 60;
  const tagH = 30;
  const tagGap = 10;
  wordTags.forEach((word) => {
    const tw = word.length * 7 + 20;
    if (tagX + tw > LEFT_COL - 20) {
      tagX = 20;
      tagY += tagH + tagGap;
    }
    makeBadge(word, C.bgLight, C.textBody, tagX, tagY, featCard, { radius: 8, fontSize: 11, w: tw, h: tagH });
    tagX += tw + tagGap;
  });

  // Practice link
  makeText({ text: 'Practice \u203A', size: 13, bold: true, color: C.green, x: LEFT_COL - 90, y: cardH - 28, parent: featCard });

  // 3 Recommended Practice Cards (推薦練習卡)
  const smallCards = [
    { count: '8 words', name: 'Weekly Review Focus', desc: 'Words added this week', link: 'Practice \u203A' },
    { count: '12 words', name: 'Not Yet Tested', desc: "Words you haven't practiced yet", link: 'Practice \u203A' },
    { count: 'Spelling \u00B7 32% avg', name: 'Weakest Skill', desc: 'Your lowest scoring practice type', link: 'Practice Spelling \u203A' },
  ];
  const smallGap = 20;
  const smallH = (cardH - smallGap * 2) / 3;
  // Actually the 3 small cards are stacked vertically? No, they are side by side with the large card.
  // Looking at the layout: large card (552px) + 3 small cards share remaining width
  // The sets-grid is flex with gap 20px. So: 552 + 20 + card2 + 20 + card3 + 20 + card4
  // Each small card = (contentW - PAD_L - PAD_R - 552 - 3*20) / 3
  const smallCardW = (contentW - PAD_L - PAD_R - LEFT_COL - GAP * 3) / 3;
  // Wait, that doesn't seem right. Let me recalculate.
  // sets-grid: flex with gap 20px, first child 552px fixed, rest flex:1
  // Total width = contentW - PAD_L - PAD_R
  // 552 + 20 + smallW + 20 + smallW + 20 + smallW = total
  // 3*smallW = total - 552 - 60
  const totalInner = contentW - PAD_L - PAD_R;
  const smallW = (totalInner - LEFT_COL - GAP * 3) / 3;

  smallCards.forEach((sc, i) => {
    const sx = row1X + LEFT_COL + GAP + i * (smallW + GAP);
    const scard = makeFrame({ w: smallW, h: cardH, fill: C.white, cornerRadius: 14, x: sx, y: curY, parent: frame, name: sc.name, stroke: C.border });
    makeText({ text: sc.count, size: 11, bold: true, color: C.green, x: 16, y: 16, parent: scard, letterSpacing: 0.3 });
    makeText({ text: sc.name, size: 14, bold: true, color: C.textDark, x: 16, y: 36, parent: scard });
    makeText({ text: sc.desc, size: 11, color: C.textMuted, x: 16, y: 56, w: smallW - 32, parent: scard });
    makeText({ text: sc.link, size: 12, bold: true, color: C.green, x: smallW - sc.link.length * 7 - 10, y: cardH - 28, parent: scard });
  });

  curY += cardH + GAP;

  // ════════════════════════════════════
  // COLLAPSE TOGGLE
  // ════════════════════════════════════
  const collapseY = curY;
  makeLine({ w: totalInner * 0.4, x: row1X, y: collapseY + 10, parent: frame, color: C.sepBread });
  makeText({ text: 'Collapse \u25B2', size: 10, semiBold: true, color: C.textFaint, x: row1X + totalInner / 2 - 30, y: collapseY + 3, parent: frame });
  makeLine({ w: totalInner * 0.4, x: row1X + totalInner * 0.6, y: collapseY + 10, parent: frame, color: C.sepBread });
  curY = collapseY + 20;

  // ════════════════════════════════════
  // FILTERS
  // ════════════════════════════════════
  curY += 20; // padding-top: 20px
  const filterTabs = ['All 36', 'By Subject', 'Live Classes 15', 'Teacher Added 10', 'Learning 21', 'Mastered 15'];
  let ftX = row1X;
  filterTabs.forEach((tab, i) => {
    const tw = tab.length * 7 + 28;
    const isActive = i === 0;
    makeBadge(tab, isActive ? C.green : C.white, isActive ? C.white : C.textMuted, ftX, curY, frame, { radius: 20, fontSize: 12, w: tw, h: 32, ...(isActive ? {} : { stroke: C.border }) });
    // Add stroke for inactive tabs
    if (!isActive) {
      // We can't easily add stroke via makeBadge, but the visual shows border
    }
    ftX += tw + 6;
  });
  curY += 52; // tabs height + gap

  // ════════════════════════════════════
  // LOWER SECTION: Word Card + Word List
  // ════════════════════════════════════
  const lowerH = 400;

  // Word Card (left, 552px)
  const wcFrame = makeFrame({ w: LEFT_COL, h: lowerH, fill: C.white, cornerRadius: 10, x: row1X, y: curY, parent: frame, name: 'Word Card', stroke: C.border });

  // Word card header
  makeText({ text: 'NEWEST WORD', size: 10, semiBold: true, color: C.green, x: 24, y: 28, parent: wcFrame, letterSpacing: 0.3 });
  makeText({ text: 'hypothesis', size: 24, extraBold: true, color: C.textDark, x: 24, y: 48, parent: wcFrame });
  // Play button
  makeEllipse({ w: 28, h: 28, fill: C.greenLt, x: 180, y: 48, parent: wcFrame, stroke: C.greenBdr });
  // POS badge
  makeBadge('noun', C.greenLt, C.greenDk, 24, 82, wcFrame, { radius: 4, fontSize: 11, w: 42 });
  // Phonetic
  makeText({ text: '/ha\u026A\u02C8p\u0252\u03B8\u0259s\u026As/', size: 12, color: C.textMuted, x: 74, y: 84, parent: wcFrame });

  // Mastery bar
  makeText({ text: 'MASTERY', size: 10, color: C.textFaint, x: LEFT_COL - 140, y: 30, parent: wcFrame, letterSpacing: 0.3 });
  makeProgressBar(40, LEFT_COL - 140, 46, 100, 8, wcFrame, { showLabel: true });

  // Definition
  let wcY = 116;
  makeText({ text: 'A proposed explanation made on the basis of limited evidence as a starting point for further investigation.', size: 13, color: C.textSec, x: 24, y: wcY, w: LEFT_COL - 48, parent: wcFrame });
  wcY += 50;

  // Translation
  makeText({ text: '\u5047\u8AAA\uFF1B\u5047\u8A2D', size: 14, semiBold: true, color: C.textDark, x: 24, y: wcY, parent: wcFrame });
  wcY += 30;

  // Example
  makeText({ text: 'EXAMPLE', size: 10, color: C.textFaint, x: 24, y: wcY, parent: wcFrame, letterSpacing: 0.3 });
  wcY += 18;
  const exCtx = makeFrame({ w: LEFT_COL - 48, h: 36, fill: C.bgLight, cornerRadius: 6, x: 24, y: wcY, parent: wcFrame });
  makeRect({ w: 3, h: 36, fill: C.green, x: 0, y: 0, parent: exCtx });
  makeText({ text: 'We need to test our hypothesis before drawing any conclusions.', size: 12, color: C.textBody, x: 12, y: 10, w: LEFT_COL - 80, parent: exCtx });
  wcY += 50;

  // Meta tags
  makeBadge('Science', C.blueLt, C.blueDk, 24, wcY, wcFrame, { radius: 6, fontSize: 11, w: 60, h: 22 });
  makeBadge('Live Classroom', C.greenLt, C.greenDk, 92, wcY, wcFrame, { radius: 6, fontSize: 11, w: 100, h: 22 });
  wcY += 36;

  // Toggle
  const toggleY = wcY + 10;
  makeRect({ w: 36, h: 20, fill: C.border, cornerRadius: 10, x: 24, y: toggleY, parent: wcFrame });
  makeEllipse({ w: 16, h: 16, fill: C.white, x: 26, y: toggleY + 2, parent: wcFrame });
  makeText({ text: 'Show translation during review', size: 11, color: C.textMuted, x: 68, y: toggleY + 2, parent: wcFrame });

  // Nav footer
  const wcNavY = lowerH - 40;
  makeLine({ w: LEFT_COL, x: 0, y: wcNavY, parent: wcFrame, color: C.border });
  makeBadge('\u2190 Prev', C.bgLight, C.sepBread, 24, wcNavY + 10, wcFrame, { radius: 6, w: 60, h: 24, fontSize: 11 });
  makeText({ text: '1 / 36', size: 11, semiBold: true, color: C.textFaint, x: LEFT_COL / 2 - 15, y: wcNavY + 14, parent: wcFrame });
  makeBadge('Next \u2192', C.greenLt, C.greenDk, LEFT_COL - 84, wcNavY + 10, wcFrame, { radius: 6, w: 60, h: 24, fontSize: 11 });

  // Word List (right)
  const wlX = row1X + LEFT_COL + GAP;
  const wlW = totalInner - LEFT_COL - GAP;
  const wlFrame = makeFrame({ w: wlW, h: lowerH, fill: C.white, cornerRadius: 10, x: wlX, y: curY, parent: frame, name: 'Word List', stroke: C.border, clip: true });

  makeText({ text: 'Word List', size: 14, bold: true, color: C.textDark, x: 20, y: 16, parent: wlFrame });
  makeBadge('36', C.bg, C.textMuted, 100, 16, wlFrame, { radius: 10, fontSize: 11, w: 30, h: 22 });

  // Word list items
  const wlWords = [
    { word: 'hypothesis', tl: '\u5047\u8AAA', pct: 40, active: true },
    { word: 'photosynthesis', tl: '\u5149\u5408\u4F5C\u7528', pct: 60 },
    { word: 'equation', tl: '\u65B9\u7A0B\u5F0F', pct: 20 },
    { word: 'revolution', tl: '\u9769\u547D', pct: 80 },
    { word: 'democracy', tl: '\u6C11\u4E3B', pct: 100 },
    { word: 'latitude', tl: '\u7DEF\u5EA6', pct: 0 },
    { word: 'molecule', tl: '\u5206\u5B50', pct: 100 },
    { word: 'organism', tl: '\u6709\u6A5F\u9AD4', pct: 45 },
  ];
  let wly = 48;
  wlWords.forEach((w) => {
    if (w.active) {
      makeRect({ w: wlW, h: 44, fill: C.greenLt, x: 0, y: wly, parent: wlFrame });
    }
    makeText({ text: w.word, size: 13, bold: true, color: C.textDark, x: 20, y: wly + 8, parent: wlFrame });
    makeText({ text: w.tl, size: 10, color: C.textFaint, x: 20, y: wly + 26, parent: wlFrame });
    makeProgressBar(w.pct, wlW - 80, wly + 14, 50, 5, wlFrame, { showLabel: true, labelSize: 9 });
    makeLine({ w: wlW - 40, x: 20, y: wly + 43, parent: wlFrame, color: C.borderLt });
    wly += 44;
  });

  return frame;
}

// ============================================================
// MAIN — Build all wireframes
// ============================================================
async function main() {
  await loadFonts();

  // Create a new page
  const page = figma.createPage();
  page.name = 'ESL Student — Wireframes';
  figma.currentPage = page;

  // Section labels
  const sectionTitleStyle = { size: 20, extraBold: true, color: C.textDark };

  // ── Section A ──
  makeText({ text: 'A \u2014 Word Bank Homepage', ...sectionTitleStyle, x: 0, y: 60, parent: page });
  makeText({ text: 'Main dashboard with sidebar categories, Learning Progress chart, and word overview grid.', size: 13, color: C.textMuted, x: 0, y: 86, parent: page });
  buildWireframeA(page);

  // ── Section B ──
  const bY = 100 + 680 + 20;
  makeText({ text: 'B \u2014 Filtered View \u2014 Sidebar "Science" selected', ...sectionTitleStyle, x: 0, y: bY, parent: page });
  makeText({ text: 'Category-filtered word list with word cards, detail table, and Practice button.', size: 13, color: C.textMuted, x: 0, y: bY + 26, parent: page });
  buildWireframeB(page);

  // ── Section C ──
  const cY = 100 + 680 + 60 + 680 + 20;
  makeText({ text: 'C \u2014 Practice Setup \u2014 From Homepage Shortcut', ...sectionTitleStyle, x: 0, y: cY, parent: page });
  makeText({ text: 'Popup overlay with Step 1 pre-selected, starting at Step 2 (Word Category).', size: 13, color: C.textMuted, x: 0, y: cY + 26, parent: page });
  buildWireframeC(page);

  // ── Section D ──
  const dY = 100 + 680 + 60 + 680 + 60 + 560 + 20;
  makeText({ text: 'D \u2014 Practice Setup \u2014 From Category Page', ...sectionTitleStyle, x: 0, y: dY, parent: page });
  makeText({ text: 'Popup overlay starting at Step 1 with scope locked to selected category.', size: 13, color: C.textMuted, x: 0, y: dY + 26, parent: page });
  buildWireframeD(page);

  // ── Section E ──
  const eY = 100 + 680 + 60 + 680 + 60 + 560 + 60 + 560 + 20;
  makeText({ text: 'E \u2014 Word Bank Homepage v8 (Current Design)', ...sectionTitleStyle, x: 0, y: eY, parent: page });
  makeText({ text: 'Updated homepage with unified 20px gaps, 3D icons, practice modules, learning progress panel, featured + recommended cards.', size: 13, color: C.textMuted, x: 0, y: eY + 26, parent: page });
  buildWireframeE(page);

  // Zoom to fit
  figma.viewport.scrollAndZoomIntoView(page.children);

  figma.notify('ESL Student Wireframes created successfully! \u2728');
  figma.closePlugin();
}

main();
