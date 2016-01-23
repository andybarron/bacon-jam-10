var pixi = require('pixi.js');
var colors = require('../colors');
var objects = require("../objects");
var keyboard = require("../keyboard");
var howler = require('howler');

var testSceneMusic = new howler.Howl({
  urls: ['../audio/asteroids-revised.mp3.mp3']
});

function TestScreen() {
  this.stage = new pixi.Container();

  this.player = new objects.Player(new pixi.Sprite.fromImage('/graphics/space_guy.png'));

  this.player.sprite.x = 300;
  this.player.sprite.y = 300;

  this.stage.addChild(this.player.sprite);

  this.update = function update(delta) {
    this.movePlayer(delta);
  };

  this.getStage = function getStage() {
    return this.stage;
  };
  
  this.backgroundMusic = testSceneMusic;
};

TestScreen.prototype = {
  movePlayer: function movePlayer(delta) {
    if (keyboard.isKeyDown(keyboard.W)) {
      this.player.move(0, -this.player.speed * delta);
    }

    if (keyboard.isKeyDown(keyboard.A)) {
      this.player.move(-this.player.speed * delta, 0);
    }

    if (keyboard.isKeyDown(keyboard.S)) {
      this.player.move(0, this.player.speed * delta);
    }

    if (keyboard.isKeyDown(keyboard.D)) {
      this.player.move(this.player.speed * delta, 0);
    }
  }
}

module.exports = TestScreen;

