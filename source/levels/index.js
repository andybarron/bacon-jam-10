var levels = {
  tutorial1: require('./tutorial1.js'),
  tutorial2: require('./tutorial2.js'),
  tutorial3: require('./tutorial3.js'),
  tutorial4: require('./tutorial4.js'),
  tutorial5: require('./tutorial5.js'),
}

levels.first = levels.tutorial1;
levels.list = [];
var currentLevel = levels.first;
while (currentLevel) {
  levels.list.push(currentLevel);
  currentLevel = levels[currentLevel.next];
}

window.levels = levels;
module.exports = levels;