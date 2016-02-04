import {Rectangle} from 'pixi.js';
import * as collision from '../physics/collision';
import BaseObject from './BaseObject';

export default class ColliderObject extends BaseObject {
  constructor(bounds = new Rectangle()) {
    super();
    this.bounds = bounds;
    this.touching = new Set();
    this.enableCollision = true;
  }
  testCollision(target, targetBounds) {
    if (!this.enableCollision) return null;
    let overlap = collision.getRectangleOverlap(this.bounds, targetBounds);
    let contained = this.touching.has(target);
    if (overlap && !contained) {
      this.emit('collide-start', target, overlap);
      this.touching.add(target);
    } else if (overlap && contained) {
      this.emit('collide-continue', target, overlap);
    } else if (!overlap && contained) {
      this.emit('collide-end', target);
      this.touching.delete(target);
    }
    return overlap;
  }
}