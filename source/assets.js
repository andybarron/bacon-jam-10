let pixi = require('pixi.js');
let debug = require('./debug');
let howler = require("howler");
let naturalSort = require('javascript-natural-sort');
let qajax = require('qajax');

// TODO support array of paths for different codecs
let nHowls = -1;
function createHowl(cfg) {
  let path = cfg.urls.join(', ');
  debug('Loading audio: ' + path);
  nHowls++;
  cfg.onload = function() {
    nHowls--;
    debug('Completed audio: ' + path);
  }
  return new howler.Howl(cfg);
}

let sounds = {};

function beginLoadingSounds() {
  debug('Fetching sound preload list');
  qajax.getJSON('/sounds.json')
    .then(function(data) {
      debug('Got sound preload list, loading sounds');
      nHowls = 0;
      for (let soundKey in data) {
        let info = data[soundKey];
        sounds[soundKey] = createHowl({urls: info.urls});
      }
    })
    .catch(function(e) {
      debug.error('Failed to get sound preload list!', e);
    });
}

let currentSong = null;
let currentSongName = null;


function onLoadResource(loader, resource) {
  // TODO add loading bar to game!
  debug('Loading resource: ' + resource.url);
}

let pixiLoaded = false;
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
    let loadInterval = setInterval(function() {
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
    let names = [];
    options = options || {};
    for (let texName in pixi.utils.TextureCache) {
      // check if texName starts with clipName
      if (texName.lastIndexOf(clipName, 0) == 0) {
        names.push(texName);
      }
    }
    names.sort(naturalSort); // avoid numbering issues!
    let textures = names.map(this.texture, this);
    let clip = new pixi.extras.MovieClip(textures);
    for (let prop in options) {
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