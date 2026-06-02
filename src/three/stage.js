import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { setMaxAnisotropy } from './textures.js';

// A dark, premium "deep space" set lit mostly by the agent itself.
// Bloom turns every emissive surface (the core, the data threads) into glow.

function gradientBackground(top, bottom) {
  const c = document.createElement('canvas');
  c.width = 8;
  c.height = 256;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 8, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createStage(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: /[?&]capture/.test(location.search),
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  setMaxAnisotropy(renderer.capabilities.getMaxAnisotropy());

  const scene = new THREE.Scene();
  scene.background = gradientBackground('#0b0d1a', '#04050b');
  scene.fog = new THREE.FogExp2(0x05060c, 0.022);

  const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 1.5, 14);

  // Soft ambient + a cool key so the few lit surfaces read; the core is emissive.
  scene.add(new THREE.HemisphereLight(0x8390ff, 0x05060c, 0.5));
  const key = new THREE.DirectionalLight(0xa9b6ff, 0.6);
  key.position.set(4, 6, 8);
  scene.add(key);
  const warm = new THREE.PointLight(0x7c5cff, 1.2, 40, 2);
  warm.position.set(0, 0, 0);
  scene.add(warm);

  // Post-processing: bloom.
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.62, // strength
    0.7, // radius
    0.26 // threshold
  );
  composer.addPass(bloom);
  composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const callbacks = new Set();
  const clock = new THREE.Clock();
  let running = false;
  function loop() {
    if (!running) return;
    requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    callbacks.forEach((cb) => cb(dt, t));
    composer.render();
  }

  function onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    composer.setSize(w, h);
    bloom.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  return {
    renderer,
    scene,
    camera,
    composer,
    bloom,
    onFrame: (cb) => callbacks.add(cb),
    offFrame: (cb) => callbacks.delete(cb),
    renderOnce: () => composer.render(),
    start: () => {
      if (!running) {
        running = true;
        clock.start();
        loop();
      }
    },
    stop: () => {
      running = false;
    },
  };
}
