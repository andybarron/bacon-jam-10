// remove global export from pixi
require('pixi.js');
delete window.PIXI;

require('howler');
delete window.Howler;
delete window.Howl;

// then actually do everything else
require('./game');