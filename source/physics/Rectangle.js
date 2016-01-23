
function Rectangle(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
};

Rectangle.prototype = {
  getCenter: function getCenter() {
    return {x: this.x + this.w/2.0, y: this.y + this.h/2.0};
  },
  getOverlap: function getOverlap(other) {
    // algorithm adapted from:
    // http://gamedev.stackexchange.com/questions/29786/a-simple-2d-rectangle-
    //   collision-algorithm-that-also-determines-which-sides-that
    var thisCenter = this.getCenter();
    var otherCenter = other.getCenter();
    var w = 0.5 * (this.w + other.w);
    var h = 0.5 * (this.h + other.h);
    var dx = thisCenter.x - otherCenter.x;
    var dy = thisCenter.y - otherCenter.y;
    var result = null;
    if (Math.abs(dx) <= w && Math.abs(dy) <= h) {
      
    }
    return result;
  },
};

module.exports = Rectangle;