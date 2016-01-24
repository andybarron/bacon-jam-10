var pixi = require('pixi.js');
var extend = require('../extend');
var PhysicsObject = require('../physics/PhysicsObject');
var keyboard = require('../keyboard');
var constants = require('../constants');
var assets = require('../assets');
var collision = require('../physics/collision');

var attackTextures = [];
var idleTextures = [];
var jumpTextures = [];
var glideTextures = [];

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

for (var i = 1; i <= 1; i++) {
  var s = "swishy_glide_" + i;
  glideTextures.push(assets.texture(s));
};

function Player(x, y) {
  PhysicsObject.call(this, x, y, 34, 54);

  // Sprite Setup
  this.idleSprite = new pixi.extras.MovieClip(idleTextures);
  this.idleSprite.loop = true;
  this.idleSprite.animationSpeed = 0.5;
  this.idleSprite.play();
  
  this.towelSprite = new pixi.extras.MovieClip(attackTextures);
  this.towelSprite.loop = false;
  this.towelSprite.animationSpeed = 0.8;

  this.jumpSprite = new pixi.extras.MovieClip(jumpTextures);
  this.jumpSprite.loop = true;
  this.jumpSprite.animationSpeed = 0.2;

  this.glideSprite = new pixi.extras.MovieClip(glideTextures);
  this.glideSprite.loop = true;
  this.glideSprite.animationSpeed = 0.2;

  this.currentSprite = this.idleSprite;
  this.setSprite(this.idleSprite, true);
  this.hitPoints = constants.PLAYER_MAX_HEALTH;
  this.recentHit = false;
  this.hitTimeout = 0;
}

extend(PhysicsObject, Player, {
  update: function update(delta, game) {
    this.performActions(delta, game);
    this.removeInactiveSprites();
    this.updatePhysics(delta, game.platforms);
    this.updateEnemyCollisions(game.aliens);

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
    if (keyboard.isKeyDown(keyboard.W) && this.grounded) {
      this.grounded = false;
      this.velocity.y = -constants.PLAYER_JUMP_SPEED;
      assets.sounds.player.jump.play();
    }

    if (!this.grounded) {
      this.setMainSprite(this.jumpSprite);
      this.jumpSprite.play(0);
    }
    else if (this.jumpSprite.playing) {
      this.jumpSprite.stop();
      this.setMainSprite(this.idleSprite);
    }

    // Movement
    if (keyboard.isKeyDown(keyboard.A)) {
      //Moving left, increase left velocity up to max
      if(this.velocity.x >= -constants.PLAYER_MAX_SPEED){
        this.velocity.x += -constants.PLAYER_ACCELERATION * delta;
      }
    }
    else if (keyboard.isKeyDown(keyboard.D)) {
      //Moving right, increase right velocity up to max
      if(this.velocity.x <= constants.PLAYER_MAX_SPEED){
        this.velocity.x += constants.PLAYER_ACCELERATION * delta;
      }
    }
    else
    {
      //Not moving, velocity moves closer to 0 until stop
      if(this.velocity.x > 0) {
        this.velocity.x += -constants.PLAYER_ACCELERATION * delta;
      }
      else if (this.velocity.x < 0){
        this.velocity.x += constants.PLAYER_ACCELERATION * delta;
      }
      if (Math.abs(this.velocity.x) < constants.PLAYER_ACCELERATION * delta) {
        this.velocity.x = 0; // IMPORTANT! prevents flipping back and forth at rest
      }
    }

    if (keyboard.isKeyPressed(keyboard.E)) {

      this.container.addChildAt(this.towelSprite, this.container.children.length-1);
      this.towelSprite.gotoAndPlay(0);
      assets.sounds.player.attack.play();
      
      var hit = false;
      // check aliens
      for (var i = 0; i < game.aliens.length; i++) {
        var enemy = game.aliens[i];

        // facing right
        if (this.container.scale.x > 0) {
          var diff = enemy.getPosition().x - this.getPosition().x;

          if (diff > 0 && diff < 50) {
            hit= true;
            game.world.removeChild(enemy.container);
            game.aliens.splice(game.aliens.indexOf(enemy), 1);
          }  
        }
        // facing left
        else if (this.container.scale.x < 0) {
          var diff = this.getPosition().x - enemy.getPosition().x;

          if (diff > 0 && diff < 50) {
            hit = true;
            game.world.removeChild(enemy.container);
            game.aliens.splice(game.aliens.indexOf(enemy), 1);
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
  setMainSprite: function setSprite(spr, center) {
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

// var pixi = require('pixi.js');
// var howler = require('howler');
// var constants = require('../constants');

// var attackTextures = [];
// var idleTextures = [];

// for (var i = 1; i <= 8; i++) {
//   var s = "swishy_attack_" + i;
//   attackTextures.push(pixi.loader.resources[s].texture);
// };

// for (var i = 1; i <= 8; i++) {
//   var s = "swishy_idle_" + i;
//   idleTextures.push(pixi.loader.resources[s].texture);
// };

// function Player(x, y, sprite) {
//   this.sprite = new pixi.extras.MovieClip(idleTextures);
//   this.sprite.loop = true;
//   this.sprite.animationSpeed = 0.5;
//   this.sprite.play();

//   this.hitPoints = 3;
//   this.recentHit = false;
//   this.grounded = false;
//   this.sprite.x = x;
//   this.sprite.y = y;
//   this.sprite.anchor = new pixi.Point(0.5, 0.5);
//   this.velocity = {
//     x: 0.0,
//     y: 0.0
//   };
//   this.isHiding = false;
//   this.isOverlapping = false;

//   // Animations
//   this.animations = {};

//   // Attack Animation
//   this.animations.attackClip = new pixi.extras.MovieClip(attackTextures);

//   // Animation setup
//   // setup animation positions
//   for(var name in this.animations) {
//     this.animations[name].x = this.sprite.x - this.sprite.width / 2;
//     this.animations[name].y = this.sprite.y - this.sprite.height / 2;
//     this.animations[name].loop = false;
//   }
//   // End Animations

//   this.sounds = {
//     'jump': new howler.Howl({ urls: ['../audio/jump/jump.wav'], volume: 0.33 }),
//     'attack': new howler.Howl({ urls: ['../audio/hit/attacking.mp3'] }),
//     'fly': new howler.Howl({ urls: ['../audio/flying.mp3'] }),
//     'hide': new howler.Howl({ urls: ['../audio/hiding.mp3'] }),
//     'ouch': new howler.Howl({ urls: ['../audio/ouch.mp3'] })
//   };

// }

// Player.prototype = {
//   move: function move(delta) { 
//     this.sprite.x += this.velocity.x * delta;
//     this.sprite.y += this.velocity.y * delta;

//     // update animation positions
//     for(var name in this.animations) {
//       this.animations[name].scale = this.sprite.scale;
//       this.animations[name].x = this.sprite.x - this.sprite.width / 2.0 * this.sprite.scale.x;
//       this.animations[name].y = this.sprite.y - this.sprite.height / 2.0 * this.sprite.scale.y;   
//     }
//   },
//   update: function update(delta, stage) {
//     this.move(delta);

//     if (this.velocity.x < 0) {
//       this.sprite.scale.x = -1;
//     }
//     else if (this.velocity.x > 0) {
//       this.sprite.scale.x = 1;
//     }

//     // remove animations
//     for(var name in this.animations) {
//       if (stage.children.indexOf(this.animations[name]) > -1 && !this.animations[name].playing) {
//         stage.removeChild(this.animations[name]);
//       }
//     }
//   },
// };

// module.exports = Player;
