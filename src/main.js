import './style.css';
import { initReveals, reducedMotion } from './fx.js';

initReveals();

// ---------------------------------------------- self-clearing notifications

const NOTES = [
  { e: '✉️', t: '12 unread emails', s: 'answered or filed — 3 kept for you' },
  { e: '📅', t: 'Team meeting to plan', s: 'Thursday 10:00 booked, invites out' },
  { e: '📁', t: 'Shared folder chaos', s: 'tidied — files properly named' },
  { e: '📝', t: 'Monthly report due', s: 'first draft ready for your edits' },
  { e: '🔔', t: 'Two people owe you replies', s: 'friendly reminders sent' },
];
const FINAL = { e: '✨', t: 'All handled.', s: 'Two things waited for your OK. Enjoy your evening.' };

const stack = document.getElementById('mg-stack');

const makeNote = (n, extra = '') => {
  const div = document.createElement('div');
  div.className = `mg-note ${extra}`;
  div.innerHTML = `
    <span class="mg-note-emoji" aria-hidden="true">${n.e}</span>
    <span class="mg-note-text"><strong>${n.t}</strong><span>${n.s}</span></span>
    <span class="mg-note-check" aria-hidden="true">✓</span>`;
  return div;
};

if (reducedMotion) {
  const fin = makeNote(FINAL, 'mg-note-final handled');
  fin.style.top = '110px';
  stack.appendChild(fin);
} else {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  // pile layout: top 4 cards visible, fanned downwards
  const layout = (order) => {
    order.forEach((note, i) => {
      const k = Math.min(i, 3);
      note.style.zIndex = String(20 - i);
      note.style.opacity = i > 3 ? '0' : String(1 - k * 0.16);
      note.style.transform = `translateY(${36 + k * 18}px) scale(${1 - k * 0.035})`;
    });
  };

  (async function loop() {
    await new Promise((resolve) => {
      if (!('IntersectionObserver' in window)) return resolve();
      const watch = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          watch.disconnect();
          resolve();
        }
      });
      watch.observe(stack);
    });
    // eslint-disable-next-line no-constant-condition
    while (true) {
      stack.innerHTML = '';
      const order = NOTES.map((n) => {
        const note = makeNote(n);
        stack.appendChild(note);
        return note;
      });
      layout(order);
      await wait(1300);

      while (order.length) {
        const top = order[0];
        top.classList.add('handled');
        await wait(950);
        top.classList.add('gone');
        await wait(420);
        top.remove();
        order.shift();
        layout(order);
        await wait(420);
      }

      const fin = makeNote(FINAL, 'mg-note-final handled');
      fin.style.top = '0';
      fin.style.transform = 'translateY(120px) scale(0.9)';
      fin.style.opacity = '0';
      stack.appendChild(fin);
      await wait(60);
      fin.style.transform = 'translateY(96px) scale(1)';
      fin.style.opacity = '1';
      await wait(4300);
      fin.style.opacity = '0';
      await wait(500);
    }
  })();
}

// --------------------------------------------------- before/after slider

const compare = document.getElementById('mg-compare');
const handle = document.getElementById('mg-handle');
let x = 50;
let interacted = false;

const setX = (v) => {
  x = Math.max(4, Math.min(96, v));
  compare.style.setProperty('--x', `${x}%`);
  handle.setAttribute('aria-valuenow', String(Math.round(x)));
};
setX(50);

let dragging = false;
const fromEvent = (e) => {
  const r = compare.getBoundingClientRect();
  return ((e.clientX - r.left) / r.width) * 100;
};

compare.addEventListener('pointerdown', (e) => {
  dragging = true;
  interacted = true;
  compare.setPointerCapture(e.pointerId);
  setX(fromEvent(e));
});
compare.addEventListener('pointermove', (e) => {
  if (dragging) setX(fromEvent(e));
});
const stop = () => {
  dragging = false;
};
compare.addEventListener('pointerup', stop);
compare.addEventListener('pointercancel', stop);

handle.addEventListener('keydown', (e) => {
  interacted = true;
  if (e.key === 'ArrowLeft') setX(x - 4);
  else if (e.key === 'ArrowRight') setX(x + 4);
  else if (e.key === 'Home') setX(4);
  else if (e.key === 'End') setX(96);
  else return;
  e.preventDefault();
});

// a gentle nudge the first time the slider scrolls into view
if (!reducedMotion && 'IntersectionObserver' in window) {
  const nudge = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    nudge.disconnect();
    const t0 = performance.now();
    (function wiggle(now) {
      if (interacted) return;
      const t = (now - t0) / 1600;
      if (t >= 1) return setX(50);
      setX(50 + Math.sin(t * Math.PI * 2) * 9);
      requestAnimationFrame(wiggle);
    })(t0);
  });
  nudge.observe(compare);
}

document.getElementById('year').textContent = String(new Date().getFullYear());
