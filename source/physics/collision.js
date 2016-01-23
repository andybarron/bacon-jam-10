var pixi = require('pixi.js');

module.exports = {
  getRectangleCenter: function getRectangleCenter(r) {
    return {
      x: r.x + r.width/2.0,
      y: r.y + r.height/2.0,
    };
  },
  getOverlap: function getOverlap(a, b) {
    var l = Math.max(a.x, b.x); // rightmost left
    var r = Math.min(a.x + a.width, b.x + b.width); // leftmost right
    var t = Math.max(a.y, b.y); // lowest top
    var b = Math.min(a.y + a.height, b.y + b.height); // highest bottom
    var result = null;
    if (r > l && b > t) {
      result = new pixi.Rectangle(l, t, r - l, b - t);
    }
    return result;
  }
  // TODO(andybarron): Implement sprite versions that call updateTransform() first!
}