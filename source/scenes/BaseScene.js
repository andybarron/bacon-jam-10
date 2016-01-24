var pixi = require('pixi.js');

function BaseScene() {
  this.container = new pixi.Container();
  this.world = new pixi.Container();
  this.ui = new pixi.Container();
  this.container.addChild(this.world);
  this.container.addChild(this.ui);
}

BaseScene.prototype = {
  update: function update() {
    // no-op, ignore args
  },
  getStage: function getStage() {
    return this.container;
  }
};

module.exports = BaseScene;