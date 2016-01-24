var pixi = require('pixi.js');
var extend = require('../extend');
var PhysicsObject = require('../physics/PhysicsObject');
var keyboard = require('../keyboard');
var constants = require('../constants');
var assets = require('../assets');

function PlayerCharacter() {
  PhysicsObject.call(this, 0, 0, 50, 50);
  var sprite = assets.sprite('swishy_idle_1');
  this.setSprite(sprite, true);
}

extend(PhysicsObject, PlayerCharacter, {
  performActions: function performActions(delta) {
    // Jump action
    if (keyboard.isKeyDown(keyboard.W) && this.grounded) {
      this.grounded = false;
      this.velocity.y = -constants.PLAYER_JUMP_SPEED;
      // TODO play jump sound
    }

    // Movement
    if (keyboard.isKeyDown(keyboard.A)) {
      //Moving left, increase left velocity up to max
      if(this.velocity.x >= -constants.PLAYER_MAX_SPEED){
        this.velocity.x += -constants.PLAYER_ACCELERATION * delta;
      }
    }
    else if (keyboard.isKeyDown(keyboard.D)) {
      //Moving right, increase right velocity up to max
      if(this.velocity.x <= constants.PLAYER_MAX_SPEED){
        this.velocity.x += constants.PLAYER_ACCELERATION * delta;
      }
    }
    else
    {
      //Not moving, velocity moves closer to 0 until stop
      if(this.velocity.x > 0) {
        this.velocity.x += -constants.PLAYER_ACCELERATION * delta;
      }
      else if (this.velocity.x < 0){
        this.velocity.x += constants.PLAYER_ACCELERATION * delta;
      }
      if (Math.abs(this.velocity.x) < constants.PLAYER_ACCELERATION * delta) {
        this.velocity.x = 0; // IMPORTANT! prevents flipping back and forth at rest
      }
    }
  }
});

module.exports = PlayerCharacter;