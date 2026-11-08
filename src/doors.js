// The ways into sign-up the site counts: Ocur's own (app.ocur.ai/?auth=sign-up,
// with or without a plan) and oWorlds' (app.ocur.ai/worlds?auth=sign-up,
// optionally with the Drop the visitor picked). Kept in one place so the
// analytics (chrome.js) and the X Ads conversion (xads.js) agree.
export const SIGNUP_PREFIXES = ['https://app.ocur.ai/?auth=sign-up', 'https://app.ocur.ai/worlds?auth=sign-up'];

export const SIGNUP_LINKS = SIGNUP_PREFIXES.map((prefix) => `a[href^="${prefix}"]`).join(', ');

export function isSignupHref(href) {
  return SIGNUP_PREFIXES.some((prefix) => String(href || '').startsWith(prefix));
}

/** Point the oWorlds sign-up door at one Drop, keeping campaign tags already on it. */
export function setWorldDrop(link, id, name) {
  if (!/^[a-z]{2,20}$/.test(id || '')) return;
  try {
    const url = new URL(link.href);
    url.searchParams.set('drop', id);
    link.href = url.toString();
  } catch {
    return;
  }
  const label = link.querySelector('[data-world-drop-name]');
  if (label && name) label.textContent = name;
}
