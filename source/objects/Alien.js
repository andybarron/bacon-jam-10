var pixi = require('pixi.js');

function Alien(x, y, sprite, player) {
  this.sprite = sprite;
  this.sprite.x = x;
  this.sprite.y = y;
  this.sprite.anchor = new pixi.Point(0.5, 0.5);
  this.speed = 50;
  this.velocity = {
    x: this.speed,
    y: 0.0
  };
  this.player = player;
}

Alien.prototype = {
  move: function move(delta) {
    this.sprite.x += this.velocity.x * delta;
    this.sprite.y += this.velocity.y * delta;
  },
  update: function update(delta) {
    if (this.player.sprite.x < this.sprite.x) {
      this.velocity.x = -this.speed;
    }
    else if (this.player.sprite.x > this.sprite.x) {
      this.velocity.x = this.speed;
    }
    
    this.move(delta);

    if (this.velocity.x > 0) {
      this.sprite.scale.x = -1;
    }
    else if (this.velocity.x < 0) {
      this.sprite.scale.x = 1;
    }
  }
};

module.exports = Alien;