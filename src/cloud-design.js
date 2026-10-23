import { renderCloudLanding, renderDesignBar } from './cloud-design-content.js';
import { initDesignSwitcher } from './design-switcher.js';

export function initCloudDesign(lang, onChange) {
  // Vite's dev German fallback needs the same content as the static /de build.
  if (document.querySelector('.c-landing')?.dataset.language !== lang) {
    document.querySelector('.c-landing').outerHTML = renderCloudLanding(lang);
    document.querySelector('.design-bar').outerHTML = renderDesignBar(lang);
  }
  const anchors = [...document.querySelectorAll('.g-nav a[href^="#"], .g-menu a[href^="#"]')];
  anchors.forEach(a => { a.dataset.classicHref = a.getAttribute('href'); });
  const targets = { '#demo': '#cloud-demo', '#system': '#cloud-system', '#features': '#cloud-system', '#start': '#cloud-start' };
  initDesignSwitcher(lang, (design) => {
    onChange(design);
    anchors.forEach(a => { a.href = design === 'cloud' ? targets[a.dataset.classicHref] || a.dataset.classicHref : a.dataset.classicHref; });
    const hashTarget = design === 'cloud' ? targets[location.hash] : Object.entries(targets).find(([, value]) => value === location.hash)?.[0];
    if (hashTarget) {
      const url = new URL(location.href);
      url.hash = hashTarget;
      history.replaceState(null, '', url);
    }
  });
  const tourButtons = [...document.querySelectorAll('[data-tour]')];
  tourButtons.forEach(button => button.addEventListener('click', () => {
    tourButtons.forEach(item => {
      const selected = item === button;
      item.setAttribute('aria-pressed', String(selected));
      document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
    });
  }));
  const dialog = document.getElementById('c-draft-dialog');
  const opener = document.querySelector('[data-open-tour]');
  opener.addEventListener('click', () => dialog.showModal());
  dialog.addEventListener('close', () => opener.focus({ preventScroll: true }));
}
