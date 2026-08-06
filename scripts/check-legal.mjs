// Build guard for the things Google's OAuth verification actually checks.
//
// Ocur's OAuth consent screen points at https://ocur.ai/privacy, and an app
// asking for Gmail/Drive/Calendar scopes gets rejected if that URL 404s, if the
// home page doesn't link to it, or if the Limited Use disclosure has gone
// missing. Those are all one careless refactor away, and nobody notices until
// a verification round-trip has burned a week — so the build checks them.
//
// Hard failures: a missing page, or a home page that stops linking to the
// policy. Warnings: unfilled operator placeholders (the build still has to
// produce a preview you can look at).

import { readFileSync, existsSync } from 'node:fs';

const DIST = 'dist';
const LIMITED_USE = 'developers.google.com/terms/api-services-user-data-policy';
const PLACEHOLDER = /\[\[ [^\]]+ \]\]/g;

const errors = [];
const warnings = [];

const read = (path) => {
  const full = `${DIST}/${path}`;
  if (!existsSync(full)) {
    errors.push(`${path} was not built — the page would 404 in production`);
    return null;
  }
  return readFileSync(full, 'utf8');
};

// 1. every legal page exists, and the privacy pages still carry the disclosure
for (const path of ['privacy/index.html', 'de/privacy/index.html']) {
  const html = read(path);
  if (html && !html.includes(LIMITED_USE)) {
    errors.push(`${path} no longer contains the Google API Services User Data Policy (Limited Use) disclosure`);
  }
}
for (const path of ['terms/index.html', 'de/terms/index.html', 'de/impressum/index.html']) {
  read(path);
}

// 2. both home pages link to their privacy policy and terms — the check that
//    failed Ocur's first verification attempt
const homes = [
  ['index.html', ['/privacy', '/terms']],
  ['de/index.html', ['/de/privacy', '/de/terms', '/de/impressum']],
];
for (const [path, hrefs] of homes) {
  const html = read(path);
  if (!html) continue;
  for (const href of hrefs) {
    if (!html.includes(`href="${href}"`)) {
      errors.push(`${path} has no link to ${href} — Google requires the home page to link to the privacy policy`);
    }
  }
}

// 3. the operator details still need filling in
for (const path of ['privacy/index.html', 'terms/index.html', 'de/privacy/index.html', 'de/terms/index.html', 'de/impressum/index.html']) {
  const html = existsSync(`${DIST}/${path}`) ? readFileSync(`${DIST}/${path}`, 'utf8') : '';
  const found = [...new Set(html.match(PLACEHOLDER) || [])];
  if (found.length) warnings.push(`${path}: ${found.join(', ')}`);
}

if (warnings.length) {
  console.warn('\n\x1b[33m⚠  Legal pages still contain placeholders — fill these in before submitting to Google:\x1b[0m');
  warnings.forEach((w) => console.warn(`   ${w}`));
  console.warn('');
}

if (errors.length) {
  console.error('\n\x1b[31m✗ Legal page check failed:\x1b[0m');
  errors.forEach((e) => console.error(`   ${e}`));
  console.error('');
  process.exit(1);
}

console.log('✓ legal pages present, linked from both home pages, Limited Use disclosure intact');
