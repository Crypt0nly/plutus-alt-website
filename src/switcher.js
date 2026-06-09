import './switcher.css';

// Fixed bar at the very top of every page for flipping between the three
// design directions. Each variant's CSS offsets its own nav by --switch-h.

const VARIANTS = [
  { id: 'minimal', num: '01', label: 'Minimal', href: './index.html' },
  { id: 'neon', num: '02', label: 'Neon', href: './neon.html' },
  { id: 'convert', num: '03', label: 'Converter', href: './convert.html' },
];

export function mountSwitcher(current) {
  const bar = document.createElement('div');
  bar.className = 'switcher';
  bar.innerHTML = `
    <span class="switcher-label">Plutus · design directions</span>
    <nav class="switcher-tabs" aria-label="Design variants">
      ${VARIANTS.map(
        (v) => `
        <a href="${v.href}" class="${v.id === current ? 'active' : ''}"
           ${v.id === current ? 'aria-current="page"' : ''}>
          <span class="num">${v.num}</span>${v.label}
        </a>`
      ).join('')}
    </nav>
  `;
  document.body.prepend(bar);
}
