var pixi = require('pixi.js');

function Player(x, y, sprite) {
  this.sprite = sprite;
  this.sprite.x = x;
  this.sprite.y = y;
  this.sprite.anchor = new pixi.Point(0.5, 0.5);
  this.momentum = 5
  this.MAX_VELOCITY = 200;
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