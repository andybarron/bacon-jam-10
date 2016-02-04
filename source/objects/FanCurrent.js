import * as pixi from 'pixi.js';
import * as collision from '../physics/collision';
import * as constants from '../constants';
import * as assets from '../assets';
import ColliderObject from './ColliderObject';
import {delta} from '../game';

export default class FanCurrent extends ColliderObject {
  constructor(bounds) {
    super(bounds);
    this.sprite = assets.movieClip('objects/current/');
    this.sprite.x = bounds.x;
    this.sprite.y = bounds.y;
    this.sprite.width = bounds.width;
    this.sprite.height = bounds.height;
    this.sprite.loop = true;
    this.sprite.fps = 20;
    this.sprite.play();
    this.on('collide-start', (player, overlap) => {
      this.liftPlayer(player, overlap);
    });
    this.on('collide-continue', (player, overlap) => {
      this.liftPlayer(player, overlap);
    });
  }
  liftPlayer(player, overlap) {
    if (player.lifted || player.grounded || !player.gliding || !overlap
        || overlap.width < player.getBounds().width/2
        || player.velocity.y < -constants.FAN_MAX_SPEED) {
      return;
    }
    player.lifted = true;
    player.velocity.y -= constants.FAN_ACCELERATION * delta;
    if (player.velocity.y < -constants.FAN_MAX_SPEED) {
      player.velocity.y = -constants.FAN_MAX_SPEED;
    }
  }
}
