import './neon.css';
import { INTEGRATIONS, icon } from './icons.js';
import { initReveals, reducedMotion } from './fx.js';
import { mountSwitcher } from './switcher.js';

mountSwitcher('neon');

// tools wall
document.getElementById('nwall').innerHTML = INTEGRATIONS.map(
  (it, i) => `
    <li class="reveal" style="--d: ${(i % 4) * 0.05}s">
      ${icon(it.glyph, it.color)}<span>${it.label.toUpperCase()}</span>
    </li>`
).join('');

// marquee tickers: duplicate the phrase until the track is ≥ 2x viewport,
// then the -50% keyframe loops seamlessly.
document.querySelectorAll('.nticker-track').forEach((track) => {
  const phrase = track.dataset.ticker;
  const repeats = Math.max(4, Math.ceil((window.innerWidth * 2) / (phrase.length * 14)));
  let html = '';
  for (let i = 0; i < repeats * 2; i += 1) html += `<span>${phrase}</span>`;
  track.innerHTML = html;
});

initReveals();

// cursor-follow glow in the hero (pointer devices, motion allowed)
const glow = document.getElementById('nglow');
if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
  const hero = document.querySelector('.nhero');
  let tx = 0.5;
  let ty = 0.5;
  let x = 0.5;
  let y = 0.5;
  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    tx = (e.clientX - r.left) / r.width;
    ty = (e.clientY - r.top) / r.height;
  });
  (function tick() {
    x += (tx - x) * 0.08;
    y += (ty - y) * 0.08;
    glow.style.left = `${x * 100}%`;
    glow.style.top = `${y * 100}%`;
    requestAnimationFrame(tick);
  })();
}

document.getElementById('year').textContent = String(new Date().getFullYear());
