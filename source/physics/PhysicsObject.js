import * as pixi from 'pixi.js';
import * as constants from '../constants';
import * as collision from './collision';
import BaseObject from '../objects/BaseObject';

let TILE = constants.TILE_SIZE;
let tempRect = new pixi.Rectangle();
let tempData = {};

let Align = {
  TOP_LEFT:      new pixi.Point(0.0, 0.0),
  TOP_CENTER:    new pixi.Point(0.5, 0.0),
  TOP_RIGHT:     new pixi.Point(1.0, 0.0),
  MIDDLE_LEFT:   new pixi.Point(0.0, 0.5),
  MIDDLE_CENTER: new pixi.Point(0.5, 0.5),
  MIDDLE_RIGHT:  new pixi.Point(1.0, 0.5),
  BOTTOM_LEFT:   new pixi.Point(0.0, 1.0),
  BOTTOM_CENTER: new pixi.Point(0.5, 1.0),
  BOTTOM_RIGHT:  new pixi.Point(1.0, 1.0),
}
Align.CENTER = Align.MIDDLE_CENTER;

export default class PhysicsObject extends BaseObject {
  // TODO change x/y/w/h to `bounds = new Pixi.Rectangle()`
  constructor(x, y, w, h, spriteWidthPadding = 0) {
    super();
    this.velocity = new pixi.Point(0, 0);
    this.grounded = true;
    this.gravityScale = 1.0;
    this._bounds = new pixi.Rectangle(x, y, w, h);
    this.container = new pixi.Container();
    this.faceVelocityX = true;
    this.spriteAnchor = null;
    this.padding = (spriteWidthPadding || 0)/2;
  }
  getBounds() {
    return this._bounds;
  }
  getWidth() {
    return this._bounds.width;
  }
  getHeight() {
    return this._bounds.height;
  }
  updateContainer() {
    if (this.faceVelocityX && this.velocity.x != 0 &&
        Math.sign(this.velocity.x) != Math.sign(this.container.scale.x)) {
      this.container.scale.x *= -1;
    }
    this.container.x = this._bounds.x - this.padding;
    if (this.container.scale.x < 0) {
      this.container.x = this._bounds.x + this._bounds.width + this.padding;
    }
    this.container.y = this._bounds.y;
    this.container.x = Math.round(this.container.x);
    this.container.y = Math.round(this.container.y);
  }
  setSprite(spr) {
    let anchor = this.spriteAnchor;
    spr.anchor.copy(anchor);
    spr.x = (this._bounds.width + this.padding * 2) * anchor.x;
    spr.y = this._bounds.height * anchor.y;
    this.container.removeChildren();
    this.container.addChild(spr);
    this.spriteAnchor = anchor;
  }
  setMovieClip(clip, restart) {
    this.setSprite(clip);
    if (restart) {
      clip.gotoAndPlay(0);
    }
  }
  translate(dx, dy) {
    this._bounds.x += dx;
    this._bounds.y += dy;
    this.updateContainer();
  }
  setPosition(x, y) {
    this._bounds.x = x;
    this._bounds.y = y;
    this.updateContainer();
  }
  getCenter() {
    return new pixi.Point(
      this._bounds.x + this._bounds.width/2,
      this._bounds.y + this._bounds.height/2);
  }
  setCenter() {
    if (arguments.length == 2) {
      let x = arguments[0];
      let y = arguments[1];
      this.setPosition(x - this._bounds.width/2, y - this._bounds.height/2);
    } else if (arguments.length == 1) {
      let p = arguments[0];
      return this.setCenter(p.x, p.y);
    } else {
      throw new Error(
        'Wrong number of args to setCenter; expected 1 or 2 but found '
        + arguments.length);
    }
  }
  getCenterX() {
    return this._bounds.x + this._bounds.width/2;
  }
  getCenterY() {
    return this._bounds.y + this._bounds.height/2;
  }
  getPosition() {
      return new pixi.Point(this._bounds.x, this._bounds.y);
  }
  updatePhysics(delta, tiles) {
    let wasGrounded = this.grounded;
    this.grounded = false;
    this.velocity.y += constants.GRAVITY * this.gravityScale * delta;
    this.translate(this.velocity.x * delta, this.velocity.y * delta);
    if (tiles) {
      this.updateWorldCollisions(tiles);
    }
    if (this.grounded != wasGrounded) {
      this.emit(this.grounded ? 'grounded' : 'ungrounded');
    }
    this.updateContainer();
  }
  updateWorldCollisions(tileGrid) {
    let bounds = this.getBounds();
    let minX = Math.floor(bounds.x/TILE);
    let maxX = Math.ceil((bounds.x + bounds.width)/TILE);
    let minY = Math.floor(bounds.y/TILE);
    let maxY = Math.ceil((bounds.y + bounds.height)/TILE);
    for (let ix = minX; ix < maxX; ix++) {
      for (let iy = minY; iy < maxY; iy++) {
        let solid = tileGrid.get(ix, iy);
        // if (!solid) continue;
        tempRect.x = ix * TILE;
        tempRect.y = iy * TILE;
        tempRect.width = TILE;
        tempRect.height = TILE;
        if (!solid) continue;
        tempData.ignoreUp = tileGrid.get(ix, iy - 1);
        tempData.ignoreDown = tileGrid.get(ix, iy + 1);
        tempData.ignoreLeft = tileGrid.get(ix - 1, iy);
        tempData.ignoreRight = tileGrid.get(ix + 1, iy);
        collision.collidePhysicsTile(this, tempRect, tempData);
      }
    }
    this.updateContainer();
  }
}

PhysicsObject.Align = Align;