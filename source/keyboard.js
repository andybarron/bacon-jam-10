var keysDown = {};
var keysPressed = {};
var keysReleased = {};

window.addEventListener('keydown', (e) => {
  var keyCode = e.keyCode;

  if (!(keysDown[keyCode])) {
    keysPressed[keyCode] = true;  
  }

  keysDown[keyCode] = true;  
});

window.addEventListener('keyup', (e) => {
  var keyCode = e.keyCode;

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
  S: 83,
  W: 87,
  ESC: 27,
}