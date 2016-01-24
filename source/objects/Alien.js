var pixi = require('pixi.js');
var extend = require('../extend');
var PhysicsObject = require('../physics/PhysicsObject');
var keyboard = require('../keyboard');
var constants = require('../constants');

function Alien(x, y, width, height, player) {
  PhysicsObject.call(this, x, y, width, height);
  this.player = player;
  this.speed = 75;
  var sprite = new pixi.Sprite(pixi.loader.resources.alien.texture);
  this.setSprite(sprite, true);
}

extend(PhysicsObject, Alien, {
  chasePlayer: function chasePlayer(delta) {
    if (this.player.getPosition().x < this.getPosition().x) {
      this.velocity.x = -this.speed;
    }
    else if (this.player.getPosition().x > this.getPosition().x) {
      this.velocity.x = this.speed;
    }
  }  
});

module.exports = Alien;