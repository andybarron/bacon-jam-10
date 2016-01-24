var pixi = require('pixi.js');
var extend = require('../extend');
var BaseScene = require('./BaseScene');
var objects = require('../objects');
var keyboard = require("../keyboard");
var howler = require("howler");
var assets = require('../assets');
var constants = require('../constants');
var maps = require('../maps');
var collision = require('../physics/collision');
var StageClearScene = require('./StageClearScene');
var game = require('../game');

function MainGame() {
  BaseScene.call(this);
  var self = this;
  this.init = false;
  this.objects = [];
  this.aliens = [];
  this.health = [];

  this.physGfx = new pixi.Graphics();
  this.world.addChild(this.physGfx);

  // Create player
  this.player = new objects.Player(0, 0);
  this.player.setPosition(200, 100);
  this.objects.push(this.player);
  this.world.addChild(this.player.container);

  //Create Hearts
  for(var i = 0; i < constants.PLAYER_MAX_HEALTH; i++){
    var heart_x = 0;
    var heart_y = 0;

    this.health.push(new objects.Heart(heart_x, heart_y));
  }

  this.health.forEach(function(heart){
    self.ui.addChild(heart.container);
  });

  // Create aliens
  this.aliens.push(new objects.Alien(500, 100, this.player));
  this.aliens.push(new objects.Alien(0, 100, this.player));

  this.aliens.forEach(function(alien) {
    self.world.addChild(alien.container);
  });

  // Pause attributes
  this.paused = false;
  this.died = false;

  // Death Overlay
  this.deathOverlay = new pixi.Container();
  this.deathGraphics = new pixi.Graphics();
  this.deathText = new pixi.Text('YOU DIED.', {
    font: '20px monospace',
    fill: 0xFF00CC,
  });
  this.deathText.anchor = new pixi.Point(0.5, 0.5);
  this.deathText.x = 400;
  this.deathText.y = 150;
  this.deathGraphics.beginFill(0x000000, 0.5);
  this.deathGraphics.drawRect(0,0,800,600);
  this.deathGraphics.endFill();
    this.deathRestartText = new pixi.Text('PRESS [RETURN] TO RESTART', {
    font: '20px monospace',
    fill: 0x00FFCC,
  });
  this.deathRestartText.anchor = new pixi.Point(0.5, 0.5);
  this.deathRestartText.x = 400;
  this.deathRestartText.y = 450;
  this.deathOverlay.addChild(this.deathText);
  this.deathOverlay.addChild(this.deathRestartText);
  this.deathOverlay.addChild(this.deathGraphics);  

  // Pause Overlay
  this.pausedOverlay = new pixi.Container();
  this.pauseGraphics = new pixi.Graphics();
  this.pauseText = assets.sprite('pause');
  this.pauseText.anchor = new pixi.Point(0.5, 0.5);
  this.pauseText.x = 400;
  this.pauseText.y = 150;
  this.pauseGraphics.beginFill(0x000000, 0.5);
  this.pauseGraphics.drawRect(0,0,800,600);
  this.pauseGraphics.endFill();
  this.restartText = new pixi.Text('PRESS [RETURN] TO RESTART', {
    font: '20px monospace',
    fill: 0x00FFCC,
  });
  this.restartText.anchor = new pixi.Point(0.5, 0.5);
  this.restartText.x = 400;
  this.restartText.y = 450;
  this.pausedOverlay.addChild(this.pauseText);
  this.pausedOverlay.addChild(this.restartText);
  this.pausedOverlay.addChild(this.pauseGraphics);  

  console.log(assets.music);
  // Background Music
  this.backgroundMusic = assets.music.backgroundMusic;

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
      var s = null;
      if (map1[i][k] == 1) {
        s = assets.sprite("tile_1");
      } 
      else if (map1[i][k] == 2) {
        s = assets.sprite("tile_2");
      }
      else if (map1[i][k] == 3) {
        this.spill = assets.sprite("spill");
        this.spill.x = k*tileWidth;
        this.spill.y = i*tileHeight;
        this.world.addChild(this.spill);
        this.spillRect = new pixi.Rectangle(
          this.spill.x,
          this.spill.y,
          this.spill.width,
          this.spill.height);
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

  if (!this.init) {
    this.init = true;
    this.backgroundMusic.play();
  }

  if(this.died) {
    if (keyboard.isKeyPressed(keyboard.RETURN)) {
      this.backgroundMusic.stop();
      game.setScene(new MainGame());
    }

    return;
  };

  if (keyboard.isKeyPressed(keyboard.ESC)) {
    this.paused = !this.paused;

    if (this.paused) {
      this.ui.addChild(this.pausedOverlay);
    }
    else {
      this.ui.removeChild(this.pausedOverlay);
    }
  }

  if(this.paused) {
    if (keyboard.isKeyPressed(keyboard.RETURN)) {
      this.backgroundMusic.stop();
      game.setScene(new MainGame());
    }

    return;
  };

  if (collision.getRectangleOverlap(
      this.player.getBounds(),
      this.spillRect)) {
    this.backgroundMusic.stop();
    game.setScene(new StageClearScene());
  }

  var self = this;

  self.physGfx.clear();

  // Update Player
  self.player.update(delta, self);
  // self.physGfx.beginFill(0x00FFFF);
  // self.physGfx.drawShape(self.player.getBounds());
  // self.physGfx.endFill();

  // update aliens
  self.aliens.forEach(function(object) {
    object.update(delta, self);
    // self.physGfx.beginFill(0x00FFFF);
    // self.physGfx.drawShape(object.getBounds());
    // self.physGfx.endFill();
  });

  //update health
  for(var i = 0; i < this.health.length; i++){
    self.health[i].update(delta, self, i);
  }

  // Have screen follow the player
  this.world.x = -this.player.getPosition().x + constants.SCREEN_WIDTH / 2;
  this.world.y = -this.player.getPosition().y + constants.SCREEN_HEIGHT / 2;

  // reset on fall
  if (this.player.getPosition().y > constants.SCREEN_HEIGHT || this.player.hitPoints == 0) {
    this.died = true;
    this.ui.addChild(this.deathOverlay);
  }
};

module.exports = MainGame;
