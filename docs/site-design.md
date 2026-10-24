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

Change the site's palette by updating those tokens there first, then the
`--cp-*` block at the top of `src/style.css`.

## Structure of the page

1. **The opening** (`.hx`, `#top`): what Ocur is, both doors, and Ocur at
   work. It sits on the stage colour (`--stage: #080a0e`) in both themes;
   see [hero.md](hero.md).
2. **The sheet** (`.o-sheet`): everything else, on the app's canvas, rising
   over the opening with rounded top corners.
3. **The closing card** (`.g-final-card`): the stage once more, as a card,
   above the footer.

The opening, the closing card and the autopilot tile are dark islands: the
`.o-dark` class redefines the tokens for its subtree, in either theme.

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
  second voice of a headline is the secondary label colour on the canvas and
  brushed metal on the stage.
- **One selection lens.** The nav's lens slides to the chapter on screen
  (`src/chrome.js`); the segmented controls slide theirs the same way.
- **Geometry.** 26px cards, 22px tiles, 999px capsules, 18px gaps; the
  sections breathe at `--g-section`.

## Motion

Scroll motion lives in `src/main.js`, inside `gsap.matchMedia()` for
`(prefers-reduced-motion: no-preference)`. It reverts completely when that
preference changes. The opening's deck is `src/hero.js`, started from the
same place.

| Moment | What happens |
| --- | --- |
| The opening | paint-time CSS: the headline and its sentence settle out of a soft blur, a light passes over "More business.", the deck lands in front of its light and starts dealing jobs. As the sheet rises, the opening scales back and dims, and the deck rests |
| Navigation | the lens follows the chapter; the nav turns from dark to light glass when the sheet reaches it |
| Connectors | the rings expand, the sun pops, the planets swirl out to their orbits |
| Demo | the window tips up out of the page; the ask types itself; four scenes over one pinned stretch, with the step rail filling toward the next step |
| Headlines | every section headline rises line by line out of its own mask (SplitText, re-split on font load and resize) |
| The ledgers | the statement lights up word by word, scrubbed to the scroll |
| Cards | ledgers, tiles, steps, prices, perks, the application and the resources cascade in row by row |
| First ten minutes | the timeline's line draws itself with the scroll |
| Pricing | the selection slides; prices re-set themselves when the billing interval changes |
| FAQ | answers unfold to their height where the browser supports `interpolate-size` |
| Closing card | the card opens up to full size; the fox and the headline rise |
| Dock | appears once the sheet has risen; steps aside for the demo, the application and the close |

Guard rails:

- Hidden starting states are set by GSAP, never by CSS, so the page reads
  with JavaScript off. Without JavaScript the demo shows its end state. The
  one exception is the opening's entrance: it is CSS so it starts with the
  first paint, and it never hides the headline (see [hero.md](hero.md)).
- Elements GSAP moves have their CSS transitions held off during the reveal
  and handed back afterwards (`transition: none`, then `clearProps`), so the
  two never ease the same property.
- Reveals use opacity, never `visibility`, so keyboard focus can reach
  content that has not been revealed yet.

## Checking a change

`npm test` and `npm run build` (German prerender, legal and discovery
checks). In a browser: 320, 390, 768, 1120, 1280 and 1440 wide; light and
dark; `/` and `/de`; reduced motion; JavaScript off; and the reading pages
(`/privacy`, `/product`, `/data`) and the game (`/be-ai`). Never submit a
real application while testing.

The link previews (`public/og.jpg`, `og-de.jpg`, `be-ai-og.png`) are drawn in
the same language by `npm run gen:og`; bump their `?v=` when they change.
