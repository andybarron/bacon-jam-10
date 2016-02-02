import * as debug from '../debug';

let pixi = require('pixi.js');
let assets = require('../assets');
let constants = require('../constants');
let game = require('../game');
let keyboard = require('../keyboard');
let GameplayScene = require('./GameplayScene');
let BaseScene = require('./BaseScene');
let levels = require('../levels');

module.exports = class MainMenuScene extends BaseScene {
  constructor() {
    super();
    let title = assets.sprite('text/title');
    this.ui.addChild(title);
    title.anchor.x = 0.5;
    title.position = game.display.topCenter;
    let play = new pixi.Text('PRESS [RETURN] TO ENGAGE SANITATION PROCEDURE', {
      font: '20px monospace',
      fill: 0xFF00CC,
    });
    this.ui.addChild(play);
    play.anchor.x = 0.5;
    play.anchor.y = 1;
    play.position = game.display.bottomCenter;
  }
  update(delta) {
    if (keyboard.isKeyPressed(keyboard.RETURN)) {
      return new GameplayScene(levels.first);
    }
    if (keyboard.isKeyPressed(keyboard.SHIFT)) {
      let levelName = prompt("Jump to level?", 'tutorial1');
      if (levelName in levels) {
        return new GameplayScene(levels[levelName]);
      } else {
        debug.error('The level "' + levelName + '" does not exist!');
      }
    }
  }
}
