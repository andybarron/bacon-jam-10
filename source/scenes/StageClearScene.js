import * as pixi from 'pixi.js';
import * as assets from '../assets';
import * as constants from '../constants';
import * as game from '../game';
import * as keyboard from '../keyboard';
import BaseScene from './BaseScene';
import MainMenuScene from './MainMenuScene';
import SharpText from '../interface/SharpText';

export default class StageClearScene extends BaseScene {
  constructor() {
    super();
    let title = assets.sprite('text/clear');
    this.ui.addChild(title);
    title.anchor.x = 0.5;
    title.position = game.display.topCenter;
    let play = new SharpText('PRESS [RETURN] TO RETURN TO BREAK ROOM', {
      font: '20px monospace',
      fill: 0x00CCFF,
    });
    this.ui.addChild(play);
    play.anchor.x = 0.5;
    play.anchor.y = 4;
    play.position = game.display.bottomCenter;
  }
  update(delta) {
    this.getStage().update(delta);
    if (keyboard.isKeyPressed(keyboard.RETURN)) {
      return new MainMenuScene();
    }
  }
}