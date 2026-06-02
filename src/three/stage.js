import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { setMaxAnisotropy } from './textures.js';

// The studio: renderer, scene, camera, lights, environment + floor.
// A clean, bright "product photography" set so the packaging reads like a catalog.

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
    // only when capturing screenshots in a headless browser
    preserveDrawingBuffer: /[?&]capture/.test(location.search),
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  setMaxAnisotropy(renderer.capabilities.getMaxAnisotropy());

  const scene = new THREE.Scene();
  scene.background = gradientBackground('#fdfbf6', '#e7e9ee');

  const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 1.6, 7);

  // Soft image-based reflections from a procedural room (no HDR file needed).
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new RoomEnvironment();
  scene.environment = pmrem.fromScene(envScene, 0.04).texture;

  // Lighting — a studio key/fill/rim setup.
  const hemi = new THREE.HemisphereLight(0xffffff, 0xb9bec9, 0.55);
  scene.add(hemi);

  const key = new THREE.DirectionalLight(0xfff4e2, 2.6);
  key.position.set(5, 9, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 40;
  key.shadow.camera.left = -9;
  key.shadow.camera.right = 9;
  key.shadow.camera.top = 9;
  key.shadow.camera.bottom = -9;
  key.shadow.bias = -0.00015;
  key.shadow.normalBias = 0.02;
  key.shadow.radius = 6;
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xdfe7ff, 0.8);
  fill.position.set(-6, 4, 4);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(0xffffff, 1.1);
  rim.position.set(-3, 6, -8);
  scene.add(rim);

  // Floor — a soft studio sweep that catches shadows.
  const floorTex = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 512;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(256, 200, 30, 256, 256, 360);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(1, '#dfe2e8');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 512);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  })();
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 80),
    new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.55, metalness: 0.0 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  floor.receiveShadow = true;
  scene.add(floor);

  // Render loop with registered per-frame callbacks.
  const callbacks = new Set();
  const clock = new THREE.Clock();
  let running = false;
  function loop() {
    if (!running) return;
    requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    callbacks.forEach((cb) => cb(dt, t));
    renderer.render(scene, camera);
  }

  function onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  window.addEventListener('resize', onResize);

  return {
    renderer,
    scene,
    camera,
    floor,
    onFrame: (cb) => callbacks.add(cb),
    offFrame: (cb) => callbacks.delete(cb),
    renderOnce: () => renderer.render(scene, camera),
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
