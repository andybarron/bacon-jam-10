var pixi = require('pixi.js');
var constants = require('../constants');

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
  collidePhysicsTile: function collidePhysicsTile(phys, tileRect, tileData) {
    var overlap = this.getRectangleOverlap(phys.getBounds(), tileRect);
    if (overlap) {
      var charCenter = this.getRectangleCenter(phys.getBounds());
      var tileCenter = this.getRectangleCenter(tileRect);
      var ignoreVertical = tileData.ignoreUp && tileData.ignoreDown;
      var ignoreHorizontal = tileData.ignoreLeft && tileData.ignoreRight;
      if (overlap.width > overlap.height && !tileData.ignoreVertical) { // char moves vertically
        if (tileCenter.y >= charCenter.y && !tileData.ignoreUp) { // move up
          // TODO also set grounded to true???
          phys.grounded = true;
          phys.getBounds().y -= overlap.height;
          if (phys.velocity.y > 0) {
            phys.velocity.y = 0;
          }
        } else if (!tileData.ignoreDown) { // move down
          phys.getBounds().y += overlap.height;
          if (phys.velocity.y < 0) {
            phys.velocity.y = 0;
          }
        }
      } else if (!tileData.ignoreHorizontal) { // char moves horizontally
        if (tileCenter.x >= charCenter.x && !tileData.ignoreLeft) { // move left
          phys.getBounds().x -= overlap.width;
          if (phys.velocity.x > 0) {
            phys.velocity.x = 0;
          }
        } else if (!tileData.ignoreRight) { // move right
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

  resolveEnemyCollision: function resolveEnemyCollision(player, enemy) {
    var charSprite = player.sprite;
    var enemySprite = enemy.Sprite;
    var overlap = this.getRectangleOverlap(player.getBounds(), enemy.getBounds());
    if(overlap && !player.recentHit) {
      var charCenter = this.getRectangleCenter(player.getBounds());
      var enemyCenter = this.getRectangleCenter(enemy.getBounds());
      player.hitPoints-=1;
      player.recentHit = true;

      if(enemyCenter.x > charCenter.x){
        player.velocity.x = -constants.PLAYER_BOUNCE_SPEED_X;
      }
      else{
        player.velocity.x = constants.PLAYER_BOUNCE_SPEED_X;
      }

      if(enemyCenter.y > charCenter.y){
        player.velocity.y = constants.PLAYER_BOUNCE_SPEED_Y;
      }
      else{
        player.velocity.y = -constants.PLAYER_BOUNCE_SPEED_Y;
      }
    }
    return overlap;
  },
}