# PLUTUS — the AI operating system, stocked like a supermarket

A concept marketing site for **PLUTUS**, a fictional *AI operating system for
companies*. The conceit: every capability of the platform — agents, analytics,
orchestration, data, runtime, security, integrations — is presented as a
**grocery product** sitting on a display aisle, and every product is **modelled
and rendered in real time in the browser with Three.js + WebGL**.

There are **no image or 3D asset files**. Every box, can, bottle, carton, coffee
bag, jar and tube is built from procedural geometry, and every label (including
the witty "**AI Facts**" panel — a nutrition label whose values are the feature's
real specs) is drawn onto a `<canvas>` and uploaded to the GPU as a texture.

## The metaphor

| Product (3D)        | Package  | Real feature              | Aisle        |
| ------------------- | -------- | ------------------------- | ------------ |
| Neural Flakes       | Cereal box | Autonomous Agents       | Automation   |
| Insight Beans       | Can      | Analytics & BI            | Intelligence |
| FlowPress           | Bottle   | Workflow Orchestration    | Automation   |
| PureData            | Milk carton | Data Platform & ETL    | Data         |
| Deploy Dark Roast   | Coffee bag | Runtime & Deployment    | Platform     |
| Guardian            | Jar      | Security & Compliance     | Trust        |
| Connect             | Tube     | Integration Mesh          | Platform     |
| Sage                | Tea box  | Knowledge & RAG Search    | Intelligence |

Each product's "nutrition facts" are the feature's specs: uptime, latency,
connectors, certifications, and so on — `% Service Level` instead of `% Daily Value`.

## Experience

- **Scroll = walk the aisle.** Page scroll drives a cinematic camera that glides
  from an establishing shot to each product in turn. Copy cards fade in beside
  the product they describe (the camera is anchored to each section, so the card
  and product always stay in sync).
- **Hover** any product to lift and highlight it, with a floating tooltip.
- **Click** a product — or "Read the AI Facts" — to slide in a detail sheet with
  the full description and spec sheet.
- **Pointer parallax**, soft studio lighting, contact shadows and image-based
  reflections (from a procedural room environment) give it a product-catalog feel.
- A **side dock** and **aisle nav** let you jump straight to any product.
- A **checkout** section presents pricing as "filling your basket".

## Tech stack

- **[Three.js](https://threejs.org/)** (`0.169`) — WebGL rendering, geometry,
  `MeshPhysicalMaterial` glass (transmission), `PMREMGenerator` + `RoomEnvironment`
  for reflections, soft shadow mapping, ACES tone mapping.
- **[Vite](https://vitejs.dev/)** — dev server and production bundling.
- **Vanilla JS + CSS** — no UI framework; the DOM chrome is intentionally light.

## Running locally

```bash
npm install      # installs three + vite
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build into dist/
npm run preview  # serve the production build
```

A modern browser with WebGL2 is required.

## Project structure

```
index.html                 # shell: canvas, nav, loader, sheet containers
src/
  main.js                  # boot: wires stage + store + camera + UI together
  style.css                # all site chrome / layout
  data/products.js         # the product catalog (features as groceries)
  three/
    stage.js               # renderer, scene, lights, environment, floor, loop
    textures.js            # canvas-drawn labels, emblems, barcodes, "AI Facts"
    packaging.js           # procedural geometry per package type
    store.js               # lays products on the aisle + camera stations
    camera-rig.js          # scroll-anchored cinematic camera + parallax
    interaction.js         # raycast hover / click + tooltip
  ui/
    overlay.js             # nav, scroll sections, side dock, footer
    detail.js              # the slide-in product detail sheet
```

## How the rendering works

1. **Labels** (`textures.js`): each package type has a builder that paints onto a
   2D canvas — brand bar, a procedural emblem, the product name, a flavour banner,
   a barcode, and the parody **AI Facts** panel — then wraps it in a
   `THREE.CanvasTexture` (sRGB, anisotropic).
2. **Geometry** (`packaging.js`): boxes use per-face materials; cans are an
   open cylinder + metallic caps; bottles and jars are `LatheGeometry` /
   cylinders with a transmissive glass material and a printed label band; the
   milk carton uses a hand-built gable-top `BufferGeometry`; the coffee pouch and
   tube are composed from primitives. Everything stands on `y = 0`.
3. **Stage** (`stage.js`): a bright studio set — gradient backdrop, key/fill/rim
   lights, soft shadows, and an image-based environment generated from
   `RoomEnvironment` (so glass and metal get believable reflections without any
   HDR file).
4. **Camera** (`camera-rig.js`): one "station" per full-height section. The rig
   reads each section's real scroll position and interpolates the camera between
   stations, so copy and product never drift apart regardless of section height.

### Notes

- `?capture` in the URL enables `preserveDrawingBuffer` (used for headless
  screenshots); it has no effect on the normal experience.
- `window.__PLUTUS` exposes `{ stage, rig, store, overlay, detail }` for debugging.
- Respects `prefers-reduced-motion`.

## Disclaimer

PLUTUS is a fictional product built as a rendering/design demo. Names, specs and
prices are illustrative.
