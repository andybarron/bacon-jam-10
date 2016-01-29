var pixi = require('pixi.js');
var debug = require('./debug');
var howler = require("howler");
var naturalSort = require('javascript-natural-sort');


// TODO support array of paths for different codecs
// TODO add preload hooks here?
function createHowl(path, options) {
  var cfg = {};
  options = options || {};
  for (var prop in (options)) {
    cfg[prop] = options[prop];
  }
  cfg.urls = ['/static/audio/' + path];
  return new howler.Howl(cfg);
}
var sounds = {
  player: {
    jump: createHowl('jump/jump.wav', {volume: 0.33}),
    attack: createHowl('towelattack/towelhit.wav'),
    attackHit: createHowl('hit/hit_hurt5.wav'),
    fly: createHowl('flying.mp3'),
    hide: createHowl('hiding.mp3'),
    ouch: createHowl('ouch.mp3'),
  }
}

var currentSong = null;
var currentSongName = null;
var music = {
  gameplaySong: createHowl('towel_game.mp3', {loop: true, volume: 0.5}),
} // TODO preload sounds as well

function onLoadResource(loader, resource) {
  // TODO add loading bar to game!
  debug('Loading ' + resource.url + '...');
}

module.exports = {
  load: function load(callback) {
    pixi.loader.add(['/static/atlas.json']);
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
    return pixi.Texture.fromFrame(name);
  },
  sprite: function sprite(name) {
    return pixi.Sprite.fromFrame(name);
  },
  movieClip: function movieClip(clipName, options) {
    var names = [];
    options = options || {};
    for (var texName in pixi.TextureCache) {
      // check if texName starts with clipName
      if (texName.lastIndexOf(clipName, 0) == 0) {
        names.push(texName);
      }
    }
    names.sort(naturalSort); // avoid numbering issues!
    var textures = names.map(this.texture, this);
    var clip = new pixi.extras.MovieClip(textures);
    for (var prop in options) {
      clip[prop] = options[prop];
    }
    return clip;
  },
  sounds: sounds,
  playMusic: function playMusic(songName) {
    if (songName != currentSongName) {
      this.stopMusic();
      currentSongName = songName;
      currentSong = music[songName];
      if (currentSong) {
        // TODO error on non-existent song
        currentSong.play();
      }
    }
  },
  stopMusic: function stopMusic() {
    if (currentSong) {
      currentSong.stop();
      currentSong = null;
      currentSongName = null;
    }
  }
}