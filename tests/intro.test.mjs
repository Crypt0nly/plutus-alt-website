import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { load } from 'cheerio';
import { particleShapes } from '../src/intro-particles.js';
import { DE } from '../src/strings.de.js';
import { dampProgress, captionOpacity } from '../src/intro-timing.js';

test('all GPU morph targets are finite, bounded, and repeatable at both quality tiers', () => {
  const silhouette = [[-.5, .4], [.5, .4], [0, -.4]];
  const text = [[[-.45, .1], [.45, -.1]], [[-.4, -.15], [.4, .15]]];
  for (const count of [10000, 16000]) {
    const shapes = particleShapes(count, silhouette, text);
    for (const key of ['orbit', 'sphere', 'fox']) {
      assert.equal(shapes[key].length, count * 3);
      assert.ok(shapes[key].every((v) => Number.isFinite(v) && Math.abs(v) < 3));
    }
    for (const words of shapes.words) {
      assert.equal(words.length, count * 3);
      assert.ok(words.every((v) => Number.isFinite(v) && Math.abs(v) < 3.7));
      assert.ok(words.filter((_, i) => i % 3 === 2).every((v) => v === 0), 'letters stay on a readable plane');
    }
    assert.notDeepEqual(shapes.words[0], shapes.words[1]);
    assert.deepEqual(shapes, particleShapes(count, silhouette, text));
    assert.ok(shapes.seeds.every((n) => n >= 0 && n < 1));
    const reducedY = shapes.sphere.slice(0, 9000 * 3).filter((_, i) => i % 3 === 1);
    assert.ok(Math.min(...reducedY) < -1.5 && Math.max(...reducedY) > 1.5,
      'reduced draw range retains both hemispheres');
  }
});

test('cinematic stage is isolated from navigation and conversion content in both languages', () => {
  const $ = load(readFileSync(new URL('../index.html', import.meta.url), 'utf8'));
  assert.equal($('main h1').length, 1);
  assert.equal($('.oc-primary').attr('href'), 'https://app.ocur.ai/?auth=sign-up');
  assert.equal($('.oc-secondary').attr('href'), '#demo');
  assert.equal($('.oc-skip').attr('href'), '#oc-next');
  assert.equal($('#oc-next').length, 1);
  assert.equal($('.oc-stage .oc-actions, .oc-stage .oc-chapters, .oc-stage .oc-signal').length, 0);
  assert.equal($('.oc-welcome .oc-primary').length, 1);
  assert.equal($('#oc-title span').length, 2);
  assert.equal($('[data-design-choice], .c-landing, .site-design-switcher').length, 0);
  for (const [selector, value] of DE) {
    $(selector).each((index, element) => {
      const translated = Array.isArray(value) ? value[index] : value;
      if (translated != null) $(element).html(translated);
    });
  }
  assert.match($('#oc-title').text(), /Dein Unternehmen/);
  assert.match($('.oc-message').text(), /Ocur legt los/);
  assert.match($('.oc-skip').text(), /überspringen/);
});

test('scroll damping is frame-rate independent, bounded, and reversible', () => {
  const run = (hz, target) => { let p = 0; for (let i = 0; i < hz; i++) p = dampProgress(p, target, 1000 / hz); return p; };
  assert.ok(Math.abs(run(60, 1) - run(120, 1)) < 1e-10);
  assert.ok(run(60, 1) > .9999 && run(60, 1) < 1);
  assert.ok(dampProgress(.8, .2, 16) < .8 && dampProgress(.8, .2, 16) > .2);
  assert.equal(captionOpacity(0, 0), 1);
  assert.equal(captionOpacity(1, .52), 1);
  assert.equal(captionOpacity(2, 1), 1);
  for (const p of [.27, .8]) assert.ok([0, 1, 2].every((i) => captionOpacity(i, p) === 0), 'particle text holds have no competing caption');
});
