// Campaign tags (utm_source, utm_medium, …) from the landing URL ride along
// on every link into the app, so a sign-up keeps the campaign that brought
// the visitor — not only X ad clicks (xads.js carries their twclid). The
// tags are kept for this tab only (sessionStorage), so they survive the walk
// from the landing page to pricing but not the visit itself. A newer landing
// with tags replaces the old ones; a link that already names a tag keeps it.

import { APP_LINKS } from './doors.js';

const KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
const STORE = 'ocur-utm';

export function readCampaign() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORE) || 'null');
    return saved && typeof saved === 'object' ? saved : {};
  } catch {
    return {};
  }
}

export function initAttribution(root = document) {
  try {
    const params = new URLSearchParams(location.search);
    const found = {};
    for (const key of KEYS) {
      const value = params.get(key);
      if (value) found[key] = value.slice(0, 200);
    }
    if (Object.keys(found).length) sessionStorage.setItem(STORE, JSON.stringify(found));
  } catch {
    /* storage can be blocked; the links simply stay as they are */
  }

  const campaign = readCampaign();
  if (!Object.keys(campaign).length) return;
  root.querySelectorAll(APP_LINKS).forEach((a) => {
    try {
      const url = new URL(a.href);
      for (const [key, value] of Object.entries(campaign)) {
        if (!url.searchParams.has(key)) url.searchParams.set(key, value);
      }
      a.href = url.toString();
    } catch {
      /* a link we can't parse keeps its href */
    }
  });
}
