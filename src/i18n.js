// Language plumbing. The German page is a real prerendered URL (/de/,
// built by scripts/prerender-de.mjs from src/strings.de.js), so the URL
// is the source of truth for content language. This module only:
//   1. redirects first-time German-browser visitors from / to /de/
//      (and honours an explicit EN/DE choice stored in localStorage),
//   2. renders the EN | DE nav toggle as real links (crawlable),
//   3. provides STRINGS for the bits main.js renders dynamically,
//   4. applies the dictionary client-side only as a dev fallback
//      (?lang=de on the dev server, where /de/ doesn't exist yet).

import { STRINGS, TITLE_DE, DESC_DE, DE, DE_ATTRS } from './strings.de.js';

export { STRINGS };

const query = new URLSearchParams(location.search).get('lang');
const pathLang = /^\/de(\/|$)/.test(location.pathname) ? 'de' : 'en';
export const currentLang = query === 'de' || query === 'en' ? query : pathLang;

// The choice is stored twice: localStorage for the client fallback and
// a cookie for Vercel's edge redirects (vercel.json), which can't see
// localStorage.
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

// Send people to the page in their language — explicit choice first,
// browser language second, and an explicit URL visit (e.g. a shared
// /de/ link) is respected unless the visitor chose otherwise before.
// On Vercel the same rules run at the edge (vercel.json) before the
// page even loads; this client version covers dev and other hosts.
export function initLangRouting() {
  if (query) return; // dev override, never redirect
  const stored = readStored();
  const browserDe = (navigator.languages || [navigator.language || 'en']).some((l) => /^de/i.test(l));
  if (pathLang === 'en' && (stored === 'de' || (!stored && browserDe))) {
    location.replace('/de/' + location.hash);
  } else if (pathLang === 'de' && stored === 'en') {
    location.replace('/' + location.hash);
  }
}

// Dev fallback: on the plain dev server /de/ doesn't exist, so ?lang=de
// applies the dictionary in place. On the prerendered /de/ page the
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

// EN | DE switch in the nav — real links so crawlers discover /de/;
// clicking also records the choice so it sticks on future visits.
export function initLangToggle() {
  const nav = document.querySelector('.mg-nav');
  if (!nav) return;
  const box = document.createElement('div');
  box.className = 'mg-lang';
  box.setAttribute('role', 'group');
  box.setAttribute('aria-label', currentLang === 'de' ? 'Sprache' : 'Language');
  [
    ['en', '/'],
    ['de', '/de/'],
  ].forEach(([lang, href]) => {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = lang.toUpperCase();
    a.setAttribute('lang', lang);
    a.setAttribute('hreflang', lang);
    if (lang === currentLang) {
      a.classList.add('on');
      a.setAttribute('aria-current', 'true');
    }
    a.addEventListener('click', () => {
      writeStored(lang);
    });
    box.appendChild(a);
  });
  nav.insertBefore(box, nav.querySelector('.mg-btn-small'));
}
