let pixi = require('pixi.js');

let currmap = [];
let xpixlen = 50;
let ypixlen = 50;

let map1 = [0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,1,
            0,0,0,0,0,0,0,0,0,1,
            0,0,0,0,0,0,0,0,0,1,
            0,0,0,0,1,1,0,0,0,1,
            1,1,1,1,1,1,1,1,1,1,]

function Map(mapNum) {
  this.currmap = map1;
}

function setMap(mapNum){
  this.currmap = map1;
}

module.exports = Map;