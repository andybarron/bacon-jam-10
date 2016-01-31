var pixi = require('pixi.js');
var debug = require('./debug');
var howler = require("howler");
var naturalSort = require('javascript-natural-sort');


// TODO support array of paths for different codecs
var nHowls = 0;
function createHowl(path, options) {
  debug('Loading sound: ' + path);
  nHowls++;
  var cfg = {};
  options = options || {};
  for (var prop in (options)) {
    cfg[prop] = options[prop];
  }
  cfg.urls = ['/static/audio/' + path];
  cfg.onload = function() {
    nHowls--;
    debug('Completed sound: ' + path);
  }
  return new howler.Howl(cfg);
}

var sounds = {};
var music = {};

function beginLoadingSounds() {
  sounds.player = {
    jump: createHowl('jump/jump.wav', {volume: 0.33}),
    land: createHowl('jump/landing.wav', {volume: 0.75}),
    attack: createHowl('towelattack/towelhit.wav'),
    attackHit: createHowl('hit/hit_hurt5.wav', {volume: 1.5}),
  };

  music.gameplaySong = createHowl('towel_game.mp3', {loop: true, volume: 0.5});
}

var currentSong = null;
var currentSongName = null;


function onLoadResource(loader, resource) {
  // TODO add loading bar to game!
  debug('Loading resource: ' + resource.url);
}

module.exports = {
  load: function load(callback) {
    debug('Begin assets.load()');
    beginLoadingSounds();
    pixi.loader.add(['/static/atlas.json']);
    pixi.loader.on('progress', onLoadResource);
    pixi.loader.after(function(resource, next) {
      if (resource && resource.texture && resource.texture.baseTexture) {
        resource.texture.baseTexture.scaleMode = pixi.SCALE_MODES.NEAREST;
      }
      debug('Completed resource: ' + resource.url);
      next();
    });
    var soundInterval = setInterval(function() {
      if (nHowls == 0) {
        clearInterval(soundInterval);
        pixi.loader.load(function() {
          debug('Completed assets.load(), firing callback');
          callback();
        });
      }
    }, 50);
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
    for (var texName in pixi.utils.TextureCache) {
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