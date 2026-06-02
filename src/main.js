import './style.css';
import * as THREE from 'three';
import { createStage } from './three/stage.js';
import { createStore } from './three/store.js';
import { createCameraRig } from './three/camera-rig.js';
import { createInteraction } from './three/interaction.js';
import { createOverlay } from './ui/overlay.js';
import { createDetailSheet } from './ui/detail.js';

// keep the experience starting at the top of the aisle on reload
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

const loader = document.getElementById('loader');
const loaderFill = document.getElementById('loader-fill');
const loaderNote = document.getElementById('loader-note');
const setProgress = (frac, note) => {
  loaderFill.style.width = Math.round(frac * 100) + '%';
  if (note) loaderNote.textContent = note;
};

async function boot() {
  const canvas = document.getElementById('scene');
  const stage = createStage(canvas);

  const detail = createDetailSheet();

  // selecting a product (from a card button or a 3D click) opens its sheet
  const overlay = createOverlay({ onSelect: (product) => detail.open(product) });

  setProgress(0.05, 'Stocking the shelves…');
  const store = await createStore(stage.scene, (f) =>
    setProgress(0.05 + f * 0.88, 'Stocking the shelves…')
  );

  // camera stations, in section order: hero → each product → checkout
  const stations = [
    store.heroStation,
    ...store.items.map((it) => it.station),
    { pos: new THREE.Vector3(0, 2.5, 9.4), target: new THREE.Vector3(0, 1.0, -0.4) },
  ];
  // section elements in station order — the rig anchors the camera to these
  const sections = Array.from(document.querySelectorAll('[data-station]')).sort(
    (a, b) => Number(a.dataset.station) - Number(b.dataset.station)
  );
  const rig = createCameraRig(stage.camera, stations, sections);

  const interaction = createInteraction({
    renderer: stage.renderer,
    camera: stage.camera,
    items: store.items,
    onSelect: (it) => detail.open(it.product),
  });

  stage.onFrame((dt, t) => {
    store.update(dt, t);
    rig.update(dt);

    const idx = rig.activeIndex;
    overlay.setActive(idx);
    const productItem = idx >= 1 && idx <= store.items.length ? store.items[idx - 1] : null;
    store.setFocused(productItem);

    interaction.setEnabled(!detail.isOpen);
    interaction.refreshHover();
  });

  // expose a tiny handle (handy for debugging / embedding controls)
  window.__PLUTUS = { stage, rig, store, overlay, detail };

  setProgress(1, 'Open for business');
  stage.start();

  // a couple of frames to ensure the first render is on screen, then reveal
  await new Promise((r) => requestAnimationFrame(r));
  await new Promise((r) => requestAnimationFrame(r));
  loader.classList.add('hide');
  setTimeout(() => loader.remove(), 700);
}

boot().catch((err) => {
  console.error(err);
  setProgress(1, 'Something went wrong loading the store.');
  loaderNote.textContent = 'WebGL failed to start — please try a modern browser.';
});
