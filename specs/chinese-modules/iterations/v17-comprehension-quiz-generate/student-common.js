/* v17 學生端共用畫法（基準與提案都用）——照 mc/index.js 的元件拆：
   progRow＝QuestionScreen 進度列、articlePanel＝ProjectContentPanel、chipsRow／stem＝題卡上半、optionRow＝選項、completed＝CompletedScreen */
(function () {
  const M = window.V17S;
  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const TYPE = { tf: ['True / False', '#10B981'], mc: ['Multi-Choice', '#3B82F6'], oe: ['Open answer', '#6D28D9'] };
  const mmss = (sec) => `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(Math.max(0, sec) % 60).padStart(2, '0')}`;
  const alpha = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };

  const progRow = (i, n, extra = '', lead = '') => `<div class="prog">${lead}<div class="bar"><i style="width:${((i + 1) / n) * 100}%"></i></div>
    <span class="cnt"><b>${i + 1}</b> / <em>${n}</em></span>${extra}</div>`;

  const sw = (label, on, act = '') => `<span class="sw ${on ? 'on' : ''}" ${act ? `data-act="${act}" role="switch" aria-checked="${on}" tabindex="0"` : ''}><i></i>${label}</span>`;

  const articleBody = (py) => `<div class="pcp-paper">${M.segs.map(par => `<div class="snt">${par.map(([w, p]) => `<span class="wd">${py && p ? `<small>${esc(p)}</small>` : ''}<span>${esc(w)}</span></span>`).join('')}</div>`).join('')}</div>`;

  /* tools：右上那排；body：預設整篇課文 */
  const articlePanel = ({ py = false, tools, body } = {}) => `<div class="pcp"><div class="card"><div class="card-c">
    <div class="dvd">Project Content</div>
    <div class="pcp-tools">${tools ?? `<span class="icbtn" aria-label="Play audio"><span class="mi">volume_up</span></span>${sw('Pinyin', py, 'py')}${sw('Translation', false)}`}</div>
    ${body ?? articleBody(py)}
  </div></div></div>`;

  const typeChip = (q) => { const [l, c] = TYPE[q.t]; return `<span class="chip" style="background:${alpha(c, .12)}; color:${c}">${q.t === 'oe' ? '<span class="mi" style="font-size:15px">record_voice_over</span>' : ''}${l}</span>`; };
  const chipsRow = (q, right = '') => `<div class="chips">${typeChip(q)}<span class="chip ol">Comprehension</span><span class="sp"></span>${right}</div>`;
  const stem = (q, inner) => `<div class="stem">${inner ?? `<h5>${esc(q.q)}</h5>`}</div>`;
  const optionRow = (k, v, cls = '', icon = '') => `<div class="opt ${cls}" data-act="sel" data-k="${k}" role="button" tabindex="0"><span class="k">${k}</span><span class="v">${esc(v)}</span>${icon}</div>`;

  const scoreColor = (s) => s >= 80 ? '#22C55E' : s >= 60 ? '#F59E0B' : '#EF4444';
  const encourage = (s) => s >= 90 ? 'Excellent work!' : s >= 70 ? 'Good job, keep it up!' : s >= 50 ? 'Not bad, review and try again!' : 'Keep practicing!';
  /* answers：{ idx: 'A' }；title 預設照產品 Practice Complete! */
  const completed = ({ qs, answers, title = 'Practice Complete!', extraTop = '', submit = true }) => {   // 2026-11-23：submit:false＝不畫 Submit to Teacher（Timer 按 Submit 就交了）
    const graded = qs.filter(q => q.t !== 'oe');
    const correct = graded.filter((q) => answers[qs.indexOf(q)] === q.ans).length;
    const score = graded.length ? Math.round(correct / graded.length * 100) : 0, c = scoreColor(score);
    return `<div class="scroll"><div class="done"><div class="card">
      <div class="done-hd"><h4>${title}</h4><p>${esc(M.name)}</p></div>
      <div class="done-bd">${extraTop}
        <div class="ring" style="border-color:${c}; background:${alpha(c, .08)}; color:${c}"><b>${score}</b><small>/ 100</small></div>
        <div class="trio"><div style="background:${alpha('#22C55E', .1)}; color:#22C55E"><b>${correct}</b><small>Correct</small></div><div style="background:${alpha('#EF4444', .1)}; color:#EF4444"><b>${graded.length - correct}</b><small>Wrong</small></div><div style="background:${alpha('#3B82F6', .1)}; color:#3B82F6"><b>${graded.length}</b><small>Total</small></div></div>
        <div class="enc" style="background:${alpha(c, .1)}; color:${c}"><span class="mi">trending_up</span>${encourage(score)}</div>
        <div class="done-act">${submit ? '<button class="btn ct-p lg full"><span class="mi">send</span>Submit to Teacher</button>' : ''}<button class="btn ol lg full"><span class="mi">arrow_back</span>Back to Practice List</button></div>
      </div></div>
      <div class="rv-t">Question Review</div>
      ${graded.map((q) => { const i = qs.indexOf(q), a = answers[i], ok = a === q.ans; return `<div class="rv" style="border-color:${ok ? 'rgba(34,197,94,.3)' : 'rgba(255,86,48,.3)'}">
        <div class="chips"><span class="chip" style="background:${ok ? '#22C55E' : '#FF5630'}; color:#fff; font-weight:700">Q${i + 1}</span>${typeChip(q)}<span class="chip ol">Comprehension</span></div>
        <div class="stem" style="background:var(--grey06)"><h5>${esc(q.q)}</h5></div>
        ${!ok && a ? `<div class="rv-a" style="background:rgba(255,86,48,.08); border:1px solid rgba(255,86,48,.2); color:#FF5630"><span class="mi">close</span>Your answer: <b>${a}. ${esc(q.choice[a])}</b></div>` : ''}
        <div class="rv-a" style="background:rgba(34,197,94,.08); border:1px solid rgba(34,197,94,.2); color:#22C55E"><span class="mi">check</span>Correct: <b>${q.ans}. ${esc(q.choice[q.ans])}</b></div>
      </div>`; }).join('')}
    </div></div>`;
  };

  window.V17UI = { M, esc, TYPE, mmss, alpha, progRow, sw, articleBody, articlePanel, typeChip, chipsRow, stem, optionRow, completed };
})();
