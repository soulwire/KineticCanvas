// ——————————————————————————————————————————————————
// Dependencies
// ——————————————————————————————————————————————————

import Particle from './particle';
import Random from './random';
import Point from './point';

// ——————————————————————————————————————————————————
// Helpers
// ——————————————————————————————————————————————————

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// ——————————————————————————————————————————————————
// Path
// ——————————————————————————————————————————————————

class Path {
  constructor(color) {
    this.color = color;
    this.animated = false;
    this.drawProgress = 0;
    this.particles = [];
    this.points = [];
    this.age = 0;
  }
  animate() {
    this.animated = true;
    this.reset();
  }
  append(point) {
    if (this.points.length > 0) {
      const prev = this.points[this.points.length - 1];
      const dx = prev.x - point.x;
      const dy = prev.y - point.y;
      point.length = Math.sqrt(dx * dx + dy * dy) * Random.float(0.5, 4.0);
      point.theta = Math.atan2(dy, dx) + Random.float(-Math.PI, Math.PI);
    }
    this.points.push(point);
  }
  spawn(point) {
    const { x, y, t } = point;
    const particle = new Particle(x, y, t * Random.float(0.4, 1.0));
    particle.vx = clamp(point.vx * Random.float(0.2, 1.5), -5, 5);
    particle.vy = clamp(point.vy * Random.float(0.2, 1.5), -5, 5);
    this.particles.push(particle);
  }
  reset() {
    this.points.forEach(point => point.reset());
    this.particles.length = 0;
    this.drawProgress = 0;
    this.age = 0;
  }
}

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Path;
