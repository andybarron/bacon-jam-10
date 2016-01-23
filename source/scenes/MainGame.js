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
  var self = this; // ugh
  this.stage = new pixi.Container();

  //this.player = new objects.Player(300, 300, new pixi.Sprite.fromImage('/graphics/space_guy.png'));
  this.player = new objects.Player(300, 300, new pixi.Sprite(pixi.loader.resources.avatar.texture));
  this.aliens = new Array();
  this.aliens.push(new objects.Alien(500, 300, new pixi.Sprite(pixi.loader.resources.alien.texture), this.player));
  this.aliens.push(new objects.Alien(100, 300, new pixi.Sprite(pixi.loader.resources.alien.texture), this.player));

  this.platforms = [
    new pixi.Rectangle(200, 400, 300, 100),
    new pixi.Rectangle(600, 350, 100, 100),
    new pixi.Rectangle(0, 550, 800, 100),
  ];
  this.platformGraphics = new pixi.Graphics();
  this.platforms.forEach(function(platform) {
    var g = self.platformGraphics;
    g.beginFill(0x0077BB);
    g.drawShape(platform);
    g.endFill();
  });
  this.stage.addChild(this.platformGraphics);

  this.stage.addChild(this.player.sprite);

  for(var i = 0; i < this.aliens.length; i++) {
    this.stage.addChild(this.aliens[i].sprite);
  }

  this.graphics = new pixi.Graphics();
  this.stage.addChild(this.graphics);

  this.update = function update(delta) {
    this.applyGravity(delta);
    this.player.grounded = false;
    this.player.update(delta);
    this.checkTileCollision(this.player);
    this.checkKeyboardEvents(delta);
    
    for(var i = 0; i < this.aliens.length; i++) {
      this.aliens[i].update(delta);
    }
    
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

  };

  this.getStage = function getStage() {
    return this.stage;
  };
  
  this.backgroundMusic = testSceneMusic;
};

MainGame.prototype = {
  checkKeyboardEvents: function checkKeyboardEvents(delta) {
    if (keyboard.isKeyDown(keyboard.W) && this.player.grounded) {
      this.player.grounded = false;
      this.player.velocity.y = -constants.PLAYER_JUMP_SPEED;
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

  },
  applyGravity: function applyGravity(delta) {
    this.player.velocity.y += constants.GRAVITY * delta;
  },
  checkTileCollision: function checkTileCollision(character) {
    var player = this.player;
    this.platforms.forEach(function(platform) {
      collision.resolveTileCollision(player, platform);
    });
  }
}

module.exports = MainGame;

