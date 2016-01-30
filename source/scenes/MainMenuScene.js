var pixi = require('pixi.js');
var assets = require('../assets');
var extend = require('../extend');
var constants = require('../constants');
var game = require('../game');
var keyboard = require('../keyboard');
var GameplayScene = require('./GameplayScene');
var BaseScene = require('./BaseScene');
var levels = require('../levels');
var debug = require('../debug');

function MainMenuScene() {
  BaseScene.call(this);
  var title = assets.sprite('text/title');
  this.ui.addChild(title);
  title.anchor.x = 0.5;
  title.position = game.display.topCenter;
  var play = new pixi.Text('PRESS [RETURN] TO ENGAGE SANITATION PROCEDURE', {
    font: '20px monospace',
    fill: 0xFF00CC,
  });
  this.ui.addChild(play);
  play.anchor.x = 0.5;
  play.anchor.y = 1;
  play.position = game.display.bottomCenter;
}

extend(BaseScene, MainMenuScene, {
  update: function update(delta) {
    if (keyboard.isKeyPressed(keyboard.RETURN)) {
      return new GameplayScene(levels.first);
    }
    if (keyboard.isKeyPressed(keyboard.SHIFT)) {
      var levelName = prompt("Jump to level?", 'tutorial1');
      if (levelName in levels) {
        return new GameplayScene(levels[levelName]);
      } else {
        debug.error('The level "' + levelName + '" does not exist!');
      }
    }
  }
});

module.exports = MainMenuScene;
