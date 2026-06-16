import './style.css';
import { initReveals, reducedMotion } from './fx.js';
import { applyLang, initLangRouting, initLangToggle, currentLang, STRINGS } from './i18n.js';
import { initThemeToggle } from './theme.js';
import { initDesignBar } from './designbar.js';

initLangRouting();
applyLang();
initLangToggle();
initThemeToggle();
initDesignBar('a');
initReveals();

const L = STRINGS[currentLang];

// ---------------------------------------------- self-clearing notifications

const NOTES = L.notes;
const FINAL = L.final;

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

// ------------------------------------------------ team-Monday scrubber

// One list; the divider is a "how much Ocur" scrubber. Each row flips
// ✗→✓ when the divider passes its data-at threshold, the end line swaps
// near the right edge, and the team-hours pill ticks with progress.
const compare = document.getElementById('mg-compare');
const handle = document.getElementById('mg-handle');
const rows = [...document.querySelectorAll('#mg-rows li')];
const hoursEl = document.getElementById('mg-hours');
const sideBefore = document.getElementById('mg-side-before');
const sideAfter = document.getElementById('mg-side-after');
const tint = document.getElementById('mg-tint');

let x = 50;
let interacted = false;
let sweepRaf = 0;
const c01 = (v) => Math.max(0, Math.min(1, v));

const setX = (v) => {
  x = Math.max(4, Math.min(96, v));
  compare.style.setProperty('--x', `${x}%`);
  const p = (x - 4) / 92;
  let hours = 0;
  let done = 0;
  rows.forEach((r) => {
    const at = parseFloat(r.dataset.at);
    const isDone = x >= at;
    r.classList.toggle('done', isDone);
    if (isDone) done += 1;
    // each row's hours ease in around its threshold so the pill ticks
    hours += parseFloat(r.dataset.hours) * c01((x - at + 7) / 14);
  });
  const fmtHours = currentLang === 'de' ? hours.toFixed(1).replace('.', ',') : hours.toFixed(1);
  hoursEl.textContent = `+${fmtHours} ${L.teamHours}`;
  compare.classList.toggle('complete', x > 86);
  tint.style.opacity = (p * 0.9).toFixed(3);
  sideBefore.style.opacity = (1 - p * 0.62).toFixed(3);
  sideAfter.style.opacity = (0.4 + p * 0.6).toFixed(3);
  handle.setAttribute('aria-valuenow', String(Math.round(x)));
  handle.setAttribute('aria-valuetext', L.tasksHandled(Math.round(x), done, rows.length));
};

const stopSweep = () => {
  interacted = true;
  if (sweepRaf) cancelAnimationFrame(sweepRaf);
  sweepRaf = 0;
};

let dragging = false;
const fromEvent = (e) => {
  const r = compare.getBoundingClientRect();
  return ((e.clientX - r.left) / r.width) * 100;
};

compare.addEventListener('pointerdown', (e) => {
  stopSweep();
  dragging = true;
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
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
  stopSweep();
  if (e.key === 'ArrowLeft') setX(x - 4);
  else if (e.key === 'ArrowRight') setX(x + 4);
  else if (e.key === 'Home') setX(4);
  else setX(96);
  e.preventDefault();
});

// one slow demonstration sweep (all undone → all handled → settle halfway)
// the first time the card scrolls into view; any interaction cancels it
const canSweep = !reducedMotion && 'IntersectionObserver' in window;
setX(canSweep ? 4 : 50);
if (canSweep) {
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const sweepIO = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting) || interacted) return;
      sweepIO.disconnect();
      const RISE = 2700;
      const HOLD = 800;
      const BACK = 1200;
      const t0 = performance.now();
      (function step(now) {
        if (interacted) return;
        const e = now - t0;
        if (e < RISE) setX(4 + 92 * ease(e / RISE));
        else if (e < RISE + HOLD) setX(96);
        else if (e < RISE + HOLD + BACK) setX(96 - 46 * ease((e - RISE - HOLD) / BACK));
        else {
          setX(50);
          sweepRaf = 0;
          return;
        }
        sweepRaf = requestAnimationFrame(step);
      })(t0);
    },
    { threshold: 0.55 }
  );
  sweepIO.observe(compare);
}

// ------------------------------------------- scroll-driven chat demo

// The demo section pins for ~3 screens; scroll progress flips the window
// through three scenes — the ask → the work → the sign-off. CSS owns the
// crossfade (one .mg-scene + caption shown per data-scene), so JS only
// writes data-scene when it changes. Runs only while the section is near
// the viewport; without JS or with reduced motion every scene stays
// stacked into a readable transcript.
const demo = document.querySelector('.mg-demo');
const story = document.getElementById('mg-story');
if (demo && story && !reducedMotion) {
  let raf = 0;
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const sceneFor = (p) => (p < 0.34 ? '1' : p < 0.7 ? '2' : '3');

  const tick = () => {
    const r = story.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    const scene = sceneFor(total > 0 ? clamp01(-r.top / total) : 0);
    if (demo.dataset.scene !== scene) demo.dataset.scene = scene;
    raf = requestAnimationFrame(tick);
  };

  // run the loop only while the demo is anywhere near the viewport
  const io = new IntersectionObserver(
    (entries) => {
      const on = entries.some((e) => e.isIntersecting);
      if (on && !raf) {
        raf = requestAnimationFrame(tick);
      } else if (!on && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    },
    { rootMargin: '20% 0px' }
  );
  io.observe(story);
}

document.getElementById('year').textContent = String(new Date().getFullYear());
