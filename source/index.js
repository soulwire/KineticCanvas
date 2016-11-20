// ——————————————————————————————————————————————————
// Dependencies
// ——————————————————————————————————————————————————

import Fixtures from './fixtures';
import Animator from './animator';
import Renderer from './renderer';
import Drawing from './drawing';
import GUI from './gui';

// ——————————————————————————————————————————————————
// Bootstrap
// ——————————————————————————————————————————————————

const init = () => {
  const paths = [];
  const drawing = new Drawing(paths);
  const animator = new Animator(paths);
  const renderer = new Renderer();
  const gui = new GUI(drawing, paths);
  let elapsed = 0;
  let clock = Date.now();
  const update = () => {
    requestAnimationFrame(update);
    const now = Date.now();
    const dt = now - clock;
    elapsed += dt;
    clock = now;
    animator.animate(dt / 1000);
    renderer.render(paths, elapsed);
  };
  document.body.appendChild(renderer.canvas);
  document.body.appendChild(gui.el);
  drawing.loadState(Fixtures);
  update();
  // Util for generating fixtures.
  window.__logState = () => {
    const state = {
      paths: paths.map(path => ({
        color: path.color,
        points: path.points.reduce((points, point) =>
          points.concat([point.ox, point.oy]), [])
      }))
    };
    let minX = Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    let maxX = Number.MIN_VALUE;
    let maxY = Number.MIN_VALUE;
    state.paths.forEach(path => {
      const points = path.points;
      for (let i = 0, n = points.length; i < n; i += 2) {
        minX = Math.min(minX, points[i]);
        maxX = Math.max(maxX, points[i]);
        minY = Math.min(minY, points[i + 1]);
        maxY = Math.max(maxY, points[i + 1]);
      }
    });
    state.bounds = [minX, minY, maxX, maxY];
    console.log(JSON.stringify(state));
  };
};

if (document.readyState === 'complete') {
  init();
} else {
  window.addEventListener('load', init);
}