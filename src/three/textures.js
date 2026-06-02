import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Procedural label artwork.
// Every label is drawn onto a 2D <canvas> and uploaded to the GPU as a texture,
// so the whole "supermarket" ships with zero image assets.
// ---------------------------------------------------------------------------

const FONT_DISPLAY = '900 {px}px "Helvetica Neue", Arial, sans-serif';
const FONT_BODY = '{w} {px}px "Helvetica Neue", Arial, sans-serif';
const FONT_MONO = '{w} {px}px "Helvetica Neue", Arial, sans-serif';

let _anisotropy = 8;
export function setMaxAnisotropy(v) {
  _anisotropy = Math.max(1, v || 8);
}

function makeCanvas(w, h) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'alphabetic';
  return { canvas, ctx };
}

function toTexture(canvas) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = _anisotropy;
  tex.needsUpdate = true;
  return tex;
}

function font(template, px, weight = '400') {
  return template.replace('{px}', Math.round(px)).replace('{w}', weight);
}

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

// Letter-spaced, centered display text that auto-fits a max width.
function fitText(ctx, text, cx, y, maxWidth, basePx, template = FONT_DISPLAY, weight = '900') {
  let px = basePx;
  ctx.font = font(template, px, weight);
  while (ctx.measureText(text).width > maxWidth && px > 8) {
    px -= 2;
    ctx.font = font(template, px, weight);
  }
  ctx.textAlign = 'center';
  ctx.fillText(text, cx, y);
  return px;
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let yy = y;
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, yy);
      line = word;
      yy += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, yy);
  return yy;
}

// Faint paper grain for a printed feel.
function grain(ctx, w, h, alpha = 0.04) {
  ctx.save();
  ctx.globalAlpha = alpha;
  for (let i = 0; i < (w * h) / 1400; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    ctx.fillStyle = Math.random() > 0.5 ? '#000' : '#fff';
    ctx.fillRect(x, y, 1.4, 1.4);
  }
  ctx.restore();
}

function barcode(ctx, x, y, w, h) {
  ctx.save();
  ctx.fillStyle = '#fff';
  ctx.fillRect(x - 8, y - 8, w + 16, h + 30);
  ctx.fillStyle = '#111';
  let cx = x;
  while (cx < x + w) {
    const bw = 2 + Math.floor(Math.random() * 5);
    if (Math.random() > 0.32) ctx.fillRect(cx, y, bw, h);
    cx += bw + 2 + Math.floor(Math.random() * 3);
  }
  ctx.font = font(FONT_MONO, 22, '500');
  ctx.textAlign = 'center';
  ctx.fillText('7 30100 ' + Math.floor(10000 + Math.random() * 89999) + ' 4', x + w / 2, y + h + 24);
  ctx.restore();
}

// PLUTUS coin wordmark used as a stamp on every package.
function plutusStamp(ctx, cx, cy, r, color, ink) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = r * 0.08;
  ctx.strokeStyle = ink;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.82, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = ink;
  ctx.font = font(FONT_DISPLAY, r * 0.9, '900');
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('P', 0, r * 0.04);
  ctx.textBaseline = 'alphabetic';
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Product emblems — a small piece of on-theme line art per product.
// ---------------------------------------------------------------------------
const emblems = {
  'neural-flakes'(ctx, cx, cy, s, ink) {
    // bowl of flakes
    ctx.strokeStyle = ink;
    ctx.lineWidth = s * 0.05;
    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.6, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(cx, cy, s * 0.62, s * 0.18, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = ink;
    for (let i = 0; i < 9; i++) {
      const a = -0.2 + Math.random() * 1.4;
      const rr = s * (0.1 + Math.random() * 0.35);
      ctx.save();
      ctx.translate(cx + Math.cos(a) * rr, cy - s * 0.05 - Math.sin(a) * s * 0.12);
      ctx.rotate(Math.random());
      ctx.fillRect(-s * 0.06, -s * 0.04, s * 0.12, s * 0.08);
      ctx.restore();
    }
  },
  'insight-beans'(ctx, cx, cy, s, ink) {
    // simmering bowl + steam
    ctx.strokeStyle = ink;
    ctx.lineWidth = s * 0.05;
    ctx.beginPath();
    ctx.arc(cx, cy + s * 0.1, s * 0.55, 0, Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.6, cy + s * 0.1);
    ctx.lineTo(cx + s * 0.6, cy + s * 0.1);
    ctx.stroke();
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(cx + i * s * 0.3, cy - s * 0.1);
      ctx.bezierCurveTo(cx + i * s * 0.3 + s * 0.18, cy - s * 0.35, cx + i * s * 0.3 - s * 0.18, cy - s * 0.55, cx + i * s * 0.3, cy - s * 0.8);
      ctx.stroke();
    }
  },
  flowpress(ctx, cx, cy, s, ink) {
    // droplet
    ctx.fillStyle = ink;
    ctx.beginPath();
    ctx.moveTo(cx, cy - s * 0.7);
    ctx.bezierCurveTo(cx + s * 0.6, cy, cx + s * 0.45, cy + s * 0.6, cx, cy + s * 0.6);
    ctx.bezierCurveTo(cx - s * 0.45, cy + s * 0.6, cx - s * 0.6, cy, cx, cy - s * 0.7);
    ctx.fill();
  },
  puredata(ctx, cx, cy, s, ink) {
    // splash / stacked layers
    ctx.fillStyle = ink;
    for (let i = 0; i < 3; i++) {
      roundRect(ctx, cx - s * 0.55, cy - s * 0.5 + i * s * 0.42, s * 1.1, s * 0.26, s * 0.13);
      ctx.fill();
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      roundRect(ctx, cx - s * 0.48, cy - s * 0.45 + i * s * 0.42, s * 0.96, s * 0.16, s * 0.08);
      ctx.fill();
      ctx.restore();
    }
  },
  'deploy-dark-roast'(ctx, cx, cy, s, ink) {
    // coffee bean
    ctx.fillStyle = ink;
    ctx.beginPath();
    ctx.ellipse(cx, cy, s * 0.45, s * 0.6, Math.PI * 0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = s * 0.06;
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.18, cy - s * 0.5);
    ctx.bezierCurveTo(cx + s * 0.2, cy - s * 0.2, cx - s * 0.2, cy + s * 0.2, cx + s * 0.18, cy + s * 0.5);
    ctx.stroke();
  },
  guardian(ctx, cx, cy, s, ink) {
    // shield + check
    ctx.fillStyle = ink;
    ctx.beginPath();
    ctx.moveTo(cx, cy - s * 0.65);
    ctx.lineTo(cx + s * 0.55, cy - s * 0.4);
    ctx.lineTo(cx + s * 0.55, cy + s * 0.1);
    ctx.quadraticCurveTo(cx + s * 0.5, cy + s * 0.55, cx, cy + s * 0.7);
    ctx.quadraticCurveTo(cx - s * 0.5, cy + s * 0.55, cx - s * 0.55, cy + s * 0.1);
    ctx.lineTo(cx - s * 0.55, cy - s * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = s * 0.12;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.22, cy + s * 0.02);
    ctx.lineTo(cx - s * 0.02, cy + s * 0.22);
    ctx.lineTo(cx + s * 0.28, cy - s * 0.22);
    ctx.stroke();
  },
  connect(ctx, cx, cy, s, ink) {
    // chain links
    ctx.strokeStyle = ink;
    ctx.lineWidth = s * 0.13;
    ctx.beginPath();
    ctx.ellipse(cx - s * 0.22, cy, s * 0.32, s * 0.2, Math.PI * 0.25, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(cx + s * 0.22, cy, s * 0.32, s * 0.2, Math.PI * 0.25, 0, Math.PI * 2);
    ctx.stroke();
  },
  sage(ctx, cx, cy, s, ink) {
    // tea leaves
    ctx.fillStyle = ink;
    for (let i = -1; i <= 1; i += 2) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(i * 0.5);
      ctx.beginPath();
      ctx.moveTo(0, s * 0.1);
      ctx.quadraticCurveTo(i * s * 0.5, -s * 0.3, 0, -s * 0.7);
      ctx.quadraticCurveTo(-i * s * 0.2, -s * 0.3, 0, s * 0.1);
      ctx.fill();
      ctx.restore();
    }
    ctx.strokeStyle = ink;
    ctx.lineWidth = s * 0.05;
    ctx.beginPath();
    ctx.moveTo(cx, cy + s * 0.6);
    ctx.lineTo(cx, cy - s * 0.1);
    ctx.stroke();
  },
};

function drawEmblem(ctx, id, cx, cy, s, ink) {
  (emblems[id] || emblems['flowpress'])(ctx, cx, cy, s, ink);
}

// ---------------------------------------------------------------------------
// The "AI Facts" panel — a parody nutrition label carrying real specs.
// ---------------------------------------------------------------------------
export function drawFactsPanel(ctx, x, y, w, h, product) {
  const ink = '#111';
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = ink;
  ctx.lineWidth = Math.max(3, w * 0.012);
  ctx.strokeRect(ctx.lineWidth / 2, ctx.lineWidth / 2, w - ctx.lineWidth, h - ctx.lineWidth);

  const pad = w * 0.06;
  let cy = pad;
  ctx.fillStyle = ink;
  ctx.textAlign = 'left';

  ctx.font = font(FONT_DISPLAY, w * 0.13, '900');
  ctx.fillText('AI Facts', pad, (cy += w * 0.1));

  ctx.font = font(FONT_BODY, w * 0.045, '400');
  ctx.fillText('1 license · ' + product.feature, pad, (cy += w * 0.05));

  const rule = (weight) => {
    ctx.fillRect(pad, (cy += w * 0.025), w - pad * 2, weight);
    cy += weight;
  };
  rule(w * 0.03);

  ctx.font = font(FONT_BODY, w * 0.04, '700');
  ctx.fillText('Amount per workspace', pad, (cy += w * 0.045));

  const hero = product.specs.find((s) => s.big) || product.specs[1];
  ctx.font = font(FONT_DISPLAY, w * 0.07, '900');
  ctx.fillText(hero.label, pad, (cy += w * 0.07));
  ctx.textAlign = 'right';
  ctx.fillText(hero.value, w - pad, cy);
  ctx.textAlign = 'left';
  rule(w * 0.018);

  ctx.font = font(FONT_BODY, w * 0.035, '400');
  ctx.textAlign = 'right';
  ctx.fillText('% Service Level', w - pad, (cy += w * 0.04));
  ctx.textAlign = 'left';
  rule(w * 0.008);

  for (const s of product.specs) {
    if (s === hero) continue;
    cy += w * 0.045;
    ctx.font = font(FONT_BODY, w * 0.042, '700');
    ctx.fillText(s.label, pad, cy);
    ctx.font = font(FONT_BODY, w * 0.042, '400');
    ctx.textAlign = 'right';
    if (s.dv) {
      ctx.fillText(s.dv, w - pad, cy);
      const vw = ctx.measureText(s.dv).width;
      ctx.fillText(s.value, w - pad - vw - w * 0.08, cy);
    } else {
      ctx.fillText(s.value, w - pad, cy);
    }
    ctx.textAlign = 'left';
    ctx.fillRect(pad, cy + w * 0.012, w - pad * 2, w * 0.004);
  }

  rule(w * 0.018);
  ctx.font = font(FONT_BODY, w * 0.03, '400');
  cy += w * 0.03;
  wrapText(
    ctx,
    '% Service Level shows how much of a typical enterprise need one serving of ' +
      product.name +
      ' covers. Part of the PLUTUS balanced stack.',
    pad,
    (cy += w * 0.035),
    w - pad * 2,
    w * 0.045
  );
  ctx.restore();
}

// Shared "front of pack" composition reused by several package types.
function drawFront(ctx, w, h, product, opts = {}) {
  const { base, accent, ink, paper } = product.colors;
  const topBand = opts.topBand !== false;

  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, w, h);

  // colour field
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);

  // soft vignette of the accent
  const g = ctx.createRadialGradient(w * 0.5, h * 0.42, w * 0.1, w * 0.5, h * 0.5, w * 0.8);
  g.addColorStop(0, accent + 'aa');
  g.addColorStop(1, base + '00');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  if (topBand) {
    ctx.fillStyle = paper;
    ctx.fillRect(0, 0, w, h * 0.13);
    ctx.fillStyle = ink;
    fitText(ctx, 'PLUTUS', w * 0.5, h * 0.095, w * 0.7, h * 0.07, FONT_DISPLAY, '900');
    ctx.font = font(FONT_BODY, h * 0.018, '700');
    ctx.textAlign = 'center';
    ctx.fillText('AI OPERATING SYSTEM', w * 0.5, h * 0.118);
  }

  // emblem disc
  const ey = h * 0.34;
  ctx.fillStyle = paper;
  ctx.beginPath();
  ctx.arc(w * 0.5, ey, w * 0.2, 0, Math.PI * 2);
  ctx.fill();
  drawEmblem(ctx, product.id, w * 0.5, ey, w * 0.17, ink);

  // product name
  ctx.fillStyle = paper;
  fitText(ctx, product.name, w * 0.5, h * 0.62, w * 0.86, h * 0.11, FONT_DISPLAY, '900');

  // feature line
  ctx.fillStyle = accent;
  ctx.font = font(FONT_BODY, h * 0.028, '700');
  ctx.textAlign = 'center';
  ctx.fillText(product.feature.toUpperCase(), w * 0.5, h * 0.67);

  // flavour banner
  ctx.save();
  ctx.fillStyle = accent;
  roundRect(ctx, w * 0.18, h * 0.71, w * 0.64, h * 0.07, h * 0.035);
  ctx.fill();
  ctx.fillStyle = ink;
  fitText(ctx, product.flavor, w * 0.5, h * 0.758, w * 0.58, h * 0.032, FONT_BODY, '900');
  ctx.restore();
  // Callers draw the centered tagline + net weight beneath this.
}

// Centered tagline helper (canvas wrapText is left-aligned by default)
function centeredTagline(ctx, text, cx, y, maxWidth, lineHeight, fontStr) {
  ctx.font = fontStr;
  ctx.textAlign = 'center';
  const words = text.split(' ');
  let line = '';
  let yy = y;
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, cx, yy);
      line = word;
      yy += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, cx, yy);
}

// ---------- per-package texture builders ----------

export function boxTextures(product) {
  const { base, accent, ink, paper } = product.colors;
  const W = 820;
  const H = 1080;

  // FRONT
  const f = makeCanvas(W, H);
  drawFront(f.ctx, W, H, product, {});
  f.ctx.fillStyle = paper;
  centeredTagline(f.ctx, product.tagline, W / 2, H * 0.84, W * 0.8, H * 0.034, font(FONT_BODY, H * 0.024, '400'));
  f.ctx.fillStyle = paper;
  f.ctx.font = font(FONT_BODY, H * 0.02, '700');
  f.ctx.textAlign = 'center';
  f.ctx.fillText(product.netwt, W / 2, H * 0.95);
  grain(f.ctx, W, H);

  // BACK — facts panel + blurb
  const b = makeCanvas(W, H);
  b.ctx.fillStyle = paper;
  b.ctx.fillRect(0, 0, W, H);
  b.ctx.fillStyle = ink;
  b.ctx.font = font(FONT_DISPLAY, H * 0.04, '900');
  b.ctx.textAlign = 'left';
  b.ctx.fillText(product.name, W * 0.08, H * 0.1);
  b.ctx.fillStyle = base;
  b.ctx.font = font(FONT_BODY, H * 0.022, '700');
  b.ctx.fillText(product.feature.toUpperCase() + ' · ' + product.aisle.toUpperCase(), W * 0.08, H * 0.135);
  b.ctx.fillStyle = ink;
  b.ctx.font = font(FONT_BODY, H * 0.024, '400');
  centeredTaglineLeft(b.ctx, product.blurb, W * 0.08, H * 0.18, W * 0.84, H * 0.036);
  drawFactsPanel(b.ctx, W * 0.08, H * 0.4, W * 0.5, H * 0.52, product);
  plutusStamp(b.ctx, W * 0.78, H * 0.55, W * 0.12, base, paper);
  barcode(b.ctx, W * 0.66, H * 0.82, W * 0.26, H * 0.06);
  grain(b.ctx, W, H);

  // SIDE
  const s = makeCanvas(360, H);
  const sw = 360;
  s.ctx.fillStyle = base;
  s.ctx.fillRect(0, 0, sw, H);
  s.ctx.save();
  s.ctx.translate(sw * 0.5, H * 0.5);
  s.ctx.rotate(-Math.PI / 2);
  s.ctx.fillStyle = paper;
  s.ctx.font = font(FONT_DISPLAY, sw * 0.36, '900');
  s.ctx.textAlign = 'center';
  s.ctx.fillText(product.name, 0, -sw * 0.04);
  s.ctx.fillStyle = accent;
  s.ctx.font = font(FONT_BODY, sw * 0.12, '700');
  s.ctx.fillText('PLUTUS · ' + product.feature.toUpperCase(), 0, sw * 0.2);
  s.ctx.restore();
  grain(s.ctx, sw, H);

  // TOP
  const t = makeCanvas(820, 360);
  t.ctx.fillStyle = base;
  t.ctx.fillRect(0, 0, 820, 360);
  t.ctx.fillStyle = paper;
  fitText(t.ctx, 'PLUTUS', 410, 210, 600, 140, FONT_DISPLAY, '900');

  return {
    front: toTexture(f.canvas),
    back: toTexture(b.canvas),
    side: toTexture(s.canvas),
    top: toTexture(t.canvas),
  };
}

// left-aligned wrap (used on back panels)
function centeredTaglineLeft(ctx, text, x, y, maxWidth, lineHeight) {
  ctx.textAlign = 'left';
  wrapText(ctx, text, x, y, maxWidth, lineHeight);
}

export function canTextures(product) {
  const { base, accent, ink, paper } = product.colors;
  const W = 2048;
  const H = 1024;
  const c = makeCanvas(W, H);
  const ctx = c.ctx;

  // bands top/bottom
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, W, H * 0.1);
  ctx.fillRect(0, H * 0.9, W, H * 0.1);

  // The "front" of the can is centered; the cylinder UV wraps left->right.
  const cxFront = W * 0.5;
  ctx.fillStyle = paper;
  ctx.font = font(FONT_DISPLAY, H * 0.06, '900');
  ctx.textAlign = 'center';
  ctx.fillText('PLUTUS', cxFront, H * 0.2);
  ctx.font = font(FONT_BODY, H * 0.026, '700');
  ctx.fillStyle = accent;
  ctx.fillText('AI OPERATING SYSTEM', cxFront, H * 0.24);

  ctx.fillStyle = paper;
  ctx.beginPath();
  ctx.arc(cxFront, H * 0.45, H * 0.16, 0, Math.PI * 2);
  ctx.fill();
  drawEmblem(ctx, product.id, cxFront, H * 0.45, H * 0.13, ink);

  ctx.fillStyle = paper;
  fitText(ctx, product.name, cxFront, H * 0.74, W * 0.42, H * 0.11, FONT_DISPLAY, '900');
  ctx.fillStyle = accent;
  ctx.font = font(FONT_BODY, H * 0.03, '700');
  ctx.fillText(product.feature.toUpperCase(), cxFront, H * 0.8);

  // flavour banner
  ctx.fillStyle = accent;
  roundRect(ctx, cxFront - W * 0.16, H * 0.83, W * 0.32, H * 0.07, H * 0.035);
  ctx.fill();
  ctx.fillStyle = ink;
  fitText(ctx, product.flavor, cxFront, H * 0.876, W * 0.28, H * 0.034, FONT_BODY, '900');

  // back of the can (left & right thirds): facts + barcode
  drawFactsPanel(ctx, W * 0.04, H * 0.16, W * 0.2, H * 0.68, product);
  barcode(ctx, W * 0.8, H * 0.4, W * 0.13, H * 0.18);
  ctx.fillStyle = paper;
  ctx.font = font(FONT_BODY, H * 0.03, '700');
  ctx.textAlign = 'center';
  ctx.save();
  ctx.translate(W * 0.86, H * 0.7);
  ctx.fillText(product.netwt, 0, 0);
  ctx.restore();
  grain(ctx, W, H, 0.03);

  // lid texture (brushed-ish ring)
  const lid = makeCanvas(512, 512);
  const lg = lid.ctx.createRadialGradient(256, 256, 20, 256, 256, 256);
  lg.addColorStop(0, '#e9edf2');
  lg.addColorStop(0.7, '#b9c1cb');
  lg.addColorStop(1, '#8b95a1');
  lid.ctx.fillStyle = lg;
  lid.ctx.fillRect(0, 0, 512, 512);
  lid.ctx.strokeStyle = '#9aa3ad';
  for (let r = 30; r < 250; r += 14) {
    lid.ctx.beginPath();
    lid.ctx.arc(256, 256, r, 0, Math.PI * 2);
    lid.ctx.stroke();
  }

  const wrap = toTexture(c.canvas);
  return { wrap, lid: toTexture(lid.canvas) };
}

export function bandTexture(product, { W = 1200, H = 520, withFacts = true } = {}) {
  const { base, accent, ink, paper } = product.colors;
  const c = makeCanvas(W, H);
  const ctx = c.ctx;
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, W, H * 0.12);
  ctx.fillRect(0, H * 0.88, W, H * 0.12);

  const cx = W * 0.5;
  ctx.fillStyle = paper;
  ctx.font = font(FONT_DISPLAY, H * 0.1, '900');
  ctx.textAlign = 'center';
  ctx.fillText('PLUTUS', cx, H * 0.3);

  ctx.fillStyle = paper;
  fitText(ctx, product.name, cx, H * 0.56, W * 0.5, H * 0.16, FONT_DISPLAY, '900');
  ctx.fillStyle = accent;
  ctx.font = font(FONT_BODY, H * 0.05, '700');
  ctx.fillText(product.feature.toUpperCase(), cx, H * 0.66);

  ctx.fillStyle = accent;
  roundRect(ctx, cx - W * 0.12, H * 0.72, W * 0.24, H * 0.12, H * 0.06);
  ctx.fill();
  ctx.fillStyle = ink;
  fitText(ctx, product.flavor, cx, H * 0.795, W * 0.21, H * 0.05, FONT_BODY, '900');

  if (withFacts) {
    drawFactsPanel(ctx, W * 0.04, H * 0.18, W * 0.2, H * 0.64, product);
    barcode(ctx, W * 0.82, H * 0.35, W * 0.12, H * 0.28);
  }
  grain(ctx, W, H, 0.03);
  const tex = toTexture(c.canvas);
  tex.center.set(0.5, 0.5);
  return tex;
}

export function cartonTextures(product) {
  const { base, accent, ink, paper } = product.colors;
  const W = 760;
  const H = 1040;

  const front = makeCanvas(W, H);
  drawFront(front.ctx, W, H, product, {});
  front.ctx.fillStyle = paper;
  centeredTagline(front.ctx, product.tagline, W / 2, H * 0.86, W * 0.8, H * 0.034, font(FONT_BODY, H * 0.024, '400'));
  // freshness date stamp
  front.ctx.fillStyle = accent;
  front.ctx.font = font(FONT_MONO, H * 0.02, '700');
  front.ctx.textAlign = 'center';
  front.ctx.fillText('BEST BY 12 / 2099  ·  ' + product.netwt, W / 2, H * 0.94);
  grain(front.ctx, W, H);

  const side = makeCanvas(W, H);
  side.ctx.fillStyle = base;
  side.ctx.fillRect(0, 0, W, H);
  drawFactsPanel(side.ctx, W * 0.12, H * 0.1, W * 0.76, H * 0.62, product);
  side.ctx.fillStyle = paper;
  side.ctx.font = font(FONT_BODY, H * 0.022, '400');
  centeredTaglineLeft(side.ctx, product.blurb, W * 0.12, H * 0.78, W * 0.76, H * 0.032);
  barcode(side.ctx, W * 0.34, H * 0.92, W * 0.32, H * 0.045);
  grain(side.ctx, W, H);

  // gable top faces
  const top = makeCanvas(W, 420);
  top.ctx.fillStyle = accent;
  top.ctx.fillRect(0, 0, W, 420);
  top.ctx.fillStyle = ink;
  fitText(top.ctx, 'PLUTUS', W / 2, 250, W * 0.7, 150, FONT_DISPLAY, '900');

  return {
    front: toTexture(front.canvas),
    back: toTexture(front.canvas),
    side: toTexture(side.canvas),
    top: toTexture(top.canvas),
  };
}

export function coffeeTexture(product) {
  const { ink, paper, accent } = product.colors;
  const W = 820;
  const H = 1040;
  const c = makeCanvas(W, H);
  drawFront(c.ctx, W, H, product, {});
  // a degassing valve dot
  c.ctx.fillStyle = ink;
  c.ctx.beginPath();
  c.ctx.arc(W * 0.5, H * 0.9, W * 0.04, 0, Math.PI * 2);
  c.ctx.fill();
  c.ctx.fillStyle = accent;
  c.ctx.beginPath();
  c.ctx.arc(W * 0.5, H * 0.9, W * 0.018, 0, Math.PI * 2);
  c.ctx.fill();
  c.ctx.fillStyle = paper;
  c.ctx.font = font(FONT_BODY, H * 0.018, '700');
  c.ctx.textAlign = 'center';
  c.ctx.fillText(product.netwt + '  ·  WHOLE BEAN', W * 0.5, H * 0.96);
  grain(c.ctx, W, H);
  return { front: toTexture(c.canvas) };
}

export function tubeTexture(product) {
  const { base, accent, ink, paper } = product.colors;
  const W = 1400;
  const H = 420;
  const c = makeCanvas(W, H);
  const ctx = c.ctx;
  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, W, H);
  // stripe
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, W, H * 0.16);
  ctx.fillRect(0, H * 0.84, W, H * 0.16);

  ctx.fillStyle = base;
  ctx.font = font(FONT_DISPLAY, H * 0.16, '900');
  ctx.textAlign = 'left';
  ctx.fillText('PLUTUS', W * 0.06, H * 0.42);
  ctx.fillStyle = ink;
  ctx.font = font(FONT_DISPLAY, H * 0.26, '900');
  ctx.fillText(product.name, W * 0.06, H * 0.66);
  ctx.fillStyle = base;
  ctx.font = font(FONT_BODY, H * 0.07, '700');
  ctx.fillText(product.feature.toUpperCase() + '  ·  ' + product.flavor, W * 0.06, H * 0.78);

  // emblem on the right
  ctx.fillStyle = base;
  ctx.beginPath();
  ctx.arc(W * 0.86, H * 0.5, H * 0.3, 0, Math.PI * 2);
  ctx.fill();
  drawEmblem(ctx, product.id, W * 0.86, H * 0.5, H * 0.22, paper);
  grain(ctx, W, H, 0.025);
  return { body: toTexture(c.canvas), capColor: base };
}

export function jarTextures(product) {
  return { band: bandTexture(product, { W: 1400, H: 460, withFacts: true }), lidColor: product.colors.base };
}
