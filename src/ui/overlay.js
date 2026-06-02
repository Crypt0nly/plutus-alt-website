import { BRAND, BEATS, INTEGRATIONS } from '../data/plutus.js';

// Builds the DOM chrome: nav, one scroll section per beat (in the same order as
// the camera stations), a side dock and the footer.

const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};

const navlink = (label, href) => `<a href="${href}">${label}</a>`;

export function createOverlay() {
  const scroll = document.getElementById('scroll');
  const navLinks = document.getElementById('nav-links');
  const dock = document.getElementById('dock');
  const nav = document.getElementById('nav');

  navLinks.innerHTML =
    navlink('How it works', '#beat-ask') +
    navlink('Integrations', '#beat-tools') +
    navlink('Control', '#beat-approve') +
    navlink('Run it', '#beat-deploy');

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

    // the "tools" beat lists the integrations under its copy
    const chips =
      beat.id === 'tools'
        ? `<ul class="chips">${INTEGRATIONS.map(
            (it) => `<li><span class="dot" style="background:${it.color}"></span>${it.label}</li>`
          ).join('')}</ul>`
        : '';

    sec.innerHTML = `
      <div class="card ${isEnd ? 'card-center' : ''}">
        <span class="kicker">${beat.kicker}</span>
        <h${beat.id === 'hero' ? 1 : 2} class="title">${beat.title}</h${beat.id === 'hero' ? 1 : 2}>
        <p class="body">${beat.body}</p>
        ${chips}
        ${beat.ctas ? `<div class="cta-row">${ctaButtons(beat.ctas)}</div>` : ''}
        ${beat.id === 'hero' ? '<div class="scroll-hint"><span>Scroll</span><i></i></div>' : ''}
      </div>
    `;
    scroll.appendChild(sec);
  });

  // footer
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
    b.addEventListener('click', () => scrollToStation(i));
    dock.appendChild(b);
    return b;
  });

  function scrollToStation(i) {
    document.querySelector(`[data-station="${i}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  let last = -1;
  function setActive(index) {
    if (index === last) return;
    last = index;
    dots.forEach((b, i) => b.setAttribute('data-active', String(i === index)));
  }

  document.getElementById('nav-aisles').addEventListener('click', () => scrollToStation(1));

  return { setActive, scrollToStation };
}
