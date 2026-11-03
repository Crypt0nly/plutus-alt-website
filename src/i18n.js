// Language plumbing. Every marketing page has a real prerendered German
// twin (/de, /de/pricing …, baked by scripts/prerender-de.mjs from
// src/strings.de.js), so the URL is the source of truth for content
// language. This module: sends German-browser visitors to the twin of the
// page they opened (honouring an explicit choice), enhances the static
// EN | DE links, and applies the dictionary client-side as a dev fallback
// (?lang=de, where /de/… doesn't exist yet).

import { TITLE_DE, DESC_DE, DE, DE_ATTRS, PAGES_DE } from './strings.de.js';
import { PAGES, englishPath } from './site.js';

const query = new URLSearchParams(location.search).get('lang');
const pathLang = /^\/de(\/|$)/.test(location.pathname) ? 'de' : 'en';
export const currentLang = query === 'de' || query === 'en' ? query : pathLang;

// This page in each language: /pricing ↔ /de/pricing, / ↔ /de.
const HERE = englishPath(location.pathname);
const EN_PATH = HERE;
const DE_PATH = HERE === '/' ? '/de' : `/de${HERE}`;

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
  if (!PAGES.includes(HERE)) return;
  if (pathLang === 'en' && (stored === 'de' || (!stored && browserDe))) {
    location.replace(DE_PATH + location.search + location.hash);
  } else if (pathLang === 'de' && stored === 'en') {
    location.replace(EN_PATH + location.search + location.hash);
  }
}

// Dev fallback: on the plain dev server /de/ doesn't exist, so
// ?lang=de applies the dictionary in place. On the prerendered page the
// html[lang] guard makes this a no-op.
export function applyLang() {
  if (currentLang !== 'de' || document.documentElement.lang === 'de') return;
  document.documentElement.lang = 'de';
  const meta = PAGES_DE[HERE] || { title: TITLE_DE, description: DESC_DE };
  document.title = meta.title;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', meta.description);

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

// EN | DE switch — real links (drawn at build time into the footer and the
// phone menu, scripts/lib/chrome.mjs) so the choice is shareable; clicking
// also records the choice so it sticks on future visits. Reading pages
// pass their own pair of URLs; a settings group without a switch gets one.
export function initLangToggle(paths) {
  const { en = EN_PATH, de = DE_PATH } = paths || {};
  const build = () => {
    const box = document.createElement('div');
    box.className = 'g-lang';
    box.setAttribute('role', 'group');
    [
      ['en', en],
      ['de', de],
    ].forEach(([lang, href]) => {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = lang.toUpperCase();
      a.setAttribute('lang', lang);
      a.setAttribute('hreflang', lang);
      box.appendChild(a);
    });
    return box;
  };
  if (paths || PAGES.includes(HERE)) {
    document.querySelectorAll('.g-prefs').forEach((group) => {
      if (!group.querySelector('.g-lang')) group.prepend(build());
    });
  }
  document.querySelectorAll('.g-lang').forEach((box) => {
    box.setAttribute('aria-label', currentLang === 'de' ? 'Sprache' : 'Language');
    box.querySelectorAll('a[lang]').forEach((a) => {
      const lang = a.getAttribute('lang');
      a.classList.toggle('on', lang === currentLang);
      if (lang === currentLang) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
      a.addEventListener('click', () => writeStored(lang));
    });
  });
}
