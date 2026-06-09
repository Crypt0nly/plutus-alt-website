import './convert.css';
import { INTEGRATIONS, icon } from './icons.js';
import { initReveals, reducedMotion } from './fx.js';
import { mountSwitcher } from './switcher.js';

mountSwitcher('convert');

// tools row
document.getElementById('cv-logos-row').innerHTML = INTEGRATIONS.map(
  (it) => `<li>${icon(it.glyph)}<span>${it.label}</span></li>`
).join('');

initReveals();

// animated stat counters (count up on first view)
const counters = document.querySelectorAll('[data-count]');
function animateCounter(el) {
  const target = Number(el.dataset.count);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  if (reducedMotion) {
    el.textContent = prefix + target + suffix;
    return;
  }
  const t0 = performance.now();
  const dur = 1200;
  (function step(now) {
    const p = Math.min(1, (now - t0) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + Math.round(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}
if ('IntersectionObserver' in window) {
  const cio = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          cio.unobserve(e.target);
        }
      }),
    { threshold: 0.6 }
  );
  counters.forEach((el) => cio.observe(el));
} else {
  counters.forEach((el) => animateCounter(el));
}

// sticky CTA bar: appears after the hero, hides near the offer and footer
const sticky = document.getElementById('cv-sticky');
const hero = document.querySelector('.cv-hero');
const offer = document.getElementById('start');
const foot = document.querySelector('.cv-foot');
let pastHero = false;
let overOfferOrFoot = false;

const update = () => {
  sticky.hidden = !(pastHero && !overOfferOrFoot);
};

if ('IntersectionObserver' in window) {
  new IntersectionObserver(
    (entries) => {
      pastHero = entries[0].boundingClientRect.bottom < 0;
      update();
    },
    { threshold: 0 }
  ).observe(hero);

  const visible = new Map();
  const hideIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => visible.set(e.target, e.isIntersecting));
      overOfferOrFoot = [...visible.values()].some(Boolean);
      update();
    },
    { threshold: 0.12 }
  );
  hideIO.observe(offer);
  hideIO.observe(foot);
}

document.getElementById('year').textContent = String(new Date().getFullYear());
