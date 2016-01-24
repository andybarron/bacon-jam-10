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
  this.container = new pixi.Container();
  this.ui = new pixi.Container();
  this.stage = new pixi.Container();
  this.container.addChild(this.stage);
  this.container.addChild(this.ui);
  this.paused = false;

  // PLAYER SETUP
  this.player = new objects.Player(300, 300);
  this.stage.addChild(this.player.sprite);

  // ALIEN SETUP
  this.aliens = new Array();
  this.aliens.push(new objects.Alien(500, 300, new pixi.Sprite(pixi.loader.resources.alien.texture), this.player));
  this.aliens.push(new objects.Alien(100, 300, new pixi.Sprite(pixi.loader.resources.alien.texture), this.player));

  for(var i = 0; i < this.aliens.length; i++) {
    this.stage.addChild(this.aliens[i].sprite);
  }

  // PLATFORM SETUP
  this.platforms = [
    new pixi.Rectangle(200, 400, 300, 100),
    new pixi.Rectangle(600, 350, 100, 100),
    new pixi.Rectangle(0, 550, 800, 100),
  ];
  this.platformGraphicsContainer = new pixi.Container();
  this.platforms.forEach(function(platform) {
    var g = new pixi.Graphics();
    g.boundsPadding = 0; // Important!
    g.beginFill(0x0077BB);
    g.drawShape(platform);
    g.endFill();
    self.platformGraphicsContainer.addChild(g);
  });
  this.stage.addChild(this.platformGraphicsContainer);
  
  // PAUSE OVERLAY
  this.pausedOverlay = new pixi.Container();
  this.pauseGraphics = new pixi.Graphics();
  this.pauseText = new pixi.Sprite(pixi.loader.resources.pause.texture);
  this.pauseText.anchor = new pixi.Point(0.5, 0.5);
  this.pauseText.x = 400;
  this.pauseText.y = 300;
  this.pauseGraphics.beginFill(0x000000, 0.5);
  this.pauseGraphics.drawRect(0,0,800,600);
  this.pauseGraphics.endFill();
  this.pausedOverlay.addChild(this.pauseText);
  this.pausedOverlay.addChild(this.pauseGraphics);  

  // GRAPHICS FOR DEBUG
  this.graphics = new pixi.Graphics();
  this.stage.addChild(this.graphics);

  // BACKGROUND MUSIC
  this.backgroundMusic = testSceneMusic;

  // UPDATE METHOD FOR GAME
  this.update = function update(delta) {
    // CHECK FOR KEYBOARD EVENTS
    this.checkKeyboardEvents(delta);

    if (this.paused) return;
    
    // GRAVITY
    this.applyGravity(delta);
    // PLAYER UPDATE
    this.player.grounded = false;
    this.player.update(delta, this.stage);
    this.checkTileCollision(this.player);

    // ALIEN UPDATE
    for(var i = 0; i < this.aliens.length; i++) {
      this.aliens[i].update(delta);
    }
    
    this.graphics.clear();

    console.log(this.aliens.length);
    // DEBUG ALIEN COLLISION
    this.aliens.forEach(function(alien) {
      console.log(alien);
      var overlap = collision.getSpriteOverlap(
        self.player.sprite,
        alien.sprite
      );
      if (overlap) {
        self.graphics.beginFill(0xFF00FF, 0.5);
        self.graphics.drawShape(overlap);
        self.graphics.endFill();

        if(self.player.recentHit == false){
          self.player.recentHit = true;
          self.player.hitPoints -= 1;
          self.player.sounds['ouch'].play();
          console.log("hp: " + self.player.hitPoints);

          if(overlap.x > self.player.sprite.x){
            self.player.velocity.x = -500;
          }
          else{
            self.player.velocity.x = 500;
          }
        }
      }
    });
    this.stage.x = 400 - this.player.sprite.x; // TODO hardcoded size
    this.stage.y = 300 - this.player.sprite.y; // TODO hardcoded size
  };

  // STAGE SETUP
  this.getStage = function getStage() {
    return this.container;
  };
};

MainGame.prototype = {

  checkKeyboardEvents: function checkKeyboardEvents(delta) {

    if (keyboard.isKeyPressed(keyboard.ESC)) {
      this.paused = !this.paused;

      if (this.paused) {
        this.ui.addChild(this.pausedOverlay);
      }
      else {
        this.ui.removeChild(this.pausedOverlay);
      }
    }

    if(this.paused) return;

    if (keyboard.isKeyDown(keyboard.W) && this.player.grounded) {
      this.player.grounded = false;
      this.player.velocity.y = -constants.PLAYER_JUMP_SPEED;
      this.player.sounds['jump'].play();
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

    if (keyboard.isKeyDown(keyboard.S) && this.player.grounded) {
      // Down
      if( !this.player.isHiding ){
        this.player.isHiding = true;
        this.player.sounds['hide'].play();
      }
    } else {
      this.player.isHiding = false;
    }

    if (keyboard.isKeyPressed(keyboard.E)) {
      this.stage.addChild(this.player.animations.attackClip);
      this.player.animations.attackClip.gotoAndPlay(0);

      // check aliens
      for (var i = 0; i < this.aliens.length; i++) {
        var enemy = this.aliens[i];

        // facing right
        if (this.player.sprite.scale.x > 0) {
          var diff = enemy.sprite.x - this.player.sprite.x;
          console.log(enemy + " " + diff);

          if (diff > 0 && diff < 30) {
            console.log("hit");
            this.stage.removeChild(enemy.sprite);
            this.aliens.splice(this.aliens.indexOf(enemy), 1);
          }  
        }
        // facing left
        else if (this.player.sprite.scale.x < 0) {
          var diff = this.player.sprite.x - enemy.sprite.x;
          console.log(enemy + " " + diff);

          if (diff > 0 && diff < 30) {
            console.log("hit");
            this.stage.removeChild(enemy.sprite);
            this.aliens.splice(this.aliens.indexOf(enemy), 1);
          }  
        }
        
      }
    }

  },
  applyGravity: function applyGravity(delta) {
    this.player.velocity.y += constants.GRAVITY * delta;
  },
  checkTileCollision: function checkTileCollision(character) {
    var player = this.player;
    this.platformGraphicsContainer.children.forEach(function(gfx) {
      collision.resolveTileCollision(player, gfx.getBounds());
    });
  }
}

module.exports = MainGame;

