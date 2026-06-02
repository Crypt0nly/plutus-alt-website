import * as THREE from 'three';

// Procedural canvas art for the agent world: glowing halos, tool-node panels
// and their icon glyphs. No image assets ship with the site.

let _anisotropy = 8;
export function setMaxAnisotropy(v) {
  _anisotropy = Math.max(1, v || 8);
}

function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return { c, ctx: c.getContext('2d') };
}

function toTexture(c) {
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = _anisotropy;
  tex.needsUpdate = true;
  return tex;
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

// Soft radial sprite used for the core halo, node glows and travelling pulses.
let _glow;
export function glowTexture() {
  if (_glow) return _glow;
  const { c, ctx } = canvas(256, 256);
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.7)');
  g.addColorStop(0.6, 'rgba(255,255,255,0.15)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  _glow = toTexture(c);
  return _glow;
}

// ---- icon glyphs -----------------------------------------------------------
const glyphs = {
  mail(ctx, x, y, s) {
    ctx.strokeRect(x - s, y - s * 0.7, s * 2, s * 1.4);
    ctx.beginPath();
    ctx.moveTo(x - s, y - s * 0.7);
    ctx.lineTo(x, y + s * 0.1);
    ctx.lineTo(x + s, y - s * 0.7);
    ctx.stroke();
  },
  calendar(ctx, x, y, s) {
    ctx.strokeRect(x - s, y - s * 0.8, s * 2, s * 1.6);
    ctx.beginPath();
    ctx.moveTo(x - s, y - s * 0.35);
    ctx.lineTo(x + s, y - s * 0.35);
    ctx.moveTo(x - s * 0.5, y - s * 0.8);
    ctx.lineTo(x - s * 0.5, y - s * 1.05);
    ctx.moveTo(x + s * 0.5, y - s * 0.8);
    ctx.lineTo(x + s * 0.5, y - s * 1.05);
    ctx.stroke();
  },
  git(ctx, x, y, s) {
    const dot = (px, py) => {
      ctx.beginPath();
      ctx.arc(px, py, s * 0.22, 0, Math.PI * 2);
      ctx.stroke();
    };
    dot(x - s * 0.6, y - s * 0.6);
    dot(x - s * 0.6, y + s * 0.6);
    dot(x + s * 0.6, y - s * 0.1);
    ctx.beginPath();
    ctx.moveTo(x - s * 0.6, y - s * 0.4);
    ctx.lineTo(x - s * 0.6, y + s * 0.4);
    ctx.moveTo(x - s * 0.6, y - s * 0.4);
    ctx.quadraticCurveTo(x - s * 0.6, y - s * 0.1, x + s * 0.4, y - s * 0.1);
    ctx.stroke();
  },
  chat(ctx, x, y, s) {
    roundRect(ctx, x - s, y - s * 0.8, s * 2, s * 1.4, s * 0.4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - s * 0.4, y + s * 0.5);
    ctx.lineTo(x - s * 0.7, y + s);
    ctx.lineTo(x - s * 0.1, y + s * 0.55);
    ctx.stroke();
  },
  folder(ctx, x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x - s, y + s * 0.7);
    ctx.lineTo(x - s, y - s * 0.4);
    ctx.lineTo(x - s * 0.2, y - s * 0.4);
    ctx.lineTo(x + s * 0.05, y - s * 0.7);
    ctx.lineTo(x + s, y - s * 0.7);
    ctx.lineTo(x + s, y + s * 0.7);
    ctx.closePath();
    ctx.stroke();
  },
  globe(ctx, x, y, s) {
    ctx.beginPath();
    ctx.arc(x, y, s, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(x, y, s * 0.45, s, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - s, y);
    ctx.lineTo(x + s, y);
    ctx.stroke();
  },
  apps(ctx, x, y, s) {
    const q = s * 0.7;
    for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      roundRect(ctx, x + dx * q - s * 0.32, y + dy * q - s * 0.32, s * 0.64, s * 0.64, s * 0.16);
      ctx.stroke();
    }
  },
  monitor(ctx, x, y, s) {
    ctx.strokeRect(x - s, y - s * 0.8, s * 2, s * 1.3);
    ctx.beginPath();
    ctx.moveTo(x - s * 0.5, y + s);
    ctx.lineTo(x + s * 0.5, y + s);
    ctx.moveTo(x, y + s * 0.5);
    ctx.lineTo(x, y + s);
    ctx.stroke();
  },
};

// A glassy node panel: dark rounded card, coloured rim, icon disc + label.
export function nodeTexture({ label, glyph, color }) {
  const W = 600;
  const H = 320;
  const { c, ctx } = canvas(W, H);
  const pad = 26;

  ctx.fillStyle = 'rgba(12,15,28,0.82)';
  roundRect(ctx, pad, pad, W - pad * 2, H - pad * 2, 46);
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.9;
  roundRect(ctx, pad, pad, W - pad * 2, H - pad * 2, 46);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // icon disc
  const ix = 118;
  const iy = H / 2;
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.18;
  ctx.beginPath();
  ctx.arc(ix, iy, 64, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = color;
  ctx.lineWidth = 7;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  (glyphs[glyph] || glyphs.apps)(ctx, ix, iy, 34);

  // label
  ctx.fillStyle = '#eef1ff';
  ctx.font = '600 52px "Space Grotesk", Arial, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillText(label, 210, iy);

  const tex = toTexture(c);
  return tex;
}

export { toTexture, roundRect, canvas };
