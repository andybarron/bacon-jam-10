import * as assets from '../assets';
import TileGrid from '../data-structures/TileGrid';
import {TILE_SIZE} from '../constants';
import {Rectangle, Point} from 'pixi.js';

function findLayer(name, layerList) {
  return layerList.find((l) => l.name == name);
}

function boundsFromTiledObject(box) {
  return new Rectangle(box.x, box.y, box.width, box.height);
}

function tileCoordsFromRect(rect) {
  let center = rect.getCenter();
  let tileX = Math.floor(center.x / TILE_SIZE);
  let tileY = Math.floor(center.y / TILE_SIZE);
  return new Point(tileX, tileY);
}

function tileCoordsFromPoint() {
  if (arguments.length == 2) {
    let [x, y] = arguments;
    let tileX = Math.floor(x / TILE_SIZE);
    let tileY = Math.floor(y / TILE_SIZE);
    return new Point(tileX, tileY);
  } else if (arguments.length == 1) {
    let {x, y} = arguments[0];
    return tileCoordsFromPoint(x, y);
  } else {
    throw new Error('Wrong #args for tileCoordsFromPoint');
  }
}

function tileBoundsFromRect(rect) {
  let tc = tileCoordsFromRect(rect);
  let x = tc.x * TILE_SIZE;
  let y = tc.y * TILE_SIZE;
  return new Rectangle(x, y, TILE_SIZE, TILE_SIZE);
}

function tileCoordsFromLayer(layerName, levelData, fullExtent = false) {
  let list = [];
  let layer = findLayer(layerName, levelData.layers);
  if (layer) {
    for (let object of layer.objects) {
      let ob = boundsFromTiledObject(object);
      if (fullExtent) {
        let minTile = tileCoordsFromPoint(ob.x, ob.y);
        let maxTile = tileCoordsFromPoint(ob.x + ob.width, ob.y + ob.height);
        for (let tx = minTile.x; tx <= maxTile.x; tx++) {
          for (let ty = minTile.y; ty <= maxTile.y; ty++) {
            list.push(new Point(tx, ty));
          }
        }
      } else {
        list.push(tileCoordsFromPoint(ob.getCenter()));
      }
    }
  }
  return list;
}

function tileCenterFromCoords(p) {
  console.log(p);
  return new Point(
    p.x * TILE_SIZE + TILE_SIZE/2,
    p.y * TILE_SIZE + TILE_SIZE/2);
}

function tileBoundsFromCoords(p) {
  return new Rectangle(
    p.x * TILE_SIZE,
    p.y * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE);
}

export default function(data) {
  // first, load tiles
  let tileset = data.tilesets[0];
  let tileOffset = tileset.firstgid;
  let tileMap = data.tilesets[0].tiles;
  let tileSprites = [];
  let layers = data.layers;
  let grid = new TileGrid(data.width, data.height, false);
  let tileLayer = findLayer('tiles', layers);
  tileLayer.data.forEach((tileId, i) => {
    tileId -= tileOffset;
    let x = i % grid.getWidth();
    let y = Math.floor(i / grid.getWidth());
    let collide = tileId in tileMap;
    if (collide) {
      grid.set(x, y, true);
      let sprite = assets.sprite(tileMap[tileId].image);
      sprite.x = x * TILE_SIZE;
      sprite.y = y * TILE_SIZE;
      tileSprites.push(sprite);
    }
  });
  // load player position
  let pObj = findLayer('player', layers).objects[0];
  let pBox = new Rectangle(pObj.x, pObj.y, pObj.width, pObj.height);
  let pBoxCenter = pBox.getCenter();
  let pTileX = Math.floor(pBoxCenter.x / TILE_SIZE);
  let pTileY = Math.floor(pBoxCenter.y / TILE_SIZE);
  let playerCenter = new Point( // TODO bottom instead of center .. ?
    pTileX * TILE_SIZE + TILE_SIZE / 2,
    pTileY * TILE_SIZE + TILE_SIZE / 2);
  // load consoles
  let consoleList = [];
  let consoleLayer = findLayer('consoles', layers);
  if (consoleLayer) {
    let consoleObjects = consoleLayer.objects;
    for (let obj of consoleObjects) {
      let cons = {
        bounds: tileBoundsFromRect(boundsFromTiledObject(obj)),
        text: obj.properties.text,
      };
      consoleList.push(cons);
    }
  }
  // load currents
  let fanCurrentBoundsList =
    tileCoordsFromLayer('currents', data, true)
    .map(tileBoundsFromCoords);
  // load enemies
  console.log(enemyCenterList);
  let enemyCenterList =
    tileCoordsFromLayer('enemies', data)
    .map((c) => {console.log(c); return c})
    .map(tileCenterFromCoords);
  console.log('#enemies:', enemyCenterList.length);
  // load exit position
  let exitObj = findLayer('exit', layers).objects[0];
  let exitBounds = tileBoundsFromRect(boundsFromTiledObject(exitObj));
  // return data
  return {
    grid,
    tileSprites,
    playerCenter,
    exitBounds,
    consoleList,
    fanCurrentBoundsList,
    enemyCenterList,
  };
}