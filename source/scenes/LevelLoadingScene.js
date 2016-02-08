import BaseScene from './BaseScene';
import GameplayScene from './GameplayScene';
import {getLevelInfo} from '../assets';
import parse from '../levels/parse';
import * as qajax from 'qajax';

export default class extends BaseScene {
  constructor(level) {
    super();
    let levelInfo = level;
    if (typeof levelInfo != 'object') {
      levelInfo = getLevelInfo(level); 
    }
    this.nextScene = null;
    qajax.getJSON(levelInfo.url)
      .then((data) => {
        this.nextScene = new GameplayScene(parse(data), levelInfo);
      })
      .catch((e) => {
        debug.error(`Failed to load level: ${level}`, e);
      });
  }
  update(delta) {
    return this.nextScene;
  }
}