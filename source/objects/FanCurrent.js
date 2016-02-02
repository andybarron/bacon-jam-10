let pixi = require('pixi.js');
let collision = require('../physics/collision');
let constants = require('../constants');
let assets = require('../assets');

function FanCurrent(bounds) {
  this.bounds = bounds;
  this.sprite = assets.movieClip('objects/current/');
  this.sprite.x = bounds.x;
  this.sprite.y = bounds.y;
  this.sprite.width = bounds.width;
  this.sprite.height = bounds.height;
  this.sprite.loop = true;
  this.sprite.animationSpeed = 0.5;
  this.sprite.play();
}

FanCurrent.prototype = {
  update: function(delta, player) {
    if (player.grounded || !player.gliding) return;
    let overlap = collision.getRectangleOverlap(player.getBounds(), this.bounds);
    if (overlap && overlap.width >= player.getBounds().width/2) {
      if (player.velocity.y < -constants.FAN_MAX_SPEED) return;
      player.velocity.y -= constants.FAN_ACCELERATION * delta;
      if (player.velocity.y < -constants.FAN_MAX_SPEED) {
        player.velocity.y = -constants.FAN_MAX_SPEED;
      }
    }
  }
}

module.exports = FanCurrent;