var pixi = require('pixi.js');

function Heart(x, y, sprite) {
  this.sprite = sprite;
  this.sprite.x = x;
  this.sprite.y = y;
  this.sprite.anchor = new pixi.Point(0.5, 0.5);
  this.speed = 50;
  this.velocity = {
    x: 0.0,
    y: 0.0
  };
}

Heart.prototype = {
  move: function move(delta) {

  },
  update: function update(delta) {

  }
};

module.exports = Heart;