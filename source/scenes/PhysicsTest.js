var pixi = require('pixi.js');
var extend = require('../extend');
var BaseScene = require('./BaseScene');
var PhysicsObject = require('../physics/PhysicsObject');
var PC = require('../objects/PlayerCharacter');

function PhysicsTest() {
  BaseScene.call(this);
  this.objects = [];
  this.physGfx = new pixi.Graphics();
  this.world.addChild(this.physGfx);
  this.player = new PC();
  this.player.setPosition(100, 100);
  this.objects.push(this.player);
  this.world.addChild(this.player.container);
  this.tileGfx = new pixi.Graphics();
  this.world.addChild(this.tileGfx);
  this.platforms = [
    new pixi.Rectangle(200, 400, 300, 100),
    new pixi.Rectangle(600, 350, 100, 100),
    new pixi.Rectangle(0, 550, 800, 100),
  ];
  var self = this;
  this.platforms.forEach(function(platform) {
    self.tileGfx.beginFill(0xFFFF00);
    self.tileGfx.drawShape(platform);
    self.tileGfx.endFill();
  });
}

extend(BaseScene, PhysicsTest);

PhysicsTest.prototype.update = function update(delta) {
  var self = this;
  self.player.performActions(delta);
  self.physGfx.clear();
  self.objects.forEach(function(object) {
    object.updatePhysics(delta, self.platforms);
    self.physGfx.beginFill(0x00FFFF);
    self.physGfx.drawShape(object.getBounds());
    self.physGfx.endFill();
  });
};

module.exports = PhysicsTest;