var pixi = require('pixi.js');
var extend = require('../extend');
var PhysicsObject = require('../physics/PhysicsObject');
var keyboard = require('../keyboard');
var constants = require('../constants');
var assets = require('../assets');
var collision = require('../physics/collision');

var glideGravityScale = constants.PLAYER_GLIDE_GRAVITY_SCALE;

var attackTextures = [];
var idleTextures = [];
var jumpTextures = [];
var glideTextures = [];
var runTextures = [];

var JUMP = keyboard.UP;
var LEFT = keyboard.LEFT;
var RIGHT = keyboard.RIGHT;
var ATTACK = keyboard.SHIFT;

for (var i = 1; i <= 8; i++) {
  var s = "towel_attack_" + i;
  attackTextures.push(assets.texture(s));
};

for (var i = 1; i <= 8; i++) {
  var s = "swishy_idle_" + i;
  idleTextures.push(assets.texture(s));
};

for (var i = 1; i <= 3; i++) {
  var s = "swishy_jump_" + i;
  jumpTextures.push(assets.texture(s));
};

for (var i = 1; i <= 2; i++) {
  var s = "swishy_glide_" + i;
  glideTextures.push(assets.texture(s));
};

for (var i = 1; i <= 12; i++) {
  var s = "swishy_run_" + i;
  runTextures.push(assets.texture(s));
};

function Player(x, y) {
  PhysicsObject.call(this, x, y, 34, 49);

  // Sprite Setup
  this.idleSprite = new pixi.extras.MovieClip(idleTextures);
  this.idleSprite.loop = true;
  this.idleSprite.animationSpeed = 0.5;
  this.idleSprite.play();

  this.runSprite = new pixi.extras.MovieClip(runTextures);
  this.runSprite.loop = true;
  this.defaultRunAnimSpeed = 0.5;
  this.runSprite.animationSpeed = this.defaultRunAnimSpeed;
  this.runSprite.play();

  this.towelSprite = new pixi.extras.MovieClip(attackTextures);
  this.towelSprite.loop = false;
  this.towelSprite.animationSpeed = 0.8;

  this.jumpSprite = new pixi.extras.MovieClip(jumpTextures);
  this.jumpSprite.loop = true;
  this.jumpSprite.animationSpeed = 0.2;

  this.glideSprite = new pixi.extras.MovieClip(glideTextures);
  this.glideSprite.loop = true;
  this.glideSprite.animationSpeed = 0.1;

  this.currentSprite = this.idleSprite;
  this.setSprite(this.idleSprite, true);
  this.hitPoints = constants.PLAYER_MAX_HEALTH;
  this.recentHit = false;
  this.hitTimeout = 0;
  this.gliding = false;
}

extend(PhysicsObject, Player, {
  update: function update(delta, game) {
    this.performActions(delta, game);
    this.removeInactiveSprites();

    if (this.gliding && this.velocity.y > constants.PLAYER_MAX_FLOAT_FALL_SPEED) {
      this.velocity.y = constants.PLAYER_MAX_FLOAT_FALL_SPEED;
    }

    this.updatePhysics(delta);
    this.updateWorldCollisions(game.tileGrid, game.debugGfx);
    this.updateEnemyCollisions(game.enemies);

    var speedFactor = Math.abs(this.velocity.x/constants.PLAYER_MAX_SPEED);
    this.runSprite.animationSpeed = this.defaultRunAnimSpeed * speedFactor;

    if (this.gliding && this.velocity.y > 0) {
      this.gravityScale = glideGravityScale;
    }
    else if (this.gravityScale != 1) {
      this.gravityScale = 1;
    }

    if(this.recentHit){
      this.hitTimeout += 1;
      if (this.hitTimeout >= constants.PLAYER_HIT_TIMEOUT){
        this.hitTimeout = 0;
        this.recentHit = false;
      }
    }
  },
  performActions: function performActions(delta, game) {
    // Jump action
    if (keyboard.isKeyPressed(JUMP) && this.grounded) {
      this.grounded = false;
      this.velocity.y = -constants.PLAYER_JUMP_SPEED;
      assets.sounds.player.jump.play();
    }

    if (!keyboard.isKeyDown(JUMP) && !this.gliding && this.velocity.y < 0) {
      this.velocity.y = 0; // cancel jump
    }

    // Start Glide
    if (!this.grounded && keyboard.isKeyPressed(JUMP) && !this.gliding
        && this.velocity.y >= 0) {
      this.setMainSprite(this.glideSprite, true);
      this.glideSprite.play();
      this.gliding = true;
      this.gravityScale = glideGravityScale;
    }
    // Cancel glide on keypress
    else if (this.gliding && keyboard.isKeyPressed(JUMP)) {
      this.setMainSprite(this.jumpSprite, true);
      this.jumpSprite.play();
      this.gliding = false;
    }
    else if (!this.grounded && !this.gliding && this.currentSprite != this.jumpSprite) {
      this.setMainSprite(this.jumpSprite, true);
      this.jumpSprite.play();
    }
    
    if (this.grounded && this.jumpSprite.playing) {
      this.jumpSprite.stop();
      this.setMainSprite(this.idleSprite, true);
    }
    else if (this.grounded && this.glideSprite.playing) {
      this.glideSprite.stop();
      this.setMainSprite(this.idleSprite, true);
      this.gliding = false;
    }

    // Movement
    var controlMult = this.grounded ? 1 : constants.PLAYER_AIR_CONTROL_MULT;
    var accel = constants.PLAYER_ACCELERATION * controlMult;
    if (keyboard.isKeyDown(LEFT)) {
      //Moving left, increase left velocity up to max
      if(this.velocity.x >= -constants.PLAYER_MAX_SPEED){
        this.velocity.x += -accel * delta;
      }
    }
    else if (keyboard.isKeyDown(RIGHT)) {
      //Moving right, increase right velocity up to max
      if(this.velocity.x <= constants.PLAYER_MAX_SPEED){
        this.velocity.x += accel * delta;
      }
    }
    else
    {
      //Not moving, velocity moves closer to 0 until stop
      if(this.velocity.x > 0) {
        this.velocity.x += -accel * delta;
      }
      else if (this.velocity.x < 0){
        this.velocity.x += accel * delta;
      }
      if (Math.abs(this.velocity.x) < accel * delta) {
        this.velocity.x = 0; // IMPORTANT! prevents flipping back and forth at rest
      }
    }

    if (this.currentSprite == this.idleSprite && Math.abs(this.velocity.x) != 0) {
      this.setMainSprite(this.runSprite, true);
      this.container.updateTransform();
    } else if (this.currentSprite == this.runSprite && Math.abs(this.velocity.x) == 0) {
      this.setMainSprite(this.idleSprite);
    }

    if (keyboard.isKeyPressed(ATTACK)) {

      this.container.addChildAt(this.towelSprite, 0);
      this.towelSprite.gotoAndPlay(0);
      assets.sounds.player.attack.play();
      
      var hit = false;
      // check enemies
      for (var i = 0; i < game.enemies.length; i++) {
        var enemy = game.enemies[i];

        // facing right
        if (this.container.scale.x > 0) {
          var diff = enemy.getPosition().x - this.getPosition().x;

          if (diff > 0 && diff < 60) {
            hit= true;
            game.world.removeChild(enemy.container);
            game.enemies.splice(game.enemies.indexOf(enemy), 1);
          }  
        }
        // facing left
        else if (this.container.scale.x < 0) {
          var diff = this.getPosition().x - enemy.getPosition().x;

          if (diff > 0 && diff < 50) {
            hit = true;
            game.world.removeChild(enemy.container);
            game.enemies.splice(game.enemies.indexOf(enemy), 1);
          }  
        }
      }

      if (hit) assets.sounds.player.attackHit.play();
    }
  },
  removeInactiveSprites: function removeInactiveSprites() {
    if (!this.towelSprite.playing) {
      this.container.removeChild(this.towelSprite);
    }
  },
  updateEnemyCollisions: function updateEnemyCollisions(enemies) {
    if(enemies){
      var self = this;
      enemies.forEach(function(enemy){
        collision.resolveEnemyCollision(self, enemy);
      });
    }
  },
  setMainSprite: function setMainSprite(spr, center) {
    if (center) {
      this.centered = true;
      spr.anchor.x = 0.5;
      spr.anchor.y = 0.5;
      spr.x = this._bounds.width / 2.0;
      spr.y = this._bounds.height / 2.0;
    }
    this.container.removeChild(this.currentSprite);
    this.container.addChild(spr);
    this.currentSprite = spr;
  },
});

module.exports = Player;