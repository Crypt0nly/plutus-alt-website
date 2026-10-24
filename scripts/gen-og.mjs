// Build/util script: render the static Open Graph share images — the 1200×630
// cards that unfurl when an ocur.ai link is pasted into X, WhatsApp, iMessage,
// LinkedIn, Slack or Discord.
//
//   public/og.jpg         → ocur.ai/        (the home page, English)
//   public/og-de.jpg      → ocur.ai/de/     (the home page, German)
//   public/be-ai-og.png   → ocur.ai/be-ai   (the reverse Turing test game)
//
// Rendered through Playwright's Chromium so the cards carry the site's real
// look — the opening's dark stage and the Ocur app language — rather than a
// hand-rolled bitmap.
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
// The opening's promise on its dark stage — the eyebrow, the two-line promise with its
// brushed-metal second voice — beside one Ocur window in the app's dark
// reading language: the ask, then the report (the supplier-call story).
const homeCard = (c) => `<!doctype html><html><head><meta charset="utf-8" />${FONTS}
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden; background: #080a0e; color: #f5f5f7;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', 'Segoe UI', Roboto, sans-serif;
    -webkit-font-smoothing: antialiased; }
  .card { position: relative; width: 1200px; height: 630px; padding: 52px 64px; isolation: isolate; overflow: hidden; }
  .dust { position: absolute; inset: 0; z-index: -2;
    background: radial-gradient(circle, rgba(255,255,255,0.2) 0.9px, transparent 1.4px) 0 0 / 26px 26px;
    -webkit-mask-image: radial-gradient(ellipse 70% 70% at 30% 50%, transparent 25%, #000 60%, transparent 95%); opacity: 0.45; }
  .orbit { position: absolute; z-index: -1; left: 360px; top: 315px; width: 1400px; height: 700px;
    border: 1.5px solid rgba(255,255,255,0.08); border-radius: 50%; transform: translate(-50%, -50%) rotate(-14deg);
    background: radial-gradient(closest-side, rgba(0,113,227,0.2), rgba(0,113,227,0.05) 55%, transparent 80%); }
  .top { display: flex; align-items: center; justify-content: space-between; }
  .brand { display: flex; align-items: center; gap: 12px; font-size: 30px; font-weight: 700; letter-spacing: -0.035em; }
  .brand svg { width: 40px; height: 34px; }
  .host { font-size: 21px; font-weight: 500; color: rgba(235,235,245,0.55); }
  .cols { display: flex; align-items: center; gap: 40px; margin-top: 34px; }
  .copy { flex: 1; min-width: 0; }
  .chip { display: inline-flex; align-items: center; gap: 10px; padding: 9px 18px; border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.06);
    font-size: 19px; font-weight: 500; color: rgba(235,235,245,0.72); }
  h1 { margin-top: 24px; font-size: ${c.size || 72}px; font-weight: 700; line-height: 1; letter-spacing: -0.05em; white-space: nowrap; }
  h1 em { font-style: normal; background: linear-gradient(180deg, #ffffff 8%, #8e8e96 108%);
    -webkit-background-clip: text; background-clip: text; color: transparent; }
  .sub { margin-top: 22px; font-size: 21px; line-height: 1.45; color: rgba(235,235,245,0.62); max-width: 540px; }
  .cta { display: inline-flex; margin-top: 28px; padding: 13px 26px; border-radius: 999px; background: #0071e3;
    color: #fff; font-size: 22px; font-weight: 600; box-shadow: 0 14px 32px -12px rgba(0,136,255,0.9); }

  /* one Ocur window, the app's dark reading surface */
  .win { width: 440px; flex: none; border-radius: 30px; overflow: hidden; background: #1c1c1e;
    box-shadow: 0 0 0 1px rgba(255,255,255,0.1), 0 40px 90px -30px rgba(0,0,0,0.9), 0 0 120px -40px rgba(0,113,227,0.5); }
  .bar { display: flex; align-items: center; gap: 8px; height: 52px; padding: 0 18px; border-bottom: 1px solid rgba(84,84,88,0.55); }
  .bar i { width: 12px; height: 12px; border-radius: 50%; background: #ff5f57; }
  .bar i:nth-child(2) { background: #febc2e; } .bar i:nth-child(3) { background: #28c840; }
  .bar .pill { margin-left: auto; display: flex; align-items: center; gap: 7px; padding: 5px 12px; border-radius: 999px;
    background: rgba(48,209,88,0.16); color: #65cf7d; font-size: 15px; font-weight: 600; }
  .bar .pill b { width: 8px; height: 8px; border-radius: 50%; background: #30d158; }
  .body { padding: 22px; background: #000; display: flex; flex-direction: column; gap: 14px; }
  .ask { align-self: flex-end; max-width: 94%; padding: 13px 17px; border-radius: 22px 22px 7px 22px;
    background: #0071e3; color: #fff; font-size: 18px; line-height: 1.38; font-weight: 500; }
  .report { padding: 20px 22px; border-radius: 22px; background: #1c1c1e; }
  .report small { font-size: 15px; font-weight: 500; color: #98989f; }
  .report .big { margin: 4px 0 12px; font-size: 52px; font-weight: 700; letter-spacing: -0.045em; line-height: 1.05; }
  .report .big span { font-size: 22px; font-weight: 600; letter-spacing: -0.02em; color: #98989f; }
  .report li { display: flex; align-items: center; gap: 11px; list-style: none; font-size: 16px; color: #f5f5f7; }
  .report li + li { margin-top: 9px; }
  .report li::before { content: ''; flex: none; width: 20px; height: 20px; border-radius: 50%;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 6 9 17l-5-5'/%3E%3C/svg%3E") center / 12px no-repeat, #30d158; }
</style></head>
<body>
  <div class="card">
    <div class="dust"></div>
    <div class="orbit"></div>
    <div class="top">
      <span class="brand">${LOGO} Ocur</span>
      <span class="host">ocur.ai</span>
    </div>
    <div class="cols">
      <div class="copy">
        <span class="chip">${c.kicker}</span>
        <h1>${c.h1}</h1>
        <p class="sub">${c.sub}</p>
        <span class="cta">${c.cta}</span>
      </div>
      <div class="win">
        <div class="bar"><i></i><i></i><i></i><span class="pill"><b></b> ${c.pill}</span></div>
        <div class="body">
          <p class="ask">${c.ask}</p>
          <div class="report">
            <small>${c.kicker2}</small>
            <p class="big">€312<span> ${c.recovered}</span></p>
            <ul>${c.steps.map((s) => `<li>${s}</li>`).join('')}</ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</body></html>`;

// Copy mirrors the opening + pinned demo on each page (see index.html /
// src/strings.de.js): the supplier-call story — Ocur really phones.
const HOME_EN = homeCard({
  kicker: 'The AI operating system for companies',
  h1: 'Less busywork.<br /><em>More business.</em>',
  sub: 'Ocur answers your email and your phone, connects your tools, and follows through on the work.',
  cta: 'Start free',
  pill: 'Autopilot on',
  ask: 'Friday’s delivery came in 40 units short — sort it out with the supplier.',
  kicker2: 'While you stayed in your meeting',
  recovered: 'recovered',
  steps: ['Supplier called — credit agreed', 'Redelivery Thu 08:00, on your calendar', 'Call transcript filed'],
});

const HOME_DE = homeCard({
  kicker: 'Das KI-Betriebssystem für Unternehmen',
  h1: 'Weniger Routine.<br /><em>Mehr Unternehmen.</em>',
  size: 60,
  sub: 'Ocur beantwortet E-Mails und Anrufe, verbindet deine Tools und bringt die Arbeit zu Ende.',
  cta: 'Kostenlos starten',
  pill: 'Autopilot an',
  ask: 'In der Freitagslieferung fehlen 40 Stück — klär das mit dem Lieferanten.',
  kicker2: 'Während du im Meeting warst',
  recovered: 'zurückgeholt',
  steps: ['Lieferant angerufen, Gutschrift fix', 'Nachlieferung Do 08:00, im Kalender', 'Gesprächsprotokoll abgelegt'],
});

// ── the /be-ai card ──────────────────────────────────────────────────────────
// The game in the site's light reading language: white answer cards on the
// canvas, the action blue for "AI" and its marker swash.
const BE_AI = `<!doctype html><html><head><meta charset="utf-8" />${FONTS}
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap" rel="stylesheet" />
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden; background: #f2f2f7; color: #1c1c1e;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', 'Segoe UI', Roboto, sans-serif;
    -webkit-font-smoothing: antialiased; }
  .card { position: relative; width: 1200px; height: 630px; padding: 58px 80px; isolation: isolate; overflow: hidden; }
  .glow { position: absolute; z-index: -1; top: -260px; left: 50%; width: 1100px; height: 700px; transform: translateX(-50%);
    border-radius: 50%; background: radial-gradient(closest-side, rgba(0,136,255,0.16), transparent 70%); }
  .kicker { display: flex; align-items: center; gap: 12px; font-size: 22px; font-weight: 600; color: #0067ce; }
  .kicker b { width: 11px; height: 11px; border-radius: 50%; background: #0088ff; }
  h1 { margin-top: 18px; font-size: 92px; font-weight: 700; line-height: 1; letter-spacing: -0.052em; }
  h1 span { position: relative; color: #0067ce; }
  h1 span::after { content: ''; position: absolute; z-index: -1; left: -4%; right: -4%; bottom: 0.02em; height: 0.5em;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 18' preserveAspectRatio='none'%3E%3Cpath d='M2 12c20-8 60-9 116-4' fill='none' stroke='%230a84ff' stroke-width='5' stroke-linecap='round' opacity='0.42'/%3E%3C/svg%3E") 0 0 / 100% 100% no-repeat; }
  .duel { display: flex; gap: 20px; margin-top: 34px; }
  .ans { flex: 1; padding: 22px 26px; border-radius: 26px; background: #fff; border: 1px solid rgba(60,60,67,0.1);
    box-shadow: 0 1px 1px rgba(0,0,0,0.025), 0 18px 40px -18px rgba(0,0,0,0.2); }
  .ans .slot { display: inline-grid; place-items: center; width: 34px; height: 34px; border-radius: 50%;
    background: rgba(0,136,255,0.1); color: #0067ce; font-weight: 700; font-size: 17px; margin-bottom: 12px; }
  .ans p { font-size: 21px; line-height: 1.42; color: #1c1c1e; }
  .caption { margin-top: 26px; font-size: 24px; color: #6c6c70; }
  .caption strong { color: #1c1c1e; }
  .foot { position: absolute; left: 80px; right: 80px; bottom: 46px; display: flex; align-items: center; justify-content: space-between;
    font-size: 24px; color: #6c6c70; }
  .foot .made { display: flex; align-items: center; gap: 11px; color: #1c1c1e; font-weight: 600; }
  .foot .made svg { width: 32px; height: 27px; }
  .hand { font-family: 'Caveat', cursive; font-size: 30px; color: #0067ce; }
</style></head>
<body>
  <div class="card">
    <div class="glow"></div>
    <div class="kicker"><b></b> Ocur · The live reverse Turing test</div>
    <h1>be the <span>AI</span>.</h1>
    <div class="duel">
      <div class="ans"><span class="slot">A</span><p>Here's the practical take — start small, handle the common case first, then iterate. Want me to break it into steps?</p></div>
      <div class="ans"><span class="slot">B</span><p>honestly?? official AI answer: yes, 100%, do not ask follow-ups. beep boop. moving on before anyone fact-checks me.</p></div>
    </div>
    <p class="caption"><strong>A room of humans pretending to be an AI.</strong> One is the real Ocur. <span class="hand">Can you tell?</span></p>
    <div class="foot"><span>ocur.ai/be-ai</span><span class="made">${LOGO} Made with Ocur</span></div>
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
