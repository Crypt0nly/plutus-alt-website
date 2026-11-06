import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import * as cheerio from 'cheerio';
import { COMPANY_PRICES, SOLO_PRICES, companyPrice, initPricing, soloPrice } from '../src/pricing.js';
import { DE } from '../src/strings.de.js';
import { english, german } from './pages.mjs';

test('company six-month totals, monthly equivalents and savings are accurate in both currencies', () => {
  for (const [plan, total, equivalent, saving] of [
    ['team', 2300, '383.33', 94], ['growth', 8500, '1,416.67', 500], ['scale', 28500, '4,750', 1500],
  ]) {
    assert.equal(COMPANY_PRICES[plan].semiannual, total);
    const en = companyPrice(plan, 'semiannual', 'en');
    assert.equal(en.amount, `$${total.toLocaleString('en-US')}`);
    assert.equal(en.period, '/6 months');
    assert.equal(en.note, `$${equivalent} / month equivalent · billed every 6 months`);
    assert.equal(en.saving, `Save $${saving.toLocaleString('en-US')} every 6 months`);
    assert.equal(companyPrice(plan, 'semiannual', 'de').amount, `€${total.toLocaleString('de-DE')}`);
  }
});

test('English and German static pages expose every six-month total and billing control', () => {
  const $ = cheerio.load(readFileSync(new URL('../pricing/index.html', import.meta.url), 'utf8'));
  assert.equal($('[data-company-plan]').length, 3);
  assert.equal($('[data-billing-interval="semiannual"]').text(), 'Every 6 months');
  assert.equal($('.g-tiers[data-aud="solo"] [data-billing-interval]').length, 0);
  for (const [plan, prices] of Object.entries(COMPANY_PRICES)) {
    assert.ok($(`[data-company-plan="${plan}"] .g-price-alt`).text().includes(`$${prices.semiannual.toLocaleString('en-US')}`));
  }
  DE.forEach(([selector, value]) => $(selector).each((index, el) => {
    const html = Array.isArray(value) ? value[index] : value;
    if (html != null) $(el).html(html);
  }));
  assert.equal($('[data-billing-interval="semiannual"]').text(), 'Alle 6 Monate');
  for (const [plan, prices] of Object.entries(COMPANY_PRICES)) {
    assert.ok($(`[data-company-plan="${plan}"] .g-price-alt`).text().includes(`€${prices.semiannual.toLocaleString('de-DE')}`));
  }
});

test('solo plans bill monthly or annually, annual being two months free, in both currencies', () => {
  for (const [plan, monthly, yearly, equivalent, saving] of [
    ['starter', 29, 290, '24.17', 58], ['pro', 149, 1490, '124.17', 298], ['pro-plus', 299, 2990, '249.17', 598],
  ]) {
    assert.deepEqual(SOLO_PRICES[plan], { month: monthly, year: yearly });
    assert.deepEqual(soloPrice(plan, 'month'), {
      amount: `$${monthly}`,
      period: '/month',
      note: `or $${yearly.toLocaleString('en-US')} a year — 2 months free`,
      saving: '',
    });
    assert.deepEqual(soloPrice(plan, 'year'), {
      amount: `$${yearly.toLocaleString('en-US')}`,
      period: '/year',
      note: `$${equivalent} / month equivalent · billed annually`,
      saving: `Save $${saving} a year`,
    });
    const de = soloPrice(plan, 'year', 'de');
    assert.equal(de.amount, `€${yearly.toLocaleString('de-DE')}`);
    assert.equal(de.period, '/Jahr');
    assert.equal(de.note, `€${equivalent.replace('.', ',')} / Monat im Vergleich · jährlich abgerechnet`);
    assert.equal(de.saving, `€${saving} im Jahr sparen`);
  }
});

test('switching the solo ladder back to monthly restores the page text exactly', () => {
  for (const [$, lang] of [[english('/pricing'), 'en'], [german('/pricing'), 'de']]) {
    for (const plan of Object.keys(SOLO_PRICES)) {
      assert.equal($(`[data-solo-plan="${plan}"] .g-price-alt`).text(), soloPrice(plan, 'month', lang).note, `${lang} ${plan}`);
    }
    assert.deepEqual($('.g-solo-interval button').toArray().map((el) => $(el).attr('data-solo-interval')), ['month', 'year']);
  }
  const de = german('/pricing');
  assert.deepEqual(de('.g-solo-interval button').toArray().map((el) => de(el).text()), ['Monatlich', 'Jährlich']);
});

test('every paid plan button buys that plan; Free stays a plain sign-up', () => {
  for (const $ of [english('/pricing'), german('/pricing')]) {
    const buy = (card, plan) => {
      const url = new URL($(card).find('.g-btn').attr('href'));
      assert.equal(url.origin, 'https://app.ocur.ai');
      assert.equal(url.searchParams.get('auth'), 'sign-up');
      assert.equal(url.searchParams.get('plan'), plan);
      assert.equal(url.searchParams.get('checkout'), '1');
    };
    const solo = $('[data-solo-plan]').toArray();
    assert.deepEqual(solo.map((card) => $(card).attr('data-solo-plan')), ['starter', 'pro', 'pro-plus']);
    solo.forEach((card) => buy(card, $(card).attr('data-solo-plan')));
    $('[data-company-plan]').toArray().forEach((card) => buy(card, $(card).attr('data-company-plan')));
    const free = $('.g-tiers[data-aud="solo"] .g-card').first().find('.g-btn').attr('href');
    assert.equal(free, 'https://app.ocur.ai/?auth=sign-up');
    assert.match($('.g-tiers[data-aud="solo"] > .g-note').text(), /Stripe/);
    assert.match($('.g-tiers[data-aud="company"] > .g-note').text(), /Stripe/);
  }
});

// A small stand-in for the browser DOM: enough for the switches to run.
function fakePage() {
  const node = () => ({ textContent: '' });
  globalThis.document = {
    createTextNode: (text) => ({ textContent: text }),
    createElement: () => node(),
  };
  const listeners = new Map();
  const button = (key, value) => ({
    dataset: { [key]: value },
    attrs: {},
    setAttribute(name, v) { this.attrs[name] = v; },
    addEventListener: (_, fn) => listeners.set(`${key}:${value}`, fn),
  });
  const card = (key, plan, href) => {
    const price = { parts: [], replaceChildren(...parts) { this.parts = parts; }, append(part) { this.parts.push(part); } };
    const els = { '.g-price': price, '.g-price-alt': node(), '.g-price-saving': node() };
    const link = { href };
    return { dataset: { [key]: plan }, els, link, querySelector: (s) => (s.startsWith('a[') ? link : els[s]) };
  };
  const solo = ['starter', 'pro', 'pro-plus'].map((plan) =>
    card('soloPlan', plan, `https://app.ocur.ai/?auth=sign-up&plan=${plan}&checkout=1&utm_source=x`));
  const company = ['team', 'growth', 'scale'].map((plan) =>
    card('companyPlan', plan, `https://app.ocur.ai/?auth=sign-up&plan=${plan}&checkout=1`));
  const buttons = {
    '[data-solo-interval]': ['month', 'year'].map((v) => button('soloInterval', v)),
    '[data-billing-interval]': ['month', 'semiannual', 'year'].map((v) => button('billingInterval', v)),
  };
  const lists = { ...buttons, '[data-solo-plan]': solo, '[data-company-plan]': company };
  const root = { querySelectorAll: (selector) => lists[selector] ?? [] };
  return { root, solo, company, buttons, click: (key, value) => listeners.get(`${key}:${value}`)() };
}

test('a billing switch sets the price and the billing period its ladder\'s buy buttons carry', () => {
  const page = fakePage();
  try {
    initPricing(page.root, 'en');
    page.click('soloInterval', 'year');
    const pro = page.solo[1];
    assert.deepEqual(pro.els['.g-price'].parts.map((p) => p.textContent), ['$1,490', '/year']);
    assert.equal(pro.els['.g-price-saving'].textContent, 'Save $298 a year');
    const url = new URL(pro.link.href);
    assert.equal(url.searchParams.get('interval'), 'year');
    assert.equal(url.searchParams.get('checkout'), '1');
    assert.equal(url.searchParams.get('utm_source'), 'x', 'campaign tags already on the link stay');
    assert.deepEqual(page.buttons['[data-solo-interval]'].map((b) => b.attrs['aria-pressed']), ['false', 'true']);
    // the solo switch leaves the company ladder alone, and the other way round
    assert.equal(new URL(page.company[0].link.href).searchParams.get('interval'), null);
    page.click('billingInterval', 'semiannual');
    assert.equal(new URL(page.company[1].link.href).searchParams.get('interval'), 'semiannual');
    assert.equal(new URL(pro.link.href).searchParams.get('interval'), 'year');
    page.click('soloInterval', 'month');
    assert.equal(new URL(pro.link.href).searchParams.get('interval'), 'month');
    assert.equal(pro.els['.g-price-alt'].textContent, 'or $1,490 a year — 2 months free');
    assert.equal(pro.els['.g-price-saving'].textContent, '');
  } finally {
    delete globalThis.document;
  }
});
