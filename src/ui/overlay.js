import { BRAND, BEATS, INTEGRATIONS } from '../data/plutus.js';

// DOM chrome: nav, one scroll section per beat (in camera-station order), a
// scroll-progress bar, a side dock, footer — plus premium motion: word-by-word
// title reveals and section entrances tied to scroll.

const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};

const splitWords = (text) =>
  text
    .split(' ')
    .map((w, i) => `<span class="w" style="--i:${i}"><i>${w}</i></span>`)
    .join(' ');

function scrollToEl(target) {
  if (!target) return;
  if (window.__lenis) window.__lenis.scrollTo(target, { offset: 0, duration: 1.15 });
  else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function createOverlay() {
  document.body.classList.add('fx');
  const scroll = document.getElementById('scroll');
  const navLinks = document.getElementById('nav-links');
  const dock = document.getElementById('dock');
  const nav = document.getElementById('nav');

  // progress bar
  const progress = el('div');
  progress.id = 'progress';
  document.body.appendChild(progress);

  navLinks.innerHTML = [
    ['How it works', '#beat-ask'],
    ['Integrations', '#beat-tools'],
    ['Control', '#beat-approve'],
    ['Run it', '#beat-deploy'],
  ]
    .map(([l, h]) => `<a href="${h}">${l}</a>`)
    .join('');

  const ctaButtons = (ctas) =>
    (ctas || [])
      .map((c) => `<a class="btn ${c.kind === 'solid' ? 'btn-solid' : 'btn-ghost'}" href="${c.href}">${c.label}</a>`)
      .join('');

  BEATS.forEach((beat, i) => {
    const isEnd = beat.id === 'hero' || beat.id === 'cta';
    const side = isEnd ? 'center' : i % 2 ? 'right' : 'left';
    const sec = el('section', `section beat ${side} ${beat.id === 'hero' ? 'hero' : ''}`);
    sec.id = `beat-${beat.id}`;
    sec.dataset.station = String(i);

    const chips =
      beat.id === 'tools'
        ? `<ul class="chips">${INTEGRATIONS.map(
            (it, k) => `<li style="--i:${k}"><span class="dot" style="background:${it.color}"></span>${it.label}</li>`
          ).join('')}</ul>`
        : '';

    const Tag = beat.id === 'hero' ? 'h1' : 'h2';
    sec.innerHTML = `
      <div class="card ${isEnd ? 'card-center' : ''}">
        <span class="kicker">${beat.kicker}</span>
        <${Tag} class="title">${splitWords(beat.title)}</${Tag}>
        <p class="body">${beat.body}</p>
        ${chips}
        ${beat.ctas ? `<div class="cta-row">${ctaButtons(beat.ctas)}</div>` : ''}
        ${beat.id === 'hero' ? '<div class="scroll-hint"><span>Scroll</span><i></i></div>' : ''}
      </div>
    `;
    scroll.appendChild(sec);
  });

  const foot = el('footer', 'site-foot');
  foot.innerHTML = `
    <span>© ${new Date().getFullYear()} ${BRAND.name} — ${BRAND.tagline}</span>
    <span>Rendered in real time with Three.js + WebGL.</span>
  `;
  document.body.appendChild(foot);

  // dock
  const dots = BEATS.map((beat, i) => {
    const b = el('button');
    b.dataset.idx = String(i);
    b.innerHTML = `<span class="dock-label">${beat.kicker.replace(/^\d+\s·\s/, '')}</span>`;
    b.setAttribute('aria-label', `Go to ${beat.title}`);
    b.addEventListener('click', () => scrollToEl(document.querySelector(`[data-station="${i}"]`)));
    dock.appendChild(b);
    return b;
  });

  // reveal sections as they enter the viewport (replays on re-entry)
  const secEls = Array.from(document.querySelectorAll('.beat'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle('in', e.isIntersecting)),
      { threshold: 0.32 }
    );
    secEls.forEach((s) => io.observe(s));
  } else {
    secEls.forEach((s) => s.classList.add('in'));
  }

  // route in-page anchor links through smooth scroll
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#beat-"]');
    if (!a) return;
    e.preventDefault();
    scrollToEl(document.getElementById(a.getAttribute('href').slice(1)));
  });

  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  document.getElementById('nav-aisles').addEventListener('click', () =>
    scrollToEl(document.querySelector('[data-station="1"]'))
  );

  let last = -1;
  function setActive(index) {
    if (index === last) return;
    last = index;
    dots.forEach((b, i) => b.setAttribute('data-active', String(i === index)));
  }

  return { setActive };
}
