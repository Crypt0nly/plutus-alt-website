# Ocur scroll introduction

The landing page opens with a three-chapter particle sculpture: an orbit, a connected globe, and the Ocur fox. This replaces the optional Cloud design experiment and its switcher. Existing `?design=cloud` links now show the same homepage as every other visitor.

`index.html` contains the real English headings, actions, and vector poster. `src/strings.de.js` supplies the German translation, including the prerendered `/de` page. Essential content never depends on WebGL.

`src/intro.js` uses the existing GSAP/ScrollTrigger and Lenis setup. A CSS sticky stage occupies 280 viewport heights on sufficiently large screens. Scrolling, chapter buttons, and the direct “Explore Ocur” link all work with normal document navigation. Smaller screens, short windows, and enlarged text use normal flow. Reduced motion does not initialize the intro or download Three.js.

`src/intro-scene.js` is a separate dynamic chunk. It draws one point cloud with 18,000 desktop / 6,500 mobile particles. Static buffer attributes hold the three shapes; a vertex shader interpolates them. The final shape samples our existing local `logo.svg`. There are no videos, model downloads, textures, shadows, or postprocessing passes.

Rendering is demand-driven: scroll updates, a brief eased pointer response, resize, and theme changes. It stops while idle, offscreen, or in a hidden tab. Device pixel ratio is capped at 1.5 desktop / 1.25 mobile; sustained slow frames lower quality. Data saver skips the 3D chunk. WebGL or asset failure retains the local vector poster; context loss releases resources and returns to the poster. Non-bfcache page exit disconnects observers, cancels frames, and disposes GPU resources. A change to the OS motion preference cleans up animation and switches modes in place, preserving form drafts.

Validation: `npm test` and `npm run build` cover geometry invariants, static/translated content, pricing, form protection, and all existing legal/discovery checks. Browser QA should cover all three chapters in both directions, direct anchor navigation, EN/DE, both themes, narrow widths, enlarged text, reduced motion, no JavaScript, and WebGL/context-loss fallback. Inspect render-frame counters in `.oc-art[data-frames]` to confirm idle/offscreen suspension. Never submit real leads during QA.
