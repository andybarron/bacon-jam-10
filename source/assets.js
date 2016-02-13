import * as debug from './debug';
import parse from './levels/parse';

import * as pixi from 'pixi.js';
import * as howler from "howler";
import naturalSort from 'javascript-natural-sort';
import * as qajax from 'qajax';

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

let levelList = null;
function beginLoadingLevels() {
  debug.print('Fetching level list');
  qajax.getJSON('/levels.json')
    .then(data => {
      debug.print('Got level list');
      levelList = data;
    })
    .catch(e => debug.error('Failed to load levels!', e));
}

export function load(callback) {
  debug.print('Loading assets...');
  beginLoadingLevels();
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
    if (levelList && pixiLoaded && nHowls == 0) {
      debug.print('Assets loaded!');
      clearInterval(loadInterval);
      callback();
    }
  }, 50);
}
export function cleanFrameId(id) {
  return id
    .replace(/^(\.{0,2}\/)?graphics\//, '')
    .replace(/\.[^/.]+$/, '');
}
export function texture(name) {
  return pixi.Texture.fromFrame(cleanFrameId(name));
}
export function sprite(name) {
  return pixi.Sprite.fromFrame(cleanFrameId(name));
}
export function tileSprite(name) {
  name = cleanFrameId(name);
  let regexEndDigits = /\d+$/;
  if (regexEndDigits.test(name)) {
    name = name.replace(regexEndDigits, '');
    return movieClip(name, {fps: 10});
  } else {
    return sprite(name);
  }
}
export function getLevelInfo(level) {
  if (typeof level == 'number') {
    return levelList[level];
  } else if (typeof level == 'string') {
    return levelList.find(info => info.id == level);
  } else {
    throw new Error("Invalid arg type for getLevelInfo: " + typeof level);
  }
}
export function movieClip(clipName, options) {
  clipName = cleanFrameId(clipName);
  let names = [];
  options = options || {};
  for (let texName in pixi.utils.TextureCache) {
    // check if texName starts with clipName and non-matching portion doesn't
    // contain '/' (no sub-clips)
    if (texName.startsWith(clipName) && !texName.slice(clipName.length).includes('/')) {
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