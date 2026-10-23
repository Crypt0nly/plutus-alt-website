import { WebGLRenderer, Scene, PerspectiveCamera, BufferGeometry, BufferAttribute,
  ShaderMaterial, Points, Color, NormalBlending } from 'three';
import { particleShapes } from './intro-particles.js';

const vertexShader = `
  attribute vec3 aSphere;
  attribute vec3 aFox;
  attribute float aSeed;
  uniform float uProgress;
  uniform float uDpr;
  uniform float uCameraZ;
  varying float vSeed;
  varying float vDepth;
  void main() {
    float gather = smoothstep(0.08, 0.48, uProgress);
    float resolve = smoothstep(0.55, 0.88, uProgress);
    vec3 p = mix(position, aSphere, gather);
    p = mix(p, aFox, resolve);
    // A brief outward drift makes the transition read as a reorganization.
    float scatter = sin(gather * 3.14159) * 0.16 + sin(resolve * 3.14159) * 0.13;
    p += normalize(position) * scatter * sin(aSeed * 53.0 + uProgress * 9.0);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp((0.6 + aSeed * 1.35) * uDpr * (13.0 / -mv.z), 1.0, 6.0);
    vDepth = clamp(0.7 + (mv.z + uCameraZ) / 5.0, 0.35, 1.0);
    vSeed = aSeed;
  }
`;
const fragmentShader = `
  uniform vec3 uColor;
  uniform vec3 uHighlight;
  uniform float uLight;
  varying float vSeed;
  varying float vDepth;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float alpha = (1.0 - smoothstep(0.12, 0.5, d)) * (0.35 + 0.6 * vSeed) * vDepth;
    vec3 color = mix(uColor, uHighlight, pow(vSeed, 4.0));
    gl_FragColor = vec4(color, alpha * mix(1.0, 0.88, uLight));
    #include <colorspace_fragment>
  }
`;

async function sampleLogo() {
  const img = new Image();
  img.src = '/logo.svg';
  await img.decode();
  const canvas = document.createElement('canvas');
  canvas.width = 192;
  canvas.height = 164;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, 192, 164);
  const data = ctx.getImageData(0, 0, 192, 164).data;
  const pixels = [];
  for (let y = 0; y < 164; y++) for (let x = 0; x < 192; x++) {
    if (data[(y * 192 + x) * 4 + 3] > 128) pixels.push([x / 192 - .5, (.5 - y / 164) * 164 / 192]);
  }
  if (!pixels.length) throw new Error('Empty brand silhouette');
  return pixels;
}

export async function createIntroScene(art) {
  // Decode before allocating a GPU context, so an asset failure leaves no resources.
  const pixels = await sampleLogo();
  const narrow = matchMedia('(max-width: 899px)').matches;
  const count = narrow ? 6500 : 18000;
  const renderer = new WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
  const scene = new Scene();
  const camera = new PerspectiveCamera(38, 1, .1, 30);
  camera.position.z = 7.8;
  const geometry = new BufferGeometry();
  const shapes = particleShapes(count, pixels);
  geometry.setAttribute('position', new BufferAttribute(shapes.orbit, 3));
  geometry.setAttribute('aSphere', new BufferAttribute(shapes.sphere, 3));
  geometry.setAttribute('aFox', new BufferAttribute(shapes.fox, 3));
  geometry.setAttribute('aSeed', new BufferAttribute(shapes.seeds, 1));
  const uniforms = {
    uProgress: { value: 0 }, uDpr: { value: 1 }, uLight: { value: 0 }, uCameraZ: { value: 7.8 },
    uColor: { value: new Color('#ed9339') }, uHighlight: { value: new Color('#fff1d5') },
  };
  const material = new ShaderMaterial({ vertexShader, fragmentShader, uniforms,
    transparent: true, depthWrite: false, blending: NormalBlending });
  const sculpture = new Points(geometry, material);
  sculpture.frustumCulled = false; // GPU morph targets extend beyond the initial bounds.
  scene.add(sculpture);
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  art.querySelector('.oc-webgl').append(canvas);
  let frame = 0, disposed = false, visible = true, progress = 0;
  let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0;
  let frameCount = 0, slowFrames = 0, lastTime = 0;
  let shaderFailed = false;
  renderer.debug.onShaderError = () => { shaderFailed = true; };
  let dpr = Math.min(devicePixelRatio || 1, narrow ? 1.25 : 1.5);
  const abort = new AbortController();
  const signal = abort.signal;

  const render = (time) => {
    frame = 0;
    if (disposed || !visible || document.hidden) return;
    // A sustained slow interactive sequence lowers resolution and point count once.
    if (lastTime && time - lastTime > 30 && time - lastTime < 150) slowFrames++;
    lastTime = time;
    if (slowFrames === 18) {
      dpr = Math.min(dpr, 1);
      renderer.setPixelRatio(dpr);
      uniforms.uDpr.value = dpr;
      geometry.setDrawRange(0, Math.min(count, 9000));
      slowFrames++;
    }
    pointerX += (targetX - pointerX) * .1;
    pointerY += (targetY - pointerY) * .1;
    const resolve = Math.max(0, Math.min(1, (progress - .55) / .33));
    sculpture.rotation.set(
      (-.42 + pointerY * .12) * (1 - resolve),
      (.3 + progress * .7 + pointerX * .17) * (1 - resolve),
      -.32 * (1 - resolve),
    );
    uniforms.uProgress.value = progress;
    try { renderer.render(scene, camera); }
    catch { dispose(); return; }
    if (shaderFailed) { dispose(); return; }
    art.classList.add('is-ready');
    art.dataset.renderer = 'webgl';
    art.dataset.frames = String(++frameCount);
    if (Math.abs(targetX - pointerX) + Math.abs(targetY - pointerY) > .002) requestRender();
  };
  function requestRender() {
    if (!frame && !disposed && visible && !document.hidden) frame = requestAnimationFrame(render);
  }
  const resize = () => {
    const { width, height } = art.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    uniforms.uDpr.value = dpr;
    camera.aspect = width / height;
    // Keep the sculpture inside a narrow portrait canvas as well as wide screens.
    camera.position.z = Math.max(7.8, 7.1 / camera.aspect);
    uniforms.uCameraZ.value = camera.position.z;
    camera.updateProjectionMatrix();
    requestRender();
  };
  const updateTheme = () => {
    const light = document.documentElement.dataset.theme === 'light';
    uniforms.uLight.value = Number(light);
    uniforms.uColor.value.set(light ? '#a34a12' : '#ed9339');
    uniforms.uHighlight.value.set(light ? '#d58334' : '#fff1d5');
    requestRender();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(art);
  const themeObserver = new MutationObserver(updateTheme);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    lastTime = 0;
    if (visible) requestRender();
    else { cancelAnimationFrame(frame); frame = 0; }
  });
  visibilityObserver.observe(art);
  document.addEventListener('visibilitychange', () => {
    lastTime = 0;
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
    else requestRender();
  }, { signal });
  const stage = art.closest('.oc-stage');
  if (matchMedia('(pointer: fine)').matches) {
    stage.addEventListener('pointermove', (event) => {
      const rect = stage.getBoundingClientRect();
      targetX = (event.clientX - rect.left) / rect.width - .5;
      targetY = (event.clientY - rect.top) / rect.height - .5;
      requestRender();
    }, { passive: true, signal });
    stage.addEventListener('pointerleave', () => { targetX = targetY = 0; requestRender(); }, { signal });
  }
  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    abort.abort();
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    themeObserver.disconnect();
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
    art.classList.remove('is-ready');
    art.dataset.renderer = 'fallback';
  }
  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    dispose(); // Permanent vector fallback; do not repeatedly allocate a failing GPU context.
  }, { signal });
  updateTheme();
  resize();
  return { setProgress(value) { progress = value; requestRender(); }, dispose };
}
