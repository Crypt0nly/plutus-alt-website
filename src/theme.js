// Dark/light theme. The inline <head> script resolves the theme before
// first paint (stored choice → OS preference → dark); this module renders
// the nav toggle and keeps the browser's theme colour in step. The choice
// persists in localStorage under the ocur-theme key.

import { currentLang } from './i18n.js';

// The browser chrome follows what is under it: the opening's stage at the top
// of the home page, otherwise the canvas of the current theme.
const STAGE = '#080a0e';
const CANVAS = { dark: '#000000', light: '#f2f2f7' };
const LABEL = {
  en: { toLight: 'Switch to light mode', toDark: 'Switch to dark mode' },
  de: { toLight: 'Zum hellen Modus wechseln', toDark: 'Zum dunklen Modus wechseln' },
};
// Lucide sun and moon, drawn with currentColor.
const SUN =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2m-7.07-17.07 1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';
const MOON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';

const currentTheme = () => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

export function syncThemeColor() {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) return;
  const onStage = document.documentElement.classList.contains('on-stage');
  meta.setAttribute('content', onStage ? STAGE : CANVAS[currentTheme()]);
}

export function initThemeToggle() {
  const nav = document.querySelector('.g-nav');
  if (!nav) return;
  const labels = LABEL[currentLang] || LABEL.en;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'g-theme';

  const render = () => {
    const theme = currentTheme();
    // moon in dark mode (tap → light), sun in light mode
    btn.innerHTML = theme === 'light' ? SUN : MOON;
    btn.setAttribute('aria-label', theme === 'light' ? labels.toDark : labels.toLight);
    btn.title = btn.getAttribute('aria-label');
    syncThemeColor();
  };

  btn.addEventListener('click', () => {
    const next = currentTheme() === 'light' ? 'dark' : 'light';
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
