// Language plumbing. The German page is a real prerendered URL (/de/,
// baked by scripts/prerender-de.mjs from src/strings.de.js), so the URL
// is the source of truth for content language. This module: redirects
// German-browser visitors from / to /de/ (honouring an explicit choice),
// renders the EN | DE nav toggle as real links, and applies the dictionary
// client-side as a dev fallback (?lang=de, where /de/ doesn't exist yet).

import { TITLE_DE, DESC_DE, DE, DE_ATTRS } from './strings.de.js';

const query = new URLSearchParams(location.search).get('lang');
const pathLang = /^\/de(\/|$)/.test(location.pathname) ? 'de' : 'en';
export const currentLang = query === 'de' || query === 'en' ? query : pathLang;

const EN_PATH = '/';
const DE_PATH = '/de/';

function readStored() {
  let stored = null;
  try {
    stored = localStorage.getItem('ocur-lang');
  } catch {
    /* storage blocked */
  }
  if (stored !== 'de' && stored !== 'en') {
    stored = (document.cookie.match(/(?:^|;\s*)ocur-lang=(de|en)/) || [])[1] || null;
  }
  return stored;
}

function writeStored(lang) {
  try {
    localStorage.setItem('ocur-lang', lang);
  } catch {
    /* ignore */
  }
  document.cookie = `ocur-lang=${lang};path=/;max-age=31536000;SameSite=Lax`;
}

// Explicit choice first, browser language second; an explicit /de/
// visit is respected unless the visitor chose English before.
export function initLangRouting() {
  if (query) return; // dev override, never redirect
  const stored = readStored();
  const browserDe = (navigator.languages || [navigator.language || 'en']).some((l) => /^de/i.test(l));
  if (pathLang === 'en' && (stored === 'de' || (!stored && browserDe))) {
    location.replace(DE_PATH + location.hash);
  } else if (pathLang === 'de' && stored === 'en') {
    location.replace(EN_PATH + location.hash);
  }
}

// Dev fallback: on the plain dev server /de/ doesn't exist, so
// ?lang=de applies the dictionary in place. On the prerendered page the
// html[lang] guard makes this a no-op.
export function applyLang() {
  if (currentLang !== 'de' || document.documentElement.lang === 'de') return;
  document.documentElement.lang = 'de';
  document.title = TITLE_DE;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', DESC_DE);

  DE.forEach(([sel, value]) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      const html = Array.isArray(value) ? value[i] : value;
      if (html != null) el.innerHTML = html;
    });
  });
  DE_ATTRS.forEach(([sel, attr, value]) => {
    document.querySelectorAll(sel).forEach((el) => el.setAttribute(attr, value));
  });
}

// EN | DE switch in the nav — real links so the choice is shareable;
// clicking also records the choice so it sticks on future visits.
export function initLangToggle() {
  const nav = document.querySelector('.g-nav');
  if (!nav) return;
  const box = document.createElement('div');
  box.className = 'g-lang';
  box.setAttribute('role', 'group');
  box.setAttribute('aria-label', currentLang === 'de' ? 'Sprache' : 'Language');
  [
    ['en', EN_PATH],
    ['de', DE_PATH],
  ].forEach(([lang, href]) => {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = lang.toUpperCase();
    a.setAttribute('lang', lang);
    if (lang === currentLang) {
      a.classList.add('on');
      a.setAttribute('aria-current', 'true');
    }
    a.addEventListener('click', () => writeStored(lang));
    box.appendChild(a);
  });
  nav.insertBefore(box, nav.querySelector('.g-btn-sm'));
}
