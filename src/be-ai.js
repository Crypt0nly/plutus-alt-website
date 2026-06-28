// Ocur — /be-ai live multiplayer "be the AI" game (client).
//
// Two roles over one anonymous WebSocket to the app backend:
//   • Be the AI  — join the queue, get strangers' prompts, answer as an "AI"
//                  (text or a drawing), and try to fool the asker.
//   • Spot the AI — ask a prompt, read the answers, pick the real Ocur.
//
// Both roles play out in a chat transcript: your message goes out as a bubble,
// the room's replies stream back as bubbles, a typing indicator covers the wait.
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
const WORD_LIMIT = 10;

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

// ── flavour copy ─────────────────────────────────────────────────────────────
const RESULT_FOOLED = [
  'They genuinely thought you were the machine. 🏆',
  'Certified Artificial. They picked you as the real AI.',
  'A human (you) just out-roboted a robot.',
];
const RESULT_SPOTTED = [
  'They clocked you as human. Too much soul.',
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

// ── chat transcript helpers ──────────────────────────────────────────────────
function chatReset(c) {
  c.innerHTML = '';
}
function scrollChat(c) {
  c.scrollTop = c.scrollHeight;
}
function addMsg(c, side, opts = {}) {
  const el = document.createElement('div');
  el.className = `ba-msg ba-msg-${side}`;
  if (opts.label) {
    const l = document.createElement('div');
    l.className = 'ba-msg-label ba-hand';
    l.innerHTML = opts.label;
    el.appendChild(l);
  }
  const body = document.createElement('div');
  body.className = 'ba-msg-body';
  if (opts.drawing) {
    const img = document.createElement('img');
    img.className = 'ba-msg-img';
    img.src = opts.drawing;
    img.alt = 'a hand-drawn answer';
    body.appendChild(img);
  } else {
    const span = document.createElement('span');
    span.textContent = opts.text || '';
    body.appendChild(span);
  }
  el.appendChild(body);
  if (opts.footer) el.appendChild(opts.footer);
  c.appendChild(el);
  scrollChat(c);
  return el;
}
function setTyping(c, on) {
  let t = c.querySelector('.ba-typing');
  if (on && !t) {
    t = document.createElement('div');
    t.className = 'ba-msg ba-msg-in ba-typing';
    t.innerHTML = '<div class="ba-msg-body"><span class="ba-dots"><i></i><i></i><i></i></span></div>';
    c.appendChild(t);
    scrollChat(c);
  } else if (!on && t) {
    t.remove();
  }
}

// ── WebSocket transport (reconnect + heartbeat) ──────────────────────────────
let ws = null;
let wsReady = false;
let backoff = 800;
let heartbeat = null;
const pending = [];

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
const askChat = () => $('#ba-ask-chat');
const beChat = () => $('#ba-be-chat');

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
      openPrompt(msg);
      break;
    case 'answer_received':
      onAnswerReceived();
      break;
    case 'asked':
      currentRound = msg.roundId;
      if (msg.player) {
        me = { ...me, ...msg.player };
        renderMe();
      }
      $('#ba-ask-hint').textContent = msg.liveResponders
        ? `${msg.liveResponders} real human${msg.liveResponders > 1 ? 's are' : ' is'} writing…`
        : 'the room is answering…';
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
      // mid-answer rejection: clear the typing dots and bring the composer back
      if (role === 'be' && $('#ba-be-after').hidden) {
        setTyping(beChat(), false);
        $('#ba-be-composer').hidden = false;
        pendingAnswer = null;
      }
      break;
    default:
      break;
  }
}

// ── ASKER: ask → chat (question + answers) → pick → reveal ───────────────────
$('#ba-ask-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const q = $('#ba-question').value.trim().slice(0, MAX_Q);
  if (!q) return;
  track('be_ai_ask', { length: q.length });
  setView('ask-chat');
  $('#ba-ask-after').hidden = true;
  $('#ba-ask-hint').textContent = 'sending to the room…';
  chatReset(askChat());
  addMsg(askChat(), 'out', { text: q });
  setTyping(askChat(), true);
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

const askBubbles = {}; // responseId -> bubble element (for relabel on reveal)
function renderDuel(msg) {
  currentRound = msg.roundId;
  setTyping(askChat(), false);
  $('#ba-ask-hint').textContent = 'one of these is the real Ocur — tap it';
  for (const id in askBubbles) delete askBubbles[id];
  msg.options.forEach((o, i) => {
    const foot = document.createElement('div');
    foot.className = 'ba-msg-foot';
    const pickBtn = document.createElement('button');
    pickBtn.type = 'button';
    pickBtn.className = 'ba-pickbtn';
    pickBtn.textContent = "🤖 it's the AI";
    pickBtn.addEventListener('click', () => {
      track('be_ai_guess', {});
      $$('.ba-pickbtn', askChat()).forEach((b) => (b.disabled = true));
      send({ type: 'guess', roundId: currentRound, responseId: o.id });
    });
    foot.appendChild(pickBtn);
    foot.appendChild(voteWidget(o.id));
    const el = addMsg(askChat(), 'in', {
      label: `answer ${String.fromCharCode(65 + i)}`,
      text: o.kind === 'drawing' ? '' : o.text,
      drawing: o.kind === 'drawing' ? o.drawing : null,
      footer: foot,
    });
    askBubbles[o.id] = el;
  });
}

function voteWidget(id) {
  const wrap = document.createElement('div');
  wrap.className = 'ba-votes';
  ['up', 'down'].forEach((dir) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'ba-vote';
    b.innerHTML = `${dir === 'up' ? '👍' : '👎'} <span data-${dir}="${id}">0</span>`;
    b.addEventListener('click', () => send({ type: 'vote', responseId: id, dir }));
    wrap.appendChild(b);
  });
  return wrap;
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
  $$('.ba-pickbtn', askChat()).forEach((b) => b.remove());
  msg.options.forEach((o) => {
    const el = askBubbles[o.id];
    if (!el) return;
    el.classList.add(o.isOcur ? 'is-ai' : 'is-human');
    if (o.id === msg.pickedId) el.classList.add('is-picked');
    const label = el.querySelector('.ba-msg-label');
    if (label) {
      label.innerHTML = o.isOcur
        ? `<img src="/logo.svg" alt="" /> The real Ocur`
        : `🥸 ${o.playerName || 'a human'} — pretending`;
    }
  });
  $('#ba-reveal-emoji').textContent = msg.correct ? '🎯' : '😱';
  $('#ba-reveal-h').textContent = msg.correct
    ? 'You spotted the real Ocur.'
    : 'A human just out-AI’d you.';
  $('#ba-reveal-sub').textContent = msg.correct
    ? `+${msg.reward} credits. The machines respect you.`
    : 'You picked a human pretending. Happens to the best of us.';
  addMsg(askChat(), 'sys', { text: msg.correct ? '🎯 you got it' : '😱 fooled' });
  $('#ba-ask-hint').textContent = 'round over';
  lastReveal = { correct: msg.correct, me: { ...me } };
  $('#ba-ask-after').hidden = false;
  scrollChat(askChat());
  loadGalleryAndBoard();
}

// ── RESPONDER: prompt → chat (question + your answer) → result ───────────────
let pad = null;
let answerMode = 'text';
let pendingAnswer = null;

function openPrompt(msg) {
  promptRound = msg.roundId;
  setView('be-chat');
  $('#ba-be-after').hidden = true;
  chatReset(beChat());
  const who = msg.fromBot ? '🤖 a curious AI asks' : '🕵️ a human asks';
  addMsg(beChat(), 'in', { label: who, text: msg.question });
  $('#ba-answer').value = '';
  updateWordCount();
  if (pad) pad.clear();
  setAnswerMode('text');
  $('#ba-be-composer').hidden = false;
  startPromptTimer(msg.deadlineMs || 30000);
}

function onAnswerReceived() {
  $('#ba-be-composer').hidden = true;
  stopTimer();
  if (pendingAnswer) {
    addMsg(beChat(), 'out', {
      text: pendingAnswer.kind === 'text' ? pendingAnswer.text : '',
      drawing: pendingAnswer.kind === 'drawing' ? pendingAnswer.drawing : null,
    });
    pendingAnswer = null;
  }
  setTyping(beChat(), true);
}

let promptTimer = null;
function startPromptTimer(ms) {
  const end = Date.now() + ms;
  const bar = $('#ba-timer-bar');
  $('#ba-timer').hidden = false;
  const tick = () => {
    const left = Math.max(0, end - Date.now());
    bar.style.width = `${(left / ms) * 100}%`;
    if (left <= 0) stopTimer();
  };
  if (promptTimer) clearInterval(promptTimer);
  tick();
  if (!reduceMotion) promptTimer = setInterval(tick, 100);
}
function stopTimer() {
  if (promptTimer) clearInterval(promptTimer);
  promptTimer = null;
  $('#ba-timer').hidden = true;
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

function wordCount(s) {
  return (s.trim().match(/\S+/g) || []).length;
}
function updateWordCount() {
  const n = wordCount($('#ba-answer').value);
  const wc = $('#ba-wordcount');
  wc.querySelector('strong').textContent = String(n);
  wc.classList.toggle('over', n > WORD_LIMIT);
}
$('#ba-answer').addEventListener('input', updateWordCount);

$('#ba-answer-submit').addEventListener('click', () => {
  if (!promptRound) return;
  if (answerMode === 'draw') {
    const drawing = pad && pad.toDataURL();
    if (!drawing) return flash('draw something first');
    pendingAnswer = { kind: 'drawing', drawing };
    send({ type: 'respond', roundId: promptRound, kind: 'drawing', drawing });
  } else {
    const text = $('#ba-answer').value.trim();
    if (!text) return flash('write something first');
    pendingAnswer = { kind: 'text', text: text.slice(0, 280) };
    send({ type: 'respond', roundId: promptRound, kind: 'text', text: pendingAnswer.text });
  }
  track('be_ai_respond', { mode: answerMode });
});

function renderResult(msg) {
  if (msg.player) {
    me = { ...me, ...msg.player };
    renderMe();
  }
  setTyping(beChat(), false);
  const fooled = msg.fooledThem;
  addMsg(beChat(), 'sys', { text: fooled ? '🏆 you fooled them!' : '🫠 they spotted the bot' });
  $('#ba-result-emoji').textContent = fooled ? '🏆' : '🫠';
  $('#ba-result-h').textContent = fooled ? 'You fooled them!' : 'They spotted the bot.';
  $('#ba-result-sub').textContent = fooled
    ? `${pick(RESULT_FOOLED)} +${msg.reward} credits.`
    : pick(RESULT_SPOTTED);
  lastReveal = { correct: !fooled, fooledAsResponder: fooled, me: { ...me } };
  $('#ba-be-after').hidden = false;
  scrollChat(beChat());
  loadGalleryAndBoard();
}

// ── role picker + nav ─────────────────────────────────────────────────────────
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
function loadGalleryAndBoard() {
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
      card.innerHTML = `${body}<figcaption class="ba-hand">“${escapeHtml(it.question)}”${
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
  return String(s).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );
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
