# Ocur scroll introduction

The opening is a full-screen particle sequence: orbit → “Your business. In motion.” → globe → “You set direction. Ocur takes action.” → Ocur fox. The particles form the words themselves. Short captions accompany the shapes and disappear during the text holds. Navigation, product copy and conversion actions appear after the introduction. A keyboard-visible skip link moves focus directly to that content.

`index.html` retains the real headings, links and local vector poster. `src/strings.de.js` supplies the German copy, including prerendered `/de`. The GPU samples its text from those same DOM spans; translated wording cannot diverge from the accessible HTML. Existing `?design=cloud` links continue to show the main homepage; the rejected design switcher stays removed.

## Scrolling and rendering

`src/intro.js` uses native document scrolling and one requestAnimationFrame callback for both progress and a synchronous GPU draw. Lenis and its global anchor interception have been removed. A single time-based 95 ms damping function smooths input without stacking scroll and render interpolation. Geometry and caption fades use exactly the same progress. The other page sections retain their existing GSAP/ScrollTrigger animations, refreshed when the intro changes layout.

The sticky stage occupies 400 small viewport heights on desktop and 360 on phones. Its long scroll range is enabled only after the first successful WebGL draw. Navigating past the opening while the chunk loads prevents late insertion of the pin. Navigation is inert while covered and restored when the visitor leaves or skips the stage.

`src/intro-scene.js` is dynamically imported. One point cloud draws 16,000 desktop / 10,000 mobile particles in one draw call. Static buffer attributes hold all five targets; the vertex shader performs the morphs. The logo comes from local `logo.svg`; text is rasterized once using the loaded font, with a system-font fallback. There are no model, video or texture downloads, shadows or postprocessing passes.

The opaque canvas avoids full-screen transparent composition. Its rendering budget is capped at 1.5 million pixels and DPR 1.4. Sustained slow frames reduce resolution by 20% on each axis while retaining every text particle. Idle, offscreen and hidden-tab rendering stops. No continuous pointer animation or separate renderer RAF runs. `.oc-art[data-frames]`, `[data-draws]` and `[data-pixels]` expose sampled diagnostics; `[data-frame-ms]` is an approximate active-loop measurement, not a hardware benchmark.

## Fallbacks and validation

Reduced motion and data saver skip the Three.js chunk. Short viewports and enlarged root text use the static layout. JavaScript, asset, shader or WebGL failure leaves the poster and readable HTML without a long scroll trap. Context loss disposes the scene and removes the pin. Live OS motion changes switch modes in place, preserving form drafts. Observers, listeners and GPU resources are disposed on non-bfcache page exit.

Run `npm test` and `npm run build`. Tests cover all morph targets, finite/repeatable geometry, planar text, reversible frame-rate-independent damping, accessible/translated content, pricing and form protection. The build checks all 18 discovery/legal pages.

Browser QA covers both text holds and all shapes in both scroll directions, narrow phones, tall desktop viewports, EN/DE, navigation handoff, idle/offscreen suspension, enlarged text, reduced motion, data saver, no JavaScript, unavailable WebGL and context loss. Never submit real leads during QA.

Local embedded-browser profiling at 1280 × 780 measured a 22.9 ms median and 31.3 ms p95 over 179 frame intervals, versus approximately 50 ms median / 93.9 ms p95 for the previous implementation in this environment. This is a development comparison, not a guaranteed device frame rate. Recheck on real mobile hardware when tuning particle density or shaders.
