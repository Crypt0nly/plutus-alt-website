// Plan prices for both ladders and the billing switches above them. Totals
// match plutus-cloud/frontend/src/lib/plans.ts, in USD and EUR (same number).
//
// Every paid card's button is a purchase: it signs the visitor up (or in)
// with `plan`, `interval` and `checkout=1`, and the app goes straight on to
// Stripe Checkout for that plan and billing period (company plans first pick
// or create the organization that pays). So a switch here sets the interval
// on the buttons, not only the price on the cards.
export const COMPANY_PRICES = {
  team: { month: 399, semiannual: 2300, year: 4389 },
  growth: { month: 1500, semiannual: 8500, year: 16500 },
  scale: { month: 5000, semiannual: 28500, year: 55000 },
};

// Annual is 10× monthly: two months free.
export const SOLO_PRICES = {
  starter: { month: 29, year: 290 },
  pro: { month: 149, year: 1490 },
  'pro-plus': { month: 299, year: 2990 },
};

const money = (value, de) =>
  `${de ? '€' : '$'}${value.toLocaleString(de ? 'de-DE' : 'en-US', { maximumFractionDigits: 2 })}`;

const monthsIn = (interval) => (interval === 'year' ? 12 : interval === 'semiannual' ? 6 : 1);

function period(interval, de) {
  if (interval === 'year') return de ? '/Jahr' : '/year';
  if (interval === 'semiannual') return de ? '/6 Monate' : '/6 months';
  return de ? '/Monat' : '/month';
}

// "$124.17 / month equivalent · billed annually" for a longer billing period.
function equivalent(amount, interval, de) {
  const n = monthsIn(interval);
  const billed = de
    ? (n === 6 ? 'alle 6 Monate abgerechnet' : 'jährlich abgerechnet')
    : (n === 6 ? 'billed every 6 months' : 'billed annually');
  return `${money(amount / n, de)} ${de ? '/ Monat im Vergleich' : '/ month equivalent'} · ${billed}`;
}

function saving(monthly, amount, interval, de) {
  const n = monthsIn(interval);
  if (n === 1) return '';
  const saved = money(monthly * n - amount, de);
  return de
    ? `${saved} ${n === 6 ? 'alle 6 Monate' : 'im Jahr'} sparen`
    : `Save ${saved} ${n === 6 ? 'every 6 months' : 'a year'}`;
}

export function companyPrice(plan, interval, lang = 'en') {
  const prices = COMPANY_PRICES[plan];
  const amount = prices[interval];
  const de = lang === 'de';
  return {
    amount: money(amount, de),
    period: period(interval, de),
    note: monthsIn(interval) === 1
      ? (de
        ? `6 Monate: ${money(prices.semiannual, de)} · Jahr: ${money(prices.year, de)}`
        : `6 months: ${money(prices.semiannual, de)} · Year: ${money(prices.year, de)}`)
      : equivalent(amount, interval, de),
    saving: saving(prices.month, amount, interval, de),
  };
}

export function soloPrice(plan, interval, lang = 'en') {
  const prices = SOLO_PRICES[plan];
  const yearly = interval === 'year';
  const amount = yearly ? prices.year : prices.month;
  const de = lang === 'de';
  return {
    amount: money(amount, de),
    period: period(yearly ? 'year' : 'month', de),
    note: yearly
      ? equivalent(amount, 'year', de)
      : (de
        ? `oder ${money(prices.year, de)} im Jahr — 2 Monate geschenkt`
        : `or ${money(prices.year, de)} a year — 2 months free`),
    saving: yearly ? saving(prices.month, amount, 'year', de) : '',
  };
}

// One switch drives one ladder's cards: prices, notes and the buy links.
function wireLadder(root, { interval: intervalKey, plan: planKey }, priceOf, lang) {
  const attr = (key) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
  const buttons = [...root.querySelectorAll(`[data-${attr(intervalKey)}]`)];
  const cards = [...root.querySelectorAll(`[data-${attr(planKey)}]`)];
  for (const button of buttons) {
    button.addEventListener('click', () => {
      const interval = button.dataset[intervalKey];
      buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      cards.forEach((card) => {
        const display = priceOf(card.dataset[planKey], interval, lang);
        const price = card.querySelector('.g-price');
        price.replaceChildren(document.createTextNode(display.amount));
        const unit = document.createElement('span');
        unit.textContent = display.period;
        price.append(unit);
        card.querySelector('.g-price-alt').textContent = display.note;
        card.querySelector('.g-price-saving').textContent = display.saving;
        // the card's button buys this plan on this billing period
        const link = card.querySelector('a[href^="https://app.ocur.ai"]');
        const url = new URL(link.href);
        url.searchParams.set('interval', interval);
        link.href = url.href;
      });
    });
  }
}

export function initPricing(root, lang) {
  wireLadder(root, { interval: 'billingInterval', plan: 'companyPlan' }, companyPrice, lang);
  wireLadder(root, { interval: 'soloInterval', plan: 'soloPlan' }, soloPrice, lang);
}
