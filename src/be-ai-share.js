// Ocur — /be-ai share card. Lazy-loaded from be-ai.js so the canvas + share
// plumbing never weighs on first paint. Renders the round result to a 1200×630
// card, then shares it: the native share sheet (with the image file) where the
// browser supports it, otherwise a modal with X / LinkedIn / Save.
//
// Every card carries "Made with Ocur" + ocur.ai/be-ai — the card itself is the
// top-of-funnel unit.

const SHARE_URL = 'https://ocur.ai/be-ai';

// Brand tokens mirrored from the site so the card looks like the page.
const C = {
  bg0: '#0a0a0f',
  bg1: '#060608',
  ink: '#f5f5f7',
  dim: '#9d9da6',
  orange: '#f2942e',
  peach: '#ffc680',
  ember: '#ff7849',
};

let logoImg = null;
function loadLogo() {
  if (logoImg) return Promise.resolve(logoImg);
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      logoImg = img;
      resolve(img);
    };
    img.onerror = () => resolve(null);
    img.src = '/logo.svg';
  });
}

function shareText(result) {
  if (!result) return 'Can you tell the real AI from a human faking it? Most people can’t.';
  const { spotted, rounds } = result.score;
  return result.correct
    ? `I spotted the real AI ${spotted}/${rounds} times. Can you tell Ocur from a human pretending to be it?`
    : `A human just fooled me into thinking it was the AI 😱 Think you can spot the real one?`;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapLines(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

async function drawCard(canvas, result) {
  await Promise.all([loadLogo(), document.fonts ? document.fonts.ready : Promise.resolve()]);
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  // backdrop
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, C.bg0);
  grad.addColorStop(1, C.bg1);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // warm glow mesh
  const glow = ctx.createRadialGradient(W * 0.78, H * 0.16, 0, W * 0.78, H * 0.16, W * 0.6);
  glow.addColorStop(0, 'rgba(242,148,46,0.28)');
  glow.addColorStop(1, 'rgba(242,148,46,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // border frame
  ctx.strokeStyle = 'rgba(255,255,255,0.10)';
  ctx.lineWidth = 2;
  roundRect(ctx, 24, 24, W - 48, H - 48, 36);
  ctx.stroke();

  const M = 84; // content margin

  // top wordmark
  if (logoImg) ctx.drawImage(logoImg, M, 70, 40, 40);
  ctx.fillStyle = C.dim;
  ctx.font = '600 22px "JetBrains Mono", monospace';
  ctx.textBaseline = 'middle';
  ctx.fillText('OCUR · REVERSE TURING TEST', M + (logoImg ? 56 : 0), 92);

  // headline
  const correct = !!(result && result.correct);
  const headline = correct ? 'I spotted the real AI.' : 'A human just out-AI’d me.';
  ctx.fillStyle = C.ink;
  ctx.font = '800 78px Inter, sans-serif';
  ctx.textBaseline = 'alphabetic';
  const lines = wrapLines(ctx, headline, W - M * 2);
  let y = 250;
  for (const line of lines) {
    ctx.fillText(line, M, y);
    y += 92;
  }

  // accent underline
  ctx.fillStyle = C.orange;
  roundRect(ctx, M, y - 56, 132, 7, 4);
  ctx.fill();

  // score chips
  if (result && result.score) {
    const { spotted, rounds, fooled } = result.score;
    ctx.font = '600 30px Inter, sans-serif';
    const chips = [`Spotted ${spotted}/${rounds}`, `Fooled ${fooled}×`];
    let cx = M;
    const cy = y + 36;
    for (const chip of chips) {
      const tw = ctx.measureText(chip).width;
      const cw = tw + 44;
      ctx.fillStyle = 'rgba(255,255,255,0.07)';
      roundRect(ctx, cx, cy, cw, 56, 28);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.lineWidth = 1.5;
      roundRect(ctx, cx, cy, cw, 56, 28);
      ctx.stroke();
      ctx.fillStyle = C.peach;
      ctx.textBaseline = 'middle';
      ctx.fillText(chip, cx + 22, cy + 30);
      ctx.textBaseline = 'alphabetic';
      cx += cw + 16;
    }
  }

  // footer
  ctx.fillStyle = C.dim;
  ctx.font = '500 26px Inter, sans-serif';
  ctx.fillText('ocur.ai/be-ai', M, H - 70);

  ctx.textAlign = 'right';
  ctx.fillStyle = C.ink;
  ctx.font = '600 26px Inter, sans-serif';
  ctx.fillText('Made with Ocur', W - M, H - 70);
  ctx.textAlign = 'left';
}

function canvasToBlob(canvas) {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
}

export function initShare({ lastResult, track }) {
  const shareBtn = document.getElementById('ba-share-btn');
  const overlay = document.getElementById('ba-share-overlay');
  const canvas = document.getElementById('ba-share-canvas');
  if (!shareBtn || !overlay || !canvas) return;

  const openModal = (result) => {
    const text = shareText(result);
    document.getElementById('ba-share-x').href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(SHARE_URL)}`;
    document.getElementById('ba-share-li').href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      SHARE_URL
    )}`;
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    overlay.hidden = true;
    document.body.style.overflow = '';
  };

  shareBtn.addEventListener('click', async () => {
    const result = lastResult();
    track && track('be_ai_share_open', { correct: result && result.correct });
    await drawCard(canvas, result);

    // best UX on mobile: hand the image straight to the native share sheet
    try {
      const blob = await canvasToBlob(canvas);
      const file = blob && new File([blob], 'ocur-be-ai.png', { type: 'image/png' });
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], text: shareText(result), url: SHARE_URL });
        track && track('be_ai_share', { channel: 'native' });
        return;
      }
    } catch (err) {
      if (err && err.name === 'AbortError') return; // user dismissed the sheet
    }
    openModal(result); // desktop / unsupported → modal fallback
  });

  document.getElementById('ba-share-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.hidden) closeModal();
  });

  document
    .getElementById('ba-share-x')
    .addEventListener('click', () => track && track('be_ai_share', { channel: 'x' }));
  document
    .getElementById('ba-share-li')
    .addEventListener('click', () => track && track('be_ai_share', { channel: 'linkedin' }));

  document.getElementById('ba-share-download').addEventListener('click', async () => {
    const blob = await canvasToBlob(canvas);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ocur-be-ai.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    track && track('be_ai_share', { channel: 'download' });
  });
}
