// ============================================================
// AFM 291 — The Ledger Trail — engine
// ============================================================

const STORE_KEY = "afm291_ledger_trail_v1";
function loadState(){
  try{
    const raw = localStorage.getItem(STORE_KEY);
    if(raw) return JSON.parse(raw);
  }catch(e){}
  return { completed: {}, xp: 0 };
}
function saveState(){ localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
let state = loadState();

function fmt(n){
  const neg = n < 0;
  n = Math.abs(Math.round(n*100)/100);
  let s = n.toLocaleString('en-US', {minimumFractionDigits: (n % 1 !== 0) ? 2 : 0, maximumFractionDigits: 2});
  return (neg? "-":"") + "$" + s;
}

function showToast(title, sub){
  const t = document.getElementById('toast');
  document.getElementById('toastTitle').textContent = title;
  document.getElementById('toastSub').textContent = sub;
  t.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(()=> t.classList.remove('show'), 3200);
}

function completeLevel(levelId){
  const lvl = LEVELS.find(l=>l.id===levelId);
  if(!state.completed[levelId]){
    state.completed[levelId] = true;
    state.xp += lvl.xp;
    saveState();
    showToast((lvl.boss? "Case Closed — Boss Cleared!" : "Level Complete"), `+${lvl.xp} XP earned — ${lvl.title}`);
  }
  renderMap();
}

function totalXP(){ return LEVELS.reduce((s,l)=> s + l.xp, 0); }

// ---------------- ROUTER ----------------
const app = document.getElementById('app');

function renderMap(){
  const earned = state.xp;
  const max = totalXP();
  let unlockedIdx = 0;
  for(let i=0;i<LEVELS.length;i++){
    if(state.completed[LEVELS[i].id]) unlockedIdx = i+1;
  }

  let html = `
  <div class="topbar">
    <div class="brand">
      <div class="brand-mark">AFM</div>
      <div>
        <h1>The Ledger Trail</h1>
        <div class="sub">AFM 291 · Midterm 1 Expedition</div>
      </div>
    </div>
    <div style="display:flex;align-items:center;gap:14px;">
      <div class="xp-pill"><span class="dot"></span> ${earned} / ${max} XP</div>
      <button class="reset-link" onclick="resetProgress()">reset progress</button>
    </div>
  </div>
  <div class="map-intro">
    <span class="kicker">Assess → Identify → Analyze → Conclude</span>
    <h2>Ten stops between here and the exam room.</h2>
    <p>Every stop is a real case, walked through the AFM 291 problem-solving process — asset criteria, the IFRS 15 five-step model, long-term contracts, provisions, subsequent events, and accounting changes. Journal entries you build get stamped straight onto the balance sheet and income statement so you can <i>see</i> the impact, not just calculate it. Work the trail in order, or jump straight to whatever you need to drill.</p>
  </div>
  <div class="trail">`;

  LEVELS.forEach((lvl, i)=>{
    const done = !!state.completed[lvl.id];
    const locked = i > unlockedIdx;
    const cls = done? "done" : (locked? "locked" : "clickable");
    let status = done ? `<span class="node-status done">✓ Complete</span>`
      : locked ? `<span class="node-status locked">🔒 Locked</span>`
      : `<span class="node-status go">Start →</span>`;
    html += `<div class="node-row">
      <div class="node ${cls} ${lvl.boss?'node--boss':''}" ${(!locked)?`onclick="openLevel('${lvl.id}')"`:''}>
        <div class="node-badge ${lvl.boss?'boss':''}">${lvl.icon}</div>
        <div class="node-body">
          <span class="node-eyebrow">${lvl.eyebrow} · +${lvl.xp} XP</span>
          <div class="node-title">${lvl.title}</div>
          <div class="node-desc">${lvl.desc}</div>
        </div>
        ${status}
      </div>
    </div>`;
    if(i < LEVELS.length-1) html += `<div class="connector"></div>`;
  });

  html += `</div>`;
  app.innerHTML = html;
}

function resetProgress(){
  if(confirm("Reset all progress and XP? This can't be undone.")){
    state = { completed:{}, xp:0 };
    saveState();
    renderMap();
  }
}

function openLevel(id){
  const lvl = LEVELS.find(l=>l.id===id);
  window.scrollTo(0,0);
  renderLevelShell(lvl);
}

function renderLevelShell(lvl){
  app.innerHTML = `
    <div class="topbar">
      <div class="brand">
        <div class="brand-mark">AFM</div>
        <div><h1>The Ledger Trail</h1><div class="sub">AFM 291 · Midterm 1 Expedition</div></div>
      </div>
      <div class="xp-pill"><span class="dot"></span> ${state.xp} / ${totalXP()} XP</div>
    </div>
    <div class="level">
      <div class="level-header">
        <div>
          <div class="eyebrow">${lvl.eyebrow}</div>
          <h2>${lvl.title}</h2>
        </div>
        <button class="back-btn" onclick="renderMap()">← Back to trail</button>
      </div>
      <div class="level-body" id="levelBody"></div>
    </div>
  `;
  const body = document.getElementById('levelBody');
  const renderers = {
    process: renderProcessLevel,
    flashquiz: renderFlashQuizLevel,
    ctl: renderCTLLevel,
    barnett: renderBarnettLevel,
    sti: renderSTILevel,
    onerous: renderOnerousLevel,
    contingencies: renderContingenciesLevel,
    sorter: renderSorterLevel,
    sorter2: renderSorterLevel,
    boss: renderBossLevel
  };
  renderers[lvl.type](body, lvl);
}

function stepFooter(container, onNext, nextLabel, disabled){
  const div = document.createElement('div');
  div.className = 'btn-row';
  div.innerHTML = `<button class="btn brass" id="nextBtn" ${disabled?'disabled':''}>${nextLabel||'Continue →'}</button>`;
  container.appendChild(div);
  document.getElementById('nextBtn').onclick = onNext;
  return document.getElementById('nextBtn');
}

// ========================================================
// LEVEL: Problem Solving Process
// ========================================================
function renderProcessLevel(body, lvl){
  let idx = 0;
  function draw(){
    const s = PSP_STAGES[idx];
    body.innerHTML = `
      <p><span class="kicker">Field Manual — read this once, use it on every case</span></p>
      <div class="scenario-card">
        <span class="who">${s.tag}: ${s.title}</span>
        <p style="margin:0;">${s.body}</p>
      </div>
      <div class="step-nav">
        <div class="progress-dots">${PSP_STAGES.map((_,i)=>`<span class="${i<idx?'past':i===idx?'active':''}"></span>`).join('')}</div>
        <div class="btn-row" style="margin-top:0;">
          ${idx>0?`<button class="btn ghost" id="prevBtn">← Back</button>`:''}
          <button class="btn brass" id="nextBtn">${idx<PSP_STAGES.length-1?'Next stage →':'Try the order drill →'}</button>
        </div>
      </div>
    `;
    if(idx>0) document.getElementById('prevBtn').onclick = ()=>{idx--; draw();};
    document.getElementById('nextBtn').onclick = ()=>{
      if(idx<PSP_STAGES.length-1){ idx++; draw(); } else { drawDrill(); }
    };
  }
  function drawDrill(){
    const order = shuffle(PSP_STAGES.map((s,i)=>i));
    body.innerHTML = `
      <p><span class="kicker">Order Drill</span></p>
      <p>Click the four stages in the correct order, first to last.</p>
      <div class="choices" id="drillChoices"></div>
      <div class="feedback" id="drillFb"></div>
    `;
    const picked = [];
    const cont = document.getElementById('drillChoices');
    order.forEach(i=>{
      const b = document.createElement('button');
      b.className = 'choice-btn';
      b.textContent = PSP_STAGES[i].title;
      b.onclick = ()=>{
        if(b.disabled) return;
        picked.push(i);
        b.disabled = true;
        if(i === picked.length-1 + 0 && picked[picked.length-1] === expectedNext()){
          b.style.borderColor = 'var(--good)'; b.style.background='rgba(63,107,74,.15)';
        }
        checkDrill();
      };
      cont.appendChild(b);
    });
    function expectedNext(){ return picked.length-1; }
    function checkDrill(){
      if(picked.length < PSP_STAGES.length) return;
      const fb = document.getElementById('drillFb');
      const correct = picked.every((v,i)=> v===i);
      fb.classList.add('show');
      if(correct){
        fb.classList.add('good');
        fb.textContent = "That's the order — Assess, Identify, Analyze, Conclude/Justify/Recommend. This sequence is the backbone of every case you'll see on the midterm.";
        body.appendChild(finishButton(lvl));
      } else {
        fb.classList.add('bad');
        fb.textContent = "Not quite the right order — but that's fine, the real skill is applying each stage, not memorizing the sequence. Correct order: " + PSP_STAGES.map(s=>s.title).join(" → ");
        body.appendChild(finishButton(lvl));
      }
    }
  }
  draw();
}

function finishButton(lvl){
  const div = document.createElement('div');
  div.className = 'btn-row';
  div.innerHTML = `<button class="btn brass">Complete level (+${lvl.xp} XP) →</button>`;
  div.querySelector('button').onclick = ()=> completeLevel(lvl.id);
  return div;
}

function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){ const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}

// ========================================================
// LEVEL: Flashcards + Quiz (Assets)
// ========================================================
function renderFlashQuizLevel(body, lvl){
  body.innerHTML = `
    <p><span class="kicker">Flip every card, then take the check</span></p>
    <div class="flashgrid" id="cards"></div>
    <div class="btn-row"><button class="btn brass" id="toQuiz" disabled>Flip all cards to continue →</button></div>
  `;
  const grid = document.getElementById('cards');
  let flippedCount = 0;
  const seen = new Set();
  lvl.flashcards.forEach((c, i)=>{
    const el = document.createElement('div');
    el.className = 'flashcard';
    el.innerHTML = `<div class="flashcard-inner">
      <div class="flashcard-face front"><div class="tag">${c.tag}</div><div class="q">${c.q}</div><div class="hint">tap to flip</div></div>
      <div class="flashcard-face back">${c.a}</div>
    </div>`;
    el.onclick = ()=>{
      el.classList.toggle('flipped');
      if(!seen.has(i)){ seen.add(i); flippedCount++; }
      if(flippedCount >= lvl.flashcards.length){
        document.getElementById('toQuiz').disabled = false;
      }
    };
    grid.appendChild(el);
  });
  document.getElementById('toQuiz').onclick = ()=> renderQuizSequence(body, lvl, lvl.quiz, ()=> completeLevel(lvl.id));
}

function renderQuizSequence(body, lvl, quiz, onDone){
  let qi = 0, correctCount = 0;
  function draw(){
    const q = quiz[qi];
    body.innerHTML = `
      <p><span class="kicker">Check ${qi+1} of ${quiz.length}</span></p>
      <h3 style="margin-top:0;">${q.q}</h3>
      <div class="choices" id="qc"></div>
      <div class="feedback" id="qf"></div>
    `;
    const cc = document.getElementById('qc');
    q.opts.forEach((opt, oi)=>{
      const b = document.createElement('button');
      b.className = 'choice-btn';
      b.innerHTML = opt;
      b.onclick = ()=>{
        [...cc.children].forEach(c=>c.disabled=true);
        const fb = document.getElementById('qf');
        fb.classList.add('show');
        if(oi === q.correct){
          b.classList.add('correct');
          fb.classList.add('good');
          correctCount++;
        } else {
          b.classList.add('wrong');
          cc.children[q.correct].classList.add('correct');
          fb.classList.add('bad');
        }
        fb.innerHTML = q.explain;
        const nextDiv = document.createElement('div');
        nextDiv.className = 'btn-row';
        nextDiv.innerHTML = `<button class="btn brass">${qi<quiz.length-1?'Next question →':'Finish →'}</button>`;
        nextDiv.querySelector('button').onclick = ()=>{
          if(qi<quiz.length-1){ qi++; draw(); } else { onDone(); }
        };
        body.appendChild(nextDiv);
      };
      cc.appendChild(b);
    });
  }
  draw();
}

// ========================================================
// Reusable: FS Impact visualizer
// ========================================================
function classify(account){ return ACCOUNT_TYPES[account] || 'asset'; }

function computeImpact(lines){
  let dA=0, dL=0, dEqDirect=0, dRev=0, dExp=0;
  lines.forEach(l=>{
    const t = classify(l.account);
    const sign = l.side === 'DR' ? 1 : -1;
    if(t === 'asset') dA += sign * l.amount;
    else if(t === 'liability') dL += -sign * l.amount;
    else if(t === 'equity') dEqDirect += -sign * l.amount;
    else if(t === 'revenue') dRev += -sign * l.amount;
    else if(t === 'expense') dExp += sign * l.amount;
  });
  const netIncome = dRev - dExp;
  const dEqTotal = dEqDirect + netIncome;
  return { dA, dL, dEqTotal, dRev, dExp, netIncome, balanced: Math.abs(dA - (dL+dEqTotal)) < 0.02 };
}

function cashFlowTag(lines){
  const cash = lines.find(l=> l.account === 'Cash');
  if(!cash) return {cls:'none', label:'No cash effect'};
  const hasRevExp = lines.some(l=> ['revenue','expense'].includes(classify(l.account)));
  const hasLongTermOrConstruction = lines.some(l=> ['Construction in Progress','Note Receivable','Long-term Note Receivable','Equipment'].includes(l.account));
  if(lines.some(l=>l.account==='Common Shares' || l.account==='Note Payable')) return {cls:'fin', label:'Financing Activity'};
  if(hasLongTermOrConstruction && !hasRevExp) return {cls:'inv', label:'Investing Activity'};
  return {cls:'op', label:'Operating Activity'};
}

function renderFSImpact(container, lines, opts){
  opts = opts || {};
  const r = computeImpact(lines);
  const maxAbs = Math.max(Math.abs(r.dA), Math.abs(r.dL)+Math.abs(r.dEqTotal), 1);
  const scale = 100 / maxAbs;
  const aH = Math.max(Math.abs(r.dA)*scale, 2);
  const lH = Math.max(Math.abs(r.dL)*scale, 2);
  const eH = Math.max(Math.abs(r.dEqTotal)*scale, 2);
  const cf = cashFlowTag(lines);

  const div = document.createElement('div');
  div.className = 'fs-impact';
  div.innerHTML = `
    <h4>Impact on the accounting equation</h4>
    <div class="eq-scale">
      <div class="eq-col">
        <div class="eq-bar assets" style="height:${aH}px;"></div>
        <div class="eq-label">Assets</div>
        <div class="eq-amt">${r.dA>=0?'+':''}${fmt(r.dA)}</div>
      </div>
      <div class="plus-sign">=</div>
      <div class="eq-col">
        <div class="eq-stack">
          <div class="eq-bar liab" style="height:${lH}px;"></div>
        </div>
        <div class="eq-label">Liabilities</div>
        <div class="eq-amt">${r.dL>=0?'+':''}${fmt(r.dL)}</div>
      </div>
      <div class="plus-sign">+</div>
      <div class="eq-col">
        <div class="eq-bar equity" style="height:${eH}px;"></div>
        <div class="eq-label">Equity</div>
        <div class="eq-amt">${r.dEqTotal>=0?'+':''}${fmt(r.dEqTotal)}</div>
      </div>
    </div>
    <div class="stamp-wrap">
      <div class="stamp ${r.balanced?'':'bad'} show">${r.balanced? 'Balanced ✓' : 'Out of Balance'}</div>
    </div>
    <div class="is-strip">
      <div class="is-chip"><div class="label">Revenue</div><div class="val ${r.dRev>0?'pos':''}">${r.dRev>=0?'+':''}${fmt(r.dRev)}</div></div>
      <div class="is-chip"><div class="label">Expenses</div><div class="val ${r.dExp>0?'neg':''}">${r.dExp>=0?'+':''}${fmt(r.dExp)}</div></div>
      <div class="is-chip"><div class="label">Net Income effect</div><div class="val ${r.netIncome>0?'pos':(r.netIncome<0?'neg':'')}">${r.netIncome>=0?'+':''}${fmt(r.netIncome)}</div></div>
    </div>
    ${!opts.noCF ? `<span class="cf-tag ${cf.cls}">${cf.label}</span>` : ''}
  `;
  container.appendChild(div);
  return div;
}

function renderTAccounts(container, lines){
  const byAccount = {};
  lines.forEach(l=>{
    if(!byAccount[l.account]) byAccount[l.account] = {dr:[], cr:[]};
    if(l.side==='DR') byAccount[l.account].dr.push(l.amount);
    else byAccount[l.account].cr.push(l.amount);
  });
  const div = document.createElement('div');
  div.className = 'taccounts';
  Object.keys(byAccount).forEach(acc=>{
    const d = byAccount[acc];
    const rows = Math.max(d.dr.length, d.cr.length, 1);
    let rowsHtml = '';
    for(let i=0;i<rows;i++){
      rowsHtml += `<tr><td>${d.dr[i]!==undefined?fmt(d.dr[i]):''}</td><td>${d.cr[i]!==undefined?fmt(d.cr[i]):''}</td></tr>`;
    }
    div.innerHTML += `<div class="taccount"><div class="name">${acc}</div><table>${rowsHtml}</table></div>`;
  });
  container.appendChild(div);
}

// ========================================================
// Reusable: Journal Entry Builder
// ========================================================
let _jeInstanceCounter = 0;
function renderJEBuilder(container, answerLines, opts){
  opts = opts || {};
  const uid = 'je' + (_jeInstanceCounter++);
  const wrap = document.createElement('div');
  const nRows = opts.startRows || answerLines.length;
  wrap.innerHTML = `
    <table class="je-table">
      <thead><tr><th style="width:44%">Account</th><th style="width:14%">Dr / Cr</th><th class="num-cell">Amount</th><th></th></tr></thead>
      <tbody id="${uid}-rows"></tbody>
    </table>
    <div class="je-row-actions"><button class="je-add-btn" id="${uid}-add">+ add line</button></div>
    <div class="btn-row">
      <button class="btn brass" id="${uid}-check">Check my entry</button>
      <button class="btn ghost" id="${uid}-reveal">Reveal answer</button>
    </div>
    <div class="je-status" id="${uid}-status"></div>
    <div id="${uid}-impact"></div>
  `;
  container.appendChild(wrap);
  const rowsBody = wrap.querySelector(`#${uid}-rows`);
  const accountOptions = (opts.accountPool || ALL_ACCOUNTS);

  function addRow(prefill){
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><select class="acc">${`<option value="">— select account —</option>` + accountOptions.map(a=>`<option value="${a}" ${prefill&&prefill.account===a?'selected':''}>${a}</option>`).join('')}</select></td>
      <td><select class="side">
        <option value="DR" ${prefill&&prefill.side==='DR'?'selected':''}>Dr</option>
        <option value="CR" ${prefill&&prefill.side==='CR'?'selected':''}>Cr</option>
      </select></td>
      <td class="num-cell"><input type="number" class="amt" step="0.01" value="${prefill?prefill.amount:''}" placeholder="0.00"></td>
      <td><button class="je-remove" title="remove row">✕</button></td>
    `;
    tr.querySelector('.je-remove').onclick = ()=> tr.remove();
    rowsBody.appendChild(tr);
  }
  for(let i=0;i<nRows;i++) addRow();
  wrap.querySelector(`#${uid}-add`).onclick = ()=> addRow();

  function readRows(){
    return [...rowsBody.children].map(tr=>{
      const account = tr.querySelector('.acc').value;
      const side = tr.querySelector('.side').value;
      const amount = parseFloat(tr.querySelector('.amt').value);
      return {account, side, amount};
    }).filter(r=>r.account && !isNaN(r.amount) && r.amount>0);
  }

  function linesMatch(user, answer){
    const norm = arr => arr.map(l=>`${l.account}|${l.side}|${Math.round(l.amount*100)}`).sort();
    const u = norm(user), a = norm(answer);
    if(u.length !== a.length) return false;
    return u.every((v,i)=>v===a[i]);
  }

  wrap.querySelector(`#${uid}-check`).onclick = ()=>{
    const user = readRows();
    const status = wrap.querySelector(`#${uid}-status`);
    const totalDr = user.filter(l=>l.side==='DR').reduce((s,l)=>s+l.amount,0);
    const totalCr = user.filter(l=>l.side==='CR').reduce((s,l)=>s+l.amount,0);
    const balances = Math.abs(totalDr-totalCr) < 0.02 && user.length>0;
    const correct = linesMatch(user, answerLines);
    if(correct){
      status.innerHTML = `<span style="color:var(--good);font-weight:600;">✓ Correct — that entry matches the recommended treatment.</span>`;
      const holder = wrap.querySelector(`#${uid}-impact`);
      holder.innerHTML = '';
      renderFSImpact(holder, answerLines);
      if(opts.onCorrect) opts.onCorrect();
    } else if(!balances){
      status.innerHTML = `<span style="color:var(--bad);font-weight:600;">Debits (${fmt(totalDr)}) and credits (${fmt(totalCr)}) don't balance yet — check your amounts.</span>`;
    } else {
      status.innerHTML = `<span style="color:var(--bad);font-weight:600;">Debits and credits balance, but this isn't the recommended entry — check your accounts/amounts, or reveal the answer.</span>`;
    }
  };

  wrap.querySelector(`#${uid}-reveal`).onclick = ()=>{
    rowsBody.innerHTML = '';
    answerLines.forEach(l=> addRow(l));
    const holder = wrap.querySelector(`#${uid}-impact`);
    holder.innerHTML = '';
    renderFSImpact(holder, answerLines);
    wrap.querySelector(`#${uid}-status`).innerHTML = `<span style="color:var(--ink-soft);">Answer revealed.</span>`;
    if(opts.onCorrect) opts.onCorrect();
  };
}

// ========================================================
// LEVEL: CTL — Five-step revenue model story
// ========================================================
function renderCTLLevel(body, lvl){
  const c = CTL;
  const scenes = ['intro','contract','wrong','s1','s2','s3','s4','s5','spot','je1','je2','done'];
  let idx = 0;
  function draw(){
    const key = scenes[idx];
    let html = `<div class="progress-dots" style="margin-bottom:14px;">${scenes.map((_,i)=>`<span class="${i<idx?'past':i===idx?'active':''}"></span>`).join('')}</div>`;
    if(key==='intro'){
      html += `<p><span class="kicker">Case File — Clothing Technology Ltd.</span></p><p>${c.intro}</p>`;
      body.innerHTML = html;
      stepFooter(body, ()=>{idx++;draw();});
    } else if(key==='contract'){
      html += `<div class="scenario-card">${c.contractCard}</div>`;
      body.innerHTML = html;
      stepFooter(body, ()=>{idx++;draw();});
    } else if(key==='wrong'){
      html += `<h3>What actually got booked</h3><div class="callout">${c.wrongEntry}</div><p>Hold that thought — walk the 5-step model first, then we'll come back and diagnose it.</p>`;
      body.innerHTML = html;
      stepFooter(body, ()=>{idx++;draw();});
    } else if(key==='s1'){
      const st = c.step1;
      html += `<h3>${st.title}</h3><table class="cmp-table"><tr><th>Criterion</th><th>Case fact</th></tr>` +
        st.criteria.map(cr=>`<tr><td>${cr.met?'✅':'❌'} ${cr.text}</td><td>${cr.note}</td></tr>`).join('') + `</table>
        <div class="callout">${st.conclude}</div>`;
      body.innerHTML = html;
      stepFooter(body, ()=>{idx++;draw();});
    } else if(key==='s2'){
      const st = c.step2;
      html += `<h3>${st.title}</h3><p>${st.body}</p>`;
      body.innerHTML = html;
      const choiceBox = document.createElement('div');
      choiceBox.className = 'choices';
      st.opts.forEach((opt,oi)=>{
        const b = document.createElement('button');
        b.className = 'choice-btn'; b.innerHTML = opt;
        b.onclick = ()=>{
          [...choiceBox.children].forEach(x=>x.disabled=true);
          if(oi===st.correct) b.classList.add('correct'); else { b.classList.add('wrong'); choiceBox.children[st.correct].classList.add('correct'); }
          const fb = document.createElement('div'); fb.className='feedback show good'; fb.innerHTML = st.explain;
          body.appendChild(fb);
          stepFooter(body, ()=>{idx++;draw();});
        };
        choiceBox.appendChild(b);
      });
      body.appendChild(choiceBox);
    } else if(key==='s3'){
      const st = c.step3;
      html += `<h3>${st.title}</h3><p>${st.body}</p>
        <div class="scenario-card" style="text-align:center;"><span style="font-family:'IBM Plex Mono',monospace;font-size:22px;font-weight:700;">${fmt(st.value)}</span></div>`;
      body.innerHTML = html;
      stepFooter(body, ()=>{idx++;draw();});
    } else if(key==='s4'){
      const st = c.step4;
      const totalSA = st.rows.reduce((s,r)=>s+r.standalone,0);
      html += `<h3>${st.title}</h3><p>${st.body}</p>
      <table class="cmp-table"><tr><th>Obligation</th><th>Stand-alone price</th><th>% of total</th><th>Allocated price</th></tr>
      ${st.rows.map(r=>{
        const pct = r.standalone/totalSA;
        const alloc = pct*st.total;
        return `<tr><td>${r.name}</td><td>${fmt(r.standalone)}</td><td>${(pct*100).toFixed(2)}%</td><td><b>${fmt(alloc)}</b></td></tr>`;
      }).join('')}
      <tr><td><b>Total</b></td><td>${fmt(totalSA)}</td><td>100%</td><td><b>${fmt(st.total)}</b></td></tr>
      </table>`;
      body.innerHTML = html;
      stepFooter(body, ()=>{idx++;draw();});
    } else if(key==='s5'){
      const st = c.step5;
      html += `<h3>${st.title}</h3>${st.body}`;
      body.innerHTML = html;
      stepFooter(body, ()=>{idx++;draw();});
    } else if(key==='spot'){
      const st = c.spotError;
      html += `<h3>Spot the error</h3><p>${st.q}</p>`;
      body.innerHTML = html;
      const choiceBox = document.createElement('div'); choiceBox.className='choices';
      st.opts.forEach((opt,oi)=>{
        const b=document.createElement('button'); b.className='choice-btn'; b.innerHTML=opt;
        b.onclick=()=>{
          [...choiceBox.children].forEach(x=>x.disabled=true);
          if(oi===st.correct) b.classList.add('correct'); else {b.classList.add('wrong'); choiceBox.children[st.correct].classList.add('correct');}
          const fb=document.createElement('div'); fb.className='feedback show good'; fb.innerHTML=st.explain;
          body.appendChild(fb);
          stepFooter(body, ()=>{idx++;draw();}, "Build the correct entry →");
        };
        choiceBox.appendChild(b);
      });
      body.appendChild(choiceBox);
    } else if(key==='je1'){
      const st = c.dec2025JE;
      html += `<h3>${st.title}</h3><div class="callout">${st.note}</div><p class="small-note">${st.hint}</p>`;
      body.innerHTML = html;
      renderJEBuilder(body, st.lines, {startRows: 4});
      stepFooter(body, ()=>{idx++;draw();}, "Continue to January 2026 →");
    } else if(key==='je2'){
      const st = c.jan2026JE;
      html += `<h3>${st.title}</h3><p class="small-note">${st.hint}</p>`;
      body.innerHTML = html;
      renderJEBuilder(body, st.lines, {startRows: 8});
      stepFooter(body, ()=>{idx++;draw();}, "Finish level →");
    } else if(key==='done'){
      html += `<div class="scenario-card" style="text-align:center;">
        <h3 style="margin-top:0;">Case closed.</h3>
        <p>You walked a real 5-step revenue contract from a wrong journal entry to a defensible one — across two performance obligations and two different transfer-of-control patterns in the same contract. That's the whole exam in miniature.</p>
      </div>`;
      body.innerHTML = html;
      body.appendChild(finishButton(lvl));
    }
  }
  draw();
}

// ========================================================
// LEVEL: Barnett — significant financing
// ========================================================
function renderBarnettLevel(body, lvl){
  const b = BARNETT;
  const scenes = ['intro','q1','pv','je1','je2','sl','done'];
  let idx=0;
  function draw(){
    const key = scenes[idx];
    let html = `<div class="progress-dots" style="margin-bottom:14px;">${scenes.map((_,i)=>`<span class="${i<idx?'past':i===idx?'active':''}"></span>`).join('')}</div>`;
    if(key==='intro'){
      html += `<p><span class="kicker">Case File — Barnett Corp.</span></p><div class="scenario-card">${b.intro}</div>`;
      body.innerHTML = html; stepFooter(body, ()=>{idx++;draw();});
    } else if(key==='q1'){
      html += `<h3>Financial reporting issue</h3><p>${b.q1.q}</p>`;
      body.innerHTML = html;
      const cb=document.createElement('div'); cb.className='choices';
      b.q1.opts.forEach((opt,oi)=>{
        const btn=document.createElement('button'); btn.className='choice-btn'; btn.innerHTML=opt;
        btn.onclick=()=>{
          [...cb.children].forEach(x=>x.disabled=true);
          if(oi===b.q1.correct) btn.classList.add('correct'); else {btn.classList.add('wrong'); cb.children[b.q1.correct].classList.add('correct');}
          const fb=document.createElement('div'); fb.className='feedback show good'; fb.innerHTML=b.q1.explain;
          body.appendChild(fb);
          stepFooter(body, ()=>{idx++;draw();}, "Do the present value math →");
        };
        cb.appendChild(btn);
      });
      body.appendChild(cb);
    } else if(key==='pv'){
      const p = b.pvCalc;
      html += `<h3>Step 3 — Determine the (cash-equivalent) transaction price</h3>
      <p>${p.body}</p>
      <table class="cmp-table">
        <tr><th></th><th>Amount</th></tr>
        <tr><td>Cash deposit (already at PV — received today)</td><td>${fmt(p.deposit)}</td></tr>
        <tr><td>PV of 4 instalments of $40,000 @ 9% (PVFA = ${p.pvFactorExact})</td><td>${fmt(p.pvDeferred)}</td></tr>
        <tr><td><b>Transaction price (cash-equivalent selling price)</b></td><td><b>${fmt(p.price)}</b></td></tr>
      </table>
      <p class="small-note">The gap between $180,000 total cash and ${fmt(p.price)} transaction price — ${fmt(180000-p.price)} — isn't revenue at all. It's interest income, earned over the 4 years as the note accrues.</p>`;
      body.innerHTML = html;
      stepFooter(body, ()=>{idx++;draw();}, "Build the initial entry →");
    } else if(key==='je1'){
      html += `<h3>${b.initialJE.title}</h3>`;
      body.innerHTML = html;
      renderJEBuilder(body, b.initialJE.lines, {startRows:3});
      stepFooter(body, ()=>{idx++;draw();}, "Now the first interest entry →");
    } else if(key==='je2'){
      const st = b.effInterest2025;
      html += `<h3>${st.title}</h3><p class="small-note">${st.hint}</p>`;
      body.innerHTML = html;
      renderJEBuilder(body, st.lines, {startRows:3});
      stepFooter(body, ()=>{idx++;draw();}, "IFRS vs ASPE: is there another option? →");
    } else if(key==='sl'){
      html += `<h3>${b.straightLine.title}</h3><p>${b.straightLine.body}</p>
      <table class="cmp-table"><tr><th>Method</th><th>Standard(s)</th><th>2025 interest income</th><th>Pattern</th></tr>
      <tr><td>Effective interest</td><td>IFRS & ASPE</td><td>${fmt(b.effInterest2025.interest)}</td><td>Declining (based on shrinking carrying value)</td></tr>
      <tr><td>Straight-line</td><td>ASPE only</td><td>$7,602.80</td><td>Flat every year</td></tr>
      </table>`;
      body.innerHTML = html;
      stepFooter(body, ()=>{idx++;draw();}, "Finish level →");
    } else if(key==='done'){
      html += `<div class="scenario-card" style="text-align:center;"><h3 style="margin-top:0;">Case closed.</h3>
      <p>Whenever payment is deferred beyond normal credit terms, ask: is there a significant financing component hiding in there? If so, revenue = cash-equivalent price, and the rest is interest income over time.</p></div>`;
      body.innerHTML = html;
      body.appendChild(finishButton(lvl));
    }
  }
  draw();
}

// ========================================================
// LEVEL: STI — long-term contracts / % completion
// ========================================================
function renderSTILevel(body, lvl){
  const s = STI;
  const scenes = ['intro','contract','calc24','je24','calc25','je25','rec','done'];
  let idx=0;
  function draw(){
    const key = scenes[idx];
    let html = `<div class="progress-dots" style="margin-bottom:14px;">${scenes.map((_,i)=>`<span class="${i<idx?'past':i===idx?'active':''}"></span>`).join('')}</div>`;
    if(key==='intro'){
      html += `<p><span class="kicker">Case File — Sun Technology Inc.</span></p><p>${s.intro}</p>`;
      body.innerHTML=html; stepFooter(body, ()=>{idx++;draw();});
    } else if(key==='contract'){
      html += `<div class="scenario-card">${s.contractCard}</div>`;
      body.innerHTML=html; stepFooter(body, ()=>{idx++;draw();}, "Recognize 2024 revenue →");
    } else if(key==='calc24'){
      const p = s.pctComplete2024;
      html += `<h3>2024 — Measuring progress with the input method</h3>
      <table class="cmp-table">
        <tr><td>${p.formula}</td><td></td></tr>
        <tr><td>Costs incurred to date</td><td>${fmt(2007000)}</td></tr>
        <tr><td>Total estimated contract cost</td><td>${fmt(3007000)}</td></tr>
        <tr><td><b>% complete</b></td><td><b>${p.calc}</b></td></tr>
        <tr><td><b>Revenue recognized (66.746% × $4,200,000)</b></td><td><b>${fmt(p.revenue)}</b></td></tr>
        <tr><td>Costs (expense) recognized</td><td>${fmt(p.cost)}</td></tr>
        <tr><td><b>Gross profit recognized</b></td><td><b>${fmt(p.grossProfit)}</b></td></tr>
      </table>`;
      body.innerHTML=html; stepFooter(body, ()=>{idx++;draw();}, "Build the 2024 entries →");
    } else if(key==='je24'){
      html += `<h3>${s.je2024.title}</h3>`;
      body.innerHTML = html;
      s.je2024.lines.forEach(group=>{
        const h = document.createElement('h4'); h.textContent = group.label; body.appendChild(h);
        renderJEBuilder(body, group.entries, {startRows: group.entries.length});
      });
      stepFooter(body, ()=>{idx++;draw();}, "Move to 2025 →");
    } else if(key==='calc25'){
      const p = s.pctComplete2025;
      html += `<h3>2025 — Contract completes</h3><p>${p.body}</p>
      <table class="cmp-table">
        <tr><td>Total contract price</td><td>${fmt(4200000)}</td></tr>
        <tr><td>Revenue already recognized in 2024</td><td>${fmt(s.pctComplete2024.revenue)}</td></tr>
        <tr><td><b>2025 revenue (the remainder)</b></td><td><b>${fmt(p.revenue)}</b></td></tr>
        <tr><td>2025 costs incurred</td><td>${fmt(p.cost)}</td></tr>
        <tr><td><b>2025 gross profit</b></td><td><b>${fmt(p.grossProfit)}</b></td></tr>
      </table>
      <p class="small-note">Check: total revenue $${(4200000).toLocaleString()} = total costs $${(3307000).toLocaleString()} + total gross profit $893,000 across both years. ✓</p>`;
      body.innerHTML = html; stepFooter(body, ()=>{idx++;draw();}, "Build the 2025 entries →");
    } else if(key==='je25'){
      html += `<h3>${s.je2025.title}</h3>`;
      body.innerHTML = html;
      s.je2025.lines.forEach(group=>{
        const h=document.createElement('h4'); h.textContent=group.label; body.appendChild(h);
        renderJEBuilder(body, group.entries, {startRows: group.entries.length});
      });
      stepFooter(body, ()=>{idx++;draw();}, "One more question →");
    } else if(key==='rec'){
      html += `<h3>Your recommendation</h3><p>${s.recommendation.q}</p>`;
      body.innerHTML = html;
      const cb=document.createElement('div'); cb.className='choices';
      s.recommendation.opts.forEach((opt,oi)=>{
        const btn=document.createElement('button'); btn.className='choice-btn'; btn.innerHTML=opt;
        btn.onclick=()=>{
          [...cb.children].forEach(x=>x.disabled=true);
          if(oi===s.recommendation.correct) btn.classList.add('correct'); else {btn.classList.add('wrong'); cb.children[s.recommendation.correct].classList.add('correct');}
          const fb=document.createElement('div'); fb.className='feedback show good'; fb.innerHTML=s.recommendation.explain;
          body.appendChild(fb);
          stepFooter(body, ()=>{idx++;draw();}, "Finish level →");
        };
        cb.appendChild(btn);
      });
      body.appendChild(cb);
    } else if(key==='done'){
      html += `<div class="scenario-card" style="text-align:center;"><h3 style="margin-top:0;">Case closed.</h3>
      <p>Over-time revenue isn't a one-time calculation — it's cumulative revenue to date, recalculated each period, minus whatever you already booked. Get that subtraction step right and the rest follows.</p></div>`;
      body.innerHTML = html;
      body.appendChild(finishButton(lvl));
    }
  }
  draw();
}

// ========================================================
// LEVEL: Onerous contracts
// ========================================================
function renderOnerousLevel(body, lvl){
  const o = ONEROUS;
  body.innerHTML = `<p><span class="kicker">When the deal turns sour</span></p><p>${o.concept}</p>
  <h3>Try it</h3>
  <div class="scenario-card">${o.example.card}</div>
  <p>${o.example.q}</p>`;
  const cb = document.createElement('div'); cb.className='choices';
  o.example.opts.forEach((opt,oi)=>{
    const btn=document.createElement('button'); btn.className='choice-btn'; btn.innerHTML=opt;
    btn.onclick=()=>{
      [...cb.children].forEach(x=>x.disabled=true);
      if(oi===o.example.correct) btn.classList.add('correct'); else {btn.classList.add('wrong'); cb.children[o.example.correct].classList.add('correct');}
      const fb=document.createElement('div'); fb.className='feedback show good'; fb.innerHTML=o.example.explain;
      body.appendChild(fb);
      const h = document.createElement('h4'); h.textContent = 'Booking the loss'; body.appendChild(h);
      renderJEBuilder(body, [
        {account:'Loss on Onerous Contract', side:'DR', amount:50000},
        {account:'Provision for Onerous Contract', side:'CR', amount:50000}
      ], {startRows:2});
      body.appendChild(finishButton(lvl));
    };
    cb.appendChild(btn);
  });
  body.appendChild(cb);
}

// ========================================================
// LEVEL: Contingencies — decision tree + ASPE tables
// ========================================================
function renderContingenciesLevel(body, lvl){
  const t = IAS37_TREE;
  const path = [];
  function drawTree(nodeKey){
    let node, label;
    if(nodeKey===0){ node = t.steps[0]; }
    else if(nodeKey===1){ node = t.steps[1]; }
    else if(nodeKey===2){ node = t.steps[2]; }
    else if(nodeKey==='possible'){ node = t.possible; }
    if(t.outcomes[nodeKey]){
      const o = t.outcomes[nodeKey];
      body.innerHTML = `
        <p><span class="kicker">IAS 37 · Interactive Decision Tree</span></p>
        <div class="scenario-card">${t.scenario}</div>
        <div class="breadcrumb">${path.map(p=>`<span class="crumb">${p}</span>`).join('')}</div>
        <div class="result-banner ${o.cls}">${o.title}</div>
        <p style="text-align:center;max-width:520px;margin:0 auto;">${o.body}</p>
        <div class="btn-row" style="justify-content:center;"><button class="btn ghost" id="retryTree">↺ Try a different path</button></div>
      `;
      document.getElementById('retryTree').onclick = ()=>{ path.length=0; drawTree(0); };
      const proceedDiv = document.createElement('div'); proceedDiv.className='btn-row'; proceedDiv.style.justifyContent='center';
      proceedDiv.innerHTML = `<button class="btn brass" id="toASPE">Continue to ASPE tables →</button>`;
      body.appendChild(proceedDiv);
      document.getElementById('toASPE').onclick = drawASPE;
      return;
    }
    body.innerHTML = `
      <p><span class="kicker">IAS 37 · Interactive Decision Tree</span></p>
      <div class="scenario-card">${t.scenario}</div>
      <div class="breadcrumb">${path.map(p=>`<span class="crumb">${p}</span>`).join('')}</div>
      <div class="tree-card">
        <div class="qtext">${node.q}</div>
        <div class="opts" id="treeOpts"></div>
      </div>
    `;
    const opts = document.getElementById('treeOpts');
    node.opts.forEach(o=>{
      const b = document.createElement('button'); b.className='btn ghost'; b.textContent = o.label;
      b.onclick = ()=>{ path.push(o.label); drawTree(o.next); };
      opts.appendChild(b);
    });
  }
  function drawASPE(){
    body.innerHTML = `
      <p><span class="kicker">ASPE 3290 · Contingent Losses</span></p>
      <p>Match each combination of measurability and likelihood to its treatment.</p>
      <div id="aspeQuiz"></div>
    `;
    renderQuizSequence(body, lvl, ASPE_LOSS_QUIZ, drawAssetsGains);
  }
  function drawAssetsGains(){
    const g = CONTINGENT_ASSETS_GAINS;
    body.innerHTML = `
      <p><span class="kicker">Contingent Assets & Gains</span></p>
      <h3>IFRS — Contingent Assets</h3>
      <table class="cmp-table"><tr><th>Probability of inflow</th><th>Treatment</th></tr>
      ${g.ifrsTable.map(r=>`<tr><td>${r.inflow}</td><td>${r.treat}</td></tr>`).join('')}
      </table>
      <h3>ASPE — Contingent Gains</h3>
      <p>${g.aspeRule}</p>
      <div class="callout">Notice the asymmetry, on both frameworks: the bar for recognizing a <b>gain</b> is always higher than the bar for recognizing a <b>loss</b>. That's conservatism at work — financial statements are quicker to recognize bad news than good news.</div>
    `;
    body.appendChild(finishButton(lvl));
  }
  drawTree(0);
}

// ========================================================
// LEVEL: Sorters (subsequent events / changes & errors)
// ========================================================
function renderSorterLevel(body, lvl){
  body.innerHTML = `<p><span class="kicker">${lvl.eyebrow}</span></p><p>Read each situation, pick a classification, then check your reasoning against the explanation.</p><div id="sortList"></div>`;
  const list = document.getElementById('sortList');
  let answeredCount = 0;
  lvl.data.forEach((item,i)=>{
    const card = document.createElement('div'); card.className='sort-item';
    card.innerHTML = `<div>${item.text}</div>
      <div class="buttons">${lvl.sortLabels.map((lab,li)=>`<button data-lab="${lab}">${lvl.sortButtonLabels[li]}</button>`).join('')}</div>
      <div class="explain"></div>`;
    const buttons = card.querySelectorAll('.buttons button');
    const explain = card.querySelector('.explain');
    buttons.forEach(btn=>{
      btn.onclick = ()=>{
        if(card.dataset.answered) return;
        card.dataset.answered = "1";
        answeredCount++;
        const correct = btn.dataset.lab === item.answer;
        buttons.forEach(b=> b.disabled=true);
        btn.classList.add(correct?'sel-good':'sel-bad');
        if(!correct){
          const correctBtn = [...buttons].find(b=>b.dataset.lab===item.answer);
          correctBtn.classList.add('sel-good');
        }
        explain.classList.add('show', correct?'good':'bad');
        explain.textContent = item.explain;
        if(answeredCount === lvl.data.length){
          body.appendChild(finishButton(lvl));
        }
      };
    });
    list.appendChild(card);
  });
}

// ========================================================
// LEVEL: Boss — Momentum Fitness
// ========================================================
function renderBossLevel(body, lvl){
  const b = BOSS;
  const scenes = ['intro','contract','step2','alloc','sale_je','repair_je','input','done'];
  let idx=0;
  function draw(){
    const key = scenes[idx];
    let html = `<div class="progress-dots" style="margin-bottom:14px;">${scenes.map((_,i)=>`<span class="${i<idx?'past':i===idx?'active':''}"></span>`).join('')}</div>`;
    if(key==='intro'){
      html += `<p><span class="kicker">★ Boss Case — Momentum Fitness Inc.</span></p><p>${b.intro}</p>`;
      body.innerHTML=html; stepFooter(body, ()=>{idx++;draw();}, "Read the contract file →");
    } else if(key==='contract'){
      html += `<div class="scenario-card">${b.contractCard}</div>`;
      body.innerHTML=html; stepFooter(body, ()=>{idx++;draw();});
    } else if(key==='step2'){
      html += `<h3>${b.step2.title}</h3><p>${b.step2.q}</p>`;
      body.innerHTML = html;
      const cb=document.createElement('div'); cb.className='choices';
      b.step2.opts.forEach((opt,oi)=>{
        const btn=document.createElement('button'); btn.className='choice-btn'; btn.innerHTML=opt;
        btn.onclick=()=>{
          [...cb.children].forEach(x=>x.disabled=true);
          if(oi===b.step2.correct) btn.classList.add('correct'); else {btn.classList.add('wrong'); cb.children[b.step2.correct].classList.add('correct');}
          const fb=document.createElement('div'); fb.className='feedback show good'; fb.innerHTML=b.step2.explain;
          body.appendChild(fb);
          stepFooter(body, ()=>{idx++;draw();}, "Allocate the transaction price →");
        };
        cb.appendChild(btn);
      });
      body.appendChild(cb);
    } else if(key==='alloc'){
      const st = b.allocation;
      const totalSA = st.rows.reduce((s,r)=>s+r.standalone,0);
      html += `<h3>${st.title}</h3>
      <table class="cmp-table"><tr><th>Item</th><th>Stand-alone price</th><th>% of total</th><th>Allocated price</th></tr>
      ${st.rows.map(r=>{
        const pct=r.standalone/totalSA; const alloc=pct*st.total;
        return `<tr><td>${r.name}</td><td>${fmt(r.standalone)}</td><td>${(pct*100).toFixed(2)}%</td><td><b>${fmt(alloc)}</b></td></tr>`;
      }).join('')}
      <tr><td><b>Total</b></td><td>${fmt(totalSA)}</td><td>100%</td><td><b>${fmt(st.total)}</b></td></tr>
      </table>`;
      body.innerHTML = html; stepFooter(body, ()=>{idx++;draw();}, "Book the delivery entry →");
    } else if(key==='sale_je'){
      const st = b.saleJE;
      html += `<h3>${st.title}</h3><p class="small-note">${st.hint}</p>`;
      body.innerHTML = html;
      renderJEBuilder(body, st.lines, {startRows: 7});
      stepFooter(body, ()=>{idx++;draw();}, "Book the December repair →");
    } else if(key==='repair_je'){
      const st = b.repairJE;
      html += `<h3>${st.title}</h3><p class="small-note">${st.hint}</p>`;
      body.innerHTML = html;
      renderJEBuilder(body, st.lines, {startRows: 6});
      stepFooter(body, ()=>{idx++;draw();}, "One more twist →");
    } else if(key==='input'){
      html += `<h3>Input vs. output method</h3><p>${b.inputMethodCompare.body}</p><p>${b.inputMethodCompare.q}</p>`;
      body.innerHTML = html;
      const cb=document.createElement('div'); cb.className='choices';
      b.inputMethodCompare.opts.forEach((opt,oi)=>{
        const btn=document.createElement('button'); btn.className='choice-btn'; btn.innerHTML=opt;
        btn.onclick=()=>{
          [...cb.children].forEach(x=>x.disabled=true);
          if(oi===b.inputMethodCompare.correct) btn.classList.add('correct'); else {btn.classList.add('wrong'); cb.children[b.inputMethodCompare.correct].classList.add('correct');}
          const fb=document.createElement('div'); fb.className='feedback show good'; fb.innerHTML=b.inputMethodCompare.explain;
          body.appendChild(fb);
          stepFooter(body, ()=>{idx++;draw();}, "Close the case →");
        };
        cb.appendChild(btn);
      });
      body.appendChild(cb);
    } else if(key==='done'){
      html += `<div class="scenario-card" style="text-align:center;">
        <h3 style="margin-top:0;">🏆 Case closed — the trail is complete.</h3>
        <p>You separated an embedded assurance warranty (a provision) from a separately-priced service warranty (its own performance obligation), allocated a discounted bundle, recognized revenue for both a point-in-time good and an over-time service, and compared two different progress measures on the same contract. That's the full toolkit.</p>
      </div>`;
      body.innerHTML = html;
      body.appendChild(finishButton(lvl));
    }
  }
  draw();
}

// ---------------- BOOT ----------------
renderMap();
