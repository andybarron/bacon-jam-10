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
    this.checkKeyboardEvents();
    this.player.update(delta);
    this.applyGravity(delta);
  };

  this.getStage = function getStage() {
    return this.stage;
  };
  
  this.backgroundMusic = testSceneMusic;
};

TestScreen.prototype = {
  checkKeyboardEvents: function checkKeyboardEvents() {
    if (keyboard.isKeyDown(keyboard.W) && !this.player.isJumping) {
      this.player.isJumping = true;
      this.player.velocity.y = -100;
    }

    if (keyboard.isKeyDown(keyboard.A)) {
      this.player.velocity.x = -this.player.speed;
    }
    else if (keyboard.isKeyDown(keyboard.D)) {
      this.player.velocity.x = this.player.speed;
    }
    else
    {
       this.player.velocity.x = 0;
    }

    if (keyboard.isKeyDown(keyboard.S)) {
      // Down
    }

    // TODO: REMOVE THIS
    if (this.player.velocity.y == 0 && this.player.isJumping) {
      this.player.isJumping = false;
    }

  },
  applyGravity: function applyGravity(delta) {
    this.player.velocity.y += 100 * delta;   

    if (this.player.sprite.y > 300) {
      this.player.velocity.y = 0;
    }
  }
}

module.exports = TestScreen;

