import { dampProgress, captionOpacity } from './intro-timing.js';

// Native scroll -> one requestAnimationFrame -> one synchronous GPU draw.
// No Lenis, ScrollTrigger scrub, nested render callback, or pointer animation.
export function initIntro({ onLayout = () => {} } = {}) {
  const intro = document.querySelector('.oc-intro');
  if (!intro) return;
  const art = intro.querySelector('.oc-art');
  const stage = intro.querySelector('.oc-stage');
  const captions = [...intro.querySelectorAll('.oc-caption span')];
  const hint = intro.querySelector('.oc-scroll');
  const nav = document.querySelector('.g-nav');
  const abort = new AbortController();
  const { signal } = abort;
  let scene, frame = 0, lastTime = 0, disposed = false;
  let progress = 0, target = 0, start = 0, distance = 1, viewport = innerHeight;
  let focused = false, drawing = false, loading = false;
  let samples = 0, frames = 0, elapsed = 0;
  const canAnimate = () => !navigator.connection?.saveData &&
    parseFloat(getComputedStyle(document.documentElement).fontSize) <= 20 && innerHeight >= 420;

  const focusStage = (value) => {
    if (value === focused) return;
    focused = value;
    document.documentElement.classList.toggle('intro-focused', value);
    if (nav) nav.inert = value;
  };
  const syncScroll = () => {
    const y = scrollY - start;
    target = Math.max(0, Math.min(1, y / distance));
    focusStage(y >= -viewport && y < distance + 80);
    drawing = y > -viewport && y < distance + viewport;
    if (drawing) requestFrame();
  };
  const resize = () => {
    if (disposed) return;
    if (intro.classList.contains('is-cinematic') && !canAnimate()) {
      intro.classList.remove('is-cinematic', 'is-scroll');
      scene?.dispose();
      onLayout();
    }
    viewport = stage.clientHeight;
    start = intro.getBoundingClientRect().top + scrollY;
    distance = Math.max(1, intro.offsetHeight - viewport);
    scene?.resize();
    syncScroll();
  };
  function tick(time) {
    frame = 0;
    if (disposed || document.hidden || !drawing) { lastTime = 0; return; }
    const dt = lastTime ? Math.min(time - lastTime, 64) : 16.67;
    progress = dampProgress(progress, target, dt);
    // Caption fades are tied to the same frame and progress as the sculpture.
    captions.forEach((caption, i) => { caption.style.opacity = String(captionOpacity(i, progress)); });
    hint.style.opacity = String(Math.max(0, 1 - progress / .07));
    hint.inert = progress > .07;
    scene?.draw(progress, dt);
    if (lastTime) { samples++; elapsed += time - lastTime; }
    lastTime = time;
    frames++;
    // Diagnostic counters are sampled, not rewritten in the DOM every frame.
    if (frames % 30 === 0) {
      art.dataset.frames = String(frames);
      art.dataset.draws = String(scene?.drawCount || 0);
      art.dataset.frameMs = String(Math.round(elapsed / Math.max(1, samples) * 10) / 10);
    }
    if (Math.abs(target - progress) > .00008) requestFrame();
    else {
      lastTime = 0;
      art.dataset.frames = String(frames);
      art.dataset.draws = String(scene?.drawCount || 0);
      intro.dataset.progress = progress.toFixed(3);
    }
  }
  function requestFrame() {
    if (!frame && !disposed && !document.hidden) frame = requestAnimationFrame(tick);
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);
  addEventListener('scroll', syncScroll, { passive: true, signal });
  addEventListener('resize', resize, { passive: true, signal });
  document.addEventListener('visibilitychange', () => {
    cancelAnimationFrame(frame); frame = 0; lastTime = 0;
    if (!document.hidden) syncScroll();
  }, { signal });
  // Standard anchor behavior also moves focus beyond the introduction.
  intro.querySelectorAll('a[href="#oc-next"]').forEach((link) => {
    link.addEventListener('click', () => {
      focusStage(false);
      document.getElementById('oc-next').focus({ preventScroll: true });
    }, { signal });
  });

  const textObserver = new MutationObserver(resize);
  textObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
  const observer = new IntersectionObserver(async ([entry]) => {
    if (!entry.isIntersecting || loading || disposed || !canAnimate()) return;
    loading = true;
    observer.disconnect();
    try {
      const { createIntroScene } = await import('./intro-scene.js');
      if (disposed) return;
      scene = await createIntroScene(art, {
        text: [...intro.querySelectorAll('.oc-script > *')].map((el) => [...el.querySelectorAll('span')].map((line) => line.textContent)),
        invalidate: requestFrame,
        onFallback: () => {
          intro.classList.remove('is-cinematic', 'is-scroll');
          resize();
          onLayout();
        },
      });
      if (disposed) { scene.dispose(); return; }
      // Do not insert a long pin after someone has already skipped the opening.
      if (scrollY > start + viewport * .6) { scene.dispose(); return; }
      // Pin only after a successful first draw. A slow/missing chunk cannot leave a blank scroll trap.
      scene.draw(0, 16.67);
      if (art.dataset.renderer === 'webgl') {
        intro.classList.add('is-cinematic', 'is-scroll');
        resize();
        // Loading may finish after a small native scroll. Start at the new
        // range's actual position, not the previous one-screen fallback value.
        progress = target;
        lastTime = 0;
        onLayout();
      }
    } catch {
      art.dataset.renderer = 'fallback';
    }
  }, { rootMargin: '200px' });
  observer.observe(intro);
  resize();
  const dispose = () => {
    disposed = true;
    abort.abort();
    cancelAnimationFrame(frame);
    observer.disconnect();
    resizeObserver.disconnect();
    textObserver.disconnect();
    scene?.dispose();
    intro.classList.remove('is-scroll', 'is-cinematic');
    focusStage(false);
    hint.style.opacity = ''; hint.inert = false;
  };
  addEventListener('pagehide', (event) => { if (!event.persisted) dispose(); }, { signal });
  return dispose;
}
