import * as debug from '../debug';
import FanCurrent from '../objects/FanCurrent';

let pixi = require('pixi.js');
let BaseScene = require('./BaseScene');
let objects = require('../objects');
let keyboard = require("../keyboard");
let howler = require("howler");
let assets = require('../assets');
import * as constants from '../constants';
let collision = require('../physics/collision');
let StageClearScene = require('./StageClearScene');
let game = require('../game');
let levels = require('../levels');
let TileGrid = require('../physics/TileGrid');
let TILE = constants.TILE_SIZE;

let HELP_TEXT_PADDING = 10;

module.exports = class GameplayScene extends BaseScene {

  // TODO slim this bad boy down, yeesh
  constructor(level) {
    super()
    if (!level) debug.error("No level data!");
    let self = this; // TODO remove binding, use arrow functions!!!
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
    self.helpTextFontLabel = 'px monospace';
    self.helpText = new pixi.Text('', {
      font: '0' + self.helpTextFontLabel,
      wordWrap: true,
      wordWrapWidth: 0,
      align: 'center',
      fill: 0x00DD00,
      // stroke: 0x000000,
      // strokeThickness: 4,
    });
    self.helpText.visible = false;
    self.helpText.anchor = new pixi.Point(0.5, 1.0);
    self.helpBg = new pixi.Graphics();
    self.helpBg.boundsPadding = 0;
    self.helpBg.alpha = 0.5;
    self.helpBg.visible = false;
    self.helpBg.beginFill(0x001100);
    self.helpBg.drawRect(0,0,1,1);
    self.helpBg.endFill();
    self.ui.addChild(self.helpBg);
    self.ui.addChild(self.helpText);
    self.consoles = [];
    self.fanCurrents = []; // TODO refactor into base class/interface
    self.restarted = false;
    self.deathY = 0; // to be adjusted later

    // TODO generic bg layer system?
    this.starClip = assets.movieClip('bg/starfield/', {
      animationSpeed: 1/45,
    })
    this.starClip.play();
    this.bgSprite = new pixi.extras.TilingSprite(this.star1, 0, 0);
    this.background.addChild(this.bgSprite);
    this.bgHull = new pixi.extras.TilingSprite(assets.texture('bg/hull'), 0, 0);
    this.background.addChild(this.bgHull);
    this.bgCols = new pixi.extras.TilingSprite(assets.texture('bg/column'), 0, 0);
    this.background.addChild(this.bgCols);
    this.tilingSprites = [this.bgSprite, this.bgHull, this.bgCols];
    this.bgSprite.tint = 0x666688;
    this.bgHull.tint = 0x555555;
    this.bgCols.tint = 0x777777;

    // Load level data
    // Get tile dimensions
    let tilesDown = level.data.length;
    let tilesAcross = Math.max.apply(Math, level.data.map(function(row) {
      return row.length;
    }));
    self.deathY = (tilesDown + 10) * TILE;
    // Initalize tile grid
    self.tileGrid = new TileGrid(tilesAcross, tilesDown, false);
    // Set up map
    level.data.forEach(function(row, iRow) {
      let y = iRow * TILE;
      for (let iCol = 0; iCol < row.length; iCol++) {
        let x = iCol * TILE;
        let cx = x + TILE/2;
        let cy = y + TILE/2;
        let char = row.charAt(iCol);
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
          let fc = new FanCurrent(new pixi.Rectangle(x, y, TILE, TILE));
          self.fanCurrents.push(fc);
          self.world.addChild(fc.sprite);
        } else if (char == '!') { // Exit
          self.exit = assets.sprite("objects/spill");
          self.exit.x = x + TILE/2;
          self.exit.y = y + TILE + 3;
          self.exit.anchor = new pixi.Point(0.5, 1.0);
          self.exitRect = new pixi.Rectangle(
            x,
            y,
            TILE,
            TILE);
        } else {
          let object = level.objects[char];
          if (object) {
            let data = object.split('|');
            let type = data[0];
            let contents = data[1];
            if (type == 'Console') {
              let Console = require('../objects/Console');
              let bounds = new pixi.Rectangle(x, y, TILE, TILE);
              let c = new Console(bounds, contents, self.helpText, self.helpBg, null);
              self.consoles.push(c);
              self.world.addChild(c.sprite);
            }
          } else {
            let tile = assets.sprite("tiles/block"); // TODO randomize? different?
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
      let enemy = new objects.CleanBot(0, 0, self.player);
      enemy.setCenter(center.x, center.y);
      self.enemies.push(enemy);
      self.world.addChild(enemy.container);
    });

    if (!self.player) debug.error("No player object!");
    self.world.addChild(self.player.container);

    for (let cons of this.consoles) {
      cons.player = this.player;
    }

    if (!self.exit) debug.error("No level exit!");
    self.world.addChild(self.exit);

    self.debugGfx = new pixi.Graphics();
    self.world.addChild(self.debugGfx);

    for (let i = 0; i < constants.PLAYER_MAX_HEALTH; i++) {
      let heart = assets.sprite('ui/heart/full');
      heart.x = 5 + i * heart.width + (i * 1);
      heart.y = 5;
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
    self.pauseText = assets.sprite('text/pause');
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

  initialize() {
    assets.playMusic('music/gameplay/action');
  }
  dispose() {
    if (!this.restarted) {
      assets.stopMusic();
    }
  }
  resize(w, h) {
    this.helpText.style.wordWrapWidth = w - HELP_TEXT_PADDING * 2;
    let fontSize = game.worldPixelsFromScreen(36);
    this.helpText.style.font = fontSize.toString() + this.helpTextFontLabel;
    // Render at native res, regardless of game scale
    this.helpText.resolution = game.scale;
    if (this.helpText.visible) {
      this.helpText.dirty = true;
    }
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
  }
  update(delta) {

    this.bgSprite.texture = this.starClip.texture;
    if (this.helpText.visible) {
      let padding = HELP_TEXT_PADDING;
      this.helpText.position.copy(game.display.bottomCenter);
      this.helpText.position.y -= padding;
      this.helpText.updateTransform();
      let box = this.helpText.getBounds();
      box = game.worldRectFromScreen(box);
      box.pad(padding); // TODO world or screen pixels?
      let wDiff = this.helpText.style.wordWrapWidth + HELP_TEXT_PADDING * 2 - box.width;
      box.x -= wDiff / 2;
      box.width += wDiff;
      this.helpBg.x = box.x
      this.helpBg.y = box.y;
      this.helpBg.width = box.width;
      this.helpBg.height = box.height;
    }

    let MainMenuScene = require('./MainMenuScene');
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
        let MainMenuScene = require('./MainMenuScene');
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
      let nextScene = null;
      if (this.nextLevel) {
        this.restarted = true;
        nextScene = new GameplayScene(this.nextLevel);
      } else {
        nextScene = new StageClearScene(); // TODO this has a next level property
      }
      return nextScene;
    }

    let self = this;

    self.bgSprite.tilePosition.x -= 10 * delta;

    // Update Player
    self.player.update(delta, self);

    // update consoles
    self.consoles.forEach(function(cons) {
      cons.update();
    })

    // update fan currents
    self.fanCurrents.forEach(function(fc) {
      fc.testCollision(self.player, self.player.getBounds());
    });


    // update aliens
    self.enemies.forEach(function(enemy) {
      enemy.update(delta, self);
    });

    //update health
    while (self.hearts.length > self.player.hitPoints && self.hearts.length > 0) {
      let last = self.hearts.pop();
      last.texture = assets.texture('ui/heart/empty');
    }

    // Have screen follow the player
    this.world.x = Math.round(-this.player.getCenterX() + game.display.width / 2);
    this.world.y = Math.round(-this.player.getCenterY() + game.display.height / 2);
    this.world.x =
      -Math.round(this.player.getBounds().x) +
      -Math.round(this.player.getWidth() / 2) +
      Math.round(+ game.display.width / 2);
    this.world.y =
      -Math.round(this.player.getBounds().y) +
      -Math.round(this.player.getHeight() / 2) +
      Math.round(+ game.display.height / 2);
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
}
