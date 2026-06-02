import { BRAND, PRODUCTS, AISLES } from '../data/products.js';

// Builds all DOM chrome: nav links, the scroll sections (hero → products →
// checkout), the side dock, and the footer. Sections are returned in the same
// order as the camera "stations" so scroll position maps straight onto them.

const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};

export function createOverlay({ onSelect }) {
  const scroll = document.getElementById('scroll');
  const navLinks = document.getElementById('nav-links');
  const dock = document.getElementById('dock');
  const nav = document.getElementById('nav');

  // ---- nav aisle links ----
  AISLES.forEach((aisle) => {
    const firstIdx = PRODUCTS.findIndex((p) => p.aisle === aisle.id);
    const b = el('button', null, aisle.label);
    b.title = aisle.note;
    b.addEventListener('click', () => scrollToSection(firstIdx + 1));
    navLinks.appendChild(b);
  });

  // ---- HERO ----
  const hero = el('section', 'section hero');
  hero.id = 'top';
  hero.dataset.station = '0';
  hero.innerHTML = `
    <span class="eyebrow"><span class="dot"></span> Now stocking · v3.0</span>
    <h1>The AI operating system, stocked like a <em>supermarket</em>.</h1>
    <p class="lede">${BRAND.aisleLine} Agents, analytics, orchestration, data, runtime, security and integrations —
      every capability your company runs on, packaged, priced and ready to put in your basket.</p>
    <div class="hero-cta">
      <a class="btn btn-accent" href="#sec-1">Walk the aisles</a>
      <a class="btn btn-ghost" href="#checkout">See pricing</a>
    </div>
    <div class="hero-meta">
      <div><b>${PRODUCTS.length}</b><span>shelf-stable products</span></div>
      <div><b>99.99%</b><span>uptime, every aisle</span></div>
      <div><b>SOC 2</b><span>sealed for freshness</span></div>
      <div><b>1</b><span>operating system</span></div>
    </div>
    <div class="scroll-hint"><span>Scroll to shop</span><i></i></div>
  `;
  scroll.appendChild(hero);

  // ---- PRODUCT SECTIONS ----
  const half = Math.ceil(PRODUCTS.length / 2);
  PRODUCTS.forEach((p, i) => {
    // product is framed on the left for the first half → card sits on the right
    const sec = el('section', `section product-section ${i < half ? 'right' : ''}`);
    sec.id = `sec-${i + 1}`;
    sec.dataset.station = String(i + 1);

    const hero = p.specs.find((s) => s.big) || p.specs[1];
    const picks = [hero, ...p.specs.filter((s) => s !== hero)].slice(0, 4);
    const specRows = picks
      .map((s) => `<li><span>${s.label}</span><span>${s.value}</span></li>`)
      .join('');

    const card = el('div', 'card');
    card.style.setProperty('--c', p.colors.base);
    card.innerHTML = `
      <span class="chip" style="background:${p.colors.base}">Aisle · ${p.aisle}</span>
      <h2>${p.name}</h2>
      <div class="feature" style="color:${p.colors.base}">${p.feature}</div>
      <p class="tagline">${p.tagline}</p>
      <ul class="mini-specs">${specRows}</ul>
      <div class="card-actions">
        <button class="btn btn-solid" data-open="${p.id}">Read the AI Facts</button>
        <button class="btn btn-ghost" data-open="${p.id}">Add to stack</button>
      </div>
    `;
    card.querySelectorAll('[data-open]').forEach((btn) =>
      btn.addEventListener('click', () => onSelect(p))
    );
    sec.appendChild(card);
    scroll.appendChild(sec);
  });

  // ---- CHECKOUT ----
  const checkoutIdx = PRODUCTS.length + 1;
  const checkout = el('section', 'section checkout');
  checkout.id = 'checkout';
  checkout.dataset.station = String(checkoutIdx);
  checkout.innerHTML = `
    <div class="panel">
      <h2>Fill your basket.</h2>
      <p class="sub">Start with a single product or take the whole shelf. Every plan includes the PLUTUS
        runtime, the integration mesh and Guardian security — because a balanced stack needs all the food groups.</p>
      <div class="plans">
        <div class="plan">
          <div class="tier">Corner Store</div>
          <div class="price">$0<small> / forever</small></div>
          <ul>
            <li>1 product, 1 workspace</li>
            <li>Community support</li>
            <li>10k agent runs / mo</li>
            <li>Shared compute</li>
          </ul>
          <a class="btn btn-ghost" href="#top">Start free</a>
        </div>
        <div class="plan featured">
          <div class="tier">Supermarket</div>
          <div class="price">$2,400<small> / mo</small></div>
          <ul>
            <li>Every product, unlimited seats</li>
            <li>SOC 2 · SSO · audit logs</li>
            <li>2M agent runs / mo</li>
            <li>Priority compute & support</li>
          </ul>
          <a class="btn btn-accent" href="#top">Choose Supermarket</a>
        </div>
        <div class="plan">
          <div class="tier">Distribution Center</div>
          <div class="price">Custom</div>
          <ul>
            <li>Dedicated & on-prem options</li>
            <li>Data residency, your region</li>
            <li>Unlimited runs & models</li>
            <li>Named solutions team</li>
          </ul>
          <a class="btn btn-solid" href="#top">Talk to sales</a>
        </div>
      </div>
      <p class="foot-note">Prices are illustrative — PLUTUS is a concept demo rendered entirely in WebGL.</p>
    </div>
  `;
  scroll.appendChild(checkout);

  // ---- FOOTER ----
  const foot = el('footer', 'site-foot');
  foot.innerHTML = `
    <span>© ${new Date().getFullYear()} PLUTUS — ${BRAND.promise}.</span>
    <span>Every product on this page is procedurally modelled & rendered in real time with Three.js + WebGL.</span>
  `;
  document.body.appendChild(foot);

  // ---- DOCK ----
  const labels = ['Intro', ...PRODUCTS.map((p) => p.name), 'Checkout'];
  const dockButtons = labels.map((label, i) => {
    const b = el('button');
    b.dataset.idx = String(i);
    b.innerHTML = `<span class="dock-label">${label}</span>`;
    b.setAttribute('aria-label', `Go to ${label}`);
    b.addEventListener('click', () => scrollToSection(i));
    dock.appendChild(b);
    return b;
  });

  function scrollToSection(i) {
    const sec = document.querySelector(`[data-station="${i}"]`);
    if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // nav background on scroll
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  let lastActive = -1;
  function setActive(index) {
    if (index === lastActive) return;
    lastActive = index;
    dockButtons.forEach((b, i) => b.setAttribute('data-active', String(i === index)));
  }

  // mobile "Browse aisles" jumps to first product
  document.getElementById('nav-aisles').addEventListener('click', () => scrollToSection(1));

  return { setActive, scrollToSection };
}
