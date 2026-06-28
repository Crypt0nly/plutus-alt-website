// Ocur — /be-ai drawing pad. A responder "being the AI" can answer a prompt
// with a scribble instead of text (the youraislopbores.me signature move). A
// small, dependency-free canvas: pointer/touch strokes, a marker palette,
// undo/redo/clear, and a PNG-data-URL export sized to stay under the backend's
// drawing byte cap.
//
//   const pad = new DrawPad(canvasEl);
//   pad.toDataURL();   // → "data:image/png;base64,..." or null if empty

const PAPER = '#faf7f0'; // hand-drawn "paper" so ink reads on the dark theme
export const INK_COLORS = ['#1a1a1e', '#f2942e', '#2b6cb0', '#2f855a', '#c53030', '#6b46c1'];
const SIZES = [3, 7, 14];
const W = 600;
const H = 440;

export class DrawPad {
  constructor(canvas) {
    this.canvas = canvas;
    this.canvas.width = W;
    this.canvas.height = H;
    this.ctx = canvas.getContext('2d');
    this.strokes = []; // each: { color, size, points: [[x,y],...] }
    this.redoStack = [];
    this.color = INK_COLORS[0];
    this.size = SIZES[1];
    this.drawing = null;
    this._onChange = null;
    this._bind();
    this.redraw();
  }

  onChange(fn) {
    this._onChange = fn;
  }

  setColor(c) {
    this.color = c;
  }

  setSize(s) {
    this.size = s;
  }

  _pos(e) {
    const r = this.canvas.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    return [((p.clientX - r.left) / r.width) * W, ((p.clientY - r.top) / r.height) * H];
  }

  _bind() {
    const start = (e) => {
      e.preventDefault();
      this.drawing = { color: this.color, size: this.size, points: [this._pos(e)] };
      this.redoStack = [];
    };
    const move = (e) => {
      if (!this.drawing) return;
      e.preventDefault();
      this.drawing.points.push(this._pos(e));
      this.redraw();
    };
    const end = () => {
      if (!this.drawing) return;
      if (this.drawing.points.length) this.strokes.push(this.drawing);
      this.drawing = null;
      this.redraw();
      this._changed();
    };
    this.canvas.addEventListener('pointerdown', start);
    this.canvas.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    // touch fallback for browsers without pointer events
    this.canvas.addEventListener('touchstart', start, { passive: false });
    this.canvas.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', end);
  }

  _changed() {
    if (this._onChange) this._onChange();
  }

  _drawStroke(s) {
    const ctx = this.ctx;
    ctx.strokeStyle = s.color;
    ctx.lineWidth = s.size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    s.points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    if (s.points.length === 1) {
      // a single tap → a dot
      const [x, y] = s.points[0];
      ctx.arc(x, y, s.size / 2, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.fill();
    } else {
      ctx.stroke();
    }
  }

  redraw() {
    const ctx = this.ctx;
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, W, H);
    this.strokes.forEach((s) => this._drawStroke(s));
    if (this.drawing) this._drawStroke(this.drawing);
  }

  undo() {
    if (!this.strokes.length) return;
    this.redoStack.push(this.strokes.pop());
    this.redraw();
    this._changed();
  }

  redo() {
    if (!this.redoStack.length) return;
    this.strokes.push(this.redoStack.pop());
    this.redraw();
    this._changed();
  }

  clear() {
    this.strokes = [];
    this.redoStack = [];
    this.redraw();
    this._changed();
  }

  isEmpty() {
    return this.strokes.length === 0;
  }

  toDataURL() {
    if (this.isEmpty()) return null;
    return this.canvas.toDataURL('image/png');
  }
}

export { SIZES as BRUSH_SIZES };
