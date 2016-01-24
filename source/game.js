var pixi = require('pixi.js');
var debug = require('./debug');
var constants = require('./constants');
var keyboard = require('./keyboard');
var assets = require('./assets');
debug('Begin game setup!');

// TODO height/width or resizing to window
debug('Initializing renderer');
var render = new pixi.autoDetectRenderer(800, 600);
var scene = null;

debug('Adding view to DOM');
document.querySelector('#display-wrapper').appendChild(render.view);

// Load Assets
debug('loading assets');
assets.load(finishedLoading);

function finishedLoading(){
  console.log("All assets loaded");
  debug('Setting up animation loop');

  var lastTime = Date.now();
  var StartScene = require('./scenes/MainMenuScene');
  scene = new StartScene();

  // Animate the Screen
  var animate = function animate() {
    var time = Date.now();
    var delta = Math.min( (time - lastTime) / 1000.0, constants.MAX_DELTA );
    lastTime = time;
    if (scene) {
      var currentScene = scene; // in case the scene is changed
      scene.update(delta);
      render.render(scene.getStage());
    }
    keyboard.update();
    window.requestAnimationFrame(animate);
  };
  animate();
  debug('End setup phase');
}

module.exports = {
  setScene: function setScene(nextScene) {
    scene = nextScene;
  },
};
