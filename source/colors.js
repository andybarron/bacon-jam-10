// assume 0 <= r,g,b <= 1
export function fromRgb(r, g, b) {
  if (arguments.length == 3) {
    return ( (r * 255 | 0) << 16 ) |
        ( (g * 255 | 0) << 8 ) |
        ( (b * 255 | 0));
  } else if (arguments.length == 1) {
    let c = arguments[0];
    return this.fromRgb(c.r, c.g, c.b);
  } else {
    throw new Error("fromRgb(..) takes 1 or 3 args but received " + arguments.length);
  }
}
export function getRgb(colorInt) {
  let r = (colorInt >> 16) & 255;
  let g = (colorInt >> 8) & 255;
  let b = colorInt & 255;

  return {r: r/255, g: g/255, b: b/255};
}
export function lerp(a, b, alpha) {
  let aMult = 1 - alpha;
  let bMult = alpha;
  let aComp = this.getRgb(a);
  let bComp = this.getRgb(b);
  return this.fromRgb(
    aComp.r * aMult + bComp.r * bMult,
    aComp.g * aMult + bComp.g * bMult,
    aComp.b * aMult + bComp.b * bMult
  );
}