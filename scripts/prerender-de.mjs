// Build step: bake the German pages. Reads the built dist HTML, applies
// the dictionaries with cheerio, fixes lang/title/meta, and writes the
// /de/ variants. Runs after `vite build` (see package.json). The hreflang
// alternates on Design A live statically in index.html.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { load } from 'cheerio';
import * as A from '../src/strings.de.js';
import * as B from '../src/alt/strings.de.js';

function applyDict($, dict) {
  dict.DE.forEach(([sel, value]) => {
    $(sel).each((i, el) => {
      const html = Array.isArray(value) ? value[i] : value;
      if (html != null) $(el).html(html);
    });
  });
  (dict.DE_ATTRS || []).forEach(([sel, attr, value]) => {
    $(sel).attr(attr, value);
  });
}

// --- Design A → dist/de/index.html (indexed, with OG + canonical) ---
{
  const $ = load(readFileSync('dist/index.html', 'utf8'));
  $('html').attr('lang', 'de');
  $('title').text(A.TITLE_DE);
  $('meta[name="description"]').attr('content', A.DESC_DE);
  $('meta[property="og:title"]').attr('content', A.OG_TITLE_DE);
  $('meta[property="og:description"]').attr('content', A.DESC_DE);
  $('link[rel="canonical"]').attr('href', 'https://ocur.ai/de/');
  applyDict($, A);
  mkdirSync('dist/de', { recursive: true });
  writeFileSync('dist/de/index.html', $.html());
  console.log('✓ prerendered dist/de/index.html');
}

// --- Design B → dist/alt/de/index.html (noindex preview) ---
{
  const $ = load(readFileSync('dist/alt/index.html', 'utf8'));
  $('html').attr('lang', 'de');
  $('title').text(B.TITLE_DE);
  $('meta[name="description"]').attr('content', B.DESC_DE);
  applyDict($, B);
  mkdirSync('dist/alt/de', { recursive: true });
  writeFileSync('dist/alt/de/index.html', $.html());
  console.log('✓ prerendered dist/alt/de/index.html');
}
