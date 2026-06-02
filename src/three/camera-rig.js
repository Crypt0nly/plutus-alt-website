import * as THREE from 'three';

// Drives the camera along a sequence of "stations" — one per full-height
// section — anchored to each section's real scroll position. This keeps the
// copy card and the product it describes perfectly in sync, regardless of how
// tall any given section ends up.

export function createCameraRig(camera, stations, sections) {
  const pos = camera.position.clone();
  const target = stations[0].target.clone();
  const pointer = new THREE.Vector2(0, 0);
  const pointerSmooth = new THREE.Vector2(0, 0);
  const tmpPos = new THREE.Vector3();
  const tmpTar = new THREE.Vector3();

  let tops = [];
  function measure() {
    const y = window.scrollY;
    tops = sections.map((s) => s.getBoundingClientRect().top + y);
  }
  measure();
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);

  window.addEventListener(
    'pointermove',
    (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    },
    { passive: true }
  );

  let activeIndex = 0;

  // Compute the desired camera pose for the current scroll position into
  // tmpPos / tmpTar (without parallax) and update activeIndex.
  function computeDesired() {
    if (tops.length !== sections.length) measure();
    const y = window.scrollY;

    let i = 0;
    for (let k = 0; k < sections.length; k++) {
      if (y >= tops[k] - 1) i = k;
    }
    const i1 = Math.min(i + 1, sections.length - 1);
    const span = i1 > i ? Math.max(tops[i1] - tops[i], 1) : 1;
    const localT = THREE.MathUtils.clamp((y - tops[i]) / span, 0, 1);
    activeIndex = localT < 0.5 ? i : i1;

    const e = THREE.MathUtils.smoothstep(localT, 0, 1);
    tmpPos.lerpVectors(stations[i].pos, stations[i1].pos, e);
    tmpTar.lerpVectors(stations[i].target, stations[i1].target, e);
  }

  function applyParallax(dt) {
    const pk = 1 - Math.exp(-6 * dt);
    pointerSmooth.lerp(pointer, pk);
    tmpPos.x += pointerSmooth.x * 0.5;
    tmpPos.y += -pointerSmooth.y * 0.3;
    tmpTar.x += pointerSmooth.x * 0.12;
  }

  function update(dt) {
    computeDesired();
    applyParallax(dt);
    const k = 1 - Math.exp(-4.5 * dt);
    pos.lerp(tmpPos, k);
    target.lerp(tmpTar, k);
    camera.position.copy(pos);
    camera.lookAt(target);
  }

  // Jump straight to the current target (used for deterministic captures).
  function snap() {
    computeDesired();
    pos.copy(tmpPos);
    target.copy(tmpTar);
    camera.position.copy(pos);
    camera.lookAt(target);
  }

  return {
    update,
    snap,
    measure,
    get activeIndex() {
      return activeIndex;
    },
  };
}
