// ——————————————————————————————————————————————————
// Dependencies
// ——————————————————————————————————————————————————

import { COLORS, MAX_POINTS } from './config';

// ——————————————————————————————————————————————————
// Styles
// ——————————————————————————————————————————————————

const buttonSize = 30;
const activeScale = 0.75;
const style = document.createElement('style');
style.innerHTML = `
  .gui {
    font-size: 0;
    position: absolute;
    right: 0;
    left: 0;
    top: 0;
  }
  .gui .buttons {
    position: absolute;
    right: 20px;
    top: 20px;
  }
  .gui button {
    background: transparent;
    position: relative;
    display: inline-block;
    padding: 0;
    outline: none;
    cursor: pointer;
    border: none;
    margin: 0;
    height: ${buttonSize}px;
    width: ${buttonSize}px;
  }
  .gui .button:focus {
    background: none;
  }
  .gui .palette {
    position: relative;
  }
  .gui .ink {
    background: rgba(0,0,0,0.05);
    position: absolute;
    height: 3px;
    right: 0;
    left: 0;
    top: 0;
  }
  .gui .ink .bar {
    -webkit-transition: background 0.2s ease-out;
    -moz-transition: background 0.2s ease-out;
    -ms-transition: background 0.2s ease-out;
    transition: background 0.2s ease-out;
    background: transparent;
    height: 100%;
    width: 100%;
  }
  .gui .icon {
    pointer-events: none;
    height: 100%;
  }
  .gui .color.active {
    -webkit-transform: scale(${activeScale});
    -moz-transform: scale(${activeScale});
    -ms-transform: scale(${activeScale});
    transform: scale(${activeScale});
  }
  .gui .reset {
    margin-left: 8px;
    fill: #1c1c1c;
  }
`;
document.body.appendChild(style);

// ——————————————————————————————————————————————————
// GUI
// ——————————————————————————————————————————————————

class GUI {
  constructor(drawing) {
    this.drawing = drawing;
    this.el = document.createElement('div');
    this.el.className = 'gui';
    this.targetPointsLeft = 1;
    this.smoothPointsLeft = 1;
    this.onClickButton = this.onClickButton.bind(this);
    this.updatePointsLeft = this.updatePointsLeft.bind(this);
    this.el.addEventListener('touchstart', this.onClickButton, false);
    this.el.addEventListener('mousedown', this.onClickButton, false);
    this.render();
  }
  render() {
    this.el.innerHTML = `
      <div class="ink">
        <div class="bar" style="background: ${this.drawing.color};"></div>
      </div>
      <div class="buttons">
        <span class="palette">
          ${COLORS.map(color => {
            return `
              <button class="color" data-color="${color}" style="fill: ${color};">
                <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="9"/>
                </svg>
              </button>
            `;
          }).join('\n')}
        </span>
        <button class="reset" data-action="reset">
          <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"/>
          </svg>
        </button>
      </div>
    `;
    this.colorButtons = this.el.querySelectorAll('.buttons .color');
    this.inkBar = this.el.querySelector('.ink .bar');
    this.updatePointsLeft();
    this.updateColor();
  }
  updatePointsLeft() {
    requestAnimationFrame(this.updatePointsLeft);
    this.targetPointsLeft = MAX_POINTS - this.drawing.totalPoints;
    let delta = Math.abs(this.targetPointsLeft - this.smoothPointsLeft);
    if (delta > 0.001) {
      if (this.targetPointsLeft > this.smoothPointsLeft) {
        this.smoothPointsLeft = this.targetPointsLeft;
      } else {
        delta = this.targetPointsLeft - this.smoothPointsLeft;
        this.smoothPointsLeft += delta * 0.1;
      }
      const percent = (this.smoothPointsLeft / MAX_POINTS) * 100 ;
      this.inkBar.style.width = percent.toFixed(3) + '%';
    }
  }
  updateColor() {
    this.inkBar.style.background = this.drawing.color;
    for (let button, active, i = 0; i < this.colorButtons.length; i++) {
      button = this.colorButtons[i];
      active = button.dataset.color === this.drawing.color;
      button.classList.toggle('active', active);
    }
  }
  onPointsChanged(totalPoints) {
    const ratio = totalPoints / MAX_POINTS;
    this.inkBar.style.width = (100 - ratio * 100) + '%';
  }
  onClickButton(event) {
    event.stopImmediatePropagation();
    event.stopPropagation();
    const { color, action } = event.target.dataset;
    if (color) {
      this.drawing.color = color;
      this.updateColor();
    } else if (action) {
      this.drawing.reset();
    }
  }
}

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default GUI;