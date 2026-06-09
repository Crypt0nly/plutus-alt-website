import './system.css';
import { INTEGRATIONS, icon } from './icons.js';
import { initReveals, reducedMotion } from './fx.js';
import { mountSwitcher } from './switcher.js';

mountSwitcher('system');

// platform status strip
document.getElementById('sys-status').innerHTML = INTEGRATIONS.map(
  (it) => `<li><i></i>${it.label.toUpperCase()} · SYNCED</li>`
).join('');

// control-band icons
document.querySelectorAll('.sys-control-icon').forEach((el) => {
  el.innerHTML = icon(el.dataset.glyph, '#60a5fa');
});

// hub-and-spoke diagram: 8 platform nodes on a ring around the core,
// with animated dashed connectors.
const hub = document.getElementById('sys-hub');
const linesSvg = hub.querySelector('.sys-hub-lines');
const RADIUS = 41; // % of the (square) container
INTEGRATIONS.forEach((it, i) => {
  const angle = (i / INTEGRATIONS.length) * Math.PI * 2 - Math.PI / 2;
  const x = 50 + RADIUS * Math.cos(angle);
  const y = 50 + RADIUS * Math.sin(angle);

  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', '50');
  line.setAttribute('y1', '50');
  line.setAttribute('x2', String(x));
  line.setAttribute('y2', String(y));
  line.style.animationDelay = `${i * -0.33}s`;
  linesSvg.appendChild(line);

  const node = document.createElement('div');
  node.className = 'sys-node';
  node.style.left = `${x}%`;
  node.style.top = `${y}%`;
  node.innerHTML = `<span class="sys-node-icon">${icon(it.glyph, it.color)}</span><span>${it.label.toUpperCase()}</span>`;
  hub.appendChild(node);
});

initReveals();

// orchestrator console: replay runs line by line
const RUNS = [
  [
    { c: 'cmd', t: '$ plutus run "prepare the Q3 board pack"' },
    { c: 'step', t: '→ plan compiled · 6 steps' },
    { c: 'step', t: '→ pulling context: files, crm, finance' },
    { c: 'ok', t: '✓ draft assembled → files/board/q3-pack.pdf' },
    { c: 'wait', t: '⏸ approval required: send to board@yourco.com' },
    { c: 'ok', t: '✓ approved by j.meyer — sent' },
    { c: 'end', t: '■ run complete · full report in workspace' },
  ],
  [
    { c: 'cmd', t: '$ plutus run "clean up the open PRs"' },
    { c: 'step', t: '→ plan compiled · 4 steps' },
    { c: 'step', t: '→ scanning repository: 7 open PRs' },
    { c: 'ok', t: '✓ 5 PRs merged · CI green' },
    { c: 'wait', t: '⏸ approval required: close stale PR #88' },
    { c: 'ok', t: '✓ approved — closed · reviewers notified' },
    { c: 'end', t: '■ run complete · receipts posted to #eng' },
  ],
];

const consoleBody = document.getElementById('sys-console');
const cursor = document.getElementById('sys-cursor');

const addLine = (run, cls, text) => {
  const ln = document.createElement('span');
  ln.className = `ln ln-${cls}`;
  ln.textContent = text;
  consoleBody.insertBefore(ln, cursor);
  return ln;
};

if (reducedMotion) {
  RUNS[0].forEach((l) => addLine(0, l.c, l.t));
  cursor.remove();
} else {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  async function typeCmd(text) {
    const ln = addLine(0, 'cmd', '');
    for (const ch of text) {
      ln.textContent += ch;
      await wait(16 + Math.random() * 22);
    }
  }

  (async function loop() {
    let i = 0;
    // hold until the console is on screen
    await new Promise((resolve) => {
      if (!('IntersectionObserver' in window)) return resolve();
      const watch = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          watch.disconnect();
          resolve();
        }
      });
      watch.observe(consoleBody);
    });
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const run = RUNS[i % RUNS.length];
      for (const line of run) {
        if (line.c === 'cmd') await typeCmd(line.t);
        else {
          await wait(line.c === 'wait' ? 1100 : 650);
          addLine(0, line.c, line.t);
        }
      }
      await wait(3600);
      consoleBody.querySelectorAll('.ln').forEach((n) => n.remove());
      i += 1;
    }
  })();
}

document.getElementById('year').textContent = String(new Date().getFullYear());
