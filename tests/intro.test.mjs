import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { load } from 'cheerio';
import { particleShapes } from '../src/intro-particles.js';
import { DE } from '../src/strings.de.js';

test('all GPU morph targets are finite, bounded, and repeatable at both quality tiers', () => {
  const silhouette = [[-.5, .4], [.5, .4], [0, -.4]];
  for (const count of [6500, 18000]) {
    const shapes = particleShapes(count, silhouette);
    for (const key of ['orbit', 'sphere', 'fox']) {
      assert.equal(shapes[key].length, count * 3);
      assert.ok(shapes[key].every((v) => Number.isFinite(v) && Math.abs(v) < 3));
    }
    assert.deepEqual(shapes, particleShapes(count, silhouette));
    assert.ok(shapes.seeds.every((n) => n >= 0 && n < 1));
    const reducedY = shapes.sphere.slice(0, 9000 * 3).filter((_, i) => i % 3 === 1);
    assert.ok(Math.min(...reducedY) < -1.5 && Math.max(...reducedY) > 1.5,
      'reduced draw range retains both hemispheres');
  }
});

test('intro has static accessible content, real destinations, and translated chapters', () => {
  const $ = load(readFileSync(new URL('../index.html', import.meta.url), 'utf8'));
  assert.equal($('main h1').length, 1);
  assert.equal($('.oc-primary').attr('href'), 'https://app.ocur.ai/?auth=sign-up');
  assert.equal($('.oc-secondary').attr('href'), '#demo');
  assert.equal($('.oc-skip').attr('href'), '#oc-next');
  assert.equal($('#oc-next').length, 1);
  assert.equal($('.oc-copy[aria-hidden="true"][inert]').length, 2);
  assert.equal($('[data-design-choice], .c-landing, .site-design-switcher').length, 0);
  for (const [selector, value] of DE) {
    $(selector).each((index, element) => {
      const translated = Array.isArray(value) ? value[index] : value;
      if (translated != null) $(element).html(translated);
    });
  }
  assert.match($('#oc-title').text(), /Dein Unternehmen/);
  assert.match($('.oc-copy').eq(2).text(), /Ocur legt los/);
  assert.match($('.oc-chapters').text(), /Möglichkeiten.*Verbindung.*Aktion/s);
});
