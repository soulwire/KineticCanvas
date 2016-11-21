// ——————————————————————————————————————————————————
// Dependencies
// ——————————————————————————————————————————————————

import { DRAW_RATE, MAX_PATHS, MAX_VELOCITY } from './config';
import Random from './random';

// ——————————————————————————————————————————————————
// Constants
// ——————————————————————————————————————————————————

const MAX_VELOCITY_SQ = Math.pow(MAX_VELOCITY, 2);

// ——————————————————————————————————————————————————
// Animator
// ——————————————————————————————————————————————————

class Animator {
  constructor(paths) {
    this.paths = paths;
  }
  animate(dt) {
    this.paths.forEach(path => {
      this.updatePath(path, dt);
      this.animatePoints(path, dt);
      this.animateParticles(path.particles, dt);
    });
  }
  updatePath(path, dt) {
    if (path.animated) {
      const length = path.points.length;
      if (path.drawProgress < length) {
        const progress = Math.min(length, Math.ceil(path.age * DRAW_RATE));
        path.points.map((p, i) => p.active = i <= progress);
        path.drawProgress = progress;
      } else {
        const active = path.points.filter(p => p.active);
        if (active.length >= 3) {
          // Deactivate one of the points.
          if (Random.bool(0.25)) {
            // const point = Random.bool(0.2) ? Random.item(active) : active[0];
            const point = active[0];
            point.active = false;
          }
        } else {
          path.reset();
        }
      }
      path.age += dt;
    }
  }
  animatePoints(path, dt) {
    const { animated, drawProgress } = path;
    if (animated && drawProgress > 0) {
      const points = path.points.filter(p => p.active);
      let magSq, mag, dx, dy, ds, d, f, p, i, n, o = points[0];
      for (i = 1, n = points.length; i < n; i++) {
        p = points[i];
        if (p.active) {
          // Compute distance
          dx = o.x - p.x;
          dy = o.y - p.y;
          ds = dx * dx + dy * dy + 1;
          // Compute force
          d = Math.sqrt(ds);
          // Hack to stop big jumps.
          if (d > o.l + 200) {
            o.active = false;
            continue;
          }
          f = (d - p.length) / d * p.stiffness;
          // Update velocity.
          o.vx += dx * -f * o.force;
          o.vy += dy * -f * o.force;
          // Wander
          o.theta += Random.float(-o.turn, o.turn);
          o.vx += Math.cos(o.theta) * o.wander;
          o.vy += Math.sin(o.theta) * o.wander;
          // Jitter
          o.vx += Random.float(-o.jitter, o.jitter);
          o.vy += Random.float(-o.jitter, o.jitter);
          // Limit velocity.
          magSq = o.vx * o.vx + o.vy * o.vy;
          if (magSq > MAX_VELOCITY_SQ) {
            mag = Math.sqrt(magSq);
            o.vx /= mag;
            o.vy /= mag;
            o.vx *= MAX_VELOCITY;
            o.vy *= MAX_VELOCITY;
            o.active = false;
          }
          // Constrain
          o.x -= dx * o.snap;
          o.y -= dy * o.snap;
          // Integrate
          o.drag += (o.dragMax - o.drag) * o.dragEase;
          o.vx *= o.drag;
          o.vy *= o.drag;
          o.x += o.vx * o.speed;
          o.y += o.vy * o.speed;
          o.age++;
          // Slightly special case for the last node.
          if (i == n - 1) {
            p.vx += dx * -f * p.force;
            p.vy += dy * -f * p.force;
            p.theta += Random.float(-p.turn, p.turn);
            p.vx += Math.cos(p.theta) * p.wander;
            p.vy += Math.sin(p.theta) * p.wander;
            p.vx += Random.float(-p.jitter, p.jitter);
            p.vy += Random.float(-p.jitter, p.jitter);
            // Limit velocity.
            magSq = p.vx * p.vx + p.vy * p.vy;
            if (magSq > MAX_VELOCITY_SQ) {
              mag = Math.sqrt(magSq);
              p.vx /= mag;
              p.vy /= mag;
              p.vx *= MAX_VELOCITY;
              p.vy *= MAX_VELOCITY;
              p.active = false;
            }
            p.drag += (p.dragMax - p.drag) * p.dragEase;
            p.t = Math.pow(Math.sin((i / n) * Math.PI), 2) || 0.1;
            p.t *= Math.min(1, Math.max(0.1, n / 40)) || 0.1;
            p.vx *= p.drag;
            p.vy *= p.drag;
            p.x += p.vx * p.speed;
            p.y += p.vy * p.speed;
            p.age++;
          }
          // Spawn a new particle at point.
          if (path.particles.length < 100 && Random.bool(0.05)) {
            path.spawn(o);
          }
          // perpendicular unit vector
          o.t = Math.pow(Math.sin((i / n) * Math.PI), 2) || 0.1;
          o.t *= Math.min(1, Math.max(0.1, n / 40)) || 0.1;
          // Update previous ref.
          o = p;
        }
      }
    }
  }
  animateParticles(particles, dt) {
    for (let p, i = particles.length - 1; i >= 0; i--) {
      p = particles[i];
      p.t *= 0.95;
      p.vx += Random.float(-0.3, 0.3);
      p.vy += Random.float(-0.3, 0.3);
      p.vx *= 0.95;
      p.vy *= 0.95;
      p.x += p.vx;
      p.y += p.vy;
      if (p.t < 0.1) {
        particles.splice(i, 1);
      }
    }
  }
}

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Animator;