// The site map: the pages every visitor can reach from the navigation, and
// the addresses the chrome links to. Pure data, shared by the build
// (scripts/lib/chrome.mjs renders the nav, phone menu and footer from it)
// and the browser (language routing in src/i18n.js).

export const APP = 'https://app.ocur.ai';
export const SIGN_IN = `${APP}/?auth=sign-in`;
export const SIGN_UP = `${APP}/?auth=sign-up`;
export const DOWNLOAD = `${APP}/download`;
// The founder's booking page (Ocur's own calendar feature on the app
// backend). Every data-book link carries this href.
export const BOOK_URL = 'https://api.ocur.ai/api/book/gJM0Hx8-5SY';
export const X_URL = 'https://x.com/ocur_ai';

// The primary destinations, in navigation order. Each has an English and a
// German twin (/de + path); `also` lists the reading pages that belong under
// the same destination, so the nav still shows where you are.
export const NAV = [
  { path: '/product', en: 'Product', de: 'Produkt', also: ['/integrations', '/use-cases/'] },
  { path: '/pricing', en: 'Pricing', de: 'Preise' },
  { path: '/faq', en: 'FAQ', de: 'FAQ' },
];

// The contact page: the "Talk to us" form (#talk) beside the booking page.
// Reached from the phone menu, the footer, pricing and the FAQ.
export const CONTACT = { path: '/contact', en: 'Contact', de: 'Kontakt' };

// The marketing pages built from HTML entries (and prerendered in German).
export const PAGES = ['/', ...NAV.map((item) => item.path), CONTACT.path];

// Every page with a German twin at /de + path. Used to keep German readers
// in German when a link crosses pages.
export const TRANSLATED = [
  ...PAGES,
  '/integrations',
  '/use-cases/invoice-follow-up',
  '/use-cases/business-phone',
  '/privacy',
  '/terms',
  '/data',
];

// The form on the contact page.
export const TALK = '/contact#talk';

const bare = (path) => (path === '/' ? '/' : path.replace(/\/+$/, ''));

// /pricing → /de/pricing, / → /de; anything without a twin stays as it is.
export function localize(href, lang) {
  if (lang !== 'de' || !href.startsWith('/') || href.startsWith('//') || /^\/de(\/|$|[?#])/.test(href)) return href;
  const url = new URL(href, 'https://ocur.ai');
  const path = bare(url.pathname);
  if (!TRANSLATED.includes(path)) return href;
  return `${path === '/' ? '/de' : `/de${path}`}${url.search}${url.hash}`;
}

// The English path of any page: /de/pricing → /pricing.
export function englishPath(path) {
  const clean = bare(path);
  if (clean === '/de') return '/';
  return clean.startsWith('/de/') ? clean.slice(3) : clean;
}

// The nav item a path belongs to, if any.
export function navItemFor(path) {
  const en = englishPath(path);
  return NAV.find((item) => item.path === en || item.also?.some((prefix) => (prefix.endsWith('/') ? en.startsWith(prefix) : en === prefix)));
}
