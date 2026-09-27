// The founding cohort — every promise the page makes about it, in one place.
//
// Read by vite.config.js, which fills the {{COHORT_*}} tokens in index.html
// (dev server and build alike); by the German dictionary (src/strings.de.js,
// and through it the /de/ prerender); and by main.js for the form's status
// lines. Pure data, no browser APIs, so Node can import it too.
//
// Each value here is a public promise to a visitor: change it deliberately,
// here, and both languages follow. The answer time is also in the app
// backend's acknowledgement mail (plutus-cloud,
// backend/app/services/lead_email_service.py → APPLICATION_ANSWER) — change
// both together.

// How many companies the cohort takes.
export const SEATS = 50;

// The founding price: this much off whichever business plan a founding
// company picks, for this many months.
export const DISCOUNT_PERCENT = 30;
export const DISCOUNT_MONTHS = 12;

// The end of the last day to apply (Berlin time). Once it has passed, the
// page hides every line that names the date (the inline script in
// index.html's <head> sets html.cohort-closed) rather than promise a
// deadline that's gone — and the build warns until a new one is set here.
export const CLOSES_AT = '2026-10-30T23:59:59+01:00';

// When an applicant hears back.
export const ANSWER = {
  en: 'within two business days',
  de: 'innerhalb von zwei Werktagen',
};

const closesAt = new Date(CLOSES_AT);
const day = (locale, month) =>
  new Intl.DateTimeFormat(locale, { timeZone: 'Europe/Berlin', month, day: 'numeric' }).format(closesAt);

// The last day to apply, as each page writes it: "October 30" / "Oct 30",
// "30. Oktober" / "30. Okt.".
export const CLOSES = {
  en: day('en-US', 'long'),
  enShort: day('en-US', 'short'),
  de: day('de-DE', 'long'),
  deShort: day('de-DE', 'short'),
};

// What index.html's {{COHORT_*}} tokens become on the English page.
export const COHORT_TOKENS = {
  COHORT_SEATS: String(SEATS),
  COHORT_DISCOUNT: String(DISCOUNT_PERCENT),
  COHORT_MONTHS: String(DISCOUNT_MONTHS),
  COHORT_CLOSES: CLOSES.en,
  COHORT_CLOSES_SHORT: CLOSES.enShort,
  COHORT_CLOSES_AT: CLOSES_AT,
  COHORT_ANSWER: ANSWER.en,
};
