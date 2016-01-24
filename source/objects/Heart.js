var pixi = require('pixi.js');
var extend = require('../extend');
var PhysicsObject = require('../physics/PhysicsObject');
var constants = require('../constants');
var assets = require('../assets');



function Heart(x, y) {
  PhysicsObject.call(this, x, y, 33, 32);
  this.healthSprite = assets.sprite('heart');
  this.emptySprite = assets.sprite('empty_heart');
  this.empty = false;
  this.setSprite(this.healthSprite, true);
}

extend(PhysicsObject, Heart, {
  update: function update(delta, game, modifier) {
    var temp_x = game.world.x;
    var temp_y = game.world.y;

    var new_x = -temp_x + (40 * (modifier + 1));
    var new_y = -temp_y + 100;

    this.setPosition(new_x, new_y);
  },
  performActions: function performActions(delta, game) {

  },
  removeInactiveSprites: function removeInactiveSprites() {

  }
});

module.exports = Heart;