// ——————————————————————————————————————————————————
// Dependencies
// ——————————————————————————————————————————————————

import { MIN_DISTANCE, MAX_POINTS, COLORS } from './config';
import Point from './point';
import Path from './path';

// ——————————————————————————————————————————————————
// Drawing
// ——————————————————————————————————————————————————

class Drawing {
  constructor(paths) {
    this.totalPoints = 0;
    this.color = COLORS[0];
    this.paths = paths;
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.currentPath = null;
    this.lastPoint = null;
    this.deferred = [];
    document.addEventListener('touchstart', this.onPointerDown, false);
    document.addEventListener('mousedown', this.onPointerDown, false);
  }
  loadState(state) {
    this.hasFixtures = true;
    const cx = (window.innerWidth - state.bounds[2] - state.bounds[0]) / 2;
    const cy = (window.innerHeight - state.bounds[3] - state.bounds[1]) / 2;
    state.paths.forEach((data, index) => {
      const path = new Path(data.color);
      const points = data.points;
      for (let i = 0, n = points.length; i < n; i += 2) {
        path.append(new Point(
          cx + points[i],
          cy + points[i + 1]
        ));
      }
      this.deferred.push(setTimeout(() => {
        this.paths.push(path);
        path.animate();
      }, 400 + index * 300));
    });
  }
  reset() {
    this.paths.length = 0;
    this.totalPoints = 0;
  }
  onPointerDown(event) {
    if (this.hasFixtures) {
      this.deferred.forEach(clearTimeout);
      this.hasFixtures = false;
      this.reset();
    }
    this.lastPoint = null;
    this.currentPath = new Path(this.color);
    this.paths.push(this.currentPath);
    document.addEventListener('touchmove', this.onPointerMove, false);
    document.addEventListener('touchend', this.onPointerUp, false);
    document.addEventListener('mousemove', this.onPointerMove, false);
    document.addEventListener('mouseleave', this.onPointerUp, false);
    document.addEventListener('mouseup', this.onPointerUp, false);
    this.onPointerMove(event);
  }
  onPointerMove(event) {
    const { clientX: x, clientY: y } = (
      event.changedTouches ?
        event.changedTouches[0] :
        event
    );
    if (this.totalPoints < MAX_POINTS) {
      const point = new Point(x, y);
      if (!this.lastPoint || point.distance(this.lastPoint) > MIN_DISTANCE) {
        this.currentPath.append(point);
        this.lastPoint = point;
        this.totalPoints++;
      }
    }
  }
  onPointerUp() {
    document.removeEventListener('touchmove', this.onPointerMove, false);
    document.removeEventListener('touchend', this.onPointerUp, false);
    document.removeEventListener('mousemove', this.onPointerMove, false);
    document.removeEventListener('mouseleave', this.onPointerUp, false);
    document.removeEventListener('mouseup', this.onPointerUp, false);
    if (this.currentPath.points.length >= 3) {
      this.currentPath.animate();
    } else {
      const path = this.paths.pop();
      this.totalPoints -= path.points.length;
    }
  }
}

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Drawing;
