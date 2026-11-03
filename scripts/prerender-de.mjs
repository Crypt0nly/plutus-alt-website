// Build step: bake the German pages. For every marketing page (src/site.js
// PAGES) it reads the built English page, applies the dictionary from
// src/strings.de.js with cheerio, fixes the lang/title/meta/canonical, points
// internal links at their German twins, and writes /de, /de/product … .
// Runs after `vite build` (see package.json); build-discovery.mjs then draws
// the German nav, menu and footer. The hreflang alternates are identical on
// both languages and live statically in each page.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { load } from 'cheerio';
import { OG_TITLE_DE, TWITTER_DESC_DE, OG_ALT_DE, DE, DE_ATTRS, PAGES_DE } from '../src/strings.de.js';
import { PAGES, localize } from '../src/site.js';

// keep in step with the ?v= on the pages' og:image — bump both together
const OG_IMAGE_DE = 'https://ocur.ai/og-de.jpg?v=3';
const file = (path) => (path === '/' ? 'index.html' : `${path.slice(1)}/index.html`);

for (const path of PAGES) {
  const $ = load(readFileSync(`dist/${file(path)}`, 'utf8'));
  const dePath = path === '/' ? '/de' : `/de${path}`;
  const url = `https://ocur.ai${dePath}`;
  const { title, description } = PAGES_DE[path];
  const home = path === '/';

  $('html').attr('lang', 'de');
  $('title').text(title);
  $('meta[name="description"]').attr('content', description);
  $('meta[property="og:title"]').attr('content', home ? OG_TITLE_DE : title);
  $('meta[property="og:description"]').attr('content', description);
  $('link[rel="canonical"]').attr('href', url);

  // the German link preview: its own card art, URL and locale
  $('meta[property="og:url"]').attr('content', url);
  $('meta[property="og:locale"]').attr('content', 'de_DE');
  $('meta[property="og:locale:alternate"]').attr('content', 'en_US');
  $('meta[property="og:image"]').attr('content', OG_IMAGE_DE);
  $('meta[property="og:image:alt"]').attr('content', OG_ALT_DE);
  $('meta[name="twitter:title"]').attr('content', home ? OG_TITLE_DE : title);
  $('meta[name="twitter:description"]').attr('content', home ? TWITTER_DESC_DE : description);
  $('meta[name="twitter:image"]').attr('content', OG_IMAGE_DE);
  $('meta[name="twitter:image:alt"]').attr('content', OG_ALT_DE);

  DE.forEach(([sel, value]) => {
    $(sel).each((i, el) => {
      const html = Array.isArray(value) ? value[i] : value;
      if (html != null) $(el).html(html);
    });
  });
  DE_ATTRS.forEach(([sel, attr, value]) => {
    $(sel).attr(attr, value);
  });

  // German readers stay in German when a link crosses pages: /pricing →
  // /de/pricing, /privacy → /de/privacy. Pages without a twin keep theirs.
  $('a[href^="/"]').each((_, el) => {
    $(el).attr('href', localize($(el).attr('href'), 'de'));
  });

  const out = `dist/${file(dePath)}`;
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, $.html());
}
console.log(`✓ prerendered ${PAGES.length} German pages (${PAGES.map((path) => (path === '/' ? '/de' : `/de${path}`)).join(', ')})`);
