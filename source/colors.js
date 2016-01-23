module.exports = {
  // assume 0 <= r,g,b <= 1
  fromRgb: function fromRgb(r, g, b) {
    return ( (r * 255 | 0) << 16 ) |
        ( (g * 255 | 0) << 8 ) |
        ( (b * 255 | 0));
  },
};