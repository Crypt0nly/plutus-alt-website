import * as THREE from 'three';
import {
  boxTextures,
  canTextures,
  bandTexture,
  cartonTextures,
  coffeeTexture,
  tubeTexture,
  jarTextures,
} from './textures.js';

// ---------------------------------------------------------------------------
// Procedural 3D packaging.
// Each builder returns { group, height, radius } with the product standing on y=0.
// All meshes cast + receive shadows and pick up scene.environment for reflections.
// ---------------------------------------------------------------------------

function finalize(group, meshes) {
  for (const m of meshes) {
    m.castShadow = true;
    m.receiveShadow = true;
  }
  const box = new THREE.Box3().setFromObject(group);
  const size = new THREE.Vector3();
  box.getSize(size);
  return { group, height: size.y, radius: Math.max(size.x, size.z) * 0.5 };
}

function paper(map, extra = {}) {
  return new THREE.MeshStandardMaterial({ map, roughness: 0.62, metalness: 0.0, ...extra });
}

function colorMat(hex, extra = {}) {
  return new THREE.MeshStandardMaterial({ color: new THREE.Color(hex), roughness: 0.6, metalness: 0.0, ...extra });
}

// ---------- BOX (cereal / tea) ----------
function makeBox(product) {
  const g = new THREE.Group();
  const w = 1.0;
  const h = 1.52;
  const d = 0.34;
  const t = boxTextures(product);
  const side = paper(t.side);
  const top = paper(t.top);
  // BoxGeometry material order: [px, nx, py, ny, pz, nz]
  const mats = [side, side.clone(), top, top.clone(), paper(t.front), paper(t.back)];
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d, 1, 1, 1), mats);
  mesh.position.y = h / 2;
  g.add(mesh);
  return finalize(g, [mesh]);
}

// ---------- CAN (soup / beans) ----------
function makeCan(product) {
  const g = new THREE.Group();
  const r = 0.42;
  const h = 1.06;
  const t = canTextures(product);

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(r, r, h, 64, 1, true),
    new THREE.MeshStandardMaterial({ map: t.wrap, roughness: 0.42, metalness: 0.1 })
  );
  body.position.y = h / 2;
  body.rotation.y = Math.PI; // bring the printed "front" toward +Z
  g.add(body);

  const metal = new THREE.MeshStandardMaterial({ map: t.lid, color: 0xdfe4ea, roughness: 0.3, metalness: 0.85 });
  const rimGeo = new THREE.CylinderGeometry(r * 1.02, r, 0.04, 64);
  const topRim = new THREE.Mesh(rimGeo, metal);
  topRim.position.y = h + 0.02;
  const botRim = new THREE.Mesh(rimGeo.clone(), metal);
  botRim.position.y = -0.02;
  botRim.rotation.z = Math.PI;
  const lid = new THREE.Mesh(new THREE.CircleGeometry(r * 0.98, 64), metal);
  lid.rotation.x = -Math.PI / 2;
  lid.position.y = h + 0.041;
  const base = new THREE.Mesh(new THREE.CircleGeometry(r * 0.98, 64), metal.clone());
  base.rotation.x = Math.PI / 2;
  base.position.y = -0.041;
  g.add(topRim, botRim, lid, base);
  return finalize(g, [body, topRim, botRim, lid, base]);
}

// ---------- BOTTLE (cold-pressed juice) ----------
function makeBottle(product) {
  const g = new THREE.Group();
  const profile = [
    [0.0, 0.0],
    [0.3, 0.0],
    [0.32, 0.06],
    [0.32, 0.86],
    [0.3, 1.0],
    [0.17, 1.18],
    [0.13, 1.26],
    [0.13, 1.46],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const glass = new THREE.Mesh(
    new THREE.LatheGeometry(profile, 64),
    new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(product.colors.base),
      roughness: 0.08,
      transmission: 0.92,
      thickness: 0.5,
      ior: 1.34,
      transparent: true,
      attenuationColor: new THREE.Color(product.colors.base),
      attenuationDistance: 0.6,
    })
  );
  g.add(glass);

  // liquid fill
  const liquid = new THREE.Mesh(
    new THREE.CylinderGeometry(0.29, 0.28, 0.92, 48),
    colorMat(product.colors.base, { roughness: 0.25, metalness: 0.0 })
  );
  liquid.position.y = 0.5;
  g.add(liquid);

  // label band
  const band = new THREE.Mesh(
    new THREE.CylinderGeometry(0.325, 0.325, 0.62, 64, 1, true),
    new THREE.MeshStandardMaterial({ map: bandTexture(product, { W: 1400, H: 620 }), roughness: 0.5 })
  );
  band.position.y = 0.46;
  band.rotation.y = Math.PI;
  g.add(band);

  // cap
  const cap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.145, 0.145, 0.16, 48),
    colorMat(product.colors.accent, { roughness: 0.35, metalness: 0.1 })
  );
  cap.position.y = 1.52;
  g.add(cap);

  return finalize(g, [glass, liquid, band, cap]);
}

// ---------- CARTON (milk / juice gable top) ----------
function gableRoofGeometry(w, d, roofH) {
  // Two sloped panels + two triangular gable ends, meeting at a ridge along X.
  const hw = w / 2;
  const hd = d / 2;
  const positions = [];
  const uvs = [];
  const push = (a, b, c, uvA, uvB, uvC) => {
    positions.push(...a, ...b, ...c);
    uvs.push(...uvA, ...uvB, ...uvC);
  };
  const ridgeF = [-hw, roofH, 0];
  const ridgeB = [hw, roofH, 0];
  const flb = [-hw, 0, -hd];
  const flf = [-hw, 0, hd];
  const frb = [hw, 0, -hd];
  const frf = [hw, 0, hd];
  // front slope (+z)
  push(flf, frf, ridgeB, [0, 0], [1, 0], [1, 1]);
  push(flf, ridgeB, ridgeF, [0, 0], [1, 1], [0, 1]);
  // back slope (-z)
  push(frb, flb, ridgeF, [0, 0], [1, 0], [1, 1]);
  push(frb, ridgeF, ridgeB, [0, 0], [1, 1], [0, 1]);
  // gable ends (triangles at -x and +x)
  push(flb, flf, ridgeF, [0, 0], [1, 0], [0.5, 1]);
  push(frf, frb, ridgeB, [0, 0], [1, 0], [0.5, 1]);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.computeVertexNormals();
  return geo;
}

function makeCarton(product) {
  const g = new THREE.Group();
  const w = 0.78;
  const d = 0.78;
  const bodyH = 1.18;
  const roofH = 0.34;
  const t = cartonTextures(product);
  const side = paper(t.side);
  const mats = [side, side.clone(), colorMat(product.colors.base), colorMat(product.colors.base), paper(t.front), paper(t.back)];
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, bodyH, d), mats);
  body.position.y = bodyH / 2;
  g.add(body);

  const roof = new THREE.Mesh(
    gableRoofGeometry(w, d, roofH),
    colorMat(product.colors.accent, { roughness: 0.55 })
  );
  roof.position.y = bodyH;
  g.add(roof);

  // sealed fin on top
  const fin = new THREE.Mesh(
    new THREE.BoxGeometry(w * 0.96, 0.12, 0.04),
    colorMat(product.colors.base, { roughness: 0.5 })
  );
  fin.position.y = bodyH + roofH + 0.04;
  g.add(fin);
  return finalize(g, [body, roof, fin]);
}

// ---------- COFFEE BAG (folded pouch) ----------
function makeCoffeeBag(product) {
  const g = new THREE.Group();
  const w = 0.92;
  const d = 0.4;
  const h = 1.18;
  const t = coffeeTexture(product);
  const matte = { roughness: 0.74, metalness: 0.18 };
  const sideC = colorMat(product.colors.base, matte);
  const mats = [
    sideC,
    sideC.clone(),
    colorMat(product.colors.base, matte),
    colorMat(product.colors.base, matte),
    paper(t.front, matte),
    colorMat(product.colors.base, matte),
  ];
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mats);
  body.position.y = h / 2;
  g.add(body);

  // folded + crimped top
  const fold = new THREE.Mesh(
    new THREE.BoxGeometry(w * 1.02, 0.14, d * 0.5),
    colorMat(product.colors.ink, { roughness: 0.7 })
  );
  fold.position.y = h + 0.04;
  fold.rotation.x = 0.12;
  g.add(fold);
  return finalize(g, [body, fold]);
}

// ---------- JAR (sealed glass) ----------
function makeJar(product) {
  const g = new THREE.Group();
  const r = 0.46;
  const h = 0.86;
  const t = jarTextures(product);

  const glass = new THREE.Mesh(
    new THREE.CylinderGeometry(r, r * 0.96, h, 64),
    new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#dfe7ea'),
      roughness: 0.06,
      transmission: 0.9,
      thickness: 0.4,
      ior: 1.5,
      transparent: true,
    })
  );
  glass.position.y = h / 2;
  g.add(glass);

  const contents = new THREE.Mesh(
    new THREE.CylinderGeometry(r * 0.9, r * 0.86, h * 0.78, 48),
    colorMat(product.colors.base, { roughness: 0.5 })
  );
  contents.position.y = h * 0.42;
  g.add(contents);

  const band = new THREE.Mesh(
    new THREE.CylinderGeometry(r * 1.005, r * 1.005, h * 0.52, 64, 1, true),
    new THREE.MeshStandardMaterial({ map: t.band, roughness: 0.5, transparent: true })
  );
  band.position.y = h * 0.46;
  band.rotation.y = Math.PI;
  g.add(band);

  const lid = new THREE.Mesh(
    new THREE.CylinderGeometry(r * 1.02, r * 1.02, 0.2, 64),
    colorMat(t.lidColor, { roughness: 0.35, metalness: 0.3 })
  );
  lid.position.y = h + 0.06;
  g.add(lid);
  return finalize(g, [glass, contents, band, lid]);
}

// ---------- TUBE (paste / integration) ----------
function makeTube(product) {
  const g = new THREE.Group();
  const r = 0.3;
  const bodyH = 1.0;
  const t = tubeTexture(product);
  const plastic = { roughness: 0.22, metalness: 0.0 };

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(r, r, bodyH, 64, 1, true),
    new THREE.MeshStandardMaterial({ map: t.body, ...plastic })
  );
  body.position.y = 0.18 + bodyH / 2;
  g.add(body);

  // rounded shoulder toward the cap
  const shoulder = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, r, 0.18, 64),
    colorMat('#f3f5f7', plastic)
  );
  shoulder.position.y = 0.18 + bodyH + 0.09;
  g.add(shoulder);

  // cap
  const cap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.28, 48),
    colorMat(t.capColor, { roughness: 0.3 })
  );
  cap.position.y = 0.18 + bodyH + 0.18 + 0.14;
  g.add(cap);

  // crimped flat tail at the bottom
  const tail = new THREE.Mesh(
    new THREE.BoxGeometry(r * 2.0, 0.2, 0.05),
    colorMat('#f3f5f7', plastic)
  );
  tail.position.y = 0.09;
  g.add(tail);
  return finalize(g, [body, shoulder, cap, tail]);
}

const builders = {
  box: makeBox,
  can: makeCan,
  bottle: makeBottle,
  carton: makeCarton,
  coffee: makeCoffeeBag,
  jar: makeJar,
  tube: makeTube,
};

export function buildProduct(product) {
  const builder = builders[product.package] || makeBox;
  const result = builder(product);
  result.group.userData.product = product;
  result.group.traverse((o) => {
    if (o.isMesh) o.userData.product = product;
  });
  return result;
}
