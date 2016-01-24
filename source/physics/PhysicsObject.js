var pixi = require('pixi.js');
var constants = require('../constants');
var collision = require('./collision');

function PhysicsObject(x, y, w, h) {
  this.velocity = new pixi.Point(0, 0);
  this.grounded = true;
  this.gravityScale = 1.0;
  this.bounds = new pixi.Rectangle(x, y, w, h);
}

PhysicsObject.prototype = {
  translate: function translate(dx, dy) {
    this.bounds.x += dx;
    this.bounds.y += dy;
  },
  setPosition: function setPosition(x, y) {
    this.bounds.x = x;
    this.bounds.y = y;
  },
  updatePhysics: function(delta, tiles) {
    this.grounded = false;
    this.velocity.y += constants.GRAVITY * this.gravityScale * delta;
    this.translate(this.velocity.x * delta, this.velocity.y * delta);
    if (tiles) {
      var self = this;
      tiles.forEach(function(tile) {
        collision.collidePhysicsTile(self, tile);
      });
    }
  },
};

module.exports = PhysicsObject;