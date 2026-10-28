// One keyboard-accessible navigation sheet for the public pages.
export function initMobileMenu({ onOpen = () => {} } = {}) {
  const burger = document.querySelector('.g-burger');
  const menu = document.getElementById('g-menu');
  if (!burger || !menu) return;
  const de = document.documentElement.lang === 'de';
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'g-menu-close';
  close.textContent = de ? 'Schließen' : 'Close';
  menu.prepend(close);
  menu.setAttribute('role', 'dialog');
  menu.setAttribute('aria-modal', 'true');
  menu.setAttribute('aria-label', 'Navigation');
  const blocked = new Map();
  const items = () => [...menu.querySelectorAll('a[href], button:not([disabled])')]
    .filter((el) => el.getClientRects().length);
  const setOpen = (open, restoreFocus = true) => {
    if (open === !menu.hidden) return;
    menu.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
    document.documentElement.classList.toggle('menu-open', open);
    if (open) {
      document.querySelectorAll('.g-nav, main, #g-dock, body > footer').forEach((el) => {
        blocked.set(el, el.inert);
        el.inert = true;
      });
      items()[0]?.focus();
      onOpen();
    } else {
      blocked.forEach((inert, el) => { el.inert = inert; });
      blocked.clear();
      if (restoreFocus) burger.focus();
    }
  };
  burger.addEventListener('click', () => setOpen(menu.hidden));
  close.addEventListener('click', () => setOpen(false));
  menu.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    setOpen(false);
    if (link.hash && new URL(link.href).pathname === location.pathname) {
      const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
      if (target) {
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    }
  });
  menu.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Tab') {
      const focusable = items();
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  });
  matchMedia('(min-width: 1101px)').addEventListener('change', (event) => {
    if (event.matches) setOpen(false, false);
  });
}
