var pixi = require('pixi.js');
var assets = require('../assets');
var collision = require('../physics/collision');
var game = require('../game');

function Console(bounds, text) {
  this.bounds = bounds;
  this.sprite = assets.sprite('objects/console');
  this.sprite.x = bounds.x;
  this.sprite.y = bounds.y;
  this.sprite.width = bounds.width;
  this.sprite.height = bounds.height;
  this.text = text;
  this.active = false;
  this.lastBounds = null;
}

Console.prototype = {
  check: function(playerRect, textBox, bg) {
    var touching = Boolean(collision.getRectangleOverlap(playerRect, this.bounds));
    if (touching) {
      if (!this.active) {
        this.active = true;
        textBox.text = this.text;
      }
      if (bg) {
        textBox.updateTransform();
        var box = textBox.getBounds();
        box = game.worldRectFromScreen(box);
        var padding = 20;
        box.x -= padding;
        box.y -= padding;
        box.width += padding*2;
        box.height += padding*2;
        bg.x = box.x
        bg.y = box.y;
        bg.width = box.width;
        bg.height = box.height;
        bg.alpha = 0.5;
      }
    } else if (!touching && this.active) {
      this.active = false;
      textBox.text = '';
      if (bg) {
        bg.alpha = 0;
      }
    }
  }
}

module.exports = Console;
