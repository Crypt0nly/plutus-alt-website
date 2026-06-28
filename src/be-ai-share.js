// Ocur — /be-ai share card. Lazy-loaded. Renders the round result to a
// 1200×630 card (blended look: Ocur ink + a hand-drawn accent) and shares it
// via the native sheet where supported, else an X / LinkedIn / Save modal.
// Every card is stamped "Made with Ocur · ocur.ai/be-ai" — the card is the unit.

const SHARE_URL = 'https://ocur.ai/be-ai';

const C = {
  bg0: '#0a0a0f',
  bg1: '#060608',
  ink: '#f5f5f7',
  dim: '#9d9da6',
  orange: '#f2942e',
  peach: '#ffc680',
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

// Map a result to (headline, shareText).
function copyFor(result) {
  const fooled = result && result.fooledAsResponder;
  if (result && 'fooledAsResponder' in result) {
    return fooled
      ? { head: 'I fooled people into\nthinking I was the AI.', text: 'I fooled real people into thinking I was the AI on ocur.ai/be-ai. Certified Artificial. Can you?' }
      : { head: 'I got spotted\nas a human.', text: "I tried to pass as an AI and got caught being too human at ocur.ai/be-ai. Think you can do better?" };
  }
  // asker result
  return result && result.correct
    ? { head: 'I spotted\nthe real AI.', text: 'I picked the real Ocur out of a lineup of humans pretending on ocur.ai/be-ai. Can you?' }
    : { head: 'A human just\nout-AI’d me.', text: 'A human fooled me into thinking they were the AI on ocur.ai/be-ai. Think you can spot the real one?' };
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

async function drawCard(canvas, result) {
  await Promise.all([loadLogo(), document.fonts ? document.fonts.ready : Promise.resolve()]);
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, C.bg0);
  grad.addColorStop(1, C.bg1);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  const glow = ctx.createRadialGradient(W * 0.8, H * 0.15, 0, W * 0.8, H * 0.15, W * 0.6);
  glow.addColorStop(0, 'rgba(242,148,46,0.28)');
  glow.addColorStop(1, 'rgba(242,148,46,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(255,255,255,0.10)';
  ctx.lineWidth = 2;
  roundRect(ctx, 24, 24, W - 48, H - 48, 34);
  ctx.stroke();

  const M = 84;
  if (logoImg) ctx.drawImage(logoImg, M, 66, 40, 40);
  ctx.fillStyle = C.dim;
  ctx.font = '600 22px "JetBrains Mono", monospace';
  ctx.textBaseline = 'middle';
  ctx.fillText('OCUR · BE THE AI', M + (logoImg ? 56 : 0), 88);
  ctx.textBaseline = 'alphabetic';

  const { head } = copyFor(result);
  ctx.fillStyle = C.ink;
  ctx.font = '800 76px Inter, sans-serif';
  let y = 232;
  head.split('\n').forEach((line) => {
    ctx.fillText(line, M, y);
    y += 88;
  });

  ctx.fillStyle = C.orange;
  roundRect(ctx, M, y - 54, 132, 7, 4);
  ctx.fill();

  // score chips from the player snapshot
  const meStats = (result && result.me) || {};
  const chips = [`🏆 fooled ${meStats.timesFooledOthers || 0}`, `🎯 spotted ${meStats.timesSpottedAi || 0}`];
  ctx.font = '600 30px Inter, sans-serif';
  let cx = M;
  const cy = y + 34;
  for (const chip of chips) {
    const cw = ctx.measureText(chip).width + 44;
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

  ctx.fillStyle = C.dim;
  ctx.font = '500 26px Inter, sans-serif';
  ctx.fillText('ocur.ai/be-ai', M, H - 70);
  ctx.textAlign = 'right';
  ctx.fillStyle = C.ink;
  ctx.font = '600 26px Inter, sans-serif';
  ctx.fillText('Made with Ocur', W - M, H - 70);
  ctx.textAlign = 'left';
}

const canvasToBlob = (canvas) => new Promise((res) => canvas.toBlob(res, 'image/png'));

export function initShare({ lastResult, track }) {
  const triggers = [...document.querySelectorAll('.ba-share-trigger')];
  const overlay = document.getElementById('ba-share-overlay');
  const canvas = document.getElementById('ba-share-canvas');
  if (!triggers.length || !overlay || !canvas) return;

  const openModal = (result) => {
    const { text } = copyFor(result);
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

  const onShare = async () => {
    const result = lastResult();
    track && track('be_ai_share_open', {});
    await drawCard(canvas, result);
    try {
      const blob = await canvasToBlob(canvas);
      const file = blob && new File([blob], 'ocur-be-ai.png', { type: 'image/png' });
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], text: copyFor(result).text, url: SHARE_URL });
        track && track('be_ai_share', { channel: 'native' });
        return;
      }
    } catch (err) {
      if (err && err.name === 'AbortError') return;
    }
    openModal(result);
  };

  triggers.forEach((t) => t.addEventListener('click', onShare));
  document.getElementById('ba-share-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.hidden) closeModal();
  });
  document.getElementById('ba-share-x').addEventListener('click', () => track && track('be_ai_share', { channel: 'x' }));
  document.getElementById('ba-share-li').addEventListener('click', () => track && track('be_ai_share', { channel: 'linkedin' }));
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
