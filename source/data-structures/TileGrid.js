// TODO maybe use an ES6 Map?
class TileGrid {
  constructor(width, height, empty = null) {
    this._w = width;
    this._h = height;
    this.grid = [];
    this.empty = empty;
    for (let tx = 0; tx < width; tx++) {
      let column = [];
      column.length = height;
      column.fill(empty);
      this.grid.push(column);
    }
  }
  // TODO refactor coordinate resolution into its own method?
  get(x, y) {
    if (arguments.length == 2) {
      if (x >= 0 && x < this._w && y >= 0 && y < this._h) {
        return this.grid[x][y];
      } else {
        return this.empty;
      }
    } else if (arguments.length == 1) {
      let point = x;
      return this.get(point.x, point.y);
    } else {
      throw new Error("TileGrid#get() takes 1 or 2 arguments, got " + arguments.length);
    }
  }
  set(x, y, value) {
    if (arguments.length == 3) {
      if (x >= 0 && x < this._w && y >= 0 && y < this._h) {
        this.grid[x][y] = value;
      } // TODO what to do if setting invalid coords?
    } else if (arguments.length == 2) {
      let point = arguments[0];
      let value = arguments[1];
      return this.set(value, point.x, point.y);
    } else {
      throw new Error("TileGrid#set() requires 2 or 3 arguments, got " + arguments.length);
    }
  }
  getWidth() {
    return this._w;
  }
  getHeight() {
    return this._h;
  }
}

export default TileGrid;