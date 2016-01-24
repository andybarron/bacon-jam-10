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

// Load Assets
debug('loading assets');
pixi.loader
  .add([
    {name: 'avatar', url: "/graphics/space_guy.png"},
    {name: 'alien', url: "/graphics/alien.png"},
    {name: 'pause', url: "/graphics/text/pause.png"},
    {name: 'swishy_attack_1', url: "/graphics/swishy/attack/sprite_1.png"},
    {name: 'swishy_attack_2', url: "/graphics/swishy/attack/sprite_2.png"},
    {name: 'swishy_attack_3', url: "/graphics/swishy/attack/sprite_3.png"},
    {name: 'swishy_attack_4', url: "/graphics/swishy/attack/sprite_4.png"},
    {name: 'swishy_attack_5', url: "/graphics/swishy/attack/sprite_5.png"},
    {name: 'swishy_attack_6', url: "/graphics/swishy/attack/sprite_6.png"},
    {name: 'swishy_attack_7', url: "/graphics/swishy/attack/sprite_7.png"},
    {name: 'swishy_attack_8', url: "/graphics/swishy/attack/sprite_8.png"},
    {name: 'swishy_idle_1', url: "/graphics/swishy/idle/sprite_1.png"},
    {name: 'swishy_idle_2', url: "/graphics/swishy/idle/sprite_2.png"},
    {name: 'swishy_idle_3', url: "/graphics/swishy/idle/sprite_3.png"},
    {name: 'swishy_idle_4', url: "/graphics/swishy/idle/sprite_4.png"},
    {name: 'swishy_idle_5', url: "/graphics/swishy/idle/sprite_5.png"},
    {name: 'swishy_idle_6', url: "/graphics/swishy/idle/sprite_6.png"},
    {name: 'swishy_idle_7', url: "/graphics/swishy/idle/sprite_7.png"},
    {name: 'swishy_idle_8', url: "/graphics/swishy/idle/sprite_8.png"},
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
  var StartScene = require('./scenes/MainGame');
  scene = new StartScene();

  // Starts playing the background music
  scene.backgroundMusic.play(); // TODO move to first update() call
  console.log("Playing music");

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
