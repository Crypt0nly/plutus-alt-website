// One scroll timeline, shared with the site's existing GSAP / Lenis clock.
// The scene is an enhancement; failure never hides the HTML or blocks navigation.
export function initIntro({ gsap, ScrollTrigger, scrollTo }) {
  const intro = document.querySelector('.oc-intro');
  if (!intro) return;
  const art = intro.querySelector('.oc-art');
  const copies = [...intro.querySelectorAll('.oc-copy')];
  const chapters = [...intro.querySelectorAll('[data-chapter]')];
  const progressBar = intro.querySelector('.oc-progress span');
  const media = matchMedia('(min-width: 900px) and (min-height: 650px)');
  const abort = new AbortController();
  const state = { progress: 0 };
  let scene, trigger, tween, disposed = false, loading = false;
  let chapter = -1;

  const activate = (index) => {
    if (chapter === index) return;
    chapter = index;
    copies.forEach((copy, i) => {
      copy.classList.toggle('is-active', index === i);
      copy.inert = index !== i;
      copy.setAttribute('aria-hidden', String(index !== i));
    });
    chapters.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    intro.dataset.chapter = String(index);
  };
  const update = () => {
    activate(state.progress < .3 ? 0 : state.progress < .69 ? 1 : 2);
    progressBar.style.transform = `scaleX(${state.progress})`;
    scene?.setProgress(state.progress);
  };
  const layout = () => {
    tween?.kill();
    trigger?.kill();
    tween = trigger = null;
    // At high text zoom, use the normal document flow rather than clip copy.
    const content = intro.querySelector('.oc-content');
    const canPin = media.matches && parseFloat(getComputedStyle(document.documentElement).fontSize) <= 20 && content.offsetHeight < innerHeight - 175;
    intro.classList.toggle('is-flow', !canPin);
    intro.classList.toggle('is-scroll', canPin);
    state.progress = 0;
    if (canPin) {
      tween = gsap.to(state, {
        progress: 1, ease: 'none',
        scrollTrigger: {
          trigger: intro, start: 'top top', end: 'bottom bottom', scrub: .65,
          invalidateOnRefresh: true,
        },
        onUpdate: update,
      });
      trigger = tween.scrollTrigger;
    }
    update();
    ScrollTrigger.refresh();
  };
  chapters.forEach((button) => button.addEventListener('click', () => {
    if (trigger) scrollTo(trigger.start + (trigger.end - trigger.start) * [0, .49, .94][Number(button.dataset.chapter)]);
  }, { signal: abort.signal }));
  layout();
  let layoutFrame;
  const resize = new ResizeObserver(() => {
    cancelAnimationFrame(layoutFrame);
    layoutFrame = requestAnimationFrame(layout);
  });
  // Only observe copy size, not the sticky wrapper modified by layout().
  resize.observe(intro.querySelector('.oc-content'));
  media.addEventListener('change', layout, { signal: abort.signal });

  const observer = new IntersectionObserver(async ([entry]) => {
    if (!entry.isIntersecting || loading || disposed) return;
    loading = true;
    observer.disconnect();
    // Data-saver visitors get the vector artwork without downloading Three.js.
    if (navigator.connection?.saveData) return;
    try {
      const { createIntroScene } = await import('./intro-scene.js');
      if (disposed) return;
      scene = await createIntroScene(art);
      if (disposed) scene.dispose();
      else scene.setProgress(state.progress);
    } catch {
      // Unsupported WebGL, failed chunk/asset, or memory pressure: keep the poster.
      art.classList.remove('is-ready');
      art.dataset.renderer = 'fallback';
    }
  }, { rootMargin: '200px' });
  observer.observe(intro);

  const dispose = () => {
    disposed = true;
    abort.abort();
    cancelAnimationFrame(layoutFrame);
    observer.disconnect();
    resize.disconnect();
    tween?.kill();
    trigger?.kill();
    scene?.dispose();
    intro.classList.remove('is-scroll', 'is-flow');
    activate(0);
    progressBar.style.transform = 'scaleX(0)';
  };
  // bfcache keeps the initialized scene; visibilitychange pauses its drawing.
  addEventListener('pagehide', (event) => { if (!event.persisted) dispose(); }, { signal: abort.signal });
  return dispose;
}
