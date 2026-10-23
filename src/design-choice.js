export const DESIGN_KEY = 'ocur-site-design';
export function resolveDesign(search, stored) {
  const requested = new URLSearchParams(search).get('design');
  return [requested, stored].find((value) => value === 'classic' || value === 'cloud') || 'classic';
}
export function designUrl(href, design) {
  const url = new URL(href);
  url.searchParams.set('design', design);
  return url.href;
}
