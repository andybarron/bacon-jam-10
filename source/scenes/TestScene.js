var pixi = require('pixi.js');
var colors = require('../colors');

module.exports = function TestScreen() {
  this.stage = new pixi.Container();
  this.graphics = new pixi.Graphics();
  this.stage.addChild(this.graphics);
  this.graphics.x = 300;
  this.graphics.y = 300;
  this.graphics.beginFill(colors.fromRgb(0.5, 0.2, 0.2));
  this.graphics.drawRect(-100, -100, 200, 200);
  this.graphics.endFill();
  this.update = function update(delta) {
    this.graphics.rotation += 2 * Math.PI * delta / 4;
  };
  this.getStage = function getStage() {
    return this.stage;
  };
};
