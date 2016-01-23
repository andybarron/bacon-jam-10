var pixi = require('pixi.js');
var howler = require('howler');
var constants = require('../constants');

var attackTextures = [];
var idleTextures = [];

for (var i = 1; i <= 8; i++) {
  var s = "swishy_attack_" + i;
  attackTextures.push(pixi.loader.resources[s].texture);
};

for (var i = 1; i <= 8; i++) {
  var s = "swishy_idle_" + i;
  idleTextures.push(pixi.loader.resources[s].texture);
};

function Player(x, y, sprite) {
  this.sprite = new pixi.extras.MovieClip(idleTextures);
  this.sprite.loop = true;
  this.sprite.animationSpeed = 0.5;
  this.sprite.play();

  this.hitPoints = 3;
  this.recentHit = false;
  this.grounded = false;
  this.sprite.x = x;
  this.sprite.y = y;
  this.sprite.anchor = new pixi.Point(0.5, 0.5);
  this.velocity = {
    x: 0.0,
    y: 0.0
  };
  this.isHiding = false;
  this.isOverlapping = false;

  // Animations
  this.animations = {};

  // Attack Animation
  this.animations.attackClip = new pixi.extras.MovieClip(attackTextures);

  // Animation setup
  // setup animation positions
  for(var name in this.animations) {
    this.animations[name].x = this.sprite.x - this.sprite.width / 2;
    this.animations[name].y = this.sprite.y - this.sprite.height / 2;
    this.animations[name].loop = false;
  }
  // End Animations

  this.sounds = {
    'jump': new howler.Howl({ urls: ['../audio/jump/jumping.mp3'] }),
    'attack': new howler.Howl({ urls: ['../audio/hit/attacking.mp3'] }),
    'fly': new howler.Howl({ urls: ['../audio/flying.mp3'] }),
    'hide': new howler.Howl({ urls: ['../audio/hiding.mp3'] }),
    'ouch': new howler.Howl({ urls: ['../audio/ouch.mp3'] })
  };

}

Player.prototype = {
  move: function move(delta) { 
    this.sprite.x += this.velocity.x * delta;
    this.sprite.y += this.velocity.y * delta;

    // update animation positions
    for(var name in this.animations) {
      this.animations[name].scale = this.sprite.scale;
      this.animations[name].x = this.sprite.x - this.sprite.width / 2.0 * this.sprite.scale.x;
      this.animations[name].y = this.sprite.y - this.sprite.height / 2.0 * this.sprite.scale.y;   
    }
  },
  update: function update(delta, stage) {
    this.move(delta);

    if (this.velocity.x < 0) {
      this.sprite.scale.x = -1;
    }
    else if (this.velocity.x > 0) {
      this.sprite.scale.x = 1;
    }

    // remove animations
    for(var name in this.animations) {
      if (stage.children.indexOf(this.animations[name]) > -1 && !this.animations[name].playing) {
        stage.removeChild(this.animations[name]);
      }
    }
  },
  attack: function attack(stage) {
    stage.addChild(this.animations.attackClip);
    this.animations.attackClip.gotoAndPlay(0);
    this.sounds.attack.play();
  }
};

module.exports = Player;