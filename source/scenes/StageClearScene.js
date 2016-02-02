let pixi = require('pixi.js');
let assets = require('../assets');
let constants = require('../constants');
let game = require('../game');
let keyboard = require('../keyboard');
let BaseScene = require('./BaseScene');

module.exports = class StageClearScene extends BaseScene {
  constructor() {
    super();
    let title = assets.sprite('text/clear');
    this.ui.addChild(title);
    title.anchor.x = 0.5;
    title.position = game.display.topCenter;
    let play = new pixi.Text('PRESS [RETURN] TO RETURN TO BREAK ROOM', {
      font: '20px monospace',
      fill: 0x00CCFF,
    });
    this.ui.addChild(play);
    play.anchor.x = 0.5;
    play.anchor.y = 4;
    play.position = game.display.bottomCenter;
  }
  update(delta) {
    if (keyboard.isKeyPressed(keyboard.RETURN)) {
      let MainMenuScene = require('./MainMenuScene');
      return new MainMenuScene();
    }
  }
}