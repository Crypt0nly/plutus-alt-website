// Ocur site — "Obsidian Glass": scroll choreography + liquid-glass
// micro-interactions. Heavy work gates behind html.motion (set in
// <head> unless the visitor prefers reduced motion).

import './style.css';
import './discovery.css';
import './intro.css';
import './cinematic.css';
import { initIntro } from './intro.js';
import { initLangRouting, applyLang, initLangToggle, currentLang } from './i18n.js';
import { initCompanyPricing } from './company-pricing.js';
import { initThemeToggle } from './theme.js';
import { initAnalytics, track } from './analytics.js';
import { initXAds, trackXConversion, LEAD_EVENT_ID } from './xads.js';
import { ANSWER } from './cohort.js';
import { createFormProtection } from './form-protection.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

// language + theme first: applyLang() rewrites copy (the dev ?lang=de
// fallback) before SplitText below caches the hero markup.
initLangRouting();
initAnalytics();
initXAds();
applyLang();
initLangToggle();
initThemeToggle();
initCompanyPricing(document, currentLang);
document.getElementById('g-year').textContent = String(new Date().getFullYear());

let motion = document.documentElement.classList.contains('motion');
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
// Below 1100px the nav links move into the menu (see style.css); the burger opens a
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
  matchMedia('(min-width: 1101px)').addEventListener('change', (e) => {
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

// ------------------------------------------ the founding-cohort application
// Every "Apply" on the page (nav, phone menu, hero, pricing ribbon, dock,
// final) scrolls to #apply; count them by where they sit.
document.querySelectorAll('a[data-apply]').forEach((a) => {
  a.addEventListener('click', () => track('apply_click', { placement: a.dataset.apply }));
});

// The application is the site's lead form (the old "Talk to us"), so it
// lands in the founder's Ocur exactly like a lead did — contact, fact,
// notification for personal review — with kind=application on top. Posts JSON
// to the app backend through the same-origin rewrite in vercel.json
// (/leads/api/<slug> → api.ocur.ai/api/leads/<slug>); the form's own action
// is the direct URL. Every submission carries a single-use browser proof;
// without JavaScript the form offers the booking page instead. The business
// tiers' buttons and the Enterprise extra carry the plan into the hidden field,
// which the lead lands with.
const talk = document.getElementById('g-talk');
if (talk) {
  const de = document.documentElement.lang === 'de';
  const status = talk.querySelector('.g-talk-status');
  const planField = talk.querySelector('input[name="plan"]');
  const emailField = talk.querySelector('input[name="email"]');
  const button = talk.querySelector('button[type="submit"]');
  const protection = createFormProtection(talk.dataset.endpoint);
  const say = (text) => {
    status.textContent = text;
  };
  const thanks = (withPhone) =>
    de
      ? `Danke — deine Bewerbung ist da. Der Gründer antwortet ${ANSWER.de}, per ${withPhone ? 'Anruf oder E-Mail' : 'E-Mail'}.`
      : `Thanks — your application is in. The founder answers ${ANSWER.en}, by ${withPhone ? 'phone or email' : 'email'}.`;
  // What an application can't go without, in the order the fields sit.
  const needed = [
    ['company', 'Which company is applying?', 'Welches Unternehmen bewirbt sich?'],
    ['name', 'Please add your name.', 'Bitte gib deinen Namen an.'],
    ['team_size', 'Please choose your team size.', 'Bitte wähle eure Teamgröße.'],
    ['message', "Tell us the first job you'd hand Ocur — one line is enough.", 'Verrat uns den ersten Job für Ocur — eine Zeile reicht.'],
  ];

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

  if (window.crypto?.subtle && 'Worker' in window) {
    button.disabled = talk.classList.contains('is-sent');
    talk.addEventListener('focusin', () => protection.prepare(), { once: true });
    if ('IntersectionObserver' in window) {
      const watcher = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          watcher.disconnect();
          if (!talk.classList.contains('is-sent')) protection.prepare();
        }
      }, { rootMargin: '200px' });
      watcher.observe(talk);
    }
  } else {
    say(de
      ? 'Dein Browser unterstützt die Prüfung nicht. Bitte öffne die Seite in einem aktuellen Browser oder buch nebenan ein Gespräch.'
      : 'Your browser cannot run the check. Please use an up-to-date browser or book a call beside this form.');
  }

  talk.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (talk.classList.contains('is-sent') || talk.querySelector('button[type="submit"]').disabled) return;
    const data = Object.fromEntries(new FormData(talk).entries());
    const email = String(data.email || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      say(de ? 'Bitte gib eine gültige E-Mail-Adresse an.' : 'Please enter a valid email address.');
      emailField.focus();
      return;
    }
    const missing = needed.find(([name]) => !String(data[name] || '').trim());
    if (missing) {
      const [name, en, deText] = missing;
      say(de ? deText : en);
      talk.elements[name].focus();
      return;
    }
    button.disabled = true;
    talk.setAttribute('aria-busy', 'true');
    say(de ? 'Wird geprüft und gesendet…' : 'Checking and sending…');
    try {
      const post = async () => {
        const pow = await protection.take();
        return fetch(talk.dataset.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, pow, locale: de ? 'de' : 'en', page: location.pathname }),
          signal: AbortSignal.timeout(20_000),
        });
      };
      let res = await post();
      // Only 400 means a stale/spent proof. Retry it once; never retry a flood or invalid fields.
      if (res.status === 400) res = await post();
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
        kind: data.kind || '',
        plan: data.plan || '',
        team_size: data.team_size || '',
        phone: Boolean(String(data.phone || '').trim()),
        company: Boolean(String(data.company || '').trim()),
        role: Boolean(String(data.role || '').trim()),
      });
      trackXConversion('lead', LEAD_EVENT_ID);
    } catch (err) {
      button.disabled = false;
      say(
        (err && err.message && !/browser check|timeout|abort/i.test(err.message) ? err.message : '') ||
          (de
            ? 'Das hat nicht geklappt — bitte versuch es gleich noch einmal, oder buch stattdessen ein Gespräch.'
            : "That didn't go through — please try again in a moment, or book a call instead."),
      );
    } finally {
      talk.removeAttribute('aria-busy');
    }
  });
}

gsap.registerPlugin(ScrollTrigger, SplitText);
const motionMedia = gsap.matchMedia();
motionMedia.add('(prefers-reduced-motion: no-preference)', () => {
  motion = true;
  document.documentElement.classList.add('motion');
  document.querySelector('.g-demo').dataset.scene = '1';

  // Native scrolling drives the intro directly. Anchor destinations keep their
  // standard URL/focus behavior; no extra smoothing layer competes with the GPU.
  // nav gains depth + glow once scrolled
  ScrollTrigger.create({
    start: 80,
    onToggle: (self) => document.getElementById('g-nav').classList.toggle('is-stuck', self.isActive),
  });

  const disposeIntro = initIntro({ onLayout: () => ScrollTrigger.refresh() });

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
  const typeSplit = new SplitText('.g-type', { type: 'words,chars' });
  const typeChars = typeSplit.chars;
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

  // ------------------------------------------------ founding cohort
  gsap.from('.g-perk', {
    y: 50,
    opacity: 0,
    scale: 0.97,
    duration: 0.8,
    stagger: 0.09,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.g-perks', start: 'top 82%' },
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
  const finalSplit = new SplitText('.g-final-h', { type: 'lines', mask: 'lines' });
  const finalLines = finalSplit.lines;
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
  let atForm = false;
  const syncDock = () => (pastHero && beforeFinal && !atForm ? showDock.play() : showDock.reverse());
  ScrollTrigger.create({
    trigger: '.oc-intro',
    start: 'bottom 70%',
    onToggle: (self) => {
      pastHero = self.isActive || self.progress === 1;
      syncDock();
    },
  });
  // "Apply now" has nothing to add while the application is on screen
  ScrollTrigger.create({
    trigger: '#talk',
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => {
      atForm = self.isActive;
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

  // Native pointer behavior avoids a second continuously animated cursor.
  return () => {
    disposeIntro?.();
    typeSplit.revert();
    finalSplit.revert();
  };
});
motionMedia.add('(prefers-reduced-motion: reduce)', () => {
  motion = false;
  document.documentElement.classList.remove('motion');
  document.querySelector('.g-demo').dataset.scene = '4';
});
