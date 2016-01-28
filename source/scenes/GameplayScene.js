var pixi = require('pixi.js');
var extend = require('../extend');
var BaseScene = require('./BaseScene');
var objects = require('../objects');
var keyboard = require("../keyboard");
var howler = require("howler");
var assets = require('../assets');
var constants = require('../constants');
var collision = require('../physics/collision');
var StageClearScene = require('./StageClearScene');
var game = require('../game');
var debug = require('../debug');
var levels = require('../levels');
var TileGrid = require('../physics/TileGrid');
var TILE = constants.TILE_SIZE;

function GameplayScene(level) {
  if (!level) debug.error("No level data!");
  var self = this;
  BaseScene.call(self);
  // member variables
  self.level = level;
  self.backgroundColor = 0x0;
  self.nextLevel = levels[self.level.next];
  self.player = null;
  self.enemySpawns = [];
  self.enemies = [];
  self.tileGrid = null;
  self.exitRect = null;
  self.exit = null;
  self.hearts = [];
  self.paused = false;
  self.died = false;
  self.helpText = new pixi.Text('', {
    font: '24px monospace',
    wordWrap: true,
    wordWrapWidth: 400,
    align: 'center',
    fill: 0x00DD00,
    // stroke: 0x000000,
    // strokeThickness: 4,
  });
  self.helpText.anchor = new pixi.Point(0.5, 0.5);
  self.helpText.position = game.display.center;
  self.helpBg = new pixi.Graphics();
  self.helpBg.alpha = 0.5;
  self.ui.addChild(self.helpBg);
  self.ui.addChild(self.helpText);
  self.consoles = [];
  self.fanCurrents = []; // TODO refactor into base class/interface
  self.restarted = false;
  self.deathY = 0; // to be adjusted later

  // TODO bg layers
  this.star1 = assets.texture('starfield_1');
  this.star2 = assets.texture('starfield_2');
  this.starClip = new pixi.extras.MovieClip([this.star1, this.star2]);
  this.starClip.animationSpeed = 1/45;
  this.starClip.play();
  this.bgSprite = new pixi.extras.TilingSprite(this.star1, 0, 0);
  this.background.addChild(this.bgSprite);
  this.bgHull = new pixi.extras.TilingSprite(assets.texture('hull'), 0, 0);
  this.background.addChild(this.bgHull);
  this.bgCols = new pixi.extras.TilingSprite(assets.texture('shipcolumn'), 0, 0);
  this.background.addChild(this.bgCols);
  this.tilingSprites = [this.bgSprite, this.bgHull, this.bgCols];
  this.bgSprite.tint = 0x666688;
  this.bgHull.tint = 0x555555;
  this.bgCols.tint = 0x777777;

  // Load level data
  // Get tile dimensions
  var tilesDown = level.data.length;
  var tilesAcross = Math.max.apply(Math, level.data.map(function(row) {
    return row.length;
  }));
  self.deathY = (tilesDown + 10) * TILE;
  // Initalize tile grid
  self.tileGrid = new TileGrid(tilesAcross, tilesDown, false);
  window.grid = self.tileGrid;
  // Set up map
  level.data.forEach(function(row, iRow) {
    var y = iRow * TILE;
    for (var iCol = 0; iCol < row.length; iCol++) {
      var x = iCol * TILE;
      var cx = x + TILE/2;
      var cy = y + TILE/2;
      var char = row.charAt(iCol);
      // TODO refactor tile processing into another method
      if (char == ' ') {
        // do nothing
      } else if (char == '@') { // Player
        // TODO multiple player error
        if (self.player) debug.error("Duplicate player!");
        self.player = new objects.Player(0, 0);
        self.player.setCenter(cx, cy);
      } else if (char == '#') { // Enemy
        self.enemySpawns.push(new pixi.Point(cx, cy));
      } else if (char == '^') { // Fan current
        var FanCurrent = require('../objects/FanCurrent');
        var fc = new FanCurrent(new pixi.Rectangle(x, y, TILE, TILE));
        self.fanCurrents.push(fc);
        self.world.addChild(fc.sprite);
      } else if (char == '!') { // Exit
        self.exit = assets.sprite("spill");
        self.exit.x = x;
        self.exit.y = y;
        self.exitRect = new pixi.Rectangle(
          self.exit.x,
          self.exit.y,
          self.exit.width,
          self.exit.height);
      } else {
        var object = level.objects[char];
        if (object) {
          var data = object.split('|');
          var type = data[0];
          var contents = data[1];
          if (type == 'Console') {
            var Console = require('../objects/Console');
            var bounds = new pixi.Rectangle(x, y, TILE, TILE);
            var c = new Console(bounds, contents);
            self.consoles.push(c);
            self.world.addChild(c.sprite);
          }
        } else {
          var tile = assets.sprite("tile_1"); // TODO randomize? different?
          // self.platforms.push(new pixi.Rectangle(x, y, TILE, TILE));
          self.tileGrid.set(iCol, iRow, true);
          self.world.addChild(tile);
          tile.x = x;
          tile.y = y;
          tile.width = TILE;
          tile.height = TILE;
        }
      }
    }
  });

  self.enemySpawns.forEach(function(center) {
    var enemy = new objects.Alien(0, 0, self.player);
    enemy.setCenter(center.x, center.y);
    self.enemies.push(enemy);
    self.world.addChild(enemy.container);
  });

  if (!self.player) debug.error("No player object!");
  self.world.addChild(self.player.container);

  if (!self.exit) debug.error("No level exit!");
  self.world.addChild(self.exit);

  self.debugGfx = new pixi.Graphics();
  self.world.addChild(self.debugGfx);

  for (var i = 0; i < constants.PLAYER_MAX_HEALTH; i++) {
    var heart = assets.sprite('heart');
    heart.x = 15 + i * heart.width;
    heart.y = 15;
    self.hearts.push(heart);
    self.ui.addChild(heart);
  }


  // Death Overlay
  self.deathOverlay = new pixi.Container();
  self.deathGraphics = new pixi.Graphics();
  self.deathText = new pixi.Text('YOU DIED.', {
    font: '20px monospace',
    fill: 0xFF00CC,
  });
  self.deathText.anchor = new pixi.Point(0.5, -1);
  self.deathText.position = game.display.topCenter;
  self.deathRestartText = new pixi.Text('[RETURN] TO RESTART, [Q] TO QUIT', {
    font: '20px monospace',
    fill: 0xFF00FF,
  });
  self.deathRestartText.anchor = new pixi.Point(0.5, 0.5);
  self.deathRestartText.position = game.display.center;
  self.deathOverlay.addChild(self.deathText);
  self.deathOverlay.addChild(self.deathRestartText);
  self.deathOverlay.addChild(self.deathGraphics);  

  // Pause Overlay
  self.pausedOverlay = new pixi.Container();
  self.pauseGraphics = new pixi.Graphics();
  self.pauseText = assets.sprite('pause');
  self.pauseText.anchor = new pixi.Point(-0.5, 0.5);
  self.pauseText.position = game.display.topCenter;
  self.restartText = new pixi.Text('[ESC] TO CONTINUE, [Q] TO QUIT, [RETURN] TO RESTART', {
    font: '20px monospace',
    fill: 0xFFFFFF,
    wordWrap: true,
    wordWrapWidth: 400,
    align: 'center',
  });
  self.restartText.anchor = new pixi.Point(0.5, 0.5);
  self.restartText.position = game.display.center;
  self.pausedOverlay.addChild(self.pauseText);
  self.pausedOverlay.addChild(self.restartText);
  self.pausedOverlay.addChild(self.pauseGraphics);  
}

extend(BaseScene, GameplayScene, {
  initialize: function initialize() {
    assets.playMusic('gameplaySong');
  },
  dispose: function dispose() {
    if (!this.restarted) {
      assets.stopMusic();
    }
  },
  resize: function resize(w, h) {
    this.deathGraphics.clear();
    this.deathGraphics.beginFill(0x000000, 0.5);
    this.deathGraphics.drawRect(0,0,w,h);
    this.deathGraphics.endFill();
    this.pauseGraphics.clear();
    this.pauseGraphics.beginFill(0x000000, 0.5);
    this.pauseGraphics.drawRect(0,0,w,h);
    this.pauseGraphics.endFill();
    this.tilingSprites.forEach(function(ts) {
      ts.width = w;
      ts.height = h;
    });
  },
  update: function update(delta) {

    this.bgSprite.texture = this.starClip.texture;

    var MainMenuScene = require('./MainMenuScene');
    if(this.died) {
      if (keyboard.isKeyPressed(keyboard.RETURN)) {
        this.restarted = true;
        return new GameplayScene(this.level);
      }
      if (keyboard.isKeyPressed(keyboard.Q)) {
        return new MainMenuScene(this.level);
      }      
      return;
    };

    if(this.paused) {
      if (keyboard.isKeyPressed(keyboard.RETURN)) {
        this.restarted = true;
        return new GameplayScene(this.level);
      } else if (keyboard.isKeyPressed(keyboard.Q)) {
        var MainMenuScene = require('./MainMenuScene');
        return new MainMenuScene();
      }
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

    if (this.paused) return;

    if (this.player.grounded && collision.getRectangleOverlap(
        this.player.getBounds(),
        this.exitRect)) {
      var nextScene = null;
      if (this.nextLevel) {
        this.restarted = true;
        nextScene = new GameplayScene(this.nextLevel);
      } else {
        nextScene = new StageClearScene(); // TODO this has a next level property
      }
      return nextScene;
    }

    var self = this;

    // Update Player
    self.player.update(delta, self);

    // update consoles
    self.consoles.forEach(function(console) {
      console.check(self.player.getBounds(), self.helpText, self.helpBg);
    })

    // update fan currents
    self.fanCurrents.forEach(function(fc) {
      fc.update(delta, self.player);
    });


    // update aliens
    self.enemies.forEach(function(enemy) {
      enemy.update(delta, self);
    });

    //update health
    while (self.hearts.length > self.player.hitPoints && self.hearts.length > 0) {
      var last = self.hearts.pop();
      last.texture = assets.texture('empty_heart');
    }

    // Have screen follow the player
    this.world.x = -this.player.getCenterX() + game.display.width / 2;
    this.world.y = -this.player.getCenterY() + game.display.height / 2;
    this.bgHull.tilePosition.x = this.world.x*1/5;
    this.bgHull.tilePosition.y = this.world.y*1/5;
    this.bgCols.tilePosition.x = this.world.x*1/3;
    this.bgCols.tilePosition.y = this.world.y*1/3;

    // reset on fall
    // TODO calculate based on level size!!!
    if (!this.died && this.player.getPosition().y > this.deathY || this.player.hitPoints == 0) {
      this.died = true;
      this.ui.addChild(this.deathOverlay);
    }
  }
});

module.exports = GameplayScene;
