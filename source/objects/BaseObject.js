var EventEmitter = require('eventemitter3');
var assets = require('../assets');

module.exports = class BaseObject extends EventEmitter {
  constructor() {
    super()
  }
  linkEventToSound(event, sound) {
    this.on(event, function() {
      assets.playSound(sound);
    })
  }
}