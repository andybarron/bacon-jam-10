// TODO disable when debug mode is off
// TODO separate exports
module.exports = console.log.bind(console, '[Debug]');
module.exports.error = function error(msg, e) {
  alert(msg);
  module.exports('[Error]', msg);
  if (e) {
    module.exports('[Exception]', e);
  }
}