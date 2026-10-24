// Ocur site — the public pages in the Ocur app language: neutral reading
// surfaces, blue actions, floating glass controls, and scroll choreography
// on top. Heavy work gates behind html.motion (set in <head> unless the
// visitor prefers reduced motion); every hidden starting state is set here
// by GSAP, so without JS or motion the page simply reads.

import './style.css';
import './discovery.css';
import './intro.css';
import { initIntro } from './intro.js';
import { initLangRouting, applyLang, initLangToggle, currentLang } from './i18n.js';
import { initCompanyPricing } from './company-pricing.js';
import { initThemeToggle } from './theme.js';
import { initChrome } from './chrome.js';
import { initAnalytics, track } from './analytics.js';
import { initXAds, trackXConversion, LEAD_EVENT_ID } from './xads.js';
import { ANSWER } from './cohort.js';
import { createFormProtection } from './form-protection.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

// language + theme first: applyLang() rewrites copy (the dev ?lang=de
// fallback) before SplitText below caches the markup.
initLangRouting();
initAnalytics();
initXAds();
applyLang();
initLangToggle();
initThemeToggle();
initChrome();
initCompanyPricing(document, currentLang);
document.getElementById('g-year').textContent = String(new Date().getFullYear());

const root = document.documentElement;
let motion = root.classList.contains('motion');
const demo = document.querySelector('.g-demo');

// without motion the demo window still tells the full story: end state
// (the payoff report — scene 4 — with its final numbers baked into the HTML)
if (!motion) demo.dataset.scene = '4';

// Segmented controls: the selection slides to the chosen segment.
const slideTo = (group, index) => group?.style.setProperty('--seg-i', String(index));

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
      slideTo(seg, tabs.indexOf(tab));
      ladders.forEach((ladder) => {
        const on = ladder.dataset.aud === aud;
        ladder.classList.toggle('on', on);
        if (on && motion) {
          const cards = ladder.querySelectorAll('.g-card');
          // the hover transition waits until the cards have landed
          gsap.set(cards, { transition: 'none' });
          gsap.fromTo(
            cards,
            { y: 26, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, stagger: 0.06, ease: 'expo.out', clearProps: 'transform,opacity,transition' },
          );
        }
      });
      track('pricing_audience', { audience: aud });
      // the ladders are different heights — everything pinned below moves
      if (motion) ScrollTrigger.refresh();
    });
  });
}

// The business billing interval: the selection slides, and each price
// re-sets itself (company-pricing.js has already written the new numbers).
const interval = document.querySelector('.g-company-interval');
if (interval) {
  interval.querySelectorAll('[data-billing-interval]').forEach((button, index) => {
    button.addEventListener('click', () => {
      slideTo(interval, index);
      if (!motion) return;
      document.querySelectorAll('[data-company-plan] .g-price').forEach((price) => {
        price.classList.remove('is-flipping');
        void price.offsetWidth;
        price.classList.add('is-flipping');
      });
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


// ================================================================ motion
// Scroll choreography. Everything here runs only without a reduced-motion
// preference; gsap.matchMedia reverts it all (inline styles, splits, pins)
// the moment that preference changes.
gsap.registerPlugin(ScrollTrigger, SplitText);
const EASE = 'expo.out';
const motionMedia = gsap.matchMedia();

motionMedia.add('(prefers-reduced-motion: no-preference)', () => {
  motion = true;
  root.classList.add('motion');
  demo.dataset.scene = '1';
  const splits = [];

  // Native scrolling drives the intro directly; the rest of the page
  // re-measures whenever the film changes the layout.
  const disposeIntro = initIntro({ onLayout: () => ScrollTrigger.refresh() });

  // ------------------------------------------------------ helpers
  // A headline's lines rise out of their own masks. autoSplit re-splits when
  // fonts load or the width changes, carrying the animation's progress over.
  const revealLines = (el, { trigger = el, start = 'top 86%', delay = 0 } = {}) => {
    if (!el) return;
    splits.push(
      SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'g-line',
        autoSplit: true,
        // the masks are named g-line-mask after the line class (style.css)
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 118,
            duration: 1.2,
            delay,
            ease: EASE,
            stagger: 0.1,
            scrollTrigger: { trigger, start, once: true },
          }),
      }),
    );
  };
  // A quiet rise for supporting copy and controls. Inline styles are
  // cleared afterwards so CSS (hover, state) owns the element again.
  const rise = (targets, { trigger, start = 'top 88%', y = 26, delay = 0, stagger = 0.08, duration = 1.05 } = {}) => {
    const els = gsap.utils.toArray(targets);
    if (!els.length) return;
    gsap.set(els, { transition: 'none' });
    gsap.from(els, {
      y,
      opacity: 0,
      duration,
      delay,
      stagger,
      ease: EASE,
      clearProps: 'transform,opacity,transition',
      scrollTrigger: { trigger: trigger || els[0], start, once: true },
    });
  };
  // Cards arrive row by row as each row enters, not all at once. Their CSS
  // hover transition is held off while GSAP owns the transform, then handed
  // back, so the two never ease the same property at once.
  const cascade = (targets, { start = 'top 92%', y = 54, stagger = 0.09 } = {}) => {
    const els = gsap.utils.toArray(targets);
    if (!els.length) return;
    gsap.set(els, { y, opacity: 0, transition: 'none' });
    ScrollTrigger.batch(els, {
      start,
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          y: 0,
          opacity: 1,
          duration: 1.15,
          ease: EASE,
          stagger,
          overwrite: true,
          clearProps: 'transform,opacity,transition',
        }),
    });
  };

  // --------------------------------------------- the welcome (stage)
  const hero = document.querySelector('.oc-welcome');
  if (hero) {
    const heroIn = { trigger: hero, start: 'top 72%' };
    rise(hero.querySelector('.oc-eyebrow'), { ...heroIn, y: 14 });
    revealLines(hero.querySelector('h2'), { ...heroIn, delay: 0.08 });
    rise(hero.querySelectorAll('.oc-description, .oc-actions, .oc-invitation'), { ...heroIn, delay: 0.4, stagger: 0.1 });
    // The page rises over the promise; it settles back and dims beneath.
    const under = () => ({ trigger: '.o-sheet', start: 'top bottom', end: 'top 10%', scrub: true });
    gsap.to(hero.querySelector('.oc-welcome-inner'), { scale: 0.9, yPercent: -5, opacity: 0.1, ease: 'none', scrollTrigger: under() });
    gsap.to(hero, { '--hero-p': 1, ease: 'none', scrollTrigger: under() });
  }

  // ------------------------------------------------------ connectors
  const system = document.querySelector('.g-system');
  if (system) {
    revealLines(document.querySelector('.g-logos-label'));
    rise('.g-logos-sub', { delay: 0.2 });
    gsap
      .timeline({ scrollTrigger: { trigger: system, start: 'top 84%', once: true } })
      .from(system.querySelectorAll('.g-orbit'), { scale: 0.5, opacity: 0, duration: 1.8, ease: EASE, stagger: 0.14 })
      .from(system.querySelector('.g-sun'), { scale: 0.4, opacity: 0, duration: 1.3, ease: 'back.out(1.8)' }, 0.1)
      .from(system.querySelector('.g-planets'), { scale: 0.3, rotate: -28, opacity: 0, duration: 2, ease: EASE }, 0.2);
  }

  // ------------------------------------------ the pinned product demo
  const win = demo.querySelector('.g-win');
  rise(demo.querySelector('.oc-chapter'), { trigger: demo, start: 'top 72%', y: 14 });
  revealLines(demo.querySelector('.g-h2'), { trigger: demo, start: 'top 72%' });
  // The window tips up out of the page as it arrives.
  gsap.fromTo(
    win,
    { y: 120, scale: 0.9, rotateX: 10, transformPerspective: 1600 },
    { y: 0, scale: 1, rotateX: 0, ease: 'none', scrollTrigger: { trigger: demo, start: 'top bottom', end: 'top 8%', scrub: 0.8 } },
  );

  // the ask types itself out as the window arrives. Split words AND chars:
  // char-only spans destroy word boundaries and let "out" break as "ou|t".
  const typeSplit = new SplitText('.g-type', { type: 'words,chars' });
  gsap.from(typeSplit.chars, {
    autoAlpha: 0,
    duration: 0.01,
    stagger: 0.03,
    ease: 'none',
    scrollTrigger: { trigger: demo, start: 'top 55%' },
  });

  // count-up numbers (the booked €) — fired once per element the first
  // time its scene activates. The HTML carries the final values, so
  // no-motion and no-JS still read correctly.
  const ccLocale = root.lang === 'de' ? 'de-DE' : 'en-US';
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

  // Four scenes over one pinned stretch. The rail beside the story fills
  // toward the next step and reaches it as that scene begins.
  const SCENES = [0, 0.16, 0.52, 0.8];
  const rail = (p) => {
    for (let i = SCENES.length - 1; i >= 0; i--) {
      if (p >= SCENES[i]) {
        const next = SCENES[i + 1] ?? 1;
        const span = next - SCENES[i];
        const local = i === SCENES.length - 1 ? 1 : (p - SCENES[i]) / span;
        return Math.min(1, (i + local) / (SCENES.length - 1));
      }
    }
    return 0;
  };
  ScrollTrigger.create({
    trigger: demo,
    start: 'top top',
    end: '+=320%',
    pin: '.g-demo-stage',
    scrub: true,
    onUpdate: (self) => {
      const p = self.progress;
      demo.style.setProperty('--demo-p', rail(p).toFixed(4));
      const scene = p < SCENES[1] ? '1' : p < SCENES[2] ? '2' : p < SCENES[3] ? '3' : '4';
      if (demo.dataset.scene !== scene) {
        demo.dataset.scene = scene;
        runCounters(scene);
      }
    },
  });

  // ----------------------------------------------- chapters + headlines
  document.querySelectorAll('.o-sheet .oc-chapter').forEach((chapter) => {
    if (!demo.contains(chapter)) rise(chapter, { y: 12, duration: 0.9 });
  });
  document
    .querySelectorAll('.g-os .g-h2, .g-features .g-h2, .g-start .g-h2, .g-pricing .g-h2, .g-cohort .g-h2, .g-faq-sec .g-h2, .d-resources h2')
    .forEach((el) => revealLines(el));

  // ---------------------------------------------------- the ledgers
  // The statement lights up word by word as it is read.
  const statement = document.querySelector('.g-os-sub');
  if (statement) {
    const words = SplitText.create(statement, { type: 'words', wordsClass: 'g-word' });
    splits.push(words);
    gsap.fromTo(
      words.words,
      { opacity: 0.16 },
      {
        opacity: 1,
        ease: 'none',
        stagger: 0.12,
        scrollTrigger: { trigger: statement, start: 'top 82%', end: 'bottom 46%', scrub: 0.6 },
      },
    );
  }
  cascade('.g-os-card');
  rise('.g-os-note');

  // ---------------------------------------------------- features
  cascade('.g-tile');

  // --------------------------------------------- the first ten minutes
  rise('.g-start-sub', { delay: 0.15 });
  cascade('.g-step', { stagger: 0.12 });
  const steps = document.querySelector('.g-steps');
  if (steps) {
    gsap.fromTo(
      steps,
      { '--line': 0 },
      { '--line': 1, ease: 'none', scrollTrigger: { trigger: steps, start: 'top 82%', end: 'bottom 62%', scrub: 0.6 } },
    );
  }
  rise('.g-start-note');

  // ---------------------------------------------------- pricing
  rise('.g-price-lede, .g-seg, .g-worker-note', { stagger: 0.1 });
  cascade('.g-card');
  cascade('.g-extra', { y: 30 });

  // ----------------------------------------------- founding cohort
  rise('.g-cohort-kicker', { y: 12 });
  rise('.g-cohort-sub', { delay: 0.15 });
  cascade('.g-perk');
  cascade('.g-talk, .g-next, .g-book', { y: 60, stagger: 0.12 });

  // ------------------------------------------------------- FAQ
  rise('.g-faq', { y: 40 });

  // ----------------------------------------- resources (built pages)
  cascade('.d-card');

  // ------------------------------------------------------ final
  const finalCard = document.querySelector('.g-final-card');
  if (finalCard) {
    // The film's stage comes back as a card that opens up to full size.
    gsap.fromTo(
      finalCard,
      { scale: 0.88, y: 40 },
      { scale: 1, y: 0, ease: 'none', scrollTrigger: { trigger: '.g-final', start: 'top bottom', end: 'top 28%', scrub: 0.7 } },
    );
    rise(finalCard.querySelector('.g-final-mark'), { trigger: finalCard, start: 'top 72%', y: 24 });
    revealLines(finalCard.querySelector('.g-final-h'), { trigger: finalCard, start: 'top 68%', delay: 0.1 });
    rise(finalCard.querySelectorAll('.g-btn, .g-micro, .g-final-alt'), { trigger: finalCard, start: 'top 60%', delay: 0.45, stagger: 0.08 });
  }

  // --------------------------------------------- floating CTA dock
  const dock = document.getElementById('g-dock');
  const showDock = gsap.to(dock, { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE, paused: true });
  gsap.set(dock, { y: 18 });
  let pastHero = false;
  let beforeFinal = true;
  let atForm = false;
  let atDemo = false;
  const syncDock = () => (pastHero && beforeFinal && !atForm && !atDemo ? showDock.play() : showDock.reverse());
  // the welcome has its own doors; the dock joins once the page has risen
  ScrollTrigger.create({
    trigger: '.o-sheet',
    start: 'top 35%',
    onToggle: (self) => {
      pastHero = self.isActive || self.progress === 1;
      syncDock();
    },
  });
  // the demo tells its story without a button over its captions
  ScrollTrigger.create({
    trigger: demo,
    start: 'top 60%',
    end: 'bottom 40%',
    onToggle: (self) => {
      atDemo = self.isActive;
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

  return () => {
    disposeIntro?.();
    typeSplit.revert();
    splits.forEach((split) => split.revert());
  };
});

motionMedia.add('(prefers-reduced-motion: reduce)', () => {
  motion = false;
  root.classList.remove('motion');
  demo.dataset.scene = '4';
});

// Late fonts change line lengths; every trigger re-measures once they land.
document.fonts?.ready.then(() => ScrollTrigger.refresh());
