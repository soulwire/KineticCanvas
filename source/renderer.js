// ——————————————————————————————————————————————————
// Dependencies
// ——————————————————————————————————————————————————

import { LINE_THICKNESS } from './config';

// ——————————————————————————————————————————————————
// Constants
// ——————————————————————————————————————————————————

const PI = Math.PI;
const TWO_PI = Math.PI * 2;

// ——————————————————————————————————————————————————
// Helpers
// ——————————————————————————————————————————————————

const map = (n, a, b, x, y) => (n - a) / (b - a) * (y - x) + x;

// ——————————————————————————————————————————————————
// Renderer
// ——————————————————————————————————————————————————

class Renderer {
  constructor() {
    this.scale = window.devicePixelRatio || 1;
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onResize);
    this.onResize();
  }
  render(paths, elapsed) {
    const theta = map(Math.sin(elapsed * 0.0012), -1, 1, -PI, PI) * 0.025;
    const scale = map(Math.cos(elapsed * 0.00081), -1, 1, 0.9, 1.1);
    this.context.clearRect(0, 0, this.width, this.height);
    paths.forEach(path => {
      const points = path.animated ? 
        path.points.filter(p => p.active) :
        path.points;
      this.context.strokeStyle = path.color;
      this.context.fillStyle = path.color;
      if (path.animated) {
        this.context.save();
        this.context.translate(this.halfWidth, this.halfHeight);
        this.context.rotate(theta);
        this.context.scale(scale, scale);
        this.context.translate(-this.halfWidth, -this.halfHeight);
        this.context.beginPath();
        this.context.globalAlpha = 0.5;
        path.particles.forEach(p => {
          this.context.moveTo(p.x + p.t, p.y);
          this.context.arc(p.x, p.y, p.t * 12, 0, TWO_PI);
        });
        points.forEach(p => {
          this.context.moveTo(p.x + p.t, p.y);
          this.context.arc(p.x, p.y, p.t * 18, 0, TWO_PI);
        });
        this.context.fill();
        this.context.globalAlpha = 1.0;
      }
      this.drawCurve(points, LINE_THICKNESS);
      if (path.animated) {
        this.context.restore();
      }
    });
  }
  drawCurve(points, thickness) {
    if (points.length >= 3) {
      let p0, p1, p2, p3, t,
        ox = points[0].x, oy = points[0].y,
        i6 = 1.0 / 6.0,
        ct = Number.MAX_VALUE;
      this.context.beginPath();
      for (let i = 3, n = points.length; i < n; i++) {
        p0 = points[i - 3];
        p1 = points[i - 2];
        p2 = points[i - 1];
        p3 = points[i];
        this.context.moveTo(ox, oy);
        this.context.bezierCurveTo(
          p2.x * i6 + p1.x - p0.x * i6,
          p2.y * i6 + p1.y - p0.y * i6,
          p3.x * -i6 + p2.x + p1.x * i6,
          p3.y * -i6 + p2.y + p1.y * i6,
          ox = p2.x,
          oy = p2.y
        );
        t = (points[i].t || 1) * thickness;
        if (Math.abs(ct - t) > 1.5) {
          this.context.lineWidth = t;
          this.context.stroke();
          this.context.beginPath();
        }
      }
      this.context.stroke();
    }
  }
  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.halfWidth = this.width / 2;
    this.halfHeight = this.height / 2;
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';
    this.canvas.width = this.width * this.scale;
    this.canvas.height = this.height * this.scale;
    this.context.scale(this.scale, this.scale);
    this.context.globalCompositeOperation = 'darken';
    // this.context.lineJoin = 'round';
    this.context.lineCap = 'round';
  }
}

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Renderer;
