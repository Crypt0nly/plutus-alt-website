# Ocur website design preview

The small bar at the top switches between **Original** and **New design** in place. The original stays the first-visit default. Share `https://ocur.ai/?design=cloud` or `https://ocur.ai/de?design=cloud` to open the new design directly. `?design=classic` explicitly opens the original.

The URL takes priority over the optional `ocur-site-design` localStorage preference. Language, campaign parameters and section links survive switching. Product and policy pages carry the choice through navigation. Pricing selections, form drafts and open FAQs stay mounted when the design changes. No personal form data is persisted by the switcher.

## Design source

Adapted from `Crypt0nly/plutus-cloud` at `5a962bb0`, particularly:

- `skills/ocur-design-language/agent.md`
- `skills/ocur-design-language/references/reading-tokens.css`
- `frontend/src/components/competitors/competitors.css`
- The approved CRM Today and Automation visual baselines.

The marketing adaptation uses the same neutral reading surfaces, blue actions, floating glass controls, rounded geometry and separate light/dark palettes. The fox identity stays intact. The new tour is explicitly illustrative, uses no live customer data and makes no API calls. The draft dialog uses native modal focus containment, Escape and focus restoration.

## Content and behavior

`cloud-design-content.js` renders English and German HTML at build time. The existing pricing, application, proof-of-work protection, booking links and analytics remain shared. Existing legal text and product descriptions are unchanged. `design-switcher.js` owns the preference and URL handling; `cloud-design.js` adds the homepage tour. The classic GSAP/Lenis effects are cleaned up before switching and recreated when returning.

Run `npm test` and `npm run build`. The latter also validates the German prerender, legal disclosures, structured data, internal links, discovery pages and sitemap. For browser review, use `npm run preview` after building and check both designs at 320, 390, 768 and 1280 pixels, both themes and enlarged text. Exercise repeated switching, form-draft retention, pricing audience/billing, tour panels, the draft dialog, language changes, product links and FAQ disclosure. Do not send a real application during testing.
