// TODO disable when debug mode is off
module.exports = console.log.bind(console, '[Debug]');
module.exports.error = function error(msg) {
  alert(msg);
  module.exports('ERROR: ', msg);
}