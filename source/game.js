var pixi = require('pixi.js');
var debug = require('./debug');
var constants = require('./constants');
var keyboard = require('./keyboard');
debug('Begin game setup!');


// TODO height/width or resizing to window
debug('Initializing renderer');
var render = new pixi.autoDetectRenderer(800, 600);
var scene = null;
debug('Adding view to DOM');
document.querySelector('#display-wrapper').appendChild(render.view);

debug('loading assets');
//var loader = pixi.loader;
pixi.loader
  .add([
    {name: 'avatar', url: "/graphics/space_guy.png"},
    {name: 'alien', url: "/graphics/alien.png"},
    {name: 'pause', url: "/graphics/text/pause.png"}
  ])
  .on("progress", loadProgressHandler)
  .load(finishedLoading);

function loadProgressHandler(loader, resource) {
  // TODO have a loading bar!
  debug("loading: " + resource.url);
}

function finishedLoading(){
  console.log("All assets loaded");
  debug('Setting up animation loop');
  var lastTime = Date.now();
  var MainGame = require('./scenes/MainGame');
  scene = new MainGame();

  // Starts playing the background music
  scene.backgroundMusic.play(); // TODO move to first update() call
  console.log("Playing music");

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
