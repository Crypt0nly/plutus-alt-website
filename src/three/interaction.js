import * as THREE from 'three';

// Pointer picking: hover highlights a product (and shows a tooltip), click selects it.

export function createInteraction({ renderer, camera, items, onSelect }) {
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const dom = renderer.domElement;

  const meshToItem = new Map();
  const pickables = [];
  for (const it of items) {
    it.group.traverse((o) => {
      if (o.isMesh) {
        meshToItem.set(o, it);
        pickables.push(o);
      }
    });
  }

  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.setAttribute('aria-hidden', 'true');
  document.body.appendChild(tooltip);

  let hovered = null;
  let lastClient = { x: 0, y: 0 };
  let enabled = true;

  function setHovered(it) {
    if (hovered === it) return;
    if (hovered) hovered.hover = false;
    hovered = it;
    if (hovered) {
      hovered.hover = true;
      tooltip.innerHTML = `<span class="tt-name">${it.product.name}</span><span class="tt-feat">${it.product.feature}</span>`;
      tooltip.classList.add('show');
      dom.style.cursor = 'pointer';
    } else {
      tooltip.classList.remove('show');
      dom.style.cursor = '';
    }
  }

  function pick(clientX, clientY) {
    ndc.x = (clientX / window.innerWidth) * 2 - 1;
    ndc.y = -(clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(pickables, false);
    return hits.length ? meshToItem.get(hits[0].object) : null;
  }

  dom.addEventListener('pointermove', (e) => {
    lastClient = { x: e.clientX, y: e.clientY };
    tooltip.style.left = e.clientX + 'px';
    tooltip.style.top = e.clientY + 'px';
    if (!enabled) return;
    setHovered(pick(e.clientX, e.clientY));
  });

  dom.addEventListener('pointerleave', () => setHovered(null));

  dom.addEventListener('click', (e) => {
    if (!enabled) return;
    const it = pick(e.clientX, e.clientY);
    if (it && onSelect) onSelect(it);
  });

  return {
    setEnabled(v) {
      enabled = v;
      if (!v) setHovered(null);
    },
    get hovered() {
      return hovered;
    },
    refreshHover() {
      if (enabled) setHovered(pick(lastClient.x, lastClient.y));
    },
  };
}
