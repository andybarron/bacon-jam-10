var pixi = require('pixi.js');
var debug = require('./debug');
debug('Begin game setup!');


// TODO height/width or resizing to window
debug('Initializing renderer');
var render = new pixi.autoDetectRenderer(1280, 720);
debug('Adding view to DOM');
document.querySelector('#display-wrapper').appendChild(render.view);

debug('loading assets');
//var loader = pixi.loader;
pixi.loader
  .add([
    {name: 'avatar', url: "/graphics/space_guy.png"},
    {name: 'alien', url: "/graphics/alien.png"}
    ])
  .on("progress", loadProgressHandler)
  .load(finishedLoading);

function loadProgressHandler(loader, resource) {

  console.log("loading: " + resource.url);
}

function finishedLoading(){
  console.log("All assets loaded");

debug('Setting up animation loop');
var lastTime = Date.now();
var scene = null;
var MainGame = require('./scenes/MainGame');
scene = new MainGame();

// Starts playing the background music
scene.backgroundMusic.play();
console.log("Playing music");

var animate = function animate() {
  var time = Date.now();
  var delta = (time - lastTime) / 1000.0;
  lastTime = time;
  if (scene) {
    var currentScene = scene; // in case the scene is changed
    scene.update(delta);
    render.render(scene.getStage());
  }
  window.requestAnimationFrame(animate);
};
animate();
debug('End setup phase');
module.exports = {
  setScene: function setScene(nextScene) {
    scene = nextScene;
  },
};
}




