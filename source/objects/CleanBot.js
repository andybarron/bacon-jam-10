import * as pixi from 'pixi.js';
import PhysicsObject from '../physics/PhysicsObject';
import * as keyboard from '../keyboard';
import * as constants from '../constants';
import * as assets from '../assets';

let WIDTH = constants.TILE_SIZE * .75;
let HEIGHT = constants.TILE_SIZE;
let PADDING = constants.TILE_SIZE - WIDTH;

export default class CleanBot extends PhysicsObject {
  constructor(x, y, player) {
    super(x, y, WIDTH, HEIGHT, PADDING);
    this.player = player;
    this.speed = 75;
    let sprite = assets.movieClip('cleanbot/idle/', {
      animationSpeed: 0.1,
      loop: true,
    });
    this.deathSprite = assets.movieClip('cleanbot/die/', {
      loop: false,
    })
    this.deathSprite.fps = 12;
    sprite.play();
    this.setSprite(sprite, PhysicsObject.Align.BOTTOM_LEFT);
  }
  update(delta, game) {
    this.updatePhysics(delta, game.tileGrid);
    this.chasePlayer(delta);
  }
  chasePlayer(delta) {
    let position = this.getPosition();
    let playerPosition = this.player.getPosition();
    if (playerPosition.x < position.x) {
      this.velocity.x = -this.speed;
    }
    else if (playerPosition.x > position.x) {
      this.velocity.x = this.speed;
    }
    if (Math.abs(position.x - playerPosition.x)
        <= this.velocity.x * delta) {
      this.translate(playerPosition.x - position.x, 0);
      this.velocity.x = 0;
    }
  }
}
