import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import * as cheerio from 'cheerio';
import { COMPANY_PRICES, companyPrice } from '../src/company-pricing.js';
import { DE } from '../src/strings.de.js';

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
  const $ = cheerio.load(readFileSync(new URL('../index.html', import.meta.url), 'utf8'));
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
