var pixi = require('pixi.js');
var colors = require('../colors');
var objects = require("../objects");
var keyboard = require("../keyboard");
var howler = require('howler');
var collision = require('../physics/collision');
var debug = require('../debug');
var constants = require('../constants');

var testSceneMusic = new howler.Howl({
  urls: ['../audio/asteroids-revised.mp3.mp3'],
  loop: true
});

function MainGame() {
  this.stage = new pixi.Container();

  //this.player = new objects.Player(300, 300, new pixi.Sprite.fromImage('/graphics/space_guy.png'));
  this.player = new objects.Player(300, 300, new pixi.Sprite(pixi.loader.resources.avatar.texture));
  this.aliens = new Array();
  this.aliens.push(new objects.Alien(500, 300, new pixi.Sprite(pixi.loader.resources.alien.texture), this.player));
  this.aliens.push(new objects.Alien(100, 300, new pixi.Sprite(pixi.loader.resources.alien.texture), this.player));

  this.stage.addChild(this.player.sprite);

  for(var i = 0; i < this.aliens.length; i++) {
    this.stage.addChild(this.aliens[i].sprite);
  }

  this.graphics = new pixi.Graphics();
  this.stage.addChild(this.graphics);

  this.update = function update(delta) {
    this.checkKeyboardEvents(delta);
    this.player.update(delta);
    
    for(var i = 0; i < this.aliens.length; i++) {
      this.aliens[i].update(delta);
    }
    
    var self = this;
    this.graphics.clear();
    this.aliens.forEach(function(alien) {
      var overlap = collision.getSpriteOverlap(
        self.player.sprite,
        alien.sprite
      );
      if (overlap) {
        self.graphics.beginFill(0xFF00FF, 0.5);
        self.graphics.drawShape(overlap);
        self.graphics.endFill();
      }
    });

    this.applyGravity(delta);
  };

  this.getStage = function getStage() {
    return this.stage;
  };
  
  this.backgroundMusic = testSceneMusic;
};

MainGame.prototype = {
  checkKeyboardEvents: function checkKeyboardEvents(delta) {
    if (keyboard.isKeyDown(keyboard.W) && !this.player.isJumping) {
      this.player.isJumping = true;
      this.player.velocity.y = -100;
      this.player.sounds.play('jumping');
    }

    if (keyboard.isKeyDown(keyboard.A)) {
      //Moving left, increase left velocity up to max
      if(this.player.velocity.x >= -constants.PLAYER_MAX_SPEED){
        this.player.velocity.x += -constants.PLAYER_ACCELERATION * delta;
      }
    }
    else if (keyboard.isKeyDown(keyboard.D)) {
      //Moving right, increase right velocity up to max
      if(this.player.velocity.x <= constants.PLAYER_MAX_SPEED){
        this.player.velocity.x += constants.PLAYER_ACCELERATION * delta;
      }
    }
    else
    {
      //Not moving, velocity moves closer to 0 until stop
      if(this.player.velocity.x > 0) {
        this.player.velocity.x += -constants.PLAYER_ACCELERATION * delta;
      }
      else if (this.player.velocity.x < 0){
        this.player.velocity.x += constants.PLAYER_ACCELERATION * delta;
      }
      if (Math.abs(this.player.velocity.x) < constants.PLAYER_ACCELERATION * delta) {
        this.player.velocity.x = 0; // IMPORTANT! prevents flipping back and forth at rest
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

