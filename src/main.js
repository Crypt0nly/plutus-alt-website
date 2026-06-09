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

// ------------------------------------------- scroll-driven statements

// The story section pins for ~3 screens; scroll progress drives each
// statement through fade-in → hold → fade-out with a soft drift. The
// displayed progress eases toward the real scroll position every frame,
// so stepped mouse-wheel input still renders as fluid motion. Opacity and
// transform only — no filters — to stay on the compositor.
const story = document.getElementById('mg-story');
if (story && !reducedMotion) {
  const steps = [...story.querySelectorAll('.mg-statement')].map((el) => ({
    el,
    parts: [...el.children],
  }));
  const n = steps.length;
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  let target = 0;
  let current = -1;
  let raf = 0;

  const measure = () => {
    const r = story.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    // progress in "statement units", clamped so the first and last
    // statements hold while the stage pins and unpins
    target = total > 0 ? clamp01(-r.top / total) * n : 0;
  };

  // Inner choreography: the headline leads, each following block trails by
  // STAG progress units. Entering pieces rise in slightly small and tilted
  // back; leaving pieces drift up, grow and tip away — a gentle fly-through.
  // Tuned so trailing pieces are fully gone before the next headline enters.
  const HOLD = 0.16;
  const FADE = 0.26;
  const STAG = 0.04;

  const apply = (fp) => {
    const fpc = Math.max(0.5, Math.min(n - 0.5, fp));
    steps.forEach((step, i) => {
      const d = fpc - (i + 0.5);
      let maxO = 0;
      step.parts.forEach((p, k) => {
        const dk = d - k * STAG;
        let o = 1 - clamp01((Math.abs(dk) - HOLD) / FADE);
        o = o * o * (3 - 2 * o); // smoothstep
        maxO = Math.max(maxO, o);
        p.style.opacity = o.toFixed(3);
        p.style.transform =
          `translate3d(0, ${(-dk * 52).toFixed(2)}px, 0) ` +
          `scale(${(1 + dk * 0.12).toFixed(4)}) ` +
          `rotateX(${(dk * -9).toFixed(2)}deg)`;
      });
      step.el.style.visibility = maxO < 0.002 ? 'hidden' : 'visible';
    });
  };

  const tick = () => {
    measure();
    current += (target - current) * 0.14;
    if (Math.abs(target - current) < 0.0004) current = target;
    apply(current);
    raf = requestAnimationFrame(tick);
  };

  // run the easing loop only while the story is anywhere near the viewport
  const io = new IntersectionObserver(
    (entries) => {
      const on = entries.some((e) => e.isIntersecting);
      if (on && !raf) {
        measure();
        if (current < 0) current = target;
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
