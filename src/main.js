import './style.css';
import { createStage } from './three/stage.js';
import { createWorld } from './three/world.js';
import { createCameraRig } from './three/camera-rig.js';
import { createOverlay } from './ui/overlay.js';

// Always begin the story at the top.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

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
  const overlay = createOverlay();

  setProgress(0.2, 'Booting the agent…');
  await nextFrame();
  const world = createWorld(stage.scene);
  setProgress(0.85, 'Connecting your tools…');
  await nextFrame();

  // section elements in station order — the rig anchors the camera to these
  const sections = Array.from(document.querySelectorAll('[data-station]')).sort(
    (a, b) => Number(a.dataset.station) - Number(b.dataset.station)
  );
  const rig = createCameraRig(stage.camera, world.stations, sections);

  stage.onFrame((dt, t) => {
    rig.update(dt);
    world.update(dt, t, stage.camera);
    const idx = rig.activeIndex;
    overlay.setActive(idx);
    world.setActive(idx);
  });

  // small handle for debugging / headless capture
  window.__PLUTUS = { stage, world, rig, overlay };

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
