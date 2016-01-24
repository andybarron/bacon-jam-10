var pixi = require('pixi.js');
var extend = require('../extend');
var BaseScene = require('./BaseScene');
var PhysicsObject = require('../physics/PhysicsObject');

function PhysicsTest() {
  BaseScene.call(this);
  this.objects = [];
  this.physGfx = new pixi.Graphics();
  this.world.addChild(this.physGfx);
  this.objects.push(new PhysicsObject(100, 100, 50, 50));
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
  self.physGfx.clear();
  self.objects.forEach(function(object) {
    object.updatePhysics(delta, self.platforms);
    self.physGfx.beginFill(0x00FFFF);
    self.physGfx.drawShape(object.bounds);
    self.physGfx.endFill();
  });
};

module.exports = PhysicsTest;