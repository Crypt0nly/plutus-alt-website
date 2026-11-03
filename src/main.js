// Ocur site — the marketing pages (home, product, pricing, FAQ, contact) in
// the Ocur app language: neutral reading surfaces, blue actions, floating
// glass controls, and scroll choreography on top. Every page loads
// this one entry; each part below starts only when its section is on the
// page. Heavy work gates behind html.motion (set in <head> unless the
// visitor prefers reduced motion); every hidden starting state is set here
// by GSAP, so without JS or motion the pages simply read. Nothing that is
// already on screen when a page opens is hidden for an entrance.

import './style.css';
import './discovery.css';
import { initHero } from './hero.js';
import { initProductShowcase } from './product-showcase.js';
import { initLangRouting, applyLang, initLangToggle, currentLang } from './i18n.js';
import { initCompanyPricing } from './company-pricing.js';
import { initThemeToggle } from './theme.js';
import { initChrome, initDoors, setYear } from './chrome.js';
import { initMobileMenu } from './mobile-menu.js';
import { initAnalytics, track } from './analytics.js';
import { initXAds } from './xads.js';
import { initContactForm } from './contact-form.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

// language + theme first: applyLang() rewrites copy (the dev ?lang=de
// fallback) before SplitText below caches the markup.
initLangRouting();
initAnalytics();
initXAds();
applyLang();
initProductShowcase({ onLayout: () => ScrollTrigger.refresh() });
initLangToggle();
initThemeToggle();
initChrome();
initDoors();
initCompanyPricing(document, currentLang);
setYear();

const root = document.documentElement;
let motion = root.classList.contains('motion');
const demo = document.querySelector('.g-demo');

// without motion the demo window still tells the full story: end state
// (the payoff report — scene 4 — with its final numbers baked into the HTML)
if (!motion && demo) demo.dataset.scene = '4';

// Segmented controls: the selection slides to the chosen segment.
const slideTo = (group, index) => group?.style.setProperty('--seg-i', String(index));

// --------------------------------------------------- phone menu
// Narrow windows move the page links into a frosted sheet under the burger,
// with the application, both doors into the app, the founder's booking page
// and the language and theme switches. A tap on any link closes it.
initMobileMenu({ onOpen: () => track('mobile_menu_open') });

// --------------------------------------------- pricing audience switch
// Solo and company are priced on different units, so the page carries two
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
      // the ladders are different heights — everything below moves
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

// --------------------------------------------------- talk to us
// The form lives on the contact page (contact-form.js). The pricing links
// that open it with a plan are counted where they sit.
document.querySelectorAll('a[data-talk]').forEach((a) => {
  a.addEventListener('click', () => track('talk_open', { plan: a.dataset.talk }));
});
initContactForm();

// ================================================================ motion
// Scroll choreography. Everything here runs only without a reduced-motion
// preference; its context reverts all inline styles, splits and pins when
// either the system preference or the saved data-motion attribute changes.
gsap.registerPlugin(ScrollTrigger, SplitText);
const EASE = 'expo.out';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let motionContext;

// What the visitor can already see when the page opens stays as it is: a
// page never makes you wait for its first screen.
const belowFold = (el) => el.getBoundingClientRect().top > innerHeight * 0.9;

function animatePage() {
  motion = true;
  root.classList.add('motion');
  if (demo) demo.dataset.scene = '1';
  const splits = [];
  const disposers = [];

  // The opening's deck of jobs starts dealing (it pauses itself off screen).
  const opening = initHero({ motion: true });

  // ------------------------------------------------------ helpers
  // A headline's lines rise out of their own masks. autoSplit re-splits when
  // fonts load or the width changes, carrying the animation's progress over.
  const revealLines = (el, { trigger = el, start = 'top 86%', delay = 0 } = {}) => {
    if (!el || !belowFold(el)) return;
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
    const els = gsap.utils.toArray(targets).filter(belowFold);
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
    const els = gsap.utils.toArray(targets).filter(belowFold);
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

  // --------------------------------------------------- the opening (home)
  // Its entrance is CSS. The page rises over it; the opening settles back
  // and dims beneath, and its deck rests once the page has covered it.
  const hero = document.querySelector('.hx');
  if (hero) {
    const under = () => ({ trigger: '.o-sheet', start: 'top bottom', end: 'top 10%', scrub: true });
    gsap.to(hero.querySelector('.hx-inner'), { scale: 0.92, yPercent: -4, opacity: 0.12, ease: 'none', scrollTrigger: under() });
    gsap.to(hero, { '--hero-p': 1, ease: 'none', scrollTrigger: under() });
    ScrollTrigger.create({ trigger: '.o-sheet', start: 'top 20%', onToggle: (self) => opening?.cover(self.isActive) });
  }

  // ------------------------------------------------------ connectors (home)
  const system = document.querySelector('.g-system');
  if (system) {
    revealLines(document.querySelector('.g-logos-label'));
    rise('.g-logos-sub, .g-logos-more', { delay: 0.2 });
    gsap
      .timeline({ scrollTrigger: { trigger: system, start: 'top 84%', once: true } })
      .from(system.querySelectorAll('.g-orbit'), { scale: 0.5, opacity: 0, duration: 1.8, ease: EASE, stagger: 0.14 })
      .from(system.querySelector('.g-sun'), { scale: 0.4, opacity: 0, duration: 1.3, ease: 'back.out(1.8)' }, 0.1)
      .from(system.querySelector('.g-planets'), { scale: 0.3, rotate: -28, opacity: 0, duration: 2, ease: EASE }, 0.2);
  }

  // ------------------------------------------- where to next (home)
  revealLines(document.querySelector('.g-paths .g-h2'));
  cascade('.g-path');

  // ------------------------------------ the pinned product demo (product)
  if (demo) {
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
    disposers.push(() => typeSplit.revert());
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
  }

  // ----------------------------------------------- chapters + headlines
  // Page titles (.pg-title) open their page and are never held back.
  document.querySelectorAll('main .oc-chapter').forEach((chapter) => {
    if (!demo?.contains(chapter)) rise(chapter, { y: 12, duration: 0.9 });
  });
  document
    .querySelectorAll(':is(.g-os, .g-features, .g-start, .g-pricing, .g-contact, .g-faq-sec) .g-h2:not(.pg-title), .d-resources h2, .faq-group-title')
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

  // ------------------------------------------------------- contact
  cascade('.g-talk, .g-next, .g-book', { y: 60, stagger: 0.12 });

  // ------------------------------------------------------- FAQ
  rise('.g-faq', { y: 40 });

  // ----------------------------------------- resources (built pages)
  cascade('.d-card');

  // ------------------------------------------------------ final
  const finalCard = document.querySelector('.g-final-card');
  if (finalCard) {
    // The closing card opens up to full size as it arrives.
    gsap.fromTo(
      finalCard,
      { scale: 0.88, y: 40 },
      { scale: 1, y: 0, ease: 'none', scrollTrigger: { trigger: '.g-final', start: 'top bottom', end: 'top 28%', scrub: 0.7 } },
    );
    rise(finalCard.querySelector('.g-final-mark'), { trigger: finalCard, start: 'top 72%', y: 24 });
    revealLines(finalCard.querySelector('.g-final-h'), { trigger: finalCard, start: 'top 68%', delay: 0.1 });
    rise(finalCard.querySelectorAll('.g-btn, .g-micro, .g-final-alt'), { trigger: finalCard, start: 'top 60%', delay: 0.45, stagger: 0.08 });
  }

  return () => {
    opening?.dispose();
    disposers.forEach((dispose) => dispose());
    splits.forEach((split) => split.revert());
  };
}

function staticPage() {
  motion = false;
  root.classList.remove('motion');
  if (demo) demo.dataset.scene = '4';
  // the jobs stay finished; the chips switch them in place
  const opening = initHero({ motion: false });
  return () => opening?.dispose();
}

function syncMotion() {
  motionContext?.revert();
  motion = !reducedMotion.matches && root.dataset.motion !== 'reduced';
  root.classList.toggle('motion', motion);
  motionContext = gsap.context(() => (motion ? animatePage() : staticPage()));
}
syncMotion();
reducedMotion.addEventListener('change', syncMotion);
new MutationObserver(syncMotion).observe(root, { attributes: true, attributeFilter: ['data-motion'] });

// Late fonts change line lengths; every trigger re-measures once they land.
document.fonts?.ready.then(() => ScrollTrigger.refresh());
