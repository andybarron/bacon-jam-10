let pixi = require('pixi.js');
let constants = require('../constants');


  // works on pixi.Rectangle and pixi.Sprite
  export function getRectangleCenter(r) {
    return {
      x: r.x + r.width/2.0,
      y: r.y + r.height/2.0,
    };
  }
  export function getRectangleOverlap(a, b) {
    let l = Math.max(a.x, b.x); // rightmost left
    let r = Math.min(a.x + a.width, b.x + b.width); // leftmost right
    let t = Math.max(a.y, b.y); // lowest top
    let bot = Math.min(a.y + a.height, b.y + b.height); // highest bottom
    let result = null;
    if (r > l && bot > t) {
      result = new pixi.Rectangle(l, t, r - l, bot - t);
    }
    return result;
  }
  // TODO: platforms/tiles can limit collision direction to avoid
  //       "catching" on walls/floors
  export function collidePhysicsTile(phys, tileRect, tileData) {
    let overlap = getRectangleOverlap(phys.getBounds(), tileRect);
    if (overlap) {
      let charCenter = getRectangleCenter(phys.getBounds());
      let tileCenter = getRectangleCenter(tileRect);
      let ignoreVertical = tileData.ignoreUp && tileData.ignoreDown;
      let ignoreHorizontal = tileData.ignoreLeft && tileData.ignoreRight;
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
  }
  export function resolveTileCollision(player, tileRect) {
    let charSprite = player.sprite;
    charSprite.updateTransform();
    let overlap = getRectangleOverlap(charSprite.getBounds(), tileRect);
    if (overlap) {
      let charCenter = getRectangleCenter(charSprite.getBounds());
      let tileCenter = getRectangleCenter(tileRect);
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
  }

  export function resolveEnemyCollision(player, enemy) {
    let charSprite = player.sprite;
    let enemySprite = enemy.Sprite;
    let overlap = getRectangleOverlap(player.getBounds(), enemy.getBounds());
    if(overlap && !player.recentHit) {
      let charCenter = getRectangleCenter(player.getBounds());
      let enemyCenter = getRectangleCenter(enemy.getBounds());
      player.hitPoints-=1;
      player.recentHit = true;
      player.grounded = false;

      if(enemyCenter.x > charCenter.x){
        player.velocity.x = -constants.PLAYER_BOUNCE_SPEED_X;
      }
      else{
        player.velocity.x = constants.PLAYER_BOUNCE_SPEED_X;
      }

      player.velocity.y = -constants.PLAYER_BOUNCE_SPEED_Y;
      player.translate(0, -2);
    }
    return overlap;
  }
