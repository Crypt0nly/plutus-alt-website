import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { load } from 'cheerio';
import { DE, DE_ATTRS } from '../src/strings.de.js';
import { COHORT_TOKENS } from '../src/cohort.js';

// The home page as vite.config.js fills it, and as the German prerender
// (scripts/prerender-de.mjs) rewrites it.
const source = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const html = source.replace(/\{\{(COHORT_[A-Z_]+)\}\}/g, (_, key) => COHORT_TOKENS[key]);
const english = () => load(html);
const german = () => {
  const $ = load(html);
  for (const [selector, value] of DE) {
    $(selector).each((index, element) => {
      const translated = Array.isArray(value) ? value[index] : value;
      if (translated != null) $(element).html(translated);
    });
  }
  for (const [selector, attribute, value] of DE_ATTRS) $(selector).attr(attribute, value);
  return $;
};

test('the opening says what Ocur is and opens both doors — and the film is gone', () => {
  const $ = english();
  assert.equal($('main h1').length, 1);
  assert.equal($('main h1').attr('id'), 'hx-title');
  assert.ok($('main > section').first().hasClass('hx'), 'the opening is the first thing on the page');
  assert.match($('#hx-title').text(), /^Less busywork\. More business\.$/);
  assert.equal($('.hx-apply').attr('href'), '#apply');
  assert.equal($('.hx-apply').attr('data-apply'), 'hero');
  assert.equal($('.hx-free').attr('href'), 'https://app.ocur.ai/?auth=sign-up');
  assert.equal($('.hx-pill').attr('href'), '#apply');
  assert.equal($('.oc-intro, .oc-stage, .oc-webgl, .oc-skip, #oc-next, .oc-welcome').length, 0);
});

test('every job in the deck has its chip, an ask, three steps and a result', () => {
  const $ = english();
  const cards = $('.hx-card').toArray();
  const chips = $('.hx-chip').toArray();
  assert.equal(cards.length, 4);
  assert.deepEqual(
    chips.map((chip) => $(chip).attr('data-job')),
    cards.map((card) => $(card).attr('data-job')),
  );
  cards.forEach((card, index) => {
    const $card = $(card);
    assert.equal($card.attr('data-pos'), String(index), 'stacked in order, the first in front');
    assert.equal($card.attr('aria-hidden'), index === 0 ? undefined : 'true');
    assert.equal($(chips[index]).attr('aria-pressed'), String(index === 0));
    assert.equal($(`#${$card.attr('aria-labelledby')}`).text(), $(chips[index]).text(), 'the chip names its window');
    assert.ok($card.find('.hx-ask-t').text().trim());
    assert.ok($card.find('.hx-reply-t').text().trim());
    assert.equal($card.find('.hx-step').length, 3);
    assert.equal($card.find('.hx-done-k, .hx-done-v, .hx-done-l').length, 3);
  });
});

test('the German dictionary lines up with the page, entry by entry', () => {
  const $ = english();
  for (const [selector, value] of DE) {
    const found = $(selector).length;
    if (Array.isArray(value)) assert.equal(found, value.length, `${selector}: ${found} elements for ${value.length} strings`);
    else assert.ok(found > 0, `${selector}: matches nothing`);
  }
  for (const [selector] of DE_ATTRS) assert.ok($(selector).length > 0, `${selector}: matches nothing`);
});

test('the German opening reads German, and each count-up ends on what the page says', () => {
  const en = english();
  const de = german();
  assert.match(de('#hx-title').text(), /^Weniger Routine\. Mehr Unternehmen\.$/);
  const translated = ['.hx-pill strong', '.hx-sub', '.hx-apply', '.hx-free', '.hx-trust li', '.hx-ask-t', '.hx-reply-t', '.hx-done-k', '.hx-done-l', '.hx-compose > span'];
  for (const selector of translated) {
    de(selector).each((index, element) => {
      assert.notEqual(de(element).text(), en(selector).eq(index).text(), `${selector} #${index + 1} is still English`);
    });
  }
  for (const [$, locale] of [
    [en, 'en-US'],
    [de, 'de-DE'],
  ]) {
    $('[data-count]').each((_, element) => {
      const $el = $(element);
      const value = Number($el.attr('data-count')).toLocaleString(locale);
      assert.equal($el.text(), ($el.attr('data-prefix') || '') + value + ($el.attr('data-suffix') || ''), `${locale}: ${$el.text()}`);
    });
  }
});
