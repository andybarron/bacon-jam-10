var pixi = require('pixi.js');
var extend = require('../extend');
var PhysicsObject = require('../physics/PhysicsObject');
var keyboard = require('../keyboard');
var constants = require('../constants');
var assets = require('../assets');

function Alien(x, y, player) {
  PhysicsObject.call(this, x, y, 21, 32);
  this.player = player;
  this.speed = 75;
  var sprite = assets.sprite('alien');
  this.setSprite(sprite, true);
}

extend(PhysicsObject, Alien, {
  update: function update(delta, game) {
    this.updatePhysics(delta, game.platforms);
    this.chasePlayer(delta);
  },
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