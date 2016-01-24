var pixi = require('pixi.js');
var extend = require('../extend');
var BaseScene = require('./BaseScene');
var objects = require('../objects');
var keyboard = require("../keyboard");
var howler = require("howler");
var assets = require('../assets');
var constants = require('../constants');
var maps = require('../maps');

var testSceneMusic = new howler.Howl({
  urls: ['/audio/asteroids-revised.mp3.mp3'],
  loop: true,
  volume: 0.2,
});

function MainGame() {
  BaseScene.call(this);
  var self = this;
  this.objects = [];
  this.aliens = [];
  this.health = [];

  this.physGfx = new pixi.Graphics();
  this.world.addChild(this.physGfx);

  // Create player
  this.player = new objects.Player(0, 0);
  this.player.setPosition(100, 100);
  this.objects.push(this.player);
  this.world.addChild(this.player.container);

  //Create Hearts
  for(var i = 0; i < constants.PLAYER_MAX_HEALTH; i++){
    var heart_x = (this.player.getPosition().x - 260) + (40 * i);
    var heart_y = this.player.getPosition().y - 200;

    this.health.push(new objects.Heart(heart_x, heart_y));
  }

  this.health.forEach(function(heart){
    self.world.addChild(heart.container);
  });

  // Create aliens
  this.aliens.push(new objects.Alien(500, 100, this.player));
  this.aliens.push(new objects.Alien(100, 100, this.player));

  this.aliens.forEach(function(alien) {
    self.world.addChild(alien.container);
  });

  // Pause attributes
  this.paused = false;

  // Pause Overlay
  this.pausedOverlay = new pixi.Container();
  this.pauseGraphics = new pixi.Graphics();
  this.pauseText = assets.sprite('pause');
  this.pauseText.anchor = new pixi.Point(0.5, 0.5);
  this.pauseText.x = 400;
  this.pauseText.y = 300;
  this.pauseGraphics.beginFill(0x000000, 0.5);
  this.pauseGraphics.drawRect(0,0,800,600);
  this.pauseGraphics.endFill();
  this.pausedOverlay.addChild(this.pauseText);
  this.pausedOverlay.addChild(this.pauseGraphics);  

  // Background Music
  this.backgroundMusic = testSceneMusic;

  // Setup World
  this.tileGfx = new pixi.Graphics();
  this.world.addChild(this.tileGfx);

  // Platforms
  var map1 = maps.room1;

  this.platforms = [];

  var tileWidth = 50;
  var tileHeight = 50;

  for (var i = 0; i < map1.length; i++) {
    for (var k = 0; k < map1[i].length; k++) {
      var s;
      if (map1[i][k] == 1) {
        s = assets.sprite("tile_1");
      } 
      else if (map1[i][k] == 2) {
        s = assets.sprite("tile_2");
      }
      if (s != null) {
        s.x = k*tileWidth;
        s.y = i*tileHeight;
        this.platforms.push(s);
      }
    }
  }



  this.platforms.forEach(function(platform) {
    self.world.addChild(platform);
  });
}

extend(BaseScene, MainGame);

MainGame.prototype.update = function update(delta) {
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

  var self = this;

  // Have screen follow the player
  this.world.x = -this.player.getPosition().x + constants.SCREEN_WIDTH / 2;
  this.world.y = -this.player.getPosition().y + constants.SCREEN_HEIGHT / 2;

  self.physGfx.clear();

  // Update Player
  self.player.update(delta, self);
  self.physGfx.beginFill(0x00FFFF);
  self.physGfx.drawShape(self.player.getBounds());
  self.physGfx.endFill();

  // update aliens
  self.aliens.forEach(function(object) {
    object.update(delta, self);
    self.physGfx.beginFill(0x00FFFF);
    self.physGfx.drawShape(object.getBounds());
    self.physGfx.endFill();
  });

  //update health
  for(var i = 0; i < this.health.length; i++){
    self.health[i].update(delta, self, i);
    self.physGfx.beginFill(0x00FFFF);
    self.physGfx.drawShape(self.player.getBounds());
    self.physGfx.endFill();
  }
};

module.exports = MainGame;


// function MainGame() {


//   // UPDATE METHOD FOR GAME
//   this.update = function update(delta) {
//     // CHECK FOR KEYBOARD EVENTS
//     this.checkKeyboardEvents(delta);

//     if (this.paused) return;
    
    
//     // DEBUG ALIEN COLLISION
//     this.aliens.forEach(function(alien) {
//       console.log(alien);
//       var overlap = collision.getSpriteOverlap(
//         self.player.sprite,
//         alien.sprite
//       );
//       if (overlap) {
//         self.graphics.beginFill(0xFF00FF, 0.5);
//         self.graphics.drawShape(overlap);
//         self.graphics.endFill();

//         if(self.player.recentHit == false){
//           self.player.recentHit = true;
//           self.player.hitPoints -= 1;
//           self.player.sounds['ouch'].play();
//           console.log("hp: " + self.player.hitPoints);

//           if(overlap.x > self.player.sprite.x){
//             self.player.velocity.x = -500;
//           }
//           else{
//             self.player.velocity.x = 500;
//           }
//         }
//       }
//     });
//   };
