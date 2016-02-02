let keysDown = {};
let keysPressed = {};
let keysReleased = {};

window.addEventListener('keydown', e => {
  let keyCode = e.keyCode;

  if (!(keysDown[keyCode])) {
    keysPressed[keyCode] = true;  
  }

  keysDown[keyCode] = true;  
});

window.addEventListener('keyup', e => {
  let keyCode = e.keyCode;

  keysDown[keyCode] = false;
  keysReleased[keyCode] = true;
});

export function isKeyDown(keyCode) {
  return !!keysDown[keyCode];
}
export function isKeyPressed(keyCode) {
  return !!keysPressed[keyCode];
}
export function isKeyReleased(keyCode) {
  return !!keysReleased[keyCode];
}
export function update() {
  keysPressed = {};
  keysReleased = {};
}

export let A = 65;
export let D = 68;
export let E = 69;
export let M = 77;
export let S = 83;
export let W = 87;
export let Q = 81;
export let Z = 90;
export let ESC = 27;
export let SPACE = 32;
export let RETURN = 13;
export let LEFT = 37;
export let RIGHT = 39;
export let UP = 38;
export let DOWN = 40;
export let SHIFT = 16;
