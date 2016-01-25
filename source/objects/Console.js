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
  check: function(playerRect, textBox, bg) {
    var touching = Boolean(collision.getRectangleOverlap(playerRect, this.bounds));
    if (touching && !this.active) {
      this.active = true;
      textBox.text = this.text;
      if (bg) {
        textBox.updateTransform();
        var box = textBox.getBounds().clone();
        var padding = 20;
        box.x -= padding;
        box.y -= padding;
        box.width += padding*2;
        box.height += padding*2;
        bg.clear();
        bg.beginFill(0x001100);
        bg.drawShape(box);
        bg.endFill();
      }
    } else if (!touching && this.active) {
      this.active = false;
      textBox.text = '';
      if (bg) {
        bg.clear();
      }
    }
  }
}

module.exports = Console;
