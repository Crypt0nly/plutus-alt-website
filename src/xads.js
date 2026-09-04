// X Ads conversion wiring on top of the base pixel in each page's <head>.
//
// Three jobs:
//  1. Capture the twclid X appends to ad-click landing URLs and keep it for
//     the 30-day click window, so later conversions can be attributed even
//     when the pixel's own cookies are blocked.
//  2. Decorate every app.ocur.ai link with that twclid — the app backend can
//     then report the real signup conversion server-side with it.
//  3. On CTA click, fire the conversion both ways with one conversion_id so
//     X deduplicates: through the pixel (twq('event'), works while uwt.js
//     isn't ad-blocked) and through our serverless Conversions API relay
//     (api/x-conversions.js, survives ad blockers). Two events ride this
//     path: cta_click (Start free → app.ocur.ai) and book_demo (any
//     data-book link → the founder's booking page).
//
// Event ids come from X Events Manager. The VITE_X_EVENT_ID_* vars gate the
// browser leg at build time (event ids are public by design — they ship in
// page source on every site that uses them); the relay is gated by its own
// server-side env and just no-ops with 501 until configured.

const CTA_EVENT_ID = import.meta.env.VITE_X_EVENT_ID_CTA_CLICK;
const BOOK_EVENT_ID = import.meta.env.VITE_X_EVENT_ID_BOOK_DEMO;
const TWCLID_KEY = 'ocur-twclid';
const CLICK_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

function readTwclid() {
  try {
    const raw = localStorage.getItem(TWCLID_KEY);
    if (!raw) return null;
    const { v, t } = JSON.parse(raw);
    if (!v || Date.now() - t > CLICK_WINDOW_MS) return null;
    return v;
  } catch {
    return null;
  }
}

function uuid() {
  try {
    if (crypto.randomUUID) return crypto.randomUUID();
    const b = crypto.getRandomValues(new Uint8Array(16));
    return [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
  } catch {
    return String(Date.now()) + Math.random().toString(16).slice(2);
  }
}

export function trackXConversion(eventKey, eventId) {
  const conversionId = uuid();
  // browser leg — the base pixel queues events even before uwt.js finishes
  // loading, so this is safe to call at any time
  if (eventId && window.twq) {
    window.twq('event', eventId, { conversion_id: conversionId });
  }
  // server leg — sendBeacon so the POST survives the navigation the CTA
  // click is about to trigger
  const payload = JSON.stringify({
    event: eventKey,
    conversion_id: conversionId,
    twclid: readTwclid() || undefined,
    event_source_url: location.href,
  });
  try {
    const blob = new Blob([payload], { type: 'application/json' });
    if (!(navigator.sendBeacon && navigator.sendBeacon('/api/x-conversions', blob))) {
      fetch('/api/x-conversions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    /* tracking must never break the click */
  }
}

export function initXAds() {
  // 1. capture twclid from an ad-click landing
  try {
    const twclid = new URLSearchParams(location.search).get('twclid');
    if (twclid) localStorage.setItem(TWCLID_KEY, JSON.stringify({ v: twclid, t: Date.now() }));
  } catch {}

  // 2 + 3. app links: pass the twclid through, count the click as a conversion
  const twclid = readTwclid();
  document.querySelectorAll('a[href^="https://app.ocur.ai"]').forEach((a) => {
    if (twclid) {
      try {
        const u = new URL(a.href);
        u.searchParams.set('twclid', twclid);
        a.href = u.toString();
      } catch {}
    }
    a.addEventListener('click', () => trackXConversion('cta_click', CTA_EVENT_ID));
  });

  // demo bookings are the second conversion. The booking page lives on the
  // app backend, not app.ocur.ai, so the link gets no twclid — the relay
  // still attributes through the stored twclid or the ip/user-agent pair.
  document.querySelectorAll('a[data-book]').forEach((a) => {
    a.addEventListener('click', () => trackXConversion('book_demo', BOOK_EVENT_ID));
  });
}
