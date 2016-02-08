import * as pixi from 'pixi.js';
import * as assets from '../assets';
import * as collision from '../physics/collision';
import * as game from '../game';
import ColliderObject from './ColliderObject';

export default class Console extends ColliderObject {
  constructor(bounds, text, textBox, bg) {
    super(bounds);
    this.sprite = assets.sprite('objects/console');
    this.sprite.x = bounds.x;
    this.sprite.y = bounds.y;
    this.sprite.width = bounds.width;
    this.sprite.height = bounds.height;
    this.text = text;
    this.textBox = textBox;
    this.bg = bg;
    this.on('collide-start', () => {
      this.textBox.text = this.text;
      this.textBox.visible = true;
      this.bg.visible = true;
    });
    this.on('collide-end', () => {
      this.textBox.visible = false;
      this.bg.visible = false;
    });
  }
}
