module.exports = {};
var modules = ['collision', 'PhysicsObject'];
modules.forEach(function(mod) {
  module.exports[mod] = require('./' + mod);
});
// TODO test this :P