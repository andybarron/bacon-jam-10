var levels = {
  tutorial1: require('./tutorial1.js'),
  tutorial2: require('./tutorial2.js'),
  tutorial3: require('./tutorial3.js'),
}

levels.first = levels.tutorial1;

module.exports = levels;