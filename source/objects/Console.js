var pixi = require('pixi.js');
var assets = require('../assets');
var collision = require('../physics/collision');

function Console(bounds, text) {
  this.bounds = bounds;
  this.sprite = assets.sprite('console');
  this.sprite.x = bounds.x;
  this.sprite.y = bounds.y;
  this.sprite.width = bounds.width;
  this.sprite.height = bounds.height;
  this.text = text;
  this.active = false;
}

Console.prototype = {
  check: function(playerRect, textBox) {
    var touching = Boolean(collision.getRectangleOverlap(playerRect, this.bounds));
    if (touching && !this.active) {
      this.active = true;
      textBox.text = this.text;
    } else if (!touching && this.active) {
      this.active = false;
      textBox.text = '';
    }
  }
}

module.exports = Console;
