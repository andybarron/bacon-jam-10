var pixi = require('pixi.js');
var extend = require('../extend');
var PhysicsObject = require('../physics').PhysicsObject;
var collision = require('../physics').collision;

function Character(w, h) {
  PhysicsObject.call(this, 0, 0, w, h);
  this.container = new pixi.Container();
}

extend(PhysicsObject, Character, {
  updateSpritePosition: function updateSpritePosition() {
    var center = collision.getRectangleCenter(this.bounds);
    this.container.x = center.x;
    this.container.y = center.y;
  },
  setSprite: function setSprite(spr) {
    // TODO center? yes? no? maybe?
    spr.anchor.x = 0.5;
    spr.anchor.y = 0.5;
    this.container.removeChildren();
    this.container.addChild(spr);
    spr.x = 0;
    spr.y = 0;
  },
});