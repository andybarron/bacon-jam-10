import {Point, autoDetectRenderer, ticker} from 'pixi.js';
import {update as updateKeyboard} from './keyboard';
import * as debug from './debug';
import * as game from './game';
import * as assets from './assets';
import * as constants from './constants';

let render = null;
let scene = null;

function resizeRenderer() {
  let scale = game.scale;
  let rw = document.documentElement.clientWidth;
  let rh = document.documentElement.clientHeight;
  let w = rw / scale;
  let h = rh / scale;
  game.updateDisplayDimensions(w, h);
  render.resize(rw, rh);
  if (scene) {
    scene.container.scale = new Point(scale, scale);
    scene.resize(w, h);
  }
}

function setScene(nextScene) {
  if (scene) {
    scene.dispose();
  }
  if (nextScene) {
    nextScene.initialize();
  }
  scene = nextScene;
  resizeRenderer();
}

export default function gameLoop(startScene) {
  debug.print('Initializing renderer');
  render = new autoDetectRenderer(100, 100, {
    transparent: false,
  });
  debug.print("Adding view to DOM");
  let wrapper = document.querySelector('#display-wrapper');
  wrapper.innerHTML = '';
  wrapper.appendChild(render.view);
  debug.print("Setting up resize listener");
  window.addEventListener('resize', resizeRenderer);
  debug.print("Sizing renderer");
  resizeRenderer();
  debug.print("Initializing game loop");
  let lastTime = performance.now();
  let lastScale = game.scale;
  setScene(startScene);
  function animate(time = performance.now()) {
    let delta = Math.min( (time - lastTime) / 1000.0, constants.MAX_DELTA );
    lastTime = time;
    delta *= game.timeScale;
    ticker.shared.speed = game.timeScale;
    game.delta = delta;
    if (scene) {
      let nextScene = scene.update(delta);
      if (game.scale != lastScale) {
        resizeRenderer();
        lastScale = game.scale;
      }
      render.backgroundColor = scene.backgroundColor || 0x000000;
      render.render(scene.getStage());
      if (nextScene && nextScene != scene) {
        setScene(nextScene);
      }
      updateKeyboard();
      // TODO use polyfill
      window.requestAnimationFrame(animate);
    }
  }
  animate();
  debug.print('Game loop setup complete!');
}