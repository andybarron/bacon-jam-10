module.exports = {
  getRectangleCenter: function getRectangleCenter(r) {
    return {
      x: r.x + r.width;
      y: r.y + r.height;
    };
  },
  getOverlap: function getOverlap(a, b) {
    // algorithm adapted from:
    // http://gamedev.stackexchange.com/questions/29786/a-simple-2d-rectangle-
    //   collision-algorithm-that-also-determines-which-sides-that
    var aCenter = this.getCenter();
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
}