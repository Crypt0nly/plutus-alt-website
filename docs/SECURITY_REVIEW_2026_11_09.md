# Website security review — 9 November 2026

Baseline: `0e149286b78b1ed9583e517299e46358680c37a7`.

This repository is a static Vite website with one serverless X conversion
relay and rewrites to the separate cloud backend. It has no SQL database
queries of its own. Cloud endpoints require a separate backend review.

## Changes

- High: the game gallery interpolated stored drawing URLs into HTML, while
  backend validation allowed arbitrary text after a PNG data-URL prefix. An
  anonymous participant could store an attribute-injection payload that ran
  script for gallery visitors. Gallery rendering now uses DOM properties and
  validates PNG data URLs, including for historical records. The companion
  cloud patch strictly validates drawing encodings/signatures before storage.
  Regression tests use synthetic payloads; no live exploit was submitted.
- npm audit originally reported eight affected packages: one critical, five
  high and two moderate. Updated Vite to 6.4.5 and refreshed locked dependencies,
  including DOMPurify, fflate, PostCSS, source-map-js, nanoid and undici.
  The updated lockfile has zero reported vulnerabilities on this review date.
  Several findings concern build/development tooling or particular library
  options, so counts should not be interpreted as proven production exploits.
- The X relay now accepts only exact production/configured-preview origins
  (local development origins only outside production), rejects prototype
  property names as events, bounds request data and upstream time, and does
  not return provider response bodies or forward attribution URL queries.
- Added no-sniff, anti-framing, referrer and HTTPS headers, plus a limited CSP
  restricting base URLs, plugins and framing without blocking site scripts.
- Added synthetic relay regression tests and a daily npm audit/test/build
  workflow with read-only repository permissions.

## Limits and rollout

Run `npm ci`, deploy the production build and verify the response headers at
the hosting layer. The source review does not prove what is currently live.
The public conversion relay still needs a hosting-layer rate limit: browser
Origin checks are not authentication and can be forged by non-browser clients.
No production load or exploit testing was performed. A zero advisory count
does not mean complete security.
