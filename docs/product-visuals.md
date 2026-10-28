# Product gallery

The section at `#experience` introduces Ocur, oDrops and oWorlds through three interactive illustrations. Product tabs support mouse, touch and the standard Arrow/Home/End keyboard controls. Ocur's dock switches calendar, files and automation examples; Drop selection switches the sample response; the world locations switch the room description. These controls use local illustrative data and never call a product API.

The shell composition follows `plutus-cloud/frontend/src/components/os/PrismHome.tsx`, `prismHome.css`, and the shell design reference. The Drop silhouettes and color palette are adapted from `odrops/src/Icon.tsx` and `drop-character.css`.

`public/product/oworld-office.svg` is a static vector export of `oworld/src/WorldScene.tsx`, with the repository's synthetic demo roster. It was rendered from the available product snapshot (`e25c62d`) and stripped of in-scene labels and interaction metadata. Only the resulting illustration is included here; the React renderer and its API code are not shipped. All art is local and remains sharp on high-density displays.

The gallery uses the current website theme; the office retains its original illustration palette. English and German copy and accessibility labels live in `src/strings.de.js`. The existing sales dock is hidden while the gallery is in view. Product switching refreshes scroll measurements because the phone layouts have different heights. With no JavaScript, the three views remain readable in sequence. Reduced motion suppresses the reveal and hover movements.
