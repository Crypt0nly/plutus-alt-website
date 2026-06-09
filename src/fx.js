// Shared motion helpers.

export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Fade-up elements tagged `.reveal` as they enter the viewport (once each).
export function initReveals(selector = '.reveal') {
  const els = document.querySelectorAll(selector);
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
  );
  els.forEach((el) => io.observe(el));
}
