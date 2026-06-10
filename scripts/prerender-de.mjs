// Build step: bake the German page. Reads the built dist/index.html,
// applies the dictionary from src/strings.de.js with cheerio, fixes the
// canonical URL, and writes dist/de/index.html. Runs after `vite build`
// (see package.json). The hreflang alternates are identical on both
// pages and live statically in index.html.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { load } from 'cheerio';
import { TITLE_DE, OG_TITLE_DE, DESC_DE, DE, DE_ATTRS } from '../src/strings.de.js';

const $ = load(readFileSync('dist/index.html', 'utf8'));

$('html').attr('lang', 'de');
$('title').text(TITLE_DE);
$('meta[name="description"]').attr('content', DESC_DE);
$('meta[property="og:title"]').attr('content', OG_TITLE_DE);
$('meta[property="og:description"]').attr('content', DESC_DE);
$('link[rel="canonical"]').attr('href', 'https://ocur.ai/de/');

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
