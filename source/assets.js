var pixi = require('pixi.js');
var debug = require('./debug');
var howler = require("howler");
var naturalSort = require('javascript-natural-sort');
var qajax = require('qajax');

// TODO support array of paths for different codecs
var nHowls = -1;
function createHowl(cfg) {
  var path = cfg.urls.join(', ');
  debug('Loading audio: ' + path);
  nHowls++;
  cfg.onload = function() {
    nHowls--;
    debug('Completed audio: ' + path);
  }
  return new howler.Howl(cfg);
}

var sounds = {};

function beginLoadingSounds() {
  debug('Fetching sound preload list');
  qajax.getJSON('/sounds.json')
    .then(function(data) {
      debug('Got sound preload list, loading sounds');
      nHowls = 0;
      for (var soundKey in data) {
        var info = data[soundKey];
        sounds[soundKey] = createHowl({urls: info.urls});
      }
    })
    .catch(function(e) {
      debug.error('Failed to get sound preload list!', e);
    });
}

var currentSong = null;
var currentSongName = null;


function onLoadResource(loader, resource) {
  // TODO add loading bar to game!
  debug('Loading resource: ' + resource.url);
}

var pixiLoaded = false;
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
    pixi.loader.load(function() {
      pixiLoaded = true;
    });
    var loadInterval = setInterval(function() {
      if (pixiLoaded && nHowls == 0) {
        debug('Completed assets.load(), firing callback');
        clearInterval(loadInterval);
        callback();
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
  playSound: function playSound(soundKey) {
    sounds[soundKey].play();
  },
  playMusic: function playMusic(songName) {
    if (songName != currentSongName) {
      this.stopMusic();
      currentSongName = songName;
      currentSong = sounds[songName];
      // TODO error on non-existent song
      currentSong.loop(true);
      currentSong.volume(0.1);
      currentSong.play();
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