var pixi = require('pixi.js');
var assets = require('../assets');
var extend = require('../extend');
var constants = require('../constants');
var game = require('../game');
var keyboard = require('../keyboard');
var MainGame = require('./MainGame');
var BaseScene = require('./BaseScene');

function MainMenuScene() {
  BaseScene.call(this);
  var title = assets.sprite('title');
  this.ui.addChild(title);
  title.anchor.x = 0.5;
  title.x = constants.SCREEN_WIDTH / 2.0;
  var play = new pixi.Text('PRESS [RETURN] TO ENGAGE SANITATION PROCEDURE', {
    font: '20px monospace',
    fill: 0xFF00CC,
  });
  this.ui.addChild(play);
  play.anchor.x = 0.5;
  play.anchor.y = 1;
  play.x = constants.SCREEN_WIDTH / 2.0;
  play.y = constants.SCREEN_HEIGHT - 200;
}

extend(BaseScene, MainMenuScene, {
  update: function update(delta) {
    if (keyboard.isKeyPressed(keyboard.RETURN)) {
      game.setScene(new MainGame);
    }
  }
});

module.exports = MainMenuScene;