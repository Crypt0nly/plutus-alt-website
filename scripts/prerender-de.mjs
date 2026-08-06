// Build step: bake the German page. Reads the built dist/index.html,
// applies the dictionary from src/strings.de.js with cheerio, fixes the
// lang/title/meta/canonical, and writes dist/de/index.html. Runs after
// `vite build` (see package.json). The hreflang alternates are identical
// on both pages and live statically in index.html.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { load } from 'cheerio';
import {
  TITLE_DE,
  OG_TITLE_DE,
  DESC_DE,
  TWITTER_DESC_DE,
  OG_ALT_DE,
  DE,
  DE_ATTRS,
} from '../src/strings.de.js';

const $ = load(readFileSync('dist/index.html', 'utf8'));

// keep in step with the ?v= on index.html's og:image — bump both together
const OG_IMAGE_DE = 'https://ocur.ai/og-de.jpg?v=1';

$('html').attr('lang', 'de');
$('title').text(TITLE_DE);
$('meta[name="description"]').attr('content', DESC_DE);
$('meta[property="og:title"]').attr('content', OG_TITLE_DE);
$('meta[property="og:description"]').attr('content', DESC_DE);
$('link[rel="canonical"]').attr('href', 'https://ocur.ai/de/');

// the German link preview: its own card art, URL and locale
$('meta[property="og:url"]').attr('content', 'https://ocur.ai/de/');
$('meta[property="og:locale"]').attr('content', 'de_DE');
$('meta[property="og:locale:alternate"]').attr('content', 'en_US');
$('meta[property="og:image"]').attr('content', OG_IMAGE_DE);
$('meta[property="og:image:alt"]').attr('content', OG_ALT_DE);
$('meta[name="twitter:title"]').attr('content', OG_TITLE_DE);
$('meta[name="twitter:description"]').attr('content', TWITTER_DESC_DE);
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

mkdirSync('dist/de', { recursive: true });
writeFileSync('dist/de/index.html', $.html());
console.log('✓ prerendered dist/de/index.html');
