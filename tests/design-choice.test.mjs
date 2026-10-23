import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { load } from 'cheerio';
import { resolveDesign, designUrl } from '../src/design-choice.js';
import { renderCloudLanding } from '../src/cloud-design-content.js';

test('explicit design links override a saved choice and preserve attribution, language and section', () => {
  assert.equal(resolveDesign('?design=cloud', 'classic'), 'cloud');
  assert.equal(resolveDesign('?design=classic', 'cloud'), 'classic');
  assert.equal(resolveDesign('?design=unknown', 'cloud'), 'cloud');
  assert.equal(resolveDesign('', null), 'classic');
  const url = new URL(designUrl('https://ocur.ai/de?lang=de&utm_source=mail#pricing', 'cloud'));
  assert.equal(url.pathname, '/de');
  assert.equal(url.searchParams.get('utm_source'), 'mail');
  assert.equal(url.searchParams.get('lang'), 'de');
  assert.equal(url.hash, '#pricing');
});

test('the actual pre-paint script resolves design even when storage is blocked', () => {
  const $ = load(readFileSync(new URL('../index.html', import.meta.url), 'utf8'));
  const script = $('script').toArray().map(el => $(el).text()).find(text => text.includes('ocur-site-design'));
  for (const [search, stored, blocked] of [['?design=cloud', 'classic', false], ['?design=classic', 'cloud', false], ['', 'cloud', false], ['?design=cloud', null, true], ['', null, true]]) {
    const root = { classList: { add() {} }, dataset: { closes: '2099-01-01' } };
    runInNewContext(script, { document: { documentElement: root }, location: { search }, URLSearchParams, window: { matchMedia: () => ({ matches: false }) }, localStorage: { getItem: key => { if (blocked) throw Error('blocked'); return key === 'ocur-site-design' ? stored : null; } } });
    assert.equal(root.dataset.design, resolveDesign(search, blocked ? null : stored));
  }
});

test('English and German tours expose complete panels and an explicitly illustrative draft', () => {
  for (const lang of ['en', 'de']) {
    const $ = load(renderCloudLanding(lang));
    assert.equal($('.c-landing').attr('data-language'), lang);
    assert.equal($('[data-tour][aria-pressed=true]').length, 1);
    for (const button of $('[data-tour]').toArray()) {
      const panel = $(`#${$(button).attr('aria-controls')}`);
      assert.equal(panel.length, 1);
      assert.ok(panel.text().trim().length > 100);
      assert.equal(panel.attr('hidden') !== undefined, $(button).attr('aria-pressed') === 'false');
    }
    assert.equal($('#c-draft-dialog').length, 1);
    assert.match($('#c-draft-dialog').text(), lang === 'de' ? /keine Nachricht gesendet/ : /No message is sent/);
    assert.equal($('form[action]').length, 0, 'the tour never introduces a second submission form');
    assert.equal($('a[href="https://app.ocur.ai/?auth=sign-up"]').length, 2);
  }
});
