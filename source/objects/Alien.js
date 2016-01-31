var pixi = require('pixi.js');
var extend = require('../extend');
var PhysicsObject = require('../physics/PhysicsObject');
var keyboard = require('../keyboard');
var constants = require('../constants');
var assets = require('../assets');

var WIDTH = constants.TILE_SIZE * .75;
var HEIGHT = constants.TILE_SIZE;
var PADDING = constants.TILE_SIZE - WIDTH;

function Alien(x, y, player) {
  PhysicsObject.call(this, x, y, WIDTH, HEIGHT, PADDING);
  this.player = player;
  this.speed = 75;
  var sprite = assets.movieClip('cleanbot/idle/', {
    animationSpeed: 0.1,
    loop: true,
  });
  sprite.play();
  this.setSprite(sprite, PhysicsObject.Align.BOTTOM_LEFT);
}

extend(PhysicsObject, Alien, {
  update: function update(delta, game) {
    this.updatePhysics(delta, game.tileGrid);
    this.chasePlayer(delta);
  },
  chasePlayer: function chasePlayer(delta) {
    var position = this.getPosition();
    var playerPosition = this.player.getPosition();
    if (playerPosition.x < position.x) {
      this.velocity.x = -this.speed;
    }
    else if (playerPosition.x > position.x) {
      this.velocity.x = this.speed;
    }
    if (Math.abs(position.x - playerPosition.x)
        <= this.velocity.x * delta) {
      this.translate(playerPosition.x - position.x, 0);
      this.velocity.x = 0;
    }
  }  
});

module.exports = Alien;