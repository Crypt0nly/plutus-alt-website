// The slim design-switcher bar shown at the very top of every page while
// the two design directions are being compared. Self-contained: injects
// its own styles. Delete this module (and its init calls) to retire the
// preview.

export function initDesignBar(active) {
  const style = document.createElement('style');
  style.textContent = `
    .ocur-designbar {
      position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
      height: 34px; display: flex; align-items: center; justify-content: center;
      gap: 12px; padding: 0 12px;
      background: rgba(12, 11, 16, 0.88);
      -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.12);
      font-family: Inter, -apple-system, sans-serif; font-size: 11.5px;
      letter-spacing: 0.03em; color: rgba(255, 255, 255, 0.55);
      white-space: nowrap; overflow-x: auto;
    }
    .ocur-designbar a {
      color: rgba(255, 255, 255, 0.75); text-decoration: none;
      padding: 3px 12px; border-radius: 999px; font-weight: 600;
      transition: color .2s ease, background .2s ease;
    }
    .ocur-designbar a:hover { color: #fff; }
    .ocur-designbar a.on { color: #131210; background: #f2942e; }
    html.has-designbar { scroll-padding-top: 110px; }
  `;
  document.head.appendChild(style);

  const bar = document.createElement('div');
  bar.className = 'ocur-designbar';
  bar.innerHTML =
    '<span>Design preview</span>' +
    `<a href="/" ${active === 'a' ? 'class="on" aria-current="true"' : ''}>A · Midnight Aurora</a>` +
    `<a href="/alt/" ${active === 'b' ? 'class="on" aria-current="true"' : ''}>B · Obsidian Glass</a>`;
  document.body.prepend(bar);
  document.documentElement.classList.add('has-designbar');
}
