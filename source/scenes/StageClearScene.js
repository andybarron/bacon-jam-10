var pixi = require('pixi.js');
var assets = require('../assets');
var constants = require('../constants');
var game = require('../game');
var keyboard = require('../keyboard');
var BaseScene = require('./BaseScene');

module.exports = class StageClearScene extends BaseScene {
  constructor() {
    super();
    var title = assets.sprite('text/clear');
    this.ui.addChild(title);
    title.anchor.x = 0.5;
    title.position = game.display.topCenter;
    var play = new pixi.Text('PRESS [RETURN] TO RETURN TO BREAK ROOM', {
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
      var MainMenuScene = require('./MainMenuScene');
      return new MainMenuScene();
    }
  }
}