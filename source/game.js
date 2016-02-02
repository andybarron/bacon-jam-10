import {Point, Rectangle, ticker} from 'pixi.js';

export let delta = 0.0;
export let scale = 2;
export let timeScale = 1;
export let display = {
  topLeft: new Point(),
  topCenter: new Point(),
  topRight: new Point(),
  middleLeft: new Point(),
  middleCenter: new Point(),
  middleRight: new Point(),
  bottomLeft: new Point(),
  bottomCenter: new Point(),
  bottomRight: new Point(),
  width: 0,
  height: 0,
  bounds: new Rectangle(0,0,0,0),
};
display.center = display.middleCenter;
export function updateDisplayDimensions(w, h) {
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
}
export function screenPixelsFromWorld(n) {
  return n * scale;
}
export function worldPixelsFromScreen(n) {
  return n / scale;
}
export function worldRectFromScreen(r) {
  let box = r.clone();
  box.x /= scale;
  box.y /= scale;
  box.width /= scale;
  box.height /= scale;
  return box;
}
export function animationSpeedFromFps(fps) {
  return fps / ticker.shared.FPS;
}
export function fpsFromAnimationSpeed(speed) {
  return speed * ticker.shared.FPS;
}