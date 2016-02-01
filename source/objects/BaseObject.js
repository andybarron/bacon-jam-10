var EventEmitter = require('eventemitter3');
var extend = require('../extend');
var assets = require('../assets');

function BaseObject() {
  EventEmitter.call(this);
}

extend(EventEmitter, BaseObject, {
  linkEventToSound: function linkEventToSound(event, sound) {
    this.on(event, function() {
      assets.playSound(sound);
    })
  },
});

module.exports = BaseObject;