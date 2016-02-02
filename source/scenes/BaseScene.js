let pixi = require('pixi.js');

function BaseScene() {
  this.backgroundColor = 0x0; // black
  this.container = new pixi.Container();
  this.background = new pixi.Container();
  this.world = new pixi.Container();
  this.ui = new pixi.Container();
  this.container.addChild(this.background);
  this.container.addChild(this.world);
  this.container.addChild(this.ui);
}

BaseScene.prototype = {
  initialize: function initialize() {
    // no-op
  },
  resize: function resize() {
    // no-op, ignore args
  },
  dispose: function dispose() {
    // no-op
  },
  update: function update() {
    // no-op, ignore args
  },
  getStage: function getStage() {
    return this.container;
  }
};

module.exports = BaseScene;