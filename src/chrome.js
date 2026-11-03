// Page chrome shared by Ocur's pages: the floating nav's state and the
// scroll edge beneath it, the opening's stage on the home page, and the
// door every page shares (the founder's booking page). The nav
// itself is drawn at build time (scripts/lib/chrome.mjs), with the current
// page already marked; a nav of in-page links (the game) gets a lens that
// follows the section on screen. One passive scroll listener, coalesced
// into a single animation frame.

import { syncThemeColor } from './theme.js';
import { track } from './analytics.js';

// The lens: the app tab bar's selection, sliding between section links.
function createLens(links) {
  const anchors = [...links.querySelectorAll('a[href^="#"]')];
  const targets = anchors.map((a) => document.getElementById(a.getAttribute('href').slice(1)));
  if (!anchors.length || targets.some((el) => !el)) return null;
  const lens = document.createElement('span');
  lens.className = 'g-lens';
  lens.setAttribute('aria-hidden', 'true');
  links.prepend(lens);
  let active = -1;

  const place = () => {
    const anchor = anchors[active];
    if (!anchor) {
      links.classList.remove('has-lens');
      return;
    }
    lens.style.width = `${anchor.offsetWidth}px`;
    lens.style.transform = `translateX(${anchor.offsetLeft}px)`;
    links.classList.add('has-lens');
  };

  const update = () => {
    const line = innerHeight * 0.42;
    let next = -1;
    targets.forEach((el, i) => {
      if (el.getBoundingClientRect().top <= line) next = i;
    });
    // past the end of the last chapter nothing is current
    if (next === targets.length - 1 && targets[next].getBoundingClientRect().bottom < line) next = -1;
    if (next === active) return;
    const appearing = active === -1;
    active = next;
    anchors.forEach((a, i) => (i === active ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
    if (appearing) {
      // arrive in place, rather than sliding in from the first link
      lens.style.transition = 'opacity 240ms ease';
      place();
      void lens.offsetWidth;
      lens.style.transition = '';
    } else {
      place();
    }
  };

  if ('ResizeObserver' in window) new ResizeObserver(place).observe(links);
  return { update };
}

// The reading pages' table of contents marks the chapter being read.
function createTocSpy() {
  const anchors = [...document.querySelectorAll('.l-toc a[href^="#"]')];
  const targets = anchors.map((a) => document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1))));
  if (!anchors.length || targets.some((el) => !el)) return null;
  let active = -1;
  return {
    update() {
      const line = innerHeight * 0.3;
      let next = 0;
      targets.forEach((el, i) => {
        if (el.getBoundingClientRect().top <= line) next = i;
      });
      if (next === active) return;
      active = next;
      anchors.forEach((a, i) => (i === active ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
    },
  };
}

export function initChrome() {
  const root = document.documentElement;
  const sheet = document.querySelector('.o-sheet');
  const links = document.querySelector('.g-nav .g-links');
  const lens = links ? createLens(links) : null;
  const toc = createTocSpy();
  let frame = 0;
  let stage = null;

  const sync = () => {
    frame = 0;
    root.classList.toggle('is-scrolled', scrollY > 4);
    // The nav wears dark glass until the page's sheet has risen under it.
    const onStage = Boolean(sheet) && sheet.getBoundingClientRect().top > 38;
    if (onStage !== stage) {
      stage = onStage;
      root.classList.toggle('on-stage', onStage);
      syncThemeColor();
    }
    lens?.update();
    toc?.update();
  };
  const request = () => {
    if (!frame) frame = requestAnimationFrame(sync);
  };

  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request, { passive: true });
  addEventListener('pageshow', request);
  sync();
}

// Every Book a demo, on any page, is counted by where it sits (data-book).
// The X Ads conversion rides in xads.js.
export function initDoors() {
  document.querySelectorAll('a[data-book]').forEach((a) => {
    a.addEventListener('click', () => track('book_demo_click', { placement: a.dataset.book }));
  });
}

export function setYear() {
  const year = String(new Date().getFullYear());
  document.querySelectorAll('[data-year], #g-year').forEach((el) => {
    el.textContent = year;
  });
}
