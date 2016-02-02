import EventEmitter from 'eventemitter3';
import * as assets from '../assets';

export default class BaseObject extends EventEmitter {
  constructor() {
    super()
  }
  linkEventToSound(event, sound) {
    this.on(event, function() {
      assets.playSound(sound);
    })
  }
}