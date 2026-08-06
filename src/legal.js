// Ocur — entry for the legal pages (/privacy, /terms, /de/privacy,
// /de/terms). Deliberately light: the same theme + language chrome as the
// marketing page, but none of the scroll choreography (no GSAP, no Lenis).
// The policy has to render fast, read fine with JS off, and stay reachable
// for Google's OAuth reviewers — so nothing here is load-bearing for the
// content.

import './style.css';
import './legal.css';
import { initLangToggle } from './i18n.js';
import { initThemeToggle } from './theme.js';
import { initAnalytics } from './analytics.js';

initAnalytics();
initThemeToggle();

// The EN | DE switch points at *this* page's translation, not the home
// page — the hreflang alternates in <head> already carry both URLs, so the
// markup stays the single source of truth. A page with no translation (the
// German-only Impressum) has no alternates and gets no switch, rather than a
// pair of links to nowhere: note that new URL(undefined, origin) happily
// resolves to /undefined, so the empty case has to be caught before that.
const alt = (lang) => document.querySelector(`link[rel="alternate"][hreflang="${lang}"]`)?.getAttribute('href');
const path = (href) => {
  if (!href) return null;
  try {
    return new URL(href, location.origin).pathname;
  } catch {
    return null;
  }
};
const en = path(alt('en'));
const de = path(alt('de'));
if (en && de) initLangToggle({ en, de });

const year = document.getElementById('g-year');
if (year) year.textContent = String(new Date().getFullYear());
