import './cloud-design.css';
import { renderDesignBar } from './cloud-design-content.js';
import { DESIGN_KEY, designUrl, resolveDesign } from './design-choice.js';

export function initDesignSwitcher(lang, onChange = () => {}) {
  const root = document.documentElement;
  let stored;
  try { stored = localStorage.getItem(DESIGN_KEY); } catch { /* optional */ }
  if (!document.querySelector('.design-bar')) document.body.insertAdjacentHTML('afterbegin', renderDesignBar(lang));
  const choices = [...document.querySelectorAll('[data-design-choice]')];
  const sync = (design, persist = false) => {
    onChange(design);
    root.dataset.design = design;
    choices.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.designChoice === design)));
    document.querySelectorAll('.g-lang a').forEach(a => { a.href = designUrl(a.href, design); });
    // Carry the choice to reading pages and back without relying on storage.
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (href.startsWith('#')) return;
      const url = new URL(a.href);
      if (url.origin === location.origin && !url.pathname.startsWith('/be-ai')) a.href = designUrl(a.href, design);
    });
    if (persist) {
      history.replaceState(null, '', designUrl(location.href, design));
      try { localStorage.setItem(DESIGN_KEY, design); } catch { /* optional */ }
    }
    document.dispatchEvent(new Event('ocur-design-change'));
  };
  sync(resolveDesign(location.search, stored));
  choices.forEach(button => button.addEventListener('click', () => {
    if (root.dataset.design !== button.dataset.designChoice) sync(button.dataset.designChoice, true);
  }));
}
