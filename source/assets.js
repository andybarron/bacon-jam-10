import * as debug from './debug';

import * as pixi from 'pixi.js';
import * as howler from "howler";
import naturalSort from 'javascript-natural-sort';
import * as qajax from 'qajax';

// TODO support array of paths for different codecs
let nHowls = -1;
function createHowl(cfg) {
  let path = cfg.urls.join(', ');
  debug.print('Loading audio: ' + path);
  nHowls++;
  cfg.onload = function() {
    nHowls--;
    debug.print('Completed audio: ' + path);
  }
  return new howler.Howl(cfg);
}

let sounds = {};

function beginLoadingSounds() {
  debug.print('Fetching sound preload list');
  qajax.getJSON('/sounds.json')
    .then(function(data) {
      debug.print('Got sound preload list, loading sounds');
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
  debug.print('Loading resource: ' + resource.url);
}

let pixiLoaded = false;


export function load(callback) {
  debug.print('Loading assets...');
  beginLoadingSounds();
  pixi.loader.add(['/static/atlas.json']);
  pixi.loader.on('progress', onLoadResource);
  pixi.loader.after(function(resource, next) {
    if (resource && resource.texture && resource.texture.baseTexture) {
      resource.texture.baseTexture.scaleMode = pixi.SCALE_MODES.NEAREST;
    }
    debug.print('Completed resource: ' + resource.url);
    next();
  });
  pixi.loader.load(function() {
    pixiLoaded = true;
  });
  let loadInterval = setInterval(function() {
    if (pixiLoaded && nHowls == 0) {
      debug.print('Assets loaded!');
      clearInterval(loadInterval);
      callback();
    }
  }, 50);
}
export function texture(name) {
  return pixi.Texture.fromFrame(name);
}
export function sprite(name) {
  return pixi.Sprite.fromFrame(name);
}
export function movieClip(clipName, options) {
  let names = [];
  options = options || {};
  for (let texName in pixi.utils.TextureCache) {
    // check if texName starts with clipName
    if (texName.lastIndexOf(clipName, 0) == 0) {
      names.push(texName);
    }
  }
  names.sort(naturalSort); // avoid numbering issues!
  let textures = names.map(texture);
  let clip = new pixi.extras.MovieClip(textures);
  for (let prop in options) {
    clip[prop] = options[prop];
  }
  return clip;
}
export function playSound(soundKey) {
  sounds[soundKey].play();
}
export function playMusic(songName) {
  if (songName != currentSongName) {
    stopMusic();
    currentSongName = songName;
    currentSong = sounds[songName];
    // TODO error on non-existent song
    currentSong.loop(true);
    currentSong.volume(0.1);
    currentSong.play();
  }
}
export function stopMusic() {
  if (currentSong) {
    currentSong.stop();
    currentSong = null;
    currentSongName = null;
  }
}