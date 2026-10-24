// The opening's live demo: a deck of Ocur windows, one real job each. The
// job in front plays out — the ask typed in, Ocur's steps landing, the
// result — then slips away and the next window comes forward. The chips
// pick a job; the round button stops the deck. While the pointer rests on
// the deck (or keyboard focus is in it), a finished job stays in front, and
// nothing plays while the page has risen over the opening.
//
// Without motion the chips switch finished jobs in place and nothing plays;
// without JavaScript the first job shows, finished, as index.html has it.
// The opening's entrance is CSS (style.css → the hero), so the promise
// never waits for this file.

import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { track } from './analytics.js';

const TYPE = 0.024; // seconds per typed character
const HOLD = 2.8; // seconds a finished job stays in front
const LEAVE_MS = 520; // .hx-card.is-leaving in style.css

const LABELS = {
  en: { pause: 'Pause the examples', play: 'Play the examples' },
  de: { pause: 'Beispiele anhalten', play: 'Beispiele abspielen' },
};

export function initHero({ motion = false } = {}) {
  const hero = document.querySelector('.hx');
  const demo = hero?.querySelector('.hx-demo');
  if (!demo) return null;
  const show = hero.querySelector('.hx-show');
  const deck = demo.querySelector('.hx-deck');
  const cards = [...deck.querySelectorAll('.hx-card')];
  const chips = [...demo.querySelectorAll('.hx-chip')];
  const toggle = demo.querySelector('.hx-play');
  const lang = document.documentElement.lang === 'de' ? 'de' : 'en';
  const n = cards.length;
  const abort = new AbortController();
  const on = (target, type, fn, options) => target?.addEventListener(type, fn, { ...options, signal: abort.signal });
  let front = Math.max(0, cards.findIndex((card) => card.dataset.pos === '0'));

  // Stack the windows with `index` in front; the chips follow.
  const place = (index) => {
    cards.forEach((card, i) => {
      const pos = (i - index + n) % n;
      card.dataset.pos = String(pos);
      if (pos === 0) card.removeAttribute('aria-hidden');
      else card.setAttribute('aria-hidden', 'true');
    });
    chips.forEach((chip, i) => chip.setAttribute('aria-pressed', String(i === index)));
  };

  // A window as index.html draws it: the job finished.
  const settle = (card) => {
    delete card.dataset.state;
    card.querySelector('.is-caret')?.classList.remove('is-caret');
    card.classList.remove('is-typing', 'is-thinking', 'is-leaving');
    card.style.removeProperty('transition');
    card.querySelectorAll('.hx-step').forEach((step) => delete step.dataset.state);
  };

  if (!motion) {
    chips.forEach((chip, i) =>
      on(chip, 'click', () => {
        front = i;
        place(i);
        track('hero_example', { job: chip.dataset.job });
      }),
    );
    return { cover() {}, dispose: () => abort.abort() };
  }

  // ------------------------------------------------------------ the jobs
  // One paused timeline per window, built once. Rewinding one to 0 empties
  // its window again; the chip under it fills across the whole job.
  const locale = lang === 'de' ? 'de-DE' : 'en-US';
  const splits = [];
  // the count-ups write text; remember what the page says, to give it back
  const counts = [...deck.querySelectorAll('[data-count]')].map((el) => [el, el.textContent]);
  const jobs = cards.map((card, i) => {
    const typed = SplitText.create(card.querySelector('.hx-ask-t'), { type: 'words,chars', tag: 'span', aria: 'none' });
    splits.push(typed);
    const steps = [...card.querySelectorAll('.hx-step')];
    const done = card.querySelector('.hx-done');
    const count = done.querySelector('[data-count]');
    const tl = gsap.timeline({ paused: true, onComplete: finished });

    // The ask: the bubble opens and the letters type in. They appear in
    // place, so no window ever changes size; the caret rides the newest one.
    const caret = (char) => {
      card.querySelector('.is-caret')?.classList.remove('is-caret');
      char?.classList.add('is-caret');
    };
    tl.fromTo(
      card.querySelector('.hx-ask'),
      { autoAlpha: 0, y: 12, scale: 0.96 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: 'expo.out', transformOrigin: '100% 100%' },
      0.15,
    );
    tl.fromTo(
      typed.chars,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: 0.001,
        ease: 'none',
        stagger: {
          each: TYPE,
          onStart() {
            caret(this.targets()[0]);
          },
        },
      },
      0.3,
    );
    let t = 0.3 + typed.chars.length * TYPE + 0.2;

    // Ocur answers, thinks for a moment, then the work lands step by step
    tl.call(
      () => {
        caret(null);
        card.classList.replace('is-typing', 'is-thinking');
      },
      null,
      t,
    );
    tl.fromTo(card.querySelector('.hx-reply'), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'expo.out' }, t);
    tl.call(() => card.classList.remove('is-thinking'), null, t + 0.85);
    t += 0.7;
    let end = t;
    steps.forEach((step) => {
      const live = step.hasAttribute('data-live');
      const work = live ? 1.6 : 0.7;
      tl.call(() => (step.dataset.state = live ? 'live' : 'run'), null, t);
      tl.fromTo(step, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'expo.out' }, t);
      tl.call(() => delete step.dataset.state, null, t + work);
      end = Math.max(end, t + work);
      t += 0.55;
    });

    // the payoff
    end += 0.25;
    tl.call(() => delete card.dataset.state, null, end);
    tl.fromTo(done, { autoAlpha: 0, y: 14, scale: 0.98 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: 'expo.out' }, end);
    if (count) {
      const target = Number(count.dataset.count);
      const prefix = count.dataset.prefix || '';
      const suffix = count.dataset.suffix || '';
      const value = { v: 0 };
      tl.fromTo(
        value,
        { v: 0 },
        {
          v: target,
          duration: 1.2,
          ease: 'power3.out',
          onUpdate: () => (count.textContent = prefix + Math.round(value.v).toLocaleString(locale) + suffix),
        },
        end + 0.1,
      );
    }
    tl.fromTo(chips[i], { '--p': 0 }, { '--p': 1, duration: end + 0.7 + HOLD, ease: 'none' }, 0);
    return tl;
  });

  // ------------------------------------------------------------ the deal
  let paused = false; // the visitor stopped the deck
  let held = false; // pointer on the deck, or keyboard focus in it
  let over = false; // the page has risen over the opening
  let offscreen = false;
  let waiting = false; // a finished job, waiting until it may leave
  let leaving = null;
  let hold = null;
  const still = () => paused || over || offscreen;

  function start(index) {
    const card = cards[index];
    card.dataset.state = 'run';
    card.querySelector('.is-caret')?.classList.remove('is-caret');
    card.classList.add('is-typing');
    card.classList.remove('is-thinking');
    jobs[index].restart();
    if (still()) jobs[index].pause();
  }

  // The window that was in front drops away; once it's out of sight it
  // rejoins the stack at the back, emptied for its next turn.
  function finishLeaving() {
    if (!leaving) return;
    const { card, index, timer } = leaving;
    leaving = null;
    clearTimeout(timer);
    const pos = card.dataset.pos;
    card.style.transition = 'none';
    card.classList.remove('is-leaving');
    card.dataset.pos = String(n - 1);
    void card.offsetWidth;
    card.style.removeProperty('transition');
    card.dataset.pos = pos;
    jobs[index].pause(0);
    settle(card);
  }

  function deal(index) {
    waiting = false;
    hold?.kill();
    hold = null;
    const prev = front;
    jobs[prev].pause();
    if (index !== prev) {
      finishLeaving();
      cards[prev].classList.add('is-leaving');
      leaving = { card: cards[prev], index: prev, timer: setTimeout(finishLeaving, LEAVE_MS) };
    }
    front = index;
    place(index);
    start(index);
  }

  function finished() {
    waiting = true;
    if (!held && !still()) deal((front + 1) % n);
  }

  const sync = () => {
    demo.classList.toggle('is-still', still());
    const job = jobs[front];
    if (still()) job.pause();
    else if (job.progress() < 1) job.resume();
    if (waiting && !held && !still()) deal((front + 1) % n);
  };

  const setPaused = (value) => {
    paused = value;
    toggle.dataset.paused = String(value);
    toggle.setAttribute('aria-label', LABELS[lang][value ? 'play' : 'pause']);
    sync();
  };

  chips.forEach((chip, i) =>
    on(chip, 'click', () => {
      if (paused) setPaused(false);
      deal(i);
      track('hero_example', { job: chip.dataset.job });
    }),
  );
  on(toggle, 'click', () => {
    setPaused(!paused);
    track('hero_pause', { paused });
  });

  // a finished job stays while someone is reading it
  const release = () => {
    if (waiting && !held && !still()) deal((front + 1) % n);
  };
  on(demo, 'pointerenter', (e) => {
    if (e.pointerType === 'mouse') held = true;
  });
  on(demo, 'pointerleave', () => {
    held = false;
    release();
  });
  on(demo, 'focusin', (e) => {
    if (e.target.matches(':focus-visible')) held = true;
  });
  on(demo, 'focusout', (e) => {
    if (demo.contains(e.relatedTarget)) return;
    held = false;
    release();
  });

  const watcher = new IntersectionObserver((entries) => {
    offscreen = !entries[entries.length - 1].isIntersecting;
    sync();
  });
  watcher.observe(demo);

  // ------------------------------------------- the lean and the light
  // The deck tips a few degrees toward a mouse, and a light follows it
  // along the front window's edge.
  if (matchMedia('(pointer: fine)').matches) {
    const leanX = gsap.quickTo(show, '--mx', { duration: 1, ease: 'power3.out' });
    const leanY = gsap.quickTo(show, '--my', { duration: 1, ease: 'power3.out' });
    on(
      hero,
      'pointermove',
      (e) => {
        if (e.pointerType !== 'mouse') return;
        const area = show.getBoundingClientRect();
        leanX(gsap.utils.clamp(-1, 1, (e.clientX - area.left - area.width / 2) / (area.width / 2)));
        leanY(gsap.utils.clamp(-1, 1, (e.clientY - area.top - area.height / 2) / (area.height / 2)));
        const card = cards[front].getBoundingClientRect();
        deck.style.setProperty('--lx', `${Math.round(e.clientX - card.left)}px`);
        deck.style.setProperty('--ly', `${Math.round(e.clientY - card.top)}px`);
        deck.classList.add('is-lit');
      },
      { passive: true },
    );
    on(hero, 'pointerleave', () => {
      leanX(0);
      leanY(0);
      deck.classList.remove('is-lit');
    });
  }

  // ----------------------------------------------- holding the opening
  // The opening holds still while the page rises over it (style.css →
  // .hx.is-pinned); a taller opening needs its own height for that.
  const measure = () => hero.style.setProperty('--hx-h', `${hero.offsetHeight}px`);
  measure();
  hero.classList.add('is-pinned');
  const sizer = new ResizeObserver(measure);
  sizer.observe(hero);

  // --------------------------------------------------------- the start
  // If the deck is already on screen when this runs (a slow connection),
  // the first job stays finished, as the page drew it, and the deal starts
  // from the next one. Otherwise the first job plays as the deck lands.
  place(front);
  const arrival = show.getAnimations?.().find((a) => a.animationName === 'hx-arrive');
  if (arrival?.playState === 'running' && Number(arrival.currentTime) < 380) {
    start(front);
  } else {
    jobs[front].progress(1, true);
    settle(cards[front]);
    hold = gsap.delayedCall(HOLD, finished);
  }

  return {
    // the page has risen over the opening (main.js), or has left it again
    cover(value) {
      over = value;
      sync();
    },
    dispose() {
      abort.abort();
      watcher.disconnect();
      sizer.disconnect();
      clearTimeout(leaving?.timer);
      leaving = null;
      hold?.kill();
      jobs.forEach((job) => job.kill());
      splits.forEach((split) => split.revert());
      counts.forEach(([el, text]) => (el.textContent = text));
      cards.forEach(settle);
      hero.classList.remove('is-pinned');
      hero.style.removeProperty('--hx-h');
      demo.classList.remove('is-still');
      deck.classList.remove('is-lit');
      toggle?.removeAttribute('data-paused');
      toggle?.setAttribute('aria-label', LABELS[lang].pause);
    },
  };
}
