import test from 'node:test';
import assert from 'node:assert/strict';
import { DE, DE_ATTRS } from '../src/strings.de.js';
import { english, german, PAGES } from './pages.mjs';

test('the opening says what Ocur is and opens both doors — and the film is gone', () => {
  const $ = english();
  assert.equal($('main h1').length, 1);
  assert.equal($('main h1').attr('id'), 'hx-title');
  assert.ok($('main > section').first().hasClass('hx'), 'the opening is the first thing on the page');
  assert.match($('#hx-title').text(), /^Less busywork\. More business\.$/);
  assert.equal($('.hx-primary').attr('href'), 'https://app.ocur.ai/?auth=sign-up');
  assert.equal($('.hx-secondary').attr('data-book'), 'hero');
  assert.equal($('.hx-secondary').attr('href'), 'https://api.ocur.ai/api/book/gJM0Hx8-5SY');
  assert.equal($('.hx-pill, .hx-trust').length, 0, 'the opening has no promotional pill or checklist');
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

test('the German dictionary lines up with the pages, entry by entry', () => {
  const pages = PAGES.map((path) => [path, english(path)]);
  for (const [selector, value] of DE) {
    const hits = pages.map(([path, $]) => [path, $(selector).length]).filter(([, found]) => found > 0);
    assert.ok(hits.length > 0, `${selector}: matches nothing on any page`);
    if (!Array.isArray(value)) continue;
    for (const [path, found] of hits) assert.equal(found, value.length, `${path} ${selector}: ${found} elements for ${value.length} strings`);
  }
  for (const [selector] of DE_ATTRS) assert.ok(pages.some(([, $]) => $(selector).length > 0), `${selector}: matches nothing`);
});

test('the pages share one nav and one footer, and the current page is marked', () => {
  for (const path of PAGES) {
    const $ = english(path);
    assert.deepEqual($('.g-nav .g-links a').toArray().map((a) => $(a).attr('href')), ['/product', '/pricing', '/faq'], path);
    const current = $('.g-nav .g-links a[aria-current="page"]').attr('href');
    // Contact sits in the phone menu and the footer, not the nav bar.
    assert.equal(current, ['/', '/contact'].includes(path) ? undefined : path, `${path}: current page`);
    assert.equal($('#g-menu .g-menu-links a[aria-current="page"]').attr('href'), path, `${path}: current page in the menu`);
    assert.equal($('.g-nav .g-lang, .g-nav .g-theme').length, 0, `${path}: language and theme live in the footer`);
    assert.equal($('footer.g-foot .g-lang a').length, 2, `${path}: footer language switch`);
    assert.equal($('main h1').length, 1, `${path}: one page title`);
    assert.equal($('#g-dock').length, 0, `${path}: no floating dock`);
  }
});

test('the founding cohort is gone, and every page keeps both doors open', () => {
  for (const path of PAGES) {
    const html = english(path).html();
    assert.doesNotMatch(html, /founding|cohort|data-apply|COHORT_/i, `${path}: no founding cohort left`);
    const $ = english(path);
    assert.equal($('.g-nav .g-nav-free').attr('href'), 'https://app.ocur.ai/?auth=sign-up', `${path}: Start free in the nav`);
    assert.equal($('.g-nav a[data-book="nav"]').length, 1, `${path}: Book a demo in the nav`);
  }
  for (const path of PAGES) {
    const de = german(path).html();
    assert.doesNotMatch(de, /Pilotprogramm|Pilotpreis|Pilotkunden|bewirb|Bewerbung/i, `${path}: no Pilotprogramm left in German`);
  }
});

test('pricing opens the contact form with its plan; the form is a plain message', () => {
  const $ = english('/pricing');
  for (const plan of ['team', 'growth', 'scale', 'enterprise']) {
    assert.equal($(`a[data-talk="${plan}"]`).attr('href'), `/contact?plan=${plan}#talk`);
  }
  for (const plan of ['team', 'growth', 'scale']) {
    assert.equal($(`[data-company-plan="${plan}"] .g-btn`).attr('href'), `https://app.ocur.ai/?auth=sign-up&plan=${plan}`);
  }
  const contact = english('/contact');
  assert.equal(contact('#talk form#g-talk').length, 1);
  assert.equal(contact('#g-talk input[name="kind"]').length, 0, 'not an application any more');
  assert.deepEqual(contact('#g-talk [required]').toArray().map((el) => contact(el).attr('name')), ['email', 'name', 'message']);
});

test('the German opening reads German, and each count-up ends on what the page says', () => {
  const en = english();
  const de = german();
  assert.match(de('#hx-title').text(), /^Weniger Routine\. Mehr Unternehmen\.$/);
  const translated = ['.hx-sub', '.hx-primary', '.hx-secondary', '.hx-ask-t', '.hx-reply-t', '.hx-done-k', '.hx-done-l', '.hx-compose > span'];
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
