var pixi = require('pixi.js');

module.exports = {
  // works on pixi.Rectangle and pixi.Sprite
  getRectangleCenter: function getRectangleCenter(r) {
    return {
      x: r.x + r.width/2.0,
      y: r.y + r.height/2.0,
    };
  },
  getRectangleOverlap: function getRectangleOverlap(a, b) {
    var l = Math.max(a.x, b.x); // rightmost left
    var r = Math.min(a.x + a.width, b.x + b.width); // leftmost right
    var t = Math.max(a.y, b.y); // lowest top
    var b = Math.min(a.y + a.height, b.y + b.height); // highest bottom
    var result = null;
    if (r > l && b > t) {
      result = new pixi.Rectangle(l, t, r - l, b - t);
    }
    return result;
  },
  getSpriteOverlap: function getSpriteOverlap(a, b) {
    a.updateTransform();
    b.updateTransform();
    return this.getRectangleOverlap(a.getBounds(), b.getBounds());
  },
  // TODO: platforms/tiles can limit collision direction to avoid
  //       "catching" on walls/floors
  collidePhysicsTile: function collidePhysicsTile(phys, tileRect) {
    var overlap = this.getRectangleOverlap(phys.getBounds(), tileRect);
    if (overlap) {
      var charCenter = this.getRectangleCenter(phys.getBounds());
      var tileCenter = this.getRectangleCenter(tileRect);
      if (overlap.width > overlap.height) { // char moves vertically
        if (tileCenter.y >= charCenter.y) {
          // TODO also set grounded to true???
          phys.grounded = true;
          phys.getBounds().y -= overlap.height;
          if (phys.velocity.y > 0) {
            phys.velocity.y = 0;
          }
        } else {
          phys.getBounds().y += overlap.height;
          if (phys.velocity.y < 0) {
            phys.velocity.y = 0;
          }
        }
      } else { // char moves horizontally
        phys.velocity.x = 0;
        if (tileCenter.x >= charCenter.x) {
          phys.getBounds().x -= overlap.width;
          if (phys.velocity.x > 0) {
            phys.velocity.x = 0;
          }
        } else {
          phys.getBounds().x += overlap.width;
          if (phys.velocity.x < 0) {
            phys.velocity.x = 0;
          }
        }
      }
    }
    return overlap;
  },
  resolveTileCollision: function resolveTileCollision(player, tileRect) {
    var charSprite = player.sprite;
    charSprite.updateTransform();
    var overlap = this.getRectangleOverlap(charSprite.getBounds(), tileRect);
    if (overlap) {
      var charCenter = this.getRectangleCenter(charSprite.getBounds());
      var tileCenter = this.getRectangleCenter(tileRect);
      if (overlap.width > overlap.height) { // char moves vertically
        if (tileCenter.y >= charCenter.y) {
          // TODO also set grounded to true???
          player.grounded = true;
          charSprite.y -= overlap.height;
          if (player.velocity.y > 0) {
            player.velocity.y = 0;
          }
        } else {
          charSprite.y += overlap.height;
          if (player.velocity.y < 0) {
            player.velocity.y = 0;
          }
        }
      } else { // char moves horizontally
        player.velocity.x = 0;
        if (tileCenter.x >= charCenter.x) {
          charSprite.x -= overlap.width;
          if (player.velocity.x > 0) {
            player.velocity.x = 0;
          }
        } else {
          charSprite.x += overlap.width;
          if (player.velocity.x < 0) {
            player.velocity.x = 0;
          }
        }
      }
    }
    return overlap;
  },
}