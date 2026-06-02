import * as THREE from 'three';
import { INTEGRATIONS, BEATS } from '../data/plutus.js';
import { glowTexture, nodeTexture } from './textures.js';

// The persistent agent world: a luminous core, a ring of tool nodes, data
// threads between them, plus a few beat-gated extras (a plan ring, context
// particles, output tiles, team rings). Scroll drives the camera; the active
// beat drives smoothed "energy" amounts that animate everything.

const VIOLET = new THREE.Color('#7c5cff');
const CYAN = new THREE.Color('#36e0e0');

function additive(map, color, opacity = 1) {
  return new THREE.SpriteMaterial({
    map,
    color,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}

export function createWorld(scene) {
  const root = new THREE.Group();
  scene.add(root);
  const glow = glowTexture();

  // ---- core --------------------------------------------------------------
  const core = new THREE.Group();
  root.add(core);

  const coreInner = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.05, 3),
    new THREE.MeshStandardMaterial({
      color: 0x12132a,
      emissive: VIOLET,
      emissiveIntensity: 1.4,
      roughness: 0.35,
      metalness: 0.2,
    })
  );
  core.add(coreInner);

  const coreWire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.5, 2),
    new THREE.MeshBasicMaterial({ color: CYAN, wireframe: true, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  core.add(coreWire);

  const coreHalo = new THREE.Sprite(additive(glow, VIOLET.clone().lerp(CYAN, 0.3), 0.9));
  coreHalo.scale.setScalar(7);
  core.add(coreHalo);

  // plan ring (understand beat)
  const planRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.1, 0.02, 8, 96),
    new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  planRing.rotation.x = Math.PI * 0.5;
  core.add(planRing);

  // ---- tool nodes + threads ---------------------------------------------
  const nodes = [];
  const threads = [];
  const N = INTEGRATIONS.length;
  const R = 4.7;

  INTEGRATIONS.forEach((it, i) => {
    const a = (i / N) * Math.PI * 2 - Math.PI / 2;
    const pos = new THREE.Vector3(Math.cos(a) * R, Math.sin(a) * R * 0.52, Math.sin(a) * R * 0.34 - 0.6);

    const tex = nodeTexture(it);
    const panel = new THREE.Mesh(
      new THREE.PlaneGeometry(1.7, 0.9),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })
    );
    panel.position.copy(pos);
    root.add(panel);

    const halo = new THREE.Sprite(additive(glow, new THREE.Color(it.color), 0));
    halo.scale.setScalar(2.6);
    halo.position.copy(pos);
    root.add(halo);

    nodes.push({ integration: it, panel, halo, pos });

    // thread: a bowed tube from core to node
    const mid = pos.clone().multiplyScalar(0.5);
    mid.y += 0.6;
    mid.add(new THREE.Vector3(0, 0, 0.4));
    const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0, 0), mid, pos.clone());
    const tubeMat = new THREE.MeshBasicMaterial({
      color: VIOLET.clone().lerp(CYAN, 0.5),
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.015, 6, false), tubeMat);
    root.add(tube);

    const pulse = new THREE.Sprite(additive(glow, CYAN, 0));
    pulse.scale.setScalar(0.5);
    root.add(pulse);

    threads.push({ curve, tube, tubeMat, pulse, phase: i / N });
  });

  // ---- context particles (context beat) ---------------------------------
  const shardGeo = new THREE.OctahedronGeometry(0.13, 0);
  const shards = [];
  for (let i = 0; i < 14; i++) {
    const m = new THREE.Mesh(
      shardGeo,
      new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    root.add(m);
    shards.push({ mesh: m, phase: Math.random(), a: Math.random() * Math.PI * 2, tilt: (Math.random() - 0.5) * 2 });
  }

  // ---- output tiles (work / report beats) -------------------------------
  const tileDefs = [
    { label: 'Email sent', glyph: 'mail', color: '#EA4335' },
    { label: 'Files tidied', glyph: 'folder', color: '#F2B23C' },
    { label: 'PR opened', glyph: 'git', color: '#E6EDF3' },
    { label: 'Event booked', glyph: 'calendar', color: '#4285F4' },
  ];
  const tiles = tileDefs.map((d, i) => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 0.8),
      new THREE.MeshBasicMaterial({ map: nodeTexture(d), transparent: true, opacity: 0, depthWrite: false })
    );
    const ang = (i - (tileDefs.length - 1) / 2) * 0.5;
    mesh.userData.base = new THREE.Vector3(Math.sin(ang) * 2.6, 0.2 - i * 0.05, 2.2 + Math.cos(ang) * 0.4);
    root.add(mesh);
    return mesh;
  });

  // ---- team rings (team beat) -------------------------------------------
  const teamRings = [];
  for (let i = 0; i < 4; i++) {
    const r = new THREE.Mesh(
      new THREE.TorusGeometry(0.45, 0.025, 8, 40),
      new THREE.MeshBasicMaterial({ color: VIOLET, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    const a = (i / 4) * Math.PI * 2;
    r.userData.base = new THREE.Vector3(Math.cos(a) * 3.2, Math.sin(a) * 1.6, Math.sin(a) * 1.2);
    root.add(r);
    teamRings.push(r);
  }

  // ---- smoothed energy amounts ------------------------------------------
  const amt = { core: 0.55, thread: 0.2, node: 0.3, plan: 0, context: 0, work: 0, team: 0, deploy: 0 };
  const target = { ...amt };

  const STATE = {
    idle: { core: 0.55, thread: 0.2, node: 0.32 },
    prompt: { core: 0.72, thread: 0.32, node: 0.42 },
    plan: { core: 0.82, thread: 0.36, node: 0.48, plan: 1 },
    context: { core: 0.86, thread: 0.42, node: 0.52, context: 1 },
    tools: { core: 1.0, thread: 1.0, node: 1.0 },
    approve: { core: 0.82, thread: 0.6, node: 0.7 },
    work: { core: 0.95, thread: 0.85, node: 0.85, work: 1 },
    report: { core: 0.78, thread: 0.5, node: 0.72, work: 1 },
    team: { core: 0.82, thread: 0.5, node: 0.72, team: 1 },
    deploy: { core: 0.78, thread: 0.5, node: 0.7, deploy: 1 },
  };

  function setActive(beatIndex) {
    const beat = BEATS[beatIndex] || BEATS[0];
    const s = STATE[beat.state] || STATE.idle;
    for (const k of Object.keys(target)) target[k] = s[k] != null ? s[k] : 0;
  }

  // camera stations, one per beat (hand-framed for variety)
  const S = (px, py, pz, tx, ty, tz) => ({
    pos: new THREE.Vector3(px, py, pz),
    target: new THREE.Vector3(tx, ty, tz),
  });
  const stations = [
    S(0, 1.6, 13.5, 0, 0, 0), // hero
    S(0.2, 0.4, 6.2, 0, 0.1, 0), // ask
    S(2.6, 1.1, 6.4, 0, 0.2, 0), // understand
    S(-2.8, 1.7, 7.2, 0, 0.1, 0), // context
    S(0, 3.4, 14.6, 0, 0, 0), // tools (reveal)
    S(3.0, 0.2, 6.2, 0.4, 0.2, 0), // approve
    S(-0.3, -0.9, 6.0, 0, 0.1, 0), // work
    S(1.8, 1.3, 6.6, 0, 0.2, 0), // report
    S(0, 2.4, 12.6, 0, 0, 0), // team
    S(6.2, 1.4, 8.6, 0.6, 0.2, 0), // deploy
    S(0, 1.2, 12.8, 0, 0, 0), // cta
  ];

  const tmp = new THREE.Vector3();
  function update(dt, t, camera) {
    const k = 1 - Math.exp(-3.2 * dt);
    for (const key of Object.keys(amt)) amt[key] += (target[key] - amt[key]) * k;

    // core
    core.rotation.y += dt * 0.15;
    coreWire.rotation.y -= dt * 0.22;
    coreWire.rotation.x += dt * 0.12;
    const pulse = 1 + Math.sin(t * 1.6) * 0.04;
    coreInner.material.emissiveIntensity = 0.8 + amt.core * 1.8 * pulse;
    coreInner.scale.setScalar(pulse);
    coreHalo.material.opacity = 0.35 + amt.core * 0.7;
    coreHalo.scale.setScalar(6 + amt.core * 2.5 + Math.sin(t * 1.6) * 0.2);
    coreWire.material.opacity = 0.12 + amt.core * 0.3;
    planRing.material.opacity = amt.plan * 0.8;
    planRing.scale.setScalar(1 + amt.plan * 0.05 + Math.sin(t * 2) * 0.02 * amt.plan);
    planRing.rotation.z += dt * 0.4 * amt.plan;

    // nodes: billboard + brightness
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      if (camera) n.panel.lookAt(camera.position);
      // a gentle per-node shimmer; everything lifts on the "tools" beat
      const shimmer = 0.5 + 0.5 * Math.sin(t * 1.2 + i);
      const b = amt.node * (0.6 + 0.4 * shimmer);
      n.panel.material.opacity = 0.35 + b * 0.65;
      n.halo.material.opacity = b * 0.5;
      n.halo.scale.setScalar(2.2 + b * 0.8);
    }

    // threads + travelling pulses
    for (let i = 0; i < threads.length; i++) {
      const th = threads[i];
      th.tubeMat.opacity = amt.thread * 0.5;
      const tp = (t * 0.45 + th.phase) % 1;
      th.curve.getPoint(tp, tmp);
      th.pulse.position.copy(tmp);
      const vis = amt.thread * Math.sin(tp * Math.PI); // fade in/out along the wire
      th.pulse.material.opacity = vis;
      th.pulse.scale.setScalar(0.35 + vis * 0.35);
    }

    // context particles streaming inward
    for (const sh of shards) {
      const p = (t * 0.35 + sh.phase) % 1;
      const rad = THREE.MathUtils.lerp(3.4, 0.7, p);
      const ang = sh.a + t * 0.5;
      sh.mesh.position.set(Math.cos(ang) * rad, Math.sin(ang) * rad * sh.tilt * 0.5, Math.sin(ang) * rad * 0.4);
      sh.mesh.material.opacity = amt.context * Math.sin(p * Math.PI) * 0.5;
      sh.mesh.rotation.x += dt * 2;
      sh.mesh.rotation.y += dt * 1.4;
    }

    // output tiles pop in
    for (let i = 0; i < tiles.length; i++) {
      const tile = tiles[i];
      if (camera) tile.lookAt(camera.position);
      const s = amt.work;
      tile.material.opacity = s;
      const bob = Math.sin(t * 1.5 + i) * 0.06;
      tile.position.copy(tile.userData.base).setY(tile.userData.base.y + bob);
      tile.scale.setScalar(0.6 + s * 0.5);
    }

    // team rings
    for (let i = 0; i < teamRings.length; i++) {
      const r = teamRings[i];
      r.material.opacity = amt.team * 0.8;
      r.scale.setScalar(0.8 + amt.team * 0.4);
      r.position.copy(r.userData.base);
      r.rotation.y += dt * 0.6;
      r.rotation.x += dt * 0.3;
    }
  }

  return { root, stations, setActive, update };
}
