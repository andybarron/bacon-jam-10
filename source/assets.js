var pixi = require('pixi.js');
var debug = require('./debug');
var howler = require("howler");

var sprites = [
  {name: 'avatar', url: "/graphics/space_guy.png"},
  {name: 'alien', url: "/graphics/alien.png"},
  {name: 'pause', url: "/graphics/text/pause.png"},
  {name: 'tile_1', url: "/graphics/tiles/tile1.png"},
  {name: 'console', url: "/graphics/tiles/console.png"},
  {name: 'tile_2', url: "/graphics/tiles/tile2.png"},
  {name: 'spill', url: "/graphics/spill.png"},
  {name: 'heart', url: "/graphics/hp.png"},
  {name: 'empty_heart', url: "/graphics/losthp.png"},
  {name: 'title', url: '/graphics/text/title.png'},
  {name: 'clear', url: '/graphics/text/clear.png'},
];

var sounds = {
  player: {
    'jump': new howler.Howl({ urls: ['../audio/jump/jump.wav'], volume: 0.33 }),
    'attack': new howler.Howl({ urls: ['../audio/towelattack/towelhit.wav'] }),
    'attackHit': new howler.Howl({ urls: ['../audio/hit/hit_hurt5.wav'] }),
    'fly': new howler.Howl({ urls: ['../audio/flying.mp3'] }),
    'hide': new howler.Howl({ urls: ['../audio/hiding.mp3'] }),
    'ouch': new howler.Howl({ urls: ['../audio/ouch.mp3'] })
  }
}

var currentSong = null;
var currentSongName = null;
var music = {
  gameplaySong: new howler.Howl({urls: ['../audio/towel_game.mp3'],loop: true, volume: 0.5}),
}

function addAnimationSet(name, url, start, end) {
  for (var i = start; i <= end; i++) {
    sprites.push({name: name.replace('#', i), url: url.replace('#', i)});
  }
}

addAnimationSet('towel_attack_#', '/graphics/swishy/attack/l0_sprite_#.png', 1, 8);
addAnimationSet('swishy_idle_#', '/graphics/swishy/idle/sprite_#.png', 1, 8);
addAnimationSet('swishy_jump_#', '/graphics/swishy/jumping/sprite_#.png', 1, 3);
addAnimationSet('swishy_glide_#', '/graphics/swishy/float/sprite_#.png', 1, 1);
addAnimationSet('swishy_run_#', '/graphics/swishy/running/sprite_#.png', 1, 12);

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