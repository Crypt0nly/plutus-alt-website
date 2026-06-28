// Ocur — /be-ai "reverse Turing test" game.
//
// The marketing shell owns this screen; the actual game endpoints live in the
// app backend (plutus-cloud) and are reached same-origin via a reverse-proxy
// rewrite so there's no CORS and no app shell in the way:
//
//   /be-ai/api/round  ->  app.ocur.ai  POST /api/be-ai/round   {question}
//   /be-ai/api/guess  ->  app.ocur.ai  POST /api/be-ai/guess   {roundId, slot}
//   /be-ai/api/stats  ->  app.ocur.ai  GET  /api/be-ai/stats
//
// (see vercel.json for the production rewrite, vite.config.js for the dev
// proxy). Anonymous by design — play is the funnel, login is a later step.

import './style.css';
import './be-ai.css';
import { initThemeToggle } from './theme.js';
import { initAnalytics, track } from './analytics.js';

const API = import.meta.env.VITE_BE_AI_API || '/be-ai/api';
const SIGNUP = 'https://app.ocur.ai?utm_source=be-ai&utm_medium=referral&utm_campaign=reverse-turing';
const SCORE_KEY = 'ocur-beai-score';
const MAX_Q = 280;

initAnalytics();
initThemeToggle();
const yearEl = document.getElementById('g-year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// ── tiny DOM helpers ─────────────────────────────────────────────────────────
const $ = (sel, root = document) => root.querySelector(sel);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── flavour copy (absurdist-funny tone) ──────────────────────────────────────
const THINK_STATUS = [
  'consulting the machines…',
  'asking a human to act normal…',
  'warming up the robot voice…',
  'pretending to compute…',
  'aligning the vibes…',
  'booting confidence.exe…',
];
const WIN_SUBS = [
  'Certified AI-whisperer. The machines fear you.',
  'You saw straight through the meat puppet. Respect.',
  'Real recognises real — or does artificial recognise artificial?',
  'Flawless. You owe the human nothing.',
];
const LOSS_SUBS = [
  'A regular human, with a regular brain, fooled you completely.',
  'You just lost a Turing test to someone typing with their thumbs.',
  'They did a little robot voice and you bought the whole thing.',
  'Out-AI’d by a carbon-based life form. It happens.',
];
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ── score (session-persistent in localStorage) ───────────────────────────────
function loadScore() {
  try {
    const s = JSON.parse(localStorage.getItem(SCORE_KEY) || '{}');
    return {
      rounds: s.rounds | 0,
      spotted: s.spotted | 0,
      fooled: s.fooled | 0,
    };
  } catch {
    return { rounds: 0, spotted: 0, fooled: 0 };
  }
}
function saveScore(score) {
  try {
    localStorage.setItem(SCORE_KEY, JSON.stringify(score));
  } catch {
    /* private mode — score just won't persist */
  }
}
let score = loadScore();

function renderScore() {
  const box = $('#ba-score');
  if (score.rounds === 0) {
    box.hidden = true;
    return;
  }
  box.hidden = false;
  $('#ba-score-spotted').textContent = String(score.spotted);
  $('#ba-score-rounds').textContent = String(score.rounds);
  $('#ba-score-fooled').textContent = String(score.fooled);
}

// ── stage machine ────────────────────────────────────────────────────────────
const stages = {};
document.querySelectorAll('.ba-stage').forEach((el) => {
  stages[el.dataset.stage] = el;
});
function showStage(name) {
  Object.entries(stages).forEach(([key, el]) => {
    el.hidden = key !== name;
  });
}

// ── thinking animation (cycles the absurd statuses) ──────────────────────────
let thinkTimer = null;
function startThinking(question) {
  $('#ba-think-q').textContent = `“${question}”`;
  const statusEl = $('#ba-think-status');
  let i = 0;
  statusEl.textContent = THINK_STATUS[0];
  showStage('think');
  if (reduceMotion) return;
  thinkTimer = window.setInterval(() => {
    i = (i + 1) % THINK_STATUS.length;
    statusEl.textContent = THINK_STATUS[i];
  }, 1100);
}
function stopThinking() {
  if (thinkTimer) window.clearInterval(thinkTimer);
  thinkTimer = null;
}

// ── round + guess state ──────────────────────────────────────────────────────
let current = null; // { roundId, question, options }
let lastResult = null; // for the share card

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function startRound(question) {
  question = question.trim().slice(0, MAX_Q);
  if (!question) return;
  current = null;
  track('be_ai_round_start', { question_length: question.length });
  startThinking(question);
  setAskBusy(true);

  // keep the "thinking" beat on screen a moment even if the API is instant —
  // an instant reveal undersells the duel.
  const minBeat = reduceMotion ? 0 : 900;
  try {
    const [data] = await Promise.all([
      postJSON(`${API}/round`, { question }),
      wait(minBeat),
    ]);
    stopThinking();
    current = data;
    renderDuel(data);
  } catch (err) {
    stopThinking();
    showError(err);
  } finally {
    setAskBusy(false);
  }
}

function renderDuel(data) {
  $('#ba-duel-q').textContent = data.question;
  const wrap = $('#ba-options');
  wrap.innerHTML = '';
  (data.options || []).forEach((opt) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'ba-option lg glare';
    card.dataset.slot = opt.slot;
    card.innerHTML = `
      <span class="ba-option-tag"><span class="ba-option-slot">${opt.slot}</span>Answer ${opt.slot}</span>
      <span class="ba-option-text"></span>
      <span class="ba-option-pick">This one's the real AI →</span>`;
    card.querySelector('.ba-option-text').textContent = opt.text;
    card.addEventListener('click', () => submitGuess(opt.slot));
    wrap.appendChild(card);
  });
  showStage('duel');
}

async function submitGuess(slot) {
  if (!current) return;
  // lock the cards so a double-tap can't fire two guesses
  document.querySelectorAll('.ba-option').forEach((el) => {
    el.disabled = true;
    el.style.pointerEvents = 'none';
    if (el.dataset.slot === slot) el.dataset.picked = 'true';
  });
  try {
    const result = await postJSON(`${API}/guess`, { roundId: current.roundId, slot });
    renderReveal(result, slot);
  } catch (err) {
    showError(err);
  }
}

function renderReveal(result, pickedSlot) {
  const correct = !!result.correct;

  // score
  score.rounds += 1;
  if (correct) score.spotted += 1;
  else score.fooled += 1;
  saveScore(score);
  renderScore();

  track('be_ai_guess', { correct, picked: pickedSlot, round: score.rounds });

  // verdict
  $('#ba-verdict-emoji').textContent = correct ? '🎯' : '😱';
  $('#ba-verdict-h').textContent = correct ? 'You spotted the machine.' : 'A human just out-AI’d you.';
  $('#ba-verdict-sub').textContent = correct ? pick(WIN_SUBS) : pick(LOSS_SUBS);

  // revealed answers — the real Ocur is branded; the human is clearly flagged
  // as NOT Ocur (the headline brand-safety guard).
  const grid = $('#ba-reveal-grid');
  grid.innerHTML = '';
  ['A', 'B'].forEach((slot) => {
    const isAi = slot === result.aiSlot;
    const card = document.createElement('div');
    card.className = `ba-reveal-card ${isAi ? 'is-ai' : 'is-human'}${slot === pickedSlot ? ' is-picked' : ''}`;
    const label = isAi
      ? `<img src="/logo.svg" alt="" /> The real Ocur`
      : `🥸 A human pretending to be an AI`;
    card.innerHTML = `
      <div class="ba-reveal-label">${label}</div>
      <div class="ba-reveal-text"></div>`;
    card.querySelector('.ba-reveal-text').textContent = (result.answers && result.answers[slot]) || '';
    grid.appendChild(card);
  });

  lastResult = { correct, score: { ...score } };
  showStage('reveal');

  // soft nudge: after a few rounds, gently re-point at the product
  if (score.rounds === 3) {
    $('#ba-cta-btn').textContent = 'Okay, I have to try the real one →';
  }
}

function showError(err) {
  const msg = $('#ba-error-msg');
  if (msg) {
    msg.textContent =
      err && err.status === 429
        ? 'Whoa, slow down — too many rounds too fast. Give it a few seconds.'
        : 'Couldn’t start that round. Give it another go in a moment.';
  }
  showStage('error');
}

// ── ask form ─────────────────────────────────────────────────────────────────
const askForm = $('#ba-ask-form');
const questionInput = $('#ba-question');
const askBtn = $('#ba-ask-btn');

function setAskBusy(busy) {
  askBtn.disabled = busy;
  askBtn.classList.toggle('ba-ask-btn-spin', busy);
  askBtn.textContent = busy ? 'Summoning contestants…' : 'Pit them against each other';
}

questionInput.addEventListener('input', () => {
  const n = questionInput.value.length;
  $('#ba-count').textContent = String(n);
});

askForm.addEventListener('submit', (e) => {
  e.preventDefault();
  startRound(questionInput.value);
});

document.querySelectorAll('.ba-chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    questionInput.value = chip.textContent;
    questionInput.dispatchEvent(new Event('input'));
    startRound(chip.textContent);
  });
});

// next round / retry → back to a fresh ask
function resetToAsk() {
  questionInput.value = '';
  $('#ba-count').textContent = '0';
  showStage('ask');
  document.getElementById('play').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  questionInput.focus({ preventScroll: true });
}
$('#ba-next-btn').addEventListener('click', resetToAsk);
$('#ba-retry-btn').addEventListener('click', resetToAsk);

// ── CTA + teaser analytics (links navigate normally) ─────────────────────────
$('#ba-cta-btn').addEventListener('click', () => track('be_ai_cta_click', { placement: 'reveal' }));
$('#ba-teaser-btn').addEventListener('click', () => track('be_ai_cta_click', { placement: 'teaser' }));
document
  .querySelectorAll('.g-nav .g-btn, .ba-final .g-btn')
  .forEach((a) => a.addEventListener('click', () => track('be_ai_cta_click', { placement: 'chrome' })));

// ── network ──────────────────────────────────────────────────────────────────
async function postJSON(url, body) {
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    const err = new Error(`Request failed: ${resp.status}`);
    err.status = resp.status;
    throw err;
  }
  return resp.json();
}

// ── global stats on the hero (social proof) ──────────────────────────────────
(async function loadGlobalStats() {
  try {
    const resp = await fetch(`${API}/stats`);
    if (!resp.ok) return;
    const s = await resp.json();
    if (!s || !s.totalGuesses) return;
    const el = $('#ba-globalstat');
    const fooled = s.humanFooledCount | 0;
    $('#ba-globalstat-text').innerHTML =
      fooled > 0
        ? `Humans have fooled players <strong>${fooled.toLocaleString()}×</strong> into thinking they were the AI`
        : `<strong>${(s.totalRounds | 0).toLocaleString()}</strong> rounds played so far`;
    el.hidden = false;
  } catch {
    /* stats are optional flair — stay hidden on failure */
  }
})();

// ── share card ───────────────────────────────────────────────────────────────
import('./be-ai-share.js')
  .then(({ initShare }) => initShare({ lastResult: () => lastResult, track }))
  .catch(() => {
    /* share is enhancement-only; the game works without it */
  });
