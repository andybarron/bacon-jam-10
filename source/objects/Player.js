import {animationSpeedFromFps} from '../game';
import * as pixi from 'pixi.js';
let PhysicsObject = require('../physics/PhysicsObject');
let keyboard = require('../keyboard');
import * as constants from '../constants';
let assets = require('../assets');
let collision = require('../physics/collision');
import * as colors from '../colors';

let glideGravityScale = constants.PLAYER_GLIDE_GRAVITY_SCALE;

let JUMP = keyboard.UP;
let LEFT = keyboard.LEFT;
let RIGHT = keyboard.RIGHT;
let ATTACK = keyboard.Z;

let ATK_OFFSET_X = constants.PLAYER_ATTACK_OFFSET_X;
let ATK_OFFSET_Y = constants.PLAYER_ATTACK_OFFSET_Y;
let ATK_W = constants.PLAYER_ATTACK_WIDTH;
let ATK_H = constants.PLAYER_ATTACK_HEIGHT;

module.exports = class Player extends PhysicsObject {
  constructor(x, y) {
    super(x, y, constants.TILE_SIZE/2, constants.TILE_SIZE, constants.TILE_SIZE/2);
    this.faceVelocityX = false;
    this.linkEventToSound('grounded', 'player/land');
    this.linkEventToSound('jump', 'player/jump');
    this.linkEventToSound('glide', 'player/glide');
    this.linkEventToSound('attack', 'player/attack');
    this.linkEventToSound('attack-hit', 'player/attack-hit');

    // Sprite Setup
    this.idleSprite = assets.movieClip('player/idle/');
    this.idleSprite.loop = true;
    this.idleSprite.fps = 3;

    this.runSprite = assets.movieClip('player/run/');
    this.runSprite.loop = true;
    this.defaultRunAnimSpeed = animationSpeedFromFps(8);
    this.runSprite.animationSpeed = this.defaultRunAnimSpeed;

    this.attackSprite = assets.movieClip('player/attack/');
    this.attackSprite.loop = false;
    this.attackSprite.fps = 15;

    this.jumpSprite = assets.movieClip('player/jump/');
    this.jumpSprite.loop = true;
    this.jumpSprite.fps = 4;

    this.fallSprite = assets.movieClip('player/fall/');
    this.fallSprite.loop = true;
    this.fallSprite.fps = 8;

    this.glideSprite = assets.movieClip('player/float/');
    this.glideSprite.loop = true;
    this.glideSprite.fps = 12;

    this.setSprite(this.idleSprite, PhysicsObject.Align.BOTTOM_LEFT);
    this.hitPoints = constants.PLAYER_MAX_HEALTH;
    this.recentHit = false;
    this.hitTimeout = 0;
    this.gliding = false;
    this.attacking = false;
    this.attackDuration = this.attackSprite.duration + 1/60;
    this.attackTimer = 0;
    this.attackBox = new pixi.Rectangle(0, 0, ATK_W, ATK_H);
  }
  update(delta, game) {
    this.performActions(delta, game);

    if (this.gliding && this.velocity.y > constants.PLAYER_MAX_FLOAT_FALL_SPEED) {
      this.velocity.y = constants.PLAYER_MAX_FLOAT_FALL_SPEED;
    }

    this.updatePhysics(delta, game.tileGrid);
    this.updateEnemyCollisions(game.enemies);
    this.setState();

    if (this.recentHit) {
      // goes from 0 to 1 after hit
      let alpha = this.hitTimeout / constants.PLAYER_HURT_SECONDS;
      let tint = colors.lerp(0xFF0000, 0xFFFFFF, alpha);
      // TODO just set container.tint if it ever gets implemented...
      this.container.children.forEach(function(child) {
        if ('tint' in child) {
          child.tint = tint;
        }
      });
    } else {
      this.container.alpha = 1;
      this.container.children.forEach(function(child) {
        if ('tint' in child) {
          child.tint = 0xFFFFFF;
        }
      });
    }

    // let speedFactor = Math.abs(this.velocity.x/constants.PLAYER_MAX_SPEED);
    // if (this.velocity.x != 0 && Math.sign(this.container.scale.x) != Math.sign(this.velocity.x)) {
    //   speedFactor *= -1;
    // }
    let speedFactor = this.velocity.x/(constants.PLAYER_MAX_SPEED * Math.sign(this.container.scale.x));
    this.runSprite.animationSpeed = this.defaultRunAnimSpeed * speedFactor;

    if (this.gliding && this.velocity.y > 0) {
      this.gravityScale = glideGravityScale;
    }
    else {
      this.gravityScale = 1;
    }

    if(this.recentHit){
      this.hitTimeout += delta;
      if (this.hitTimeout >= constants.PLAYER_HURT_SECONDS){
        this.hitTimeout = 0;
        this.recentHit = false;
      }
    }

    if (this.attacking) {
      this.attackTimer += delta;
      if (this.attackTimer >= this.attackDuration) {
        this.attackTimer = 0;
        this.attacking = false;
      }
    }
  }
  performActions(delta, game) {
    // Jump action
    if (keyboard.isKeyPressed(JUMP) && this.grounded && !this.attacking) {
      this.grounded = false;
      this.velocity.y = -constants.PLAYER_JUMP_SPEED;
      this.emit('jump');
    }

    // check recentHit so player can't cancel bounce when they are hurt
    if (!keyboard.isKeyDown(JUMP) && !this.gliding && this.velocity.y < 0 && !this.recentHit) {
      this.velocity.y = 0; // cancel jump
    }

    // Start Glide
    if (!this.grounded && keyboard.isKeyPressed(JUMP) && !this.gliding
        && this.velocity.y >= 0) {
      this.gliding = true;
      this.gravityScale = glideGravityScale;
      this.emit('glide');
    }
    // Cancel glide on keypress
    else if (this.gliding && (keyboard.isKeyPressed(JUMP) || this.grounded)) {
      this.gliding = false;
      this.emit('unglide');
    }

    // Movement
    // TODO make this make more sense
    // TODO disable movement while attacking (and possibly velocity.x = 0 as well?)
    let controlMult = this.grounded ? 1 : constants.PLAYER_AIR_CONTROL_MULT;
    let accel = constants.PLAYER_ACCELERATION * controlMult;
    if (keyboard.isKeyDown(RIGHT) && !this.attacking) {
      // Moving right, increase right velocity up to max
      if(this.velocity.x <= constants.PLAYER_MAX_SPEED){
        this.velocity.x += accel * delta;
      }
      this.container.scale.x = 1;
    } else if (keyboard.isKeyDown(LEFT) && !this.attacking) {
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

    if (this.grounded && keyboard.isKeyPressed(ATTACK) && !this.attacking) {
      this.emit('attack');
      this.attacking = true;
      this.attackBox.setCenter(this.getCenterX(), this.getCenterY());
      this.attackBox.x += ATK_OFFSET_X * this.container.scale.x;
      this.attackBox.y += ATK_OFFSET_Y;
      for (let iEnemy = 0; iEnemy < game.enemies.length; iEnemy++) {
        let enemy = game.enemies[iEnemy];
        if (collision.getRectangleOverlap(this.attackBox, enemy.getBounds())) {
          enemy.setMovieClip(enemy.deathSprite, enemy.currentAlign, true);
          game.enemies.splice(iEnemy, 1);
          iEnemy--;
          this.emit('attack-hit');
        }
      }
    }
  }
  setState() {
    let s = this.idleSprite;
    if (this.attacking) {
      s = this.attackSprite;
    } else if (this.grounded) {
      s = this.velocity.x != 0 ? this.runSprite : this.idleSprite;
    } else {
      if (this.gliding) {
        s = this.glideSprite;
      } else {
        s = this.velocity.y <= 0 ? this.jumpSprite : this.fallSprite;
      }
    }
    this.changeMovieClip(s, PhysicsObject.Align.BOTTOM_LEFT, true);
    this.container.updateTransform();
  }
  updateEnemyCollisions(enemies) {
    if(enemies){
      let self = this;
      enemies.forEach(function(enemy){
        collision.resolveEnemyCollision(self, enemy);
      });
    }
  }
}