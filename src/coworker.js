import './coworker.css';
import { initReveals, reducedMotion } from './fx.js';
import { mountSwitcher } from './switcher.js';

mountSwitcher('coworker');
initReveals();

// ------------------------------------------------------- buddy eyes

// pupils follow the cursor; on touch devices they wander on their own
const buddy = document.getElementById('buddy');
const pupils = buddy.querySelectorAll('.cw-pupil');
const finePointer = window.matchMedia('(pointer: fine)').matches;

if (!reducedMotion && finePointer) {
  let tx = 0;
  let ty = 0;
  let x = 0;
  let y = 0;
  const MAX = 8; // px of pupil travel
  window.addEventListener('pointermove', (e) => {
    const r = buddy.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height * 0.38;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const len = Math.hypot(dx, dy) || 1;
    const f = Math.min(1, len / 240);
    tx = (dx / len) * MAX * f;
    ty = (dy / len) * MAX * f;
  });
  (function tick() {
    x += (tx - x) * 0.18;
    y += (ty - y) * 0.18;
    pupils.forEach((p) => {
      p.style.transform = `translate(${x}px, ${y}px)`;
    });
    requestAnimationFrame(tick);
  })();
} else if (!reducedMotion) {
  // idle wander for touch screens
  const SPOTS = [
    [0, 0],
    [6, 2],
    [-5, 3],
    [3, -4],
    [-6, -2],
  ];
  let i = 0;
  setInterval(() => {
    i = (i + 1) % SPOTS.length;
    pupils.forEach((p) => {
      p.style.transform = `translate(${SPOTS[i][0]}px, ${SPOTS[i][1]}px)`;
    });
  }, 1800);
}

// ------------------------------------------------------- the workday

const DAY = [
  { t: '9:02', tag: '✉️ Email', text: 'Inbox sorted. 3 emails need you — the rest are answered or filed.' },
  { t: '9:30', tag: '📅 Calendar', text: 'Found a time everyone can make. Thursday 10:00 — invites sent.' },
  { t: '11:15', tag: '📄 Documents', text: 'First draft of the sales report is ready for your edits.' },
  { t: '13:00', tag: '🙋 Quick question', text: '“OK to send the offer to Anna?” — you tapped Yes. Off it went.', approval: true },
  { t: '15:40', tag: '📁 Files', text: 'Project folder tidied. Everything finally has a proper name.' },
  { t: '17:00', tag: '📋 Wrap-up', text: 'Daily report: everything that got done, and what’s lined up for tomorrow.' },
];

const list = document.getElementById('cw-day-list');
list.innerHTML = DAY.map(
  (d) => `
    <li class="cw-day-item${d.approval ? ' approval' : ''}">
      <span class="cw-day-time">${d.t}</span>
      <span class="cw-day-text"><strong>${d.tag}</strong>${d.text}</span>
      <span class="cw-day-check" aria-hidden="true">✓</span>
    </li>`
).join('');
const items = [...list.children];

if (reducedMotion) {
  items.forEach((li) => li.classList.add('on'));
} else {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  (async function play() {
    // hold until the card scrolls into view
    await new Promise((resolve) => {
      if (!('IntersectionObserver' in window)) return resolve();
      const watch = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          watch.disconnect();
          resolve();
        }
      });
      watch.observe(list);
    });
    // eslint-disable-next-line no-constant-condition
    while (true) {
      for (const li of items) {
        li.classList.add('on');
        await wait(1250);
      }
      await wait(3800);
      items.forEach((li) => li.classList.remove('on'));
      await wait(650);
    }
  })();
}

document.getElementById('year').textContent = String(new Date().getFullYear());
