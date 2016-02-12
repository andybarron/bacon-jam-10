import {Text} from 'pixi.js';
import * as game from '../game';

export default class extends Text {
  constructor() {
    super(...arguments);
  }
  update() {
    if (game.scale != this.resolution) {
      // Render at native resolution, regardless of game scale
      this.resolution = game.scale;
      this.dirty = true;
    }
  }
}