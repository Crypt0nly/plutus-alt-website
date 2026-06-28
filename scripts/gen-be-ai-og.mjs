// Build/util script: render the static Open Graph share image for the /be-ai
// page to public/be-ai-og.png (1200×630, what unfurls when ocur.ai/be-ai is
// shared on X / LinkedIn / iMessage). Uses Playwright's Chromium so the card
// is the real Obsidian-Glass look rather than a hand-rolled bitmap.
//
//   npm i -D playwright   (one-off; not a shipped dep, to keep installs +
//                          Vercel builds from pulling a browser download)
//   npm run gen:og        (→ node scripts/gen-be-ai-og.mjs)
//
// The output PNG is committed, so this only needs re-running when the card
// design changes — the production build does NOT invoke it.

import { chromium } from 'playwright';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../public/be-ai-og.png');

const HTML = `<!doctype html><html><head><meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@600&display=swap" rel="stylesheet" />
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

const browser = await chromium.launch(launchOpts);
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(HTML, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300); // let the webfont settle
  mkdirSync(dirname(OUT), { recursive: true });
  await page.screenshot({ path: OUT, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  console.log('✓ wrote', OUT);
} finally {
  await browser.close();
}
