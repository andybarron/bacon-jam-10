var pixi = require('pixi.js');
var extend = require('../extend');
var PhysicsObject = require('../physics/PhysicsObject');
var keyboard = require('../keyboard');
var constants = require('../constants');
var assets = require('../assets');
var collision = require('../physics/collision');

var glideGravityScale = constants.PLAYER_GLIDE_GRAVITY_SCALE;

var JUMP = keyboard.UP;
var LEFT = keyboard.LEFT;
var RIGHT = keyboard.RIGHT;
var ATTACK = keyboard.SHIFT;

function Player(x, y) {
  PhysicsObject.call(this, x, y, 34, 49);
  this.faceVelocityX = false;

  // Sprite Setup
  this.idleSprite = assets.movieClip('player/idle/');
  this.idleSprite.loop = true;
  this.idleSprite.animationSpeed = 0.5;
  this.idleSprite.play();

  this.runSprite = assets.movieClip('player/run/');
  this.runSprite.loop = true;
  this.defaultRunAnimSpeed = 0.5;
  this.runSprite.animationSpeed = this.defaultRunAnimSpeed;
  this.runSprite.play();

  this.towelSprite = assets.movieClip('player/attack/arm/');
  this.towelSprite.loop = false;
  this.towelSprite.animationSpeed = 0.8;

  this.jumpSprite = assets.movieClip('player/jump/');
  this.jumpSprite.loop = true;
  this.jumpSprite.animationSpeed = 0.2;

  this.glideSprite = assets.movieClip('player/float/');
  this.glideSprite.loop = true;
  this.glideSprite.animationSpeed = 0.1;

  this.setSprite(this.idleSprite, PhysicsObject.Align.CENTER);
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
    if (this.velocity.x != 0 && Math.sign(this.container.scale.x) != Math.sign(this.velocity.x)) {
      speedFactor *= -1;
    }
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
      this.setMovieClip(this.glideSprite, PhysicsObject.Align.CENTER, true);
      this.glideSprite.play();
      this.gliding = true;
      this.gravityScale = glideGravityScale;
    }
    // Cancel glide on keypress
    else if (this.gliding && keyboard.isKeyPressed(JUMP)) {
      this.setMovieClip(this.jumpSprite, PhysicsObject.Align.CENTER, true);
      this.jumpSprite.play();
      this.gliding = false;
    }
    else if (!this.grounded && !this.gliding && this.currentSprite != this.jumpSprite) {
      this.setMovieClip(this.jumpSprite, PhysicsObject.Align.CENTER, true);
      this.jumpSprite.play();
    }
    
    if (this.grounded && this.jumpSprite.playing) {
      this.jumpSprite.stop();
      this.setMovieClip(this.idleSprite, PhysicsObject.Align.CENTER, true);
    }
    else if (this.grounded && this.glideSprite.playing) {
      this.glideSprite.stop();
      this.setMovieClip(this.idleSprite, PhysicsObject.Align.CENTER, true);
      this.gliding = false;
    }

    // Movement
    var controlMult = this.grounded ? 1 : constants.PLAYER_AIR_CONTROL_MULT;
    var accel = constants.PLAYER_ACCELERATION * controlMult;
    if (keyboard.isKeyDown(RIGHT)) {
      // Moving right, increase right velocity up to max
      if(this.velocity.x <= constants.PLAYER_MAX_SPEED){
        this.velocity.x += accel * delta;
      }
      this.container.scale.x = 1;
    } else if (keyboard.isKeyDown(LEFT)) {
      // Moving left, increase left velocity up to max
      if(this.velocity.x >= -constants.PLAYER_MAX_SPEED){
        this.velocity.x += -accel * delta;
      }
      this.container.scale.x = -1;
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
      this.setMovieClip(this.runSprite, PhysicsObject.Align.CENTER, true);
    } else if (this.currentSprite == this.runSprite && Math.abs(this.velocity.x) == 0) {
      this.setMovieClip(this.idleSprite, PhysicsObject.Align.CENTER, true);
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
});

module.exports = Player;