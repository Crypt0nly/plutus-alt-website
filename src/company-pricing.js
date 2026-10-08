// Company totals match plutus-cloud/frontend/src/lib/plans.ts, in USD and EUR.
export const COMPANY_PRICES = {
  team: { month: 399, semiannual: 2300, year: 4389 },
  growth: { month: 1500, semiannual: 8500, year: 16500 },
  scale: { month: 5000, semiannual: 28500, year: 55000 },
};

export function companyPrice(plan, interval, lang = 'en') {
  const prices = COMPANY_PRICES[plan];
  const months = interval === 'year' ? 12 : interval === 'semiannual' ? 6 : 1;
  const amount = prices[interval];
  const de = lang === 'de';
  const money = (value) => `${de ? '€' : '$'}${value.toLocaleString(de ? 'de-DE' : 'en-US', { maximumFractionDigits: 2 })}`;
  return {
    amount: money(amount),
    period: interval === 'year' ? (de ? '/Jahr' : '/year') : interval === 'semiannual' ? (de ? '/6 Monate' : '/6 months') : (de ? '/Monat' : '/month'),
    note: months === 1
      ? (de ? `6 Monate: ${money(prices.semiannual)} · Jahr: ${money(prices.year)}` : `6 months: ${money(prices.semiannual)} · Year: ${money(prices.year)}`)
      : `${money(amount / months)} ${de ? '/ Monat im Vergleich' : '/ month equivalent'} · ${de ? (months === 6 ? 'alle 6 Monate abgerechnet' : 'jährlich abgerechnet') : (months === 6 ? 'billed every 6 months' : 'billed annually')}`,
    saving: months === 1 ? '' : de ? `${money(prices.month * months - amount)} ${months === 6 ? 'alle 6 Monate' : 'im Jahr'} sparen` : `Save ${money(prices.month * months - amount)} ${months === 6 ? 'every 6 months' : 'a year'}`,
  };
}

export function initCompanyPricing(root, lang) {
  const buttons = [...root.querySelectorAll('[data-billing-interval]')];
  const cards = [...root.querySelectorAll('[data-company-plan]')];
  for (const button of buttons) {
    button.addEventListener('click', () => {
      const interval = button.dataset.billingInterval;
      buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      cards.forEach((card) => {
        const display = companyPrice(card.dataset.companyPlan, interval, lang);
        const price = card.querySelector('.g-price');
        price.replaceChildren(document.createTextNode(display.amount));
        const period = document.createElement('span');
        period.textContent = display.period;
        price.append(period);
        card.querySelector('.g-price-alt').textContent = display.note;
        card.querySelector('.g-price-saving').textContent = display.saving;
        const link = card.querySelector('.g-card-talk');
        const url = new URL(link.href);
        url.searchParams.set('interval', interval);
        link.href = url.href;
      });
    });
  }
}
