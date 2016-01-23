var pixi = require('pixi.js');

function Player(sprite) {
  this.sprite = sprite;
  this.sprite.anchor = new pixi.Point(0.5, 0.5);
  this.speed = 100;
  this.velocity = {
    x: 0.0,
    y: 0.0
  };
  this.isJumping = false;
}

Player.prototype = {
  move: function move(delta) {
    this.sprite.x += this.velocity.x * delta;
    this.sprite.y += this.velocity.y * delta;
  },
  update: function update(delta) {
    this.move(delta);

    if (this.velocity.x < 0) {
      this.sprite.scale.x = -1;
    }
    else if (this.velocity.x > 0) {
      this.sprite.scale.x = 1;
    }
  }
};

module.exports = Player;