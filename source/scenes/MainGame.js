var pixi = require('pixi.js');
var colors = require('../colors');
var objects = require("../objects");
var keyboard = require("../keyboard");
var howler = require('howler');

var testSceneMusic = new howler.Howl({
  urls: ['../audio/asteroids-revised.mp3.mp3'],
  loop: true
});

function MainGame() {
  this.stage = new pixi.Container();

  this.player = new objects.Player(300, 300, new pixi.Sprite.fromImage('/graphics/space_guy.png'));
  this.aliens = new Array();
  this.aliens.push(new objects.Alien(500, 300, new pixi.Sprite.fromImage('/graphics/alien.png'), this.player));

  this.stage.addChild(this.player.sprite);

  for(var i = 0; i < this.aliens.length; i++) {
    this.stage.addChild(this.aliens[i].sprite);
  }

  this.update = function update(delta) {
    this.checkKeyboardEvents();
    this.player.update(delta);
    
    for(var i = 0; i < this.aliens.length; i++) {
      this.aliens[i].update(delta);
    }

    this.applyGravity(delta);
  };

  this.getStage = function getStage() {
    return this.stage;
  };
  
  this.backgroundMusic = testSceneMusic;
};

MainGame.prototype = {
  checkKeyboardEvents: function checkKeyboardEvents() {
    if (keyboard.isKeyDown(keyboard.W) && !this.player.isJumping) {
      this.player.isJumping = true;
      this.player.velocity.y = -100;
      this.player.sounds.play('jumping');
    }

    if (keyboard.isKeyDown(keyboard.A)) {
      //Moving left, increase left velocity up to max
      if(this.player.velocity.x >= -this.player.MAX_VELOCITY){
        this.player.velocity.x += -this.player.momentum;
      }
    }
    else if (keyboard.isKeyDown(keyboard.D)) {
      //Moving right, increase right velocity up to max
      if(this.player.velocity.x <= this.player.MAX_VELOCITY){
        this.player.velocity.x += this.player.momentum;
      }
    }
    else
    {
      //Not moving, velocity moves closer to 0 until stop
      if(this.player.velocity.x > 0) {
        this.player.velocity.x += -this.player.momentum
      }
      else if (this.player.velocity.x < 0){
        this.player.velocity.x += this.player.momentum
      }
      else{
        //do nothing
      }
    }

    if (keyboard.isKeyDown(keyboard.S)) {
      // Down
    }

    if (this.player.velocity.y == 0 && this.player.isJumping) {
      this.player.isJumping = false;
    }

  },
  applyGravity: function applyGravity(delta) {
    this.player.velocity.y += 100 * delta;   

    // TODO: REMOVE THIS
    if (this.player.sprite.y > 300) {
      this.player.velocity.y = 0;
    }
    // END TODO
  }
}

module.exports = MainGame;

