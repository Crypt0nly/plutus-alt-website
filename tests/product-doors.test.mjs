import test from 'node:test';
import assert from 'node:assert/strict';
import { english, german } from './pages.mjs';
import { isSignupHref, SIGNUP_LINKS } from '../src/doors.js';

// Every product lives on Ocur's host (app.ocur.ai, /drops, /worlds) with one
// account, and every "Start free" opens that product's sign-up form directly.

test('the oDrops panel opens two doors: start free, or explore an example', () => {
  const $ = english();
  const start = $('#ps-drops .ps-drops-start');
  assert.equal(start.length, 1);
  assert.equal(start.attr('href'), 'https://app.ocur.ai/drops?auth=sign-up', 'straight into oDrops sign-up, no extra page');
  assert.match(start.text(), /^Start free with oDrops$/);
  assert.ok(start.hasClass('g-btn'), 'the main door is the blue button');
  const example = $('#ps-drops .ps-drops-link');
  assert.equal(example.attr('href'), 'https://app.ocur.ai/drops?preview=1');
  assert.equal(example.attr('data-demo'), 'odrops', 'example visits are counted');
  assert.ok($(SIGNUP_LINKS).toArray().some((a) => $(a).is('.ps-drops-start')), 'the start door counts as a sign-up');
});

test('every product door opens on Ocur’s host, and the shared account is said once', () => {
  const $ = english();
  const links = $('.ps-section a[href^="http"]').toArray();
  assert.ok(links.length >= 5);
  for (const a of links) assert.equal(new URL($(a).attr('href')).host, 'app.ocur.ai', $(a).attr('href'));
  assert.match($('.ps-example-note').text(), /^One Ocur account for Ocur, oDrops and oWorlds\./);
});

test('oDrops sign-ups count like every other way into sign-up', () => {
  assert.ok(isSignupHref('https://app.ocur.ai/drops?auth=sign-up'));
  assert.ok(isSignupHref('https://app.ocur.ai/drops?auth=sign-up&utm_source=x'));
  assert.ok(!isSignupHref('https://app.ocur.ai/drops?preview=1'), 'the example is not a sign-up');
  assert.ok(!isSignupHref('https://app.ocur.ai/drops?auth=sign-in'));
});

test('German names the oDrops doors and the shared account', () => {
  const $ = german();
  const start = $('#ps-drops .ps-drops-start');
  assert.match(start.text(), /^Kostenlos starten mit oDrops$/);
  assert.equal(start.attr('href'), 'https://app.ocur.ai/drops?auth=sign-up');
  assert.match($('#ps-drops .ps-drops-link').text(), /^Ein Beispiel ansehen/);
  assert.match($('.ps-example-note').text(), /^Ein Ocur-Konto für Ocur, oDrops und oWorlds\./);
});
