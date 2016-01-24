var pixi = require('pixi.js');
var constants = require('../constants');
var collision = require('./collision');

function PhysicsObject(x, y, w, h) {
  this.velocity = new pixi.Point(0, 0);
  this.grounded = true;
  this.gravityScale = 1.0;
  this._bounds = new pixi.Rectangle(x, y, w, h);
  this.container = new pixi.Container();
  this.flipLeft = true;
  this.centered = false;
}

PhysicsObject.prototype = {
  getBounds: function getBounds() {
    return this._bounds;
  },
  updateContainer: function updateContainer() {
    if (this.flipLeft) {
      if (this.velocity.x > 0) {
        this.container.scale.x = 1;
      } else if (this.velocity.x < 0) {
        this.container.scale.x = -1;
      }
    }
    this.container.x = this._bounds.x;
    if (this.container.scale.x == -1) {
      // TODO this is hacky but it works
      this.container.x += this._bounds.width;
    }
    this.container.y = this._bounds.y;
  },
  setSprite: function setSprite(spr, center) {
    // TODO center? yes? no? maybe?
    if (center) {
      this.centered = true;
      spr.anchor.x = 0.5;
      spr.anchor.y = 0.5;
      spr.x = this._bounds.width / 2.0;
      spr.y = this._bounds.height / 2.0;
    }
    this.container.removeChildren();
    this.container.addChild(spr);
  },
  translate: function translate(dx, dy) {
    this._bounds.x += dx;
    this._bounds.y += dy;
    this.updateContainer();
  },
  setPosition: function setPosition(x, y) {
    this._bounds.x = x;
    this._bounds.y = y;
    this.updateContainer();
  },
  getPosition: function getPosition() {
    if (this.centered)
      return new pixi.Point(this._bounds.x + this._bounds.width / 2.0, this._bounds.y + this._bounds.height);
    else 
      return new pixi.Point(this._bounds.x, this._bounds.y);
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
    this.updateContainer();
  },
};

module.exports = PhysicsObject;