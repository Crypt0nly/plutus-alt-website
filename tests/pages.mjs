// The marketing pages as the build renders them: partials filled and the
// shared nav, menu and footer drawn (enrichPage).
import { readFileSync } from 'node:fs';
import { load } from 'cheerio';
import { fillPartials } from '../scripts/lib/partials.mjs';
import { enrichPage } from '../scripts/lib/discovery.mjs';
import { PAGES } from '../src/site.js';
import { DE, DE_ATTRS } from '../src/strings.de.js';

export const fileFor = (path) => (path === '/' ? 'index.html' : `${path.slice(1)}/index.html`);

export function pageHtml(path) {
  const source = readFileSync(new URL(`../${fileFor(path)}`, import.meta.url), 'utf8');
  return enrichPage(fillPartials(source));
}

export const english = (path = '/') => load(pageHtml(path));

export function german(path = '/') {
  const $ = load(pageHtml(path));
  for (const [selector, value] of DE) {
    $(selector).each((index, element) => {
      const translated = Array.isArray(value) ? value[index] : value;
      if (translated != null) $(element).html(translated);
    });
  }
  for (const [selector, attribute, value] of DE_ATTRS) $(selector).attr(attribute, value);
  return $;
}

export { PAGES };
