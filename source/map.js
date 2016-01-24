var pixi = require('pixi.js');

var currmap = [];
var xpixlen = 50;
var ypixlen = 50;

var map1 = [0,0,0,0,0,0,0,0,0,0,
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