import './product-showcase.css';

// Local product illustrations only: these controls never submit real work.
export function initProductShowcase({ onLayout = () => {} } = {}) {
  const root = document.querySelector('.ps-section');
  if (!root) return;
  const tabs = [...root.querySelectorAll('[data-product]')];
  const panels = [...root.querySelectorAll('[data-product-panel]')];
  const choose = (tab, focus = false) => {
    tabs.forEach((item) => {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
    });
    panels.forEach((panel) => { panel.hidden = panel.dataset.productPanel !== tab.dataset.product; });
    if (focus) tab.focus();
    requestAnimationFrame(onLayout);
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => choose(tab));
    tab.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); choose(tabs[next], true); }
    });
  });
  choose(tabs[0]);

  const bindPreview = (control, view, controlData, viewData) => {
    const buttons = [...root.querySelectorAll(control)];
    const views = [...root.querySelectorAll(view)];
    buttons.forEach((button) => button.addEventListener('click', () => {
      buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      views.forEach((item) => { item.hidden = item.dataset[viewData] !== button.dataset[controlData]; });
      if (controlData === 'desk') root.querySelector('[data-desk-heading]').textContent = button.textContent.trim();
    }));
  };
  bindPreview('[data-desk]', '[data-desk-view]', 'desk', 'deskView');
  bindPreview('[data-drop]', '[data-drop-chat]', 'drop', 'dropChat');
  bindPreview('[data-world]', '[data-world-note]', 'world', 'worldNote');

  // Keep the existing sales dock from covering the product demonstration.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      document.documentElement.classList.toggle('product-in-view', entry.isIntersecting);
    }, { rootMargin: '-10% 0px -10% 0px' }).observe(root);
  }
}
