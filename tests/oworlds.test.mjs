import test from 'node:test';
import assert from 'node:assert/strict';
import { english, german } from './pages.mjs';
import { isSignupHref, setWorldDrop, SIGNUP_LINKS } from '../src/doors.js';

// The Drop ids the oWorlds app knows (oworld/src/firstRun/dropPresets.ts in
// plutus-cloud). The site may only send these; the app ignores anything else.
const APP_DROPS = new Set(['nova', 'olive', 'milo', 'luna', 'atlas', 'pip', 'juno', 'sage', 'remy', 'ivy', 'otto', 'kiki', 'bean', 'echo', 'ziggy']);

test('the oWorlds panel opens two doors: start free with a Drop, or walk through the demo', () => {
  const $ = english();
  const start = $('#ps-world [data-world-start]');
  assert.equal(start.length, 1);
  const url = new URL(start.attr('href'));
  assert.equal(url.origin + url.pathname, 'https://app.ocur.ai/worlds');
  assert.equal(url.searchParams.get('auth'), 'sign-up', 'straight into oWorlds sign-up, no extra page');
  assert.equal(url.searchParams.get('drop'), 'olive', 'the research lab is selected first, so Olive comes along');
  assert.match(start.text(), /^Start free with Olive$/);
  assert.ok(start.hasClass('g-btn'), 'the main door is the blue button');
  const demo = $('#ps-world .ps-world-link');
  assert.equal(demo.attr('href'), 'https://app.ocur.ai/worlds?demo=1');
  assert.equal(demo.attr('data-demo'), 'oworlds', 'demo visits are counted');
});

test('every room names a Drop the app can welcome', () => {
  const $ = english();
  const spots = $('#ps-world [data-world]').toArray();
  assert.equal(spots.length, 3);
  for (const spot of spots) {
    const id = $(spot).attr('data-world-drop');
    const name = $(spot).attr('data-world-name');
    assert.ok(APP_DROPS.has(id), `${id} is a Drop oWorlds knows`);
    assert.equal(name.toLowerCase(), id, 'the name shown is the Drop that comes along');
    const note = $(`[data-world-note="${$(spot).attr('data-world')}"]`).text();
    assert.match(note, new RegExp(name), 'the room note introduces the same Drop');
  }
});

test('German keeps the Drop name swappable in the start button', () => {
  const $ = german();
  const start = $('#ps-world [data-world-start]');
  assert.match(start.text(), /^Kostenlos starten mit Olive$/);
  assert.equal(start.find('[data-world-drop-name]').length, 1);
  assert.equal(start.attr('href'), 'https://app.ocur.ai/worlds?auth=sign-up&drop=olive');
});

test('oWorlds sign-ups count like every other way into sign-up', () => {
  assert.ok(isSignupHref('https://app.ocur.ai/worlds?auth=sign-up&drop=milo'));
  assert.ok(isSignupHref('https://app.ocur.ai/?auth=sign-up&plan=pro&checkout=1'));
  assert.ok(!isSignupHref('https://app.ocur.ai/worlds?demo=1'), 'the demo is not a sign-up');
  assert.ok(!isSignupHref('https://app.ocur.ai/?auth=sign-in'));
  const $ = english();
  assert.ok($(SIGNUP_LINKS).toArray().some((a) => $(a).is('[data-world-start]')));
});

test('picking a room swaps the Drop and keeps the campaign tags on the link', () => {
  const label = { textContent: 'Olive' };
  const link = {
    href: 'https://app.ocur.ai/worlds?auth=sign-up&drop=olive&utm_source=x&twclid=abc',
    querySelector: (selector) => (selector === '[data-world-drop-name]' ? label : null),
  };
  setWorldDrop(link, 'milo', 'Milo');
  const url = new URL(link.href);
  assert.equal(url.searchParams.get('drop'), 'milo');
  assert.equal(url.searchParams.get('utm_source'), 'x');
  assert.equal(url.searchParams.get('twclid'), 'abc');
  assert.equal(label.textContent, 'Milo');
  setWorldDrop(link, 'Milo<script>', 'Nope');
  assert.equal(new URL(link.href).searchParams.get('drop'), 'milo', 'anything but a plain id is ignored');
  assert.equal(label.textContent, 'Milo');
});
