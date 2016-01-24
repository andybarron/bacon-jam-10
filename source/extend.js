module.exports = function extend(base, sub, extra) {
  sub.prototype = Object.create(base.prototype);
  sub.prototype.constructor = sub;
  if (!extra) return;
  for (var prop in extra) {
    sub.prototype[prop] = extra[prop];
  }
}