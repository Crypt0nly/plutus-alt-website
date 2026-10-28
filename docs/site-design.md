# Site design

The public site speaks the Ocur app language: the design approved for
plutus-cloud's app interiors on 2026-10-16 (Competitors, News, Automation,
CRM). Source of truth, in the plutus-cloud repository:

- `skills/ocur-design-language/agent.md` — the guide (surfaces, type,
  geometry, navigation, components, motion, accessibility).
- `skills/ocur-design-language/references/reading-tokens.css` — the exact
  palette, glass and frost values.
- `frontend/src/components/competitors/competitors.css` — the reference
  implementation of the glass capsule, tab lens, buttons and sheets.

The `--cp-*` block at the top of `src/style.css` matches that palette. Keep
the CSS-only dark fallback in sync too. Follow the app guide when reviewing
this site; the desktop shell's Prism/Pulse styling is not the public site's
design authority.

## Structure of the page

1. **The opening** (`.hx`, `#top`): what Ocur is, both doors, and Ocur at
   work. It uses the current theme's neutral canvas;
   see [hero.md](hero.md).
2. **The sheet** (`.o-sheet`): everything else, on the app's canvas, rising
   over the opening with rounded top corners.
3. **The closing card** (`.g-final-card`): an opaque reading card above the
   footer, with the same 26px corners and restrained shadow as other content.

The opening, closing card, autopilot tile and game all follow the selected
theme. Do not restore forced dark islands, decorative background auras,
metallic headline gradients or hand-drawn interface fonts. Existing brand
marks and the game's drawing-paper colours retain their own identity.

## Rules carried over from the app guide

- **Cards for content, glass for controls.** `.lg` is the opaque card (white
  on `#f2f2f7`, charcoal on black). Glass — fill and blur on `::before`,
  bright edge on `::after` — is reserved for the floating nav, the phone
  menu, the dock and the segmented controls.
- **Blue means action and selection.** Filled blue capsules are the primary
  actions; gray capsules with blue text are the quiet second doors. Orange
  marks attention (the founding deadline) and the fox; green marks success
  and live status; small category symbols carry the other colours.
- **Sentence case, calm type.** The system stack first (SF Pro on Apple
  devices), Inter elsewhere. Headlines are 700 with tight tracking; the
  second voice of a headline uses the secondary label colour. Reading-page
  headings use the guide's 2.125rem title and prose is bounded to 46rem.
- **One selection lens.** The nav's lens slides to the chapter on screen
  (`src/chrome.js`); the segmented controls slide theirs the same way.
- **Geometry.** 26px cards, 22px tiles, 999px capsules, 18px gaps; the
  sections breathe at `--g-section`.

## Motion

Scroll motion lives in a reversible GSAP context in `src/main.js`. It only
runs without a system reduced-motion preference or `data-motion="reduced"`.
Changing either preference reverts pins, inline styles and split text. The
opening's deck is `src/hero.js`, started from the same place. Its copy and
actions are immediately readable; do not reintroduce a blurred entrance.

| Moment | What happens |
| --- | --- |
| The opening | the copy and actions are immediately readable; the example deck deals jobs and rests when the sheet covers it |
| Navigation | the lens follows the chapter; the nav turns from dark to light glass when the sheet reaches it |
| Connectors | the rings expand, the sun pops, the planets swirl out to their orbits |
| Demo | the window tips up out of the page; the ask types itself; four scenes over one pinned stretch, with the step rail filling toward the next step |
| Headlines | every section headline rises line by line out of its own mask (SplitText, re-split on font load and resize) |
| The ledgers | the statement lights up word by word, scrubbed to the scroll |
| Cards | ledgers, tiles, steps, prices, perks, the application and the resources cascade in row by row |
| First ten minutes | the timeline's line draws itself with the scroll |
| Pricing | the selection slides; prices re-set themselves when the billing interval changes |
| FAQ | answers unfold to their height where the browser supports `interpolate-size` |
| Closing card | a neutral card with the same type and material roles as the main content |
| Dock | appears once the sheet has risen; steps aside for the demo, the application and the close |

Guard rails:

- Hidden starting states are set by GSAP, never by CSS, so the page reads
  with JavaScript off. Without JavaScript the demo shows its end state. The
  opening's copy and actions have no entrance delay.
- Elements GSAP moves have their CSS transitions held off during the reveal
  and handed back afterwards (`transition: none`, then `clearProps`), so the
  two never ease the same property.
- Reveals use opacity, never `visibility`, so keyboard focus can reach
  content that has not been revealed yet.

## Navigation and accessibility

`src/mobile-menu.js` controls the shared narrow-screen menu on the homepage,
reading pages and game. It moves focus into the dialog, traps Tab/Shift+Tab,
supports Escape, makes the background inert, and restores focus on close.
Language links only appear when a translation exists. Touch controls have
a 44px minimum target. Keep high-contrast glass solid and remove backdrop
blur for reduced-transparency preferences.

## Checking a change

`npm test` and `npm run build` (German prerender, legal and discovery
checks). In a browser: 320, 390, 768, 1120, 1280 and 1440 wide; light and
dark; `/` and `/de`; reduced motion; JavaScript off; and the reading pages
(`/privacy`, `/product`, `/data`) and the game (`/be-ai`). Never submit a
real application while testing.

The link previews (`public/og.jpg`, `og-de.jpg`, `be-ai-og.png`) are drawn in
the same language by `npm run gen:og`; bump their `?v=` when they change.
