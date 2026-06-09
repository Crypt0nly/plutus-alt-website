import './style.css';

// ----------------------------------------------------------------- data

// Tools Plutus reaches into. Stroke icons keep the grid visually uniform;
// each tile gets a soft tint of the tool's brand color.
const INTEGRATIONS = [
  { id: 'gmail', label: 'Gmail', glyph: 'mail', color: '#EA4335' },
  { id: 'gcal', label: 'Google Calendar', glyph: 'calendar', color: '#4285F4' },
  { id: 'github', label: 'GitHub', glyph: 'git', color: '#B1BAC4' },
  { id: 'discord', label: 'Discord', glyph: 'chat', color: '#5865F2' },
  { id: 'files', label: 'Files', glyph: 'folder', color: '#F2B23C' },
  { id: 'web', label: 'The web', glyph: 'globe', color: '#2DD4BF' },
  { id: 'apps', label: 'Business apps', glyph: 'apps', color: '#A78BFA' },
  { id: 'local', label: 'Your computer', glyph: 'monitor', color: '#9CA3AF' },
];

const GLYPHS = {
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  calendar:
    '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  git: '<path d="M6 6v9"/><circle cx="6" cy="18" r="2.6"/><circle cx="6" cy="4" r="2.6"/><circle cx="18" cy="7" r="2.6"/><path d="M18 9.6a9 9 0 0 1-9 9"/>',
  chat: '<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.4 8.4 0 0 1-3.6-.8L3 21l1.8-5.9A8.5 8.5 0 1 1 21 11.5z"/>',
  folder: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
  globe:
    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18"/>',
  apps: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.8"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.8"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.8"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.8"/>',
  monitor: '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
};

const icon = (glyph, color) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="${color || 'currentColor'}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${GLYPHS[glyph]}</svg>`;

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

const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in'));
}

// ------------------------------------------------------------ hero demo

const promptEl = document.getElementById('demo-prompt');
const caretEl = document.getElementById('demo-caret');
const planEl = document.getElementById('demo-plan');
const stepsEl = document.getElementById('demo-steps');
const doneEl = document.getElementById('demo-done');
const summaryEl = document.getElementById('demo-summary');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
