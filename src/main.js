// Ocur site — "Obsidian Glass": scroll choreography + liquid-glass
// micro-interactions. Heavy work gates behind html.motion (set in
// <head> unless the visitor prefers reduced motion).

import './style.css';
import { initLangRouting, applyLang, initLangToggle } from './i18n.js';
import { initThemeToggle } from './theme.js';
import { initAnalytics, track } from './analytics.js';
import { initXAds, trackXConversion, LEAD_EVENT_ID } from './xads.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

// language + theme first: applyLang() rewrites copy (the dev ?lang=de
// fallback) before SplitText below caches the hero markup.
initLangRouting();
initAnalytics();
initXAds();
applyLang();
initLangToggle();
initThemeToggle();
document.getElementById('g-year').textContent = String(new Date().getFullYear());

const motion = document.documentElement.classList.contains('motion');
const finePointer = window.matchMedia('(pointer: fine)').matches;

// pointer-tracked glare on every glass surface
if (finePointer) {
  document.querySelectorAll('.glare').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--gx', `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty('--gy', `${((e.clientY - r.top) / r.height) * 100}%`);
    });
  });
}

// without motion the demo window still tells the full story: end state
// (the payoff report — scene 4 — with its final numbers baked into the HTML)
if (!motion) {
  document.querySelector('.g-demo').dataset.scene = '4';
}

// --------------------------------------------------- phone menu
// Below 880px the nav links vanish (see style.css); the burger opens a
// glass sheet under the nav with the links, both doors into the app and
// the language switch (i18n.js clones it in). A tap on any link closes it.
const burger = document.querySelector('.g-burger');
const menu = document.getElementById('g-menu');
if (burger && menu) {
  const setOpen = (open) => {
    menu.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
    document.documentElement.classList.toggle('menu-open', open);
    if (open) track('mobile_menu_open');
  };
  burger.addEventListener('click', () => setOpen(menu.hidden));
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) setOpen(false);
  });
  matchMedia('(min-width: 881px)').addEventListener('change', (e) => {
    if (e.matches) setOpen(false);
  });
}

// --------------------------------------------- pricing audience switch
// Solo and company are priced on different units, so the section carries two
// ladders (see style.css); the switch decides which one is on screen. The
// .seg-ready class is what hides the off-screen ladder — set here, so a page
// whose bundle never ran shows both instead of losing half the prices.
const seg = document.querySelector('.g-seg');
if (seg) {
  const tabs = [...seg.querySelectorAll('.g-seg-btn')];
  const ladders = [...document.querySelectorAll('.g-tiers')];
  document.querySelector('.g-pricing').classList.add('seg-ready');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const aud = tab.dataset.aud;
      tabs.forEach((t) => {
        const on = t === tab;
        t.classList.toggle('on', on);
        t.setAttribute('aria-pressed', String(on));
      });
      ladders.forEach((ladder) => {
        const on = ladder.dataset.aud === aud;
        ladder.classList.toggle('on', on);
        if (on && motion) {
          gsap.fromTo(
            ladder.querySelectorAll('.g-card'),
            { y: 26, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out' },
          );
        }
      });
      track('pricing_audience', { audience: aud });
      // the ladders are different heights — everything pinned below moves
      if (motion) ScrollTrigger.refresh();
    });
  });
}

// --------------------------------------------------- book a demo
// Every data-book link (nav, pricing band, FAQ, final) opens the founder's
// booking page in a new tab; count the click by where on the page it came
// from. The X Ads conversion rides in xads.js.
document.querySelectorAll('a[data-book]').forEach((a) => {
  a.addEventListener('click', () => track('book_demo_click', { placement: a.dataset.book }));
});

// --------------------------------------------------- talk to us
// The second door under the ladders: a message instead of a booked slot.
// Posts JSON to the app backend through the same-origin rewrite in
// vercel.json (/leads/api/<slug> → api.ocur.ai/api/leads/<slug>); the
// form's own action is the direct URL, so it still works with no JS (the
// backend sends that post back here with ?sent=1). The "Talk to sales"
// links on the business tiers and the Enterprise extra scroll here and
// carry the plan into the hidden field, which the lead lands with.
const talk = document.getElementById('g-talk');
if (talk) {
  const de = document.documentElement.lang === 'de';
  const status = talk.querySelector('.g-talk-status');
  const planField = talk.querySelector('input[name="plan"]');
  const emailField = talk.querySelector('input[name="email"]');
  const say = (text) => {
    status.textContent = text;
  };
  const thanks = (withPhone) =>
    de
      ? `Danke! Deine Nachricht ist da. Du hörst innerhalb eines Werktags von uns${withPhone ? ' — per Anruf oder E-Mail' : ''}.`
      : `Thanks — your message is in. You'll hear from us within one business day${withPhone ? ', by phone or email' : ''}.`;

  document.querySelectorAll('a[data-talk]').forEach((a) => {
    a.addEventListener('click', () => {
      planField.value = a.dataset.talk;
      track('talk_open', { plan: a.dataset.talk });
      window.setTimeout(() => emailField.focus({ preventScroll: true }), 900);
    });
  });

  // back from a no-JS post: the backend redirects to ?sent=1#talk
  if (new URLSearchParams(location.search).get('sent') === '1') {
    talk.classList.add('is-sent');
    say(thanks(false));
  }

  talk.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(talk).entries());
    const email = String(data.email || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      say(de ? 'Bitte gib eine gültige E-Mail-Adresse an.' : 'Please enter a valid email address.');
      emailField.focus();
      return;
    }
    const button = talk.querySelector('button[type="submit"]');
    button.disabled = true;
    say(de ? 'Wird gesendet…' : 'Sending…');
    try {
      const res = await fetch(talk.dataset.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, locale: de ? 'de' : 'en', page: location.pathname }),
      });
      if (!res.ok) {
        let detail = '';
        try {
          detail = (await res.json()).detail || '';
        } catch {
          /* not JSON */
        }
        throw new Error(typeof detail === 'string' ? detail : '');
      }
      talk.classList.add('is-sent');
      say(thanks(Boolean(String(data.phone || '').trim())));
      track('lead_submit', {
        plan: data.plan || '',
        phone: Boolean(String(data.phone || '').trim()),
        company: Boolean(String(data.company || '').trim()),
      });
      trackXConversion('lead', LEAD_EVENT_ID);
    } catch (err) {
      button.disabled = false;
      say(
        (err && err.message) ||
          (de
            ? 'Das hat nicht geklappt — bitte versuch es gleich noch einmal, oder buch stattdessen ein Gespräch.'
            : "That didn't go through — please try again in a moment, or book a call instead."),
      );
    }
  });
}

if (motion) {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  const lenis = new Lenis({ autoRaf: false, lerp: 0.12 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  // nav anchors glide
  document
    .querySelectorAll(
      '.g-links a[href^="#"], .g-menu-links a[href^="#"], .g-ctas a[href^="#"], a[data-talk][href^="#"], .g-faq a[href^="#"], .g-foot-links a[href^="#"]',
    )
    .forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      lenis.scrollTo(a.getAttribute('href'), { offset: -20, duration: 1.2 });
    });
  });

  // nav gains depth + glow once scrolled
  ScrollTrigger.create({
    start: 80,
    onToggle: (self) => document.getElementById('g-nav').classList.toggle('is-stuck', self.isActive),
  });

  // ---------------------------------------------------- hero entrance
  const heroLines = new SplitText('.g-h1', { type: 'lines', mask: 'lines' }).lines;
  gsap
    .timeline({ defaults: { ease: 'power4.out' } })
    .from(heroLines, { yPercent: 120, duration: 1.1, stagger: 0.1 }, 0.15)
    .to('.g-kicker', { opacity: 1, duration: 0.7 }, 0.35)
    .to('.g-sub', { opacity: 1, duration: 0.8 }, 0.7)
    .to('.g-ctas', { opacity: 1, duration: 0.8 }, 0.85)
    .to('.g-micro', { opacity: 1, duration: 0.8 }, 0.95)
    .to('.g-stats', { opacity: 1, duration: 0.8 }, 1.05);

  // The HTML carries the final values (1.5M, 60s), so no-motion and no-JS
  // read right; with motion each counts up from zero. data-decimals keeps
  // "1.5" from rounding to "2" on the way, in the page's own number format.
  const statLocale = document.documentElement.lang === 'de' ? 'de-DE' : 'en-US';
  document.querySelectorAll('.g-stat strong').forEach((el) => {
    const target = parseFloat(el.dataset.count);
    if (Number.isNaN(target)) return; // static value (e.g. ∞) — don't animate
    const suffix = el.dataset.suffix || '';
    const decimals = Number(el.dataset.decimals || 0);
    const state = { v: 0 };
    gsap.to(state, {
      v: target,
      duration: 1.6,
      delay: 1.05,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent =
          state.v.toLocaleString(statLocale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) +
          suffix;
      },
    });
  });

  // glow meshes breathe and drift
  gsap.to('.g-glow-hero', { y: 90, scale: 1.08, duration: 14, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  gsap.to('.g-glow-demo', { x: -70, y: 60, duration: 17, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  gsap.to('.g-glow-os', { x: -55, y: 65, duration: 18, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  gsap.to('.g-glow-bento', { x: 60, y: -50, duration: 19, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  gsap.to('.g-glow-price', { y: 70, scale: 1.06, duration: 16, yoyo: true, repeat: -1, ease: 'sine.inOut' });

  // hero glow recedes as you scroll into the page
  gsap.to('.g-glow-hero', {
    opacity: 0.35,
    ease: 'none',
    scrollTrigger: { trigger: '.g-hero', start: 'top top', end: 'bottom top', scrub: 0.6 },
  });

  // ----------------------------------------- connector system entrance
  gsap.from('.g-system', {
    scale: 0.9,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.g-logos', start: 'top 75%' },
  });

  // --------------------------------------- pinned four-scene demo
  const demo = document.querySelector('.g-demo');
  gsap.from('.g-win', {
    y: 80,
    opacity: 0,
    scale: 0.96,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.g-demo', start: 'top 70%' },
  });

  // the ask types itself out as the window arrives. Split words AND chars:
  // char-only spans destroy word boundaries and let "out" break as "ou|t".
  const typeChars = new SplitText('.g-type', { type: 'words,chars' }).chars;
  gsap.from(typeChars, {
    autoAlpha: 0,
    duration: 0.01,
    stagger: 0.03,
    ease: 'none',
    scrollTrigger: { trigger: '.g-demo', start: 'top 70%' },
  });

  // count-up numbers (the booked €, the collected total) — fired once per
  // element the first time its scene activates. The HTML carries the final
  // values, so no-motion and no-JS still read correctly.
  const ccLocale = document.documentElement.lang === 'de' ? 'de-DE' : 'en-US';
  const ccDone = new Set();
  const runCounters = (scene) => {
    document.querySelectorAll(`.g-s${scene} [data-cc]`).forEach((el) => {
      if (ccDone.has(el)) return;
      ccDone.add(el);
      const target = parseInt(el.dataset.cc, 10);
      const prefix = el.dataset.ccPrefix || '';
      const state = { v: 0 };
      gsap.to(state, {
        v: target,
        duration: 1.4,
        delay: 0.25,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = prefix + Math.round(state.v).toLocaleString(ccLocale);
        },
      });
    });
  };

  ScrollTrigger.create({
    trigger: '.g-demo',
    start: 'top top',
    end: '+=340%',
    pin: '.g-demo-stage',
    scrub: true,
    onUpdate: (self) => {
      const p = self.progress;
      const scene = p < 0.16 ? '1' : p < 0.52 ? '2' : p < 0.8 ? '3' : '4';
      if (demo.dataset.scene !== scene) {
        demo.dataset.scene = scene;
        runCounters(scene);
      }
    },
  });

  // ------------------------------------------------- ledger cards
  gsap.from('.g-os-card', {
    y: 60,
    opacity: 0,
    scale: 0.97,
    duration: 0.8,
    stagger: 0.09,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.g-os-grid', start: 'top 80%' },
  });
  gsap.from('.g-os-note', {
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.g-os-note', start: 'top 88%' },
  });

  // ------------------------------------------------------ bento tiles
  // batched: the grid is now ~two viewports tall, so each row reveals
  // as it enters rather than all at once when the grid's top shows up
  ScrollTrigger.batch('.g-tile', {
    start: 'top 85%',
    once: true,
    onEnter: (tiles) =>
      gsap.from(tiles, { y: 60, opacity: 0, scale: 0.97, duration: 0.8, stagger: 0.09, ease: 'power3.out' }),
  });

  // ----------------------------------------------------- pricing
  // the ladder that's on screen at load; a switch fades its own cards in
  gsap.from('.g-tiers.on .g-card', {
    y: 70,
    opacity: 0,
    duration: 0.9,
    stagger: 0.12,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.g-seg', start: 'top 78%' },
  });

  // --------------------------------------------------------- faq
  gsap.from('.g-faq details', {
    y: 36,
    opacity: 0,
    duration: 0.7,
    stagger: 0.07,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.g-faq', start: 'top 80%' },
  });

  // ------------------------------------------------------- final
  const finalLines = new SplitText('.g-final-h', { type: 'lines', mask: 'lines' }).lines;
  gsap.from(finalLines, {
    yPercent: 120,
    duration: 1,
    stagger: 0.1,
    ease: 'power4.out',
    scrollTrigger: { trigger: '.g-final', start: 'top 65%' },
  });

  // --------------------------------------------- floating CTA dock
  const dock = document.getElementById('g-dock');
  const showDock = gsap.to(dock, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out', paused: true });
  gsap.set(dock, { y: 16 });
  let pastHero = false;
  let beforeFinal = true;
  const syncDock = () => (pastHero && beforeFinal ? showDock.play() : showDock.reverse());
  ScrollTrigger.create({
    trigger: '.g-hero',
    start: 'bottom 70%',
    onToggle: (self) => {
      pastHero = self.isActive || self.progress === 1;
      syncDock();
    },
  });
  ScrollTrigger.create({
    trigger: '.g-final',
    start: 'top 75%',
    onToggle: (self) => {
      beforeFinal = !self.isActive;
      syncDock();
    },
  });

  // ------------------------------------------------ micro-interactions
  if (finePointer) {
    document.querySelectorAll('.magnetic').forEach((btn) => {
      const strength = 12;
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const dx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        const dy = ((e.clientY - r.top) / r.height - 0.5) * 2;
        gsap.to(btn, { x: dx * strength, y: dy * strength, duration: 0.35, ease: 'power3.out' });
      });
      btn.addEventListener('pointerleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.45)' });
      });
    });

    const cursor = document.querySelector('.g-cursor');
    const dot = document.querySelector('.g-cursor-dot');
    const ring = document.querySelector('.g-cursor-ring');
    const pos = { x: innerWidth / 2, y: innerHeight / 2 };
    const ringPos = { ...pos };
    addEventListener('pointermove', (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      dot.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    });
    gsap.ticker.add(() => {
      ringPos.x += (pos.x - ringPos.x) * 0.16;
      ringPos.y += (pos.y - ringPos.y) * 0.16;
      ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px)`;
    });
    document.addEventListener('pointerover', (e) => {
      cursor.classList.toggle('is-link', !!e.target.closest('a, button, summary'));
    });
  }
}
