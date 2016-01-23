var keysDown = {};

window.addEventListener('keydown', (e) => {
  var keyCode = e.keyCode;

  keysDown[keyCode] = true;
});

window.addEventListener('keyup', (e) => {
  var keyCode = e.keyCode;

  keysDown[keyCode] = false;
});

module.exports = {
  isKeyDown: function isKeyDown(keyCode) {
    return !!keysDown[keyCode];
  },
  W: 87,
  A: 65,
  S: 83,
  D: 68,
}