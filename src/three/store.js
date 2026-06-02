import * as THREE from 'three';
import { buildProduct } from './packaging.js';
import { PRODUCTS } from '../data/products.js';

// Lays every product out along a shallow arc — a "display aisle" — and
// computes a camera station in front of each for scroll-driven navigation.

const SPACING = 2.35;
const ARC = 0.055; // how much the ends recede from the camera
const PODIUM_H = 0.12;

const nextFrame = () => new Promise((r) => requestAnimationFrame(r));

export async function createStore(scene, onProgress) {
  const items = [];
  const pickables = [];
  const n = PRODUCTS.length;

  const podiumMat = new THREE.MeshStandardMaterial({ color: 0xf4f5f8, roughness: 0.35, metalness: 0.05 });

  for (let i = 0; i < n; i++) {
    const product = PRODUCTS[i];
    // yield to the browser between products so the loader can paint progress
    await nextFrame();
    const { group, height, radius } = buildProduct(product);
    const x = (i - (n - 1) / 2) * SPACING;
    const z = -ARC * x * x;

    const holder = new THREE.Group();
    holder.position.set(x, 0, z);

    // podium
    const podium = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 1.5, radius * 1.62, PODIUM_H, 48),
      podiumMat
    );
    podium.position.y = PODIUM_H / 2;
    podium.castShadow = true;
    podium.receiveShadow = true;
    holder.add(podium);

    group.position.y = PODIUM_H;
    holder.add(group);
    scene.add(holder);

    group.traverse((o) => {
      if (o.isMesh) pickables.push(o);
    });

    items.push({
      product,
      holder,
      group,
      index: i,
      height,
      radius,
      basePos: new THREE.Vector3(x, 0, z),
      hover: false,
      hoverAmt: 0,
      // camera station: the product is framed to one side so the copy card
      // can sit on the opposite side without covering it.
      station: (() => {
        const productLeft = i < Math.ceil(n / 2); // first half on the left
        const dir = productLeft ? 1 : -1;
        const midY = height * 0.5 + PODIUM_H;
        const dist = 3.5;
        return {
          pos: new THREE.Vector3(x + dir * 0.25, midY + 0.5, z + dist),
          target: new THREE.Vector3(x + dir * 0.72, midY, z),
        };
      })(),
    });

    if (onProgress) onProgress((i + 1) / n);
  }

  // establishing "hero" shot of the whole aisle
  const heroStation = {
    pos: new THREE.Vector3(0, 2.35, 9.6),
    target: new THREE.Vector3(0, 0.82, -0.6),
  };

  let focused = null;
  function setFocused(item) {
    focused = item;
  }

  function update(dt, t) {
    const k = 1 - Math.exp(-10 * dt);
    for (const it of items) {
      const isFocus = focused === it;
      // gentle idle bob + slow spin; the focused product spins a touch faster
      const speed = isFocus ? 0.55 : 0.16;
      it.group.rotation.y += dt * speed;

      // smooth hover lift + scale
      it.hoverAmt += ((it.hover ? 1 : 0) - it.hoverAmt) * k;
      const bob = Math.sin(t * 0.8 + it.index) * 0.012;
      it.group.position.y = PODIUM_H + bob + it.hoverAmt * 0.08;
      const s = 1 + it.hoverAmt * 0.06;
      it.group.scale.setScalar(s);
    }
  }

  return { items, pickables, heroStation, update, setFocused };
}
