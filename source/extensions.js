let pixi = require('pixi.js');

Object.assign(pixi, {
  animationSpeedFromFps(fps) {
    return fps / pixi.ticker.shared.FPS;
  },
  fpsFromAnimationSpeed(speed) {
    return speed * pixi.ticker.shared.FPS;
  },
});

Object.defineProperty(pixi.extras.MovieClip.prototype, 'fps', {
  get: function() {
    return pixi.fpsFromAnimationSpeed(this.animationSpeed);
  },
  set: function(targetFps) {
    this.animationSpeed = pixi.animationSpeedFromFps(targetFps);
  },
});

Object.defineProperty(pixi.extras.MovieClip.prototype, 'duration', {
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
