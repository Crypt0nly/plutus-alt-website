import * as THREE from 'three';
import { INTEGRATIONS, BEATS } from '../data/plutus.js';
import { glowTexture, nodeTexture } from './textures.js';

// The persistent agent world. Scroll position drives the choreography: as you
// move through a section the matching set-piece *plays* (the plan graph draws
// in, context streams, tools fire one-by-one, output flies out, team spawns…).

const VIOLET = new THREE.Color('#7c5cff');
const CYAN = new THREE.Color('#36e0e0');
const PINK = new THREE.Color('#ff5cae');

// beat indices
const B = {};
BEATS.forEach((b, i) => (B[b.id] = i));

const lerp = THREE.MathUtils.lerp;
const clamp = THREE.MathUtils.clamp;
const smooth = (x) => THREE.MathUtils.smoothstep(clamp(x, 0, 1), 0, 1);

function sprite(map, color, opacity, scale) {
  const s = new THREE.Sprite(
    new THREE.SpriteMaterial({ map, color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  s.scale.setScalar(scale);
  return s;
}

export function createWorld(scene) {
  const root = new THREE.Group();
  scene.add(root);
  const glow = glowTexture();

  // ---- background depth: nebula sprites + starfield ----------------------
  for (const [c, x, y, z, sc, op] of [
    [VIOLET, -14, 6, -22, 26, 0.22],
    [CYAN, 16, -6, -26, 30, 0.16],
    [PINK, 6, 12, -30, 24, 0.12],
  ]) {
    const n = sprite(glow, c, op, sc);
    n.position.set(x, y, z);
    root.add(n);
  }

  function starLayer(count, rMin, rMax, size, color, opacity) {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = lerp(rMin, rMax, Math.random());
      const a = Math.random() * Math.PI * 2;
      const b = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(b) * Math.cos(a);
      pos[i * 3 + 1] = r * Math.cos(b);
      pos[i * 3 + 2] = r * Math.sin(b) * Math.sin(a);
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const m = new THREE.PointsMaterial({ size, color, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
    const p = new THREE.Points(g, m);
    root.add(p);
    return p;
  }
  const starsFar = starLayer(1100, 30, 70, 0.18, new THREE.Color('#9fb0ff'), 0.7);
  const starsNear = starLayer(280, 14, 34, 0.3, new THREE.Color('#dfe7ff'), 0.85);

  // ---- core --------------------------------------------------------------
  const core = new THREE.Group();
  root.add(core);
  const coreInner = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.05, 4),
    new THREE.MeshStandardMaterial({ color: 0x0e1030, emissive: VIOLET, emissiveIntensity: 1.4, roughness: 0.3, metalness: 0.2 })
  );
  core.add(coreInner);
  const coreWire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.55, 2),
    new THREE.MeshBasicMaterial({ color: CYAN, wireframe: true, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  core.add(coreWire);
  const coreWire2 = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.95, 1),
    new THREE.MeshBasicMaterial({ color: VIOLET, wireframe: true, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  core.add(coreWire2);
  const coreHalo = sprite(glow, VIOLET.clone().lerp(CYAN, 0.3), 0.9, 7);
  core.add(coreHalo);

  // orbiting electrons
  const electrons = [];
  for (let i = 0; i < 3; i++) {
    const e = sprite(glow, CYAN, 0.9, 0.5);
    core.add(e);
    electrons.push({ s: e, r: 2.1 + i * 0.25, a: (i / 3) * Math.PI * 2, tilt: i * 0.7, speed: 0.8 + i * 0.25 });
  }

  // ---- plan graph (understand) ------------------------------------------
  const plan = new THREE.Group();
  core.add(plan);
  const planDots = [];
  const planLineMat = new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  const planPts = [];
  for (let i = 0; i < 5; i++) {
    const a = -0.9 + (i / 4) * 1.8;
    const p = new THREE.Vector3(Math.sin(a) * 2.6, 1.2 + Math.cos(a) * 0.4, 0.2);
    planPts.push(p);
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 16, 16),
      new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0 })
    );
    dot.position.copy(p);
    plan.add(dot);
    planDots.push(dot);
  }
  const planLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(planPts), planLineMat);
  plan.add(planLine);

  // ---- tool nodes + threads ---------------------------------------------
  const nodes = [];
  const threads = [];
  const N = INTEGRATIONS.length;
  const R = 4.8;
  INTEGRATIONS.forEach((it, i) => {
    const a = (i / N) * Math.PI * 2 - Math.PI / 2;
    const pos = new THREE.Vector3(Math.cos(a) * R, Math.sin(a) * R * 0.5, Math.sin(a) * R * 0.34 - 0.6);
    const panel = new THREE.Mesh(
      new THREE.PlaneGeometry(1.7, 0.9),
      new THREE.MeshBasicMaterial({ map: nodeTexture(it), transparent: true, depthWrite: false })
    );
    panel.position.copy(pos);
    root.add(panel);
    const halo = sprite(glow, new THREE.Color(it.color), 0, 2.6);
    halo.position.copy(pos);
    root.add(halo);
    nodes.push({ integration: it, panel, halo, pos, cloud: it.id === 'web', local: it.id === 'local' });

    const mid = pos.clone().multiplyScalar(0.5);
    mid.y += 0.7;
    mid.z += 0.5;
    const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0, 0), mid, pos.clone());
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 50, 0.016, 6, false),
      new THREE.MeshBasicMaterial({ color: VIOLET.clone().lerp(CYAN, 0.5), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    root.add(tube);
    const pulse = sprite(glow, CYAN, 0, 0.5);
    root.add(pulse);
    threads.push({ curve, tube, pulse, phase: i / N });
  });

  // ---- approval gate (approve) ------------------------------------------
  const gate = new THREE.Mesh(
    new THREE.TorusGeometry(2.4, 0.05, 12, 80),
    new THREE.MeshBasicMaterial({ color: PINK, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  gate.position.z = 2.2;
  root.add(gate);

  // ---- context particles (context) --------------------------------------
  const shardGeo = new THREE.OctahedronGeometry(0.13, 0);
  const shards = [];
  for (let i = 0; i < 16; i++) {
    const m = new THREE.Mesh(shardGeo, new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
    root.add(m);
    shards.push({ mesh: m, phase: Math.random(), a: Math.random() * Math.PI * 2, tilt: (Math.random() - 0.5) * 2 });
  }

  // ---- output tiles (work / report) -------------------------------------
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
    const ang = (i - (tileDefs.length - 1) / 2) * 0.62;
    mesh.userData.arc = new THREE.Vector3(Math.sin(ang) * 2.9, 0.4 - i * 0.04, 2.2 + Math.cos(ang) * 0.5);
    mesh.userData.stack = new THREE.Vector3(2.6, 1.1 - i * 0.7, 1.6);
    root.add(mesh);
    return mesh;
  });

  // ---- team clones (team) -----------------------------------------------
  const clones = [];
  for (let i = 0; i < 5; i++) {
    const g = new THREE.Group();
    const m = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.4, 2),
      new THREE.MeshStandardMaterial({ color: 0x0e1030, emissive: VIOLET, emissiveIntensity: 1.2, roughness: 0.4 })
    );
    const h = sprite(glow, VIOLET.clone().lerp(CYAN, 0.4), 0, 2.0);
    g.add(m, h);
    root.add(g);
    clones.push({ g, m, h, a: (i / 5) * Math.PI * 2 });
  }

  // ---- smoothed base levels ---------------------------------------------
  const amt = { core: 0.55, thread: 0.2, node: 0.32 };
  const STATE = {
    idle: { core: 0.55, thread: 0.22, node: 0.32 },
    prompt: { core: 0.74, thread: 0.34, node: 0.4 },
    plan: { core: 0.82, thread: 0.34, node: 0.45 },
    context: { core: 0.86, thread: 0.42, node: 0.5 },
    tools: { core: 1.0, thread: 0.9, node: 0.7 },
    approve: { core: 0.8, thread: 0.5, node: 0.7 },
    work: { core: 0.95, thread: 0.8, node: 0.78 },
    report: { core: 0.78, thread: 0.5, node: 0.72 },
    team: { core: 0.84, thread: 0.5, node: 0.7 },
    deploy: { core: 0.78, thread: 0.5, node: 0.68 },
  };

  // camera stations (hand-framed, with FOV + a touch of roll)
  const S = (px, py, pz, tx, ty, tz, fov, roll) => ({ pos: new THREE.Vector3(px, py, pz), target: new THREE.Vector3(tx, ty, tz), fov, roll: roll || 0 });
  const stations = [
    S(0, 1.4, 14, 0, 0, 0, 44),
    S(0.2, -0.2, 6.0, 0, 0.2, 0, 52),
    S(1.9, 1.7, 6.6, 0, 0.5, 0, 46, 0.02),
    S(-3.1, 1.2, 6.8, 0, 0.1, 0, 48),
    S(0, 3.0, 15.6, 0, 0, 0, 40, -0.02),
    S(2.5, 0.4, 6.4, 0.3, 0.2, 0, 44),
    S(-0.4, -0.9, 5.7, 0, 0.2, 0, 54, 0.03),
    S(2.3, 1.4, 8.6, 0.4, 0.3, 0, 44),
    S(0, 2.3, 12.6, 0, 0, 0, 46),
    S(6.1, 1.2, 9.0, 0.6, 0.2, 0, 42, -0.04),
    S(0, 1.0, 13.0, 0, 0, 0, 44),
  ];

  // ---- per-frame ---------------------------------------------------------
  const tmp = new THREE.Vector3();
  function update(dt, t, ctx) {
    const index = ctx ? ctx.index : 0;
    const localT = ctx ? ctx.localT : 0;
    const camera = ctx && ctx.camera;
    const bp = index + localT;

    // a value that ramps 0→1 across section B and stays 1 after
    const ramp = (b) => (index < b ? 0 : index > b ? 1 : smooth(localT / 0.85));
    // a transient window that's ~1 while section B's card is on screen
    const presence = (b) => (index === b ? smooth(localT / 0.14) * (1 - smooth((localT - 0.84) / 0.16)) : 0);

    // base levels follow the nearest beat
    const nearest = localT < 0.55 ? index : Math.min(index + 1, BEATS.length - 1);
    const s = STATE[BEATS[nearest].state] || STATE.idle;
    const k = 1 - Math.exp(-3.4 * dt);
    amt.core += (s.core - amt.core) * k;
    amt.thread += (s.thread - amt.thread) * k;
    amt.node += (s.node - amt.node) * k;

    // starfield drift + slow parallax
    starsFar.rotation.y += dt * 0.006;
    starsNear.rotation.y -= dt * 0.012;
    starsNear.rotation.x = Math.sin(t * 0.05) * 0.05;

    // core
    core.rotation.y += dt * 0.16;
    coreWire.rotation.y -= dt * 0.22;
    coreWire.rotation.x += dt * 0.13;
    coreWire2.rotation.y += dt * 0.16;
    const breathe = 1 + Math.sin(t * 1.7) * 0.04;
    coreInner.material.emissiveIntensity = 0.8 + amt.core * 1.9 * breathe;
    coreInner.scale.setScalar(breathe);
    coreHalo.material.opacity = 0.32 + amt.core * 0.7;
    coreHalo.scale.setScalar(6 + amt.core * 2.6 + Math.sin(t * 1.7) * 0.25);
    coreWire.material.opacity = 0.12 + amt.core * 0.28;
    coreWire2.material.opacity = 0.08 + amt.core * 0.16;

    for (const e of electrons) {
      const a = e.a + t * e.speed;
      e.s.position.set(Math.cos(a) * e.r, Math.sin(a + e.tilt) * e.r * 0.5, Math.sin(a) * e.r * 0.7);
      e.s.material.opacity = 0.5 + amt.core * 0.5;
      e.s.scale.setScalar(0.4 + amt.core * 0.25);
    }

    // plan graph (understand) draws in with ramp, fades with presence
    const planP = ramp(B.understand);
    const planVis = presence(B.understand);
    planLineMat.opacity = planVis * 0.9;
    const drawn = planP * (planDots.length - 1);
    for (let i = 0; i < planDots.length; i++) {
      const on = clamp(drawn - i + 1, 0, 1);
      planDots[i].material.opacity = planVis * on;
      planDots[i].scale.setScalar(0.6 + on * 0.6);
    }
    plan.rotation.y = Math.sin(t * 0.3) * 0.1;

    // tools: sequential firing
    const toolP = ramp(B.tools);
    const deployVis = presence(B.deploy);
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      if (camera) n.panel.lookAt(camera.position);
      const thr = (i + 0.35) / N;
      const fired = clamp((toolP - thr) * N * 1.4, 0, 1);
      let b = Math.max(amt.node * 0.6, fired); // lit once fired, dim base before
      // deploy: spotlight cloud + local, dim the rest
      if (deployVis > 0) b *= n.cloud || n.local ? 1 : lerp(1, 0.18, deployVis);
      if (deployVis > 0 && (n.cloud || n.local)) b = Math.max(b, 0.6 + 0.4 * Math.sin(t * 3));
      n.panel.material.opacity = 0.28 + b * 0.72;
      n.halo.material.opacity = b * 0.55;
      n.halo.scale.setScalar(2.2 + b * 1.0);

      const th = threads[i];
      const fireBoost = fired;
      th.tube.material.opacity = amt.thread * 0.45 + fireBoost * 0.4;
      // approval pauses the flow, then a surge passes through
      const appV = presence(B.approve);
      const flow = appV > 0 ? (localT < 0.5 ? 0.1 : 1) : 1;
      const speed = 0.45 + fireBoost * 0.5;
      const tp = (t * speed + th.phase) % 1;
      th.curve.getPoint(tp, tmp);
      th.pulse.position.copy(tmp);
      const vis = (amt.thread * 0.6 + fireBoost) * Math.sin(tp * Math.PI) * flow;
      th.pulse.material.opacity = clamp(vis, 0, 1);
      th.pulse.scale.setScalar(0.34 + clamp(vis, 0, 1) * 0.5);
    }

    // approval gate
    const appVis = presence(B.approve);
    gate.material.opacity = appVis * (localT < 0.5 ? 0.8 : 0.8 + 0.5 * Math.sin(t * 8));
    gate.scale.setScalar(1 + appVis * 0.08 + Math.sin(t * 2) * 0.02);
    gate.rotation.z += dt * 0.3;

    // context particles streaming inward
    const ctxVis = presence(B.context);
    for (const sh of shards) {
      const p = (t * 0.32 + sh.phase) % 1;
      const rad = lerp(3.6, 0.7, p);
      const ang = sh.a + t * 0.5;
      sh.mesh.position.set(Math.cos(ang) * rad, Math.sin(ang) * rad * sh.tilt * 0.5, Math.sin(ang) * rad * 0.4);
      sh.mesh.material.opacity = ctxVis * Math.sin(p * Math.PI) * 0.6;
      sh.mesh.rotation.x += dt * 2;
      sh.mesh.rotation.y += dt * 1.4;
    }

    // output tiles emit one-by-one, then stack for the report, then fade
    const workP = ramp(B.work);
    const stackAmt = smooth((bp - B.report) / 0.6);
    const fade = 1 - smooth((bp - (B.report + 0.85)) / 0.8);
    for (let i = 0; i < tiles.length; i++) {
      const tile = tiles[i];
      if (camera) tile.lookAt(camera.position);
      const emit = clamp((workP - i / tiles.length) * tiles.length, 0, 1);
      const home = tile.userData.arc.clone().lerp(tile.userData.stack, stackAmt);
      tmp.copy(new THREE.Vector3(0, 0.2, 0)).lerp(home, emit); // fly out from the core
      const bob = Math.sin(t * 1.5 + i) * 0.05;
      tile.position.set(tmp.x, tmp.y + bob, tmp.z);
      tile.material.opacity = emit * Math.max(0, fade);
      tile.scale.setScalar(0.5 + emit * 0.55);
    }

    // team clones spawn + orbit
    const teamVis = presence(B.team);
    const teamCount = Math.ceil(teamVis * clones.length);
    for (let i = 0; i < clones.length; i++) {
      const c = clones[i];
      const on = clamp(teamVis * clones.length - i, 0, 1);
      const a = c.a + t * 0.5;
      const r = 3.0;
      c.g.position.set(Math.cos(a) * r, Math.sin(a) * 1.4, Math.sin(a) * 1.0);
      c.g.scale.setScalar(0.6 + on * 0.5);
      c.m.material.emissiveIntensity = 1.2 * on;
      c.h.material.opacity = on * 0.6;
      c.g.visible = on > 0.01;
      c.g.rotation.y += dt * 0.8;
    }
  }

  return { root, stations, update };
}
