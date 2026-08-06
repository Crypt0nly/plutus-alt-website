// Build/util script: render the static Open Graph share images — the 1200×630
// cards that unfurl when an ocur.ai link is pasted into X, WhatsApp, iMessage,
// LinkedIn, Slack or Discord.
//
//   public/og.jpg         → ocur.ai/        (the home page, English)
//   public/og-de.jpg      → ocur.ai/de/     (the home page, German)
//   public/be-ai-og.png   → ocur.ai/be-ai   (the reverse Turing test game)
//
// Rendered through Playwright's Chromium so the cards are the real
// Obsidian-Glass look rather than a hand-rolled bitmap.
//
//   npm i -D playwright   (one-off; not a shipped dep, to keep installs +
//                          Vercel builds from pulling a browser download)
//   npm run gen:og        (→ node scripts/gen-og.mjs)
//
// The outputs are committed, so this only needs re-running when a card design
// changes — the production build does NOT invoke it. Keep every card well
// under ~300 KB: WhatsApp silently drops previews for heavy images. That's why
// the home cards ship as JPEG (q96 ≈ 130 KB, no visible difference on a card
// that's mostly a smooth gradient) while /be-ai keeps the PNG it was already
// shared with.
//
// Crawlers cache aggressively by URL. After changing a card, bump the ?v=
// query on the og:image/twitter:image meta tags so the new art is picked up
// (and re-scrape at cards-dev.twitter.com/validator).

import { chromium } from 'playwright';
import { existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, '../public');

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@600&display=swap" rel="stylesheet" />`;

// The brand mark, inlined so the card renders with no network fetch.
const LOGO = `<svg viewBox="1088.71 900.58 822.58 698.84" xmlns="http://www.w3.org/2000/svg"><path fill="#F2942E" d="M1794.42,1331.64c-21.619-26.497-19.012-48.249,0.209-77.807c63.9-98.279,142.451-330.969,108.449-352.047c-7.186-4.452-22.26,4.341-29.537,11.457c-66.975,65.529-133.088,131.948-199.34,198.214c-33.447,33.453-72.611,50.322-120.957,49.696c-20.16-0.257-37.654-0.243-53.243-0.194c-15.59-0.049-33.085-0.063-53.244,0.194c-48.347,0.626-87.511-16.243-120.957-49.696c-66.252-66.266-132.365-132.685-199.341-198.214c-7.276-7.116-22.351-15.909-29.537-11.457c-34.002,21.078,44.549,253.768,108.45,352.047c19.22,29.558,21.828,51.31,0.208,77.807c-7.388,9.05-12.925,19.985-17.593,30.796c-11.45,26.489-1.203,49.8,25.537,60.354c1.092,0.424,2.281,0.723,3.45,0.82c111.295,9.962,186.451,78.495,254.248,158.063c10.288,12.076,19.512,18.344,28.778,17.703c9.265,0.641,18.489-5.627,28.778-17.703c67.795-79.567,142.951-148.101,254.246-158.063c1.17-0.098,2.359-0.396,3.451-0.82c26.74-10.554,36.986-33.864,25.537-60.354C1807.346,1351.625,1801.809,1340.689,1794.42,1331.64z M1393.151,1381.628l-29.829-49.418l50.754,23.596l2.226,35.172L1393.151,1381.628z M1606.85,1381.628l-23.15,9.35l2.227-35.172l50.752-23.596L1606.85,1381.628z"/></svg>`;

// ── the home card ────────────────────────────────────────────────────────────
// Mirrors the hero: kicker, the two-line headline with the gradient payoff,
// and one proof beat from the pinned demo (the ask → the work done).
const homeCard = (c) => `<!doctype html><html><head><meta charset="utf-8" />${FONTS}
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden;
    font-family: 'Inter', -apple-system, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(150deg, #0a0a0f, #060608); color: #f5f5f7; }
  .card { position: relative; width: 1200px; height: 630px; padding: 54px 76px; isolation: isolate; }
  .glow { position: absolute; border-radius: 50%; filter: blur(80px); z-index: -1; }
  .glow-a { top: -190px; right: -150px; width: 860px; height: 600px;
    background: radial-gradient(closest-side, rgba(242,148,46,0.52), transparent 70%); }
  .glow-b { bottom: -190px; left: -170px; width: 700px; height: 560px;
    background: radial-gradient(closest-side, rgba(255,120,73,0.30), transparent 72%); }
  .frame { position: absolute; inset: 22px; border: 2px solid rgba(255,255,255,0.10); border-radius: 36px; z-index: -1; }

  /* brand bar */
  .top { display: flex; align-items: center; justify-content: space-between; }
  .brand { display: flex; align-items: center; gap: 12px; font-size: 30px; font-weight: 700; letter-spacing: -0.02em; }
  .brand svg { width: 40px; height: 34px; }
  .host { font-family: 'JetBrains Mono', monospace; font-size: 20px; color: #9d9da6; }

  .kicker { display: flex; align-items: center; gap: 12px; margin-top: 44px;
    font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 600;
    letter-spacing: 0.15em; text-transform: uppercase; color: #ffc680; }
  .kicker .dot { width: 12px; height: 12px; border-radius: 50%; background: #f2942e; flex: none;
    box-shadow: 0 0 16px rgba(242,148,46,0.9); }

  h1 { margin-top: 20px; font-size: 76px; font-weight: 800; line-height: 1.02; letter-spacing: -0.038em; }
  .grad { background: linear-gradient(95deg, #ffc680, #f2942e 45%, #ff7849);
    -webkit-background-clip: text; background-clip: text; color: transparent; }

  /* liquid-glass proof window */
  .win { margin-top: 40px; border-radius: 24px; padding: 22px 26px;
    background: linear-gradient(155deg, rgba(255,255,255,0.10), rgba(255,255,255,0.035) 42%, rgba(255,255,255,0.07));
    border: 1px solid rgba(255,255,255,0.14); box-shadow: 0 24px 60px rgba(0,0,0,0.45); }
  .ask { display: flex; align-items: center; justify-content: space-between; gap: 24px; }
  .ask p { font-size: 24px; color: #e9e9ee; }
  .pill { display: flex; align-items: center; gap: 9px; flex: none; padding: 8px 16px; border-radius: 999px;
    background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);
    font-size: 17px; font-weight: 600; color: #f5f5f7; white-space: nowrap; }
  .pill i { width: 9px; height: 9px; border-radius: 50%; background: #f2942e;
    box-shadow: 0 0 12px rgba(242,148,46,0.9); }
  .steps { display: flex; gap: 26px; margin-top: 18px; padding-top: 18px;
    border-top: 1px solid rgba(255,255,255,0.09); font-size: 20px; color: #9d9da6; }
  .steps span { display: flex; align-items: center; gap: 9px; }
  .steps b { color: #f2942e; font-size: 21px; }

  .foot { position: absolute; left: 76px; right: 76px; bottom: 46px;
    display: flex; align-items: center; justify-content: space-between; font-size: 22px; color: #9d9da6; }
  .foot .cta { padding: 11px 24px; border-radius: 999px; font-weight: 700; font-size: 21px;
    color: #0a0a0c; background: linear-gradient(150deg, #ffc680, #f2942e 55%, #ff7849); }
</style></head>
<body>
  <div class="card">
    <div class="glow glow-a"></div>
    <div class="glow glow-b"></div>
    <div class="frame"></div>
    <div class="top">
      <span class="brand">${LOGO} Ocur</span>
      <span class="host">ocur.ai</span>
    </div>
    <p class="kicker"><span class="dot"></span> ${c.kicker}</p>
    <h1>${c.h1}</h1>
    <div class="win">
      <div class="ask">
        <p>${c.ask}</p>
        <span class="pill"><i></i> ${c.pill}</span>
      </div>
      <div class="steps">${c.steps.map((s) => `<span><b>✓</b> ${s}</span>`).join('')}</div>
    </div>
    <div class="foot"><span>${c.micro}</span><span class="cta">${c.cta}</span></div>
  </div>
</body></html>`;

// Copy mirrors the live hero on each page (see index.html / src/strings.de.js).
const HOME_EN = homeCard({
  kicker: 'The AI operating system for companies',
  h1: 'What if your company<br /><span class="grad">ran itself?</span>',
  ask: '“Chase the overdue invoices and update the sheet.”',
  pill: 'Autopilot on',
  steps: ['14 reminders sent', 'Sheet updated', '2 already paid'],
  micro: 'Free pilot · No credit card · No IT project',
  cta: 'Start free',
});

const HOME_DE = homeCard({
  kicker: 'Das KI-Betriebssystem für Unternehmen',
  h1: 'Deine KI redet nicht.<br /><span class="grad">Sie erledigt.</span>',
  ask: '„Mahne die überfälligen Rechnungen an und aktualisiere die Tabelle.“',
  pill: 'Autopilot an',
  steps: ['14 Erinnerungen raus', 'Tabelle aktualisiert', '2 schon bezahlt'],
  micro: 'Kostenlos testen · Keine Kreditkarte · Kein IT-Projekt',
  cta: 'Kostenlos starten',
});

// ── the /be-ai card ──────────────────────────────────────────────────────────
const BE_AI = `<!doctype html><html><head><meta charset="utf-8" />${FONTS}
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden;
    font-family: 'Inter', -apple-system, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(150deg, #0a0a0f, #060608); color: #f5f5f7; }
  .card { position: relative; width: 1200px; height: 630px; padding: 60px 84px; isolation: isolate; }
  .glow { position: absolute; border-radius: 50%; filter: blur(80px); z-index: -1; }
  .glow-a { top: -160px; right: -120px; width: 760px; height: 540px;
    background: radial-gradient(closest-side, rgba(242,148,46,0.42), transparent 70%); }
  .glow-b { bottom: -220px; left: -140px; width: 620px; height: 520px;
    background: radial-gradient(closest-side, rgba(255,120,73,0.26), transparent 72%); }
  .frame { position: absolute; inset: 22px; border: 2px solid rgba(255,255,255,0.10); border-radius: 36px; z-index: -1; }
  .kicker { display: flex; align-items: center; gap: 12px;
    font-family: 'JetBrains Mono', monospace; font-size: 21px; font-weight: 600;
    letter-spacing: 0.16em; text-transform: uppercase; color: #ffc680; }
  .kicker .dot { width: 13px; height: 13px; border-radius: 50%; background: #f2942e;
    box-shadow: 0 0 16px rgba(242,148,46,0.9); }
  h1 { margin-top: 22px; font-size: 70px; font-weight: 800; line-height: 1.03; letter-spacing: -0.035em; }
  .grad { background: linear-gradient(95deg, #ffc680, #f2942e 45%, #ff7849);
    -webkit-background-clip: text; background-clip: text; color: transparent; }
  .duel { display: flex; gap: 20px; margin-top: 32px; }
  .ans { flex: 1; padding: 20px 24px; border-radius: 22px; background: rgba(255,255,255,0.055);
    border: 1px solid rgba(255,255,255,0.12); }
  .ans .slot { display: inline-grid; place-items: center; width: 32px; height: 32px; border-radius: 9px;
    background: rgba(255,255,255,0.14); font-weight: 700; font-size: 16px; margin-bottom: 12px; }
  .ans p { font-size: 21px; line-height: 1.42; color: #e9e9ee; }
  .caption { margin-top: 26px; font-size: 24px; color: #9d9da6; }
  .caption strong { color: #f5f5f7; }
  .foot { position: absolute; left: 84px; right: 84px; bottom: 44px;
    display: flex; align-items: center; justify-content: space-between;
    font-size: 25px; color: #9d9da6; }
  .foot .made { display: flex; align-items: center; gap: 11px; color: #f5f5f7; font-weight: 600; }
  .foot .made b { width: 26px; height: 26px; border-radius: 7px;
    background: linear-gradient(150deg, #f2942e, #ff7849); display: inline-block; }
</style></head>
<body>
  <div class="card">
    <div class="glow glow-a"></div>
    <div class="glow glow-b"></div>
    <div class="frame"></div>
    <div class="kicker"><span class="dot"></span> Ocur · The live reverse Turing test</div>
    <h1>be the <span class="grad">AI</span>.</h1>
    <div class="duel">
      <div class="ans"><span class="slot">A</span><p>Here's the practical take — start small, handle the common case first, then iterate. Want me to break it into steps?</p></div>
      <div class="ans"><span class="slot">B</span><p>honestly?? official AI answer: yes, 100%, do not ask follow-ups. beep boop. moving on before anyone fact-checks me.</p></div>
    </div>
    <p class="caption"><strong>A room of humans pretending to be an AI.</strong> One is the real Ocur. Can you tell?</p>
    <div class="foot"><span>ocur.ai/be-ai</span><span class="made"><b></b> Made with Ocur</span></div>
  </div>
</body></html>`;

const CARDS = [
  { file: 'og.jpg', html: HOME_EN, type: 'jpeg', quality: 96 },
  { file: 'og-de.jpg', html: HOME_DE, type: 'jpeg', quality: 96 },
  { file: 'be-ai-og.png', html: BE_AI, type: 'png' },
];

function resolveExecutable() {
  // The managed env ships Chromium at a fixed path that may not match the
  // Playwright npm version's expected build; prefer it, fall back to default.
  for (const candidate of [process.env.PW_CHROMIUM_PATH, '/opt/pw-browsers/chromium']) {
    if (candidate && existsSync(candidate)) return candidate;
  }
  return undefined;
}

const launchOpts = {};
const exe = resolveExecutable();
if (exe) launchOpts.executablePath = exe;

const only = process.argv.slice(2); // e.g. `node scripts/gen-og.mjs og.jpg`
const queue = only.length ? CARDS.filter((c) => only.includes(c.file)) : CARDS;

const browser = await chromium.launch(launchOpts);
try {
  mkdirSync(OUT_DIR, { recursive: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  for (const card of queue) {
    const out = resolve(OUT_DIR, card.file);
    await page.setContent(card.html, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300); // let the webfont settle
    await page.screenshot({
      path: out,
      type: card.type,
      ...(card.quality ? { quality: card.quality } : {}),
      clip: { x: 0, y: 0, width: 1200, height: 630 },
    });
    console.log(`✓ wrote ${out} (${Math.round(statSync(out).size / 1024)} KB)`);
  }
} finally {
  await browser.close();
}
