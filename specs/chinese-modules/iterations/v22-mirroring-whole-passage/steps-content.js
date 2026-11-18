/* ===========================================================================
   v22 老師端第一、二步（Content → Edit Sentences）—— 基準與提案共用同一份
   2026-11-16：使用者「現在 demo 只有 Settings 頁，把前一步也補齊」。
   Reading unit 是在第三步 Settings 才選，所以第一、二步提案跟現行一樣，兩邊載同一支檔，
   之後提案若要動這兩步再分岔。

   出處（dahua-dash origin/develop @ 1c1870bb，2026-11-16 fetch）：
     src/utils/practice-stepper-config.js                                   MIRRORING 四步：Content, Edit Sentences, Settings, Assign Practice（#1081，10/23）
     src/sections/practice/view/unified/steps/step-one-mirroring.js         Project 選單 ＋ Practice name（Stack spacing 3）＋ 課文 frame
     src/sections/practice/view/unified/components/step-one/source-select.js   label 14/600 · 外框選單 maxWidth 520 · 選單裡 PROJECT 小標 · 一列＝語言 mark ＋ 名稱 ＋ 等級 ＋ 行數（沒內容紅字 No content）＋ 勾
     src/sections/practice/view/unified/components/step-one/practice-name-field.js  Practice name，選專案時自動帶專案名，老師打過就不再蓋
     src/sections/practice/view/qa/create/article-preview-section.js        mt 32 · ContentFrame「Article content · N lines」· 沒內容＝warning Alert ＋ Edit Project
     src/sections/practice/view/unified/components/step-one/content-frame.js   wash #EFFBF4 r14 p3 · 白板 r11 · ArticleLines 編號 ＋ 細線 · maxHeight 360
     src/utils/practice-step-one.js  getArticleLines                        一行＝課文的一段（換行切），不是一句
     src/sections/practice/view/unified/steps/shared/step-validators.js     沒選專案：Please select a project. · 沒內容：Next 灰掉
     src/sections/practice/view/unified/steps/mirroring-sentences-step.js   第二步：生成中＝ProcessingPanel isSplitting；之後 ContentFrame「Sentences · Split from X · N sentences · M hidden」＋ 底下一行 caption
     src/sections/practice/components/mirroring-sentence-editor.js          每句一列：編號 ＋ 句子 ＋ Split 藥丸 ＋ 眼睛；兩列之間虛線＋Merge with previous；切的時候字距拉開、詞與詞之間綠色切點
     src/utils/mirroring-sentence-ops.js                                    有逐詞拼音時切點在詞尾；全部藏起來＝Keep at least one sentence.；中文合併 joiner ''
     src/sections/practice/view/unified/components/processing-panel.js ＋ src/utils/processing-dialog-copy.js   Splitting sentences... 三段 Analyzing／Building／Finalizing
     src/utils/practice-step-gating.js  resolvePrimaryActionLabel           第一、二步主鈕 Next，Settings 是 Save
     src/components/snackbar/snackbar-provider.js                          snackbar 右上角、3 秒

   demo 的簡化：ProcessingPanel 產品每 10 秒進一段、等後端回；這裡每 0.9 秒一段、2.8 秒後直接出句子。
   離開第二步時把改過的句子寫回 M.SENTENCES，第三步的 Student view 跟著變（切開的後半句沒有翻譯——產品存檔後由後端重產）。
   網址參數（頁面那邊解析後傳進來）：&proj=1 已選專案 · &proj=2 選了沒內容的專案 · &dd=1 選單打開
                                 &gen=1 第二步生成中（停住不跑完）· &cut=N 第 N 句在切 · &hid=N 第 N 句藏起來
   =========================================================================== */
window.V22Steps = (function () {
  const M = window.V22;
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

  /* ---------- 樣式（只用 s12- 開頭，避免撞到兩頁原本的 class） ---------- */
  const CSS = `
.s12-stack{ display:flex; flex-direction:column; gap:24px; }
.s12-field{ display:flex; flex-direction:column; gap:8px; max-width:520px; position:relative; }
.s12-label{ font-size:14px; font-weight:600; }
.s12-select{ display:flex; align-items:center; gap:10px; min-height:40px; padding:6px 10px 6px 14px; background:#fff; border:1px solid rgba(145,158,171,.32); border-radius:8px; font-size:14px; font-weight:600; cursor:pointer; text-align:left; width:100%; color:var(--text); }
.s12-select:hover{ border-color:var(--text); }
.s12-select.open{ border:2px solid var(--text); padding:5px 9px 5px 13px; }
.s12-select .ph{ color:var(--text3); font-weight:600; flex:1; }
.s12-select .caret{ font-size:18px; color:var(--text2); margin-left:auto; flex:none; }
.s12-mark{ height:22px; padding:0 8px; flex:none; display:inline-flex; align-items:center; border-radius:6px; font-size:11px; font-weight:700; letter-spacing:.2px; background:#EFF6FF; color:#1D4ED8; }
.s12-name{ flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.s12-level{ padding:1px 8px; flex:none; border-radius:6px; font-size:11px; font-weight:700; background:#F0FDF4; color:#065F46; }
.s12-count{ flex:none; font-size:12px; font-weight:400; color:var(--text2); } .s12-count.warn{ color:#FF5630; }
.s12-menu{ position:absolute; top:calc(100% + 6px); left:0; right:0; z-index:60; background:#fff; border-radius:10px; padding:4px; max-height:360px; overflow:auto; box-shadow:0 0 2px rgba(145,158,171,.24), -20px 20px 40px -4px rgba(145,158,171,.24); }
.s12-menu .sub{ font-size:11px; font-weight:700; letter-spacing:.6px; text-transform:uppercase; color:var(--text3); line-height:30px; padding:0 12px; }
.s12-menu .it{ display:flex; align-items:center; gap:10px; padding:6px 8px; border-radius:6px; font-size:14px; cursor:pointer; }
.s12-menu .it:hover{ background:rgba(145,158,171,.08); } .s12-menu .it.on{ background:rgba(0,203,97,.08); font-weight:600; }
.s12-menu .it .ck{ font-size:18px; flex:none; color:var(--primary); visibility:hidden; } .s12-menu .it.on .ck{ visibility:visible; }
.s12-input{ height:40px; padding:0 14px; background:#fff; border:1px solid rgba(145,158,171,.32); border-radius:8px; font-family:inherit; font-size:14px; color:var(--text); }
.s12-input:hover{ border-color:var(--text); } .s12-input:focus{ outline:0; border:2px solid var(--text); padding:0 13px; }
.s12-frame{ display:flex; flex-direction:column; gap:3px; padding:3px; border-radius:14px; background:#EFFBF4; }
.s12-frame .fh{ padding:8px 16px; } .s12-frame .ft{ font-size:14px; font-weight:600; } .s12-frame .fd{ font-size:14px; color:var(--text2); }
.s12-frame .fb{ position:relative; background:#fff; border:1px solid var(--divider); border-radius:11px; box-shadow:0 1px 2px rgba(33,43,54,.05); padding:16px; }
.s12-lines{ max-height:360px; overflow-y:auto; }
.s12-line{ display:flex; gap:12px; align-items:baseline; padding:7px 0; } .s12-line + .s12-line{ border-top:1px solid var(--divider); }
.s12-line .n{ min-width:20px; flex:none; text-align:right; font-size:12px; color:var(--text3); font-variant-numeric:tabular-nums; }
.s12-line .t{ flex:1; font-size:16px; line-height:1.75; }
.s12-alert{ display:flex; align-items:center; gap:12px; padding:6px 16px; border-radius:8px; background:#FFF5CC; color:#7A4100; font-size:14px; }
.s12-alert .mi{ font-size:22px; color:#FFAB00; flex:none; } .s12-alert .tx{ flex:1; padding:8px 0; }
.s12-alert .act{ display:inline-flex; align-items:center; gap:4px; border:0; background:transparent; color:#B76E00; font-size:13px; font-weight:700; padding:4px 6px; border-radius:6px; }
.s12-alert .act .mi{ font-size:16px; color:inherit; } .s12-alert .act:hover{ background:rgba(255,171,0,.08); }
/* 第二步：句子清單 */
.s12-row{ display:flex; align-items:flex-start; gap:12px; padding:14px 6px; border-radius:8px; }
.s12-row.cutting{ background:#EFFBF4; }
.s12-row .n{ min-width:18px; flex:none; text-align:right; padding-top:6px; font-size:12px; color:var(--text3); font-variant-numeric:tabular-nums; }
.s12-row .t{ flex:1; min-width:0; font-size:16px; line-height:1.7; }
.s12-row.hidden .t{ opacity:.45; text-decoration:line-through; }
.s12-row.cutting .t{ letter-spacing:1px; }
.s12-row .hint{ display:block; margin-top:4px; font-size:12px; color:var(--primary-dark); letter-spacing:0; }
.s12-cutpt{ display:inline-block; width:4px; height:1.25em; vertical-align:-5px; margin:0 3px; padding:0; border:0; border-radius:3px; background:rgba(0,167,73,.45); cursor:pointer; transition:background-color .12s, transform .12s; }
.s12-cutpt:hover, .s12-cutpt:focus-visible{ background:var(--primary-dark); transform:scaleX(1.6); outline:0; }
.s12-row .acts{ display:flex; align-items:center; gap:2px; flex:none; }
.s12-pill{ height:28px; padding:0 10px; border-radius:999px; font-size:12px; font-weight:700; display:inline-flex; align-items:center; gap:4px; border:1px solid var(--divider); background:#fff; color:var(--text); margin-right:4px; }
.s12-pill .mi{ font-size:16px; } .s12-pill:hover{ border-color:var(--primary); color:var(--primary-dark); background:#F2FBF6; }
.s12-pill.on{ background:var(--primary); border-color:var(--primary); color:#fff; } .s12-pill.on:hover{ background:var(--primary-dark); color:#fff; }
.s12-eye{ width:30px; height:30px; border-radius:50%; border:0; background:transparent; color:var(--text3); display:flex; align-items:center; justify-content:center; }
.s12-eye .mi{ font-size:20px; } .s12-eye:hover{ background:rgba(145,158,171,.08); } .s12-eye.off{ color:var(--text2); }
.s12-div{ position:relative; height:1px; margin:10px 6px; border-top:1px dashed var(--divider); }
.s12-merge{ position:absolute; top:-14px; left:30px; height:28px; padding:0 10px; border-radius:999px; font-size:12px; font-weight:700; display:inline-flex; align-items:center; gap:4px; background:#fff; color:var(--primary-dark); border:1px solid rgba(0,203,97,.45); }
.s12-merge .mi{ font-size:16px; } .s12-merge:hover{ background:#F2FBF6; border-color:var(--primary); }
.s12-cap{ display:block; margin-top:8px; padding:0 16px; font-size:12px; color:var(--text2); }
/* ProcessingPanel（isSplitting） */
.s12-proc .bar{ height:4px; background:#C8FAD6; overflow:hidden; border-radius:2px; position:relative; }
.s12-proc .bar::after{ content:''; position:absolute; top:0; bottom:0; left:-40%; width:40%; background:#22C55E; animation:s12bar 1.4s ease-in-out infinite; }
@keyframes s12bar{ to{ left:100%; } }
.s12-proc .bd{ text-align:center; padding:40px 24px; }
.s12-proc .h5{ font-size:20px; font-weight:700; margin-bottom:4px; }
.s12-proc .sub{ font-size:14px; color:var(--text2); margin-bottom:32px; }
.s12-proc .stg{ display:flex; justify-content:center; align-items:flex-start; margin-bottom:32px; padding:0 16px; }
.s12-proc .ln{ flex:1; height:3px; margin-top:20px; border-radius:8px; background:var(--grey200); transition:background-color .5s; } .s12-proc .ln.on{ background:var(--primary); }
.s12-proc .st{ width:120px; display:flex; flex-direction:column; align-items:center; }
.s12-proc .dot{ width:40px; height:40px; border-radius:50%; background:var(--grey200); display:flex; align-items:center; justify-content:center; margin-bottom:8px; transition:all .5s; }
.s12-proc .dot .mi{ font-size:22px; color:#C4CDD5; } .s12-proc .st.on .dot{ background:var(--primary); } .s12-proc .st.on .dot .mi{ color:#fff; }
.s12-proc .st b{ font-size:12px; font-weight:700; color:var(--text3); line-height:1.2; } .s12-proc .st.on b{ color:var(--primary); }
.s12-proc .info{ background:#F0FDF4; border-radius:16px; padding:20px; margin-bottom:24px; display:flex; gap:16px; align-items:center; text-align:left; }
.s12-proc .info .ic{ width:48px; height:48px; border-radius:50%; background:#DCFCE7; display:flex; align-items:center; justify-content:center; flex:none; }
.s12-proc .info .ic .mi{ font-size:28px; color:#10B981; }
.s12-proc .info b{ display:block; font-size:14px; font-weight:700; } .s12-proc .info span{ font-size:12px; color:var(--text2); }
.s12-proc .wait{ display:flex; justify-content:center; align-items:center; gap:8px; font-size:12px; color:var(--text3); }
.s12-spin{ width:16px; height:16px; border-radius:50%; border:2px solid #C4CDD5; border-top-color:transparent; animation:s12spin .8s linear infinite; display:inline-block; }
@keyframes s12spin{ to{ transform:rotate(360deg); } }
/* 頁腳主鈕載入中（LoadingButton） */
.btn.loading{ color:transparent !important; position:relative; pointer-events:none; background:rgba(145,158,171,.24) !important; box-shadow:none !important; }
.btn.loading::after{ content:''; position:absolute; left:50%; top:50%; width:16px; height:16px; margin:-8px 0 0 -8px; border-radius:50%; border:2px solid rgba(145,158,171,.8); border-top-color:transparent; animation:s12spin .8s linear infinite; }
.btn:disabled{ pointer-events:none; }
.btn.contained:disabled{ background:rgba(145,158,171,.24); color:rgba(145,158,171,.8); box-shadow:none; }
.btn.text:disabled{ color:rgba(145,158,171,.8); }
/* snackbar（右上） */
.s12-snack{ position:fixed; top:24px; right:24px; z-index:200; display:flex; align-items:center; gap:12px; min-width:280px; padding:6px 16px 6px 6px; border-radius:8px; background:#212B36; color:#fff; font-size:14px; font-weight:600; box-shadow:0 8px 16px rgba(0,0,0,.24); }
.s12-snack .ic{ width:40px; height:40px; border-radius:6px; background:rgba(255,171,0,.16); display:flex; align-items:center; justify-content:center; } .s12-snack .ic .mi{ color:#FFAB00; font-size:24px; }
`;
  const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);

  /* ---------- 假資料：專案 ---------- */
  // 課文一行＝一段（getArticleLines 照換行切）。六句分成三段，第二步後端再切成句子。
  const PARAS = [[0, 1], [2, 3], [4, 5]];
  const PROJECTS = [
    { sk: 'p1', name: M.PROJECT.name, lang: M.PROJECT.lang, level: M.PROJECT.level, lines: PARAS.map((p) => p.map((i) => M.SENTENCES[i].zh).join('')) },
    { sk: 'p2', name: '我的家人', lang: 'zh-CN', level: 'HSK 2', lines: [] },   // 沒內容
  ];
  const ORIGINAL = M.SENTENCES.map((s) => ({ words: s.words.map((w) => w.slice()), tr: s.tr, dur: s.dur }));

  /* ---------- 狀態 ---------- */
  const S = { proj: null, name: '', nameEdited: false, dd: false, gen: false, stage: 0, rows: null, cut: -1, snack: '' };
  const toRow = (s) => ({ words: s.words.map((w) => w.slice()), tr: s.tr, dur: s.dur, hidden: false });
  const proj = () => PROJECTS.find((p) => p.sk === S.proj) || null;
  const zhOf = (r) => r.words.map((w) => w[0]).join('');

  const init = (qs) => {
    const p = qs.get('proj');
    if (p === '1' || p === '2') { S.proj = p === '1' ? 'p1' : 'p2'; S.name = proj().name; }
    S.dd = qs.get('dd') === '1';
    S.gen = qs.get('gen') === '1';
    S.rows = ORIGINAL.map(toRow);
    const hid = parseInt(qs.get('hid') || '', 10); if (hid >= 1 && hid <= S.rows.length) S.rows[hid - 1].hidden = true;
    const cut = parseInt(qs.get('cut') || '', 10); if (cut >= 1 && cut <= S.rows.length) S.cut = cut - 1;
  };

  /* ---------- 第一步 ---------- */
  const optRow = (p) => `<span class="s12-mark">${p.lang}</span><span class="s12-name">${esc(p.name)}</span><span class="s12-level">${p.level}</span><span class="s12-count ${p.lines.length ? '' : 'warn'}">${p.lines.length ? `${p.lines.length} ${p.lines.length === 1 ? 'line' : 'lines'}` : 'No content'}</span>`;
  const step1 = () => {
    const p = proj();
    const menu = S.dd ? `<div class="s12-menu" role="listbox"><div class="sub">Project</div>${PROJECTS.map((o) => `<div class="it ${o.sk === S.proj ? 'on' : ''}" role="option" data-s12="pick" data-v="${o.sk}">${optRow(o)}<span class="mi ck">check</span></div>`).join('')}</div>` : '';
    const article = !p ? '' : p.lines.length
      ? `<div style="margin-top:32px"><div class="s12-frame"><div class="fh"><div class="ft">Article content</div><div class="fd">${p.lines.length} lines</div></div>
          <div class="fb"><div class="s12-lines">${p.lines.map((l, n) => `<div class="s12-line"><span class="n">${n + 1}</span><span class="t">${esc(l)}</span></div>`).join('')}</div></div></div></div>`
      : `<div style="margin-top:32px"><div class="s12-alert" role="alert"><span class="mi">warning</span><span class="tx">${esc(p.name)}: this project has no article content yet. Add content to use it for practice.</span><button class="act" type="button"><span class="mi">edit</span>Edit Project</button></div></div>`;
    return `<div class="s12-stack">
      <div class="s12-field"><span class="s12-label" id="s12-proj-l">Project</span>
        <button type="button" class="s12-select ${S.dd ? 'open' : ''}" data-s12="dd" aria-haspopup="listbox" aria-expanded="${S.dd}" aria-labelledby="s12-proj-l">${p ? optRow(p) : '<span class="ph">Pick a project</span>'}<span class="mi caret">expand_more</span></button>${menu}</div>
      <div class="s12-field"><label class="s12-label" for="practice-name">Practice name</label><input class="s12-input" id="practice-name" type="text" value="${esc(S.name)}" data-s12name></div>
    </div>${article}`;
  };

  /* ---------- 第二步 ---------- */
  const PROC = [['auto_awesome', 'Analyzing'], ['route', 'Building'], ['check_circle', 'Finalizing']];
  const proc = () => `<div class="s12-proc"><div class="bar"></div><div class="bd">
      <div class="h5">Splitting sentences...</div><div class="sub">This may take a few moments.</div>
      <div class="stg">${PROC.map(([ic, l], i) => `${i ? `<div class="ln ${i <= S.stage ? 'on' : ''}"></div>` : ''}<div class="st ${i <= S.stage ? 'on' : ''}"><div class="dot"><span class="mi">${ic}</span></div><b>${l}</b></div>`).join('')}</div>
      <div class="info"><span class="ic"><span class="mi">content_cut</span></span><div><b>Splitting the article into sentences</b><span>We’re splitting the project’s article into sentences for you to review.</span></div></div>
      <div class="wait"><span class="s12-spin"></span>Please don’t close this page</div></div></div>`;
  const rowText = (r, i) => {
    if (S.cut !== i) return esc(zhOf(r));
    // 切點：每個詞的詞尾，兩邊都還有字才算（splitPointsOf）
    return r.words.map((w, k) => `${esc(w[0])}${k < r.words.length - 1 ? `<button type="button" class="s12-cutpt" data-s12="cutat" data-i="${i}" data-k="${k}" aria-label="Break after ${esc(r.words.slice(0, k + 1).map((x) => x[0]).join(''))}"></button>` : ''}`).join('');
  };
  const step2 = () => {
    if (S.gen) return proc();
    const hidden = S.rows.filter((r) => r.hidden).length, shown = S.rows.length - hidden;
    const desc = [`Split from ${proj() ? proj().name : M.PROJECT.name}`, `${shown} ${shown === 1 ? 'sentence' : 'sentences'}`, hidden ? `${hidden} hidden` : ''].filter(Boolean).join(' · ');
    const list = S.rows.map((r, i) => {
      const prev = S.rows[i - 1], cutting = S.cut === i;
      const canMerge = i > 0 && !r.hidden && !prev.hidden;
      return `${i ? `<div class="s12-div">${canMerge ? `<button type="button" class="s12-merge" data-s12="merge" data-i="${i}"><span class="mi">call_merge</span>Merge with previous</button>` : ''}</div>` : ''}
        <div class="s12-row ${r.hidden ? 'hidden' : ''} ${cutting ? 'cutting' : ''}"><span class="n">${i + 1}</span>
          <div class="t">${rowText(r, i)}${cutting ? '<span class="hint">Click where the sentence should break.</span>' : ''}</div>
          <div class="acts">${r.hidden ? '' : `<button type="button" class="s12-pill ${cutting ? 'on' : ''}" data-s12="cut" data-i="${i}"><span class="mi">${cutting ? 'close' : 'content_cut'}</span>${cutting ? 'Cancel' : 'Split'}</button>`}
            <button type="button" class="s12-eye ${r.hidden ? 'off' : ''}" data-s12="hide" data-i="${i}" aria-pressed="${r.hidden}" aria-label="${r.hidden ? 'Show this sentence' : 'Hide from students'}" title="${r.hidden ? 'Show this sentence' : 'Hide from students'}"><span class="mi">${r.hidden ? 'visibility_off' : 'visibility'}</span></button></div>
        </div>`;
    }).join('');
    return `<div class="s12-frame"><div class="fh"><div class="ft">Sentences</div><div class="fd">${desc}</div></div><div class="fb">${list}</div></div>
      ${hidden ? '<span class="s12-cap">Hidden sentences are left out of the practice when you continue.</span>' : ''}`;
  };

  /* ---------- 對外 ---------- */
  let rerender = () => {};
  let timer = null;
  const snack = (msg) => {
    document.querySelector('.s12-snack')?.remove();
    const d = document.createElement('div'); d.className = 's12-snack'; d.setAttribute('role', 'status');
    d.innerHTML = `<span class="ic"><span class="mi">warning</span></span>${esc(msg)}`;
    document.body.appendChild(d); setTimeout(() => d.remove(), 3000);
  };
  const startSplitting = () => {
    S.gen = true; S.stage = 0; clearInterval(timer);
    timer = setInterval(() => {
      S.stage += 1;
      if (S.stage > 2) { clearInterval(timer); S.gen = false; }
      rerender();
    }, 900);
  };
  const render = (step) => (step === 1 ? step1() : step2());
  // 頁腳：第一、二步 Back／Next（Next 生成中轉圈；選了沒內容的專案灰掉）
  const footer = (step) => {
    const backDis = step === 1 || S.gen;
    const nextDis = step === 1 && proj() && !proj().lines.length;
    return `<button class="btn text" data-nav="back" ${backDis ? 'disabled' : ''}>Back</button><button class="btn contained ${step === 2 && S.gen ? 'loading' : ''}" data-nav="next" ${nextDis ? 'disabled' : ''}>Next</button>`;
  };
  // 按 Next：回傳 true＝可以往下一步
  const next = (step) => {
    if (step === 1) {
      if (!proj()) { snack('Please select a project.'); return false; }
      if (!S.name.trim()) { snack('Please enter a practice name.'); return false; }
      return true;
    }
    if (S.gen) return false;
    if (S.rows.every((r) => r.hidden)) { snack('Keep at least one sentence.'); return false; }
    return true;
  };
  // 第二步改過的句子寫回 M.SENTENCES（第三步預覽用）
  const apply = () => {
    const keep = S.rows.filter((r) => !r.hidden).map((r) => ({ words: r.words.map((w) => w.slice()), tr: r.tr, dur: r.dur }));
    keep.forEach((s) => { s.zh = s.words.map((w) => w[0]).join(''); s.py = s.words.map((w) => w[1]).filter(Boolean).join(' '); });
    M.SENTENCES.splice(0, M.SENTENCES.length, ...keep);
    M.TOTAL_DUR = M.SENTENCES.reduce((a, s) => a + s.dur, 0);
  };
  const onClick = (e, step) => {
    const el = e.target.closest('[data-s12]');
    if (!el) { if (S.dd && !e.target.closest('.s12-field')) { S.dd = false; rerender(); } return false; }
    const a = el.dataset.s12, i = +el.dataset.i;
    if (a === 'dd') S.dd = !S.dd;
    else if (a === 'pick') { S.proj = el.dataset.v; S.dd = false; if (!S.nameEdited) S.name = proj().name; S.rows = ORIGINAL.map(toRow); S.cut = -1; }
    else if (a === 'cut') S.cut = S.cut === i ? -1 : i;
    else if (a === 'cutat') {
      const r = S.rows[i], k = +el.dataset.k + 1, n = zhOf(r).length, n1 = r.words.slice(0, k).map((w) => w[0]).join('').length;
      const a1 = { words: r.words.slice(0, k), tr: r.tr, dur: +(r.dur * n1 / n).toFixed(1), hidden: false };
      const a2 = { words: r.words.slice(k), tr: '', dur: +(r.dur - a1.dur).toFixed(1), hidden: false };   // 後半句的翻譯由後端重產
      S.rows.splice(i, 1, a1, a2); S.cut = -1;
    }
    else if (a === 'merge') {
      const p = S.rows[i - 1], r = S.rows[i];
      S.rows.splice(i - 1, 2, { words: p.words.concat(r.words), tr: [p.tr, r.tr].filter(Boolean).join(' '), dur: +(p.dur + r.dur).toFixed(1), hidden: false }); S.cut = -1;
    }
    else if (a === 'hide') { if (S.cut === i) S.cut = -1; S.rows[i].hidden = !S.rows[i].hidden; }
    rerender(); return true;
  };
  const onInput = (e) => { if (e.target.matches('[data-s12name]')) { S.name = e.target.value; S.nameEdited = true; } };
  const hasProject = () => Boolean(proj());

  return { init, render, footer, next, apply, onClick, onInput, startSplitting, hasProject, setRerender: (f) => { rerender = f; }, state: S };
})();
