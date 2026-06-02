# Plutus — an interactive, scroll-driven story for the AI agent that does your work

A redesign of [myplutus.ai](https://myplutus.ai) as a **scrollytelling** site: one
continuous 3D scene — a luminous **agent "core"** surrounded by your tools —
where **scrolling walks through a single task from prompt to done**. Rendered in
real time with **Three.js + WebGL** (with bloom post-processing); no image or 3D
asset files ship with the site.

> The product: *Plutus — the AI agent that actually does your work.* Give it a
> goal in plain language; it understands, gathers context, uses your tools
> (Gmail, Google Calendar, GitHub, Discord and 10+ more), does the work, and
> tells you what changed.

## The story (scroll = the agent's workflow)

Each full-height section is one **beat**, and each beat is one **camera station**.
As you scroll, the camera flies through the scene and the world's "energy"
animates to match:

1. **Hero** — the core idles; the tools float around it.
2. **You ask** — camera pushes in; the core wakes.
3. **It understands** — a plan ring forms around the core.
4. **It gathers context** — particles stream inward into the core.
5. **It uses your tools** ⭐ — camera pulls back to reveal the full constellation; data threads fire to every tool node (the showpiece).
6. **You stay in control** — the approval beat.
7. **It does the work** — output tiles (email, files, PR, calendar) pop in.
8. **It reports back** — a calmer summary view.
9. **Team-ready** — collaborator rings orbit the core.
10. **Cloud or local** — a side angle on the deployment choice.
11. **CTA** — "Stop managing tools. Start delegating outcomes."

The copy is **drafted from myplutus.ai's public description** — swap in the exact
site wording in `src/data/plutus.js` when ready.

## Tech

- **Three.js** `0.169` — WebGL scene, emissive materials, `UnrealBloomPass` (the glow), additive sprites for halos/pulses, `FogExp2` for depth.
- **Vite** — dev server + production bundle.
- **Vanilla JS + CSS** — dark "glass" UI chrome, no framework.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/  (deploy this; Vercel → Vite preset)
npm run preview
```

## Structure

```
index.html               # shell: canvas, nav, loader
src/
  main.js                # boot: stage + world + camera rig + overlay
  style.css              # dark scrollytelling chrome
  data/plutus.js         # beats (the scroll script) + integrations + copy
  three/
    stage.js             # renderer, dark scene, lights, bloom composer, loop
    world.js             # the agent core, tool constellation, threads, beat states
    textures.js          # procedural node panels, icon glyphs, glow sprite
    camera-rig.js        # scroll-anchored cinematic camera (one station per section)
  ui/overlay.js          # nav, scroll sections, side dock, footer
```

## How the scene is driven

`camera-rig.js` anchors the camera to each section's real scroll position and
interpolates between stations — so the copy card and the 3D moment always stay
in sync. The active beat calls `world.setActive(i)`, which sets smoothed target
"amounts" (core energy, thread activity, node brightness, context, work, team,
deploy); `world.update()` animates the whole scene from those each frame.

### Notes

- `?capture` in the URL enables `preserveDrawingBuffer` (for headless screenshots); no effect on the normal experience.
- `window.__PLUTUS` exposes `{ stage, world, rig, overlay }` for debugging.
- Respects `prefers-reduced-motion`; the static copy is readable even if WebGL is unavailable.

## Disclaimer

A design/rendering concept. Copy is drafted placeholder text based on the public
description of Plutus and should be replaced with the official wording.
