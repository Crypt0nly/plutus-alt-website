// Deterministic, one-time geometry. Every morph runs on the GPU, not in a JS loop.
export function particleShapes(count, logoPixels) {
  const orbit = new Float32Array(count * 3);
  const sphere = new Float32Array(count * 3);
  const fox = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  let seed = 73129;
  const random = () => ((seed = Math.imul(seed, 1664525) + 1013904223 >>> 0) / 4294967296);
  for (let i = 0; i < count; i++) {
    const u = random() * Math.PI * 2;
    const v = random() * Math.PI * 2;
    const tube = .38 * Math.sqrt(random()) + .07;
    const radius = 1.72 + tube * Math.cos(v);
    const twist = u * 3;
    orbit.set([
      radius * Math.cos(u),
      radius * Math.sin(u),
      tube * Math.sin(v) + .26 * Math.sin(twist),
    ], i * 3);
    // Any prefix must cover the entire sphere when adaptive quality lowers drawRange.
    const latitude = Math.acos(1 - 2 * random());
    const longitude = i * 2.3999632297;
    const r = i % 5 === 0 ? 1.65 * Math.cbrt(random()) : 1.65;
    sphere.set([
      r * Math.sin(latitude) * Math.cos(longitude),
      r * Math.cos(latitude),
      r * Math.sin(latitude) * Math.sin(longitude),
    ], i * 3);
    const pixel = logoPixels[Math.floor(random() * logoPixels.length)];
    fox.set([pixel[0] * 3.8, pixel[1] * 3.8, (random() - .5) * .23], i * 3);
    seeds[i] = random();
  }
  return { orbit, sphere, fox, seeds };
}
