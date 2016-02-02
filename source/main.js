// add ES6 polyfills
require('babel-polyfill');

// remove global export from pixi
require('pixi.js');
delete window.PIXI;

require('howler');
delete window.Howler;
delete window.Howl;

// Load extension methods
require('./extensions');

// then actually do everything else
let StartScene = require('./scenes/MainMenuScene');
import gameLoop from './game-loop';
require('./assets').load(() => gameLoop(new StartScene()));