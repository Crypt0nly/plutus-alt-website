// PostHog product analytics, lazy-loaded so it never weighs down the main
// bundle (the import is split into its own chunk that only fetches when a
// key is present). Configured via Vite env vars — set VITE_POSTHOG_KEY
// (and optionally VITE_POSTHOG_HOST) in .env locally and in the Vercel
// project. With no key it's a no-op, so dev and previews stay clean.

const KEY = import.meta.env.VITE_POSTHOG_KEY;
const HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://eu.i.posthog.com';

// Once loaded, the live posthog instance; until then, events are queued so a
// capture fired during page load (e.g. the /be-ai funnel) isn't dropped.
let _posthog = null;
const _queue = [];

export function initAnalytics() {
  if (!KEY) return;
  import('posthog-js').then(({ default: posthog }) => {
    posthog.init(KEY, {
      api_host: HOST,
      defaults: '2025-05-24',
      // cookieless / low-friction: keep all state in memory, so nothing is
      // written to the visitor's device (no cookies, no localStorage) — no
      // consent banner needed. Trade-off: each fresh page load is a new
      // anonymous session, so unique-visitor counts skew high.
      persistence: 'memory',
      // and only spin up a person profile once someone is identified, so
      // anonymous visits stay light
      person_profiles: 'identified_only',
    });
    _posthog = posthog;
    _queue.splice(0).forEach(([event, props]) => posthog.capture(event, props));
  });
}

// Fire a product-analytics event. No-op when no key is configured (dev /
// previews stay clean); queues until posthog finishes loading.
export function track(event, props) {
  if (!KEY) return;
  if (_posthog) _posthog.capture(event, props);
  else _queue.push([event, props]);
}
