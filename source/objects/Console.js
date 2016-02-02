import * as pixi from 'pixi.js';
import * as assets from '../assets';
import * as collision from '../physics/collision';
import * as game from '../game';
import ColliderObject from './ColliderObject';

export default class Console extends ColliderObject {
  constructor(bounds, text, textBox, bg, player) {
    super(bounds);
    this.sprite = assets.sprite('objects/console');
    this.sprite.x = bounds.x;
    this.sprite.y = bounds.y;
    this.sprite.width = bounds.width;
    this.sprite.height = bounds.height;
    this.text = text;
    this.textBox = textBox;
    this.bg = bg;
    this.player = player;
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
  update() {
    this.testCollision(this.player, this.player.getBounds());
  }
}

// import * as pixi from 'pixi.js';
// import * as assets from '../assets';
// import * as collision from '../physics/collision';
// import * as game from '../game';

// function Console(bounds, text) {
//   this.bounds = bounds;
//   this.sprite = assets.sprite('objects/console');
//   this.sprite.x = bounds.x;
//   this.sprite.y = bounds.y;
//   this.sprite.width = bounds.width;
//   this.sprite.height = bounds.height;
//   this.text = text;
//   this.active = false;
//   this.lastBounds = null;
// }

// Console.prototype = {
//   check: function(playerRect, textBox, bg) {
//     let touching = Boolean(collision.getRectangleOverlap(playerRect, this.bounds));
//     if (touching) {
//       if (!this.active) {
//         this.active = true;
//         textBox.text = this.text;
//       }
//       if (bg) {
//         textBox.updateTransform();
//         let box = textBox.getBounds();
//         box = game.worldRectFromScreen(box);
//         let padding = 20;
//         box.x -= padding;
//         box.y -= padding;
//         box.width += padding*2;
//         box.height += padding*2;
//         bg.x = box.x
//         bg.y = box.y;
//         bg.width = box.width;
//         bg.height = box.height;
//         bg.alpha = 0.5;
//       }
//     } else if (!touching && this.active) {
//       this.active = false;
//       textBox.text = '';
//       if (bg) {
//         bg.alpha = 0;
//       }
//     }
//   }
// }

// export default Console;
