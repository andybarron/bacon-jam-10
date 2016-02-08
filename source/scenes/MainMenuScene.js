import * as debug from '../debug';
import * as pixi from 'pixi.js';
import * as assets from '../assets';
import * as constants from '../constants';
import * as game from '../game';
import * as keyboard from '../keyboard';
import LevelLoadingScene from './LevelLoadingScene';
import BaseScene from './BaseScene';

export default class MainMenuScene extends BaseScene {
  constructor() {
    super();
    let title = assets.sprite('text/title');
    this.ui.addChild(title);
    title.anchor.x = 0.5;
    title.position = game.display.topCenter;
    let play = new pixi.Text('PRESS [RETURN] TO ENGAGE SANITATION PROCEDURE', {
      font: '20px monospace',
      fill: 0xFF00CC,
    });
    this.ui.addChild(play);
    play.anchor.x = 0.5;
    play.anchor.y = 1;
    play.position = game.display.bottomCenter;
  }
  update(delta) {
    if (keyboard.isKeyPressed(keyboard.RETURN)) {
      return new LevelLoadingScene(0);
    }
    if (keyboard.isKeyPressed(keyboard.SHIFT)) {
      let levelName = prompt("Jump to level?", 'tutorial1');
      return new LevelLoadingScene(levelName);
    }
  }
}
