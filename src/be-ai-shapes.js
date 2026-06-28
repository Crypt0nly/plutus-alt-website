// Ocur — /be-ai "draw a perfect shape" wait game. Something to do while the
// other side writes their answer: draw a circle / triangle / square / rectangle
// / line freehand and we score how perfect it was as a %. The theme ties back to
// the game — a *perfect* shape is inhuman (robot), a wobbly one is gloriously
// human.
//
// The scoring is pure + dependency-free so it's easy to reason about and test:
//   scoreShape('circle', [[x,y],...]) -> { score: 0..100, ideal } | null
// The ShapeChallenge widget wraps it in a small canvas with auto-scoring on
// pointer-up, a best-score tracker (localStorage) and "clear" / "new shape".

// ── geometry helpers ─────────────────────────────────────────────────────────
const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

function centroid(pts) {
  return [mean(pts.map((p) => p[0])), mean(pts.map((p) => p[1]))];
}

function bbox(pts) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const [x, y] of pts) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  return { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY };
}

// Distance from point p to segment a-b.
function distToSeg(p, a, b) {
  const vx = b[0] - a[0];
  const vy = b[1] - a[1];
  const len2 = vx * vx + vy * vy || 1e-9;
  let t = ((p[0] - a[0]) * vx + (p[1] - a[1]) * vy) / len2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(a[0] + t * vx - p[0], a[1] + t * vy - p[1]);
}

// Distance from point p to a closed polygon outline (list of vertices).
function distToPoly(p, poly) {
  let best = Infinity;
  for (let i = 0; i < poly.length; i++) {
    const d = distToSeg(p, poly[i], poly[(i + 1) % poly.length]);
    if (d < best) best = d;
  }
  return best;
}

// Fraction of the full circle the angles sweep through (1 = closed loop). Works
// by finding the largest angular gap between consecutive samples.
function angularCoverage(angles) {
  if (angles.length < 3) return 0;
  const sorted = [...angles].sort((a, b) => a - b);
  let maxGap = sorted[0] + 2 * Math.PI - sorted[sorted.length - 1];
  for (let i = 1; i < sorted.length; i++) {
    maxGap = Math.max(maxGap, sorted[i] - sorted[i - 1]);
  }
  return Math.max(0, 1 - maxGap / (2 * Math.PI));
}

const farthestFrom = (pts, q) => pts.reduce((best, p) => (dist(p, q) > dist(best, q) ? p : best), pts[0]);

function toScore(x) {
  return Math.round(Math.max(0, Math.min(1, x)) * 100);
}

// ── per-shape scoring ────────────────────────────────────────────────────────
// Each returns { score, ideal } or null if there isn't enough of a drawing yet.
// `ideal` is the fitted target outline, drawn faintly as a "you vs perfect"
// overlay after scoring.

function scoreCircle(pts) {
  const c = centroid(pts);
  const radii = pts.map((p) => dist(p, c));
  const r = mean(radii);
  if (r < 24) return null;
  const dev = mean(radii.map((x) => Math.abs(x - r))) / r;
  const coverage = angularCoverage(pts.map((p) => Math.atan2(p[1] - c[1], p[0] - c[0])));
  // Wobble against tolerance, then require the loop to (nearly) close.
  const s = (1 - dev / 0.22) * Math.min(1, coverage / 0.9);
  return { score: toScore(s), ideal: { type: 'circle', c, r } };
}

function scoreLine(pts) {
  const c = centroid(pts);
  let sxx = 0,
    sxy = 0,
    syy = 0;
  for (const p of pts) {
    const dx = p[0] - c[0];
    const dy = p[1] - c[1];
    sxx += dx * dx;
    sxy += dx * dy;
    syy += dy * dy;
  }
  const theta = 0.5 * Math.atan2(2 * sxy, sxx - syy); // principal axis
  const ux = Math.cos(theta);
  const uy = Math.sin(theta);
  const nx = -uy;
  const ny = ux;
  const proj = pts.map((p) => (p[0] - c[0]) * ux + (p[1] - c[1]) * uy);
  const length = Math.max(...proj) - Math.min(...proj);
  if (length < 56) return null;
  const dev = mean(pts.map((p) => Math.abs((p[0] - c[0]) * nx + (p[1] - c[1]) * ny))) / length;
  const tMin = Math.min(...proj);
  const tMax = Math.max(...proj);
  const a = [c[0] + ux * tMin, c[1] + uy * tMin];
  const b = [c[0] + ux * tMax, c[1] + uy * tMax];
  return { score: toScore(1 - dev / 0.045), ideal: { type: 'line', a, b } };
}

function rectScore(pts, { forceSquare }) {
  const { minX, minY, maxX, maxY, w, h } = bbox(pts);
  if (Math.min(w, h) < 38) return null;
  let rect;
  let scale;
  if (forceSquare) {
    const side = (w + h) / 2;
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const half = side / 2;
    rect = [
      [cx - half, cy - half],
      [cx + half, cy - half],
      [cx + half, cy + half],
      [cx - half, cy + half],
    ];
    scale = half;
  } else {
    rect = [
      [minX, minY],
      [maxX, minY],
      [maxX, maxY],
      [minX, maxY],
    ];
    scale = (w + h) / 4;
  }
  const dev = mean(pts.map((p) => distToPoly(p, rect))) / scale;
  let s = 1 - dev / 0.2;
  if (forceSquare) {
    const squareness = Math.min(w, h) / Math.max(w, h); // 1 = perfectly square
    s *= 0.45 + 0.55 * squareness;
  }
  return { score: toScore(s), ideal: { type: 'poly', pts: rect } };
}

function scoreTriangle(pts) {
  const c = centroid(pts);
  const A = farthestFrom(pts, c);
  const B = farthestFrom(pts, A);
  // C = the point with the greatest perpendicular distance from the A-B line.
  let C = pts[0];
  let cMax = -1;
  for (const p of pts) {
    const d = distToSeg(p, A, B);
    if (d > cMax) {
      cMax = d;
      C = p;
    }
  }
  const tri = [A, B, C];
  const scale = (dist(A, B) + dist(B, C) + dist(C, A)) / 6; // ~ avg side / 2
  if (scale < 26) return null;
  const dev = mean(pts.map((p) => distToPoly(p, tri))) / scale;
  return { score: toScore(1 - dev / 0.17), ideal: { type: 'poly', pts: tri } };
}

const SCORERS = {
  circle: scoreCircle,
  triangle: scoreTriangle,
  square: (pts) => rectScore(pts, { forceSquare: true }),
  rectangle: (pts) => rectScore(pts, { forceSquare: false }),
  line: scoreLine,
};

/**
 * Score a freehand drawing against a target shape.
 * @param {string} shape one of circle|triangle|square|rectangle|line
 * @param {Array<[number,number]>} points
 * @returns {{score:number, ideal:object}|null} null when there isn't enough drawn yet
 */
export function scoreShape(shape, points) {
  const fn = SCORERS[shape];
  if (!fn || !points || points.length < 14) return null;
  return fn(points);
}

// ── shape catalogue (display) ────────────────────────────────────────────────
export const SHAPES = [
  { key: 'circle', label: 'circle', emoji: '⭕' },
  { key: 'triangle', label: 'triangle', emoji: '📐' },
  { key: 'square', label: 'square', emoji: '⬜' },
  { key: 'rectangle', label: 'rectangle', emoji: '▭' },
  { key: 'line', label: 'straight line', emoji: '📏' },
];

function verdict(score) {
  if (score >= 97) return '🤖 inhumanly perfect';
  if (score >= 90) return 'scarily clean';
  if (score >= 80) return 'suspiciously good';
  if (score >= 65) return 'not bad for a human';
  if (score >= 45) return 'very human of you';
  return 'gloriously human 😬';
}

// ── widget ───────────────────────────────────────────────────────────────────
const W = 560; // internal canvas resolution (CSS scales it down responsively)
const H = 560;
const PAPER = '#faf7f0';
const INK = '#1a1a1e';
const BEST_KEY = 'ocur-beai-shapebest';

export class ShapeChallenge {
  constructor() {
    this.points = [];
    this.drawing = false;
    this.scored = null; // last { score, ideal }
    this.active = false;
    this.shapeIdx = 0;
    this.best = this._loadBest();
    this._build();
    this.setShape(0);
  }

  _loadBest() {
    try {
      return JSON.parse(localStorage.getItem(BEST_KEY) || '{}') || {};
    } catch {
      return {};
    }
  }

  _saveBest() {
    try {
      localStorage.setItem(BEST_KEY, JSON.stringify(this.best));
    } catch {
      /* ignore */
    }
  }

  _build() {
    const root = document.createElement('div');
    root.className = 'ba-shapegame';
    root.innerHTML = `
      <div class="ba-shapegame-head">
        <span class="ba-shapegame-kicker ba-hand">while you wait…</span>
        <h3 class="ba-shapegame-h">draw a perfect <span class="ba-shapegame-name"></span> <span class="ba-shapegame-emoji" aria-hidden="true"></span></h3>
        <p class="ba-shapegame-sub">freehand it. we'll measure how perfect — a flawless shape is suspiciously robotic.</p>
      </div>
      <div class="ba-shapegame-canvas-wrap ba-sketch">
        <canvas class="ba-shapegame-canvas" aria-label="draw a shape"></canvas>
        <div class="ba-shapegame-score" hidden><strong class="ba-shapegame-pct">0%</strong><span class="ba-shapegame-verdict ba-hand"></span></div>
      </div>
      <div class="ba-shapegame-foot">
        <span class="ba-shapegame-best ba-hand"></span>
        <div class="ba-shapegame-actions">
          <button type="button" class="ba-tool ba-shapegame-clear">clear</button>
          <button type="button" class="ba-shapegame-next">new shape →</button>
        </div>
      </div>`;
    this.root = root;
    this.canvas = root.querySelector('.ba-shapegame-canvas');
    this.canvas.width = W;
    this.canvas.height = H;
    this.ctx = this.canvas.getContext('2d');
    this.nameEl = root.querySelector('.ba-shapegame-name');
    this.emojiEl = root.querySelector('.ba-shapegame-emoji');
    this.scoreBox = root.querySelector('.ba-shapegame-score');
    this.pctEl = root.querySelector('.ba-shapegame-pct');
    this.verdictEl = root.querySelector('.ba-shapegame-verdict');
    this.bestEl = root.querySelector('.ba-shapegame-best');

    root.querySelector('.ba-shapegame-clear').addEventListener('click', () => this.reset());
    root.querySelector('.ba-shapegame-next').addEventListener('click', () => this.setShape(this.shapeIdx + 1));
    this._bind();
    this._redraw();
  }

  _pos(e) {
    const r = this.canvas.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    return [((p.clientX - r.left) / r.width) * W, ((p.clientY - r.top) / r.height) * H];
  }

  _bind() {
    const start = (e) => {
      if (!this.active) return;
      e.preventDefault();
      // A fresh stroke after a score begins a new attempt.
      if (this.scored) this.reset();
      this.drawing = true;
      this.points.push(this._pos(e));
      this._redraw();
    };
    const move = (e) => {
      if (!this.drawing) return;
      e.preventDefault();
      this.points.push(this._pos(e));
      this._redraw();
    };
    const end = () => {
      if (!this.drawing) return;
      this.drawing = false;
      this._score();
    };
    this.canvas.addEventListener('pointerdown', start);
    this.canvas.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    this.canvas.addEventListener('touchstart', start, { passive: false });
    this.canvas.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', end);
  }

  setShape(idx) {
    this.shapeIdx = ((idx % SHAPES.length) + SHAPES.length) % SHAPES.length;
    const s = SHAPES[this.shapeIdx];
    this.nameEl.textContent = s.label;
    this.emojiEl.textContent = s.emoji;
    this.reset();
    this._renderBest();
  }

  reset() {
    this.points = [];
    this.drawing = false;
    this.scored = null;
    this.scoreBox.hidden = true;
    this._redraw();
  }

  _score() {
    const shape = SHAPES[this.shapeIdx].key;
    const res = scoreShape(shape, this.points);
    if (!res) return; // not enough drawn — let them keep going
    this.scored = res;
    this.pctEl.textContent = `${res.score}%`;
    this.verdictEl.textContent = verdict(res.score);
    this.scoreBox.hidden = false;
    this.scoreBox.dataset.tier = res.score >= 90 ? 'hi' : res.score >= 65 ? 'mid' : 'lo';
    if (!(this.best[shape] >= res.score)) {
      this.best[shape] = res.score;
      this._saveBest();
    }
    this._renderBest();
    this._redraw();
  }

  _renderBest() {
    const shape = SHAPES[this.shapeIdx].key;
    const b = this.best[shape];
    this.bestEl.textContent = b != null ? `your best: ${b}%` : 'no score yet';
  }

  _redraw() {
    const ctx = this.ctx;
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, W, H);

    // faint fitted "perfect" overlay behind the ink, once scored
    if (this.scored) this._drawIdeal(this.scored.ideal);

    // the user's ink
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    this.points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.stroke();
  }

  _drawIdeal(ideal) {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = 'rgba(43,108,176,0.45)';
    ctx.lineWidth = 2;
    ctx.setLineDash([7, 7]);
    ctx.beginPath();
    if (ideal.type === 'circle') {
      ctx.arc(ideal.c[0], ideal.c[1], ideal.r, 0, Math.PI * 2);
    } else if (ideal.type === 'line') {
      ctx.moveTo(ideal.a[0], ideal.a[1]);
      ctx.lineTo(ideal.b[0], ideal.b[1]);
    } else if (ideal.type === 'poly') {
      ideal.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.closePath();
    }
    ctx.stroke();
    ctx.restore();
  }

  start() {
    this.active = true;
  }

  stop() {
    this.active = false;
    this.drawing = false;
  }
}
