let pixi = require('pixi.js');

pixi.animationSpeedFromFps = function animationSpeedFromFps(fps) {
  return fps / pixi.ticker.shared.FPS;
};

pixi.fpsFromAnimationSpeed = function fpsFromAnimationSpeed(speed) {
  return speed * pixi.ticker.shared.FPS;
};

pixi.extras.MovieClip.prototype.setFps = function setFps(fps) {
  this.animationSpeed = pixi.animationSpeedFromFps(fps);
};

pixi.extras.MovieClip.prototype.getFps = function getFps() {
  return pixi.fpsFromAnimationSpeed(this.animationSpeed);
};

pixi.extras.MovieClip.prototype.getDuration = function getDuration() {
  return this.totalFrames / this.getFps();
};

pixi.Rectangle.prototype.getCenter = function getCenter() {
  return new pixi.Point(this.x + this.width/2, this.y + this.height/2);
}

pixi.Rectangle.prototype.setCenter = function setCenter(x, y) {
  this.x = x - this.width/2;
  this.y = y - this.height/2;
}