var pixi = require('pixi.js');
var debug = require('./debug');
var constants = require('./constants');
var keyboard = require('./keyboard');
var assets = require('./assets');
debug('Begin game setup!');

debug('Initializing renderer');
var render = new pixi.autoDetectRenderer(800, 600, {
  transparent: false,
});
var scene = null;

var display = {
  topLeft: new pixi.Point(),
  topCenter: new pixi.Point(),
  topRight: new pixi.Point(),
  middleLeft: new pixi.Point(),
  middleCenter: new pixi.Point(),
  middleRight: new pixi.Point(),
  bottomLeft: new pixi.Point(),
  bottomCenter: new pixi.Point(),
  bottomRight: new pixi.Point(),
  width: 0,
  height: 0,
};
display.center = display.middleCenter;

function resizeRenderer() {
  var w = document.documentElement.clientWidth;
  var h = document.documentElement.clientHeight;
  display.topLeft.set(0, 0);
  display.topCenter.set(w/2, 0);
  display.topRight.set(w, 0);
  display.middleLeft.set(0, h/2);
  display.middleCenter.set(w/2, h/2);
  display.middleRight.set(w, h/2);
  display.bottomLeft.set(0, h);
  display.bottomCenter.set(w/2, h);
  display.bottomRight.set(w, h);
  display.width = w;
  display.height = h;
  render.resize(w, h);
  if (scene) {
    scene.resize(w, h);
  }
}

window.addEventListener('resize', resizeRenderer);

resizeRenderer();

debug('Adding view to DOM');
document.querySelector('#display-wrapper').appendChild(render.view);

// Load Assets
debug('loading assets');
assets.load(finishedLoading);

function finishedLoading(){
  debug("All assets loaded");
  debug('Setting up animation loop');

  var lastTime = Date.now();
  var MainMenuScene = require('./scenes/MainMenuScene');
  scene = new MainMenuScene();
  // TODO move scene init stuff to a separate method and call it here...
  //      code dupe is bad!!!
  render.backgroundColor = scene.backgroundColor;
  scene.initialize();
  scene.resize(display.width, display.height);

  // Animate the Screen
  var animate = function animate() {
    var time = Date.now();
    var delta = Math.min( (time - lastTime) / 1000.0, constants.MAX_DELTA );
    lastTime = time;
    if (scene) {
      var nextScene = scene.update(delta);
      render.render(scene.getStage());
      if (nextScene && (nextScene != scene)) {
        scene.dispose();
        render.backgroundColor = nextScene.backgroundColor;
        nextScene.initialize();
        nextScene.resize(display.width, display.height);
        scene = nextScene;
      }
    }
    keyboard.update();
    window.requestAnimationFrame(animate);
  };
  animate();
  debug('End setup phase');
}

module.exports = {
  display: display,
}