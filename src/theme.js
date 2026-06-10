// Dark/light theme. The inline <head> script resolves the theme before
// first paint (stored choice → OS preference → dark); this module just
// renders the nav toggle and keeps the meta theme-color in sync.

import { currentLang } from './i18n.js';

const META_COLOR = { dark: '#0b0b1a', light: '#f7f5ff' };
const LABEL = {
  en: { toLight: 'Switch to light mode', toDark: 'Switch to dark mode' },
  de: { toLight: 'Zum hellen Modus wechseln', toDark: 'Zum dunklen Modus wechseln' },
};

export function initThemeToggle() {
  const nav = document.querySelector('.mg-nav');
  if (!nav) return;
  const meta = document.querySelector('meta[name="theme-color"]');
  const labels = LABEL[currentLang] || LABEL.en;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'mg-theme';

  const render = () => {
    const theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
    if (meta) meta.setAttribute('content', META_COLOR[theme]);
    // show the moon in dark mode (tap → light), the sun in light mode
    btn.textContent = theme === 'light' ? '☀︎' : '☾';
    btn.setAttribute('aria-label', theme === 'light' ? labels.toDark : labels.toLight);
    btn.title = btn.getAttribute('aria-label');
  };

  btn.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('ocur-theme', next);
    } catch {
      /* ignore */
    }
    render();
  });

  render();
  nav.insertBefore(btn, nav.querySelector('.mg-btn-small'));
}
