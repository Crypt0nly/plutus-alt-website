// Ocur — /be-ai live multiplayer "be the AI" game (client).
//
// Two roles over one anonymous WebSocket to the app backend:
//   • Be the AI  — join the queue, get strangers' prompts, answer as an "AI"
//                  (text or a drawing), and try to fool the asker.
//   • Spot the AI — ask a prompt, read the answers, pick the real Ocur.
//
// Ocur is the house player, so a round always resolves. The WS connects
// directly to the backend host api.ocur.ai (NOT the app.ocur.ai frontend —
// Vercel rewrites don't proxy WebSocket upgrades); the gallery/leaderboard go
// through the same-origin /be-ai/api/* rewrite, which also points at api.ocur.ai.

import './style.css';
import './be-ai.css';
import { initThemeToggle } from './theme.js';
import { initAnalytics, track } from './analytics.js';
import { DrawPad, INK_COLORS, BRUSH_SIZES } from './be-ai-draw.js';

const API = import.meta.env.VITE_BE_AI_API || '/be-ai/api';
const WS_URL = import.meta.env.VITE_BE_AI_WS || 'wss://api.ocur.ai/api/be-ai/ws';
const SIGNUP = 'https://app.ocur.ai?utm_source=be-ai&utm_medium=referral&utm_campaign=reverse-turing';
const PID_KEY = 'ocur-beai-pid';
const NAME_KEY = 'ocur-beai-name';
const MAX_Q = 280;

initAnalytics();
initThemeToggle();
const yearEl = document.getElementById('g-year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── identity (anonymous, persisted) ──────────────────────────────────────────
function playerId() {
  let id = null;
  try {
    id = localStorage.getItem(PID_KEY);
  } catch {
    /* private mode */
  }
  if (!id) {
    id = 'p_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    try {
      localStorage.setItem(PID_KEY, id);
    } catch {
      /* ignore */
    }
  }
  return id;
}
function storedName() {
  try {
    return localStorage.getItem(NAME_KEY) || '';
  } catch {
    return '';
  }
}
const PID = playerId();

// ── flavour copy (blended: dry Ocur wit + absurdist scribble energy) ─────────
const WAIT_LINES = [
  'rounding up some suspiciously confident humans…',
  'waking the machine…',
  'asking the internet to keep a straight face…',
  'shuffling the liars…',
];
const RESULT_FOOLED = [
  'You fooled them. They genuinely thought you were the machine. 🏆',
  'Certified Artificial. They picked you as the real AI.',
  'A human (you) just out-roboted a robot.',
];
const RESULT_SPOTTED = [
  'Busted — they clocked you as human. Too much soul.',
  "They spotted the bot, and it wasn't you. Try weirder.",
  'Rumbled. The meat showed.',
];
const pick = (a) => a[Math.floor(Math.random() * a.length)];

// ── view machine ─────────────────────────────────────────────────────────────
let role = null; // 'ask' | 'be'
function setView(name) {
  $$('.ba-view').forEach((el) => {
    el.hidden = el.dataset.view !== name;
  });
}

// ── HUD ──────────────────────────────────────────────────────────────────────
let me = { credits: 0, name: storedName(), timesFooledOthers: 0, timesSpottedAi: 0 };
function renderMe() {
  $('#ba-credits').textContent = String(me.credits ?? 0);
  $('#ba-fooled').textContent = String(me.timesFooledOthers ?? 0);
  $('#ba-spotted').textContent = String(me.timesSpottedAi ?? 0);
  $('#ba-hud').hidden = false;
}
function renderPresence(p) {
  if (!p) return;
  $('#ba-presence').hidden = false;
  $('#ba-online').textContent = String(p.online ?? 0);
  $('#ba-inqueue').textContent = String(p.inQueue ?? 0);
}

// ── WebSocket transport (reconnect + heartbeat) ──────────────────────────────
let ws = null;
let wsReady = false;
let backoff = 800;
let heartbeat = null;
const pending = []; // queued sends while connecting

function connect() {
  const name = encodeURIComponent(me.name || '');
  const url = `${WS_URL}?pid=${encodeURIComponent(PID)}&name=${name}`;
  try {
    ws = new WebSocket(url);
  } catch {
    setConnected(false);
    return scheduleReconnect();
  }
  ws.onopen = () => {
    wsReady = true;
    backoff = 800;
    setConnected(true);
    while (pending.length) ws.send(JSON.stringify(pending.shift()));
    heartbeat = setInterval(() => send({ type: 'ping' }), 25000);
  };
  ws.onmessage = (e) => {
    let msg;
    try {
      msg = JSON.parse(e.data);
    } catch {
      return;
    }
    handle(msg);
  };
  ws.onclose = () => {
    wsReady = false;
    setConnected(false);
    if (heartbeat) clearInterval(heartbeat);
    scheduleReconnect();
  };
  ws.onerror = () => ws && ws.close();
}
function scheduleReconnect() {
  backoff = Math.min(backoff * 1.7, 12000);
  setTimeout(connect, backoff + Math.random() * 400);
}
function send(msg) {
  if (wsReady && ws) ws.send(JSON.stringify(msg));
  else pending.push(msg);
}
function setConnected(ok) {
  $('#ba-conn').dataset.state = ok ? 'on' : 'off';
  $('#ba-conn-text').textContent = ok ? 'live' : 'reconnecting…';
}

// ── inbound message handling ─────────────────────────────────────────────────
let currentRound = null; // asker's active round id
let promptRound = null; // responder's active prompt round id

function handle(msg) {
  switch (msg.type) {
    case 'welcome':
      if (msg.player) {
        me = { ...me, ...msg.player };
        if (msg.player.name) me.name = msg.player.name;
      }
      renderMe();
      renderPresence(msg.presence);
      if (msg.stats) renderGlobalStat(msg.stats);
      break;
    case 'player':
      me = { ...me, ...msg.player };
      renderMe();
      break;
    case 'presence':
      renderPresence(msg);
      break;
    case 'stats':
      renderGlobalStat(msg.stats);
      break;
    case 'queued':
      promptRound = null;
      $('#ba-queue-pos').textContent = msg.position ? `#${msg.position} in line` : 'next up';
      $('#ba-queue-wait').textContent = msg.estWaitMs
        ? `~${Math.ceil(msg.estWaitMs / 1000)}s wait`
        : 'any moment now';
      if (role === 'be') setView('queued');
      break;
    case 'left_queue':
      if (role === 'be') setView('join');
      break;
    case 'prompt':
      promptRound = msg.roundId;
      openPrompt(msg);
      break;
    case 'answer_received':
      setView('answered');
      break;
    case 'asked':
      currentRound = msg.roundId;
      if (msg.player) {
        me = { ...me, ...msg.player };
        renderMe();
      }
      $('#ba-asked-line').textContent = msg.liveResponders
        ? `${msg.liveResponders} real human${msg.liveResponders > 1 ? 's are' : ' is'} writing their best robot impression…`
        : pick(WAIT_LINES);
      setView('asked');
      break;
    case 'out_of_credits':
      if (msg.player) {
        me = { ...me, ...msg.player };
        renderMe();
      }
      setView('broke');
      break;
    case 'duel':
      renderDuel(msg);
      break;
    case 'reveal':
      renderReveal(msg);
      break;
    case 'result':
      renderResult(msg);
      break;
    case 'vote_update':
      updateVotes(msg);
      break;
    case 'error':
      flash(msg.message || 'something glitched');
      break;
    default:
      break;
  }
}

// ── ASKER: ask → asked → duel → reveal ───────────────────────────────────────
$('#ba-ask-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const q = $('#ba-question').value.trim().slice(0, MAX_Q);
  if (!q) return;
  track('be_ai_ask', { length: q.length });
  send({ type: 'ask', question: q });
});
$('#ba-question').addEventListener('input', (e) => {
  $('#ba-qcount').textContent = String(e.target.value.length);
});
$$('.ba-chip').forEach((c) =>
  c.addEventListener('click', () => {
    $('#ba-question').value = c.textContent;
    $('#ba-question').dispatchEvent(new Event('input'));
  })
);

function renderDuel(msg) {
  currentRound = msg.roundId;
  $('#ba-duel-q').textContent = msg.question;
  const wrap = $('#ba-duel-options');
  wrap.innerHTML = '';
  msg.options.forEach((o, i) => {
    wrap.appendChild(optionCard(o, i, false));
  });
  setView('duel');
}

function optionCard(o, i, revealed) {
  const card = document.createElement('div');
  card.className = 'ba-answer ba-sketch';
  card.dataset.id = o.id;
  const body =
    o.kind === 'drawing'
      ? `<img class="ba-answer-img" src="${o.drawing}" alt="a hand-drawn answer" />`
      : `<p class="ba-answer-text"></p>`;
  card.innerHTML = `
    <div class="ba-answer-tag ba-hand">answer ${String.fromCharCode(65 + i)}</div>
    ${body}
    <div class="ba-answer-actions">
      <button type="button" class="ba-pickbtn" data-id="${o.id}">this is the real AI →</button>
      <div class="ba-votes">
        <button type="button" class="ba-vote" data-dir="up" data-id="${o.id}">👍 <span data-up="${o.id}">0</span></button>
        <button type="button" class="ba-vote" data-dir="down" data-id="${o.id}">👎 <span data-down="${o.id}">0</span></button>
      </div>
    </div>`;
  if (o.kind !== 'drawing') card.querySelector('.ba-answer-text').textContent = o.text;
  if (!revealed) {
    card.querySelector('.ba-pickbtn').addEventListener('click', () => {
      track('be_ai_guess', {});
      send({ type: 'guess', roundId: currentRound, responseId: o.id });
    });
  }
  card.querySelectorAll('.ba-vote').forEach((b) =>
    b.addEventListener('click', () =>
      send({ type: 'vote', responseId: b.dataset.id, dir: b.dataset.dir })
    )
  );
  return card;
}

function updateVotes(msg) {
  const up = document.querySelector(`[data-up="${msg.responseId}"]`);
  const down = document.querySelector(`[data-down="${msg.responseId}"]`);
  if (up) up.textContent = String(msg.votesUp);
  if (down) down.textContent = String(msg.votesDown);
}

let lastReveal = null;
function renderReveal(msg) {
  if (msg.player) {
    me = { ...me, ...msg.player };
    renderMe();
  }
  $('#ba-reveal-emoji').textContent = msg.correct ? '🎯' : '😱';
  $('#ba-reveal-h').textContent = msg.correct
    ? 'You spotted the real Ocur.'
    : 'A human just out-AI’d you.';
  $('#ba-reveal-sub').textContent = msg.correct
    ? `+${msg.reward} credits. The machines respect you.`
    : 'You picked a human pretending. Happens to the best of us.';
  const grid = $('#ba-reveal-grid');
  grid.innerHTML = '';
  msg.options.forEach((o) => {
    const card = document.createElement('div');
    const human = !o.isOcur;
    card.className = `ba-answer ba-sketch ${o.isOcur ? 'is-ai' : 'is-human'}${
      o.id === msg.pickedId ? ' is-picked' : ''
    }`;
    const label = o.isOcur
      ? `<img src="/logo.svg" alt="" /> The real Ocur`
      : `🥸 ${o.playerName || 'a human'} — pretending to be an AI`;
    const body =
      o.kind === 'drawing'
        ? `<img class="ba-answer-img" src="${o.drawing}" alt="a hand-drawn answer" />`
        : `<p class="ba-answer-text"></p>`;
    card.innerHTML = `<div class="ba-answer-label ba-hand">${label}</div>${body}`;
    if (o.kind !== 'drawing') card.querySelector('.ba-answer-text').textContent = o.text;
    grid.appendChild(card);
  });
  lastReveal = { correct: msg.correct, me: { ...me } };
  setView('reveal');
  loadGalleryAndBoard();
}

// ── RESPONDER: join → queued → prompt → answered → result ────────────────────
let pad = null;
let answerMode = 'text';

function openPrompt(msg) {
  $('#ba-prompt-q').textContent = msg.question;
  $('#ba-answer').value = '';
  $('#ba-acount').textContent = '0';
  if (pad) pad.clear();
  setAnswerMode('text');
  startPromptTimer(msg.deadlineMs || 30000);
  setView('prompt');
}

let promptTimer = null;
function startPromptTimer(ms) {
  const end = Date.now() + ms;
  const bar = $('#ba-timer-bar');
  const tick = () => {
    const left = Math.max(0, end - Date.now());
    bar.style.width = `${(left / ms) * 100}%`;
    if (left <= 0 && promptTimer) {
      clearInterval(promptTimer);
      promptTimer = null;
    }
  };
  if (promptTimer) clearInterval(promptTimer);
  tick();
  if (!reduceMotion) promptTimer = setInterval(tick, 100);
}

function setAnswerMode(mode) {
  answerMode = mode;
  $('#ba-mode-text').classList.toggle('on', mode === 'text');
  $('#ba-mode-draw').classList.toggle('on', mode === 'draw');
  $('#ba-answer-text-wrap').hidden = mode !== 'text';
  $('#ba-answer-draw-wrap').hidden = mode !== 'draw';
  if (mode === 'draw' && !pad) initPad();
}
$('#ba-mode-text').addEventListener('click', () => setAnswerMode('text'));
$('#ba-mode-draw').addEventListener('click', () => setAnswerMode('draw'));

function initPad() {
  pad = new DrawPad($('#ba-canvas'));
  const palette = $('#ba-palette');
  INK_COLORS.forEach((c, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'ba-swatch' + (i === 0 ? ' on' : '');
    b.style.background = c;
    b.addEventListener('click', () => {
      pad.setColor(c);
      $$('.ba-swatch', palette).forEach((s) => s.classList.remove('on'));
      b.classList.add('on');
    });
    palette.appendChild(b);
  });
  const sizes = $('#ba-sizes');
  BRUSH_SIZES.forEach((s, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'ba-sizebtn' + (i === 1 ? ' on' : '');
    b.innerHTML = `<i style="width:${s}px;height:${s}px"></i>`;
    b.addEventListener('click', () => {
      pad.setSize(s);
      $$('.ba-sizebtn', sizes).forEach((x) => x.classList.remove('on'));
      b.classList.add('on');
    });
    sizes.appendChild(b);
  });
  $('#ba-undo').addEventListener('click', () => pad.undo());
  $('#ba-redo').addEventListener('click', () => pad.redo());
  $('#ba-clear').addEventListener('click', () => pad.clear());
}

$('#ba-answer').addEventListener('input', (e) => {
  $('#ba-acount').textContent = String(e.target.value.length);
});

$('#ba-answer-submit').addEventListener('click', () => {
  if (!promptRound) return;
  if (answerMode === 'draw') {
    const drawing = pad && pad.toDataURL();
    if (!drawing) return flash('draw something first');
    send({ type: 'respond', roundId: promptRound, kind: 'drawing', drawing });
  } else {
    const text = $('#ba-answer').value.trim();
    if (!text) return flash('write something first');
    send({ type: 'respond', roundId: promptRound, kind: 'text', text: text.slice(0, 600) });
  }
  track('be_ai_respond', { mode: answerMode });
});

function renderResult(msg) {
  if (msg.player) {
    me = { ...me, ...msg.player };
    renderMe();
  }
  const fooled = msg.fooledThem;
  $('#ba-result-emoji').textContent = fooled ? '🏆' : '🫠';
  $('#ba-result-h').textContent = fooled ? 'You fooled them!' : 'They spotted the bot.';
  $('#ba-result-sub').textContent = fooled
    ? `${pick(RESULT_FOOLED)} +${msg.reward} credits.`
    : pick(RESULT_SPOTTED);
  lastReveal = { correct: !fooled, fooledAsResponder: fooled, me: { ...me } };
  setView('result');
  loadGalleryAndBoard();
}

// ── role picker + nav between flows ──────────────────────────────────────────
$('#ba-pick-be').addEventListener('click', () => {
  role = 'be';
  track('be_ai_role', { role: 'be' });
  setView('join');
});
$('#ba-pick-ask').addEventListener('click', () => {
  role = 'ask';
  track('be_ai_role', { role: 'ask' });
  setView('ask');
});
$$('.ba-torole').forEach((b) =>
  b.addEventListener('click', () => {
    const r = b.dataset.role;
    if (r === 'be') {
      role = 'be';
      setView('join');
    } else if (r === 'ask') {
      role = 'ask';
      setView('ask');
    } else {
      setView('pick');
    }
  })
);
$('#ba-join').addEventListener('click', () => {
  send({ type: 'join_queue' });
  track('be_ai_join_queue', {});
});
$('#ba-leave').addEventListener('click', () => send({ type: 'leave_queue' }));
$('#ba-ask-again').addEventListener('click', () => {
  $('#ba-question').value = '';
  $('#ba-qcount').textContent = '0';
  setView('ask');
});
$('#ba-be-again').addEventListener('click', () => send({ type: 'join_queue' }));
$('#ba-broke-be').addEventListener('click', () => {
  role = 'be';
  setView('join');
});
$$('.ba-cta-link, #ba-cta-btn').forEach((a) =>
  a.addEventListener('click', () => track('be_ai_cta_click', { placement: 'game' }))
);

// name editor
$('#ba-name').value = me.name || '';
$('#ba-name').addEventListener('change', (e) => {
  const name = e.target.value.trim().slice(0, 24);
  me.name = name;
  try {
    localStorage.setItem(NAME_KEY, name);
  } catch {
    /* ignore */
  }
  send({ type: 'set_name', name });
});

// ── gallery + leaderboard (HTTP) ─────────────────────────────────────────────
async function loadGalleryAndBoard() {
  loadGallery();
  loadBoard();
}
async function loadGallery() {
  try {
    const r = await fetch(`${API}/gallery`);
    if (!r.ok) return;
    const { items } = await r.json();
    const grid = $('#ba-gallery-grid');
    if (!items || !items.length) return;
    grid.innerHTML = '';
    items.slice(0, 24).forEach((it) => {
      const card = document.createElement('figure');
      card.className = 'ba-gal ba-sketch';
      const body =
        it.kind === 'drawing'
          ? `<img src="${it.drawing}" alt="a hand-drawn answer" />`
          : `<p class="ba-answer-text"></p>`;
      card.innerHTML = `${body}<figcaption class="ba-hand">“${it.question}”${
        it.pickedAsAi ? ' · fooled them 🏆' : ''
      }</figcaption>`;
      if (it.kind !== 'drawing') card.querySelector('.ba-answer-text').textContent = it.text;
      grid.appendChild(card);
    });
    $('#ba-gallery').hidden = false;
  } catch {
    /* gallery is best-effort */
  }
}
async function loadBoard() {
  try {
    const r = await fetch(`${API}/leaderboard`);
    if (!r.ok) return;
    const { players } = await r.json();
    if (!players || !players.length) return;
    const ol = $('#ba-board-list');
    ol.innerHTML = '';
    players.slice(0, 10).forEach((p) => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="ba-board-name">${escapeHtml(p.name)}</span>
        <span class="ba-board-score">fooled ${p.timesFooledOthers}×</span>`;
      ol.appendChild(li);
    });
    $('#ba-leaderboard').hidden = false;
  } catch {
    /* best-effort */
  }
}
function renderGlobalStat(stats) {
  if (!stats || !stats.totalGuesses) return;
  const el = $('#ba-globalstat');
  if (!el) return;
  $('#ba-globalstat-text').innerHTML = `Humans have fooled players <strong>${(
    stats.humanFooledCount || 0
  ).toLocaleString()}×</strong> into thinking they were the AI`;
  el.hidden = false;
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ── transient toast ──────────────────────────────────────────────────────────
let toastTimer = null;
function flash(text) {
  const t = $('#ba-toast');
  t.textContent = text;
  t.hidden = false;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.hidden = true), 2600);
}

// ── share card (lazy) ────────────────────────────────────────────────────────
import('./be-ai-share.js')
  .then(({ initShare }) => initShare({ lastResult: () => lastReveal, track }))
  .catch(() => {});

// ── go ───────────────────────────────────────────────────────────────────────
setView('pick');
connect();
loadGalleryAndBoard();
