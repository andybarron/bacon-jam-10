var pixi = require('pixi.js');
var debug = require('./debug');

var sprites = [
  {name: 'avatar', url: "/graphics/space_guy.png"},
  {name: 'alien', url: "/graphics/alien.png"},
  {name: 'pause', url: "/graphics/text/pause.png"},
];
// TODO also load SOUND!!!

function addAnimationSet(name, url, start, end) {
  for (var i = start; i <= end; i++) {
    sprites.push({name: name.replace('#', i), url: url.replace('#', i)});
  }
}

addAnimationSet('swishy_attack_#', '/graphics/swishy/attack/sprite_#.png', 1, 8);
addAnimationSet('swishy_idle_#', '/graphics/swishy/idle/sprite_#.png', 1, 8);

function onLoadResource(loader, resource) {
  // TODO add loading bar to game!
  debug('Loading ' + resource.url + '...');
}

module.exports = {
  load: function load(callback) {
    pixi.loader.add(sprites);
    pixi.loader.on('progress', onLoadResource);
    pixi.loader.after(function(resource, next) {
      if (resource && resource.texture && resource.texture.baseTexture) {
        resource.texture.baseTexture.scaleMode = pixi.SCALE_MODES.NEAREST;
      }
      debug('Done loading ' + resource.url);
      next();
    });
    pixi.loader.load(callback);
  },
  texture: function texture(name) {
    return pixi.loader.resources[name].texture;
  },
  sprite: function sprite(name) {
    return new pixi.Sprite(this.texture(name));
  },
  sound: function sound(name) {
    // TODO
  },
}