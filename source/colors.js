module.exports = {
  // assume 0 <= r,g,b <= 1
  fromRgb: function fromRgb(r, g, b) {
    if (arguments.length == 3) {
      return ( (r * 255 | 0) << 16 ) |
          ( (g * 255 | 0) << 8 ) |
          ( (b * 255 | 0));
    } else if (arguments.length == 1) {
      var c = arguments[0];
      return this.fromRgb(c.r, c.g, c.b);
    } else {
      throw new Error("fromRgb(..) requires 1 or 3 args but received " + arguments.length);
    }
  },
  getRgb: function getRgb(colorInt) {
    var r = (colorInt >> 16) & 255;
    var g = (colorInt >> 8) & 255;
    var b = colorInt & 255;

    return {r: r/255, g: g/255, b: b/255};
  },
  lerp: function lerp(a, b, alpha) {
    var aMult = 1 - alpha;
    var bMult = alpha;
    var aComp = this.getRgb(a);
    var bComp = this.getRgb(b);
    return this.fromRgb(
      aComp.r * aMult + bComp.r * bMult,
      aComp.g * aMult + bComp.g * bMult,
      aComp.b * aMult + bComp.b * bMult
    );
  }
};