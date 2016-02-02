require('./extensions');
let pixi = require('pixi.js');
let debug = require('./debug');
let constants = require('./constants');
let keyboard = require('./keyboard');
let assets = require('./assets');
debug('Begin game setup!');

debug('Initializing renderer');
let render = new pixi.autoDetectRenderer(800, 600, {
  transparent: false,
});
let scene = null;

let display = {
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
  bounds: new pixi.Rectangle(0,0,0,0),
};
display.center = display.middleCenter;
let scale = 2;

let game = module.exports = {
  display: display,
  timeScale: 1, // change this for e.g. slow-mo
  getScale: function getScale() {
    return scale;
  },
  setScale: function setScale(s) {
    scale = s;
    resizeRenderer();
  },
  screenPixelsFromWorld: function screenPixelsFromWorld(n) {
    return n * scale;
  },
  worldPixelsFromScreen: function worldPixelsFromScreen(n) {
    return n / scale;
  },
  worldRectFromScreen: function worldRectFromScreen(r) {
    let box = r.clone();
    box.x /= scale;
    box.y /= scale;
    box.width /= scale;
    box.height /= scale;
    return box;
  },
}

function resizeRenderer() {
  let rw = document.documentElement.clientWidth;
  let rh = document.documentElement.clientHeight;
  let w = rw / scale;
  let h = rh / scale;
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
  display.bounds.width = w;
  display.bounds.height = h;
  render.resize(rw, rh);
  if (scene) {
    scene.container.scale = new pixi.Point(scale, scale);
    scene.resize(w, h);
  }
}

// Load Assets
debug('Loading assets...');
assets.load(finishedLoading);

function finishedLoading(){
  debug("...All assets loaded!");

  debug('Adding view to DOM');
  let wrapper = document.querySelector('#display-wrapper');
  wrapper.innerHTML = '';
  wrapper.appendChild(render.view);

  debug('Adding resize listener');
  window.addEventListener('resize', resizeRenderer);

  resizeRenderer();

  debug('Setting up animation loop');

  let lastTime = performance.now();
  let MainMenuScene = require('./scenes/MainMenuScene');
  scene = new MainMenuScene();
  // TODO move scene init stuff to a separate method and call it here...
  //      code dupe is bad!!!
  render.backgroundColor = scene.backgroundColor;
  scene.initialize();
  resizeRenderer();

  // Animate the Screen
  let animate = function animate() {
    let time = performance.now();
    let delta = Math.min( (time - lastTime) / 1000.0, constants.MAX_DELTA );
    delta *= game.timeScale;
    pixi.ticker.shared.speed = game.timeScale;
    lastTime = time;
    if (scene) {
      let nextScene = scene.update(delta);
      render.render(scene.getStage());
      if (nextScene && (nextScene != scene)) {
        scene.dispose();
        render.backgroundColor = nextScene.backgroundColor;
        nextScene.initialize();
        scene = nextScene;
        resizeRenderer();
      }
    }
    keyboard.update();
    window.requestAnimationFrame(animate);
  };
  animate();
  debug('End setup phase');
}
