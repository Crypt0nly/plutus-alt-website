import './style.css';
import { INTEGRATIONS, icon } from './icons.js';
import { initReveals, reducedMotion } from './fx.js';
import { mountSwitcher } from './switcher.js';

mountSwitcher('minimal');

// Hero demo scenarios: prompt → plan steps → result summary.
const SCENARIOS = [
  {
    prompt: 'Research our top 3 competitors',
    steps: ['Scan the market', 'Compare features and pricing', 'Write up a brief in Files'],
    summary: 'Done — brief saved to Files, 3 competitors compared.',
  },
  {
    prompt: 'Clean up the open PRs',
    steps: ['Review 7 open pull requests', 'Merge the ones that pass CI', 'Nudge reviewers on Discord'],
    summary: 'Done — 5 PRs merged, 2 reviewers pinged.',
  },
  {
    prompt: 'Plan Thursday’s launch',
    steps: ['Find a slot that works for everyone', 'Book the room on Calendar', 'Email the agenda to the team'],
    summary: 'Done — Thursday 10:00 booked, agenda sent.',
  },
];

// ------------------------------------------------------------------ nav

const nav = document.getElementById('nav');
const burger = document.getElementById('nav-burger');

const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

burger.addEventListener('click', () => {
  const open = nav.classList.toggle('menu-open');
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

// close the mobile menu after navigating
document.getElementById('nav-menu').addEventListener('click', (e) => {
  if (e.target.closest('a')) {
    nav.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
  }
});

// -------------------------------------------------- integrations render

document.getElementById('logo-strip').innerHTML = INTEGRATIONS.map(
  (it) => `<li>${icon(it.glyph)}<span>${it.label}</span></li>`
).join('');

document.getElementById('integration-tiles').innerHTML = INTEGRATIONS.map(
  (it, i) => `
    <li class="tile reveal" style="--d: ${(i % 4) * 0.06}s">
      <span class="tile-icon" style="background:${it.color}1f">${icon(it.glyph, it.color)}</span>
      <span class="tile-name">${it.label}</span>
    </li>`
).join('');

// ---------------------------------------------------------- reveal-ins

initReveals();

// ------------------------------------------------------------ hero demo

const promptEl = document.getElementById('demo-prompt');
const caretEl = document.getElementById('demo-caret');
const planEl = document.getElementById('demo-plan');
const stepsEl = document.getElementById('demo-steps');
const doneEl = document.getElementById('demo-done');
const summaryEl = document.getElementById('demo-summary');

const tickSvg =
  '<span class="tick"><svg viewBox="0 0 24 24" fill="none" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>';

function renderScenario(s, allDone) {
  promptEl.textContent = s.prompt;
  stepsEl.innerHTML = s.steps
    .map((step) => `<li class="${allDone ? 'done' : ''}">${tickSvg}<span>${step}</span></li>`)
    .join('');
  summaryEl.textContent = s.summary;
}

if (reducedMotion) {
  // static, fully completed first scenario
  renderScenario(SCENARIOS[0], true);
  caretEl.classList.add('off');
  planEl.hidden = false;
  doneEl.hidden = false;
} else {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  async function type(text) {
    promptEl.textContent = '';
    caretEl.classList.remove('off');
    for (const ch of text) {
      promptEl.textContent += ch;
      await wait(34 + Math.random() * 40);
    }
    await wait(350);
    caretEl.classList.add('off');
  }

  async function playScenario(s) {
    planEl.hidden = true;
    doneEl.hidden = true;
    await type(s.prompt);

    renderScenario(s, false);
    planEl.hidden = false;
    await wait(700);

    for (const li of stepsEl.children) {
      li.classList.add('done');
      await wait(820);
    }

    await wait(250);
    doneEl.hidden = false;
    await wait(3400);
  }

  (async function loop() {
    let i = 0;
    // start once the demo scrolls into view the first time
    await new Promise((resolve) => {
      if (!('IntersectionObserver' in window)) return resolve();
      const watch = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          watch.disconnect();
          resolve();
        }
      });
      watch.observe(document.getElementById('demo'));
    });
    // eslint-disable-next-line no-constant-condition
    while (true) {
      await playScenario(SCENARIOS[i % SCENARIOS.length]);
      i += 1;
    }
  })();
}

// ----------------------------------------------------------------- misc

document.getElementById('year').textContent = String(new Date().getFullYear());
