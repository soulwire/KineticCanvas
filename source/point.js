// ——————————————————————————————————————————————————
// Dependencies
// ——————————————————————————————————————————————————

import Random from './random';

// ——————————————————————————————————————————————————
// Point
// ——————————————————————————————————————————————————

class Point {
  constructor(x = 0, y = 0) {
    this.stiffness = Random.float(0.65, 0.85);
    this.length = 1.0;
    this.wander = Random.float(0.2, 0.95);
    this.jitter = Random.float(0.05, 0.1);
    this.force = Random.float(0.05, 0.3);
    this.speed = Random.float(0.5, 0.8);
    this.theta = Random.float(-Math.PI, Math.PI);
    this.turn = Random.float(0.1, 0.68);
    this.snap = Random.float(0.33);
    this.dragEase = Random.float(0.02, 0.03);
    this.dragMax = Random.float(0.82, 0.95);
    this.active = false;
    this.drag = 0.0;
    this.age = 0;
    this.ox = x;
    this.oy = y;
    this.vx = 0;
    this.vy = 0;
    this.x = x;
    this.y = y;
    this.t = 1;
    this.reset();
  }
  reset() {
    this.active = false;
    this.drag = 0.0;
    this.age = 0;
    this.vx = 0;
    this.vy = 0;
    this.t = 1;
    this.x = this.ox;
    this.y = this.oy;
  }
  distance(other) {
    const dx = other.x - this.x;
    const dy = other.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Point;