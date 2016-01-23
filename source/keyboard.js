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
  W: 87,
  A: 65,
  S: 83,
  D: 68,
  ESC: 27,
}