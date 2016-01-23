// remove global export from pixi
require('pixi.js');
delete window.PIXI;
// then actually do everything else
require('./game');