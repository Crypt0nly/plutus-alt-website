# Product gallery

The section at `#experience` introduces Ocur, oDrops and oWorlds through three interactive illustrations. Product tabs support mouse, touch and the standard Arrow/Home/End keyboard controls. Ocur's dock switches calendar, files and automation examples; Drop selection switches the sample response; the world locations switch the room description. These controls use local illustrative data and never call a product API.

The shell composition follows `plutus-cloud/frontend/src/components/os/PrismHome.tsx`, `prismHome.css`, and the shell design reference. The Drop silhouettes and color palette are adapted from `odrops/src/Icon.tsx` and `drop-character.css`.

The oWorlds view shows the current product: a still of the **3D office** from oWorlds' own public demo (`app.ocur.ai/worlds?demo=1`, plutus-cloud `oworld/src/world3d/`, rendered from commit `6dae57b`, November 2026). It replaced an earlier static export of the old 2D office. The demo's synthetic roster is shown, with Olive, Milo and Luna seated at their own desks through the demo's saved layout, and the app's HTML labels and controls hidden. It was rendered in headless Chromium at full graphics quality: shadows, outlines, antialiasing and a pixel ratio of 2.

- `public/product/oworld-office-3d.webp` is 2400×1364 and ~195 KB. `oworld-office-3d-1200.webp` is the phone size, ~70 KB. Both are served through `srcset`.
- `public/product/oworlds-logo.webp` is the oWorlds mark (the fox with a city skyline, from `oworld/src/assets/oworld-logo.webp`) at 96px, shown beside the heading.
- The three room markers sit on the rooms' floors at the percentages the render reported:
  - Research lab: 29.8% / 25.2%
  - Sales office: 45.4% / 30.1%
  - Creative studio: 62.3% / 35.5%
- The art box keeps the image's proportions (`aspect-ratio: 2400/1364`), so the markers stay on their rooms. On wider screens the box covers the stage, with 4rem of overscan so the office can sit 2rem low, clear of the heading. On phones it becomes a rounded picture between the heading and the note.
- When oWorlds changes, re-render the same view from the demo at the same 1.76 aspect ratio and update the marker percentages if the camera moves.
- The link under the view opens the public demo world, which needs no account.

The other two views are vector art; all art is local and stays sharp on high-density displays.

The gallery uses the current website theme; the office retains its original illustration palette. English and German copy and accessibility labels live in `src/strings.de.js`. The existing sales dock is hidden while the gallery is in view. Product switching refreshes scroll measurements because the phone layouts have different heights. With no JavaScript, the three views remain readable in sequence. Reduced motion suppresses the reveal and hover movements. The character and narrow office layouts flow with enlarged text instead of overlapping it.
