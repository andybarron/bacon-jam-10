import {animationSpeedFromFps, fpsFromAnimationSpeed} from './game';
import * as pixi from 'pixi.js';
let MovieClip = pixi.extras.MovieClip;

Object.defineProperty(MovieClip.prototype, 'fps', {
  get: function() {
    return fpsFromAnimationSpeed(this.animationSpeed);
  },
  set: function(targetFps) {
    this.animationSpeed = animationSpeedFromFps(targetFps);
  },
});

Object.defineProperty(MovieClip.prototype, 'duration', {
  get: function() {
    return this.totalFrames / this.fps;
  },
  set: function(duration) {
    this.fps = this.totalFrames / duration;
  },
});

Object.assign(pixi.Rectangle.prototype, {
  getCenter() {
    return new pixi.Point(this.x + this.width/2, this.y + this.height/2);
  },
  setCenter(x, y) {
    this.x = x - this.width/2;
    this.y = y - this.height/2;
  },
  pad(padding) {
    this.x -= padding;
    this.y -= padding;
    this.width += padding * 2;
    this.height += padding * 2;
  },
});
