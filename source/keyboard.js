let keysDown = {};
let keysPressed = {};
let keysReleased = {};

window.addEventListener('keydown', function(e) {
  let keyCode = e.keyCode;

  if (!(keysDown[keyCode])) {
    keysPressed[keyCode] = true;  
  }

  keysDown[keyCode] = true;  
});

window.addEventListener('keyup', function(e) {
  let keyCode = e.keyCode;

  keysDown[keyCode] = false;
  keysReleased[keyCode] = true;
});

module.exports = {
  isKeyDown: function isKeyDown(keyCode) {
    return !!keysDown[keyCode];
  },
  isKeyPressed: function isKeyPressed(keyCode) {
    return !!keysPressed[keyCode];
  },
  isKeyReleased: function isKeyReleased(keyCode) {
    return !!keysReleased[keyCode];
  },
  update: function update() {
    keysPressed = {};
    keysReleased = {};
  },
  A: 65,
  D: 68,
  E: 69,
  M: 77,
  S: 83,
  W: 87,
  Q: 81,
  Z: 90,
  ESC: 27,
  SPACE: 32,
  RETURN: 13,
  LEFT: 37,
  RIGHT: 39,
  UP: 38,
  DOWN: 40,
  SHIFT: 16,
}