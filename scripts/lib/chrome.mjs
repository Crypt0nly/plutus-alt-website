// The site chrome — the floating nav, the phone menu and the footer — drawn
// once from src/site.js for every page and language. enrichPage() in
// discovery.mjs places it on the dev server, in the Vite build and again
// after the German prerender, so a page never carries a hand-written copy
// that could drift from the others. The /be-ai game keeps its own nav
// (header[data-nav="own"]).

import { NAV, CONTACT, TALK, SIGN_IN, SIGN_UP, DOWNLOAD, BOOK_URL, X_URL, localize, navItemFor } from '../../src/site.js';
import { contentPages } from '../../content/pages.js';

const T = {
  en: {
    primary: 'Primary',
    menu: 'Menu',
    home: 'Home',
    login: 'Log in',
    free: 'Start free',
    book: 'Book a demo',
    language: 'Language',
    settings: 'Display and language',
    footer: 'Footer',
    tag: 'Say it — or don’t. It happens. You stay in charge.',
    org: 'a product of OcurAI, Inc.',
    x: 'Ocur on X',
    cols: ['Product', 'Get started', 'Trust'],
    overview: 'Overview',
    download: 'Download desktop app',
    game: 'Be the AI — the game',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    data: 'Where your data goes',
    contact: 'Contact',
  },
  de: {
    primary: 'Hauptnavigation',
    menu: 'Menü',
    home: 'Startseite',
    login: 'Anmelden',
    free: 'Kostenlos starten',
    book: 'Demo buchen',
    language: 'Sprache',
    settings: 'Darstellung und Sprache',
    footer: 'Weiterführende Links',
    tag: 'Sag es — oder nicht. Es passiert. Du behältst die Kontrolle.',
    org: 'ein Produkt der OcurAI, Inc.',
    x: 'Ocur auf X',
    cols: ['Produkt', 'Loslegen', 'Vertrauen'],
    overview: 'Überblick',
    download: 'Desktop-App herunterladen',
    game: 'Sei die KI — das Spiel',
    privacy: 'Datenschutz',
    terms: 'AGB',
    data: 'Wohin deine Daten gehen',
    contact: 'Kontakt',
  },
};

const escape = (text) => String(text).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const home = (lang) => (lang === 'de' ? '/de' : '/');

// The current page wears the lens: blue text on a light pill. The pill is
// its own element so a cross-page view transition can slide it.
function navLinks(lang, path) {
  const current = navItemFor(path);
  return NAV.map((item) => {
    const here = item === current;
    return `<a href="${localize(item.path, lang)}"${here ? ' aria-current="page"' : ''}>${here ? '<span class="g-here" aria-hidden="true"></span>' : ''}<span>${escape(item[lang])}</span></a>`;
  }).join('');
}

export function renderNav(lang, path) {
  const t = T[lang];
  return `<a class="g-brand" href="${home(lang)}"><img src="/logo.svg" alt="" width="24" height="20" /> Ocur</a>
      <nav class="g-links" aria-label="${t.primary}">${navLinks(lang, path)}</nav>
      <a class="g-login" href="${SIGN_IN}">${t.login}</a>
      <a class="g-btn g-btn-sm g-btn-glass g-nav-book" href="${BOOK_URL}" target="_blank" rel="noopener" data-book="nav">${t.book}</a>
      <a class="g-btn g-btn-sm g-nav-free" href="${SIGN_UP}">${t.free}</a>
      <button class="g-burger" type="button" aria-label="${t.menu}" aria-expanded="false" aria-controls="g-menu"><span aria-hidden="true"></span><span aria-hidden="true"></span></button>`;
}

export function languageLinks(en, de, lang) {
  const t = T[lang];
  return `<div class="g-lang" role="group" aria-label="${t.language}">${[['en', en], ['de', de]].map(([code, url]) =>
    `<a href="${escape(new URL(url, 'https://ocur.ai').pathname)}" lang="${code}" hreflang="${code}"${code === lang ? ' class="on" aria-current="true"' : ''}>${code.toUpperCase()}</a>`).join('')}</div>`;
}

// Language and theme: secondary settings, so they live in the footer and the
// phone menu rather than the nav. src/theme.js adds the theme button here.
function prefs(lang, alternates) {
  const t = T[lang];
  return `<div class="g-prefs" role="group" aria-label="${t.settings}">${alternates ? languageLinks(alternates.en, alternates.de, lang) : ''}</div>`;
}

export function renderMenu(lang, path, alternates) {
  const t = T[lang];
  const current = navItemFor(path);
  const isHome = path === home(lang);
  const isContact = path === localize(CONTACT.path, lang);
  const links = [`<a href="${home(lang)}"${isHome ? ' aria-current="page"' : ''}>${t.home}</a>`,
    ...NAV.map((item) => `<a href="${localize(item.path, lang)}"${item === current ? ' aria-current="page"' : ''}>${escape(item[lang])}</a>`),
    `<a href="${localize(CONTACT.path, lang)}"${isContact ? ' aria-current="page"' : ''}>${CONTACT[lang]}</a>`].join('');
  return `<div class="g-menu" id="g-menu" hidden>
      <nav class="g-menu-links" aria-label="${t.menu}">${links}</nav>
      <div class="g-menu-ctas">
        <a class="g-btn g-menu-free" href="${SIGN_UP}">${t.free}</a>
        <a class="g-btn g-btn-glass" href="${SIGN_IN}">${t.login}</a>
        <a class="g-btn g-btn-glass" href="${BOOK_URL}" target="_blank" rel="noopener" data-book="menu">${t.book}</a>
      </div>
      <div class="g-menu-foot">${prefs(lang, alternates)}</div>
    </div>`;
}

export function renderFooter(lang, alternates) {
  const t = T[lang];
  const de = lang === 'de';
  const guides = contentPages.map((page) => [page.path, page[lang].label]);
  const col = (title, links) => `<nav class="g-foot-col" aria-label="${escape(title)}"><p class="g-foot-h">${escape(title)}</p>${links.join('')}</nav>`;
  const link = (href, label, extra = '') => `<a href="${href.startsWith('/') ? localize(href, lang) : href}"${extra}>${escape(label)}</a>`;
  return `<div class="g-wrap g-foot-in">
        <div class="g-foot-top">
          <a class="g-foot-brand" href="${home(lang)}"><img src="/logo.svg" alt="" width="22" height="19" /> Ocur</a>
          <p class="g-foot-tag">${t.tag}</p>
        </div>
        <div class="g-foot-cols">
          ${col(t.cols[0], [link('/product', t.overview), ...guides.map(([href, label]) => link(href, label)), link(DOWNLOAD, t.download, ' data-download="footer"')])}
          ${col(t.cols[1], [link('/pricing', NAV[1][lang]), link(BOOK_URL, t.book, ' target="_blank" rel="noopener" data-book="footer"'), link(TALK, t.contact), link('/faq', NAV[2][lang]), link('/be-ai', t.game)])}
          ${col(t.cols[2], [link('/privacy', t.privacy), link('/terms', t.terms), link('/data', t.data), ...(de ? [link('/de/impressum', 'Impressum')] : [])])}
        </div>
        <div class="g-foot-base">
          <span class="g-foot-copy">Ocur © <span data-year>2026</span> · <span class="g-foot-org">${t.org}</span></span>
          ${prefs(lang, alternates)}
          <a class="g-social g-social-x" href="${X_URL}" target="_blank" rel="noopener" aria-label="${t.x}" title="${t.x}"><svg viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" fill="currentColor"/></svg></a>
        </div>
      </div>`;
}

export const footerLabel = (lang) => T[lang].footer;
