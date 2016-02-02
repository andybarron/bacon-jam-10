// add ES6 polyfills
import 'babel-polyfill';

// remove global exports from modules
import 'pixi.js';
import 'howler';
delete window.PIXI;
delete window.Howler;
delete window.Howl;

// Load extension methods
import './extensions';

// then actually do everything else
import StartScene from './scenes/MainMenuScene';
import gameLoop from './game-loop';
import {load} from './assets';
load(() => gameLoop(new StartScene()));