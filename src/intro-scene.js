import { WebGLRenderer, Scene, OrthographicCamera, BufferGeometry, BufferAttribute,
  ShaderMaterial, Points, Color } from 'three';
import { particleShapes } from './intro-particles.js';

const vertexShader = `
  attribute vec3 aSphere;
  attribute vec3 aFox;
  attribute vec3 aWordsOne;
  attribute vec3 aWordsTwo;
  attribute float aSeed;
  uniform float uProgress;
  uniform float uDpr;
  uniform float uShapeScale;
  uniform float uTextScale;
  varying float vSeed;
  varying float vText;
  void main() {
    float p = uProgress;
    float a = smoothstep(.08, .25, p);
    float b = smoothstep(.36, .49, p);
    float c = smoothstep(.60, .76, p);
    float d = smoothstep(.87, .98, p);
    float angle = -.38 + p * 1.6;
    mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    vec3 orbit = position;
    orbit.yz = rotation * orbit.yz;
    orbit.xy = mat2(.94, -.34, .34, .94) * orbit.xy;
    vec3 globe = aSphere;
    globe.xz = rotation * globe.xz;
    vec3 point = mix(orbit * uShapeScale, aWordsOne * uTextScale, a);
    point = mix(point, globe * uShapeScale, b);
    point = mix(point, aWordsTwo * uTextScale, c);
    point = mix(point, aFox * uShapeScale, d);
    float travel = sin(a * 3.14159) + sin(b * 3.14159) + sin(c * 3.14159) + sin(d * 3.14159);
    point.z += travel * sin(aSeed * 31.0) * .4;
    point.xy += normalize(position.xy) * travel * sin(aSeed * 13.0) * .15;
    vText = a * (1.0 - b) + c * (1.0 - d);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(point, 1.0);
    gl_PointSize = (1.15 + aSeed * 1.35 + vText * .3) * uDpr;
    vSeed = aSeed;
  }
`;
const fragmentShader = `
  uniform vec3 uColor;
  uniform vec3 uHighlight;
  varying float vSeed;
  varying float vText;
  void main() {
    vec2 uv = gl_PointCoord - .5;
    float radius = dot(uv, uv);
    if (radius > .25) discard;
    float alpha = (1.0 - smoothstep(.035, .25, radius)) * (.55 + vSeed * .4);
    vec3 color = mix(uColor, uHighlight, vSeed * vSeed * .7 + vText * .3);
    gl_FragColor = vec4(color, alpha);
    #include <colorspace_fragment>
  }
`;

function sampleCanvas(canvas) {
  const { width, height } = canvas;
  const data = canvas.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, width, height).data;
  const points = [];
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    if (data[(y * width + x) * 4 + 3] > 128) points.push([x / width - .5, (height / 2 - y) / width]);
  }
  if (!points.length) throw new Error('Empty particle silhouette');
  return points;
}
async function sampleLogo() {
  const img = new Image(); img.src = '/logo.svg'; await img.decode();
  const canvas = document.createElement('canvas'); canvas.width = 192; canvas.height = 164;
  canvas.getContext('2d').drawImage(img, 0, 0, 192, 164);
  return sampleCanvas(canvas);
}
function sampleWords(lines) {
  const canvas = document.createElement('canvas'); canvas.width = 1000; canvas.height = 270;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.font = '600 92px Inter, Arial, sans-serif';
  const widest = Math.max(...lines.map((line) => ctx.measureText(line).width));
  const size = Math.min(92, 920 / widest * 92);
  ctx.font = `600 ${size}px Inter, Arial, sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff';
  lines.forEach((line, i) => ctx.fillText(line, 500, 135 + (i - (lines.length - 1) / 2) * size * 1.24));
  return sampleCanvas(canvas);
}

export async function createIntroScene(art, { text, invalidate, onFallback }) {
  const pixels = await sampleLogo();
  // Fonts may be unavailable offline; fall back to the same system font as the HTML.
  await Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 1200))]);
  const count = matchMedia('(max-width: 599px)').matches ? 10000 : 16000;
  const renderer = new WebGLRenderer({ alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'high-performance' });
  renderer.setClearColor('#080a0e', 1);
  const scene = new Scene();
  const camera = new OrthographicCamera(-5, 5, 3.4, -3.4, .1, 30); camera.position.z = 10;
  const geometry = new BufferGeometry();
  const shapes = particleShapes(count, pixels, text.map(sampleWords));
  for (const [name, value] of Object.entries({ position: shapes.orbit, aSphere: shapes.sphere, aFox: shapes.fox, aWordsOne: shapes.words[0], aWordsTwo: shapes.words[1] })) {
    geometry.setAttribute(name, new BufferAttribute(value, 3));
  }
  geometry.setAttribute('aSeed', new BufferAttribute(shapes.seeds, 1));
  const uniforms = {
    uProgress: { value: 0 }, uDpr: { value: 1 }, uShapeScale: { value: 1 }, uTextScale: { value: 1 },
    uColor: { value: new Color('#da9c56') }, uHighlight: { value: new Color('#fff1d6') },
  };
  const material = new ShaderMaterial({ vertexShader, fragmentShader, uniforms, transparent: true, depthWrite: false, depthTest: false });
  const sculpture = new Points(geometry, material); sculpture.frustumCulled = false; scene.add(sculpture);
  const canvas = renderer.domElement; canvas.setAttribute('aria-hidden', 'true');
  art.querySelector('.oc-webgl').append(canvas);
  let disposed = false, ready = false, shaderFailed = false, quality = 1, slowFrames = 0, frameCount = 0;
  renderer.debug.onShaderError = () => { shaderFailed = true; };
  const abort = new AbortController();

  function resize() {
    if (disposed) return;
    const width = art.clientWidth, height = art.clientHeight;
    if (!width || !height) return;
    const dpr = Math.min(devicePixelRatio || 1, 1.4, Math.sqrt(1500000 / (width * height))) * quality;
    renderer.setPixelRatio(dpr); renderer.setSize(width, height, false); uniforms.uDpr.value = dpr;
    const aspect = width / height;
    camera.left = -3.4 * aspect; camera.right = 3.4 * aspect; camera.updateProjectionMatrix();
    uniforms.uShapeScale.value = Math.min(1.15, aspect * 1.25);
    uniforms.uTextScale.value = Math.min(1.15, aspect * .8);
    art.dataset.pixels = String(Math.round(width * height * dpr * dpr));
    invalidate();
  }
  function draw(progress, deltaMs) {
    if (disposed) return;
    uniforms.uProgress.value = progress;
    try { renderer.render(scene, camera); }
    catch { fallback(); return; }
    if (shaderFailed) { fallback(); return; }
    if (!ready) { ready = true; art.classList.add('is-ready'); art.dataset.renderer = 'webgl'; }
    // Resolution changes retain every letter and every shape: never drop text points.
    if (deltaMs > 25 && deltaMs < 100) slowFrames++;
    if (++frameCount === 90 && slowFrames > 40 && quality === 1) { quality = .8; resize(); }
  }
  function dispose() {
    if (disposed) return;
    disposed = true; abort.abort(); geometry.dispose(); material.dispose(); renderer.dispose(); renderer.forceContextLoss();
    canvas.remove(); art.classList.remove('is-ready'); art.dataset.renderer = 'fallback';
  }
  function fallback() { dispose(); onFallback(); }
  canvas.addEventListener('webglcontextlost', (event) => { event.preventDefault(); fallback(); }, { signal: abort.signal });
  resize();
  return { draw, resize, dispose, get drawCount() { return frameCount; } };
}
