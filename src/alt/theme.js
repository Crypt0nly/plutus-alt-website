// Dark/light theme for Design B. The inline <head> script resolves the
// theme before first paint (stored choice → OS preference → dark); this
// module renders the nav toggle and keeps the meta theme-color in sync.
// The choice is stored under the same ocur-theme key as Design A, so it
// carries across both designs.

import { currentLang } from './i18n.js';

const META_COLOR = { dark: '#060608', light: '#eaecf1' };
const LABEL = {
  en: { toLight: 'Switch to light mode', toDark: 'Switch to dark mode' },
  de: { toLight: 'Zum hellen Modus wechseln', toDark: 'Zum dunklen Modus wechseln' },
};

export function initThemeToggle() {
  const nav = document.querySelector('.g-nav');
  if (!nav) return;
  const meta = document.querySelector('meta[name="theme-color"]');
  const labels = LABEL[currentLang] || LABEL.en;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'g-theme';

  const render = () => {
    const theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
    if (meta) meta.setAttribute('content', META_COLOR[theme]);
    // moon in dark mode (tap → light), sun in light mode
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
  nav.insertBefore(btn, nav.querySelector('.g-btn-sm'));
}
