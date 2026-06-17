// PostHog product analytics, lazy-loaded so it never weighs down the main
// bundle (the import is split into its own chunk that only fetches when a
// key is present). Configured via Vite env vars — set VITE_POSTHOG_KEY
// (and optionally VITE_POSTHOG_HOST) in .env locally and in the Vercel
// project. With no key it's a no-op, so dev and previews stay clean.

const KEY = import.meta.env.VITE_POSTHOG_KEY;
const HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';

export function initAnalytics() {
  if (!KEY) return;
  import('posthog-js').then(({ default: posthog }) => {
    posthog.init(KEY, {
      api_host: HOST,
      defaults: '2025-05-24',
      // marketing site: only spin up a person profile once someone is
      // identified, so anonymous visits stay light and privacy-friendly
      person_profiles: 'identified_only',
    });
  });
}
