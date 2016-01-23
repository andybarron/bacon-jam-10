var pixi = require('pixi.js');
var howler = require('howler');
var constants = require('../constants');

function Player(x, y, sprite) {
  this.sprite = sprite;
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

  this.sounds = {
    'jump': new howler.Howl({ urls: ['../audio/jumping.mp3'] }),
    'attack': new howler.Howl({ urls: ['../audio/attacking.mp3'] }),
    'fly': new howler.Howl({ urls: ['../audio/flying.mp3'] }),
    'hide': new howler.Howl({ urls: ['../audio/hiding.mp3'] }),
    'ouch': new howler.Howl({ urls: ['../audio/ouch.mp3'] })
  };

}

Player.prototype = {
  move: function move(delta) {
    
    this.sprite.x += this.velocity.x * delta;
    this.sprite.y += this.velocity.y * delta;
  },
  update: function update(delta) {
    this.move(delta);

    if (this.velocity.x < 0) {
      this.sprite.scale.x = -1;
    }
    else if (this.velocity.x > 0) {
      this.sprite.scale.x = 1;
    }
  }
};

module.exports = Player;