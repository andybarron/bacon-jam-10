function TileGrid(width, height, empty) {
  this._w = width;
  this._h = height;
  this.grid = [];
  if (typeof empty == 'undefined') {
    empty = null;
  }
  this.empty = empty;
  for (var tx = 0; tx < width; tx++) {
    var column = [];
    column.length = height;
    column.fill(empty);
    this.grid.push(column);
  }
}

// TODO refactor coordinate resolution into its own method?
TileGrid.prototype = {
  get: function get(x, y) {
    if (arguments.length == 2) {
      if (x >= 0 && x < this._w && y >= 0 && y < this._h) {
        return this.grid[x][y];
      } else {
        return this.empty;
      }
    } else if (arguments.length == 1) {
      var point = x;
      return this.get(point.x, point.y);
    } else {
      throw new Error("TileGrid#get() requires 1 or 2 arguments, got " + arguments.length);
    }
  },
  set: function set(x, y, value) {
    if (arguments.length == 3) {
      if (x >= 0 && x < this._w && y >= 0 && y < this._h) {
        this.grid[x][y] = value;
      } // TODO what to do if setting invalid coords?
    } else if (arguments.length == 2) {
      var point = arguments[0];
      var value = arguments[1];
      return this.set(value, point.x, point.y);
    } else {
      throw new Error("TileGrid#set() requires 2 or 3 arguments, got " + arguments.length);
    }
  },
  getWidth: function getWidth() {
    return this._w;
  },
  getHeight: function getHeight() {
    return this._h;
  },
}

module.exports = TileGrid;