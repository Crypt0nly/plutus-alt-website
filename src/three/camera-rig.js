import * as THREE from 'three';

// Scroll-anchored cinematic camera. One station per section. Within a section
// the camera HOLDS on the beat for the first part (so the set-piece can play),
// then travels to the next station — and interpolates FOV + roll for drama.
// Exposes scroll progress so the world can choreograph to the scrollbar.

export function createCameraRig(camera, stations, sections) {
  const pos = camera.position.clone();
  const target = stations[0].target.clone();
  let fov = stations[0].fov || camera.fov;
  let roll = stations[0].roll || 0;

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

  const state = { activeIndex: 0, index: 0, localT: 0, progress: 0 };

  function compute() {
    if (tops.length !== sections.length) measure();
    const y = window.scrollY;
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);

    let i = 0;
    for (let k = 0; k < sections.length; k++) if (y >= tops[k] - 1) i = k;
    const i1 = Math.min(i + 1, sections.length - 1);
    const span = i1 > i ? Math.max(tops[i1] - tops[i], 1) : 1;
    const localT = THREE.MathUtils.clamp((y - tops[i]) / span, 0, 1);

    state.index = i;
    state.localT = localT;
    state.activeIndex = localT < 0.55 ? i : i1;
    state.progress = THREE.MathUtils.clamp(y / maxScroll, 0, 1);

    // hold on the beat, then travel: camera only starts moving after 40%
    const camT = THREE.MathUtils.smoothstep(THREE.MathUtils.clamp((localT - 0.4) / 0.6, 0, 1), 0, 1);
    const a = stations[i];
    const b = stations[i1];
    tmpPos.lerpVectors(a.pos, b.pos, camT);
    tmpTar.lerpVectors(a.target, b.target, camT);
    const fA = a.fov || 42;
    const fB = b.fov || 42;
    const rA = a.roll || 0;
    const rB = b.roll || 0;
    return { camT, fovT: fA + (fB - fA) * camT, rollT: rA + (rB - rA) * camT };
  }

  function apply(dt, k) {
    const pk = 1 - Math.exp(-6 * dt);
    pointerSmooth.lerp(pointer, pk);
    tmpPos.x += pointerSmooth.x * 0.55;
    tmpPos.y += -pointerSmooth.y * 0.32;
    tmpTar.x += pointerSmooth.x * 0.14;

    pos.lerp(tmpPos, k);
    target.lerp(tmpTar, k);
    camera.position.copy(pos);
    camera.lookAt(target);
    camera.rotateZ(roll);
    camera.fov += (fovTarget - camera.fov) * k;
    camera.updateProjectionMatrix();
  }

  let fovTarget = fov;
  function update(dt) {
    const c = compute();
    fovTarget = c.fovT;
    roll += (c.rollT - roll) * (1 - Math.exp(-4.5 * dt));
    apply(dt, 1 - Math.exp(-4.5 * dt));
  }

  function snap() {
    const c = compute();
    fovTarget = c.fovT;
    roll = c.rollT;
    pos.copy(tmpPos);
    target.copy(tmpTar);
    camera.position.copy(pos);
    camera.lookAt(target);
    camera.rotateZ(roll);
    camera.fov = c.fovT;
    camera.updateProjectionMatrix();
  }

  return {
    update,
    snap,
    measure,
    get activeIndex() { return state.activeIndex; },
    get index() { return state.index; },
    get localT() { return state.localT; },
    get progress() { return state.progress; },
  };
}
