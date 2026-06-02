import './style.css';
import Lenis from 'lenis';
import { createStage } from './three/stage.js';
import { createWorld } from './three/world.js';
import { createCameraRig } from './three/camera-rig.js';
import { createOverlay } from './ui/overlay.js';

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

const capture = /[?&]capture/.test(location.search);
const loader = document.getElementById('loader');
const loaderFill = document.getElementById('loader-fill');
const loaderNote = document.getElementById('loader-note');
const setProgress = (frac, note) => {
  loaderFill.style.width = Math.round(frac * 100) + '%';
  if (note) loaderNote.textContent = note;
};
const nextFrame = () => new Promise((r) => requestAnimationFrame(r));

async function boot() {
  const canvas = document.getElementById('scene');
  const stage = createStage(canvas);

  // smooth-scroll inertia — the premium feel. Disabled for headless capture.
  let lenis = null;
  if (!capture) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1, smoothWheel: true });
    window.__lenis = lenis;
  }

  const overlay = createOverlay();
  const progressBar = document.getElementById('progress');

  setProgress(0.2, 'Booting the agent…');
  await nextFrame();
  const world = createWorld(stage.scene);
  setProgress(0.85, 'Connecting your tools…');
  await nextFrame();

  const sections = Array.from(document.querySelectorAll('[data-station]')).sort(
    (a, b) => Number(a.dataset.station) - Number(b.dataset.station)
  );
  const rig = createCameraRig(stage.camera, world.stations, sections);

  stage.onFrame((dt, t) => {
    if (lenis) lenis.raf(performance.now());
    rig.update(dt);
    world.update(dt, t, { index: rig.index, localT: rig.localT, progress: rig.progress, camera: stage.camera });
    overlay.setActive(rig.activeIndex);
    if (progressBar) progressBar.style.transform = `scaleX(${rig.progress})`;
  });

  window.__PLUTUS = { stage, world, rig, overlay, lenis };

  setProgress(1, 'Ready');
  stage.start();
  await nextFrame();
  await nextFrame();
  loader.classList.add('hide');
  setTimeout(() => loader.remove(), 700);
}

boot().catch((err) => {
  console.error(err);
  loaderNote.textContent = 'WebGL failed to start — please try a modern browser.';
});
