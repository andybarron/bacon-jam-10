let pixi = require('pixi.js');

module.exports = class BaseScene {
  constructor() {
    this.backgroundColor = 0x0; // black
    this.container = new pixi.Container();
    this.background = new pixi.Container();
    this.world = new pixi.Container();
    this.ui = new pixi.Container();
    this.container.addChild(this.background);
    this.container.addChild(this.world);
    this.container.addChild(this.ui);
  }
  initialize() {
    // no-op
  }
  resize() {
    // no-op, ignore args
  }
  dispose() {
    // no-op
  }
  update() {
    // no-op, ignore args
  }
  getStage() { // TODO make property?
    return this.container;
  }
}