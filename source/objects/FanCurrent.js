var pixi = require('pixi.js');
var collision = require('../physics/collision');
var constants = require('../constants');

function FanCurrent(bounds) {
  this.bounds = bounds;
}

FanCurrent.prototype = {
  update: function(delta, player) {
    if (player.grounded || !player.gliding) return;
    var overlap = collision.getRectangleOverlap(player.getBounds(), this.bounds);
    if (overlap && overlap.width >= player.getBounds().width/2) {
      player.velocity.y -= constants.FAN_ACCELERATION * delta;
    }
  }
}

module.exports = FanCurrent;