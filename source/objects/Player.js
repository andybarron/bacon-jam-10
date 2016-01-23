var pixi = require('pixi.js');

function Player(sprite) {
  this.sprite = sprite;
  this.speed = 100;
}

Player.prototype = {
  move: function move(x, y) {
    this.sprite.x += x;
    this.sprite.y += y;
  }
};

module.exports = Player;