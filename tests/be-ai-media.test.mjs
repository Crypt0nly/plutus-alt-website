import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createGalleryCard, safeDrawingUrl } from '../src/be-ai-media.js';

const png = 'data:image/png;base64,iVBORw0KGgo=';
const attack = 'data:image/png;base64,x" onerror="alert(document.domain)';

test('drawing URLs reject attribute injection, non-PNG data and oversized input', () => {
  for (const value of [attack, null, {}, 'data:image/png;base64,PHN2Zz4=', 'https://evil.example/x', png + 'A'.repeat(220_000)]) {
    assert.equal(safeDrawingUrl(value), null);
  }
  assert.equal(safeDrawingUrl(png), png);
});

// The renderer must only use DOM properties, even for malicious historical
// records. This DOM double makes HTML parsing an explicit test failure.
const doc = { createElement(tag) {
  return { tag, children: [], textContent: '', appendChild(child) { this.children.push(child); },
    set innerHTML(_) { throw new Error('Untrusted gallery content reached HTML parsing'); } };
} };

test('stored attribute-injection payload never creates an image or executable markup', () => {
  const card = createGalleryCard(doc, { kind: 'drawing', drawing: attack, question: '<img src=x onerror=alert(1)>' });
  assert.equal(card.children[0].tag, 'p');
  assert.equal(card.children[0].textContent, 'Drawing unavailable');
  assert.equal(card.children[1].textContent, '“<img src=x onerror=alert(1)>”');
});

test('valid drawings render and text answers stay literal text', () => {
  const card = createGalleryCard(doc, { kind: 'drawing', drawing: png, question: 'Hello' });
  assert.equal(card.children[0].tag, 'img');
  assert.equal(card.children[0].src, png);
  const answer = createGalleryCard(doc, { kind: 'text', text: '<script>alert(1)</script>' });
  assert.equal(answer.children[0].textContent, '<script>alert(1)</script>');
});
